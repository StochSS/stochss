#!/usr/bin/env python

__author__ = 'Dibyendu Nath'
__email__ = 'dnath@cs.ucsb.edu'

import sys
import os
import boto.ec2
import time
import uuid
import json
import threading
import subprocess
import tempfile
import traceback
import pprint
import argparse
import glob


def get_remote_command(user, ip, key_file, command):
    return 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {0} {1}@{2} "{3}"'.format(key_file, user,
                                                                                                         ip, command)


class ShellCommand(object):
    def __init__(self, cmd, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr, verbose=False):
        self.cmd = cmd
        self.stdin = stdin
        self.stdout = stdout
        self.stderr = stderr
        self.process = None
        self.verbose = verbose

    def run(self, timeout=None, silent=False):
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
                if silent is False:  print 'Terminating process...'
                self.process.terminate()
                thread.join()
                if silent is False:  print 'Process return code =', self.process.returncode
        else:
            thread.join()


class AmiManager:
    INVALID_INSTANCE_TYPES = ['t1.micro', 'm1.small', 'm1.medium', 'm3.medium']
    NUM_TRIALS = 3

    def __init__(self, options):
        self.uuid = uuid.uuid4()
        self.base_ami_id = options['base_ami_id']
        self.aws_region = options['aws_region']

        if options['instance_type'] in AmiManager.INVALID_INSTANCE_TYPES:
            print 'Instance type "{0}" is not sufficient to create StochSS AMI! Exiting.'.format(
                options['instance_type'])
            sys.exit(1)

        self.instance_type = options['instance_type']

        self.dependencies = options['dependencies']
        self.python_packages = options['python_packages']
        self.git_repo = options['git_repo']

        print 'GIT REPO: {0}'.format(self.git_repo['url'])
        print 'BRANCH: {0}'.format(self.git_repo['branch'])

        self.ec2_connection = self.create_ec2_connection(aws_region=self.aws_region)

        self.key_name = "test_stochss_kp_{0}".format(self.uuid)
        self.key_file = None
        self.security_groups = None
        self.instance_ip = None
        self.instance_id = None
        self.instance_user = options['instance_user']

        if "log" in options.keys():
            self.log_type = options["log"]["type"]
        else:
            self.log_type = "screen"

        if self.log_type == "file":
            stdout_log_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), options["log"]["stdout"])
            print 'stdout_log_filename: {0}'.format(stdout_log_filename)
            self.stdout_log = open(stdout_log_filename, 'w')

            stderr_log_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), options["log"]["stderr"])
            print 'stderr_log_filename: {0}'.format(stderr_log_filename)
            self.stderr_log = open(stderr_log_filename, 'w')

        self.is_old_ami = True
        self.verbose = options["verbose"] if "verbose" in options.keys() else False

    def run(self):
        try:
            self.__launch_instance()

            tries = self.NUM_TRIALS
            while True:
                print "====================[Trial #{0}]======================".format(self.NUM_TRIALS - tries + 1)
                self.__update_instance()
                self.__install_dependencies()
                is_successful = self.__check_dependency_installation()

                if is_successful:
                    print "Trial #{0} of linux dependency installation successful!".format(self.NUM_TRIALS - tries + 1)
                    break
                else:
                    if tries == 0:
                        raise Exception("Dependency Installation failed after {0} tries!".format(self.NUM_TRIALS))

                tries -= 1

            self.__update_fenics()
            self.__check_fenics_installation()

            self.__reboot_instance()

            self.__update_fenics()
            self.__check_fenics_installation()

            tries = self.NUM_TRIALS
            while True:
                print "====================[Trial #{0}]======================".format(self.NUM_TRIALS - tries + 1)
                self.__install_python_packages()
                is_successful = self.__check_python_packages_installation()

                if is_successful:
                    print "Trial #{0} of python package installation successful!".format(self.NUM_TRIALS - tries + 1)
                    break
                else:
                    if tries == 0:
                        raise Exception("Python Package Installation failed after {0} tries!".format(self.NUM_TRIALS))

                tries -= 1

            self.__download_stochss_repo()
            self.__compile_stochss()

            if self.is_old_ami:
                self.__extra_steps_for_old_amis()

            self.run_tests()
            self.__cleanup_instance()

            self.make_image()

        except:
            traceback.print_exc()

        finally:
            self.__terminate_instance()
            self.__cleanup()

    @staticmethod
    def create_ec2_connection(aws_region):
        if os.environ.has_key('AWS_ACCESS_KEY_ID'):
            aws_access_key = os.environ['AWS_ACCESS_KEY_ID']
        else:
            aws_access_key = raw_input("Please enter your AWS access key: ")

        if os.environ.has_key('AWS_SECRET_ACCESS_KEY'):
            aws_secret_key = os.environ['AWS_SECRET_ACCESS_KEY']
        else:
            aws_secret_key = raw_input("Please enter your AWS secret key: ")

        return boto.ec2.connect_to_region(region_name=aws_region,
                                          aws_access_key_id=aws_access_key,
                                          aws_secret_access_key=aws_secret_key)

    def __launch_instance(self):
        key_pair = self.ec2_connection.create_key_pair(self.key_name)

        current_dir = os.path.dirname(os.path.abspath(__file__))
        key_pair.save(current_dir)

        self.key_file = os.path.join(current_dir, "{0}.pem".format(self.key_name))

        if os.path.exists(self.key_file):
            print 'Downloaded key file: ', self.key_file
        else:
            print "Key file: {0} doesn't exist! Exiting.".format(self.key_file)
            sys.exit(1)

        security_group_name = "test_stochss_sg_{0}".format(self.uuid)
        new_security_group = self.ec2_connection.create_security_group(name=security_group_name,
                                                                       description='StochSS AMI Creation')

        new_security_group.authorize('tcp', 22, 22, '0.0.0.0/0')
        new_security_group.authorize('tcp', 5672, 5672, '0.0.0.0/0')
        new_security_group.authorize('tcp', 6379, 6379, '0.0.0.0/0')
        new_security_group.authorize('tcp', 11211, 11211, '0.0.0.0/0')
        new_security_group.authorize('tcp', 55672, 55672, '0.0.0.0/0')

        print "Security group {0} successfully created with appropriate permissions.".format(new_security_group.name)

        self.security_groups = [new_security_group.name]

        print 'Trying to launch instance... [this might take a while]'
        reservation = self.ec2_connection.run_instances(image_id=self.base_ami_id,
                                                        key_name=self.key_name,
                                                        instance_type=self.instance_type,
                                                        security_groups=self.security_groups)

        instance = reservation.instances[0]

        while instance.update() != "running":
            time.sleep(5)

        self.instance_ip = instance.ip_address
        self.instance_id = instance.id

        self.__wait_until_successful_ssh()

        print 'Instance successfully running - ip: {0}, id: {1}, base_ami_id = {2}'.format(self.instance_ip,
                                                                                           self.instance_id,
                                                                                           self.base_ami_id)

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
        while (True):
            time.sleep(5)
            tmp_log_stdout_file = tempfile.TemporaryFile()
            tmp_log_stderr_file = tempfile.TemporaryFile()

            remote_cmd = get_remote_command(user=self.instance_user, ip=self.instance_ip, key_file=self.key_file,
                                            command="echo Instance {0} with ip {1} is up!".format(self.instance_id,
                                                                                                  self.instance_ip))
            shell_cmd = ShellCommand(remote_cmd, stdout=tmp_log_stdout_file, stderr=tmp_log_stderr_file)
            shell_cmd.run(timeout=5, silent=True)

            if self.verbose:
                tmp_log_stderr_file.seek(0)
                print >> 2, tmp_log_stderr_file.read()

            tmp_log_stderr_file.close()

            tmp_log_stdout_file.seek(0)
            output = tmp_log_stdout_file.read().strip()
            tmp_log_stdout_file.close()

            if output == "Instance {0} with ip {1} is up!".format(self.instance_id, self.instance_ip):
                print output
                break

    def __reboot_instance(self):
        print '=================================================='
        print 'Rebooting Instance {0}...'.format(self.instance_id)
        self.ec2_connection.reboot_instances(instance_ids=[self.instance_id])
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
            commands.append('cd stochss')
            commands.append('git checkout {0}'.format(self.git_repo['branch']))

        command = ';'.join(commands)
        self.__run_remote_command(command=command, log_header=header)

    def __compile_stochss(self):
        header = 'Compiling StochSS...'
        print '=================================================='
        print header
        commands = ['cd stochss',
                    "sed -i '\|launchapp|d' run.ubuntu.sh",
                    './run.ubuntu.sh']
        command = ';'.join(commands)
        self.__run_remote_command(command=command, log_header=header)

    def __extra_steps_for_old_amis(self):
        header = 'Extra Steps for Old AMIs'
        print '=================================================='
        print header
        commands = ['ln -s stochss/ode ode',
                    'ln -s stochss/StochKit StochKit',
                    'ln -s stochss/stochoptim stochoptim',
                    'ln -s stochss/pyurdme/pyurdme_wrapper.py pyurdme_wrapper.py',
                    'ln -s stochss/app/lib/pyurdme-stochss pyurdme',
                    'ln -s stochss/app/backend/sccpy.py sccpy.py',
                    'ln -s stochss/app/backend/tasks.py tasks.py',
                    "sed -i.bak $'s/import pyurdme/import sys\\\\\\nsys.path.append(\\'\/home\/ubuntu\/pyurdme\\')\\\\\\nsys.path.append(\\'\/home\/ubuntu\/stochss\/app\\')\\\\\\nimport pyurdme/g' pyurdme_wrapper.py"]

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

    def make_image(self):
        print '=================================================='
        print 'Making AMI...'
        date_string = time.strftime("%Y%b%d-%H%M%S")
        new_ami_name = "StochSS-Node-{0}".format(date_string)

        print "Creating AMI '{0}' from instance {1}...".format(new_ami_name, self.instance_id)
        new_ami_id = self.ec2_connection.create_image(self.instance_id, new_ami_name)

        print "New AMI pending..."
        new_ami = self.ec2_connection.get_image(new_ami_id)

        while new_ami.state != 'available':
            time.sleep(5)
            new_ami.update()

        print "New AMI ID: " + new_ami_id
        print "Making the new AMI Public..."
        self.ec2_connection.modify_image_attribute(new_ami_id,
                                                   attribute='launchPermission',
                                                   operation='add',
                                                   groups='all')


    def __terminate_instance(self):
        print '=================================================='
        print 'Terminating launched instance...'
        self.ec2_connection.terminate_instances(instance_ids=[self.instance_id])
        print 'Done.'

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
        # TODO: check FeniCS installation
        pass

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

    def __run_remote_command(self, command, log_header=None, log_files=None, silent=False):
        remote_cmd = get_remote_command(user=self.instance_user, ip=self.instance_ip, key_file=self.key_file,
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

        shell_cmd.run()

    def __cleanup(self):
        if self.log_type == "file":
            self.stdout_log.close()
            self.stderr_log.close()

        os.remove(self.key_file)


def cleanup_local_files():
    for file in glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), '*.log')):
        os.remove(file)
    for file in glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_stochss_kp_*.pem')):
        os.remove(file)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--settings', help="Configuration Settings File (stochss_ami_config.json by default)",
                        action="store", dest="config_file",
                        default=os.path.join(os.path.dirname(__file__), "stochss_ami_config.json"))
    parser.add_argument('-c', '--cleanup', help="Cleanup Local files", action="store_true", default=False)
    parser.add_argument('-v', '--verbose', help="Verbose output", action="store_true")
    parser.add_argument('-d', '--delete', help="Delete existing AMI with associated snapshot", action="store",
                        dest="ami_id")
    parser.add_argument('-b', '--branch', help="StochSS Git branch name (overridden)", action="store",
                        dest="git_branch")

    args = parser.parse_args(sys.argv[1:])

    if args.cleanup:
        print 'Cleaning up local debris...'
        cleanup_local_files()

    elif args.ami_id != None:
        print 'Deleting AMI {0}...'.format(args.ami_id)
        ec2_conn = AmiManager.create_ec2_connection(aws_region='us-east-1')
        ec2_conn.deregister_image(args.ami_id, delete_snapshot=True)

    else:
        print 'config file =', args.config_file
        with open(args.config_file) as fin:
            contents = fin.read()

        options = json.loads(contents)

        if args.git_branch != None:
            options["git_repo"]["branch"] = args.git_branch

        if args.verbose != None:
            options['verbose'] = args.verbose

        AmiManager(options).run()

