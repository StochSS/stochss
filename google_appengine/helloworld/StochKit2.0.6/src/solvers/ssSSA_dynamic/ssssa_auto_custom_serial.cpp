/*
	READ THIS MESSAGE BEFORE EDITING THIS FILE!!!!!!!!!!!!!
	this file is written to by the non-serial version (after being copied to generated_code directory)
	it uses line numbers to identify where the ivfp function assignment code is to be written
	therefore, if you add or delete lines from this file, the program will no longer function correctly!
*/
#include "boost_headers.h"
#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SerialIntervalSimulationDriver.h"
#include "SlowScaleSSA.h"
#include "convertXMLtoModel.h"
#include "ivfp_functions.h"
#include "full_model_functions.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{
	
	//use custom code instead of serial driver because SlowScaleSSA is not a template class
	CommandLineInterface commandLine(ac,av);
	typedef StandardDriverTypes::outputType outputType;  
	outputType output;
	
	typedef SlowScaleSSA solverType;
	
    char* modelFileName;
#ifdef WIN32
	std::string name;
	name=commandLine.getModelFileName();
    modelFileName=const_cast<char*>(name.c_str());
#else
	modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif
    
	STOCHKIT::Input_mass_action<STOCHKIT::StandardDriverTypes::populationType, STOCHKIT::StandardDriverTypes::stoichiometryType, STOCHKIT::StandardDriverTypes::propensitiesType, STOCHKIT::StandardDriverTypes::graphType> model(modelFileName);
	
	StandardDriverTypes::populationType initialPop=model.writeInitialPopulation();
	
	std::vector<ElementaryReaction> reactions=convertXML(modelFileName);
		
	SlowScaleSSA ssssa(initialPop,reactions,&fullModelIndependentSpecies);

    if (commandLine.getUseSeed()) {
		ssssa.seed(commandLine.getSeed());
    }
	
	//INSERT GENERATED CODE HERE
//line 51
//52
//53
//54
//55
//56
//57
//58
//59
//60
	
	//end generated code part
	
	std::size_t realizations=commandLine.getRealizations();
	double simulationTime=commandLine.getSimulationTime();
	
	std::size_t intervals=commandLine.getIntervals();
	
	//set output options
	output.setOutputTimes(IntervalOutput<StandardDriverTypes::populationType>::createUniformOutputTimes(0.0,simulationTime,intervals));
	output.setKeepStats(commandLine.getKeepStats());
	output.setKeepTrajectories(commandLine.getKeepTrajectories());
	output.setKeepHistograms(commandLine.getKeepHistograms());
	output.setHistogramBins(commandLine.getHistogramBins());
	
	if (commandLine.getSpeciesSubset().size()!=0) {
		output.setSpeciesSubset(commandLine.getSpeciesSubset());
	}
	//see if we are resuming an already started simulation (after compiling a new vfp)
//	std::cout << "calling resume_simulation in ssssa_auto_custom_serial...\n";
	double resumeTime=0;
	std::size_t resumeRealization=0;
	std::size_t previousCallsToRepartition=0;
	std::size_t previousCurrentInterval=0;
	std::size_t previousStepsTaken=0;
	std::vector<std::size_t> previousFastReactions(0);
	STOCHKIT::StandardDriverTypes::populationType previousPopulation(0);
	std::string progress_file_name=commandLine.getGeneratedCodeDir()+"/simulation_progress.txt";
	std::ifstream fin(progress_file_name.c_str());
    if (!fin) {
      std::cout << "StochKit ERROR (ssssa_auto_custom_serial): Unable to open simulation progress file. Terminating.\n";
      exit(1);
    }
    std::string status;
    fin >> status;//first line of info file will contain "FINISHED" if finished.
	if (status=="FINISHED") {
		std::cout << "StochKit ERROR (ssssa_auto_custom_serial): Simulation progress file status unexpectedly set to FINISHED. Terminating.\n";
		fin.close();
		exit(1);
	}
	else if (status=="STARTED") {
		//do nothing		
	}
	else if (status=="PROGRESS") {
		fin >> resumeTime;
		fin >> resumeRealization;
		fin >> previousCallsToRepartition;
		fin >> previousCurrentInterval;
		fin >> previousStepsTaken;
		std::size_t inputSize_t;
		fin >> inputSize_t;
		previousFastReactions.resize(inputSize_t);
		for (std::size_t i=0; i!=previousFastReactions.size(); ++i) {
			fin >> inputSize_t;
			previousFastReactions[i]=inputSize_t;
		}
		fin >> inputSize_t;
		previousPopulation.resize(inputSize_t);
		double inputDouble;
		for (std::size_t i=0; i!=previousPopulation.size(); ++i) {
			fin >> inputDouble;
			previousPopulation(i)=inputDouble;
		}
		output.unserialize(commandLine.getGeneratedCodeDir()+"/output_object_serialized.txt");
		ssssa.partitionOptimizer.unserialize(commandLine.getGeneratedCodeDir()+"/partition_optimizer_serialized.txt");
	}
	else {
		std::cout << "StochKit ERROR (ssssa_auto_custom_serial): Invalid status in simulation progress file. Terminating.\n";
		fin.close();
		exit(1);	
	}
	fin.close();
	ssssa.resume_simulation<outputType>(resumeTime,resumeRealization,realizations, 0.0, simulationTime, output, commandLine.getGeneratedCodeDir(), previousCallsToRepartition, previousCurrentInterval, previousStepsTaken, previousPopulation, previousFastReactions);//ssssa.simulate<outputType>(realizations, 0.0, simulationTime, output);
	
	//if we're finished, write output
	std::ifstream fin2(progress_file_name.c_str());
    if (!fin2) {
      std::cout << "StochKit ERROR (ssssa_auto_custom_serial): Unable to open simulation progress file. Terminating.\n";
      exit(1);
    }
    std::string status2;
    fin2 >> status2;//first line of info file will contain "FINISHED" if finished.

	if (status2=="FINISHED") {
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
					std::cerr << "StochKit ERROR (ssssa_dynamic_mixed_serial): Unable to open histogram info file for writing.\n";
					exit(1);
				}
				
				outfile << output.histograms.numberOfSpecies() << "\n";
				
				outfile.close();
			}
		}
	}//end if (status2=="FINISHED") {
	return 0;
}
//189...this line number is used by ssssa_automatic.cpp