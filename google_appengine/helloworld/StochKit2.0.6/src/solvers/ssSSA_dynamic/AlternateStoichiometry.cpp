#include "AlternateStoichiometry.h"

void AlternateStoichiometry::setStoich(AlternateStoichiometry::populationVectorT& newStoich) {
	stoich=newStoich;
}

AlternateStoichiometry::populationVectorT AlternateStoichiometry::getStoich() {
	return stoich;
}

void AlternateStoichiometry::addDependency(std::size_t fastSpeciesIndex, std::size_t moleculeCount) {
	//first, see if fastSpeciesIndex is already in the map
	if (dependency.find(fastSpeciesIndex)==dependency.end()) {
		dependency.insert(std::pair<std::size_t,std::size_t>(fastSpeciesIndex,moleculeCount));
	} else {
		//species is already in the map, so increment the moleculeCount
		//std::cout << "StochKit MESSAGE (AlternateStoichiometry::addDependency): creating alternate stoichiometry with species dependency>1\n";
		dependency.find(fastSpeciesIndex)->second+=moleculeCount;
	}
}

void AlternateStoichiometry::setDependency(std::map<std::size_t, std::size_t> dep) {
	dependency=dep;
}

bool AlternateStoichiometry::dependencyIsEqual(std::map<std::size_t, std::size_t>& other_dependency) const {
	std::size_t this_dependency_size=this->dependency.size();
	std::size_t other_dependency_size=other_dependency.size();
	
	if (this_dependency_size!=other_dependency_size) {
		return false;
	}

	for (std::map<std::size_t, std::size_t>::const_iterator it=this->dependency.begin(); it!=this->dependency.end(); ++it) {
		if (other_dependency.count(it->first)==0) {
			return false;
		}
		else {
			if (it->second!=other_dependency.find(it->first)->second) {
				return false;
			}
		}
	}
	return true;
}

bool AlternateStoichiometry::dependencyIsEqual(AlternateStoichiometry& other) const {
	return dependencyIsEqual(other.dependency);
}


bool AlternateStoichiometry::dependencyIsEqualOrStrictlyWeaker(AlternateStoichiometry& other) const {
	//only returns true if this dependency's species index is a subset of other
	//and any overlapping species indexes are associated with equal or smaller molecule number
	
	std::size_t this_dependency_size=this->dependency.size();
	std::size_t other_dependency_size=other.dependency.size();
	
	if (this_dependency_size>other_dependency_size) {
		return false;
	}
	
	//if THIS is strictly weaker, then every element in THIS must be in other
	for (std::map<std::size_t, std::size_t>::const_iterator it=this->dependency.begin(); it!=this->dependency.end(); ++it) {
		if (other.dependency.count(it->first)>0) {
			if (it->second > other.dependency.find(it->first)->second) {
				return false;
			}
		}
		else {
			//THIS contains a dependency on a species that other does not
			return false;
		}
	}
	return true;
}

bool AlternateStoichiometry::dependencyIsStrictlyWeaker(AlternateStoichiometry& other) const {
	return (this->dependencyIsEqualOrStrictlyWeaker(other) && !this->dependencyIsEqual(other));
}

//create versions that pass by value to allow use in remove_if
bool AlternateStoichiometry::dependencyIsStrictlyWeakerNonRef(AlternateStoichiometry other) const {
	return (this->dependencyIsEqualOrStrictlyWeakerNonRef(other) && !this->dependencyIsEqualNonRef(other));
}

bool AlternateStoichiometry::dependencyIsEqualOrStrictlyWeakerNonRef(AlternateStoichiometry other) const {
	//only returns true if this dependency's species index is a subset of other
	//and any overlapping species indexes are associated with equal or smaller molecule number
	
	std::size_t this_dependency_size=this->dependency.size();
	std::size_t other_dependency_size=other.dependency.size();
	
	if (this_dependency_size>other_dependency_size) {
		return false;
	}
	
	//if THIS is strictly weaker, then every element in THIS must be in other
	for (std::map<std::size_t, std::size_t>::const_iterator it=this->dependency.begin(); it!=this->dependency.end(); ++it) {
		if (other.dependency.count(it->first)>0) {
			if (it->second > other.dependency.find(it->first)->second) {
				return false;
			}
		}
		else {
			//THIS contains a dependency on a species that other does not
			return false;
		}
	}
	return true;
}

bool AlternateStoichiometry::dependencyIsEqualNonRef(AlternateStoichiometry other) const {
	return dependencyIsEqual(other.dependency);
}

void AlternateStoichiometry::display() {
	std::cout << "stoich.size="<<stoich.size()<<"...\n";
	for (std::size_t i=0; i!=stoich.size(); ++i) {
		std::cout << stoich[i] << "\t";
	}
	std::cout << "\tdependencies: ";
	if (dependency.size()==0) std::cout << "(none)";
	for (std::map<std::size_t, std::size_t>::iterator it=dependency.begin(); it!=dependency.end(); ++it) {
		std::cout << it->first << " ("<<it->second<<")   ";
	}
	std::cout << "\n";
}

//different from number of species in dependency which is just dependency.size
std::size_t AlternateStoichiometry::numberOfMoleculesInDependency() {
	std::size_t sum=0;
	for (std::map<std::size_t, std::size_t>::iterator it=this->dependency.begin(); it!=this->dependency.end(); ++it) {
		sum+=it->second;
	}
	return sum;
}

std::map<std::size_t, std::size_t>& AlternateStoichiometry::getDependencyRef() {
	return dependency;
}

std::map<std::size_t, std::size_t> AlternateStoichiometry::generateDependencyFromReactants(Reactants& reactants) {
	std::map<std::size_t, std::size_t> dep;
	for (std::size_t j=0; j!=reactants.size(); ++j) {
		dep.insert(std::pair<std::size_t,std::size_t>(reactants[j].getSpeciesIndex(),reactants[j].getMoleculeCount()));
	}
	return dep;
}
