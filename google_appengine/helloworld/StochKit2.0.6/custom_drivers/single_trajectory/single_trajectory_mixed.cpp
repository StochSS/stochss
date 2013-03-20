/*
 *  
 */
#ifdef WIN32
#include "boost_headers.h"
#endif
#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
#include "SingleTrajectoryCommandLine.h"
#include "SSA_Direct.h"
#include "Input_mixed_after_compile.h"
#include "SimulateSingleTrajectory.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{
	
#ifdef WIN32
	boost::filesystem::path currentPath=boost::filesystem::path(av[0]).parent_path();
	std::string generatedCodeDir=currentPath.parent_path().string()+"\\generatedCode";
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
	
    Input_mixed_after_compile<StandardDriverTypes::populationType, StandardDriverTypes::stoichiometryType, StandardDriverTypes::propensitiesType, 
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
	
    //output=simulateSingleTrajectory(solver, commandLine.getSimulationTime(), commandLine.getMaxSteps(), NumberOfReactions);
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
