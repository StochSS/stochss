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

def find_by_text(passed_list, key):
    for item in passed_list:
        if (item.text==key):
            return item
    return None

def click_element_by_id(self, key):
    element=self.find_element_by_id(key)
    if (element):
        element.click()

def click_element_by_class_and_text(self, class_name, target_element_text):
    element_list=self.find_elements_by_class_name(class_name)
    target_element=find_by_text(element_list, target_element_text)
    if (target_element):
        target_element.click()

def enter_modal_text(self, text):
    text_box=self.find_element_by_id("modelNameInput")
    text_box.send_keys(text)
    self.click_element_by_class_and_text("ok-model-btn", "OK")

def new_file_directory_new_directory(self, dir_name):
    self.click_element_by_id("new-file-directory")
    self.click_element_by_id("new-directory")
    self.enter_modal_text(dir_name)

def new_file_directory_new_model(self, model_name):
    self.click_element_by_id("new-file-directory")
    self.click_element_by_id("new-model")
    self.enter_modal_text(model_name)

def wait_for_navigation_complete(self):
    return wait_for(function=self.element_has_gone_stale, element=self.find_element_by_id('navbar'))


