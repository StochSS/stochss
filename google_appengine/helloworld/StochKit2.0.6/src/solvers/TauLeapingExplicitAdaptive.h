/*!
	\brief the explicit tau-leaping with dynamic step size selection that switches to SSA when step size is small
*/

#ifndef _TAU_LEAPING_EXPLICIT_ADAPTIVE_H_
#define _TAU_LEAPING_EXPLICIT_ADAPTIVE_H_

#include <iostream>
#include <vector>
#include <list>
#include <limits>
#include <algorithm>
#include <cmath>
#include "Random.h"
#include "StandardDriverTypes.h"
#include "SSA_Direct.h"
#include <boost/numeric/ublas/operation.hpp>
#include <boost/numeric/ublas/matrix_proxy.hpp>
#include <boost/numeric/ublas/matrix_sparse.hpp>
#include <boost/numeric/ublas/vector.hpp>
#include <boost/numeric/ublas/matrix.hpp>
	
/*! 
	\param _denseVectorType the population vector type, should be dense
	\param _matrixType
	\param _propensitiesFunctorType functor takes reaction index and _denseVectorType population
           and returns the propensity for that reaction
	\param _dependencyGraphType
*/
namespace STOCHKIT
{
 template<typename _denseVectorType, 
	typename _matrixType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
 class TauLeapingExplicitAdaptive : public SSA_Direct<_denseVectorType, _matrixType, _propensitiesFunctorType, _dependencyGraphType>
 {	
 public:
	//! Constructor
	TauLeapingExplicitAdaptive(const _denseVectorType& initialPop,
		   const _matrixType& stoich,
		   const _propensitiesFunctorType& propensitiesFunctor,
		   const _dependencyGraphType& depGraph,
		   int seed=time(NULL));


	//! compiler-generated copy constructor OK
	//! compiler-generated assignment operator OK

	//! destructor
	virtual ~TauLeapingExplicitAdaptive() {
	}

	void setSSASteps(std::size_t ssaSteps) {
		SSASteps=ssaSteps;
	}

	void setEpsilon(double epsilon);

	void setThreshold(std::size_t threshold) {
		this->threshold=threshold;
	}

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

 protected:
	typedef SSA_Direct<_denseVectorType, _matrixType, _propensitiesFunctorType, _dependencyGraphType> SSA;
	using SSA::currentTime;
	using SSA::currentPopulation;
	using SSA::currentPropensities;
	using SSA::calculateAllPropensities;
	using SSA::NumberOfReactions;
	using SSA::NumberOfSpecies;
	using SSA::stoichiometry;
	using SSA::propensities;
	using SSA::randomGenerator;
	using SSA::initialPopulation;
//	using SSA::initialize;//for neg
	_denseVectorType previousReactionCounts;
	std::size_t criticalThreshold;//for neg
	double criticalPropensitySum;//for neg
	bool *tagList;//for neg
	std::vector<std::vector<std::size_t> >speciesToReaction;//for neg
	std::vector<std::vector<std::size_t> >reactionToSpecies;//for neg
	_denseVectorType affectedReactions;//for neg
	_denseVectorType affectedSpecies;//for neg

	#ifdef MATRIX_STOICHIOMETRY
		typedef StandardDriverTypes::stoichiometryRow matrixrow;
	#endif
	
	std::size_t threshold;//set to zero to prevent switching to ssa
	//! the number of ssa steps taken when switching from tauleaping to ssa.
	std::size_t SSASteps;
	//! Epsilon used by tau-leaping to determine the tau
	double epsilon;

	/*! \brief the G vector described in "Efficient step size selection for the tau-leaping simulation method" */
	//_denseVectorType G;
	/* use instead of a vector--just set it to 2.0 which is conservative
		except if species can dimerize with itself and has small population */
	double g;
	//! squared elements stoichiometric matrix
	_matrixType squaredVj;
	_denseVectorType mu;
	_denseVectorType sigmaSquared;
	void prepare();
	void initialize(double startTime);
	void selectTau(double &noncriticalStepsize, double &criticalStepsize);
	
	//should this return (a reference to) the vector of reaction counts?
	int selectReactions(double leapSize, bool runCritical);

	//should this take (a reference to) the vector of reaction counts?
	bool fireReactions(int criticalIndex);
	
	//methods for critical reactions
//	double critical_selectStepSize();
//	int critical_selectReaction();
	bool critical_fireReaction(int reactionIndex);
	void critical_rollBack(int reactionIndex);
	void updateTagLists();

//	delete pure product
	std::vector<int> trimed_list;
	std::size_t NumberOfReactants;

 private:
	//! default constructor not implemented
	TauLeapingExplicitAdaptive();
	std::list<std::size_t> criticalSpecies;//for neg
	std::list<std::size_t> noncriticalSpecies;//for neg
	//! the minimum number of reactions one tauleaping step should have
	void delete_product();
 };//end TauLeapingExplicitAdaptive class
}


#define _TAU_LEAPING_EXPLICIT_ADAPTIVE_IPP_
#include "TauLeapingExplicitAdaptive.ipp"
#undef _TAU_LEAPING_EXPLICIT_ADAPTIVE_IPP_

#endif
