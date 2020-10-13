import os
import unittest
import tempfile
import handlers.util.generate_zip_file as generate_zip_file
import handlers.util.stochss_errors as stochss_errors

workdir="/home/jovyan/stochss"

class TestGenerateZipFile(unittest.TestCase):

    #unit tests for method generate_zip_file

    def test_generate_zip_file(self):
        test_file = "test_file.foo"
        test_path = os.path.join("test_path", test_file)
        test_dir = "test_dir"
        test_target = "test_target"
        with unittest.mock.patch("shutil.make_archive") as mock_make_archive:
            generate_zip_file.generate_zip_file(test_path, test_dir, test_target)
        correct_filepath = os.path.join(test_dir, "test_file")
        mock_make_archive.assert_called_with(correct_filepath, 'zip', test_dir, test_target)

    #unit tests for method get_zip_file_data

    def test_get_zip_file_data(self):
        with unittest.mock.patch("builtins.open", unittest.mock.mock_open(read_data="foo")):
            assert generate_zip_file.get_zip_file_data("placeholder") == "foo"

    #unit tests for method get_results_csv_dir

    def test_get_results_csv_dir_not_found(self):
        test_file = "results_csv"
        test_path = "placeholder"
        assert generate_zip_file.get_results_csv_dir(test_file, test_path) is None

    def test_get_results_csv_dir_is_found(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_dir = os.path.join(tempdir, "results_csv")
            os.mkdir(test_dir)
            assert generate_zip_file.get_results_csv_dir(test_dir, tempdir) == test_dir

    #unit tests for method download_zip

    def test_download_zip_file_invalid_path(self):
        with self.assertRaises(stochss_errors.StochSSFileNotFoundError):
            generate_zip_file.download_zip("placeholder_path", "placeholder_action")

    def test_download_zip_file_calls_generate_zip_file(self):
        test_path = "test_dir/test_path.foo"
        test_action = "generate"
        with unittest.mock.patch("os.path.exists"):
            with unittest.mock.patch("handlers.util.generate_zip_file.get_unique_file_name",\
                    return_value="test_path"):
                with unittest.mock.patch("handlers.util.generate_zip_file.generate_zip_file")\
                        as mock_generate:
                    generate_zip_file.download_zip(test_path, test_action)
        mock_generate.assert_called_with("t", os.path.join(workdir, "test_dir"), \
                os.path.join(workdir, test_path))

    def test_download_zip_file_action_generate(self):
        test_path = "test_dir/test_path.foo"
        test_action = "generate"
        test_resp = {"Message":"Successfully created t", "Path":"t",}
        with unittest.mock.patch("os.path.exists"):
            with unittest.mock.patch("handlers.util.generate_zip_file.get_unique_file_name",\
                    return_value="test_path"):
                with unittest.mock.patch("handlers.util.generate_zip_file.generate_zip_file"):
                    assert generate_zip_file.download_zip(test_path, test_action) == test_resp

    #download_zip action resultscsv is not covered pending refactor of user dir from /home/jovyan/stochss
