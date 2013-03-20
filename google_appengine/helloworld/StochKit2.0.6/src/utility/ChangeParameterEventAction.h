/******************************************************************************
 */

#ifndef _CHANGE_PARAMETER_EVENT_ACTION_H_
#define _CHANGE_PARAMETER_EVENT_ACTION_H_

namespace STOCHKIT{
   template<typename _EventEnabledSolverType,
            typename _functorType>
   class ChangeParameterEventAction
   {
	
   public:
        typedef typename _EventEnabledSolverType::populationVectorType _populationVectorType;
        typedef typename _populationVectorType::value_type populationValueType;

	//for ExpressionValueActionFunction that take an std::string in constructor
	ChangeParameterEventAction(std::size_t parameterIndex, std::string value, _EventEnabledSolverType& solver, bool value_type):
	  parameterIndex(parameterIndex), 
	  newParameterFunction(value), 
	  solver(solver),
	  value_type(value_type)
	  {};

	void operator()(double time, _populationVectorType& population) {
	  solver.setParameterValue(parameterIndex, (newParameterFunction)(time,population), value_type);
	}

	virtual ~ChangeParameterEventAction()
	  {};

   private:
	ChangeParameterEventAction();

	std::size_t parameterIndex;

	_functorType newParameterFunction;
	
	_EventEnabledSolverType& solver;

	// value_type = true: value, will be constant afterwards
	// value_type = false: expression, still depend on others
	bool value_type;

   };
}

#endif
