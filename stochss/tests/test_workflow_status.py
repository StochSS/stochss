import os
import unittest
import tempfile
from pathlib import Path

from handlers.util.workflow_status import get_status

class TestWorkflow_Status(unittest.TestCase):

    #unit tests for method get_status

    def test_get_status_complete(self):
        from unittest import mock
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "test_dir")
            os.mkdir(test_path)
            test_status = "COMPLETE"
            test_file = os.path.join(test_path, test_status)
            Path(test_file).touch()
            with mock.patch("os.path.join",return_value = test_path) as mock_join:
                assert get_status("") == "complete"


    def test_get_status_error(self):
        from unittest import mock
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "test_dir")
            os.mkdir(test_path)
            test_status = "ERROR"
            test_file = os.path.join(test_path, test_status)
            Path(test_file).touch()
            with mock.patch("os.path.join",return_value = test_path) as mock_join:
                assert get_status("") == "error"

    def test_get_status_running(self):
        from unittest import mock
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "test_dir")
            os.mkdir(test_path)
            test_status = "RUNNING"
            test_file = os.path.join(test_path, test_status)
            Path(test_file).touch()
            with mock.patch("os.path.join",return_value = test_path) as mock_join:
                assert get_status("") == "running"

    def test_get_status_ready(self):
        from unittest import mock
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "test_dir")
            os.mkdir(test_path)
            with mock.patch("os.path.join",return_value = test_path) as mock_join:
                assert get_status("") == "ready"
