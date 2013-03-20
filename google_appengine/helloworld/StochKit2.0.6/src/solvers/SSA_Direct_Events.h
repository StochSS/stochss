// -*- C++ -*-
 /*!
	\brief Event-handling implementation of the Direct Method of the SSA 
 */

#ifndef _SSA_DIRECT_EVENTS_H_
#define _SSA_DIRECT_EVENTS_H_
#include<iostream>
#include <vector>
#include <limits>
#include <time.h>
#ifndef WIN32
#include <sys/time.h>
#endif
#include "CustomPropensitySet_Events.h"
#include "SSA_Direct.h"
#include "Random.h"
#include "IntervalOutput.h"

/*!
	\file SSA_DIRECT_EVENTS.h
	\param _populationVectorType the population vector type, should be compatible with
			_stoichiometryType (see below), and as input to _eventEnabledPropensityFunctorType, must have a .size() function
	\param _stoichiometryType should be compatible with _populationVectorType--that is,
			when a reaction fires, we will take _populationVectorType+=_stoichiometryType[reactionIndex].
			size should be equal to number of reactions, must have a .size() method
	\param _eventEnabledPropensities functor takes reaction index and _populationVectorType population
			and returns the propensity for that reaction with additional functionality to handle events
	\param _dependencyGraphType [expand]
*/

namespace STOCHKIT
{
 template<typename _populationVectorType, 
    typename _stoichiometryType,
    typename _eventEnabledPropensitiesType,
    typename _dependencyGraphType>
 class SSA_Direct_Events:
    public SSA_Direct <_populationVectorType, _stoichiometryType, _eventEnabledPropensitiesType, _dependencyGraphType>
 {	
 public:
  typedef _populationVectorType populationVectorType;
  typedef typename _populationVectorType::value_type populationValueType;
  typedef _stoichiometryType stoichiometryType;
  typedef _eventEnabledPropensitiesType propensitiesType;
  typedef _dependencyGraphType dependencyGraphType;
  typedef SSA_Direct<_populationVectorType, _stoichiometryType, _eventEnabledPropensitiesType, _dependencyGraphType> Base;
  using Base::seed;


 private:

  using Base::currentTime;
  using Base::currentPopulation;
  using Base::currentPropensities;
  using Base::validate;
  using Base::initialPopulation;
  using Base::selectReaction;
  using Base::selectStepSize;
  using Base::calculateAllPropensities;
  using Base::propensities;

 protected:
  //! the propensities fucntion type
  typedef double (_eventEnabledPropensitiesType::* PropensityMember) (_populationVectorType&);

 private:
  	//! default constructor not implemented
	SSA_Direct_Events();

 public:	

  SSA_Direct_Events(const _populationVectorType& initialPop,
		    const _stoichiometryType& stoich,
		    const _eventEnabledPropensitiesType& propensitiesFunctor,
		    const _dependencyGraphType& depGraph,
		    int seed=time(NULL));
  
  //! destructor
  virtual ~SSA_Direct_Events() {
  }

 //protected:

  virtual void initialize(double startTime);

  void setCurrentPopulation(_populationVectorType& newPopulation);

  void setSingleSpeciesCurrentPopulation(std::size_t speciesIndex, populationValueType newPopulation);

  // value_type = true: value, will be constant afterwards
  // value_type = false: expression, still depend on other parameters
  void setParameterValue(std::size_t parameterIndex, std::string newParameterValue, bool value_type); 

  ListOfParameters& referenceToParametersList(){
	  return propensities.ParametersList;
  }

 public:
  template<typename IntervalOutputType,
	   typename EventHandlerType>
  void simulateEvents(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, EventHandlerType& eventHandler);
    
  template<typename IntervalOutputType>
  void simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate) {
    std::cout << "StochKit ERROR (SSA_Direct_Events::simulate): simulate method not implemented in event-enabled solver; use 'simulateEvents' or, to use the direct method without events, use Base::simulate.\n";
  }
 };//end class
}

#define _SSA_DIRECT_EVENTS_IPP_	
#include "SSA_Direct_Events.ipp"
#undef _SSA_DIRECT_EVENTS_IPP_

#endif
