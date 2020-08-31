import logging
from notebook.utils import url_path_join

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
        (r'/stochss/home\/?', UserHomeHandler),
        (r'/stochss/files\/?$', ModelBrowserHandler),
        (r'/stochss/models/edit\/?', ModelEditorHandler),
        (r'/stochss/workflow/selection\/?', WorkflowSelectionHandler),
        (r'/stochss/workflow/edit\/?', WorkflowEditorHandler),
        (r'/stochss/quickstart\/?', QuickstartHandler),
        (r'/stochss/project/browser\/?', ProjectBrowserHandler),
        (r'/stochss/project/manager\/?', ProjectManagerHandler),
        #
        ## API Handlers
        #
        (r"/stochss/api/file/browser-list\/?", ModelBrowserFileList),
        (r"/stochss/api/file/upload\/?", UploadFileAPIHandler),
        (r"/stochss/api/file/move\/?", MoveFileAPIHandler),
        (r"/stochss/api/file/delete\/?", DeleteFileAPIHandler),
        (r"/stochss/api/file/rename\/?", RenameAPIHandler),
        (r"/stochss/api/file/download\/?", DownloadAPIHandler),
        (r"/stochss/api/file/download-zip\/?", DownloadZipFileAPIHandler),
        (r"/stochss/api/file/json-data\/?", JsonFileAPIHandler),
        (r"/stochss/api/file/duplicate\/?", DuplicateModelHandler),
        (r"/stochss/api/directory/duplicate\/?", DuplicateDirectoryHandler),
        (r"/stochss/api/directory/create\/?", CreateDirectoryHandler),
        (r"/stochss/api/spatial/to-model\/?", ConvertToModelAPIHandler),
        (r"/stochss/api/sbml/to-model\/?", SBMLToModelAPIHandler),
        (r"/stochss/api/model/to-notebook\/?", ModelToNotebookHandler),
        (r"/stochss/api/model/to-spatial\/?", ConvertToSpatialAPIHandler),
        (r"/stochss/api/model/to-sbml\/?", ModelToSBMLAPIHandler),
        (r"/stochss/api/model/run\/?", RunModelAPIHandler),
        (r"/stochss/api/project/new-project\/?", NewProjectAPIHandler),
        (r"/stochss/api/project/load-project\/?", LoadProjectAPIHandler),
        (r"/stochss/api/project/load-browser\/?", LoadProjectBrowserAPIHandler),
        (r"/stochss/api/project/new-workflow-group\/?", NewWorkflowGroupAPIHandler),
        (r"/stochss/api/project/add-existing-model\/?", AddExistingModelAPIHandler),
        (r"/stochss/api/project/add-existing-workflow\/?", AddExistingWorkflowAPIHandler),
        (r"/stochss/api/project/extract-model\/?", ExtractModelAPIHandler),
        (r"/stochss/api/project/extract-workflow\/?", ExtractWorkflowAPIHandler),
        (r"/stochss/api/project/empty-trash\/?", EmptyTrashAPIHandler),
        (r"/stochss/api/project/export-combine\/?", ExportAsCombineAPIHandler),
        (r"/stochss/api/project/meta-data\/?", ProjectMetaDataAPIHandler),
        (r"/stochss/api/project/save-annotation\/?", UpdateAnnotationAPIHandler),
        (r"/stochss/api/workflow/notebook\/?", WorkflowNotebookHandler),
        (r"/stochss/api/workflow/load-workflow\/?", LoadWorkflowAPIHandler),
        (r"/stochss/api/workflow/save-workflow\/?", SaveWorkflowAPIHandler),
        (r"/stochss/api/workflow/run-workflow\/?", RunWorkflowAPIHandler),
        (r"/stochss/api/workflow/workflow-status\/?", WorkflowStatusAPIHandler),
        (r"/stochss/api/workflow/workflow-logs\/?", WorkflowLogsAPIHandler),
        (r"/stochss/api/workflow/plot-results\/?", PlotWorkflowResultsAPIHandler),
        (r"/stochss/api/workflow/duplicate\/?", DuplicateWorkflowAsNewHandler),
        (r"/stochss/api/workflow/edit-model\/?", GetWorkflowModelPathAPIHandler),
        (r"/stochss/api/workflow/save-plot\/?", SavePlotAPIHandler),
        (r"/stochss/api/workflow/save-annotation\/?", SaveAnnotationAPIHandler)
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
