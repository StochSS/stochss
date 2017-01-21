import logging
import os
import tempfile
import time
import Docker
import constants
import installSoftware
from collections import OrderedDict
from DockerSSH import DockerSSH
from constants import Constants
from molns_provider import ProviderBase, ProviderException


def docker_provider_default_key_name():
    user = os.environ.get('USER') or 'USER'
    return "{0}_molns_docker_sshkey_{1}".format(user, hex(int(time.time())).replace('0x', ''))


class DockerBase(ProviderBase):
    """ Base class for Docker. """

    SSH_KEY_EXTENSION = ".pem"
    PROVIDER_TYPE = 'Docker'

    def __init__(self, name, config=None, config_dir=None, **kwargs):
        ProviderBase.__init__(self, name, config, config_dir, **kwargs)
        self.docker = Docker.Docker()
        self.ssh = DockerSSH(self.docker)

    def _get_container_status(self, container_id):
        self.docker.container_status(container_id)

    def start_instance(self, num=1):
        """ Start given number of (or 1) containers. """
        started_containers = []
        for i in range(num):
            container_id = self.docker.create_container(self.provider.config["molns_image_name"], name=self.name,
                                                        port_bindings={
                                                            Constants.DEFAULT_PUBLIC_WEBSERVER_PORT:
                                                                ('127.0.0.1', self.config['web_server_port']),
                                                        Constants.DEFAULT_PRIVATE_NOTEBOOK_PORT:
                                                            ('127.0.0.1', self.config['notebook_port'])},
                                                        working_directory=self.config["working_directory"])
            stored_container = self.datastore.get_instance(provider_instance_identifier=container_id,
                                                           ip_address=self.docker.get_container_ip_address(container_id)
                                                           , provider_id=self.provider.id, controller_id=self.id,
                                                           provider_type=constants.Constants.DockerProvider)
            started_containers.append(stored_container)
        if num == 1:
            return started_containers[0]
        return started_containers

    def resume_instance(self, instances):
        instance_ids = []
        if isinstance(instances, list):
            for instance in instances:
                instance_ids.append(instance.provider_instance_identifier)
        else:
            instance_ids.append(instances.provider_instance_identifier)
        self.docker.start_containers(instance_ids)

    def stop_instance(self, instances):
        instance_ids = []
        if isinstance(instances, list):
            for instance in instances:
                instance_ids.append(instance.provider_instance_identifier)
        else:
            instance_ids.append(instances.provider_instance_identifier)
        self.docker.stop_containers(instance_ids)

    def terminate_instance(self, instances):
        instance_ids = []
        if isinstance(instances, list):
            for instance in instances:
                instance_ids.append(instance.provider_instance_identifier)
        else:
            instance_ids.append(instances.provider_instance_identifier)
        self.docker.terminate_containers(instance_ids)

    def exec_command(self, container_id, command):
        self.docker.execute_command(container_id, command)


class DockerProvider(DockerBase):
    """ Provider handle for local Docker based service. """

    OBJ_NAME = 'DockerProvider'

    CONFIG_VARS = OrderedDict([
        ('ubuntu_image_name',
         {'q': 'Base Ubuntu image to use', 'default': constants.Constants.DOCKER_DEFAULT_IMAGE,
          'ask': True}),
        ('molns_image_name',
         {'q': 'Local MOLNs image (Docker image ID or image tag) to use ', 'default': None, 'ask': True}),
        ('key_name',
         {'q': 'Docker Key Pair name', 'default': "docker-default", 'ask': False}),  # Unused.
        ('group_name',
         {'q': 'Docker Security Group name', 'default': 'molns', 'ask': False}),  # Unused.
        ('login_username',
         {'default': 'ubuntu', 'ask': False}),  # Unused.
        ('provider_type',
         {'default': constants.Constants.DockerProvider, 'ask': False})
    ])

    def get_config_credentials(self):
        return None

    @staticmethod
    def __get_new_dockerfile_name():
        import uuid
        filename = constants.Constants.DOCKERFILE_NAME + str(uuid.uuid4())
        return filename

    def check_ssh_key(self):
        """ Returns true. (Implementation does not use SSH.) """
        return True

    def create_ssh_key(self):
        """ Returns true.  """
        ssh_key_dir = os.path.join(self.config_dir, self.name)
        with open(ssh_key_dir, 'w') as fp:
            fp.write("This is a dummy key.")
        os.chmod(ssh_key_dir, 0o600)

    def check_security_group(self):
        """ Returns true. (Implementation does not use SSH.) """
        return True

    def create_seurity_group(self):
        """ Returns true. (Implementation does not use SSH.) """
        return True

    def create_molns_image(self):
        """ Create a molns image, save it on localhost and return DockerImage ID of created image. """
        file_to_remove = None
        try:
            dockerfile, file_to_remove = self._create_dockerfile(installSoftware.InstallSW.get_command_list())
            image_id = self.docker.build_image(dockerfile)
            return image_id
        except Exception as e:
            logging.exception(e)
            raise ProviderException("Failed to create molns image: {0}".format(e))
        finally:
            if file_to_remove is not None:
                os.remove(file_to_remove)

    def check_molns_image(self):
        """ Check if the molns image exists. """
        if 'molns_image_name' in self.config and self.config['molns_image_name'] is not None \
                and self.config['molns_image_name'] != '':
            return self.docker.image_exists(self.config['molns_image_name'])
        return False

    def _create_dockerfile(self, commands):
        """ Create Dockerfile from given commands. """
        import Utils

        user_id = Utils.get_sudo_user_id()
        dockerfile = '''FROM ubuntu:14.04\nRUN apt-get update\n\n# Add user ubuntu.\nRUN useradd -u {0} -ms /bin/bash ubuntu\n
         # Set up base environment.\nRUN apt-get install -yy \ \n    software-properties-common \ \n
             python-software-properties \ \n    wget \ \n    curl \ \n   git \ \n    ipython \ \n    sudo \ \n
             screen \ \n    iptables \nRUN echo "ubuntu ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
         \nWORKDIR /home/ubuntu\n\nUSER ubuntu\nENV HOME /home/ubuntu'''.format(user_id)

        flag = False

        for entry in commands:
            if isinstance(entry, list):
                dockerfile += '''\n\nRUN '''
                first = True
                flag = False
                for sub_entry in entry:
                    if first is True:
                        dockerfile += self._preprocess(sub_entry)
                        first = False
                    else:
                        dockerfile += ''' && \ \n   ''' + self._preprocess(sub_entry)
            else:
                if flag is False:
                    dockerfile += '''\n\nRUN '''
                    flag = True
                    dockerfile += self._preprocess(entry)
                else:
                    dockerfile += ''' && \ \n    ''' + self._preprocess(entry)

        dockerfile += '''\n\n\n'''

        dockerfile_file = DockerProvider.__get_new_dockerfile_name()
        with open(dockerfile_file, 'w') as Dockerfile:
            Dockerfile.write(dockerfile)
        named_dockerfile = tempfile.NamedTemporaryFile()
        named_dockerfile.write(dockerfile)
        named_dockerfile.seek(0)

        return named_dockerfile, dockerfile_file

    @staticmethod
    def _preprocess(command):
        """ Prepends "shell only" commands with '/bin/bash -c'. """
        for shell_command in Docker.Docker.shell_commands:
            if shell_command in command:
                replace_string = "/bin/bash -c \"" + shell_command
                command = command.replace(shell_command, replace_string)
                command += "\""
        return command


def get_default_working_directory(config=None):
    if config is None:
        raise Exception("Config should not be None.")
    return os.path.realpath(os.path.join(config.config_dir, "docker_controller_working_dirs", config.name))


class DockerController(DockerBase):
    """ Provider handle for a Docker controller. """

    OBJ_NAME = 'DockerController'
    CONFIG_VARS = OrderedDict([
        ('web_server_port',
         {'q': 'Port to use for web server', 'default': "8080",
          'ask': True}),
        ('notebook_port',
         {'q': 'Port to use for jupyter notebook', 'default': "8081",
          'ask': True}),
        ('working_directory',
         {'q': 'Working directory for this controller', 'default': get_default_working_directory, 'ask': True}),
        ('ssh_key_file',
         {'q': 'SSH key to a qsub and docker enabled cluster', 'default': "None", 'ask': True})
    ])

    def get_instance_status(self, instance):
        return self.docker.container_status(instance.provider_instance_identifier)


class DockerWorkerGroup(DockerController):
    """ Provider handle for Docker worker group. """

    OBJ_NAME = 'DockerWorkerGroup'

    CONFIG_VARS = OrderedDict([
        ('num_vms',
         {'q': 'Number of containers in group', 'default': '1', 'ask': True}),
    ])
