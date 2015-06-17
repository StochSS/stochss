import boto.dynamodb
from base_db import BaseDB
from boto.dynamodb import condition
import logging
import traceback


class DynamoDB(BaseDB):
    def __init__(self, access_key, secret_key):
        try:
            self.access_key = access_key
            self.secret_key = secret_key

        except Exception, e:
            logging.error("DynamoDB init failed with error : {0}".format(str(e)))

    def describetask(self, taskids, tablename):
        res = {}
        try:
            logging.debug('describetask: taskids = {0} and tablename {1}'.format(str(taskids), tablename))

            dynamo = boto.connect_dynamodb(aws_access_key_id=self.access_key,
                                           aws_secret_access_key=self.secret_key)

            if not self.tableexists(tablename):
                return res

            table = dynamo.get_table(tablename)
            if not isinstance(taskids, list):
                taskids = [taskids]
            for taskid in taskids:
                try:
                    item = table.get_item(hash_key=taskid)
                    res[taskid] = item
                except Exception, e:
                    logging.error(str(e))
                    res[taskid] = None
            return res

        except Exception, e:
            logging.error("exiting describetask  with error : {0}".format(str(e)))
            return res

    def removetask(self, tablename, taskid):
        logging.debug('inside removetask method with tablename = {0} and taskid = {1}'.format(tablename, taskid))
        try:
            dynamo = boto.connect_dynamodb(aws_access_key_id=self.access_key,
                                           aws_secret_access_key=self.secret_key)

            if self.tableexists(tablename):
                table = dynamo.get_table(tablename)
                item = table.get_item(hash_key=taskid)
                item.delete()
                return True

            else:
                logging.debug('exiting removetask with error : table doesn\'t exists')
                return False

        except Exception, e:
            logging.error('exiting removetask with error {0}'.format(str(e)))
            return False

    def remove_tasks_by_attribute(self, tablename, attribute_name, attribute_value):
        logging.debug('remove_tasks_by_attribute: tablename = {0} attribute_name = {1} attribute_value = {2}'.format(tablename,
                                                                                                  attribute_name,
                                                                                                  attribute_value))
        try:
            dynamo = boto.connect_dynamodb(aws_access_key_id=self.access_key,
                                           aws_secret_access_key=self.secret_key)

            if self.tableexists(tablename):
                table = dynamo.get_table(tablename)
                results = table.scan(scan_filter={attribute_name :condition.EQ(attribute_value)})
                for result in results:
                    result.delete()
                return True

            else:
                logging.debug('exiting removetask with error : table doesn\'t exists')
                return False

        except Exception, e:
            logging.error('exiting removetask with error {0}'.format(str(e)))

    def createtable(self, tablename):
        logging.debug('inside create table method with tablename :: {0}'.format(tablename))

        if tablename == None:
            raise Exception('Please provide valid tablename!')

        try:
            logging.debug('connecting to dynamodb')
            dynamo = boto.connect_dynamodb(aws_access_key_id=self.access_key,
                                           aws_secret_access_key=self.secret_key)

            # check if table already exisits
            logging.debug('checking if table {0} exists'.format(tablename))

            if not self.tableexists(tablename):
                logging.debug('creating table schema')
                myschema = dynamo.create_schema(hash_key_name='taskid', hash_key_proto_value=str)
                dynamo.create_table(name=tablename, schema=myschema, read_units=6, write_units=4)

            else:
                logging.debug("table already exists")

            return True

        except Exception, e:
            logging.error('createtable failed with error {0}'.format(str(e)))
            return False

    def tableexists(self, tablename):
        logging.debug('Checking if table {0} exists!'.format(tablename))
        #logging.error(traceback.format_exc())
        traceback.print_stack()
        try:
            dynamo = boto.connect_dynamodb(aws_access_key_id=self.access_key,
                                           aws_secret_access_key=self.secret_key)
            tables = dynamo.list_tables()

            if tablename not in tables:
                logging.debug("table with name: {0} doesn't exist!".format(tablename))
                return False
            else:
                return True

        except Exception, e:
            logging.exception('tableexists failed with error {0}'.format(e))
            return False

    def getEntry(self, attribute_name=str(), attribute_value=str(), table_name=str()):
        try:
            dynamo = boto.connect_dynamodb(aws_access_key_id=self.access_key,
                                           aws_secret_access_key=self.secret_key)

            if not self.tableexists(table_name):
                self.createtable(table_name)

            table = dynamo.get_table(table_name)
            results = table.scan(scan_filter={attribute_name: condition.EQ(attribute_value)})
            return results

        except Exception, e:
            logging.error('exiting getEntry with error {0}'.format(str(e)))
            return None


    def updateEntry(self, taskid=str(), data=dict(), tablename=str()):
        '''
         check if entry exists
         create a entry if not or
         update the status
        '''
        try:
            logging.debug('inside update entry method with taskid = {0} and data = {1}'.format(taskid, str(data)))
            dynamo = boto.connect_dynamodb(aws_access_key_id=self.access_key,
                                           aws_secret_access_key=self.secret_key)

            if not self.tableexists(tablename):
                self.createtable(tablename)

            table = dynamo.get_table(tablename)
            if table.has_item(hash_key=str(taskid)):
                item = table.get_item(hash_key=str(taskid))
                item.update(data)
                item.put()
            else:
                item = table.new_item(hash_key=str(taskid), attrs=data)
                item.put()

            return True

        except Exception, e:
            logging.error('exiting updatedata with error : {0}'.format(str(e)))
            return False
