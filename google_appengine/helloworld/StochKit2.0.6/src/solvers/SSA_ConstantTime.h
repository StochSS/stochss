/*!
\brief the amortized constant-complexity (composition-rejection) method of the Stochastic Simulation Algorithm (SSA)
*/

#ifndef _SSA_CONSTANTTIME_H_
#define _SSA_CONSTANTTIME_H_

#include <iostream>
#include <vector>
#include <deque>
#include <list>
#include <utility>
#include <math.h>
#include "Random.h"
#include "StandardDriverTypes.h"
#include "ConstantTimeGroup.h"
#include "ConstantTimeGroupCollection.h"

/*! 
\file SSA_ConstantTime.h

\brief Gillespie's Stochastic Simulation Algorithm (SSA): constant complexity algorithm

This algorithm is generally faster than the direct method only when the number of reactions is
around 3000-4000 or more.  For a description of the algorithm see
A. Slepoy, A.P. Thompson, and S.J. Plimpton. J Chem Phys 128(20):205101 2008. or
S. Mauch, M. Stalzer "Efficient formulations for exact stochastic simulation of chemical systems"
IEEE/ACM Trans. on Comp. Bio. and Bioinformatics, 30 April 2009.

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
	class SSA_ConstantTime
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

		//! number of species in the system
		std::size_t NumberOfSpecies;
		//! number of reactions in the system
		std::size_t NumberOfReactions;

		//! current time of the simulation, should be incremented at each simulation time step
		double currentTime;
		//! current population of the simulation
		_populationVectorType currentPopulation;
		//! current propensities of the simulation
		std::vector<double> currentPropensities;

		//! index of the last reaction that fired
		/*!
		default and error value is -1
		*/
		int previousReactionIndex;

		//groups of propensities
		ConstantTimeGroupCollection groups;

		//!propensities based on initial population
		std::vector<double> initialPropensities;

		//! groups based on initial conditions
		ConstantTimeGroupCollection initialGroups;


	private:
		//! default constructor not implemented
		SSA_ConstantTime();

	public:

		SSA_ConstantTime(const _populationVectorType& initialPop,
			const _stoichiometryType& stoich,
			const _propensitiesFunctorType& propensitiesFunctor,
			const _dependencyGraphType& depGraph,
			int seed=time(NULL));

		//! destructor
		virtual ~SSA_ConstantTime() {
		}

		/*!
		\brief seed the random number generator
		*/
		void seed(int seed);

	protected:
		//! set initial population (not current population), should probably never be used since no 0-argument constructor
		void setInitialPopulation(const _populationVectorType& initialPop) {
			initialPopulation = initialPop;
		}
		//! set stoichiometry matrix, should probably never be used since no 0-argument constructor
		void setStoichiometry(const _stoichiometryType& stoich) {
			stoichiometry=stoich;
		}
		//! set propensities functor, should probably never be used since no 0-argument constructor
		void setPropensities(const _propensitiesFunctorType& propensitiesFunctor) {
			propensities=propensitiesFunctor;
		}
		//! set dependencyGraph, should probably never be used since no 0-argument constructor
		void setDependencyGraph(const _dependencyGraphType& depGraph) {
			dependencyGraph=depGraph;
		}

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
		\brief update the "groups" data structure

		\param affectedReactionIndex the index of the propensity that changed
		*/
		void updateGroups(int affectedReactionIndex, double oldPropensity);

	public:	
		/*!
		\brief always returns true: take a step: increment currentTime based on selectStepSize() and select and fire a reaction

		change to return type void? or return false if selectReaction returns -1 or other error occurs?

		\param reactionIndex is the number of the reaction that is firing
		*/
		bool step();

		/*!
		\brief run an ensemble simulation with output recorded at fixed time intervals

		calls validate before ensemble
		calls initialize before each realization

		\param realizations number of simulations in the ensemble
		\param startTime the initial value of currentTime for each realization
		\param endTime the end time of each realization
		\param Output the class that handles storing the output for the simulation
		*/
		template<typename IntervalOutputType>
		void simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate=true);

	};//end SSA_ConstantTime class
}

#define _SSA_CONSTANTTIME_IPP_
#include "SSA_ConstantTime.ipp"
#undef _SSA_CONSTANTTIME_IPP_

#endif
