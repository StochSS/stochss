class StochSSAPIError(Exception):

    def __init__(self, status_code, reason, msg):
        super().__init__()
        self.status_code = status_code
        self.reason = reason
        self.message = msg


class ModelNotFoundError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(404, "Model File Not Found", msg)


class StochSSFileNotFoundError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(404, "StochSS File or Directory Not Found", msg)


class StochSSPermissionsError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(403, "Permission Denied", msg)


class ModelNotJSONFormatError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(406, "Model Data Not JSON Format", msg)


class FileNotJSONFormatError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(406, "File Data Not JSON Format", msg)


class JSONFileNotModelError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(406, "JSON File Not StochSS Model Format", msg)


class PlotNotAvailableError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(406, "Plot Figure Not Available", msg)


class StochSSWorkflowError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(403, "Workflow Errored on Run", msg)


class StochSSWorkflowNotCompleteError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(403, "Workflow Run Not Complete", msg)


class StochSSExportCombineError(StochSSAPIError):

    def __init__(self, msg):
        super().__init__(406, "No Completed Workflows Found", msg)
