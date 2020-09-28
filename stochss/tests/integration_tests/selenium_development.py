import selenium_test_setup_and_teardown
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

driver_and_container=selenium_test_setup_and_teardown.setup()

driver=driver_and_container[0]
container=driver_and_container[1]

