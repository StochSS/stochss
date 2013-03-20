/*!
	\brief the amortized constant-complexity (composition-rejection) method of the Stochastic Simulation Algorithm (SSA)
*/

#if !defined(_SSA_CONSTANTTIME_IPP_)
#error This file is the implementation of SSA_ConstantTime
#endif

namespace STOCHKIT
{

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
SSA_ConstantTime<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
SSA_ConstantTime(const _populationVectorType& initialPop,
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
		#else
	        	NumberOfReactions(stoich.size()),
		#endif
		currentPropensities(NumberOfReactions),
		groups(NumberOfReactions),
		initialPropensities(NumberOfReactions),
		initialGroups(NumberOfReactions)
	{
		randomGenerator.Seed(seed);
		for (std::size_t i=0; i!=NumberOfReactions; ++i){
			initialPropensities[i]=propensities(i,initialPopulation);
		}
		groups.build(initialPropensities);
		initialGroups=groups;
	}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
SSA_ConstantTime<_populationVectorType, 
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
SSA_ConstantTime<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
initialize(double startTime = 0.0) {
	currentTime=startTime;
	currentPopulation=initialPopulation;
	currentPropensities=initialPropensities;
	groups=initialGroups;
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
double
SSA_ConstantTime<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
selectStepSize() {
	if (groups.getPropensitySum()<0.0) {
	        //if propensitySum negative, recalculate all propensities
	        groups.recalculatePropensitySum();
		//if still negative, give warning and return infinity
		if (groups.getPropensitySum()<0.0) {
			std::cerr << "StochKit WARNING (SSA_ConstantTime::selectStepSize): propensitySum<0, returning step size=infinity\n";
			return std::numeric_limits<double>::infinity();
		}
	}
	return randomGenerator.Exponential(1.0/groups.getPropensitySum());
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_ConstantTime<_populationVectorType, 
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
int
SSA_ConstantTime<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
selectReaction() {
	return groups.selectReaction(randomGenerator);
}//end selectReaction

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_ConstantTime<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
fireReaction(int reactionIndex) {
	previousReactionIndex=reactionIndex;

	if (reactionIndex==-1) {
		return false;
	}

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

	//update affected reactions
	std::size_t numAffectedReactions=dependencyGraph[previousReactionIndex].size();
	for (std::size_t i=0; i!=numAffectedReactions; ++i) {
		affectedReactionIndex=dependencyGraph[previousReactionIndex][i];

		oldPropensity=currentPropensities[affectedReactionIndex];
		currentPropensities[affectedReactionIndex]=propensities(affectedReactionIndex,currentPopulation);

		//now we need to update groups data structures
		groups.update(affectedReactionIndex, oldPropensity, currentPropensities[affectedReactionIndex]);
	}

	return true;
}//end fireReaction

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_ConstantTime<_populationVectorType, 
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
SSA_ConstantTime<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate) {

	if (doValidate) {
		if (!validate(startTime,endTime)) {
			std::cerr << "StochKit ERROR (SSA_ConstantTime::simulate): validate() failed, simulation aborted\n";
			exit(1);
		}
	}

	if (!output.initialize(realizations,startTime,endTime,initialPopulation)) {
		std::cerr << "StochKit ERROR (SSA_ConstantTime::simulate): initialization of output object failed, simulation aborted\n";
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
			
			while (currentInterval<totalIntervals && currentTime>=outputTimes[currentInterval]){
				output.record(currentRealization,currentInterval,currentPopulation);
				currentInterval++;
			}

			fireReaction(selectReaction());
			currentTime+=selectStepSize();
		}
		while (currentInterval<totalIntervals && currentTime >=outputTimes[currentInterval]){
			output.record(currentRealization,currentInterval,currentPopulation);
			currentInterval++;
		}	
	}
}//end simulate	

}
