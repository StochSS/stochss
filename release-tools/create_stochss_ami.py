#!/usr/bin/env python

__author__ = 'Dibyendu Nath'
__email__ = 'dev.nath.cs@gmail.com'

import sys
import os
import boto.ec2
import time
import uuid
import json
import threading
import subprocess

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

class AmiCreator:
  INVALID_INSTANCE_TYPES = ['t1.micro', 'm1.small', 'm1.medium', 'm3.medium']

  def __init__(self, options):
    self.uuid = uuid.uuid4()
    self.base_ami_id = options['base_ami_id']
    self.aws_region = options['aws_region']

    if options['instance_type'] in AmiCreator.INVALID_INSTANCE_TYPES:
      print 'Instance type "{0}" is not sufficient to create StochSS AMI! Exiting.'.format(options['instance_type'])
      sys.exit(1)

    self.instance_type = options['instance_type']

    self.dependencies = options['dependencies']
    self.python_packages = options['python_packages']
    self.git_repo = options['git_repo']

    print 'GIT REPO: {0}'.format(self.git_repo['url'])
    print 'BRANCH: {0}'.format(self.git_repo['branch'])

    self.ec2_connection = self.__create_ec2_connection()

    self.key_name = "test_stochss_kp_{0}".format(self.uuid)
    self.key_file = None
    self.security_groups = None
    self.instance_ip = None
    self.instance_id = None
    self.instance_user = options['instance_user']

    self.is_old_ami = True

  def run(self):
    self.__launch_instance()

    self.__update_instance()
    self.__install_dependecies()
    self.__update_fenics()
    self.__reboot_instance()
    self.__install_python_packages()
    self.__download_stochss_repo()
    self.__compile_stochss()

    if self.is_old_ami:
      self.__extra_steps_for_old_amis()

    self.run_tests()
    self.__cleanup_instance()
    self.make_image()
    self.__terminate_instance()

  def __create_ec2_connection(self):
    if os.environ.has_key('AWS_ACCESS_KEY_ID'):
      aws_access_key = os.environ['AWS_ACCESS_KEY_ID']
    else:
      aws_access_key = raw_input("Please enter your AWS access key: ")

    if os.environ.has_key('AWS_SECRET_ACCESS_KEY'):
      aws_secret_key = os.environ['AWS_SECRET_ACCESS_KEY']
    else:
      aws_secret_key = raw_input("Please enter your AWS secret key: ")

    return boto.ec2.connect_to_region(region_name=self.aws_region,
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

    new_security_group.authorize('tcp', 22,     22,     '0.0.0.0/0')
    new_security_group.authorize('tcp', 5672,   5672,   '0.0.0.0/0')
    new_security_group.authorize('tcp', 6379,   6379,   '0.0.0.0/0')
    new_security_group.authorize('tcp', 11211,  11211,  '0.0.0.0/0')
    new_security_group.authorize('tcp', 55672,  55672,  '0.0.0.0/0')

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
    print '===================='
    print 'Updating instance...'
    print '===================='
    command = ';'.join(['sudo apt-get update',
                        'sudo apt-get -y upgrade',
                        'sudo apt-get -y dist-upgrade'])
    self.__run_remote_command(command)

  def __install_dependecies(self):
    print '=========================='
    print 'Installing dependencies...'
    print '=========================='
    command = "sudo apt-get -y install {0}".format(' '.join(self.dependencies))
    self.__run_remote_command(command)

  def __update_fenics(self):
    print '=========================='
    print 'Updating FeniCS...'
    print '=========================='
    command = ';'.join(['sudo add-apt-repository -y ppa:fenics-packages/fenics',
                        'sudo apt-get -y update',
                        'sudo apt-get -y install fenics',
                        'sudo apt-get -y dist-upgrade'])
    self.__run_remote_command(command)

  def __wait_until_successful_ssh(self):
    # TODO: Find better method to see if an EC2 instance has rebooted and is running
    while (True):
      time.sleep(5)
      tmp_log_filename = 'tmp.log'
      if os.path.exists(tmp_log_filename):  os.remove(tmp_log_filename)

      with open(tmp_log_filename, 'w') as log:
        remote_cmd = get_remote_command(user=self.instance_user, ip=self.instance_ip, key_file=self.key_file,
                                        command="echo Instance {0} with ip {1} is up!".format(self.instance_id,
                                                                                              self.instance_ip))
        shell_cmd = ShellCommand(remote_cmd, stdout=log)
        shell_cmd.run(timeout=5, silent=True)

      with open(tmp_log_filename) as log:
        output = log.read().strip()

      if output == "Instance {0} with ip {1} is up!".format(self.instance_id, self.instance_ip):
        os.remove(tmp_log_filename)
        print output
        break

  def __reboot_instance(self):
    print '================================'
    print 'Rebooting Instance {0}...'.format(self.instance_id)
    print '================================'
    self.ec2_connection.reboot_instances(instance_ids=[self.instance_id])
    self.__wait_until_successful_ssh()


  def __install_python_packages(self):
    print '============================='
    print 'Installing Python Packages...'
    print '============================='

    commands = []
    for package in self.python_packages:
      if package.has_key('version'):
        commands.append('sudo pip uninstall -y {0}'.format(package['name']))
        commands.append('sudo pip install {0}=={1}'.format(package['name'], package['version']))
      else:
        commands.append('sudo pip install {0}'.format(package['name']))

    command = ';'.join(commands)
    self.__run_remote_command(command)


  def __download_stochss_repo(self):
    print '=========================='
    print 'Downloading StochSS...'
    print '=========================='
    commands = ['rm -rf stochss',
                'git clone --recursive {0}'.format(self.git_repo['url'])]

    if self.git_repo.has_key('branch'):
      commands.append('cd stochss')
      commands.append('git checkout {0}'.format(self.git_repo['branch']))

    command = ';'.join(commands)
    self.__run_remote_command(command)

  def __compile_stochss(self):
    print '===================='
    print 'Compiling StochSS...'
    print '===================='
    commands = ['cd stochss',
                "sed -i '\|launchapp|d' run.ubuntu.sh",
                './run.ubuntu.sh']
    command = ';'.join(commands)
    self.__run_remote_command(command)

  def __extra_steps_for_old_amis(self):
    print '========================'
    print 'Extra Steps for Old AMIs'
    print '========================'
    commands = ['ln -s stochss/ode ode',
                'ln -s stochss/StochKit StochKit',
                'ln -s stochss/stochoptim stochoptim',
                'ln -s stochss/pyurdme/pyurdme_wrapper.py pyurdme_wrapper.py',
                'ln -s stochss/app/lib/pyurdme-stochss pyurdme',
                'ln -s stochss/app/backend/sccpy.py sccpy.py',
                'ln -s stochss/app/backend/tasks.py tasks.py',
                "sed -i.bak $'s/import pyurdme/import sys\\\\\\nsys.path.append(\\'\/home\/ubuntu\/pyurdme\\')\\\\\\nsys.path.append(\\'\/home\/ubuntu\/stochss\/app\\')\\\\\\nimport pyurdme/g' pyurdme_wrapper.py" ]

    command = ';'.join(commands)
    self.__run_remote_command(command)

  def run_tests(self):
    # TODO: Add tests for the various job types
    pass

  def __cleanup_instance(self):
    print '====================='
    print 'Cleaning up crumbs...'
    print '====================='
    commands = ['sudo rm -f /etc/ssh/ssh_host_*',
                'sudo rm -f ~/.ssh/authorized_keys',
                'sudo rm -f ~/.bash_history']

    command = ';'.join(commands)
    self.__run_remote_command(command)

  def make_image(self):
    print '============='
    print 'Making AMI...'
    print '============='
    date_string = time.strftime("%y%b%d-%H%M%S")
    new_ami_name = "StochSS-Server-" + date_string

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
    print '================================'
    print 'Terminating launched instance...'
    print '================================'
    self.ec2_connection.terminate_instances(instance_ids=[self.instance_id])
    print 'Done.'

  def __run_remote_command(self, command):
    remote_cmd = get_remote_command(user=self.instance_user, ip=self.instance_ip, key_file=self.key_file,
                                    command=command)
    shell_cmd = ShellCommand(remote_cmd)
    shell_cmd.run()

if __name__ == '__main__':
  ami_config_file_path = os.path.join(os.path.dirname(__file__), 'stochss_ami_config.json')
  with open(ami_config_file_path) as fin:
    contents = fin.read()

  options = json.loads(contents)
  AmiCreator(options).run()
