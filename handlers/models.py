# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web
import json
import docker
client = docker.from_env()

from handlers.db_util import _db, checkUserOrRaise

import logging
log = logging.getLogger()
 
class ModelAPIGetAllOrPostHandlers(BaseHandler):

    @web.authenticated
    async def get(self, user):
        checkUserOrRaise(self)
        db = _db(self.settings)
        r = db.get_models_by_user(username=user)
        self.set_header('Content-Type', 'application/json')
        self.write(r)

    @web.authenticated
    async def post(self, user):
        checkUserOrRaise(self)
        db = _db(self.settings)
        self.set_header('Content-Type', 'application/json')
        data = json.loads(self.request.body)
        model_json = db.insert_model(data)
        self.write(model_json)


class ModelAPIHandler(BaseHandler):
    
    @web.authenticated
    async def get(self, model_id):
        checkUserOrRaise(self)
        db = _db(self.settings)
        r = db.get_model_by_model_id(model_id=model_id)
        if not r:
            raise web.HTTPError(404)
        self.set_header('Content-Type', 'application/json')
        self.write(r)

    @web.authenticated
    async def put(self, model_id):
        checkUserOrRaise(self)
        db = _db(self.settings)
        self.set_header('Content-Type', 'application/json')
        data = json.loads(self.request.body)
        model_json = db.update_model(data)
        self.write(model_json)

    @web.authenticated
    async def delete(self, model_id):
        checkUserOrRaise(self)
        db = _db(self.settings)
        self.set_header('Content-Type', 'application/json')
        model_json = db.delete_model(model_id)
        self.write(model_json)


class ModelFileAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, modelName):
        checkUserOrRaise(self)
        user = self.current_user.name
        log.debug('jupyter-{0}'.format(user))
        container = client.containers.list(filters={'name': 'jupyter-{0}'.format(user)})[0]
        filePath = "/srv/jupyterhub/templates/nonspatialTemplate.json"
        with open(filePath, 'r') as jsonFile:
            data = jsonFile.read()
            jsonData = json.loads(str(data))
            container.exec_run(cmd="echo {0} > {1}.json".format(jsonData, modelName))
            self.write(jsonData)
