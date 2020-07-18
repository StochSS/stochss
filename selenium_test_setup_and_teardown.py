import selenium
import selenium.webdriver.common.action_chains as action_chains
import selenium.webdriver.common.touch_actions as touch_actions
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options

import launch_docker_container

def setup():
    print("Beginning setup.")
    print("Launching docker container.")
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

#add shortcut clicking methods


def initialize_browser(passed_options=None):
    options=passed_options
    if (passed_options is None):
        options = Options()
        options.headless=False
    browser=Firefox(options=options)
    browser.implicitly_wait(5)
    return browser

def add_methods(browser_class):
    browser_class.click_element_by_id = click_element_by_id
    browser_class.click_element_by_class_and_text = click_element_by_class_and_text
    browser_class.enter_modal_text = enter_modal_text


def click_element_by_id(self, key):
    element=self.find_element_by_id(key)
    if (element):
        element.click()

def click_element_by_class_and_text(self, class_name, target_element_text):
    element_list=self.find_elements_by_class_name(class_name)
    target_element=find_in_list(element_list, target_element_text)
    if (target_element):
        target_element.click()

def find_in_list(passed_list, key):
    for item in passed_list:
        if (item.text==key):
            return item
    return None

def enter_modal_text(self, text):
    text_box=self.find_element_by_id("modelNameInput")
    text_box.send_keys(text)
    self.click_element_by_class_and_text("ok-model-btn", "OK")
