'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

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

def report_error(handler, log, err):
    '''
    Report a stochss error to the front end

    Attributes
    ----------
    handler : obj
        Jupyter Notebook API Handler
    log : obj
        StochSS log
    '''
    handler.set_status(err.status_code)
    error = {"Reason":err.reason, "Message":err.message}
    if err.traceback is None:
        trace = traceback.format_exc()
    else:
        trace = err.traceback
    log.error("Exception information: %s\n%s", error, trace)
    error['Traceback'] = trace
    handler.write(error)


class StochSSAPIError(Exception):
    '''
    ################################################################################################
    StochSS Base Api Handler Error
    ################################################################################################
    '''

    def __init__(self, status_code, reason, msg, trace):
        '''
        Base error for all stochss api errors

        Attributes
        ----------
        status_code : int
            XML request status code
        reason : str
            Reason for the error
        msg : str
            Details on what caused the error
        trace : str
            Error traceback for the error
        '''
        super().__init__()
        self.status_code = status_code
        self.reason = reason
        self.message = msg
        self.traceback = trace


####################################################################################################
# File System Errors
####################################################################################################

class StochSSFileNotFoundError(StochSSAPIError):
    '''
    ################################################################################################
    StochSS File/Folder Not Found API Handler Error
    ################################################################################################
    '''

    def __init__(self, msg, trace=None):
        '''
        Indicates that the file/folder with the given path does not exist

        Attributes
        ----------
        msg : str
            Details on what caused the error
        trace : str
            Error traceback for the error
        '''
        super().__init__(404, "StochSS File or Directory Not Found", msg, trace)

####################################################################################################
# Model Errors
####################################################################################################

class FileNotJSONFormatError(StochSSAPIError):
    '''
    ################################################################################################
    StochSS Model/Template Not In JSON Format
    ################################################################################################
    '''

    def __init__(self, msg, trace=None):
        '''
        Indicates that the model or template file is not in proper JSON format

        Attributes
        ----------
        msg : str
            Details on what caused the error
        trace : str
            Error traceback for the error
        '''
        super().__init__(406, "File Data Not JSON Format", msg, trace)

####################################################################################################
# Job Errors
####################################################################################################

class PlotNotAvailableError(StochSSAPIError):
    '''
    ################################################################################################
    StochSS Result Plot Not Found
    ################################################################################################
    '''

    def __init__(self, msg, trace=None):
        '''
        Indicates that the requested plot was not found in the plots.json file

        Attributes
        ----------
        msg : str
            Details on what caused the error
        trace : str
            Error traceback for the error
        '''
        super().__init__(406, "Plot Figure Not Available", msg, trace)


class StochSSJobResultsError(StochSSAPIError):
    '''
    ################################################################################################
    StochSS Job Results Error
    ################################################################################################
    '''

    def __init__(self, msg, trace=None):
        '''
        Indicates that the job results object was corrupted

        Attributes
        ----------
        msg : str
            Details on what caused the error
        trace : str
            Error traceback for the error
        '''
        super().__init__(500, "Job Results Error", msg, trace)
