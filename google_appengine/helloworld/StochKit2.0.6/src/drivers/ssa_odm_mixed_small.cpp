/*
*  
*/
#include "boost_headers.h"

#include "ParallelIntervalSimulation.h"
#include "CommandLineInterface.h"
#include "StandardDriverUtilities.h"

using namespace STOCHKIT;

int main(int ac, char* av[])
{

#ifdef WIN32
	boost::filesystem::path currentPath=boost::filesystem::path(av[0]).parent_path();
#endif

	std::string executableName="ssa_odm_mixed_small_compiled";

	CommandLineInterface commandLine(ac,av);

#ifdef WIN32
	StandardDriverUtilities::compileMixed(executableName,commandLine,currentPath);
#else
	StandardDriverUtilities::compileMixed(executableName,commandLine);
#endif

	ParallelIntervalSimulation parallelDriver(ac,av);

#ifdef WIN32
	parallelDriver.run("\""+currentPath.string()+"\\"+executableName+"\"");
#else
	parallelDriver.run(commandLine.getGeneratedCodeDir()+"/bin/"+executableName);
#endif

	parallelDriver.mergeOutput();

	return 0;
}
