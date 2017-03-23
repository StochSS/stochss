import json
import logging
import os
import Utils
import string
import sys
import time
import uuid
import webbrowser
import urllib2

from constants import Constants

from DockerProxy import DockerProxy
from ssh import SSH
from DockerSSH import DockerSSH


class SSHDeployException(Exception):
    pass


class SSHDeploy:
    '''
    This class is used for deploy IPython
    '''
    DEFAULT_STOCHSS_PORT = 1443
    DEFAULT_INTERNAL_STOCHSS_PORT = 8080
    DEFAULT_GAE_ADMIN_PORT = 8000
    SSH_CONNECT_WAITTIME = 5
    MAX_NUMBER_SSH_CONNECT_ATTEMPTS = 25
    DEFAULT_SSH_PORT = 22
    DEFAULT_IPCONTROLLER_PORT = 9000

    DEFAULT_PYURDME_TEMPDIR = "/mnt/pyurdme_tmp"
    
    REMOTE_EXEC_JOB_PATH = "/mnt/molnsexec"

    def __init__(self, ssh, config=None, config_dir=None):
        if config is None:
            raise SSHDeployException("No config given")
        self.config = config
        self.config_dir = config_dir
        if config_dir is None:
            self.config_dir = os.path.join(os.path.dirname(__file__), '/../.molns/')
        self.username = config['login_username']
        self.endpoint = Constants.DEFAULT_PRIVATE_NOTEBOOK_PORT
        self.ssh_endpoint = self.DEFAULT_SSH_PORT
        self.keyfile = config.sshkeyfilename()
        if not (isinstance(ssh, SSH) or isinstance(ssh, DockerSSH)):
            raise SSHDeployException("SSH object invalid.")
        self.ssh = ssh
        self.provider_name = config.name
        self.profile = 'default'
        self.profile_dir = "/home/%s/.ipython/profile_default/" % (self.username)
        self.ipengine_env = 'export INSTANT_OS_CALL_METHOD=SUBPROCESS;export PYURDME_TMPDIR={0};'.format(
            self.DEFAULT_PYURDME_TEMPDIR)
        self.profile_dir_server = self.profile_dir
        self.profile_dir_client = self.profile_dir
        self.ipython_port = self.DEFAULT_IPCONTROLLER_PORT

    def scp_command(self, hostname):
        return "scp -o 'StrictHostKeyChecking no' \
                %s@%s:%ssecurity/ipcontroller-engine.json %ssecurity/" \
               % (self.username, hostname, self.profile_dir_server, self.profile_dir_client)

    def prompt_for_password(self):
        import getpass
        while True:
            print "Choose a password to access the IPython interface."
            pw1 = getpass.getpass()
            print "Reenter password."
            pw2 = getpass.getpass()
            if pw1 == pw2:
                print "Success."
                return pw1
            else:
                print "Passwords do not match, try again."

    def create_ssl_cert(self, cert_directory, cert_name_prefix, hostname):
        self.ssh.exec_command("mkdir -p '{0}'".format(cert_directory))
        user_cert = cert_directory + '{0}-user_cert.pem'.format(cert_name_prefix)
        ssl_key = cert_directory + '{0}-ssl_key.pem'.format(cert_name_prefix)
        ssl_cert = cert_directory + '{0}-ssl_cert.pem'.format(cert_name_prefix)
        ssl_subj = "/C=CN/ST=SH/L=STAR/O=Dis/CN=%s" % hostname
        self.ssh.exec_command(
            "openssl req -new -newkey rsa:4096 -days 365 "
            '-nodes -x509 -subj %s -keyout %s -out %s' %
            (ssl_subj, ssl_key, ssl_cert))
        return (ssl_key, ssl_cert)

    def create_ipython_config(self, hostname, notebook_password=None):
        (ssl_key, ssl_cert) = self.create_ssl_cert(self.profile_dir_server, self.username, hostname)
        remote_file_name = '%sipython_notebook_config.py' % self.profile_dir_server
        notebook_port = self.endpoint
        sha1py = 'from IPython.lib import passwd; print passwd("%s")'
        sha1cmd = "python -c '%s'" % sha1py
        if notebook_password is None:
            passwd = self.prompt_for_password()
        else:
            passwd = notebook_password
        try:
            sha1pass_out = self.ssh.exec_command(sha1cmd % passwd, verbose=False)
            if isinstance(sha1pass_out, list):
                sha1pass = sha1pass_out[0].strip()
            else:
                sha1pass = sha1pass_out.strip()
            Utils.Log.write_log("SHA1PASS_OUT: " + sha1pass_out)
            Utils.Log.write_log("SHA1PASS: " + sha1pass)
        except Exception as e:
            print "Failed: {0}\t{1}:{2}".format(e, hostname, self.ssh_endpoint)
            raise e
        sftp = self.ssh.open_sftp()
        notebook_config_file = sftp.file(remote_file_name, 'w+')
        notebook_config_file.write('\n'.join([
            "c = get_config()",
            "c.IPKernelApp.pylab = 'inline'",
            "c.NotebookApp.certfile = u'%s'" % ssl_cert,
            "c.NotebookApp.keyfile =  u'%s'" % ssl_key,
            "c.NotebookApp.ip = '*'",
            "c.NotebookApp.open_browser = False",
            "c.NotebookApp.password = u'%s'" % sha1pass,
            "c.NotebookApp.port = %d" % int(notebook_port),
            # "c.Global.exec_lines = ['import dill', 'from IPython.utils import pickleutil', 'pickleutil.use_dill()', 'import logging','logging.getLogger(\'UFL\').setLevel(logging.ERROR)','logging.getLogger(\'FFC\').setLevel(logging.ERROR)']",
        ]))
        notebook_config_file.close()

        remote_file_name = '%sipcontroller_config.py' % self.profile_dir_server
        notebook_config_file = sftp.file(remote_file_name, 'w+')
        notebook_config_file.write('\n'.join([
                "c = get_config()",
                "c.IPControllerApp.log_level=20",
                "c.HeartMonitor.period=10000",
                "c.HeartMonitor.max_heartmonitor_misses=10",
                "c.HubFactory.db_class = \"SQLiteDB\"",
                ]))
        notebook_config_file.close()

#        # IPython startup code
#        remote_file_name='{0}startup/molns_dill_startup.py'.format(self.profile_dir_server)
#        dill_init_file = sftp.file(remote_file_name, 'w+')
#        dill_init_file.write('\n'.join([
#                'import dill',
#                'from IPython.utils import pickleutil',
#                'pickleutil.use_dill()',
#                'import logging',
#                "logging.getLogger('UFL').setLevel(logging.ERROR)",
#                "logging.getLogger('FFC').setLevel(logging.ERROR)"
#                "import cloud",
#                "logging.getLogger('Cloud').setLevel(logging.ERROR)"
#                ]))
#        dill_init_file.close()
        sftp.close()

    def create_s3_config(self):
        sftp = self.ssh.open_sftp()
        remote_file_name = '.molns/s3.json'
        s3_config_file = sftp.file(remote_file_name, 'w')
        config = {}
        config["provider_type"] = self.config.type
        config["bucket_name"] = "molns_storage_{1}_{0}".format(self.get_cluster_id(), self.provider_name)
        config["credentials"] = self.config.get_config_credentials()
        s3_config_file.write(json.dumps(config))
        s3_config_file.close()
        sftp.close()

    def get_cluster_id(self):
        """ Retrieve the cluster id from the config. """
        filename = os.path.join(self.config_dir, 'cluster_id')
        if not os.path.isfile(filename):
            new_id = str(uuid.uuid4())
            logging.debug("get_cluster_id() file {0} not found, creating id = {1}".format(filename, new_id))
            with open(filename, 'w+') as wfd:
                wfd.write(new_id)
        with open(filename) as fd:
            idstr = fd.readline().rstrip()
            logging.debug("get_cluster_id() file {0} found id = {1}".format(filename, idstr))
            if idstr is None or len(idstr) == 0:
                raise SSHDeployException(
                    "error getting id for cluster from file, please check your file '{0}'".format(filename))
            return idstr

    def create_engine_config(self):
        sftp = self.ssh.open_sftp()
        remote_file_name = '%sipengine_config.py' % self.profile_dir_server
        notebook_config_file = sftp.file(remote_file_name, 'w+')
        notebook_config_file.write('\n'.join([
            "c = get_config()",
            "c.IPEngineApp.log_level=20",
            "c.IPEngineApp.log_to_file = True",
            "c.Global.exec_lines = ['import dill', 'from IPython.utils import pickleutil', 'pickleutil.use_dill()']",
        ]))
        notebook_config_file.close()
        sftp.close()
        self.create_s3_config()

    def _get_ipython_client_file(self):
        sftp = self.ssh.open_sftp()
        engine_file = sftp.file(self.profile_dir_server + 'security/ipcontroller-client.json', 'r')
        engine_file.prefetch()
        file_data = engine_file.read()
        engine_file.close()
        sftp.close()
        return file_data

    def _put_ipython_client_file(self, file_data):
        sftp = self.ssh.open_sftp()
        engine_file = sftp.file(self.profile_dir_server + 'security/ipcontroller-client.json', 'w+')
        engine_file.write(file_data)
        engine_file.close()
        sftp.close()

    def _get_ipython_engine_file(self):
        sftp = self.ssh.open_sftp()
        engine_file = sftp.file(self.profile_dir_server + 'security/ipcontroller-engine.json', 'r')
        engine_file.prefetch()
        file_data = engine_file.read()
        engine_file.close()
        sftp.close()
        return file_data

    def _put_ipython_engine_file(self, file_data):
        sftp = self.ssh.open_sftp()
        engine_file = sftp.file(self.profile_dir_server + 'security/ipcontroller-engine.json', 'w+')
        engine_file.write(file_data)
        engine_file.close()
        sftp.close()

    def exec_command_list_switch(self, command_list):
        for command in command_list:
            self.ssh.exec_command(command)

    def connect(self, instance, port=None):
        if port is None:
            port = self.ssh_endpoint
        print "Connecting to {0}:{1} keyfile={2}".format(instance.ip_address, port, self.keyfile)
        for i in range(self.MAX_NUMBER_SSH_CONNECT_ATTEMPTS):
            try:
                self.ssh.connect(instance, self.ssh_endpoint, username=self.username,
                                 key_filename=self.keyfile)
                if not isinstance(self.ssh, DockerSSH):
                    print "SSH connection established"
                else:
                    print "Ready to execute commands in local container."
                return
            except Exception as e:
                print "Retry in {0} seconds...\t\t{1}".format(self.SSH_CONNECT_WAITTIME, e)
                time.sleep(self.SSH_CONNECT_WAITTIME)
        raise SSHDeployException("ssh connect Failed!!!\t{0}:{1}".format(instance.ip_address, self.ssh_endpoint))

    def deploy_molns_webserver(self, instance, controller_obj, openWebBrowser=True):
        ip_address = instance.ip_address
        logging.debug('deploy_molns_webserver(): openWebBrowser={0}, controller_obj.provider.type={1}\n',
                      openWebBrowser, controller_obj.provider.type)

        if controller_obj.provider.type == Constants.DockerProvider:
            ip_address = "0.0.0.0:{0}".format(controller_obj.config["web_server_port"])
        logging.debug('deploy_molns_webserver(): ip_address={0}\n',ip_address)

        try:
            self.connect(instance, self.ssh_endpoint)
            self.ssh.exec_command("sudo rm -rf /usr/local/molns_webroot")
            self.ssh.exec_command("sudo mkdir -p /usr/local/molns_webroot")
            self.ssh.exec_command("sudo chown ubuntu /usr/local/molns_webroot")
            self.ssh.exec_command(
                "git clone https://github.com/Molns/MOLNS_web_landing_page.git /usr/local/molns_webroot")

            # If DockerProvider, replace index page.
            if controller_obj.provider.type == Constants.DockerProvider:
                from molns_landing_page import MolnsLandingPage
                index_page = MolnsLandingPage(controller_obj.config["notebook_port"]).molns_landing_page
                self.ssh.exec_command("echo {0} > /usr/local/molns_webroot/index.html".format(index_page))

            self.ssh.exec_multi_command(
                "cd /usr/local/molns_webroot; python -m SimpleHTTPServer {0} > ~/.molns_webserver.log 2>&1 &".format(
                    Constants.DEFAULT_PRIVATE_WEBSERVER_PORT), '\n')
            self.ssh.exec_command(
                "sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport {0} -j REDIRECT --to-port {1}".format(
                    Constants.DEFAULT_PUBLIC_WEBSERVER_PORT, Constants.DEFAULT_PRIVATE_WEBSERVER_PORT))
            self.ssh.close()
            print "Deploying MOLNs webserver"
            url = "http://{0}/".format(ip_address)
            if openWebBrowser:
                while True:
                    try:
                        req = urllib2.urlopen(url)
                        sys.stdout.write("\n")
                        sys.stdout.flush()
                        break
                    except Exception as e:
                        #sys.stdout.write("{0}".format(e))
                        sys.stdout.write(".")
                        sys.stdout.flush()
                        time.sleep(1)
                webbrowser.open(url)
        except Exception as e:
            print "Failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def get_number_processors(self):
        cmd = 'python -c "import multiprocessing;print multiprocessing.cpu_count()"'
        try:
            output = self.ssh.exec_command(cmd)[0].strip()
            return int(output)
        except Exception as e:
            raise SSHDeployException("Could not determine the number of processors on the remote system: {0}".format(e))

    def deploy_remote_execution_job(self, ip_address, jobID, exec_str):
        base_path = "{0}/{1}".format(self.REMOTE_EXEC_JOB_PATH,jobID)
        EXEC_HELPER_FILENAME = 'molns_exec_helper.py'
        try:
            self.connect(ip_address, self.ssh_endpoint)
            # parse command, retreive files to upload (iff they are in the local directory)
            # create remote direct=ory
            self.ssh.exec_command("sudo mkdir -p {0}".format(base_path))
            self.ssh.exec_command("sudo chown ubuntu {0}".format(base_path))
            self.ssh.exec_command("mkdir -p {0}/.molns/".format(base_path))
            sftp = self.ssh.open_sftp()
            # Parse exec_str to get job files
            files_to_transfer = []
            remote_command_list = []
            for c in exec_str.split():
                c2 = c
                if c.startswith('~'):
                    c2 = os.path.expanduser(c)
                if os.path.isfile(c2):
                    files_to_transfer.append(c2)
                    remote_command_list.append(os.path.basename(c2))
                else:
                    remote_command_list.append(c)
            # Transfer job files
            for f in files_to_transfer:
                logging.debug('Uploading file {0}'.format(f))
                sftp.put(f, "{0}/{1}".format(base_path, os.path.basename(f)))
            # Transfer helper file (to .molns subdirectory)
            logging.debug('Uploading file {0}'.format(EXEC_HELPER_FILENAME))
            sftp.put(
                os.path.join(os.path.dirname(os.path.abspath(__file__)),EXEC_HELPER_FILENAME),
                "{0}/.molns/{1}".format(base_path,EXEC_HELPER_FILENAME)
                )
            # Write 'cmd' file
            remote_command = " ".join(remote_command_list)
            logging.debug("Writing remote_command = {0}".format(remote_command))
            cmd_file = sftp.file("{0}/.molns/{1}".format(base_path,'cmd'), 'w')
            cmd_file.write(remote_command)
            cmd_file.close()
            # execute command
            logging.debug("Executing command")
            self.ssh.exec_command("cd {0};python {0}/.molns/{1} &".format(base_path, EXEC_HELPER_FILENAME))
            self.ssh.close()
        except Exception as e:
            print "Remote execution failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def remote_execution_job_status(self, ip_address, jobID):
        ''' Check the status of a remote process.
        
        Returns: Tuple with two elements: (Is_Running, Message)
            Is_Running: bool    True if the process is running
            Message: str        Description of the status
        '''
        base_path = "{0}/{1}".format(self.REMOTE_EXEC_JOB_PATH,jobID)
        try:
            self.connect(ip_address, self.ssh_endpoint)
            sftp = self.ssh.open_sftp()
            # Does the 'pid' file exists remotely?
            try:
                sftp.stat("{0}/.molns/pid".format(base_path))
            except (IOError, OSError) as e:
                self.ssh.close()
                raise SSHDeployException("Remote process not started (pid file not found")
            # Does the 'return_value' file exist?
            try:
                sftp.stat("{0}/.molns/return_value".format(base_path))
                # Process is complete
                return (False, "Remote process finished")
            except (IOError, OSError) as e:
                pass
            # is the process running?
            try:
                self.ssh.exec_command("kill -0 `cat {0}/.molns/pid` > /dev/null 2&>1".format(base_path))
                return (True, "Remote process running")
            except SSHDeployException as e:
                raise SSHDeployException("Remote process not running (process not found)")
            finally:
                self.ssh.close()
        except Exception as e:
            print "Remote execution failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def remote_execution_get_job_logs(self, ip_address, jobID, seek):
        base_path = "{0}/{1}".format(self.REMOTE_EXEC_JOB_PATH,jobID)
        try:
            self.connect(ip_address, self.ssh_endpoint)
            sftp = self.ssh.open_sftp()
            log = sftp.file("{0}/.molns/stdout".format(base_path), 'r')
            log.seek(seek)
            output = log.read()
            self.ssh.close()
            return output
        except Exception as e:
            print "Remote execution failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def remote_execution_delete_job(self, ip_address, jobID):
        base_path = "{0}/{1}".format(self.REMOTE_EXEC_JOB_PATH,jobID)
        try:
            self.connect(ip_address, self.ssh_endpoint)
            ### If process is still running, terminate it
            try:
                self.ssh.exec_command("kill -TERM `cat {0}/.molns/pid` > /dev/null 2&>1".format(base_path))
            except Exception as e:
                pass
            ### Remove the filess on the remote server
            self.ssh.exec_command("rm -rf {0}/* {0}/.molns*".format(base_path))
            self.ssh.exec_command("sudo rmdir {0}".format(base_path))
            self.ssh.close()
        except Exception as e:
            print "Remote execution failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def remote_execution_fetch_file(self, ip_address, jobID, filename, localfilename):
        base_path = "{0}/{1}".format(self.REMOTE_EXEC_JOB_PATH,jobID)
        try:
            self.connect(ip_address, self.ssh_endpoint)
            sftp = self.ssh.open_sftp()
            sftp.get("{0}/{1}".format(base_path, filename), localfilename)
            self.ssh.close()
        except Exception as e:
            print "Remote execution failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]



#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def deploy_stochss(self, ip_address, port=1443):
        try:
            print "{0}:{1}".format(ip_address, self.ssh_endpoint)
            self.connect(ip_address, self.ssh_endpoint)
            print "Configure Nginx"
            (ssl_key, ssl_cert) = self.create_ssl_cert('/home/ubuntu/.nginx_cert/', 'stochss', ip_address)
            sftp = self.ssh.open_sftp()
            with open(os.path.dirname(
                    os.path.abspath(__file__)) + os.sep + '..' + os.sep + 'templates' + os.sep + 'nginx.conf') as fd:
                web_file = sftp.file("/tmp/nginx.conf", 'w+')
                buff = fd.read()
                buff = string.replace(buff, '###LISTEN_PORT###', str(port))
                buff = string.replace(buff, '###SSL_CERT###', str(ssl_cert))
                buff = string.replace(buff, '###SSL_CERT_KEY###', str(ssl_key))
                print buff
                web_file.write(buff)
                web_file.close()
            self.ssh.exec_command("sudo chown root /tmp/nginx.conf")
            self.ssh.exec_command("sudo mv /tmp/nginx.conf /etc/nginx/nginx.conf")
            print "Starting Nginx"
            self.ssh.exec_command("sudo nginx")

            print "Modifying StochSS to not open a webbrowser (TODO: move to install)"
            self.ssh.exec_command("sed -i 's/webbrowser.open_new(stochss_url)/pass/' /usr/local/stochss/run.ubuntu.sh")

            print "Starting StochSS"
            self.ssh.exec_command("cd /usr/local/stochss/ && screen -d -m ./run.ubuntu.sh")
            print "Waiting for StochSS to become available:"
            stochss_url = "https://{0}/".format(ip_address)
            while True:
                try:
                    req = urllib2.urlopen(stochss_url)
                    break
                except Exception as e:
                    # sys.stdout.write("{0}".format(e))
                    sys.stdout.write(".")
                    sys.stdout.flush()
                    time.sleep(1)
            print "Success!"
            print "Configuring StochSS"
            admin_token = uuid.uuid4()
            create_and_exchange_admin_token = "python /usr/local/stochss/generate_admin_token.py {0}".format(
                admin_token)
            self.ssh.exec_command(create_and_exchange_admin_token)
            time.sleep(1)
            stochss_url = "{0}login?secret_key={1}".format(stochss_url, admin_token)
            print "StochSS available: {0}".format(stochss_url)
            webbrowser.open_new(stochss_url)
        except Exception as e:
            print "StochSS launch failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def __transfer_cluster_ssh_key_file(self, remote_target_dir, controller_obj):
        local_ssh_key_file_path = controller_obj.config["ssh_key_file"]

        if local_ssh_key_file_path is None:
            print "No SSH key file provided for cluster access."
            return

        if not os.access(local_ssh_key_file_path, os.R_OK):
            print "No read access to SSH key file. Skipping transfer."
            return

        # Transfer secret key file.
        sftp = self.ssh.open_sftp()
        remote_file_abs_path = os.path.join(remote_target_dir, Constants.ClusterKeyFileNameOnController)
        remote_ssh_key_file = sftp.file(remote_file_abs_path, 'w')

        with open(local_ssh_key_file_path, "r") as local_ssh_key_file:
            remote_ssh_key_file.write(local_ssh_key_file.read())

        remote_ssh_key_file.close()
        sftp.close()

        # Only user ubuntu has permission to access file.
        self.ssh.exec_command("sudo chown ubuntu:ubuntu {0}".format(remote_file_abs_path))
        self.ssh.exec_command("sudo chmod 400 {0}".format(remote_file_abs_path))

    def deploy_ipython_controller(self, instance, controller_obj, notebook_password=None, reserved_cpus=2,
                                  resume=False):
        ip_address = instance.ip_address

        logging.debug('deploy_ipython_controller(ip_address={0}, reserved_cpus={1})'.format(ip_address, reserved_cpus))
        try:
            print "{0}:{1}".format(ip_address, self.ssh_endpoint)
            self.connect(instance, self.ssh_endpoint)

            # Set up the symlink to local scratch space
            self.ssh.exec_command("sudo mkdir -p /mnt/molnsarea")
            self.ssh.exec_command("sudo chown ubuntu /mnt/molnsarea")
            self.ssh.exec_command("sudo mkdir -p /mnt/molnsarea/cache")
            self.ssh.exec_command("sudo chown ubuntu /mnt/molnsarea/cache")

            self.ssh.exec_command(
                "test -e {0} && sudo rm {0} ; sudo ln -s /mnt/molnsarea {0}".format('/home/ubuntu/localarea'))

            # Setup symlink to the shared scratch space
            self.ssh.exec_command("sudo mkdir -p /mnt/molnsshared")
            self.ssh.exec_command("sudo chown ubuntu /mnt/molnsshared")
            self.ssh.exec_command(
                "test -e {0} && sudo rm {0} ; sudo ln -s /mnt/molnsshared {0}".format('/home/ubuntu/shared'))
            #
            self.ssh.exec_command("sudo mkdir -p {0}".format(self.DEFAULT_PYURDME_TEMPDIR))
            self.ssh.exec_command("sudo chown ubuntu {0}".format(self.DEFAULT_PYURDME_TEMPDIR))
            #
            # self.exec_command("cd /usr/local/molns_util && git pull && sudo python setup.py install")

            home_dir = ""
            if controller_obj.provider.type == Constants.DockerProvider:
                home_dir = "/home/ubuntu/"

            # If its not a DockerController being resumed, then create config files and move sample notebooks to volume.
            if not (controller_obj.provider.type == Constants.DockerProvider and resume is True):
                self.ssh.exec_command("mkdir -p {0}.molns".format(home_dir))
                self.create_s3_config()
                self.ssh.exec_command("ipython profile create {0}".format(self.profile))
                self.create_ipython_config(ip_address, notebook_password)
                self.create_engine_config()
                self.__transfer_cluster_ssh_key_file(remote_target_dir=home_dir, controller_obj=controller_obj)
                if controller_obj.provider.type == Constants.DockerProvider:
                    self.ssh.exec_command("mv {0}*.ipynb {1}".format(home_dir,
                                                                     DockerProxy.get_container_volume_from_working_dir(
                                                                         controller_obj.config["working_directory"])))

            # If provider is Docker, then ipython controller and ipengines aren't started

            if controller_obj.provider.type != Constants.DockerProvider:
                self.ssh.exec_command(
                    "source /usr/local/pyurdme/pyurdme_init; screen -d -m ipcontroller --profile={1} --ip='*' --location={0} "
                    "--port={2}--log-to-file".format(
                        ip_address, self.profile, self.ipython_port), '\n')
                # Give the controller time to startup
                import time
                logging.debug('Waiting 5 seconds for the IPython controller to start.')
                time.sleep(5)

                # Start one ipengine per processor
                num_procs = self.get_number_processors()
                num_engines = num_procs - reserved_cpus
                logging.debug(
                    'Starting {0} engines (#cpu={1}, reserved_cpus={2})'.format(num_engines, num_procs, reserved_cpus))

                for _ in range(num_engines):
                    self.ssh.exec_command(
                        "{1}source /usr/local/pyurdme/; screen -d -m ipengine --profile={0} --debug".format(
                            self.profile, self.ipengine_env))
                self.ssh.exec_command(
                    "{1}source /usr/local/pyurdme/pyurdme_init; screen -d -m ipython notebook --profile={0}".format(
                        self.profile, self.ipengine_env))
            else:
                self.ssh.exec_command(
                    "sudo pip install /usr/local/pyurdme/; screen -d -m ipython notebook --profile={0}".format(
                        self.profile))

            # TODO remove next three commands after testing. Put them in the image instead.
            # Install cluster_execution
            self.ssh.exec_command("git clone https://github.com/aviral26/cluster_execution.git")

            # Install molns
            self.ssh.exec_command("git clone https://github.com/aviral26/molns.git")

            # Temporary command until new image is created to use latest molnsutil. TODO pip install molnsutil
            self.ssh.exec_command("cd /usr/local/molnsutil; git checkout qsub_support; git pull")

            self.ssh.exec_command(
                "sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport {0} -j REDIRECT --to-port {1}".format(
                    Constants.DEFAULT_PUBLIC_NOTEBOOK_PORT, Constants.DEFAULT_PRIVATE_NOTEBOOK_PORT))
        except Exception as e:
            print "Failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

        finally:
            self.ssh.close()

        url = "https://%s" % (ip_address)
        print "\nThe URL for your MOLNs head node is: %s." % url

    def get_ipython_engine_file(self, ip_address):
        try:
            print "{0}:{1}".format(ip_address, self.ssh_endpoint)
            self.connect(ip_address, self.ssh_endpoint)
            engine_file_data = self._get_ipython_engine_file()
            self.ssh.close()
            return engine_file_data
        except Exception as e:
            print "Failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def get_ipython_client_file(self, ip_address):
        try:
            print "{0}:{1}".format(ip_address, self.ssh_endpoint)
            self.connect(ip_address, self.ssh_endpoint)
            engine_file_data = self._get_ipython_engine_file()
            self.ssh.close()
            return engine_file_data
        except Exception as e:
            print "Failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]

    def deploy_ipython_engine(self, ip_address, controler_ip, engine_file_data, controller_ssh_keyfile):
        try:
            print "{0}:{1}".format(ip_address, self.ssh_endpoint)
            self.connect(ip_address, self.ssh_endpoint)

            # Setup the symlink to local scratch space
            self.ssh.exec_command("sudo mkdir -p /mnt/molnsarea")
            self.ssh.exec_command("sudo chown ubuntu /mnt/molnsarea")
            self.ssh.exec_command("sudo mkdir -p /mnt/molnsarea/cache")
            self.ssh.exec_command("sudo chown ubuntu /mnt/molnsarea/cache")

            self.ssh.exec_command(
                "test -e {0} && sudo rm {0} ; sudo ln -s /mnt/molnsarea {0}".format('/home/ubuntu/localarea'))
            #
            self.ssh.exec_command("sudo mkdir -p {0}".format(self.DEFAULT_PYURDME_TEMPDIR))
            self.ssh.exec_command("sudo chown ubuntu {0}".format(self.DEFAULT_PYURDME_TEMPDIR))
            # Setup config for object store
            self.ssh.exec_command("mkdir -p .molns")
            self.create_s3_config()

            # SSH mount the controller on each engine
            remote_file_name = '.ssh/id_dsa'
            with open(controller_ssh_keyfile) as fd:
                sftp = self.ssh.open_sftp()
                controller_keyfile = sftp.file(remote_file_name, 'w')
                buff = fd.read()
                print "Read {0} bytes from file {1}".format(len(buff), controller_ssh_keyfile)
                controller_keyfile.write(buff)
                controller_keyfile.close()
                print "Remote file {0} has {1} bytes".format(remote_file_name, sftp.stat(remote_file_name).st_size)
                sftp.close()
            self.ssh.exec_command("chmod 0600 {0}".format(remote_file_name))
            self.ssh.exec_command("mkdir -p /home/ubuntu/shared")
            self.ssh.exec_command(
                "sshfs -o Ciphers=arcfour -o Compression=no -o reconnect -o idmap=user -o StrictHostKeyChecking=no ubuntu@{0}:/mnt/molnsshared /home/ubuntu/shared".format(
                    controler_ip))

            # Update the Molnsutil package: TODO remove when molns_util is stable
            # self.exec_command("cd /usr/local/molns_util && git pull && sudo python setup.py install")

            self.ssh.exec_command("ipython profile create {0}".format(self.profile))
            self.create_engine_config()
            # Just write the engine_file to the engine
            self._put_ipython_engine_file(engine_file_data)
            # Start one ipengine per processor
            for _ in range(self.get_number_processors()):
                self.ssh.exec_command(
                    "{1}source /usr/local/pyurdme/pyurdme_init; screen -d -m ipengine --profile={0} --debug".format(
                        self.profile, self.ipengine_env))

            self.ssh.close()

        except Exception as e:
            print "Failed: {0}\t{1}:{2}".format(e, ip_address, self.ssh_endpoint)
            raise sys.exc_info()[1], None, sys.exc_info()[2]
