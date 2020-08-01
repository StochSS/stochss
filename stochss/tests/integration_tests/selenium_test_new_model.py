import unittest
import selenium_test_setup_and_teardown
import os
import time

class TestNewFileDirectory(unittest.TestCase):

    def setUp(self):
        self.browser_and_container = selenium_test_setup_and_teardown.setup()
        self.browser=self.browser_and_container[0]
        self.stochss_container=self.browser_and_container[1]
   
    def tearDown(self):
        selenium_test_setup_and_teardown.teardown(self.browser, self.stochss_container)

    def test_new_file_directory(self):

        #create new model
        self.browser.new_file_directory_new_model("test_model")
        self.browser.click_element_by_class_and_text("population-btn", "Population")
        
        #test species editor
        self.browser.click_element_by_id("add-species")
        self.browser.click_element_by_id("add-species")
        form_input_list=self.browser.find_elements_by_class_name("form-input")
        species_name_textbox=form_input_list[1]
        species_name_textbox.clear()
        species_name_textbox.send_keys("test_species")
        species_init_condition=form_input_list[2]
        species_init_condition.clear()
        species_init_condition.send_keys("50")
        
        self.browser.click_element_by_id("edit-annotation-btn")
        text_box=self.browser.find_element_by_id("speciesAnnotationInput")
        text_box.send_keys("test_species_annotation")
        self.browser.click_element_by_class_and_text("ok-model-btn", "OK")
        
        #delete a species
        remove_buttons=self.browser.find_elements_by_id("remove")
        remove_buttons[len(remove_buttons)-1].click()

        #confirm values for species 1 entered correctly
        form_input_list=self.browser.find_elements_by_class_name("form-input")
        species_name_textbox=form_input_list[1]
        initial_condition_textbox=form_input_list[2]
        annotation_tooltip=self.browser.find_element_by_id("annotation-tooltip")
        assert species_name_textbox.get_attribute("value")=="test_species"
        assert initial_condition_textbox.get_attribute("value")=="50"
        assert annotation_tooltip.get_attribute("data-original-title")=="test_species_annotation"

        #Test radio buttons for continuous/discrete/hybrid species mode
        self.browser.click_element_by_id("all-continuous")
        #time.sleep(1)
        self.browser.click_element_by_id("advanced")
        #time.sleep(1)
        self.browser.click_element_by_id("all-discrete")

        #test parameters editor
        self.browser.click_element_by_id("add-parameter")
        self.browser.click_element_by_id("add-parameter")
        form_input_list=self.browser.find_elements_by_class_name("form-input")
        parameter_name_textbox=form_input_list[5]
        parameter_name_textbox.clear()
        parameter_name_textbox.send_keys("test_parameter")
        parameter_expression=form_input_list[6]
        parameter_expression.clear()
        parameter_expression.send_keys("0.05")
        #Parameter annotations not supported
        #annotation_buttons=self.browser.find_elements_by_id("edit-annotation-btn")
        #annotation_buttons[len(annotation_buttons)-1].click()
        #text_box=self.browser.find_element_by_id("parameterAnnotationInput")
        #text_box.send_keys("test_parameter_annotation")
        #self.browser.click_element_by_class_and_text("ok-model-btn", "OK")
        #annotation_tooltips=self.browser.find_elements_by_id("annotation-tooltip")
        #assert annotation_tooltips[len(annotation_tooltips)-1].get_attribute("data-original-title")=="test_parameter_annotation"
        remove_buttons=self.browser.find_elements_by_id("remove")
        remove_buttons[len(remove_buttons)-1].click()
        
        #test reactions editor
        self.browser.click_element_by_id("addReactionBtn")
        self.browser.click_element_by_id("destruction")
        reaction_summary=self.browser.find_element_by_id("reaction-summary")
        assert reaction_summary.text=="test_species→∅"
        self.browser.click_element_by_id("addReactionBtn")
        self.browser.click_element_by_id("destruction")
        remove_buttons=self.browser.find_elements_by_id("remove")
        remove_buttons[len(remove_buttons)-1].click()
        annotation_buttons=self.browser.find_elements_by_id("edit-annotation-btn")
        annotation_buttons[len(annotation_buttons)-1].click()
        text_box=self.browser.find_element_by_id("reactionAnnotationInput")
        text_box.send_keys("test_reaction_annotation")
        self.browser.click_element_by_class_and_text("ok-model-btn", "OK")
        annotation_tooltips=self.browser.find_elements_by_id("annotation-tooltip")
        assert annotation_tooltips[len(annotation_tooltips)-1].get_attribute("data-original-title")=="test_reaction_annotation"

        #test events editor
        self.browser.click_element_by_id("add-event")
        #events annotation not supported
        #annotation_buttons=self.browser.find_elements_by_id("edit-annotation-btn")
        #annotation_buttons[len(annotation_buttons)-1].click()
        #text_box=self.browser.find_element_by_id("eventAnnotationInput")
        #text_box.send_keys("test_event_annotation")
        #self.browser.click_element_by_class_and_text("ok-model-btn", "OK")
        #annotation_tooltips=self.browser.find_elements_by_id("annotation-tooltip")
        #assert annotation_tooltips[len(annotation_tooltips)-1].get_attribute("data-original-title")=="test_event_annotation"
        remove_buttons=self.browser.find_elements_by_id("remove")
        remove_buttons[len(remove_buttons)-1].click()
        remove_buttons=self.browser.find_elements_by_id("remove")
        remove_buttons[len(remove_buttons)-1].click()

        #test rules editor
        self.browser.click_element_by_id("addRuleBtn")
        self.browser.click_element_by_id("rate-rule")
        self.browser.click_element_by_id("addRuleBtn")
        self.browser.click_element_by_id("assignment-rule")
        annotation_buttons=self.browser.find_elements_by_id("edit-annotation-btn")
        annotation_buttons[len(annotation_buttons)-1].click()
        text_box=self.browser.find_element_by_id("ruleAnnotationInput")
        text_box.send_keys("test_rule_annotation")
        self.browser.click_element_by_class_and_text("ok-model-btn", "OK")
        annotation_tooltips=self.browser.find_elements_by_id("annotation-tooltip")
        assert annotation_tooltips[len(annotation_tooltips)-1].get_attribute("data-original-title")=="test_rule_annotation"
        remove_buttons=self.browser.find_elements_by_id("remove")
        remove_buttons[len(remove_buttons)-1].click()
        remove_buttons=self.browser.find_elements_by_id("remove")
        remove_buttons[len(remove_buttons)-1].click()

        self.browser.click_element_by_id("run")
        start_time=time.time()
        timeout=60
        mrc=self.browser.find_element_by_id("model-run-container")
        while(time.time() < start_time+timeout and mrc.text == ''):
            time.sleep(0.1)
        mrc=self.browser.find_element_by_id("model-run-container")
        if mrc.text == '':
            raise Exception(
                "Timeout waiting for preview."
                )
