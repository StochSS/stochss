import json
import sys
import logging


def checkUserOrRaise(self):
    user = self.current_user
    if user is None:
        user = self.get_current_user_oauth_token()
        if user is None:
            raise web.HTTPError(403)

