/*!
	\brief Text file input handler with events handler

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
*/

#ifndef _INPUT_EVENTS_BEFORE_COMPILE_H_
#define _INPUT_EVENTS_BEFORE_COMPILE_H_

#include "Input_events.h"
#include <fstream>

//#define _CUSTOM_PROPENSITY_FUNCTIONS_FILENAME_ "CustomPropensityFunctions.h"

namespace STOCHKIT
{
 template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
 class Input_events_before_compile :
	public Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>
 {
 public:
        Input_events_before_compile(char *xmlFilename):
		Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>(xmlFilename)
	{
	}

	Input_events_before_compile(char *xmlFilename,
			           char *customPropensityFunctionsFilename,
				   char *customStateBasedTriggerFunctionsFilename,
				   char *customChangeSingleSpeciesFunctionsFilename) :
		Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>(xmlFilename)
	{
		writeCustomPropensityFunctionsFile(customPropensityFunctionsFilename);
		writeCustomStateBasedTriggerFunctionsFile(customStateBasedTriggerFunctionsFilename);
		writeCustomChangeSingleSpeciesFunctionsFile(customChangeSingleSpeciesFunctionsFilename);
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
					parameterValue << "ParametersList[" << i<< "].Value";
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
						std::cout << "StochKit WARNING (Input_events_before_compile::customPropensitySubstitution): function \"" << parameterName << "\" written into custom propensity function, please make sure it's a legitimate c++ function \n";
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
		customPropensityFile << "#include <algorithm>\n";
		customPropensityFile << "using namespace std;\n";
		customPropensityFile << "#include \"Parameter.h\"\n\n";
		customPropensityFile << "namespace STOCHKIT\n{\n";
		customPropensityFile.flush();

		std::vector<int> customPropensityList;
		
		typename Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>::Reaction *cur_reaction;

		for(int i=0; i<this->NumberOfReactions; ++i){
			cur_reaction = &this->ReactionsList[i];
			if(cur_reaction->Type == 2 || cur_reaction->Type == 3){
				customPropensityList.push_back(i);
			}
		}

		for(unsigned int i = 0; i < customPropensityList.size(); ++i){
			cur_reaction = &this->ReactionsList[customPropensityList[i]];
			std::string customPropensityFunction;
			if( cur_reaction->Type == 2 ){
				customPropensityFunction = customPropensitySubstitution(cur_reaction->Customized);
			
				if(customPropensityFunction.empty()){
					std::cerr << "StochKit ERROR (Input_events_before_compile::writeCustomPropensityFunctionsFile): while parsing the custom propensity function of reaction " << cur_reaction->Id << std::endl;
					customPropensityFile.close();
					exit(1);
				}

			} else if ( cur_reaction->Type == 3 ){
				customPropensityFunction = customPropensitySubstitution(cur_reaction->Rate);

				if(customPropensityFunction.empty()){
					std::cerr << "StochKit ERROR (Input_events_before_compile::writeCustomPropensityFunctionsFile): while parsing the custom propensity function of reaction " << cur_reaction->Id << std::endl;
					customPropensityFile.close();
					exit(1);
				}

				switch (cur_reaction->Reactants.size()){
					case 0:
						break;
					case 1:
						{
						std::ostringstream reactant11;
						reactant11 << "x[" << cur_reaction->Reactants[0].Index << "]";
						if( cur_reaction->Reactants[0].Stoichiometry == -1 )
							customPropensityFunction.append("*"+reactant11.str());
						else if( cur_reaction->Reactants[0].Stoichiometry == -2 )
							customPropensityFunction.append("*"+reactant11.str()+"*("+reactant11.str()+"-1)/2");
						else
							std::cerr << "StochKit ERROR (Input_events_before_compile::writeCustomPropensityFunctionsFile): reactant's stoichiometry isn't -1 or -2 in mass-action reaction " + cur_reaction->Id + "\n";
						}
						break; 
					case 2:
						{
						std::ostringstream reactant21, reactant22;
						reactant21 << "x[" << cur_reaction->Reactants[0].Index << "]";
						reactant22 << "x[" << cur_reaction->Reactants[1].Index << "]";
						customPropensityFunction.append("*"+reactant21.str()+"*"+reactant22.str());
						}
						break;
					default:
						std::cerr << "StochKit ERROR (Input_events_before_compile::writeCustomPropensityFunctionsFile): more than 2 reactants in mass-action reaction " + cur_reaction->Id<<std::endl;
						exit(1);
				}
			}

			if(customPropensityFunction.empty()){
				std::cerr << "StochKit ERROR (Input_events_before_compile::writeCustomPropensityFunctionsFile): while parsing the custom propensity function of reaction " + cur_reaction->Id<<std::endl;
				customPropensityFile.close();
				exit(1);
			}

			customPropensityFile << "template<typename _populationVectorType>\n";
			customPropensityFile << "double f" << customPropensityList[i] << "(_populationVectorType& x, ListOfParameters& ParametersList) {\n";
			customPropensityFile << "    return (double)(" << customPropensityFunction << ");\n";
			customPropensityFile << "}\n\n";
			customPropensityFile.flush();
		}
		customPropensityFile << "template<typename _populationVectorType>\n";
		customPropensityFile << "class CustomPropensityFunctions\n" ;
		customPropensityFile << "{\n" ;
		customPropensityFile << "public:\n";
		customPropensityFile << "    static const int NumberOfReactions = " << this->NumberOfReactions  << ";\n";
		customPropensityFile << "    typedef double (*PropensityMember)(_populationVectorType&, ListOfParameters&);\n";
		customPropensityFile << "    std::vector<PropensityMember> propensityFunctions;\n\n";
		customPropensityFile << "    //constructor\n";
		customPropensityFile << "    CustomPropensityFunctions()\n";
		customPropensityFile << "    {\n";
		customPropensityFile << "        propensityFunctions.resize(NumberOfReactions);\n";
		for(unsigned int i = 0; i < customPropensityList.size(); ++i){
			customPropensityFile << "        propensityFunctions[" << customPropensityList[i]  << "] = &f" << customPropensityList[i] << "<_populationVectorType>;\n" ;
		}
		customPropensityFile << "    }\n\n";
		customPropensityFile << "};\n}\n";
		customPropensityFile << "#endif\n";
		customPropensityFile.flush();

		customPropensityFile.close();
		
		return true;
	}

	bool writeCustomStateBasedTriggerFunctionsFile(char *CustomStateBasedTriggerFunctionsFileName)
	{
		std::ofstream customStateBasedTriggerFile;
		customStateBasedTriggerFile.open(CustomStateBasedTriggerFunctionsFileName);
		customStateBasedTriggerFile << "#ifndef _CUSTOM_STATE_BASED_TRIGGER_FUNCTIONS_H_\n";
		customStateBasedTriggerFile << "#define _CUSTOM_STATE_BASED_TRIGGER_FUNCTIONS_H_\n\n";
		customStateBasedTriggerFile << "#include <iostream>\n";
		customStateBasedTriggerFile << "#include <vector>\n";
		customStateBasedTriggerFile << "#include <math.h>\n";
		customStateBasedTriggerFile << "#include <algorithm>\n";
		customStateBasedTriggerFile << "using namespace std;\n";
		customStateBasedTriggerFile << "#include \"boost/function.hpp\"\n";
		customStateBasedTriggerFile << "#include \"Parameter.h\"\n\n";
		customStateBasedTriggerFile << "namespace STOCHKIT\n{\n";
		customStateBasedTriggerFile.flush();

		std::vector<int> customStateBasedTriggerList;
		
		typename Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>::Event *cur_event;
		
		for(int i=0; i<this->NumberOfEvents; ++i){
			cur_event = &this->EventsList[i];
			if(cur_event->Type == 1 || cur_event->Type == 2 ){
				customStateBasedTriggerList.push_back(i);
			}
		}

		for(unsigned int i = 0; i < customStateBasedTriggerList.size(); ++i){
			cur_event = &this->EventsList[customStateBasedTriggerList[i]];
			std::string customTriggerFunction = customPropensitySubstitution(cur_event->Trigger);

			if(customTriggerFunction.empty()){
				std::cerr << "StochKit ERROR (Input_events_before_compile::writeCustomStateBasedTriggerFunctionsFile): while parsing the trigger function of event " + cur_event->Id<<std::endl;
				customStateBasedTriggerFile.close();
				exit(1);
			}

			customStateBasedTriggerFile << "template<typename _populationVectorType>\n";
			customStateBasedTriggerFile << "bool _customStateTrigger" << customStateBasedTriggerList[i] << "(double t, _populationVectorType& x, ListOfParameters& ParametersList) {\n";
			customStateBasedTriggerFile << "    return (" << customTriggerFunction << ");\n";
			customStateBasedTriggerFile << "}\n\n";
			customStateBasedTriggerFile.flush();
		}

		customStateBasedTriggerFile << "template<typename _populationVectorType>\n" ;
		customStateBasedTriggerFile << "class CustomStateBasedTriggerFunctions\n" ;
		customStateBasedTriggerFile << "{\n" ;
		customStateBasedTriggerFile << "public:\n";
		customStateBasedTriggerFile << "    static const int NumberOfEvents = " << this->NumberOfEvents  << ";\n";
		customStateBasedTriggerFile << "    typedef boost::function<bool (double, _populationVectorType&, ListOfParameters&)> TriggerMember;\n";
//		customStateBasedTriggerFile << "    typedef bool (*TriggerMember)(double, _populationVectorType&);\n";
		customStateBasedTriggerFile << "    std::vector<TriggerMember> triggerFunctions;\n\n";
		customStateBasedTriggerFile << "    //constructor\n";
		customStateBasedTriggerFile << "    CustomStateBasedTriggerFunctions() {\n";
		customStateBasedTriggerFile << "        triggerFunctions.resize(NumberOfEvents);\n";
		for(unsigned int i = 0; i < customStateBasedTriggerList.size(); ++i){
			customStateBasedTriggerFile << "        triggerFunctions[" << customStateBasedTriggerList[i]  << "] = &_customStateTrigger" << customStateBasedTriggerList[i] << "<_populationVectorType>;\n" ;
		}
		customStateBasedTriggerFile << "    }\n\n";
		customStateBasedTriggerFile.flush();

		customStateBasedTriggerFile << "};\n}\n";
		customStateBasedTriggerFile << "#endif\n";
		customStateBasedTriggerFile.flush();

		customStateBasedTriggerFile.close();
		
		return true;
	}

	bool writeCustomChangeSingleSpeciesFunctionsFile(char *CustomChangeSingleSpeciesFunctionsFileName)
	{
		std::ofstream customChangeSingleSpeciesFile;
		customChangeSingleSpeciesFile.open(CustomChangeSingleSpeciesFunctionsFileName);
		customChangeSingleSpeciesFile << "#ifndef _CUSTOM_CHANGE_SINGLE_SPECIES_FUNCTIONS_H_\n";
		customChangeSingleSpeciesFile << "#define _CUSTOM_CHANGE_SINGLE_SPECIES_FUNCTIONS_H_\n\n";
		customChangeSingleSpeciesFile << "#include <iostream>\n";
		customChangeSingleSpeciesFile << "#include <vector>\n";
		customChangeSingleSpeciesFile << "#include <math.h>\n";
		customChangeSingleSpeciesFile << "#include \"Parameter.h\"\n\n";
		customChangeSingleSpeciesFile << "namespace STOCHKIT\n{\n";
		customChangeSingleSpeciesFile.flush();

		typename Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>::Event *cur_event;

		unsigned int k = 0; // mark the k-th change single species action in an event

		for(int i=0; i<this->NumberOfEvents; ++i){
			cur_event = &this->EventsList[i];
			k = 0;
			for(unsigned int j=0; j<cur_event->ActionsList.size(); ++j){
				if(cur_event->ActionsList[j].Type == 1){
					std::string customChangeSingleSpeciesFunction = customPropensitySubstitution(cur_event->ActionsList[j].Expression);
			
					if(customChangeSingleSpeciesFunction.empty()){
						std::cerr << "StochKit ERROR (Input_events_before_compile::writeCustomChangeSingleSpeciesFunctionsFile): while parsing the custom Change Single Species function of an action in event " + cur_event->Id<<std::endl;
						customChangeSingleSpeciesFile.close();
						exit(1);
					}

					customChangeSingleSpeciesFile << "template<typename _populationValueType,\n";
					customChangeSingleSpeciesFile << "        typename _populationVectorType>\n";
					customChangeSingleSpeciesFile << "_populationValueType f" << i << k << "(double t, _populationVectorType& x) {\n";
					customChangeSingleSpeciesFile << "    return floor(" << customChangeSingleSpeciesFunction << " + 0.5 );\n";
					customChangeSingleSpeciesFile << "}\n\n";
					customChangeSingleSpeciesFile.flush();
					++k;
				}
			}
		}

		customChangeSingleSpeciesFile << "template<typename _populationValueType,\n" ;
		customChangeSingleSpeciesFile << "        typename _populationVectorType>\n" ;
		customChangeSingleSpeciesFile << "class CustomChangeSingleSpeciesFunctions\n" ;
		customChangeSingleSpeciesFile << "{\n" ;
		customChangeSingleSpeciesFile << "public:\n";
		customChangeSingleSpeciesFile << "    static const int NumberOfEvents = " << this->NumberOfEvents  << ";\n";
		customChangeSingleSpeciesFile << "    typedef _populationValueType (*ActionMember)(double, _populationVectorType&);\n";
		customChangeSingleSpeciesFile << "    typedef std::vector<ActionMember> ActionsInOneEvent;\n";
		customChangeSingleSpeciesFile << "    std::vector<ActionsInOneEvent> actionsInEvents;\n\n";
		customChangeSingleSpeciesFile << "    // constructor\n";
		customChangeSingleSpeciesFile << "    CustomChangeSingleSpeciesFunctions() {\n";
		customChangeSingleSpeciesFile << "        actionsInEvents.resize(NumberOfEvents);\n";
		for(int i=0; i<this->NumberOfEvents; ++i){
			cur_event = &this->EventsList[i];
			k = 0;
			for(unsigned int j=0; j<cur_event->ActionsList.size(); ++j){
				if(cur_event->ActionsList[j].Type == 1){
					customChangeSingleSpeciesFile << "        actionsInEvents[" << i <<"].push_back(&f" << i << k << "<_populationValueType, _populationVectorType>);\n";
					++k;
				}
			}
		}
		customChangeSingleSpeciesFile << "    }\n\n";
		customChangeSingleSpeciesFile.flush();

		customChangeSingleSpeciesFile << "};\n}\n";
		customChangeSingleSpeciesFile << "#endif\n";
		customChangeSingleSpeciesFile.flush(); 
		customChangeSingleSpeciesFile.close();
		
		return true;
	}
 };
}

#endif

