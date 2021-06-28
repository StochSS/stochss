'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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

import unittest
# import json
import os
import tempfile

from pathlib import Path

from stochss.handlers import StochSSBase

os.chdir('/stochss')

class TestStochSSBaseObject(unittest.TestCase):
    '''
    ################################################################################################
    Unit tests for the StochSS base class.
    ################################################################################################
    '''
    def setUp(self):
        '''
        Create a temporary directory with a file and folder for each base test.
        '''
        self.tempdir = tempfile.TemporaryDirectory()
        test_filename = "test_base_file"
        test_foldername = "test_bose_folder"
        self.test_filepath = os.path.join(self.tempdir.name, test_filename)
        Path(self.test_filepath).touch()
        self.test_folderpath = os.path.join(self.tempdir.name, test_foldername)
        os.mkdir(self.test_folderpath)


    def tearDown(self):
        '''
        Cleanup the temp directory after each test.
        '''
        self.tempdir.cleanup()

    ################################################################################################
    # Unit tests for the StochSS base class check_project_format function.
    ################################################################################################

    def test_check_project_format__old_with_mdl(self):
        '''
        Check if the project is identified as old when it contains a model.
        '''
        test_files = ["test_model.mdl", "test_model.smdl"]
        for test_file in test_files:
            with self.subTest(test_file=test_file):
                test_file_path = os.path.join(self.test_folderpath, test_file)
                Path(test_file_path).touch()
                self.assertFalse(StochSSBase.check_project_format(path=self.test_folderpath))
                self.tearDown()
                self.setUp()


    def test_check_project_format__old_with_wkgp1(self):
        '''
        Check if the project is identified as old when it contains one
        workflow group with the name WorkflowGroup1.wkgp.
        '''
        test_wkgp = os.path.join(self.test_folderpath, "WorkflowGroup1.wkgp")
        os.mkdir(test_wkgp)
        self.assertFalse(StochSSBase.check_project_format(path=self.test_folderpath))


    def test_check_project_format__new_empty(self):
        '''
        Check if the project is identified as new when empty
        '''
        self.assertTrue(StochSSBase.check_project_format(path=self.test_folderpath))


    def test_check_project_format__new_with_one_wkgp_not_wkgp1(self):
        '''
        Check if the project is identified as new with one workflow group
        '''
        test_wkgp = os.path.join(self.test_folderpath, "test_wkgp.wkgp")
        os.mkdir(test_wkgp)
        self.assertTrue(StochSSBase.check_project_format(path=self.test_folderpath))


    def test_check_project_format__new_with_x_wkgps(self):
        '''
        Check if the project is identified as new with multiple workflow groups
        '''
        test_wkgp1 = os.path.join(self.test_folderpath, "test_wkgp1.wkgp")
        os.mkdir(test_wkgp1)
        test_wkgp2 = os.path.join(self.test_folderpath, "test_wkgp2.wkgp")
        os.mkdir(test_wkgp2)
        self.assertTrue(StochSSBase.check_project_format(path=self.test_folderpath))

    ################################################################################################
    # Unit tests for the StochSS base class check_workflow_format function.
    ################################################################################################

    def test_check_workflow_format__old_with_old_files(self):
        '''
        Check if the workflow is identified as old when it an old file.
        '''
        test_files = ["info.json", "logs.txt", "RUNNING", "ERROR", "COMPLETE", "test_model.mdl"]
        for test_file in test_files:
            with self.subTest(test_file=test_file):
                test_file_path = os.path.join(self.test_folderpath, test_file)
                Path(test_file_path).touch()
                self.assertFalse(StochSSBase.check_workflow_format(path=self.test_folderpath))
                self.tearDown()
                self.setUp()


    def test_check_workflow_format__old_with_results(self):
        '''
        Check if the workflow is identified as old when it a results folder.
        '''
        test_dir = os.path.join(self.test_folderpath, "results")
        os.mkdir(test_dir)
        self.assertFalse(StochSSBase.check_workflow_format(path=self.test_folderpath))


    def test_check_workflow_format__new(self):
        '''
        Check if the workflow is identified as old.
        '''
        self.assertTrue(StochSSBase.check_workflow_format(path=self.test_folderpath))
