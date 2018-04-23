import json
import logging
import os
import uuid

import molns_cloudpickle as cloudpickle
from molns_exceptions import MolnsUtilStorageException

# s3.json is a JSON file that contains the following info:
#
#     'aws_access_key_id' : AWS access key
#     'aws_secret_access_key' : AWS private key
#   s3.json needs to be created and put in .molns/s3.json in the root of the home directory.


def get_s3config():
    try:
        with open(os.environ['HOME'] + '/.molns/s3.json', 'r') as fh:
            s3config = json.loads(fh.read())
        return s3config
    except IOError:
        logging.warning("Credentials file " + os.environ['HOME'] + '/.molns/s3.json'
                        + ' missing. You will not be able to connect to S3 or Swift. Please create this file.')
        return {}


class LocalStorage:
    """ This class provides an abstraction for storing and reading objects on/from
        the ephemeral storage. """

    def __init__(self, folder_name="/home/ubuntu/localarea"):
        self.folder_name = folder_name

    def put(self, filename, data):
        with open(os.path.join(self.folder_name, filename), 'wb') as fh:
            cloudpickle.dump(data, fh)

    def get(self, filename):
        return cloudpickle.load(filename)

    def delete(self, filename):
        os.remove(os.path.join(self.folder_name, filename))


class SharedStorage:
    """ This class provides an abstraction for storing and reading objects on/from
        the sshfs mounted storage on the controller. """

    def __init__(self, serialization_method="cloudpickle"):
        self.folder_name = "/home/ubuntu/shared"
        self.serialization_method = serialization_method

    def put(self, filename, data):
        with open(self.folder_name + "/" + filename, 'wb') as fh:
            if self.serialization_method == "cloudpickle":
                cloudpickle.dump(data, fh)
            elif self.serialization_method == "json":
                json.dump(data, fh)

    def get(self, filename):
        with open(self.folder_name + "/" + filename, 'rb') as fh:
            if self.serialization_method == "cloudpickle":
                data = cloudpickle.loads(fh.read())
            elif self.serialization_method == "json":
                data = json.loads(fh.read())
        return data

    def delete(self, filename):
        os.remove(self.folder_name + "/" + filename)


class S3Provider:
    def __init__(self, bucket_name):
        import boto
        from boto.s3.connection import S3Connection

        s3config = get_s3config()
        self.connection = S3Connection(is_secure=False,
                                       calling_format=boto.s3.connection.OrdinaryCallingFormat(),
                                       **s3config['credentials']
                                       )
        self.set_bucket(bucket_name)

    def set_bucket(self, bucket_name=None):
        if bucket_name is None:
            self.bucket_name = "molns_bucket_{0}".format(str(uuid.uuid1()))
            bucket = self.connection.create_bucket(self.bucket_name)
        else:
            self.bucket_name = bucket_name
            bucket = self.connection.lookup(bucket_name)
            if bucket is None:
                bucket = self.connection.create_bucket(bucket_name)
            self.bucket = bucket

    def create_bucket(self, bucket_name):
        return self.connection.create_bucket(bucket_name)

    def put(self, name, data, reduced_redundancy=True):
        from boto.s3.key import Key
        k = Key(self.bucket)
        if not k:
            raise MolnsUtilStorageException("Could not obtain key in the global store. ")
        k.key = name
        try:
            num_bytes = k.set_contents_from_string(data, reduced_redundancy=reduced_redundancy)
            if num_bytes == 0:
                raise MolnsUtilStorageException("No bytes written to key.")
        except Exception, e:
            return {'status': 'failed', 'error': str(e)}
        return {'status': 'success', 'num_bytes': num_bytes}

    def get(self, name, validate=False):
        import boto
        from boto.s3.key import Key
        k = Key(self.bucket, validate)
        k.key = name
        try:
            obj = k.get_contents_as_string()
        except boto.exception.S3ResponseError, e:
            raise MolnsUtilStorageException("Could not retrive object from the datastore." + str(e))
        return obj

    def delete(self, name):
        """ Delete an object. """
        from boto.s3.key import Key
        k = Key(self.bucket)
        k.key = name
        self.bucket.delete_key(k)

    def delete_all(self):
        """ Delete all objects in the global storage area. """
        for k in self.bucket.list():
            self.bucket.delete_key(k.key)

    def list(self):
        """ List all containers. """
        return self.bucket.list()


class SwiftProvider():
    def __init__(self, bucket_name):
        import swiftclient
        s3config = get_s3config()
        self.connection = swiftclient.client.Connection(auth_version=2.0, **s3config['credentials'])
        self.set_bucket(bucket_name)

    def set_bucket(self, bucket_name):
        self.bucket_name = bucket_name
        if not bucket_name:
            self.bucket_name = "molns_bucket_{0}".format(str(uuid.uuid1()))
            bucket = self.provider.create_bucket(self.bucket_name)
        else:
            self.bucket_name = bucket_name
            try:
                bucket = self.connection.get_bucket(bucket_name)
            except:
                try:
                    bucket = self.create_bucket(bucket_name)
                except Exception, e:
                    raise MolnsUtilStorageException("Failed to create/set bucket in the object store." + str(e))

            self.bucket = bucket

    def create_bucket(self, bucket_name):
        bucket = self.connection.put_container(bucket_name)
        return bucket

    def get_all_buckets(self):

        (response, bucket_list) = self.connection.get_account()
        return [b['name'] for b in bucket_list]

    def put(self, object_name, data):
        self.connection.put_object(self.bucket_name, object_name, data)

    def get(self, object_name, validate=False):
        (response, obj) = self.connection.get_object(self.bucket_name, object_name)
        return obj

    def delete(self, object_name):
        self.connection.delete_object(self.bucket_name, object_name)

    def delete_all(self):
        (response, obj_list) = self.connection.get_container(self.bucket_name)
        for obj in obj_list:
            self.connection.delete_object(self.bucket_name, obj['name'])
        return "{0} object deleted".format(len(obj_list))

    def list(self):
        (response, obj_list) = self.connection.get_container(self.bucket_name)
        return [obj['name'] for obj in obj_list]

    def close(self):
        self.connection.close()

    def __del__(self):
        self.close()


class PersistentStorage:
    """
       Provides an abstraction for interacting with the Object Stores
       of the supported clouds.
    """

    def __init__(self, bucket_name=None):
        s3config = get_s3config()
        if bucket_name is None:
            # try reading it from the config file
            try:
                self.bucket_name = s3config['bucket_name']
            except:
                raise MolnsUtilStorageException("Could not find bucket_name in the persistent storage config.")
        else:
            self.bucket_name = bucket_name
        self.provider_type = s3config['provider_type']
        self.initialized = False

    def setup_provider(self):
        if self.initialized:
            return

        if self.provider_type == 'EC2':
            self.provider = S3Provider(self.bucket_name)
        # self.provider = S3Provider()
        elif self.provider_type == 'OpenStack':
            self.provider = SwiftProvider(self.bucket_name)
        else:
            raise MolnsUtilStorageException("Unknown provider type '{0}'.".format(self.provider_type))
        self.initialized = True

    def list_buckets(self):
        self.setup_provider()
        all_buckets = self.provider.get_all_buckets()
        buckets = []
        for bucket in all_buckets:
            buckets.append(bucket.name)
        return buckets

    def set_bucket(self, bucket_name=None):
        self.setup_provider()
        if not bucket_name:
            bucket = self.provider.create_bucket("molns_bucket_{0}".format(str(uuid.uuid1())))
        else:
            try:
                bucket = self.provider.get_bucket(bucket_name)
            except:
                try:
                    bucket = self.provider.create_bucket(bucket_name)
                except Exception, e:
                    raise MolnsUtilStorageException("Failed to create/set bucket in the object store: " + str(e))

        self.bucket = bucket

    def put(self, name, data):
        self.setup_provider()
        self.provider.put(name, cloudpickle.dumps(data))

    def get(self, name, validate=False):
        self.setup_provider()
        return cloudpickle.loads(self.provider.get(name, validate))

    def delete(self, name):
        """ Delete an object. """
        self.setup_provider()
        self.provider.delete(name)

    def list(self):
        """ List all containers. """
        self.setup_provider()
        return self.provider.list()

    def delete_all(self):
        """ Delete all objects in the global storage area. """
        self.setup_provider()
        self.provider.delete_all()


class CachedPersistentStorage(PersistentStorage):
    def __init__(self, bucket_name=None):
        PersistentStorage.__init__(self, bucket_name)
        self.cache = LocalStorage(folder_name="/mnt/molnsarea/cache")

    def get(self, name, validate=False):
        self.setup_provider()
        # Try to read it form cache
        try:
            data = cloudpickle.loads(self.cache.get(name))
        except:  # if not there, read it from the Object Store and write it to the cache
            data = cloudpickle.loads(self.provider.get(name, validate))
            try:
                self.cache.put(name, data)
            except:
                # For now, we just ignore errors here, like if the disk is full...
                pass
        return data

# TODO: Extend the delete methods so that they also delete the file from cache
# TODO: Implement clear_cache(self) - delete all files from Local Cache.
