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
# import json
import shutil
# import logging
import zipfile
import unittest
import tempfile
# import datetime

from unittest import mock
from pathlib import Path

from stochss.handlers import StochSSFile
from stochss.handlers.util.stochss_errors import StochSSFileNotFoundError, StochSSUnzipError, \
                                                 StochSSFileExistsError, StochSSPermissionsError

os.chdir('/stochss')

# pylint: disable=too-many-public-methods
# pylint: disable=line-too-long
class TestStochSSFileObject(unittest.TestCase):
    '''
    ################################################################################################
    Unit tests for the StochSS file class.
    ################################################################################################
    '''
    def setUp(self):
        ''' Create a temporary directory with a file for each file test. '''
        self.tempdir = tempfile.TemporaryDirectory()
        StochSSFile.user_dir = self.tempdir.name
        self.test_filepath = os.path.join(self.tempdir.name, "test_file")
        Path(self.test_filepath).touch()


    def tearDown(self):
        ''' Cleanup the temp directory after each test. '''
        self.tempdir.cleanup()
        StochSSFile.user_dir = os.path.expanduser("~")

    ################################################################################################
    # Unit tests for the StochSS file class __init__ function.
    ################################################################################################

    def test_init__new_file__unique(self):
        ''' Check if the new file is written correctly. '''
        StochSSFile(path="test_new_file", new=True)
        self.assertIn("test_new_file", os.listdir(self.tempdir.name))


    def test_init__new_binary_file__unique(self):
        ''' Check if the new binary file is writen correctly. '''
        StochSSFile(path="test_new_file", new=True, body="test body".encode())
        self.assertIn("test_new_file", os.listdir(self.tempdir.name))


    def test_init__new_file__not_unique(self):
        ''' Check if the new file is writen correctly with a unique name. '''
        StochSSFile(path="test_file", new=True)
        self.assertIn("test_file(1)", os.listdir(self.tempdir.name))

    ################################################################################################
    # Unit tests for the StochSS file class delete function.
    ################################################################################################

    def test_delete(self):
        ''' Check if the file is deleted successfully. '''
        test_file = StochSSFile(path=self.test_filepath)
        test_resp = test_file.delete()
        self.assertNotIn("test_file", os.listdir(self.tempdir.name))
        self.assertIsInstance(test_resp, str)


    def test_delete__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the target file is missing. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("os.remove", mock.mock_open()) as mock_remove:
            mock_remove.side_effect = FileNotFoundError
            with self.assertRaises(StochSSFileNotFoundError):
                test_file.delete()


    def test_delete_permission_error(self):
        ''' Check if the StochSSPermissionsError is raised when the user doesn't have the correct permissions. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("os.remove") as mock_remove:
            mock_remove.side_effect = PermissionError
            with self.assertRaises(StochSSPermissionsError):
                test_file.delete()

    ################################################################################################
    # Unit tests for the StochSS file class duplicate function.
    ################################################################################################

    def test_dulpicate(self):
        ''' Check if the file is copied successfully. '''
        test_file = StochSSFile(path=self.test_filepath)
        test_resp = test_file.duplicate()
        self.assertIn("Message", test_resp.keys())
        self.assertIn("File", test_resp.keys())
        self.assertIn("test_file-copy", os.listdir(self.tempdir.name))


    def test_duplicate__model_in_new_format_project(self):
        ''' Check if a model in a new format project is copied successfully. '''
        test_proj_path = os.path.join(self.tempdir.name, "test.proj")
        test_wkgp_path = os.path.join(test_proj_path, "test.wkgp")
        test_model_path = os.path.join(test_wkgp_path, "test.mdl")
        os.makedirs(test_wkgp_path)
        Path(test_model_path).touch()
        test_file = StochSSFile(path=test_model_path)
        test_resp = test_file.duplicate()
        self.assertIn("Message", test_resp.keys())
        self.assertIn("File", test_resp.keys())
        self.assertIn("test-copy.wkgp", os.listdir(test_proj_path))
        self.assertIn("test-copy.mdl", os.listdir(os.path.join(test_proj_path, "test-copy.wkgp")))


    def test_duplicate__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the target file is missing. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("shutil.copyfile", mock.mock_open()) as mock_copyfile:
            mock_copyfile.side_effect = FileNotFoundError
            with self.assertRaises(StochSSFileNotFoundError):
                test_file.duplicate()


    def test_duplicate_permission_error(self):
        ''' Check if the StochSSPermissionsError is raised when the user doesn't have the correct permissions. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("shutil.copyfile") as mock_copyfile:
            mock_copyfile.side_effect = PermissionError
            with self.assertRaises(StochSSPermissionsError):
                test_file.duplicate()

    ################################################################################################
    # Unit tests for the StochSS file class move function.
    ################################################################################################

    def test_move(self):
        ''' Check if the file is moved successfully. '''
        test_location = os.path.join(self.tempdir.name, "test_location")
        test_file_path = os.path.join(test_location, "test_file")
        os.mkdir(test_location)
        test_file = StochSSFile(path=self.test_filepath)
        test_resp = test_file.move(location=test_file_path)
        self.assertIsInstance(test_resp, str)
        self.assertIn("test_file", os.listdir(test_location))


    def test_move__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the target file is missing. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("os.rename", mock.mock_open()) as mock_rename:
            mock_rename.side_effect = FileNotFoundError
            with self.assertRaises(StochSSFileNotFoundError):
                test_file.move("test_folder")


    def test_move_permission_error(self):
        ''' Check if the StochSSPermissionsError is raised when the user doesn't have the correct permissions. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("os.rename") as mock_rename:
            mock_rename.side_effect = PermissionError
            with self.assertRaises(StochSSPermissionsError):
                test_file.move("test_folder")

    ################################################################################################
    # Unit tests for the StochSS file class read function.
    ################################################################################################

    def test_read(self):
        ''' Check if the file is read successfully. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("builtins.open", mock.mock_open(read_data="Test Contents"), create=True) as mock_file:
            test_data = test_file.read()
            mock_file.assert_called_once_with(self.test_filepath, "r")
            self.assertEqual(test_data, "Test Contents")


    def test_read__file_not_found_error(self):
        ''' Check if the StochSSFileNotFoundError is raised when the target file is missing. '''
        test_file = StochSSFile(path=self.test_filepath)
        with mock.patch("builtins.open", mock.mock_open()) as mock_file:
            mock_file.side_effect = FileNotFoundError
            with self.assertRaises(StochSSFileNotFoundError):
                test_file.read()

    ################################################################################################
    # Unit tests for the StochSS file class unzip function.
    ################################################################################################

    def test_unzip__from_upload_true(self):
        ''' Check the return for unzipping an uploaded file. '''
        test_dir_path = os.path.join(self.tempdir.name, "test_folder")
        os.mkdir(test_dir_path)
        test_file_path = os.path.join(test_dir_path, "test_file")
        Path(test_file_path).touch()
        test_archive = shutil.make_archive(os.path.join(self.tempdir.name, "test_zip"), "zip", self.tempdir.name, test_dir_path)
        shutil.rmtree(test_dir_path)
        test_file = StochSSFile(path=test_archive)
        test_resp = test_file.unzip()
        self.assertIsInstance(test_resp, list)
        self.assertFalse(len(test_resp))


    def test_unzip__from_upload_false(self):
        ''' Check the return for unzipping a file. '''
        test_dir_path = os.path.join(self.tempdir.name, "test_folder")
        os.mkdir(test_dir_path)
        test_file_path = os.path.join(test_dir_path, "test_file")
        Path(test_file_path).touch()
        test_archive = shutil.make_archive(os.path.join(self.tempdir.name, "test_zip"), "zip", self.tempdir.name, test_dir_path)
        shutil.rmtree(test_dir_path)
        test_file = StochSSFile(path=test_archive)
        test_resp = test_file.unzip(from_upload=False)
        self.assertIsInstance(test_resp, dict)
        self.assertIn("message", test_resp.keys())


    def test_unzip__file_exists_error(self):
        ''' Check if the StochSSFileExistsError is raised when the contents of the archive already exist. '''
        test_dir_path = os.path.join(self.tempdir.name, "test_folder")
        os.mkdir(test_dir_path)
        test_file_path = os.path.join(test_dir_path, "test_file")
        Path(test_file_path).touch()
        shutil.make_archive(os.path.join(self.tempdir.name, "test_zip"), "zip", self.tempdir.name, "test_folder")
        test_file = StochSSFile(path="test_zip.zip")
        with self.assertRaises(StochSSFileExistsError):
            test_file.unzip()


    def test_unzip__bad_zip_file_error__from_upload_true(self):
        ''' Check if an error list is returned when the target file cannot be unzipped. '''
        test_file_path = os.path.join(self.tempdir.name, "test_file.zip")
        Path(test_file_path).touch()
        test_file = StochSSFile(path=test_file_path)
        with mock.patch("zipfile.ZipFile.extractall", mock.mock_open()) as mock_extractall:
            mock_extractall.side_effect = zipfile.BadZipFile
            errors = test_file.unzip()
            self.assertIsInstance(errors, list)
            self.assertTrue(len(errors) == 1)


    def test_unzip__bad_zip_file_error__from_upload_false(self):
        ''' Check if the StochSSUnzipError is raised when the target file cannot be unzipped. '''
        test_file_path = os.path.join(self.tempdir.name, "test_file.zip")
        Path(test_file_path).touch()
        test_file = StochSSFile(path=test_file_path)
        with mock.patch("zipfile.ZipFile.extractall", mock.mock_open()) as mock_extractall:
            mock_extractall.side_effect = zipfile.BadZipFile
            with self.assertRaises(StochSSUnzipError):
                test_file.unzip(from_upload=False)
