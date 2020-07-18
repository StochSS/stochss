import selenium_test_setup_and_teardown

browser_and_container = selenium_test_setup_and_teardown.setup()
browser=browser_and_container[0]
stochss_container=browser_and_container[1]

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

print("Test complete.")

selenium_test_setup_and_teardown.teardown(browser, stochss_container)
