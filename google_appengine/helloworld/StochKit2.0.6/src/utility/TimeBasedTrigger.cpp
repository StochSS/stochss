/******************************************************************************
 */

#include "TimeBasedTrigger.h"

namespace STOCHKIT{
//assumes triggerTime is < currentSimulationTime when created
TimeBasedTrigger::TimeBasedTrigger(double triggerTime): internalState(false), triggerTime(triggerTime)
{}

//trigger fires when call switches internal state from false to true
bool TimeBasedTrigger::operator()(double time) {
  if (internalState==false && time>=triggerTime) {
    internalState=true;
    return true;
  }
  else
    return false;
}

double TimeBasedTrigger::getTriggerTime() const {
  return triggerTime;
}

void TimeBasedTrigger::reset() {
  internalState=false;
}

void TimeBasedTrigger::disable() {
  internalState=true;
}
}
