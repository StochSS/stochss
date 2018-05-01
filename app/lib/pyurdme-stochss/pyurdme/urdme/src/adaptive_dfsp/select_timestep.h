#ifndef SELECT_TIMESTEP_H
#define SELECT_TIMESTEP_H
#include "urdmemodel.h"
#include "propensities.h"

double compute_timestep(int *x,double *deltaex,double AbsTol,double RelTol, double dtmax,int Ncells,int Mspecies,double *vol);

void norm_l1(int *x,double *err,double *vol,int Ncells,int Mspecies, double *normerr,double *normx);
void norm_l2(int *x,double *err,double *vol,int Ncells,int Mspecies, double *normerr,double *normx);


double min_dfsp_timestep(int*xx,const urdme_model*model,const double*ddiag);
double min_rxn_timestep(int*xx,double tt,const urdme_model*model,PropensityFun*rfun);

#endif
