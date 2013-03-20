#ifndef _WRITE_EQUILIBRIUM_CODE_H_
#define _WRITE_EQUILIBRIUM_CODE_H_
#include "ElementaryReaction.h"
#include "boost/numeric/ublas/vector.hpp"
#include "boost/numeric/ublas/matrix.hpp"
#include "boost/numeric/ublas/matrix_sparse.hpp"
#include <sstream>
#include <fstream>
#include <string>
#include "createConservationMatrix.h"
#include <ginac/ginac.h>
#include <cmath>
#include "StandardDriverUtilities.h"

//helper functions
template <typename num>
std::string num2string(num x) {
	std::stringstream ss;
	ss<<x;
	return ss.str();
}
std::string double2string(double x);

enum BracketType { parens, square };
std::string codify(std::string term, std::string var, BracketType bracket);

std::vector<std::vector<std::string> > dfdx(std::vector<std::string> f, std::size_t NumberOfSpecies);

typedef boost::numeric::ublas::matrix<double> ublas_matrix;
ublas_matrix createDenseStoichiometry(std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies);

std::string calculateConservationTermString(std::size_t speciesIndex,ublas_matrix& gamma);
std::string calculateConservationConstantString(std::size_t constantIndex,ublas_matrix& gamma);

void write_computeConservationConstantsCode(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies);
void write_computeDependentPopulationsCode(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies);

std::vector<std::string> createFstring(std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies);

void print_A_ElementCode(std::vector<std::vector<std::string> >& elementCode);
void print_b_ElementCode(std::vector<std::string>& elementCode);

//code to write code that will calculate the "A" matrix
//if reactions are a vfp, they should be the "reindexed" reactions
void write_A_code(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies);

void write_b_code(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies);

#endif
