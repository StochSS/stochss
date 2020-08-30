import time
import selenium

#utility
def wait_for(function, timeout=5, **kwargs):
    start_time=time.time()
    while (time.time() < start_time+timeout):
        if (function(**kwargs)):
            return True
        else:
            time.sleep(0.1)
    raise Exception(
            'Timeout waiting for {}'.format(function.__name__)
            )

def element_has_gone_stale(self, element):
    try:
        element.is_enabled()
        return False
    except selenium.common.exceptions.StaleElementReferenceException:
        return True

def wait_for_navigation_complete(self):
    wait_for(function=self.element_has_gone_stale, element=self.find_element_by_id('navbar'))
    time.sleep(3)

