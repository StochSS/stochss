#include "Reactant.h"

Reactant::Reactant() : speciesIndex(0), moleculeCount(0) {}
Reactant::Reactant(std::size_t speciesIndex, std::size_t moleculeCount) : 
	speciesIndex(speciesIndex), moleculeCount(moleculeCount) {}

void Reactant::setSpeciesIndex(std::size_t index) { speciesIndex=index; }
std::size_t Reactant::getSpeciesIndex() const { return speciesIndex; }
void Reactant::setMoleculeCount(std::size_t number) { moleculeCount=number; }
std::size_t Reactant::getMoleculeCount() const { return moleculeCount; }

bool Reactant::operator==(const Reactant& other) const {
	if (this->speciesIndex==other.speciesIndex && this->moleculeCount==other.moleculeCount) {
		return true;
	}
	return false;
}

void Reactant::display() {
	std::cout << speciesIndex <<"("<<moleculeCount<<")";
}
