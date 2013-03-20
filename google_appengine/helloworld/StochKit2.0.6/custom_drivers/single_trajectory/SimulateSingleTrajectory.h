#ifndef _SIMULATE_SINGLE_TRAJECTORY_H_
#define _SIMULATE_SINGLE_TRAJECTORY_H_

#include <vector>
#include <utility>
#include "StandardDriverTypes.h"

using namespace STOCHKIT;

template <class SSA_Solver_T>
//assumes solver uses the standard population type...
//NumberOfReactions is number of reaction channels in the model
void simulateSingleTrajectory(std::vector<std::pair<double, StandardDriverTypes::populationType> >& output, SSA_Solver_T& solver, double simulationTime, unsigned maxSteps, std::size_t NumberOfReactions, bool printReactionCountDistribution=true) {	
	unsigned reactionCounter=0;

	solver.initialize();
	
	//record initial condition
	//output is vector of pair, where pair is the current time and current population vector
	//different from the output classes in the standard StochKit2 solvers
	output.push_back(std::make_pair(0.0,solver.getCurrentPopulation()));

	solver.setCurrentTime(solver.getCurrentTime()+solver.selectStepSize());
	
	std::vector<std::size_t> reactionCounts(NumberOfReactions);
	
	while (solver.getCurrentTime()<simulationTime && reactionCounter<maxSteps) {
		
		int rxnIndex=solver.selectReaction();
		solver.fireReaction(rxnIndex);
		reactionCounter++;
		reactionCounts[rxnIndex]++;
		//record output
		output.push_back(std::make_pair(solver.getCurrentTime(),solver.getCurrentPopulation()));
		
		if (reactionCounter==maxSteps) {
			std::cout << "max-steps reached at simulation time "<<solver.getCurrentTime()<<", terminating.\n";
		}
		solver.setCurrentTime(solver.getCurrentTime()+solver.selectStepSize());
	}
	
	if (reactionCounter!=maxSteps) {
	  output.push_back(std::make_pair(simulationTime,solver.getCurrentPopulation()));
	}
	if (printReactionCountDistribution) {
		std::cout << "fired "<<reactionCounter<<" reactions. Reaction count distribution:\n";
		for (std::size_t i=0; i!=reactionCounts.size(); ++i) {
			std::cout << "\treaction index "<<i<<": "<<reactionCounts[i]<<"\n";
		}
	}
	
}

#endif
