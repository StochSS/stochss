from google.appengine.ext import db
import shutil
import os
import logging
from backend.backendservice import backendservices



class StochKitJobWrapper(db.Model):
    # A reference to the user that owns this job
    user_id =  db.StringProperty()
    pid = db.IntegerProperty()
    name = db.StringProperty()
    modelName = db.StringProperty()
    indata = db.TextProperty()
    # Indata contains data from the GUI. These are:
    # type, final_time, increment, realizations, exec_type, units, store_only_mean, label_column_names,
    #  create_histogram_data, epsilon, threshold

#                        "type" : job.stochkit_job.type,
#                        "final_time" : job.stochkit_job.final_time,
#                        "increment" : job.stochkit_job.increment,
#                        "realizations" : job.stochkit_job.realizations,
#                        "exec_type" : job.stochkit_job.exec_type,
#                        "units" : job.stochkit_job.units,
#                        "store_only_mean" : job.stochkit_job.store_only_mean,
#                        "label_column_names" : job.stochkit_job.label_column_names,
#                        "create_histogram_data" : job.stochkit_job.create_histogram_data,
#                        "epsilon" : job.stochkit_job.epsilon,
#                        "threshold" : job.stochkit_job.threshold,


    # The type if the job {'local', 'cloud'}
    zipFileName = db.StringProperty()
    status = db.StringProperty()
    resource = db.StringProperty()
    startTime = db.StringProperty()
    output_stored = db.StringProperty()
    outData = db.StringProperty()
    outputURL = db.StringProperty()
    result = db.StringProperty()

    stdout = db.StringProperty()
    stderr = db.StringProperty()
    
    celeryPID = db.StringProperty()
    cloudDatabaseID = db.StringProperty()

#            jsonJob = { "id" : job.key().id(),
#                        "name" : job.name,
#                        "stdout" : job.stdout,
#                        "stderr" : job.stderr,




    def stop(self, user_data):
        # TODO: Call the backend to kill and delete the job and all associated files.
        service = backendservices(user_data)

        if self.resource.lower() == 'local':
            service.stopTaskLocal([self.pid])
        else:
            service.stopTasks(self)

    def delete(self, handle):
        self.stop(handle.user_data)

        # TODO: Call the backend to kill and delete the job and all associated files.
        service = backendservices(handle.user_data)

        if self.zipFileName is not None and os.path.exists(self.zipFileName):
            os.remove(self.zipFileName)
        
        #delete the ouput results of execution locally, if exists.       
        if self.outData is not None and os.path.exists(str(self.outData)):
            shutil.rmtree(self.outData)

        if self.resource is not None and self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
            try:
                service.deleteTasks(self)
            except Exception as e:
                logging.error("Failed to delete cloud resources of job {0}".format(self.key().id()))
                logging.error(e)

        super(StochKitJobWrapper, self).delete()
