from notebook.utils import url_path_join
import logging
from .pages import *
from .file_browser import *
from .models import *
from .workflows import *
from .project import *
from .log import init_log

def get_page_handlers(route_start):
    handlers = [
        #
        ## Page Handlers
        #
        #('/stochss\/?$', HomeHandler), #TODO: move to hub
        ('/stochss/models\/?$', ModelBrowserHandler),
        ('/stochss/models/edit\/?', ModelEditorHandler),
        ('/stochss/workflow/selection\/?', WorkflowSelectionHandler),
        ('/stochss/workflow/edit\/?', WorkflowEditorHandler),
        ('/stochss/quickstart\/?', QuickstartHandler),
        #
        ## API Handlers
        #
        ("/stochss/api/file/browser-list\/?", ModelBrowserFileList),
        ("/stochss/api/file/upload\/?", UploadFileAPIHandler),
        ("/stochss/api/file/move\/?", MoveFileAPIHandler),
        ("/stochss/api/file/delete\/?", DeleteFileAPIHandler),
        ("/stochss/api/file/rename\/?", RenameAPIHandler),
        ("/stochss/api/file/download\/?", DownloadAPIHandler),
        ("/stochss/api/file/download-zip\/?", DownloadZipFileAPIHandler),
        ("/stochss/api/file/json-data\/?", JsonFileAPIHandler),
        ("/stochss/api/file/duplicate\/?", DuplicateModelHandler),
        ("/stochss/api/directory/duplicate\/?", DuplicateDirectoryHandler),
        ("/stochss/api/directory/create\/?", CreateDirectoryHandler),
        ("/stochss/api/spatial/to-model\/?", ConvertToModelAPIHandler),
        ("/stochss/api/sbml/to-model\/?", SBMLToModelAPIHandler),
        ("/stochss/api/model/to-notebook\/?", ModelToNotebookHandler),
        ("/stochss/api/model/to-spatial\/?", ConvertToSpatialAPIHandler),
        ("/stochss/api/model/to-sbml\/?", ModelToSBMLAPIHandler),
        ("/stochss/api/model/run\/?", RunModelAPIHandler),
        ("/stochss/api/project/new-project", NewProjectAPIHandler),
        ("/stochss/api/project/new-experiment", NewExperimentAPIHandler),
        ("/stochss/api/project/add-existing-model", AddExistingModelAPIHandler),
        ("/stochss/api/workflow/notebook\/?", WorkflowNotebookHandler),
        ("/stochss/api/workflow/load-workflow\/?", LoadWorkflowAPIHandler),
        ("/stochss/api/workflow/save-workflow\/?", SaveWorkflowAPIHandler),
        ("/stochss/api/workflow/run-workflow\/?", RunWorkflowAPIHandler),
        ("/stochss/api/workflow/workflow-status\/?", WorkflowStatusAPIHandler),
        ("/stochss/api/workflow/workflow-logs\/?", WorkflowLogsAPIHandler),
        ("/stochss/api/workflow/plot-results\/?", PlotWorkflowResultsAPIHandler),
        ("/stochss/api/workflow/duplicate\/?", DuplicateWorkflowAsNewHandler),
        ("/stochss/api/workflow/edit-model\/?", GetWorkflowModelPathAPIHandler),
        ("/stochss/api/workflow/save-plot\/?", SavePlotAPIHandler)
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
    init_log()
