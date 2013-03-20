#ifndef _ELEMENTARY_REACTION_H_
#define _ELEMENTARY_REACTION_H_
	
#include "Reactants.h"
#include "boost/numeric/ublas/vector_sparse.hpp"
#include "boost/numeric/ublas/vector.hpp"

class ElementaryReaction
{	
  public:
	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;


	typedef double (ElementaryReaction::* PropensityFunction) (dense_vec&);

	//need to be able to calculate derivatives
	typedef double (ElementaryReaction::* PartialDerivativeFunction) (std::size_t, dense_vec&);

	sparse_vec& getStoichiometry();

	ElementaryReaction();
	
	ElementaryReaction(double rateConstant, Reactants reactants, Products products, std::size_t populationVectorSize);

	inline
	double propensity(dense_vec& population) {
		return (this->*propensityFunction)(population);
	}

	Reactants getReactants();
	Products getProducts();
	
	std::size_t calculateReactionOrder();//0 for synthesis, 1 for isomer, 2 for bimolecular

	bool rebuild(std::size_t populationVectorSize);
	
	double getRateConstant();
	
	double d_dx_i(std::size_t speciesIndex, dense_vec& population);
	
	void display();
	bool isDuplicate(ElementaryReaction& other);//see if equivalent EXCEPT for rate constant
	
  private:
  
	inline
  	double partial_0th_order(std::size_t speciesIndex, dense_vec& population) {
		return 0.0;
	}

	inline
	double partial_1st_order(std::size_t speciesIndex, dense_vec& population){
		if ((int)speciesIndex!=reactantIndex1) {
			return 0.0;
		}
		else return rateConstant;
	}
	
	inline
	double partial_2nd_order(std::size_t speciesIndex, dense_vec& population) {
		//assumes reactantIndex1!=reactantIndex2
		if ((int)speciesIndex!=reactantIndex1 && (int)speciesIndex!=reactantIndex2) {
			return 0.0;
		}
		else if ((int)speciesIndex==reactantIndex1) {
			return rateConstant*population(reactantIndex2);
		}
		else {
			return rateConstant*population(reactantIndex1);
		}
	}

	inline
	double partial_2nd_order_same_reactant(std::size_t speciesIndex, dense_vec& population) {
		//assumes reactantIndex1==reactantIndex2
		if ((int)speciesIndex!=reactantIndex1) {
			return 0.0;
		}
		else {
			std::cout << "error 1980, this is wrong. terminating.\n";
			return rateConstant*population(reactantIndex1);
		}
	}
  
	Reactants reactants;
	Products products;
	double rateConstant;
	//double scaledRateConstant;//only used for A+A type reactions (or 3rd order...)
	sparse_vec stoichiometry;
	int reactantIndex1;
	int reactantIndex2;

public:	
	PropensityFunction propensityFunction;
	PartialDerivativeFunction d_dx_i_function;

	inline
	double propensity0(dense_vec& population) {
		return rateConstant;
	}
	
	inline
	double propensity1(dense_vec& population) {
	  return rateConstant*population(reactantIndex1);
	}

	//bimolecular, same species
	inline
	double propensity11(dense_vec& population) {
		return 0.5*rateConstant*population(reactantIndex1)*(population(reactantIndex1)-1);
	}

	//bimolecular, same species, USED ONLY FOR ODE or SLOW-SCALE SIMULATION!
	inline
	double propensity11_ode(dense_vec& population) {
		return (rateConstant/2.0)*population[reactantIndex1]*(population[reactantIndex1]);
	}	

	inline
	double propensity2(dense_vec& population) {
		return rateConstant*population(reactantIndex1)*population(reactantIndex2);
	}

};//class Elementary Reaction

#endif
