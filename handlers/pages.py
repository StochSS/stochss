import tornado.web as web
from jupyterhub.handlers.base import BaseHandler

import logging
log = logging.getLogger()

class HomeHandler(BaseHandler):

  async def get(self):
    html = self.render_template("stochss-home.html")
    self.finish(html)


class ModelBrowserHandler(BaseHandler):

  @web.authenticated
  async def get(self):
    html = self.render_template("stochss-file-browser.html")
    self.finish(html)


class ModelEditorHandler(BaseHandler):
  @web.authenticated
  async def get(self, model_name):
    html = self.render_template("stochss-model-editor.html")
    self.finish(html)


class WorkflowEditorHandler(BaseHandler):
  @web.authenticated
  async def get(self, model_name):
    html = self.render_template("stochss-workflow-manager.html")
    self.finish(html)
