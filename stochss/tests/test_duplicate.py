import unittest, os, tempfile
from pathlib import Path
from handlers.util.duplicate import *

class TestDuplicate(unittest.TestCase):

    #test method get_unique_file_name
    def test_get_unique_file_name_notcopy_noext(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filename = "test_file"
            test_filepath = os.path.join(tempdir, test_filename)
            assert get_unique_file_name(test_filepath) == os.path.join(tempdir,"test_file-copy")

    def test_get_unique_file_name_iscopy_noext(self): 
        with tempfile.TemporaryDirectory() as tempdir:
            test_filename = "test_file-copy"
            test_filepath = os.path.join(tempdir, test_filename)
            assert get_unique_file_name(test_filepath) == os.path.join(tempdir, 'test_file-copy(2)')

    def test_get_unique_file_name_notcopy_hasext(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filename = "test_file.sample"
            test_filepath = os.path.join(tempdir, test_filename)
            assert get_unique_file_name(test_filepath) == os.path.join(tempdir, 'test_file-copy.sample')

    def test_get_unique_file_name_iscopy_hasext(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filename = "test_file-copy.sample"
            test_filepath = os.path.join(tempdir, test_filename)
            assert get_unique_file_name(test_filepath) == os.path.join(tempdir,"test_file-copy(2).sample")
        
    def test_get_unique_file_name_multiple_copies(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filename = "test_file"
            test_filepath = os.path.join(tempdir, test_filename)
            for i in range(2):
                test_filepath = get_unique_file_name(test_filepath)
            assert test_filepath == os.path.join(tempdir,"test_file-copy(2)")

    #test method duplicate
    def test_duplicate_file_not_found_raise_error(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"nonexistent_file")
            with self.assertRaises(StochSSFileNotFoundError):
                duplicate(test_filepath)

    def test_duplicate_file_not_found_no_new_file(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"nonexistent_file")
            try:
                duplicate(test_filepath)
            except StochSSFileNotFoundError:
                pass
            tempdir_contents = os.listdir(tempdir)
            assert len(tempdir_contents) == 0

    def test_duplicate_permission_not_granted_raise_error(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"existent_file")
            Path(test_filepath).touch()
            os.chmod(test_filepath,000)
            with self.assertRaises(StochSSPermissionsError):
                duplicate(test_filepath)

    def test_duplicate_permission_not_granted_no_new_file(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"existent_file")
            Path(test_filepath).touch()
            os.chmod(test_filepath,000)
            try:
                duplicate(test_filepath)
            except StochSSPermissionsError:
                pass
            tempdir_contents = os.listdir(tempdir)
            assert len(tempdir_contents) == 1
    

    def test_duplicate_copy_successful(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"existent_file")
            Path(test_filepath).touch()
            duplicate(test_filepath)
            tempdir_contents = os.listdir(tempdir)
            assert len(tempdir_contents) == 2
            
