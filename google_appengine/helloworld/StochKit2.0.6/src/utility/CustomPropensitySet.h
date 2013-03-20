#if !defined(__CustomPropensitySet_h__)
#define __CustomPropensitySet_h__

#include <iostream>
#include <vector>
#include "CustomPropensity.h"
#include "CustomSimplePropensity.h"

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class CustomPropensitySet
 {	
 public:

  typedef std::vector<CustomPropensity<_populationVectorType> *> tempType;

  std::vector<CustomPropensity<_populationVectorType> > customPropensities;
  std::vector<CustomSimplePropensity<_populationVectorType> > simplePropensities;
  std::vector<CustomPropensity<_populationVectorType> *> propensities;
  std::vector<std::pair<unsigned int, unsigned int> > propensities_index; // index pair (i,j) : i=0: simple; i=1: custom; j: position in corresponding vector

	CustomPropensitySet()
	{
	}

	double operator()(const int n, _populationVectorType& populations) {
	  return (*propensities[n])(populations);
	}
	
	std::size_t size() {
		return propensities.size();
	}

	//! default destructor ok
//	~CustomPropensitySet() {
//	}

	//! copy-constructor
	CustomPropensitySet(const CustomPropensitySet& other)
	{
		customPropensities = other.customPropensities;
		simplePropensities = other.simplePropensities;
		propensities_index = other.propensities_index;
		
		propensities.clear();
		// re-direct pointers
		for(unsigned int i=0; i < propensities_index.size(); ++i){
			if(propensities_index[i].first == 0){
				propensities.push_back(&simplePropensities[propensities_index[i].second]);
			} else {
				propensities.push_back(&customPropensities[propensities_index[i].second]);
			}
		}			
			
	}

	//! assignment operator
	CustomPropensitySet& operator=(const CustomPropensitySet& other)
	{
		if(this != &other){ // protect against invalid self-assignment
			customPropensities = other.customPropensities;
			simplePropensities = other.simplePropensities;
			propensities_index = other.propensities_index;

			propensities.clear();
			// re-direct pointers
			for(unsigned int i=0; i < propensities_index.size(); ++i){
				if(propensities_index[i].first == 0){
					propensities.push_back(&simplePropensities[propensities_index[i].second]);
				} else {
					propensities.push_back(&customPropensities[propensities_index[i].second]);
				}
			}			
		}
		return *this;
	}

	bool pushSimplePropensity(double rate)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity<_populationVectorType>(rate));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushSimplePropensity(double rate, int reactant1)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity<_populationVectorType>(rate, reactant1));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushSimplePropensity(double rate, int reactant1, int reactant2)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity<_populationVectorType>(rate, reactant1, reactant2));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushSimplePropensity(double rate, int reactant1, int reactant2, int reactant3)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity<_populationVectorType>(rate, reactant1, reactant2, reactant3));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushCustomPropensity(double (*CustomPropensityFunc)(_populationVectorType&))
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(1,customPropensities.size()));
		customPropensities.push_back(CustomPropensity<_populationVectorType>(CustomPropensityFunc));
		propensities.push_back(&customPropensities.back());

		return true;
	}

 };
}

#endif
