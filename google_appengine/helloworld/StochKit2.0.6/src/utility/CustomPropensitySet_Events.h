#if !defined(__CustomPropensitySet_Events_h__)
#define __CustomPropensitySet_Events_h__

#include <iostream>
#include <vector>

#include "Parameter.h"
#include "CustomPropensity_Events.h"
#include "CustomSimplePropensity_Events.h"

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class CustomPropensitySet_Events
 {	
 public:

	
  typedef std::vector<CustomPropensity_Events<_populationVectorType> *> tempType;
 
  std::vector<CustomPropensity_Events<_populationVectorType> > customPropensities;
  std::vector<CustomSimplePropensity_Events<_populationVectorType> > simplePropensities;
  std::vector<CustomPropensity_Events<_populationVectorType> *> propensities;
  std::vector<std::pair<unsigned int, unsigned int> > propensities_index; // index pair (i,j) : i=0: simple; i=1: custom; j: position in corresponding vector

  ListOfParameters ParametersList;
  ListOfParameters initialParametersList;

	CustomPropensitySet_Events()
	{
	}

	CustomPropensitySet_Events(std::vector<Parameter> existingParametersList):
    		initialParametersList(existingParametersList)
	{
		ParametersList = initialParametersList;
#ifdef DEBUG
		std::cout << "CustomPropensitySet_Events:\n";
		for( std::size_t i = 0; i < ParametersList.size(); ++i){      
			std::cout << ParametersList[i].Value << " ";
		}
		std::cout << std::endl;
#endif
	}

	double operator()(const int n, _populationVectorType& populations) {
	  return (*propensities[n])(populations, ParametersList);
	}
	
	std::size_t size() {
		return propensities.size();
	}

        //! default destructor ok	
//	~CustomPropensitySet_Events() {
//	}

	//! copy-constructor
	CustomPropensitySet_Events(const CustomPropensitySet_Events& other)
	{
		ParametersList = other.ParametersList;
		initialParametersList = other.initialParametersList;
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
	CustomPropensitySet_Events& operator=(const CustomPropensitySet_Events& other)
	{
		if(this != &other){ // protect against invalid self-assignment
			ParametersList = other.ParametersList;
			initialParametersList = other.initialParametersList;
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

	bool reset()
	{
		ParametersList = initialParametersList;
		return true;
	}

	bool pushSimplePropensity(double rate)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity_Events<_populationVectorType>(rate));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushSimplePropensity(double rate, int reactant1)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity_Events<_populationVectorType>(rate, reactant1));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushSimplePropensity(double rate, int reactant1, int reactant2)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity_Events<_populationVectorType>(rate, reactant1, reactant2));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushSimplePropensity(double rate, int reactant1, int reactant2, int reactant3)
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(0,simplePropensities.size()));
		simplePropensities.push_back(CustomSimplePropensity_Events<_populationVectorType>(rate, reactant1, reactant2, reactant3));
		propensities.push_back(&simplePropensities.back());

		return true;
	}

	bool pushCustomPropensity(double (*CustomPropensityFunc)(_populationVectorType&, ListOfParameters&))
	{
		propensities_index.push_back(std::pair<unsigned int, unsigned int>(1,customPropensities.size()));
		customPropensities.push_back(CustomPropensity_Events<_populationVectorType>(CustomPropensityFunc));
		propensities.push_back(&customPropensities.back());

		return true;
	}
 };
}

#endif
