export STOCHKIT_HOME:=../../..
include ../../../.make/makefile.c
include ../../../.make/dependency.h
include ../../../.make/src4obj.h

OBJS = Reactant.o Reactants.o ElementaryReaction.o buildDependencyGraph.o convertXMLtoModel.o AlternateStoichiometry.o AlternateStoichiometries.o IndependentVirtualFastProcess.o MasterVirtualFastProcess.o createConservationMatrix.o writeEquilibriumCode.o ReversiblePair.o ForwardFrequencyEstimate.o Groups.o IVFP_version_for_ode.o SlowScaleSSA.o PartitionOptimizer.o
CC = g++
CFLAGS = -O3 -Wall -c
INCLUDE_FILES = -I../../../libs/boost_1_42_0 -I../../utility -I../../model_parser  -I/usr/include/libxml2 -I../../output
#LFLAGS = -O3 -Wall -lgsl -lginac -lcblas -lxml2 -L$(STOCHKIT_HOME)/libs/boost_1_42_0/stage/lib -lboost_system
#do I need gsl and cblas?
LFLAGS = -Wall -lgsl -lginac -lgslcblas -lxml2 -L$(STOCHKIT_HOME)/libs/boost_1_42_0/stage/lib -lboost_system

ssssa: ssssa_automatic.cpp $(OBJS)
	cp ssssa_script ../../../ssssa
	$(CXX) ssssa_automatic.cpp $(OBJS) $(RANDOM_OBJ) $(PARAMETER_OBJ) $(INPUT_OBJ) $(STD_DRIVER_UT_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(PARALLEL_INTERVAL_OBJ) -o ../../../bin/ssssa $(ALLOPTIONS) $(LFLAGS)

ssssa_auto_custom_compiled: $(OBJS)
	$(CXX) $(RANDOM_OBJ) $(PARAMETER_OBJ) $(INPUT_OBJ) $(STD_DRIVER_UT_OBJ) $(COMMAND_LINE_INTERFACE_OBJ) $(PARALLEL_INTERVAL_OBJ) $(OBJS) $(GENERATED_CODE_PATH)/ivfp_functions.cpp $(GENERATED_CODE_PATH)/full_model_functions.cpp $(GENERATED_CODE_PATH)/ssssa_auto_custom_serial.cpp -o $(GENERATED_CODE_PATH)/bin/ssssa_auto_custom_compiled -I$(GENERATED_CODE_PATH) -I. $(ALLOPTIONS) -lcln -lginac -lgsl -lgslcblas

IVFP_version_for_ode.o: IVFP_version_for_ode.h IVFP_version_for_ode.cpp
	$(CC) $(CFLAGS) $(INCLUDE_FILES) IVFP_version_for_ode.cpp -c

ForwardFrequencyEstimate.o: ForwardFrequencyEstimate.h ForwardFrequencyEstimate.cpp
	$(CC) $(CFLAGS) $(INCLUDE_FILES) ForwardFrequencyEstimate.cpp -c

PartitionOptimizer.o: PartitionOptimizer.h PartitionOptimizer.cpp
	$(CC) $(CFLAGS) $(INCLUDE_FILES) PartitionOptimizer.cpp -c

Groups.o: ReversiblePair.o Groups.h Groups.cpp createConservationMatrix.h
	$(CC) $(CFLAGS) $(INCLUDE_FILES) Groups.cpp -c

ReversiblePair.o: ReversiblePair.h ReversiblePair.cpp
	$(CC) $(CFLAGS) $(INCLUDE_FILES) ReversiblePair.cpp -c

#ReversibleMultiple.o: ReversibleMultiple.h ReversibleMultiple.cpp
#	$(CC) $(CFLAGS) $(INCLUDE_FILES) ReversibleMultiple.cpp -c

writeEquilibriumCode.o: writeEquilibriumCode.h writeEquilibriumCode.cpp
	$(CC) $(INCLUDE_FILES) writeEquilibriumCode.cpp -c

createConservationMatrix.o: createConservationMatrix.h createConservationMatrix.cpp
	$(CC) $(INCLUDE_FILES) createConservationMatrix.cpp -c

#Partition.o: Partition.h Partition.cpp
#	$(CC) $(CFLAGS) $(INCLUDE_FILES) Partition.cpp

Reactant.o: Reactant.h Reactant.cpp
	$(CC) $(CFLAGS) $(INCLUDE_FILES) Reactant.cpp

Reactants.o: Reactants.cpp Reactants.h Reactant.h
	$(CC) $(CFLAGS) $(INCLUDE_FILES) Reactants.cpp

ElementaryReaction.o: ElementaryReaction.cpp ElementaryReaction.h Reactants.h
	$(CC) $(CFLAGS) $(INCLUDE_FILES) ElementaryReaction.cpp

buildDependencyGraph.o: buildDependencyGraph.h buildDependencyGraph.cpp
	$(CC) $(CFLAGS) $(INCLUDE_FILES) buildDependencyGraph.cpp

convertXMLtoModel.o: convertXMLtoModel.h convertXMLtoModel.cpp
	$(CC) -DMATRIX_STOICHIOMETRY $(CFLAGS) $(INCLUDE_FILES)  convertXMLtoModel.cpp

AlternateStoichiometry.o: AlternateStoichiometry.cpp AlternateStoichiometry.h
	$(CC) $(CFLAGS) $(INCLUDE_FILES) AlternateStoichiometry.cpp

AlternateStoichiometries.o: AlternateStoichiometries.h AlternateStoichiometries.cpp AlternateStoichiometry.o
	$(CC) $(CFLAGS) $(INCLUDE_FILES) AlternateStoichiometries.cpp

IndependentVirtualFastProcess.o: IndependentVirtualFastProcess.h IndependentVirtualFastProcess.cpp AlternateStoichiometries.o AlternateStoichiometry.o ElementaryReaction.o writeEquilibriumCode.o createConservationMatrix.o ReversiblePair.o
	$(CC) $(CFLAGS) $(INCLUDE_FILES) IndependentVirtualFastProcess.cpp

MasterVirtualFastProcess.o: IndependentVirtualFastProcess.o ForwardFrequencyEstimate.o MasterVirtualFastProcess.h MasterVirtualFastProcess.cpp Groups.o Reactants.h
	$(CC) $(CFLAGS) $(INCLUDE_FILES) MasterVirtualFastProcess.cpp

SlowScaleSSA.o: SlowScaleSSA.h SlowScaleSSA.cpp IndependentVirtualFastProcess.o ElementaryReaction.o PartitionOptimizer.o MasterVirtualFastProcess.o
	$(CC) $(CFLAGS) $(INCLUDE_FILES) SlowScaleSSA.cpp

clean:
	\rm *.o *~
