//"LEVEL" 0 HAS A DIFFERENT FORMAT FROM THE REST OF THE LEVELS
//LEVEL0 CONTAINS EXACTLY ONE "ALTERNATE STOICHIOMETRY" SINCE LEVEL 0 IS JUST FIRING REACTION I
//HIGHER LEVELS ARE ORGANIZED BY...

#ifndef _ALTERNATE_STOICHIOMETRIES_H_
#define _ALTERNATE_STOICHIOMETRIES_H_

#include "StandardDriverTypes.h"	
#include "ElementaryReaction.h"
#include "AlternateStoichiometry.h"
#include <algorithm>
#include <utility>
#include "boost/numeric/ublas/operation.hpp"
#include <cmath>
#include <functional>

	//everything is in terms of fast species reindexed
	//all slow reactions are in terms of reindexed
	
class AlternateStoichiometries
{	
public:
	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;

	AlternateStoichiometries();
	
	void create(std::vector<ElementaryReaction>& fastRxnsReindexed, std::vector<dense_vec>& slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed);
	
	bool applyAlternateStoichiometry(std::size_t slowRxnIndex, dense_vec& currentRealizableFastPopulation);
	
//protected:

	void buildAltStoichVectors(std::vector<dense_vec> slowRxnFastStoich);
	
	void createLevel0AlternateStoichiometries(std::vector<dense_vec> slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed);
	
	void buildReactantSets();

	//"level 1" refers to stoichiometries that can be reached in 2 reaction steps
	//we only care about produced species
	//e.g. in enzyme substrate, when ES->E+P fires, level 0 is direct application of that stoichiometry: subtract 1 ES, add one E (do nothing to P since it is a slow species)
	//then level one will apply 
	//assumes fastReactions is already set
	void createLevel1(std::vector<dense_vec> slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed);

	void createLevel2(std::vector<dense_vec> slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed);
	
	std::vector<ElementaryReaction> fastReactions;//Reindexed;
	std::vector<dense_vec> slowRxnStoich;//affect of firing slow reaction (reindexed) on fast species
	std::vector<Reactants> slowRxnFastReactants;
	
	std::vector<AlternateStoichiometry > level0;//size=number of slow reactions

	//alternate stoichiometries achieved by applying fast reactions
	//stored in a map based on produced molecules; either individual (oneReactantMoleculeLevels) or pairs (twoReactantMoleculeLevels)
	std::map<std::size_t,std::vector<AlternateStoichiometry > > oneReactantMoleculeLevels;
	std::map<std::pair<std::size_t, std::size_t>, std::vector<AlternateStoichiometry > > twoReactantMoleculeLevels;
	
//	std::set<std::size_t> oneReactant;
//	std::set<std::pair<std::size_t,std::size_t> > twoReactant;
	
	std::vector<std::vector<AlternateStoichiometry > > oneReactantZero;
	std::vector<std::vector<AlternateStoichiometry > > twoSameReactantZero;
	std::vector<std::vector<AlternateStoichiometry > > twoSameReactantOne;
	std::vector<std::vector<AlternateStoichiometry > > twoReactantBothZero;
	std::vector<std::vector<AlternateStoichiometry > > twoReactantFirstZero;
	std::vector<std::vector<AlternateStoichiometry > > twoReactantSecondZero;
	
	bool seenFailedBuiltAltStoichWarning;
	bool seenFailedAltStoichSearchWarning;
	
	bool deeperAltStoichSearch(std::size_t slowRxnIndex, dense_vec& currentRealizableFastPopulation);
	void setMaxSearchDepth(std::size_t depth);
protected:
	std::size_t maxSearchDepth;//in search for an alt stoich, how many reactions to fire during a deeper search
		//the buildAltStoich functions uses 2, so a maxSearchDepth < 2 makes no sense
	
};//class AlternateStoichiometries

#endif
