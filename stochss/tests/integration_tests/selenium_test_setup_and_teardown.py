import selenium
import selenium.webdriver.common.action_chains as action_chains
import selenium.webdriver.common.touch_actions as touch_actions
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options
import time
import launch_docker_container

def setup():
    url_and_container=launch_docker_container.launch()
    stochss_url=url_and_container[0]
    stochss_container=url_and_container[1]
    driver=initialize_driver()
    add_methods(Firefox)
    driver.get(stochss_url)
    return (driver, stochss_container)

def teardown(driver, container):
    driver.close()
    container.stop()
    time.sleep(3)
#add shortcut clicking methods


def initialize_driver(passed_options=None):
    options=passed_options
    if (passed_options is None):
        options = Options()
        options.headless=True
    driver=Firefox(options=options)
    driver.implicitly_wait(10)
    return driver

def add_methods(driver_class):
    import expanded_webdriver_methods
    method_list=dir(expanded_webdriver_methods)
    for method in method_list:
        setattr(driver_class, method, getattr(expanded_webdriver_methods, method))
