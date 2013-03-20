/*!
	\brief Text file input handler for pure mass action reactions list

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
*/

#ifndef _INPUT_MASS_ACTION_H_
#define _INPUT_MASS_ACTION_H_

#include "Input.h"

namespace STOCHKIT
{
 template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
 class Input_mass_action : 
	public Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>
 {
 public:
	Input_mass_action(char *xmlFilename) :
                Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>(xmlFilename)
	{
	}

	Input_mass_action(char *xmlFilename,
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
					std::cerr << "StochKit ERROR (Input_mass_action::rateCalculation): while calculating rate " << equation << std::endl;
					return BADRESULT;
				}
			}
		}
		
		std::string substitutedEquation = this->ParametersList.parameterSubstitution(equation);
		if( substitutedEquation.empty() ){
			std::cerr << "StochKit ERROR (Input_mass_action::rateCalculation): while calculating rate " << equation << std::endl;
			return BADRESULT;
		}
		
		return this->simpleCalculator.calculateString(substitutedEquation);
	}

 public:
	_propensitiesFunctorType writePropensities()
	{
		_propensitiesFunctorType propensitiesList;
		double rate;
		
		typename Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>::Reaction *cur_reaction;
		std::vector<int> reactantsList;

		for(int i=0; i<this->NumberOfReactions; ++i){
			cur_reaction = &this->ReactionsList[i];

			if(cur_reaction->Type == 0){
				rate = rateCalculation(cur_reaction->Rate);
				if( rate == BADRESULT ){
					std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): while calculating rate of reaction " << cur_reaction->Id << "\n";
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
							std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						break;
					case 2:
						if( cur_reaction->Reactants[0].Stoichiometry == -1 ){
						       if (cur_reaction->Reactants[1].Stoichiometry == -1)
							       propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index);
						       else if (cur_reaction->Reactants[1].Stoichiometry == -2)
							       propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index, cur_reaction->Reactants[1].Index);
						       else{
							       std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							       exit(1);
						       }
						}
						else if(cur_reaction->Reactants[0].Stoichiometry == -2){
							if (cur_reaction->Reactants[1].Stoichiometry == -1)
								propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index);
							else{
								std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
								exit(1);
							}
						}
						else{
							std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						break;
					case 3:
						if( cur_reaction->Reactants[0].Stoichiometry != -1 || cur_reaction->Reactants[1].Stoichiometry != -1 || cur_reaction->Reactants[2].Stoichiometry != -1 ){
							std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						else
							propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index, cur_reaction->Reactants[2].Index);
						
						break;
					default:
						std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): more than 3 reactants in mass-action reaction " << cur_reaction->Id << "\n";
						exit(1);
				}
			}
			else{
			          std::cerr << "StochKit ERROR (Input_mass_action::writePropensities): reaction " << cur_reaction->Id << " is not a mass-action reaction\n";
				  exit(1);
			}
		}

		return propensitiesList;
	}

 };
}

#endif

