/*
*  
*/
#ifdef WIN32
#include "boost_headers.h"
#endif
#include <iostream>
#include <string>
#include "StandardDriverTypes.h"
//#include "SerialIntervalSimulationDriver.h"
#include "ODECommandLine.h"
#include "Input_ODE_before_compile.h"
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

	ODECommandLine commandLine(ac,av);

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

	//ode does not support events
	if (modelType==ModelTag::events_enabled) {
		std::cout << "StochKit ERROR (ode): single trajectory custom driver does not support events. Terminating.\n";
		exit(1);
	}

	try {
		if (boost::filesystem::exists(commandLine.getGeneratedCodeDir())) {
	                //delete existing directory	
	                if (boost::filesystem::is_directory(commandLine.getGeneratedCodeDir())) {
				boost::filesystem::remove_all(commandLine.getGeneratedCodeDir());
                        }
                        //abort if it exists but is not a directory
                        else {
                                std::cerr << "StochKit ERROR (ode): generated code directory \""<<commandLine.getGeneratedCodeDir()<<"\" already exists and is not a directory.\n";
                                std::cerr << "Simulation terminated.\n";
                                exit(1);
                        }
                }
                boost::filesystem::create_directory(commandLine.getGeneratedCodeDir());
                boost::filesystem::create_directory(commandLine.getGeneratedCodeDir()+"/bin");
        }
        catch (...) {
                std::cerr << "StochKit ERROR (ode): error creating output directory.\n";
                exit(1);
        }

	std::string ODEFileName = "cvode_dns";
#ifdef WIN32
	std::string ODEFile=commandLine.getGeneratedCodeDir()+"\\" + ODEFileName + ".c";
        std::string ODETemplateFile=commandLine.getODETemplateFileName();
#else
	std::string ODEFile=commandLine.getGeneratedCodeDir()+"/" + ODEFileName + ".c";
        std::string ODETemplateFile=commandLine.getODETemplateFileName();
#endif

#ifdef DEBUG
	std::cout << "ODEFileName:" <<  ODEFile << std::endl << "ODETemplateFileName:" << ODETemplateFile << std::endl;
#endif


		Input_ODE_before_compile<StandardDriverTypes::populationType,
                        StandardDriverTypes::stoichiometryType,
			StandardDriverTypes::propensitiesType,
			StandardDriverTypes::graphType> model(modelFileName);

		std::vector<std::size_t> species_subset = commandLine.getSpeciesSubset();
		std::vector<std::string> species_names = commandLine.getSpeciesNames();
#ifdef DEBUG
	std::cout << "Species List by Index:" << std::endl;
	for(std::size_t i=0;i<species_subset.size();++i){
		std::cout << " " << species_subset[i] << std::endl;
	}
	std::cout << "Species List by Names:" << std::endl;
	for(std::size_t i=0;i<species_names.size();++i){
		std::cout << " " << species_names[i] << std::endl;
	}
#endif

		model.writeODEFile(const_cast<char*>(ODETemplateFile.c_str()),const_cast<char*>(ODEFile.c_str()),species_subset,species_names);

                //record current path so we can cd back to it after compiling
                std::string currentPath=boost::filesystem::current_path().string();
//		std::string odePath=boost::filesystem::system_complete(boost::filesystem::path(av[0])).parent_path().parent_path().string();
                std::string odePath(getenv("STOCHKIT_ODE"));
                if(odePath.empty()){
                        std::cout << "StochKit ERROR (ode): Please set appropriate $STOCHKIT_ODE environment variable.\n";
                        exit(1);
                }

#ifdef DEBUG
		std::string executableName=ODEFileName +"_debug";
#else
		std::string executableName=ODEFileName;
#endif

                //updated so generated code path is a full path sanft 2011/03/21
                std::string makeCommand=(std::string)"cd "+ odePath +"; make "+executableName+" GENERATED_CODE_PATH="+commandLine.getGeneratedCodeDir()+ " GENERATED_CODE="+ODEFileName +" --silent";

                //redirect any errors from make to a log file
                //updated so generated code path is a full path sanft 2011/03/21
                makeCommand+=" > "+commandLine.getGeneratedCodeDir()+"/.compile-log.txt 2>&1";

		std::cout << "StochKit MESSAGE: compiling generated code...this will take a few moments...\n";
		int returnValue=system(makeCommand.c_str());

		if (returnValue!=0) {
			std::cout << "StochKit ERROR: compile of generated code failed.  Simulation terminated.\n";
			//copy hidden compile-log to visible log
			//updated so generated code path is a full path sanft 2011/03/21
			std::string command="cp "+commandLine.getGeneratedCodeDir()+"/.compile-log.txt "+commandLine.getGeneratedCodeDir()+"/compile-log.txt";

			system(command.c_str());

			std::cout << "Check log file \"" << commandLine.getGeneratedCodeDir()<<"/compile-log.txt\" for error messages.\n";
			exit(1);
		}

		//go back to original path
		std::string cd="cd "+currentPath;
		system(cd.c_str());

		std::string outputDir=commandLine.getOutputDir();

		try {
			if (boost::filesystem::exists(outputDir)) {
				if (!commandLine.getForce()) {
					std::cout << "StochKit ERROR (ode): output directory \""<<outputDir<<"\" already exists.\n";
					std::cout << "Delete existing directory, use --out-dir to specify a unique directory name, or run with --force to overwrite.\n";
					std::cout << "Simulation terminated.\n";
					exit(1);
				}
				else {
					//delete existing directory
					if (boost::filesystem::is_directory(outputDir)) {
						//could do some checks here to ensure they're not deleting a StochKit directory such as "src", "libs", "models", etc.
						//currently, that is the risk one takes in using --force
						boost::filesystem::remove_all(outputDir);
					}
					//abort if it exists but is not a directory
					else {
						std::cerr << "StochKit ERROR (ode): output directory \""<<outputDir<<"\" exists but is not a directory.\n";
						std::cerr << "Delete existing file or use --out-dir to specify a unique directory name.\n";
						std::cerr << "Simulation terminated.\n";
						exit(1);
					}
				}
			}
			boost::filesystem::create_directories(outputDir);
		}
		catch (...) {
			std::cerr << "StochKit ERROR (ode): error creating output directory.\n";
			exit(1);
		}

		int keep_label = (int)commandLine.getLabel();

		std::ostringstream commandStream;
		commandStream << commandLine.getGeneratedCodeDir() << "/bin/" << executableName << " 0 " << commandLine.getSimulationTime() << " " << commandLine.getIntervals() << " " << commandLine.getOutputDir() << "/output.txt " << keep_label;
		std::string command = commandStream.str();
#ifdef DEBUG
		std::cout << command << std::endl;
#endif
		system(command.c_str());


	std::cout << "Output written to file " << commandLine.getOutputDir() << "/output.txt" << std::endl;
	std::cout << "finished." << std::endl;

	return 0;

}
