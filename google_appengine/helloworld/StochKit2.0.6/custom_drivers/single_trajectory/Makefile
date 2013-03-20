#pull in stuff from main StochKit makefiles
include $(STOCHKIT_HOME)/.make/makefile.c
include $(STOCHKIT_HOME)/.make/dependency.h
include $(STOCHKIT_HOME)/.make/src4obj.h

all: single_trajectory single_trajectory_debug

single_trajectory: ../../src/solvers/SSA_Direct.h ../../src/solvers/SSA_Direct.ipp ./single_trajectory.cpp ./single_trajectory_mixed.cpp ./SimulateSingleTrajectory.h ./SingleTrajectoryCommandLine.o $(OUTPUT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS)
	$(CXX)  ./single_trajectory.cpp $(RANDOM_SRC) $(PARAMETER_SRC) ./SingleTrajectoryCommandLine.o $(INPUT_SRC) -o  ./bin/single_trajectory $(ALLOPTIONS)

single_trajectory_debug: ../../src/solvers/SSA_Direct.h ../../src/solvers/SSA_Direct.ipp ./single_trajectory.cpp ./single_trajectory_mixed.cpp ./SimulateSingleTrajectory.h ./SingleTrajectoryCommandLine.o $(OUTPUT_DEPS) $(RANDOM_DEPS) $(INPUT_DEPS) $(SERIAL_DEPS) $(UTILITY_DEPS)
	$(CXX)  -DDEBUG ./single_trajectory.cpp $(RANDOM_SRC) $(PARAMETER_SRC) ./SingleTrajectoryCommandLine.o $(INPUT_SRC) -o  ./bin/single_trajectory_debug $(ALLOPTIONS)

single_trajectory_compiled: ./CustomPropensityFunctions.h ./SingleTrajectoryCommandLine.o
	$(CXX) -include ./CustomPropensityFunctions.h -DMIXED  $(RANDOM_SRC) $(PARAMETER_SRC) $(INPUT_SRC) ./SingleTrajectoryCommandLine.o ./single_trajectory_mixed.cpp -o ./single_trajectory_compiled $(ALLOPTIONS)

single_trajectory_debug_compiled: ./CustomPropensityFunctions.h ./SingleTrajectoryCommandLine.o
	$(CXX) -DDEBUG -include ./CustomPropensityFunctions.h -DMIXED  $(RANDOM_SRC) $(PARAMETER_SRC) $(INPUT_SRC) ./SingleTrajectoryCommandLine.o ./single_trajectory_mixed.cpp -o ./single_trajectory_debug_compiled $(ALLOPTIONS)

SingleTrajectoryCommandLine.o: ./SingleTrajectoryCommandLine.cpp
	$(CXX) -c ./SingleTrajectoryCommandLine.cpp $(COMPILE_ONLY_OPTIONS)

clean:
	rm -f ./bin/single_trajectory ./single_trajectory_compiled ./bin/single_trajectory_debug ./single_trajectory_debug_compiled *.o
