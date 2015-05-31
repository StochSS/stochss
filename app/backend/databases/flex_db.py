__author__ = 'Dibyendu Nath'
__email__ = 'dnath@cs.ucsb.edu'

import logging
import os
import pprint
import MySQLdb
from contextlib import closing

from base_db import BaseDB
from backend.common.config import JobDatabaseConfig


class FlexDB(BaseDB):
    DATABASE_NAME = JobDatabaseConfig.DATABASE_NAME
    STOCHSS_TABLE_NAME = JobDatabaseConfig.TABLE_NAME

    DB_CONNECT_TIMEOUT = 5

    TABLE_FIELD_NAMES = {
        JobDatabaseConfig.TABLE_NAME: ('taskid', 'infrastructure', 'message', 'output',
                                       'pid', 'uuid', 'start_time', 'status', 'time_taken'),
        JobDatabaseConfig.COST_ANALYSIS_TABLE_NAME: ('taskid', 'agent', 'instance_type', 'message',
                                                     'start_time', 'status', 'time_taken', 'uuid')
    }

    def __init__(self, password, ip, username='root', port=3306):
        try:
            self.username = username
            self.password = password
            self.ip = ip
            self.port = port

        except Exception, e:
            logging.error("FlexDB init failed  with error : {0}".format(str(e)))

    def __open_db_connection(self):
        return MySQLdb.connect(host=self.ip, user=self.username, passwd=self.password,
                               db=self.DATABASE_NAME,
                               connect_timeout=self.DB_CONNECT_TIMEOUT)

    def describetask(self, taskids, tablename):
        logging.info('describetask: taskids = {0} tablename = {1}'.format(taskids, tablename))

        db = None
        results = {}

        try:
            if len(taskids) > 0 and self.tableexists(tablename):
                taskid_list = "({})".format(','.join(map(lambda x: "'{}'".format(x), taskids)))

                db = self.__open_db_connection()
                rows = ()
                num_rows = 0
                with closing(db.cursor()) as db_cursor:
                    sql = "SELECT * FROM `{table}` WHERE taskid IN {taskid_list};".format(table=tablename,
                                                                                          taskid_list=taskid_list)
                    logging.info("sql = {}".format(sql))

                    num_rows = db_cursor.execute(sql)
                    logging.info("Number of rows fetched: {}".format(num_rows))

                    field_name_index_map = {i[0]: i for i in db_cursor.description}
                    rows = db_cursor.fetchall()

                if num_rows > 0 and rows != ():
                    for row in rows:
                        result = {}
                        for field_name in self.TABLE_FIELD_NAMES[tablename]:
                            result[field_name] = row[field_name_index_map[field_name]]

                        results[result['taskid']] = result

                logging.info('Successfully fetched data from database.')

        except Exception, e:
            logging.error("describetask  with error : {0}".format(str(e)))

        finally:
            if db:
                db.close()

        return results

    def removetask(self, tablename, taskid):
        logging.info('removetask: tablename = {0}, taskid = {1}'.format(tablename, taskid))
        result = False
        db = None

        try:
            if self.tableexists(tablename):
                db = self.__open_db_connection()
                with closing(db.cursor()) as db_cursor:
                    sql = "DELETE FROM `{tablename}` WHERE taskid = '{taskid}';".format(tablename=tablename,
                                                                                        taskid=taskid)
                    logging.info("sql = {}".format(sql))

                    db_cursor.execute(sql)
                db.commit()

                logging.info('removetask successful!')
                result = True

            else:
                logging.info('exiting removetask with error : table doesn\'t exists')

        except Exception, e:
            logging.error('exiting removetask with error {0}'.format(str(e)))

        finally:
            if db:
                db.close()

        return result

    def createtable(self, tablename):
        logging.info('createtable: tablename = {0}'.format(tablename))
        result = False
        db = None

        try:
            logging.info('checking if table {0} exists'.format(tablename))

            if not self.tableexists(tablename):
                logging.info('creating table schema')
                stochss_db_schema_filename = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                                          'flex_db_schema.sql'))
                with open(stochss_db_schema_filename) as fin:
                    create_schema_sql = fin.read().replace('\n', ' ')

                logging.info('create_schema_sql =\n{}'.format(create_schema_sql))

                db = self.__open_db_connection()
                with closing(db.cursor()) as db_cursor:
                    db_cursor.execute(create_schema_sql)
                db.commit()

                logging.info('StochSS Schema creation successful!')

            else:
                logging.info("table already exists")

            result = True

        except Exception, e:
            logging.error('exiting createtable with error {0}'.format(str(e)))

        finally:
            if db:
                db.close()

        return result

    def tableexists(self, tablename):
        logging.debug('Checking if table {0} exists!'.format(tablename))
        result = False
        db = None

        try:
            db = self.__open_db_connection()

            db.query("SHOW TABLES LIKE '{}';".format(tablename))
            tables = db.store_result()

            row = tables.fetch_row()

            if row != () and row[0][0] == tablename:
                logging.info('Table {} exists!'.format(tablename))
                result = True
            else:
                logging.info("Table with name: {0} doesn't exist!".format(tablename))

        except Exception as e:
            logging.error('tableexists failed with error {0}'.format(str(e)))

        finally:
            if db:
                db.close()

        return result


    def getEntry(self, attribute_name, attribute_value, table_name):
        logging.info('getEntry: attribute_name = {0} attribute_value = {1} table_name = {2}'.format(attribute_name,
                                                                                                    attribute_value,
                                                                                                    table_name))
        db = None
        results = None
        try:
            if attribute_name != None and attribute_value != None and \
                            attribute_name != '' and attribute_value != '' and self.tableexists(table_name):

                db = self.__open_db_connection()
                rows = ()
                num_rows = 0
                with closing(db.cursor()) as db_cursor:
                    sql = "SELECT * FROM `{table_name}` WHERE {attribute_name} = {attribute_value};".format(
                        table_name=table_name,
                        attribute_name=attribute_name,
                        attribute_value=attribute_value)
                    logging.info("sql = {}".format(sql))

                    num_rows = db_cursor.execute(sql)
                    logging.info("Number of rows fetched: {}".format(num_rows))

                    field_name_index_map = {i[0]: i for i in db_cursor.description}
                    rows = db_cursor.fetchall()

                if num_rows > 0 and rows != ():
                    results = []
                    for row in rows:
                        result = {}
                        for field_name in self.TABLE_FIELD_NAMES[table_name]:
                            result[field_name] = row[field_name_index_map[field_name]]

                        results.append(result)

                logging.info('Successfully fetched data from database.')

        except Exception, e:
            logging.error('exiting getEntry with error {0}'.format(str(e)))
            results = None

        finally:
            if db:
                db.close()

        return results


    def updateEntry(self, taskid, data, tablename):
        logging.info('updateEntry: taskid = {0} tablename = {1}'.format(taskid, tablename))
        logging.info("data =\n{}".format(pprint.pformat(data)))

        db = None
        result = False

        try:
            field_name_list = "({})".format(','.join(map(lambda x: "`{}`".format(x),
                                                         self.TABLE_FIELD_NAMES[tablename])))
            field_values = [data.get(field_name, '') for field_name in self.TABLE_FIELD_NAMES[tablename]]

            field_value_list = "({})".format(','.join(map(lambda x: "'{}'".format(x),
                                                          field_values)))

            db = self.__open_db_connection()
            with closing(db.cursor()) as db_cursor:
                sql = "REPLACE INTO `{tablename}` {field_name_list} VALUES {field_value_list};".format(
                    tablename=tablename,
                    field_name_list=field_name_list,
                    field_value_list=field_value_list)
                logging.info("sql = {}".format(sql))

                db_cursor.execute(sql)
            db.commit()

            logging.info("updateEntry is successful!")
            result = True

        except Exception, e:
            logging.error('updateEntry error : {0}'.format(str(e)))

        finally:
            if db:
                db.close()

        return result