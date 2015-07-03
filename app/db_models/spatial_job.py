from backend.backendservice import backendservices
import logging
import os
import shutil
import json
import pickle
import h5py
from google.appengine.ext import db

import object_property

class SpatialJobWrapper(db.Model):

    # These are all the attributes of a job we use for local storage
    user_id = db.StringProperty()
    pid = db.IntegerProperty()
    cloudDatabaseID = db.StringProperty()
    startTime = db.StringProperty()
    name = db.StringProperty()
    modelName = db.StringProperty() # This is a reference to the model. I should probably use a modelId instead. I'm not sure why I store it as a name
    indata = db.TextProperty() 
    outData = db.StringProperty() # THis is a path to the output data on the filesystem
    status = db.StringProperty()
    
    preprocessed = object_property.ObjectProperty()
    preprocessedDir = db.StringProperty() # THis is a path to the output data on the filesystem
    
    zipFileName = db.StringProperty() # This is a temporary file that the server uses to store a zipped up copy of the output
    vtkFileName = db.StringProperty()
    csvFileName = db.StringProperty()

    # These are the cloud attributes
    resource = db.StringProperty()
    uuid = db.StringProperty()
    outputURL = db.StringProperty()
    celeryPID = db.StringProperty()
    exception_message = db.StringProperty()
    output_stored = db.StringProperty()


    def preprocess(self, trajectory):      
        print "Preprocessing ... "
        ''' Job is already processed check '''
        if (self.preprocessed is not None and trajectory in self.preprocessed) and self.preprocessedDir and os.path.exists(self.preprocessedDir):
            return

        ''' Unpickle data file '''
        with open(str(self.outData + '/results/result{0}'.format(trajectory))) as fd:
            #print "Unpickling data file"
            #indataStr = json.loads(self.indata)
            
            result = pickle.load(fd)

            if not self.preprocessedDir:
                self.preprocessedDir = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../output/preprocessed/{0}/'.format(self.key().id())))

            #print "Directory:", self.preprocessedDir

            if not os.path.exists(self.preprocessedDir):
                os.makedirs(self.preprocessedDir)
                
            target = os.path.join(self.preprocessedDir, "result{0}".format(trajectory)) 

            f = os.path.join(self.preprocessedDir, "mesh.json")

            species = result.model.get_species_map().keys()

            with open(f, 'w') as meshFile:
                json.dump(json.loads(result.export_to_three_js(species[0], 0)), meshFile) 

            hdf5File = h5py.File(target, 'w')

            for specie in species:
                populationValues = result.get_species(specie, concentration = False)
                concentrationValues = result.get_species(specie, concentration = True)
                population = hdf5File.create_dataset(specie + "/population", data = populationValues)
                population.attrs["min"] = min(populationValues.flatten())
                population.attrs["max"] = max(populationValues.flatten())
                concentration = hdf5File.create_dataset(specie + "/concentration", data = concentrationValues)
                concentration.attrs["min"] = min(concentrationValues.flatten())
                concentration.attrs["max"] = max(concentrationValues.flatten())
            
            hdf5File.close()

        if self.preprocessed is None:
            self.preprocessed = set()

        self.preprocessed.add(trajectory)
        self.put()
        return

    # More attributes can obvs. be added
    # The delete operator here is a little fancy. When the item gets deleted from the GOogle db, we need to go clean up files stored locally and remotely
    def delete(self, handler):
        self.stop(handler)
        service = backendservices(handler.user_data)
        
        #delete the local output
        if self.zipFileName is not None and os.path.exists(self.zipFileName):
            os.remove(self.zipFileName)

        if self.preprocessedDir is not None and os.path.exists(str(self.preprocessedDir)):
            shutil.rmtree(str(self.preprocessedDir))
                
        if self.vtkFileName is not None and os.path.exists(self.vtkFileName):
            os.remove(self.vtkFileName)

        if self.outData is not None and os.path.exists(self.outData):
            shutil.rmtree(self.outData)

        # delete on cloud
        if self.resource is not None and self.resource in backendservices.SUPPORTED_CLOUD_RESOURCES:
            try:
                service.deleteTasks(self)
            except Exception as e:
                logging.error("Failed to delete cloud resources of job {0}".format(self.key().id()))
                logging.error(e)
        
        super(SpatialJobWrapper, self).delete()

    # Stop the job!
    def stop(self, handler):
        if self.status == "Running":
            service = backendservices(handler.user_data)
            if self.resource == "local":
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
                raise Exception('Job Resource {0} not supported!'.format(self.resource))
    
    def mark_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        os.system("touch {0}".format(flag_file))
    
    def has_final_cloud_data(self):
        flag_file = os.path.join(self.outData, ".final-cloud")
        return os.path.exists(flag_file)
