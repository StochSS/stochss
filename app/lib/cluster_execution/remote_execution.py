import os
import constants


def create_new_id():
    import uuid
    return str(uuid.uuid4())


class RemoteHostException(Exception):
    pass


class RemoteHost:
    def __init__(self, ip_address,  username, secret_key_file, port=constants.DefaultSshPort,
                 remote_host_id=None):
        if not os.path.exists(secret_key_file):
            raise RemoteHostException("Cannot access {0}".format(secret_key_file))

        self.ip_address = ip_address
        self.port = port
        self.username = username
        self.secret_key_file = secret_key_file  # TODO add check to make sure this file isn't password protected.
        if remote_host_id is None:
            remote_host_id = create_new_id()
        self.id = remote_host_id

    def __str__(self):
        return "RemoteHost: ip_address={0}, port={1}, username={2}, secret_key_file={3}, id={4}"\
            .format(self.ip_address, self.port, self.username, self.secret_key_file, self.id)


class RemoteJob:
    def __init__(self, input_files, date, remote_host, local_scratch_dir=None, remote_job_id=None, num_engines=None,
                 is_parameter_sweep=False):
        self.input_files = input_files
        self.date = date
        self.remote_host = remote_host
        if remote_job_id is None:
            remote_job_id = create_new_id()
        self.id = remote_job_id
        self.local_scratch_dir = local_scratch_dir
        self.num_engines = num_engines
        self.is_parameter_sweep = is_parameter_sweep

    def __str__(self):
        return "RemoteJob: input_files={0}, date={1}, remote_host={2}, id={3}, local_scratch_dir={4}"\
            .format(self.input_files, self.date, str(self.remote_host), self.id, self.local_scratch_dir)
