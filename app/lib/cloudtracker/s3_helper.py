''' Helper function to support CloudTracker's interactions with S3 '''

import boto
import urllib
from boto.s3.key import Key
from boto.s3.connection import S3Connection
from datetime import datetime

################################
### Currently used functions ###
################################

''' Retrieve bucket from bucketname, with optional credentials '''
def get_bucket(bucketname, aws_access_key='', aws_secret_key=''):
	# Try connecting without credentials, i.e. credentials are already saves as env variables
	try:
		conn = boto.connect_s3()
	# Otherwise supply credentials
	except Exception:
		conn = S3Connection(aws_access_key, aws_secret_key)

	# If the bucket exists, return the existing bucket
	if conn.lookup(bucketname):
		bucket = conn.get_bucket(bucketname)
	# Otherwise, create a new bucket and return it
	else:
		bucket = conn.create_bucket(bucketname, location=boto.s3.connection.Location.DEFAULT)
	return bucket

''' Add a new file to the specified bucket with the specified filename, 
    setting its content from the file at the specified filepath '''
def upload_file(bucketname, filepath, filename):
	bucket = get_bucket(bucketname)
	k = Key(bucket)
	k.key = filename
	k.set_contents_from_filename(filepath)

''' Add a new file to the specified bucket with the specified filename, 
    setting its content from the supplied contents string '''
def create_file(bucketname, filename, contents):
	bucket = get_bucket(bucketname)
	k = Key(bucket)
	k.key = filename
	k.set_contents_from_string(contents)

''' Append current contents of the specified file with content from the specified string '''
def add_to_file(bucketname, filename, contents):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.set_contents_from_string(k.get_contents_as_string() + contents)

''' Add the key-value pair as metadata on the specified filen '''
def add_metadata(bucketname, filename, key, value):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.metadata.update({key:value})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

''' Helper function to query EC2 Metadata service for the AMI ID '''
def get_ami_id():
	return urllib.urlopen("http://169.254.169.254/latest/meta-data/ami-id").read()

''' Helper function to query EC2 Metadata service for the instance type '''
def get_instance_type():
	return urllib.urlopen("http://169.254.169.254/latest/meta-data/instance-type").read()

''' Helper function to query EC2 Metadata service for the AWS region '''
def get_region():
	# Get availability zone
	zone = urllib.urlopen("http://169.254.169.254/latest/meta-data/placement/availability-zone").read()
	# Throw away last character to get the region name
	return zone[0:len(zone)-1]

''' Retrieve contents from the specified file as a string '''
def get_contents_from_file(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	k = bucket.get_key(filename)
	return k.get_contents_as_string()

''' Retrieve all files from the bucket prefixed by the supplied filename '''
def get_all_files(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	return bucket.get_all_keys(prefix=filename)

''' Retrieve the specified file from the specified bucket'''
def get_file(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	return bucket.get_key(filename)


#########################
### Defunct functions ###
#########################

''' Specific helper function to query EC2 metadata service and tag the specified file with
    metadata based on the EC2 metadata '''
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

''' Helper function to add running time as metadata on a specified file '''
def add_running_time(bucketname, filename, time):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.metadata.update({'running-time':time})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

''' Helper function to add a timestamp as metadata on a specified file '''
def add_timestamp(bucketname, filename, time):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	timestamp = "%s %.2d:%.2d"%(str(time.date()),time.hour,time.minute)
	k.metadata.update({'timestamp':timestamp})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

''' Helper function to add filesize as metadata on a specified file '''
def add_filesize(bucketname, filename):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	k.metadata.update({'size':k.size})
	k.copy(k.bucket.name, k.name, k.metadata, preserve_acl=True)

''' Retrieve all metadata from the specified file '''
def get_all_metadata_from_file(bucketname, filename, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	k = bucket.get_key(filename)
	return k.metadata

''' Retrieve the value of the specified key in the metadata of the specified file '''
def get_metadata_from_file(bucketname, filename, key, aws_access_key='', aws_secret_key=''):
	bucket = get_bucket(bucketname,aws_access_key,aws_secret_key)
	k = bucket.get_key(filename)
	return k.get_metadata(key)

''' Retrieve the filesize information for the specified file from its metadata'''
def get_filesize(bucketname, filename):
	return int(get_metadata_from_file(bucketname,filename,'size'))

''' Retrieve the running time information for the specified file from its metadata'''
def get_running_time(bucketname, filename):
	return float(get_metadata_from_file(bucketname,filename,'running-time'))
