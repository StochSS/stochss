# Configuration file for jupyterhub.

#---------------------------------------------------------------------------------------------------
# Application(SingletonConfigurable) configuration
#---------------------------------------------------------------------------------------------------

## This is an application.

## The date format used by logging formatters for %(asctime)s
#c.Application.log_datefmt = '%Y-%m-%d %H:%M:%S'

## The Logging format template
#c.Application.log_format = '[%(name)s]%(highlevel)s %(message)s'

## Set the log level by value or name.
#c.Application.log_level = 30

#---------------------------------------------------------------------------------------------------
# JupyterHub(Application) configuration
#---------------------------------------------------------------------------------------------------
import os
import os.path
import sys
import re

sys.path.append('/srv/jupyterhub/') # pylint: disable=wrong-import-position

# API Handlers
from model_presentation import JsonFileAPIHandler, DownModelPresentationAPIHandler
from notebook_presentation import NotebookAPIHandler, DownNotebookPresentationAPIHandler
from job_presentation import (
    JobAPIHandler, DownJobPresentationAPIHandler, PlotJobResultsAPIHandler, DownloadCSVAPIHandler
)
# Page handlers
from handlers import (
    HomeHandler, JobPresentationHandler, ModelPresentationHandler, NotebookPresentationHandler,
    MultiplePlotsHandler
)

## Class for authenticating users.
#
#          This should be a subclass of :class:`jupyterhub.auth.Authenticator`
#
#          with an :meth:`authenticate` method that:
#
#          - is a coroutine (asyncio or tornado)
#          - returns username on success, None on failure
#          - takes two arguments: (handler, data),
#            where `handler` is the calling web.RequestHandler,
#            and `data` is the POST form data from the login page.
#
#          .. versionchanged:: 1.0
#              authenticators may be registered via entry points,
#              e.g. `c.JupyterHub.authenticator_class = 'pam'`
#
#  Currently installed:
#    - default: jupyterhub.auth.PAMAuthenticator
#    - dummy: jupyterhub.auth.DummyAuthenticator
#    - pam: jupyterhub.auth.PAMAuthenticator
# Use the dummy authenticator for dev
c.JupyterHub.authenticator_class = os.environ['AUTH_CLASS']
c.GoogleOAuthenticator.oauth_callback_url = os.environ['OAUTH_CALLBACK']
c.GoogleOAuthenticator.client_id = os.environ['CLIENT_ID']
c.GoogleOAuthenticator.client_secret = os.environ['CLIENT_SECRET']

# Persist hub data on volume mounted inside container
data_dir = os.environ.get('DATA_VOLUME_CONTAINER', '/data')

c.JupyterHub.cookie_secret_file = os.path.join(data_dir,
        'jupyterhub_cookie_secret')

c.JupyterHub.db_url = 'postgresql://postgres:{password}@{host}/{db}'.format(
        host=os.environ['POSTGRES_HOST'],
        password=os.environ['POSTGRES_PASSWORD'],
        db=os.environ['POSTGRES_DB'],
)

## An Application for starting a Multi-User Jupyter Notebook server.

sys.path.insert(1, '.')

c.JupyterHub.log_level = 'DEBUG'

## The default URL for users when they arrive (e.g. when user directs to "/")
#
#  By default, redirects users to their own server.
c.JupyterHub.default_url = '/stochss'

# StochSS request handlers
c.JupyterHub.extra_handlers = [
        (r"/stochss\/?", HomeHandler),
        (r"/stochss/present-job\/?", JobPresentationHandler),
        (r"/stochss/present-model\/?", ModelPresentationHandler),
        (r"/stochss/present-notebook\/?", NotebookPresentationHandler),
        (r"/stochss/multiple-plots\/?", MultiplePlotsHandler),
        (r"/stochss/api/file/json-data\/?", JsonFileAPIHandler),
        (r"/stochss/download_presentation/(\w+)/(.+)\/?", DownModelPresentationAPIHandler),
        (r"/stochss/api/notebook/load\/?", NotebookAPIHandler),
        (r"/stochss/notebook/download_presentation/(\w+)/(.+)\/?",
         DownNotebookPresentationAPIHandler),
        (r"/stochss/api/job/load\/?", JobAPIHandler),
        (r"/stochss/job/download_presentation/(\w+)/(.+)\/?", DownJobPresentationAPIHandler),
        (r"/stochss/api/workflow/plot-results\/?", PlotJobResultsAPIHandler),
        (r"/stochss/api/job/csv\/?", DownloadCSVAPIHandler)
]

## Paths to search for jinja templates, before using the default templates.
c.JupyterHub.template_paths = [
        '/srv/jupyterhub/templates'
]

## The class to use for spawning single-user servers.
#
#          Should be a subclass of :class:`jupyterhub.spawner.Spawner`.
#
#          .. versionchanged:: 1.0
#              spawners may be registered via entry points,
#              e.g. `c.JupyterHub.spawner_class = 'localprocess'`
#
#  Currently installed:
#    - default: jupyterhub.spawner.LocalProcessSpawner
#    - localprocess: jupyterhub.spawner.LocalProcessSpawner
#    - simple: jupyterhub.spawner.SimpleLocalProcessSpawner
c.JupyterHub.spawner_class = 'dockerspawner.DockerSpawner'

## The ip address for the Hub process to *bind* to.
#
#  By default, the hub listens on localhost only. This address must be accessible
#  from the proxy and user servers. You may need to set this to a public ip or ''
#  for all interfaces if the proxy or user servers are in containers or on a
#  different host.
#
#  See `hub_connect_ip` for cases where the bind and connect address should
#  differ, or `hub_bind_url` for setting the full bind URL.
c.JupyterHub.hub_ip = os.environ.get('DOCKER_HUB_IMAGE')

## The internal port for the Hub process.
#
#  This is the internal port of the hub itself. It should never be accessed
#  directly. See JupyterHub.port for the public port to use when accessing
#  jupyterhub. It is rare that this port should be set except in cases of port
#  conflict.
#
#  See also `hub_ip` for the ip and `hub_bind_url` for setting the full bind URL.
c.JupyterHub.hub_port = 8080

## Services managed by JupyterHub
c.JupyterHub.services = [
        {
                'name': 'cull-idle',
                'admin': True,
                'command': [sys.executable, '/srv/jupyterhub/cull_idle_servers.py',
                            '--timeout=28800'],
        }
]

#---------------------------------------------------------------------------------------------------
# Dockerspawner configuration
#---------------------------------------------------------------------------------------------------

c.DockerSpawner.image = os.environ['DOCKER_STOCHSS_IMAGE']
# JupyterHub requires a single-user instance of the Notebook server, so we
# default to using the `start-singleuser.sh` script included in the
# jupyter/docker-stacks *-notebook images as the Docker run command when
# spawning containers.  Optionally, you can override the Docker run command
# using the DOCKER_SPAWN_CMD environment variable.
SPAWN_CMD = "start-singleuser.sh"
c.DockerSpawner.extra_create_kwargs.update({ 'command': SPAWN_CMD })
# Connect containers to this Docker network
network_name = os.environ['DOCKER_NETWORK_NAME']
c.DockerSpawner.use_internal_ip = True
c.DockerSpawner.network_name = network_name
# Pass the network name as argument to spawned containers
# Pass cpu limit as extra config since dockerspawner does not natively support it
c.DockerSpawner.extra_host_config = {
    'network_mode': network_name,
}
# Explicitly set notebook directory because we'll be mounting a host volume to
# it.  Most jupyter/docker-stacks *-notebook images run the Notebook server as
# user `jovyan`, and set the notebook directory to `/home/jovyan/work`.
# We follow the same convention.
notebook_dir = os.environ.get('DOCKER_NOTEBOOK_DIR') or '/home/jovyan/work'
c.DockerSpawner.notebook_dir = notebook_dir
# Mount the real user's Docker volume on the host to the notebook user's
# notebook directory in the container
c.DockerSpawner.volumes = { 'jupyterhub-user-{username}': notebook_dir }
# Set extra environment variables
c.DockerSpawner.environment = {
    'JUPYTER_CONFIG_DIR': os.environ['JUPYTER_CONFIG_DIR']
}
# Remove containers once they are stopped
c.DockerSpawner.remove_containers = True
# For debugging arguments passed to spawned containers
c.DockerSpawner.debug = True

#---------------------------------------------------------------------------------------------------
# Spawner(LoggingConfigurable) configuration
#---------------------------------------------------------------------------------------------------

def get_user_cpu_count_or_fail():
    '''
    Get the user cpu count or raise error.
    '''
    reserve_count = int(os.environ['RESERVED_CPUS'])
    # Round up to an even number of reserved cpus
    total_cpus = os.cpu_count()
    if total_cpus <= 2:
        c.StochSS.reserved_cpu_count = 0
        return 0
    if reserve_count % 2 > 0:
        message = "Increasing reserved cpu count by one so it's an even number."
        message += " This helps allocate logical cpus to users more easily."
        reserve_count += 1
    if reserve_count >= total_cpus:
        e_message = "RESERVED_CPUS environment cannot be greater than or equal to the number of"
        e_message += " cpus returned by os.cpu_count()"
        raise ValueError(e_message)
    user_cpu_count = total_cpus - reserve_count
    # If (num logical cpus) - (num reserved cpus) is odd,
    # use one less logical cpu for allocating user cpus
    if user_cpu_count % 2 > 0 and user_cpu_count > 1:
        user_cpu_count -= 1
    c.StochSS.reserved_cpu_count = reserve_count
    return user_cpu_count

c.StochSS.user_cpu_count = get_user_cpu_count_or_fail()
c.StochSS.user_cpu_alloc = [0] * c.StochSS.user_cpu_count

def pre_spawn_hook(spawner):
    '''
    Function that runs before DockerSpawner spawns a user container.
    Limits the resources available to user containers, excluding a list of power users.
    '''
    log = spawner.log

    log.info(f"Beginning pre_spawn_hook for {spawner.user.name}")
    # Remove the memory limit for power users
    if c.StochSS.user_cpu_count == 0:
        spawner.mem_limit = None
        msg = 'Skipping resource limitations since the host machine has a limited number of cpus.'
        log.info(msg)
        return
    user_type = None
    for elem in blacklist:
        if elem.startswith('@'):
            log.info(f"Checking for domain affiliation: {elem}")
            if elem in spawner.user.name:
                post_message_to_slack('User {} of banned domain {} attempted to log in'.format(spawner.user.name, elem), blocks = None)
                raise Exception('User banned')
        else:
            log.info(f"Checking for user: {elem}")
            if elem == spawner.user.name or re.search(elem, spawner.user.name) is not None:
                post_message_to_slack('Banned user {} attempted to log in'.format(spawner.user.name), blocks = None)
                raise Exception('User banned')

    if spawner.user.name in c.Authenticator.admin_users:
        log.info(f"Setting usertype for {spawner.user.name} to 'admin'")
        user_type = 'admin'
    elif spawner.user.name in c.StochSS.power_users:
        log.info(f"Setting usertype for {spawner.user.name} to 'power'")
        user_type = 'power'
    print(post_message_to_slack(f"New Login: {spawner.user.name} user_type={user_type}"))
    if user_type:
        spawner.mem_limit = None
        log.info(f'Skipping resource limitation for {user_type} user: {spawner.user.name}')
        return
    palloc = c.StochSS.user_cpu_alloc
    div = len(palloc) // 2
    reserved = c.StochSS.reserved_cpu_count
    log.debug(f'Reserved CPUs: {reserved}')
    log.debug(f'Number of user containers using each logical core: {palloc}')
    # We want to allocate logical cores that are on the same physical core
    # whenever possible.
    #
    # A hyper-threaded 4-core processor has 8 logical cpus, with
    # two logical cpus per core. Logical cpus on the same cpu core are grouped
    # such that if (#, #) represents two logical cpus on a single physical core,
    # then the logical cores in this case are indexed on the system like this:
    #
    #   (1, 5), (2, 6), (3, 7), (4, 8)
    #
    # To allocate two logical cpus per user container, we find the logical cpu that
    # is being used by the least number of users in the first half of an
    # array tracking which users are using what logical cores.
    #
    # The general formula for finding the index of the second logical core
    #  on the same physical core is then:
    #
    #   index(matching logical core) =
    #           index(chosen logical core) + ( (number of logical cores) / 2 )
    #
    avail_cpus = palloc[div:]
    # If <= 4 cpus available then use 1 cpu for each user instead of 2
    if not avail_cpus:
        message = "The host system only has 4 logical cpus, so we'll only reserve"
        message += " one logical cpu per user container, instead of the normal 2"
        log.warning(message)
        avail_cpus = palloc
        least_used_cpu = min(avail_cpus)
        cpu1_index = avail_cpus.index(least_used_cpu)
        log.info(f"User {spawner.user.name} to use logical cpu {cpu1_index}")
        palloc[cpu1_index] += 1
        spawner.extra_host_config['cpuset_cpus'] = f'{cpu1_index}'
    else:
        least_used_cpu = min(avail_cpus)
        cpu1_index = avail_cpus.index(least_used_cpu)
        palloc[cpu1_index] += 1
        cpu2_index = cpu1_index+div
        palloc[cpu2_index] += 1
        log.info(f"User {spawner.user.name} to use logical cpus {cpu1_index} and {cpu2_index}")
        spawner.extra_host_config['cpuset_cpus'] = f'{cpu1_index},{cpu2_index}'


def post_stop_hook(spawner):
    '''
    Post stop hook
    '''
    log = spawner.log
    reserved = c.StochSS.reserved_cpu_count
    if reserved == 0:
        return
    palloc = c.StochSS.user_cpu_alloc
    try:
        cpu1_index, cpu2_index = spawner.extra_host_config['cpuset_cpus'].split(',')
        palloc[int(cpu1_index)] -= 1
        palloc[int(cpu2_index)] -= 1
        log.warning(f'Reserved CPUs: {reserved}')
        log.warning(f'Number of user containers using each logical core: {palloc}')
    except Exception as err:
        message = "Exception thrown due to cpuset_cpus not being set (power user)"
        log.error(f"{message}\n{err}")
        pass

c.Spawner.pre_spawn_hook = pre_spawn_hook
c.Spawner.post_stop_hook = post_stop_hook

## The URL the single-user server should start in.
#
#  `{username}` will be expanded to the user's username
#
#  Example uses:
#
#  - You can set `notebook_dir` to `/` and `default_url` to `/tree/home/{username}` to allow people
#    to navigate the whole filesystem from their notebook server, but still start in their home
#    directory.
#  - Start with `/notebooks` instead of `/tree` if `default_url` points to a notebook instead of a
#    directory.
#  - You can set this to `/lab` to have JupyterLab start by default, rather than Jupyter Notebook.
c.Spawner.default_url = '/stochss/models'

## Maximum number of bytes a single-user notebook server is allowed to use.
#
#  Allows the following suffixes:
#    - K -> Kilobytes
#    - M -> Megabytes
#    - G -> Gigabytes
#    - T -> Terabytes
#
#  If the single user server tries to allocate more memory than this, it will
#  fail. There is no guarantee that the single-user notebook server will be able
#  to allocate this much memory - only that it can not allocate more than this.
#
#  **This is a configuration setting. Your spawner must implement support for the
#  limit to work.** The default spawner, `LocalProcessSpawner`, does **not**
#  implement this support. A custom spawner **must** add support for this setting
#  for it to be enforced.
c.Spawner.mem_limit = '4G'

## Maximum number of cpu-cores a single-user notebook server is allowed to use.
#
#  If this value is set to 0.5, allows use of 50% of one CPU. If this value is
#  set to 2, allows use of up to 2 CPUs.
#
#  The single-user notebook server will never be scheduled by the kernel to use
#  more cpu-cores than this. There is no guarantee that it can access this many
#  cpu-cores.
#
#  **This is a configuration setting. Your spawner must implement support for the
#  limit to work.** The default spawner, `LocalProcessSpawner`, does **not**
#  implement this support. A custom spawner **must** add support for this setting
#  for it to be enforced.
#c.Spawner.cpu_limit = 2

## Extra arguments to be passed to the single-user server.
#
#  Some spawners allow shell-style expansion here, allowing you to use
#  environment variables here. Most, including the default, do not. Consult the
#  documentation for your spawner to verify!
#c.Spawner.args = []

## The command used for starting the single-user server.
#
#  Provide either a string or a list containing the path to the startup script
#  command. Extra arguments, other than this path, should be provided via `args`.
#
#  This is usually set if you want to start the single-user server in a different
#  python environment (with virtualenv/conda) than JupyterHub itself.
#
#  Some spawners allow shell-style expansion here, allowing you to use
#  environment variables. Most, including the default, do not. Consult the
#  documentation for your spawner to verify!
#c.Spawner.cmd = ['jupyterhub-singleuser']

## Minimum number of cpu-cores a single-user notebook server is guaranteed to
#  have available.
#
#  If this value is set to 0.5, allows use of 50% of one CPU. If this value is
#  set to 2, allows use of up to 2 CPUs.
#
#  **This is a configuration setting. Your spawner must implement support for the
#  limit to work.** The default spawner, `LocalProcessSpawner`, does **not**
#  implement this support. A custom spawner **must** add support for this setting
#  for it to be enforced.
## Not supported by dockerspawner yet
#c.Spawner.cpu_guarantee = 1

## Minimum number of bytes a single-user notebook server is guaranteed to have
#  available.
#
#  Allows the following suffixes:
#    - K -> Kilobytes
#    - M -> Megabytes
#    - G -> Gigabytes
#    - T -> Terabytes
#
#  **This is a configuration setting. Your spawner must implement support for the
#  limit to work.** The default spawner, `LocalProcessSpawner`, does **not**
#  implement this support. A custom spawner **must** add support for this setting
#  for it to be enforced.
c.Spawner.mem_guarantee = '2G'

#---------------------------------------------------------------------------------------------------
# Authenticator(LoggingConfigurable) configuration
#---------------------------------------------------------------------------------------------------

## Base class for implementing an authentication provider for JupyterHub

## Set of users that will have admin rights on this JupyterHub.
#
#  Admin users have extra privileges:
#   - Use the admin panel to see list of users logged in
#   - Add / remove users in some authenticators
#   - Restart / halt the hub
#   - Start / stop users' single-user servers
#   - Can access each individual users' single-user server (if configured)
#
#  Admin access should be treated the same way root access is.
#
#  Defaults to an empty set, in which case no user has admin access.
c.Authenticator.admin_users = admin = set([])
c.StochSS.power_users = power_users = set([])
c.StochSS.blacklist = blacklist = set([])

pwd = os.path.dirname(__file__)
with open(os.path.join(pwd, 'userlist')) as f:
    lines = f.read().strip().split("\n")
    for line in lines:
        parts = line.split()
        if len(parts) > 1:
            name = parts[0]
            if parts[1] == 'admin':
                admin.add(name)
                power_users.add(name)
            elif parts[1] == 'power':
                power_users.add(name)
            elif parts[1] == 'blacklist':
                blacklist.add(name)



# Slack integration
import requests
import json

# slack access bot token
slack_user_name = "StochSS Live Bot"                                             
slack_channel = "#stochss-live"
slack_icon_emoji = ':red_circle:'
slack_token = None
try:
    with open(".slack_bot_token",'r') as fd:
        slack_token = fd.readline().strip()                                          
except:
    pass

def post_message_to_slack(text, blocks = None):
    global slack_token, slack_channel, slack_icon_emoji, slack_user_name         
    if slack_token is None: return
    return requests.post('https://slack.com/api/chat.postMessage', {             
        'token': slack_token,                                                    
        'channel': slack_channel,
        'text': text,
        'icon_emoji': slack_icon_emoji,
        'username': slack_user_name,                                             
        'blocks': json.dumps(blocks) if blocks else None                         
    }).json()


