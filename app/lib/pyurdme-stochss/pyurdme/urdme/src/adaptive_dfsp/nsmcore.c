/* nsmcore.c */


#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "propensities.h"
#include "nsm.h"
#include "binheap.h"
#include "report.h"

#include "dfsp.h"

#include <math.h>
//Workaround:
#ifndef NAN
#define NAN (0.0/0.0)
#endif 

//Workaround:
#ifndef INFINITY
#define INFINITY (1.0/0.0)
#endif 


nsm_sim_data*get_nsm_sim_data(const urdme_model*model){
    static nsm_sim_data*N;
    static int initialized=0;
    if(!initialized){
        initialized=1;
        N = (nsm_sim_data*)malloc(sizeof(nsm_sim_data));
        N->rrate =(double *)calloc(model->Mreactions*model->Ncells,sizeof(double));
        N->srrate=(double *)calloc(model->Ncells,sizeof(double));
        N->sdrate=(double *)calloc(model->Ncells,sizeof(double));
        /* Create binary (min)heap. */
        N->rtimes=(double *)malloc(model->Ncells*sizeof(double));
        N->node=(int *)malloc(model->Ncells*sizeof(int));
        N->heap=(int *)malloc(model->Ncells*sizeof(int));
    }
    return N;
}

void destroy_nsm_sim_data(nsm_sim_data*N){
  free(N->heap);
  free(N->node);
  free(N->rtimes);
  free(N->sdrate);
  free(N->srrate);
  free(N->rrate);
  free(N);
}

double nsm_core(const urdme_model*model,int*xx,double tt,double tau_d,
            double*Ddiag,PropensityFun*rfun,int report_level,
            long int*total_reactions,long int*total_diffusion,int last_step_nsm, int is_first_step)
  /*const size_t *irD, const size_t *jcD, const double *prD,
    const int *u0, const size_t *irN, const size_t *jcN, const int *prN,
    const size_t *irG, const size_t *jcG, const double *tspan, const size_t tlen, int *U,
    const double *vol, const double *data, const int *sd, const size_t Ncells,
    const size_t Mspecies, const size_t Mreactions, const size_t dsize,
  long int total_reactions=0;
  long int total_diffusion=0;	
    */
{
  double told;
  double tend = tt+tau_d;
  double rdelta, rrdelta;
  double rand, cum, old;
  double old_rrate=0.0, old_drate=0.0;
  double totrate;
  int dof,col;
	
  int subvol, event, re, spec, errcode=0;
  size_t i, j, it=0;
  size_t to_node, to_vol=0;
  const size_t Ndofs=model->Ncells*model->Mspecies;


  nsm_sim_data*N=get_nsm_sim_data(model);

  if(!last_step_nsm){ // initialize only if necessary
    #ifdef DFSP_PROFILER
    profiler_startimer("nsm-initialization");
    #endif

    /* Calculate the propensity for every reaction and every subvolume. Store
    the sum of the reaction intensities in each subvolume in srrate. */
    for (i=0; i<model->Ncells; i++) {
        N->srrate[i]=0.0;
        for (j=0; j<model->Mreactions; j++) {
            N->rrate[i*(model->Mreactions)+j]=
            (*rfun[j])(&xx[i*(model->Mspecies)],tt, model->vol[i], &(model->data[i*model->dsize]), model->sd[i]);
            N->srrate[i]+=N->rrate[i*(model->Mreactions)+j];
        }
    }
	  

    /* Calculate the total diffusion rate for each subvolume. */
    for(i=0; i<model->Ncells; i++) {
        N->sdrate[i]=0.0;
        for(j=0; j<model->Mspecies; j++){
            N->sdrate[i]+=Ddiag[i*(model->Mspecies)+j]*xx[i*(model->Mspecies)+j];
        }
    }


    /* Calculate times to next event (reaction or diffusion) 
     in each subvolume and initialize heap. */
    for (i=0; i<model->Ncells; i++) {
        N->rtimes[i]=-log(1.0-drand48())/(N->srrate[i]+N->sdrate[i])+tt;
        N->node[i]=i;
        N->heap[i]=i;
    }
    initialize_heap(N->rtimes, N->node, N->heap, model->Ncells);
    #ifdef DFSP_PROFILER
    profiler_stoptimer();
    #endif

  }
	//FILE *file;
	//file = fopen("reactimes.txt","w");	
	
  int total_events = 0;

  /* Main loop. */
  #ifdef DFSP_PROFILER
  profiler_startimer("nsm");
  #endif
  while(tt < tend){
    // Break if the initial step is complete.
    if (is_first_step) {
        total_events++;
        if(total_events > 10){
            printf("Initial NSM step complete after %es\n",tt);
            tau_d = tt;
            break;
        }
    }
    /* Get the subvolume in which the next event occurred.
	   This subvolume is on top of the heap. */
    told=tt;
    tt=N->rtimes[0];
    subvol=N->node[0];
    if(tt>tend){break;}
	/* First check if it is a reaction or a diffusion event. */
	totrate = N->srrate[subvol]+N->sdrate[subvol];  
	rand = drand48(); 
	  
    if (rand*totrate <= N->srrate[subvol]) {
	  /* Reaction event. */
      event=0;
      /* a) Determine the reaction re that occur (direct SSA). */
	  rand*=totrate;
	
	  for (re=0, cum=N->rrate[subvol*model->Mreactions]; re < model->Mreactions && rand>cum;
		   re++, cum+=N->rrate[subvol*model->Mreactions+re]);

      /* b) Update the state of the subvolume 'subvol' and sdrate[subvol]. */
      for (i=model->jcN[re]; i<model->jcN[re+1]; i++) {
          xx[subvol*model->Mspecies+model->irN[i]]+=model->prN[i];
		  if (xx[subvol*model->Mspecies+model->irN[i]]<0){
			errcode=1;
		  }
          N->sdrate[subvol]+=Ddiag[subvol*model->Mspecies+model->irN[i]]*model->prN[i]; 
      }

      /* c) Recalculate srrate[subvol] using dependency graph. */
      for (i=model->jcG[model->Mspecies+re], rdelta=0.0; i<model->jcG[model->Mspecies+re+1]; i++) {
        
		old=N->rrate[subvol*model->Mreactions+model->irG[i]];
        j=model->irG[i];
		rdelta+=(N->rrate[subvol*model->Mreactions+j]=(*rfun[j])(&xx[subvol*model->Mspecies],
				 tt, model->vol[subvol], &(model->data[subvol*model->dsize]), model->sd[subvol]))-old;
      }
      N->srrate[subvol]+=rdelta;
		
	  *total_reactions=*total_reactions+1;
	 // fprintf(file,"%f\n",tt);	
    }
	else {
		
      /* Diffusion event. */
      event=1;
	
      /* a) Determine which species... */
	  rand*=totrate;	
      rand-=N->srrate[subvol];
		
	  for (spec=0, dof=subvol*model->Mspecies, cum=Ddiag[dof]*xx[dof]; spec < model->Mspecies && rand>cum;
           spec++, cum+=Ddiag[dof+spec]*xx[dof+spec]);
	  	  
      /* b) and then the direction of diffusion. */
		
	  col=dof+spec;
      rand=drand48()*Ddiag[col];

      /* Search for diffusion direction. */
      for (i=model->jcD[col], cum=0.0; i<model->jcD[col+1]; i++)
        if (model->irD[i]!=col && (cum+=model->prD[i])>rand)
           break;
		
      /* paranoia fix: */
      if (i>=model->jcD[col+1]) i--;

      to_node=model->irD[i];
      to_vol=to_node/(model->Mspecies);

      /* c) Execute the diffusion event (check for negative elements). */
      xx[subvol*model->Mspecies+spec]--;
	  if (xx[subvol*model->Mspecies+spec]<0){
		  errcode=1;
	  }
      xx[to_node]++;

      /* Save reaction and diffusion rates. */
      old_rrate=N->srrate[to_vol];
      old_drate=N->sdrate[to_vol];

      /* Recalculate the reaction rates using dependency graph G. */
      for (i=model->jcG[spec], rdelta=0.0, rrdelta=0.0; i<model->jcG[spec+1]; i++) {
		  
        old=N->rrate[subvol*model->Mreactions+model->irG[i]];
        j=model->irG[i];

          rdelta+=(N->rrate[subvol*model->Mreactions+j]=(*rfun[j])(&xx[subvol*model->Mspecies],
				   tt, model->vol[subvol], &(model->data[subvol*model->dsize]), model->sd[subvol]))-old;

          old=N->rrate[to_vol*model->Mreactions+j];
		  
          rrdelta+=(N->rrate[to_vol*model->Mreactions+j]=(*rfun[j])(&xx[to_vol*model->Mspecies],
				    tt, model->vol[to_vol], &(model->data[to_vol*model->dsize]), model->sd[to_vol]))-old;
        
      }
		
      N->srrate[subvol]+=rdelta;
      N->srrate[to_vol]+=rrdelta;

      /* Adjust diffusion rates. */
      N->sdrate[subvol]-=Ddiag[subvol*model->Mspecies+spec];
      N->sdrate[to_vol]+=Ddiag[to_vol*model->Mspecies+spec];
		
	  *total_diffusion=*total_diffusion+1;
    
	}

    /* Compute time to new event for this subvolume. */
	
	totrate = N->srrate[subvol]+N->sdrate[subvol];  
    if(totrate>0.0)
      N->rtimes[0]=-log(1.0-drand48())/totrate+tt;
    else
      N->rtimes[0]=INFINITY;
    
    /* Update the heap. */
    update(0, N->rtimes, N->node, N->heap, model->Ncells);

    /* If it was a diffusion event, also update the other affected
       node. */
	
    if(event) {
	  totrate = N->srrate[to_vol]+N->sdrate[to_vol]; 	
      if(totrate > 0.0) {
        if (!isinf(N->rtimes[N->heap[to_vol]]))
          N->rtimes[N->heap[to_vol]]=(old_rrate+old_drate)/totrate*(N->rtimes[N->heap[to_vol]]-tt)+tt;
        else{
		   N->rtimes[N->heap[to_vol]]=-log(1.0-drand48())/totrate+tt;
		}
      } 
	  else
        N->rtimes[N->heap[to_vol]]=INFINITY;

      update(N->heap[to_vol], N->rtimes, N->node, N->heap, model->Ncells);

	} 
	
    /* Check for error codes. */
    if (errcode) {
      /* Cannot continue. Clear this solution and exit. */
      break;
    }
	  	  
  }
  #ifdef DFSP_PROFILER
  profiler_stoptimer();
  #endif

  return tau_d;

 // fclose(file);	 
}

