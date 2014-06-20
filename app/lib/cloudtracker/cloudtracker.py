import boto.ec2
import os, sys
from s3_helper import *

####################
# Helper functions #
####################

''' Helper function to turn a dictionary into a newline-separated string '''
def generate_manifest(metadata):
	manifest = ""
	for k in metadata:
		manifest = manifest + k + " : " + str(metadata[k]) + "\n"
	return manifest

''' Helper function to parse an execution string for an executable name, input parameters, and files '''
def parse_executable(exec_str):
	# Tokenize input on spaces
	tokens = exec_str.split(' ')
	executable = tokens[0]
	inputs = {}
	try:
		for i in range(1,len(tokens)):
			current = tokens[i]
			# Indicates the start of a new input parameter
			if current.startswith('-'):
				inputs[current] = ""
				i += 1
				next = tokens[i]
				# Add content until a new input parameter is reached
				while next.startswith('-') is False:
					inputs[current] = inputs[current] + " " + next
					i += 1
					next = tokens[i]
				i -= 1
				inputs[current] = inputs[current].strip()
	# If at any point, you run out of tokens, exit the loop gracefully
	except IndexError:
		pass

	# Check each input parameter value to see if it is a file
	files = []
	for k in inputs:
		if os.path.isfile(inputs[k]):
			files.append(inputs[k])

	return executable, inputs, files

''' Helper function to extract the job inputs and other provenance information from a manifest file '''
def parse_manifest(manifest):
	lines = manifest.split('\n')
	params = {}
	inputs = {}
	for l in lines:
		tokens = l.split(' : ')
		# Indicates the start of an input parameter
		if tokens[0].startswith('-'):
			inputs[tokens[0]] = tokens[1]
		# Otherwise, it is some other piece of provenance information
		else:
			params[tokens[0]] = tokens[1]

	return params, inputs

''' Helper function to generate a user-data script for CloudInit '''
''' The script is a bash scrip that must download the input files from S3 and run the executable with inputs '''
def generate_launch_script(uuid, params, inputs, files):
	script = "#!/bin/bash\n"

	# Copy files from S3
	for f in files:
		script = script + "curl https://s3.amazonaws.com/gdouglas.cs.ucsb.edu.research_bucket/" + str(f.key) + " > " + str(f.key).strip(uuid).split("/files")[1] + "\n"

	# Reconstruct original execution string
	script = script + params['executable'] + " "
	for p in inputs:
		script = script + p + " " + inputs[p] + " "

	script = script + "\n"
	
	return script

''' Sum the file sizes of every regular file in the output directory '''
def get_output_size(path):
	if not path.endswith('/'):
		path += '/'

	size = 0
	files = [path]
	while len(files) is not 0:
		# If it is a file, add its size to the sum
		if os.path.isfile(files[0]):
			size += os.path.getsize(files[0])
		# If it is a directory, add its contents to the list of files
		elif os.path.isdir(files[0]):
			if not files[0].endswith('/'):
				files[0] += '/'
			for f in os.listdir(files[0]):
				files.append(files[0] + f)
		files.remove(files[0])

	return size

''' CloudTracker class definition '''
class CloudTracker:
	''' Assigns a job uuid to this instance of CloudTracker'''
	def __init__(self, tracking_number='0'):
		print "Initialized CloudTracker instance with uuid " + tracking_number
		self.uuid = tracking_number

	''' Gathers EC2 metadata and stores it in a manifest file in a new S3 directory'''
	def init_tracking(self):
		print "Initializing tracking..."
		# s3_helper functions
		ami_id = get_ami_id()
		instance_type = get_instance_type()
		region = get_region()
		data = { "ami_id" : ami_id, 
		         "instance_type" : instance_type,
		         "region" : region}
		manifest = generate_manifest(data)
		print "Manifest : " + manifest
		# Adds manifest file to S3 with contents from the manifest variable
		create_file("gdouglas.cs.ucsb.edu.research_bucket", self.uuid + "/manifest", manifest)

	''' Parses exec_str for an executable name, input parameters, and input files'''
	''' Executable name and input parameters are stored in the manifest file '''
	''' Input files are stored alongside the manifest file in a subfolder called files/ '''
	def track_input(self, exec_str):
		print "Tracking inputs..."
		executable, inputs, files = parse_executable(exec_str)
		data = { "executable" : executable }
		manifest = generate_manifest(data)
		print manifest
		# Updates the manifest file
		add_to_file("gdouglas.cs.ucsb.edu.research_bucket", self.uuid + "/manifest", manifest)
		manifest = generate_manifest(inputs)
		print manifest
		# Updates the manifest file
		add_to_file("gdouglas.cs.ucsb.edu.research_bucket", self.uuid + "/manifest", manifest)
		print files
		# Upload input files alongside to S3 bucket alongisde the manifest in a subfolder called files/
		for f in files:
			upload_file("gdouglas.cs.ucsb.edu.research_bucket", f, self.uuid + "/files/" + f.strip('/'))
		# Save the current time for calculating total execution time later
		self.timer = datetime.now()

	''' Store execution time, output dataset size, and location of output directory to the manifest file'''
	def track_output(self, output_dir):
		print "Tracking outputs..."
		# Calculate total execution time of a job
		exec_time = (datetime.now() - self.timer).total_seconds()
		# Calculate the total size of the job output
		output_size = get_output_size(output_dir)
		data = { "output_dir" : output_dir, "exec_time" : exec_time, "output_size" : output_size }
		manifest = generate_manifest(data)
		print manifest
		# Updates the manifest file
		add_to_file("gdouglas.cs.ucsb.edu.research_bucket", self.uuid + "/manifest", manifest)

	''' Launches a new EC2 instance with the provided security credentials provided '''
	''' Gathers provenance information from storage based on provided uuid '''
	''' Uses user data script to download input files to the instance and run the same executable with identical input parameters '''
	def run(self, uuid, access_key, secret_key):

		print "running job with uuid " + str(uuid)
		# Retrieve manifest file from S3 bucket
		manifest = get_file("gdouglas.cs.ucsb.edu.research_bucket", str(uuid) + "/manifest", access_key, secret_key).get_contents_as_string()
		params, inputs = parse_manifest(manifest.strip())

		# Connect to EC2
		print "Connecting to " + params['region']
		conn = boto.ec2.connect_to_region(
			params['region'],
			aws_access_key_id=access_key,
			aws_secret_access_key=secret_key
		)

		# Get a list of input files from the S3 bucket

		files = get_all_files("gdouglas.cs.ucsb.edu.research_bucket", str(uuid) + "/files", access_key, secret_key)
		# Create user data script 
		script = generate_launch_script(str(uuid), params, inputs, files)
		print script

		# Launch new EC2 instance with user data script
		print "Launching worker from AMI: " + params['ami_id']
		rs = conn.run_instances(
			params['ami_id'],
			instance_type=params['instance_type'],
			security_groups=['default-ssh'],
			user_data=script
		)

		# Wait until the EC2 instance status changes to running
		inst = rs.instances[0]
		while inst.state != 'running':
			inst.update()

		print "Finished"
