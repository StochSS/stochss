from base_storage import BaseStorageAgent

import logging
import sys

import boto
import boto.s3
from boto.s3.lifecycle import Lifecycle, Expiration

class S3StorageAgent(BaseStorageAgent):
    def __init__(self, bucket_name, ec2_access_key, ec2_secret_key):
        self.bucket_name = bucket_name
        self.ec2_access_key = ec2_access_key
        self.ec2_secret_key = ec2_secret_key

    def upload_file(self, filename):
        try:
            lifecycle = Lifecycle()
            lifecycle.add_rule('rulename', prefix='logs/', status='Enabled',
                               expiration=Expiration(days=10))
            conn = boto.connect_s3(aws_secret_access_key=self.ec2_secret_key,
                                   aws_access_key_id=self.ec2_access_key)

            if conn.lookup(self.bucket_name):  # bucket exisits
                bucket = conn.get_bucket(self.bucket_name)
            else:
                # create a bucket
                bucket = conn.create_bucket(self.bucket_name, location=boto.s3.connection.Location.DEFAULT)

            bucket.configure_lifecycle(lifecycle)
            from boto.s3.key import Key

            k = Key(bucket)
            k.key = filename
            k.set_contents_from_filename(filename, cb=self.percent_cb, num_cb=10)
            k.set_acl('public-read-write')

        except Exception, e:
            logging.error("S3StorageAgent failed with exception:\n{0}".format(str(e)))
            raise e

    def percent_cb(self, complete, total):
        sys.stdout.write('.')
        sys.stdout.flush()