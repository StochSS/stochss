from google.appengine.ext import db
import sys

class ExportJobWrapper(db.Model):
    user_id = db.StringProperty()
    startTime = db.StringProperty()
    status = db.StringProperty()
    outData = db.StringProperty()

    def delete(self):
        try:
            os.remove(self.outData)
        except Exception as e:
            sys.stderr.write("ExportJobWrapper.delete(): {0}\n".format(e))
        super(ExportJobWrapper, self).delete()
