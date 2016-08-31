/* nsm.h */
#ifndef NSM__H
#define NSM__H
#include "urdmemodel.h"

typedef struct {
  /* Create reaction rate matrix (Mreactions X Ncells) and total rate
     vector. In rrate we store all propensities for chemical rections,
     and in srrate the sum of propensities in every subvolume. */
  double *srrate, *rrate;
  /* Total diffusion rate vector (length Mcells). It will hold
     the total diffusion rates in each subvolume. */
  double *sdrate;
  //
  double *rtimes;
  int *node, *heap;
} nsm_sim_data;

double nsm_core(const urdme_model*model,int*xx,double tt,double tau_d,
              double*Ddiag,PropensityFun*rfun,int report_level,
              long int*total_reactions,long int*total_diffusion,int last_step_nsm,
              int is_first_step);

nsm_sim_data*get_nsm_sim_data(const urdme_model*model);
void destroy_nsm_sim_data(nsm_sim_data*data);
#endif /* NSM__H */

