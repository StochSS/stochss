try:
  import json
except ImportError:
  from django.utils import simplejson as json
import logging
import traceback
from collections import OrderedDict
from Queue import Queue
import __future__

from stochssapp import BaseHandler
from stochss.model import *


class ParameterEditorPage(BaseHandler):

    def authentication_required(self):
        return True
        
    def get(self):
        all_parameters = self.get_all_parameters()

        if all_parameters is not None:
            self.render_response('modeleditor/parametereditor.html', **all_parameters)
        else:
            self.render_response('modeleditor/parametereditor.html')

    def post(self):
        
        if self.request.get('update') == "1":
            result = self.update_parameters()
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(result))
            
        elif self.request.get('delete') == "1":
            result = self.delete_parameter()
            all_parameters = self.get_all_parameters()
            if all_parameters is not None:
                result = dict(result, **all_parameters)

            self.render_response('modeleditor/parametereditor.html', **result)
                
        else:
            result = self.create_parameter()
            all_parameters = self.get_all_parameters()
            if all_parameters is not None:
                result = dict(result, **all_parameters)

            self.render_response('modeleditor/parametereditor.html', **result)

    def get_all_parameters(self):
        """
        Get all the parameters belonging to the currently edited model.
        This model must be in cache.
        """
        model = self.get_session_property('model_edited')
        if model is None:
            return None

        return {'all_parameters': model.getAllParameters()}

    def delete_parameter(self):
        """
        Delete the given parameter from the current model.
        """        
        name = self.request.get('toDelete')
        try:
            model = self.get_session_property('model_edited')
            model.deleteParameter(name)

            # Update the cache
            self.set_session_property('model_edited', model)
            self.set_session_property('is_model_saved', False)
            return {'status': True, 'msg': 'Parameter ' + name + ' deleted successfully!'}
        except Exception, e:
            logging.error("parameter::delete_parameter: Parameter deletion failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'There was an error while deleting the parameter.'}

    def create_parameter(self):
        name = self.request.get('name').strip()
        expression = self.request.get('expression').strip()

        error = self.check_input(name, expression)
        if error is not None:
            logging.error(error)
            error.update({'name': name, 'expression': expression})
            return error

        try:
            model = self.get_session_property('model_edited')

            if model is None:
                return {'status': False, 'msg': 'You have not selected any model to edit.'}

            all_parameters = model.getAllParameters()

            # Check if the parameter already exists
            if name in all_parameters:
                return {'status': False, 'msg': 'Parameter already exists!', 'name': name, 'expression': expression}

            # Check if the user has tried to manually add a Volume parameter
            if name.lower() == 'volume':
                return {'status': False, 'msg': 'Model editor does not allow Volume parameter set here, please use the Volume tab above', 'name': name, 'expression': expression}

            namespace = OrderedDict()
            for param in all_parameters:
                namespace[param] = all_parameters[param].value

            try:                
                value = float(eval(compile(expression, '<string>', 'eval', __future__.division.compiler_flag), namespace))
                logging.debug("value after evaluation: " + str(value))
            except Exception, e:
                logging.error('Error evaluating the expression %s for parameter %s', expression, name)
                return {'status': False, 'msg': 'Error evaluating the expression ' + expression + ' for parameter ' + name, 'name': name, 'expression': expression}

            parameter = Parameter(name, expression, value)
            
            model.addParameter(parameter)

            # Update the cache
            self.set_session_property('model_edited', model)
            self.set_session_property('is_model_saved', False)
            return {'status': True, 'msg': 'Parameter added successfully!'}
        except Exception, e:
            logging.error("parameter::create_parameter: Parameter creation failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'There was an error while creating the parameter.'}


    def check_input(self, name, expression):
        """
        Check to see if the input for species creation/updation is valid
        """
        if not name:
            return {'status': False, 'msg': 'Parameter name is missing.'}

        if not expression:
            return {'status': False, 'msg': 'Expression for parameter ' + name + ' is missing.'}

        # return None if there are no errors
        return None


    def update_parameters(self):
        """
        Update the parameters with new values.
        """
        try:
            model = self.get_session_property('model_edited')
            all_parameters = model.getAllParameters()

            # Add the updated values afresh. i.e. The old values will be erased.
            new_parameter_list = []
            namespace = OrderedDict()

            """
            dict that would contain the mapping between the names of the parameter in the form and the new values.
            This would be used in the client side for modifying the 'values' column after receiving the response.
            """
            new_parameter_values = {}
            
            """ 
            Queue that would contain all expressions that cannot be evaluated. 
            It is done so that the expressions of parameters that refer to parameters that are below it in the UI are evaluated correctly.
            The queue will be processed until all the elements are evaluated or until none of the elements are evaluated correctly.            
            """
            eval_queue = Queue()
            expression_evaluated = False
            
            index = 1
            for key in all_parameters.keys():
                # This param will have the name of the parameter.
                new_name = self.request.get(str(index) + "-name")
                # The param will have the expression associated with that key (parameter name).
                new_expression = self.request.get(str(index) + "-expression")

                # Check to see if there are any errors in the input parameter
                error = self.check_input(new_name, new_expression)
                if error is not None:
                    logging.error(error)
                    return error

                if new_name in namespace:
                    return {'status': False, 'msg': 'Parameter ' + new_name + " already exists."}
                
                if self.eval_expression(namespace, EvalParameter(new_name, new_expression, index), eval_queue, new_parameter_list, new_parameter_values):
                    expression_evaluated = True
                
                index += 1
            
            # If at least one expression has been evaluated correctly
            if expression_evaluated:
                expression_evaluated = False
                queue_size = eval_queue.qsize()
                # Process the expressions in the queue
                while not eval_queue.empty():
                    # When all the items have been evaluated and if none of them were evaluated correctly, break and report an error.
                    if queue_size == 0:
                        if not expression_evaluated:
                            break
                        else: # Otherwise if at least one of them was evaluated correctly, re-run this loop until all of them are evaluated or none of them are evaluated correctly.
                            queue_size = eval_queue.qsize()
                            expression_evaluated = False
                        
                    queue_size -= 1
                    eval_parameter = eval_queue.get()
                    
                    if self.eval_expression(namespace, eval_parameter, eval_queue, new_parameter_list, new_parameter_values):
                        expression_evaluated = True
                    
                                            
            # If the eval queue is still not empty, one or more expressions are invalid.
            if not eval_queue.empty():
                # Get the first eval_parameter from the queue and report it as invalid.
                eval_parameter = eval_queue.get()
                return {'status': False, 'msg': 'Error evaluating expression ' + eval_parameter.expression + " for parameter " + eval_parameter.name}
                    
            # Delete the old values
            model.deleteAllParameters()
            # Add the modified parameter list back to the model
            model.addParameter(new_parameter_list)
            # Update the cache
            self.set_session_property('model_edited', model)
            self.set_session_property('is_model_saved', False)
            return {'status': True, 'msg': 'Parameter updated successfully!', 'new_parameter_values': new_parameter_values}
        
        except Exception, e:
            logging.error("parameter::update_parameter: Updating of Parameter failed with error %s", e)
            traceback.print_exc()
            return {'status': False, 'msg': 'There was an error while updating the parameter.'}

    
    def eval_expression(self, namespace, eval_parameter, eval_queue, new_parameter_list, new_parameter_values):
        try:
            logging.debug("expression " + eval_parameter.expression)
            new_value = float(eval(compile(eval_parameter.expression, '<string>', 'eval', __future__.division.compiler_flag), namespace))
            # Update the namespace
            namespace[eval_parameter.name] = new_value
            logging.debug("new value " + str(new_value))
            parameter = Parameter(eval_parameter.name, eval_parameter.expression, new_value)
            new_parameter_list.append(parameter)
            new_parameter_values[str(eval_parameter.index) + "-value"] = parameter.value
            return True            
            
        except Exception, e:
            # When the expression cannot be evaluated, just add the eval_parameter back to the queue as it might get evaluated correctly when one or more of the remaining items are evaluated.
            eval_queue.put(EvalParameter(eval_parameter.name, eval_parameter.expression, eval_parameter.index))
            logging.debug('Expression %s for parameter %s added to queue', eval_parameter.expression, eval_parameter.name)
            return False


class EvalParameter:
    """
    Class to store the parameter info that is needed for evaluation.
    """
    def __init__(self, name, expression, index):
        # The new name of the parameter
        self.name = name
        # The new expression of the parameter
        self.expression = expression
        # The index that corresponds the order of the parameter in the UI. This is needed to update the parameter value in the UI
        self.index = index
    
    
            
