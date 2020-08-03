import os
import unittest
from unittest import mock
import tempfile
from pathlib import Path

from handlers.util.upload_file import *

class TestUploadFile(unittest.TestCase):

    #unit tests for method validate_model

    def test_validate_model_json_decode_error(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_file = "non_json_file"
            test_path = os.path.join(tempdir, test_file)
            Path(test_path).touch()
            assert validate_model(test_path, test_file) == \
                    (False, False, "The file {0} is not in JSON format.".format(test_file))

    def test_validate_model_valid_keys(self):
        test_keys = ("is_spatial", "defaultID", "defaultMode", "modelSettings",
                     "simulationSettings", "parameterSweepSettings", "species",
                     "parameters", "reactions", "eventsCollection", "rules",
                     "functionDefinitions", "meshSettings", "initialConditions")
        class TestKeychain():
            def keys(self):
                return test_keys

        complete_keychain = TestKeychain()
        with mock.patch("json.loads", return_value=complete_keychain):
            assert validate_model("", "") == (True, True, "")

    def test_validate_model_missing_keys(self):
        test_keys = ("is_spatial", "defaultID", "defaultMode", "modelSettings",
                     "simulationSettings", "parameterSweepSettings", "species",
                     "parameters", "reactions", "eventsCollection", "rules",
                     "functionDefinitions", "meshSettings", "initialConditions")

        class TestKeychain():
            def keys(self):
                return ()

        complete_keychain = TestKeychain()
        with mock.patch("json.loads", return_value=complete_keychain):
            assert validate_model("", "") == (False, True, \
                    "The following keys are missing from {0}: {1}".format("", ", ".join(test_keys)))

    def test_validate_model_invalid_keys(self):
        test_keys = ("invalid_key",
                     "is_spatial", "defaultID", "defaultMode", "modelSettings",
                     "simulationSettings", "parameterSweepSettings", "species",
                     "parameters", "reactions", "eventsCollection", "rules",
                     "functionDefinitions", "meshSettings", "initialConditions")

        class TestKeychain():
            def keys(self):
                return test_keys

        complete_keychain = TestKeychain()
        with mock.patch("json.loads", return_value=complete_keychain):
            assert validate_model("", "") ==\
                    (False, True, "The following keys were found in {0} that don't exist within a StochSS model: {1}".format("", "invalid_key"))

    #unit tests for method upload_model_file

    def test_upload_model_file_is_valid(self):
        test_valid = True
        test_json = False
        test_error = ""
        predicted_name = ".".join(["some_name", "mdl"])
        with mock.patch("handlers.util.upload_file.get_unique_file_name",\
                return_value=("some_path", False)):
            with mock.patch("handlers.util.upload_file.validate_model",\
                    return_value=(test_valid, test_json, test_error)):
                with mock.patch("builtins.open", mock.mock_open(read_data="foo")):
                    assert upload_model_file("some_path", "some_file_name", "some_name", None)\
                            ['message'] == "{0} was successfully uploaded to {1}".format(\
                            predicted_name, "some_path")

    def test_upload_model_file_not_valid(self):
        test_valid = False
        test_json = False
        test_error = ""
        predicted_name = ".".join(["some_name", "json"])
        with mock.patch("handlers.util.upload_file.get_unique_file_name",\
                return_value=("some_path", False)):
            with mock.patch("handlers.util.upload_file.validate_model",\
                    return_value=(test_valid, test_json, test_error)):
                with mock.patch("builtins.open", mock.mock_open(read_data="foo")):
                    assert upload_model_file("some_path",\
                            "some_file_name", "some_name", None)['message'] ==\
                            "{0} could not be validated as a Model file and was uploaded as {1} to {2}"\
                            .format("some_file_name", predicted_name, "some_path")

    def test_upload_model_file_error(self):
        test_valid = False
        test_json = False
        test_error = "test_error"
        with mock.patch("handlers.util.upload_file.get_unique_file_name",\
                return_value=("some_path", False)):
            with mock.patch("handlers.util.upload_file.validate_model", return_value=\
                    (test_valid, test_json, test_error)):
                with mock.patch("builtins.open", mock.mock_open(read_data="foo")):
                    assert upload_model_file("some_path", "some_file_name", "some_name", None)\
                            ['errors'] == ['test_error']

    def test_upload_model_file_name_changed(self):
        test_valid = False
        test_json = False
        test_error = ""
        predicted_name = "some_file"
        with mock.patch("handlers.util.upload_file.get_unique_file_name",\
                return_value=(os.path.join("some_parent", "some_file"), True)):
            with mock.patch("handlers.util.upload_file.validate_model", \
                    return_value=(test_valid, test_json, test_error)):
                with mock.patch("builtins.open", mock.mock_open(read_data="foo")):
                    assert upload_model_file("some_path", "some_file_name", "some_name", None)['message'] ==\
                            "{0} could not be validated as a Model file and was uploaded as {1} to {2}"\
                            .format("some_file_name", predicted_name, "some_path")

    def test_upload_model_file_json(self):
        test_valid = True
        test_json = True
        test_error = ""
        with mock.patch("handlers.util.upload_file.get_unique_file_name",\
                return_value=("some_path", False)):
            with mock.patch("handlers.util.upload_file.validate_model", return_value=\
                    (test_valid, test_json, test_error)):
                with mock.patch("builtins.open", mock.mock_open(read_data="foo")):
                    with mock.patch("json.loads", return_value="mock_return") as mock_json_loads:
                        upload_model_file("some_path", "some_file_name", "some_name", None)
                        mock_json_loads.assert_called()
