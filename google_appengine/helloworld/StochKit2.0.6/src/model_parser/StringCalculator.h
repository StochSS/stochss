/*!
	\brief String Calculator

	This function takes a c++ math expression string as input, and output the value of the string.
*/

#ifndef _STRINGCALCULATOR_H_
#define _STRINGCALCULATOR_H_

#ifndef BADRESULT
#define BADRESULT -32768
#endif

#include <iostream>
#include <stdio.h>
#include <string>
#include <stdlib.h>
#include <ctype.h>
#include <math.h>
#include <algorithm>
#include <vector>
#include <stack>
#include <limits>
#include "SupportedFunctions.h"

namespace STOCHKIT
{
 class StringCalculator
 {
	
 public:
	// string calculator
	double calculateString(std::string equation);

 private:
	SupportedFunctions knownFunctions;

	int popOperator(std::stack<char>& operator_stack, std::stack<double>& operand_stack);
	
	double calculate(char cur_operator, double first_operand, double second_operand);
 };
}

#endif
