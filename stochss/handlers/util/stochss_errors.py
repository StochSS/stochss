class StochSSAPIError(Exception):

    def __init__(self, status_code, reason, msg, trace):
        super().__init__()
        self.status_code = status_code
        self.reason = reason
        self.message = msg
        self.traceback = trace


class ModelNotFoundError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(404, "Model File Not Found", msg, trace)


class StochSSFileNotFoundError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(404, "StochSS File or Directory Not Found", msg, trace)


class StochSSPermissionsError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(403, "Permission Denied", msg, trace)


class ModelNotJSONFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(406, "Model Data Not JSON Format", msg, trace)


class FileNotJSONFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(406, "File Data Not JSON Format", msg, trace)


class JSONFileNotModelError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(406, "JSON File Not StochSS Model Format", msg, trace)


class PlotNotAvailableError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(406, "Plot Figure Not Available", msg, trace)


class StochSSWorkflowError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(403, "Workflow Errored on Run", msg, trace)


class StochSSWorkflowNotCompleteError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(403, "Workflow Run Not Complete", msg, trace)


class StochSSExportCombineError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(406, "No Completed Workflows Found", msg, trace)


class FileNotSBMLFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(406, "File Not SBML Format", msg, trace)


class ImporperMathMLFormatError(StochSSAPIError):

    def __init__(self, msg, trace=None):
        super().__init__(406, "Imporper Math-ML Format", msg, trace)
