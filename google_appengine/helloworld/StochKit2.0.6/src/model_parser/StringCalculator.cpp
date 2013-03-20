/*!
	\brief String Calculator

	This function takes a c++ math expression string as input, and output the value of the string.
*/
#include "StringCalculator.h"

namespace STOCHKIT
{

// string calculator
double StringCalculator::calculateString(std::string equation)
{
  std::string number;
  std::string subEquation;
  std::stack<double> operand_stack;
  std::stack<char> operator_stack;
  
  int error_catcher; // error_catcher = BADRESULT if an error happened
  
  operator_stack.push('#'); // indicate the bottom of the stack 
  
  // remove all spaces, convert all upper case letters to lower case letters
  for ( unsigned int i=0; i < equation.length(); ++i ){
    if ( equation.at(i) == ' ' ){
      equation.erase(equation.begin()+i);
      --i;
    } else if ( isupper(equation.at(i))){
      equation.at(i) = tolower(equation.at(i));
    }
  }

  // substitute all supported function with its shorter form for easier process
  size_t found;
  for ( unsigned int i=0; i< knownFunctions.functions.size(); ++i ) {
      found = equation.find(knownFunctions.functions[i].first);
      while( found!=std::string::npos ){
	   if( (found==0 || !isalpha(equation.at(found-1))) && ((found+knownFunctions.functions[i].first.size() != equation.size()) && !isalpha(equation.at(found+knownFunctions.functions[i].first.size()))) )
		   equation.replace(found, knownFunctions.functions[i].first.size(), knownFunctions.functions[i].second);
           found = equation.find(knownFunctions.functions[i].first, found+1);
      }
  }

  for( unsigned int index=0, end=0 ; index < equation.length(); ++index ){
    if(isdigit(equation.at(index)) || ( (equation.at(index) == '+' || equation.at(index) == '-'|| equation.at(index) == '.') && ((index == 0) || (!isdigit(equation.at(index-1))))) ){
      if( index != equation.length()-1 ){
	end = index + 1;
	while( (end < equation.length()) && (isdigit(equation.at(end)) || (equation.at(end) == '.')) )
	  ++end;
	if(end != equation.length()-1){
	  number = equation.substr(index, end-index);
	}
	else{
	  number = equation.substr(index, end+1-index);
	}
      }
      else{
	end = index + 1;
	number = equation.substr(index, 1);
      }
      operand_stack.push(atof(number.c_str()));
      index = end - 1;
    }
    else if( equation.at(index) == '(' ){
      operator_stack.push('#');
    }
    else if( equation.at(index) == ')' ){
      while( (error_catcher = popOperator(operator_stack, operand_stack)) ){
	if( error_catcher == BADRESULT ){
	  std::cerr << "StochKit ERROR (StringCalculator::calculateString): while calculating equation " + equation + "\n";
	  return BADRESULT;
	}
      }
    }
    else if( equation.at(index) == 'x' ){
      operator_stack.push('x');
    }
    else if( equation.at(index) == 'e' ){
      operator_stack.push('e');
    }
    else if( equation.at(index) == 'm' ){
      operator_stack.push('m');
    }
    else if( equation.at(index) == 'n' ){
      operator_stack.push('n');
    }
    else if( equation.at(index) == ',' ){
      while( operator_stack.top() != '#' ){
	error_catcher = popOperator(operator_stack, operand_stack);
	if( error_catcher == BADRESULT ){
	  std::cerr << "StochKit ERROR (StringCalculator::calculateString): while calculating equation " + equation + "\n";
	  return BADRESULT;
	}
      }
    }
    else if( equation.at(index) == '^' ){
      while( (operator_stack.top() == 'e') || operator_stack.top() == 'x' || operator_stack.top() == '^' || operator_stack.top() == 'm' || operator_stack.top() == 'n' ){
	error_catcher = popOperator(operator_stack, operand_stack);
	if( error_catcher == BADRESULT ){
	  std::cerr << "StochKit ERROR (StringCalculator::calculateString): while calculating equation " + equation + "\n";
	  return BADRESULT;
	}
      }
      operator_stack.push(equation.at(index));
    }
    else if( (equation.at(index) == '*') || (equation.at(index) == '/') || equation.at(index) == '%' ){
      while( (operator_stack.top() == 'e') || (operator_stack.top() == 'x') || (operator_stack.top() == '^') || operator_stack.top() == 'm' || operator_stack.top() == 'n' || (operator_stack.top() == '*') || (operator_stack.top() == '/') || operator_stack.top() == '%'){
	error_catcher = popOperator(operator_stack, operand_stack);
	if( error_catcher == BADRESULT ){
	  std::cerr << "StochKit ERROR (StringCalculator::calculateString): while calculating equation " + equation + "\n";
	  return BADRESULT;
	}
      }             
      operator_stack.push(equation.at(index));
    }
    else if( (equation.at(index) == '+') || (equation.at(index) == '-') ){
      while( operator_stack.top() != '#' ){
	error_catcher = popOperator(operator_stack, operand_stack);
	if( error_catcher == BADRESULT ){
	  std::cerr << "StochKit ERROR (StringCalculator::calculateString): while calculating equation " + equation + "\n";
	  return BADRESULT;
	}
      }
      operator_stack.push(equation.at(index));
    }
    else{
      std::cerr << "StochKit ERROR (StringCalculator::calculateString): character " + equation.substr(index, 1) + " in equation \"" + equation + "\" not recognized\n";
      return BADRESULT;
    }
  }
  
  while(popOperator(operator_stack, operand_stack) == 1);
  if(!operator_stack.empty()){
    std::cerr << "StochKit ERROR (StringCalculator::calculateString): while calculating equation " + equation + "\n";
    return BADRESULT;
  }
  
  return operand_stack.top();
}

int StringCalculator::popOperator(std::stack<char>& operator_stack, std::stack<double>& operand_stack)
{
  char cur_operator;
  double first_operand, second_operand, result;
  if(operator_stack.empty()){
    std::cerr << "StochKit ERROR (StringCalculator::popOperator): operator stack is empty, please check your equation" << std::endl;
    return BADRESULT;
  }
  cur_operator = operator_stack.top();
  operator_stack.pop();
  if(cur_operator == '#'){
    return 0;
  }
  else if(cur_operator == 'x'){
    if(operand_stack.empty()){
      std::cerr << "StochKit ERROR (StringCalculator::popOperator): operand stack is empty, please check your equation" << std::endl;
      return BADRESULT;
    }
    result = exp(operand_stack.top());
    operand_stack.pop();
    operand_stack.push(result);
    return 1;
  }
  else{
    if(operand_stack.empty()){
      std::cerr << "StochKit ERROR (StringCalculator::popOperator): operand stack is empty, please check your equation" << std::endl;
      return BADRESULT;
    }
    second_operand = operand_stack.top();
    operand_stack.pop();
    if(operand_stack.empty()){
      std::cerr << "StochKit ERROR (StringCalculator::popOperator): operand stack is empty, please check your equation" << std::endl;
      return BADRESULT;
    }
    first_operand = operand_stack.top();
    operand_stack.pop();
    result = calculate(cur_operator, first_operand, second_operand);
    if(result==BADRESULT){
      return BADRESULT;
    }
    operand_stack.push(result);
    return 1;
  }
}
	
double StringCalculator::calculate(char cur_operator, double first_operand, double second_operand)
{
  switch(cur_operator){
  case '+':
    return (first_operand + second_operand);
  case '-':
    return (first_operand - second_operand);
  case '*':
    return (first_operand * second_operand);
  case '/':
    if( second_operand != 0){
      return (first_operand / second_operand);
    }
    else{
      std::cerr << "StochKit ERROR (StringCalculator::calculate): denominator is 0!\n";
      return BADRESULT;
    }
  case '%':
    return (double)((int)first_operand % (int)second_operand);
  case '^':
    return pow(first_operand, second_operand);
  case 'e':
    return first_operand * pow(10,second_operand);
  case 'm':
    return std::max(first_operand, second_operand);
  case 'n':
    return std::min(first_operand, second_operand);
  default:
    std::cerr << "StochKit ERROR (StringCalculator::calculate): unrecognized operator, this should never happen!\n";
    return BADRESULT;
  }
}

}
