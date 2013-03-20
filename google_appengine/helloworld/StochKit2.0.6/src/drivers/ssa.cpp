/*
*  ssa.cpp
*  analyze model and choose which ssa method to use
*/

#include "boost_headers.h"

#include "CommandLineInterface.h"
#include "Input_tag.h"
#include "ModelTag.h"
#include "boost/thread/thread.hpp"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

	//tests needed to determine Cutoffs
	std::size_t constantOverODMCutoff=6000;//if number of reactions is >=5000, use constnat time instead of ODM
	std::size_t constantOverDirectCutoff=2000;
	std::size_t denseStoichiometryCutoff=64;//dense/sparse cutoff roughly this--doesn't make significant difference until much larger
	std::size_t realizationsODMoverDirect=5;//single processor

	std::string odmOrDirect;
	bool useConstant=false;

	//need to decide which solver (e.g. ssa_odm or ssa_constant_time), which stoichiometry data type (vector of vectors vs matrix, sparse vs dense)

	CommandLineInterface commandLine(ac,av);

	char* modelFileName;

#ifdef WIN32 //it seems visual studio does not recognize the one line statement
	std::string filename=commandLine.getModelFileName();
	modelFileName=const_cast<char*>(filename.c_str());
#else
	modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif

	Input_tag<ModelTag> input_model_tag(modelFileName);

	ModelTag model_tag = input_model_tag.writeModelTag();

	std::size_t numberOfSpecies=model_tag.NumberOfSpecies;
	std::size_t numberOfReactions=model_tag.NumberOfReactions;
	std::size_t numberOfRealizations=commandLine.getRealizations();

	ModelTag::ModelType modelType = model_tag.Type;

#ifdef WIN32
	boost::filesystem::path currentPath=boost::filesystem::path(av[0]).parent_path(); 
	std::string command=boost::filesystem::system_complete(currentPath).string();
//	command+="\\bin\\ssa";
	command+="\\ssa";
#else
	std::string command="$STOCHKIT_HOME/bin/ssa";
#endif

	std::cout << "StochKit MESSAGE: determining appropriate driver...";

	//if events, use event solver
	if (modelType==ModelTag::events_enabled) {
#ifdef STATIC
		std::cout<<"\nStochKit ERROR: the Windows lite version of StochKit does not support events (try the full version). Terminating.\n";
		return 0;
#else
		command+="_direct_events";
#endif
	}
	else {
		//number of realizations vs processors determines if ODM or Direct is better
		std::size_t numberOfProcesses=commandLine.getProcesses();
		//if default number of processes, 0, is chosen, automatically determine
		if (numberOfProcesses==0) {
			numberOfProcesses=boost::thread::hardware_concurrency();
			if (numberOfProcesses==0) {
				numberOfProcesses=1;
			}
		}
		//changed next line to workaround bug in odm (odm crashes if model has just one reaction)
		if (numberOfRealizations>=realizationsODMoverDirect*numberOfProcesses && numberOfReactions>1) {
			odmOrDirect="_odm";
		}
		else {
			odmOrDirect="_direct";
		}

		//use number of reactions and realizations to determine if we should use constant time
		useConstant=false;
		if (odmOrDirect=="_odm") {
			if ( (numberOfReactions/constantOverDirectCutoff+numberOfReactions*numberOfRealizations/constantOverODMCutoff) > numberOfRealizations ) {
				useConstant=true;
			}
		}
		else {
			if (numberOfReactions>=constantOverDirectCutoff) {
				useConstant=true;
			}
		}

		if (useConstant) {
			command+="_constant";
		}
		else {
			command+=odmOrDirect;
		}

		if (modelType==ModelTag::mixed) {
#ifdef STATIC
		std::cout<<"\nStochKit ERROR: The Windows lite version of StochKit does not support custom propensity functions (try the full version). Terminating.\n";
		return 0;
#else
			command+="_mixed";
#endif
		}

		//if number of species is small, use dense (except for constant-time which doesn't have a "small" option)
		if (!useConstant && numberOfSpecies<=denseStoichiometryCutoff) {
			command+="_small";
		}

	}

#ifdef WIN32
	//add quote for the executable
	command="\""+command+"\"";
#endif

	std::cout << "running " << command << "...\n";

	command+=commandLine.getCmdArgs();  

#ifdef WIN32
	//add quote for the command
	command="\""+command+"\"";
#endif

	system(command.c_str());

	return 0;
}
