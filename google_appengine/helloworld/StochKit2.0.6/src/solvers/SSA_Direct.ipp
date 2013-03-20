/*!
	\brief the direct method of the Stochastic Simulation Algorithm (SSA)
*/

#if !defined(_SSA_DIRECT_IPP_)
#error This file is the implementation of SSA_Direct
#endif

namespace STOCHKIT
{

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
SSA_Direct(const _populationVectorType& initialPop,
	const _stoichiometryType& stoich,
	const _propensitiesFunctorType& propensitiesFunctor,
	const _dependencyGraphType& depGraph,
	int seed) :
		initialPopulation(initialPop),
		stoichiometry(stoich),
		propensities(propensitiesFunctor),
		dependencyGraph(depGraph),
	        NumberOfSpecies(initialPop.size()),
		#ifdef MATRIX_STOICHIOMETRY
	        	NumberOfReactions(stoich.size1()),
			currentPropensities(stoichiometry.size1()),
		#else
	        	NumberOfReactions(stoich.size()),
			currentPropensities(stoichiometry.size()),
		#endif
		previousReactionIndex(-1),
		maxStepsCalculateAllPropensities(defaultMaxStepsCalculateAllPropensities),
		detectedVerySmallPropensity(false)
{
	randomGenerator.Seed(seed);
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
SSA_Direct<_populationVectorType, 
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
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
initialize(double startTime) {
	previousReactionIndex=-1;
	currentTime=startTime;
	currentPopulation=initialPopulation;
	calculateAllPropensities();
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
validate(double startTime, double endTime) {
	if (startTime>=endTime) {
		std::cout << "StochKit ERROR (SSA_Direct::validate): startTime not before endTime\n";
		return false;
	}

	std::size_t N=initialPopulation.size();
	#ifdef MATRIX_STOICHIOMETRY
		std::size_t M=stoichiometry.size1();
	#else
		std::size_t M=stoichiometry.size();
	#endif
	if (N==0) {
		std::cout << "StochKit ERROR (SSA_Direct::validate): initial population size=0\n";
		return false;
	}
	if (N!=NumberOfSpecies) {
		std::cout << "StochKit ERROR (SSA_Direct::validate): Number of species does not equal initial population size\n";
		return false;
	}
	if (M!=NumberOfReactions) {
		std::cout << "StochKit ERROR (SSA_Direct::validate): Number of reactions does not equal stoichiometry size\n";
		return false;
	}
	if (M!=propensities.size()) {
		std::cout << "StochKit ERROR (SSA_Direct::validate): Number of reactions does not equal propensities size\n";
		return false;
	}

	//check initial populations are all non-negative
	for (std::size_t i=0; i!=NumberOfSpecies; ++i) {
		if (initialPopulation[i]<0) {
			std::cout << "StochKit ERROR (SSA_Direct::validate): negative value detected in initial population\n";
			return false;
		}
	}

	//check that propensities, evaluated with initial population, are all non-negative
	for (std::size_t i=0; i!=NumberOfReactions; ++i) {
		if (propensities(i,initialPopulation)<0.0) {
			std::cout << "StochKit ERROR (SSA_Direct::validate): negative propensity detected based on initial population\n";
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
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
calculateAllPropensities() {
	double smallestNonzeroPropensity=std::numeric_limits<double>::max();
	
	propensitySum=0.0;
	for (std::size_t i=0; i!=NumberOfReactions; ++i) {
		currentPropensities[i]=propensities(i,currentPopulation);
		#ifdef DEBUG
				if (currentPropensities[i]!=currentPropensities[i]) {
					std::cout << "StochKit DEBUG (SSA_Direct::calculateAllPropensities): detected 'NaN (not a number)' propensity for reaction index "<<i<<".\n";
					std::cout << "currentPopulation was:\n";
					for (std::size_t j=0; j!=currentPopulation.size(); ++j) {
						std::cout << "currentPopulation["<<j<<"]="<<currentPopulation[j]<<"\n";
					}
					std::cout << "Terminating.\n";
					exit(1);
				}
				if (currentPropensities[i]==std::numeric_limits<double>::infinity()) {
					std::cout << "StochKit DEBUG (SSA_Direct::calculateAllPropensities): detected 'infinity' propensity for reaction index "<<i<<".\n";
					std::cout << "currentPopulation was:\n";
					for (std::size_t j=0; j!=currentPopulation.size(); ++j) {
						std::cout << "currentPopulation["<<j<<"]="<<currentPopulation[j]<<"\n";
					}
					std::cout << "Terminating.\n";
					exit(1);
				}
			if (currentPropensities[i]<0.0) {
				std::cout << "StochKit DEBUG (SSA_Direct::calculateAllPropensities): detected negative propensity ("<<currentPropensities[i]<<") for reaction index "<<i<<"\n";
				std::cout << "currentPopulation was:\n";
				for (std::size_t j=0; j!=currentPopulation.size(); ++j) {
					std::cout << "currentPopulation["<<j<<"]="<<currentPopulation[j]<<"\n";
				}
				std::cout << "Terminating.\n";
				exit(1);
			}
		#endif
		propensitySum+=currentPropensities[i];
		if (currentPropensities[i]>0.0 && currentPropensities[i]<smallestNonzeroPropensity) {
			smallestNonzeroPropensity=currentPropensities[i];
		}
	}
	stepsSinceCalculateAllPropensities=0;
	
	if (propensitySum>0.0 && smallestNonzeroPropensity/propensitySum<2E-10) { //per S.Mauch, M.Stalzer. (2009) "Efficient Formulations for Exact..."
		if (detectedVerySmallPropensity==false) {
			detectedVerySmallPropensity=true;
			std::cout << "StochKit WARNING (SSA_Direct::calculateAllPropensities): detected very small propensity value, biased sampling of small propensity reactions may occur\n";
		}
	}
	#ifdef DEBUG
		//a reasonable place to check for possible time step inaccuracy
		if (propensitySum>0.0 && currentTime>2E21/propensitySum) { //per Mauch, Stalzer. (2009) "Efficient Formulations..."
			std::cout << "StochKit DEBUG (SSA_Direct::calculateAllPropensities): ratio of average time step size to simulation currentTime is very small, may lead to step size inaccuracies\n";
		}
	#endif
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
double
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
selectStepSize() {

	if (propensitySum<0.0) {
			#ifdef DEBUG
				std::cout << "StochKit DEBUG (SSA_Direct::selectStepSize): detected negative propensitySum, recalculating\n";
			#endif
	        //if propensitySum negative, recalculate all propensities
	        calculateAllPropensities();
		//if still negative, give warning and return infinity
		if (propensitySum<0.0) {
			std::cerr << "StochKit WARNING (SSA_Direct::selectStepSize): propensitySum<0, returning step size=infinity\n";
			return std::numeric_limits<double>::infinity();
		}
	}

	return randomGenerator.Exponential(1.0/propensitySum);
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
int
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
selectReaction() {

	previousReactionIndex=-1;
	if (stepsSinceCalculateAllPropensities>maxStepsCalculateAllPropensities) {
		calculateAllPropensities();
	}

	//generate a uniform random number between (0,propensitySum)
	double r=0;
	while (r==0) {
		r=randomGenerator.ContinuousOpen(0,1)*propensitySum;
	}
	double jsum=0;
	while (jsum < r) {
		++previousReactionIndex;
		//test that we don't run off end of array
		if (previousReactionIndex==(int)NumberOfReactions) {
			#ifdef DEBUG
				std::cout << "StochKit DEBUG (SSA_Direct::selectReaction): detected numerical error in propensities, recalculating\n";
			#endif
			calculateAllPropensities();
			return selectReaction();
		}
		else {
			#ifdef DEBUG
				if (currentPropensities[previousReactionIndex]<0.0) {
					std::cout << "StochKit DEBUG (SSA_Direct::selectReaction): detected negative propensity ("<<currentPropensities[previousReactionIndex]<<") for reaction index "<<previousReactionIndex<<"\n";
					std::cout << "currentPopulation was:\n";
					for (std::size_t i=0; i!=currentPopulation.size(); ++i) {
						std::cout << "currentPopulation["<<i<<"]="<<currentPopulation[i]<<"\n";
					}
					std::cout << "Terminating.\n";
					exit(1);
				}
			#endif			
			jsum+=currentPropensities[previousReactionIndex];
		}
	}
  
	return previousReactionIndex;
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
bool
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
fireReaction(int reactionIndex) {
	if (reactionIndex==-1) {
		#ifdef DEBUG
			std::cout << "StochKit DEBUG (SSA_Direct::fireReaction): attempt to fire reaction index = -1. Terminating.\n";
			exit(1);
		#endif
		return false;
	}
	else {
		//if not -1, assumes valid reactionIndex
		#ifdef MATRIX_STOICHIOMETRY
			matrixrow dX(stoichiometry, reactionIndex);
			typename matrixrow::iterator it;
			for(it=dX.begin();it!=dX.end();it++) {
				currentPopulation[it.index()]+=*it;
			}
		#else
			currentPopulation+=stoichiometry[reactionIndex];
		#endif
		int affectedReactionIndex;
		double oldPropensity;
		for (std::size_t i=0; i!=dependencyGraph[reactionIndex].size(); ++i) {
			affectedReactionIndex=dependencyGraph[reactionIndex][i];
			oldPropensity=currentPropensities[affectedReactionIndex];
			currentPropensities[affectedReactionIndex]=propensities(affectedReactionIndex,currentPopulation);
			#ifdef DEBUG
				if (currentPropensities[affectedReactionIndex]!=currentPropensities[affectedReactionIndex]) {
					std::cout << "StochKit DEBUG (SSA_Direct::fireReaction): detected 'NaN (not a number)' propensity for reaction index "<<affectedReactionIndex<<" while updating after firing reaction index "<<reactionIndex<<".\n";
				}
				if (currentPropensities[affectedReactionIndex]==std::numeric_limits<double>::infinity()) {
					std::cout << "StochKit DEBUG (SSA_Direct::fireReaction): detected 'infinity' propensity for reaction index "<<affectedReactionIndex<<" while updating after firing reaction index "<<reactionIndex<<".\n";
				}
				if (currentPropensities[affectedReactionIndex]<0.0) {
					std::cout << "StochKit DEBUG (SSA_Direct::fireReaction): detected negative propensity for reaction index "<<affectedReactionIndex<<" while updating after firing reaction index "<<reactionIndex<<".\n";
					std::cout << "updated currentPopulation is:\n";
					for (std::size_t i=0; i!=currentPopulation.size(); ++i) {
						std::cout << "currentPopulation["<<i<<"]="<<currentPopulation[i]<<"\n";
					}
					std::cout << "population before firing reaction was:\n";
					_populationVectorType oldPop=currentPopulation-=stoichiometry[reactionIndex];
					for (std::size_t i=0; i!=oldPop.size(); ++i) {
						std::cout << "oldPopulation["<<i<<"]="<<oldPop[i]<<"\n";
					}
					std::cout << "Terminating.\n";
					exit(1);
				}
			#endif			
			propensitySum+=currentPropensities[affectedReactionIndex]-oldPropensity;
		}
		stepsSinceCalculateAllPropensities++;
		return true;
	}
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
bool
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
step() {
	currentTime+=selectStepSize();
	return fireReaction(selectReaction());
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
template<typename IntervalOutputType>
void
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate) {
	

	if (doValidate) {
		if (!validate(startTime,endTime)) {
			std::cerr << "StochKit ERROR (SSA_Direct::simulate): validate() failed, simulation aborted\n";
			exit(1);
		}		
	}

	if (!output.initialize(realizations,startTime,endTime,initialPopulation)) {
		std::cerr << "StochKit ERROR (SSA_Direct::simulate): initialization of output object failed, simulation aborted\n";
		exit(1);
	}
	
	std::vector<double> outputTimes = output.getOutputTimes();
	std::size_t totalIntervals=outputTimes.size();

	std::size_t currentInterval;

	for (std::size_t currentRealization=0; currentRealization!=realizations; ++currentRealization) {
		initialize(startTime);
		currentInterval=0;

		currentTime+=selectStepSize();
		while (currentTime<endTime) {
			
			while (currentInterval<totalIntervals && currentTime >=outputTimes[currentInterval]){
				output.record(currentRealization,currentInterval,currentPopulation);
				currentInterval++;
			}

			fireReaction(selectReaction());
			currentTime+=selectStepSize();
		}
		while (currentInterval<totalIntervals && currentTime>=outputTimes[currentInterval]){
			output.record(currentRealization,currentInterval,currentPopulation);
			currentInterval++;
		}	
	}

}//end simulate	

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
double
SSA_Direct<_populationVectorType, 
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
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
setCurrentTime(double newCurrentTime){
	currentTime = newCurrentTime;
	return true;
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
_populationVectorType
SSA_Direct<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
getCurrentPopulation(){
	return currentPopulation;
}
		
}

