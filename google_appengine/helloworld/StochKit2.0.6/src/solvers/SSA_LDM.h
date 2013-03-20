/*!
	\brief the logarithmic direct method
*/

#ifndef _SSA_LDM_H_
#define _SSA_LDM_H_

#include <iostream>
#include <vector>
#include <deque>
#include <list>
#include <utility>
#include "Random.h"
#include "StandardDriverTypes.h"
#include "LDMTree.h"

/*! 
	\file SSA_LDM.h
		
	\brief Gillespie's Stochastic Simulation Algorithm (SSA): logarithmic direct method.
	
	This algorithm is generally faster than the direct method only when the number of reactions is
	around 3000-4000 or more. However, it is usually slower than the constant time algorithm
	and is therefore not recommended for most problems.

	\param _populationVectorType the population vector type, should be dense
	\param _stoichiometryType
	\param _propensitiesFunctorType functor takes reaction index and _populationVectorType population
           and returns the propensity for that reaction
	\param _dependencyGraphType [expand]
*/
namespace STOCHKIT
{
 template<typename _populationVectorType, 
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
 class SSA_LDM
 {	
 public:
  typedef _populationVectorType populationVectorType;
  typedef _stoichiometryType stoichiometryType;
  typedef _propensitiesFunctorType propensitiesType;
  typedef _dependencyGraphType dependencyGraphType;

  #ifdef MATRIX_STOICHIOMETRY
    typedef StandardDriverTypes::stoichiometryRow matrixrow;
  #endif

 protected:
	//! the class that implements all random number generator function
	/*! change the RandomGenerator class to swap generators */
	STOCHKIT::RandomGenerator randomGenerator;

	//! the initial population
	/*! currentPopulation should be set to initialPopulation at the beginning of each
		realization as in initialize()
		\see initialize()
	*/
	_populationVectorType initialPopulation;
	//! the stoichiometric matrix
	/*!
		should actually be a dense vector of (usually sparse) vectors of dimension NumberOfReactions x NumberOfSpecies
		so that currentPopulation+=stoichiometry[reactionNumber] modifies the population based on
		the stoichiometry of the given reaction number
	*/
	_stoichiometryType stoichiometry;
	//! the propensities functor
	/*! propensities(rxn, pop) returns the propensity of reaction number rxn based on population pop
		after a simulation step, currentPropensities[rxn] should equal propensities(rxn, currentPopulation)
		but since propensities() is a function call, accessing current propensities should be done with
		currentPropensities
		\see currentPropensities
	*/
	_propensitiesFunctorType propensities;

	//! the dependency graph which describes the propensities that are affected by each reaction
	/*!
		should be a dense vector of (usually sparse) vectors of dimension NumberOfReactions x (variable) number of affected reactions
		where dependencyGraph[rxn] returns the variable length vector of reaction indices that are affected by reaction rxn
		e.g. if dependencyGraph[4][0]=2 and dependencyGraph[4][1]=4 and dependencyGraph[4][2]=5 then dependencyGraph[4].size()=3 and
		reaction 4 affects reactions 2, 4, and 5
		\see fireReaction
	*/
	_dependencyGraphType dependencyGraph;
        std::vector<std::vector<std::size_t> > dependencyGraphPostOrder;


	//! number of species in the system
	std::size_t NumberOfSpecies;
	//! number of reactions in the system
	std::size_t NumberOfReactions;

	//! current time of the simulation, should be incremented at each simulation time step
	double currentTime;
	//! current population of the simulation
	_populationVectorType currentPopulation;

	//! index of the last reaction that fired
	/*!
		default and error value is -1
	*/

        LDMTree propensityTree;
        LDMTree initialPropensityTree;//keep a copy of the propensityTree constructed from initial populations
	int previousReactionIndex;

 private:
	//! default constructor not implemented
	SSA_LDM();

 public:

	SSA_LDM(const _populationVectorType& initialPop,
		   const _stoichiometryType& stoich,
		   const _propensitiesFunctorType& propensitiesFunctor,
		   const _dependencyGraphType& depGraph,
		   int seed);

	//! destructor
	virtual ~SSA_LDM() {
	}

	/*!
		\brief seed the random number generator
	*/
	void seed(int seed);

 protected:
	/*! \brief creates the post-ordered dependency graph from the normal dependency graph
	 */
	void createDependencyGraphPostOrder(const _dependencyGraphType& depGraph);

	/*!
		\brief initialize the state for a new simulation realization, this should be called before each realization
	*/
	void initialize(double startTime);

	/*!
		\brief consistency checks to validate that the class is set up properly for a simulation, should be called before an ensemble as in simulate()
	*/
	bool validate(double startTime, double endTime);

	/*!
		\brief selects the step size based on the propensitySum
		       
		returns infinity if propensitySum is less than or equal to 0
		issues a warning if propensitySum is less than 0
	*/
	double selectStepSize();


	/*!
		\brief selects the index of the next reaction to fire based
	*/
	int selectReaction();


	/*!
		\brief fire a reaction
			   
		tested other implementations that were cleaner, but this one is faster
		
		\param reactionIndex the index of the reaction to fire (-1 is an error value)
	*/
	bool fireReaction(int reactionIndex);

	/*!
		\brief always returns true: take a step: increment currentTime based on selectStepSize() and select and fire a reaction
		
		change to return type void? or return false if selectReaction returns -1 or other error occurs?
		
		\param reactionIndex is the number of the reaction that is firing
	*/
	bool step();

void checkTree() {
  //compare the existing tree to a new tree with current propensities
  std::vector<double> testPropensities(NumberOfReactions);

  for (std::size_t i=0; i<testPropensities.size(); ++i) {
    testPropensities[i]=propensities(i,currentPopulation);
    std::cout << "testPropensities[" << i << "]= " << testPropensities[i] << " ";
  }
  std::cout <<"\n";
  for (std::size_t i=0; i!=currentPopulation.size(); ++i) {
    std::cout << "x["<<i<<"]=" << currentPopulation[i] << " ";
}
std::cout << "\n";

  LDMTree testTree(NumberOfReactions); 
   testTree.build(testPropensities);

   for (std::size_t i=0; i<testPropensities.size(); ++i) {
    std::cout << "propensityTree[" << i << "].sum=" << propensityTree[i].sum << " vs test=" << testTree[i].sum << std::endl;
  }
   
}

 public:
	/*!
		\brief run an ensemble simulation with output recorded at fixed time intervals
			   
		needs work: number of intervals should be a parameter, 
		calls validate before ensemble
		calls initialize before each realization
		
		\param realizations number of simulations in the ensemble
		\param startTime the initial value of currentTime for each realization
		\param endTime the end time of each realization
		\param Output the class that handles storing the output for the simulation
	*/
        template<typename IntervalOutputType>
	  void simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate);
	
 };//end SSA_LDM class
}

#define _SSA_LDM_IPP_
#include "SSA_LDM.ipp"
#undef _SSA_LDM_IPP_

#endif
