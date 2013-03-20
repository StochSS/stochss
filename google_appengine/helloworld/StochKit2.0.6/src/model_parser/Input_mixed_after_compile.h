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

#ifndef _INPUT_MIXED_AFTER_COMPILE_H_
#define _INPUT_MIXED_AFTER_COMPILE_H_

#include "Input.h"

#ifndef _CUSTOM_PROPENSITY_FUNCTIONS_H_
#include "CustomPropensityFunctions.h"
#endif

namespace STOCHKIT{
 template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
 class Input_mixed_after_compile :
	public Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>
 {
 public:
        Input_mixed_after_compile(char *xmlFilename) : 
		Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>(xmlFilename)
	{
	}
	
	Input_mixed_after_compile(char *xmlFilename,
			_populationVectorType& initialPop,
			_stoichiometryType& stoich,
			_propensitiesFunctorType& propensitiesFunctor,
			_dependencyGraphType& depGraph) :
		Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>(xmlFilename)
	{
		initialPop = this->writeInitialPopulation();
		stoich = this->writeStoichiometry();
		propensitiesFunctor = this->writePropensities();
		depGraph = this->writeDependencyGraph();
	}

 protected:
	// calculate rate based on the value stored in parameterslist
	double rateCalculation(std::string equation)
	{
		std::vector<unsigned int> ParametersAffectRate;
		std::vector<unsigned int>::iterator para_it; // iterator of parameters in link graph

		ParametersAffectRate = this->ParametersList.analyzeParameterExpression(equation);

		bool calculationStatus = false;

		for( para_it = ParametersAffectRate.begin(); para_it < ParametersAffectRate.end(); ++para_it ){
			if( this->ParametersList[*para_it].CalculateFlag == -1 ){
				calculationStatus = this->ParametersList.calculateParameter(*para_it);
				if(!calculationStatus){                   
					std::cerr << "StochKit ERROR (Input_mixed_after_compile::rateCalculation): while calculating rate " << equation << std::endl;
					return BADRESULT;
				}
			}
		}
		
		std::string substitutedEquation = this->ParametersList.parameterSubstitution(equation);
		if( substitutedEquation.empty() ){
			std::cerr << "StochKit ERROR (Input_mixed_after_compile::rateCalculation): while calculating rate " << equation << std::endl;
			return BADRESULT;
		}
		
		return this->simpleCalculator.calculateString(substitutedEquation);
	}

 public:
	_propensitiesFunctorType writePropensities()
	{
		_propensitiesFunctorType propensitiesList;
#ifdef _CUSTOM_PROPENSITY_FUNCTIONS_H_
      		CustomPropensityFunctions<_populationVectorType> CustomPropFuncs;
#endif
		double rate;
		
		typename Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>::Reaction *cur_reaction;

		for(int i=0; i<this->NumberOfReactions; ++i){
			cur_reaction = &this->ReactionsList[i];

			if(cur_reaction->Type == 0){
				rate =  rateCalculation(cur_reaction->Rate);
				if( rate == BADRESULT ){
					std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): while calculating rate of reaction " << cur_reaction->Id<<std::endl;
					exit(1);
				}
				switch ( cur_reaction->Reactants.size() ){
					case 0:
						propensitiesList.pushSimplePropensity(rate);
						break;
					case 1:
						if( cur_reaction->Reactants[0].Stoichiometry == -1 )
							propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index);
						else if( cur_reaction->Reactants[0].Stoichiometry == -2 )
							propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[0].Index);
						else if( cur_reaction->Reactants[0].Stoichiometry == -3 )
							propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[0].Index);
						else{
							std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						break;
					case 2:
						if( cur_reaction->Reactants[0].Stoichiometry == -1 ){
						       if (cur_reaction->Reactants[1].Stoichiometry == -1){
							       propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index);
						       }
						       else if (cur_reaction->Reactants[1].Stoichiometry == -2){
							       propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index, cur_reaction->Reactants[1].Index);
						       }
						       else{
							       std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							       exit(1);
						       }
						}
						else if(cur_reaction->Reactants[0].Stoichiometry == -2){
							if (cur_reaction->Reactants[1].Stoichiometry == -1){
								propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index);
							}
							else{
								std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
								exit(1);
							}
						}
						else{
							std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						break;
					case 3:
						if( cur_reaction->Reactants[0].Stoichiometry != -1 || cur_reaction->Reactants[1].Stoichiometry != -1 || cur_reaction->Reactants[2].Stoichiometry != -1 ){
							std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						else{
							propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index, cur_reaction->Reactants[2].Index);
						}
						break;
					default:
						std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): more than 3 reactants in mass-action reaction " << cur_reaction->Id << "\n";
						exit(1);
				}
			}
			else if(cur_reaction->Type == 1){
				std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): Michelis-menten not implemented yet at reaction " << cur_reaction->Id<<std::endl;
			}
			else if(cur_reaction->Type == 2){
#ifdef _CUSTOM_PROPENSITY_FUNCTIONS_H_
				propensitiesList.pushCustomPropensity(CustomPropFuncs.propensityFunctions[i]);
#else
				std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): How could you possibly get here?\n" << std::endl;
				exit(1);
#endif
			}
			else{
				std::cerr<<"StochKit ERROR (Input_mixed_after_compile::writePropensities): Unrecogonized reaction type of reaction " << cur_reaction->Id<<std::endl;
				exit(1);
			}
		}

		return propensitiesList;
	}

 };
}

#endif

