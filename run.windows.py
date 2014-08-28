#! /usr/bin/python

import os, stat, time, sys, uuid
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/lib/boto'))
import boto.ec2, boto.ec2.cloudwatch
from boto.ec2.cloudwatch import MetricAlarm
import webbrowser
import urllib2

class ConfigFile:
    '''
    '''
    # The recognized variables in the config file
    CF_ACCESS_KEY = 'aws_access_key'
    CF_SECRET_KEY = 'aws_secret_key'
    CF_INSTANCE_ID = 'ec2_instance_id'
    CF_KEY_PAIR = 'ec2_key_pair'
    CF_REGION = 'ec2_region'
    
    def __init__(self, config_file_name):
        self.config_file_name = config_file_name
        
    def create(self):
        '''
        Single method to encapsulate creating config file. This will wipe the entire config file 
        if it currently exists.
        '''
        config_file = open(self.config_file_name, "w")
        config_file.close()
        # chmod 600
        os.chmod(self.config_file_name, stat.S_IRUSR | stat.S_IWUSR)

    def read(self, variables):
        '''
        Variables is a list of strings where the strings are the names of the
        variables to look for in the config file.
        Return value is a dictionary where the keys are the names used in the variables list
        and the values are the ones read from the config file. (None if its not in the config file)
        '''
        try:
            temp_variables = list(variables)
            config_file = open(self.config_file_name, "r")
            result = {}
            for line in config_file:
                # Config file entries should be in the form name=value, one per line
                line_segments = line.split('=')
                config_var = line_segments[0].lower()
                if config_var in variables:
                    result[config_var] = line_segments[1].strip()
                    temp_variables.remove(config_var)
            for variable in temp_variables:
                # Only variables left are those that werent found
                result[variable] = None
            config_file.close()
            return result
        except IOError:
            # If we get this error, then the config file doesnt exist
            self.create()
            result = {}
            for variable in variables:
                result[variable] = None

            return result

    def write(self, params):
        """ Write each param in params to the config file, making sure to overwrite existing entries """
        try:
            config_file = open(self.config_file_name, "r")
            lines = config_file.readlines()
            config_file.close()
            config_file = open(self.config_file_name, "w")
            for line in lines:
                found = False
                for key in params:
                    if key.lower() in line.lower():
                        found = True
                        break
                if not found:
                    config_file.write(line)
        except IOError:
            self.create_config_file()
            config_file = open(self.config_file_name, "a")
        # Now we should have a config file open to write into, without fear of duplicates
        for key in params:
            config_file.write("%s=%s\n" % (key,params[key]))
        config_file.close()
    
    def remove(self, params):
        '''
        Remove each config variable that is specified in the 'params' list
        '''
        try:
            config_file = open(self.config_file_name, "r")
            lines = []
            for line in config_file:
                current_variable_name = line.lower().split('=')[0]
                if current_variable_name in params:
                    # We want to delete this line
                    continue
                else:
                    lines += [line]
            config_file.close()
            config_file = open(self.config_file_name, "w")
            for line in lines:
                config_file.write(line)
        except IOError:
            self.create_config_file()
        
class EC2Services:
    # Name of default key pair used when one isn't given. The AWS region
    # where the key is registered will be appended to this prefix.
    default_key_pair_prefix = 'server-stochss-key-pair'
    # Current regions with a StochSS Server machine image
    supported_ec2_regions = { }
    ami_id_file = open("release-tools/ami_ids","r")
    for line in ami_id_file:
        line_data = line.split('=')
        aws_region = line_data[0].strip()
        aws_ami_id = line_data[1].strip()
        supported_ec2_regions[aws_region] = aws_ami_id
    
    def __init__(self, region, aws_access_key, aws_secret_key):
        self.access_key = aws_access_key
        self.secret_key = aws_secret_key
        self.region = region
        print "======================"
        print "Connecting to EC2..."
        print "======================"
        self.conn = boto.ec2.connect_to_region(
            self.region,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key
        )
    
    def generate_keypair(self, keypair_name, key_dir=os.path.dirname(__file__)):
        key = self.conn.create_key_pair(keypair_name)
        key_dir = os.path.abspath(key_dir)
        if not os.path.isdir(key_dir):
            os.mkdir(key_dir, 0700)
        key.save(key_dir)
    
    def find_or_create_security_group(self):
        print "Checking security groups..."
        security_group = None
        for sg in self.conn.get_all_security_groups():
            if sg.name == 'stochss':
                print "StochSS security group found, using that."
                security_group = sg
                # Make sure it has SSH and HTTPS ports open
                found_ssh = False
                found_https = False
                for rule in security_group.rules:
                    if rule.ip_protocol == 'tcp' and rule.from_port == '22':
                        found_ssh = True
                    elif rule.ip_protocol == 'tcp' and rule.from_port == '443':
                        found_https = True
                # If not, then add them
                if not found_ssh:
                    security_group.authorize('tcp', 22, 22, '0.0.0.0/0')
                if not found_https:
                    security_group.authorize('tcp', 443, 443, '0.0.0.0/0')
                break
        if security_group is None:
            print "No StochSS security group found, creating one."
            security_group = self.conn.create_security_group('stochss', 'StochSS Security Group')
            security_group.authorize('tcp', 443, 443, '0.0.0.0/0')
            security_group.authorize('tcp', 22, 22, '0.0.0.0/0')
        return security_group
    
    def make_instance_sleepy(self, instance_id):
        print "Setting alarm to stop instance after 4 hours of idle cpu."
        ec2 = boto.ec2.cloudwatch.connect_to_region(self.region, aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key)
        stop_arn = 'arn:aws:automate:{0}:ec2:stop'.format(self.region)
        alarm_name = 'ec2_shutdown_sleepy_{0}'.format(instance_id)
        # define our alarm to stop the instance if it gets sleepy
        # i.e. if CPU utilization is less than 10% for 1 x 4 hr intervals
        sleepy_alarm = MetricAlarm(
            name=alarm_name, namespace='AWS/EC2',
            metric='CPUUtilization', statistic='Average',
            comparison='<', threshold='10',
            period='3600', evaluation_periods=4,
            alarm_actions=[stop_arn],
            dimensions={'InstanceId':instance_id})
        ec2.create_alarm(sleepy_alarm)
    
    def retrieve_ec2_instance(self, instance_id):
        try:
            instance_reservations = self.conn.get_all_instances([instance_id])
            if len(instance_reservations) == 0:
                print "Unrecognized instance ID. Are you sure you entered it in correctly?"
                exit(-1)
            return instance_reservations[0].instances[0]
        except boto.exception.EC2ResponseError:
            print "Invalid instance ID. Are you sure you entered it in correctly?"
            exit(-1)
    
    def retrieve_all_ec2_instances(self, server_only=True, ec2connection_to_use=None):
        '''
        Retrieve all of the EC2 instances associated with the StochSS Server AMI for this region.
        If server_only is True, only the EC2 instances which were started with a StochSS Server AMI
         will be retrieved.
        If ec2connection_to_use is not None, then it will be used to retrieve the instances.
        '''
        instances = []
        instance_reservations = ec2connection_to_use.get_all_instances() if ec2connection_to_use is not None else self.conn.get_all_instances()
        for instance_reservation in instance_reservations:
            for instance in instance_reservation.instances:
                if instance.state != "terminated":
                    if server_only and instance.image_id == EC2Services.supported_ec2_regions[self.region]:
                        instances += [instance]
                    elif not server_only:
                        instances += [instance]
        return instances
    
    def create_default_key_pair(self, key_pair, location):
        '''
        Attempts to create an AWS key pair using the default naming scheme enforced:
         default_key_pair_prefix-aws_region
        If the key_pair already exists, then we first look for a suitable key pair in the
         directory specified by the location parameter. If one is not found, we append a
         UUID onto the default name until we successfully create a valid key pair.
        Returns the name of the key pair that should be used.
        '''
        try:
            ec2_key = self.conn.create_key_pair(key_pair)
            ec2_key.save(location)
        except boto.exception.EC2ResponseError as e:
            # Check to see if the exception is just due to fact that key already exists
            if "'{0}' already exists.".format(key_pair) in e.body:
                # Then the default key exists, but its not on this computer...
                # Lets first check to see if there are any keys we can use in the current dir
                available_keys = [filename for filename in os.listdir(location) if filename.startswith(self.default_key_pair_prefix) and self.region in filename]
                if len(available_keys) > 0:
                    key_pair = available_keys[0].strip('.pem')
                else:
                    # Create a new one with a UUID appended to it
                    while True:
                        try:
                            new_key_pair = '{0}-{1}'.format(key_pair, uuid.uuid4())
                            ec2_key = self.conn.create_key_pair(new_key_pair)
                            ec2_key.save(location)
                        except boto.exception.EC2ResponseError as e:
                            # We only want to retry if the exception was because the key already exists
                            if "'{0}' already exists.".format(new_key_pair) in e.body:
                                continue
                            else:
                                raise e
                        # No exceptions so we created a valid key pair
                        key_pair = new_key_pair
                        break
            else:
                # Then this failed for a different reason...
                raise e
        return key_pair
    
    def get_key_pair_name_for_ec2_instance(self, instance_id):
        '''
        Returns the name of the key pair used to launch the EC2 instance specified by instance_id.
        '''
        instance = self.retrieve_ec2_instance(instance_id)
        return instance.key_name
    
    def launch_ec2_instance(self, instance_id, key_pair=None, keyfile=None):
        '''
        Launches an EC2 instance. If instance_id is a blank string then it launches a new instance using
         the appropriate AMI ID, otherwise it launches the instance specified by the given instance_id.
        Returns the instance object representing the instance that was launched.
        '''
        if instance_id is "":
            security_group = self.find_or_create_security_group()
            if key_pair is None:
                # Then use a default key
                key_pair = '{0}-{1}'.format(self.default_key_pair_prefix, self.region)
                # Store it in current directory
                current_dir = os.path.dirname(os.path.abspath(__file__))
                keyfile = '{0}/{1}.pem'.format(current_dir, key_pair)
                if os.path.exists(keyfile):
                    print "Using keyfile {0}".format(keyfile)
                else:
                    try:
                        # If it doesnt exist, then create it
                        key_pair = self.create_default_key_pair(key_pair, current_dir)
                        keyfile = '{0}/{1}.pem'.format(current_dir, key_pair)
                        print "Created keyfile {0}".format(keyfile)
                    except boto.exception.EC2ResponseError as e:
                        print "Failed to launch EC2 instance with exception: " + str(e)
                        exit(-1)
            print "Launching new EC2 instance now. This may take a moment..."
            try:
                reservation = self.conn.run_instances(
                    EC2Services.supported_ec2_regions[self.region],
                    key_name=key_pair,
                    instance_type='m1.small',
                    security_groups=[security_group]
                )
            except boto.exception.EC2ResponseError as e:
                print "Failed to launch EC2 instance with exception: " + str(e)
                exit(-1)
            instance = reservation.instances[0]
        else:
            print "Launching EC2 instance from instance ID '{0}'. This may take a moment...".format(instance_id)
            try:
                instance = self.retrieve_ec2_instance(instance_id)
            except boto.exception.EC2ResponseError:
                print "Invalid instance ID. Are you sure you entered it in correctly?"
                exit(-1)
            instance.start()
        # Make sure its actually running before we return
        instance.update()
        while instance.state != 'running':
            time.sleep(5)
            instance.update()
            print "Instance '{0}' has state '{1}'".format(instance.id, instance.state)
        # Dont forget to add the alarm
        self.make_instance_sleepy(instance.id)
        # Start StochSS on the instance
        self.start_stochss_via_ssh(keyfile, instance.public_dns_name)
        # We are done
        return instance
        
    def wait_for_ssh_connection(self, keyfile, ip):
        SSH_RETRY_COUNT = 30
        SSH_RETRY_WAIT = 3
        for _ in range(0, SSH_RETRY_COUNT):
            cmd = "ssh -o 'StrictHostKeyChecking no' -i {0} ubuntu@{1} \"pwd\"".format(keyfile, ip)
            #print cmd
            success = os.system(cmd)
            if success == 0:
                print "Connected to '{0}'".format(ip)
                return True
            else:
                print "'{0}' not available yet, sleeping {1}s".format(ip, SSH_RETRY_WAIT)
                time.sleep(SSH_RETRY_WAIT)
        raise Exception("Timeout waiting to connect to node via SSH")

    def start_stochss_via_ssh(self, keyfile, ip):
        python_path = "export PYTHONPATH=/home/ubuntu/stochss/app/lib/pyurdme-stochss/:/home/ubuntu/stochss/app/;"
        start_celery_str = "cd /home/ubuntu/stochss;./run.ubuntu.sh"
        # PyURDME must be run inside a 'screen' terminal as part of the FEniCS code depends on the ability to write to the process' terminal, screen provides this terminal.
        startcmd = "screen -d -m bash -c '{1}{0}'\n".format(start_celery_str,python_path)
        
        print "Attempting to start StochSS on '{0}'".format(ip)
        if not os.path.exists(keyfile):
            raise Exception("ssh keyfile file not found: {0}".format(keyfile))
        self.wait_for_ssh_connection(keyfile, ip)
        cmd = "ssh -o 'StrictHostKeyChecking no' -i {0} ubuntu@{1} \"{2}\"".format(keyfile, ip, startcmd)
        #print cmd
        success = os.system(cmd)
        if success == 0:
            print "StochSS started on {0}".format(ip)
        else:
            raise Exception("Failure to start StochSS on {0}".format(ip))
 
    def stop_ec2_instance(self, instance_id):
        instance = self.retrieve_ec2_instance(instance_id)
        print "Stopping EC2 instance. This will take a minute..."
        instance.stop()
        instance.update()
        while instance.state != 'stopped':
            time.sleep(5)
            instance.update()
        print "EC2 instance stopped!"
    
    def terminate_ec2_instance(self, instance_id):
        instance = self.retrieve_ec2_instance(instance_id)
        print "Terminating EC2 instance. This will take a minute..."
        instance.terminate()
        instance.update()
        while instance.state != 'terminated':
            time.sleep(5)
            instance.update()
        print "EC2 instance terminated!"
    
    def terminate_ec2_compute_nodes(self, key_prefix="stochss"):
        '''
        This will terminate all of the EC2 instances that were started with key pairs with a
         prefix of key_prefix. This method is intended to be used to terminate all EC2 compute
         nodes when a StochSS server is shut down or terminated.
        '''
        # Compute nodes are only launched in us-east-1...
        if self.region != 'us-east-1':
            conn = boto.ec2.connect_to_region(
                'us-east-1',
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key
            )
        else:
            conn = self.conn
        instances = [instance for instance in self.retrieve_all_ec2_instances(server_only=False, ec2connection_to_use=conn) if instance.key_name.startswith(key_prefix)]
        total = len(instances)
        if total > 0:
            print "Terminating {0} compute node(s)...".format(total)
            for instance in instances:
                instance.terminate()
                instance.update()
                while instance.state != 'terminated':
                    time.sleep(5)
                    instance.update()
                total -= 1
                print "{0} compute nodes left to terminate...".format(total)

def print_usage_and_exit():
    print "Error in command line arguments!"
    print "Expected Usage: ./run.windows.py [command]"
    print "Accepted Commands:"
    print "- start (creates a new StochSS instance)"
    print "- stop (saves StochSS data, turns off computers, can be resumed with 'start')"
    print "- terminate (deletes StochSS data, turns off computers)"
    #print "- list (list all running StochSS instances in current region)"
    exit(-1)

def start_stochss_server(aws_access_key, aws_secret_key, preferred_instance_id, preferred_ec2_key_pair, ec2_region):
    '''
    Start the EC2 node that will host the StochSS server using the given parameters.
    '''
    # Check for AWS credentials in config file if needed
    if None in [aws_access_key, aws_secret_key]:
        variables_to_look_for = [ConfigFile.CF_ACCESS_KEY, ConfigFile.CF_SECRET_KEY]
        results = config_file.read(variables_to_look_for)
        aws_access_key, aws_secret_key = [results[name] for name in variables_to_look_for]
    # Check for the rest of the config variables in the config file
    variables_to_look_for = [ConfigFile.CF_INSTANCE_ID, ConfigFile.CF_KEY_PAIR, ConfigFile.CF_REGION]
    results = config_file.read(variables_to_look_for)
    preferred_instance_id, preferred_ec2_key_pair, ec2_region = [results[name] for name in variables_to_look_for]
    # Any variables that are still None might need to be retrieved from the user
    # We definitely need the AWS credentials
    if None in [aws_access_key, aws_secret_key]:
        aws_access_key = raw_input("Please enter your AWS access key: ")
        aws_secret_key = raw_input("Please enter your AWS secret key: ")
        params_to_write = {
            ConfigFile.CF_ACCESS_KEY: aws_access_key,
            ConfigFile.CF_SECRET_KEY: aws_secret_key
        }
        config_file.write(params_to_write)
    else:
        print "Using default AWS credentials..."
    # We also definitely need the region
    supported_regions = EC2Services.supported_ec2_regions.keys()
    if ec2_region is None:
        ec2_region = raw_input("Please enter the AWS region where you want to launch StochSS {0}: ".format(supported_regions)).lower()
        if ec2_region not in supported_regions:
            print "{0} is not supported. Only supported regions are: {1}.".format(ec2_region, supported_regions)
            exit(-1)
        params_to_write = {
            ConfigFile.CF_REGION: ec2_region
        }
        config_file.write(params_to_write)
    else:
        new_ec2_region = raw_input("Enter the AWS region where you want to launch StochSS or hit return to use {0}: ".format(ec2_region)).lower()
        if new_ec2_region != '':
            # Make sure it's supported
            if new_ec2_region not in supported_regions:
                print "{0} is not supported. Only supported regions are: {1}.".format(new_ec2_region, supported_regions)
                exit(-1)
            # If it actually is a new region then...
            if new_ec2_region != ec2_region:
                # ...we need to make sure we invalidate the saved key-pair and instance ID
                preferred_instance_id = None
                preferred_ec2_key_pair = None
                # Update config file
                config_file.remove([ConfigFile.CF_KEY_PAIR, ConfigFile.CF_INSTANCE_ID])
                ec2_region = new_ec2_region
                params_to_write = {
                    ConfigFile.CF_REGION: ec2_region
                }
                config_file.write(params_to_write)
    # Now we have the region and AWS credentials...
    ec2_services = EC2Services(ec2_region, aws_access_key, aws_secret_key)
    # path_to_key_pair should only be None if we are using the default key
    path_to_key_pair = None
    # We might need an instance id...
    # This logic is short-circuited now
    if preferred_instance_id is None:
        preferred_instance_id = raw_input("Please enter the instance ID of the EC2 instance you wish to launch (just hit return to launch a brand new instance): ")
        if preferred_instance_id == '':
            # ...unless they want a brand new instance. Then we might need a keypair...
            decision = raw_input("Do you optionally want to use a key pair when creating this instance (y/N/?)? ").lower()
            while decision == '?':
                print "In order to gain command line access to an EC2 instance, you need to use a valid AWS SSH key pair when launching the instance."
                print "If you choose not to specify your own key pair, a default key pair will be created and used automatically."
                decision = raw_input("Do you optionally want to use a key pair when creating this instance (y/N/?)? ").lower()
            if decision == 'y':
                if preferred_ec2_key_pair is None:
                    preferred_ec2_key_pair = raw_input('Please enter the name of a valid AWS EC2 key pair you wish to use or hit return to cancel: ')
                    if preferred_ec2_key_pair == '':
                        preferred_ec2_key_pair = None
                    else:
                        params_to_write = {
                            ConfigFile.CF_KEY_PAIR: preferred_ec2_key_pair
                        }
                        config_file.write(params_to_write)
                else:
                    new_ec2_key_pair = raw_input('Enter the name of a valid AWS EC2 key pair or hit return to use {0}: '.format(preferred_ec2_key_pair))
                    if new_ec2_key_pair != '':
                        preferred_ec2_key_pair = new_ec2_key_pair
                        params_to_write = {
                            ConfigFile.CF_KEY_PAIR: preferred_ec2_key_pair
                        }
                        config_file.write(params_to_write)
            else:
                # ...unless they dont want SSH access.
                preferred_ec2_key_pair = None
        else:
            # Ok they want a specific instance...what is the key pair to use?
            preferred_ec2_key_pair = ec2_services.get_key_pair_name_for_ec2_instance(preferred_instance_id)
            params_to_write = {
                ConfigFile.CF_INSTANCE_ID: preferred_instance_id
            }
            config_file.write(params_to_write)
    else:
        new_instance_id = raw_input("Enter an AWS EC2 instance ID that you wish to launch, 'None' to create a new instance, or hit return to use {0}: ".format(preferred_instance_id))
        if new_instance_id == "None":
            preferred_instance_id = ''
            preferred_ec2_key_pair = None
        elif new_instance_id != '':
            preferred_instance_id = new_instance_id
            preferred_ec2_key_pair = ec2_services.get_key_pair_name_for_ec2_instance(preferred_instance_id)
            params_to_write = {
                ConfigFile.CF_INSTANCE_ID: preferred_instance_id
            }
            config_file.write(params_to_write)
    # If they specified a key pair, we need to make sure we can find it in the filesystem
    if preferred_ec2_key_pair is not None:
        # If its the default key, just set it to None
        if preferred_ec2_key_pair.startswith(EC2Services.default_key_pair_prefix):
            preferred_ec2_key_pair = None
        else:
            path_to_key_pair = raw_input('Please enter the full path to the AWS key pair you specified ({0}): '.format(preferred_ec2_key_pair))
            while not os.path.exists(path_to_key_pair):
                print "Couldn't find the specified key pair at: {0}".format(path_to_key_pair)
                path_to_key_pair = raw_input('Please enter the full path to the AWS key pair you specified ({0}): '.format(preferred_ec2_key_pair))
    # Now we have all the necessary config variables to launch
    instance = ec2_services.launch_ec2_instance(preferred_instance_id, preferred_ec2_key_pair, keyfile=path_to_key_pair)
    print "EC2 instance launched at {0}!".format(instance.public_dns_name)
    # Write this instance id to the config file in case its a brand new instance
    params_to_write = {
        "ec2_instance_id": instance.id
    }
    config_file.write(params_to_write)
    # Now make sure that the StochSS Server is actually running.
    stochss_url = "https://" + str(instance.public_dns_name)
    print "============================================================================"
    print "Starting StochSS Server at {0} -- it will take another minute or so before the URL actually works. Please be patient...".format(stochss_url)
    #trys = 0
    while True:
        try:
            req = urllib2.urlopen(stochss_url)
            print "Success!"
            break
        except:
            #trys += 1
            #print "Try {0}".format(trys)
            time.sleep(1)
    if instance.key_name.startswith(EC2Services.default_key_pair_prefix):
        # Then we are using the default key, its in the current dir
        preferred_ec2_key_pair = os.path.join( os.path.dirname(os.path.abspath(__file__)), '{0}.pem'.format(instance.key_name) )
    else:
        # The user supplied their own key pair and it must have been valid if we got this far,
        # we need to know the path to it.
        if path_to_key_pair is None:
            # We want to avoid this at all possible costs, but in case something slips through the cracks
            path_to_key_pair = raw_input('Please enter the full path to the AWS key pair you specified ({0}): '.format(preferred_ec2_key_pair))
            while not os.path.exists(path_to_key_pair):
                
                print "Couldn't find the specified key pair at: {0}\nPress Control+C to cancel this process and terminate the instance".format(path_to_key_pair)
                path_to_key_pair = raw_input('Please enter the full path to the AWS key pair you specified ({0}): '.format(preferred_ec2_key_pair))
        preferred_ec2_key_pair = path_to_key_pair
    # Get a secret token now for remote access
    admin_token = uuid.uuid4()
    create_and_exchange_admin_token = "python exchange_admin_token.py {0} {1} {2} {3}".format(preferred_ec2_key_pair, 'ubuntu', instance.public_dns_name, admin_token)
    success = os.system(create_and_exchange_admin_token)
    # Print out command if it fails
    if success != 0:
        print "Admin token exchange failed. Try running the following command yourself:\n\n\t{0}\n\n".format(create_and_exchange_admin_token)
    # Now we have created/exchanged the secret token, just need to use it to access the website
    stochss_url = "{0}/login?secret_key={1}".format(stochss_url, admin_token)
    print stochss_url
    # OK, its running. Launch it in the default browser?
    # open_browser = raw_input("Do you want to launch StochSS in your default browser now (y/n)? ").lower()
    # if open_browser == "y":
    webbrowser.open_new(stochss_url)

def stop_stochss_server(aws_access_key, aws_secret_key, ec2_region, instance_id):
    '''
    Stop the EC2 node specified by the parameters.
    '''
    # Check for AWS credentials in config file if needed
    if None in [aws_access_key, aws_secret_key]:
        variables_to_look_for = [ConfigFile.CF_ACCESS_KEY, ConfigFile.CF_SECRET_KEY]
        results = config_file.read(variables_to_look_for)
        aws_access_key, aws_secret_key = [results[name] for name in variables_to_look_for]
    # Check for the rest of the config variables in the config file
    if None in [ec2_region, instance_id]:
        variables_to_look_for = [ConfigFile.CF_INSTANCE_ID, ConfigFile.CF_REGION]
        results = config_file.read(variables_to_look_for)
        instance_id, ec2_region = [results[name] for name in variables_to_look_for]
    # Any variables that are still None might need to be retrieved from the user
    # We definitely need the AWS credentials
    if None in [aws_access_key, aws_secret_key]:
        aws_access_key = raw_input("Please enter your AWS access key: ")
        aws_secret_key = raw_input("Please enter your AWS secret key: ")
        params_to_write = {
            ConfigFile.CF_ACCESS_KEY: aws_access_key,
            ConfigFile.CF_SECRET_KEY: aws_secret_key
        }
        config_file.write(params_to_write)
    else:
        print "Using default AWS credentials..."
    # We also definitely need the region
    if ec2_region is None:
        ec2_region = raw_input("Please enter the AWS region where you want to stop StochSS (us-west-2,us-east-1):").lower()
        if ec2_region not in EC2Services.supported_ec2_regions.keys():
            print "%s is not supported. Only supported regions are us-west-2 and us-east-1."
            exit(-1)
        params_to_write = {
            ConfigFile.CF_REGION: ec2_region
        }
        config_file.write(params_to_write)
    else:
        print "Using saved EC2 region, {0}".format(ec2_region)
    # And an instance id
    if instance_id is None:
        instance_id = raw_input("Please enter the instance ID of the StochSS Server you wish to stop: ")
    else:
        print "Using saved EC2 instance ID, {0}".format(instance_id)
    # Now we have all the necessary config variables
    ec2_services = EC2Services(ec2_region, aws_access_key, aws_secret_key)
    ec2_services.stop_ec2_instance(instance_id)

def terminate_stochss_server(aws_access_key, aws_secret_key, ec2_region, instance_id):
    '''
    Terminate the EC2 node specified by the parameters.
    '''
    # Check for AWS credentials in config file if needed
    if None in [aws_access_key, aws_secret_key]:
        variables_to_look_for = [ConfigFile.CF_ACCESS_KEY, ConfigFile.CF_SECRET_KEY]
        results = config_file.read(variables_to_look_for)
        aws_access_key, aws_secret_key = [results[name] for name in variables_to_look_for]
    # Check for the rest of the config variables in the config file
    if None in [ec2_region, instance_id]:
        variables_to_look_for = [ConfigFile.CF_REGION, ConfigFile.CF_INSTANCE_ID]
        results = config_file.read(variables_to_look_for)
        [ec2_region, instance_id] = [results[name] for name in variables_to_look_for]
    # Any variables that are still None might need to be retrieved from the user
    # We definitely need the AWS credentials
    if None in [aws_access_key, aws_secret_key]:
        aws_access_key = raw_input("Please enter your AWS access key: ")
        aws_secret_key = raw_input("Please enter your AWS secret key: ")
        params_to_write = {
            ConfigFile.CF_ACCESS_KEY: aws_access_key,
            ConfigFile.CF_SECRET_KEY: aws_secret_key
        }
        config_file.write(params_to_write)
    else:
        print "Using default AWS credentials..."
    # We also definitely need the region
    if ec2_region is None:
        ec2_region = raw_input("Please enter the AWS region where you want to stop StochSS (us-west-2,us-east-1):").lower()
        if ec2_region not in EC2Services.supported_ec2_regions.keys():
            print "%s is not supported. Only supported regions are us-west-2 and us-east-1."
            exit(-1)
        params_to_write = {
            ConfigFile.CF_REGION: ec2_region
        }
        config_file.write(params_to_write)
    else:
        print "Using saved EC2 region, {0}".format(ec2_region)
    # And an instance id
    if instance_id is None:
        instance_id = raw_input("Please enter the instance ID of the StochSS Server you wish to terminate: ")
    else:
        print "Using saved EC2 instance ID, {0}".format(instance_id)
    # Now we have all the necessary config variables
    ec2_services = EC2Services(ec2_region, aws_access_key, aws_secret_key)
    ec2_services.terminate_ec2_instance(instance_id)
    config_file.remove(ConfigFile.CF_INSTANCE_ID)
    ec2_services.terminate_ec2_compute_nodes()

def list_all_stochss_servers(aws_access_key, aws_secret_key, ec2_region):
    # Check for AWS credentials in config file if needed
    if None in [aws_access_key, aws_secret_key]:
        variables_to_look_for = [ConfigFile.CF_ACCESS_KEY, ConfigFile.CF_SECRET_KEY]
        results = config_file.read(variables_to_look_for)
        aws_access_key, aws_secret_key = [results[name] for name in variables_to_look_for]
    # Check for the rest of the config variables in the config file
    if None in [ec2_region]:
        variables_to_look_for = [ConfigFile.CF_REGION]
        results = config_file.read(variables_to_look_for)
        ec2_region = results[ConfigFile.CF_REGION]
    # Any variables that are still None might need to be retrieved from the user
    # We definitely need the AWS credentials
    if None in [aws_access_key, aws_secret_key]:
        aws_access_key = raw_input("Please enter your AWS access key: ")
        aws_secret_key = raw_input("Please enter your AWS secret key: ")
        params_to_write = {
            ConfigFile.CF_ACCESS_KEY: aws_access_key,
            ConfigFile.CF_SECRET_KEY: aws_secret_key
        }
        config_file.write(params_to_write)
    else:
        print "Using default AWS credentials..."
    # We also definitely need the region
    if ec2_region is None:
        ec2_region = raw_input("Please enter the AWS region where you want to stop StochSS (us-west-2,us-east-1):").lower()
        if ec2_region not in EC2Services.supported_ec2_regions.keys():
            print "%s is not supported. Only supported regions are us-west-2 and us-east-1."
            exit(-1)
        params_to_write = {
            ConfigFile.CF_REGION: ec2_region
        }
        config_file.write(params_to_write)
    else:
        print "Using saved EC2 region, {0}".format(ec2_region)
    ec2_services = EC2Services(ec2_region, aws_access_key, aws_secret_key)
    instances = ec2_services.retrieve_all_ec2_instances()
    if len(instances) > 0:
        print "Listing All StochSS Servers on EC2:"
        count = 1
        for instance in instances:
            print "\n{0}. Instance ID: {1} - Status: {2}".format(count, instance.id, instance.state)
            if instance.state == "running":
                print "\tYou can access this server at the following URL: {0}".format("http://" + str(instance.public_dns_name) + ":8080/")
            count += 1
    else:
        print "No StochSS Servers currently on EC2."

def main(command, is_windows=False):
    # Create the ConfigFile object
    global config_file
    config_file = ConfigFile(".ec2-config")
    print "Using config file .ec2-config"
    # Respect environment variables over config file if set
    if 'AWS_ACCESS_KEY' in os.environ and os.environ['AWS_ACCESS_KEY'] != '':
        aws_access_key = os.environ['AWS_ACCESS_KEY']
    else:
        aws_access_key = None
    if 'AWS_SECRET_KEY' in os.environ and os.environ['AWS_SECRET_KEY'] != '':
        aws_secret_key = os.environ['AWS_SECRET_KEY']
    else:
        aws_secret_key = None
    preferred_instance_id = None
    preferred_ec2_key_pair = None
    ec2_region = None
    # Defaults for Windows users
    #if is_windows:
    #    ec2_region = 'us-east-1'

    # The supported commands
    if command == "start":
        start_stochss_server(aws_access_key, aws_secret_key, preferred_instance_id, preferred_ec2_key_pair, ec2_region)
    elif command == "stop":
        stop_stochss_server(aws_access_key, aws_secret_key, ec2_region, preferred_instance_id)
    elif command == "terminate":
        terminate_stochss_server(aws_access_key, aws_secret_key, ec2_region, None)# Always make the user type this in: , preferred_instance_id)
    #elif command == "list":
    #    list_all_stochss_servers(aws_access_key, aws_secret_key, ec2_region)
    else:
        print_usage_and_exit()
    # One command at a time
    exit(0)

if __name__ == "__main__":
    if len(sys.argv) == 2:
        main(sys.argv[1])
    else:
        print_usage_and_exit()

