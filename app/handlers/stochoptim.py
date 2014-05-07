from stochssapp import BaseHandler
from modeleditor import ModelManager
import stochss
import backend.backendservice

from google.appengine.ext import db

import copy
import fileserver
import json
import os
import re
import shlex
import subprocess
import tempfile
import time

def int_or_float(s):
    try:
        return int(s)
    except ValueError:
        return float(s)

class StochOptimModel(stochss.model.Model):
    def __init__(self, *args, **kwargs):
        super(StochOptimModel, self).__init__(*args, **kwargs)

        self.units = "population"

    # This function returns a succes integer and a list of error strings which can be passed on to the user
    def fromStochKitModel(self, model):
        msgs = []

        if model.units.lower() == "concentration":
            msgs.append("StochOptimModel cannot be based on a concentration model")
            return False, msgs

        self.annotation = model.annotation
        
        # Species
        # Any species can be converted to StochOptim format
        self.listOfSpecies = copy.deepcopy(model.listOfSpecies)
                
        # Parameters
        # Any parameter can be converted to StochOptim format
        self.listOfParameters = copy.deepcopy(model.listOfParameters)

        exprParameters = []
        for pname in self.listOfParameters:
            if hasattr(self.listOfParameters[pname], 'expression'):
                exprParameters.append(pname)

            #self.listOfParameters[pname].evaluate()
        msgs.append("Parameters [{0}] are expressed in terms of other variables. The sensitivity will be computed as if this is not true, and the parameters are simply real values, not functions of other parameters".format(", ".join(exprParameters)))

        success = True
        # Reactions
        self.listOfReactions = copy.deepcopy(model.listOfReactions)
        nonMassActionReactions = []
        for rname in self.listOfReactions:
            if self.listOfReactions[rname].massaction == False:
                nonMassActionReactions.append(rname)
                success = False

        msgs.append("Reactions must be mass-action. Reactions [{0}] are not".format(", ".join(nonMassActionReactions)))

        return success, msgs

    def serialize(self, activate = None):
        species = self.listOfSpecies.items()
        reactions = self.listOfReactions.items()
        parameters = self.listOfParameters.items()

        reactionMatrix = []
        productMatrix = []
        for s in species:
            reactionMatrix.append(len(reactions) * [0])
            productMatrix.append(len(reactions) * [0])
        
        for j, (rname, reaction) in enumerate(reactions):
            reactants = dict(reaction.reactants)
            products = dict(reaction.products)
            for i, (sname, specie) in enumerate(species):
                if sname in reactants:
                    reactionMatrix[i][j] = reactants[sname]

                if sname in products:
                    productMatrix[i][j] = products[sname]

        rnu = "r.nu <- rbind("

        for i, row in enumerate(reactionMatrix):
            rnu += "c({0})".format(", ".join([repr(x) for x in row]))
            if i < len(reactionMatrix) - 1:
                rnu += ", "
                
        rnu += ")"

        pnu = "p.nu <- rbind("

        for i, row in enumerate(productMatrix):
            pnu += "c({0})".format(", ".join([repr(x) for x in row]))
            if i < len(productMatrix) - 1:
                pnu += ", "
                
        pnu += ")"

        snames = "s.names <- c({0})".format(", ".join(["\"{0}\"".format(name) for name, specie in species]))
        rnames = "r.names <- c({0})".format(", ".join(["\"{0}\"".format(name) for name, reaction in reactions]))

        rparms = "r.parms <- c({0})".format(", ".join([repr(parameter.value) for name, parameter in parameters]))
        rknames = "rk.names <- c({0})".format(", ".join(["\"{0}\"".format(name) for name, reaction in parameters]))
        
        if activate:
            rconstant = "r.constant <- c({0})".format(", ".join([("FALSE" if activate[name] else "TRUE") for name, parameter in parameters]))
        else:
            rconstant = "r.constant <- c({0})".format(", ".join(["FALSE" for name, parameter in parameters]))
        
        parameterNameToIndex = {}

        for i, (name, parameter) in enumerate(parameters):
            parameterNameToIndex[name] = i

        rkind = "rk.ind <- c({0})".format(", ".join([repr(parameterNameToIndex[reaction.marate.name] + 1) for name, reaction in reactions]))

        print os.linesep.join([rnu, pnu, snames, rnames, rparms, rknames, rconstant, rkind])

        return os.linesep.join([rnu, pnu, snames, rnames, rparms, rknames, rconstant, rkind])

class StochOptimJobWrapper(db.Model):
    userId = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    indata = db.TextProperty()
    outData = db.StringProperty()
    status = db.StringProperty()

    def delete(self):
        service = backend.backendservice.backendservices()
        
        service.deleteTaskLocal([self.pid])

        super(StochOptimJobWrapper, self).delete()

class StochOptimPage(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self):
        self.render_response('stochoptim.html')            

    def post(self):
        reqType = self.request.get('reqType')
        self.response.content_type = 'application/json'

        if reqType == 'newJob':
            data = json.loads(self.request.get('data'))

            job = db.GqlQuery("SELECT * FROM StochOptimJobWrapper WHERE userId = :1 AND jobName = :2", self.user.user_id(), data["jobName"].strip()).get()

            if job != None:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "Job name must be unique"}))
                return

            # This function takes full responsibility for writing responses out to the world. This is probably a bad design mechanism
            self.runLocal(data)
            return
        elif reqType == 'delJob':
            jobID = json.loads(self.request.get('id'))

            jobID = int(jobID)

            job = StochOptimJobWrapper.get_by_id(jobID)

            if job.userId == self.user.user_id():
                job.delete()
            else:
                self.response.write(json.dumps({"status" : False,
                                                "msg" : "No permissions to delete this job (this should never happen)"}))
                return

        self.response.write(json.dumps({ 'status' : True,
                                         'msg' : 'Job downloaded'}))
    
    def runLocal(self, data):
        '''
        '''
        model = ModelManager.getModel(self, data["modelID"], modelAsString = False)

        berniemodel = StochOptimModel()

        success, msgs = berniemodel.fromStochKitModel(model["model"])

        print "success", success

        if not success:
            self.response.content_type = 'application/json'
            self.response.write(json.dumps({"status" : False,
                                            "msg" : os.linesep.join(msgs) }))
            return

        path = os.path.abspath(os.path.dirname(__file__))

        basedir = path + '/../'
        dataDir = tempfile.mkdtemp(dir = basedir + 'output')

        print dataDir

        job = StochOptimJobWrapper()
        job.userId = self.user.user_id()
        job.startTime = time.strftime("%Y-%m-%d-%H-%M-%S")
        job.jobName = data["jobName"]
        job.indata = json.dumps(data)
        job.outData = dataDir

        job.status = "Running"

        # Convert model and write to file
        model_file_file = tempfile.mktemp(prefix = 'modelFile', suffix = '.R', dir = dataDir)
        mff = open(model_file_file, 'w')
        mff.write(berniemodel.serialize())
        mff.close()
        data["model_file_file"] = model_file_file

        model_data_file = tempfile.mktemp(prefix = 'initialDataFile', suffix = '.txt', dir = dataDir)
        mdf = open(model_data_file, 'w')
        jFileData = fileserver.FileManager.getFile(self, data["dataID"], noFile = False)
        mdf.write(jFileData["data"])
        mdf.close()
        data["model_data_file"] = model_data_file

        data["exec"] = "'bash'"

        data["steps"] = ("C" if data["crossEntropyStep"] else "") + ("E" if data["emStep"] else "") + ("U" if data["uncertaintyStep"] else "")

        data["cores"] = 1
        data["options"] = ""

        cmd = "/home/bbales2/stochoptim3/exec/mcem2.r --model {model_file_file} --data {model_data_file} --steps {steps} --seed {seed} --cores {cores} --K.ce {Kce} --K.em {Kem} --K.lik {Klik} --K.cov {Kcov} --rho {rho} --perturb {perturb} --alpha {alpha} --beta {beta} --gamma {gamma} --k {k} --pcutoff {pcutoff} --qcutoff {qcutoff} --numIter {numIter} --numConverge {numConverge} --command {exec}".format(**data)

        exstring = '{0}/backend/wrapper.sh {1}/stdout {1}/stderr {2}'.format(basedir, dataDir, cmd)

        print exstring

        handle = subprocess.Popen(shlex.split(exstring))

        job.pid = handle.pid

        job.put()

        self.response.write(json.dumps({"status" : True,
                                        "msg" : "Job launched",
                                        "id" : job.key().id()}))

class StochOptimVisualization(BaseHandler):
    def authentication_required(self):
        return True
    
    def get(self, queryType, jobID):

        output ={}

        jobID = int(jobID)

        optimization = StochOptimJobWrapper.get_by_id(jobID)

        try:
            fd = os.open("{0}/stdout".format(optimization.outData), os.O_RDONLY)
            f = os.fdopen(fd)
            output["stdout"] = f.read().strip()
            f.close()

            if len(output["stdout"]) == 0:
                output["stdout"] = "(empty)"
        except:
            output["stdout"] = "No output available yet"

        if queryType.lower() == "debug":
            try:
                fd = os.open("{0}/stderr".format(optimization.outData), os.O_RDONLY)
                f = os.fdopen(fd)
                output["stderr"] = f.read().strip()
                f.close()

                if len(output["stderr"]) == 0:
                    output["stderr"] = "(empty)"
            except:
                output["stderr"] = "No errors available yet"
            
        self.render_response('stochoptimvisualization.html', **output)
