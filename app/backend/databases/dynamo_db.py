'''
Created on Dec 11, 2014

@author: gumengyuan
'''
import boto.dynamodb
from base_db import BaseDB

class DynamoDB(BaseDB):
    """
    All DynamoBD related methods follow next. TODO: move it to a different file
    """

    def describetask(self, taskids,tablename):
        res = {}
        try:
            print 'inside describetask method with taskids = {0} and tablename {1}'.format(str(taskids), tablename)
            dynamo=boto.connect_dynamodb()
            if not self.tableexists(dynamo, tablename): return res
            table = dynamo.get_table(tablename)
            for taskid in taskids:
                try:
                    item = table.get_item(hash_key=taskid)
                    res[taskid] = item
                except Exception,e:
                    res[taskid] = None
            return res
        except Exception,e:
            print "exiting describetask  with error : {0}".format(str(e))
            print str(e)
            return res

    def removetask(self, tablename,taskid):
        print 'inside removetask method with tablename = {0} and taskid = {1}'.format(tablename, taskid)
        try:
            dynamo=boto.connect_dynamodb()#boto.dynamodb.connect_to_region('us-east-1')
            if self.tableexists(dynamo, tablename):
                table = dynamo.get_table(tablename)
                item = table.get_item(hash_key=taskid)
                item.delete()
                return True
            else:
                print 'exiting removetask with error : table doesn\'t exists'
                return False      
        except Exception,e:
            print 'exiting removetask with error {0}'.format(str(e))
            return False
    
    def createtable(self, tablename=str()):
        print 'inside create table method with tablename :: {0}'.format(tablename)
        if tablename == None:
            tablename = "stochss"
            print 'default table name picked as stochss'
        try:
            print 'connecting to dynamodb'
            dynamo=boto.connect_dynamodb()#boto.dynamodb.connect_to_region('us-east-1')
            #check if table already exisits
            print 'checking if table {0} exists'.format(tablename)
            if not self.tableexists(dynamo,tablename):
                print 'creating table schema'
                myschema=dynamo.create_schema(hash_key_name='taskid',hash_key_proto_value=str)
                table=dynamo.create_table(name=tablename, schema=myschema, read_units=6, write_units=4)
            else:
                print "table already exists"
            return True  
        except Exception,e:
            print str(e)
            return False

    def tableexists(self, dynamo, tablename):
        try:
            table = dynamo.get_table(tablename)
            if table == None:
                print "table doesn't exist"
                return False
            else:
                return True
        except Exception,e:
            print str(e)
            return False

    def updateEntry(self, taskid=str(), data=dict(), tablename=str()):
        '''
         check if entry exists
         create a entry if not or
         update the status
        '''
        try:
            print 'inside update entry method with taskid = {0} and data = {1}'.format(taskid, str(data))
            dynamo=boto.connect_dynamodb()
            if not self.tableexists(dynamo, tablename):
                self.createtable(tablename)
#             print "invalid table name specified"
#             return False
            table = dynamo.get_table(tablename)
            if table.has_item(hash_key=str(taskid)):
                item = table.get_item(hash_key=str(taskid))
                item.update(data)
                item.put()
            else:
                item = table.new_item(hash_key=str(taskid),attrs=data)
                item.put()
            return True
        except Exception,e:
            print 'exiting updatedata with error : {0}'.format(str(e))
            return False