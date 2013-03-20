/*!

*/

#ifndef _STANDARD_DRIVER_UTILITIES_H_
#define _STANDARD_DRIVER_UTILITIES_H_

#include <iostream>
#include <stdio.h>
#include <vector>
#include <string.h>
#include <sstream>
#include "boost/filesystem.hpp"
#include "CommandLineInterface.h"
#ifdef EVENTS
#include "Input_events_before_compile.h"
#else
#include "Input_mixed_before_compile.h"
#endif
#include "StandardDriverTypes.h"

namespace STOCHKIT
{
	class StandardDriverUtilities
	{

	public:
		static void createOutputDirs(CommandLineInterface& commandLine, bool parallel, std::size_t threads=1);//if parallel=true, threads is number of processes

#ifdef WIN32
		static void compileMixed(std::string executableName, const CommandLineInterface& commandLine, const boost::filesystem::path currentPath, bool events=false);
#else
		static void compileMixed(std::string executableName, const CommandLineInterface& commandLine, bool events=false);
#endif

		static std::string size_t2string(std::size_t number);

	private:

	};
}

#endif
