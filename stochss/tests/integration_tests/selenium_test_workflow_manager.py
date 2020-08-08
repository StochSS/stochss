import unittest
import selenium_test_setup_and_teardown
import os
import time

class TestWorkflowManager(unittest.TestCase):

    def setUp(self):
        self.browser_and_container = selenium_test_setup_and_teardown.setup()
        self.browser=self.browser_and_container[0]
        self.stochss_container=self.browser_and_container[1]
   
    def tearDown(self):
        selenium_test_setup_and_teardown.teardown(self.browser, self.stochss_container)

    def test_workflow_manager(self):
        #access Degradation model in Examples directory
        jstree_ocls=self.browser.find_elements_by_class_name("jstree-ocl")
        jstree_ocls[1].click()
        jstree_ocls=self.browser.find_elements_by_class_name("jstree-ocl")
        jstree_ocls[6].click()
        

