Installing PyURDME
==================

pyurdme is a modeling and simulation toolkit for spatial stochastic simulations. It makes use of a modified version of the core solver of URDME (www.urdme.org) for mesocopic simulations via the Reaction-Diffusion Master Equation (RDME), and builds on Dolfin/FeniCS (http://fenicsproject.org) for geometric modeling, meshing and Finite Element Assembly.   

Currently supported (tested) platforms are MacOSX >= 10.8 and Ubuntu >= 12.04.   

Dependencies
---------------

To install and use pyurdme, you need to satisfy the following dependencies. Below we point at suggested ways to satisfy them for OSX and Ubuntu. 

- GCC: http://gcc.gnu.org/
    * Ubuntu:
        * ``sudo apt-get install gcc``
    * OSX:
        * We recommend installing Xcode: https://developer.apple.com/xcode/.

- FEniCS: http://fenicsproject.org/
    * Ubuntu:
        * ``sudo apt-get install fenics``
    * OSX: 
        * We recommend using the binary installer provided here: http://fenicsproject.org/download/osx_details.html
- numpy, scipy, matplotlib:  http://www.scipy.org/
   * Ubuntu: 
      * ``sudo apt-get install python-numpy python-scipy python-matplotlib``
   * OSX: 
      * We recommend using the installer provided by http://fonnesbeck.github.io/ScipySuperpack/

- h5py: http://www.h5py.org/
   * Ubuntu:
      * ``sudo apt-get intall python-h5py``
   * OSX:
      * ``sudo brew install h5py``


Note: We strongly recommend using the appropriate package manager or binary installer for your platform to satisfy the above dependencies. However, we understand that some users prefer a non-system-wide installation of python packages, such as if using virtualenv. If one of the above listed dependencies is not satisfied, setuptools will try to install it from the PyPI index. For numpy, scipy, matplotlib, h5py this involves building from source. Due to the many non-python dependencies, you will likely need to install development versions of certain libraries (such as freetype and libpng). An easy way to satisfy the dependencies for Ubuntu is

.. code-block:: bash

   sudo apt-get install build-dep python-numpy python-scipy python-matplotlib

If you do not mind system-wide installations, we provide a script to install all dependecies for Ubuntu, see detailed instructions below. 

Installation
------------

Ubuntu
^^^^^^

For Ubuntu, we provide a script that will install pyurdme and all dependecies. The install script must be run as root

.. code-block:: bash

   git clone https://github.com/pyurdme/pyurdme
   cd pyurdme
   sudo ./install_ubuntu.sh

If you want to manage the dependencies yourself, after installing them do:

.. code-block:: bash

   git clone https://github.com/pyurdme/pyurdme.git
   cd pyurdme
   sudo python setup.py install 

or simply 

.. code-block:: bash

   sudo pip install https://github.com/pyurdme/pyurdme/tarball/master

OSX
^^^

.. code-block:: bash

   git clone https://github.com/pyurdme/pyurdme.git
   cd pyurdme
   sudo python setup.py install 

or simply:

.. code-block:: bash

   sudo pip install https://github.com/pyurdme/pyurdme/tarball/master

