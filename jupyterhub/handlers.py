from jupyterhub.handlers.base import BaseHandler

class HomeHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for rendering jupyterhub home page.
    ################################################################################################
    '''
    async def get(self):
        html = self.render_template("stochss-home.html")
        self.finish(html)


class JobPresentationHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for rendering jupyterhub job presentation page.
    ################################################################################################
    '''
    async def get(self):
        html = self.render_template("stochss-job-presentation.html")
        self.finish(html)
