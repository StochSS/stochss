import logging
import os
import pprint
import mysql.connector
from contextlib import closing

from base_db import BaseDB
from backend.common.config import JobDatabaseConfig


class FlexDB(BaseDB):
    DATABASE_NAME = JobDatabaseConfig.DATABASE_NAME
    STOCHSS_TABLE_NAME = JobDatabaseConfig.TABLE_NAME

    DB_CONNECT_TIMEOUT = 5

    TABLE_FIELD_NAMES = {
        JobDatabaseConfig.TABLE_NAME: ('taskid', 'infrastructure', 'message', 'output',
                                       'pid', 'uuid', 'start_time', 'status', 'time_taken',
                                        'total_time', 'execution_time', 'queue'),
        JobDatabaseConfig.COST_ANALYSIS_TABLE_NAME: ('taskid', 'agent', 'instance_type', 'message',
                                                     'start_time', 'status', 'time_taken', 'uuid')
    }

    def __init__(self, password, ip, username='root', port=3306):
        self.table_exists = None
        try:
            self.username = username
            self.password = password
            self.ip = ip
            self.port = port

        except Exception, e:
            logging.error("FlexDB init failed  with error : {0}".format(str(e)))

    def __open_db_connection(self):
        return mysql.connector.connect(host=self.ip, user=self.username, passwd=self.password,
                                       db=self.DATABASE_NAME,
                                       connect_timeout=self.DB_CONNECT_TIMEOUT)

    def describetask(self, taskids, tablename):
        logging.debug('describetask: taskids = {0} tablename = {1}'.format(taskids, tablename))

        db = None
        results = {}
        save_e = None


        try:
            if len(taskids) > 0 and self.tableexists(tablename):
                if isinstance(taskids, list):
                    logging.debug("describetask() list taskids = '{0}'".format(taskids))
                    taskid_list = "({})".format(','.join(map(lambda x: "'{}'".format(x), taskids)))
                else:
                    logging.debug("describetask() not-list taskids = '{0}'".format(taskids))
                    taskid_list = "({})".format(','.join(map(lambda x: "'{}'".format(x), [taskids])))

                db = self.__open_db_connection()
                rows = ()
                num_rows = 0
                with closing(db.cursor()) as db_cursor:
                    sql = "SELECT * FROM `{table}` WHERE taskid IN {taskid_list};".format(table=tablename,
                                                                                          taskid_list=taskid_list)
                    logging.debug("sql = {}".format(sql))

                    db_cursor.execute(sql)

                    field_name_index_map = {field[0]: index for index, field in enumerate(db_cursor.description)}
                    rows = db_cursor.fetchall()

                if len(rows) > 0:
                    for row in rows:
                        result = {}
                        for field_name in self.TABLE_FIELD_NAMES[tablename]:
                            result[field_name] = row[field_name_index_map[field_name]]

                        results[result['taskid']] = result

                logging.debug('Successfully fetched data from database.')

        except Exception, e:
            logging.error("describetask  with error : {0}".format(str(e)))
            save_e = e
        finally:
            if db:
                db.close()
        if save_e is not None:
            raise save_e
        return results

    def removetask(self, tablename, taskid):
        logging.debug('removetask: tablename = {0}, taskid = {1}'.format(tablename, taskid))
        result = False
        db = None
        save_e = None
        try:
            if self.tableexists(tablename):
                db = self.__open_db_connection()
                with closing(db.cursor()) as db_cursor:
                    sql = "DELETE FROM `{tablename}` WHERE taskid = '{taskid}';".format(tablename=tablename,
                                                                                        taskid=taskid)
                    logging.debug("sql = {}".format(sql))

                    db_cursor.execute(sql)
                db.commit()

                logging.debug('removetask successful!')
                result = True

            else:
                logging.debug('exiting removetask with error : table doesn\'t exists')

        except Exception, e:
            logging.error('exiting removetask with error {0}'.format(str(e)))
            save_e = e
        finally:
            if db:
                db.close()
        if save_e is not None:
            raise save_e
        return result

    def createtable(self, tablename):
        logging.debug('createtable: tablename = {0}'.format(tablename))
        result = False
        db = None
        save_e = None

        try:
            logging.debug('checking if table {0} exists'.format(tablename))

            if not self.tableexists(tablename):
                logging.debug('creating table schema')
                stochss_db_schema_filename = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                                                          'flex_db_schema.sql'))
                with open(stochss_db_schema_filename) as fin:
                    create_schema_sql = fin.read().replace('\n', ' ')

                logging.debug('create_schema_sql =\n{}'.format(create_schema_sql))

                db = self.__open_db_connection()
                with closing(db.cursor()) as db_cursor:
                    db_cursor.execute(create_schema_sql, multi=True)
                db.commit()

                logging.debug('StochSS Schema creation successful!')

            else:
                logging.debug("table already exists")

            result = True

        except Exception as e:
            logging.error('exiting createtable with error {0}'.format(str(e)))
            save_e = e

        finally:
            if db:
                db.close()
        if save_e is not None:
            raise save_e
        return result

    def tableexists(self, tablename):
        if self.table_exists is not None:
            return self.table_exists
        logging.debug('Checking if table {0} exists!'.format(tablename))
        result = False
        db = None
        save_e = None

        try:
            db = self.__open_db_connection()

            with closing(db.cursor()) as db_cursor:
                db_cursor.execute("SHOW TABLES LIKE '{}';".format(tablename))
                results = db_cursor.fetchall()

            tables_in_db = map(lambda x:x[0], results)
            if tablename in tables_in_db:
                logging.debug('Table {} exists!'.format(tablename))
                result = True
            else:
                logging.debug("Table with name: {0} doesn't exist!".format(tablename))

        except Exception as e:
            logging.error('tableexists failed with error {0}'.format(str(e)))
            save_e = e
        finally:
            if db:
                db.close()
        if save_e is not None:
            raise save_e
        self.table_exists = result
        return result


    def getEntry(self, attribute_name, attribute_value, table_name):
        logging.debug('getEntry: attribute_name = {0} attribute_value = {1} table_name = {2}'.format(attribute_name,
                                                                                                    attribute_value,
                                                                                                    table_name))
        db = None
        results = None
        save_e = None
        try:
            if attribute_name != None and attribute_value != None and \
                            attribute_name != '' and attribute_value != '' and self.tableexists(table_name):

                db = self.__open_db_connection()
                rows = ()
                num_rows = 0
                with closing(db.cursor()) as db_cursor:
                    sql = "SELECT * FROM `{table_name}` WHERE {attribute_name} = '{attribute_value}';".format(
                        table_name=table_name,
                        attribute_name=attribute_name,
                        attribute_value=attribute_value)
                    logging.debug("sql = {}".format(sql))

                    db_cursor.execute(sql)

                    field_name_index_map = {field[0]: index for index, field in enumerate(db_cursor.description)}
                    rows = db_cursor.fetchall()

                if len(rows) > 0:
                    results = []
                    for row in rows:
                        result = {}
                        for field_name in self.TABLE_FIELD_NAMES[table_name]:
                            result[field_name] = row[field_name_index_map[field_name]]

                        results.append(result)

                logging.debug('Successfully fetched data from database.')

        except Exception, e:
            logging.error('exiting getEntry with error {0}'.format(str(e)))
            results = None
            save_e = e
        finally:
            if db:
                db.close()
        if save_e is not None:
            raise save_e
        return results


    def updateEntry(self, taskid, data, tablename):
        logging.debug('updateEntry: taskid = {0} tablename = {1}'.format(taskid, tablename))
        logging.debug("data =\n{}".format(pprint.pformat(data)))

        db = None
        result = False
        save_e = None

        try:
            update_field_list = ", ".join(map(lambda x: "`{x}`=VALUES(`{x}`)".format(x=x), data.keys()))

            data['taskid'] = taskid
            logging.debug('data =\n{}'.format(pprint.pformat(data)))

            field_name_list = "({})".format(','.join(map(lambda x: "`{}`".format(x),
                                                         self.TABLE_FIELD_NAMES[tablename])))
            logging.debug('field_name_list = {}'.format(field_name_list))

            field_values = [data.get(field_name, '').replace("'", "[quote]")
                                    if isinstance(data.get(field_name, ''), basestring)
                                    else data.get(field_name, '')
                                        for field_name in self.TABLE_FIELD_NAMES[tablename]]

            field_value_list = "({})".format(','.join(map(lambda x: "'{}'".format(x),
                                                          field_values)))

            logging.debug('field_value_list = {}'.format(field_value_list))


            db = self.__open_db_connection()
            with closing(db.cursor()) as db_cursor:
                sql = "INSERT INTO `{tablename}` {field_name_list} VALUES {field_value_list} ON DUPLICATE KEY UPDATE {update_field_list};".format(
                    tablename=tablename,
                    field_name_list=field_name_list,
                    field_value_list=field_value_list,
                    update_field_list=update_field_list)
                logging.debug("sql = {}".format(sql))

                db_cursor.execute(sql)
            db.commit()

            logging.debug("updateEntry is successful!")
            result = True

        except Exception, e:
            logging.error('updateEntry error : {0}'.format(str(e)))
            save_e = e
        finally:
            if db:
                db.close()
        if save_e is not None:
            raise save_e
        return result
