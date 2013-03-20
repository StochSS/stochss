#ifndef _INDEPENDENT_VIRTUAL_FAST_PROCESS_H_
#define _INDEPENDENT_VIRTUAL_FAST_PROCESS_H_

//turn off range checking
#define GSL_RANGE_CHECK_OFF

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
#include "Random.h"

	static std::vector<std::vector<std::size_t> > find_reversible_pairs_by_stoichiometry(std::vector<ElementaryReaction>& reactions) {
//		std::cout << "reactions passed to find_reversible_pairs_by_stoichiometry: \n";
//		for (std::size_t i=0; i!=reactions.size(); ++i) {
//			reactions[i].display();
//			std::cout << "\n";
//		}
	
		//returns a vector of vectors, with inner vector being list of reactions that are reversible pairs of each other
		//sort of assumes that all will have exactly one reversible pair
		//so, if multiple or none, may return entries with just one reaction in the inner vector.
		
		//also note that it is based on stoichiometry, so A+B->A+C and C->B are reversible pairs for the purpose of this method
		
		//calculate maxSpeciesIndex for later
		std::size_t maxSpeciesIndex=0;
		
		for (std::size_t i=0; i!=reactions.size(); ++i) {
			//get Reactants
			Reactants r=reactions[i].getReactants();
			for (std::size_t j=0; j!=r.size(); ++j) {
				if (r[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=r[j].getSpeciesIndex();
			}
			//get Products
			Products p=reactions[i].getProducts();
			for (std::size_t j=0; j!=p.size(); ++j) {
				if (p[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=p[j].getSpeciesIndex();
			}
			
		}

//		boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(reactions,maxSpeciesIndex+1);
//		std::set<std::size_t> unprocessedRxns;
//		for (std::size_t i=0; i!=tmpNU.size1(); ++i) {
//			unprocessedRxns.insert(i);
//		}

		std::vector<std::vector<std::size_t> > reversiblePairs;
		
		//find reversible pairs
		for (std::size_t i=0; i<reactions.size(); ++i) {
			for (std::size_t j=i+1; j!=reactions.size(); ++j) {
//				std::cout << "comparing rxn "<<i<<" and "<<j<<"\n";
				if (ReversiblePair::isReversiblePairByStoichiometry(reactions[i],reactions[j])) {
//					std::cout << "reactions "<<i<<" and "<<j<<" are reversible pairs...\n";
					reversiblePairs.push_back(std::vector<std::size_t>());
					reversiblePairs.back().push_back(i);
					reversiblePairs.back().push_back(j);
				}
			}
		}

//		
//		for (std::size_t i=0; i!=tmpNU.size1(); ++i) {
//			if (unprocessedRxns.find(i)!=unprocessedRxns.end()) {
//				reversiblePairs.push_back(std::vector<std::size_t>());
//				reversiblePairs.back().push_back(i);
//				boost::numeric::ublas::matrix_row<boost::numeric::ublas::matrix<double> > currentRow(tmpNU,i);
//				//iterate and find nonzer entries
//				std::set<std::size_t> nonzeroEntries;
//				for (std::size_t j=0; j!=currentRow.size(); ++j) {
//					if (currentRow(j)!=0) {
//						nonzeroEntries.insert(j);
//					}
//				}
//				//look at rows below to find reversible pair
//				for (std::size_t k=i; k!=tmpNU.size1(); ++k) {
//					boost::numeric::ublas::matrix_row<boost::numeric::ublas::matrix<double> > row_k(tmpNU,k);
//					bool allOpposite=true;
//					for (std::set<std::size_t>::iterator it=nonzeroEntries.begin(); it!=nonzeroEntries.end(); ++it) {
//						if (currentRow(*it)!=-row_k(*it)) {
//							allOpposite=false;
//						}
//					}
//					if (allOpposite) {
//						(reversiblePairs.back()).push_back(k);
//					}
//				}
//
//				//remove i and all reversiblePairs from unprocessedRxns list
//				for (std::size_t m=0; m!=reversiblePairs.back().size(); ++m) {
//					unprocessedRxns.erase(unprocessedRxns.find(reversiblePairs.back()[m]));
//				}
//
//			}
//		}
		
//		std::cout << "reversible pairs, by stoichiometry:\n";
//		for (std::size_t i=0; i!=reversiblePairs.size(); ++i) {
//			for (std::size_t j=0; j!=reversiblePairs[i].size(); ++j) {
//				std::cout << reversiblePairs[i][j] << "\t";
//			}
//			std::cout << "\n";
//		}
		
		//remove any "pair" that contains only one entry...old check, this shouldn't be possible with current code
		for (std::size_t i=0; i!=reversiblePairs.size(); ++i) {
			if (reversiblePairs[i].size()!=2) {
				std::cout << "StochKit ERROR (IndependentVirtualFastProcesses::find_reversible_pairs_by_stoichiometry): detection of reversible pairs returned a non-pair. Condition not implemented. Terminating.\n";
				std::cout << "debug: size="<<reversiblePairs[i].size()<<"\n";
				for (std::size_t j=0; j!=reversiblePairs[i].size(); ++j) {
					std::cout << reversiblePairs[i][j] << "\t";
				}
				exit(1);
			}
		}
		
		return reversiblePairs;
	}

class IndependentVirtualFastProcess
{	

	
  public:
	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;
	typedef boost::numeric::ublas::compressed_matrix<double> sparse_matrix;
	typedef boost::numeric::ublas::matrix<double> matrix;
	
	bool equals(dense_vec& a, dense_vec& b);

	IndependentVirtualFastProcess();

	void setVFP(std::vector<std::size_t> fastReactionIndexes_thisVFP, std::vector<ElementaryReaction>& allReactions);	

	void initialize(double initialRelaxationTime, dense_vec& initialPopulation, dense_vec& currentEffectivePopulation);

public:
	bool fireSlowReaction(std::size_t reactionIndex, dense_vec& currentEffectivePopulation, double reaction_propensity);

	//~IndependentVirtualFastProcess();//default destructor OK

	void update_propensities(dense_vec& propensities, dense_vec& population);

	//new equilibrium calculation using backward euler method (newton iteration)
	int equilibrium(double relaxationTime, dense_vec& effectivePopulation, bool setNegativesToZero=true);

	std::vector<std::size_t> getFastSpeciesIndexes();
	
	bool isFastSpecies(std::size_t speciesIndex);
	
	bool isFastReaction(std::size_t reactionIndex);
	
	bool isSlowReaction(std::size_t reactionIndex);
	
	std::size_t originalIndex(std::size_t fastIndex);
	
	std::size_t fastIndex(std::size_t originalIndex);
	
	std::vector<ElementaryReaction>& getFastReactionsReindexed();
	
	void buildFastReactionsReindexed(std::vector<ElementaryReaction>& allReactions);//also creates fastSpeciesIndexes
	void buildSlowRxnFastSpeciesStoich(std::vector<ElementaryReaction>& allReactions);
	void buildListOfSlowRxnStoichIsZero();
	void buildSecondOrderFastReactionReindexedList();

//  private:
public:
	
	std::vector<std::size_t> fastReactionIndexes;
	std::vector<ElementaryReaction> fastReactionsReindexed;
	std::vector<std::size_t> fastSpeciesIndexes;
		
	std::vector<dense_vec> slowRxnFastSpeciesStoich;//size of # of slow reactions
	std::vector<bool> slowRxnStoichIsZero;//size of # of slow reactions

	AlternateStoichiometries altStoichs;
	
	std::size_t NumberOfFastSpecies;
	std::size_t NumberOfFastReactions;
	matrix J;
	dense_vec latestRealizablePopulation;//size=# of fast species
	dense_vec b;
	matrix NU;
	boost::numeric::ublas::permutation_matrix<std::size_t> pmatrix; 
	boost::numeric::ublas::permutation_matrix<std::size_t> initial_pmatrix; 

	bool seenFailedApplyAltStoichWarning;
	bool seenSampleConservationWarning;
	bool seenFirePropensityZeroWarning;
	
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
	
	boost::numeric::ublas::vector<double> conservationConstants;
	
	std::vector<ReversiblePair> reversiblePairs;
	std::vector<double> reversiblePairs_timescales;
//	std::vector<double> reversiblePairs_default_timescales;	
//	std::multimap<double,std::size_t> inverse_nonzero_timescales;
//	double get_smallest_inverse_nonzero_timescale();

	std::vector<std::vector<std::size_t> > reaction_reversiblePairs_dependency;//size is number of reactions in model, each entry is a vector of the reversible pair indexes that contain a species in that reaction
	bool accuracy_violated;//usually false...unless detect accuracy violation...
	
	timeval timer3;
	timeval timer4;
		
	double equilibrium_time;
	std::size_t equilibrium_calls;
	double et_start;
	double et_end;
	
//	double A_start;
//	double A_end;
//	double b_start;
//	double b_end;
//	double solve_start;
//	double solve_end;
//	double A_time;
//	double b_time;
//	double solve_time;
//
//	void printProfileData();
	
	std::vector<std::pair<std::size_t,double> > sampleFastSpecies();
	void internal_ssa(double simulationTime, dense_vec& population, std::size_t max_steps);

	std::vector<std::size_t> slowRxnTimescaleViolationCounters;
	STOCHKIT::RandomGenerator randomGenerator;//for use with internal_ssa
	
	std::size_t rankNU;
	
	double defaultRelaxationTime;
};//class IndependentVirtualFastProcess


#endif
