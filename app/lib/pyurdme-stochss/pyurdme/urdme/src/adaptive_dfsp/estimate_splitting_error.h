#ifndef ESTIMATE_SPLITTING_ERROR_H
#define ESTIMATE_SPLITTING_ERROR_H

#include "urdmemodel.h"

void estimate_splitting_error(const urdme_model *model,int *x, double *ddiag,double *deltaex);

void estimate_splitting_error_brute(const urdme_model *model,int *x, double *ddiag,double *deltaex);
void estimate_splitting_error_mean(const urdme_model *model,int *x, double *ddiag,double *deltaex);

double estimate_splitting_error_mean_2(const urdme_model *model,int *x, double *ddiag,double *deltaex);

void estimate_splitting_error_mean_opt(const urdme_model *model,int *x, double *ddiag,double *deltaex);

void estimate_splitting_error_mean_pde(const urdme_model *model,int *x, double *ddiag,double *deltaex);
void estimate_splitting_error_var(const urdme_model *model,int *x, double *ddiag,double *deltaex);


#endif
