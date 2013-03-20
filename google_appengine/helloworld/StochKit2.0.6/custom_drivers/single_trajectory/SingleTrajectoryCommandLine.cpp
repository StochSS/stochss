/******************************************************************************
 */

#include "SingleTrajectoryCommandLine.h"

using namespace STOCHKIT;

SingleTrajectoryCommandLine::SingleTrajectoryCommandLine(int ac, char* av[]):
  visible("command line options")
{
  visible.add_options()
    ("model,m", boost::program_options::value<std::string>(&modelFileName),"**REQUIRED Model file name")
    ("time,t",boost::program_options::value<double>(&simulationTime),"**REQUIRED Simulation time (i.e. run each realization from t=0 to t=time)")
    ("max-steps",boost::program_options::value<unsigned>(&maxSteps)->default_value(1000000),"Maximum reaction steps to take before terminating (default is 1 million).")
    ("species",boost::program_options::value<std::vector<std::string> >()->multitoken(),"List of subset of species (names or indices) to include in output.  If not specified, all species are included in output.")
    ("label","Label columns with species names")
    ("seed",boost::program_options::value<int>(&seed),"Seed the random number generator")
    ("help,h","Use -h or --help to list all arguments")
    ;
  
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
	std::string serchingString="-m "+modelFileName;
	std::string replaceString="-m "+(std::string)"\""+modelFileName+(std::string)"\"";
	int index=cmdArgs.find(serchingString, 0);
	if(index!=std::string::npos)
		cmdArgs.replace(index, serchingString.size(), replaceString); 
#endif
}


	
std::string SingleTrajectoryCommandLine::getModelFileName() const {
  return modelFileName;
}

double SingleTrajectoryCommandLine::getSimulationTime() const {
  return simulationTime;
}

bool SingleTrajectoryCommandLine::getUseSeed() const {
  return useSeed;
}

int SingleTrajectoryCommandLine::getSeed() const {
  return seed;
}

unsigned SingleTrajectoryCommandLine::getMaxSteps() const {
  return maxSteps;
}

std::vector<std::size_t> SingleTrajectoryCommandLine::getSpeciesSubset() const {
  return speciesSubset;
}

bool SingleTrajectoryCommandLine::getLabel() const {
  return label;
}

std::vector<std::string> SingleTrajectoryCommandLine::getSpeciesNames() const {
  return speciesNames;
}

std::string SingleTrajectoryCommandLine::getCmdArgs() const {
  return cmdArgs;
}

void SingleTrajectoryCommandLine::parse(int ac, char* av[]) {
  try {
    boost::program_options::store(boost::program_options::parse_command_line(ac,av,visible), vm);
  }
  catch (...) {
    std::cout << "StochKit ERROR (SingleTrajectoryCommandLine::parse): unable to parse command-line arguments.  Run with --help for a list of required and optional parameters.\n";
    exit(1);
  }
	
  boost::program_options::notify(vm);

  if (vm.count("help")) {
    std::cout << visible;
    exit(0);
  }

  if (!(vm.count("model") && vm.count("time"))) {
    std::cout << "StochKit ERROR (SingleTrajectoryCommandLine::parse): missing required parameter(s).  Run with --help for a list of required and optional parameters.\n";
    exit(1);
  }

  if (vm.count("seed")) {
    useSeed=true;
  }
  else {
    useSeed=false;
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
	  std::cout << "StochKit ERROR (SingleTrajectoryCommandLine::parse): species index \""<<index<<"\" larger than number of species (Note: indices start at 0, so largest index is "<<modelSpeciesList.size()-1<<")\n";
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
