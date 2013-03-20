/*!
	\brief the direct method of the Stochastic Simulation Algorithm (SSA)
*/

#if !defined(_SSA_NRM_IPP_)
#error This file is the implementation of SSA_NRM
#endif

namespace STOCHKIT
{

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
SSA_NRM(const _populationVectorType& initialPop,
	const _stoichiometryType& stoich,
	const _propensitiesFunctorType& propensitiesFunctor,
	const _dependencyGraphType& depGraph,
	int seed) :
		initialPopulation(initialPop),
		stoichiometry(stoich),
		propensities(propensitiesFunctor),
		dependencyGraph(depGraph),
	        NumberOfSpecies(initialPop.size()),
		NumberOfReactions(stoich.size()),
		rxnHeap((int)NumberOfReactions),
		currentPropensities(stoichiometry.size()),
		previousReactionIndex(-1),
		maxStepsCalculateAllPropensities(defaultMaxStepsCalculateAllPropensities),
		detectedVerySmallPropensity(false)
{
	randomGenerator.Seed(seed);

	//fix dependency graph to ensure reaction is in its own dependency graph (previous code would
	//not include in A->A+B because propensity is not changed but NRM needs it)
	for (std::size_t i=0; i!=dependencyGraph.size(); ++i) {
	  //insert i into the dependency graph for rxn i
	  dependencyGraph[i].push_back(i);
	  //sort and remove duplicates
	  std::sort(dependencyGraph[i].begin(),dependencyGraph[i].end());
	  dependencyGraph[i].erase(std::unique(dependencyGraph[i].begin(),dependencyGraph[i].end()),dependencyGraph[i].end());
	}
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
seed(int seed) {
	randomGenerator.Seed(seed);
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
initialize(double startTime) {
	previousReactionIndex=-1;
	currentTime=startTime;
	currentPopulation=initialPopulation;
	calculateAllPropensities();
	
	//draw random time for each reaction and store in intialTimes
	int nRxns = (int)NumberOfReactions;
	double* initialTimes = (double*)malloc( nRxns * sizeof(double) );
	for(int i=0; i<nRxns; i++ )
	  {
	    if(currentPropensities[i] == 0)
	      initialTimes[i] = std::numeric_limits<double>::infinity();
	    else
	      initialTimes[i] = randomGenerator.Exponential(1.0/currentPropensities[i]);
	  }
	
	//put in to BinHeap and order BinHeap
	rxnHeap.initializeHeap( initialTimes );

	free(initialTimes);
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
validate(double startTime, double endTime) {
	if (startTime>=endTime) {
		std::cout << "StochKit ERROR (SSA_NRM::validate): startTime not before endTime\n";
		return false;
	}

	std::size_t N=initialPopulation.size();
	std::size_t M=stoichiometry.size();
	if (N==0) {
		std::cout << "StochKit ERROR (SSA_NRM::validate): initial population size=0\n";
		return false;
	}
	if (N!=NumberOfSpecies) {
		std::cout << "StochKit ERROR (SSA_NRM::validate): Number of species does not equal initial population size\n";
		return false;
	}
	if (M!=NumberOfReactions) {
		std::cout << "StochKit ERROR (SSA_NRM::validate): Number of reactions does not equal stoichiometry size\n";
		return false;
	}
	if (M!=propensities.size()) {
		std::cout << "StochKit ERROR (SSA_NRM::validate): Number of reactions does not equal propensities size\n";
		return false;
	}

	//check initial populations are all non-negative
	for (std::size_t i=0; i!=NumberOfSpecies; ++i) {
		if (initialPopulation[i]<0) {
			std::cout << "StochKit ERROR (SSA_NRM::validate): negative value detected in initial population\n";
			return false;
		}
	}

	//check that propensities, evaluated with initial population, are all non-negative
	for (std::size_t i=0; i!=NumberOfReactions; ++i) {
		if (propensities(i,initialPopulation)<0.0) {
			std::cout << "StochKit ERROR (SSA_NRM::validate): negative propensity detected based on initial population\n";
			return false;
		}
	}
			
	return true;	  
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
calculateAllPropensities() {
  double smallestNonzeroPropensity=std::numeric_limits<double>::max();
	
  for (std::size_t i=0; i!=NumberOfReactions; ++i)
    {
      currentPropensities[i]=propensities(i,currentPopulation);
      if (currentPropensities[i]>0.0 && currentPropensities[i]<smallestNonzeroPropensity)
	{
	  smallestNonzeroPropensity=currentPropensities[i];
	}
    }
  stepsSinceCalculateAllPropensities=0;
  
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
bool
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
fireReaction() {
  int reactionIndex = rxnHeap.getNextRxnNumber();

  //change populations according to reaction
  currentPopulation+=stoichiometry[reactionIndex];
  
  //if next time is infiniti no reaction is fired
  if( !updateCurrentTime() ){
    previousReactionIndex = -1;
    return false;
  }  

  int affectedReactionIndex;
  double oldPropensity;
  double oldAbsoluteTime;
  //calculate new propensities for affected reactions
  for (std::size_t i=0; i!=dependencyGraph[reactionIndex].size(); ++i)
    {
      affectedReactionIndex=dependencyGraph[reactionIndex][i];
      
      oldPropensity=currentPropensities[affectedReactionIndex];
      currentPropensities[affectedReactionIndex]=propensities(affectedReactionIndex,currentPopulation);
      
      double newAbsoluteTime;
      if(affectedReactionIndex != reactionIndex && oldPropensity!=0.0)
	{
	  oldAbsoluteTime = rxnHeap.getRxnTime(affectedReactionIndex);
	  if (currentPropensities[affectedReactionIndex]>0)
	    {
	      double myCurrentTime=getCurrentTime();
	      double oldRelativeTime=(oldAbsoluteTime-myCurrentTime);
	      double oldPropensOVERnew=(oldPropensity/currentPropensities[affectedReactionIndex]);
	      
	      newAbsoluteTime = oldPropensOVERnew * oldRelativeTime + myCurrentTime;
	      rxnHeap.setNewRxnTime(affectedReactionIndex, newAbsoluteTime);
	    }
	  else
	    {
	      rxnHeap.setNewRxnTime(affectedReactionIndex, std::numeric_limits<double>::infinity());
	    }

	}
      else
	{
	  if (currentPropensities[affectedReactionIndex]>0)
	    {
	      double myCurrentTime=getCurrentTime();
	      double myRate=1.0/ currentPropensities[affectedReactionIndex];
	      double myExp=randomGenerator.Exponential(myRate);
	      newAbsoluteTime=myExp+myCurrentTime;
	      rxnHeap.setNewRxnTime(affectedReactionIndex, newAbsoluteTime );
	    }		    
	  else
	    {
	      rxnHeap.setNewRxnTime(affectedReactionIndex, std::numeric_limits<double>::infinity());
	    }
	}
      
    }
  previousReactionIndex = reactionIndex;

  stepsSinceCalculateAllPropensities++;
  return true;
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
template<typename IntervalOutputType>
void
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate) {

	if (doValidate) {
		if (!validate(startTime,endTime)) {
			std::cerr << "StochKit ERROR (SSA_NRM::simulate): validate() failed, simulation aborted\n";
			exit(1);
		}		
	}

	if (!output.initialize(realizations,startTime,endTime,initialPopulation)) {
		std::cerr << "StochKit ERROR (SSA_NRM::simulate): initialization of output object failed, simulation aborted\n";
		exit(1);
	}
	
	std::vector<double> outputTimes = output.getOutputTimes();
	std::size_t totalIntervals=outputTimes.size();

	std::size_t currentInterval;

	for (std::size_t currentRealization=0; currentRealization!=realizations; ++currentRealization) {
		initialize(startTime);

	    currentInterval=0;    
	    //updateCurrentTime();
	    //while (currentTime<endTime) {
		while (getNextReactionTime()<endTime) {
			//while (currentInterval<totalIntervals && currentTime >=outputTimes[currentInterval]) {
			while (currentInterval<totalIntervals && getNextReactionTime() >=outputTimes[currentInterval]) {
				output.record(currentRealization,currentInterval,currentPopulation);
				currentInterval++;
			}

			fireReaction();
			//updateCurrentTime();//fireReaction now updates
		}
	    while (currentInterval<totalIntervals && getNextReactionTime()>=outputTimes[currentInterval]) {
			output.record(currentRealization,currentInterval,currentPopulation);
			currentInterval++;
		}	
	}//end main for
}//end simulate	

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
double
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
getCurrentTime(){
	return currentTime;
}


template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
bool
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
updateCurrentTime(){
	currentTime=rxnHeap.getNextRxnTime();

  if( rxnHeap.getNextRxnTime() == std::numeric_limits<double>::infinity() )
    return false;
  else{
	return true;
  }
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
_populationVectorType
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
getCurrentPopulation(){
	return currentPopulation;
}
		


template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
int
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
getPreviousReactionIndex(){
  return previousReactionIndex;
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
int
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
getNextReactionIndex(){
  return rxnHeap.getNextRxnNumber();
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
double
SSA_NRM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
getNextReactionTime(){
  return rxnHeap.getNextRxnTime();
}

}//namespace Stochkit
