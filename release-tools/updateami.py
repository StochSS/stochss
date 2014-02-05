import boto.ec2
from time import sleep, strftime
import os, stat

#AKIAJKKO3ILDCNHT322A
#pZf2XH5dC3GmMIAUlVsb7jnTD/Dl7Sao1i/69rsE

def writeConfig(aws_regions, ami_ids):
	config_file = open("ami_ids","w")
	for i in range(0,len(aws_regions)):
		config_file.write(aws_regions[i] + "=" + ami_ids[i])
		if i != len(aws_regions)-1:
			config_file.write("\n")
	config_file.close()
	os.chmod("ami_ids", stat.S_IRUSR | stat.S_IWUSR | stat.S_IRGRP | stat.S_IROTH)

def getData(file):
	try:
		line = file.readline()
		contents = line.split('=')
		return contents[1].strip()
	except IndexError:
		return None

def main():
	try:
		aws_access_key = os.environ['AWS_ACCESS_KEY_ID']
	except KeyError:
		aws_access_key = raw_input("Please enter your AWS access key: ")

	try:
		aws_secret_key = os.environ['AWS_SECRET_ACCESS_KEY']
	except KeyError:
		aws_secret_key = raw_input("Please enter your AWS secret key: ")

	aws_regions = []
	aws_ami_ids = []
	new_ami_ids = []

	try:
		config_file = open("ami_ids","r")
		for line in config_file:
			line_data = line.split('=')
			aws_regions.append(line_data[0].strip())
			aws_ami_ids.append(line_data[1].strip())
	except IOError:
		num_regions = input("Number of AWS regions with StochSS servers: ")
		for i in range(0,num_regions):
			aws_regions.append(raw_input("Please enter the AWS region of your StochSS Server: "))
			aws_ami_ids.append(raw_input("Please enter the AMI ID of the Server you wish to update: "))
		writeConfig(aws_regions,aws_ami_ids)

	for i in range(0,len(aws_regions)):		
		print "Connecting to " + aws_regions[i]
		conn = boto.ec2.connect_to_region(
			aws_regions[i],
			aws_access_key_id=aws_access_key,
			aws_secret_access_key=aws_secret_key
		)

		script_file = open('updateami.sh','r')
		script = script_file.read()

		print "Launching " + aws_regions[i] + " server from most recent AMI..."
		rs = conn.run_instances(
			aws_ami_ids[i],
			instance_type='t1.micro',
			security_groups=['default'],
			user_data=script
		)

		inst = rs.instances[0]
		while inst.state != 'running':
			inst.update()
		# Allow instance time to run startup script
		print "Running update script..."
		sleep(60)
		print "Update complete"

		month = strftime("%b")
		day = strftime("%d")

		new_ami_name = "StochSS-Server-" + month + day

		print "Creating AMI of updated instance..."
		new_ami_id = conn.create_image(inst.id, new_ami_name)

		print "New AMI pending..."
		new_ami = conn.get_image(new_ami_id)
		while new_ami.state != 'available':
			new_ami.update()

		print "New AMI ID: " + new_ami_id
		print "Making the new AMI Public"
		conn.modify_image_attribute(
			new_ami_id, 
			attribute='launchPermission', 
			operation='add', 
			groups='all'
		)

		print "Shutting down instance..."
		conn.terminate_instances([inst.id])
		while inst.state != 'terminated':
			inst.update()
		print "Instance has terminated"

		new_ami_ids.append(new_ami_id)

	writeConfig(aws_regions,new_ami_ids)

if __name__ == "__main__":
    main()