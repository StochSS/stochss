import selenium
import selenium.webdriver.common.action_chains as action_chains
import selenium.webdriver.common.touch_actions as touch_actions
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options

import launch_docker_container

url_and_container=launch_docker_container.launch()
stochss_url=url_and_container[0]
stochss_container=url_and_container[1]

print("Initializing browser.")

#add shortcut clicking methods

def click_element_by_id(self, key):
    element=self.find_element_by_id(key)
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
    text_box=browser.find_element_by_id("modelNameInput")
    text_box.send_keys(text)
    browser.click_element_by_class_and_text("ok-model-btn", "OK")

selenium.webdriver.firefox.webdriver.WebDriver.click_element_by_id = click_element_by_id
selenium.webdriver.firefox.webdriver.WebDriver.click_element_by_class_and_text = click_element_by_class_and_text
selenium.webdriver.firefox.webdriver.WebDriver.enter_modal_text = enter_modal_text

#initialize browser
options = Options()
options.headless=False
browser=Firefox(options=options)
browser.implicitly_wait(5)
browser.get(stochss_url)

browser.click_element_by_id("new-file-directory")
browser.click_element_by_id("new-directory")
text_box=browser.find_element_by_id("modelNameInput")
text_box.send_keys("test_dir")
browser.click_element_by_class_and_text(class_name="ok-model-btn", target_element_text="OK")


browser.click_element_by_id("new-file-directory")
browser.click_element_by_id("new-model")
browser.enter_modal_text("test_model")
browser.back()

#upload StochSS model
browser.click_element_by_id("new-file-directory")
browser.click_element_by_class_and_text("dropdown-item", "Upload StochSS Model")
browser.click_element_by_class_and_text("btn", "Cancel")

#upload SBML model
browser.click_element_by_id("new-file-directory")
browser.click_element_by_class_and_text("dropdown-item", "Upload SBML Model")
browser.click_element_by_class_and_text("btn", "Cancel")
#upload file
browser.click_element_by_id("new-file-directory")
browser.click_element_by_class_and_text("dropdown-item", "Upload File")
browser.click_element_by_class_and_text("btn", "Cancel")

#teardown
stochss_container.stop()
browser.close()
print("Test complete.")
