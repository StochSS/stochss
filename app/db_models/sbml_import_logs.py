from google.appengine.ext import db
from db_models.object_property import ObjectProperty

class SBMLImportErrorLogs(db.Model):
    """
    A wrapper for the StochKit Model object
    """
    user_id = db.StringProperty()
    modelId = db.IntegerProperty()
    fileName = db.StringProperty()
    date = db.StringProperty()
    errors = ObjectProperty()
