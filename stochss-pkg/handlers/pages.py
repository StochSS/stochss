from notebook.base.handlers import IPythonHandler

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


class HomeHandler(PageHandler):
  async def get(self):
    self.render("stochss-home.html")


class ModelBrowserHandler(PageHandler):
  async def get(self):
    self.render("stochss-file-browser.html")


class ModelEditorHandler(PageHandler):
  async def get(self, model_name):
    self.render("stochss-model-editor.html")


class WorkflowSelectionHandler(PageHandler):
  async def get(self, model_name):
    self.render("stochss-workflow-selection.html")


class WorkflowEditorHandler(PageHandler):
  async def get(self, model_name):
    self.render("stochss-workflow-manager.html")


