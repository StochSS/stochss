#!/usr/bin/env python

import sys
import logging
import os
import argparse

import boto
import boto.s3
from boto.s3.lifecycle import Lifecycle, Expiration

def get_scp_command(user, ip, keyfile, target, source):
    return 'scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i {keyfile} {source} {user}@{ip}:{target}'.format(
        keyfile=keyfile, user=user, ip=ip,
        source=source, target=target)

def get_arg_parser():
    parser = argparse.ArgumentParser(description="SCCPY : Secure Copy Tool\
                                                  Tool for uploading job output tar to Amazon S3 (for EC2 agent) or\
                                                  scp-ing to queue head node (for Flex Agent)")
    parser.add_argument('-f', '--file', help="File to upload", action="store", dest="filename")
    parser.add_argument('--ec2', nargs=1, metavar=('BUCKET_NAME'),
                        help='Upload to Amazon S3', action='store', dest='ec2_config')
    parser.add_argument('--flex', nargs=3, metavar=('QUEUE_HEAD_IP', 'QUEUE_HEAD_USERNAME', 'QUEUE_HEAD_KEYFILE'),
                        help='Upload to Flex Cloud Queue Head', action='store', dest='flex_config')
    return parser


class StorageAgent(object):
    def upload_file(self, filename):
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
    OUTPUT_DIR = '~/stochss/app/backend/tmp/flex/output/'

    def __init__(self, queue_head_ip, queue_head_username, queue_head_keyfile):
        self.queue_head_ip = queue_head_ip
        self.queue_head_username = queue_head_username
        self.queue_head_keyfile = queue_head_keyfile

    def upload_file(self, filename):
        try:
            scp_command = get_scp_command(user=self.queue_head_username, ip=self.queue_head_ip,
                                      keyfile=self.queue_head_keyfile,
                                      target=self.OUTPUT_DIR, source=filename)

            sys.stdout.write(scp_command)
            sys.stdout.flush()

            if os.system(scp_command) != 0:
                raise Exception('FlexStorageAgent: scp failed')

        except Exception, e:
            sys.stdout.write("FlexStorageAgent failed with exception:\n{0}".format(str(e)))
            sys.stdout.flush()
            raise e


if __name__ == '__main__':
    parser = get_arg_parser()
    parsed_args = parser.parse_args(sys.argv[1:])

    if parsed_args.filename == None or not os.path.exists(parsed_args.filename):
        raise Exception('Please pass valid filename existing locally!')

    if parsed_args.ec2_config != None:
        if len(parsed_args.ec2_config) != 1:
            raise Exception('Need 1 argument for --ec2 option.')

        s3_bucket_name = parsed_args.ec2_config[0]

        a = AmazonS3Agent(bucket_name=s3_bucket_name)
        a.upload_file(filename=parsed_args.filename)

    elif parsed_args.flex_config != None:
        if len(parsed_args.flex_config) != 3:
            raise Exception('Need 3 arguments for --flex option.')

        queue_head_ip = parsed_args.flex_config[0]
        queue_head_username = parsed_args.flex_config[1]
        queue_head_keyfile = parsed_args.flex_config[2]

        f = FlexStorageAgent(queue_head_ip=queue_head_ip,
                         queue_head_keyfile=queue_head_keyfile, queue_head_username=queue_head_username)
        f.upload_file(filename=parsed_args.filename)

    else:
        raise Exception('Invalid option chosen!')

