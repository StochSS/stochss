'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

import os
import json
import shutil
import logging
import unittest
import tempfile
import datetime

from unittest import mock
from pathlib import Path

from stochss.handlers import StochSSBase
from stochss.handlers.util.stochss_errors import StochSSFileNotFoundError, FileNotJSONFormatError, \
                                                 StochSSPermissionsError

os.chdir('/stochss')

# pylint: disable=too-many-public-methods
# pylint: disable=line-too-long
class TestStochSSBaseObject(unittest.TestCase):
    '''
    ################################################################################################
    Unit tests for the StochSS base class.
    ################################################################################################
    '''
    def setUp(self):
        ''' Create a temporary directory with a file and folder for each base test. '''
        self.user_dir = os.path.expanduser("~")
        self.tempdir = tempfile.TemporaryDirectory()
        test_filename = "test_base_file"
        test_foldername = "test_base_folder"
        self.test_filepath = os.path.join(self.tempdir.name, test_filename)
        Path(self.test_filepath).touch()
        self.test_folderpath = os.path.join(self.tempdir.name, test_foldername)
        os.mkdir(self.test_folderpath)


    def tearDown(self):
        ''' Cleanup the temp directory after each test. '''
        self.tempdir.cleanup()
        if StochSSBase.user_dir != os.path.expanduser("~"):
            StochSSBase.user_dir = os.path.expanduser("~")

    ################################################################################################
    # Unit tests for the StochSS base class add_presentation_name function.
    ################################################################################################

    def test_add_presentation_name__file_exists(self):
        ''' Check if the presentation name is add to the presentation names file. '''
        StochSSBase.user_dir = self.tempdir.name
        test_base = StochSSBase(path="")
        with mock.patch("os.path.exists", return_value=True):
            with mock.patch("builtins.open", mock.mock_open(read_data="{}")):
                with mock.patch("json.dump") as mock_json_dump:
                    test_base.add_presentation_name("foo", "bar")
                    mock_json_dump.assert_called_once_with({'foo': 'bar'}, mock.ANY)


    def test_add_presentation_name__file_does_not_exists(self):
        ''' Check if the presentation names file was created with the given entry. '''
        StochSSBase.user_dir = self.tempdir.name
        test_base = StochSSBase(path="")
        with mock.patch("builtins.open", mock.mock_open()):
            with mock.patch("json.dump") as mock_json_dump:
                test_base.add_presentation_name("foo", "bar")
                mock_json_dump.assert_called_once_with({'foo': 'bar'}, mock.ANY)

    ################################################################################################
    # Unit tests for the StochSS base class check_project_format function.
    ################################################################################################

    def test_check_project_format__old_with_mdl(self):
        ''' Check if the project is identified as old when it contains a model. '''
        test_files = ["test_model.mdl", "test_model.smdl"]
        for test_file in test_files:
            with self.subTest(test_file=test_file):
                test_file_path = os.path.join(self.test_folderpath, test_file)
                Path(test_file_path).touch()
                self.assertFalse(StochSSBase.check_project_format(path=self.test_folderpath))
                self.tearDown()
                self.setUp()


    def test_check_project_format__old_with_wkgp1(self):
        ''' Check if the project is identified as old when it contains one
        workflow group with the name WorkflowGroup1.wkgp. '''
        test_wkgp = os.path.join(self.test_folderpath, "WorkflowGroup1.wkgp")
        os.mkdir(test_wkgp)
        self.assertFalse(StochSSBase.check_project_format(path=self.test_folderpath))


    def test_check_project_format__new_empty(self):
        ''' Check if the project is identified as new when empty. '''
        self.assertTrue(StochSSBase.check_project_format(path=self.test_folderpath))


    def test_check_project_format__new_with_one_wkgp_not_wkgp1(self):
        ''' Check if the project is identified as new with one workflow group. '''
        test_wkgp = os.path.join(self.test_folderpath, "test_wkgp.wkgp")
        os.mkdir(test_wkgp)
        self.assertTrue(StochSSBase.check_project_format(path=self.test_folderpath))


    def test_check_project_format__new_with_x_wkgps(self):
        ''' Check if the project is identified as new with multiple workflow groups. '''
        test_wkgp1 = os.path.join(self.test_folderpath, "test_wkgp1.wkgp")
        os.mkdir(test_wkgp1)
        test_wkgp2 = os.path.join(self.test_folderpath, "test_wkgp2.wkgp")
        os.mkdir(test_wkgp2)
        self.assertTrue(StochSSBase.check_project_format(path=self.test_folderpath))

    ################################################################################################
    # Unit tests for the StochSS base class check_workflow_format function.
    ################################################################################################

    def test_check_workflow_format__old_with_old_files(self):
        ''' Check if the workflow is identified as old when it an old file. '''
        test_files = ["info.json", "logs.txt", "RUNNING", "ERROR", "COMPLETE", "test_model.mdl"]
        for test_file in test_files:
            with self.subTest(test_file=test_file):
                test_file_path = os.path.join(self.test_folderpath, test_file)
                Path(test_file_path).touch()
                self.assertFalse(StochSSBase.check_workflow_format(path=self.test_folderpath))
                self.tearDown()
                self.setUp()


    def test_check_workflow_format__old_with_results(self):
        ''' Check if the workflow is identified as old when it a results folder. '''
        test_dir = os.path.join(self.test_folderpath, "results")
        os.mkdir(test_dir)
        self.assertFalse(StochSSBase.check_workflow_format(path=self.test_folderpath))


    def test_check_workflow_format__new(self):
        ''' Check if the workflow is identified as old. '''
        self.assertTrue(StochSSBase.check_workflow_format(path=self.test_folderpath))

    ################################################################################################
    # Unit tests for the StochSS base class delete_presentation_name function.
    ################################################################################################

    def test_delete_presentation_name(self):
        ''' Check if the target presentation was removed from the presentation names file. '''
        StochSSBase.user_dir = self.tempdir.name
        test_base = StochSSBase(path="")
        with mock.patch("builtins.open", mock.mock_open(read_data='{"foo": "bar"}')):
            with mock.patch("json.dump") as mock_json_dump:
                test_base.delete_presentation_name("foo")
                mock_json_dump.assert_called_once_with({}, mock.ANY)

    ################################################################################################
    # Unit tests for the StochSS base class get_new_path function.
    ################################################################################################

    def test_get_new_path(self):
        ''' Check if the new path is generated correctly. '''
        test_dst_path = os.path.join(self.test_folderpath, "test_file")
        test_file_path = StochSSBase.get_new_path(dst_path=test_dst_path)
        self.assertEqual(test_file_path, os.path.join(self.user_dir, test_dst_path))


    def test_get_new_path__no_trash_folder(self):
        ''' Check if the trash directory is created. '''
        test_dst_path = os.path.join("trash", "test_file")
        StochSSBase.user_dir = self.test_folderpath
        StochSSBase.get_new_path(dst_path=test_dst_path)
        self.assertTrue(os.path.exists(os.path.join(self.test_folderpath, "trash")))



    def test_get_new_path__remove_trash_datetime_stamp(self):
        ''' Check if the trash datetime stamp is removed from files moving out of trash. '''
        test_dst_path = os.path.join(self.test_folderpath, "trash", "test_file 2021.06.28.08.50.30")
        test_file_path = StochSSBase.get_new_path(dst_path=test_dst_path)
        expected_path = os.path.join(self.user_dir, os.path.join(self.test_folderpath, "trash", "test_file"))
        self.assertEqual(test_file_path, expected_path)

    def test_get_new_path__add_trash_datetime_stamp(self):
        ''' Check if the trash datetime stamp is added to duplicate files moved into trash. '''
        os.mkdir(os.path.join(self.test_folderpath, "trash"))
        test_dst_path = os.path.join(self.test_folderpath, "trash", "test_file")
        Path(test_dst_path).touch()
        test_file_path = StochSSBase.get_new_path(dst_path=test_dst_path)
        stamp = datetime.datetime.now().strftime(" %y.%m.%d.%H.%M.%S")
        expected_path = os.path.join(self.user_dir, os.path.join(self.test_folderpath, "trash", f"test_file{stamp}"))
        self.assertEqual(test_file_path, expected_path)

    ################################################################################################
    # Unit tests for the StochSS base class get_file function.
    ################################################################################################

    def test_get_file__no_path_passed(self):
        ''' Check if the file from self.path of StochSSBase is returned. '''
        test_base = StochSSBase(path=self.test_folderpath)
        self.assertEqual(test_base.get_file(), "test_base_folder")


    def test_get_file__path_passed(self):
        ''' Check is the file from the passed in path is returned. '''
        test_base = StochSSBase(path=self.test_folderpath)
        self.assertEqual(test_base.get_file(path=self.test_filepath), "test_base_file")

    ################################################################################################
    # Unit tests for the StochSS base class get_model_template function.
    ################################################################################################

    def test_get_model_template__as_dict(self):
        ''' Check if the model template is returned as a dictionary. '''
        test_base = StochSSBase(path=self.test_filepath)
        test_template = test_base.get_model_template()
        self.assertIsInstance(test_template, dict)


    def test_get_model_template__as_str(self):
        ''' Check is the model template is returned as a string. '''
        test_base = StochSSBase(path=self.test_filepath)
        test_template = test_base.get_model_template(as_string=True)
        self.assertIsInstance(test_template, str)


    def test_get_model_template__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the template file is missing. '''
        test_base = StochSSBase(path=self.test_filepath)
        with mock.patch("builtins.open", mock.mock_open()) as mock_file:
            mock_file.side_effect = FileNotFoundError
            with self.assertRaises(StochSSFileNotFoundError):
                test_base.get_model_template()


    def test_get_model_template__json_decoder_error(self):
        ''' Check is the FileNotJSONFormatError is raised when the template is not properly formatted. '''
        test_base = StochSSBase(path=self.test_filepath)
        with mock.patch("json.load") as mock_load:
            mock_load.side_effect = json.decoder.JSONDecodeError(msg="", doc="", pos=1)
            with self.assertRaises(FileNotJSONFormatError):
                test_base.get_model_template()

    ################################################################################################
    # Unit tests for the StochSS base class get_settings_template function.
    ################################################################################################

    def test_get_settings_template__as_dict(self):
        ''' Check if the settings template is returned as a dictionary. '''
        test_base = StochSSBase(path=self.test_filepath)
        test_template = test_base.get_settings_template()
        self.assertIsInstance(test_template, dict)


    def test_get_settings_template__as_str(self):
        ''' Check is the settings template is returned as a string. '''
        test_base = StochSSBase(path=self.test_filepath)
        test_template = test_base.get_settings_template(as_string=True)
        self.assertIsInstance(test_template, str)


    def test_get_settings_template__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the template file is missing. '''
        test_base = StochSSBase(path=self.test_filepath)
        with mock.patch("builtins.open", mock.mock_open()) as mock_file:
            mock_file.side_effect = FileNotFoundError
            with self.assertRaises(StochSSFileNotFoundError):
                test_base.get_settings_template()


    def test_get_settings_template__json_decoder_error(self):
        ''' Check is the FileNotJSONFormatError is raised when the template is not properly formatted. '''
        test_base = StochSSBase(path=self.test_filepath)
        with mock.patch("json.load") as mock_load:
            mock_load.side_effect = json.decoder.JSONDecodeError(msg="", doc="", pos=1)
            with self.assertRaises(FileNotJSONFormatError):
                test_base.get_settings_template()

    ################################################################################################
    # Unit tests for the StochSS base class get_name function.
    ################################################################################################

    def test_get_name__no_path_passed(self):
        ''' Check in the names are return correctly when a path is not passed in. '''
        test_paths = ["test_file", "test_file/", "test_folder/test_file", "test_file.txt"]
        for test_path in test_paths:
            with self.subTest(test_path=test_path):
                test_base = StochSSBase(path=test_path)
                self.assertEqual(test_base.get_name(), "test_file")


    def test_get_name__path_passed(self):
        ''' Check in the names are return correctly when a path is passed in. '''
        test_paths = ["test_file", "test_file/", "test_folder/test_file", "test_file.txt"]
        test_base = StochSSBase(path=self.test_folderpath)
        for test_path in test_paths:
            with self.subTest(test_path=test_path):
                self.assertEqual(test_base.get_name(path=test_path), "test_file")

    ################################################################################################
    # Unit tests for the StochSS base class get_path function.
    ################################################################################################

    def test_get_path__with_out_user_dir(self):
        ''' Check if the path is returned w/o the user directory. '''
        test_base = StochSSBase(path=self.test_filepath)
        self.assertEqual(test_base.get_path(), self.test_filepath)

    def test_get_path__with_user_dir(self):
        ''' Check if the path is returneded with the user directory. '''
        test_base = StochSSBase(path=self.test_filepath)
        self.assertEqual(test_base.get_path(full=True), os.path.join(self.user_dir, self.test_filepath))

    ################################################################################################
    # Unit tests for the StochSS base class get_dir_name function.
    ################################################################################################

    def test_get_dir_name__with_out_user_dir__root(self):
        ''' Check if the dirname is an empty string. '''
        test_base = StochSSBase(path="test_file")
        self.assertEqual(test_base.get_dir_name(), "")


    def test_get_dir_name__with_out_user_dir__not_root(self):
        ''' Check if the dirname is returned w/o the user directory. '''
        test_base = StochSSBase(path="test_folder/test_file")
        self.assertEqual(test_base.get_dir_name(), "test_folder")


    def test_get_dir_name__with_user_dir__root(self):
        ''' Check if the dirname is the user directory. '''
        test_base = StochSSBase(path="test_file")
        self.assertEqual(test_base.get_dir_name(full=True), self.user_dir)


    def test_get_dir_name__with_user_dir__not_root(self):
        ''' Check if the dirname is returned with the user directory. '''
        test_base = StochSSBase(path="test_folder/test_file")
        self.assertEqual(test_base.get_dir_name(full=True), os.path.join(self.user_dir, "test_folder"))

    ################################################################################################
    # Unit tests for the StochSS base class get_status function.
    ################################################################################################

    def test_get_status__ready__no_path_passed(self):
        ''' Check if ready status is returned when no status file are found and no path is passed in. '''
        test_base = StochSSBase(path=self.test_folderpath)
        self.assertEqual(test_base.get_status(), "ready")


    def test_get_status__ready__path_passed(self):
        ''' Check if ready status is returned when no status file are found and a path is passed in. '''
        test_base = StochSSBase(path=self.test_filepath)
        self.assertEqual(test_base.get_status(path=self.test_folderpath), "ready")


    def test_get_status__other__no_path_passed(self):
        ''' Check if the status is returned correctly for status files when no path is passed in. '''
        test_files = ["COMPLETE", "ERROR", "RUNNING"]
        expected_results = ["complete", "error", "running"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                test_path = os.path.join(self.test_folderpath, test_file)
                Path(test_path).touch()
                test_base = StochSSBase(path=self.test_folderpath)
                self.assertEqual(test_base.get_status(), expected_results[i])
                self.tearDown()
                self.setUp()


    def test_get_status__other__path_passed(self):
        ''' Check if the status is returned correctly for status files when no path is passed in. '''
        test_files = ["COMPLETE", "ERROR", "RUNNING"]
        expected_results = ["complete", "error", "running"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                test_path = os.path.join(self.test_folderpath, test_file)
                Path(test_path).touch()
                test_base = StochSSBase(path=self.test_filepath)
                self.assertEqual(test_base.get_status(path=self.test_folderpath), expected_results[i])
                self.tearDown()
                self.setUp()


    def test_get_status__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the job is missing. '''
        test_base = StochSSBase(path=self.test_folderpath)
        with mock.patch("os.listdir") as mock_folder:
            mock_folder.side_effect = FileNotFoundError
            with self.assertRaises(StochSSFileNotFoundError):
                test_base.get_status()


    ################################################################################################
    # Unit tests for the StochSS base class get_unique_path function.
    ################################################################################################

    def test_get_unique_path__with_out_dirname__dirname_is_root__unique(self):
        ''' Check if you get the correct unique name for a file in root. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(2)", "test_file(2).txt", "test_file(one)", "test_file(one).txt"]
        for test_file in test_files:
            with self.subTest(test_file=test_file):
                test_base = StochSSBase(path="test_base_file")
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertFalse(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, test_file))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_out_dirname__dirname_is_root__one_iter(self):
        ''' Check if you get the correct unique name for a file in root when file already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(one)", "test_file(one).txt"]
        expected_results = ["test_file(1)", "test_file(1).txt", "test_file(2)", "test_file(2).txt",
                            "test_file(one)(1)", "test_file(one)(1).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_file)).touch()
                test_base = StochSSBase(path="test_base_file")
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_out_dirname__dirname_is_root__two_iter(self):
        ''' Check if you get the correct unique name for a file in root when a file and iter already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(one)", "test_file(one).txt"]
        test_preqs = ["test_file(1)", "test_file(1).txt", "test_file(2)", "test_file(2).txt",
                      "test_file(one)(1)", "test_file(one)(1).txt"]
        expected_results = ["test_file(2)", "test_file(2).txt", "test_file(3)", "test_file(3).txt",
                            "test_file(one)(2)", "test_file(one)(2).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_file)).touch()
                Path(os.path.join(self.test_folderpath, test_preqs[i])).touch()
                test_base = StochSSBase(path="test_base_file")
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_out_dirname__dirname_is_root__first_iter_removed(self):
        ''' Check if you get the correct unique name for a file in root when a iter already exists. '''
        test_files = ["test_file(2)", "test_file(2).txt", "test_file(one)(2)", "test_file(one)(2).txt"]
        test_preqs = ["test_file", "test_file.txt", "test_file(one)", "test_file(one).txt"]
        expected_results = ["test_file(1)", "test_file(1).txt", "test_file(one)(1)", "test_file(one)(1).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_file)).touch()
                Path(os.path.join(self.test_folderpath, test_preqs[1])).touch()
                test_base = StochSSBase(path="test_base_file")
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_out_dirname__dirname_not_root__unique(self):
        ''' Check if you get the correct unique name for a file not in root. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(2)", "test_file(2).txt", "test_file(one)", "test_file(one).txt"]
        for test_file in test_files:
            with self.subTest(test_file=test_file):
                os.mkdir(os.path.join(self.test_folderpath, "test_folder"))
                test_base = StochSSBase(path=os.path.join("test_folder/test_base_file"))
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertFalse(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, "test_folder", test_file))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_out_dirname__dirname_not_root__one_iter(self):
        ''' Check if you get the correct unique name for a file not in root when file already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(one)", "test_file(one).txt"]
        expected_results = ["test_file(1)", "test_file(1).txt", "test_file(2)", "test_file(2).txt",
                            "test_file(one)(1)", "test_file(one)(1).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                os.mkdir(os.path.join(self.test_folderpath, "test_folder"))
                Path(os.path.join(self.test_folderpath, "test_folder", test_file)).touch()
                test_base = StochSSBase(path=os.path.join("test_folder/test_base_file"))
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, "test_folder", expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_out_dirname__dirname_not_root__two_iter(self):
        ''' Check if you get the correct unique name for a file not in root when a file and iter already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(one)", "test_file(one).txt"]
        test_preqs = ["test_file(1)", "test_file(1).txt", "test_file(2)", "test_file(2).txt",
                      "test_file(one)(1)", "test_file(one)(1).txt"]
        expected_results = ["test_file(2)", "test_file(2).txt", "test_file(3)", "test_file(3).txt",
                            "test_file(one)(2)", "test_file(one)(2).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                os.mkdir(os.path.join(self.test_folderpath, "test_folder"))
                Path(os.path.join(self.test_folderpath, "test_folder", test_file)).touch()
                Path(os.path.join(self.test_folderpath, "test_folder", test_preqs[i])).touch()
                test_base = StochSSBase(path=os.path.join("test_folder/test_base_file"))
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, "test_folder", expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_out_dirname__dirname_not_root__first_iter_removed(self):
        ''' Check if you get the correct unique name for a file not in root when a iter already exists. '''
        test_files = ["test_file(2)", "test_file(2).txt", "test_file(one)(2)", "test_file(one)(2).txt"]
        test_preqs = ["test_file", "test_file.txt", "test_file(one)", "test_file(one).txt"]
        expected_results = ["test_file(1)", "test_file(1).txt", "test_file(one)(1)", "test_file(one)(1).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                os.mkdir(os.path.join(self.test_folderpath, "test_folder"))
                Path(os.path.join(self.test_folderpath, "test_folder", test_file)).touch()
                Path(os.path.join(self.test_folderpath, "test_folder", test_preqs[1])).touch()
                test_base = StochSSBase(path="test_folder/test_base_file")
                test_base.user_dir = self.test_folderpath
                unique_path, changed = test_base.get_unique_path(name=test_file)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, "test_folder", expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_dirname__unique(self):
        ''' Check if you get the correct unique name for a file. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(2)", "test_file(2).txt", "test_file(one)", "test_file(one).txt"]
        for test_file in test_files:
            with self.subTest(test_file=test_file):
                test_base = StochSSBase(path=self.test_filepath)
                unique_path, changed = test_base.get_unique_path(name=test_file,
                                                                 dirname=self.test_folderpath)
                self.assertFalse(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, test_file))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_dirname__one_iter(self):
        ''' Check if you get the correct unique name for a file when file already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(one)", "test_file(one).txt"]
        expected_results = ["test_file(1)", "test_file(1).txt", "test_file(2)", "test_file(2).txt",
                            "test_file(one)(1)", "test_file(one)(1).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_file)).touch()
                test_base = StochSSBase(path=self.test_filepath)
                unique_path, changed = test_base.get_unique_path(name=test_file,
                                                                 dirname=self.test_folderpath)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_dirname__two_iter(self):
        ''' Check if you get the correct unique name for a file when a file and iter already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file(1)", "test_file(1).txt",
                      "test_file(one)", "test_file(one).txt"]
        test_preqs = ["test_file(1)", "test_file(1).txt", "test_file(2)", "test_file(2).txt",
                      "test_file(one)(1)", "test_file(one)(1).txt"]
        expected_results = ["test_file(2)", "test_file(2).txt", "test_file(3)", "test_file(3).txt",
                            "test_file(one)(2)", "test_file(one)(2).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_file)).touch()
                Path(os.path.join(self.test_folderpath, test_preqs[i])).touch()
                test_base = StochSSBase(path=self.test_filepath)
                unique_path, changed = test_base.get_unique_path(name=test_file,
                                                                 dirname=self.test_folderpath)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_path__with_dirname__dirname__first_iter_removed(self):
        ''' Check if you get the correct unique name for a file in root when a iter already exists. '''
        test_files = ["test_file(2)", "test_file(2).txt", "test_file(one)(2)", "test_file(one)(2).txt"]
        test_preqs = ["test_file", "test_file.txt", "test_file(one)", "test_file(one).txt"]
        expected_results = ["test_file(1)", "test_file(1).txt", "test_file(one)(1)", "test_file(one)(1).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_file)).touch()
                Path(os.path.join(self.test_folderpath, test_preqs[1])).touch()
                test_base = StochSSBase(path=self.test_filepath)
                unique_path, changed = test_base.get_unique_path(name=test_file,
                                                                 dirname=self.test_folderpath)
                self.assertTrue(changed)
                self.assertEqual(unique_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()

    ################################################################################################
    # Unit tests for the StochSS base class get_unique_copy_path function.
    ################################################################################################

    def test_get_unique_copy_path__with_out_path__dirname_is_root__one_iter(self):
        ''' Check if you get the correct copy path for a file in root when path already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file-copy", "test_file-copy.txt"]
        expected_results = ["test_file-copy", "test_file-copy.txt", "test_file-copy(2)", "test_file-copy(2).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                test_base = StochSSBase(path=test_file)
                test_base.user_dir = self.test_folderpath
                unique_copy_path = test_base.get_unique_copy_path()
                self.assertEqual(unique_copy_path, expected_results[i])
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_out_path__dirname_is_root__two_iter(self):
        ''' Check if you get the correct copy path for a file in root when path and iter already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file-copy", "test_file-copy.txt"]
        test_preqs = ["test_file-copy", "test_file-copy.txt", "test_file-copy(2)", "test_file-copy(2).txt"]
        expected_results = ["test_file-copy(2)", "test_file-copy(2).txt", "test_file-copy(3)", "test_file-copy(3).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_preqs[i])).touch()
                test_base = StochSSBase(path=test_file)
                test_base.user_dir = self.test_folderpath
                unique_copy_path = test_base.get_unique_copy_path()
                self.assertEqual(unique_copy_path, expected_results[i])
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_out_path__dirname_is_root__first_iter_removed(self):
        ''' Check if you get the correct copy path for a file in root when a iter already exists. '''
        test_files = ["test_file-copy(2)", "test_file-copy(2).txt"]
        expected_results = ["test_file-copy", "test_file-copy.txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                test_base = StochSSBase(path=test_file)
                test_base.user_dir = self.test_folderpath
                unique_copy_path = test_base.get_unique_copy_path()
                self.assertEqual(unique_copy_path, expected_results[i])
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_out_path__dirname_not_root__one_iter(self):
        ''' Check if you get the correct copy path for a file not in root when path already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file-copy", "test_file-copy.txt"]
        expected_results = ["test_file-copy", "test_file-copy.txt", "test_file-copy(2)", "test_file-copy(2).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                os.mkdir(os.path.join(self.test_folderpath, "test_folder"))
                test_base = StochSSBase(path=os.path.join("test_folder", test_file))
                test_base.user_dir = self.test_folderpath
                unique_copy_path = test_base.get_unique_copy_path()
                self.assertEqual(unique_copy_path, os.path.join("test_folder", expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_out_path__dirname_not_root__two_iter(self):
        ''' Check if you get the correct copy path for a file not in root when path and iter already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file-copy", "test_file-copy.txt"]
        test_preqs = ["test_file-copy", "test_file-copy.txt", "test_file-copy(2)", "test_file-copy(2).txt"]
        expected_results = ["test_file-copy(2)", "test_file-copy(2).txt", "test_file-copy(3)", "test_file-copy(3).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                os.mkdir(os.path.join(self.test_folderpath, "test_folder"))
                Path(os.path.join(self.test_folderpath, "test_folder", test_preqs[i])).touch()
                test_base = StochSSBase(path=os.path.join("test_folder", test_file))
                test_base.user_dir = self.test_folderpath
                unique_copy_path = test_base.get_unique_copy_path()
                self.assertEqual(unique_copy_path, os.path.join("test_folder", expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_out_path__dirname_not_root__first_iter_removed(self):
        ''' Check if you get the correct copy for a file not in root when a iter already exists. '''
        test_files = ["test_file-copy(2)", "test_file-copy(2).txt"]
        expected_results = ["test_file-copy", "test_file-copy.txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                os.mkdir(os.path.join(self.test_folderpath, "test_folder"))
                test_base = StochSSBase(path=os.path.join("test_folder", test_file))
                test_base.user_dir = self.test_folderpath
                unique_copy_path = test_base.get_unique_copy_path()
                self.assertEqual(unique_copy_path, os.path.join("test_folder", expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_path__one_iter(self):
        ''' Check if you get the correct copy path for a file when path already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file-copy", "test_file-copy.txt"]
        expected_results = ["test_file-copy", "test_file-copy.txt", "test_file-copy(2)", "test_file-copy(2).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                test_base = StochSSBase(path=self.test_filepath)
                unique_copy_path = test_base.get_unique_copy_path(path=os.path.join(self.test_folderpath, test_file))
                self.assertEqual(unique_copy_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_path__two_iter(self):
        ''' Check if you get the correct copy path for a file when path and iter already exists. '''
        test_files = ["test_file", "test_file.txt", "test_file-copy", "test_file-copy.txt"]
        test_preqs = ["test_file-copy", "test_file-copy.txt", "test_file-copy(2)", "test_file-copy(2).txt"]
        expected_results = ["test_file-copy(2)", "test_file-copy(2).txt", "test_file-copy(3)", "test_file-copy(3).txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                Path(os.path.join(self.test_folderpath, test_preqs[i])).touch()
                test_base = StochSSBase(path=self.test_filepath)
                unique_copy_path = test_base.get_unique_copy_path(path=os.path.join(self.test_folderpath, test_file))
                self.assertEqual(unique_copy_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()


    def test_get_unique_copy_path__with_path__first_iter_removed(self):
        ''' Check if you get the correct copy for a file when a iter already exists. '''
        test_files = ["test_file-copy(2)", "test_file-copy(2).txt"]
        expected_results = ["test_file-copy", "test_file-copy.txt"]
        for i, test_file in enumerate(test_files):
            with self.subTest(test_file=test_file):
                test_base = StochSSBase(path=self.test_filepath)
                unique_copy_path = test_base.get_unique_copy_path(path=os.path.join(self.test_folderpath, test_file))
                self.assertEqual(unique_copy_path, os.path.join(self.test_folderpath, expected_results[i]))
                self.tearDown()
                self.setUp()

    ################################################################################################
    # Unit tests for the StochSS base class log function.
    ################################################################################################

    def test_log(self):
        ''' Check if log is added correctly '''
        test_base = StochSSBase(path=self.test_filepath)
        test_log = {"level": "debug", "message": "testing base log"}
        test_base.log("debug", "testing base log")
        self.assertIn(test_log, test_base.logs)

    ################################################################################################
    # Unit tests for the StochSS base class make_parent_dirs function.
    ################################################################################################

    def test_make_parent_dirs__one_missing_dir(self):
        ''' Check if the parent directories are made correctly. '''
        test_path = os.path.join(self.test_folderpath, "test_folder")
        test_base = StochSSBase(path=self.test_folderpath)
        with mock.patch('stochss.handlers.util.StochSSBase.get_dir_name') as mock_get_dir_name:
            mock_get_dir_name.return_value = test_path
            test_base.make_parent_dirs()
            self.assertIn("test_folder", os.listdir(self.test_folderpath))


    def test_make_parent_dirs__multiple_missing_dir(self):
        ''' Check if the parent directories are made correctly. '''
        test_path = os.path.join(self.test_folderpath, "test_folder1", "test_folder2")
        test_base = StochSSBase(path=self.test_folderpath)
        with mock.patch('stochss.handlers.util.StochSSBase.get_dir_name') as mock_get_dir_name:
            mock_get_dir_name.return_value = test_path
            test_base.make_parent_dirs()
            self.assertIn("test_folder1", os.listdir(self.test_folderpath))
            self.assertIn("test_folder2", os.listdir(os.path.join(self.test_folderpath, "test_folder1")))

    ################################################################################################
    # Unit tests for the StochSS base class print_logs function.
    ################################################################################################

    def test_print_logs__debug(self):
        ''' Check if debug log is logged correctly. '''
        log = logging.getLogger('stochss')
        test_base = StochSSBase(path=self.test_folderpath)
        test_base.log("debug", "testing debug log")
        with mock.patch("stochss.handlers.log.log.debug") as mock_debug_log:
            test_base.print_logs(log)
            mock_debug_log.assert_called_once_with("testing debug log")


    def test_print_logs__info(self):
        ''' Check if info log is logged correctly. '''
        log = logging.getLogger('stochss')
        test_base = StochSSBase(path=self.test_folderpath)
        test_base.log("info", "testing info log")
        with mock.patch("stochss.handlers.log.log.info") as mock_debug_log:
            test_base.print_logs(log)
            mock_debug_log.assert_called_once_with("testing info log")


    def test_print_logs__warning(self):
        ''' Check if warning log is logged correctly. '''
        log = logging.getLogger('stochss')
        test_base = StochSSBase(path=self.test_folderpath)
        test_base.log("warning", "testing warning log")
        with mock.patch("stochss.handlers.log.log.warning") as mock_debug_log:
            test_base.print_logs(log)
            mock_debug_log.assert_called_once_with("testing warning log")


    def test_print_logs__error(self):
        ''' Check if error log is logged correctly. '''
        log = logging.getLogger('stochss')
        test_base = StochSSBase(path=self.test_folderpath)
        test_base.log("error", "testing error log")
        with mock.patch("stochss.handlers.log.log.error") as mock_debug_log:
            test_base.print_logs(log)
            mock_debug_log.assert_called_once_with("testing error log")


    def test_print_logs__critical(self):
        ''' Check if critical log is logged correctly. '''
        log = logging.getLogger('stochss')
        test_base = StochSSBase(path=self.test_folderpath)
        test_base.log("critical", "testing critical log")
        with mock.patch("stochss.handlers.log.log.critical") as mock_debug_log:
            test_base.print_logs(log)
            mock_debug_log.assert_called_once_with("testing critical log")

    ################################################################################################
    # Unit tests for the StochSS base class rename function.
    ################################################################################################

    def test_rename__unique_name(self):
        ''' Check if file was renamed to the given name. '''
        test_path = os.path.join(self.test_folderpath, "test_file")
        Path(test_path).touch()
        test_base = StochSSBase(path=test_path)
        resp = test_base.rename(name="new_test_file")
        self.assertIsInstance(resp, dict)
        self.assertFalse(resp['changed'])
        self.assertEqual(resp['_path'], os.path.join(self.test_folderpath, "new_test_file"))


    def test_rename__name_already_exists(self):
        ''' Check if file was renamed correctly when name is in use. '''
        test_path = os.path.join(self.test_folderpath, "test_file")
        Path(test_path).touch()
        test_preq = os.path.join(self.test_folderpath, "new_test_file")
        Path(test_preq).touch()
        test_base = StochSSBase(path=test_path)
        resp = test_base.rename(name="new_test_file")
        self.assertIsInstance(resp, dict)
        self.assertTrue(resp['changed'])
        self.assertEqual(resp['_path'], os.path.join(self.test_folderpath, "new_test_file(1)"))


    def test_rename__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the file is missing. '''
        test_base = StochSSBase(path="test_file")
        with self.assertRaises(StochSSFileNotFoundError):
            test_base.rename(name="new_test_file")


    def test_rename_permission_error(self):
        ''' Check if the StochSSPermissionsError is raised when the user doesn't have the correct permissions. '''
        test_base = StochSSBase(path="test_file")
        with mock.patch("shutil.move") as mock_move:
            mock_move.side_effect = PermissionError
            with self.assertRaises(StochSSPermissionsError):
                test_base.rename(name="new_test_file")
