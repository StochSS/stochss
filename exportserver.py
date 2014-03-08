#! /usr/bin/python
import os

dirname = os.path.dirname(__file__)

dev_appserver_path = os.path.join(dirname, "sdk/python/dev_appserver.py")
datastore_path = os.path.join(dirname, "mydatastore")

start_app_string = "python {0} --datastore_path=mydatastore app2".format(dev_appserver_path)
os.system(start_app_string)