from google.appengine.ext import db
import os
import shutil
import logging
from backend.backendservice import backendservices

class SensitivityJobWrapper(db.Model):
    userId = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    jobName = db.StringProperty()
    modelName = db.StringProperty()
    indata = db.TextProperty()
    outData = db.StringProperty()
    status = db.StringProperty()
    zipFileName = db.StringProperty()
    resource = db.StringProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()
    outputURL = db.StringProperty()
    exceptionMessage = db.StringProperty()
    output_stored = db.StringProperty()

    def stop(self, handler):
        service = backendservices(handler.user_data)

        if self.status == "Running":
            if self.resource.lower() == "local":
                service.deleteTaskLocal([int(self.pid)])
            elif self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
                result = service.stopTask(self)
                
                if result and result[self.cloudDatabaseID]:
                    final_cloud_result = result[self.cloudDatabaseID]
                    try:
                        self.outputURL = final_cloud_result['output']
                    except KeyError:
                        pass
                    self.status = "Finished"
                    self.put()
                    return True
                else:
                    # Something went wrong
                    logging.error(result)
                    return False
            else:
                logging.error('Job Resource {0} not supported!'.format(self.resource))

    def delete(self, handler):
        self.stop(handler)
        
        if self.outData is not None and os.path.exists(self.outData):
            shutil.rmtree(self.outData)

        if self.zipFileName is not None and os.path.exists(self.zipFileName):
            os.remove(self.zipFileName)

        if self.resource is not None and self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
            try:
                service = backendservices(handler.user_data)
                service.deleteTasks(self)
            except Exception as e:
                logging.error("Failed to delete cloud resources of job {0}".format(self.key().id()))
                logging.error(e)

        super(SensitivityJobWrapper, self).delete()
