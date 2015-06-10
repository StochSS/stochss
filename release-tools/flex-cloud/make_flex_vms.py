#!/usr/bin/env python

__author__ = 'Dibyendu Nath'
__email__ = 'dnath@cs.ucsb.edu'

import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'app', 'backend', 'common')))

import time
import json
import threading
import subprocess
import tempfile
import traceback
import pprint
import argparse
import glob
import urllib2
import string
import random

import mysql.connector
from contextlib import closing

from config import JobDatabaseConfig


DEFAULT_SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "settings.json")
DEFAULT_MACHINE_CONFIG_FILE = os.path.join(os.path.dirname(__file__), "machines.json")

DEFAULT_ADD_SUDOER_SCRIPT_TEMPLATE = os.path.join(os.path.dirname(__file__), "add_sudoer.sh.template")
DEFAULT_ADD_SUDOER_SCRIPT = os.path.join(os.path.dirname(__file__), "add_sudoer.sh")

DEFAULT_FLEX_API_APACHE_CONF_TEMPLATE = os.path.join(os.path.dirname(__file__), "flex_api_site.conf.template")
DEFAULT_FLEX_API_APACHE_CONF = os.path.join(os.path.dirname(__file__), "flex_api_site.conf")

DEFAULT_FLEX_API_APP_LOCATION = os.path.join('app', 'backend', 'flex_api')
DEFAULT_FLEX_API_APP_WSGI_LOCATION = os.path.join(DEFAULT_FLEX_API_APP_LOCATION, 'flex_rest_api.wsgi')
DEFAULT_FLEX_API_APP_NAME = 'flex_rest_api'

DEFAULT_SSL_CERT_NAME = 'server.crt'
DEFAULT_SSL_KEY_NAME = 'server.key'


class ShellCommandException(Exception):
    pass


def get_remote_command(user, ip, key_file, command):
    return 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {0} {1}@{2} "{3}"'.format(key_file, user,
                                                                                                         ip, command)


def get_scp_command(user, ip, key_file, target, source, is_sudo=False):
    return 'scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {key_file} {source} {user}@{ip}:{target}'.format(
        key_file=key_file, user=user, ip=ip,
        source=source, target=target)


class ShellCommand(object):
    def __init__(self, cmd, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr, verbose=False):
        self.cmd = cmd
        self.stdin = stdin
        self.stdout = stdout
        self.stderr = stderr
        self.process = None
        self.verbose = verbose

    def run(self, timeout=None, silent=True):
        def target():
            if self.verbose: print 'Running... $', self.cmd
            self.process = subprocess.Popen(self.cmd,
                                            stdin=self.stdin,
                                            stdout=self.stdout,
                                            stderr=self.stderr,
                                            shell=True)
            self.process.communicate()
            if self.verbose: print 'End of cmd $', self.cmd

        thread = threading.Thread(target=target)
        thread.start()

        if timeout is not None:
            thread.join(timeout)
            if thread.is_alive():
                if silent is False:
                    print 'Terminating process due to timeout...'
                self.process.terminate()
                thread.join()
                if silent is False:
                    print 'Process return code =', self.process.returncode
        else:
            thread.join()
            if self.process.returncode != 0:
                raise ShellCommandException("return code = {0}".format(self.process.returncode))


class VirtualMachine(object):
    NUM_TRIALS = 5
    NUM_SSH_TRIALS = 10

    def __init__(self, ip, username, keyfile, dependencies, python_packages, git_repo,
                 log_type="screen", stderr_log=None, stdout_log=None, verbose=False):
        self.ip = ip
        self.username = username
        self.keyfile = keyfile

        self.dependencies = dependencies
        self.python_packages = python_packages
        self.git_repo = git_repo
        self.verbose = verbose

        self.log_type = log_type
        self.stderr_log = stderr_log
        self.stdout_log = stdout_log
        self.start_time = None

    def make_flex_vm(self):
        self.start_time = time.time()

        try:
            self.__is_machine_reachable()
            self.__enable_network_ports()
            self.__try_install_dependencies()
            self.__update_fenics()
            self.__reboot_machine()
            self.__check_fenics_installation()
            self.__try_install_python_packages()
            self.__download_stochss_repo()
            self.__compile_stochss()
            self.run_tests()
            self.__setup_job_db()
            self.__setup_flex_api_server()
            self.__test_flex_api_server()
            self.__add_sudoer()
            # self.__cleanup_instance()

        except:
            traceback.print_exc()

        print 'Done in {} seconds'.format(time.time() - self.start_time)

    def __add_sudoer(self):
        header = 'Adding restricted sudo rights to apache user...'
        print '=================================================='
        print header

        with open(DEFAULT_ADD_SUDOER_SCRIPT_TEMPLATE) as fin:
            contents = fin.read()

        allowed_executables = [
            "/home/{username}/stochss/release-tools/flex-cloud/deregister_flex_vm.sh, /tmp/start_celery.sh".format(username=self.username)
        ]

        contents = contents.replace('EXECUTABLES', ','.join(allowed_executables))

        # print 'add sudoer file:\n{0}'.format(contents)

        with open(DEFAULT_ADD_SUDOER_SCRIPT, 'w') as fout:
            fout.write(contents)

        scp_command = get_scp_command(user=self.username, ip =self.ip, key_file=self.keyfile,
                                      source=DEFAULT_ADD_SUDOER_SCRIPT,
                                      target='~/add_sudoer.sh')

        # print 'scp command:\n{0}'.format(scp_command)

        result = os.system(scp_command)
        if result != 0:
            print 'scp Failed!'

        else:
            commands = [
                'chmod +x ~/add_sudoer.sh',
                'sudo ~/add_sudoer.sh'
            ]

            command = ';'.join(commands)
            # print command
            self.__run_remote_command(command=command, log_header=header)


    def __setup_job_db(self):
        header = 'Setting up Job DB : MySQL...'
        print '=================================================='
        print header

        username = 'root'
        password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(16))

        sql_lines = [
            "CREATE DATABASE IF NOT EXISTS {db_name}".format(db_name=JobDatabaseConfig.DATABASE_NAME),
            "GRANT ALL PRIVILEGES ON {db_name}.* TO '{username}'@'%' IDENTIFIED BY '{password}' WITH GRANT OPTION".format(
                db_name=JobDatabaseConfig.DATABASE_NAME, username=username, password=password),
            ""
        ]

        commands = [
            "sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password {password}'".format(password=password),
            "sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password {password}'".format(password=password),
            "sudo apt-get -y install mysql-server > mysql_install.stdout.log 2> mysql_install.stderr.log",
            "mysql -u root --password={password} --execute=\\\"{sql}\\\"".format(password=password,
                                                                              sql=';'.join(sql_lines)),
            "sudo sed -i 's/bind-address\s*=\s*127.0.0.1/bind-address = 0.0.0.0/g' /etc/mysql/my.cnf",
            "sudo service mysql restart"
        ]

        command = ';'.join(commands)
        # print command
        self.__run_remote_command(command=command, log_header=header)
        self.__test_job_db(db_username=username, db_password=password)


    def __test_job_db(self, db_username, db_password):
        try:
            db = mysql.connector.connect(host=self.ip, user=db_username, passwd=db_password,
                                         db=JobDatabaseConfig.DATABASE_NAME)
            with closing(db.cursor()) as db_cursor:
                db_cursor.execute("SHOW DATABASES LIKE '{db_name}'".format(db_name=JobDatabaseConfig.DATABASE_NAME))
                rows = db_cursor.fetchall()

            if len(rows) > 0:
                print 'MySQL setup successful!'
            else:
                print 'MySQL setup failed!'

        except Exception as e:
            print 'Error: Failed to setup MySQL Job Database : {}'.format(str(e))


    def __test_flex_api_server(self):
        json_message = json.loads(urllib2.urlopen("https://{ip}".format(ip=self.ip)).read())
        if json_message['name'] == 'Flex API' and json_message['version'] == '1.0.0':
            print 'Flex API Server running!'
        else:
            print 'Flex API Server is not working!'

    def __get_remote_stochss_dirname(self):
        return os.path.join('/home', self.username, 'stochss')

    def __get_remote_apache2_dirname(self):
        return '/etc/apache2'

    def __create_ssl_cert_key_pair(self):
        remote_apache2_dirname = self.__get_remote_apache2_dirname()
        ssl_dirname = os.path.join(remote_apache2_dirname, 'ssl')
        cert_filename = os.path.join(ssl_dirname, DEFAULT_SSL_CERT_NAME)
        key_filename = os.path.join(ssl_dirname, DEFAULT_SSL_KEY_NAME)
        subj = "/C=/ST=/L=/O=/OU=/CN={ip}".format(ip=self.ip)

        commands = [
            "sudo mkdir -p {0}".format(ssl_dirname),
            "rm -f {0} {1}".format(cert_filename, key_filename),
            "sudo openssl req -x509 -nodes -days 1095 -newkey rsa:2048 -out {cert} -keyout {key} -subj \"{subj}\"".format(
                cert=cert_filename,
                key=key_filename,
                subj=subj
            )
        ]

        command = ';'.join(commands)
        remote_cmd = get_remote_command(user=self.username, ip=self.ip, key_file=self.keyfile,
                                        command=command)

        if os.system(remote_cmd) != 0:
            raise Exception('Failed to create ssl cert/key pair!')

        return cert_filename, key_filename


    def __setup_flex_api_server(self):
        header = 'Setting Flex REST API web server...'
        print '=================================================='
        print header
        stochss_dir = self.__get_remote_stochss_dirname()

        cert_filename, key_filename = self.__create_ssl_cert_key_pair()

        with open(DEFAULT_FLEX_API_APACHE_CONF_TEMPLATE) as fin:
            contents = fin.read()

        contents = contents.replace('FLEX_API_APP_NAME', DEFAULT_FLEX_API_APP_NAME)
        contents = contents.replace('FLEX_API_APP_LOCATION', os.path.join(stochss_dir,
                                                                               DEFAULT_FLEX_API_APP_LOCATION))
        contents = contents.replace('FLEX_API_APP_WSGI_LOCATION', os.path.join(stochss_dir,
                                                                               DEFAULT_FLEX_API_APP_WSGI_LOCATION))
        contents = contents.replace('FLEX_API_APP_CERT', cert_filename)
        contents = contents.replace('FLEX_API_APP_KEY', key_filename)

        # print 'site file config:\n{0}'.format(contents)

        with open(DEFAULT_FLEX_API_APACHE_CONF, 'w') as fout:
            fout.write(contents)

        scp_command = get_scp_command(user=self.username, ip =self.ip, key_file=self.keyfile,
                                      source=DEFAULT_FLEX_API_APACHE_CONF,
                                      target='~/{0}.conf'.format(DEFAULT_FLEX_API_APP_NAME))

        # print 'scp command:\n{0}'.format(scp_command)

        result = os.system(scp_command)
        if result != 0:
            print 'scp Failed!'

        else:
            site_config_filename = '/etc/apache2/sites-available/{0}.conf'.format(DEFAULT_FLEX_API_APP_NAME)
            print 'site file config filename = {0}'.format(site_config_filename)

            commands = ['sudo mv {0} {1}'.format('~/{0}.conf'.format(DEFAULT_FLEX_API_APP_NAME),
                                                 site_config_filename),
                        'sudo chown root:root "{0}"'.format(site_config_filename),
                        'sudo a2enmod ssl',
                        'sudo a2dissite 000-default',
                        'sudo a2ensite {0}.conf'.format(DEFAULT_FLEX_API_APP_NAME),
                        'sudo service apache2 restart']

            command = ';'.join(commands)
            # print command
            self.__run_remote_command(command=command, log_header=header)


    def __enable_network_ports(self):
        # Enable ports 22, 5672, 6379, 11211, 55672, 80, 443, 3306
        ports = [22, 5672, 6379, 11211, 55672, 80, 443, 3306]

        print '===================================================='
        print 'Trying to enable ports = {}'.format(ports)

        for port in ports:
            print 'For port {}'.format(port)
            remote_cmd = get_remote_command(user=self.username, ip=self.ip, key_file=self.keyfile,
                                            command="sudo ufw allow {port}".format(port=port))
            subprocess.call(remote_cmd, shell=True)


    def __try_install_dependencies(self):
        trial = 0
        while trial <= self.NUM_TRIALS:
            if trial == self.NUM_TRIALS:
                raise Exception("Linux Dependency Installation failed after {0} trials!".format(self.NUM_TRIALS))

            print "====================[Trial #{0}]======================".format(trial + 1)

            is_successful = False
            try:
                self.__update_instance()
                self.__install_dependencies()
                is_successful = self.__check_dependency_installation()
            except ShellCommandException:
                pass

            if is_successful:
                print "Trial #{0} of linux dependency installation successful!".format(trial + 1)
                break
            else:
                print "Trial #{0} of linux dependency installation failed!".format(trial + 1)

            time.sleep(5)
            trial += 1

    def __try_install_python_packages(self):
        trial = 0
        while trial <= self.NUM_TRIALS:
            if trial == self.NUM_TRIALS:
                raise Exception("Python package installation failed after {0} trials!".format(self.NUM_TRIALS))

            print "====================[Trial #{0}]======================".format(trial + 1)

            is_successful = False
            try:
                self.__install_python_packages()
                is_successful = self.__check_python_packages_installation()
            except ShellCommandException:
                pass

            if is_successful:
                print "Trial #{0} of python package installation successful!".format(trial + 1)
                break
            else:
                print "Trial #{0} of python package installation failed!".format(trial + 1)

            time.sleep(5)
            trial += 1

    def __is_machine_reachable(self):
        self.__wait_until_successful_ssh()
        print 'Machine with ip: {0} reachable.'.format(self.ip)

    def __update_instance(self):
        header = 'Updating instance...'
        print '=================================================='
        print header
        command = ';'.join(['sudo apt-get -y update',
                            'sudo apt-get -y upgrade',
                            'sudo apt-get -y dist-upgrade'])
        self.__run_remote_command(command=command, log_header=header)

    def __install_dependencies(self):
        header = 'Installing dependencies...'
        print '=================================================='
        print header
        command = "sudo apt-get -y install {0}".format(' '.join(self.dependencies))
        self.__run_remote_command(command=command, log_header=header)

    def __update_fenics(self):
        header = 'Updating FeniCS...'
        print '=================================================='
        print header
        command = ';'.join(['sudo add-apt-repository -y ppa:fenics-packages/fenics',
                            'sudo apt-get -y update',
                            'sudo apt-get -y install fenics',
                            'sudo apt-get -y dist-upgrade'])

        self.__run_remote_command(command=command, log_header=header)


    def __wait_until_successful_ssh(self):
        command = 'echo Machine with ip {0} is up!'.format(self.ip)

        trial = 0
        while trial < self.NUM_SSH_TRIALS:
            time.sleep(5)
            header = 'Trying to ssh into {0} #{1} ...'.format(self.ip, trial + 1)
            if self.verbose:
                print header

            try:
                self.__run_remote_command(command=command, log_header=header)
                print "Machine with ip {0} is up!".format(self.ip)
                break
            except ShellCommandException:
                if self.verbose:
                    print 'SSH failed!'

            except:
                traceback.print_stack()
                break

            trial += 1


    def __reboot_machine(self):
        print '=================================================='
        print 'Rebooting Machine with ip {0}...'.format(self.ip)
        header = 'Trying to reboot {0}'.format(self.ip)

        command = 'sudo reboot'
        if self.verbose:
            print header

        try:
            self.__run_remote_command(command=command, log_header=header)
        except ShellCommandException:
            if self.verbose:
                print 'Reboot via SSH failed!'
        except:
            traceback.print_stack()

        self.__wait_until_successful_ssh()


    def __install_python_packages(self):
        header = 'Installing Python Packages...'
        print '=================================================='
        print header

        commands = []
        for package in self.python_packages:
            if package.has_key('version'):
                commands.append('sudo pip uninstall -y {0}'.format(package['name']))
                commands.append('sudo pip install {0}=={1}'.format(package['name'], package['version']))
            else:
                commands.append('sudo pip install {0}'.format(package['name']))

        command = ';'.join(commands)
        self.__run_remote_command(command=command, log_header=header)


    def __download_stochss_repo(self):
        header = 'Downloading StochSS...'
        print '=================================================='
        print header
        commands = ['rm -rf stochss',
                    'git clone --recursive {0}'.format(self.git_repo['url'])]

        if self.git_repo.has_key('branch'):
            print 'Switching to branch {0}...'.format(self.git_repo['branch'])
            commands.append('cd stochss')
            commands.append('git checkout {0}'.format(self.git_repo['branch']))

        command = ';'.join(commands)
        self.__run_remote_command(command=command, log_header=header)

    def __compile_stochss(self):
        header = 'Compiling StochSS...'
        print '=================================================='
        print header
        commands = ['cd stochss',
                    './run.ubuntu.sh --install']
        command = ';'.join(commands)
        self.__run_remote_command(command=command, log_header=header)

    def run_tests(self):
        # TODO: Add tests for the various job types
        pass

    def __cleanup_instance(self):
        header = 'Cleaning up crumbs...'
        print '=================================================='
        print header
        commands = ['sudo rm -f /etc/ssh/ssh_host_*',
                    'sudo rm -f ~/.ssh/authorized_keys',
                    'sudo rm -f ~/.bash_history']

        command = ';'.join(commands)
        self.__run_remote_command(command=command, log_header=header)


    def __check_dependency_installation(self):
        header = 'Checking dependencies...'
        print '=================================================='
        print header
        expected_dependency_list_string = ' '.join(self.dependencies)
        command = "dpkg-query -W -f='\${Package}\\n' " + expected_dependency_list_string

        tmp_log_files = {
            "stdout": tempfile.TemporaryFile(),
            "stderr": tempfile.TemporaryFile()
        }

        self.__run_remote_command(command=command, log_files=tmp_log_files, silent=True)
        tmp_log_files["stdout"].seek(0)

        dependency_list_string = tmp_log_files["stdout"].read().strip()

        tmp_log_files["stdout"].close()
        tmp_log_files["stderr"].close()

        if sorted(dependency_list_string.split('\n')) == sorted(self.dependencies):
            print 'All dependencies are installed!'
            return True

        else:
            print 'Some dependencies are missing ...'
            print 'List of installed dependencies: \n{0}\n'.format(dependency_list_string)
            return False

    def __check_fenics_installation(self):
        header = 'Checking FeniCS installation...'
        print '=================================================='
        print header

        try:
            self.__run_remote_command(command="python -c 'import dolfin' 2>/dev/null",
                                      log_header=header)
            print 'FeniCS installation successful!'

        except:
            print 'FeniCS installation failed!'


    def __check_python_packages_installation(self):
        header = 'Checking python packages installation...'
        print '=================================================='
        print header
        command = "pip freeze"

        tmp_log_files = {
            "stdout": tempfile.TemporaryFile(),
            "stderr": tempfile.TemporaryFile()
        }

        self.__run_remote_command(command=command, log_files=tmp_log_files, silent=True)
        tmp_log_files["stdout"].seek(0)

        installed_python_packages = {}
        packages = map(lambda x: x.split('=='), tmp_log_files["stdout"].read().split('\n'))
        for package in packages:
            installed_python_packages[package[0].lower()] = package[1] if len(package) == 2 else ""

        tmp_log_files["stdout"].close()
        tmp_log_files["stderr"].close()

        is_successful = True
        for package in self.python_packages:
            if package["name"].lower() not in installed_python_packages.keys():
                is_successful = False
                break
            if "version" in package.keys() and package["version"] != installed_python_packages[package["name"]]:
                is_successful = False
                break

        if is_successful:
            print 'All python packages are installed!'
            return True

        else:
            print 'Some python packages are missing ...'
            print 'List of installed python packages: \n{0}'.format(pprint.pformat(installed_python_packages))
            return False

    def __run_remote_command(self, command, log_header=None, log_files=None, silent=False, timeout=None):
        remote_cmd = get_remote_command(user=self.username, ip=self.ip, key_file=self.keyfile,
                                        command=command)
        if silent == False and self.verbose == True:
            print remote_cmd

        if log_files != None:
            if log_header != None:
                log_files["stdout"].write("LOG_HEADER: {0}\n".format(log_header))
                log_files["stderr"].write("LOG_HEADER: {0}\n".format(log_header))
                log_files["stdout"].flush()
                log_files["stderr"].flush()
            shell_cmd = ShellCommand(remote_cmd, stdout=log_files["stdout"], stderr=log_files["stderr"])

        elif self.log_type == "file":
            if log_header != None:
                self.stdout_log.write("LOG_HEADER: {0}\n".format(log_header))
                self.stderr_log.write("LOG_HEADER: {0}\n".format(log_header))
                self.stdout_log.flush()
                self.stderr_log.flush()
            shell_cmd = ShellCommand(remote_cmd, stdout=self.stdout_log, stderr=self.stderr_log)

        else:
            shell_cmd = ShellCommand(remote_cmd)

        shell_cmd.run(timeout=timeout, silent=silent)


class FlexVMMaker(object):
    def __init__(self, options):
        if 'machine_info' not in options:
            raise Exception('Machine info needed!')

        self.machine_info = options['machine_info']
        settings = options['settings']
        self.dependencies = settings['dependencies']
        self.python_packages = settings['python_packages']
        self.git_repo = settings['git_repo']

        self.verbose = options['verbose']

        print 'GIT REPO: {0}'.format(self.git_repo['url'])
        print 'BRANCH: {0}'.format(self.git_repo['branch'])

        if "log" in settings:
            self.log_type = settings["log"]["type"]
        else:
            self.log_type = "screen"

        if self.log_type == "file":
            stdout_log_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), settings["log"]["stdout"])
            print 'stdout_log_filename: {0}'.format(stdout_log_filename)
            self.stdout_log = open(stdout_log_filename, 'w')

            stderr_log_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), settings["log"]["stderr"])
            print 'stderr_log_filename: {0}'.format(stderr_log_filename)
            self.stderr_log = open(stderr_log_filename, 'w')

        else:
            self.stdout_log = None
            self.stderr_log = None

        self.overall_start_time = None


    def __cleanup(self):
        if self.log_type == "file":
            self.stdout_log.close()
            self.stderr_log.close()

    def run(self):
        self.overall_start_time = time.time()

        for machine in self.machine_info:
            ip = machine['ip']
            username = machine['username']
            keyfile = machine['keyfile']

            print '*' * 80
            print 'Running make_flex_vm for:'
            print 'ip: {0}'.format(ip)
            print 'username: {0}'.format(username)
            print 'keyfile: {0}'.format(keyfile)
            print '*' * 80

            if not os.path.exists(keyfile):
                print 'Keyfile: {0} does not exist! Skipping...'.format(keyfile)
                continue

            vm = VirtualMachine(ip=ip, keyfile=keyfile, username=username,
                                dependencies=self.dependencies, python_packages=self.python_packages,
                                git_repo=self.git_repo, log_type=self.log_type,
                                stdout_log=self.stdout_log, stderr_log=self.stderr_log, verbose=self.verbose)
            vm.make_flex_vm()

        self.__cleanup()
        print 'Completed all machines in {} seconds.'.format(time.time() - self.overall_start_time)


def cleanup_local_files():
    for file in glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), '*.log')):
        os.remove(file)
    for file in glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), '*.conf')):
        os.remove(file)


def get_arg_parser():
    parser = argparse.ArgumentParser(description="StochSS Flex Cloud VM Maker: \
                                                  Installs packages on the machines, preparing them to be used as Flex \
                                                  Cloud VMs. It takes 10-15 minutes per machine depending \
                                                  on network speed. Use <Ctrl+C> to kill running tool.")
    # parser.add_argument('-m', '--make', help='Make Flex cloud machines', action='store_true')
    parser.add_argument('-f', '--file', help="Machine Configuration File, \
                                              (Default: $STOCHSS/release_tools/flex-cloud/machines.json). \
                                              For more info, visit http://www.stochss.org/",
                        action="store", dest="machine_config_file")
    parser.add_argument('--machine', nargs=3, metavar=('IP', 'USERNAME', 'KEYFILE'),
                        help='Configuration for one machine, -f option cannot be used along with this option',
                        action='store', dest='machine')
    parser.add_argument('-c', '--cleanup', help="Cleanup Local files", action="store_true", default=False)
    parser.add_argument('-v', '--verbose', help="Verbose output", action="store_true")
    parser.add_argument('-s', '--settings', help="Settings File containing package details, git repo, branch, etc. \
                                              (Default: $STOCHSS/release_tools/flex-cloud/settings.json). \
                                              For more info, visit http://www.stochss.org/",
                        action="store", dest="settings_file",
                        default=DEFAULT_SETTINGS_FILE)
    parser.add_argument('-b', '--branch', help="StochSS Git branch name (overridden)", action="store",
                        dest="git_branch")
    return parser


def get_settings(settings_file):
    contents = None
    with open(settings_file) as fin:
        contents = fin.read()
    return json.loads(contents)


def get_flex_vm_maker_options(parsed_args):
    options = {}

    if parsed_args.machine != None and parsed_args.machine_config_file != None:
        raise Exception('Cannot use --machine and -f/--file at the same time!')

    if parsed_args.machine != None:
        if len(parsed_args.machine) != 3:
            raise Exception('Please pass all required arguments for --machine \
                                 option: --machine <ip> <username> <keyfile>')
        options['machine_info'] = [{'ip': parsed_args.machine[0],
                                    'username': parsed_args.machine[1],
                                    'keyfile': parsed_args.machine[2]}]
    else:
        if parsed_args.machine_config_file == None:
            parsed_args.machine_config_file = DEFAULT_MACHINE_CONFIG_FILE

        print 'Machine config file =', parsed_args.machine_config_file
        with open(parsed_args.machine_config_file) as fin:
            contents = fin.read()
        options['machine_info'] = json.loads(contents)

    options['settings'] = get_settings(settings_file=parsed_args.settings_file)
    options['verbose'] = False if parsed_args.verbose else parsed_args.verbose

    if parsed_args.git_branch != None:
        options['settings']["git_repo"]["branch"] = parsed_args.git_branch

    return options


if __name__ == '__main__':
    parser = get_arg_parser()
    parsed_args = parser.parse_args(sys.argv[1:])

    if parsed_args.cleanup:
        print 'Cleaning up local debris...'
        cleanup_local_files()
    else:
        options = get_flex_vm_maker_options(parsed_args)
        maker = FlexVMMaker(options)
        maker.run()
