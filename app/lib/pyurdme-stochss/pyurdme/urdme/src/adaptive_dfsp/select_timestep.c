#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <math.h>
/* urdme */ 
#include "propensities.h"
#include "report.h"
#include "dfsp.h"
#include "nsm.h"
/* Adaptive dfsp */
#include "estimate_splitting_error.h"
#include "select_timestep.h"
/* GSL */
#include <gsl/gsl_math.h>
#include <gsl/gsl_rng.h>
#include <gsl/gsl_randist.h>


/* 
 
   min_dfsp_timestep controls the strategy for falling back to NSM by
   estimating the smallest timestep during which DFSP is faster than NSM.
 
   We estimate that DFSP beats NSM (on average) 
   when E[#diffusion events] > total #molecules:
 
   C_nsm*sum_i( D_i*X_i*tau )  > C_dfsp*sum_i (x_i), i=1...Ndofs,
 
   Where C_nsm and C_dfsp are computer, implementation and problem dependent constants that 
   tells us the cost of executing a single diffusion event in NSM and the cost of sampling and moving
   one molecule in dfsp, respectively.
 
   Importantly: 
 
   1.) C_nsm increases with increaing mesh resolution (but only logarithmically),
       and so do (D_i*X_i)
   while D_dfsp remains reasonably constant, aside from e.g. cache effects
 
   2.) C_dfsp decreases with the number of threads in a parallel implementation
       of the DFSP step. So could C_nsm, but the parallel performance a would be much worse.
 
 
   So for a threaded implementation of DFPS with an parallel efficiency of a %, 
   we get something like
 
   C_nsm*sum_i( D_i*X_i*tau )  > C_dfsp*sum_i (x_i)/(a*NUM_CORES), i=1...Ndofs,

 
   TODO: Try to figure out someting more about C_nsm and C_dfsp. It seems
         reasonable to assume that C_nsm > C_dfsp. 
 
 */
#define DISABLE_NSM_FALLBACK
double min_dfsp_timestep(int*xx,const urdme_model*model,const double*ddiag){
    
#ifdef DISABLE_NSM_FALLBACK
    return 0.0;
#else
    double C_nsm=1.0,C_dfsp = 1.0;
    
	double sum=0.0,sumx=0.0;
    int Ndofs = model->Ncells*model->Mspecies;
    int i;
    for(i=0; i<Ndofs; i++){
        sum+=ddiag[i]*xx[i];
		sumx+=xx[i];
    }
    if(sum==0.0) return sum;
	return sumx*C_dfsp/(sum*C_nsm);
#endif
    
}

// find timescale of one reaction event in the system
double min_rxn_timestep(int*xx,double tt,const urdme_model*model,PropensityFun*rfun){
    // Calculate the propensity for every reaction and every subvolume. 
    int i,j;
    double sum=0.0;
    for (i=0; i<model->Ncells; i++) {
        for (j=0; j<model->Mreactions; j++) {
            sum+=(*rfun[j])(&xx[i*(model->Mspecies)],tt, model->vol[i], &(model->data[i*model->dsize]), model->sd[i]);
            //sum+=call_propensity(j,&xx[i*(model->Mspecies)],tt, model->vol[i], &(model->data[i*model->dsize]), model->sd[i]);
        }
    }
    return (1/sum);
}


/* 
   
 This function takes the estimated error for each species in each voxel and computes a proposed
 timestep for the next step based on the following strategy:
   
 TODO : THE STRATEGY
   
*/

double compute_timestep(int *x,double *deltaex,double AbsTol,double RelTol, double dtmax,int Ncells,int Mspecies,double *vol)
{
 
 int j,spec;  
 double dt = dtmax;
 double dtc = 0.0;
 double normerr[Mspecies];
 double normx[Mspecies];
 
// /* Compute the norm of the error */
// #if defined(ERROR_LINF) // Not Implemented yet. 	
//   norm_l2(x,deltaex,vol,Ncells,Mspecies,normerr,normx);
// #elif defined(ERROR_L1)
//   norm_l1(x,deltaex,vol,Ncells,Mspecies,normerr,normx);
// #elif defined(ERROR_L2)	 
//   norm_l2(x,deltaex,vol,Ncells,Mspecies,normerr,normx);
// #else 
//   /* L_1 by default */
   norm_l1(x,deltaex,vol,Ncells,Mspecies,normerr,normx);
// #endif 

   /* Select the timestep. */
   for (spec=0; spec<Mspecies; spec++) { 
       dtc = sqrt(fmax(2.0*AbsTol/normerr[spec],2.0*RelTol*normx[spec]/normerr[spec]));
       /* dtc can become 0.0 is normerr[spec] = 0.0 and/or normx[spec]=0.0  and AbsTol = 0.0*/
       if (isfinite(dtc)&&!isnan(dtc)){
           if(dtc<dt && dtc > 0.0)
               dt = dtc; 
       }
   }
   
   return dt;		 
}


void norm_l1(int *x,double *err,double *vol,int Ncells,int Mspecies, double *normerr,double *normx)
{
	
	int i,j;	
	
	for(j=0;j<Mspecies;j++){
		normerr[j]=0.0;
		normx[j]=0.0; 
	}
	
	for (j=0;j<Mspecies;j++){
		for(i=0;i<Ncells;i++){
			normerr[j]+=(vol[i]*fabs(err[i*Mspecies+j]));
			normx[j]+=(vol[i]*fabs(x[i*Mspecies+j]));
		}
	}
	
}

void norm_l2(int *x,double *err,double *vol,int Ncells,int Mspecies, double *normerr,double *normx)
{
   
  int i,j;	
  
  for(j=0;j<Mspecies;j++){
    normerr[j]=0.0;
    normx[j]=0.0; 
  }
  
  for (j=0;j<Mspecies;j++){
      for(i=0;i<Ncells;i++){
	  normerr[j]+=(vol[i]*err[i*Mspecies+j]*err[i*Mspecies+j]);
	  normx[j]+=(vol[i]*x[i*Mspecies+j]*x[i*Mspecies+j]);
      }
  }
  
  for (j=0;j<Mspecies;j++){
    normerr[j]=sqrt(normerr[j]);
    normx[j]=sqrt(normx[j]);
  }
  
}


