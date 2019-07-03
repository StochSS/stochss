
import tornado.web as web
from jupyterhub.handlers.base import BaseHandler

class MainHandler(BaseHandler):

    @web.authenticated
    async def get(self):
        html = '<!DOCTYPE html>\n<script src="/hub/static/stochss/app.bundle.js"></script>'
        self.finish(html)


