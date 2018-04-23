import os
import utils
import constants
import shutil
import logging
from utils import Log
from molns.MolnsLib.ssh import SSH, SSHException


class ClusterDeploy:
    def __init__(self, remote_host):
        self.ssh = SSH()
        self.remote_host = remote_host

    @staticmethod
    def __get_files_to_transfer(remote_job):
        import constants
        files_to_transfer = [constants.MolnsExecHelper]
        files_to_transfer.extend(remote_job.input_files)
        logging.info("Files to transfer: {0}".format(files_to_transfer))
        return files_to_transfer

    @staticmethod
    def __remotely_install_molnsutil(base_path, ssh):
        try:
            sftp = ssh.open_sftp()
            sftp.stat(os.path.join(base_path, 'molnsutil'))
            logging.info("molnsutil exists remotely.")
        except (IOError, OSError):
            logging.info("Installing molnsutil in {0}".format(base_path))
            ssh.exec_command("""cd {0};
            wget https://github.com/aviral26/molnsutil/archive/qsub_support.zip;
            unzip qsub_support.zip;
            mv molnsutil-qsub_support/ molnsutil/;
            rm qsub_support.zip;""".format(base_path))

    def deploy_job_to_cluster(self, remote_job):
        """ Submit qsub job for execution on cluster. Takes input remote_execution.RemoteJob object. """
        base_path = os.path.join(constants.MolnsClusterExecutionDir, remote_job.id)
        try:
            self.ssh.connect_cluster_node(ip_address=self.remote_host.ip_address, port=self.remote_host.port,
                                          username=self.remote_host.username,
                                          key_filename=self.remote_host.secret_key_file)

            # create remote directory and install packages.
            self.ssh.exec_command("mkdir -p {0}".format(base_path))
            self.__remotely_install_molnsutil(constants.MolnsClusterExecutionDir, self.ssh)

            files_to_transfer = ClusterDeploy.__get_files_to_transfer(remote_job)

            sftp = self.ssh.open_sftp()

            for f in files_to_transfer:
                if f is None:
                    continue
                logging.info('Uploading file {0}'.format(f))
                sftp.put(f, "{0}/{1}".format(base_path, os.path.basename(f)))

            # execute command
            logging.info("Executing command..")
            self.ssh.exec_command("cd {0}; python {1} {2} {3} &".format(base_path,
                                                                        os.path.basename(constants.MolnsExecHelper),
                                                                        remote_job.num_engines,
                                                                        remote_job.is_parameter_sweep))
            print "Job started."
        finally:
            self.ssh.close()

    def job_status(self, remote_job):
        """ Determine if remote job is running, has completed or has failed.
        Takes input remote_execution.RemoteJob object. """
        base_path = os.path.join(constants.MolnsClusterExecutionDir, remote_job.id)
        try:
            self.ssh.connect_cluster_node(ip_address=remote_job.remote_host.ip_address,
                                          port=remote_job.remote_host.port
                                          , username=remote_job.remote_host.username,
                                          key_filename=remote_job.remote_host.secret_key_file)
            sftp = self.ssh.open_sftp()
            try:
                sftp.stat(os.path.join(base_path, constants.ClusterExecCompleteFile))
            except (IOError, OSError):
                return constants.RemoteJobRunning

            try:
                sftp.stat(os.path.join(base_path, constants.ClusterExecOutputFile))
                return constants.RemoteJobCompleted
            except (IOError, OSError):
                return constants.RemoteJobFailed
        finally:
            self.ssh.close()

    def get_job_debug_logs(self, remote_job, seek=0):
        base_path = os.path.join(constants.MolnsClusterExecutionDir, remote_job.id)
        try:
            self.ssh.connect_cluster_node(ip_address=remote_job.remote_host.ip_address,
                                          port=remote_job.remote_host.port, username=remote_job.remote_host.username,
                                          key_filename=remote_job.remote_host.secret_key_file)
            sftp = self.ssh.open_sftp()
            log = sftp.file(os.path.join(base_path, constants.ClusterExecDebugLogsFile), 'r')
            log.seek(seek)
            return log.read()
        except (OSError, IOError) as e:
            return "Debug log file not found.", e
        finally:
            self.ssh.close()

    def get_job_logs(self, remote_job, seek=0):
        """ Get molns_exec_helper debug logs.
        Takes input remote_execution.RemoteJob object, and an option location to read logs from. """
        base_path = os.path.join(constants.MolnsClusterExecutionDir, remote_job.id)
        try:
            self.ssh.connect_cluster_node(ip_address=remote_job.remote_host.ip_address,
                                          port=remote_job.remote_host.port, username=remote_job.remote_host.username,
                                          key_filename=remote_job.remote_host.secret_key_file)
            sftp = self.ssh.open_sftp()
            output = "\n**********Error***********\n"

            try:
                log = sftp.file(os.path.join(base_path, constants.ClusterExecSuperLogsFile), 'r')
                log.seek(seek)
                output += log.read()
            except (OSError, IOError):
                pass
            try:
                log = sftp.file(os.path.join(base_path, constants.ClusterExecInfoLogsFile), 'r')
                log.seek(seek)
                output += "\n**********Job logs**********\n"
                output += log.read()
                output += "\n****************************\n"
            except (OSError, IOError):
                pass

            return output
        finally:
            self.ssh.close()

    def clean_up(self, remote_job):
        """ Delete remote job and remote scratch dirs. """
        base_path = os.path.join(constants.MolnsClusterExecutionDir, remote_job.id)
        try:
            self.ssh.connect_cluster_node(ip_address=remote_job.remote_host.ip_address,
                                          port=remote_job.remote_host.port, username=remote_job.remote_host.username,
                                          key_filename=remote_job.remote_host.secret_key_file)

            # If process is still running, terminate it.
            try:
                self.ssh.exec_command("kill -TERM `cat {0}/pid` > /dev/null 2&>1".format(base_path))
            except SSHException:
                logging.info("Remote process already dead.")

            # Remove the job directory on the remote server.
            self.ssh.exec_command("rm -rf {0}".format(base_path))
        finally:
            self.ssh.close()

    def fetch_remote_job_file(self, remote_job, remote_file_name, local_file_path):
        """ Fetch remote_file_name in remote_job's remote scratch dir and write to local_file_path. """
        base_path = os.path.join(constants.MolnsClusterExecutionDir, remote_job.id)
        try:
            self.ssh.connect_cluster_node(ip_address=remote_job.remote_host.ip_address,
                                          port=remote_job.remote_host.port, username=remote_job.remote_host.username,
                                          key_filename=remote_job.remote_host.secret_key_file)

            sftp = self.ssh.open_sftp()
            sftp.get(os.path.join(base_path, remote_file_name), os.path.join(local_file_path,
                                                                             constants.ClusterExecOutputFile))
        finally:
            self.ssh.close()

    def move_remote_files(self, remote_job, remote_copy_from_dir, remote_copy_to_dir):
        try:
            self.ssh.connect_cluster_node(ip_address=remote_job.remote_host.ip_address,
                                          port=remote_job.remote_host.port, username=remote_job.remote_host.username,
                                          key_filename=remote_job.remote_host.secret_key_file)

            self.ssh.exec_command("mv {0}/* {1}/".format(remote_copy_from_dir, remote_copy_to_dir))
            self.ssh.exec_command("rm -r {0}".format(os.path.dirname(remote_copy_from_dir)))
        finally:
            self.ssh.close()
