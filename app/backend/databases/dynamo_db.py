'''
Created on Dec 11, 2014

@author: gumengyuan
'''
import boto.dynamodb
from base_db import BaseDB
from boto.dynamodb import condition
import logging

class DynamoDB(BaseDB):
    """
    All DynamoBD related methods follow next. TODO: move it to a different file
    """
    
    def __init__(self, access_key, secret_key):
        try:
            self.access_key = access_key
            self.secret_key = secret_key
        except Exception,e:
            logging.error("exiting initialization of DynamoDB  with error : {0}".format(str(e)))

    def describetask(self, taskids,tablename):
        res = {}
        try:
            logging.info('inside describetask method with taskids = {0} and tablename {1}'.format(str(taskids), tablename))
            dynamo=boto.connect_dynamodb(aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key)
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
            logging.error("exiting describetask  with error : {0}".format(str(e)))
            return res

    def removetask(self, tablename,taskid):
        logging.info('inside removetask method with tablename = {0} and taskid = {1}'.format(tablename, taskid))
        try:
            dynamo=boto.connect_dynamodb(aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key)#boto.dynamodb.connect_to_region('us-east-1')
            if self.tableexists(dynamo, tablename):
                table = dynamo.get_table(tablename)
                item = table.get_item(hash_key=taskid)
                item.delete()
                return True
            else:
                logging.info('exiting removetask with error : table doesn\'t exists')
                return False      
        except Exception,e:
            logging.error('exiting removetask with error {0}'.format(str(e)))
            return False
    
    def createtable(self, tablename=str()):
        logging.info('inside create table method with tablename :: {0}'.format(tablename))
        if tablename == None:
            tablename = "stochss"
            logging.info('default table name picked as stochss')
        try:
            logging.info('connecting to dynamodb')
            dynamo=boto.connect_dynamodb(aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key)#boto.dynamodb.connect_to_region('us-east-1')
            #check if table already exisits
            logging.info('checking if table {0} exists'.format(tablename))
            if not self.tableexists(dynamo,tablename):
                logging.info( 'creating table schema')
                myschema=dynamo.create_schema(hash_key_name='taskid',hash_key_proto_value=str)
                table=dynamo.create_table(name=tablename, schema=myschema, read_units=6, write_units=4)
            else:
                logging.info( "table already exists")
            return True  
        except Exception,e:
            logging.error('exiting createtable with error {0}'.format(str(e)))
            return False

    def tableexists(self, dynamo, tablename):
        try:
            tables = dynamo.list_tables()
            
            if tablename not in tables:
                logging.info( "table doesn't exist")
                return False
            else:
                return True
        except Exception,e:
            logging.error('exiting tableexists with error {0}'.format(str(e)))
            return False
    
    def getEntry(self, attribute_name=str(), attribute_value=str(), table_name=str()):
        try:
            dynamo=boto.connect_dynamodb(aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key)
            if not self.tableexists(dynamo, table_name):
                self.createtable(table_name)
        
            table = dynamo.get_table(table_name)
            results = table.scan(scan_filter={attribute_name :condition.EQ(attribute_value)})
            return results
        except Exception,e:
            logging.error('exiting getEntry with error {0}'.format(str(e)))
            return None
            

    def updateEntry(self, taskid=str(), data=dict(), tablename=str()):
        '''
         check if entry exists
         create a entry if not or
         update the status
        '''
        try:
            logging.info( 'inside update entry method with taskid = {0} and data = {1}'.format(taskid, str(data)))
            dynamo=boto.connect_dynamodb(aws_access_key_id=self.access_key, aws_secret_access_key=self.secret_key)
            if not self.tableexists(dynamo, tablename):
                self.createtable(tablename)

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
            logging.error( 'exiting updatedata with error : {0}'.format(str(e)))
            return False