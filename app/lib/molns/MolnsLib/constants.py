import os


class Constants:
    DockerWorkingDirectoryPrefix = "working_dir_"
    LOGGING_DIRECTORY = "~/MOLNS_LOG"
    DOCKER_BASE_URL = "unix://var/run/docker.sock"
    DOCKER_DEFAULT_IMAGE = "ubuntu:latest"
    DOCKER_DEFAULT_PORT = '9000'
    DOCKER_CONTAINER_RUNNING = "running"
    DOCKER_CONTAINER_EXITED = "exited"
    DOCKERFILE_NAME = "dockerfile_"
    DOKCER_IMAGE_ID_LENGTH = 12
    DOCKER_IMAGE_PREFIX = "molns-docker-provider-"
    DOCKER_PY_IMAGE_ID_PREFIX_LENGTH = 7
    DockerProvider = "Docker"
    DockerNonExistentTag = "**NA**"
    DockerImageDelimiter = "|||"
    MolnsDockerContainerNamePrefix = "Molns-"
    MolnsExecHelper = "molns_exec_helper.py"
    DEFAULT_PRIVATE_NOTEBOOK_PORT = 8081
    DEFAULT_PUBLIC_NOTEBOOK_PORT = 443
    DEFAULT_PRIVATE_WEBSERVER_PORT = 8001
    DEFAULT_PUBLIC_WEBSERVER_PORT = 80
    DEFAULT_QSUB_SSH_PORT = 22
    ForbiddenVolumeNames = [".ssh", ".ipython", ".molns", "ipython", "localarea", "shared"]
    ConfigDir = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".molns/")
    ClusterKeyFileNameOnController = "molns_cluster_secretkey"
