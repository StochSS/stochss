import unittest
import selenium_test_setup_and_teardown
import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class TestModelEditor(unittest.TestCase):

    def setUp(self):
        self.browser_and_container = selenium_test_setup_and_teardown.setup()
        self.browser=self.browser_and_container[0]
        self.stochss_container=self.browser_and_container[1]
   
    def tearDown(self):
        selenium_test_setup_and_teardown.teardown(self.browser, self.stochss_container)

    def test_model_editor(self):

        #create new model
        self.browser.find_element(By.CSS_SELECTOR, "b").click()
        self.browser.find_element(By.CSS_SELECTOR, ".dropdown-item:nth-child(2)").click()
        self.browser.find_element(By.ID, "modelNameInput").send_keys("test_model")
        self.browser.find_element(By.CSS_SELECTOR, ".ok-model-btn").click()
        
        #test species editor
        #create two species
        self.browser.find_element(By.CSS_SELECTOR, ".concentration-btn").click()
        self.browser.find_element(By.CSS_SELECTOR, ".btn-outline-primary:nth-child(4)").click()
        self.browser.find_element(By.CSS_SELECTOR, ".btn-outline-primary:nth-child(4)").click()
        #set species name
        self.browser.find_element(By.NAME, "name").clear()
        self.browser.find_element(By.NAME, "name").send_keys("test_species")
        assert self.browser.find_element(By.NAME, "name").get_attribute("value")=="test_species"
        #set species initial condition
        self.browser.find_element(By.NAME, "value").clear()
        self.browser.find_element(By.NAME, "value").send_keys("50")
        assert self.browser.find_element(By.NAME, "value").get_attribute("value") == "50"
        #set species annotation
        self.browser.find_element(By.CSS_SELECTOR, "tr:nth-child(1) .btn-sm").click()
        self.browser.find_element(By.ID, "speciesAnnotationInput").send_keys("test_species_annotation")
        self.browser.find_element(By.CSS_SELECTOR, ".ok-model-btn").click()
        annotation_tooltips = self.browser.find_elements_by_class_name("tooltip-icon-large")
        assert annotation_tooltips[0].get_attribute("data-original-title")=="test_species_annotation"
        #delete a species
        self.browser.find_element(By.CSS_SELECTOR, "tr:nth-child(2) > td:nth-child(4) > .btn").click()
        form_input_list=self.browser.find_elements_by_class_name("form-input")
        assert len(form_input_list)==8
        #test concentration/population/hybrid radio buttons
        self.browser.find_element(By.NAME, "species-mode").click()
        self.browser.find_element(By.CSS_SELECTOR, "td:nth-child(3) > input").click()
        self.browser.find_element(By.CSS_SELECTOR, "td:nth-child(2) > input").click()

        #test parameters editor
        #create two parameters
        self.browser.find_element(By.CSS_SELECTOR, "#collapse-parameters > .btn").click()
        self.browser.find_element(By.CSS_SELECTOR, "#collapse-parameters > .btn").click()
        self.browser.find_element(By.CSS_SELECTOR, "#collapse-parameters tr:nth-child(1) > .name .form-input").click()
        #set parameter name
        self.browser.find_element(By.CSS_SELECTOR, "#collapse-parameters .name .form-input").clear()
        self.browser.find_element(By.CSS_SELECTOR, "#collapse-parameters .name .form-input").send_keys("test_parameter")
        parameter_name = self.browser.find_element(By.CSS_SELECTOR, "#collapse-parameters .name .form-input")
        assert parameter_name.get_attribute("value")=="test_parameter"
        #set parameter value
        self.browser.find_element(By.NAME, "expression").clear()
        self.browser.find_element(By.NAME, "expression").send_keys("0.05")
        parameter_value = self.browser.find_element(By.NAME, "expression")
        assert parameter_value.get_attribute("value")=="0.05"
        #delete a parameter
        self.browser.find_element(By.CSS_SELECTOR, "tr:nth-child(2) > td:nth-child(4) > .btn").click()
        form_input_list=self.browser.find_elements_by_class_name("form-input")
        assert len(form_input_list)==10
        #Parameter annotations not supported
        #annotation_buttons=self.browser.find_elements_by_id("edit-annotation-btn")
        #annotation_buttons[len(annotation_buttons)-1].click()
        #text_box=self.browser.find_element_by_id("parameterAnnotationInput")
        #text_box.send_keys("test_parameter_annotation")
        #self.browser.click_element_by_class_and_text("ok-model-btn", "OK")
        #annotation_tooltips=self.browser.find_elements_by_id("annotation-tooltip")
        #assert annotation_tooltips[len(annotation_tooltips)-1].get_attribute("data-original-title")=="test_parameter_annotation"
        
        #test reactions editor
        #create reaction
        self.browser.find_element(By.ID, "addReactionBtn").click()
        self.browser.find_element(By.CSS_SELECTOR, ".dropdown-item:nth-child(2) .base:nth-child(1)").click()
        self.browser.find_element(By.CSS_SELECTOR, ".name:nth-child(2) .form-input").clear()
        self.browser.find_element(By.CSS_SELECTOR, ".name:nth-child(2) .form-input").send_keys("test_reaction")
        reaction_name = self.browser.find_element(By.CSS_SELECTOR, ".name:nth-child(2) .form-input")
        assert reaction_name.get_attribute("value")=="test_reaction"
        self.browser.find_element(By.CSS_SELECTOR, "td:nth-child(4) > .btn-sm").click()
        self.browser.find_element(By.ID, "reactionAnnotationInput").send_keys("test_reaction_annotation")
        self.browser.find_element(By.ID, "reactionAnnotationInput").send_keys(Keys.ENTER)
        annotation_tooltips = self.browser.find_elements_by_class_name("tooltip-icon-large")
        assert annotation_tooltips[len(annotation_tooltips)-1].get_attribute("data-original-title")=="test_reaction_annotation"

        #test events editor
        self.browser.find_element(By.CSS_SELECTOR, "#events-container > .btn").click()
        self.browser.find_element(By.CSS_SELECTOR, "#events-container .name .form-input").clear()
        self.browser.find_element(By.CSS_SELECTOR, "#events-container .name .form-input").send_keys("test_event")
        assert self.browser.find_element(By.CSS_SELECTOR, "#events-container .name .form-input").get_attribute("value") == "test_event"
        self.browser.find_element(By.CSS_SELECTOR, ".col-md-6 > .table .btn-sm").click()
        self.browser.find_element(By.NAME, "trigger-expression").clear()
        self.browser.find_element(By.NAME, "trigger-expression").send_keys("test_trigger")
        assert self.browser.find_element(By.NAME, "trigger-expression").get_attribute("value")=="test_trigger"
        self.browser.find_element(By.NAME, "event-assignment-expression").clear()
        self.browser.find_element(By.NAME, "event-assignment-expression").send_keys("test_expression")
        assert self.browser.find_element(By.NAME, "event-assignment-expression").get_attribute("value") == "test_expression"
        self.browser.find_element(By.CSS_SELECTOR, ".col-md-6 td:nth-child(4) > .btn").click()
       
        #events annotation not supported
        #annotation_buttons=self.browser.find_elements_by_id("edit-annotation-btn")
        #annotation_buttons[len(annotation_buttons)-1].click()
        #text_box=self.browser.find_element_by_id("eventAnnotationInput")
        #text_box.send_keys("test_event_annotation")
        #self.browser.click_element_by_class_and_text("ok-model-btn", "OK")
        #annotation_tooltips=self.browser.find_elements_by_id("annotation-tooltip")
        #assert annotation_tooltips[len(annotation_tooltips)-1].get_attribute("data-original-title")=="test_event_annotation"
         #test rules editor
        self.browser.find_element(By.ID, "addRuleBtn").click()
        self.browser.find_element(By.CSS_SELECTOR, ".show > .dropdown-item:nth-child(1)").click()
        self.browser.find_element(By.ID, "addRuleBtn").click()
        self.browser.find_element(By.CSS_SELECTOR, ".show > .dropdown-item:nth-child(2)").click()
        names = self.browser.find_elements(By.NAME, "rule-name")
        names[0].clear()
        names[0].send_keys("test_rate")
        assert names[0].get_attribute("value")=="test_rate"
        names[1].clear()
        names[1].send_keys("test_assignment")
        assert names[1].get_attribute("value") == "test_assignment"
        exps = self.browser.find_elements(By.NAME, "rule-expression")
        exps[0].send_keys("test_rate_expression")
        assert exps[0].get_attribute("value") == "test_rate_expression"
        exps[1].send_keys("test_assignment_expression")
        assert exps[1].get_attribute("value") == "test_assignment_expression"
        self.browser.find_elements(By.CSS_SELECTOR, "tr:nth-child(1) .btn")[6].click()
        self.browser.find_element(By.ID, "ruleAnnotationInput").send_keys("test_rate_annotation")
        self.browser.find_element(By.ID, "ruleAnnotationInput").send_keys(Keys.ENTER)
        annotation_tooltips = self.browser.find_elements_by_class_name("tooltip-icon-large")
        assert annotation_tooltips[len(annotation_tooltips)-2].get_attribute("data-original-title")=="test_rate_annotation"
        self.browser.find_element(By.CSS_SELECTOR, "tr:nth-child(1) > td:nth-child(6) > .btn").click()
        self.browser.find_element(By.CSS_SELECTOR, "td:nth-child(6) > .btn").click()
        #test preview and confirm model execution
        self.browser.find_element(By.CSS_SELECTOR, ".btn-primary:nth-child(4)").click()
        start_time=time.time()
        timeout=60
        mrc=self.browser.find_element_by_class_name("js-plotly-plot")
        while(time.time() < start_time+timeout and mrc.text == ''):
            time.sleep(0.1)
        mrc=self.browser.find_element_by_class_name("js-plotly-plot")
        if mrc.text == '':
            raise Exception(
                "Timeout waiting for preview."
                )
