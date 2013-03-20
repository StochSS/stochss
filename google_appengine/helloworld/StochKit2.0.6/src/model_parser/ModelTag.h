/*!
	\brief Tag class for input models, indicate what kind of model it is
*/

#ifndef _MODEL_TAG_H_
#define _MODEL_TAG_H_

#include <iostream>
#include <vector>
#include <string>

namespace STOCHKIT
{
 class ModelTag
 {
 public:
	enum ModelType {mass_action, mixed, events_enabled};
	ModelType Type;
	int NumberOfReactions;
	int NumberOfSpecies;
	std::vector<std::string> SpeciesList;
 };
}

#endif

