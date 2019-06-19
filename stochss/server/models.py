# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web
import json

from db_util import _db, checkUserOrRaise

import logging
log = logging.getLogger()
 
class UserModelListingsAPIHandler(BaseHandler):

    @web.authenticated
    async def get(self, user):
        checkUserOrRaise(self)
        db = _db(self.settings)
        r = db.get_models_by_user(username=user)
        self.set_header('Content-Type', 'application/json')
        self.write(r)



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
    async def post(self):
        checkUserOrRaise(self)
        db = _db(self.settings)
        self.set_header('Content-Type', 'application/json')
        data = json.loads(self.request.body)
        model_json = db.insert_model(data)
        self.write(model_json)

    @web.authenticated
    async def put(self):
        checkUserOrRaise(self)
        db = _db(self.settings)
        self.set_header('Content-Type', 'application/json')
        data = json.loads(self.request.body)
        model_json = db.update_model(data)
        self.write(model_json)


