import shutil
import os
import logging
from google.appengine.ext import db
from backend.backendservice import backendservices


class StochOptimJobWrapper(db.Model):

    user_id = db.StringProperty()
    pid = db.IntegerProperty()
    startTime = db.StringProperty()
    name = db.StringProperty()
    modelName = db.StringProperty()
    indata = db.TextProperty()
    nameToIndex = db.TextProperty()
    outData = db.StringProperty()
    status = db.StringProperty()
    zipFileName = db.StringProperty()
    
    resource = db.StringProperty()
    outputURL = db.StringProperty()
    cloudDatabaseID = db.StringProperty()
    celeryPID = db.StringProperty()
    pollProcessPID = db.IntegerProperty()

    def delete(self, handler):
        logging.debug("StochOptimJobWrapper(cloudDatabaseID={0})".format(self.cloudDatabaseID))
        if self.outData is not None and os.path.exists(self.outData):
            shutil.rmtree(self.outData)
        
        if self.zipFileName is not None and os.path.exists(self.zipFileName):
                os.remove(self.zipFileName)

        self.stop(handler)
        
        # delete on cloud
        if self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
            service = backendservices(handler.user_data)
            service.deleteTasks(self)

        super(StochOptimJobWrapper, self).delete()

    def stop(self, handler):
        if self.status == "Running" or self.status == "Pending":
            service = backendservices(handler.user_data)
            if self.resource.lower() == "local":
                service.stopTaskLocal([int(self.pid)])
            elif self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
                result = service.stopTasks(self)
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
                raise Exception("Unknown job resource '{0}'".format(sef.resource))
    
    def mark_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        os.system("touch {0}".format(flag_file))
    
    def has_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        return os.path.exists(flag_file)
