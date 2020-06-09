import unittest, os, tempfile
from pathlib import Path
from handlers.util.duplicate import *

class TestDuplicate(unittest.TestCase):

    #unit tests for method get_unique_file_name
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

    #unit tests for method duplicate
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
            assert os.path.isfile(os.path.join(tempdir,'existent_file-copy'))

    #unit tests for method extract_wkfl_model
    def test_extract_wkfl_model_path_changed(self): 
        with tempfile.TemporaryDirectory() as tempdir:
            test_model_path=os.path.join(tempdir,"test_model")
            Path(test_model_path).touch()
            class Test_Workflow:
                wkfl_mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl,"wkfl_mdl_path",test_model_path)
            test_extract_target="test_model"
            extract_wkfl_model(wkfl=test_wkfl,mdl_parent_path=tempdir,model_file=test_extract_target)
            assert os.path.isfile(os.path.join(tempdir,"test_model(1)"))
            
    def test_extract_wkfl_model_path_not_changed(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_model_path=os.path.join(tempdir,"test_model")
            Path(test_model_path).touch()
            class Test_Workflow:
                wkfl_mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl,"wkfl_mdl_path",test_model_path)
            test_extract_target="test_model_extracted"
            extract_wkfl_model(wkfl=test_wkfl,mdl_parent_path=tempdir,model_file=test_extract_target)
            assert os.path.isfile(os.path.join(tempdir,test_extract_target))
    
    def test_extract_wkfl_model_file_not_found_raise_error(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_model_path=os.path.join(tempdir,"test_model")
            class Test_Workflow:
                wkfl_mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl,"wkfl_mdl_path",test_model_path)
            with self.assertRaises(ModelNotFoundError):
                extract_wkfl_model(wkfl=test_wkfl,mdl_parent_path=tempdir,model_file="test_model")
    
    def test_extract_wkfl_model_file_not_found_no_new_file(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_model_path=os.path.join(tempdir,"test_model")
            class Test_Workflow:
                wkfl_mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl,"wkfl_mdl_path",test_model_path)
            tempdir_contents = os.listdir(tempdir)
            assert len(tempdir_contents) == 0
    
    def test_extract_wkfl_model_permission_not_granted_raise_error(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_model_path=os.path.join(tempdir,"test_model")
            Path(test_model_path).touch()
            class Test_Workflow:
                wkfl_mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl,"wkfl_mdl_path",test_model_path)
            os.chmod(test_model_path,000)
            with self.assertRaises(StochSSPermissionsError):
                extract_wkfl_model(wkfl=test_wkfl,mdl_parent_path=tempdir,model_file="test_model")

    def test_extract_wkfl_model_permission_not_granted_no_new_file(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_model_path=os.path.join(tempdir,"test_model")
            Path(test_model_path).touch()
            class Test_Workflow:
                wkfl_mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl,"wkfl_mdl_path",test_model_path)
            os.chmod(test_model_path,000)
            try:
                extract_wkfl_model(wkfl=test_wkfl,mdl_parent_path=tempdir,model_file="test_model")
            except StochSSPermissionsError:
                pass
            tempdir_contents = os.listdir(tempdir)
            assert len(tempdir_contents) == 1
