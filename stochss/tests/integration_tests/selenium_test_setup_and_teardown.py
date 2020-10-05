import selenium
import selenium.webdriver.common.action_chains as action_chains
import selenium.webdriver.common.touch_actions as touch_actions
import os
import sys
import time
import launch_docker_container

def setup():
    browser_string=get_browser_string();
    url_and_container=launch_docker_container.launch()
    stochss_url=url_and_container[0]
    stochss_container=url_and_container[1]
    driver=initialize_driver(browser_string)
    add_methods(driver)
    driver.get(stochss_url)
    return (driver, stochss_container)

def teardown(driver, container):
    driver.close()
    container.stop()
    time.sleep(3)
#add shortcut clicking methods

def get_browser_string():
    if os.environ.get('TEST_BROWSER') is not None:
        return os.environ.get('TEST_BROWSER')
    else:
        return "Firefox"

def initialize_driver(browser_string="Firefox"):
    headless = True
    print(browser_string)
    if browser_string=="Firefox":
        from selenium.webdriver import Firefox
        from selenium.webdriver.firefox.options import Options
        options = Options()
        options.headless=headless
        driver=Firefox(options=options)
    if browser_string=="Safari":
        from selenium.webdriver import Safari
        from selenium.webdriver.safari.options import Options
        options = Options()
        options.headless=headless
        driver=Safari(options=options)
    if browser_string=="Chrome"
        from selenium.webdriver import Chrome
        from selenium.webdriver.chrome.options import Options
        options = Options()
        options.headless=headless
        driver=Chrome(options=options)
#   driver=Firefox(options=options)
    driver.implicitly_wait(10)
    return driver

def add_methods(driver_class):
    import expanded_webdriver_methods
    method_list=dir(expanded_webdriver_methods)
    for method in method_list:
        setattr(driver_class, method, getattr(expanded_webdriver_methods, method))
