from stochssapp import BaseHandler
from simulation import StochKitJobWrapper
from sensitivity import SensitivityJobWrapper
import backend.s3_helper
import math

EC2_RATES = {
    't1.micro' : 0.02,
    'c3.large' : 0.105,
    'c3.2xlarge' : 0.42,
}

class CostAnalysisPage(BaseHandler):
    """ The main handler for the Cost Analysis Status Page. Displays cost information about completed jobs."""        
    def authentication_required(self):
        return True
    
    def get(self):
        context = self.getContext()
        self.render_response('cba.html', **context)
        
    def post(self):        
        params = self.request.POST        
        context = self.getContext()
        self.render_response('cba.html', **context)

    def getContext(self):
        """ 
            Get the status of all the cost info for a particular job and assemble a dict
            with info to display on the page. 
        """
        context = {}

        job_id = int(self.request.get('id'))
        context['job_id'] = job_id

        job = StochKitJobWrapper.get_by_id(job_id)

        if job is None:
            job = SensitivityJobWrapper.get_by_id(job_id)
            filename = job.cloudDatabaseID
            context['jobname'] = job.jobName
        else:
            filename = job.stochkit_job.pid
            context['jobname'] = job.name


        context['filename'] = filename + ".tar"
        context['bucketname'] = self.user_data.getBucketName()

        credentials = self.user_data.getCredentials()

        tags = backend.s3_helper.get_all_metadata_from_file(context['bucketname'],
                                                            context['filename'],
                                                            credentials['EC2_ACCESS_KEY'],
                                                            credentials['EC2_SECRET_KEY'])
#        tags = {}
#        tags['running-time'] = '4.52134'
#        tags['size'] = '217088'
#        tags['instance-type'] = 't1.micro'

        time = float(tags['running-time'])
        minute,second = divmod(time,60)
        hour,minute = divmod(minute,60)

        context['running_time'] = "%dh %dm %ds" % (hour,minute,second)

        size = float(tags['size'])
        suffix = "B"
        if size > 1024:
            size = size / 1024
            suffix = "KB"
        if size > 1024:
            size = size / 1024
            suffix = "MB"
        if size > 1024:
            size = size / 1024
            suffix = "GB"
        if size > 1024:
            size = size / 1024
            suffix = "TB"

        context['size'] = ("%0.2f " % size) + suffix

        context['instance_type'] = tags['instance-type']

        compute_cost = math.ceil(float(tags['running-time']) / 3600) * EC2_RATES[tags['instance-type']]
        storage_cost = int(tags['size']) * 0.03 / (1024*1024*1024)

        context['compute_cost'] = "%0.3f" % compute_cost
        context['storage_cost_month'] = "%0.3f" % storage_cost
        context['storage_cost_day'] = "%0.3f" % (storage_cost / 30)

        prov_keys = backend.s3_helper.get_all_files("gdouglas.cs.ucsb.edu.research_bucket",
                                                    filename,
                                                    credentials['EC2_ACCESS_KEY'],
                                                    credentials['EC2_SECRET_KEY'])
        prov_files = {}
        for key in prov_keys:
            if key.name.endswith('execute'):
                exec_str = backend.s3_helper.get_contents_from_file(key)
                ami_id = backend.s3_helper.get_metadata_from_file("gdouglas.cs.ucsb.edu.research_bucket",
                                                                  filename + "/execute",
                                                                  'ami-id',
                                                                  credentials['EC2_ACCESS_KEY'],
                                                                  credentials['EC2_SECRET_KEY'])
            else:
                prov_files[key.name] = backend.s3_helper.get_contents_from_file(key)

#        prov_info = backend.s3_helper.get_all_metadata_from_file("gdouglas.cs.ucsb.edu.research_bucket",
 #                                                                filename + "/execute",
  #                                                               credentials['EC2_ACCESS_KEY'],
   #                                                              credentials['EC2_SECRET_KEY'])

    #    exec_str  = backend.s3_helper.get_all_metadata_from_file("gdouglas.cs.ucsb.edu.research_bucket",
     #                                                            filename + "/execute",
      #                                                           credentials['EC2_ACCESS_KEY'],
       #                                                          credentials['EC2_SECRET_KEY'])
        context['ami_id'] = ami_id
        context['exec_str'] = exec_str
        context['input_files'] = prov_files

        return context