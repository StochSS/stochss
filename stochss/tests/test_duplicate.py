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
        from handlers.util.stochss_errors import StochSSFileNotFoundError
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"nonexistent_file")
            with self.assertRaises(StochSSFileNotFoundError):
                duplicate(test_filepath)

    def test_duplicate_file_not_found_no_new_file(self):
        from handlers.util.stochss_errors import StochSSFileNotFoundError
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"nonexistent_file")
            try:
                duplicate(test_filepath)
            except StochSSFileNotFoundError:
                pass
            tempdir_contents = os.listdir(tempdir)
            assert len(tempdir_contents) == 0

    def test_duplicate_permission_not_granted_raise_error(self):
        from handlers.util.stochss_errors import StochSSPermissionsError
        with tempfile.TemporaryDirectory() as tempdir:
            test_filepath = os.path.join(tempdir,"existent_file")
            Path(test_filepath).touch()
            os.chmod(test_filepath,000)
            with self.assertRaises(StochSSPermissionsError):
                duplicate(test_filepath)

    def test_duplicate_permission_not_granted_no_new_file(self):
        from handlers.util.stochss_errors import StochSSPermissionsError
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
        from handlers.util.stochss_errors import ModelNotFoundError
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
        from handlers.util.stochss_errors import StochSSPermissionsError
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
        from handlers.util.stochss_errors import StochSSPermissionsError 
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

    #unit tests for method get_wkfl_model_parent_path
    
    def test_get_wkfl_model_parent_path_model_only(self):
        assert get_wkfl_model_parent_path("test_path", True, "no wkfl") == "test_path"

    def test_get_wkfl_model_parent_path_does_not_exist(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_model_path=os.path.join(tempdir,"test_model") 
            class Test_Workflow:
                wkfl_mdl_path = ""
                mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl, "",test_model_path)
            assert get_wkfl_model_parent_path("path_does_not_exist", False, test_wkfl) == "path_does_not_exist"

    def test_get_wkfl_model_parent_path_exists(self): 
        with tempfile.TemporaryDirectory() as tempdir:
            test_dir_path=os.path.join(tempdir,'test_directory')
            os.mkdir(test_dir_path)
            test_file_path = os.path.join(test_dir_path,"test_file")
            class Test_Workflow:
                mdl_path = ""
            test_wkfl= Test_Workflow()
            setattr(test_wkfl, "mdl_path", test_file_path)
            Path(test_file_path).touch()
            assert get_wkfl_model_parent_path("path_does_not_exist", False, test_wkfl) == test_dir_path

    #unit tests for method get_model_path

    def test_get_model_path_only_model(self):
        assert get_model_path("test_wkfl_parent_path", "test_mdl_parent_path", "test_mdl_file", True) == (os.path.join("test_wkfl_parent_path","test_mdl_file"), "")

    def test_get_model_path_wkfl_parent_path_equals_mdl_parent_path_and_exists(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_dual_parent_dir = os.path.join(tempdir, "test_dual_parent_dir")
            test_model_path = os.path.join(test_dual_parent_dir,"test_model")
            os.mkdir(test_dual_parent_dir)
            Path(test_model_path).touch()
            assert get_model_path(test_dual_parent_dir, test_dual_parent_dir, "test_model", False) == (os.path.join(test_dual_parent_dir,"test_model"), "")

    def test_get_model_path_mdl_file_in_wkfl_parent_path_directory(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_wkfl_parent_dir = os.path.join(tempdir, "test_wkfl_parent_dir")
            os.mkdir(test_wkfl_parent_dir)
            test_model_parent_dir = os.path.join(tempdir, "test_model_parent_dir")
            os.mkdir(test_model_parent_dir)
            test_model_path = os.path.join(test_wkfl_parent_dir,"test_model")
            Path(test_model_path).touch()
            assert get_model_path(test_wkfl_parent_dir, "", "test_model", False) == (os.path.join(test_wkfl_parent_dir,"test_model"), "")


    def test_get_model_path_mdl_file_in_mdl_parent_path_directory(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_wkfl_parent_dir = os.path.join(tempdir, "test_wkfl_parent_dir")
            os.mkdir(test_wkfl_parent_dir)
            test_model_parent_dir = os.path.join(tempdir, "test_model_parent_dir")
            os.mkdir(test_model_parent_dir)
            test_model_path = os.path.join(test_model_parent_dir,"test_model")
            Path(test_model_path).touch()
            assert get_model_path(test_wkfl_parent_dir, test_model_parent_dir, "test_model", False) == (os.path.join(test_model_parent_dir,"test_model"), "")


    def test_get_model_path_mdl_file_in_mdl_and_wkfl_parent_path_directory(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_wkfl_parent_dir = os.path.join(tempdir, "test_wkfl_parent_dir")
            os.mkdir(test_wkfl_parent_dir)
            test_model_parent_dir = os.path.join(tempdir, "test_model_parent_dir")
            os.mkdir(test_model_parent_dir)
            test_model_path = os.path.join(test_model_parent_dir,"test_model")
            Path(test_model_path).touch()
            test_model_path2 = os.path.join(test_wkfl_parent_dir,"test_model")
            Path(test_model_path2).touch()
            assert get_model_path(test_wkfl_parent_dir, test_model_parent_dir, "test_model", False) == (os.path.join(test_wkfl_parent_dir,"test_model"), "")


    def test_get_model_path_mdl_file_not_found(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_wkfl_parent_dir = os.path.join(tempdir, "test_wkfl_parent_dir")
            os.mkdir(test_wkfl_parent_dir)
            test_model_parent_dir = os.path.join(tempdir, "test_model_parent_dir")
            os.mkdir(test_model_parent_dir)
            assert get_model_path(test_wkfl_parent_dir, test_model_parent_dir, "test_model", False) == (os.path.join(test_wkfl_parent_dir,"test_model"), "The model file {0} could not be found.  To edit the model or run the workflow you will need to update the path to the model or extract the model from the workflow.".format("test_model"))


    #unit tests for method duplicate_wkfl_as_new

    def test_duplicate_wkfl_as_new_wkfl_file_not_found(self):
        from handlers.util.stochss_errors import StochSSFileNotFoundError 
        with tempfile.TemporaryDirectory() as tempdir:
            with self.assertRaises(StochSSFileNotFoundError):
                duplicate_wkfl_as_new(os.path.join(tempdir,"nonexistent_wkfl"), False, "timestamp")

    def test_duplicate_wkfl_as_new_not_JSON_decodable(self):
        from handlers.util.stochss_errors import FileNotJSONFormatError
        with tempfile.TemporaryDirectory() as tempdir:
            Path(os.path.join(tempdir,"info.json")).touch()
            with self.assertRaises(FileNotJSONFormatError):
                duplicate_wkfl_as_new(os.path.join(tempdir), False, "timestamp")
        

    def test_duplicate_wkfl_as_new_only_model(self):
        #from json import load
        from unittest import mock
        from handlers.util.run_model import GillesPy2Workflow
        from handlers.util.stochss_errors import FileNotJSONFormatError
        with tempfile.TemporaryDirectory() as tempdir:
            test_dict={"type":"gillespy","source_model":"test_source_model"}
            test_path = os.path.join(tempdir,"test_wkfl_dir")
            os.mkdir(test_path)
            Path(os.path.join(test_path,"info.json")).touch()
            test_source_model_path = os.path.join(test_path,"test_source_model")
            Path(test_source_model_path).touch()
            with mock.patch("handlers.util.run_model.GillesPy2Workflow.get_settings") as mock_settings:
                with mock.patch("json.load") as mock_json:
                    mock_json.return_value = test_dict
                    test_return = duplicate_wkfl_as_new(test_path, True, "timestamp")
                    assert test_return == {'message': 'A copy of the model in {0} has been created'.format(test_path),"mdlPath":os.path.join(tempdir,"test_source_model"),"File":"test_source_model"}

    def test_duplicate_wkfl_as_new_model_file_not_found(self):
        #from json import load
        from unittest import mock
        from handlers.util.run_model import GillesPy2Workflow
        from handlers.util.stochss_errors import FileNotJSONFormatError
        with tempfile.TemporaryDirectory() as tempdir:
            test_dict={"type":"gillespy","source_model":"test_source_model"}
            test_path = os.path.join(tempdir,"test_wkfl_dir")
            os.mkdir(test_path)
            Path(os.path.join(test_path,"info.json")).touch()
            test_source_model_path = os.path.join(test_path,"test_source_model")
            Path(test_source_model_path).touch()
            with mock.patch("handlers.util.run_model.GillesPy2Workflow.get_settings") as mock_settings:
                mock_settings.return_value = None
                with mock.patch("json.load") as mock_json:
                    mock_json.return_value = test_dict
                    test_return = duplicate_wkfl_as_new(test_path, False, "timestamp")
                    assert test_return == {'message': 'A new workflow has been created from {0}'.format(test_path), 'wkflPath': test_path+"timestamp.wkfl", 'mdlPath': os.path.join(tempdir,"test_source_model"), 'File': 'test_wkfl_dirtimestamp.wkfl', 'mdl_file': 'test_source_model', 'error': 'The model file test_source_model could not be found.  To edit the model or run the workflow you will need to update the path to the model or extract the model from the workflow.'}

    def test_duplicate_wkfl_as_new_model_file_exists(self):
        #from json import load
        from unittest import mock
        from handlers.util.run_model import GillesPy2Workflow
        from handlers.util.stochss_errors import FileNotJSONFormatError
        with tempfile.TemporaryDirectory() as tempdir:
            test_dict={"type":"gillespy","source_model":"test_source_model"}
            test_path = os.path.join(tempdir,"test_wkfl_dir")
            os.mkdir(test_path)
            Path(os.path.join(test_path,"info.json")).touch()
            test_source_model_path = os.path.join(test_path,"test_source_model")
            Path(test_source_model_path).touch()
            Path(os.path.join(tempdir,"test_source_model")).touch()
            with mock.patch("handlers.util.run_model.GillesPy2Workflow.get_settings") as mock_settings:
                with mock.patch("json.load") as mock_json:
                    mock_json.return_value = test_dict
                    test_return = duplicate_wkfl_as_new(test_path, False, "timestamp")
                    assert test_return == {'message': 'A new workflow has been created from {0}'.format(test_path), 'wkflPath': test_path+"timestamp.wkfl", 'mdlPath': os.path.join(tempdir,"test_source_model"), 'File': 'test_wkfl_dirtimestamp.wkfl', 'mdl_file': 'test_source_model'}
