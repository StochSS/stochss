
def init_log():
    import logging
    log = logging.getLogger('tornado.log.stochss')
    # Create console handler and set level to debug
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter('[%(asctime)s StochSS][%(levelname)s] %(message)s')
    ch.setFormatter(formatter)
    # add ch to StochSS logger
    log.addHandler(log)

def get_log():
    import logging
    logging.getLogger('tornado.log.stochss')    
