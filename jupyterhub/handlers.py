from jupyterhub.handlers.base import BaseHandler

class HomeHandler(BaseHandler):

  async def get(self):
    html = self.render_template("stochss-home.html")
    self.finish(html)


class JobPresentationHandler(BaseHandler):

  async def get(self):
    html = self.render_template("stochss-job-presentation.html")
    self.finish(html)
