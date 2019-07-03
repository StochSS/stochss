# Use BaseHandler for page requests since
# the base API handler has some logic that prevents
# requests without a referrer field
from jupyterhub.handlers.base import BaseHandler

from tornado import web

class UsernameHandler(BaseHandler):

    async def get(self):
        user = self.current_user
        print(user)
        if user is None:
            user = self.get_current_user_oauth_token()
            if user is None:
                raise web.HTTPError(403)
        self.set_header('Content-Type', 'application/json')
        self.write({
            'name': user.name
        })


