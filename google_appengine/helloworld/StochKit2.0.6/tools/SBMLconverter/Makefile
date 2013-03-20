CXX		=g++
CFLAG=-g -O3 -Wall -lsbml -lxml2 -lstdc++ -lz -lm
# INCLUDE_PATH is the path to libsmbl and libxml2 include folers. Replace the following path by your own path.
LIBSBML_PATH=/usr/local/include
LIBXML_PATH=/usr/include/libxml2
INCLUDE_PATH=-I$(LIBSBML_PATH) -I$(LIBXML_PATH)
# LIBSBML_LINK and LIBXML2_LINK are the path of libsbml and libxml2 lib folders. Replace the following path by your own path.
LINK_SEARCH_PATH=-L/usr/local/lib

all: CVT

CVT: readSBML.cpp output.h
	$(CXX) $(CFLAG) -o ./bin/sbml2stochkit readSBML.cpp $(LINK_SEARCH_PATH) $(INCLUDE_PATH) 
clean: 
	rm -f sbml2stochkit
