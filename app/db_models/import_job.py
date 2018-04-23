from google.appengine.ext import db
import sys

class ImportJobWrapper(db.Model):
    user_id = db.StringProperty()
    status = db.StringProperty()
    zipFile = db.StringProperty()
    headerFile = db.StringProperty()

    def delete(self):
        try:
            os.remove(self.zipFile)
        except Exception as e:
            sys.stderr.write("ImportJobWrapper.delete(): {0}\n".format(e))
        try:
            os.remove(self.headerFile)
        except Exception as e:
            sys.stderr.write("ImportJobWrapper.delete(): {0}\n".format(e))
        super(ImportJobWrapper, self).delete()
