'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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
import pickle
import shutil
import string
import zipfile
import tempfile
import datetime
import traceback

import requests
from escapism import escape

from .stochss_base import StochSSBase
from .stochss_file import StochSSFile
from .stochss_model import StochSSModel
from .stochss_sbml import StochSSSBMLModel
from .stochss_errors import StochSSFileExistsError, StochSSFileNotFoundError, \
                            StochSSPermissionsError


class StochSSFolder(StochSSBase):
    '''
    ################################################################################################
    StochSS folder object
    ################################################################################################
    '''
    def __init__(self, path, new=False):
        '''
        Intitialize a folder object and if its new create it on the users file system

        Attributes
        ----------
        path : str
            Path to the folder
        new : bool
            Indicates whether or not the folder is new
        '''
        if path == "/":
            path = ""
        super().__init__(path=path)
        if new:
            new_path = self.get_path(full=True)
            self.log("debug", f"Full path of directories: {new_path}")
            try:
                os.makedirs(new_path)
            except FileExistsError as err:
                message = f"Could not create your directory: {str(err)}"
                raise StochSSFileExistsError(message, traceback.format_exc()) from err


    def __get_file_from_link(self, remote_path):
        ext = remote_path.split('.').pop().split('?')[0]
        if os.path.exists("/stochss/.proxies.txt"):
            with open("/stochss/.proxies.txt", "r", encoding="utf-8") as proxy_file:
                proxy_ip = proxy_file.read().strip()
                proxies = {
                    "https": f"https://{proxy_ip}",
                    "http": f"http://{proxy_ip}"
                }
        else:
            proxies = None
        response = requests.get(remote_path, allow_redirects=True, proxies=proxies)
        body = response.content
        if "download_presentation" in remote_path:
            if ext in ("mdl", "smdl"):
                file = f"{json.loads(body)['name']}.{ext}"
            elif ext == "ipynb":
                file = json.loads(body)['file']
                body = json.dumps(json.loads(body)['notebook'])
            elif ext == "job":
                file = self.get_file(path=remote_path)
        elif "?" in remote_path:
            file = self.get_file(path=remote_path.split("?")[0])
        else:
            file = self.get_file(path=remote_path)
        if response.status_code == 404:
            message = f"Could not upload this file as {file} was not found."
            if "?token=" in remote_path:
                message += "  The token for this file may be out of date."
            raise StochSSFileNotFoundError(message, traceback.format_exc())
        return ext, file, body

    def __get_rmt_upld_path(self, file):
        if not file.endswith(".zip"):
            return file
        files = os.listdir(self.user_dir)
        files.remove(file)
        paths = list(map(lambda file: os.path.join(self.user_dir, file), files))
        return max(paths, key=os.path.getctime)


    def __build_jstree_node(self, path, file):
        types = {"mdl":"nonspatial", "smdl":"spatial", "sbml":"sbmlModel", "ipynb":"notebook",
                 "wkfl":"workflow", "proj":"project", "wkgp":"workflowGroup", "domn":"domain"}
        _path = file if self.path == "none" else os.path.join(self.path, file)
        ext = file.split('.').pop() if "." in file else None
        node = {"text":file, "type":"other", "_path":_path, "children":False}
        if ext in types:
            file_type = types[ext]
            node['type'] = file_type
            if file_type == "workflow":
                node['_newFormat'] = self.check_workflow_format(path=_path)
                if node['_newFormat']:
                    node['_hasJobs'] = len(list(filter(lambda file: "job" in file,
                                                       os.listdir(_path)))) > 0
                else:
                    node['_status'] = self.get_status(path=_path)
            elif file_type == "workflowGroup":
                node['children'] = True
        elif os.path.isdir(os.path.join(path, file)):
            node['type'] = "folder"
            node['children'] = True

        return node


    @classmethod
    def __get_presentation_job_name(cls, file_path):
        with open(file_path, "rb") as job_file:
            job = pickle.load(job_file)
            name = job['name']
        return name


    @classmethod
    def __get_presentation_model_name(cls, file_path):
        with open(file_path, "r", encoding="utf-8") as model_file:
            name = json.load(model_file)['name']
        return name


    @classmethod
    def __get_presentation_name(cls, names, file, file_path):
        ext = file.split('.').pop()
        if file in names.keys():
            name = names[file]
        else:
            if ext in ("mdl", "smdl"):
                name = cls.__get_presentation_model_name(file_path)
            elif ext == "job":
                name = cls.__get_presentation_job_name(file_path)
            elif ext == "ipynb":
                name = cls.__get_presentation_notebook_name(file_path)
            names[file] = name
        return name, ext


    @classmethod
    def __get_names_from_file(cls, path, files):
        if not os.path.exists(os.path.join(path, ".presentation_names.json")):
            return {}
        path = os.path.join(path, ".presentation_names.json")
        with open(path, "r", encoding="utf-8") as names_file:
            names = json.load(names_file)
        if len(names.keys()) != len(files):
            return {}
        return names


    @classmethod
    def __get_presentation_notebook_name(cls, file_path):
        with open(file_path, "r", encoding="utf-8") as nb_file:
            file = json.load(nb_file)['file']
            name = cls.get_name(cls, path=file)
        return name


    def __overwrite(self, path, ext, body):
        if ext != "zip":
            os.remove(path)
        else:
            if os.path.exists(path):
                os.remove(path)
            file = self.get_file(path=path)
            with tempfile.TemporaryDirectory() as tmp_dir:
                ext_path = os.path.join(tmp_dir, file)
                with open(ext_path, "wb") as zip_file:
                    zip_file.write(body)
                try:
                    with zipfile.ZipFile(ext_path, 'r') as zip_file:
                        members = set([name.split('/')[0] for name in zip_file.namelist()])
                        for name in members:
                            if "Examples" in path:
                                m_path = self.get_new_path(dst_path=os.path.join("Examples", name))
                            else:
                                m_path = self.get_new_path(dst_path=name)
                            if os.path.exists(m_path):
                                if os.path.isdir(m_path):
                                    shutil.rmtree(m_path)
                                else:
                                    os.remove(m_path)
                except zipfile.BadZipFile as err:
                    message = "File is not a zip file"
                    raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    def __upload_file(self, file, body, new_name=None):
        if new_name is not None:
            file = f"{new_name}.{file.split('.').pop()}"
        path = os.path.join(self.path, file)
        new_file = StochSSFile(path=path, new=True, body=body)
        error = new_file.unzip()
        file = new_file.get_file()
        dirname = new_file.get_dir_name()
        message = f"{file} was successfully uploaded to {dirname}"
        return {"message":message, "path":dirname, "file":file, "errors":error}


    def __upload_model(self, file, body, new_name=None):
        is_valid, error = self.__validate_model(body, file)
        if is_valid:
            ext = "smdl" if json.loads(body)['is_spatial'] else "mdl"
        else:
            ext = "json"
        if new_name is not None:
            file = f"{new_name}.{ext}"
        elif not file.endswith(ext):
            _ext = file.split('.').pop()
            file = file.replace(_ext, ext)
        if self.path.endswith(".proj") and ext != "json" and \
                                           self.check_project_format(path=self.path):
            wkgp_file = f"{self.get_name(path=file)}.wkgp"
            wkgp_path, changed = self.get_unique_path(name=wkgp_file, dirname=self.path)
            if changed:
                file = f"{self.get_name(path=wkgp_path)}.{ext}"
            path = os.path.join(wkgp_path, file)
        else:
            path = os.path.join(self.path, file)
        new_file = StochSSFile(path=path, new=True, body=body)
        file = new_file.get_file()
        dirname = new_file.get_dir_name()
        if is_valid:
            message = f"{file} was successfully uploaded to {dirname}"
        else:
            message = "The file could not be validated as a Model file "
            message += f"and was uploaded as {file} to {dirname}"
        return {"message":message, "path":dirname, "file":file, "errors":error}


    def __upload_sbml(self, file, body, new_name=None):
        if new_name is not None:
            file = f"{new_name}.sbml"
        if file.endswith(".xml"):
            file = f"{self.get_name(path=file)}.sbml"
        path = os.path.join(self.path, file)
        sbml = StochSSSBMLModel(path=path, new=True, document=body)
        dirname = sbml.get_dir_name()
        is_valid, errors = self.__validate_sbml(sbml=sbml)
        if is_valid:
            if self.path.endswith(".proj") and self.check_project_format(path=self.path):
                wkgp_path, _ = self.get_unique_path(name=f"{sbml.get_name()}.wkgp",
                                                    dirname=self.path)
                convert_resp = sbml.convert_to_model(name=self.get_name(wkgp_path), wkgp=True)
            else:
                convert_resp = sbml.convert_to_model(name=sbml.get_name())
            _ = StochSSModel(path=convert_resp['path'], new=True, model=convert_resp['model'])
            message = f"{sbml.get_file()} was successfully uploaded to {dirname}"
        else:
            sbml.rename(name=f"{sbml.get_name()}.xml")
            message = "The file could not be validated as a SBML file "
            message += f"and was uploaded as {file} to {sbml.get_dir_name()}"
        file = sbml.get_file()
        return {"message":message, "path":dirname, "file":file, "errors":errors}


    @classmethod
    def __validate_model(cls, body, file):
        try:
            body = json.loads(body)
        except json.decoder.JSONDecodeError:
            message = [f"The file {file} is not in JSON format."]
            return False, message

        keys = ["species", "parameters", "reactions", "eventsCollection",
                "rules", "functionDefinitions"]
        for key in body.keys():
            if key in keys:
                keys.remove(key)
        if keys:
            message = f"The following keys are missing from {file}: {keys}"
            return False, [message]
        return True, []


    @classmethod
    def __validate_sbml(cls, sbml):
        g_model, errors = sbml.convert_to_gillespy()
        if g_model is None:
            return False, [f"The file {sbml.get_file()} is not in SBML format."]
        return bool(not errors), errors


    def delete(self):
        '''
        Delete the directory from the file system

        Attributes
        ----------
        '''
        path = self.get_path(full=True)
        try:
            shutil.rmtree(path)
            return f"The directory {self.get_file()} was successfully deleted."
        except FileNotFoundError as err:
            message = f"Could not find the directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except PermissionError as err:
            message = f"You do not have permission to delete this directory: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


    def duplicate(self):
        '''
        Creates a copy of the target directory in the same directory

        Attributes
        ----------
        '''
        src_path = self.get_path(full=True)
        self.log("debug", f"Full path to the directory: {src_path}")
        dst_path = self.get_unique_copy_path()
        self.log("debug", f"Full destination directory: {dst_path}")
        try:
            shutil.copytree(src_path, dst_path)
            cp_name = self.get_file(path=dst_path)
            message = f"The file {self.get_file()} has been successfully copied as {cp_name}"
            return {"Message":message, "File":cp_name}
        except FileNotFoundError as err:
            message = f"Could not find the directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except PermissionError as err:
            message = f"You do not have permission to copy this directory: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


    def empty(self):
        '''
        Delete the contents of the folder

        Attribites
        ----------
        '''
        path = self.get_path(full=True)
        if not os.path.exists(path):
            os.mkdir(path)
            return "The trash directory was removed."
        for item in os.listdir(path):
            item_path = os.path.join(self.path, item)
            item_class = StochSSFolder if os.path.isdir(item_path) else StochSSFile
            item_class(path=item_path).delete()
        return "Successfully emptied the trash."


    def generate_zip_file(self):
        '''
        Create a zip archive for download

        Attributes
        ----------
        '''
        path = self.get_path(full=True)
        if not os.path.exists(path):
            message = f"Could not find the directory: {path}"
            raise StochSSFileNotFoundError(message, traceback.format_exc())

        zip_file = self.get_name() + ".zip"
        zip_path, _ = self.get_unique_path(name=zip_file)
        name = self.get_name(path=zip_path)
        target = self.get_file()
        dirname = self.get_dir_name(full=True)
        shutil.make_archive(os.path.join(dirname, name), "zip", dirname, target)
        zip_path = zip_path.replace(self.user_dir + '/', "")
        message = f"Successfully created {zip_path}"
        return {"Message":message, "Path":zip_path}


    def get_file_list(self, ext, folder=False, test=None):
        '''
        Get the list of files matching the ext in this directory and all sub-directories

        Attributes
        ----------
        ext : str or list
            Extension of file object to search for
        folder : bool
            Indicates whether or not the file object is a folder
        test : func
            Function that determines if a file object should be excluded
        '''
        domain_paths = {}
        domain_files = {}
        for root, folders, files in os.walk(self.get_path(full=True)):
            root = root.replace(self.user_dir+"/", "")
            file_list = folders if folder else files
            for file in file_list:
                exclude = False if test is None else test(ext, root, file)
                if not exclude and '.' in file and f".{file.split('.').pop()}" in ext:
                    path = os.path.join(root, file) if root else file
                    if file in domain_files:
                        domain_paths[domain_files[file]].append(path)
                    else:
                        index = str(len(domain_files.keys()))
                        domain_files[file] = index
                        domain_paths[index] = [path]
        options = [[index, file] for file, index in domain_files.items()]
        return {"files":options, "paths":domain_paths}


    def get_jstree_node(self, is_root=False):
        '''
        Build and return a JSTree node object the represents the file object

        Attributes
        ----------
        is_root : bool
            Indicates whether or not a folder is to be treated as the root
        '''
        path = self.user_dir if self.path == "none" else self.get_path(full=True)
        try:
            files = list(filter(lambda file: not file.startswith('.'), os.listdir(path=path)))
            nodes = list(map(lambda file: self.__build_jstree_node(path, file), files))
            if self.path == "none":
                state = {"opened":True}
                root = {"text":"/", "type":"root", "_path":"/", "children":nodes, "state":state}
                return json.dumps([root])
            if is_root:
                root = {"text":self.get_name(), "type":"root", "_path":self.path, "children":nodes,
                        "state":{"opened":True}}
                return json.dumps([root])
            return json.dumps(nodes)
        except FileNotFoundError as err:
            message = f"Could not find the directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err


    @classmethod
    def get_presentations(cls):
        '''
        Get the list of presentations from the users presentation directory.

        Attributes
        ----------
        '''
        presentations = []
        try:
            path = os.path.join(cls.user_dir, ".presentations")
            files = [file for file in os.listdir(path) if not file.startswith('.')]
            if not files:
                return presentations
            names = cls.__get_names_from_file(path, files)
            need_names = not bool(names)
            safe_chars = set(string.ascii_letters + string.digits)
            hostname = escape(os.environ.get('JUPYTERHUB_USER'), safe=safe_chars)
            for file in files:
                file_path = os.path.join(path, file)
                ctime = os.path.getctime(file_path)
                routes = {
                    "smdl": "present-model",
                    "mdl": "present-model",
                    "job": "present-job",
                    "ipynb": "present-notebook"
                }
                name, ext = cls.__get_presentation_name(names, file, file_path)
                presentation = {
                    "file": file, "name": f"{name}.{ext}",
                    "link": f"/stochss/{routes[ext]}?owner={hostname}&file={file}",
                    "size": os.path.getsize(file_path),
                    "ctime": datetime.datetime.fromtimestamp(ctime).strftime("%b %d, %Y")
                }
                presentations.append(presentation)
            if need_names or len(names.keys()) != len(files):
                path = os.path.join(path, ".presentation_names.json")
                with open(path, "w", encoding="utf-8") as names_file:
                    json.dump(names, names_file)
            return presentations
        except FileNotFoundError:
            return presentations


    def get_project_list(self):
        '''
        Get the list of project on the users disk

        Attributes
        ----------
        '''
        test = lambda ext, root, file: bool("trash" in root.split("/"))
        data = self.get_file_list(ext=".proj", folder=True, test=test)
        projects = []
        for file in data['files']:
            for path in data['paths'][file[0]]:
                projects.append({"directory":path, "dirname":os.path.dirname(path),
                                 "name":self.get_name(path=path)})
        return {"projects":projects}


    def move(self, location):
        '''
        Moves a directory and its contents to a new location.

        Attributes
        ----------
        location : str
            Path to the new location of the directory
        '''
        src_path = self.get_path(full=True)
        self.log("debug", f"Full path to the directory: {src_path}")
        dst_path = self.get_new_path(location)
        self.log("debug", f"Full destination directory: {dst_path}")
        try:
            dst = shutil.move(src_path, dst_path)
            path = dst.replace(self.user_dir + "/", "")
            return f"Success! {self.get_file(path=path)} was moved to {os.path.dirname(path)}."
        except FileNotFoundError as err:
            message = f"Could not find the directory: {str(err)}"
            raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        except PermissionError as err:
            message = f"You do not have permission to move this directory: {str(err)}"
            raise StochSSPermissionsError(message, traceback.format_exc()) from err


    def upload(self, file_type, file, body, new_name=None):
        '''
        Upload a file from a remote location to the users file system

        Attributes
        ----------
        file_type : str
            Type of file being uploaded ie. 'model', 'sbml', 'file'
        file_name : str
            Current name of the file
        body : str
            The contents of the file (may be encoded)
        new_name : str
            New name for the file (may also include new directories)
        '''
        try:
            body = body.decode()
        except UnicodeError:
            pass
        exts = {"model":['mdl', 'smdl', 'json'], "sbml":['sbml', 'xml']}
        ext = file.split('.').pop() if '.' in file else ""
        if  ext in ('mdl', 'smdl') or (file_type == "model" and ext in exts[file_type]):
            return self.__upload_model(file, body, new_name=new_name)
        if ext == 'sbml' or (file_type == "sbml" and ext in exts[file_type]):
            return self.__upload_sbml(file, body, new_name=new_name)
        resp = self.__upload_file(file, body, new_name=new_name)
        if file_type != "file":
            error = f"{file} did not match one of the {file_type} file types"
            error += f": {', '.join(exts[file_type])}."
            resp['errors'].append(error)
        return resp


    def upload_from_link(self, remote_path, overwrite=False):
        '''
        Uploads a file from a remote link to the users root directory

        Attributes
        ----------
        remote_path : str
            Path to the remote file
        overwrite : bool
            Overwrite the existing files.
        '''
        ext, file, body = self.__get_file_from_link(remote_path)
        if "github.com/StochSS/StochSS_Example_Library/raw/" in remote_path:
            path = self.get_new_path(dst_path=os.path.join("Examples", file))
            self.path = "Examples"
            new_path = os.path.join(self.path, file)
        else:
            path = self.get_new_path(dst_path=file)
        if overwrite:
            self.__overwrite(path=path, ext=ext, body=body)
        elif os.path.exists(path):
            message = f"Could not upload this file as {file} already exists"
            return {"message":message, "reason":"File Already Exists"}
        try:
            file_types = {"mdl":"model", "smdl":"model", "sbml":"sbml"}
            file_type = file_types[ext] if ext in file_types else "file"
            _ = self.upload(file_type=file_type, file=file, body=body)
            if "github.com/StochSS/StochSS_Example_Library/raw/" not in remote_path:
                new_path = self.__get_rmt_upld_path(file=file)
            message = f"Successfully uploaded the file {file} to {new_path}"
            return {"message":message, "file_path":new_path}
        except StochSSFileExistsError as err:
            return {"message":err.message, "reason":err.reason}


    def validate_upload_link(self, remote_path):
        '''
        Check if the target of upload from link already exists.

        Attributes
        ----------
        remote_path : str
            Path to the remote file
        '''
        ext, file, body = self.__get_file_from_link(remote_path)
        if "github.com/StochSS/StochSS_Example_Library/raw/" in remote_path:
            path = self.get_new_path(dst_path=os.path.join("Examples", file))
        else:
            path = self.get_new_path(dst_path=file)
        exists = os.path.exists(path)
        if ext != "zip" or exists:
            return exists
        with tempfile.TemporaryDirectory() as tmp_dir:
            ext_path = os.path.join(tmp_dir, file)
            with open(ext_path, "wb") as zip_file:
                zip_file.write(body)
            try:
                with zipfile.ZipFile(ext_path, 'r') as zip_file:
                    members = set([name.split('/')[0] for name in zip_file.namelist()])
                    for name in members:
                        if "github.com/StochSS/StochSS_Example_Library/raw/" in remote_path:
                            mem_path = self.get_new_path(dst_path=os.path.join("Examples", name))
                        else:
                            mem_path = self.get_new_path(dst_path=name)
                        if os.path.exists(mem_path):
                            return True
            except zipfile.BadZipFile as err:
                message = "File is not a zip file"
                raise StochSSFileNotFoundError(message, traceback.format_exc()) from err
        return False
