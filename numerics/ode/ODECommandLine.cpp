/******************************************************************************
*/
#include "ODECommandLine.h"

namespace STOCHKIT
{
	ODECommandLine::ODECommandLine(int ac, char* av[]):
visible("command line options")
{
	std::string temp_dir;
	visible.add_options()
		("model,m", boost::program_options::value<std::string>(&modelFileName),"**REQUIRED Model file name")
		("time,t",boost::program_options::value<double>(&simulationTime),"**REQUIRED Simulation time (i.e. run each realization from t=0 to t=time)")
		("intervals,i",boost::program_options::value<std::size_t>(&intervals)->default_value(10),"Number of intervals.\n0=keep data only at simulation end time.\n1=keep data at start and end time.\n2=keep data at start, middle, and end times.\netc.\nNote data is stored at (intervals+1) time points.")
		("species",boost::program_options::value<std::vector<std::string> >()->multitoken(),"List of subset of species (names or indices) to include in output.  If not specified, all species are included in output.")
		("label","Label columns with species names")
		("out-dir",boost::program_options::value<std::string>(&temp_dir),"Specify the output directory (default is <model name>_output.")
		("force,f","Overwrite existing output directory and output files without confirmation.")
		("help,h","Use -h or --help to list all arguments")
		;
	hidden.add_options()
		("ode-template", boost::program_options::value<std::string>(&ODETemplateFileName),"ODE Template file name")
		;

	combined.add(visible).add(hidden);

	parse(ac, av);

	//save command-line arguments
	//skip the first (av[0] is the executable name)
	*av++;
	ac--;
	//pull off the arguments
	while (ac--) {
		cmdArgs+=" "+(std::string)*av++;
	}

#ifdef WIN32
	//find the model file path and add quote for window version
	//for "-m"
	std::string serchingString="-m "+modelFileName;
	std::string replaceString="-m "+(std::string)"\""+modelFileName+(std::string)"\"";
	int index=cmdArgs.find(serchingString, 0);
	if(index!=std::string::npos)
		cmdArgs.replace(index, serchingString.size(), replaceString); 
	//for "--model"
	serchingString="--model "+modelFileName;
	replaceString="-m "+(std::string)"\""+modelFileName+(std::string)"\"";
	index=cmdArgs.find(serchingString, 0);
	if(index!=std::string::npos)
		cmdArgs.replace(index, serchingString.size(), replaceString);
	//for "--out-dir"
	serchingString="--out-dir "+temp_dir;
	replaceString="--out-dir "+(std::string)"\""+temp_dir+(std::string)"\"";
	index=cmdArgs.find(serchingString, 0);
	if(index!=std::string::npos)
		cmdArgs.replace(index, serchingString.size(), replaceString); 
#endif
}



std::string ODECommandLine::getGeneratedCodeDir() const {
	return generatedCodeDir;
}

std::string ODECommandLine::getModelFileName() const {
	return modelFileName;
}

std::string ODECommandLine::getODETemplateFileName() const {
	return ODETemplateFileName;
}

double ODECommandLine::getSimulationTime() const {
	return simulationTime;
}

std::size_t ODECommandLine::getIntervals() const {
	return intervals;
}

/*
std::vector<std::string> ODECommandLine::getSpecies() const {
return species;
}
*/

std::vector<std::size_t> ODECommandLine::getSpeciesSubset() const {
	return speciesSubset;
}

bool ODECommandLine::getLabel() const {
	return label;
}

std::vector<std::string> ODECommandLine::getSpeciesNames() const {
	return speciesNames;
}

std::string ODECommandLine::getOutputDir() const {
	return outputDir;
}

bool ODECommandLine::getUseExistingOutputDirs() const {
	return useExistingOutputDirs;
}

bool ODECommandLine::getForce() const {
	return force;
}

std::string ODECommandLine::getCmdArgs() const {
	return cmdArgs;
}

void ODECommandLine::parse(int ac, char* av[]) {
	try {
		boost::program_options::store(boost::program_options::parse_command_line(ac,av,combined), vm);
	}
	catch (...) {
		std::cout << "StochKit ERROR (ODECommandLine::parse): unable to parse command-line arguments.  Run with --help for a list of required and optional parameters.\n";
		exit(1);
	}

	boost::program_options::notify(vm);

	if (vm.count("help")) {
		std::cout << visible;
		exit(0);
	}

	if (!(vm.count("model") && vm.count("time") )) {
		std::cout << "StochKit ERROR (ODECommandLine::parse): missing required parameter(s).  Run with --help for a list of required and optional parameters.\n";
		exit(1);
	}

	if (vm.count("species")) {
		species=vm["species"].as<std::vector<std::string> >();
	}

	if (vm.count("label")) {
		label=true;
	}
	else {
		label=false;
	}

	if (vm.count("force")) {
		force=true;
	}
	else {
		force=false;
	}

	if (vm.count("out-dir")) {
		//create full path to output directory
		outputDir=boost::filesystem::system_complete(boost::filesystem::path(vm["out-dir"].as<std::string>())).string();
	}
	else {
		//create full path to output directory, default location, <full_path_to/model_filename (without extension)>_output
		std::string tmp_full_model_path=boost::filesystem::system_complete(modelFileName).string();
		outputDir=tmp_full_model_path.substr(0,tmp_full_model_path.find_last_of("."))+"_output_ode";
	}

	std::string full_model_path=boost::filesystem::system_complete(modelFileName).string();
	generatedCodeDir=full_model_path.substr(0,full_model_path.find_last_of("."))+"_generated_code_ode";
	
	if (vm.count("use-existing-output-dirs")) {
		useExistingOutputDirs=true;
	}
	else {
		useExistingOutputDirs=false;
	}

//		ODETemplateFileName=boost::filesystem::system_complete(boost::filesystem::path(vm["ode-template"].as<std::string>())).string();
	if (!vm.count("ode-template")) {
		//create full path to ode template file, default location, <full_path_to/model_filename (without extension)>_output
		
//		std::string tmp_ode_template_file=boost::filesystem::system_complete(boost::filesystem::path(av[0])).parent_path().parent_path().string();
//		ODETemplateFileName=tmp_ode_template_file+"/cvTemplate_dns.c";
		std::string ode_dir(getenv("STOCHKIT_ODE"));
		if(ode_dir.empty()){
			std::cout << "StochKit ERROR (ODECommandLine::parse): Please set appropriate $STOCHKIT_ODE environment variable.\n";
			exit(1);
		} else {
			ODETemplateFileName = ode_dir+"/cvTemplate_dns.c";
		}
	}

	//if user only wants a subset of species or wants species labels
	//we have to read in the model file to get species names (and species subset, if needed), so do that now...
	char* modelFile;
	modelFile=const_cast<char*>(modelFileName.c_str());
	Input_tag<ModelTag> input_model_tag(modelFile);
	ModelTag model_tag = input_model_tag.writeModelTag();
	std::vector<std::string> modelSpeciesList=model_tag.SpeciesList;

	if (species.size()!=0) {//we need to create a species subset vector and set it in output object
		//loop over command line species list
		//if it's an index (a number), store it in the list of species indexes
		//if it's a species id (species name), look up it's index in the modelSpeciesList
		for (std::size_t i=0; i!=species.size(); ++i) {
			std::istringstream iss(species[i]);
			std::size_t index;
			iss >> index;
			if (iss.fail()) {
				for (std::size_t j=0; j!=modelSpeciesList.size(); ++j) {
					if (species[i].compare(modelSpeciesList[j])==0) {
						speciesSubset.push_back(j);
						break;
					}
				}
			}
			else {
				if (index<modelSpeciesList.size()) {
					speciesSubset.push_back(index);
				}
				else {
					std::cout << "StochKit ERROR (ODECommandLine::parse): species index \""<<index<<"\" larger than number of species (Note: indices start at 0, so largest index is "<<modelSpeciesList.size()-1<<")\n";
					exit(1);
				}
			}
		}

	}
	//create vector of species names
	if (speciesSubset.size()==0) {//if keeping all species, use species label vector from model_tag
		for(std::size_t index=0;index<modelSpeciesList.size();++index)
			speciesSubset.push_back(index);
		speciesNames=modelSpeciesList;
	}
	else {//we're using a species subset, so we need to create the appropriate species label subset
		DenseVectorSubset<std::vector<std::string> > labelSubset(speciesSubset);
		speciesNames=labelSubset.getSubset(modelSpeciesList);
	}
}//end parse

}
