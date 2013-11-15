import os, stat, time
import boto.ec2
from boto.ec2.cloudwatch import MetricAlarm
import webbrowser
import urllib2

config_file_name = ".ec2-config"
aws_access_key = None
aws_secret_key = None
preferred_instance_id = None
preferred_ec2_key_pair = None
ec2_region = None
supported_ec2_regions = {
    'us-west-2': 'ami-088d1538',
    'us-east-1': 'ami-55742f3c'
}

try:
    config_file = open(config_file_name, "r")
    for line in config_file:
        if "aws_access_key=" in line.lower():
            aws_access_key = line.split('=')[1].rstrip()
        elif "aws_secret_key=" in line.lower():
            aws_secret_key = line.split('=')[1].rstrip()
        elif "ec2_instance_id=" in line.lower():
            preferred_instance_id = line.split('=')[1].rstrip()
        elif "ec2_key_pair=" in line.lower():
            preferred_ec2_key_pair = line.split('=')[1].rstrip()
        elif "ec2_region=" in line.lower():
            ec2_region = line.split('=')[1].rstrip()
    config_file.close()
except IOError:
    # This is where the config file is first created
    config_file = open(config_file_name, "w")
    config_file.close()
    # chmod 600
    os.chmod(config_file_name, stat.S_IRUSR | stat.S_IWUSR)
    pass

def write_to_config_file(params):
    """ Write each param in params to the config file, making sure to overwrite existing entries """
    try:
        config_file = open(config_file_name, "r")
        lines = config_file.readlines()
        config_file.close()
        config_file = open(config_file_name, "w")
        for line in lines:
            found = False
            for key in params:
                if key.lower() in line.lower():
                    found = True
                    break
            if not found:
                config_file.write(line)
    except IOError:
        config_file = open(config_file_name, "w")
    for key in params:
        config_file.write("%s=%s\n" % (key,params[key]))
    config_file.close()

if None in [aws_access_key, aws_secret_key]:
    aws_access_key = raw_input("Please enter your AWS access key:")
    aws_secret_key = raw_input("Please enter your AWS secret key:")
    params_to_write = {
        "AWS_Access_Key": aws_access_key,
        "AWS_Secret_Key": aws_secret_key
    }
    write_to_config_file(params_to_write)
else:
    print "Using default AWS credentials..."
    
if preferred_instance_id is None:
    preferred_instance_id = raw_input("Please enter the instance ID of the EC2 instance you wish to launch (just hit return to launch a brand new instance):")
    if preferred_instance_id != '':
        params_to_write = {
            "EC2_Instance_ID": preferred_instance_id
        }
        write_to_config_file(params_to_write)
else:
    print "Using saved EC2 instance ID..."

if preferred_ec2_key_pair is None and preferred_instance_id == "":
    decision = raw_input("Do you want to use a key pair when creating this instance? (y/n):")
    if decision.lower() == 'y':
        config_file = open(config_file_name, "r")
        for line in config_file:
            if "preferred_ec2_key_pair=" in line.lower():
                preferred_ec2_key_pair = line.split('=')[1].rstrip()
        if preferred_ec2_key_pair is None:
            preferred_ec2_key_pair = raw_input('Please enter the name of the key pair you wish to use:')
            params_to_write = {
                "EC2_Key_Pair": preferred_ec2_key_pair
            }
            write_to_config_file(params_to_write)
        else:
            print "Using saved EC2 key pair..."

if ec2_region is None:
    ec2_region = raw_input("Please enter the AWS region where you want to launch StochSS (us-west-2,us-east-1):").lower()
    if ec2_region not in supported_ec2_regions.keys():
        print "%s is not supported. Only supported regions are us-west-2 and us-east-1."
        exit(-1)
    params_to_write = {
        'EC2_Region': ec2_region
    }
    write_to_config_file(params_to_write)
else:
    print "Using saved EC2 region..."
        
print "======================"
print "Connecting to EC2..."
print "======================"

conn = boto.ec2.connect_to_region(
    ec2_region,
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key
)

def find_or_create_security_group():
    print "Checking security groups..."
    security_group = None

    for sg in conn.get_all_security_groups():
        if sg.name == 'stochss':
            print "StochSS security group found, using that."
            security_group = sg
            break

    if security_group is None:
        print "No StochSS security group found, creating one."
        security_group = conn.create_security_group('stochss', 'StochSS Security Group')
        security_group.authorize('tcp', 80, 80, '0.0.0.0/0')
        security_group.authorize('tcp', 8080, 8080, '0.0.0.0/0')
        if preferred_ec2_key_pair is not None:
            security_group.authorize('tcp', 22, 22, '0.0.0.0/0')

    return security_group
        
sg = find_or_create_security_group()

def launch_ec2_instance(instance_id, security_group):
    if instance_id is "":
        print "Launching new EC2 instance now. This may take a moment..."
        if preferred_ec2_key_pair is None:
            reservation = conn.run_instances(
                supported_ec2_regions[ec2_region],
                instance_type='t1.micro',
                security_groups=[security_group]
            )
        else:
            reservation = conn.run_instances(
                supported_ec2_regions[ec2_region],
                key_name=preferred_ec2_key_pair,
                instance_type='t1.micro',
                security_groups=[security_group]
            )
        
        instance = reservation.instances[0]
    else:
        print "Launching EC2 instance from instance ID '{0}'. This may take a moment...".format(instance_id)
        try:
            instance_reservations = conn.get_all_instances([instance_id])
            if len(instance_reservations) == 0:
                print "Unrecognized instance ID. Are you sure you entered it in correctly?"
                exit(-1)
            instance = instance_reservations[0].instances[0]
            instance.start()
        except boto.exception.EC2ResponseError:
            print "Invalid instance ID. Are you sure you entered it in correctly?"
            exit(-1)
    
    instance.update()
    while instance.state != 'running':
        time.sleep(5)
        instance.update()
    return instance

instance = launch_ec2_instance(preferred_instance_id, sg)

def make_sleepy(instance_id):
      ec2 = boto.connect_cloudwatch(aws_access_key,aws_secret_key)
      region = "us-east-1"
      terminate_arn = 'arn:aws:automate:{0}:ec2:terminate'.format(region)
      alarm_name = 'ec2_shutdown_sleepy_{0}'.format(instance_id)
   
      # define our alarm to terminate the instance if it gets sleepy
      # i.e. if CPU utilisation is less than 10% for 1 x 4 hr intervals    
      sleepy_alarm = MetricAlarm(
          name=alarm_name, namespace='AWS/EC2',
          metric='CPUUtilization', statistic='Average',
          comparison='<', threshold='10',
          period='3600', evaluation_periods=4,
          alarm_actions=[terminate_arn],
          dimensions={'InstanceId':instance_id})
      ec2.create_alarm(sleepy_alarm)

make_sleepy(instance.id)

params_to_write = {
    "EC2_Instance_ID": instance.id
}
write_to_config_file(params_to_write)

stochss_url = "http://" + str(instance.public_dns_name) + ":8080/"
while True:
    try:
        req = urllib2.urlopen(stochss_url)
        break
    except:
        time.sleep(5)
webbrowser.open_new(stochss_url)
print "============================================================================"
print "EC2 instance launched! You can now access StochSS at {0}".format(stochss_url)
print "Note: it may take another minute or so before the above URL actually works. Please be patient."
print "============================================================================"
print "IMPORTANT: The instance ID of this EC2 instance is '{0}'.".format(instance.id)
print "To relaunch this instance and not lose any of your saved data, you should\nsave this ID and enter it when prompted the next time you run this script."
print "NOTE: By default, this instance ID is saved into the .ec2-config file\nfor ease of use with this script."
print "============================================================================"
print "Press Ctrl+C to stop the EC2 instance."
print "If you update the app from the updates page, you will need to stop the EC2\ninstance and then re-run this script with the instance ID to start it back up."

def stop_instance_and_exit(instance):
    print "\n================================================="
    print "Stopping EC2 instance. This will take a minute..."
    instance.stop()
    instance.update()
    while instance.state != 'stopped':
        time.sleep(5)
        instance.update()
    print "EC2 instance stopped!"
    exit(0)

try:
    while 1:
        time.sleep(1)
except KeyboardInterrupt:
    stop_instance_and_exit(instance)

