/******************************************************************************
*/

#ifndef _STANDARD_EVENT_HANDLER_H_
#define _STANDARD_EVENT_HANDLER_H_

#include <vector>
#include <limits>
#include "boost/ptr_container/ptr_list.hpp"

#include "TimeBasedTriggerEvent.h"
#include "StateBasedTriggerEvent.h"

namespace STOCHKIT
{
template<typename _populationVectorType>
class StandardEventHandler
{
	
public:
	
	typedef TimeBasedTriggerEvent<_populationVectorType> timeBasedEventType;
	typedef boost::ptr_list<timeBasedEventType> timeBasedEventListType;
	timeBasedEventListType timeEvents;
	
	typedef StateBasedTriggerEvent<_populationVectorType> stateBasedEventType;
	typedef boost::ptr_list<stateBasedEventType > stateBasedEventListType;
	stateBasedEventListType stateEvents;
	
	double nextTriggerTime() {
		if (nextTimeBasedEvent!=timeEvents.end()) {
			return nextTimeBasedEvent->getTriggerTime();
		}
		else {
			return std::numeric_limits<double>::infinity();
		}
	}
	
	bool fireTimeBasedTriggerEvents(double time, _populationVectorType& population) {
		bool firedEvent=false;
		
		while (nextTimeBasedEvent!=timeEvents.end() && nextTimeBasedEvent->getTriggerTime()<=time) {
			nextTimeBasedEvent->fire(time,population);
			++nextTimeBasedEvent;
			firedEvent=true;
		}
		
		return firedEvent;
	}
	
	bool fireStateBasedTriggerEvents(double time, _populationVectorType& population) {
		bool firedEvent=false;
		
		typename stateBasedEventListType::iterator j;
		for (j = stateEvents.begin(); j!=stateEvents.end(); j++) {
			if (j->trigger(time,population)) {
				j->fire(time,population);
				firedEvent=true;
			}
		}
		
		return firedEvent;
	}
	
	void insertTimeEvent(timeBasedEventType* event) {
		timeEvents.push_back(event);
	}
	
	//this method has not been tested
	void setTimeEvents(timeBasedEventListType events) {
		timeEvents=events;
	}
	
	void insertStateEvent(stateBasedEventType* event) {
		stateEvents.push_back(event);
	}
	
	//this method has not been tested
	void setStateEvents(stateBasedEventListType events) {
		stateEvents=events;
	}
	
	typename timeBasedEventListType::iterator nextTimeBasedEvent;
	
	bool initialize(double startTime, double endTime) {
		//do some checks?
		//should ensure all trigger times are within [startTime,endTime]
		//if not, provide warning message and delete them
		
		//sort the time-based event list
		if (timeEvents.size()!=0) {
			timeEvents.sort();
		}
		
		reset();
		
		return true;
	}
	
	void reset() {
		//iterate over events calling reset
		typename timeBasedEventListType::iterator i;
		for (i = timeEvents.begin(); i!=timeEvents.end(); i++) {
			i->reset();
		}
		
		nextTimeBasedEvent=timeEvents.begin();
		
		typename stateBasedEventListType::iterator j;
		for (j = stateEvents.begin(); j!=stateEvents.end(); j++) {
			j->reset();
		}
		
		//delete temporary events
		temporaryTimeEvents.clear();
	}
	
	
	//TEMPORARY TIME-BASED EVENTS ARE NOT YET SUPPORTED!
	//temporary time-based events will be deleted as their critical time is exceeded
	timeBasedEventListType temporaryTimeEvents;//used for storing events that are created by other events
		
	void insertTemporaryTimeBasedEvent(timeBasedEventType* event) {
		std::cout << "creation of temporary events not yet supported!" << std::endl;
		//perhaps this can be done using ptr_list_inserter, but I don't know how to use it
			
		//create a size=1 event list
		timeBasedEventListType tmp;
		tmp.push_back(event);
			
		//merge tmp and real temporaryTimeEvents
		temporaryTimeEvents.merge(tmp);
	}
		
private:
			
};//end class StandardEventHandler
}//end namespace STOCHKIT

#endif
