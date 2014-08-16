try:
  import json
except ImportError:
  from django.utils import simplejson as json
from google.appengine.ext import db
import pickle
import traceback
import random
import logging
import time
from google.appengine.api import users

from stochss.model import *
from stochss.stochkit import *
from stochss.examplemodels import *

import webapp2

class ObjectProperty(db.Property):
    """  A db property to store objects. """

    def get_value_for_datastore(self, model_instance):
        result = super(ObjectProperty, self).get_value_for_datastore(model_instance)
        result = pickle.dumps(result)
        return db.Blob(result)

    def make_value_from_datastore(self, value):
        if value is None:
            return None
        return pickle.loads(value)

    def empty(self, value):
        return value is None


class StochKitModelWrapper(db.Model):
    """
    A wrapper for the StochKit Model object
    """
    user_id = db.StringProperty()
    model_name = db.StringProperty()    
    model = ObjectProperty()
    attributes = ObjectProperty()
    is_public = db.BooleanProperty()
