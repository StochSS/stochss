from base_storage import BaseStorageAgent

import logging
import sys
import traceback

import boto
import boto.s3
from boto.s3.lifecycle import Lifecycle, Expiration
from boto.s3.key import Key

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

            return "https://s3.amazonaws.com/{bucket}/{filename}".format(bucket=self.bucket_name, filename=filename)

        except Exception, e:
            logging.error("S3StorageAgent failed with exception:\n{0}".format(str(e)))
            logging.error(traceback.format_exc())
            raise e

    def percent_cb(self, complete, total):
        sys.stdout.write('.')
        sys.stdout.flush()


    def delete_file(self, filename):
        s3_bucket = self.__get_s3_bucket()

        if s3_bucket == None:
            raise Exception('Could not fetch bucket with name {} from S3!'.format(self.bucket_name))

        k = Key(s3_bucket, filename)
        if k.exists():
            k1 = Key(s3_bucket)
            k1.key = filename
            s3_bucket.delete_key(k1)
            logging.info('File {file} deleted from bucket {bucket}'.format(bucket=self.bucket_name,
                                                                   file=filename))
        else:
            logging.error('File {file} does not exist in bucket {bucket}'.format(bucket=self.bucket_name,
                                                                                 file=filename))


    def __get_s3_bucket(self):
        conn = None
        try:
            conn = boto.connect_s3(aws_secret_access_key=self.ec2_secret_key,
                                   aws_access_key_id=self.ec2_access_key)

            # If the bucket exists, return the existing bucket
            if conn.lookup(self.bucket_name):
                bucket = conn.get_bucket(self.bucket_name)
            else:
                bucket = None

        except Exception:
            logging.error('Cannot get bucket with name {} from S3.'.format(self.bucket_name))
            bucket = None

        finally:
            if conn:
                conn.close()

        return bucket
