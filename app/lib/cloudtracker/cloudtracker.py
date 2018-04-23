import boto.ec2
import os, sys
from s3_helper import *
import logging
####################
# Helper functions #
####################


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

''' Helper function to generate a user-data script for CloudInit '''
''' The script is a bash scrip that must download the input files from S3 and run the executable with inputs '''
def generate_launch_script(uuid, bucketname, params, inputs, files):
	script = "#!/bin/bash\n"

	# Copy files from S3
	for f in files:
		script = script + "curl https://s3.amazonaws.com/"+bucketname+"/" + str(f.key) + " > " + str(f.key).strip(uuid).split("/files")[1] + "\n"

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
	def __init__(self, access_key, secret_key, tracking_number, bucketname):
		logging.debug("Initialized CloudTracker instance with uuid " + tracking_number + ", bucketname " + bucketname)
		self.access_key = access_key
		self.secret_key = secret_key
		self.uuid = tracking_number
		self.bucketname = bucketname

	''' Gathers EC2 metadata and stores it in a manifest file in a new S3 directory'''
	def if_tracking(self):
		logging.debug("if_tracking() bucket={0} uuid={1}".format(self.bucketname, self.uuid))
		if if_file_exist(self.bucketname, self.uuid + "/manifest", self.access_key, self.secret_key):
			return False
		else:
			return True

	''' Parses exec_str for an executable name, input parameters, and input files'''
	''' Executable name and input parameters are stored in the manifest file '''
	''' Input files are stored alongside the manifest file in a subfolder called files/ '''
	def track_input(self, params):
		logging.debug("track_input() params={0}".format(params))
		# create the manifest file
		create_file(self.bucketname, self.uuid + "/manifest", params, self.access_key, self.secret_key)
		
		self.timer = datetime.now()
		

	''' Store execution time, output dataset size, and location of output directory to the manifest file'''
	def track_output(self, output_dir):
		logging.debug('track_output() output_dir={0}'.format(output_dir))
		# Calculate total execution time of a job
		exec_time = (datetime.now() - self.timer).total_seconds()
		# Calculate the total size of the job output
		output_size = get_output_size(output_dir)
		data = { "output_dir" : output_dir, "exec_time" : exec_time, "output_size" : output_size }
		# Updates the manifest file
		add_to_file(self.bucketname, self.uuid + "/manifest", data, self.access_key, self.secret_key)

	''' Launches a new EC2 instance with the provided security credentials provided '''
	''' Gathers provenance information from storage based on provided uuid '''
	''' Uses user data script to download input files to the instance and run the same executable with identical input parameters '''
	def get_input(self):
		logging.debug("get_input(): running job with uuid " + self.uuid)
		# Retrieve manifest file from S3 bucket
		params = get_metadata(self.bucketname, self.uuid + "/manifest", self.access_key, self.secret_key)
# 		print params

		return params

