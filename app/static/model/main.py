#!/usr/bin/env python

from twisted.web.server import Site
from twisted.web.resource import Resource
import twisted.web.static

if __name__ != '__main__':
    from twisted.internet import reactor

import cgi
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot
import numpy
import os
import pickle
import shutil
import StringIO
import subprocess
import sys
import tempfile
import threading

# Change directory into folder where this file lives
path = os.path.abspath(os.path.dirname(__file__))

# The first array will hold our job data, the second will hold tuples of (thread, threading.Event) that can be used to controll the execution
if os.path.exists('{0}/data'.format(path)):
    dataF = open('{0}/data'.format(path), 'r')
    model_ids_generator, models = pickle.load(dataF)
    dataF.close()
else:
    model_ids_generator = [0] # Ask me why this is an array sometime
    models = {}

def clean_up():
    dataFile = open('{0}/data'.format(path), 'w')
    pickle.dump((model_ids_generator, models), dataFile)
    dataFile.close()
    
    return

class modelStorage(Resource):
    # This needs to be here for Twisted to let this server blob respond to /sim/a as well as just /sim. Otherwise it looks for a child server at 'a'
    isLeaf = True
    # Get requests are used to respond with information about the state of the system. The responses are usually the full models elements. That is part of the backbone design element
    def render_GET(self, request):
        req = request.uri.split('/')[-1]

        print 'read', request.uri

        request.setHeader("Content-Type", "application/json")
        if req == 'list':
            return json.dumps(models.values())
        else:
            return json.dumps(models[int(req)])

    # Post requests post data to the server... That corresponds logically to an rpc call
    def render_POST(self, request):
        model = json.loads(request.content.read())
        model["id"] = model_ids_generator[0]
        models[model["id"]] = model

        model_ids_generator[0] = model_ids_generator[0] + 1

        print 'CREATE', model["id"]

        request.setHeader("Content-Type", "application/json")
        return json.dumps(model)

    # Post requests post data to the server... That corresponds logically to an rpc call
    def render_PUT(self, request):
        req = request.uri.split('/')[-1]

        modelId = int(req)
        model = json.loads(request.content.read())
        models[modelId] = model

        print 'UPDATE', req, model["id"]

        if modelId != model["id"]:
            raise Exception("modelId must be equal to model id stored in db")

        request.setHeader("Content-Type", "application/json")
        return json.dumps(model)

    # Respond to the delete requests
    def render_DELETE(self, request):
 
        model_id = request.uri.split('/')[-1]

        print 'DELETE', str(int(model_id))

        models.pop(int(model_id))

        request.setHeader("Content-Type", "application/json")
        return json.dumps([])

def attachTo(root):
    modelFiles = twisted.web.static.File(path)
    modelFiles.putChild('list', modelStorage())
    root.putChild('model', modelFiles)

    # When the webserver shuts down, call the clean_up function
    reactor.addSystemEventTrigger('after', 'shutdown', clean_up)

# Start the little webserver if run as main
if __name__ == "__main__":
    root = twisted.web.static.File(path)

    attachTo(root)

    factory = Site(root)
    reactor.listenTCP(8088, factory)
    reactor.run()
