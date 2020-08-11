class StochSSAPIError(Exception):
    pass


class ModelNotFoundError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 404
        self.traceback = trace
        self.reason = "Model File Not Found"
        self.message = msg


class StochSSFileNotFoundError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 404
        self.traceback = trace
        self.reason = "StochSS File or Directory Not Found"
        self.message = msg


class StochSSPermissionsError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 403
        self.traceback = trace
        self.reason = "Permission Denied"
        self.message = msg


class ModelNotJSONFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 406
        self.traceback = trace
        self.reason = "Model Data Not JSON Format"
        self.message = msg


class FileNotJSONFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 406
        self.traceback = trace
        self.reason = "File Data Not JSON Format"
        self.message = msg


class JSONFileNotModelError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 406
        self.traceback = trace
        self.reason = "JSON File Not StochSS Model Format"
        self.message = msg


class PlotNotAvailableError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 406
        self.traceback = trace
        self.reason = "Plot Figure Not Available"
        self.message = msg


class StochSSWorkflowError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 403
        self.traceback = trace
        self.reason = "Workflow Errored on Run"
        self.message = msg


class StochSSWorkflowNotCompleteError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 403
        self.traceback = trace
        self.reason = "Workflow Run Not Complete"
        self.message = msg


class FileNotSBMLFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 406
        self.traceback = trace
        self.reason = "File Not SBML Format"
        self.message = msg


class ImporperMathMLFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        self.status_code = 406
        self.traceback = trace
        self.reason = "Imporper Math-ML Format"
        self.message = msg
