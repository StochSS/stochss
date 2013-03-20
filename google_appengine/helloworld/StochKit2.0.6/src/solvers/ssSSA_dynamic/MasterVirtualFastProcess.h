#ifndef _MASTER_VIRTUAL_FAST_PROCESS_H_
#define _MASTER_VIRTUAL_FAST_PROCESS_H_

#include <vector>
#include <set>
#include <sstream>
#include <algorithm>
#include "IndependentVirtualFastProcess.h"
#include "Reactants.h"
#include "boost/numeric/ublas/vector.hpp"
#include "ForwardFrequencyEstimate.h"
#include "Groups.h"

typedef std::vector<std::size_t> ListOfReactions;
typedef ListOfReactions LOR;
typedef std::vector<LOR> LORs;

class MasterVirtualFastProcess
{
  public:
	std::vector<ElementaryReaction>& model;
	typedef std::vector<std::size_t> (*independentSpeciesFunction) ();
	MasterVirtualFastProcess(std::vector<ElementaryReaction>& model,std::size_t numberOfSpecies, independentSpeciesFunction indSpecFunc);
	
	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;

//	new functions
	bool setFastReactionIndexes(std::vector<std::size_t>& fastReactions, std::string files_directory="");

public:

	bool fireSlowReaction(std::size_t reactionIndex, dense_vec& currentEffectivePopulation, double currentSimulationTime, double reaction_propensity);
	double getFastSpeciesRate(std::size_t reactionIndex);

	//called before every realization
	void initialize(double initialRelaxationTime, dense_vec& initialPopulation, dense_vec& currentEffectivePopulation);


	std::vector<std::size_t> getAffectedFastSpecies(std::size_t slowReactionIndex);//list of fast species affected when slowReactionIndex fires--reindexed or what?

	#ifdef PROFILE_VFP_TIMESCALES
	void printTimescaleData();//for development/debugging only
	#endif
	
//  protected:
	std::vector<std::vector<std::size_t> > findIndependentSubsystems(std::vector<std::size_t>& fastReactions);

	std::vector<std::vector<std::size_t> > create_groups(std::vector<double>& firing_frequency_estimates, dense_vec& tf_population);
	
	std::vector<std::size_t>& getFastSpeciesIndexesRef();
	bool isSpeciesFast(std::size_t speciesIndex);

	std::vector<std::size_t>& getFastReactionIndexesRef();

//protected:
	void calculateCurrentFastSpeciesIndexes();//called by repartition function
	void updateIsSpeciesFastBools();//called by repartition function

//private:
public:
	//new members:
	std::vector<IndependentVirtualFastProcess> all_precompiled_ivfps;//independent (ie uncoupled) virtual fast processes
	std::vector<std::size_t> current_ivfps;//indexes into all_precompiled_ivfps of current ivfps
	std::map<std::vector<std::size_t>,std::size_t> ivfp_index_map;//map of (ordered) vector of reaction indexes to associated index in all_precompiled_ivfps

	ForwardFrequencyEstimate ffe;
	Groups groups;
	
	std::vector<std::size_t> fastSpeciesIndexes;
	std::vector<bool> isSpeciesFastBools;	
	std::vector<std::size_t> fastReactionIndexes;

	std::vector<std::size_t> initial_ivfps;//indexes into all_precompiled_ivfps of initial ivfps
	std::vector<std::size_t> initialFastSpeciesIndexes;
	std::vector<bool> initialIsSpeciesFastBools;	
	std::vector<std::size_t> initialFastReactionIndexes;
	
	void buildAllPrecompiledIVFPs(std::vector<std::vector<std::size_t> >& ivfp_reaction_lists);
	bool builtAllPrecompiledIVFPs;//gets set to true after buildAllPrecompiledIVFPs is called because buildInitialIVFP must be called AFTER
	void buildInitialIVFP(std::vector<std::size_t>& initialFastReactions);

	bool accuracy_violated;//usually false...unless detect accuracy violation...
	
	void reset_accuracy_violated();

	void print_current_ivfps();

	//utility
	bool areOpposites(boost::numeric::ublas::matrix_row<boost::numeric::ublas::matrix<double> > row1, boost::numeric::ublas::matrix_row<boost::numeric::ublas::matrix<double> > row2);

	bool seenUnableToRecoverWarning;
	
};//class MasterVirtualFastProcess



#endif
