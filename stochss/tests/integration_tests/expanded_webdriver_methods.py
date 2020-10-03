import time
import selenium

#utility
def wait_for(self, function, timeout=5, **kwargs):
    start_time=time.time()
    while (time.time() < start_time+timeout):
        if (function(self, **kwargs)):
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

def go_back_and_wait(driver):

    element=driver.find_element_by_id('navbar')
    driver.back()
    wait_for(driver, function=driver.element_has_gone_stale, element=element)
    time.sleep(3)

