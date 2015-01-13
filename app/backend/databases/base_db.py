'''
Created on Dec 11, 2014

@author: gumengyuan
'''

class BaseDB:
    def describetask(self, taskids,tablename):
        
        raise NotImplementedError
    
    def removetask(self, tablename,taskid):
        
        raise NotImplementedError
    
    def createtable(self, tablename=str()):
        
        raise NotImplementedError
    
    def tableexists(self, dynamo, tablename):
        
        raise NotImplementedError
    
    def updateEntry(self, taskid=str(), data=dict(), tablename=str()):
        
        raise NotImplementedError