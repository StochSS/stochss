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

class VolumeEditorPage(BaseHandler):

    def authentication_required(self):
        return True
    
    def get(self):
        """
        Get all the parameters belonging to the currently edited model.
        This model must be in cache.
        """
        model = self.get_session_property('model_edited')

        if model is not None and model.volume is not None:
            output = { 'volume' : model.volume.expression }
            self.render_response('modeleditor/volumeeditor.html', **output )
        else:
            self.render_response('modeleditor/volumeeditor.html')

    def post(self):
        result = self.update_volume()

        model = self.get_session_property('model_edited')

        result['volume'] = model.volume.expression
        if model is not None and model.volume is not None:
            self.render_response('modeleditor/volumeeditor.html', **result)
        else:
            self.render_response('modeleditor/volumeeditor.html', **result)

    def update_volume(self):
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

            try:                
                value = float(eval(compile(expression, '<string>', 'eval', __future__.division.compiler_flag)))
                logging.debug("value after evaluation: " + str(value))
            except Exception, e:
                logging.error('Error evaluating the expression %s for parameter %s', expression, name)
                return {'status': False, 'msg': 'Error evaluating the expression ' + expression + ' for parameter ' + name, 'name': name, 'expression': expression}

            model.volume = Parameter(name, expression, value)

            # Update the cache
            self.set_session_property('model_edited', model)
            self.set_session_property('is_model_saved', False)
            return {'status': True, 'msg': 'Volume set successfully!'}
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
    
    
            
