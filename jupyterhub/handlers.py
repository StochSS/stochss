'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2021 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''

from jupyterhub.handlers.base import BaseHandler

# pylint: disable=abstract-method
# pylint: disable=too-few-public-methods
class HomeHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for rendering jupyterhub home page.
    ################################################################################################
    '''
    async def get(self):
        '''
        Render the jupyterhub home page.

        Attributes
        ----------
        '''
        html = self.render_template("stochss-home.html")
        self.finish(html)


class JobPresentationHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for rendering jupyterhub job presentation page.
    ################################################################################################
    '''
    async def get(self):
        '''
        Render the jupyterhub job presentation page.

        Attributes
        ----------
        '''
        html = self.render_template("stochss-job-presentation.html")
        self.finish(html)


class ModelPresentationHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for rendering jupyterhub model presentation page.
    ################################################################################################
    '''
    async def get(self):
        '''
        Render the jupyterhub model presentation page.

        Attributes
        ----------
        '''
        html = self.render_template("stochss-model-presentation.html")
        self.finish(html)


class NotebookPresentationHandler(BaseHandler):
    '''
    ################################################################################################
    Handler for rendering jupyterhub notebook presentation page.
    ################################################################################################
    '''
    async def get(self):
        '''
        Render the jupyterhub notebook presentation page.

        Attributes
        ----------
        '''
        html = self.render_template("stochss-notebook-presentation.html")
        self.finish(html)
