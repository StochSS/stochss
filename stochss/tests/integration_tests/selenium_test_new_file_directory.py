import unittest
import selenium_test_setup_and_teardown
import time
import os

class TestNewFileDirectory(unittest.TestCase):

    def setUp(self):
        self.browser_and_container = selenium_test_setup_and_teardown.setup()
        self.browser=self.browser_and_container[0]
        self.stochss_container=self.browser_and_container[1]
   
    def tearDown(self):
        selenium_test_setup_and_teardown.teardown(self.browser, self.stochss_container)

    def test_new_file_directory(self):

        self.browser.new_file_directory_new_directory("test_dir")
        
        self.browser.new_file_directory_new_model("test_model")
        self.browser.back()
        self.browser.wait_for_navigation_complete()
        
        #upload StochSS model
        self.browser.click_element_by_id("new-file-directory")
        self.browser.click_element_by_class_and_text("dropdown-item", "Upload StochSS Model")
        self.browser.click_element_by_class_and_text("btn", "Cancel")
        
        #upload SBML model
        self.browser.click_element_by_id("new-file-directory")
        self.browser.click_element_by_class_and_text("dropdown-item", "Upload SBML Model")
        self.browser.click_element_by_class_and_text("btn", "Cancel")
        #upload file
        self.browser.click_element_by_id("new-file-directory")
        self.browser.click_element_by_class_and_text("dropdown-item", "Upload File")
        self.browser.click_element_by_class_and_text("btn", "Cancel")
        jstree_nodes=self.browser.find_elements_by_class_name('jstree-node')
        assert (jstree_nodes[0].text==(" /" + "\n" + " test_dir" + "\n" + " test_model.mdl" + "\n" + " Examples"))
        stochss_dir_contents = (self.stochss_container.exec_run("python -c \"import os;print(os.listdir())\"", demux=False)[1])
        assert b'test_model.mdl' in stochss_dir_contents
        assert b'test_dir' in stochss_dir_contents
