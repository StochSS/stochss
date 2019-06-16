
from ..db_util import DatabaseManager


def _db(settings):
    url = settings['config']['StochSS']['db_url']
    db = DatabaseManager(url)
    return db

def checkUserOrRaise(self):
    user = self.current_user
    if user is None:
        user = self.get_current_user_oauth_token()
        if user is None:
            raise web.HTTPError(403)

