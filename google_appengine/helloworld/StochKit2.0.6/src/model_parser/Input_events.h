/*!
	\brief Text file input handler with events

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
//read file
//parse by libxml2
//some check
//write data structure
//write to a file if need compile
//compile
*/

#ifndef _INPUT_EVENTS_H_
#define _INPUT_EVENTS_H_

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
#include "Parameter.h"
#include "VectorManipulation.h"
#include "StringCalculator.h"

namespace STOCHKIT
{
 template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
 class Input_events
 {
 protected:
	typedef typename _populationVectorType::value_type _populationValueType;

	bool WhiteSpaceinId;

	int NumberOfReactions, NumberOfSpecies;

	int NumberOfParameters;

	ListOfParameters ParametersList;

	int NumberOfEvents;

	//! class to store species and related information
	class Species{
		public:
			std::string Id; // Id of the species
			std::string InitialPopulation;  // initial population, only valid in SpeciesList
			std::vector<int> AffectReactions; // only valid in SpeciesList, record what reactions does one Species affect
	};
	std::vector<Species> SpeciesList;

	class SpeciesReference{
		public:
			std::string Id;
			int Index; // this species is SpeciesList[Index]
			int Stoichiometry; // used in Reactions
	};
	
	//! class to store reactions and related information
	class Reaction{
		public:
			std::string Id;  // Id of the reaction
			int Type; // type of the reaction, 0 = mass-action, 1 = michaelis-menten, 2 = customized, 3 = mass-action with changeable parameters
			std::string Rate; // for mass-action
			std::string Vmax;  // for michealis-menten
			std::string Km;  // for michealis-menten
			std::string Customized; // for customized propensity
			std::vector<SpeciesReference> Reactants;  // reactant list
			std::vector<SpeciesReference> Products;  // product list
	};
	std::vector<Reaction> ReactionsList;

	//! class to store action information in events
	class Action{
		public:
			int Type; // type of the action, 0 = ChangeSpeciesPopulation - simple, 1 = ChangeSpeciesPopulation - custom, 2 = ChangeParameter-Value, 3 = ChangeParameter-Expression
			std::string Id; // Id of the species or parameter in this action
			int Index; // it's SpeciesList[Index] or ParametersList[Index] depending on the Type of the action
			std::string Expression;
	};

	//! class to store events information
	class Event{
		public:
			std::string Id; // Id of the event
			int Type; // type of the event, 0 = time-based, 1 = state-based disallow multiple firings(default), 2 = state-based allow multiple firings
			std::string Trigger; // trigger expression, a double for time-based, a math expression for state-based
			std::vector<Action> ActionsList; // actions list
	};
	std::vector<Event> EventsList;

	//! class to handle calculation of simple math expression strings
	StringCalculator simpleCalculator;

 public:

	Input_events(char *xmlFilename):
		simpleCalculator()
	{
		NumberOfReactions = 0;
		NumberOfSpecies = 0;
		NumberOfParameters = 0;
		NumberOfEvents = 0;
		WhiteSpaceinId = false;
		SpeciesList.clear();
		ReactionsList.clear();
		EventsList.clear();
		
		if(!parseXmlFile(xmlFilename)){
			exit(1);
		}

		if(!ParametersList.linkParameters()){
			exit(1);
		}

		if(!ParametersList.calculateParameters()){
			exit(1);
		}

		if(!linkActionsWithSpeciesOrParameters()){
			exit(1);
		}

		if(!linkParametersAndReactions()){
			exit(1);
		}

		if(!linkSpeciesAndReactions()){
			exit(1);
		}

		if(!checkUniqueID()){
			exit(1);
		}

#ifdef DEBUG
		std::cout << "Parameters:\n";
		for(std::size_t i=0; i<ParametersList.size(); ++i){
			std::cout << ParametersList[i].Id << ": Type=" << ParametersList[i].Type << " Expression=" << ParametersList[i].Expression << " Value:" << ParametersList[i].Value << std::endl;
			std::cout << "AffectParameters: ";
			for(std::size_t j=0; j<ParametersList[i].AffectParameters.size(); ++j){
				std::cout << ParametersList[i].AffectParameters[j] << " ";
			}
			std::cout << std::endl;
			std::cout << "ParametersAffectThis: ";
			for(std::size_t j=0; j<ParametersList[i].ParametersAffectThis.size(); ++j){
				std::cout << ParametersList[i].ParametersAffectThis[j] << " ";
			}
			std::cout << std::endl;
			std::cout << "AffectReactions: ";
			for(std::size_t j=0; j<ParametersList[i].AffectReactions.size(); ++j){
				std::cout << ParametersList[i].AffectReactions[j] << " ";
			}
			std::cout << std::endl;
		}
		std::cout << std::endl;

		std::cout << "Reactions:\n";
		for(std::size_t i=0; i<ReactionsList.size(); ++i){
			std::cout << ReactionsList[i].Id << ": Type=" << ReactionsList[i].Type << " Expression=" << ReactionsList[i].Rate << ReactionsList[i].Customized << std::endl;
		}
		std::cout << std::endl;
#endif
	}

 protected:
	bool parseXmlFile(char *xmlFilename);

	bool recordNumberOfReactions(xmlNodePtr cur);

	bool recordNumberOfSpecies(xmlNodePtr cur);

	bool recordParametersList(xmlNodePtr cur);

	bool recordReactionsList(xmlNodePtr cur);

	bool recordSpeciesList(xmlNodePtr cur);

	bool recordEventsList(xmlNodePtr cur);

	bool linkParametersAndReactions();

	// record species reference order of reactants and products in reactions, meanwhile write affect reactions in species list
	bool linkSpeciesAndReactions();

	// record species reference order and parameter reference order in actions, and mark parameters which are changeable during simulation
	bool linkActionsWithSpeciesOrParameters();

	_populationValueType populationCalculation(std::string equation);

	//! check to see if all IDs are unique, return true if they are, return false if there are duplicate IDs
	bool checkUniqueID();

 public:
	_populationVectorType writeInitialPopulation();

	_stoichiometryType writeStoichiometry();
	
	_dependencyGraphType writeDependencyGraph();

 }; // end of Input_events class
}

#define _INPUT_EVENTS_IPP_
#include "Input_events.ipp"
#undef _INPUT_EVENTS_IPP_

#endif

