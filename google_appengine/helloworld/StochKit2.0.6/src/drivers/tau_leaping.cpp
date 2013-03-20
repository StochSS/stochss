/*
*  tau_leaping.cpp
*  analyze model and choose which tau-leaping method to use
*/
#include "boost_headers.h"

#include "CommandLineInterface.h"
#include "Input_tag.h"
#include "ModelTag.h"
#include "boost/thread/thread.hpp"

using namespace STOCHKIT;

int main(int ac, char* av[])
{


	//need to decide which solver (e.g. tau_leaping_exp_adapt or tau_leaping_exp_adapt_mixed)

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

	ModelTag::ModelType modelType = model_tag.Type;

#ifdef WIN32
	boost::filesystem::path currentPath=boost::filesystem::path(av[0]).parent_path();
	std::string command=boost::filesystem::system_complete(currentPath).string();
//	command+="\\bin\\tau_leaping_exp_adapt";
	command+="\\tau_leaping_exp_adapt";
#else
	std::string command="$STOCHKIT_HOME/bin/tau_leaping_exp_adapt";
#endif

	std::cout << "StochKit MESSAGE: determining appropriate driver...";

	//if events, use event solver
	if (modelType==ModelTag::events_enabled) {
		std::cout << "\nStochKit ERROR: events detected. tau_leaping is not event-enabled. Terminating\n";
		exit(1);
	}
	else {

		if (modelType==ModelTag::mixed) {
#ifdef STATIC
		std::cout<<"\nStochKit ERROR: The Windows lite version of StochKit does not support custom propensity functions (try the full version). Terminating.\n";
		return 0;
#else
			command+="_mixed";
#endif
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
	}

	return 0;
}
