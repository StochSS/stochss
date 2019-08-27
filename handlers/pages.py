import tornado.web as web
from jupyterhub.handlers.base import BaseHandler

import logging
log = logging.getLogger()

class HomeHandler(BaseHandler):

  @web.authenticated
  async def get(self):
    html = self.render_template("stochss-home.html")
    self.finish(html)


class ModelBrowserHandler(BaseHandler):

  @web.authenticated
  async def get(self):
    html = self.render_template("stochss-model-browser.html")
    self.finish(html)


class ModelEditorHandler(BaseHandler):
  @web.authenticated
  async def get(self, model_name):
    html = self.render_template("stochss-model-editor.html")
    self.finish(html)

