#ifndef _CONVERT_XML_TO_MODEL_H_
#define _CONVERT_XML_TO_MODEL_H_

#include <iostream>
#include <vector>
#include "Reactant.h"
#include "Reactants.h"
#include "ElementaryReaction.h"
#include "StandardDriverTypes.h"
#include "Input_mass_action.h"
#include <string>

//std::vector<ElementaryReaction<boost::numeric::ublas::mapped_vector<double>, boost::numeric::ublas::vector<double> > > convertXML(std::string modelFile);
std::vector<ElementaryReaction> convertXML(std::string modelFile);

#endif