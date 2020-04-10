import os
from notebook.base.handlers import IPythonHandler
import logging

log = logging.getLogger('stochss')

class PageHandler(IPythonHandler):
  '''
  Base handler for rendering stochss pages.
  '''
  def get_template_path(self):
    '''
    Retrieve the location of stochss pages output by webpack.
    The html pages are located in the same directory as static assets.
    '''
    return self.settings['config']['NotebookApp']['extra_static_paths'][0]

  def get_server_path(self):
    try:
        server_path = os.environ['JUPYTERHUB_SERVICE_PREFIX']
    except:
        server_path = '/'

    return server_path


class HomeHandler(PageHandler):
  async def get(self):
    self.render("stochss-home.html", server_path=self.get_server_path())


class ModelBrowserHandler(PageHandler):
  async def get(self):
    self.render("stochss-file-browser.html", server_path=self.get_server_path())


class ModelEditorHandler(PageHandler):
  async def get(self, model_name):
    self.render("stochss-model-editor.html", server_path=self.get_server_path())


class WorkflowSelectionHandler(PageHandler):
  async def get(self, model_name):
    self.render("stochss-workflow-selection.html", server_path=self.get_server_path())


class WorkflowEditorHandler(PageHandler):
  async def get(self, model_name):
    self.render("stochss-workflow-manager.html", server_path=self.get_server_path())


