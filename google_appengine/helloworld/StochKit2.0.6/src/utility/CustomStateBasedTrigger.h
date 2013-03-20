/******************************************************************************
 */

#ifndef _CUSTOM_STATE_BASED_TRIGGER_H_
#define _CUSTOM_STATE_BASED_TRIGGER_H_

#include "boost/function.hpp"
#include "Parameter.h"

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class CustomStateBasedTrigger
 {
	
 public:

  typedef boost::function<bool (double, _populationVectorType&, ListOfParameters&)> triggerType;

	CustomStateBasedTrigger(triggerType func, ListOfParameters& solverParametersList, bool allow): // by default, don't allow multiple firings
	  disabled(false),
	  internalState(false),
	  allowMultipleFirings(allow),
	  triggerFunction(func),
	  ParametersList(solverParametersList)
	{};

	  //returns true when disabled=false AND initial internal state=false AND triggerFunction(currentState)=true
	  //i.e. when the internal state switches from false to true and not disabled
	bool operator()(double time, _populationVectorType& population) {
	  if (disabled) {
	    return false;
	  }
	  bool initialState=internalState;
	  internalState=(triggerFunction)(time,population,ParametersList);

	  if (initialState==false && internalState==true) {
		  if(allowMultipleFirings == false){
			  disable();
		  }
	    return true;
	  }
	  else
	    return false;
	}

	void reset() {
	  disabled=false;
	  internalState=false;
	}

	void disable() {
	  disabled=true;
	}

	//setting internal state does not override disabled
	void setInternalState(bool state) {
	  internalState=state;
	}

 private:
	CustomStateBasedTrigger();

	bool disabled;

	bool internalState;

	bool allowMultipleFirings;

	triggerType triggerFunction;

 protected:

	ListOfParameters& ParametersList;

 };
}

#endif
