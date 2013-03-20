#ifndef _CREATE_CONSERVATION_MATRIX_H_
#define _CREATE_CONSERVATION_MATRIX_H_
#include "boost/numeric/ublas/matrix.hpp"
#include <gsl/gsl_matrix.h>
#include <gsl/gsl_linalg.h>

typedef boost::numeric::ublas::matrix<double> ublas_matrix;

//mimic MATLAB's eps function
double eps(double X);

std::size_t rank(ublas_matrix& NU);

void rref(ublas_matrix& M);

//NU is stoichiometry matrix
ublas_matrix createConservationMatrix(ublas_matrix& NU);

#endif
