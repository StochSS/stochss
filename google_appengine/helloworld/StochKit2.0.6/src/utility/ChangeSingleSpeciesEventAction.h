/******************************************************************************
 */

#ifndef _CHANGE_SINGLE_SPECIES_EVENT_ACTION_H_
#define _CHANGE_SINGLE_SPECIES_EVENT_ACTION_H_

namespace STOCHKIT
{
   template<typename _EventEnabledSolverType,
            typename _functorType>
   class ChangeSingleSpeciesEventAction
   {
	
   public:
        typedef typename _EventEnabledSolverType::populationVectorType _populationVectorType;
        typedef typename _populationVectorType::value_type populationValueType;

	ChangeSingleSpeciesEventAction(std::size_t speciesIndex, _functorType func, _EventEnabledSolverType& solver):
	  speciesIndex(speciesIndex), 
	  newPopulationFunction(func), 
	  solver(solver)
	  {};
	  
	  //for simple functors (such as FixedValueActionFunction) that take a single value in constructor
	ChangeSingleSpeciesEventAction(std::size_t speciesIndex, populationValueType value, _EventEnabledSolverType& solver):
	  speciesIndex(speciesIndex), 
	  newPopulationFunction(value), 
	  solver(solver)
	{};

	void operator()(double time, _populationVectorType& population) {
	  solver.setSingleSpeciesCurrentPopulation(speciesIndex, (newPopulationFunction)(time,population));
	}

	virtual ~ChangeSingleSpeciesEventAction()
	  {};

   private:
	ChangeSingleSpeciesEventAction();

	std::size_t speciesIndex;

	_functorType newPopulationFunction;
	
	_EventEnabledSolverType& solver;

   };
}

#endif
