import json
import logging

from jupyterhub.handlers.base import BaseHandler
from tornado import web

from handlers.db_util import checkUserOrRaise
from handlers import stochss_kubernetes

log = logging.getLogger()

class JobInfoAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, infoPath):
        checkUserOrRaise(self)
        log.debug(infoPath)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        full_path = "/home/jovyan{0}".format(infoPath)
        json_data = stochss_kubernetes.read_from_pod(client, 
            user_pod, full_path) # Use cat to read json file
        self.write(json_data)


class RunJobAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, opt_type, data):
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        model_path, job_name = data.split('/<--GillesPy2Job-->/')
        args = "/home/jovyan/{0} {1} {2}".format(model_path, job_name, opt_type)
        log.warn('starting the job')
        exec_cmd = [ 'bash', '-c', '"run_job.py {0}"'.format(args) ]
        stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn('sent the job')


class SaveJobAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, opt_type, data):
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        model_path, job_name = data.split('/<--GillesPy2Job-->/')
        exec_cmd = [ "run_job.py", "/home/jovyan/{0}".format(model_path), job_name, opt_type ]
        log.warn(exec_cmd)
        stochss_kubernetes.run_script(exec_cmd, client, user_pod)


class JobStatusAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, data):
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        log.warn('getting the status of the job')
        exec_cmd = [ 'job_status.py', '/home/jovyan{0}'.format(data) ]
        status = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn('the status of the job is: ' + status)
        self.write(status.strip())


class PlotJobResultsAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, path):
        body = json.loads(self.get_query_argument(name='data'))
        checkUserOrRaise(self)
        user = self.current_user.name
        client, user_pod = stochss_kubernetes.load_kube_client(user)
        results_path = "/home/jovyan{0}/results/results.p".format(path)
        log.warn(self.request.body)
        plt_type = body['plt_type']
        plt_data = json.dumps(body['plt_data'])
        args = "{0} {1} {2}".format(results_path, plt_type, plt_data)
        exec_cmd = [ 'plot_results.py', args ]
        plt_fig = stochss_kubernetes.run_script(exec_cmd, client, user_pod)
        log.warn(plot_fig)
        self.write(plot_fig)

