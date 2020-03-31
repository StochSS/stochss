from notebook.utils import url_path_join
from .pages import *
from .file_browser import *
from .models import *
from .workflows import *


def get_page_handlers(route_start):
    handlers = [
        #
        ## Page Handlers
        #
        #('/stochss\/?$', HomeHandler), #TODO: move to hub
        ('/stochss/models\/?$', ModelBrowserHandler),
        ('/stochss/models/edit\/?(.+)?\/?', ModelEditorHandler),
        ('/stochss/workflow/selection\/?(.+)?\/?', WorkflowSelectionHandler),
        ('/stochss/workflow/edit\/?(.+)?\/?', WorkflowEditorHandler),
        #
        ## API Handlers
        #
        ("/stochss/models/browser-list(.+)\/?", ModelBrowserFileList), # TODO: /api, not /models
        ("/stochss/api/json-data/(.+)\/?", JsonFileAPIHandler),
        ("/stochss/api/models/run/(\w+)/(\w+)?\/?(.+)\/?", RunModelAPIHandler),
        ("/stochss/api/model/duplicate/(.+)\/?", DuplicateModelHandler),
        ("/stochss/api/models/to-notebook/(.+)\/?", ModelToNotebookHandler),
        ("/stochss/api/model/to-spatial/(.+)\/?", ConvertToSpatialAPIHandler),
        ("/stochss/api/model/to-sbml/(.+)\/?", ModelToSBMLAPIHandler),
        ("/stochss/api/spatial/to-model/(.+)\/?", ConvertToModelAPIHandler),
        ("/stochss/api/sbml/to-model/(.+)\/?", SBMLToModelAPIHandler),
        ("/stochss/api/workflow/notebook/(\w+)/(.+)\/?", WorkflowNotebookHandler),
        ("/stochss/api/workflow/save-workflow/(\w+)/(\w+)\/?(.+)\/?", SaveWorkflowAPIHandler),
        ("/stochss/api/workflow/run-workflow/(\w+)/(\w+)\/?(.+)\/?", RunWorkflowAPIHandler),
        ("/stochss/api/workflow/workflow-info/(.+)\/?", WorkflowInfoAPIHandler),
        ("/stochss/api/workflow/workflow-status/(.+)\/?", WorkflowStatusAPIHandler),
        ("/stochss/api/workflow/workflow-logs/(.+)\/?", WorkflowLogsAPIHandler),
        ("/stochss/api/workflow/plot-results/(.+)\/?", PlotWorkflowResultsAPIHandler),
        ("/stochss/api/file/upload\/?", UploadFileAPIHandler),
        ("/stochss/api/file/move/(.+)\/?", MoveFileAPIHandler),
        ("/stochss/api/file/delete/(.+)\/?", DeleteFileAPIHandler),
        ("/stochss/api/file/rename/(.+)\/?", RenameAPIHandler),
        ("/stochss/api/file/download/(.+)\/?", DownloadAPIHandler),
        ("/stochss/api/file/download-zip/(\w+)/(.+)\/?", DownloadZipFileAPIHandler),
        ("/stochss/api/directory/duplicate/(.+)\/?", DuplicateDirectoryHandler),
        ("/stochss/api/directory/create/(.+)\/?", CreateDirectoryHandler)
    ]
    full_handlers = list(map(lambda h: (url_path_join(route_start, h[0]), h[1]), handlers))
    return full_handlers


def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.

    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    host_pattern = '.*$'
    page_handlers = get_page_handlers(web_app.settings['base_url'])
    web_app.add_handlers(host_pattern, page_handlers)

