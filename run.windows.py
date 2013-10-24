import time
import boto.ec2

aws_access_key = raw_input("Please enter your AWS access key:")
aws_secret_key = raw_input("Please enter your AWS secret key:")
# key_name = raw_input("Please enter the name of the file containing your key-pair:")

print "======================"
print "Connecting to EC2..."
print "======================"

conn = boto.ec2.connect_to_region(
    "us-west-2",
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key
)

print "Checking security groups.."
securityGroup = None

for sg in conn.get_all_security_groups():
    if sg.name == 'stochss':
        print "StochSS security group found, using that."
        securityGroup = sg
        break

if securityGroup is None:
    print "No StochSS security group found, creating one."
    sg = conn.create_security_group('stochss', 'StochSS Security Group')
    sg.authorize('tcp', 80, 80, '0.0.0.0/0')
    sg.authorize('tcp', 8080, 8080, '0.0.0.0/0')

print "Launching EC2 instance now, this may take a moment..."
reservation = conn.run_instances(
    'ami-ba0e978a',
    # key_name=key_name,
    instance_type='m1.medium',
    security_groups=[sg]
)
instance = reservation.instances[0]
instance.update()
while instance.state != 'running':
    print "EC2 instance still launching..."
    time.sleep(5)
    instance.update()
    
print "EC2 instance launched! You can now access StochSS at {0}:8080".format(instance.public_dns_name)