#include "ForwardFrequencyEstimate.h"
ForwardFrequencyEstimate::ForwardFrequencyEstimate(independentSpeciesFunction indSpecFunc) : fullModelProcess(indSpecFunc) {}

void ForwardFrequencyEstimate::run(double startTime, std::vector<double> sampleTimes, ForwardFrequencyEstimate::dense_vec& startPopulation) {
	lastRunStartTime=startTime;
	
	firingFrequencyEstimates.resize(sampleTimes.size());
	for (std::size_t i=0; i!=firingFrequencyEstimates.size(); ++i) {
		firingFrequencyEstimates[i].resize(model.size());
		for (std::size_t j=0; j!=firingFrequencyEstimates[i].size(); ++j) {
			firingFrequencyEstimates[i][j]=0;
		}
	}
	cumulativeFiringFrequencyEstimate.resize(model.size());
	for (std::size_t i=0; i!=cumulativeFiringFrequencyEstimate.size(); ++i) {
		cumulativeFiringFrequencyEstimate[i]=0;
	}
	simulationOutputPopulations.resize(sampleTimes.size());
	
	
	
	if (sampleTimes[0]<startTime) {
		std::cout << "StochKit ERROR (ForwardFrequencyEstimate::run): first sample time cannot be before estimate start time. (BUG?)\n";
	}
	//assumes sampleTimes are in order
	double previousTimePoint=startTime;
	dense_vec previousPop=startPopulation;
	
	
	//NEED TO USE THIS BIT OF CODE. BUT MODIFY IT APPROPRIATELY...
	std::vector<size_t> fastSpeciesIndexes=fullModelProcess.getFastSpeciesIndexes();
	
	for (std::size_t i=0; i!=sampleTimes.size(); ++i) {

		for (std::size_t x=0; x!=fastSpeciesIndexes.size(); ++x) {
			fullModelProcess.latestRealizablePopulation(x)=previousPop(fastSpeciesIndexes[x]);
		}
		
		fullModelProcess.equilibrium(sampleTimes[i]-previousTimePoint,previousPop);//overwrites previousPop
	
		simulationOutputPopulations[i]=previousPop;

		//use computed population "previousPop" to evaluate the propensities
		for (std::size_t rxn=0; rxn!=model.size(); ++rxn) {
			firingFrequencyEstimates[i][rxn]=model[rxn].propensity(previousPop)*(sampleTimes[i]-previousTimePoint);
			cumulativeFiringFrequencyEstimate[rxn]+=firingFrequencyEstimates[i][rxn];
		}
		previousTimePoint=sampleTimes[i];
	}

}

std::vector<double>& ForwardFrequencyEstimate::getCumulativeFiringFrequencyEstimateRef() {
	return cumulativeFiringFrequencyEstimate;
}

std::vector<std::vector<double> >& ForwardFrequencyEstimate::getFiringFrequencyEstimatesRef() {
	return firingFrequencyEstimates;
}

std::vector<ForwardFrequencyEstimate::dense_vec>& ForwardFrequencyEstimate::getSimulationOutputPopulationsRef() {
	return simulationOutputPopulations;
}

double ForwardFrequencyEstimate::getLastRunStartTime() {
	return lastRunStartTime;
}

void ForwardFrequencyEstimate::setModel(std::vector<ElementaryReaction>& theModel, std::size_t numberOfSpecies) {
	this->model=theModel;
	this->NumberOfSpecies=numberOfSpecies;
}