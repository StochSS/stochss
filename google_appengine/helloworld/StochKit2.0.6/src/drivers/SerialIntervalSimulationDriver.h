/******************************************************************************
 */

#ifndef _SERIAL_INTERVAL_SIMULATION_DRIVER_H_
#define _SERIAL_INTERVAL_SIMULATION_DRIVER_H_

#include "Input_mass_action.h"
#include "CommandLineInterface.h"
#include "StandardDriverTypes.h"
#include "StandardDriverUtilities.h"
#include "Input_mixed_before_compile.h"
#ifdef MIXED
  #include "Input_mixed_after_compile.h"
#endif
#ifdef EVENTS
  #include "Input_events.h"
  #include "Input_events_after_compile.h"
#endif
#include "Input_tag.h"
#include "ModelTag.h"
#include <sstream>
#include <string>
#include <vector>

namespace STOCHKIT
{

template<typename _solverType>
class SerialIntervalSimulationDriver
{
	
public:
  typedef typename _solverType::populationVectorType populationVectorType;
  typedef typename _solverType::stoichiometryType stoichiometryType;
  typedef typename _solverType::propensitiesType propensitiesType;
  typedef typename _solverType::dependencyGraphType dependencyGraphType;
  typedef StandardDriverTypes::outputType outputType;  

  SerialIntervalSimulationDriver(int ac, char* av[]):
    commandLine(ac,av),
    output()
  {}

  _solverType createMassActionSolver() {
    
    char* modelFileName;

#ifdef WIN32//for visual studio
	std::string mystring;
	mystring=commandLine.getModelFileName();
	modelFileName=const_cast<char*>(mystring.c_str());
#else
    modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif

    Input_mass_action<populationVectorType, stoichiometryType, propensitiesType, dependencyGraphType> model(modelFileName);

    _solverType solver(model.writeInitialPopulation(),
		       model.writeStoichiometry(),
		       model.writePropensities(),
		       model.writeDependencyGraph());

    if (commandLine.getUseSeed()) {
      solver.seed(commandLine.getSeed());
    }

    return solver;
  }
  
  //Input_mixed_after_compile won't compile unless CustomPropensityFunctions.h is included (i.e. we're compiling a mixed model)
#ifdef MIXED
  _solverType createMixedSolver() {
    
    char* modelFileName;
#ifdef WIN32
	std::string name;
	name=commandLine.getModelFileName();
    modelFileName=const_cast<char*>(name.c_str());
#else
	modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif
    
    Input_mixed_after_compile<populationVectorType, stoichiometryType, propensitiesType, dependencyGraphType> model(modelFileName);

    _solverType solver(model.writeInitialPopulation(),
		       model.writeStoichiometry(),
		       model.writePropensities(),
		       model.writeDependencyGraph());

    if (commandLine.getUseSeed()) {
      solver.seed(commandLine.getSeed());
    }

    return solver;
  }

#endif

#ifdef EVENTS
  _solverType createEventsSolver() {
    
    char* modelFileName;
#ifdef WIN32
	std::string name;
	name=commandLine.getModelFileName();
    modelFileName=const_cast<char*>(name.c_str());
#else
	modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif
	
	typedef StandardEventHandler<StandardDriverTypes::populationType> eventsType;

    Input_events_after_compile<populationVectorType, stoichiometryType, propensitiesType, dependencyGraphType, eventsType, _solverType> model(modelFileName);

    _solverType solver(model.writeInitialPopulation(),
		       model.writeStoichiometry(),
		       model.writePropensities(),
		       model.writeDependencyGraph());

    if (commandLine.getUseSeed()) {
      solver.seed(commandLine.getSeed());
    }

    return solver;
  }
#endif

  void callSimulate(_solverType& solver) {
    std::size_t realizations=commandLine.getRealizations();
    double simulationTime=commandLine.getSimulationTime();
    
    std::size_t intervals=commandLine.getIntervals();
    
    //set output options
    output.setOutputTimes(IntervalOutput<populationVectorType>::createUniformOutputTimes(0.0,simulationTime,intervals));
    output.setKeepStats(commandLine.getKeepStats());
    output.setKeepTrajectories(commandLine.getKeepTrajectories());
    output.setKeepHistograms(commandLine.getKeepHistograms());
    output.setHistogramBins(commandLine.getHistogramBins());

    if (commandLine.getSpeciesSubset().size()!=0) {
      output.setSpeciesSubset(commandLine.getSpeciesSubset());
    }
    
#ifdef EVENTS
    typedef StandardEventHandler<StandardDriverTypes::populationType> eventsType;
    //unfortunately, we need to create another instance of model here
    char* modelFileName;

#ifdef WIN32
	std::string name;
	name=commandLine.getModelFileName();
    modelFileName=const_cast<char*>(name.c_str());
#else
	modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif

    Input_events_after_compile<populationVectorType, stoichiometryType, propensitiesType, dependencyGraphType, eventsType, _solverType> model(modelFileName);
    
    eventsType eventsHandler=model.writeEvents(solver);
    
    solver.template simulateEvents<outputType>(realizations, 0.0, simulationTime, output, eventsHandler);
#else
    solver.template simulate<outputType>(realizations, 0.0, simulationTime, output);
#endif
  }

  void writeOutput() {
    if (!commandLine.getUseExistingOutputDirs()) {
      StandardDriverUtilities::createOutputDirs(commandLine,false);
    }

    if (commandLine.getKeepStats()) {     
      output.stats.writeMeansToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/"+commandLine.getMeansFileName());
      output.stats.writeVariancesToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/"+commandLine.getVariancesFileName());
      output.stats.writeSimulationInfoFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/"+commandLine.getStatsInfoFileName());
    }
    if (commandLine.getKeepTrajectories()) {
      std::size_t trajectoryNumber;
      std::string trajectoryNumberString;
      for (std::size_t i=0; i!=commandLine.getRealizations(); ++i) {
	trajectoryNumber=i+commandLine.getTrajectoriesOffset();
	trajectoryNumberString=StandardDriverUtilities::size_t2string(trajectoryNumber);

	if (commandLine.getLabel()) {
	  IntervalOutput<StandardDriverTypes::populationType>::writeLabelsToFile(commandLine.getOutputDir()+"/"+commandLine.getTrajectoriesDir()+"/trajectory"+trajectoryNumberString+".txt",commandLine.getSpeciesNames());
	  output.trajectories.writeDataToFile(i,commandLine.getOutputDir()+"/"+commandLine.getTrajectoriesDir()+"/trajectory"+trajectoryNumberString+".txt",true,true);
	}
	else {  
	  output.trajectories.writeDataToFile(i,commandLine.getOutputDir()+"/"+commandLine.getTrajectoriesDir()+"/trajectory"+trajectoryNumberString+".txt");
	}
      }
    }
    if (commandLine.getKeepHistograms()) {
      output.histograms.writeHistogramsToFile(commandLine.getOutputDir()+"/"+commandLine.getHistogramsDir()+"/hist",".dat",commandLine.getSpeciesNames());
      //thread 0 will write a histograms info file
      if (commandLine.getHistogramsInfoFileName()!="") {
	std::ofstream outfile;
	outfile.open((commandLine.getOutputDir()+"/"+commandLine.getHistogramsDir()+"/"+commandLine.getHistogramsInfoFileName()).c_str());
	if (!outfile) {
	  std::cerr << "StochKit ERROR (SerialIntervalSimulationDriver::writeOutput): Unable to open histogram info file for writing.\n";
	  exit(1);
	}
	
	outfile << output.histograms.numberOfSpecies() << "\n";
	
	outfile.close();
      }
    }
  }
  
  CommandLineInterface getCommandLine() {
	return commandLine;
  }
  
private:
  
	CommandLineInterface commandLine;
	outputType output;

};

}

#endif
