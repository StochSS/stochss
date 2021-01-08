'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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

'''
####################################################################################################
File System Errors
####################################################################################################
'''
class StochSSFileExistsError(StochSSAPIError):
    '''
    ################################################################################################
    StochSS File/Folder Exists API Handler Error
    ################################################################################################
    '''

    def __init__(self, msg, trace=None):
        '''
        Indicates that the file/folder with the given path already exists

        Attributes
        ----------
        msg : str
            Details on what caused the error
        trace : str
            Error traceback for the error
        '''
        super().__init__(406, "File Already Exists", msg, trace)