'''
Created on Dec 11, 2014

@author: gumengyuan
'''


class BaseDB(object):
    def describetask(self, taskids, tablename):
        raise NotImplementedError

    def removetask(self, tablename, taskid):
        raise NotImplementedError

    def createtable(self, tablename):
        raise NotImplementedError

    def tableexists(self, tablename):
        raise NotImplementedError

    def updateEntry(self, taskid, data, tablename):
        raise NotImplementedError