#ifndef _ALTERNATE_STOICHIOMETRY_H_
#define _ALTERNATE_STOICHIOMETRY_H_

#include "Reactants.h"
#include "boost/numeric/ublas/vector_sparse.hpp"
#include "boost/numeric/ublas/vector.hpp"
#include "boost/numeric/ublas/operation.hpp"
#include <iostream>
#include <vector>
#include <map>

class AlternateStoichiometry {

  public:
  
	typedef boost::numeric::ublas::vector<double> populationVectorT;	

	inline
	bool dependencyIsSatisfied(populationVectorT& x) {
		//iterate over dependency
		for (std::map<std::size_t, std::size_t>::iterator it=dependency.begin(); it!=dependency.end(); ++it) {
			if (x(it->first)<it->second) {
				return false;
			}
		}
		return true;
	}
	
	inline
	void applyStoichiometry(populationVectorT& x) {
		x+=stoich;
	}

	void setStoich(populationVectorT& newStoich);

	populationVectorT getStoich();

	inline
	void incrementStoich(populationVectorT& vectorToAdd) {
		stoich+=vectorToAdd;
	}

	//returns true if this AlternateStoichiometry already depends on species
	inline
	bool alreadyContainsDependency(std::size_t fastSpeciesIndex) {
		return (dependency.find(fastSpeciesIndex)!=dependency.end());
	}

	void addDependency(std::size_t fastSpeciesIndex, std::size_t moleculeCount);
	
	void setDependency(std::map<std::size_t, std::size_t> dep);
	
	inline
	bool equal(const populationVectorT& a, const populationVectorT& b) const {
		//assumes same size!
		for (std::size_t i=0; i!=a.size(); ++i) {
			if (a[i]!=b[i]) return false;
		}
		return true;
	}
	
	inline
	bool equal(AlternateStoichiometry& other) const {
		return (AlternateStoichiometry::equal(stoich,other.stoich) && this->dependencyIsEqual(other));
	}

	bool dependencyIsEqual(std::map<std::size_t, std::size_t>& other_dependency) const;

	bool dependencyIsEqual(AlternateStoichiometry& other) const;
	
	bool dependencyIsEqualOrStrictlyWeaker(AlternateStoichiometry& other) const;

	bool dependencyIsStrictlyWeaker(AlternateStoichiometry& other) const;

	//create versions that pass by value to allow use in remove_if
	bool dependencyIsStrictlyWeakerNonRef(AlternateStoichiometry other) const;

	bool dependencyIsEqualOrStrictlyWeakerNonRef(AlternateStoichiometry other) const;
	
	bool dependencyIsEqualNonRef(AlternateStoichiometry other) const;

	void display();

	//different from number of species in dependency which is just dependency.size
	std::size_t numberOfMoleculesInDependency();

	std::map<std::size_t, std::size_t>& getDependencyRef();

	static std::map<std::size_t, std::size_t> generateDependencyFromReactants(Reactants& reactants);

  protected:
	std::map<std::size_t, std::size_t> dependency;//first is fast species index, second is number needed
	populationVectorT stoich;
	
};

#endif
