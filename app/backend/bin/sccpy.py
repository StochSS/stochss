import sys
import logging

import boto
import boto.s3
from boto.s3.lifecycle import Lifecycle, Expiration


class StorageAgent(object):
    def upload_file(self, file):
        raise NotImplementedError


class AmazonS3Agent(StorageAgent):
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name

    def upload_file(self, filename):
        try:
            lifecycle = Lifecycle()
            lifecycle.add_rule('rulename', prefix='logs/', status='Enabled',
                               expiration=Expiration(days=10))
            conn = boto.connect_s3()

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
            sys.stdout.write("AmazonS3Agent failed with exception:\n{0}".format(str(e)))
            sys.stdout.flush()
            raise e

    def percent_cb(self, complete, total):
        sys.stdout.write('.')
        sys.stdout.flush()


class FlexStorageAgent(StorageAgent):
    def __init__(self):
        raise NotImplementedError

    def upload_file(self, file):
        raise NotImplementedError


if __name__ == '__main__':
    file = sys.argv[1]
    bucket_name = sys.argv[2]

    obj = AmazonS3Agent(bucket_name=bucket_name)
    obj.upload_file(file)