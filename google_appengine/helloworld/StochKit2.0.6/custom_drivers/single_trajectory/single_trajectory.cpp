/*
*  
*/
#ifdef WIN32
#include "boost_headers.h"
#endif
#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SerialIntervalSimulationDriver.h"
#include "SingleTrajectoryCommandLine.h"
#include "SSA_Direct.h"
#include "Input_mass_action.h"
#include "Input_mixed_before_compile.h"
#include "SimulateSingleTrajectory.h"
#include "ModelTag.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

#ifdef WIN32
	boost::filesystem::path currentPath=boost::filesystem::system_complete(av[0]).parent_path();
	std::string generatedCodeDir=currentPath.parent_path().string()+"\\generatedCode";
	if (!boost::filesystem::exists(generatedCodeDir))
		boost::filesystem::create_directories(generatedCodeDir);
#endif

	SingleTrajectoryCommandLine commandLine(ac,av);

	typedef SSA_Direct<StandardDriverTypes::populationType,
		StandardDriverTypes::stoichiometryType,
		StandardDriverTypes::propensitiesType,
		StandardDriverTypes::graphType> ssa;

	char* modelFileName;

#ifdef WIN32
	std::string tempname;
	tempname=commandLine.getModelFileName();
	modelFileName=const_cast<char*>(tempname.c_str());
#else
	modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif

	//find out if it is a pure mass action model or mixed (customized propensities)
	Input_tag<ModelTag> input_model_tag(modelFileName);
	ModelTag model_tag = input_model_tag.writeModelTag(); 	 

	ModelTag::ModelType modelType = model_tag.Type;

	//single_trajectory does not support events
	if (modelType==ModelTag::events_enabled) {
		std::cout << "StochKit ERROR (single_trajectory): single trajectory custom driver does not support events. Terminating.\n";
		exit(1);
	}

	//if modelType is mixed, generate custom propensity functions file and compile it with "single_trajectory_mixed.cpp"
	if (modelType==ModelTag::mixed) {
		std::cout << "StochKit MESSAGE (single_trajectory): Model contains customized propensities, compiling (this will take a few moments)...\n";

		Input_mixed_before_compile<StandardDriverTypes::populationType,
			StandardDriverTypes::stoichiometryType,
			StandardDriverTypes::propensitiesType,
			StandardDriverTypes::graphType> model(modelFileName);
#ifdef WIN32
		std::string customPropensityFunctionsFile=generatedCodeDir+"\\CustomPropensityFunctions.h";
#else
		std::string customPropensityFunctionsFile="CustomPropensityFunctions.h";
#endif
		model.writeCustomPropensityFunctionsFile(const_cast<char*>(customPropensityFunctionsFile.c_str()));

#ifdef WIN32
		std::string pathName=currentPath.parent_path().string()+"\\Mixed_Compiled_Solution\\Mixed_Compiled_Solution.sln";
#ifdef DEBUG
		std::string executableName="single_trajectory_debug_compiled";
#else
		std::string executableName="single_trajectory_compiled";
#endif
#ifdef NDEBUG
		std::string command=(std::string)"\"msbuild \""+pathName+"\" /t:"+executableName+":rebuild /clp:NoSummary /p:configuration=release;DebugType=none /v:q /nologo /flp:LogFile=\""+generatedCodeDir+"\\compile-log.txt;Verbosity=diagnostic\"\"";
#else
		std::string command=(std::string)"\"msbuild \""+pathName+"\" /t:"+executableName+":rebuild /clp:NoSummary /p:configuration=debug /v:q /nologo /flp:LogFile=\""+generatedCodeDir+"\\compile-log.txt;Verbosity=diagnostic\"\"";
#endif
#else
#ifdef DEBUG
		std::string command="make single_trajectory_debug_compiled --silent >& compile-log.txt";
#else
		std::string command="make single_trajectory_compiled --silent >& compile-log.txt";
#endif
#endif
		//make a system call of the make command
		int returnValue=system(command.c_str());

		if (returnValue!=0) {
			std::cout << "StochKit ERROR (single_trajectory): error compiling custom propensity functions.  Check compile-log.txt for details.\n";
			exit(1);
		}
		else {
			//run the compiled executable
#ifdef WIN32
			command="\"\""+currentPath.string()+"\\"+executableName+"\""+commandLine.getCmdArgs()+"\"";
#else
#ifdef DEBUG
			command="./single_trajectory_debug_compiled "+commandLine.getCmdArgs();
#else
			command="./single_trajectory_compiled "+commandLine.getCmdArgs();
#endif
#endif
			std::cout << "calling executable: "<<command<<"\n";
			system(command.c_str());
		}

		return 0;
	}

	//if we got here, our model is pure mass action
	Input_mass_action<StandardDriverTypes::populationType, StandardDriverTypes::stoichiometryType, StandardDriverTypes::propensitiesType, 
		StandardDriverTypes::graphType> model(modelFileName);

	ssa solver(model.writeInitialPopulation(),
		model.writeStoichiometry(),
		model.writePropensities(),
		model.writeDependencyGraph());

	if (commandLine.getUseSeed()) {
		solver.seed(commandLine.getSeed());
	}

	std::vector<std::pair<double, StandardDriverTypes::populationType> > output;

	std::size_t NumberOfReactions=model.writePropensities().size();

	simulateSingleTrajectory(output, solver, commandLine.getSimulationTime(), commandLine.getMaxSteps(), NumberOfReactions);

	std::string filename="single_trajectory_output.txt";
	std::ofstream outfile;

#ifdef WIN32
	std::string filedirectory=generatedCodeDir+"\\"+filename;
	outfile.open(filedirectory.c_str());
#else
	outfile.open(filename.c_str());
#endif

	if (!outfile) {
		std::cout << "ERROR: Unable to open output file.\n";
		exit(1);
	}

#ifdef WIN32
	std::cout << "Writing trajectory data to "<<filedirectory<<"...\n";
#else
	std::cout << "Writing trajectory data to "<<filename<<"...\n";
#endif

	for (std::size_t i=0; i!=output.size(); ++i) {
		outfile << output[i].first;
		for (std::size_t j=0; j!=output[i].second.size(); ++j) {
			outfile << "\t"<<output[i].second[j];
		}
		outfile << "\n";
	}
	outfile.close();
	std::cout << "done.\n";


	return 0;
}
