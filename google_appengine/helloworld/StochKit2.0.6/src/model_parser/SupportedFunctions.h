#include <vector>
#include <string>
#include <utility>
#include <iostream>

#ifndef _SUPPORTEDFUNCTIONS_H_
#define _SUPPORTEDFUNCTIONS_H_

namespace STOCHKIT
{
 class SupportedFunctions
 {
 public:
	std::vector<std::pair<std::string, std::string> > functions; // first is the function name, second is the shorter for function name for easier process in StringCalculator

	SupportedFunctions(){
		functions.clear();
		functions.push_back(std::make_pair("exp","x"));
		functions.push_back(std::make_pair("min","n"));
		functions.push_back(std::make_pair("max","m"));
	}
 };
}

#endif
