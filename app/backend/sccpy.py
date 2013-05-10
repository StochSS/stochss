import sys
import boto
import boto.s3
from boto.s3.lifecycle import Lifecycle, Expiration
# AWS ACCESS DETAILS
class s3Agent():
    def uploadfile(self, file, bucketname):
        try :
            uploadfile = file
            bucketname = bucketname
            lifecycle = Lifecycle()
            lifecycle.add_rule('rulename', prefix='logs/', status='Enabled',
                   expiration=Expiration(days=10))
            conn = boto.connect_s3()

            if conn.lookup(bucketname): #bucketexisits
                bucket = conn.get_bucket(bucketname)
            else:
                #create a bucket
                bucket = conn.create_bucket(bucketname, location=boto.s3.connection.Location.DEFAULT)
            bucket.configure_lifecycle(lifecycle)
            from boto.s3.key import Key
            k = Key(bucket)
            k.key = uploadfile
            k.set_contents_from_filename(uploadfile, cb=self.percent_cb, num_cb=10)
            k.set_acl('public-read-write')
        except Exception,e:
            print 'falied {0}'.format(str(e))


    def percent_cb(self,complete, total):
        sys.stdout.write('.')
        sys.stdout.flush()

if __name__ == '__main__':
    file = sys.argv[1]
    bucketname = sys.argv[2]
    import uuid
    obj = s3Agent()
    obj.uploadfile(file, bucketname)