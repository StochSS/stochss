import boto
import urllib
from boto.s3.key import Key
from boto.s3.connection import S3Connection
from datetime import datetime

def get_bucket(bucketname, aws_access_key='', aws_secret_key=''):
	try:
		conn = boto.connect_s3()
	except Exception:
		conn = S3Connection(aws_access_key, aws_secret_key)

	if conn.lookup(bucketname):
		bucket = conn.get_bucket(bucketname)
	else:
		bucket = conn.create_bucket(bucketname, location=boto.s3.connection.Location.DEFAULT)
	return bucket

def upload_file(bucketname, filepath, filename):
	bucket = get_bucket(bucketname)
	k = Key(bucket)
	k.key = filename
	k.set_contents_from_filename(filepath)

def create_file(bucketname, filename, contents):
	bucket = get_bucket(bucketname)
	k = Key(bucket)
	k.key = filename
	k.set_contents_from_string(contents)

def add_to_file(bucketname, filename, contents):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.set_contents_from_string(k.get_contents_as_string() + contents)

def add_metadata(bucketname, filename, key, value):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.metadata.update({key:value})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

def add_ec2_metadata(bucketname, filename):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)

	ami_id = urllib.urlopen("http://169.254.169.254/latest/meta-data/ami-id").read()
	instance_id = urllib.urlopen("http://169.254.169.254/latest/meta-data/instance-id").read()
	instance_type = urllib.urlopen("http://169.254.169.254/latest/meta-data/instance-type").read()
	public_hostname = urllib.urlopen("http://169.254.169.254/latest/meta-data/public-hostname").read()

	k.metadata.update({"ami-id":ami_id})
	k.metadata.update({"instance-id":instance_id})
	k.metadata.update({"instance-type":instance_type})
	k.metadata.update({"public-hostname":public_hostname})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

def get_ami_id():
	return urllib.urlopen("http://169.254.169.254/latest/meta-data/ami-id").read()

def get_instance_type():
	return urllib.urlopen("http://169.254.169.254/latest/meta-data/instance-type").read()

def get_region():
	zone = urllib.urlopen("http://169.254.169.254/latest/meta-data/placement/availability-zone").read()
	return zone[0:len(zone)-1]

def add_running_time(bucketname, filename, time):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.metadata.update({'running-time':time})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

def add_timestamp(bucketname, filename, time):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	timestamp = "%s %.2d:%.2d"%(str(time.date()),time.hour,time.minute)
	k.metadata.update({'timestamp':timestamp})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

def add_filesize(bucketname, filename):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.metadata.update({'size':k.size})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

def get_all_metadata_from_file(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	k = bucket.get_key(filename)
	return k.metadata

def get_metadata_from_file(bucketname, filename, key, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	k = bucket.get_key(filename)
	return k.get_metadata(key)

def get_contents_from_file(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	k = bucket.get_key(filename)
	return k.get_contents_as_string()

def get_contents_from_file(key):
	return key.get_contents_as_string()

def get_all_files(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	return bucket.get_all_keys(prefix=filename)

def get_file(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	return bucket.get_key(filename)

def get_filesize(bucketname, filename):
	return int(get_metadata_from_file(bucketname,filename,'size'))

def get_running_time(bucketname, filename):
	return float(get_metadata_from_file(bucketname,filename,'running-time'))

def save_exec_str(filename, exec_str, files):
	ami_id = urllib.urlopen("http://169.254.169.254/latest/meta-data/ami-id").read()
	instance_type = urllib.urlopen("http://169.254.169.254/latest/meta-data/instance-type").read()

	create_file("gdouglas.cs.ucsb.edu.research_bucket", filename + "/execute", exec_str)
	add_metadata("gdouglas.cs.ucsb.edu.research_bucket", filename + "/execute","ami-id",ami_id)
	add_metadata("gdouglas.cs.ucsb.edu.research_bucket", filename + "/execute","instance-type",instance_type)

	for f in files:
		create_file("gdouglas.cs.ucsb.edu.research_bucket", filename + "/" + f, files[f])
