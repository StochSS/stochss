import os
import unittest
from pathlib import Path
import handlers.util.generate_zip_file as generate_zip_file

class TestGenerate_Zip_File(unittest.TestCase):

    #unit tests for method generate_zip_file

    def test_generate_zip_file(self):
        from unittest import mock
        test_file = "test_file.foo"
        test_path = os.path.join("test_path",test_file)
        test_dir = "test_dir"
        test_target = "test_target"
        with mock.patch("shutil.make_archive") as mock_make_archive:
            generate_zip_file.generate_zip_file(test_path,test_dir,test_target)
        correct_filepath = os.path.join(test_dir,"test_file")
        mock_make_archive.assert_called_with(correct_filepath,'zip',test_dir, test_target)

    def test_get_zip_file_data(self):
        from unittest import mock
        with mock.patch("builtins.open",mock.mock_open(read_data="foo")) as mock_open:
            assert generate_zip_file.get_zip_file_data("placeholder") == "foo"

    def test_get_results_csv_dir_not_found(self):
        test_file = "results_csv"
        test_path = "placeholder"
        assert generate_zip_file.get_results_csv_dir(test_file, test_path) == None

    def test_get_results_csv_dir_is_found(self):
        import tempfile
        test_file = "results_csv"
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir,test_file)
            Path(test_path).touch()
            print("Results: ",generate_zip_file.get_results_csv_dir(test_file, test_path))

