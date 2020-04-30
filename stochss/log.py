import logging
from tornado.log import LogFormatter

log = logging.getLogger('stochss')

def init_log():
    ch = logging.StreamHandler()
    formatter = LogFormatter(fmt='%(color)s[%(levelname)1.1s %(asctime)s StochSS %(filename)s:%(lineno)d]%(end_color)s %(message)s', datefmt='%H:%M:%S')
    ch.setFormatter(formatter)
    log.setLevel(logging.WARNING)
    log.addHandler(ch)
    log.propagate = False
    
