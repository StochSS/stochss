/******************************************************************************
 */

#ifndef _FIXED_VALUE_ACTION_FUNCTION_H_
#define _FIXED_VALUE_ACTION_FUNCTION_H_

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class FixedValueActionFunction
 {
	
 public:
        typedef typename _populationVectorType::value_type populationValueType;

	FixedValueActionFunction(populationValueType value): value(value)
	{};

	populationValueType operator()(double time, _populationVectorType& population) {
	  return this->value;
	}

 private:
	FixedValueActionFunction();

	populationValueType value;
 };
}

#endif
