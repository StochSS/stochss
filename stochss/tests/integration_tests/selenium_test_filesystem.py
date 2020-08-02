import unittest
import time
import os
import selenium_test_setup_and_teardown
from selenium import webdriver

class TestFilesystem(unittest.TestCase):

    def setUp(self):
        self.browser_and_container = selenium_test_setup_and_teardown.setup()
        self.browser=self.browser_and_container[0]
        self.stochss_container=self.browser_and_container[1]
   
    def tearDown(self):
        selenium_test_setup_and_teardown.teardown(self.browser, self.stochss_container)

    def test_filesystem(self):

        self.browser.new_file_directory_new_directory("test_dir")
        
        self.browser.new_file_directory_new_model("test_model")
        self.browser.back()
        self.browser.wait_for_navigation_complete()
        
        #confirm create file and create directory successful
        jstree_nodes=self.browser.find_elements_by_class_name('jstree-node')
        assert (jstree_nodes[0].text==(" /" + "\n" + " test_dir" + "\n" + " test_model.mdl" + "\n" + " Examples"))
        stochss_dir_contents = (self.stochss_container.exec_run("python -c \"import os;print(os.listdir())\"", demux=False)[1])
        assert stochss_dir_contents == b"['.bash_logout', '.profile', '.bashrc', '.cache', 'test_dir', 'test_model.mdl', '.local', 'Examples', '.jupyter', '.conda', '.config', '.empty']\n"
        
        #test upload StochSS model
        self.browser.click_element_by_id("new-file-directory")
        self.browser.click_element_by_class_and_text("dropdown-item", "Upload StochSS Model")
        title=self.browser.find_element_by_class_name("modal-title")
        assert title.text=='Upload a model'
        self.browser.click_element_by_class_and_text("btn", "Cancel")
        
        #test upload SBML model
        self.browser.click_element_by_id("new-file-directory")
        self.browser.click_element_by_class_and_text("dropdown-item", "Upload SBML Model")
        title=self.browser.find_element_by_class_name("modal-title")
        assert title.text=='Upload a model'
        self.browser.click_element_by_class_and_text("btn", "Cancel")

        #test upload file
        self.browser.click_element_by_id("new-file-directory")
        self.browser.click_element_by_class_and_text("dropdown-item", "Upload File")
        title=self.browser.find_element_by_class_name("modal-title")
        assert title.text=='Upload a file'
        self.browser.click_element_by_class_and_text("btn", "Cancel")

        #test collapse/expand jstree
        ocls = self.browser.find_elements_by_class_name("jstree-ocl")
        ocls[0].click()
        jstree_nodes=self.browser.find_elements_by_class_name("jstree-node")
        print(len(jstree_nodes))
        assert 1 == len(jstree_nodes)
        ocls[0].click()
        jstree_nodes=self.browser.find_elements_by_class_name("jstree-node")
        assert 4 == len(jstree_nodes)

        #test Actions For <node> button
        #test Edit (model)
        jstree_ocls=self.browser.find_elements_by_class_name("jstree-ocl")
        jstree_ocls[2].click()
        self.browser.click_element_by_id("options-for-node")
        menu=self.browser.find_elements_by_class_name("vakata-contextmenu-sep")
        menu[0].click()
        title=self.browser.find_element_by_class_name("modal-title")
        assert title.text=='Default Species Mode (required)'
        self.browser.back()
        self.browser.wait_for_navigation_complete()
        #test New Workflow
        jstree_ocls=self.browser.find_elements_by_class_name("jstree-ocl")
        jstree_ocls[2].click()
        self.browser.click_element_by_id("options-for-node")
        menu=self.browser.find_elements_by_class_name("vakata-contextmenu-sep")
        menu[1].click()
        table=self.browser.find_element_by_class_name("table")
        assert table.text=='StochSS Workflows\nEnsemble Simulation\nParameter Sweep'
        self.browser.back()
        self.browser.wait_for_navigation_complete()

        #test Convert To Notebook
        jstree_ocls=self.browser.find_elements_by_class_name("jstree-ocl")
        jstree_ocls[2].click()
        self.browser.click_element_by_id("options-for-node")
        menu=self.browser.find_elements_by_class_name("vakata-contextmenu-sep")
        webdriver.ActionChains(self.browser).move_to_element(menu[2]).perform()
        menu=self.browser.find_elements_by_class_name("vakata-contextmenu-sep")
        webdriver.ActionChains(self.browser).click(menu[4]).perform()

        handles=browser.window_handles
        self.browser.switch_to.window(handles[1])
        assert self.browser.find_element_by_id("ipython_notebook")
        self.browser.close()

