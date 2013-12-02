import time
import os
import boto.ec2

if 'AWS_ACCESS_KEY' in os.environ:
    aws_access_key = os.environ['AWS_ACCESS_KEY']
else:
    aws_access_key = raw_input("Please enter your AWS access key:")
if 'AWS_SECRET_KEY' in os.environ:
    aws_secret_key = os.environ['AWS_SECRET_KEY']
else:
    aws_secret_key = raw_input("Please enter your AWS secret key:")
preferred_instance_id = raw_input("Please enter the instance ID of the EC2 instance you wish to launch (just hit return to launch a brand new instance):")
# key_name = raw_input("Please enter the name of the file containing your key-pair:")

print "======================"
print "Connecting to EC2..."
print "======================"

conn = boto.ec2.connect_to_region(
    "us-west-2",
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

    return security_group
        
sg = find_or_create_security_group()

def launch_ec2_instance(instance_id, security_group):
    if instance_id is "":
        print "Launching new EC2 instance now. This may take a moment..."
        reservation = conn.run_instances(
            'ami-088d1538',
            # key_name=key_name,
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
print "============================================================================"
print "EC2 instance launched! You can now access StochSS at {0}:8080".format(instance.public_dns_name)
print "Note: it may take another minute or so before the above URL actually works. Please be patient."
print "============================================================================"
print "IMPORTANT: The instance ID of this EC2 instance is '{0}'.".format(instance.id)
print "To relaunch this instance and not lose any of your saved data, you should\nsave this ID and enter it when prompted the next time you run this script."
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

