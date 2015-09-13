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

        super(ParameterSweepJobWrapper, self).delete()

    def stop(self, handler):
        if self.status == "Running" or self.status == "Pending":
            service = backendservices(handler.user_data)
            if self.resource is not None and self.resource.lower() == "local":
                service.stopTaskLocal([int(self.pid)])
            elif self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
                # Write the finalized file
                if self.outData is None or not os.path.exists(self.outData):
                    self.outData = os.path.abspath(
                        os.path.dirname(os.path.abspath(__file__))+'/../output/'+self.cloudDatabaseID
                    )
                    try:
                        logging.debug('stochoptim_job.stop() outData is None, makeing direcotry = {0}'.format(self.outData))
                        os.mkdir(self.outData)
                    except Exception as e:
                        logging.exception(e)
                        #TODO, comment out above
                        #pass
                else:
                    logging.debug('stochoptim_job.stop() outData is not None, = {0}'.format(self.outData))
                try:
                    file_to_check = "{0}/return_code".format(self.outData)
                    if not os.path.exists(file_to_check):
                        with open(file_to_check,'w+') as fd:
                            fd.write(str(1))
                except Exception as e:
                    logging.exception(e)
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
                raise Exception("Unknown job resource '{0}'".format(self.resource))
    
    def mark_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        os.system("touch {0}".format(flag_file))
    
    def has_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        return os.path.exists(flag_file)
