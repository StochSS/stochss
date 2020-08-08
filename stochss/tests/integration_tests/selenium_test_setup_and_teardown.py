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
    browser=initialize_browser()
    add_methods(Firefox)
    browser.get(stochss_url)
    return (browser, stochss_container)

def teardown(browser, container):
    browser.close()
    container.stop()
    time.sleep(3)
#add shortcut clicking methods


def initialize_browser(passed_options=None):
    options=passed_options
    if (passed_options is None):
        options = Options()
        options.headless=False
    browser=Firefox(options=options)
    browser.implicitly_wait(10)
    return browser

def add_methods(browser_class):
    import expanded_webdriver_methods
    method_list=dir(expanded_webdriver_methods)
    for method in method_list:
        setattr(browser_class, method, getattr(expanded_webdriver_methods, method))
