import boto.ec2
from os.path import isfile
from s3_helper import *

def generate_manifest(metadata):
	manifest = ""
	for k in metadata:
		manifest = manifest + k + " : " + metadata[k] + "\n"
	return manifest

def parse_executable(exec_str):
	tokens = exec_str.split(' ')
	inputs = {}
	try:
		for i in range(1,len(tokens)):
			current = tokens[i]
			if current.startswith('-'):
				inputs[current] = ""
				i += 1
				next = tokens[i]
				while next.startswith('-') is False:
					inputs[current] = inputs[current] + " " + next
					i += 1
					next = tokens[i]
				i -= 1
				inputs[current] = inputs[current].strip()
	except IndexError:
		pass

	files = []
	for k in inputs:
		if isfile(inputs[k]):
			files.append(inputs[k])

	return tokens[0], inputs, files

def parse_manifest(manifest):
	lines = manifest.split('\n')
	params = {}
	inputs = {}
	for l in lines:
		tokens = l.split(' : ')
		if tokens[0].startswith('-'):
			inputs[tokens[0]] = tokens[1]
		else:
			params[tokens[0]] = tokens[1]

	return params, inputs

def setup_provenance(uuid):
	ami_id = get_ami_id()
	instance_type = get_instance_type()
	region = get_region()
	data = { "ami_id" : ami_id, 
	         "instance_type" : instance_type,
	         "region" : region}
	manifest = generate_manifest(data)
	print "Manifest : " + manifest
	create_file("gdouglas.cs.ucsb.edu.research_bucket", uuid + "/manifest", manifest)

def trap_executable(uuid,exec_str):
	print "inside trap executable"
	executable, inputs, files = parse_executable(exec_str)
	print "parsed exec str"
	data = { "executable" : executable }
	manifest = generate_manifest(data)
	add_to_file("gdouglas.cs.ucsb.edu.research_bucket", uuid + "/manifest", manifest)
	manifest = generate_manifest(inputs)
	add_to_file("gdouglas.cs.ucsb.edu.research_bucket", uuid + "/manifest", manifest)
	print files
	for f in files:
		upload_file("gdouglas.cs.ucsb.edu.research_bucket", f, uuid + "/files/" + f.strip('/'))

def generate_launch_script(uuid, params, inputs, files):
	script = "#!/bin/bash\n"
	# Copy files from S3
	for f in files:
		script = script + "curl https://s3.amazonaws.com/gdouglas.cs.ucsb.edu.research_bucket/" + str(f.key) + " > " + str(f.key).strip(uuid).split("/files")[1] + "\n"
	# Run executable with parameters
	script = script + params['executable'] + " "
	for p in inputs:
		script = script + p + " " + inputs[p] + " "
	script = script + "\n"
	return script

def run(uuid, access_key, secret_key):
	print "running job with uuid " + str(uuid)
	manifest = get_file("gdouglas.cs.ucsb.edu.research_bucket", str(uuid) + "/manifest", access_key, secret_key).get_contents_as_string()
	params, inputs = parse_manifest(manifest.strip())

	print "Connecting to " + params['region']
	conn = boto.ec2.connect_to_region(
		params['region'],
		aws_access_key_id=access_key,
		aws_secret_access_key=secret_key
	)

	files = get_all_files("gdouglas.cs.ucsb.edu.research_bucket", str(uuid) + "/files", access_key, secret_key)
	script = generate_launch_script(str(uuid), params, inputs, files)
	print script


	print "Launching worker from AMI: " + params['ami_id']
	rs = conn.run_instances(
		params['ami_id'],
		instance_type=params['instance_type'],
		security_groups=['default-ssh'],
		user_data=script
	)




