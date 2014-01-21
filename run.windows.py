#! /usr/bin/python

import os, stat, time, sys
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
    
    # Current regions with a StochSS Server machine image
    supported_ec2_regions = {
        'us-west-2': 'ami-76cbaa46',
        'us-east-1': 'ami-cdae9ca4'
    }
    
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
    
    def find_or_create_security_group(self):
        print "Checking security groups..."
        security_group = None
        for sg in self.conn.get_all_security_groups():
            if sg.name == 'stochss':
                print "StochSS security group found, using that."
                security_group = sg
                break
        if security_group is None:
            print "No StochSS security group found, creating one."
            security_group = self.conn.create_security_group('stochss', 'StochSS Security Group')
            security_group.authorize('tcp', 80, 80, '0.0.0.0/0')
            security_group.authorize('tcp', 8080, 8080, '0.0.0.0/0')
            if preferred_ec2_key_pair is not None:
                security_group.authorize('tcp', 22, 22, '0.0.0.0/0')
        return security_group
    
    def make_instance_sleepy(self, instance_id):
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
    
    def retrieve_all_ec2_instances(self):
        '''
        Retrieve all of the EC2 instances associated with the StochSS Server AMI for this region.
        '''
        instances = []
        instance_reservations = self.conn.get_all_instances()
        for instance_reservation in instance_reservations:
            for instance in instance_reservation.instances:
                if instance.state != "terminated" and instance.image_id == EC2Services.supported_ec2_regions[self.region]:
                    instances += [instance]
        return instances
    
    def launch_ec2_instance(self, instance_id, key_pair=None):
        security_group = self.find_or_create_security_group()
        if instance_id is "":
            print "Launching new EC2 instance now. This may take a moment..."
            if key_pair is None:
                reservation = self.conn.run_instances(
                    EC2Services.supported_ec2_regions[self.region],
                    instance_type='t1.micro',
                    security_groups=[security_group]
                )
            else:
                reservation = self.conn.run_instances(
                    EC2Services.supported_ec2_regions[self.region],
                    key_name=key_pair,
                    instance_type='t1.micro',
                    security_groups=[security_group]
                )
            instance = reservation.instances[0]
        else:
            print "Launching EC2 instance from instance ID '{0}'. This may take a moment...".format(instance_id)
            try:
                instance = self.retrieve_ec2_instance(instance_id)
                instance.start()
            except boto.exception.EC2ResponseError:
                print "Invalid instance ID. Are you sure you entered it in correctly?"
                exit(-1)
        # Make sure its actually running before we return
        instance.update()
        while instance.state != 'running':
            time.sleep(5)
            instance.update()
        # Dont forget to add the alarm
        self.make_instance_sleepy(instance.id)
        return instance
    
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

def print_usage_and_exit():
    print "Error in command line arguments!"
    print "Expected Usage: ./run_ec2.py [command]"
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
    if ec2_region is None:
        ec2_region = raw_input("Please enter the AWS region where you want to launch StochSS (us-west-2,us-east-1):").lower()
        if ec2_region not in EC2Services.supported_ec2_regions.keys():
            print "%s is not supported. Only supported regions are us-west-2 and us-east-1."
            exit(-1)
        params_to_write = {
            ConfigFile.CF_REGION: ec2_region
        }
        config_file.write(params_to_write)
    else:
        print "Using saved EC2 region, {0}".format(ec2_region)
    # We might need an instance id...
    # This logic is short-circuited now
    if preferred_instance_id is None:
        preferred_instance_id = ''
        #raw_input("Please enter the instance ID of the EC2 instance you wish to launch (just hit return to launch a brand new instance):")
        if preferred_instance_id == '':
            # ...unless they want a brand new instance. Then we might need a keypair...
            #decision = raw_input("Do you optionally want to use a key pair when creating this instance (y/n)? ").lower()
            decision = 'n'
            if decision == 'y':
                if preferred_ec2_key_pair is None:
                    preferred_ec2_key_pair = raw_input('Please enter the name of the key pair you wish to use:')
                    params_to_write = {
                        ConfigFile.CF_KEY_PAIR: preferred_ec2_key_pair
                    }
                    config_file.write(params_to_write)
                else:
                    print "Using saved EC2 key pair, {0}".format(preferred_ec2_key_pair)
            else:
                # ...unless they dont want SSH access.
                preferred_ec2_key_pair = None
        else:
            params_to_write = {
                ConfigFile.CF_INSTANCE_ID: preferred_instance_id
            }
            config_file.write(params_to_write)
    else:
        print "Using saved EC2 instance ID, {0}".format(preferred_instance_id)
    # Now we have all the necessary config variables
    ec2_services = EC2Services(ec2_region, aws_access_key, aws_secret_key)
    instance = ec2_services.launch_ec2_instance(preferred_instance_id, preferred_ec2_key_pair)
    # Write this instance id to the config file in case its a brand new instance
    params_to_write = {
        "ec2_instance_id": instance.id
    }
    config_file.write(params_to_write)
    # Now make sure that the StochSS Server is actually running.
    stochss_url = "http://" + str(instance.public_dns_name) + ":8080/"
    print "============================================================================"
    print "Starting StochSS Server at {0} -- it will take another minute or so before the URL actually works. Please be patient...".format(stochss_url)
    #trys = 0
    while True:
        try:
            req = urllib2.urlopen(stochss_url)
            print "EC2 instance launched!"
            break
        except:
            #trys += 1
            #print "Try {0}".format(trys)
            time.sleep(1)
    # OK, its running. Launch it in the default browser.
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

