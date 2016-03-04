from stochssapp import BaseHandler
from modeleditor import ModelManager, StochKitModelWrapper
import stochss
import exportimport
import backend.backendservice

from google.appengine.ext import db

import copy
import fileserver
import json
import h5py
import os, sys
import re
import signal
import shlex
import subprocess
import tempfile
import time
import logging
import numbers
import random
import zipfile

import pyurdme
import pickle
import numpy
import traceback
import shutil
import boto
from boto.dynamodb import condition
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/cloudtracker'))
from s3_helper import *

import matplotlib.cm

cm = matplotlib.cm.ScalarMappable()


class VolumePage(BaseHandler):
    # This tells the big server that a user must be logged in to view this page
    def authentication_required(self):
        return True
    
    def get(self):
        self.render_response('volume.html')
