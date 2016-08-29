
/* A. Hellander 2010-04-02.
   B. Drawert   2010-05-25 */


#include "dfsp.h"
#if 0//#ifdef  DFSP_NUM_THREADS  //this magic allows us to automatically switch to threaded code with a compile flag
#include "dfsp_diffusion_pthreads.c"
#else

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <math.h>
#include "propensities.h"
#include <gsl/gsl_math.h>
#include <gsl/gsl_rng.h>
#include <gsl/gsl_randist.h>


inline int linear_search(double *s,double re,int start,int stop)
{
	int i=0;
	for(i=start;i<stop;i++){
		if (s[i]>re){
	       break;
		}
	}
	return i;
}

inline int linear_search2(double *s,int nx,int *n, int start,int stop)
{
	int i=0,j;
	double re[nx];
	for (i=0; i<nx; i++) {
		n[i]=0;
		re[i]=gsl_rng_uniform(runif);
	}
	
	for(i=start;i<stop;i++){
		
		for (j=0; j<nx; j++) {
			if (s[i]>re[j]){
				n[j]=i;
				re[j]=2.0;
			}
		}
		
	}
	
	return i;
}


/* Find the diffusion direction using binary search */
inline int binary_search(double *s,double re,int start,int stop)
{
	
	int left=start,right=stop,mid;
	while(right > left){
		mid = (left+right)/2;
		if (s[mid] < re) {
			left = mid+1;
		}else {
		   right = mid;
		}
	}
	return right;
}

/* One timestep of dfsp diffusion, moving every molecule individually. */
//int dfsp_diffusion(int *xx, const size_t *irD, const size_t *jcD, const double *prD, int Ndofs,
//                   const double tau_d, const double error_tolerance, const int max_jump,const int report_level){
int dfsp_diffusion(int *xx, urdme_model *model,
                   const double tau_d, const double error_tolerance, const int max_jump,const int report_level,dfsp_table*table){
	
	int i,j,dof,to_dof,nx,start,stop; 
	//double cumsum;
	double rand;
    int Ndofs = model->Ncells*model->Mspecies;
	
    //dfsp_table*table=get_dfsp_lookuptable(model->irD,model->jcD,model->prD,Ndofs,tau_d,error_tolerance,max_jump,report_level);

    double tt=0.0;
	
	/* Need copy of state vector. */
	int *xtemp;
	xtemp = calloc(Ndofs,sizeof(int));
	memcpy(xtemp,xx,Ndofs*sizeof(int));

	
	//int depth = 0;
	//int nmol=0;
    while(tt<tau_d){
        for (dof=0;dof<Ndofs;dof++){
            /* Move one molecule at a time... */
            nx = xx[dof];
			
			start=table->jcD[dof];
			stop =table->jcD[dof+1];
			/*linear_search2(table->prD,nx,n,start,stop);
			for (j=0; j<nx;j++) {
				to_dof = table->irD[n[j]];
				if(dof!=to_dof){
                    // Update state 
                    xtemp[dof]--;
                    xtemp[to_dof]++;
			    }
			}*/
            
			for (j=0;j<nx;j++){
                //rand=drand48()
				rand = gsl_rng_uniform(runif);
                // Sample diffusion event 
                //i = linear_search(table->prD,rand,start,stop);
                i = binary_search(table->prD,rand,start,stop-1);
                to_dof = table->irD[i];
                if(dof!=to_dof){
                    // Update state 
                    xtemp[dof]--;
                    xtemp[to_dof]++;
			    }
            }
        }
    
		tt+=table->tau_d;
		memcpy(xx,xtemp,Ndofs*sizeof(int));
	}
		
	free(xtemp);
    return 1;
}
#endif //ifdef DFSP_NUM_THREADS
