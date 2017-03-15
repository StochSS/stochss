import paramiko
import time


class SSHException(Exception):
    pass


class SSH:
    def __init__(self):
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    def exec_command(self, command, verbose=True):
        try:
            stdout_data = []
            stderr_data = []
            session = self.ssh.get_transport().open_session()
            session.exec_command(command)
            nbytes = 4096
            # TODO add a timeout here, don't wait for commands forever.
            while True:
                if session.recv_ready():
                    msg = session.recv(nbytes)
                    stdout_data.append(msg)
                if session.recv_stderr_ready():
                    msg = session.recv_stderr(nbytes)
                    stderr_data.append(msg)
                if session.exit_status_ready():
                    break
                time.sleep(0.1)  # Sleep briefly to prevent over-polling

            status = session.recv_exit_status()
            str_return = ''.join(stdout_data).splitlines()
            stderr_str = ''.join(stderr_data)
            session.close()
            if status != 0:
                raise paramiko.SSHException(
                    "Exit Code: {0}\tSTDOUT: {1}\tSTDERR: {2}\n\n".format(status, "\n".join(str_return), stderr_str))
            if verbose:
                print "EXECUTING...\t{0}".format(command)
            return str_return
        except paramiko.SSHException as e:
            if verbose:
                print "FAILED......\t{0}\t{1}".format(command, e)
            raise SSHException("{0}\t{1}".format(command, e))

    def exec_multi_command(self, command, next_command):
        try:
            stdin, stdout, stderr = self.ssh.exec_command(command)
            stdin.write(next_command)
            stdin.flush()
            status = stdout.channel.recv_exit_status()
            if status != 0:
                raise paramiko.SSHException("Exit Code: {0}\tSTDOUT: {1}\tSTDERR: {2}\n\n".format(status, stdout.read(),
                                                                                                  stderr.read()))
        except paramiko.SSHException as e:
            print "FAILED......\t{0}\t{1}".format(command, e)
            raise e

    def open_sftp(self):
        return self.ssh.open_sftp()

    def connect(self, instance, port, username=None, key_filename=None):
        return self.ssh.connect(instance.ip_address, port, username, key_filename=key_filename)

    def connect_cluster_node(self, ip_address, port, username, key_filename):
        return self.ssh.connect(ip_address, port, username, key_filename=key_filename)

    def close(self):
        self.ssh.close()