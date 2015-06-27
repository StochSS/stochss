from google.appengine.ext import db
import pickle

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
