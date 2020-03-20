class StochSSAPIError(Exception):
    pass


class ModelNotFoundError(StochSSAPIError):

    def __init__(self, msg):
        self.status_code = 404
        self.reason = "Model File Not Found"
        self.message = msg


class StochSSFileNotFoundError(StochSSAPIError):

    def __init__(self, msg):
        self.status_code = 404
        self.reason = "StochSS File or Directory Not Found"
        self.message = msg


class StochSSPermissionsError(StochSSAPIError):

    def __init__(self, msg):
        self.status_code = 403
        self.reason = "Permission Denied"
        self.message = msg


class ModelNotJSONFormatError(StochSSAPIError):

    def __init__(self, msg):
        self.status_code = 406
        self.reason = "Model Data Not JSON Format"
        self.message = msg