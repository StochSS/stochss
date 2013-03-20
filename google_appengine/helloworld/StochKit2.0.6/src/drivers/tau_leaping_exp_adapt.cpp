/*
*  tau_leaping.cpp
*  
*/
#include "boost_headers.h"

#include "ParallelIntervalSimulation.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

#ifdef WIN32
	boost::filesystem::path currentPath=boost::filesystem::path(av[0]).parent_path(); 
	std::string executablepath=boost::filesystem::system_complete(currentPath).string();
	executablepath+="\\tau_leaping_exp_adapt_serial.exe";

	//add quote for the executable
	executablepath="\""+executablepath+"\"";
#endif

	ParallelIntervalSimulation parallelDriver(ac,av);

#ifdef WIN32
	parallelDriver.run(executablepath);
#else
	parallelDriver.run("$STOCHKIT_HOME/bin/tau_leaping_exp_adapt_serial");
#endif

	parallelDriver.mergeOutput();

	return 0;
}
