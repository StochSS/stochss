 /*!
	\brief the Optimized Direct Method of the Stochastic Simulation Algorithm (SSA) 
 */

#ifndef _SSA_ODM_H_
#define _SSA_ODM_H_

#include<iostream>
#include <vector>
#include <limits>
#include <time.h>
#ifndef WIN32
#include <sys/time.h>
#endif
#include "SSA_Direct.h"
#include "Random.h"
#include "StandardDriverTypes.h"
#include "CustomPropensitySet.h"
/*!
	\file SSA_ODM.h
	\brief Cao, Li and Petzold's Optimized Direct Method of the Stochastic Simulation Algorithm (SSA).
	\param _populationVectorType the population vector type, should be compatible with
			_stoichiometryType (see below), and as input to _propensitiesFunctorType, must have a .size() function
	\param _stoichiometryType should be compatible with _populationVectorType--that is,
			when a reaction fires, we will take _populationVectorType+=_stoichiometryType[reactionIndex].
			size should be equal to number of reactions, must have a .size() method
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
 class SSA_ODM:
    public SSA_Direct <_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>
 {	

 private:
    //! default constructor not implemented
    SSA_ODM();

	//! The interface for the Gillespie's Direct Method
	typedef SSA_Direct<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType> Base;

 protected:
    /*!
	   the class to store the index and the frequency of the reactions
           reactionIndex: the index of the reaction
           fireFrequency: the firing frequency of the reaction with index reactionIndex
	*/
    class FireFrenquencyRecord{
    public:
        int reactionIndex;
        int fireFrequency;
    };

	/*!
		the class the to implement the Comparison function object that, 
			taking two values of the same type than those contained in the range, 
			returns true if the first argument goes before the second argument, 
			and false otherwise. 
    */
    class ValueGreater :
        public std::binary_function<FireFrenquencyRecord, FireFrenquencyRecord, bool> {
    public:
        bool operator()(const FireFrenquencyRecord& x, const FireFrenquencyRecord& y) const {
            return x.fireFrequency > y.fireFrequency;
        }
    };
	
	//! the vector to record the reactions' firing frequency
	std::vector<FireFrenquencyRecord> FrequencyVector;\
	//!the vector to record the old index for current index
	std::vector<int> IndexMap;

	//! the propensities fucntion type
    typedef double (_propensitiesFunctorType::* PropensityMember) (_populationVectorType&);

 public:	
	//! Constructor 
    SSA_ODM(const _populationVectorType& initialPop,
           const _stoichiometryType& stoich,
           const _propensitiesFunctorType& propensitiesFunctor,
           const _dependencyGraphType& depGraph, 
		   int seed=time(NULL)):
           SSA_Direct<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>(initialPop,stoich,propensitiesFunctor,depGraph, seed),
           FrequencyVector(Base::NumberOfReactions)
    {
    }

	//! destructor
    virtual ~SSA_ODM() {
    }

 protected:
	//! current time of the simulation, should be incremented at each simulation time step
    double currentTime;

	//! number of reactions in the system
    using Base::NumberOfReactions;

	//! the propensities functor
	/*! propensities(rxn, pop) returns the propensity of reaction number rxn based on population pop
		after a simulation step, currentPropensities[rxn] should equal propensities(rxn, currentPopulation)
		but since propensities() is a function call, accessing current propensities should be done with
		currentPropensities
		\see currentPropensities
     */
    using Base::propensities;

	//!Set the initial value for the firing frequency of the reactions, initial are all 0s
    void InitializeFrequencyVector()
    {
	    FrequencyVector.resize(NumberOfReactions);	
	    IndexMap.resize(NumberOfReactions);	
        //printf("number of Reactions %d \n", numberofReactions);
        for(std::size_t i=0; i < NumberOfReactions; i++){
            FrequencyVector[i].reactionIndex = i;
            FrequencyVector[i].fireFrequency = 0;
			IndexMap[i] = i;

#ifdef DEBUG
             printf("FrequencyVector[%d].reactionIndex = %d\n", i, FrequencyVector[i].reactionIndex);
             printf("FrequencyVector[%d].fireFrequency = %d\n", i, FrequencyVector[i].fireFrequency);
#endif
         }
    }
	
	//! firing frequncy increases 1 for fired reaction
    void RecordFireReaction(int previousIndex)
    {
      if (previousIndex!=-1) {
        FrequencyVector[previousIndex].fireFrequency++;
      }
    }

	/*
	 	\brief Get the reaction fring requency

		run the whole simulation once, recording the firing frequency for each reaction
	 */
    void getReactionsFireFrequency(double startTime, double endTime)
    {
         currentTime = startTime;
         Base::initialize(startTime);
         while (currentTime<endTime) {
             currentTime+=Base::selectStepSize();
             Base::fireReaction(Base::selectReaction());
             RecordFireReaction(Base::previousReactionIndex);
         }
    }

	/*!
	 	\brief reorder the vectors

		reordering the vectos according to the firing frequency saved in the Frequency vector
		Please remember the _reorderVectorType has to be a vector
	 */
    template<typename _reorderVectorType>
    _reorderVectorType ReorderVectors(_reorderVectorType& orgVector) {
        int numberofReactions = NumberOfReactions;
        _reorderVectorType rV(numberofReactions);
            for(std::size_t i=0; i <  NumberOfReactions; i++){
                int rI = FrequencyVector[i].reactionIndex;
                rV[i] = orgVector[rI];
            }
            return rV;
    }

    //!Generate new DG
	_dependencyGraphType GenerateDG(_dependencyGraphType oriDg)
	{
		//obtain the new index based on old index
         for(std::size_t i=0; i <  NumberOfReactions; i++){
              int rI = FrequencyVector[i].reactionIndex;
              IndexMap[rI] = i;
         }
		 _dependencyGraphType dg(NumberOfReactions);
         for(std::size_t i=0; i <  NumberOfReactions; i++){
				int rI = FrequencyVector[i].reactionIndex;
				int dgSize = oriDg[rI].size();
				dg[i].resize(dgSize);
				for(int j=0; j < dgSize; j++){
					int tmpIndex = oriDg[rI][j];
					int newI = IndexMap[tmpIndex];
					dg[i][j] = newI;
				}
		 }
		 return dg;
	}
   
    //!     Reorder the reactions
	void reorderReactions()
    {
        sort(FrequencyVector.begin(), FrequencyVector.end(), ValueGreater());
#ifdef DEBUG
        printf("New order:\n");
        for(int i=0; i < NumberOfReactions; i++){
             printf("FrequencyVector[%d].reactionIndex = %d\n", i, FrequencyVector[i].reactionIndex);
             printf("FrequencyVector[%d].fireFrequency = %d\n", i, FrequencyVector[i].fireFrequency);
        }
#endif
        Base::stoichiometry = ReorderVectors<_stoichiometryType>(Base::stoichiometry);
        //Base::propensities._propensityFunctions = ReorderVectors<vector<PropensityMember> >(Base::propensities._propensityFunctions);
        //Base::propensities.propensities = ReorderVectors<_propensitiesFunctorType::tempType >(Base::propensities.propensities);
        typedef typename CustomPropensitySet<_populationVectorType>::tempType myType;
		Base::propensities.propensities = ReorderVectors<myType>(Base::propensities.propensities);
		Base::dependencyGraph = GenerateDG(Base::dependencyGraph);
    	
	}

	/*!
	 	\brief presimulation 
		
		Presimulating the model once with start time and end time, 
		collecting the firing requencies of reactions and
		reorder the stoichiometry matrix and penpesities

		\param startTime the initial value of currentTime for each realization
		\param endTime the end time of each realization
	*/
    void presimulation(double startTime, double endTime)
    {
        InitializeFrequencyVector();
        getReactionsFireFrequency(startTime, endTime);
        reorderReactions();
    }

 public:
	/*!
	 	\brief run an ensemble simulation with output recorded at fixed time intervals

		needs work:
			the reactions need reordered or not should be a parameter,
			number of the intervals should be a parameter,
			Output should be specifically a base "IntervalOutputObject" (or similar) class with a default
			or Output should be a template parameter
			need to specify the functionality that Output must provide
			there is an error in the main loop--it always records output one reaction after it should
			calls validate before ensemble
			calls initialize before each realization

			\param realizations number of simulations in the ensemble
			\param startTime the initial value of currentTime for each realization
			\param endTime the end time of each realization
			\param Output the class that handles storing the output for the simulation
	 */
	template<typename IntervalOutputType>
     void simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, bool doValidate=true)
     {

#ifdef DEBUG
         printf("ori stoichiometry:\n");
         for(int i=0; i < NumberOfReactions; i++){
		 	for(int j=0; j< Base::NumberOfSpecies; j++){
               printf("%f ", Base::stoichiometry[i][j]);
		    }
			printf("\n");
         }
#endif
    
         presimulation(startTime, endTime);
	 //printf("Finish presimulation\n");
#ifdef DEBUG
         printf("\n new stoichiometry:\n");
         for(int i=0; i < NumberOfReactions; i++){
		 	for(int j=0; j< Base::NumberOfSpecies; j++){
               printf("%f ", Base::stoichiometry[i][j]);
		    }
			printf("\n");
         }
#endif
        Base::template simulate<IntervalOutputType>(realizations, startTime, endTime, output, doValidate);
     }

	//! return the current population
     _populationVectorType GetCurrentPopupaktion()
    {
        return Base::currentPopulation;
    }
  
  	//return the current stoichiometry matrix
    _stoichiometryType GetCurrentStoichiometry(){
	    return Base::stoichiometry;
    }
	
 };//end class
}

#endif
