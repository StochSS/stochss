/*!
	\brief Text file input handler

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
*/

#ifndef _INPUT_EVENTS_AFTER_COMPILE_H_
#define _INPUT_EVENTS_AFTER_COMPILE_H_

#ifndef _CUSTOM_PROPENSITY_FUNCTIONS_H_
#include "CustomPropensityFunctions.h"
#endif

#ifndef _CUSTOM_CHANGE_SINGLE_SPECIES_FUNCTIONS_H_
#include "CustomChangeSingleSpeciesFunctions.h"
#endif

#ifndef _CUSTOM_STATE_BASED_TRIGGER_FUNCTIONS_H_
#include "CustomStateBasedTriggerFunctions.h"
#endif

#include "Input_events.h"
#include "CustomPropensity_Events.h"
#include "CustomSimplePropensity_Events.h"
#include "CustomPropensitySet_Events.h"
#include "TimeBasedTrigger.h"
#include "CustomStateBasedTrigger.h"
#include "ChangeSingleSpeciesEventAction.h"
#include "ChangeParameterEventAction.h"
#include "FixedValueActionFunction.h"
#include "ExpressionActionFunction.h"
#include "StateBasedTriggerEvent.h"
#include "StandardEventHandler.h"
#include "SSA_Direct_Events.h"

namespace STOCHKIT
{
 template<typename _populationVectorType,
        typename _stoichiometryType,
 	typename _propensitiesFunctorType,
 	typename _dependencyGraphType,
	typename _eventsType,
	typename _solverType>
 class Input_events_after_compile :
	public Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>
 {
 public:
        Input_events_after_compile(char *xmlFilename) : 
		Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>(xmlFilename)
	{
	}
	
	Input_events_after_compile(char *xmlFilename,
			_populationVectorType& initialPop,
			_stoichiometryType& stoich,
			_propensitiesFunctorType& propensitiesFunctor,
			_dependencyGraphType& depGraph,
			_eventsType& eventsHandler,
			_solverType& solver):
		Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>(xmlFilename)
	{
		initialPop = this->writeInitialPopulation();
		stoich = this->writeStoichiometry();
		propensitiesFunctor = this->writePropensities();
		depGraph = this->writeDependencyGraph();
		
		_solverType temp_solver(initialPop, stoich, propensitiesFunctor, depGraph);
		solver = temp_solver;

		eventsHandler = this->writeEvents(solver);
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
					std::cerr << "StochKit ERROR (Input_events_after_compile::rateCalculation): while calculating rate " << equation << std::endl;
					return BADRESULT;
				}
			}
		}
		
		std::string substitutedEquation = this->ParametersList.parameterSubstitution(equation);
		if( substitutedEquation.empty() ){
			std::cerr << "StochKit ERROR (Input_events_after_compile::rateCalculation): while calculating rate " << equation << std::endl;
			return BADRESULT;
		}
		
		return this->simpleCalculator.calculateString(substitutedEquation);
	}

 public:
	_propensitiesFunctorType writePropensities()
	{
		_propensitiesFunctorType propensitiesList(this->ParametersList.ParametersList);

#ifdef _CUSTOM_PROPENSITY_FUNCTIONS_H_
		CustomPropensityFunctions<_populationVectorType> customPropensityFuncs;
#else
		std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): _CUSTOM_PROPENSITY_FUNCTIONS_H_ not #defined.\n";
		exit(1);
#endif
		
		double rate;
		
		typename Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>::Reaction *cur_reaction;

		for(int i=0; i<this->NumberOfReactions; ++i){
			cur_reaction = &this->ReactionsList[i];

			if(cur_reaction->Type == 0){
				rate =  rateCalculation(cur_reaction->Rate);
				if( rate == BADRESULT ){
					std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): while calculating rate of reaction " << cur_reaction->Id<<std::endl;
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
							std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
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
							       std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							       exit(1);
						       }
						}
						else if(cur_reaction->Reactants[0].Stoichiometry == -2){
							if (cur_reaction->Reactants[1].Stoichiometry == -1){
								propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index);
							}
							else{
								std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
								exit(1);
							}
						}
						else{
							std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						break;
					case 3:
						if( cur_reaction->Reactants[0].Stoichiometry != -1 || cur_reaction->Reactants[1].Stoichiometry != -1 || cur_reaction->Reactants[2].Stoichiometry != -1 ){
							std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): currently the highest order mass-action reaction supported is tri-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
							exit(1);
						}
						else{
							propensitiesList.pushSimplePropensity(rate, cur_reaction->Reactants[0].Index, cur_reaction->Reactants[1].Index, cur_reaction->Reactants[2].Index);
						}
						break;
					default:
						std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): more than 3 reactants in mass-action reaction " << cur_reaction->Id << "\n";
						exit(1);
				}
			}
			else if(cur_reaction->Type == 1){
				std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): Michelis-menten not implemented yet at reaction " << cur_reaction->Id<<std::endl;
				exit(1);
			}
			else if(cur_reaction->Type == 2 || cur_reaction->Type == 3){
#ifdef _CUSTOM_PROPENSITY_FUNCTIONS_H_
				propensitiesList.pushCustomPropensity(customPropensityFuncs.propensityFunctions[i]);
#else
				std::cerr << "StochKit ERROR (Input_events_after_compile::writePropensities): How could you possibly get here?\n";
				exit(1);
#endif
			}
			else{
				std::cerr<<"StochKit ERROR (Input_events_after_compile::writePropensities): Unrecogonized reaction type of reaction " << cur_reaction->Id<<std::endl;
				exit(1);
			}
		}

		return propensitiesList;
	}

	_eventsType writeEvents(_solverType& solver)
	{
		_eventsType eventsHandler;

		typename Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>::Event *cur_event;
		typename Input_events<_populationVectorType, _stoichiometryType, _dependencyGraphType>::Action *cur_action;
      		typedef boost::function<void (double, _populationVectorType&)> EventAction;
		typedef typename _populationVectorType::value_type _populationValueType;

#ifdef _CUSTOM_CHANGE_SINGLE_SPECIES_FUNCTIONS_H_
//		typedef _populationValueType (CustomChangeSingleSpeciesFunctions<_populationValueType, _populationVectorType>::* customActionFunction)(double, _populationVectorType&);
		typedef double (*customActionFunction)(double, _populationVectorType&);
		CustomChangeSingleSpeciesFunctions<_populationValueType, _populationVectorType> CustomChangeSingleSpeciesFuncs;
#endif

#ifdef _CUSTOM_STATE_BASED_TRIGGER_FUNCTIONS_H_
		CustomStateBasedTriggerFunctions<_populationVectorType> CustomStateBasedTriggerFuncs;
#endif

		for(int i=0; i<this->NumberOfEvents; ++i)
		{
			cur_event = &this->EventsList[i];
			unsigned int customSinglePopulationActionCount = 0;

			// record actions
			std::vector<EventAction> Actions;
			for(unsigned int j=0; j < cur_event->ActionsList.size(); ++j){
				cur_action = &(cur_event->ActionsList[j]);

				if(cur_action->Type == 0){ // ChangeSingleSpeciesPopulation - simple
					double populationValue = this->simpleCalculator.calculateString(cur_action->Expression);
					if(populationValue == BADRESULT){
						std::cerr << "StochKit ERROR (Input_events_after_compile::writeEvents): while calculating population value in an action of event " << cur_event->Id<<std::endl;
						exit(1);
					}
					//action sets species[Index] to value of populationValue
					FixedValueActionFunction<_populationVectorType> valFunc(populationValue);
					ChangeSingleSpeciesEventAction<_solverType,FixedValueActionFunction<_populationVectorType> > action(cur_action->Index,valFunc,solver);
					Actions.push_back(action);
				} else if (cur_action->Type == 1){ // ChangeSingleSpeciesPopulation - custom
#ifdef _CUSTOM_CHANGE_SINGLE_SPECIES_FUNCTIONS_H_
					if( customSinglePopulationActionCount >= CustomChangeSingleSpeciesFuncs.actionsInEvents[i].size() ){
						std::cerr << "StochKit ERROR (Input_events_after_compile::writeEvents): CustomChangeSingleSpeciesPopulation actions of event " << cur_event->Id << " in recorded file and xml file do not comform with each other" << std::endl;
						exit(1);
					}
					//action sets species[Index] population to a custom value
					ChangeSingleSpeciesEventAction<_solverType,customActionFunction> action(cur_action->Index,CustomChangeSingleSpeciesFuncs.actionsInEvents[i][customSinglePopulationActionCount], solver);
					Actions.push_back(action);
					++customSinglePopulationActionCount;
#else
					std::cerr << "StochKit ERROR (Input_mixed_after_compile::writePropensities): How could you possibly get here?\n";
					exit(1);
#endif
				} else if (cur_action->Type == 2){ // ChangeParameter-value
      					//create an action that sets parameter[Index] to value of an expression
				      	ChangeParameterEventAction<_solverType, ExpressionActionFunction<_populationVectorType> > action(cur_action->Index, cur_action->Expression, solver, true);
					Actions.push_back(action);
				} else if (cur_action->Type == 3){ // ChangeParameter-expression
      					//create an action that sets parameter[Index] to an expression
				      	ChangeParameterEventAction<_solverType, ExpressionActionFunction<_populationVectorType> > action(cur_action->Index, cur_action->Expression, solver, false);
					Actions.push_back(action);
				} else { // error message: unrecognized trigger type
					std::cerr<<"StochKit ERROR (Input_events_after_compile::writeEvents): Unrecogonized action type in event " << cur_event->Id<<std::endl;
#ifdef DEBUG
					std::cerr<<"action type: " << cur_action->Type << std::endl;
#endif
					exit(1);
				}
			}
		
			// record trigger and events
			if(cur_event->Type == 0){  // time-based trigger
				double triggerTime = this->simpleCalculator.calculateString(cur_event->Trigger);
				if(triggerTime == BADRESULT){
					std::cerr << "StochKit ERROR (Input_events_after_compile::writeEvents): while calculating time-based trigger value of event " << cur_event->Id<<std::endl;
					exit(1);
				}
      				TimeBasedTrigger timeTrigger(triggerTime);
				eventsHandler.insertTimeEvent(new TimeBasedTriggerEvent<_populationVectorType>(timeTrigger, Actions));
			} else if (cur_event->Type == 1){  // state-based trigger disallow multiple firings (default)
			      	CustomStateBasedTrigger<_populationVectorType> stateTrigger(CustomStateBasedTriggerFuncs.triggerFunctions[i], solver.referenceToParametersList(), false);
				eventsHandler.insertStateEvent(new StateBasedTriggerEvent<_populationVectorType>(stateTrigger, Actions));
			} else if (cur_event->Type == 2){  // state-based trigger allow multiple firings
			      	CustomStateBasedTrigger<_populationVectorType> stateTrigger(CustomStateBasedTriggerFuncs.triggerFunctions[i], solver.referenceToParametersList(), true);
				eventsHandler.insertStateEvent(new StateBasedTriggerEvent<_populationVectorType>(stateTrigger, Actions));
			} else { // error message: unrecognized trigger type
				std::cerr<<"StochKit ERROR (Input_events_after_compile::writeEvents): Unrecogonized trigger type of event " << cur_event->Id<<std::endl;
				exit(1);
			}
		}

		return eventsHandler;
	}


 };

}

#endif

