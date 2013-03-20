/*!
\brief the next reaction method of the Stochastic Simulation Algorithm (SSA)
Note that this class behaves differently from the direct method
The fireReaction method also updates currentTime!
To see the time of the next reaction without firing or updating the time, use getNextReactionTime()
*/

#ifndef _SSA_NRM_H_
#define _SSA_NRM_H_

#include <iostream>
#include <vector>
#include <limits>
#include "Random.h"
#include "StandardDriverTypes.h"
#include "BinHeap.h"

namespace STOCHKIT
{
   /**
   *@class SSA_NRM
   *
   *@brief Gibson and Bruck's Next Reaction Method for stochastic simulation.
   This class uses the Next Reaction Method for stochastic simulation. This
   method draws an exponential random variable for each reaction channel then
   another exponential after each firing of a reaction. This is in contrast with
   the Gillespie (direct) method which requires two random draws per reaction firing.
   */
  template<typename _populationVectorType, 
    typename _stoichiometryType,
    typename _propensitiesFunctorType,
    typename _dependencyGraphType>
    class SSA_NRM
    {
    public:	
      typedef _populationVectorType populationVectorType;
      typedef _stoichiometryType stoichiometryType;
      typedef _propensitiesFunctorType propensitiesType;
      typedef _dependencyGraphType dependencyGraphType;
      
    protected:		
      /**
       Generates all random variables needed for simulation.
      */
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
	should be a dense vector (size=NumberOfReactions) of variable length vectors
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
      
      //! custom created object used to keep track of minimum reaction times
      BinHeap rxnHeap;
      
      //! current time of the simulation, should be incremented at each simulation time step
      double currentTime;

      //! current population of the simulation
      _populationVectorType currentPopulation;
      
      //! current propensities of the simulation
      _populationVectorType currentPropensities;
    
      //! index of the last reaction that fired
      /*!
	default and error value is -1
      */
      int previousReactionIndex;

      bool detectedVerySmallPropensity;

      //! counter for simulation steps taken since the last time calculateAllPropensities was called
      /*!
	is used to ensure that roundoff errors in propensities do not accumulate
	selectReaction() uses a simple strategy to recalculate all propensities using maxStepsCalculateAllPropensities
	for conservative strategy, see S. Mauch, M. Stalzer "Efficient formulations for
	exact stochastic simulation of chemical systems" IEEE/ACM Trans. on Comp. Bio. and Bioinformatics, 30 April 2009
	\see calculateAllPropensities
	\see defaultMaxStepsCalculateAllPropensities
	\see maxStepsCalculateAllPropensities
	\see selectReaction()
      */
      std::size_t stepsSinceCalculateAllPropensities;
		
      //! default value for maxStepsCalculateAllPropensities
      static const std::size_t defaultMaxStepsCalculateAllPropensities=10000;
      
      //! maximum number of steps allowed before calling calculateAllPropensities
      /*!
	\see stepsSinceCalculateAllPropensities
      */
      std::size_t maxStepsCalculateAllPropensities;

      /*!
	\brief update all the propensities	
	updates currentPropensities by calling the propensities functor
	for each reaction using currentPopulation
	updates propensitySum
	resets stepsSinceCalculateAllPropensities to 0
      */
      void calculateAllPropensities();

      bool updateCurrentTime();

    public:
      //! Constructor
      SSA_NRM(const _populationVectorType& initialPop,
	      const _stoichiometryType& stoich,
	      const _propensitiesFunctorType& propensitiesFunctor,
	      const _dependencyGraphType& depGraph,
	      int seed=time(NULL));

      //! compiler-generated copy constructor OK

      //! compiler-generated assignment operator OK

      //! destructor
      virtual ~SSA_NRM() {}
      
      /*!
	\brief seed the random number generator
      */
      void seed(int seed);

      /*!
	\brief run an ensemble simulation with output recorded at fixed time intervals
	
	output must have a conforming initialize, getOutputTimes, and record method
	outputTimes should be set in output prior to calling simulate
	if doValidate=true (the default) calls validate before ensemble
	calls initialize before each realization

	\param realizations number of simulations in the ensemble
	\param startTime the initial value of currentTime for each realization
	\param endTime the end time of each realization
	\param Output the class that handles storing the output for the simulation
      */
      template<typename IntervalOutputType>
	void simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate=true);

      /*!
	\brief initialize the state for a new simulation realization, this should be called before each realization
      */
      virtual void initialize(double startTime=0.0);

      /*!
	\brief consistency checks to validate that the class is set up properly for a simulation, should be called before an ensemble as in simulate(...,doValidate=true)
      */
      bool validate(double startTime, double endTime);

      /*!
	\brief fire a reaction
	updates currentPopulation
	updates currentPropensities for all affected reactions (determined by dependencyGraph[reactionIndex])
	updates currentTime
      */
      bool fireReaction();
      
      double getCurrentTime();
      
      _populationVectorType getCurrentPopulation();

      /**
	 Index of the last reaction that fired. 
      */
      int getPreviousReactionIndex();

      /**
	 Queries heap to find the reaction of the next
	 reaction that will happen
      */
      int getNextReactionIndex();

      /**
	 Queries heap to find when next rxn of ANY type will happen
      */
      double getNextReactionTime();
      
    };//end SSA_NRM class
}

#define _SSA_NRM_IPP_	
#include "SSA_NRM.ipp"
#undef _SSA_NRM_IPP_

#endif
