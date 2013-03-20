/*!
	\brief Parameter class definition
*/
#include "Parameter.h"

namespace STOCHKIT
{

bool ListOfParameters::calculateParameter(unsigned int Order)
{
#ifdef DEBUG
	if( Order >= ParametersList.size() ){
		std::cerr << "StochKit ERROR (Parameter::calculateParameter): calculate non-existing parameter" << std::endl;
		return false;
	}
#endif

	if(ParametersList[Order].CalculateFlag == 1){
		return true;
	} else if(ParametersList[Order].CalculateFlag == -1){
		ParametersList[Order].CalculateFlag = 0;
		std::vector<unsigned int>::iterator para_it; // iterator of parameters in link graph

		for( para_it = ParametersList[Order].ParametersAffectThis.begin(); para_it < ParametersList[Order].ParametersAffectThis.end(); ++para_it ){
			if( ParametersList[*para_it].CalculateFlag != 1 ){
				if(!calculateParameter(*para_it)){
					return false;
				}
			}
		}

		std::string parameterExpression = parameterSubstitution(ParametersList[Order].Expression);
		if( parameterExpression.empty() ){
			std::cerr << "StochKit ERROR (Parameter::calculateParameter): while calculating parameter " + ParametersList[Order].Id << std::endl;
			return false;
		}

		ParametersList[Order].Value = simpleCalculator.calculateString(parameterExpression);
		if(ParametersList[Order].Value == BADRESULT){
			std::cerr << "StochKit ERROR (Parameter::calculateParameter): while calculating parameter " + ParametersList[Order].Id << std::endl;
			return false;
		}

		ParametersList[Order].CalculateFlag = 1;

		return true;
	} else { // CalculateFlag == 0
		std::cerr << "StochKit ERROR (Parameter::calculateParameter): there is a loop in parameters link graph" << std::endl;
		return false;
	}
}

bool ListOfParameters::calculateParameters()
{
        // parameter substitution and calculate parameters
	for( unsigned int i = 0; i < ParametersList.size(); ++i ){
		if(!calculateParameter(i)){
			return false;
		}
	}

	return true;
}

// parameter substitution
// for example: 
// if P2 = 3, then  2*P2 -> 2*3
// returns NULL if parameter not found or there are too many parameters or there are some expression dead loops in parameters list
std::string ListOfParameters::parameterSubstitution(std::string equation)
{
	// locate a parameter name in equation
	unsigned int begin = 0, end = 0;
	std::string substitutedEquation = equation;

	while( begin < substitutedEquation.length() ){
		if( (isalpha(substitutedEquation.at(begin)) || substitutedEquation.at(begin) == '_') && ( (begin==0) || ((substitutedEquation.at(begin) != 'e') && (substitutedEquation.at(begin) != 'E')) || !(isalnum(substitutedEquation.at(begin-1)) || substitutedEquation.at(begin-1) == '_') )){
			end = begin+1;
			while( (end<substitutedEquation.length()) && (isalnum(substitutedEquation.at(end)) || substitutedEquation.at(end) == '_') )
				++end;
			
			std::string parameterName = substitutedEquation.substr(begin,end-begin);
			
			// search for the parameter in ParametersList
			unsigned int i = 0;
			while( (i < ParametersList.size()) && (parameterName.compare(ParametersList[i].Id)!=0) )
				++i;
			
			if( i == ParametersList.size() ){
				unsigned int j = 0;
 				while( (j < knownFunctions.functions.size()) && (parameterName.compare(knownFunctions.functions[j].first)!=0) )
 					++j;
 				if( j == knownFunctions.functions.size() ){
 					std::cerr << "StochKit ERROR (Parameter::parameterSubstitution): parameter " + parameterName + " not found in parameters list\n";
 					substitutedEquation.clear();
 					return substitutedEquation;
 				}
 				else{
 					begin += knownFunctions.functions[j].first.length();
  				}
			}
			else{
				// substitute parameter with its value
				std::ostringstream parameterValue;
				parameterValue << ParametersList[i].Value;
				substitutedEquation.replace(begin, end-begin, parameterValue.str());
				begin += parameterValue.str().length();
			}
		}
		else{
			++begin;
		}
	}
	
	return substitutedEquation;
}
	
bool ListOfParameters::linkParameters()
{
	std::vector<unsigned int>::iterator vec_it;

	for( unsigned int i=0; i<ParametersList.size(); ++i ){
		ParametersList[i].ParametersAffectThis = analyzeParameterExpression(ParametersList[i].Expression);
		
		for(vec_it = ParametersList[i].ParametersAffectThis.begin(); vec_it < ParametersList[i].ParametersAffectThis.end(); ++vec_it){
			insertToSortedArray<std::vector<unsigned int>, unsigned int>(ParametersList[*vec_it].AffectParameters, i);
		}
	}
	
	return true;
}

//! update ParametersList[Order] to a new expression and calculate all related parameters
bool ListOfParameters::updateParameter(unsigned int Order, std::string Expression, bool value_type)
{
	std::vector<unsigned int> new_ParametersAffectThis;
	std::vector<unsigned int> newlyAffectingParameters;
	std::vector<unsigned int> stopAffectingParameters;
	std::vector<unsigned int>::iterator vec_it;

	// update desired parameter
	if( value_type == true){
		new_ParametersAffectThis.clear();
	} else{
		new_ParametersAffectThis = analyzeParameterExpression(Expression);
	}

	// update link graph
	stopAffectingParameters = vectorDifference(ParametersList[Order].ParametersAffectThis, new_ParametersAffectThis);
	newlyAffectingParameters = vectorDifference(new_ParametersAffectThis, ParametersList[Order].ParametersAffectThis);
	for(vec_it = stopAffectingParameters.begin(); vec_it < stopAffectingParameters.end(); ++vec_it){
		delFromSortedArray<std::vector<unsigned int>, unsigned int>(ParametersList[*vec_it].AffectParameters, Order);
	}
	for(vec_it = newlyAffectingParameters.begin(); vec_it < newlyAffectingParameters.end(); ++vec_it){
		insertToSortedArray<std::vector<unsigned int>, unsigned int>(ParametersList[*vec_it].AffectParameters, Order);
	}

	if( value_type == true ){
		std::string parameterExpression = parameterSubstitution(Expression);
		if( parameterExpression.empty() ){
			std::cerr << "StochKit ERROR (Parameter::updateParameter): while updating parameter " + ParametersList[Order].Id << std::endl;
			return false;
		}

		ParametersList[Order].Value = simpleCalculator.calculateString(parameterExpression);
		if(ParametersList[Order].Value == BADRESULT){
			std::cerr << "StochKit ERROR (Parameter::updateParameter): while updating parameter " << ParametersList[Order].Id << std::endl;
			return false;
		}

		std::ostringstream parameterValue;
		parameterValue << ParametersList[Order].Value;

		ParametersList[Order].Expression = parameterValue.str();
	} else{
		ParametersList[Order].Expression = Expression;
	}
	
	ParametersList[Order].ParametersAffectThis = new_ParametersAffectThis;

	// mark all parameters need to be calculated
	markParameterCalculationFlag(Order);

	// calculate all parameters
	if(!calculateParameters()){
		std::cerr << "StochKit ERROR (Parameter::updateParameter): while updating parameter " << ParametersList[Order].Id << std::endl;
		return false;
	}

	return true;
}

//! mark ParametersList[Order] and all the parameters affected by this parameter as needed to be calculated
bool ListOfParameters::markParameterCalculationFlag(unsigned int Order)
{
	ParametersList[Order].CalculateFlag = -1;
	std::vector<unsigned int>::iterator para_it; // iterator of parameters in link graph

	for( para_it = ParametersList[Order].AffectParameters.begin(); para_it < ParametersList[Order].AffectParameters.end(); ++para_it ){
		markParameterCalculationFlag(*para_it);
	}

	return true;
}

//! Analyze parameter's expression and return a sorted vector of paramter orders that affect this expression
std::vector<unsigned int> ListOfParameters::analyzeParameterExpression(std::string Expression)
{
	std::vector<unsigned int> PATE; // Parameters Affect This Expression

	// locate a parameter name in equation
	unsigned int begin = 0, end = 0;

	while( begin < Expression.length() ){
		if( (isalpha(Expression.at(begin)) || Expression.at(begin) == '_') && ( (begin==0) || ((Expression.at(begin) != 'e') && (Expression.at(begin) != 'E')) || !(isalnum(Expression.at(begin-1)) || Expression.at(begin-1) == '_' ))){
			end = begin+1;
			while( (end<Expression.length()) && (isalnum(Expression.at(end)) || Expression.at(end) == '_') )
				++end;
			
			std::string parameterName = Expression.substr(begin,end-begin);
			
			// search for the parameter in ParametersList
			unsigned int i = 0;
			while( (i < ParametersList.size()) && (parameterName.compare(ParametersList[i].Id)!=0) )
				++i;
			
			if( i == ParametersList.size() ){
				begin = end;				
			}
			else{
				// record parameter affecting this expression
				PATE.push_back(i);
				begin = end;
			}
		}
		else{
			++begin;
		}
	}

	sort(PATE.begin(),PATE.end());

	std::vector<unsigned int>::iterator PATE_it;

#ifdef WIN32
	if(!PATE.empty())
	{
		for( PATE_it = (PATE.begin()+1 ); PATE_it < PATE.end(); ++PATE_it ){
			if( *PATE_it == *(PATE_it-1) ){
				PATE.erase(PATE_it);
				--PATE_it;
			}
		}
	}
#else
	for( PATE_it = (PATE.begin() + 1); PATE_it < PATE.end(); ++PATE_it ){
		if( *PATE_it == *(PATE_it-1) ){
			PATE.erase(PATE_it);
			--PATE_it;
		}
	}
#endif

	return PATE;
}

}
