/*!

*/

#if !defined(_TAU_LEAPING_EXPLICIT_ADAPTIVE_IPP_)
#error This file is the implementation of TauLeapingExplicitAdaptive
#endif

namespace STOCHKIT
{

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
TauLeapingExplicitAdaptive(const _denseVectorType& initialPop,
	const _matrixType& stoich,
	const _propensitiesFunctorType& propensitiesFunctor,
	const _dependencyGraphType& depGraph,
	int seed) : SSA_Direct<_denseVectorType, _matrixType, _propensitiesFunctorType, _dependencyGraphType>(initialPop, stoich, propensitiesFunctor, depGraph, seed),
						   previousReactionCounts(NumberOfReactions),
						   criticalThreshold(5),
						   affectedReactions(NumberOfSpecies),
						   affectedSpecies(NumberOfReactions),
						   threshold(10),
						   SSASteps(100),
						   epsilon(0.03),
						   g(3.0),//could improve
						   squaredVj(stoich),
						   mu(NumberOfSpecies),
						   sigmaSquared(NumberOfSpecies)
{
	squaredVj=element_prod(stoichiometry, stoichiometry);
	//should have a debug check here that ensures _denseVectorType::value_type and _matrixType::value_type are both double
	//for neg
	tagList=new bool[NumberOfReactions];
	std::vector<std::size_t> temp;
	std::size_t i, j;
	for(i=0; i<NumberOfReactions; i++)
		reactionToSpecies.push_back(temp);
	for(i=0; i<NumberOfSpecies; i++)
		speciesToReaction.push_back(temp);
	for(i=0; i<NumberOfReactions; i++)
	{
		for(j=0; j<NumberOfSpecies; j++)
		{
			if(stoichiometry(i,j)<0)
			{
				reactionToSpecies[i].push_back(j);
				speciesToReaction[j].push_back(i);
			}
		}
	}
	for(i=0; i<NumberOfReactions; i++)
		affectedSpecies[i]=reactionToSpecies[i].size();
	for(i=0; i<NumberOfSpecies; i++)
		affectedReactions[i]=speciesToReaction[i].size();
}


template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::delete_product()//for neg
{
	trimed_list.clear();
	for(std::size_t i=0; i<NumberOfSpecies; i++)
	{
		if(affectedReactions[i]!=0)
			trimed_list.push_back(i);
	}
	NumberOfReactants=trimed_list.size();
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::initialize(double startTime)//for neg
{
	std::size_t i;
	SSA::initialize(startTime);
	criticalSpecies.clear();
	noncriticalSpecies.clear();
	for(i=0; i<NumberOfReactants; i++)
		noncriticalSpecies.push_back(trimed_list[i]);
	for(i=0; i<NumberOfReactions; i++)
		tagList[i]=false;
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::prepare()//for neg
{
	delete_product();
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::setEpsilon(double epsilon)
{
	if (epsilon<=0.0 || epsilon>=1.0) {
		std::cerr << "StochKit ERROR (TauLeapingExplicitAdaptive::setEpsilon): epsilon must be greater than 0.0 and less than 1.0.  Terminating simulation.\n";
		exit(1);
	}
	this->epsilon=epsilon;
}
	
template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::selectTau(double &noncriticalStepsize, double &criticalStepsize)
{
	//for critical reactions
	criticalPropensitySum=0;
	for (std::size_t i=0; i!=NumberOfReactions; ++i) {
		if(tagList[i]==true)
			criticalPropensitySum+=currentPropensities[i];
	}
	if(criticalPropensitySum!=0)
		criticalStepsize=randomGenerator.Exponential(1.0/criticalPropensitySum);
	else
		criticalStepsize=-1;

	//for noncritical reactions
	//updateMuAndSigmaSquared();
	axpy_prod(currentPropensities, stoichiometry, mu, true);
	axpy_prod(currentPropensities, squaredVj, sigmaSquared, true);

	noncriticalStepsize=std::numeric_limits<double>::max();
	double numerator, temp1, temp2;
	std::vector<int>::iterator Iterator;
	for(Iterator=trimed_list.begin(); Iterator!=trimed_list.end(); Iterator++)
	{
		numerator=epsilon*currentPopulation[*Iterator]/g;//temp--should use G
		numerator=std::max(numerator,1.0);
		temp1=numerator/fabs(mu(*Iterator));
		temp2=numerator*numerator/sigmaSquared(*Iterator);
		noncriticalStepsize=std::min(noncriticalStepsize,temp1);
		noncriticalStepsize=std::min(noncriticalStepsize,temp2);
	}
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
int
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::selectReactions(double leapSize, bool runCritical)
{
	std::size_t i;
	if(runCritical)//handle both critical and noncritical reactions
	{
		//for critical
		std::size_t previousReactionIndex=-1;
		//generate a uniform random number between (0,propensitySum)
		double r=0;
		while (r==0) {
			r=randomGenerator.ContinuousOpen(0,1)*criticalPropensitySum;
		}
		double jsum=0;

		for (i=0; i!=NumberOfReactions; ++i) {
			//for critical
			if(tagList[i]==true)
			{
				previousReactionCounts[i]=0;//not noncritical so set 0
				if(jsum<r)
				{
					previousReactionIndex=i;
					jsum+=currentPropensities[i];
				}
			}
			//for noncritical
			else
				previousReactionCounts[i]=randomGenerator.Poisson(leapSize*currentPropensities[i]);
		}
		return previousReactionIndex;
	}
	else//only handle noncritical reactions
	{
		for (i=0; i!=NumberOfReactions; ++i) {
			if(tagList[i]==true)
				previousReactionCounts[i]=0;
			else
				previousReactionCounts[i]=randomGenerator.Poisson(leapSize*currentPropensities[i]);
		}
		return -1;
	}
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::fireReactions(int criticalIndex)
{
	_denseVectorType populationChange(NumberOfSpecies);
	axpy_prod(previousReactionCounts,stoichiometry,populationChange,true);
	currentPopulation+=populationChange;
	if(criticalIndex!=-1)
		critical_fireReaction(criticalIndex); 
	
	//check for negative populations
	bool negativePopulation=false;
	for (std::size_t i=0; i!=NumberOfSpecies; ++i) {
		if (currentPopulation[i]<0.0) {
			negativePopulation=true;
			break;
		}
	}
	if (negativePopulation) {
		currentPopulation-=populationChange;
		if(criticalIndex!=-1)
			critical_rollBack(criticalIndex);
		return false;
	}
	else {
		calculateAllPropensities();
		return true;
	}
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
bool
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
critical_fireReaction(int reactionIndex) {
	if (reactionIndex==-1) {
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
		return true;
	}
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
critical_rollBack(int reactionIndex) {
		//if not -1, assumes valid reactionIndex
	#ifdef MATRIX_STOICHIOMETRY
		matrixrow dX(stoichiometry, reactionIndex);
		typename matrixrow::iterator it;
		for(it=dX.begin();it!=dX.end();it++) {
			currentPopulation[it.index()]-=*it;
		}
	#else
		currentPopulation-=stoichiometry[reactionIndex];
	#endif
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::
updateTagLists()
{
	std::size_t j, k;
	bool changeTag;
	std::list<std::size_t>::iterator Iterator;

	//from critical species to noncritical species
	for(Iterator=criticalSpecies.begin(); Iterator!=criticalSpecies.end();)
	{
		if(currentPopulation[*Iterator]>criticalThreshold)
		{
			noncriticalSpecies.push_back(*Iterator);//add to noncritical species list
			for(j=0; j<affectedReactions[*Iterator]; j++)//modify tag for each reaction that take this species as a reactant if neccessary
			{
				changeTag=true;
				for(k=0; k<affectedSpecies[speciesToReaction[*Iterator][j]]; k++)//check if other reactants are critical for this reaction
				{
					if(currentPopulation[reactionToSpecies[speciesToReaction[*Iterator][j]][k]]<=criticalThreshold)
					{
						changeTag=false;
						break;
					}
				}
				if(changeTag)
					tagList[speciesToReaction[*Iterator][j]]=false;
			}
			Iterator=criticalSpecies.erase(Iterator);//erase from critical list
		}
		else
			Iterator++;
	}

	//from noncritical species to critical species
	for(Iterator=noncriticalSpecies.begin(); Iterator!=noncriticalSpecies.end();)
	{
		if(currentPopulation[*Iterator]<=criticalThreshold)
		{
			criticalSpecies.push_back(*Iterator);//add to critical species list
			for(j=0; j<affectedReactions[*Iterator]; j++)//modify tag for each reaction that take this species as a reactant
				tagList[speciesToReaction[*Iterator][j]]=true;
			Iterator=noncriticalSpecies.erase(Iterator);
		}
		else
			Iterator++;
	}
}

template<typename _denseVectorType, 
		 typename _matrixType,
		 typename _propensitiesFunctorType,
		 typename _dependencyGraphType>
template<typename IntervalOutputType>
void
TauLeapingExplicitAdaptive<_denseVectorType, 
		   _matrixType,
		   _propensitiesFunctorType,
		   _dependencyGraphType>::simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate) {
	
	//validate();
	if (doValidate) {
		if (!SSA::validate(startTime,endTime)) {
			std::cerr << "StochKit ERROR (TauLeapingExplicitAdaptive::simulate): validate() failed, simulation aborted\n";
			exit(1);
		}
	}
	
	if (!output.initialize(realizations,startTime,endTime,initialPopulation)) {
		std::cerr << "StochKit ERROR (): initialization of output object failed, simulation aborted\n";
		exit(1);
	}
	
	//delete the product for tau selection
	prepare();

	std::vector<double> outputTimes=output.getOutputTimes();
	std::size_t totalIntervals=outputTimes.size();
	std::size_t currentInterval;
	std::size_t failedLeaps;
	double tau;
	double nextTime;
	double reactionsLastLeap;
	std::size_t ssaStepsTaken;
	double criticalStepsize;//for neg
	double noncriticalStepsize;//for neg
	bool runCritical;//for neg
	int criticalIndex;//for negi

	//for testing
	#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE
		double timeInSSA=0.0;
		double ssaStartTime=0.0;
		std::size_t totalSSAStepsTaken=0;
		std::size_t totalLeapsTaken=0;
		std::size_t totalReactionsDuringLeaps=0;
	#endif
	
	for (std::size_t currentRealization=0; currentRealization!=realizations; ++currentRealization) {
		initialize(startTime);
		currentInterval=0;
		failedLeaps=0;
		ssaStepsTaken=0;
		reactionsLastLeap=std::numeric_limits<double>::max();
				
		while (currentTime<endTime) {
			while ((currentTime>=outputTimes[currentInterval]) && currentInterval<totalIntervals) {
				output.record(currentRealization, currentInterval, currentPopulation);
				++currentInterval;
			}
			
			if (reactionsLastLeap<threshold) {
				//do SSA
				failedLeaps=0;//not taking leaps
				if (ssaStepsTaken<SSASteps) {
					if (ssaStepsTaken==0) {
						currentTime+=SSA::selectStepSize();
						++ssaStepsTaken;
						#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE
							ssaStartTime=currentTime;
						#endif
					}
					else {
						SSA::fireReaction(SSA::selectReaction());
						currentTime+=SSA::selectStepSize();
						++ssaStepsTaken;
						#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE
							++totalSSAStepsTaken;
						#endif
					}
				}
				else { // we've taken enough SSA steps, try to go back to tau-leaping
					SSA::fireReaction(SSA::selectReaction());
					reactionsLastLeap=std::numeric_limits<double>::max();
					ssaStepsTaken=0;
					#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE
						timeInSSA+=(currentTime-ssaStartTime);
					#endif
				}
			}
			else { 
				//do tau-leaping
				updateTagLists();//for neg
				selectTau(noncriticalStepsize, criticalStepsize);//for neg
				if(noncriticalStepsize<criticalStepsize||criticalStepsize==-1)//for neg
				{
					tau=noncriticalStepsize;
					runCritical=false;
				}
				else
				{
					tau=criticalStepsize;
					runCritical=true;
				}
				if (currentTime+tau>outputTimes[currentInterval]) {
					//don't leap past next output time
					tau=outputTimes[currentInterval]-currentTime;
					nextTime=outputTimes[currentInterval];
					runCritical=false;//for neg
				}	
				else {
					nextTime=currentTime+tau;
				}
				criticalIndex=selectReactions(tau, runCritical);
				reactionsLastLeap=norm_1(previousReactionCounts);
				if(runCritical)//for neg
					reactionsLastLeap++;
				#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE
					totalReactionsDuringLeaps+=reactionsLastLeap;
				#endif
				if (fireReactions(criticalIndex)) {
					currentTime=nextTime;
					failedLeaps=0;
					#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE
						++totalLeapsTaken;
					#endif
				}
				else {
					++failedLeaps;
					if (failedLeaps==3) {
						std::cout << "StochKit WARNING (TauLeapingExplicitAdaptive::simulate): rejected three or more consecutive leaps, consider reducing epsilon.\n";
					}
					if (failedLeaps==10) {
						std::cerr << "StochKit ERROR (TauLeapingExplicitAdaptive::simulate): rejected ten consecutive leaps, terminating simulation.\n";
						exit(1);
					}
				}
			}
		}

		//modified for visual studio
		while(currentTime>=outputTimes[currentInterval])
		{
			output.record(currentRealization, currentInterval, currentPopulation);
			++currentInterval;
			if(currentInterval>=totalIntervals)
				break;
		}
	/*	while ((currentTime>=outputTimes[currentInterval]) && currentInterval<totalIntervals) {
			output.record(currentRealization, currentInterval, currentPopulation);
			++currentInterval;
		}*/

	// Add the last ssa session to the timeInSSA
		#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE 
		if (ssaStepsTaken!=0)
			timeInSSA+=(endTime-ssaStartTime);
		#endif
	}
	#ifdef PROFILE_SIMULATE_TAU_LEAPING_EXPLICIT_ADAPTIVE
		std::cout << "StochKit MESSAGE (TauLeapingExplicitAdaptive::simulate) simulate() spent "<<timeInSSA<< " out of " << (endTime-startTime)*(double)realizations << " in SSA\n";
		std::cout << "and took "<<totalLeapsTaken<<" leaps totaling "<<totalReactionsDuringLeaps<<" reactions and "<<totalSSAStepsTaken<<" SSA steps\n";
	#endif
}//end simulate	

}
