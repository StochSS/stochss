from stochssapp import BaseHandler
from simulation import StochKitJobWrapper
from sensitivity import SensitivityJobWrapper
import backend.s3_helper

EC2_RATES = {
    't1.micro' : 0.02
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
            context['filename'] = "output/" + job.cloudDatabaseID + ".tar"
        else:
            context['filename'] = "output/" + job.pid + ".tar"

        context['jobname'] = job.jobName
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

        context['running_time'] = tags['running-time']
        context['size'] = tags['size']
        context['instance_type'] = tags['instance-type']

        compute_cost = float(tags['running-time']) * EC2_RATES[tags['instance-type']] / 3600
        storage_cost = int(tags['size']) * (0.03/30) / (1024*1024*1024)

        context['compute_cost'] = "%0.2f" % compute_cost
        context['storage_cost'] = "%0.2f" % storage_cost

        return context