#include "Reactants.h"
Reactants::Reactants() {}

Reactants::Reactants(std::vector<Reactant> thereactants): reactants(thereactants) {
//	std::cout << "constructing from:\n";
//	for (std::size_t i=0; i!=thereactants.size(); ++i) {
//		thereactants[i].display();
//		std::cout << "\n";
//	}
//	std::cout << "\n";
	
	std::size_t originalSize=reactants.size();
	//sort by reactant species index by convention...other code assumes this
	std::sort(reactants.begin(),reactants.end(),compareReactantSpeciesIndexes);
	reactants.erase(std::unique(reactants.begin(),reactants.end(),reactantSpeciesIndexesEqual),reactants.end());

//	std::cout << "after removing duplicates, we have:\n";
//	display();
//	std::cout << "\n";
	//check for duplicates--should not be duplicates, if reaction depends on two molecules of species A, should be one entry for species index A with molecule count =2
	if (reactants.size()!=originalSize) {
		std::cout << "StochKit ERROR (Reactants): duplicate species index entry in constructed Reactants object. Terminating.\n";
		exit(1);
	}
	
}

Reactants::sparse_vec Reactants::calculateStoichiometry(std::size_t populationVectorSize) {
//		std::cout << "calculating stoichiometry...population size is "<<populationVectorSize<<"\n";
	sparse_vec stoich(populationVectorSize);
	for (std::size_t i=0; i!=reactants.size(); ++i) {
//			std::cout << "species index is "<<reactants[i].getSpeciesIndex()<<"\n";
		stoich(reactants[i].getSpeciesIndex())+=reactants[i].getMoleculeCount();
	}
//		std::cout << "finished calculating stoichiometry...\n";

	return stoich;
}

std::size_t Reactants::size() {
	return reactants.size();
}

std::vector<Reactant> Reactants::get() {//named it "get" rather than getReactants so typedef Reactants Products makes sense
	return reactants;
}

std::vector<Reactant>& Reactants::getRef() {//named it "get" rather than getReactants so typedef Reactants Products makes sense
	return reactants;
}

template <typename populationVectorType>
inline double Reactants::calculatePropensityPart(populationVectorType& population) {
	double propensityPart=1.0;
	
	for (std::size_t i=0; i!=reactants.size(); ++i) {
		for (std::size_t j=0; j!=reactants[i].getMoleculeCount(); ++j) {
			propensityPart*=(population[reactants[i].getSpeciesIndex()]-j)/(1+j);//just doing the binomial coefficients
		}
	}
	
	return propensityPart;
}

Reactant& Reactants::operator[](std::size_t i) {
	return reactants[i];
}

bool Reactants::operator==(const Reactants& other) const {
	if (this->reactants.size()!=other.reactants.size()) return false;

	//for each reactant in this, make sure same reactant appears in other (in any order)
	for (std::size_t i=0; i!=this->reactants.size(); ++i) {
		bool foundMatch=false;
		for (std::size_t j=0; j!=other.reactants.size(); ++j) {
			if (this->reactants[i]==other.reactants[j]) foundMatch=true;
		}
		if (!foundMatch) return false;
	}
	
	return true;
}

void Reactants::display() {
	for (std::size_t i=0; i!=reactants.size(); ++i) {
		reactants[i].display();
		std::cout << "\t";
	}
}

//helper functions
bool Reactants::compareReactantSpeciesIndexes(Reactant r1, Reactant r2) {
	return (r1.getSpeciesIndex()<r2.getSpeciesIndex());
}

bool Reactants::reactantSpeciesIndexesEqual(Reactant r1, Reactant r2) {
	return (r1.getSpeciesIndex()==r2.getSpeciesIndex());
}
