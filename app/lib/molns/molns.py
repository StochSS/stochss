#!/usr/bin/env python
import os
import re
import sys
from MolnsLib.molns_datastore import Datastore, DatastoreException, VALID_PROVIDER_TYPES, get_provider_handle
from MolnsLib.molns_provider import ProviderException
from collections import OrderedDict
import subprocess
from MolnsLib.ssh_deploy import SSHDeploy
import multiprocessing
import json
from collections import OrderedDict

import logging
###############################################
class MOLNSException(Exception):
    pass

###############################################
class MOLNSConfig(Datastore):
    def __init__(self, config_dir=None, db_file=None):
        Datastore.__init__(self,config_dir=config_dir, db_file=db_file)
    
    def __str__(self):
        return "MOLNSConfig(config_dir={0})".format(self.config_dir)

###############################################
class MOLNSbase():
    @classmethod
    def merge_config(self, obj, config):
        for key, conf, value in obj.get_config_vars():
            if key not in config:
                if value is not None:
                    myval = value
                else:
                    if 'default' in conf and conf['default']:
                        if callable(conf['default']):
                            f1 = conf['default']
                            try:
                                myval = f1(obj)
                            except TypeError:
                                myval = None
                        else:
                            myval = conf['default']
                    else:
                        myval = None
                obj.config[key] = myval
            else:
                obj.config[key] = config[key]

    @classmethod
    def _get_workerobj(cls, args, config):
        # Name
        worker_obj = None
        if len(args) > 0:
            worker_name = args[0]
            # Get worker db object
            try:
                worker_obj = config.get_object(name=worker_name, kind='WorkerGroup')
            except DatastoreException:
                worker_obj = None
            #logging.debug("controller_obj {0}".format(controller_obj))
            if worker_obj is None:
                print "worker group '{0}' is not initialized, use 'molns worker setup {0}' to initialize the controller.".format(worker_name)
        else:
            print "No worker name specified, please specify a name"
        return worker_obj

    @classmethod
    def _get_controllerobj(cls, args, config):
        # Name
        if len(args) > 0:
            controller_name = args[0]
        else:
            raise MOLNSException("No controller name given")
        # Get controller db object
        try:
            controller_obj = config.get_object(name=controller_name, kind='Controller')
        except DatastoreException:
            controller_obj = None
        #logging.debug("controller_obj {0}".format(controller_obj))
        if controller_obj is None:
            raise MOLNSException("controller '{0}' is not initialized, use 'molns controller setup {0}' to initialize the controller.".format(controller_name))
        return controller_obj

class MOLNSController(MOLNSbase):
    @classmethod
    def controller_export(cls, args, config):
        """ Export the configuration of a controller. """
        if len(args) < 1:
            raise MOLNSException("USAGE: molns controller export name [Filename]\n"\
                "\tExport the data from the controller with the given name.")
        controller_name = args[0]
        if len(args) > 1:
            filename = args[1]
        else:
            filename = 'Molns-Export-Controller-' + controller_name + '.json'
        # check if provider exists
        try:
            controller_obj = config.get_object(controller_name, kind='Controller')
        except DatastoreException as e:
            raise MOLNSException("provider not found")
        data = {'name': controller_obj.name,
                'provider_name': controller_obj.provider.name,
                'config': controller_obj.config}
        return {'data': json.dumps(data),
                'type': 'file',
                'filename': filename}

    @classmethod
    def controller_import(cls, args, config, json_data=None):
        """ Import the configuration of a controller. """
        if json_data is None:
            if len(args) < 1:
                raise MOLNSException("USAGE: molns controller import [Filename.json]\n"\
                    "\Import the data from the controller with the given name.")
            filename = args[0]
            with open(filename) as fd:
                data = json.load(fd)
        else:
            data = json_data
        controller_name = data['name']
        msg = ''
        try:
            provider_obj = config.get_object(data['provider_name'], kind='Provider')
        except DatastoreException as e:
            raise MOLNSException("unknown provider '{0}'".format(data['provider_name']))
        try:
            controller_obj = config.get_object(controller_name, kind='Controller')
            msg += "Found existing controller\n"
            if controller_obj.provider.name != provider_obj.name:
                raise MOLNSException("Import data has provider '{0}'.  Controller {1} exists with provider {2}. provider conversion is not possible.".format(data['provider_name'], controller_obj.name, controller_obj.provider.name))
        except DatastoreException as e:
            controller_obj = config.create_object(ptype=provider_obj.type, name=controller_name, kind='Controller', provider_id=provider_obj.id)
            msg += "Creating new controller\n"
        cls.merge_config(controller_obj, data['config'])
        config.save_object(controller_obj, kind='Controller')
        msg += "Controller data imported\n"
        return {'msg':msg}

    @classmethod
    def controller_get_config(cls, name=None, provider_type=None, config=None):
        """ Return a list of dict of config var for the controller config.
            Each dict in the list has the keys: 'key', 'value', 'type'
            
            Either 'name' or 'provider_type' must be specified.
            If 'name' is specified, then it will retreive the value from that
            config and return it in 'value' (or return the string '********'
            if that config is obfuscated, such passwords).
            
        """
        if config is None:
            raise MOLNSException("no config specified")
        if name is None and provider_type is None:
            raise MOLNSException("Controller name or provider type must be specified")
        obj = None
        if obj is None and name is not None:
            try:
                obj = config.get_object(name, kind='Controller')
            except DatastoreException as e:
                pass
        if obj is None and provider_type is not None:
            if provider_type not in VALID_PROVIDER_TYPES:
                raise MOLNSException("Unknown provider type '{0}'".format(provider_type))
            p_hand = get_provider_handle('Controller',provider_type)
            obj = p_hand('__tmp__',data={},config_dir=config.config_dir)
        if obj is None:
            raise MOLNSException("Controller {0} not found".format(name))

        ret = []
        for key, conf, value in obj.get_config_vars():
            if 'ask' in conf and not conf['ask']:
                continue
            question = conf['q']
            if value is not None:
                myval = value
            else:
                if 'default' in conf and conf['default']:
                    if callable(conf['default']):
                        f1 = conf['default']
                        try:
                            myval = f1()
                        except TypeError:
                            pass
                    else:
                        myval = conf['default']
                else:
                    myval = None
            if myval is not None and 'obfuscate' in conf and conf['obfuscate']:
                myval = '********'
            ret.append({
                'question':question,
                'key':key,
                'value': myval,
                'type':'string'
            })
        return ret

    @classmethod
    def setup_controller(cls, args, config):
        """Setup a controller.  Set the provider configuration for the head node.  Use 'worker setup' to set the configuration for worker nodes
        """
        logging.debug("MOLNSController.setup_controller(config={0})".format(config))
        # name
        if len(args) > 0:
            controller_name = args[0]
        else:
            print "Usage: molns.py controller setup NAME"
            return
        try:
            controller_obj = config.get_object(args[0], kind='Controller')
        except DatastoreException as e:
            # provider
            providers = config.list_objects(kind='Provider')
            if len(providers)==0:
                print "No providers configured, please configure one ('molns provider setup') before initializing controller."
                return
            print "Select a provider:"
            for n,p in enumerate(providers):
                print "\t[{0}] {1}".format(n,p.name)
            provider_ndx = int(raw_input_default("enter the number of provider:", default='0'))
            provider_id = providers[provider_ndx].id
            provider_obj = config.get_object(name=providers[provider_ndx].name, kind='Provider')
            logging.debug("using provider {0}".format(provider_obj))
            # create object
            try:
                controller_obj = config.create_object(ptype=provider_obj.type, name=controller_name, kind='Controller', provider_id=provider_id)
            except DatastoreException as e:
                print e
                return
        setup_object(controller_obj)
        config.save_object(controller_obj, kind='Controller')

    @classmethod
    def list_controller(cls, args, config):
        """ List all the currently configured controllers."""
        controllers = config.list_objects(kind='Controller')
        if len(controllers) == 0:
            return {'msg':"No controllers configured"}
        else:
            table_data = []
            for c in controllers:
                try:
                    p = config.get_object_by_id(c.provider_id, 'Provider')
                    provider_name = p.name
                except DatastoreException as e:
                    provider_name = 'ERROR: {0}'.format(e)
                table_data.append([c.name, provider_name])
            return {'type':'table','column_names':['name', 'provider'], 'data':table_data}
    
    @classmethod
    def show_controller(cls, args, config):
        """ Show all the details of a controller config. """
        if len(args) == 0:
            raise MOLNSException("USAGE: molns controller show name")
        return {'msg':str(config.get_object(name=args[0], kind='Controller'))}

    @classmethod
    def delete_controller(cls, args, config):
        """ Delete a controller config. """
        #print "MOLNSProvider.delete_provider(args={0}, config={1})".format(args, config)
        if len(args) == 0:
            raise MOLNSException("USAGE: molns cluser delete name")
        config.delete_object(name=args[0], kind='Controller')

    @classmethod
    def ssh_controller(cls, args, config):
        """ SSH into the controller. """
        logging.debug("MOLNSController.ssh_controller(args={0})".format(args))
        controller_obj = cls._get_controllerobj(args, config)
        if controller_obj is None: return
        # Check if any instances are assigned to this controller
        instance_list = config.get_controller_instances(controller_id=controller_obj.id)
        #logging.debug("instance_list={0}".format(instance_list))
        # Check if they are running
        ip = None
        if len(instance_list) > 0:
            for i in instance_list:
                status = controller_obj.get_instance_status(i)
                logging.debug("instance={0} has status={1}".format(i, status))
                if status == controller_obj.STATUS_RUNNING:
                    ip = i.ip_address
        if ip is None:
            raise MOLNSException("No active instance for this controller")
        #print " ".join(['/usr/bin/ssh','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(),'ubuntu@{0}'.format(ip)])
        #os.execl('/usr/bin/ssh','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(),'ubuntu@{0}'.format(ip))
        cmd = ['/usr/bin/ssh','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(),'ubuntu@{0}'.format(ip)]
        print " ".join(cmd)
        subprocess.call(cmd)
        print "SSH process completed"

    @classmethod
    def upload_controller(cls, args, config):
        """ Copy a local file to the controller's home directory. """
        logging.debug("MOLNSController.upload_controller(args={0})".format(args))
        controller_obj = cls._get_controllerobj(args, config)
        if controller_obj is None: return
        # Check if any instances are assigned to this controller
        instance_list = config.get_controller_instances(controller_id=controller_obj.id)
        #logging.debug("instance_list={0}".format(instance_list))
        # Check if they are running
        ip = None
        if len(instance_list) > 0:
            for i in instance_list:
                status = controller_obj.get_instance_status(i)
                logging.debug("instance={0} has status={1}".format(i, status))
                if status == controller_obj.STATUS_RUNNING:
                    ip = i.ip_address
        if ip is None:
            raise MOLNSException("No active instance for this controller")
        #print " ".join(['/usr/bin/ssh','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(),'ubuntu@{0}'.format(ip)])
        #os.execl('/usr/bin/ssh','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(),'ubuntu@{0}'.format(ip))
        cmd = ['/usr/bin/scp','-r','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(), args[1], 'ubuntu@{0}:/home/ubuntu/'.format(ip)]
        print " ".join(cmd)
        subprocess.call(cmd)
        print "SCP process completed"

    @classmethod
    def put_controller(cls, args, config):
        """ Copy a local file to the controller's and workers' shared area. """
        logging.debug("MOLNSController.put_controller(args={0})".format(args))
        controller_obj = cls._get_controllerobj(args, config)
        if controller_obj is None: return
        # Check if any instances are assigned to this controller
        instance_list = config.get_controller_instances(controller_id=controller_obj.id)
        #logging.debug("instance_list={0}".format(instance_list))
        # Check if they are running
        ip = None
        if len(instance_list) > 0:
            for i in instance_list:
                status = controller_obj.get_instance_status(i)
                logging.debug("instance={0} has status={1}".format(i, status))
                if status == controller_obj.STATUS_RUNNING:
                    ip = i.ip_address
        if ip is None:
            raise MOLNSException("No active instance for this controller")
        #print " ".join(['/usr/bin/ssh','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(),'ubuntu@{0}'.format(ip)])
        #os.execl('/usr/bin/ssh','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(),'ubuntu@{0}'.format(ip))
        cmd = ['/usr/bin/scp','-oStrictHostKeyChecking=no','-oUserKnownHostsFile=/dev/null','-i',controller_obj.provider.sshkeyfilename(), args[1], 'ubuntu@{0}:/home/ubuntu/shared'.format(ip)]
        print " ".join(cmd)
        subprocess.call(cmd)
        print "SSH process completed"
        

    @classmethod
    def is_controller_running(cls, args, config):
        logging.debug("MOLNSController.is_controller_running(args={0})".format(args))
        if len(args) > 0:
            try:
                controller_obj = cls._get_controllerobj(args, config)
            except MOLNSException:
                return {}
            if controller_obj is None: return False
            # Check if any instances are assigned to this controller
            instance_list = config.get_controller_instances(controller_id=controller_obj.id)
            if len(instance_list) > 0:
                for i in instance_list:
                    status = controller_obj.get_instance_status(i)
                    if status == controller_obj.get_instance_status.STATUS_RUNNING:
                        return True

            return False
        

    @classmethod
    def status_controller(cls, args, config):
        """ Get status of the head node of a MOLNs controller. """
        logging.debug("MOLNSController.status_controller(args={0})".format(args))
        if len(args) > 0:
            try:
                controller_obj = cls._get_controllerobj(args, config)
            except MOLNSException:
                return {}
            if controller_obj is None: return {}
            # Check if any instances are assigned to this controller
            instance_list = config.get_controller_instances(controller_id=controller_obj.id)
            table_data = []
            if len(instance_list) > 0:
                for i in instance_list:
                    #provider_name = config.get_object_by_id(i.provider_id, 'Provider').name
                    try:
                        p = config.get_object_by_id(i.provider_id, 'Provider')
                        provider_name = p.name
                    except DatastoreException as e:
                        provider_name = 'ERROR: {0}'.format(e)
                    controller_name = config.get_object_by_id(i.controller_id, 'Controller').name
                    status = controller_obj.get_instance_status(i)
                    table_data.append([controller_name, status, 'controller', provider_name, i.provider_instance_identifier, i.ip_address])

            else:
                return {'msg': "No instance running for this controller"}
            # Check if any worker instances are assigned to this controller
            instance_list = config.get_worker_instances(controller_id=controller_obj.id)
            if len(instance_list) > 0:
                for i in instance_list:
                    worker_name = config.get_object_by_id(i.worker_group_id, 'WorkerGroup').name
                    worker_obj = cls._get_workerobj([worker_name], config)
                    #provider_name = config.get_object_by_id(i.provider_id, 'Provider').name
                    try:
                        p = config.get_object_by_id(i.provider_id, 'Provider')
                        provider_name = p.name
                    except DatastoreException as e:
                        provider_name = 'ERROR: {0}'.format(e)
                    status = worker_obj.get_instance_status(i)
                    table_data.append([worker_name, status, 'worker', provider_name, i.provider_instance_identifier, i.ip_address])
            #table_print(['name','status','type','provider','instance id', 'IP address'],table_data)
            r = {'type':'table', 'column_names':['name','status','type','provider','instance id', 'IP address'], 'data':table_data}
            return r
        else:
            instance_list = config.get_all_instances()
            if len(instance_list) > 0:
                table_data = []
                for i in instance_list:
                    provider_name = config.get_object_by_id(i.provider_id, 'Provider').name
                    controller_name = config.get_object_by_id(i.controller_id, 'Controller').name
                    if i.worker_group_id is not None:
                        worker_name = config.get_object_by_id(i.worker_group_id, 'WorkerGroup').name
                        table_data.append([worker_name, 'worker', provider_name, i.provider_instance_identifier])
                    else:
                        table_data.append([controller_name, 'controller', provider_name, i.provider_instance_identifier])

                r = {'type':'table', 'column_names':['name','type','provider','instance id'], 'data':table_data}
                r['msg']= "\n\tUse 'molns status NAME' to see current status of each instance."
                return r
            else:
                return {'msg': "No instance found"}


    @classmethod
    def start_controller(cls, args, config, password=None, openWebBrowser=True, reserved_cpus=2):
        """ Start the MOLNs controller. """
        logging.debug("MOLNSController.start_controller(args={0})".format(args))
        controller_obj = cls._get_controllerobj(args, config)
        if controller_obj is None: return
        # Check if any instances are assigned to this controller
        instance_list = config.get_all_instances(controller_id=controller_obj.id)
        # Check if they are running or stopped (if so, resume them)
        inst = None
        if len(instance_list) > 0:
            for i in instance_list:
                status = controller_obj.get_instance_status(i)
                if status == controller_obj.STATUS_RUNNING:
                    print "controller already running at {0}".format(i.ip_address)
                    return
                elif status == controller_obj.STATUS_STOPPED:
                    print "Resuming instance at {0}".format(i.ip_address)
                    controller_obj.resume_instance(i)
                    inst = i
                    break
        if inst is None:
            # Start a new instance
            print "Starting new controller"
            inst = controller_obj.start_instance()
        # deploying
        sshdeploy = SSHDeploy(config=controller_obj.provider, config_dir=config.config_dir)
        sshdeploy.deploy_ipython_controller(inst.ip_address, notebook_password=password, reserved_cpus=reserved_cpus)
        sshdeploy.deploy_molns_webserver(inst.ip_address, openWebBrowser=openWebBrowser)
        #sshdeploy.deploy_stochss(inst.ip_address, port=443)

    @classmethod
    def stop_controller(cls, args, config):
        """ Stop the head node of a MOLNs controller. """
        logging.debug("MOLNSController.stop_controller(args={0})".format(args))
        controller_obj = cls._get_controllerobj(args, config)
        if controller_obj is None: return
        # Check if any instances are assigned to this controller
        instance_list = config.get_all_instances(controller_id=controller_obj.id)
        # Check if they are running
        if len(instance_list) > 0:
            for i in instance_list:
                if i.worker_group_id is None:
                    status = controller_obj.get_instance_status(i)
                    if status == controller_obj.STATUS_RUNNING:
                        print "Stopping controller running at {0}".format(i.ip_address)
                        controller_obj.stop_instance(i)
                else:
                    worker_name = config.get_object_by_id(i.worker_group_id, 'WorkerGroup').name
                    worker_obj = cls._get_workerobj([worker_name], config)
                    status = worker_obj.get_instance_status(i)
                    if status == worker_obj.STATUS_RUNNING or status == worker_obj.STATUS_STOPPED:
                        print "Terminating worker '{1}' running at {0}".format(i.ip_address, worker_name)
                        worker_obj.terminate_instance(i)
    
        else:
            print "No instance running for this controller"


    @classmethod
    def terminate_controller(cls, args, config):
        """ Terminate the head node of a MOLNs controller. """
        logging.debug("MOLNSController.terminate_controller(args={0})".format(args))
        controller_obj = cls._get_controllerobj(args, config)
        if controller_obj is None: return
        instance_list = config.get_all_instances(controller_id=controller_obj.id)
        logging.debug("\tinstance_list={0}".format([str(i) for i in instance_list]))
        # Check if they are running or stopped 
        if len(instance_list) > 0:
            for i in instance_list:
                if i.worker_group_id is None:
                    status = controller_obj.get_instance_status(i)
                    if status == controller_obj.STATUS_RUNNING or status == controller_obj.STATUS_STOPPED:
                        print "Terminating controller running at {0}".format(i.ip_address)
                        controller_obj.terminate_instance(i)
                else:
                    worker_name = config.get_object_by_id(i.worker_group_id, 'WorkerGroup').name
                    worker_obj = cls._get_workerobj([worker_name], config)
                    status = worker_obj.get_instance_status(i)
                    if status == worker_obj.STATUS_RUNNING or status == worker_obj.STATUS_STOPPED:
                        print "Terminating worker '{1}' running at {0}".format(i.ip_address, worker_name)
                        worker_obj.terminate_instance(i)


        else:
            print "No instance running for this controller"

    @classmethod
    def connect_controller_to_local(cls, args, config):
        """ Connect a local iPython installation to the controller. """
        logging.debug("MOLNSController.connect_controller_to_local(args={0})".format(args))
        if len(args) != 2:
            print "USAGE: molns local-connect controller_name profile_name"
            return
        controller_name = args[1]
        profile_name = args[1]
        logging.debug("connecting controller {0} to local ipython profile {1}".format(controller_name, profile_name))
        controller_obj = cls._get_controllerobj(args, config)
        if controller_obj is None: return
        # Check if any instances are assigned to this controller
        instance_list = config.get_all_instances(controller_id=controller_obj.id)
        # Check if they are running
        inst = None
        if len(instance_list) > 0:
            for i in instance_list:
                status = controller_obj.get_instance_status(i)
                if status == controller_obj.STATUS_RUNNING:
                    print "Connecting to controller at {0}".format(i.ip_address)
                    inst = i
                    break
        if inst is None:
            print "No instance running for this controller"
            return
        # deploying
        sshdeploy = SSHDeploy(config=controller_obj.provider, config_dir=config.config_dir)
        client_file_data = sshdeploy.get_ipython_client_file(inst.ip_address)
        home_dir = os.environ.get('HOME')
        ipython_client_filename = os.path.join(home_dir, '.ipython/profile_{0}/'.format(profile_name), 'security/ipcontroller-client.json')
        logging.debug("Writing file {0}".format(ipython_client_filename))
        with open(ipython_client_filename, 'w') as fd:
            fd.write(client_file_data)
        print "Success"


###############################################

class MOLNSWorkerGroup(MOLNSbase):
    @classmethod
    def worker_group_export(cls, args, config):
        """ Export the configuration of a worker group. """
        if len(args) < 1:
            raise MOLNSException("USAGE: molns worker export name [Filename]\n"\
                "\tExport the data from the worker group with the given name.")
        worker_name = args[0]
        if len(args) > 1:
            filename = args[1]
        else:
            filename = 'Molns-Export-Worker-' + worker_name + '.json'
        # check if provider exists
        try:
            worker_obj = config.get_object(worker_name, kind='WorkerGroup')
        except DatastoreException as e:
            raise MOLNSException("worker group not found")
        data = {'name': worker_obj.name,
                'provider_name': worker_obj.provider.name,
                'controller_name': worker_obj.controller.name,
                'config': worker_obj.config}
        return {'data': json.dumps(data),
                'type': 'file',
                'filename': filename}

    @classmethod
    def worker_group_import(cls, args, config, json_data=None):
        """ Import the configuration of a worker group. """
        if json_data is None:
            if len(args) < 1:
                raise MOLNSException("USAGE: molns worker import [Filename.json]\n"\
                    "\Import the data from the worker with the given name.")
            filename = args[0]
            with open(filename) as fd:
                data = json.load(fd)
        else:
            data = json_data
        worker_name = data['name']
        msg = ''
        try:
            provider_obj = config.get_object(data['provider_name'], kind='Provider')
        except DatastoreException as e:
            raise MOLNSException("unknown provider '{0}'".format(data['provider_name']))
        try:
            controller_obj = config.get_object(data['controller_name'], kind='Controller')
        except DatastoreException as e:
            raise MOLNSException("unknown controller '{0}'".format(data['provider_name']))
        try:
            worker_obj = config.get_object(worker_name, kind='WorkerGroup')
            msg += "Found existing worker group\n"
            if worker_obj.provider.name != provider_obj.name:
                raise MOLNSException("Import data has provider '{0}'.  Worker group {1} exists with provider {2}. provider conversion is not possible.".format(data['provider_name'], worker_obj.name, worker_obj.provider.name))
            if worker_obj.controller.name != controller_obj.name:
                raise MOLNSException("Import data has controller '{0}'.  Worker group {1} exists with controller {2}. provider conversion is not possible.".format(data['controller_name'], worker_obj.name, worker_obj.controller.name))
        except DatastoreException as e:
            worker_obj = config.create_object(ptype=provider_obj.type, name=worker_name, kind='WorkerGroup', provider_id=provider_obj.id, controller_id=controller_obj.id)
            msg += "Creating new worker group\n"
        cls.merge_config(worker_obj, data['config'])
        config.save_object(worker_obj, kind='WorkerGroup')
        msg += "Worker group data imported\n"
        return {'msg':msg}

    @classmethod
    def worker_group_get_config(cls, name=None, provider_type=None, config=None):
        """ Return a list of dict of config var for the worker group config.
            Each dict in the list has the keys: 'key', 'value', 'type'
            
            Either 'name' or 'provider_type' must be specified.
            If 'name' is specified, then it will retreive the value from that
            config and return it in 'value' (or return the string '********'
            if that config is obfuscated, such passwords).
            
        """
        if config is None:
            raise MOLNSException("no config specified")
        if name is None and provider_type is None:
            raise MOLNSException("'name' or 'provider_type' must be specified.")
        obj = None
        if obj is None and name is not None:
            try:
                obj = config.get_object(name, kind='WorkerGroup')
            except DatastoreException as e:
                pass
        if obj is None and provider_type is not None:
            if provider_type not in VALID_PROVIDER_TYPES:
                raise MOLNSException("Unknown provider type '{0}'".format(provider_type))
            p_hand = get_provider_handle('WorkerGroup',provider_type)
            obj = p_hand('__tmp__',data={},config_dir=config.config_dir)
        if obj is None:
            raise MOLNSException("Worker group {0} not found".format(name))
        ret = []
        for key, conf, value in obj.get_config_vars():
            if 'ask' in conf and not conf['ask']:
                continue
            question = conf['q']
            if value is not None:
                myval = value
            else:
                if 'default' in conf and conf['default']:
                    if callable(conf['default']):
                        f1 = conf['default']
                        try:
                            myval = f1()
                        except TypeError:
                            pass
                    else:
                        myval = conf['default']
                else:
                    myval = None
            if myval is not None and 'obfuscate' in conf and conf['obfuscate']:
                myval = '********'
            ret.append({
                'question':question,
                'key':key,
                'value': myval,
                'type':'string'
            })
        return ret
    
    @classmethod
    def setup_worker_groups(cls, args, config):
        """ Configure a worker group. """
        logging.debug("MOLNSWorkerGroup.setup_worker_groups(config={0})".format(config))
        # name
        if len(args) == 0:
            print "USAGE: molns worker setup name"
            return
        group_name = args[0]
        try:
            worker_obj = config.get_object(args[0], kind='WorkerGroup')
        except DatastoreException as e:
            # provider
            providers = config.list_objects(kind='Provider')
            if len(providers)==0:
                print "No providers configured, please configure one ('molns provider setup') before initializing worker group."
                return
            print "Select a provider:"
            for n,p in enumerate(providers):
                print "\t[{0}] {1}".format(n,p.name)
            provider_ndx = int(raw_input_default("enter the number of provider:", default='0'))
            provider_id = providers[provider_ndx].id
            provider_obj = config.get_object(name=providers[provider_ndx].name, kind='Provider')
            logging.debug("using provider {0}".format(provider_obj))
            # controller
            controllers = config.list_objects(kind='Controller')
            if len(controllers)==0:
                print "No controllers configured, please configure one ('molns controller setup') before initializing worker group."
                return
            print "Select a controller:"
            for n,p in enumerate(controllers):
                print "\t[{0}] {1}".format(n,p.name)
            controller_ndx = int(raw_input_default("enter the number of controller:", default='0'))
            controller_id = controllers[controller_ndx].id
            controller_obj = config.get_object(name=controllers[controller_ndx].name, kind='Controller')
            logging.debug("using controller {0}".format(controller_obj))
            # create object
            try:
                worker_obj = config.create_object(ptype=provider_obj.type, name=group_name, kind='WorkerGroup', provider_id=provider_id, controller_id=controller_obj.id)
            except DatastoreException as e:
                print e
                return
        setup_object(worker_obj)
        config.save_object(worker_obj, kind='WorkerGroup')

    @classmethod
    def list_worker_groups(cls, args, config):
        """ List all the currently configured worker groups."""
        groups = config.list_objects(kind='WorkerGroup')
        if len(groups) == 0:
            raise MOLNSException("No worker groups configured")
        else:
            table_data = []
            for g in groups:
                #provider_name = config.get_object_by_id(g.provider_id, 'Provider').name
                try:
                    p = config.get_object_by_id(g.provider_id, 'Provider')
                    provider_name = p.name
                except DatastoreException as e:
                    provider_name = 'ERROR: {0}'.format(e)
                try:
                    c = config.get_object_by_id(g.controller_id, 'Controller')
                    controller_name = c.name
                except DatastoreException as e:
                    controller_name = 'ERROR: {0}'.format(e)
                table_data.append([g.name, provider_name, controller_name])
            return {'type':'table','column_names':['name', 'provider', 'controller'], 'data':table_data}

    @classmethod
    def show_worker_groups(cls, args, config):
        """ Show all the details of a worker group config. """
        if len(args) == 0:
            raise MOLNSException("USAGE: molns worker show name")
            return
        return {'msg': str(config.get_object(name=args[0], kind='WorkerGroup'))}

    @classmethod
    def delete_worker_groups(cls, args, config):
        """ Delete a worker group config. """
        if len(args) == 0:
            raise MOLNSException("USAGE: molns worker delete name")
            return
        config.delete_object(name=args[0], kind='WorkerGroup')

    @classmethod
    def status_worker_groups(cls, args, config):
        """ Get status of the workers of a MOLNs cluster. """
        logging.debug("MOLNSWorkerGroup.status_worker_groups(args={0})".format(args))
        if len(args) > 0:
            worker_obj = cls._get_workerobj(args, config)
            if worker_obj is None: return
            # Check if any instances are assigned to this worker
            instance_list = config.get_all_instances(worker_group_id=worker_obj.id)
            # Check if they are running or stopped 
            if len(instance_list) > 0:
                table_data = []
                for i in instance_list:
                    status = worker_obj.get_instance_status(i)
                    #print "{0} type={3} ip={1} id={2}".format(status, i.ip_address, i.provider_instance_identifier, worker_obj.PROVIDER_TYPE)
                    worker_name = config.get_object_by_id(i.worker_group_id, 'WorkerGroup').name
                    provider_name = config.get_object_by_id(i.provider_id, 'Provider').name
                    status = worker_obj.get_instance_status(i)
                    table_data.append([worker_name, status, 'worker', provider_name, i.provider_instance_identifier, i.ip_address])
                return {'type':'table','column_names':['name','status','type','provider','instance id', 'IP address'],'data':table_data}
            else:
                return {'msg': "No worker instances running for this cluster"}
        else:
            raise MOLNSException("USAGE: molns worker status NAME")

    @classmethod
    def start_worker_groups(cls, args, config):
        """ Start workers of a MOLNs cluster. """
        logging.debug("MOLNSWorkerGroup.start_worker_groups(args={0})".format(args))
        worker_obj = cls._get_workerobj(args, config)
        if worker_obj is None: return
        num_vms = worker_obj['num_vms']
        num_vms_to_start = int(num_vms)
        controller_ip = cls.__launch_workers__get_controller(worker_obj, config)
        if controller_ip is None: return
        #logging.debug("\tcontroller_ip={0}".format(controller_ip))
        try:
            inst_to_deploy = cls.__launch_worker__start_or_resume_vms(worker_obj, config, num_vms_to_start)
            #logging.debug("\tinst_to_deploy={0}".format(inst_to_deploy))
            cls.__launch_worker__deploy_engines(worker_obj, controller_ip, inst_to_deploy, config)
        except ProviderException as e:
            print "Could not start workers: {0}".format(e)

    
    @classmethod
    def add_worker_groups(cls, args, config):
        """ Add workers of a MOLNs cluster. """
        logging.debug("MOLNSWorkerGroup.add_worker_groups(args={0})".format(args))
        if len(args) < 2:
            print "Usage: molns worker add GROUP num"
            return
        try:
            num_vms_to_start = int(args[1])
        except ValueError:
            print "'{0}' in not a valid number of engines.".format(args[1])
            return
        worker_obj = cls._get_workerobj(args, config)
        if worker_obj is None: return
        controller_ip = cls.__launch_workers__get_controller(worker_obj, config)
        if controller_ip is None: return
        try:
            inst_to_deploy = cls.__launch_worker__start_vms(worker_obj, num_vms_to_start)
            cls.__launch_worker__deploy_engines(worker_obj, controller_ip, inst_to_deploy, config)
        except ProviderException as e:
            print "Could not start workers: {0}".format(e)

    @classmethod
    def __launch_workers__get_controller(cls, worker_obj, config):
        # Check if a controller is running
        controller_ip = None
        instance_list = config.get_all_instances(controller_id=worker_obj.controller.id)
        provider_obj = worker_obj.controller
        # Check if they are running or stopped (if so, resume them)
        if len(instance_list) > 0:
            for i in instance_list:
                status = provider_obj.get_instance_status(i)
                logging.debug("instance {0} has status {1}".format(i.id, status))
                if status == provider_obj.STATUS_RUNNING or status == provider_obj.STATUS_STOPPED:
                    controller_ip = i.ip_address
                    print "Controller running at {0}".format(controller_ip)
                    break
        if controller_ip is None:
            print "No controller running for this worker group."
            return
        return controller_ip
        

    @classmethod
    def __launch_worker__start_or_resume_vms(cls, worker_obj, config, num_vms_to_start=0):
        # Check for any instances are assigned to this worker group
        instance_list = config.get_all_instances(worker_group_id=worker_obj.id)
        # Check if they are running or stopped (if so, resume them)
        inst_to_resume = []
        inst_to_deploy = []
        if len(instance_list) > 0:
            for i in instance_list:
                status = worker_obj.get_instance_status(i)
                if status == worker_obj.STATUS_RUNNING:
                    print "Worker running at {0}".format(i.ip_address)
                    num_vms_to_start -= 1
                elif status == worker_obj.STATUS_STOPPED:
                    print "Resuming worker at {0}".format(i.ip_address)
                    inst_to_resume.append(i)
                    num_vms_to_start -= 1
        #logging.debug("inst_to_resume={0}".format(inst_to_resume))
        if len(inst_to_resume) > 0:
            worker_obj.resume_instance(inst_to_resume)
            inst_to_deploy.extend(inst_to_resume)
        inst_to_deploy.extend(cls.__launch_worker__start_vms(worker_obj, num_vms_to_start))
        #logging.debug("inst_to_deploy={0}".format(inst_to_deploy))
        return inst_to_deploy

    @classmethod
    def __launch_worker__start_vms(cls, worker_obj, num_vms_to_start=0):
        """ Return a list of booted instances ready to be deployed as workers."""
        inst_to_deploy = []
        if num_vms_to_start > 0:
            # Start a new instances
            print "Starting {0} new workers".format(num_vms_to_start)
            inst_to_deploy  = worker_obj.start_instance(num=num_vms_to_start)
        if not isinstance(inst_to_deploy,list):
            inst_to_deploy = [inst_to_deploy]
        return inst_to_deploy


    @classmethod
    def __launch_worker__deploy_engines(cls, worker_obj, controller_ip, inst_to_deploy, config):
        print "Deploying on {0} workers".format(len(inst_to_deploy))
        if len(inst_to_deploy) > 0:
            # deploying
            controller_ssh = SSHDeploy(config=worker_obj.controller.provider, config_dir=config.config_dir)
            engine_ssh = SSHDeploy(config=worker_obj.provider, config_dir=config.config_dir)
            engine_file = controller_ssh.get_ipython_engine_file(controller_ip)
            controller_ssh_keyfile = worker_obj.controller.provider.sshkeyfilename()
            if len(inst_to_deploy) > 1:
                logging.debug("__launch_worker__deploy_engines() workpool(size={0})".format(len(inst_to_deploy)))
                jobs = []
                for i in inst_to_deploy:
                    logging.debug("multiprocessing.Process(target=engine_ssh.deploy_ipython_engine({0}, engine_file)".format(i.ip_address))
                    p = multiprocessing.Process(target=engine_ssh.deploy_ipython_engine, args=(i.ip_address, controller_ip, engine_file, controller_ssh_keyfile,))
                    jobs.append(p)
                    p.start()
                    logging.debug("__launch_worker__deploy_engines() joining processes.")
                for p in jobs:
                    p.join()
                logging.debug("__launch_worker__deploy_engines() joined processes.")
            else:
                for i in inst_to_deploy:
                    logging.debug("starting engine on {0}".format(i.ip_address))
                    engine_ssh.deploy_ipython_engine(i.ip_address, controller_ip, engine_file, controller_ssh_keyfile)
        else:
            return
        print "Success"

    @classmethod
    def stop_worker_groups(cls, args, config):
        """ Stop workers of a MOLNs cluster. """
        logging.debug("MOLNSWorkerGroup.stop_worker_groups(args={0})".format(args))
        worker_obj = cls._get_workerobj(args, config)
        if worker_obj is None: return
        # Check for any instances are assigned to this worker group
        instance_list = config.get_all_instances(worker_group_id=worker_obj.id)
        # Check if they are running or stopped (if so, resume them)
        inst_to_stop = []
        if len(instance_list) > 0:
            for i in instance_list:
                status = worker_obj.get_instance_status(i)
                if status == worker_obj.STATUS_RUNNING:
                    print "Stopping worker at {0}".format(i.ip_address)
                    inst_to_stop.append(i)
        if len(inst_to_stop) > 0:
            worker_obj.stop_instance(inst_to_stop)
        else:
            print "No workers running in the worker group"

    @classmethod
    def terminate_worker_groups(cls, args, config):
        """ Terminate workers of a MOLNs cluster. """
        logging.debug("MOLNSWorkerGroup.terminate_worker_groups(args={0})".format(args))
        worker_obj = cls._get_workerobj(args, config)
        if worker_obj is None: return
        # Check for any instances are assigned to this worker group
        instance_list = config.get_all_instances(worker_group_id=worker_obj.id)
        # Check if they are running or stopped (if so, resume them)
        inst_to_stop = []
        if len(instance_list) > 0:
            for i in instance_list:
                status = worker_obj.get_instance_status(i)
                if status == worker_obj.STATUS_RUNNING or status == worker_obj.STATUS_STOPPED:
                    print "Terminating worker at {0}".format(i.ip_address)
                    inst_to_stop.append(i)
        if len(inst_to_stop) > 0:
            worker_obj.terminate_instance(inst_to_stop)
        else:
            print "No workers running in the worker group"

###############################################

class MOLNSProvider(MOLNSbase):
    @classmethod
    def provider_export(cls, args, config):
        """ Export the configuration of a provider. """
        if len(args) < 1:
            raise MOLNSException("USAGE: molns provider export name [Filename]\n"\
                "\tExport the data from the provider with the given name.")
        provider_name = args[0]
        if len(args) > 1:
            filename = args[1]
        else:
            filename = 'Molns-Export-Provider-' + provider_name + '.json'
        # check if provider exists
        try:
            provider_obj = config.get_object(args[0], kind='Provider')
        except DatastoreException as e:
            raise MOLNSException("provider not found")
        data = {'name': provider_obj.name,
                'type': provider_obj.type,
                'config': provider_obj.config}
        return {'data': json.dumps(data),
                'type': 'file',
                'filename': filename}

    @classmethod
    def provider_import(cls, args, config, json_data=None):
        """ Import the configuration of a provider. """
        if json_data is None:
            if len(args) < 1:
                raise MOLNSException("USAGE: molns provider import [Filename.json]\n"\
                    "\Import the data from the provider with the given name.")
            filename = args[0]
            with open(filename) as fd:
                data = json.load(fd)
        else:
            data = json_data
        provider_name = data['name']
        msg = ''
        if data['type'] not in VALID_PROVIDER_TYPES:
            raise MOLNSException("unknown provider type '{0}'".format(data['type']))
        try:
            provider_obj = config.get_object(provider_name, kind='Provider')
            msg += "Found existing provider\n"
            if provider_obj.type != data['type']:
                raise MOLNSException("Import data has provider type '{0}'.  Provier {1} exists with type {2}. Type conversion is not possible.".format(data['type'], provider_obj.name, provider_obj.type))
        except DatastoreException as e:
            provider_obj = config.create_object(name=provider_name, ptype=data['type'], kind='Provider')
            msg += "Creating new provider\n"
        cls.merge_config(provider_obj, data['config'])
        config.save_object(provider_obj, kind='Provider')
        msg += "Provider data imported\n"
        return {'msg':msg}


    @classmethod
    def provider_get_config(cls, name=None, provider_type=None, config=None):
        """ Return a list of dict of config var for the provider config.
            Each dict in the list has the keys: 'key', 'value', 'type'
            
            Either 'name' or 'provider_type' must be specified.
            If 'name' is specified, then it will retreive the value from that
            config and return it in 'value' (or return the string '********'
            if that config is obfuscated, such passwords).
            
        """
        if config is None:
            raise MOLNSException("no config specified")
        if name is None and provider_type is None:
            raise MOLNSException("provider name or type must be specified")
        obj = None
        if obj is None and name is not None:
            try:
                obj = config.get_object(name, kind='Provider')
            except DatastoreException as e:
                pass
        if obj is None and provider_type is not None:
            if provider_type not in VALID_PROVIDER_TYPES:
                raise MOLNSException("unknown provider type '{0}'".format(provider_type))
            p_hand = get_provider_handle('Provider',provider_type)
            obj = p_hand('__tmp__',data={},config_dir=config.config_dir)
        if obj is None:
            raise MOLNSException("provider {0} not found".format(name))
        ret = []
        for key, conf, value in obj.get_config_vars():
            if 'ask' in conf and not conf['ask']:
                continue
            question = conf['q']
            if value is not None:
                myval = value
            else:
                if 'default' in conf and conf['default']:
                    if callable(conf['default']):
                        f1 = conf['default']
                        try:
                            myval = f1()
                        except TypeError:
                            pass
                    else:
                        myval = conf['default']
                else:
                    myval = None
            if myval is not None and 'obfuscate' in conf and conf['obfuscate']:
                myval = '********'
            ret.append({
                'question':question,
                'key':key,
                'value': myval,
                'type':'string'
            })
        return ret

    @classmethod
    def provider_setup(cls, args, config):
        """ Setup a new provider. Create the MOLNS image and SSH key if necessary."""
        #print "MOLNSProvider.provider_setup(args={0})".format(args)
        if len(args) < 1:
            print "USAGE: molns provider setup name"
            print "\tCreates a new provider with the given name."
            return
        # find the \n\tWhere PROVIDER_TYPE is one of: {0}".format(VALID_PROVIDER_TYPES)
        # provider name
        provider_name = args[0]
        # check if provider exists
        try:
            provider_obj = config.get_object(args[0], kind='Provider')
        except DatastoreException as e:
            # ask provider type
            print "Select a provider type:"
            for n,p in enumerate(VALID_PROVIDER_TYPES):
                print "\t[{0}] {1}".format(n,p)
            while True:
                try:
                    provider_ndx = int(raw_input_default("enter the number of type:", default='0'))
                    provider_type = VALID_PROVIDER_TYPES[provider_ndx]
                    break
                except (ValueError, IndexError):
                    pass
            logging.debug("provider type '{0}'".format(provider_type))
            # Create provider
            try:
                provider_obj = config.create_object(name=args[0], ptype=provider_type, kind='Provider')
            except DatastoreException as e:
                logging.exception(e)
                print e
                return
        print "Enter configuration for provider {0}:".format(args[0])
        setup_object(provider_obj)
        config.save_object(provider_obj, kind='Provider')
        #
        cls.provider_initialize(args[0], config)


    @classmethod
    def provider_initialize(cls, provider_name, config):
        """ Create the MOLNS image and SSH key if necessary."""
        try:
            provider_obj = config.get_object(provider_name, kind='Provider')
        except DatastoreException as e:
            raise MOLNSException("provider not found")
        #
        print "Checking all config artifacts."
        # check for ssh key
        if provider_obj['key_name'] is None or provider_obj['key_name'] == '':
            print "Error: no key_name specified."
            return
        elif not provider_obj.check_ssh_key():
            print "Creating key '{0}'".format(provider_obj['key_name'])
            provider_obj.create_ssh_key()
        else:
            print "SSH key={0} is valid.".format(provider_obj['key_name'])

        # check for security group
        if provider_obj['group_name'] is None or provider_obj['group_name'] == '':
            print "Error: no security group specified."
            return
        elif not provider_obj.check_security_group():
            print "Creating security group '{0}'".format(provider_obj['group_name'])
            provider_obj.create_seurity_group()
        else:
            print "security group={0} is valid.".format(provider_obj['group_name'])
        
        # check for MOLNS image
        if provider_obj['molns_image_name'] is None or provider_obj['molns_image_name'] == '':
            if provider_obj['ubuntu_image_name'] is None or provider_obj['ubuntu_image_name'] == '':
                print "Error: no ubuntu_image_name given, can not create molns image."
            else:
                print "Creating new image, this process can take a long time (10-30 minutes)."
                provider_obj['molns_image_name'] = provider_obj.create_molns_image()
        elif not provider_obj.check_molns_image():
            print "Error: an molns image was provided, but it is not available in cloud."
            return

        print "Success."
        config.save_object(provider_obj, kind='Provider')
    
    
    @classmethod
    def provider_rebuild(cls, args, config):
        """ Rebuild the MOLNS image."""
        if len(args) < 1:
            print "USAGE: molns provider rebuild name"
            print "\tCreates a new provider with the given name."
            return
        # provider name
        provider_name = args[0]
        # check if provider exists
        try:
            provider_obj = config.get_object(args[0], kind='Provider')
            if provider_obj['ubuntu_image_name'] is None or provider_obj['ubuntu_image_name'] == '':
                print "Error: no ubuntu_image_name given, can not create molns image."
            else:
                provider_obj['molns_image_name'] = provider_obj.create_molns_image()
                print "Success. new image = {0}".format(provider_obj['molns_image_name'])
                config.save_object(provider_obj, kind='Provider')
        except DatastoreException as e:
            print "provider not found"

    @classmethod
    def provider_list(cls, args, config):
        """ List all the currently configured providers."""
        #print "MOLNSProvider.provider_list(args={0}, config={1})".format(args, config)
        providers = config.list_objects(kind='Provider')
        if len(providers) == 0:
            print "No providers configured"
        else:
            table_data = []
            for p in providers:
                table_data.append([p.name, p.type])
            #table_print(['name', 'type'], table_data)
            r = {'type':'table', 'column_names':['name', 'type'],'data':table_data}
            return r

    @classmethod
    def show_provider(cls, args, config):
        """ Show all the details of a provider config. """
        #print "MOLNSProvider.show_provider(args={0}, config={1})".format(args, config)
        if len(args) == 0:
            print "USAGE: molns provider show name"
            return
        print config.get_object(name=args[0], kind='Provider')

    @classmethod
    def delete_provider(cls, args, config):
        """ Delete a provider config. """
        #print "MOLNSProvider.delete_provider(args={0}, config={1})".format(args, config)
        if len(args) == 0:
            print "USAGE: molns provider delete name"
            return
        config.delete_object(name=args[0], kind='Provider')
###############################################

class MOLNSInstances(MOLNSbase):
    @classmethod
    def show_instances(cls, args, config):
        """ List all instances in the db """
        instance_list = config.get_all_instances()
        if len(instance_list) > 0:
            table_data = []
            for i in instance_list:
                provider_name = config.get_object_by_id(i.provider_id, 'Provider').name
                if i.worker_group_id is not None:
                    name = config.get_object_by_id(i.worker_id, 'WorkerGroup').name
                    itype = 'worker'
                else:
                    name = config.get_object_by_id(i.controller_id, 'Controller').name
                    itype = 'controller'
                table_data.append([i.id, provider_name, i.provider_instance_identifier, itype, name])
            table_print(['ID', 'provider', 'instance id', 'type', 'name'],table_data)
        else:
            print "No instance found"

    @classmethod
    def delete_instance(cls, args, config):
        """ delete an instance in the db """
        if len(args) == 0:
            print "Usage: molns instance delete INSTANCE_ID"
            return
        try:
            instance_id = int(args[0])
        except ValueError:
            print "instance ID must be a integer"
            return
        instance = config.get_instance_by_id(instance_id)
        if instance is None:
            print "instance not found"
        else:
            config.delete_instance(instance)
            print "instance {0} deleted".format(instance_id)


    @classmethod
    def clear_instances(cls, args, config):
        """ delete all instances in the db """
        instance_list = config.get_all_instances()
        if len(instance_list) > 0:
            for i in instance_list:
                print i
                config.delete_instance(i)
                print "instance {0} deleted".format(i.id)
        else:
            print "No instance found"


###############################################

class MOLNSExec(MOLNSbase):
    @classmethod
    def _get_ip_for_job(cls, job, config):
        instance_list = config.get_controller_instances(controller_id=job.controller_id)
        controller_obj = config.get_object_by_id(job.controller_id, 'Controller')
        if controller_obj is None:
            raise MOLNSException("Could not find the controller for this job")
        # Check if they are running
        ip = None
        if len(instance_list) > 0:
            for i in instance_list:
                status = controller_obj.get_instance_status(i)
                logging.debug("instance={0} has status={1}".format(i, status))
                if status == controller_obj.STATUS_RUNNING:
                    ip = i.ip_address
        return ip, controller_obj

    @classmethod
    def start_job(cls, args, config):
        ''' Execute a process on the controller.'''
        # Get Controller
        if len(args) < 2:
             raise MOLNSException("USAGE: molns exec start name [Command]\n"\
                "\tExecute 'Command' on the controller with the given name.")
       
        else:
            controller_obj = cls._get_controllerobj(args, config)
            if controller_obj is None:
                raise Exception("Countroller {0} not found".format(args[0]))
        # Check if controller is running
        instance_list = config.get_all_instances(controller_id=controller_obj.id)
        inst = None
        if len(instance_list) > 0:
            for i in instance_list:
                status = controller_obj.get_instance_status(i)
                if status == controller_obj.STATUS_RUNNING:
                    inst = i
                    break
        if inst is None:
            raise MOLNSException("Controller {0} is not running.".format(args[0]))
        # Create Datastore object
        exec_str = args[1]
        job = config.start_job(controller_id=controller_obj.id, exec_str=exec_str)
        # execute command
        sshdeploy = SSHDeploy(config=controller_obj.provider, config_dir=config.config_dir)
        sshdeploy.deploy_remote_execution_job(inst.ip_address, job.jobID, exec_str)
        #
        return {'JobID':job.jobID, 'id':job.id, 'msg':"Job started, ID={1}  JobID={0}".format(job.jobID,job.id)}

    @classmethod
    def job_status(cls, args, config):
        ''' Check if a process is still running on the controller.'''
        if len(args) < 1:
             raise MOLNSException("USAGE: molns exec status [JobID]\n"\
                "\tCheck if a process is still running on the controller.")
        j = config.get_job(jobID=args[0])
        ip, controller_obj = cls._get_ip_for_job(j, config)
        if ip is None:
            return {'running':False, 'msg': "No active instance for this controller"}
        sshdeploy = SSHDeploy(config=controller_obj.provider, config_dir=config.config_dir)
        (running, msg) = sshdeploy.remote_execution_job_status(ip, j.jobID)
        return {'running':running, 'msg':msg}

    @classmethod
    def job_logs(cls, args, config):
        ''' Return the output (stdout/stderr) of the process.'''
        if len(args) < 1:
             raise MOLNSException("USAGE: molns exec logs [JobID] [seek]\n"\
                "\tReturn the output (stdout/stderr) of the process (starting from 'seek').")
        j = config.get_job(jobID=args[0])
        ip, controller_obj = cls._get_ip_for_job(j, config)
        if ip is None:
            raise MOLNSException("No active instance for this controller")
        seek = 0
        if len(args) > 1:
            try:
                seek = int(args[1])
            except Exception:
                raise MOLNSException("'seek' must be an integer")
        sshdeploy = SSHDeploy(config=controller_obj.provider, config_dir=config.config_dir)
        logs = sshdeploy.remote_execution_get_job_logs(ip, j.jobID, seek)
        return {'msg': logs}


    @classmethod
    def fetch_job_results(cls, args, config, overwrite=False):
        ''' Transfer files created by the process from the controller to local file system.'''
        if len(args) < 2:
             raise MOLNSException("USAGE: molns exec fetch [JobID] [filename] (destination filename)\n"\
                "\tRemove process files from the controller (will kill active processes if running).")
        filename = args[1]
        j = config.get_job(jobID=args[0])
        if j is None:
            raise MOLNSException("Job not found")
        ip, controller_obj = cls._get_ip_for_job(j, config)
        if ip is None:
            raise MOLNSException("No active instance for this controller")
        sshdeploy = SSHDeploy(config=controller_obj.provider, config_dir=config.config_dir)
        if os.path.isfile(filename) and not overwrite and (len(args) < 3 or args[-1] != '--force'):
            raise MOLNSException("File {0} exists, use '--force' or overwrite=True to ignore.")
        if len(args) >= 3 and not args[2].startswith('--'):
            localfile = args[2]
        else:
            localfile = filename
        sshdeploy.remote_execution_fetch_file(ip, j.jobID, filename, localfile)
        return {'msg': "File transfer complete."}


    @classmethod
    def cleanup_job(cls, args, config):
        ''' Remove process files from the controller (will kill active processes if running).'''
        if len(args) < 1:
             raise MOLNSException("USAGE: molns exec cleanup [JobID]\n"\
                "\tRemove process files from the controller (will kill active processes if running).")
        j = config.get_job(jobID=args[0])
        if j is None:
            return {'msg':"Job not found"}
        ip, controller_obj = cls._get_ip_for_job(j, config)
        if ip is None:
            raise MOLNSException("No active instance for this controller")
        sshdeploy = SSHDeploy(config=controller_obj.provider, config_dir=config.config_dir)
        sshdeploy.remote_execution_delete_job(ip, j.jobID)
        config.delete_job(j)
        return {'msg':"Job {0} deleted".format(args[0])}

    @classmethod
    def list_jobs(cls, args, config):
        ''' List all jobs. If 'name' is specified, list all jobs on named controller.'''
        if len(args) > 0:
            controller_obj = cls._get_controllerobj(args, config)
            if controller_obj is None:
                raise Exception("Countroller {0} not found".format(args[0]))
            jobs = config.get_all_jobs(controller_id=controller_obj.id)
        else:
            jobs = config.get_all_jobs()

        if len(jobs) == 0:
            return {'msg':"No jobs found"}
        else:
            table_data = []
            for j in jobs:
                try:
                    p = config.get_object_by_id(j.controller_id, 'Controller')
                    controller_name = p.name
                except DatastoreException as e:
                    controller_name = 'ERROR: {0}'.format(e)
                table_data.append([j.id, j.jobID, controller_name, j.exec_str, j.date])
            return {'type':'table','column_names':['ID', 'JobID', 'Controller', 'Command', 'Date'], 'data':table_data}


##############################################################################################
##############################################################################################
##############################################################################################
##############################################################################################
##############################################################################################
##############################################################################################
# Below is the API for the commmand line execution

class CommandException(Exception):
    pass

def process_output_exception(e):
    logging.exception(e)
    sys.stderr.write("Error: {0}\n".format(e))

def process_output(result):
    if result is not None:
        if type(result)==dict and 'type' in result:
            if result['type'] == 'table' and 'column_names' in result and 'data' in result:
                table_print(result['column_names'],result['data'])
            if result['type'] == 'file' and 'filename' in result and 'data' in result:
                output_to_file(result['filename'],result['data'])
        elif type(result)==dict and 'msg' in result:
            print result['msg']
        else:
            print result

def output_to_file(filename, data):
    with open(filename,'w+') as fd:
        fd.write(data)

def table_print(column_names, data):
    column_width = [0]*len(column_names)
    for i,n in enumerate(column_names):
        column_width[i] = len(str(n))
    for row in data:
        if len(row) != len(column_names):
            raise Exception("len(row) != len(column_names): {0} vs {1}".format(len(row), len(column_names)))
        for i,n in enumerate(row):
            if len(str(n)) > column_width[i]:
                column_width[i] = len(str(n))
    out = "|".join([ "-"*(column_width[i]+2) for i in range(len(column_names))])
    print '|'+out+'|'
    out = " | ".join([ column_names[i].ljust(column_width[i]) for i in range(len(column_names))])
    print '| '+out+' |'
    out = "|".join([ "-"*(column_width[i]+2) for i in range(len(column_names))])
    print '|'+out+'|'
    for row in data:
        out = " | ".join([ str(n).ljust(column_width[i]) for i,n in enumerate(row)])
        print '| '+out+' |'
    out = "|".join([ "-"*(column_width[i]+2) for i in range(len(column_names))])
    print '|'+out+'|'

def raw_input_default(q, default=None, obfuscate=False):
    if default is None or default == '':
        return raw_input("{0}:".format(q))
    else:
        if obfuscate:
            ret = raw_input("{0} [******]: ".format(q))
        else:
            ret = raw_input("{0} [{1}]: ".format(q, default))
        if ret == '':
            return default
        else:
            return ret.strip()

def raw_input_default_config(q, default=None, obj=None):
    """ Ask the user and process the response with a default value. """
    if default is None:
        if callable(q['default']):
            f1 = q['default']
            try:
                default = f1(obj)
            except TypeError:
                pass
        else:
            default = q['default']
    if 'ask' in q and not q['ask']:
        return default
    if 'obfuscate' in q and q['obfuscate']:
        return raw_input_default(q['q'], default=default, obfuscate=True)
    else:
        return raw_input_default(q['q'], default=default, obfuscate=False)

def setup_object(obj):
    """ Setup a molns_datastore object using raw_input_default function. """
    for key, conf, value in obj.get_config_vars():
        obj[key] = raw_input_default_config(conf, default=value, obj=obj)

###############################################
class SubCommand():
    def __init__(self, command, subcommands):
        self.command = command
        self.subcommands = subcommands
    def __str__(self):
        r = ''
        for c in self.subcommands:
             r +=  self.command + " " + c.__str__() + "\n"
        return r[:-1]
    def __eq__(self, other):
        return self.command == other

    def run(self, args, config_dir=None):
        #print "SubCommand().run({0}, {1})".format(self.command, args)
        if len(args) > 0:
            cmd = args[0]
            for c in self.subcommands:
                if c == cmd:
                    return c.run(args[1:], config_dir=config_dir)
        raise CommandException("command not found")

###############################################
class Command():
    def __init__(self, command, args_defs={}, description=None, function=None):
        self.command = command
        self.args_defs = args_defs
        if function is None:
            raise Exception("Command must have a function")
        self.function = function
        if description is None:
            self.description = function.__doc__.strip()
        else:
            self.description = description
    def __str__(self):
        ret = self.command+" "
        for k,v in self.args_defs.iteritems():
            if v is None:
                ret += "[{0}] ".format(k)
            else:
                ret += "[{0}={1}] ".format(k,v)
        ret += "\n\t"+self.description
        return ret
        
    def __eq__(self, other):
        return self.command == other

    def run(self, args, config_dir=None):
        config = MOLNSConfig(config_dir=config_dir)
        return self.function(args, config=config)
###############################################

COMMAND_LIST = [
        # Commands to interact with the head-node.
        Command('ssh', {'name':None},
            function=MOLNSController.ssh_controller),
        Command('status', {'name':None},
            function=MOLNSController.status_controller),
        Command('start', {'name':None},
            function=MOLNSController.start_controller),
        Command('stop', {'name':None},
            function=MOLNSController.stop_controller),
        Command('terminate', {'name':None},
            function=MOLNSController.terminate_controller),
        Command('put', {'name':None, 'file':None},
            function=MOLNSController.put_controller),
        Command('upload', {'name':None, 'file':None},
            function=MOLNSController.upload_controller),
        #Command('local-connect', {'name':None},
        #    function=MOLNSController.connect_controller_to_local),
        # Commands to interact with controller
        SubCommand('controller',[
            Command('setup', {'name':None},
                function=MOLNSController.setup_controller),
            Command('list', {'name':None},
                function=MOLNSController.list_controller),
            Command('show', {'name':None},
                function=MOLNSController.show_controller),
            Command('delete', {'name':None},
                function=MOLNSController.delete_controller),
            Command('export',{'name':None},
                function=MOLNSController.controller_export),
            Command('import',{'filename.json':None},
                function=MOLNSController.controller_import),
        ]),
        # Commands to interact with Worker-Groups
        SubCommand('worker',[
            Command('setup', {'name':None},
                function=MOLNSWorkerGroup.setup_worker_groups),
            Command('list', {'name':None},
                function=MOLNSWorkerGroup.list_worker_groups),
            Command('show', {'name':None},
                function=MOLNSWorkerGroup.show_worker_groups),
            Command('delete', {'name':None},
                function=MOLNSWorkerGroup.delete_worker_groups),
            Command('start', {'name':None},
                function=MOLNSWorkerGroup.start_worker_groups),
            Command('add', {'name':None},
                function=MOLNSWorkerGroup.add_worker_groups),
            Command('status', {'name':None},
                function=MOLNSWorkerGroup.status_worker_groups),
            Command('stop', {'name':None},
                function=MOLNSWorkerGroup.terminate_worker_groups),
            Command('terminate', {'name':None},
                function=MOLNSWorkerGroup.terminate_worker_groups),
            Command('export',{'name':None},
                function=MOLNSWorkerGroup.worker_group_export),
            Command('import',{'filename.json':None},
                function=MOLNSWorkerGroup.worker_group_import),
        ]),
        # Commands to interact with Infrastructure-Providers
        SubCommand('provider',[
            Command('setup',{'name':None},
                function=MOLNSProvider.provider_setup),
            Command('rebuild',{'name':None},
                function=MOLNSProvider.provider_rebuild),
            Command('list',{'name':None},
                function=MOLNSProvider.provider_list),
            Command('show',{'name':None},
                function=MOLNSProvider.show_provider),
            Command('delete',{'name':None},
                function=MOLNSProvider.delete_provider),
            Command('export',{'name':None},
                function=MOLNSProvider.provider_export),
            Command('import',{'filename.json':None},
                function=MOLNSProvider.provider_import),
        ]),
        # Commands to interact with the instance DB
        SubCommand('instancedb',[
            Command('list', {},
                function=MOLNSInstances.show_instances),
            Command('delete', {'ID':None},
                function=MOLNSInstances.delete_instance),
            Command('clear', {},
                function=MOLNSInstances.clear_instances),
        ]),
        SubCommand('exec',[
            Command('start', OrderedDict([('name',None), ('command',None)]),
                function=MOLNSExec.start_job),
            Command('status', {'jobID':None},
                function=MOLNSExec.job_status),
            Command('logs', {'jobID':None},
                function=MOLNSExec.job_logs),
            Command('fetch', OrderedDict([('jobID',None), ('filename', None)]),
                function=MOLNSExec.fetch_job_results),
            Command('cleanup', {'jobID':None},
                function=MOLNSExec.cleanup_job),
            Command('list', {'name':None},
                function=MOLNSExec.list_jobs),
        ]),
                
                ]

def printHelp():
    print "molns <command> <command-args>"
    print " --config=[Config Directory=./.molns/]"
    print "\tSpecify an alternate config location.  (Must be first argument.)"
    for c in COMMAND_LIST:
        print c


def parseArgs():
    if len(sys.argv) < 2 or sys.argv[1] == '-h':
        printHelp()
        return
    
    arg_list = sys.argv[1:]
    config_dir = './.molns/'
    while len(arg_list) > 0 and arg_list[0].startswith('--'):
        if arg_list[0].startswith('--config='):
            config_dir = sys.argv[1].split('=',2)[1]
        if arg_list[0].startswith('--debug'):
            print "Turning on Debugging output"
            logger.setLevel(logging.DEBUG)  #for Debugging
        arg_list = arg_list[1:]
    
    if len(arg_list) == 0 or arg_list[0] =='help' or arg_list[0] == '-h':
        printHelp()
        return
        
    if arg_list[0] in COMMAND_LIST:
        for cmd in COMMAND_LIST:
            if cmd == arg_list[0]:
                try:
                    output = cmd.run(arg_list[1:], config_dir=config_dir)
                    process_output(output)
                    return
                except CommandException:
                    pass
                except Exception as e:
                    process_output_exception(e)
                    return

    print "unknown command: " +  " ".join(arg_list)
    #printHelp()
    print "use 'molns help' to see all possible commands"


if __name__ == "__main__":
    logger = logging.getLogger()
    #logger.setLevel(logging.INFO)  #for Debugging
    logger.setLevel(logging.CRITICAL)
    parseArgs()
