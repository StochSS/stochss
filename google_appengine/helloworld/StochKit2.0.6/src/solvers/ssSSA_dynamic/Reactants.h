/*
 *  Reactants.h
 *  
 *
 *  Created by Kevin Sanft on 8/13/10.
 *
 */
#ifndef _REACTANTS_H_
#define _REACTANTS_H_

#include "Reactant.h"
#include "boost/numeric/ublas/vector_sparse.hpp"
#include <vector>
#include <algorithm>

class Reactants {
  public:

	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;
	
	Reactants();
	
	Reactants(std::vector<Reactant> reactants);
	
	sparse_vec calculateStoichiometry(std::size_t populationVectorSize);
	
	std::size_t size();
	
	std::vector<Reactant> get();//named it "get" rather than getReactants so typedef Reactants Products makes sense

	std::vector<Reactant>& getRef();//named it "get" rather than getReactants so typedef Reactants Products makes sense
	
	template <typename populationVectorType>
	inline double calculatePropensityPart(populationVectorType& population);
	
	Reactant& operator[](std::size_t i);
	
	bool operator==(const Reactants& other) const;

	void display();

	//helper functions
	static bool compareReactantSpeciesIndexes(Reactant r1, Reactant r2);

	static bool reactantSpeciesIndexesEqual(Reactant r1, Reactant r2);

  private:
	std::vector<Reactant> reactants;

};

typedef Reactants Products;

#endif