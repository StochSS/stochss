import unittest, os, tempfile
from pathlib import Path
from handlers.util.rename import *

class TestRename(unittest.TestCase):

    #unit tests for method get_unique_file_name

    def test_get_unique_file_name_target_does_not_exist(self):
        with tempfile.TemporaryDirectory() as tempdir:
            gufn_return_filepath = os.path.join(tempdir,"nonexistent_file")
            gufn_return_tuple = (gufn_return_filepath, False)
            assert get_unique_file_name("nonexistent_file", tempdir) == (gufn_return_tuple)

    def test_get_unique_file_name_target_exists(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"existent_file")
            Path(test_filepath).touch()
            gufn_return_filepath = os.path.join(tempdir,"existent_file(1)")
            gufn_return_tuple = (gufn_return_filepath, True) 
            assert get_unique_file_name("existent_file", tempdir) == gufn_return_tuple

    def test_get_unique_file_name_numbered_target_exists(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"existent_file(1)")
            Path(test_filepath).touch()
            gufn_return_filepath = os.path.join(tempdir,"existent_file(2)")
            gufn_return_tuple = (gufn_return_filepath, True)
            assert get_unique_file_name("existent_file(1)", tempdir) == gufn_return_tuple

    def test_get_unique_file_name_with_extension_target_does_not_exist(self):
        with tempfile.TemporaryDirectory() as tempdir:
            gufn_return_filepath = os.path.join(tempdir,"nonexistent_file.foo")
            gufn_return_tuple = (gufn_return_filepath, False)
            assert get_unique_file_name("nonexistent_file.foo", tempdir) == (gufn_return_tuple)

    def test_get_unique_file_name_with_extension_target_exists(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filename = "existent_file.foo"
            test_filepath = os.path.join(tempdir,test_filename)
            Path(test_filepath).touch()
            gufn_return_filepath = os.path.join(tempdir,"existent_file(1).foo")
            gufn_return_tuple = (gufn_return_filepath, True) 
            assert get_unique_file_name(test_filename, tempdir) == gufn_return_tuple


    def test_get_unique_file_name_iterated(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filename = "existent_file"
            test_filepath = os.path.join(tempdir, test_filename)
            Path(test_filepath).touch()
            for i in range(3):
                test_filename, placeholder = get_unique_file_name(test_filename, tempdir)
                Path(test_filename).touch()
                test_filename = test_filename.split('/').pop()
            assert len(os.listdir(tempdir)) == 4 

    def test_get_unique_file_name_invalid_path(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_dirpath = os.path.join(tempdir,"invalid_directory")
            with self.assertRaises(FileNotFoundError):
                get_unique_file_name("nonexistent_file", test_dirpath)

    #unit tests for method rename

    def test_rename_file(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_file = "test_file"
            test_path = os.path.join(tempdir,test_file)
            Path(test_path).touch()
            rename(test_path, "test_file2")
            test_new_path = os.path.join(tempdir, "test_file2")
            assert os.path.isfile(test_new_path)

    def test_rename_directory(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_dir = "test_dir"
            test_path = os.path.join(tempdir, test_dir)
            os.mkdir(test_path)
            rename(test_path, "test_dir2")
            test_new_path = os.path.join(tempdir, "test_dir2")
            assert os.path.isdir(test_new_path)

#    def test_rename_permission_error(self):
#        from handlers.util.stochss_errors import StochSSPermissionsError
#        with tempfile.TemporaryDirectory() as tempdir:
#            test_file = "test_file"
#            test_path = os.path.join(tempdir,test_file)
#            Path(test_path).touch()
#            os.chmod(test_path,000)
#            with self.assertRaises(StochSSPermissionsError):
#                rename(test_path, "test_file2")

    def test_rename_file_not_found_error(self):
        from handlers.util.stochss_errors import StochSSFileNotFoundError
        with tempfile.TemporaryDirectory() as tempdir:
            test_file = "test_file"
            test_path = os.path.join(tempdir,test_file)
            with self.assertRaises(StochSSFileNotFoundError):
                rename(test_path, "test_file2")

    def test_rename_target_exists(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_file = "test_file"
            test_path = os.path.join(tempdir, test_file)
            Path(test_path).touch()
            test_file2 = "test_file2"
            test_path2 = os.path.join(tempdir, test_file2)
            Path(test_path2).touch()
            resp = rename(test_path, "test_file2")
            assert resp["changed"] == True

    def test_rename_running_wkfl(self):
        from unittest import mock
        with tempfile.TemporaryDirectory() as tempdir:
            with mock.patch("json.dump") as mock_dump:
                    with mock.patch("json.load") as mock_json:
                        with mock.patch('builtins.open', mock.mock_open(read_data="foo")) as m:
                            test_file = "test_file.wkfl"
                            test_path = os.path.join(tempdir, test_file)
                            target_path = os.path.join(tempdir, "test_file2")
                            os.mkdir(test_path)
                            os.mkdir(target_path)
                            Path(os.path.join(target_path,"RUNNING")).touch()
                            rename(test_path, "test_file2")
                        m.assert_called_with(os.path.join(target_path, "info.json"), 'r+')
