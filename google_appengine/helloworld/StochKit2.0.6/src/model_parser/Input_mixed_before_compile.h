/*!
	\brief Text file input handler

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
//read file
//parse by libxml2
//some check
//write data structure
//write to a file if need compile
//compile
*/

#ifndef _INPUT_MIXED_BEFORE_COMPILE_H_
#define _INPUT_MIXED_BEFORE_COMPILE_H_

#include "Input.h"
#include <fstream>

//#define _CUSTOM_PROPENSITY_FUNCTIONS_FILENAME_ "CustomPropensityFunctions.h"
namespace STOCHKIT
{

 template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
 class Input_mixed_before_compile :
	public Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>
 {
 public:
        Input_mixed_before_compile(char *xmlFilename):
		Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>(xmlFilename)
	{
	}

	Input_mixed_before_compile(char *xmlFilename,
			           char *customPropensityFunctionsFilename) :
		Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>(xmlFilename)
	{
		writeCustomPropensityFunctionsFile(customPropensityFunctionsFilename);
	}

 protected:
	// substitute parameters and species in custom propensities
	std::string customPropensitySubstitution(std::string equation)
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
				while( (i < this->ParametersList.size()) && (parameterName.compare(this->ParametersList[i].Id)!=0) )
					++i;

				if( i != this->ParametersList.size() ){
					// substitute parameter with its value
					std::ostringstream parameterValue;
					parameterValue <<  this->ParametersList[i].Value;
					substitutedEquation.replace(begin, end-begin, parameterValue.str());
					
					begin = begin + parameterValue.str().size();
				}
				else{
					// search for species in SpeciessList
					unsigned int j = 0;
					while( (j < this->SpeciesList.size()) && (parameterName.compare(this->SpeciesList[j].Id)!=0) )
						++j;

					if( j != this->SpeciesList.size() ){
						// substitute species name with its population variable
						std::ostringstream speciesReference;
						speciesReference << "x[" << j <<"]";
						substitutedEquation.replace(begin, end-begin, speciesReference.str());
						
						begin = begin + speciesReference.str().size();
					}
					else{
						std::cout << "StochKit WARNING (Input_mixed_before_compile::customPropensitySubstitution): function \"" << parameterName << "\" written into custom propensity function, please make sure it's a legitimate c++ function \n";
						begin = begin + parameterName.size();
					}
				}
			}
			else if (substitutedEquation.at(begin) == '/'){
				substitutedEquation.replace(begin, 1, "/(double)");
				begin += 9;
			}
			else{
				++begin;
			}
		}

		return substitutedEquation;
	}

 public:
	bool writeCustomPropensityFunctionsFile(char *CustomPropensityFunctionsFileName)
	{
		std::ofstream customPropensityFile;
		customPropensityFile.open(CustomPropensityFunctionsFileName);
		customPropensityFile << "#ifndef _CUSTOM_PROPENSITY_FUNCTIONS_H_\n";
		customPropensityFile << "#define _CUSTOM_PROPENSITY_FUNCTIONS_H_\n\n";
		customPropensityFile << "#include <iostream>\n";
		customPropensityFile << "#include <vector>\n";
		customPropensityFile << "#include <math.h>\n";
		customPropensityFile << "#include <algorithm>\n\n";
		customPropensityFile << "using namespace std;\n\n";
		customPropensityFile << "namespace STOCHKIT\n{\n";
		customPropensityFile.flush();

		std::vector<unsigned int> customPropensityList;
		
		typename Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>::Reaction *cur_reaction;

		for(int i=0; i<this->NumberOfReactions; ++i){
			cur_reaction = &this->ReactionsList[i];
			if(cur_reaction->Type == 2){
				customPropensityList.push_back(i);
				std::string customPropensityFunction = customPropensitySubstitution(cur_reaction->Customized);
				if(customPropensityFunction.empty()){
					std::cerr << "StochKit ERROR (Input_mixed_before_compile::writeCustomPropensityFunctionsFile): while parsing the custom propensity function of reaction " << cur_reaction->Id<<std::endl;
					customPropensityFile.close();
					exit(1);
				}

				customPropensityFile << "template<typename _populationVectorType>\n";
				customPropensityFile << "double f" << i << "(_populationVectorType& x) {\n";
				customPropensityFile << "    return (double)" << customPropensityFunction << ";\n";
				customPropensityFile << "}\n\n";
				customPropensityFile.flush();
			}
		}

		customPropensityFile << "template<typename _populationVectorType>\n" ;
		customPropensityFile << "class CustomPropensityFunctions\n" ;
		customPropensityFile << "{\n" ;
		customPropensityFile << "public:\n";
		customPropensityFile << "    static const int NumberOfReactions = " << this->NumberOfReactions  << ";\n";
		customPropensityFile << "    typedef double (*PropensityMember)(_populationVectorType&);\n";
		customPropensityFile << "    std::vector<PropensityMember> propensityFunctions;\n\n";
		customPropensityFile << "    // default constructor\n";
		customPropensityFile << "    CustomPropensityFunctions() {\n";
		customPropensityFile << "        propensityFunctions.resize(" << this->NumberOfReactions << ");\n";
		for(unsigned int i = 0; i < customPropensityList.size(); ++i){
			customPropensityFile << "        propensityFunctions[" << customPropensityList[i]  << "] = &f" << customPropensityList[i] << "<_populationVectorType>;\n" ;
		}
		customPropensityFile << "    }\n";
		customPropensityFile << "};\n}\n";
		customPropensityFile << "#endif\n";
		customPropensityFile.flush();

		customPropensityFile.close();
		
		return true;
	}
 };

}
#endif

