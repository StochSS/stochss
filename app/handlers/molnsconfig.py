import jinja2
import json
import molns
import shlex
import subprocess
import os
import Queue
import traceback
import tempfile
import sys
import pickle
import logging
import random
import string

if __name__ != "__main__":
    import stochssapp
    from db_models.molnsconfig import MolnsConfigWrapper, MolnsConfigProcessWrapper
    from google.appengine.ext import db

appDir = os.path.dirname(os.path.abspath(__file__))

baseMolnsConfigDir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../molnsConfig'))
if not os.path.exists(baseMolnsConfigDir):
    os.mkdir(baseMolnsConfigDir)

templateLoader = jinja2.FileSystemLoader(searchpath = os.path.join(os.path.dirname(__file__), '../templates'))
templateEnv = jinja2.Environment(loader = templateLoader)

providerToNames = {}
for providerType in molns.VALID_PROVIDER_TYPES:
    providerToNames[providerType] = { 'providerName' : '{0}_provider'.format(providerType),
                                      'controllerName' : '{0}_controller'.format(providerType),
                                      'workerName' : '{0}_worker'.format(providerType) }

class Logger(object):
    def __init__(self, queue):
        self.queue = queue

    def write(self, stuff):
        self.queue.put(stuff)

    def flush(self):
        pass

def startMolns(providerName, controllerName, workerName, providerType, password, configFilename):
    config = molns.MOLNSConfig(db_file = configFilename)

    molns.MOLNSProvider.provider_initialize(providerName, config)
    molns.MOLNSProvider.provider_get_config(name = providerName, provider_type = providerType, config = config)
    molns.MOLNSController.start_controller([controllerName], config, password = password, openWebBrowser=False, reserved_cpus=1)
    molns.MOLNSWorkerGroup.start_worker_groups([workerName], config)

def stopMolns(controllerName, configFilename):
    config = molns.MOLNSConfig(db_file = configFilename)
    molns.MOLNSController.stop_controller([controllerName], config)

def terminateMolns(controllerName, configFilename):
    config = molns.MOLNSConfig(db_file = configFilename)
    molns.MOLNSController.terminate_controller([controllerName], config)

def rebuildMolns(providerName, configFilename):
    config = molns.MOLNSConfig(db_file = configFilename)
    molns.MOLNSProvider.provider_rebuild([providerName], config)

def addWorkers(workerName, number, configFilename):
    config = molns.MOLNSConfig(db_file = configFilename)

    molns.MOLNSWorkerGroup.add_worker_groups([workerName, number], config)

if __name__ == "__main__":
    funcname, return_code, args = pickle.loads(sys.stdin.read())

    # We disable stdout buffering, from https://www.turnkeylinux.org/blog/unix-buffering
    sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', 0)
    sys.stderr = os.fdopen(sys.stderr.fileno(), 'w', 0)
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    try:
        if funcname == 'startMolns':
            startMolns(*args)
        elif funcname == 'stopMolns':
            stopMolns(*args)
        elif funcname == 'terminateMolns':
            terminateMolns(*args)
        elif funcname == 'rebuildMolns':
            rebuildMolns(*args)
        elif funcname == 'addWorkers':
            addWorkers(*args)
    except Exception as e:
        with open(return_code, 'w') as f:
            f.write('1')

        raise sys.exc_info()[1], None, sys.exc_info()[2]
    else:
        with open(return_code, 'w') as f:
            f.write('0')

def logexceptions(func):
    def inner(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            #self.response.content_type = 'application/json'
            traceback.print_exc()

            return { 'status' : False, 'msg' : traceback.format_exc() }

    return inner

class MolnsConfig(stochssapp.BaseHandler if __name__ != "__main__" else object):
    def authentication_required(self):
        return True

    def get(self, reqType = None):
        # If there is no reqType, just render the main page

        if reqType == None:
            data = {}
            
            self.render_response('molnsconfig.html', **{ 'json' : json.dumps(self.pollSystemState()) })
        # If there is a reqType pass control to the other functions
        # These will handle writing a response to the client
        elif reqType == "pollSystemState":
            self.response.write(json.dumps(self.pollSystemState()))
        elif reqType == "getMolnsState":
            self.response.write(json.dumps(self.getMolnsState()))
        elif reqType == "updateMolnsState":
            self.response.write(json.dumps(self.updateMolnsState()))
        elif reqType == "stopMolns":
            self.response.write(json.dumps(self.stopMolns()))
        elif reqType == "terminateMolns":
            self.response.write(json.dumps(self.terminateMolns()))
        elif reqType == "rebuildMolns":
            self.response.write(json.dumps(self.rebuildMolns()))
        elif reqType == "addWorkers":
            self.response.write(json.dumps(self.addWorkers()))
        elif reqType == "startMolns":
            self.response.write(json.dumps(self.startMolns()))

    def post(self, reqType = None):
        return self.get(reqType)

    @logexceptions
    def getMolnsConfigPath(self):
        molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", self.user.user_id()).get()
        
        if not molnsConfigDb:
            molnsConfigDb = MolnsConfigWrapper()

            molnsConfigDb.user_id = self.user.user_id()
            folder = tempfile.mkdtemp(dir = baseMolnsConfigDir)
            molnsConfigDb.folder = folder
            molnsConfigDb.path = os.path.join(folder, 'molns_datastore.db')
            
            molnsConfigDb.put()

        return molnsConfigDb.path

    @logexceptions
    def pollSystemState(self):
        output = []

        config = molns.MOLNSConfig(db_file = self.getMolnsConfigPath())

        controllerName = providerToNames['EC2']['controllerName']

        if 'process' in self.session:
            processId, functionName = self.session['process']

            process = MolnsConfigProcessWrapper.get_by_id(processId)

            if not process:
                functionName = None
                is_alive = False
            else:
                is_alive = process.is_alive()

                stdout, stderr = process.communicate()

                # Get new messages
                if len(stdout) > 0:
                    output.append({ 'status' : 1, 'msg' : stdout })

                if len(stderr) > 0:
                    output.append({ 'status' : 0, 'msg' : stderr })
        else:
            functionName = None
            is_alive = False

        try:
            status = molns.MOLNSController.status_controller([controllerName], config)

            if 'column_names' in status:
                status['column_names'] = [s.capitalize() for s in status['column_names']]
            else:
                status = {'type':'table', 'column_names':['Name','Status','Type','Provider','Instance id', 'IP address'], 'data':[]}
        except:
            status = {'type':'table', 'column_names':['Name','Status','Type','Provider','Instance id', 'IP address'], 'data':[]}

        return {
            'molns': self.getMolnsState(),
            'instanceStatus' : status,
            'messages': output,
            'process' : {
                'name' :  functionName,
                'status' : is_alive
            }
        }

    @logexceptions
    def rebuildMolns(self):
        self.response.content_type = 'application/json'

        providerType = self.request.get('providerType')

        if 'process' in self.session:
            process = MolnsConfigProcessWrapper.get_by_id(self.session['process'][0])

            if process is not None and process.is_alive():
                return { 'status' : False, 'msg' : 'Currently running process' }

        if providerType not in molns.VALID_PROVIDER_TYPES:
            return { 'status' : False, 'msg' : 'Invalid provider type specified (shouldn\'t be possible)' }

        providerName = providerToNames[providerType]['providerName']

        self.runProcess('rebuildMolns', (providerName, self.getMolnsConfigPath()))

        return self.pollSystemState()

    @logexceptions
    def stopMolns(self):
        self.response.content_type = 'application/json'
        providerType = self.request.get('providerType')
        if 'process' in self.session:
            process = MolnsConfigProcessWrapper.get_by_id(self.session['process'][0])
            if process is not None and process.is_alive():
                return { 'status' : False, 'msg' : 'Currently running process' }
        if providerType not in molns.VALID_PROVIDER_TYPES:
            return { 'status' : False, 'msg' : 'Invalid provider type specified (shouldn\'t be possible)' }
        controllerName = providerToNames[providerType]['controllerName']
        self.runProcess('stopMolns', (controllerName, self.getMolnsConfigPath()))
        return self.pollSystemState()

    @logexceptions
    def terminateMolns(self):
        self.response.content_type = 'application/json'
        providerType = self.request.get('providerType')
        if 'process' in self.session:
            process = MolnsConfigProcessWrapper.get_by_id(self.session['process'][0])
            if process is not None and process.is_alive():
                return { 'status' : False, 'msg' : 'Currently running process' }
        if providerType not in molns.VALID_PROVIDER_TYPES:
            return { 'status' : False, 'msg' : 'Invalid provider type specified (shouldn\'t be possible)' }
        controllerName = providerToNames[providerType]['controllerName']
        self.runProcess('terminateMolns', (controllerName, self.getMolnsConfigPath()))
        return self.pollSystemState()

    @logexceptions
    def addWorkers(self):
        self.response.content_type = 'application/json'

        providerType = self.request.get('providerType')
        number = self.request.get('number')

        if 'process' in self.session:
            process = MolnsConfigProcessWrapper.get_by_id(self.session['process'][0])

            if process is not None and process.is_alive():
                return { 'status' : False, 'msg' : 'Currently running process' }

        if providerType not in molns.VALID_PROVIDER_TYPES:
            return { 'status' : False, 'msg' : 'Invalid provider type specified (shouldn\'t be possible)' }

        workerName = providerToNames[providerType]['workerName']

        self.runProcess('addWorkers', (workerName, number, self.getMolnsConfigPath()))

        return self.pollSystemState()

    @logexceptions
    def startMolns(self):
        self.response.content_type = 'application/json'

        state = self.request.get('state')
        providerType = self.request.get('providerType')
        pw = self.request.get('pw')
        if pw is None or pw == '':
            pw = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            logging.info('*'*80)
            logging.info('*'*80)
            logging.info("MolnsConfig.startMolns(pw={0})".format(pw))
            logging.info('*'*80)
            logging.info('*'*80)

        if 'process' in self.session:
            process = MolnsConfigProcessWrapper.get_by_id(self.session['process'][0])

            if process is not None and process.is_alive():
                return { 'status' : False, 'msg' : 'Currently running process' }

        if providerType not in molns.VALID_PROVIDER_TYPES:
            return { 'status' : False, 'msg' : 'Invalid provider type specified (shouldn\'t be possible)' }

        state = json.loads(state)

        self.updateMolnsState(state)

        providerName = providerToNames[providerType]['providerName']
        controllerName = providerToNames[providerType]['controllerName']
        workerName = providerToNames[providerType]['workerName']

        self.runProcess('startMolns', (providerName, controllerName, workerName, providerType, pw, self.getMolnsConfigPath()))

        return self.pollSystemState()


    def runProcess(self, funcName, args = ()):
        if 'process' in self.session:
            process = MolnsConfigProcessWrapper.get_by_id(self.session['process'][0])

            if process is not None and process.is_alive():
                raise { status : False, msg : 'Currently running process, cannot start new one' }

        outPath = tempfile.mkdtemp(dir = os.path.abspath('{0}/../output/'.format(os.path.dirname(__file__))))

        stdout = os.path.join(outPath, 'stdout.log')
        stderr = os.path.join(outPath, 'stderr.log')
        return_code = os.path.join(outPath, 'return_code')

        molnsConfigProcessWrapper = MolnsConfigProcessWrapper()
        molnsConfigProcessWrapper.outPath = outPath
        molnsConfigProcessWrapper.stdout = stdout
        molnsConfigProcessWrapper.stderr = stderr
        molnsConfigProcessWrapper.return_code = return_code

        stdoutFile = open(stdout, 'w')
        stderrFile = open(stderr, 'w')

        thisFile = os.path.abspath(__file__)

        process = subprocess.Popen(shlex.split('python {0}'.format(thisFile)), stdout = stdoutFile, stderr = stderrFile, stdin = subprocess.PIPE)
        process.stdin.write(pickle.dumps((funcName, return_code, args)))
        process.stdin.close()
        #process = multiprocessing.Process(target = wrapStdoutStderr, args = )
        #process.start()

        molnsConfigProcessWrapper.pid = process.pid
        molnsConfigProcessWrapper.put()

        self.session['process'] = (molnsConfigProcessWrapper.key().id(), funcName)

    def getMolnsState(self):
        config = molns.MOLNSConfig(db_file = self.getMolnsConfigPath())

        output = {}

        for providerType in providerToNames:
            output[providerType] = { 'provider' : molns.MOLNSProvider.provider_get_config(name = providerToNames[providerType]['providerName'], provider_type = providerType, config = config),
                                     'controller' : molns.MOLNSController.controller_get_config(name = providerToNames[providerType]['controllerName'], provider_type = providerType, config = config),
                                     'worker' : molns.MOLNSWorkerGroup.worker_group_get_config(name = providerToNames[providerType]['workerName'], provider_type = providerType, config = config) }

        return output

    def updateMolnsState(self, state):
        if 'process' in self.session:
            process = MolnsConfigProcessWrapper.get_by_id(self.session['process'][0])

            if process is not None and process.is_alive():
                raise { status : False, msg: 'Currently running process, cannot update state while this is ongoing' }

        config = molns.MOLNSConfig(db_file = self.getMolnsConfigPath())

        for providerType in state:
            providerName = providerToNames[providerType]['providerName']
            controllerName = providerToNames[providerType]['controllerName']
            workerName = providerToNames[providerType]['workerName']

            provider_conf_items = molns.MOLNSProvider.provider_get_config(name = providerName, provider_type = providerType, config = config)

            json_obj = { 'name' : providerName,
                         'type' : providerType,
                         'config' : {} }
            
            provider = state[providerType]['provider']

            # Update those values that have changed
            for i in range(len(provider)):
                if provider[i]['value'] != provider_conf_items[i]['value']:
                    json_obj['config'][provider_conf_items[i]['key']] = provider[i]['value']

            molns.MOLNSProvider.provider_import('', config, json_obj)

            controller_conf_items = molns.MOLNSController.controller_get_config(name = controllerName, provider_type = providerType, config = config)
            
            controller = state[providerType]['controller']
            
            json_obj = { 'name' : controllerName,
                         'provider_name' : providerName,
                         'config' : {} }

            for i in range(len(controller)):
                if controller[i]['value'] != controller_conf_items[i]['value']:
                    json_obj['config'][controller_conf_items[i]['key']] = controller[i]['value']

            molns.MOLNSController.controller_import('', config, json_obj)

            worker_conf_items = molns.MOLNSWorkerGroup.worker_group_get_config(name = workerName, provider_type = providerType, config = config)
            
            worker = state[providerType]['worker']
            
            json_obj = { 'name' : workerName,
                         'controller_name' : controllerName,
                         'provider_name' : providerName,
                         'config' : {} }

            for i in range(len(worker)):
                if worker[i]['value'] != worker_conf_items[i]['value']:
                    json_obj['config'][worker_conf_items[i]['key']] = worker[i]['value']

            molns.MOLNSWorkerGroup.worker_group_import('', config, json_obj)
