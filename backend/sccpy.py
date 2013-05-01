import sys
import boto
import boto.s3

# AWS ACCESS DETAILS

bucket_name =  'stochkitoutput'
conn = boto.connect_s3()
bucket = conn.get_bucket(bucket_name)
#bucket = conn.create_bucket(bucket_name, location=boto.s3.connection.Location.DEFAULT)
uploadfile = sys.argv[1]

print 'Uploading %s to Amazon S3 bucket %s' % \
       (uploadfile, bucket_name)

def percent_cb(complete, total):
    sys.stdout.write('.')
    sys.stdout.flush()

from boto.s3.key import Key
k = Key(bucket)
k.key = uploadfile
k.set_contents_from_filename(uploadfile, cb=percent_cb, num_cb=10)
k.make_public()