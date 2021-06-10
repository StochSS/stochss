'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

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


class PublishUserModel(BaseHandler):
    '''
    ################################################################################################
    Handler for copying a user model from a user container into a presentations folder
    managed by jupyterhub.
    ################################################################################################
    '''
    async def get(self):
        pass
        # Pass the username as a query parameter
        # username = 
        # Pass the model filename as a query parameter
        # filename = 
        client = docker.from_env()
        containers = client.containers.list()
        user_container = [ c in containers if c.name == f'jupyter-{username}' ][0]
        user_model_path = f'/home/jovyan/.presentations/{filename}'
        jupyterhub_tar_path = f'/srv/jupyterhub/.presentations/{filename}.tar'
        bits, stat = user_container.get_archive(user_model_path)
        with open(jupyterhub_tar_path, 'w') as tar_file:
            for chunk in bits:
                tar_file.write(chunk)


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
