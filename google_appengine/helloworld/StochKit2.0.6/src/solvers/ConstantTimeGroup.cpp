#include "ConstantTimeGroup.h"

namespace STOCHKIT
{

ConstantTimeGroup::ConstantTimeGroup(int groupExponent): groupSum(0), groupExponent(groupExponent), maxPropensity(pow(2.0,(double)groupExponent)), minPropensity(pow(2.0,(double)(groupExponent-1)))
{
}

double ConstantTimeGroup::getGroupSum() {
  return groupSum;
}

int ConstantTimeGroup::getGroupExponent() {
  return groupExponent;
}

int ConstantTimeGroup::calculateGroupExponent(double propensityValue) {
#ifdef DEBUG
  if (propensityValue<=0.0) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::calculateGroupExponent): (DEBUG flag set) attempt to calculate group exponent of propensity <= 0. Terminating.\n";
    exit(1);
  }
#endif

#ifdef WIN32 //visual studio does not have log2()
  int exponent=(int)ceil(log(propensityValue)/log(2.0));
#else
  int exponent=(int)ceil(log2(propensityValue));
#endif
  return exponent;
}

int ConstantTimeGroup::selectReactionIndex(STOCHKIT::RandomGenerator &randomGenerator) {
  #ifdef DEBUG
  if (reactionIndexes.size()==0) {
    return -1;
  }
  std::size_t rejectionCount=0;
  #endif

  int tentativePropensityValuesIndex=-1;

  double r;
  
  if (reactionIndexes.size()==1) { //if there is only one reaction in the group, choose it
    return reactionIndexes[0];
  }
  else {
    while (true) {
      //generate an integer index between 0 and size of group-1 as tentative reaction index 
      tentativePropensityValuesIndex=(int)(randomGenerator.ContinuousOpen(0,1)*reactionIndexes.size());
      
#ifdef DEBUG
      if (tentativePropensityValuesIndex<0 || tentativePropensityValuesIndex>=(int)reactionIndexes.size()) {
	std::cout << "StochKit ERROR (ConstantTimeGroup::selectReactionIndex): (DEBUG flag set) discrete generator selected invalid reaction ("<<tentativePropensityValuesIndex<<", allowed range: (0, "<<reactionIndexes.size()<<"). Terminating.\n";
	exit(1);
      }
#endif
      
      //generate a continuous number within the group's propensity range
      r=randomGenerator.ContinuousOpen(0,1)*maxPropensity;
      //if r is less than the propensity of tentativeReaction propensity then accept the reaction
      if (r<=propensityValues[tentativePropensityValuesIndex]) {
	return (int)reactionIndexes[tentativePropensityValuesIndex];
      }
#ifdef DEBUG
      else {
	++rejectionCount;
	if (rejectionCount>1000) {
	  std::cout << "StochKit ERROR (ConstantTimeGroup::selectReactionIndex): (DEBUG flag set) rejected 1000 tentative reactions (probability of this happening without a bug: 9e-302). Terminating.\n";
	  exit(1);
	}
      }
#endif
    }
  }
  
  //should never get here
  return -1;
}

void ConstantTimeGroup::insert(double propensityValue, std::size_t reactionIndex, std::vector<int> &groupsWithinGroupIndexes) {
  #ifdef DEBUG
  if (reactionIndex<0) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::insert): (DEBUG flag set) attempt to insert negative reaction index. Terminating.\n";
    exit(1);
  }
  if (reactionIndex>=groupsWithinGroupIndexes.size()) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::insert): (DEBUG flag set) attempt to insert reaction index ("<<reactionIndex<<") larger than number of reactions (gWGI size="<<groupsWithinGroupIndexes.size()<<"). Terminating.\n";
    exit(1);
  }
  for (std::size_t i=0; i!=reactionIndexes.size(); ++i) {
    if (reactionIndexes[i]==reactionIndex) {
      std::cout << "StochKit ERROR (ConstantTimeGroup::insert): (DEBUG flag set) reaction index "<<reactionIndex<<" already exists in group. Terminating.\n";
      exit(1);
    }
  }
  if (calculateGroupExponent(propensityValue)!=groupExponent) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::insert): (DEBUG flag set) attempt to insert propensity "<<propensityValue<<" (exponent="<<calculateGroupExponent(propensityValue)<<") into group with exponent "<<groupExponent<<". Terminating.\n";
    exit(1);
  }
  if (propensityValue>maxPropensity) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::insert): (DEBUG flag set) attempt to insert propensity "<<propensityValue<<" into group with max propensity "<<maxPropensity<<". Terminating.\n";
    exit(1);
  }
  if (propensityValue<=minPropensity) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::insert): (DEBUG flag set) attempt to insert propensity "<<propensityValue<<" into group with min propensity "<<minPropensity<<". Terminating.\n";
    exit(1);
  }
  #endif

  groupSum+=propensityValue;
  propensityValues.push_back(propensityValue);
  reactionIndexes.push_back(reactionIndex);
  #ifdef DEBUG
    if (reactionIndexes.size()<=0) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::insert): (DEBUG flag set) after insert, reactionIndexes size ("<<reactionIndexes.size()<<") <= 0. Terminating.\n";
    exit(1);
    }
  #endif
  groupsWithinGroupIndexes[reactionIndex]=reactionIndexes.size()-1;
}

void ConstantTimeGroup::remove(std::size_t reactionIndex, std::size_t withinGroupIndex, std::vector<int> &groupsWithinGroupIndexes) {
  #ifdef DEBUG
  if (withinGroupIndex>=reactionIndexes.size()) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::remove): (DEBUG flag set) attempt to remove invalid index ("<<withinGroupIndex<<", max allowed: "<<reactionIndexes.size()<<"). Terminating.\n";
    exit(1);
  }
  if (reactionIndexes[withinGroupIndex]!=reactionIndex) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::remove): (DEBUG flag set) reaction index inconsistency. Terminating.\n";
    exit(1);
  }
  if (reactionIndexes.size()==0) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::remove): (DEBUG flag set) attempt to remove from empty group. Terminating.\n";
    exit(1);
  }
  if (lookup(reactionIndex)==-1) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::remove): (DEBUG flag set) attempt to remove reaction index that is not in group. Terminating.\n";
    exit(1);
  }
  if ((int)withinGroupIndex!=groupsWithinGroupIndexes[reactionIndex]) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::remove): (DEBUG flag set) groupsWithinGroupIndex inconsistent with group. Terminating.\n";
    exit(1);
  }
  #endif

  groupSum-=propensityValues[withinGroupIndex];
  
  groupsWithinGroupIndexes[reactionIndexes.back()]=withinGroupIndex;
  groupsWithinGroupIndexes[reactionIndex]=-1;

  propensityValues[withinGroupIndex]=propensityValues.back();
  reactionIndexes[withinGroupIndex]=reactionIndexes.back();
  reactionIndexes.pop_back();
  propensityValues.pop_back();

  if (propensityValues.size()==0) {
    groupSum=0;
  }
}

void ConstantTimeGroup::update(double newPropensityValue, std::size_t reactionIndex, std::size_t withinGroupIndex, std::vector<int> &groupsWithinGroupIndexes) {
  #ifdef DEBUG
  if (withinGroupIndex>=reactionIndexes.size()) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update invalid index ("<<withinGroupIndex<<", max allowed: "<<reactionIndexes.size()<<"). Terminating.\n";
    exit(1);
  }
  if (reactionIndexes[withinGroupIndex]!=reactionIndex) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) reaction index inconsistency. Terminating.\n";
    exit(1);
  }
  if (reactionIndexes.size()==0) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update from empty group. Terminating.\n";
    exit(1);
  }
  if (lookup(reactionIndex)==-1) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update reaction index that is not in group. Terminating.\n";
    exit(1);
  }
  if ((int)withinGroupIndex!=groupsWithinGroupIndexes[reactionIndex]) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) groupsWithinGroupIndex inconsistent with group. Terminating.\n";
    exit(1);
  }
  if (reactionIndex<0) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update negative reaction index. Terminating.\n";
    exit(1);
  }
  if (reactionIndex>=groupsWithinGroupIndexes.size()) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update reaction index ("<<reactionIndex<<") larger than number of reactions (gWGI size="<<groupsWithinGroupIndexes.size()<<"). Terminating.\n";
    exit(1);
  }

  if (calculateGroupExponent(newPropensityValue)!=groupExponent) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update propensity "<<newPropensityValue<<" (exponent="<<calculateGroupExponent(newPropensityValue)<<") into group with exponent "<<groupExponent<<". Terminating.\n";
    exit(1);
  }
  if (newPropensityValue>maxPropensity) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update propensity "<<newPropensityValue<<" into group with max propensity "<<maxPropensity<<". Terminating.\n";
    exit(1);
  }
  if (newPropensityValue<=minPropensity) {
    std::cout << "StochKit ERROR (ConstantTimeGroup::update): (DEBUG flag set) attempt to update propensity "<<newPropensityValue<<" into group with min propensity "<<minPropensity<<". Terminating.\n";
    exit(1);
  }
  #endif

  groupSum+=newPropensityValue-propensityValues[withinGroupIndex];
  propensityValues[withinGroupIndex]=newPropensityValue;
}

#ifdef DEBUG
//for debugging--should not be used in simulation because uses slow linear search
int ConstantTimeGroup::lookup(std::size_t reactionIndex) {
  for (std::size_t i=0; i!=reactionIndexes.size(); ++i) {
    if (reactionIndexes[i]==reactionIndex) {
      return i;
    }
  }
  //that reaction is not in this group
  return -1;
}

std::vector<double> ConstantTimeGroup::getPropensityValues() {
  return propensityValues;
}
std::vector<std::size_t> ConstantTimeGroup::getReactionIndexes() {
  return reactionIndexes;
}

#endif

}
