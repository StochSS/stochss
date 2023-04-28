'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2023 StochSS developers.

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
import traceback

def report_error(handler, log, error):
    '''
    Report a server error to the client.

    :param handler: API handler responsible for the server request.
    :type handler: notebook.base.handlers.APIHandler

    :param log: Stochss logger.
    :type log: obj

    :param error: Error to be reported
    :type error: stochss.utilities.server_error.APIError
    '''
    handler.set_status(error.status_code)
    response = {'reason': error.reason, 'message': error.message, 'traceback': error.traceback}
    log.error("Exception information: %s\n%s", response, error.traceback)
    handler.write(response)

class APIError(Exception):
    '''
    Base api error for StochSS.

    :param status_code: XML request status code.
    :type status_code: int

    :param reason: Reason for the error.
    :type reason: str

    :param message: Details on what caused the error.
    :type message: str

    :param trace: Stack trace for the original error.
    :type trace: str
    '''
    def __init__(self, status_code, reason, message, trace):
        super().__init__()

        if trace is None:
            trace = traceback.format_exc()

        self.status_code = status_code
        self.reason = reason
        self.message = message
        self.traceback = trace

    def __str__(self):
        lines = [
            f"{type(self).__name__}", f"\tStatus Code: {self.status_code}", f"\tReason: {self.reason}"
        ]
        words = self.message.split(" ")
        line = "\tMessage:"
        for word in words:
            if len(f"{line} {word}") > 120:
                lines.append(line)
                line = "\t    "
            line = f"{line} {word}"
        lines.extend([line, "\tTraceback:"])
        for st_line in self.traceback:
            lines.append(f"\t    {st_line}")
        return "\n".join(lines)

####################################################################################################
# File System Errors
####################################################################################################
class FileExistsAPIError(APIError):
    '''
    API handler error for FileExistsError.

    :param message: Details on what caused the error.
    :type message: str

    :param trace: Stack trace for the original error.
    :type trace: str
    '''
    def __init__(self, message, trace):
        super().__init__(406, "File Already Exists", message, trace)

class FileNotFoundAPIError(APIError):
    '''
    API handler error for FileNotFoundError.

    :param message: Details on what caused the error.
    :type message: str

    :param trace: Stack trace for the original error.
    :type trace: str
    '''
    def __init__(self, message, trace):
        super().__init__(404, "File or Directory Not Found", message, trace)

class PermissionsAPIError(APIError):
    '''
    API handler error for PermissionsError.

    :param message: Details on what caused the error.
    :type message: str

    :param trace: Stack trace for the original error.
    :type trace: str
    '''
    def __init__(self, message, trace):
        super().__init__(403, "Permission Denied", message, trace)

####################################################################################################
# Object Interaction Errors
####################################################################################################
class JSONDecodeAPIError(APIError):
    '''
    API handler error for json.decoder.JSONDecodeError.

    :param message: Details on what caused the error.
    :type message: str

    :param trace: Stack trace for the original error.
    :type trace: str
    '''
    def __init__(self, message, trace):
        super().__init__(406, "File Data Not JSON Format", message, trace)

class DomainAPIError(APIError):
    '''
    API handler error for DomainError.

    :param message: Details on what caused the error.
    :type message: str

    :param trace: Stack trace for the original error.
    :type trace: str
    '''
    def __init__(self, message, trace=None):
        super().__init__(406, "Domain Error", message, trace)
