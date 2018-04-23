from setuptools import setup

setup(name="pyurdme",
      version="1.1.1",
      packages=['pyurdme'],
      
      #include_package_data = True,
      package_data={'pyurdme':['data/*.c','data/three.js_templates/js/*','data/three.js_templates/*.html','urdme/AUTHORS','urdme/LICENCE','urdme/bin/*','urdme/build/*','urdme/include/*','urdme/src/*.c','urdme/src/nsm/*']},
      
      install_requires = ["numpy",
                          "scipy",
                          "h5py"],
      
      author="Andreas Hellander, Brian Drawert",
      author_email=["andreas.hellander@gmail.com", "briandrawert@gmail.com"],
      license = "GPL",
      keywords = "pyurdme, urdme, spatial stochastic simulation, RDME",
      url = "http://www.pyurdme.org",
      download_url = "https://github.com/pyurdme/pyurdme/tarball/master/v1.1.1"
      
      )
      
