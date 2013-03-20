/*!
	\brief Parameter class definition
*/

#ifndef _PARAMETER_H_
#define _PARAMETER_H_

#ifndef MAXPARAMETERNUM
#define MAXPARAMETERNUM 200 // maximum parameter number there could be
#endif

#ifndef BADRESULT
#define BADRESULT -32678 // indicate bad result such as divisor to be 0 or something in calculation
#endif

#include <iostream>
#include <sstream>
#include <algorithm>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <libxml/xmlmemory.h>
#include <libxml/parser.h>
#include <boost/shared_ptr.hpp>
#include <vector>
#include <limits>
#include "VectorManipulation.h"
#include "SupportedFunctions.h"
#include "StringCalculator.h"

namespace STOCHKIT
{
 //! class to store parameters and related information
 class Parameter{
	public:
		std::string Id;  // Id of the parameter
		int Type; // 0 = constant, 1 = changeable during simulation
		std::string Expression;  // expression of the parameter
		int CalculateFlag; // -1 = not calculated yet, 0 = calculating, 1 = already calculated
		double Value; // value of the parameter
		std::vector<unsigned int> AffectParameters;
		std::vector<unsigned int> ParametersAffectThis;
		std::vector<unsigned int> AffectReactions;

		Parameter(){
		}

		//! default copy constructor ok

		//! default destructor ok
 };

 //! class to store parameter lists and related operation
 class ListOfParameters{
	protected:
		//! class to handle calculation of simple math expression strings
		StringCalculator simpleCalculator;

		SupportedFunctions knownFunctions;

	public:
		std::vector<Parameter> ParametersList;

		ListOfParameters(){
			ParametersList.clear();
		}

		//! constructor with a list as arguement
		ListOfParameters(std::vector<Parameter> existingParametersList){
			ParametersList = existingParametersList;
		}

		//! default copy constructor ok

		//! default destructor ok

		Parameter& operator[](unsigned int i){
			return ParametersList[i];
		}

		unsigned int size(){
			return ParametersList.size();
		}

		void push_back(const Parameter& x){
			ParametersList.push_back(x);
		}

		Parameter& back(){
			return ParametersList.back();
		}

		//! caluclate the ParametersList[Order]
		bool calculateParameter(unsigned int Order);
			
		bool calculateParameters();

		// parameter substitution
		// for example: 
		// if P2 = 3, then  2*P2 -> 2*3
		// returns NULL if parameter not found or there are too many parameters or there are some expression dead loops in parameters list
		std::string parameterSubstitution(std::string equation);

		//! Analyze parameter's expression and return a sorted vector of paramter orders that affect this expression
		std::vector<unsigned int> analyzeParameterExpression(std::string Expression);

		bool linkParameters();

		//! update ParametersList[Order] to a new expression and calculate all related parameters
		// value_type = true: value, will be constant afterwards
		// value_type = false: expression, still depend on other parameters
		bool updateParameter(unsigned int Order, std::string Expression, bool value_type);

		//! mark ParametersList[Order] and all the parameters affected by this parameter as needed to be calculated
		bool markParameterCalculationFlag(unsigned int Order);

 }; // end of ParametersList class
}

#endif

