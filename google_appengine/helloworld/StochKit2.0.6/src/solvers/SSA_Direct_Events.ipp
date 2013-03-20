/*!
	\brief the direct method of the Stochastic Simulation Algorithm (SSA)
*/

#if !defined(_SSA_DIRECT_EVENTS_IPP_)
#error This file is the implementation of SSA_Direct_Events
#endif

namespace STOCHKIT
{

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _eventEnabledPropensitiesType,
		 typename _dependencyGraphType>
SSA_Direct_Events<_populationVectorType, 
		   _stoichiometryType,
		   _eventEnabledPropensitiesType,
		   _dependencyGraphType>::
SSA_Direct_Events(const _populationVectorType& initialPop,
	const _stoichiometryType& stoich,
	const _eventEnabledPropensitiesType& propensitiesFunctor,
	const _dependencyGraphType& depGraph,
	int seed) :
		 SSA_Direct<_populationVectorType, _stoichiometryType, _eventEnabledPropensitiesType, _dependencyGraphType>(initialPop,stoich,propensitiesFunctor,depGraph)
    {
    }

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _eventEnabledPropensitiesType,
		 typename _dependencyGraphType>
void
SSA_Direct_Events<_populationVectorType, 
		   _stoichiometryType,
		   _eventEnabledPropensitiesType,
		   _dependencyGraphType>::
initialize(double startTime=0) {
	//reset any parameters that were changed by events
	propensities.reset();
	//Base::initialize must be called after resetting propensities
	Base::initialize(startTime);
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _eventEnabledPropensitiesType,
		 typename _dependencyGraphType>
void
SSA_Direct_Events<_populationVectorType, 
		   _stoichiometryType,
		   _eventEnabledPropensitiesType,
		   _dependencyGraphType>::
setCurrentPopulation(_populationVectorType& newPopulation) {
	#ifdef DEBUG
		if (newPopulation.size()!=this->NumberOfSpecies) {
			std::cerr<< "StochKit ERROR (SSA_Direct_Events::setCurrentPopulation): setting currentPopulation with greater or fewer species than NumberOfSpecies, simulation failure likely." << std::endl;
		}
		//loop over population to ensure non-negativity
		for (std::size_t i=0; i!=this->NumberOfSpecies; ++i) {
			if (newPopulation[i]<0) {
				std::cerr << "StochKit ERROR (SSA_Direct_Events::setCurrentPopulation): setting currentPopulation with one or more species with negative population, aborting." << std::endl;
				exit(1);
	  		}
		}
	#endif
	this->currentPopulation=newPopulation;
	#ifdef DEBUG
		calculateAllPropensities();
	#endif
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _eventEnabledPropensitiesType,
		 typename _dependencyGraphType>
void
SSA_Direct_Events<_populationVectorType, 
		   _stoichiometryType,
		   _eventEnabledPropensitiesType,
		   _dependencyGraphType>::
setSingleSpeciesCurrentPopulation(std::size_t speciesIndex, populationValueType newPopulation)
{
    #ifdef DEBUG
		if (speciesIndex>=this->NumberOfSpecies) {
			std::cerr<<"StochKit ERROR (SSA_Direct_Events::setSingleSpeciesCurrentPopulation): attempt to setsetting currentPopulation with more species than NumberOfSpecies, will likely cause simulation failure." <<std::endl;
		}
		if (newPopulation<0) {
			std::cerr << "StochKit ERROR (SSA_Direct_Events::setSingleSpeciesCurrentPopulation): attempt to set species species population with a negative value, aborting." << std::endl;
			exit(1);
		}
    #endif
    this->currentPopulation[speciesIndex]=newPopulation;
    #ifdef DEBUG
		calculateAllPropensities();
    #endif
}

template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _eventEnabledPropensitiesType,
		 typename _dependencyGraphType>
void
SSA_Direct_Events<_populationVectorType, 
		   _stoichiometryType,
		   _eventEnabledPropensitiesType,
		   _dependencyGraphType>::
setParameterValue(std::size_t parameterIndex, std::string newParameterValue, bool value_type)
{
	bool updateStatus;
	updateStatus = propensities.ParametersList.updateParameter(parameterIndex, newParameterValue, value_type);
	if (!updateStatus){
		exit(1); 
	}
	#ifdef DEBUG
		calculateAllPropensities();
	#endif
}


template<typename _populationVectorType, 
		 typename _stoichiometryType,
		 typename _eventEnabledPropensitiesType,
		 typename _dependencyGraphType>
template<typename IntervalOutputType,
	 typename EventHandlerType>
void
SSA_Direct_Events<_populationVectorType, 
		   _stoichiometryType,
		   _eventEnabledPropensitiesType,
		   _dependencyGraphType>::
simulateEvents(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, EventHandlerType& eventHandler)
{    
 	if (!validate(startTime, endTime)) {
		std::cerr<<"StochKit ERROR (SSA_Direct::simulate): validate() failed, simulation aborted"<<std::endl;
      		exit(1);
    	}
    	if (!output.initialize(realizations,startTime,endTime,initialPopulation)) {
      		std::cerr<<"StochKit ERROR (SSA_Direct::simulate): initialization of output object failed, simulation aborted"<<std::endl;
      		exit(1);
    	}
    
    	std::vector<double> outputTimes = output.getOutputTimes();
    	std::size_t totalIntervals=outputTimes.size();
    
    	std::size_t currentInterval;
    
    	double tau;

    	eventHandler.initialize(startTime,endTime);

    	for (std::size_t currentRealization=0; currentRealization!=realizations; ++currentRealization) {
      		initialize(startTime);
  	    	eventHandler.reset();
      		currentInterval=0;

      		tau=selectStepSize();

		if (eventHandler.fireStateBasedTriggerEvents(currentTime,currentPopulation)) {
  			calculateAllPropensities();
		}

      		while (eventHandler.nextTriggerTime() < currentTime+tau) {
			currentTime=eventHandler.nextTriggerTime();
			if (eventHandler.fireTimeBasedTriggerEvents(currentTime,currentPopulation)) {
	  			calculateAllPropensities();
				
				#ifdef DEBUG
				std::cout << "mark a\n";
				std::cout << "in SSA_Direct_Events::simulate, after firing, currentPopulation is:\n";
				for (std::size_t i=0; i!=currentPopulation.size(); ++i) {
					std::cout << "currentPopulation["<<i<<"]="<<currentPopulation[i]<<"\n";
				}
				std::cout << "propensities after firing time-based event:\n";
				for (std::size_t i=0; i!=currentPropensities.size(); ++i) {
					std::cout << "propensity["<<i<<"]="<<currentPropensities[i]<<"\n";
				}
				#endif

			}
			if (eventHandler.fireStateBasedTriggerEvents(currentTime,currentPopulation)) {
	  			calculateAllPropensities();
			}
			tau=selectStepSize();
      		}

      		currentTime+=tau;

      		while (currentTime<endTime) {
			while (currentInterval<totalIntervals && currentTime>=outputTimes[currentInterval]){
	  			output.record(currentRealization,currentInterval,currentPopulation);
	  			currentInterval++;
			}
	
			fireReaction(selectReaction());
			if (eventHandler.fireStateBasedTriggerEvents(currentTime,currentPopulation)) {
	  			calculateAllPropensities();
			}

			tau=selectStepSize();
			while (eventHandler.nextTriggerTime() < currentTime+tau) {
	  			currentTime=eventHandler.nextTriggerTime();

	  			while (currentInterval<totalIntervals && currentTime>outputTimes[currentInterval]){//note only recording if currentTime strictly > output time
	    				output.record(currentRealization,currentInterval,currentPopulation);
	    				currentInterval++;
	  			}

	  			if (eventHandler.fireTimeBasedTriggerEvents(currentTime,currentPopulation)) {
	    				calculateAllPropensities();
					#ifdef DEBUG
					std::cout << "mark a\n";
					std::cout << "in SSA_Direct_Events::simulate, after firing, currentPopulation is:\n";
					for (std::size_t i=0; i!=currentPopulation.size(); ++i) {
						std::cout << "currentPopulation["<<i<<"]="<<currentPopulation[i]<<"\n";
					}
					std::cout << "propensities after firing time-based event:\n";
					for (std::size_t i=0; i!=currentPropensities.size(); ++i) {
						std::cout << "propensity["<<i<<"]="<<currentPropensities[i]<<"\n";
					}
					#endif
	  			}

				if (eventHandler.fireStateBasedTriggerEvents(currentTime,currentPopulation)) {
		  			calculateAllPropensities();
				}

	  			//this will catch the case where a time-based trigger event occurs exactly on an output time
	  			while (currentInterval<totalIntervals && currentTime>=outputTimes[currentInterval]) {
	    				output.record(currentRealization,currentInterval,currentPopulation);
	    				currentInterval++;
	  			}

	  			tau=selectStepSize();
			}

			currentTime+=tau;
      		}

      		while (currentInterval<totalIntervals && currentTime >=outputTimes[currentInterval]){
			output.record(currentRealization,currentInterval,currentPopulation);
			currentInterval++;
      		}	
	}
}

}
