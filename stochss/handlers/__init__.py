'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

import logging
from notebook.utils import url_path_join

from .pages import *
from .file_browser import *
from .models import *
from .workflows import *
from .project import *
from .log import init_log

def get_page_handlers(route_start):
    '''
    Get the StochSS page handlers

    Attributes
    ----------
    route_starts : str
        The base url for the web app
    '''
    handlers = [
        #
        ## Page Handlers
        #
        (r'/stochss/home\/?', UserHomeHandler),
        (r'/stochss/files\/?$', ModelBrowserHandler),
        (r'/stochss/models/edit\/?', ModelEditorHandler),
        (r'/stochss/domain/edit\/?', DomainEditorHandler),
        (r'/stochss/workflow/selection\/?', WorkflowSelectionHandler),
        (r'/stochss/workflow/edit\/?', WorkflowEditorHandler),
        (r'/stochss/quickstart\/?', QuickstartHandler),
        (r'/stochss/project/manager\/?', ProjectManagerHandler),
        (r'/stochss/loading-page\/?', LoadingPageHandler),
        (r'/stochss/multiple-plots\/?', MultiplePlotsHandler),
        (r'/stochss/example-library\/?', ExampleLibraryHandler),
        #
        ## API Handlers
        #
        (r'/stochss/api/user-logs\/?', UserLogsAPIHandler),
        (r'/stochss/api/example-library\/?', ImportFromLibrary),
        (r'/stochss/api/clear-user-logs\/?', ClearUserLogsAPIHandler),
        (r"/stochss/api/file/browser-list\/?", ModelBrowserFileList),
        (r"/stochss/api/file/upload\/?", UploadFileAPIHandler),
        (r"/stochss/api/file/upload-from-link\/?", UploadFileFromLinkAPIHandler),
        (r"/stochss/api/file/move\/?", MoveFileAPIHandler),
        (r"/stochss/api/file/empty-trash\/?", EmptyTrashAPIHandler),
        (r"/stochss/api/file/delete\/?", DeleteFileAPIHandler),
        (r"/stochss/api/file/rename\/?", RenameAPIHandler),
        (r"/stochss/api/file/download\/?", DownloadAPIHandler),
        (r"/stochss/api/file/download-zip\/?", DownloadZipFileAPIHandler),
        (r"/stochss/api/file/json-data\/?", JsonFileAPIHandler),
        (r"/stochss/api/file/duplicate\/?", DuplicateModelHandler),
        (r"/stochss/api/file/unzip\/?", UnzipFileAPIHandler),
        (r"/stochss/api/file/presentations\/?", PresentationListAPIHandler),
        (r"/stochss/api/notebook/presentation\/?", NotebookPresentationAPIHandler),
        (r"/stochss/api/directory/duplicate\/?", DuplicateDirectoryHandler),
        (r"/stochss/api/directory/create\/?", CreateDirectoryHandler),
        (r"/stochss/api/spatial/to-model\/?", ConvertToModelAPIHandler),
        (r"/stochss/api/sbml/to-model\/?", SBMLToModelAPIHandler),
        (r"/stochss/api/model/to-notebook\/?", ModelToNotebookHandler),
        (r"/stochss/api/model/to-spatial\/?", ConvertToSpatialAPIHandler),
        (r"/stochss/api/model/to-sbml\/?", ModelToSBMLAPIHandler),
        (r"/stochss/api/model/run\/?", RunModelAPIHandler),
        (r"/stochss/api/model/exists\/?", ModelExistsAPIHandler),
        (r"/stochss/api/model/presentation\/?", ModelPresentationAPIHandler),
        (r"/stochss/api/model/new-bc\/?", CreateNewBoundCondAPIHandler),
        (r"/stochss/api/spatial-model/domain-list\/?", LoadExternalDomains),
        (r"/stochss/api/spatial-model/types-list\/?", LoadParticleTypesDescriptions),
        (r"/stochss/api/spatial-model/domain-plot\/?", LoadDomainAPIHandler),
        (r"/stochss/api/spatial-model/load-domain\/?", LoadDomainEditorAPIHandler),
        (r"/stochss/api/spatial-model/particle-types\/?", GetParticlesTypesAPIHandler),
        (r"/stochss/api/spatial-model/import-mesh\/?", ImportMeshAPIHandler),
        (r"/stochss/api/spatial-model/3d-domain\/?", Create3DDomainAPIHandler),
        (r"/stochss/api/spatial-model/fill-geometry\/?", FillGeometryAPIHandler),
        (r"/stochss/api/project/new-project\/?", NewProjectAPIHandler),
        (r"/stochss/api/project/load-project\/?", LoadProjectAPIHandler),
        (r"/stochss/api/project/load-browser\/?", LoadProjectBrowserAPIHandler),
        (r"/stochss/api/project/new-model\/?", NewModelAPIHandler),
        (r"/stochss/api/project/add-existing-model\/?", AddExistingModelAPIHandler),
        (r"/stochss/api/project/extract-model\/?", ExtractModelAPIHandler),
        (r"/stochss/api/project/extract-workflow\/?", ExtractWorkflowAPIHandler),
        (r"/stochss/api/project/export-combine\/?", ExportAsCombineAPIHandler),
        (r"/stochss/api/project/meta-data\/?", ProjectMetaDataAPIHandler),
        (r"/stochss/api/project/save-annotation\/?", UpdateAnnotationAPIHandler),
        (r"/stochss/api/project/update-format\/?", UpadteProjectAPIHandler),
        (r"/stochss/api/workflow/notebook\/?", WorkflowNotebookHandler),
        (r"/stochss/api/workflow/new\/?", NewWorkflowAPIHandler),
        (r"/stochss/api/workflow/load-workflow\/?", LoadWorkflowAPIHandler),
        (r"/stochss/api/workflow/init-job\/?", InitializeJobAPIHandler),
        (r"/stochss/api/workflow/run-job\/?", RunWorkflowAPIHandler),
        (r"/stochss/api/workflow/workflow-status\/?", WorkflowStatusAPIHandler),
        (r"/stochss/api/workflow/plot-results\/?", PlotWorkflowResultsAPIHandler),
        (r"/stochss/api/workflow/duplicate\/?", DuplicateWorkflowAsNewHandler),
        (r"/stochss/api/workflow/edit-model\/?", GetWorkflowModelPathAPIHandler),
        (r"/stochss/api/workflow/save-plot\/?", SavePlotAPIHandler),
        (r"/stochss/api/workflow/save-annotation\/?", SaveAnnotationAPIHandler),
        (r"/stochss/api/workflow/update-format\/?", UpadteWorkflowAPIHandler),
        (r"/stochss/api/job/presentation\/?", JobPresentationAPIHandler),
        (r"/stochss/api/job/csv\/?", DownloadCSVZipAPIHandler)
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
