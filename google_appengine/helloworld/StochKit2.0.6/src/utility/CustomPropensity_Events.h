#if !defined(__CustomPropensity_Events_h__)
#define __CustomPropensity_Events_h__

#include <iostream>
#include <vector>
#include "boost/numeric/ublas/vector.hpp"
#include "Parameter.h"

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class CustomPropensity_Events
 {	
 public:
  

  typedef double (*customPropensityFunction)(_populationVectorType&, ListOfParameters&);
  customPropensityFunction propensityFunction;

  CustomPropensity_Events(){};

  CustomPropensity_Events(customPropensityFunction func):
    propensityFunction(func)
    {}

  virtual double operator()(_populationVectorType& x, ListOfParameters &ParametersList) {
    return (*propensityFunction)(x, ParametersList);
  }

  virtual ~CustomPropensity_Events(){};

 };
}

#endif
