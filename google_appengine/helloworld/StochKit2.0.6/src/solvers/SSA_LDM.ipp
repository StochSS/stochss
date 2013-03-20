/*!
	\brief the logarithmic direct method of the Stochastic Simulation Algorithm (SSA)
*/

#if !defined(_SSA_LDM_IPP_)
#error This file is the implementation of SSA_LDM
#endif

namespace STOCHKIT
{

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
SSA_LDM(const _populationVectorType& initialPop,
		const _stoichiometryType& stoich,
		const _propensitiesFunctorType& propensitiesFunctor,
		const _dependencyGraphType& depGraph,
		 int seed=time(NULL)) :
		initialPopulation(initialPop),
		stoichiometry(stoich),
		propensities(propensitiesFunctor),
		dependencyGraph(depGraph),
		dependencyGraphPostOrder(depGraph.size()),
	        NumberOfSpecies(initialPop.size()),
		#ifdef MATRIX_STOICHIOMETRY
	        	NumberOfReactions(stoich.size1()),
		#else		
	        	NumberOfReactions(stoich.size()),
		#endif
          propensityTree(depGraph.size()),
          initialPropensityTree(depGraph.size())
	{
		randomGenerator.Seed(seed);
		std::vector<double> initialPropensities(depGraph.size());
		for (std::size_t i=0; i!=depGraph.size(); ++i) {
			initialPropensities[i]=propensities(i,initialPopulation);
		}
		initialPropensityTree.build(initialPropensities);
		createDependencyGraphPostOrder(depGraph);
	}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
SSA_LDM<_populationVectorType, 
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
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
createDependencyGraphPostOrder(const _dependencyGraphType& depGraph) {
	for (std::size_t i=0; i!=depGraph.size(); ++i) {
		dependencyGraphPostOrder[i]=initialPropensityTree.sortPostOrder(depGraph[i]);
	}
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
initialize(double startTime = 0.0) {
	  currentTime=startTime;
	  currentPopulation=initialPopulation;
	  propensityTree=initialPropensityTree;
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
inline
double
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
selectStepSize() {
	if (propensityTree.tree[0].sum<0.0) {
		std::cerr << "StochKit WARNING (SSA_LDM::selectStepSize): propensitySum<0, returning step size=infinity\n";
		return std::numeric_limits<double>::infinity();
	}
	return randomGenerator.Exponential(1.0/propensityTree.tree[0].sum);
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
validate(double startTime, double endTime) {
	if (startTime>=endTime) {
		std::cout << "StochKit ERROR (SSA_LDM::validate): startTime not before endTime\n";
		return false;
	}
	std::size_t N=initialPopulation.size();
	#ifdef MATRIX_STOICHIOMETRY
		std::size_t M=stoichiometry.size1();
	#else
		std::size_t M=stoichiometry.size();
	#endif
	if (N==0) {
		std::cout << "StochKit ERROR (SSA_LDM::validate): initial population size=0\n";
		return false;
	}
	if (N!=NumberOfSpecies) {
		std::cout << "StochKit ERROR (SSA_LDM::validate): Number of species does not equal initial population size\n";
		return false;
	}
	if (M!=NumberOfReactions) {
		std::cout << "StochKit ERROR (SSA_LDM::validate): Number of reactions does not equal stoichiometry size\n";
		return false;
	}
	if (M!=propensities.size()) {
		std::cout << "StochKit ERROR (SSA_Direct::validate): Number of reactions does not equal propensities size\n";
		return false;
	}

	//check initial populations are all non-negative
	for (std::size_t i=0; i!=NumberOfSpecies; ++i) {
		if (initialPopulation[i]<0) {
			std::cout << "StochKit ERROR (SSA_LDM::validate): negative value detected in initial population\n";
			return false;
		}
	}

	//check that propensities, evaluated with initial population, are all non-negative
	for (std::size_t i=0; i!=NumberOfReactions; ++i) {
		if (propensities(i,initialPopulation)<0.0) {
			std::cout << "StochKit ERROR (SSA_LDM::validate): negative propensity detected based on initial population\n";
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
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
selectReaction() {
	if (propensityTree.tree[0].sum<=0.0) {
		return -1;
	}
	previousReactionIndex=propensityTree.selectReactionIndex(randomGenerator.ContinuousOpen(0.0, 1.0));
	return previousReactionIndex;
}//end selectReaction

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
fireReaction(int reactionIndex) {
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

	std::vector<double> updatedPropensities(dependencyGraphPostOrder[reactionIndex].size());
	for (std::size_t i=0; i!=updatedPropensities.size(); ++i) {
		updatedPropensities[i]=propensities(dependencyGraphPostOrder[reactionIndex][i],currentPopulation);
	}
	propensityTree.updateTree(dependencyGraphPostOrder[reactionIndex],updatedPropensities);

	return true;
}//end fireReaction

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
SSA_LDM<_populationVectorType, 
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
SSA_LDM<_populationVectorType, 
		   _stoichiometryType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate=true) {
	

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

}
