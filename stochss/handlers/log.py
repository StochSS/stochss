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

import logging
from tornado.log import LogFormatter

log = logging.getLogger('stochss')

def init_log():
    '''
    Initialize the StochSS logger

    Attributes
    ----------
    '''
    relocate_old_logs()
    setup_stream_handler()
    setup_file_handler()
    log.setLevel(logging.DEBUG)
    log.propagate = False


def relocate_old_logs():
    '''
    Move the user log file to its new location (/var/log).
    '''
    src = os.path.join(os.path.expanduser("~"), ".user-logs.txt")
    if not os.path.exists(src):
        return
    
    src_size = os.path.getsize(src)
    if src_size < 500000:
        os.rename(src, "/var/log/user-logs.txt")
        return
    
    with open(src, "r") as log_file:
        logs = log_file.read().rstrip().split('\n')
    os.remove(src)
    
    mlog_size = src_size % 500000
    mlogs = [logs.pop()]
    while sys.getsizeof("\n".join(mlogs)) < mlog_size:
        mlogs.insert(0, logs.pop())
    with open("/var/log/.user-logs.txt", "w") as main_log_file:
        main_log_file.write("\n".join(mlogs))

    blogs = [logs.pop()]
    nlog_size = sys.getsizeof(f"\n{logs[-1]}")
    while logs and sys.getsizeof("\n".join(blogs)) + nlog_size < 500000:
        blogs.insert(0, logs.pop())
        nlog_size = sys.getsizeof(f"\n{logs[-1]}")
    with open("/var/log/.user-logs.txt.bak", "w") as backup_log_file:
        backup_log_file.write("\n".join(blogs))


def setup_stream_handler():
    '''
    Initialize the StochSS stream handler

    Attributes
    ----------
    '''
    handler = logging.StreamHandler()
    fmt = '%(color)s[%(levelname)1.1s %(asctime)s StochSS '
    fmt += '%(filename)s:%(lineno)d]%(end_color)s %(message)s'
    formatter = LogFormatter(fmt=fmt, datefmt='%H:%M:%S', color=True)
    handler.setFormatter(formatter)
    handler.setLevel(logging.WARNING)
    log.addHandler(handler)


def setup_file_handler():
    '''
    Initialize the StochSS file handler

    Attributes
    ----------
    '''
    def namer(name):
        '''
        Namer function for the RotatingFileHandler

        Attributes
        ----------
        name : str
            Default name of the log file.
        '''
        return f"{name}.bak"

    def rotator(src, dst):
        '''
        Rotator function for the RotatingFileHandler

        Attributes
        ----------
        src : str
            Path to the main log file.
        dst : str
            Path to the backup log file.
        '''
        if os.path.exists(dst):
            os.remove(dst)
        os.rename(src, dst)
        os.remove(src)

    handler = logging.RotatingFileHandler("/var/log/.user-logs.txt",
                                          maxBytes=500000, backupCount=1)
    handler.namer = namer
    handler.rotator = rotator
    fmt = '%(asctime)s$ %(message)s'
    formatter = LogFormatter(fmt=fmt, datefmt="%b %d, %Y  %I:%M %p UTC")
    handler.setFormatter(formatter)
    handler.setLevel(logging.INFO)
    log.addHandler(handler)
