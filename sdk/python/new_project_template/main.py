#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
from google.appengine.api import backends
from mybackend import BackendHandler
from google.appengine.api import backends, urlfetch, taskqueue

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!\n')
        #r = requests.get('/_ah/start', auth=('user', 'pass'))
        #resp, content = httplib2.Http().request("/_ah/start")
        #r = self.request.get("/_ah/start")
        #self.response.write('alread sent a request to start the backend.\n')
        #self.response.write('response: [%s]'%(r))
        url = backends.get_url('backendthread') + '/backend'
        result = urlfetch.fetch(url)
        
        #taskqueue.add(url=url, target='backendthread')
        self.response.write('Response:%s'%(result.status_code))



app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/backend', BackendHandler),
], debug=True)
