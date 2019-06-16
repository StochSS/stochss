# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web
import json

from ._util import _db, checkUserOrRaise


class UserModelListingsAPIHandler(BaseHandler):

    async def get(self):
        checkUserOrRaise(self)
        db = _db(self.settings)
        r = db.get_models_by_user(username='popensesame')
        self.set_header('Content-Type', 'application/json')
        self.write(r)


class ModelAPIHandler(BaseHandler):

    async def get(self, model_id):
        checkUserOrRaise(self)
        db = _db(self.settings)
        r = db.get_model_by_model_id(model_id=model_id)
        if not r:
            raise web.HTTPError(404)
        self.set_header('Content-Type', 'application/json')
        self.write(r)

    async def post(self):
        checkUserOrRaise(self)
        db = _db(self.settings)
        self.set_header('Content-Type', 'application/json')
        data = json.loads(self.request.body)
        model_json = db.insert_model(data)
        self.write(model_json)

    async def put(self):
        checkUserOrRaise(self)
        db = _db(self.settings)
        self.set_header('Content-Type', 'application/json')
        data = json.loads(self.request.body)
        model_json = db.update_model(data)
        self.write(model_json)


