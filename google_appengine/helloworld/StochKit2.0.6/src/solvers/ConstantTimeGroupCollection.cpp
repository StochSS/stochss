#include "ConstantTimeGroupCollection.h"

namespace STOCHKIT
{

ConstantTimeGroupCollection::ConstantTimeGroupCollection(std::size_t numberOfReactions): propensitySum(0), withinGroupIndexes(numberOfReactions,-1)
{
  maxGroupExponent=std::numeric_limits<int>::min();
  minGroupExponent=std::numeric_limits<int>::max();
  if (numberOfReactions==0) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection): must have at least one reaction. Terminating.\n";
    exit(1);
  }
}

double ConstantTimeGroupCollection::getPropensitySum() {
  return propensitySum;
}

void ConstantTimeGroupCollection::build(std::vector<double> &propensities) {
#ifdef DEBUG
  if (groups.size()>0 || maxGroupExponent!=std::numeric_limits<int>::min() || minGroupExponent!=std::numeric_limits<int>::max()) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection::build): (DEBUG flag set) repeat call of build method? Terminating.\n";
    exit(1);
  }
#endif
  groups.clear();

  bool oneNonZeroPropensity=false;

  for (std::size_t i=0; i!=propensities.size(); ++i) {
#ifdef DEBUG
    std::cout << "building groups: propensity["<<i<<"]="<<propensities[i]<<"\n";
#endif
    if (!oneNonZeroPropensity) {
      if (propensities[i]>0.0) {
#ifdef DEBUG
	std::cout << "found first nonzero propensity\n";
#endif
	oneNonZeroPropensity=true;
	int exponent=ConstantTimeGroup::calculateGroupExponent(propensities[i]);
	minGroupExponent=exponent;
	maxGroupExponent=exponent;
	ConstantTimeGroup newGroup(exponent);
	groups.push_front(newGroup);
	groups[0].insert(propensities[i],i,withinGroupIndexes);
	propensitySum=propensities[i];
#ifdef DEBUG
	std::cout << "after pushing initial group (exponent="<<exponent<<") onto deque, groups.size="<<groups.size()<<"\n";
	printGroups();
#endif
      }
    }
    else {
      if (propensities[i]>0.0) {
	update(i,0.0,propensities[i]);
      }
    }
  }

  if (!oneNonZeroPropensity) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection::build): All propensities are zero. Exiting.\n";
    exit(1);
  }
  
#ifdef DEBUG
  std::cout << "finished build...\n";
  printGroups();
#endif
}

void ConstantTimeGroupCollection::update(std::size_t reactionIndex, double oldPropensity, double newPropensity) {
#ifdef DEBUG
  if (newPropensity<0.0) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection::update): (DEBUG flag set) detected negative propensity for reaction index "<<reactionIndex<<". Terminating.\n";
    exit(1);
  }
  if (maxGroupExponent<minGroupExponent) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection::update): (DEBUG flag set) maxGroupExponent<minGroupExponent.  Did you forget to call build? Terminating.\n";
    exit(1);
  }
  if (reactionIndex>=withinGroupIndexes.size()) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection::update): (DEBUG flag set) reaction index ("<<reactionIndex<<") exceeds number of reactions ("<<withinGroupIndexes.size()<<"). Terminating.\n";
    exit(1);
  }
#endif
  propensitySum+=newPropensity-oldPropensity;

  int newGroup=getGroup(newPropensity);
  int oldGroup=getGroup(oldPropensity);

  if (newGroup==oldGroup) {
    if (newGroup==-1) {
      //either propensity=0 (do nothing) or need to add new group
      if (newPropensity!=0.0) {
	addGroup(ConstantTimeGroup::calculateGroupExponent(newPropensity));
	newGroup=getGroup(newPropensity);//group index changed
	groups[newGroup].insert(newPropensity,reactionIndex,withinGroupIndexes);
      }
    }
    else {
      //did not change group, simple update
      groups[newGroup].update(newPropensity, reactionIndex, withinGroupIndexes[reactionIndex], withinGroupIndexes);
    }
  }
  else {//changed group
    //remove from old group
    if (oldGroup!=-1) {
      groups[oldGroup].remove(reactionIndex,withinGroupIndexes[reactionIndex],withinGroupIndexes);
    }
    //add to new group
    if (newGroup==-1) {
      if (newPropensity>0) {
	//need to add a group
	addGroup(ConstantTimeGroup::calculateGroupExponent(newPropensity));
	newGroup=getGroup(newPropensity);//group index changed
	groups[newGroup].insert(newPropensity,reactionIndex,withinGroupIndexes);
      }
    }
    else {
      groups[newGroup].insert(newPropensity, reactionIndex, withinGroupIndexes);
    }
  }

}

int ConstantTimeGroupCollection::selectReaction(STOCHKIT::RandomGenerator &randomGenerator) {
  //first select a group via linear search
  int groupIndex=selectGroupIndex(randomGenerator);
  
  if (groupIndex==-1) {
    return -1;
  }
  else {
    int reactionIndex=groups[groupIndex].selectReactionIndex(randomGenerator);
    return reactionIndex;
  }
}

void ConstantTimeGroupCollection::recalculatePropensitySum() {
  propensitySum=0.0;
  for (std::size_t i=0; i!=groups.size(); ++i) {
    propensitySum+=groups[i].getGroupSum();
  }
}

int ConstantTimeGroupCollection::getGroup(double propensity) {
#ifdef DEBUG
  if (propensity<0.0) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection::getGroup): (DEBUG flag set) detected negative propensity. Returning -1.\n";
  }
#endif
  if (propensity==0) {
    return -1;
  }
  else {
    int exponent=ConstantTimeGroup::calculateGroupExponent(propensity);
    if (exponent>=minGroupExponent && exponent<=maxGroupExponent) {
      return maxGroupExponent-exponent;
    }
    else {
      return -1;
    }
  }
}

void ConstantTimeGroupCollection::addGroup(int newGroupExponent) {
#ifdef DEBUG
  if (newGroupExponent<=maxGroupExponent && newGroupExponent>=minGroupExponent) {
    std::cout << "StochKit ERROR (ConstantTimeGroupCollection::addGroup): (DEBUG flag set) attempted to add a group that already exists (newGroupExponent="<<newGroupExponent<<", current min="<<minGroupExponent<<", max="<<maxGroupExponent<<"). Terminating.\n";
    exit(1);
  }
#endif
  while (newGroupExponent<minGroupExponent) {
    ConstantTimeGroup newGroup(--minGroupExponent);
    groups.push_back(newGroup);
  }
  while (newGroupExponent>maxGroupExponent) {
    ConstantTimeGroup newGroup(++maxGroupExponent);
    groups.push_front(newGroup);    
  }
}

#ifdef DEBUG
//assumes DEBUG also defined in ConstantTimeGroup
void ConstantTimeGroupCollection::printGroups() {
  std::cout << "PRINTING GROUPS...\n";
  std::cout << "number of groups: "<<groups.size()<<"\n";
  std::cout << "max exponent: "<<maxGroupExponent<<", min: "<<minGroupExponent<<"\n";
  double minValidPropensity=pow(2.0,minGroupExponent-1);
  double maxValidPropensity=pow(2.0,maxGroupExponent);
  std::cout << "valid propensity range: ("<<minValidPropensity<<", "<<maxValidPropensity<<"]\n";
  std::cout << "propensitySum="<<propensitySum<<"\n";
  for (std::size_t i=0; i!=groups.size(); ++i) {
    std::cout << "groups["<<i<<"].size()="<<groups[i].getPropensityValues().size()<<", sum="<<groups[i].getGroupSum()<<"\n\t";
    double thisSum=0;
    for (std::size_t j=0; j!=groups[i].getPropensityValues().size(); ++j) {
      thisSum+=groups[i].getPropensityValues()[j];
      std::cout << "("<<j<<","<<groups[i].getPropensityValues()[j]<<","<<groups[i].getReactionIndexes()[j]<<") ";
      if ((int)j!=withinGroupIndexes[groups[i].getReactionIndexes()[j]]) {
	std::cout << "\nWARNING! withinGroupIndexes["<<groups[i].getReactionIndexes()[j]<<"] does not equal "<<j<<"\n";
      }
    }
    std::cout << "\n";
    if (thisSum!=groups[i].getGroupSum()) {
      std::cout << "WARNING! sum of group's propensities ("<<thisSum<<"), not equal groupSum ("<<groups[i].getGroupSum()<<"\n";
    }
  } 
}
#endif

int ConstantTimeGroupCollection::selectGroupIndex(STOCHKIT::RandomGenerator &randomGenerator) {
  int groupIndex=-1;
  double r=0;
  while (r==0) {
	r=randomGenerator.ContinuousOpen(0,1)*propensitySum;
  }
  double jsum=0;
  while (jsum < r) {
    ++groupIndex;
    if (groupIndex==(int)groups.size()) {
      recalculatePropensitySum();
      return selectGroupIndex(randomGenerator);
    }
    else {
      jsum+=groups[groupIndex].getGroupSum();
    }
  }
  return groupIndex;
}

}

