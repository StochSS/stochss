"""Unit tests for handlers.util.ls.py"""
import unittest
import os
import tempfile
from pathlib import Path

import handlers.util.ls as ls
from handlers.util.stochss_errors import StochSSFileNotFoundError

class TestLS(unittest.TestCase):
    """Unit test container for handlers.util.ls.py"""

    #unit tests for method get_file_system_data

    def test_get_file_system_data_dir_not_found(self):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "nonexistent_dir")
            with self.assertRaises(StochSSFileNotFoundError):
                ls.get_file_system_data(test_path, tempdir)

    @classmethod
    def test_get_file_system_data_no_children(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "empty_dir")
            os.mkdir(test_path)
            children = ls.get_file_system_data(test_path, tempdir)
            assert len(children) == 0

    @classmethod
    def test_get_file_system_data_child_is_wkfl(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.wkfl")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with \
                (text="test_file.wkfl", f_type="workflow", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_mdl(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.mdl")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_file.mdl", f_type="nonspatial", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_smdl(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.smdl")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_file.smdl", f_type="spatial", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_mesh(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.mesh")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_file.mesh", f_type="mesh", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_ipynb(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.ipynb")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_file.ipynb", f_type="notebook", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_sbml(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.sbml")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_file.sbml", f_type="sbml-model", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_dir(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_dir_path = os.path.join(test_path, "test_dir")
            os.mkdir(test_dir_path)
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_dir", f_type="folder", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_other(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_file_path = os.path.join(test_path, "test_file.foo")
            Path(test_file_path).touch()
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_file.foo", f_type="other", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_exp(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_dir_path = os.path.join(test_path, "test_dir.exp")
            os.mkdir(test_dir_path)
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_dir.exp", f_type="workflow-group", p_path=tempdir)

    @classmethod
    def test_get_file_system_data_child_is_proj(cls):
        with tempfile.TemporaryDirectory() as tempdir:
            test_path = os.path.join(tempdir, "parent_dir")
            os.mkdir(test_path)
            test_dir_path = os.path.join(test_path, "test_dir.proj")
            os.mkdir(test_dir_path)
            with unittest.mock.patch("handlers.util.ls.build_child") as mock_build_child:
                ls.get_file_system_data(test_path, tempdir)
            mock_build_child.assert_called_once_with\
                    (text="test_dir.proj", f_type="project", p_path=tempdir)

    #unit tests for method build_child

    @classmethod
    def test_build_child_top_level(cls):
        with tempfile.TemporaryDirectory():
            test_p_path = "none"
            test_text = "test_text"
            test_f_type = "test_f_type"
            assert ls.build_child(text=test_text, f_type=test_f_type, p_path=test_p_path) ==\
                    {"text" : "test_text", "type" : "test_f_type", \
                    "_path" : "test_text", "children" : False}

    @classmethod
    def test_build_child_sub_level(cls):
        with tempfile.TemporaryDirectory():
            test_p_path = "test_p_path"
            test_text = "test_text"
            test_f_type = "test_f_type"
            assert ls.build_child(text=test_text, f_type=test_f_type, p_path=test_p_path) == \
                    {"text" : "test_text", "type" : "test_f_type", \
                    "_path" : os.path.join(test_p_path, test_text), "children" : False}

    @classmethod
    def test_build_child_wkfl_calls_get_status(cls):
        with tempfile.TemporaryDirectory():
            test_p_path = "test_p_path"
            test_text = "test_text"
            test_f_type = "workflow"
            with unittest.mock.patch("handlers.util.ls.get_status") as mock_get_status:
                ls.build_child(text=test_text, p_path=test_p_path, f_type=test_f_type)
                mock_get_status.assert_called()

    #unit tests for method build_root

    @classmethod
    def test_build_root(cls):
        test_children = "test_children"
        assert ls.build_root(test_children) ==\
                [{"text":"/", "type":"root", "_path":"/", \
                "children":"test_children", "state":{"opened":True}}]

    #unit tests for method check_extension

    @classmethod
    def test_check_extension_true(cls):
        test_str = "test"
        test_target = "target"
        test_name = test_str + test_target
        assert ls.check_extension(test_name, test_target)

    @classmethod
    def test_check_extension_false(cls):
        test_str = "test"
        test_target = "target"
        test_name = test_str
        assert not ls.check_extension(test_name, test_target)

    #unit tests for method list_files

    @classmethod
    def test_ls_p_path_none(cls):
        test_p_path = "none"
        with unittest.mock.patch("handlers.util.ls.build_root") as mock_build_root:
            with unittest.mock.patch("handlers.util.ls.get_file_system_data", \
                    return_value="test_return") as mock_get_file_system_data:
                with unittest.mock.patch("json.dumps"):
                    ls.list_files(p_path=test_p_path)
        mock_get_file_system_data.assert_called()
        mock_build_root.assert_called_with("test_return")

    @classmethod
    def test_ls_p_path_not_none(cls):
        test_p_path = "test_p_path"
        test_full_path = os.path.join("/home/jovyan", test_p_path)
        with unittest.mock.patch("handlers.util.ls.build_root"):
            with unittest.mock.patch("handlers.util.ls.get_file_system_data", \
                    return_value="test_return") as mock_get_file_system_data:
                with unittest.mock.patch("json.dumps"):
                    ls.list_files(p_path=test_p_path)
        mock_get_file_system_data.assert_called_with(test_full_path, test_p_path)
