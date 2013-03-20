#ifndef _IVFP_FOR_ODE_H_
#define _IVFP_FOR_ODE_H_

//only works correctly if 
//A_function, b_function,dependentPopulationFn, and conservationConstantsFn are set to functions (like IVFP class)
//UNLIKE IVFP CLASS, THIS ALSO REQUIRES THAT independentSpeciesFn is set

#include "StandardDriverTypes.h"	
#include "ElementaryReaction.h"
#include <algorithm>
#include <utility>
#include "boost/numeric/ublas/operation.hpp"
#include "boost/numeric/ublas/matrix.hpp"
#include <boost/numeric/ublas/triangular.hpp>
#include <boost/numeric/ublas/lu.hpp>
#include <cmath>
#include "AlternateStoichiometries.h"
#include <set>
#include <limits>
#include <map>
#include "writeEquilibriumCode.h"
#include "createConservationMatrix.h"
#include "ReversiblePair.h"

class IVFP_version_for_ode
{	

	
  public:
	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;
	typedef boost::numeric::ublas::compressed_matrix<double> sparse_matrix;
	typedef boost::numeric::ublas::matrix<double> matrix;
	
	bool equals(dense_vec& a, dense_vec& b);

	typedef std::vector<std::size_t> (*independentSpeciesFunction) ();
	IVFP_version_for_ode(independentSpeciesFunction indSpecFunc);

	void setVFP(std::vector<std::size_t> fastReactionIndexes_thisVFP, std::vector<ElementaryReaction>& allReactions);	

//	void initialize(double initialRelaxationTime, dense_vec& initialPopulation, dense_vec& currentEffectivePopulation);

public:

	void update_propensities(dense_vec& propensities, dense_vec& population);

	void update_J(dense_vec& y);
	
	void update_A(dense_vec& y, double h);

	void update_b(dense_vec& yn_1, dense_vec& current_guess, double h);

	//new equilibrium calculation using backward euler method (newton iteration)
	int equilibrium(double relaxationTime, dense_vec& effectivePopulation, bool setNegativesToZero=true);

	std::vector<std::size_t> getFastSpeciesIndexes();
	
	bool isFastSpecies(std::size_t speciesIndex);
		
	std::size_t originalIndex(std::size_t fastIndex);
	
	std::size_t fastIndex(std::size_t originalIndex);
	
	std::vector<ElementaryReaction>& getFastReactionsReindexed();
	
	void buildFastReactionsReindexed(std::vector<ElementaryReaction>& allReactions);//also creates fastSpeciesIndexes
	void buildSlowRxnFastSpeciesStoich(std::vector<ElementaryReaction>& allReactions);
	void buildListOfSlowRxnStoichIsZero();
	void buildJ_template();
	void buildSecondOrderFastReactionReindexedList();

//  private:
public:
	
	std::vector<std::size_t> fastReactionIndexes;
	std::vector<ElementaryReaction> fastReactionsReindexed;
	std::vector<std::vector<std::size_t> > fastReactionsDependencyGraph;//
	std::vector<std::size_t> fastSpeciesIndexes;
		
	std::vector<dense_vec> slowRxnFastSpeciesStoich;//size of # of slow reactions
	std::vector<bool> slowRxnStoichIsZero;//size of # of slow reactions
	
	std::size_t NumberOfFastSpecies;
	std::size_t NumberOfFastReactions;
	matrix J;
	matrix J_template;
	dense_vec latestRealizablePopulation;//size=# of fast species
	dense_vec b;
	matrix NU;
	boost::numeric::ublas::permutation_matrix<std::size_t> pmatrix; 
	boost::numeric::ublas::permutation_matrix<std::size_t> initial_pmatrix; 

	bool seenFailedApplyAltStoichWarning;

//	dense_vec delta;//used in newton iteration
	dense_vec propensities;//fast propensities
	dense_vec equilibriumPopulation;
	std::vector<std::size_t> secondOrderFastReactionReindexedList;

	typedef void (*createAFunction) (boost::numeric::ublas::matrix<double>&, boost::numeric::ublas::vector<double>&, double, boost::numeric::ublas::vector<double>&);
	createAFunction A_function;

	typedef void (*createbFunction) (boost::numeric::ublas::vector<double>&, boost::numeric::ublas::vector<double>&, boost::numeric::ublas::vector<double>&, double, boost::numeric::ublas::vector<double>&);
	createbFunction b_function;

	typedef void (*conservationFunction) (boost::numeric::ublas::vector<double>&, boost::numeric::ublas::vector<double>&);
	conservationFunction dependentPopulationFn;
	conservationFunction conservationConstantsFn;
	
	independentSpeciesFunction independentSpeciesFn;//returns a list of species indexes to use as independent species
	
	boost::numeric::ublas::vector<double> conservationConstants;
	
	std::vector<ReversiblePair> reversiblePairs;
	std::vector<double> reversiblePairs_timescales;
//	std::vector<double> reversiblePairs_default_timescales;	
//	std::multimap<double,std::size_t> inverse_nonzero_timescales;
//	double get_smallest_inverse_nonzero_timescale();

};//class IVFP_version_for_ode


#endif
