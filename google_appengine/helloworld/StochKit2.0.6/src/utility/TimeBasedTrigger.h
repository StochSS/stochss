/******************************************************************************
 */

#ifndef _TIME_BASED_TRIGGER_H_
#define _TIME_BASED_TRIGGER_H_

namespace STOCHKIT
{
 class TimeBasedTrigger
 {
	
 public:

	TimeBasedTrigger(double triggerTime);
	
	bool operator()(double currentSimulationTime);	

	double getTriggerTime() const;
	
	void reset();
	
	void disable();

 private:
	TimeBasedTrigger();

	bool internalState;

	double triggerTime;

 };
}

#endif
