import shutil
import os
import logging
from google.appengine.ext import db
from backend.backendservice import backendservices

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
    
    resource = db.StringProperty()
    outputURL = db.StringProperty()
    molnsPID = db.IntegerProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()
    pollProcessPID = db.IntegerProperty()

    def delete(self, handler):
        logging.debug("ParameterSweepJobWrapper(cloudDatabaseID={0})".format(self.cloudDatabaseID))
        if self.outData is not None and os.path.exists(self.outData):
            shutil.rmtree(self.outData)
        
        if self.zipFileName is not None and os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        try:
            self.stop(handler)
        except Exception as e:
            logging.exception(e)
        
        # delete on cloud
        if self.resource is not None and self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
            try:
                service = backendservices(handler.user_data)
                service.deleteTasks(self)
            except Exception as e:
                logging.error("Failed to delete cloud resources of job {0}".format(self.key().id()))
                logging.error(e)

        try:
            super(ParameterSweepJobWrapper, self).delete()
        except db.NotSavedError as e:
            pass

    def stop(self, handler):
        # TODO: Call the backend to kill and delete the job and all associated files.
        service = backendservices(handler.user_data)

        if not self.resource:
            return

        if self.resource.lower() == 'local':
            service.stopTaskLocal([self.pid])
        elif self.resource.lower() == 'cloud':
            service.stopTasks(self)
