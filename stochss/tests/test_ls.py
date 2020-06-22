"""Unit tests for handlers.util.ls.py"""
import unittest
import os
import tempfile
from pathlib import Path

import handlers.util.ls as ls
from handlers.util.stochss_errors import StochSSFileNotFoundError

class TestLS(unittest.TestCase):
    """Unit test container for handlers.util.ls.py"""

    #unit tests for method getFileSystemData

    def test_get_file_system_data_dir_not_found(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "nonexistent_dir")
            with self.assertRaises(StochSSFileNotFoundError):
                ls.getFileSystemData(test_path, tempdir)

    def test_get_file_system_data_no_children(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "empty_dir")
            os.mkdir(test_path)
            children = ls.getFileSystemData(test_path, tempdir)
            assert len(children) == 0

    def test_get_file_system_data_child_is_wkfl(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.wkfl")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with \
                (text="test_file.wkfl", f_type="workflow", p_path=tempdir)

    def test_get_file_system_data_child_is_mdl(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.mdl")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with(text="test_file.mdl", f_type="nonspatial", p_path=tempdir)

    def test_get_file_system_data_child_is_smdl(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.smdl")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with(text="test_file.smdl", f_type="spatial", p_path=tempdir)

    def test_get_file_system_data_child_is_mesh(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.mesh")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with(text="test_file.mesh", f_type="mesh", p_path=tempdir)

    def test_get_file_system_data_child_is_ipynb(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.ipynb")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with(text="test_file.ipynb", f_type="notebook", p_path=tempdir)

    def test_get_file_system_data_child_is_sbml(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.sbml")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with(text="test_file.sbml", f_type="sbml-model", p_path=tempdir)

    def test_get_file_system_data_child_is_dir(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_dir_path = os.path.join(test_path, "test_dir")
            os.mkdir(test_dir_path)
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with(text="test_dir", f_type="folder", p_path=tempdir)

    def test_get_file_system_data_child_is_other(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.foo")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.buildChild") as mock_buildChild:
                children = ls.getFileSystemData(test_path, tempdir)
            mock_buildChild.assert_called_once_with(text="test_file.foo", f_type="other", p_path=tempdir)

    #unit tests for method buildChild

    def test_buildChild_top_level(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_p_path = "none"
            test_text = "test_text"
            test_f_type = "test_f_type"
            assert ls.buildChild(text=test_text, f_type=test_f_type, p_path=test_p_path) == {"text" : "test_text", "type" : "test_f_type", "_path" : "test_text", "children" : False}

    def test_buildChild_sub_level(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_p_path = "test_p_path"
            test_text = "test_text"
            test_f_type = "test_f_type"
            assert ls.buildChild(text=test_text, f_type=test_f_type, p_path=test_p_path) == {"text" : "test_text", "type" : "test_f_type", "_path" : os.path.join(test_p_path, test_text), "children" : False}

    def test_buildChild_wkfl_calls_get_status(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_p_path = "test_p_path"
            test_text = "test_text"
            test_f_type = "workflow"
            with unittest.mock.patch("handlers.util.ls.get_status") as mock_get_status:
                ls.buildChild(text=test_text, p_path=test_p_path, f_type=test_f_type)
                mock_get_status.assert_called()

    #unit tests for method buildRoot

    def test_buildRoot(self):
        test_children = "test_children"
        assert ls.buildRoot(test_children) == [{"text":"/", "type":"root", "_path":"/", "children":"test_children", "state":{"opened":True}}]

    #unit tests for method checkExtension

    def test_checkExtension_true(self):
        test_str = "test"
        test_target = "target"
        test_name = test_str + test_target
        assert ls.checkExtension(test_name, test_target)

    def test_checkExtension_false(self):
        test_str = "test"
        test_target = "target"
        test_name = test_str
        assert not ls.checkExtension(test_name, test_target)

    #unit tests for method ls

    def test_ls_p_path_none(self):
        test_p_path = "none"
        with unittest.mock.patch("handlers.util.ls.buildRoot") as mock_buildRoot:
            with unittest.mock.patch("handlers.util.ls.getFileSystemData", return_value="test_return") as mock_getFileSystemData:
                with unittest.mock.patch("json.dumps") as mock_json:
                    ls.ls(p_path=test_p_path)
        mock_getFileSystemData.assert_called()
        mock_buildRoot.assert_called_with("test_return")

    def test_ls_p_path_not_none(self):
        test_p_path = "test_p_path"
        test_full_path = os.path.join("/home/jovyan", test_p_path)
        with unittest.mock.patch("handlers.util.ls.buildRoot") as mock_buildRoot:
            with unittest.mock.patch("handlers.util.ls.getFileSystemData", return_value="test_return") as mock_getFileSystemData:
                with unittest.mock.patch("json.dumps") as mock_json:
                    ls.ls(p_path=test_p_path)
        mock_getFileSystemData.assert_called_with(test_full_path, test_p_path)
