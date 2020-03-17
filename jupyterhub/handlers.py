from jupyterhub.handlers.base import BaseHandler

class HomeHandler(BaseHandler):

  async def get(self):
    html = self.render_template("stochss-home.html")
    self.finish(html)
