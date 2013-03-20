#if !defined(__CustomSimplePropensity_h__)
#define __CustomSimplePropensity_h__

#include <iostream>
#include <vector>
#include "boost/numeric/ublas/vector.hpp"

#include "CustomPropensity.h"

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class CustomSimplePropensity : public CustomPropensity<_populationVectorType>
 {	
 //private://violate object oriented design for slow-scale SSA
public:
	double rateConstant;
	int reactantIndex1;
	int reactantIndex2;
private:
	int reactantIndex3;

	// index below are for trimolecular reactions where two of the reactants are of the same species and the other is not
	int doublereactantIndex;
	int singlereactantIndex;

	typedef double (CustomSimplePropensity::* PropensityFunction) (_populationVectorType&);
	PropensityFunction propensity;

 public:
	CustomSimplePropensity() {
		reset();
	}
	
	CustomSimplePropensity(double rate)
	{
		create(rate);
	}

	CustomSimplePropensity(double rate, int reactant1)
	{
		create(rate,reactant1);
	}

	CustomSimplePropensity(double rate, int reactant1, int reactant2)
	{
		create(rate,reactant1,reactant2);
	}

	CustomSimplePropensity(double rate, int reactant1, int reactant2, int reactant3)
	{
		create(rate,reactant1,reactant2,reactant3);
	}

	void reset() {
		rateConstant=0.0;
		reactantIndex1=-1;
		reactantIndex2=-1;
		reactantIndex3=-1;
		doublereactantIndex = -1;
		singlereactantIndex = -1;
		propensity=NULL;
	}

	virtual double operator()(_populationVectorType& x) {
		return (this->*propensity)(x);
	}
	
	virtual ~CustomSimplePropensity() {
	}

 private:	
	void create(double rate) {
		reset();
		rateConstant=rate;
		propensity=&CustomSimplePropensity::propensity0;
	}

	void create(double rate, int rxnIndex1) {
		reset();
		rateConstant=rate;
		reactantIndex1=rxnIndex1;
		propensity=&CustomSimplePropensity::propensity1;
	}
	void create(double rate, int rxnIndex1, int rxnIndex2) {
		reset();
		rateConstant=rate;
		reactantIndex1=rxnIndex1;
		reactantIndex2=rxnIndex2;
		if (rxnIndex1==rxnIndex2) {
			propensity=&CustomSimplePropensity::propensity11;
		}
		else {
			propensity=&CustomSimplePropensity::propensity2;
		}
	}

	void create(double rate, int rxnIndex1, int rxnIndex2, int rxnIndex3) {
		reset();
		rateConstant=rate;
		reactantIndex1=rxnIndex1;
		reactantIndex2=rxnIndex2;
		reactantIndex3=rxnIndex3;
		if (rxnIndex1==rxnIndex2) {
			if(rxnIndex1==rxnIndex3){
				propensity=&CustomSimplePropensity::propensity111;
			}
			else{
				doublereactantIndex = rxnIndex1;
				singlereactantIndex = rxnIndex3;
				propensity=&CustomSimplePropensity::propensity21;
			}
		}
		else {
			if(rxnIndex1==rxnIndex3){
				doublereactantIndex = rxnIndex1;
				singlereactantIndex = rxnIndex2;
				propensity=&CustomSimplePropensity::propensity21;
			}
			else{
				if(rxnIndex2==rxnIndex3){
					doublereactantIndex = rxnIndex2;
					singlereactantIndex = rxnIndex1;
					propensity=&CustomSimplePropensity::propensity21;
				}
				else{
					propensity=&CustomSimplePropensity::propensity3;
				}
			}
		}
	}

	double propensity0(_populationVectorType& x) {
		return rateConstant;
	}
	double propensity1(_populationVectorType& x) {
	  return rateConstant*x[reactantIndex1];
	}
	//bimolecular, same species
	double propensity11(_populationVectorType& x) {
		return (rateConstant/2.0)*x[reactantIndex1]*(x[reactantIndex1]-1);
	}
	double propensity2(_populationVectorType& x) {
		return rateConstant*x[reactantIndex1]*x[reactantIndex2];
	}
	//trimolecular, same species
	double propensity111(_populationVectorType& x) {
		return (rateConstant/6.0)*x[reactantIndex1]*(x[reactantIndex1]-1)*(x[reactantIndex1]-2);
	}
	//trimolecular, two of the same species, the other not
	double propensity21(_populationVectorType& x) {
		return (rateConstant/2.0)*x[doublereactantIndex]*(x[doublereactantIndex]-1)*x[singlereactantIndex];
	}
	double propensity3(_populationVectorType& x) {
		return rateConstant*x[reactantIndex1]*x[reactantIndex2]*x[reactantIndex3];
	}

 };
}

#endif
