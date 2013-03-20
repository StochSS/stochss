/******************************************************************************
 */

#ifndef _EXPRESSION_ACTION_FUNCTION_H_
#define _EXPRESSION_ACTION_FUNCTION_H_

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class ExpressionActionFunction
 {
	
 public:
        typedef typename _populationVectorType::value_type populationValueType;

	ExpressionActionFunction(std::string value): value(value)
	{};

	std::string operator()(double time, _populationVectorType& population) {
	  return this->value;
	}

 private:
	ExpressionActionFunction();

	std::string value;
 };
}

#endif
