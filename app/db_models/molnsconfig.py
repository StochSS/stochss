from google.appengine.ext import db

import os

class MolnsConfigWrapper(db.Model):
    """
    A container for the per user MolnsConfig object
    """
    user_id = db.StringProperty()
    folder = db.StringProperty()
    path = db.StringProperty()

    def delete(self):
        if self.path:
            if os.path.exists(self.path):
                os.remove(self.path)

        try:
            os.remove(self.folder)
        except:
            pass

        super(MolnsConfigWrapper, self).delete()

class MolnsConfigProcessWrapper(db.Model):
    """
    A container for the per user MolnsConfig object
    """
    user_id = db.StringProperty()
    outPath = db.StringProperty()
    stdout = db.StringProperty()
    stderr = db.StringProperty()
    stdout_seek = db.IntegerProperty()
    stderr_seek = db.IntegerProperty()
    return_code = db.StringProperty()
    pid = db.IntegerProperty()

    def delete(self):
        if self.stdout:
            if os.path.exists(self.stdout):
                os.remove(self.stdout)

        if self.stderr:
            if os.path.exists(self.stderr):
                os.remove(self.stderr)

        if self.return_code:
            if os.path.exists(self.return_code):
                os.remove(self.return_code)

        try:
            os.rmdir(self.outPath)
        except:
            pass

        super(MolnsConfigProcessWrapper, self).delete()

    def is_alive(self):
        if os.path.exists(self.return_code):
            return False
        else:
            # From http://stackoverflow.com/a/568285/3769360
            if type(self.pid) == int:
                try:
                    os.kill(self.pid, 0)
                except OSError:
                    return False
                else:
                    return True
            else:
                return False

    def communicate(self, reset = False):
        if reset == True or type(self.stdout_seek) != long or type(self.stderr_seek) != long:
            self.stdout_seek = 0
            self.stderr_seek = 0

        stdout = ""
        stderr = ""

        if self.stdout:
            if os.path.exists(self.stdout):
                f = open(self.stdout)
                f.seek(self.stdout_seek)
                stdout = f.read()
                self.stdout_seek = f.tell()
                f.close()

        if self.stderr:
            if os.path.exists(self.stderr):
                f = open(self.stderr)
                f.seek(self.stderr_seek)
                stderr = f.read()
                self.stderr_seek = f.tell()
                f.close()

        self.put()
        
        return stdout, stderr
