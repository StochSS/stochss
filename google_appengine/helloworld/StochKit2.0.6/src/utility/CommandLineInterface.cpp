/******************************************************************************
*/
#include "CommandLineInterface.h"

namespace STOCHKIT
{
	CommandLineInterface::CommandLineInterface(int ac, char* av[]):
visible("command line options")
{
	std::string temp_dir;
	visible.add_options()
		("model,m", boost::program_options::value<std::string>(&modelFileName),"**REQUIRED Model file name")
		("time,t",boost::program_options::value<double>(&simulationTime),"**REQUIRED Simulation time (i.e. run each realization from t=0 to t=time)")
		("realizations,r",boost::program_options::value<std::size_t>(&realizations),"**REQUIRED Number of realizations")
		("intervals,i",boost::program_options::value<std::size_t>(&intervals)->default_value(0),"Number of intervals.\n0=keep data only at simulation end time.\n1=keep data at start and end time.\n2=keep data at start, middle, and end times.\netc.\nNote data is stored at (intervals+1) time points.")
		("no-stats","Do not keep statistics data (must use --keep-trajectories or --keep-histograms)")
		("keep-trajectories","Keep trajectory data")
		("keep-histograms","Keep histogram data")
		("bins",boost::program_options::value<std::size_t>(&histogramBins)->default_value(32),"Number of bins in each histogram (applicable only with --keep-histograms)")
		("species",boost::program_options::value<std::vector<std::string> >()->multitoken(),"List of subset of species (names or indices) to include in output.  If not specified, all species are included in output.")
		("label","Label columns with species names")
		("out-dir",boost::program_options::value<std::string>(&temp_dir),"Specify the output directory (default is <model name>_output.")
		("force,f","Overwrite existing output directory and output files without confirmation.")
		("no-recompile","Use previously compiled model code. Applicable only to models with customized propensity functions.  See documentation for details.")
		("seed",boost::program_options::value<int>(&seed),"Seed the random number generator")
		("processes,p",boost::program_options::value<std::size_t>(&processes)->default_value(0),"Override default and specify the number of processes to use. By default (=0), the number of processes will be determined automatically.")
		("epsilon",boost::program_options::value<double>(&epsilon)->default_value(0.03),"Set the tolerance (applicable to tau leaping only), default is 0.03. Valid values: must be greater than 0.0 and less than 1.0.")
		("threshold",boost::program_options::value<std::size_t>(&threshold)->default_value(10),"Set the threshold (minimum number of reactions per leap before switching to ssa) for tau leaping.")
		("help,h","Use -h or --help to list all arguments")
		;
	hidden.add_options()
		("use-existing-output-dirs","[hidden] used by parallel driver to tell a sub-process that the output directories already exist")
		("stats-dir",boost::program_options::value<std::string>(&statsDir)->default_value("stats"),"[hidden]")
		("means-file",boost::program_options::value<std::string>(&meansFileName)->default_value("means.txt"),"[hidden]")
		("variances-file",boost::program_options::value<std::string>(&variancesFileName)->default_value("variances.txt"),"[hidden]")
		("stats-info-file",boost::program_options::value<std::string>(&statsInfoFileName)->default_value(".stats-info.txt"),"[hidden]")
		("trajectories-dir",boost::program_options::value<std::string>(&trajectoriesDir)->default_value("trajectories"),"[hidden]")
		("trajectories-offset",boost::program_options::value<std::size_t>(&trajectoriesOffset)->default_value(0),"[hidden]")
		("histograms-dir",boost::program_options::value<std::string>(&histogramsDir)->default_value("histograms"),"[hidden]")
		("histograms-info-file",boost::program_options::value<std::string>(&histogramsInfoFileName)->default_value(""),"[hidden]")//only write an info file if this is non-empty (nonempty only in parallel simulation)
		("ssa-steps",boost::program_options::value<std::size_t>(&SSASteps)->default_value(100),"[hidden] Number of SSA steps to take before trying another tau leap step (applicable to tau leaping only).")
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



std::string CommandLineInterface::getGeneratedCodeDir() const {
	return generatedCodeDir;
}

std::string CommandLineInterface::getModelFileName() const {
	return modelFileName;
}

double CommandLineInterface::getSimulationTime() const {
	return simulationTime;
}

std::size_t CommandLineInterface::getRealizations() const {
	return realizations;
}

std::size_t CommandLineInterface::getIntervals() const {
	return intervals;
}

bool CommandLineInterface::getUseSeed() const {
	return useSeed;
}

int CommandLineInterface::getSeed() const {
	return seed;
}

bool CommandLineInterface::getKeepStats() const {
	return keepStats;
}

bool CommandLineInterface::getKeepTrajectories() const {
	return keepTrajectories;
}

bool CommandLineInterface::getKeepHistograms() const {
	return keepHistograms;
}

std::size_t CommandLineInterface::getHistogramBins() const {
	return histogramBins;
}

double CommandLineInterface::getEpsilon() const {
	return epsilon;
}

std::size_t CommandLineInterface::getThreshold() const {
	return threshold;
}

std::size_t CommandLineInterface::getSSASteps() const {
	return SSASteps;
}

/*
std::vector<std::string> CommandLineInterface::getSpecies() const {
return species;
}
*/

std::size_t CommandLineInterface::getProcesses() const {
	return processes;
}

std::vector<std::size_t> CommandLineInterface::getSpeciesSubset() const {
	return speciesSubset;
}

bool CommandLineInterface::getLabel() const {
	return label;
}

std::vector<std::string> CommandLineInterface::getSpeciesNames() const {
	return speciesNames;
}

std::string CommandLineInterface::getOutputDir() const {
	return outputDir;
}

bool CommandLineInterface::getUseExistingOutputDirs() const {
	return useExistingOutputDirs;
}

bool CommandLineInterface::getForce() const {
	return force;
}

std::string CommandLineInterface::getStatsDir() const {
	return statsDir;
}
std::string CommandLineInterface::getMeansFileName() const {
	return meansFileName;
}
std::string CommandLineInterface::getVariancesFileName() const {
	return variancesFileName;
}

std::string CommandLineInterface::getStatsInfoFileName() const {
	return statsInfoFileName;
}

std::string CommandLineInterface::getHistogramsInfoFileName() const {
	return histogramsInfoFileName;
}

std::string CommandLineInterface::getTrajectoriesDir() const {
	return trajectoriesDir;
}
std::size_t CommandLineInterface::getTrajectoriesOffset() const {
	return trajectoriesOffset;
}
std::string CommandLineInterface::getHistogramsDir() const {
	return histogramsDir;
}

bool CommandLineInterface::getRecompile() const {
	return recompile;
}

std::string CommandLineInterface::getCmdArgs() const {
	return cmdArgs;
}

void CommandLineInterface::parse(int ac, char* av[]) {
	try {
		boost::program_options::store(boost::program_options::parse_command_line(ac,av,combined), vm);
	}
	catch (...) {
		std::cout << "StochKit ERROR (CommandLineInterface::parse): unable to parse command-line arguments.  Run with --help for a list of required and optional parameters.\n";
		exit(1);
	}

	boost::program_options::notify(vm);

	if (vm.count("help")) {
		std::cout << visible;
		exit(0);
	}

	if (!(vm.count("model") && vm.count("time") && vm.count("realizations"))) {
		std::cout << "StochKit ERROR (CommandLineInterface::parse): missing required parameter(s).  Run with --help for a list of required and optional parameters.\n";
		exit(1);
	}

	if (realizations==0) {
		std::cout << "StochKit ERROR (CommandLineInterface::parse): number of realizations = 0. Exiting.\n";
		exit(1);
	}

	if (vm.count("seed")) {
		useSeed=true;
	}
	else {
		useSeed=false;
	}

	keepTrajectories=false;//default
	if (vm.count("keep-trajectories")) {
		keepTrajectories=true;
	}

	keepHistograms=false;//default
	if (vm.count("keep-histograms")) {
		keepHistograms=true;
	}

	keepStats=true;//default; if set to false, must keep trajectories or histograms (otherwise you would be storing nothing)
	if (vm.count("no-stats")) {
		if (!keepTrajectories && !keepHistograms) {
			std::cout << "StochKit ERROR (CommandLineInterface::parse): must keep statistics, trajectory or histogram data.\n." << std::endl;
			exit(1);
		}

		keepStats=false;
	}

	if (epsilon<=0.0 || epsilon>=1.0) {
		std::cout << "StochKit ERROR (CommandLineInterface::parse): invalid value for epsilon.  Run with --help for more info.\n";
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
		outputDir=tmp_full_model_path.substr(0,tmp_full_model_path.find_last_of("."))+"_output";
	}

	if (vm.count("no-recompile")) {
		recompile=false;
	}
	else {
		recompile=true;
	}

	std::string full_model_path=boost::filesystem::system_complete(modelFileName).string();
	generatedCodeDir=full_model_path.substr(0,full_model_path.find_last_of("."))+"_generated_code";
	
	if (vm.count("use-existing-output-dirs")) {
		useExistingOutputDirs=true;
	}
	else {
		useExistingOutputDirs=false;
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
					std::cout << "StochKit ERROR (CommandLineInterface::parse): species index \""<<index<<"\" larger than number of species (Note: indices start at 0, so largest index is "<<modelSpeciesList.size()-1<<")\n";
					exit(1);
				}
			}
		}

	}
	//create vector of species names
	if (speciesSubset.size()==0) {//if keeping all species, use species label vector from model_tag
		speciesNames=modelSpeciesList;
	}
	else {//we're using a species subset, so we need to create the appropriate species label subset
		DenseVectorSubset<std::vector<std::string> > labelSubset(speciesSubset);
		speciesNames=labelSubset.getSubset(modelSpeciesList);
	}
}//end parse

}
