import sys
import os
import time
import re
import docker
import selenium
import selenium.webdriver.common.action_chains as action_chains
import selenium.webdriver.common.touch_actions as touch_actions
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options
print("Loading environment variables.")
with open('.env','r') as environment_file:
    docker_environment=environment_file.read().split('\n')
    docker_environment= ' '.join(docker_environment).split()

docker_client=docker.from_env()
print("Launching stochss container.")
stochss_container = docker_client.containers.run('stochss-lab:latest', name="stochss-lab", auto_remove=True, environment=docker_environment, ports={8888:8888}, detach=True)
time.sleep(5)
print("Extracting jupyter notebooks url.")
jupyter_url_generator=stochss_container.exec_run("jupyter notebook list", demux=False)
url_regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
jupyter_url_bytes = jupyter_url_generator.output
jupyter_url_string = jupyter_url_bytes.decode("utf-8")
jupyter_url_sequence = re.findall(url_regex,jupyter_url_string)[0]
jupyter_url=jupyter_url_sequence[0]
print("Jupyter url:", jupyter_url)
print("Initializing browser.")

#add shortcut clicking methods

def click_element_by_id(self, key):
    element=self.find_element_by_id(key)
    element.click()

def click_element_by_class_and_text(self, class_name, target_element_text):
    target_element = None
    element_list=self.find_elements_by_class_name(class_name)
    for item in element_list:
        if (element.text==target_element_text):
            target_element=element
    if (target_element):
        target_element.click()

selenium.webdriver.firefox.webdriver.WebDriver.click_element_by_id = click_element_by_id
selenium.webdriver.firefox.webdriver.WebDriver.click_element_by_class_and_text = click_element_by_class_and_text

#initialize browser
options = Options()
options.headless=False
browser=Firefox(options=options)
browser.implicitly_wait(5)
browser.get(jupyter_url)

#create new directory test_dir at root level
print("Creating new directory.")
buttons = browser.find_elements_by_class_name('btn')
buttons[1].click()
dropdown_menu = browser.find_elements_by_class_name('dropdown-item')
dropdown_menu[0].click()
new_dir_text_box = browser.find_element_by_id('modelNameInput')
new_dir_text_box.send_keys('test_dir')
ok_button = browser.find_element_by_class_name('ok-model-btn')
ok_button.click()


#select test_dir
jstree_anchors = browser.find_elements_by_class_name('jstree-anchor')
jstree_anchors[1].click()

#expand dir Examples
print("Expanding tree.")
jstree_ocls = browser.find_elements_by_class_name('jstree-ocl')
jstree_ocls[2].click()

#expand dir Brusselator
jstree_ocls = browser.find_elements_by_class_name('jstree-ocl')
jstree_ocls[3].click()

print("Moving Brusselator.mdl.")
#identify brusselator-copy
jstree_files = browser.find_elements_by_class_name('jstree-file')
brusselator = jstree_files[0]
#identify test_dir
jstree_icons = browser.find_elements_by_class_name('jstree-icon')
test_dir = jstree_icons[3]
actions = action_chains.ActionChains(browser)
actions.drag_and_drop(brusselator, test_dir)
actions.perform()

#expand test_dir
jstree_ocls = browser.find_elements_by_class_name('jstree-ocl')
jstree_ocls[1].click()
jstree_ocls = browser.find_elements_by_class_name('jstree-ocl')
jstree_ocls[1].click()

print("Confirming successful move.")
#select brusselator-copy.mdl in new location
jstree_leaves = browser.find_elements_by_class_name('jstree-leaf')
jstree_leaves[0].click()
assert jstree_leaves[0].text == " Brusselator.mdl"

print("Testing complete.")
