import shutil
import os
import logging
from google.appengine.ext import db
from backend.backendservice import backendservices
import json
import molns

class ParameterSweepJobWrapper(db.Model):
    user_id = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    name = db.StringProperty()
    modelName = db.StringProperty()
    inData = db.TextProperty()
    outData = db.StringProperty()
    status = db.StringProperty()
    zipFileName = db.StringProperty()
    output_stored = db.BooleanProperty()
    
    resource = db.StringProperty()
    qsubHandle = db.TextProperty()
    molnsPID = db.IntegerProperty()

    is_simulation = db.BooleanProperty(False)
    is_spatial = db.BooleanProperty(False)

    def getJSON(self):
        return { 'id' : self.key().id(),
                 'user_id' : self.user_id,
                 'pid' : self.pid,
                 'startTime' : self.startTime,
                 'name' : self.name,
                 'modelName' : self.modelName,
                 'inData' : json.loads(self.inData),
                 'outData' : self.outData,
                 'status' : self.status,
                 'zipFileName' : self.zipFileName,
                 'output_stored' : self.output_stored,
                 'resource' : self.resource,
                 'molnsPID' : self.molnsPID,
                 'is_spatial': self.is_spatial,
                 'is_simulation': self.is_simulation }

    def delete(self, handler):
        self.stop(handler)
        if self.outData is not None and os.path.exists(self.outData):
            shutil.rmtree(self.outData)
        
        if self.zipFileName is not None and os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        try:
            self.stop(handler)
        except Exception as e:
            logging.exception(e)
        
        try:
            super(ParameterSweepJobWrapper, self).delete()
        except db.NotSavedError as e:
            pass

    
    def stop(self, handler):
        if self.status == "Running":
            # TODO: Call the backend to kill and delete the job and all associated files.
            service = backendservices(handler.user_data)
            if self.resource == "local":
                if self.pid is not None:
                    service.stopTaskLocal([int(self.pid)])
            elif self.resource == "molns":
                molnsConfigDb = db.GqlQuery("SELECT * FROM MolnsConfigWrapper WHERE user_id = :1", handler.user.user_id()).get()

                if not molnsConfigDb:
                    return

                config = molns.MOLNSConfig(config_dir = molnsConfigDb.folder)

                # Stopping is deleting cloud data for this job type
                try:
                    molns.MOLNSExec.cleanup_job([self.molnsPID], config)
                except Exception as e:
                    logging.info("Error while deleting cloud data: {0}".format(e))
