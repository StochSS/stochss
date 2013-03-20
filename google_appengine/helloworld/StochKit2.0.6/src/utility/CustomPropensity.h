#if !defined(__CustomPropensity_h__)
#define __CustomPropensity_h__

#include <iostream>
#include <vector>
#include "boost/numeric/ublas/vector.hpp"

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class CustomPropensity 
 {	
 public:
  
  typedef double (*customPropensityFunction)(_populationVectorType&);
  customPropensityFunction propensityFunction;

  CustomPropensity(){};

  CustomPropensity(customPropensityFunction func):
    propensityFunction(func)
    {}

  virtual double operator()(_populationVectorType& x) {
    return (*propensityFunction)(x);
  }

  virtual ~CustomPropensity(){};

 };
}

#endif
