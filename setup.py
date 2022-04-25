'''
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

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

# =============================================================================
# @file    __version__.py
# @brief   StochSS version info
# @license Please see the file named LICENSE in the project directory
# @website https://github.com/stochss/stochss
# =============================================================================

import os
import setuptools


# Read the contents of auxiliary files.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SETUP_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(SETUP_DIR, 'README.md'), 'r') as f:
    readme = f.read()

# The following reads the variables without doing an "import handprint",
# because the latter will cause the python execution environment to fail if
# any dependencies are not already installed -- negating most of the reason
# we're using setup() in the first place.  This code avoids eval, for security.

version = {}
with open(os.path.join(SETUP_DIR, '__version__.py'), 'r') as f:
    text = f.read().rstrip().splitlines()
    lines = [line for line in text if line.startswith('__') and '=' in line]
    for v in lines:
        setting = v.split('=')
        version[setting[0].strip()] = setting[1].strip().replace("'", '')


# Finally, define our namesake.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

setuptools.setup(
    name=version['__title__'].lower(),
    version=version['__version__'],
    author=version['__author__'],
    author_email=version['__email__'],
    description=version['__description__'],
    long_description=readme,
    long_description_content_type="text/markdown",
    url=version['__url__'],
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
