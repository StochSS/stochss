 /*
 *
 */

#ifndef _FORWARD_FREQUENCY_ESTIMATE_H_
#define _FORWARD_FREQUENCY_ESTIMATE_H_

#include <iostream>
#include <vector>
#include "IVFP_version_for_ode.h"
#include "boost/numeric/ublas/vector.hpp"

class ForwardFrequencyEstimate {
  public:
  	typedef boost::numeric::ublas::vector<double> dense_vec;

	typedef std::vector<std::size_t> (*independentSpeciesFunction) ();
	ForwardFrequencyEstimate(independentSpeciesFunction indSpecFunc);

	void run(double startTime, std::vector<double> sampleTimes, dense_vec& startPopulation);
	std::vector<double>& getCumulativeFiringFrequencyEstimateRef();
	std::vector<std::vector<double> >& getFiringFrequencyEstimatesRef();
	std::vector<dense_vec>& getSimulationOutputPopulationsRef();
	double getLastRunStartTime();

	void setModel(std::vector<ElementaryReaction>& theModel, std::size_t numberOfSpecies);

//private:
	
	IVFP_version_for_ode fullModelProcess;//kluge way to simulate model: use (modified version of) IVFP's "equilibrium" function to do implicit euler

//  private:
  	std::vector<std::vector<double> > firingFrequencyEstimates;//corresponding to each sample time
	std::vector<double> cumulativeFiringFrequencyEstimate;
	std::vector<dense_vec> simulationOutputPopulations;
	double lastRunStartTime;
	
	std::vector<ElementaryReaction> model;
	std::size_t NumberOfSpecies;
	
};

#endif