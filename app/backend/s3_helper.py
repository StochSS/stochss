import boto
import urllib
from boto.s3.key import Key
from datetime import datetime

def get_bucket(bucketname):
	conn = boto.connect_s3()
	if conn.lookup(bucketname):
		bucket = conn.get_bucket(bucketname)
	else:
		bucket = conn.create_bucket(bucketname, location=boto.s3.connection.Location.DEFAULT)
	return bucket

def upload_file(bucketname, filename):
	bucket = get_bucket(bucketname)
	k = Key(bucket)
	k.key = filename
	k.set_contents_from_filename(filename)
	k.set_acl('public-read-write')

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

def get_all_metadata_from_file(bucketname, filename):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	return k.metadata

def get_metadata_from_file(bucketname, filename, key):
	bucket = get_bucket(bucketname)
	k = bucket.get_key(filename)
	return k.get_metadata(key)

def get_filesize(bucketname, filename):
	return int(get_metadata_from_file(bucketname,filename,'size'))

def get_running_time(bucketname, filename):
	return float(get_metadata_from_file(bucketname,filename,'running-time'))
