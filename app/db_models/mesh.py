from google.appengine.ext import db

import sys

from db_models.object_property import ObjectProperty

#right here

class MeshWrapper(db.Model):
    user_id = db.StringProperty()
    name = db.StringProperty()
    description = db.TextProperty()
    meshFileId = db.IntegerProperty()
    subdomains = ObjectProperty()
    uniqueSubdomains = ObjectProperty()
    volumes = ObjectProperty()
    boundingBox = ObjectProperty()
    undeletable = db.BooleanProperty()
    ghost = db.BooleanProperty()

    def toJSON(self, reduced = True):
        return { "user_id" : self.user_id,
                 "name" : self.name,
                 "description" : self.description,
                 "meshFileId" : self.meshFileId,
                 "subdomains" : self.subdomains if not reduced else [],
                 "volumes" : self.volumes,
                 "boundingBox" : self.boundingBox,
                 "uniqueSubdomains" : self.uniqueSubdomains,
                 "undeletable" : bool(self.undeletable),
                 "ghost" : bool(self.ghost),
                 "id" : self.key().id() }

    def delete(self):
        try:
            fileserver.FileManager.deleteFile(self, self.meshFileId)
        except IOError as error:
            sys.stderr.write('Failed to delete meshFile {0} in meshwrapper destructor\n'.format(self.meshFileId))

        super(MeshWrapper, self).delete()
