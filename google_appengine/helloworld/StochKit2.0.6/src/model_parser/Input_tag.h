/*!
	\brief Input text file tag marker

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
*/

#ifndef _INPUT_TAG_H_
#define _INPUT_TAG_H_

#include <iostream>
#include <sstream>
#include <algorithm>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <libxml/xmlmemory.h>
#include <libxml/parser.h>
#include <vector>
#include <limits>

namespace STOCHKIT
{
 template<typename _modelTagType>
 class Input_tag
 {
 protected:
	int NumberOfReactions, NumberOfSpecies;
	int NumberOfParameters, NumberOfEvents;

	bool mass_action_flag, event_flag;

	std::vector<std::string> ReactionsList;
	std::vector<std::string> SpeciesList;
	std::vector<std::string> EventsList;
	std::vector<std::string> ParametersList;

 public:

	Input_tag(char *xmlFilename)
	{
		NumberOfReactions = 0;
		NumberOfSpecies = 0;
		NumberOfParameters = 0;
		NumberOfEvents = 0;
		mass_action_flag = true;
		event_flag = false;
		
		if(!parseXmlFile(xmlFilename)){
			exit(1);
		}
	}

 protected:
	bool parseXmlFile(char *xmlFilename);

	bool recordNumberOfReactions(xmlNodePtr cur);

	bool recordNumberOfSpecies(xmlNodePtr cur);

	bool recordParametersList(xmlNodePtr cur);

	bool recordReactionsList(xmlNodePtr cur);

	bool recordSpeciesList(xmlNodePtr cur);

	bool recordEventsList(xmlNodePtr cur);

 public:
	_modelTagType writeModelTag();

 }; // end of Input_tag class
}

#define _INPUT_TAG_IPP_
#include "Input_tag.ipp"
#undef _INPUT_TAG_IPP_

#endif

