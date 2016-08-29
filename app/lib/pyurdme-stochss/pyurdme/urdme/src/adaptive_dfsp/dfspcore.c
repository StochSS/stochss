/* dfsp.c */
/* A. Hellander  2010-04-05. */
/* B. Drawert    2010-05-25. */

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

//#define OUTPUT_ALL
//#define RECORD_TIMESTEPS
//===================================
//===================================

double take_step(int *xx,const urdme_model*model,double tt,int last_tspan_ndx,
                    double*tau_d_in,double error_tolerance,int max_jump,int report_level,
                    long int*total_reactions,long int*total_diffusion,PropensityFun*rfun,
                    double*ddiag,double*deltaex,int adaptive){
   
    //--------------------------------------
    /* TODO: Move to global configure something */
    double AbsTol=0.0, RelTol = error_tolerance;
    //
    static int steps_since_last_check=0;
    int max_steps_between_check=10;
    //--------------------------------------

    static int last_step_nsm=0;
    static int nsm_step_cnt=0;
    static double min_tau=0.0;
    //if(min_tau==0){
    if(adaptive){
        min_tau=min_dfsp_timestep(xx,model,ddiag);
        if(report_level>1)printf("Min tauD=%e\n",min_tau);
    }
    //----------------------------------------
    double tau_d = *tau_d_in;
    int Ndofs = model->Ncells*model->Mspecies;
    //----------------------------------------
    
    double dtmax= (model->tspan[last_tspan_ndx+1] - model->tspan[last_tspan_ndx]);
    //printf("dtmax[%e] = (model->tspan[last_tspan_ndx=%i+1]=%e - model->tspan[last_tspan_ndx]=%e)\n",dtmax,last_tspan_ndx,model->tspan[last_tspan_ndx+1],model->tspan[last_tspan_ndx]);
    if (dtmax < 0.0)
        dtmax = 1.0;
    int k;
	int NE = 1;
	
    //----------------------------------------
    if(adaptive && tau_d < 0){
        if(1){
            //########################
            // Take first step using NSM then calculate the next tau
            tau_d = 2.0*min_tau;
            if(tau_d==0.0){
                tau_d = min_rxn_timestep(xx,tt,model,rfun); //take a step on the scale of one reaction
                printf("min_rxn_timestep=%e\n",tau_d);
            }
            if(tau_d>dtmax) tau_d=dtmax;

            if(report_level>1){printf("Using NSM for the first timestep tau_d=%e dtmax=%e\n",tau_d,dtmax);}
            tau_d = nsm_core(model,xx,tt,tau_d,ddiag,rfun,report_level,total_reactions,total_diffusion,last_step_nsm,1);
            last_step_nsm=1;
            nsm_step_cnt++;
            /* Compute the intial timestep. */
			#ifdef DFSP_PROFILER
			profiler_startimer("estimate error");
			#endif
            estimate_splitting_error(model,xx,ddiag,deltaex);
			#ifdef DFSP_PROFILER
			profiler_stoptimer();
			#endif
            if(report_level>1){printf("\testimate_splitting_error_mean() done");}
			#ifdef DFSP_PROFILER
			profiler_startimer("compute timestep");
			#endif
            *tau_d_in = compute_timestep(xx,deltaex,AbsTol,RelTol,dtmax,model->Ncells,model->Mspecies,model->vol);
			#ifdef DFSP_PROFILER
			profiler_stoptimer();
			#endif
            if(report_level>1){printf("\ttau_d=%e\n",*tau_d_in);}
            return tau_d;
            //########################
        }else{
            if(report_level>1){printf("Automatically selecting the first timestep\n");}
            /* Compute the intial timestep. */
            estimate_splitting_error(model,xx,ddiag,deltaex);
            if(report_level>1){printf("\testimate_splitting_error_mean() done");}
            tau_d = compute_timestep(xx,deltaex,AbsTol,RelTol,dtmax,model->Ncells,model->Mspecies,model->vol);
            if(report_level>1){printf("\ttau_d=%e\n",tau_d);}
        }
    }
    //--------------------------------------
    if(tau_d <= min_tau){
        // Take step with NSM of size 'min_tau'
        tau_d = 2.0*(nsm_step_cnt+1)*min_tau;
        if(tau_d<min_tau) tau_d=min_tau;
        if(tau_d>dtmax) tau_d=dtmax;
        if(report_level>1){printf("NSM step tau_d=%e\t\tt=%e\n",tau_d,tt);}
        tau_d = nsm_core(model,xx,tt,tau_d,ddiag,rfun,report_level,total_reactions,total_diffusion,last_step_nsm,0);
        last_step_nsm=1;
        nsm_step_cnt++;
    }else{
        /* First order splitting... */ 
        if(report_level>1){printf("DFSP step tau_d=%e\t\tt=%e\n",tau_d,tt);}
        last_step_nsm=0;
        nsm_step_cnt=0;
		// get table
		#ifdef DFSP_PROFILER
		profiler_startimer("lookup table");
		#endif
		dfsp_table*l_table=get_dfsp_lookuptable(model,tau_d,error_tolerance,max_jump,report_level);
		#ifdef DFSP_PROFILER
		profiler_stoptimer();
		#endif
        /* do dfsp diffusion (one full timestep),  */
		#ifdef DFSP_PROFILER
		profiler_startimer("diffusion");
		#endif
        //fprintf(stderr,"Diffusion Step\n");
        //*total_diffusion += dfsp_diffusion(xx,model->irD,model->jcD,model->prD,Ndofs,tau_d,error_tolerance,max_jump,report_level);
        *total_diffusion += dfsp_diffusion(xx,model,tau_d,error_tolerance,max_jump,report_level,l_table);
		#ifdef DFSP_PROFILER
		profiler_stoptimer();
		#endif
        /* and then reactions (one full timestep) starting with xx. */
		#ifdef DFSP_PROFILER
		profiler_startimer("reaction");
		#endif
        *total_reactions += dfsp_reactions(xx,model,rfun, tau_d, tt );	
		#ifdef DFSP_PROFILER
		profiler_stoptimer();
		#endif
	}
    //--------------------------------------
    if(adaptive){
        steps_since_last_check++;
        if( steps_since_last_check > max_steps_between_check ){
            steps_since_last_check=0;

            /* TODO: Make the stretching factor (prensently 2.0) a variable and try to 
               empirically find the "best" value for it. */
                     
            if(report_level>1){printf("Selecting the next timestep\n");}
            
            /* Compute the intial timestep. */
			#ifdef DFSP_PROFILER
			profiler_startimer("estimate error");
			#endif
            estimate_splitting_error(model,xx,ddiag,deltaex);
			#ifdef DFSP_PROFILER
			profiler_stoptimer();
			#endif
            
            double theta,theta_sgn;
            int theta_arg;
			#ifdef DFSP_PROFILER
			profiler_startimer("compute timestep");
			#endif
            double tau_d_new = compute_timestep(xx,deltaex,AbsTol,RelTol,dtmax,model->Ncells,model->Mspecies,model->vol);
			#ifdef DFSP_PROFILER
			profiler_stoptimer();
			#endif
            if(report_level>1){printf("\testimate_splitting_error_mean() done, tau=%e",tau_d_new);}
          
			#ifdef DFSP_PROFILER
			profiler_startimer("accept timestep");
			#endif
            if(isfinite(tau_d_new)){
            
                theta = log( tau_d_new / tau_d ) / log(2.0);  // log2(t_new/t_old)
                theta_sgn = (theta >= 0) ? 1.0 : -1.0;
                if(theta_sgn>0){
                    theta_arg = floor(fabs(theta))*theta_sgn;
                }else{
                    theta_arg = ceil(fabs(theta))*theta_sgn;
                }
                *tau_d_in = tau_d*pow(2.0,theta_arg);
             }else{
              exit(-2);
             }
			#ifdef DFSP_PROFILER
			profiler_stoptimer();
			#endif
            //################################################
            if(report_level>1){printf("\ttau_d=%e\n",*tau_d_in);}
            if(*tau_d_in > tau_d_new){ 
                printf("ERROR: selected a tau that violates the error criteria. \n");
                printf("\ttheta=%e; sgn=%e; arg=%i; 2^arg=%e;\n",theta,theta_sgn,theta_arg,pow(2,theta_arg));
                printf("\ttau_d=%e;  tau_d_new=%e;  tau_d_in=%e;\n",tau_d,tau_d_new,*tau_d_in);
                exit(1);
            }
            //################################################
        //}else{
        //    printf("not checking error this step tt=%e\n",tt);
        }
        
    }
    //--------------------------------------
    return tau_d;
}

void dfsp_core(urdme_model *model, urdme_output_writer *writer)
{
    int report_level = *(int *)model->extra_args[0];
    double tau_d_in = *(double *)model->extra_args[1];
    int max_jump = (int) *(double *)model->extra_args[2];
    double error_tolerance = *(double *)model->extra_args[3];
    int *U;

	int nnz;
    long int total_reactions=0;
    long int total_diffusion=0;
    int tlen = model->tlen;
	
	double tt,tend;
	tt =   model->tspan[0];
	tend = model->tspan[model->tlen-1];

	int Ndofs = model->Ncells*model->Mspecies;
    U = (int*) malloc(model->tlen*Ndofs*sizeof(int));

	PropensityFun *rfun;
	rfun =  ALLOC_propensities();

    int *xx;
    xx = malloc(Ndofs*sizeof(int));
    memcpy(xx,model->u0,Ndofs*sizeof(int));
	
    /* Number of non-zeros entries in diffusion matrix. */
    nnz = model->jcD[Ndofs];
    
    //----------------------------------------
    /* The diagonal value of the D-matrix is used frequently. 
        For efficiency, we store the negative of D's diagonal 
        in ddiag. */
    double *ddiag;
    int i,j;
    ddiag=(double *)malloc(Ndofs*sizeof(double));
    for (i=0; i<Ndofs; i++) {
        ddiag[i]=0.0;
        for (j=model->jcD[i]; j<model->jcD[i+1]; j++)
            if (model->irD[j]==i) ddiag[i]=-model->prD[j];
    }
    //----------------------------------------
    double *deltaex;
    deltaex = calloc(Ndofs,sizeof(double));
    //----------------------------------------
    int adaptive=0;
    if(tau_d_in<0){ adaptive=1; }
    //----------------------------------------
    ReportFun report;
    if (report_level)
       report=&reportFun1;
    else
        report=NULL;
	
    //----------------------------------------
    /* main loop */
    //----------------------------------------
	
	
    double tau_d=tau_d_in;
	int it=0;
	
	#if defined(RECORD_TIMESTEPS)
	FILE  *timesteps_fd;
	timesteps_fd = fopen("adfsp_timesteps.txt","w+");
	printf("writing to file 'adfsp_timesteps.txt'\n");
	#endif
	

	#if defined(OUTPUT_ALL)
	FILE  *timesteps,*local_error;
	double *ERR;
	timesteps = fopen("timesteps.txt","w+");
	printf("writing to file 'timesteps.txt'\n");
	local_error = fopen("local_error.txt","w+");
	printf("writing to file 'local_error.txt'\n");
	ERR=(double *)malloc(Ndofs*tlen*sizeof(double));
	
    double tsprev,dtvalid,tschange,tswd=0.0,tswdprev=0.0;
    /* Keep a log of WT local timesteps to compute the running average.*/
    int WT = 10,numfixed;
    int firstWT=1;
    double tslog[WT];
    for (i=0; i<WT; i++) {
        tslog[i]=0.0;
    }
    
    int MAXNUMFIXED = 10;
    int LOCAL_MAXNUMFIXED = MAXNUMFIXED;
	#endif
    
    int k =0;
	double ts = 0.0;

    for (;;)
    {
        /* Store solution if the global time counter tt has passed the next time is tspan. */
        if (tt>=model->tspan[it]||isinf(tt)) {
			
          for (; it<model->tlen && (tt>=model->tspan[it]||isinf(tt)); it++){
             
			  if (report){
                report(model->tspan[it], model->tspan[0], model->tspan[model->tlen-1], total_diffusion, total_reactions, 0,report_level);
              }
              write_state(writer,xx);
			  
          }
			
          /* If the simulation has reached the final time, exit. */
          if (it>=model->tlen){
              flush_buffer(writer);
              break;
          }
        }
		#if defined(OUTPUT_ALL)
        tsprev = tau_d;
		#endif

		ts = take_step(xx,model,tt,it-1,&tau_d,error_tolerance,max_jump,report_level,&total_reactions,&total_diffusion,rfun,ddiag,deltaex,adaptive);
		
		#if defined(RECORD_TIMESTEPS)
		fprintf(timesteps_fd,"%.16f,%.16f\n",tt,ts);
		#endif

		tt += ts;

		#if defined(OUTPUT_ALL)
        if (adaptive) {
            tslog[k]=ts;
            k++;
        }
        tswdprev = tswd;
        tswd = 0.0;
        for (i=0; i<WT; i++) {
            if (firstWT)
                tswd+=tslog[i]/(k+1);
            else
                tswd+=tslog[i]/WT;
        }
        if (k>=WT){
            k=0;
            firstWT=0;
        }

       // printf("DTVALID: %f\n",tswd);

        /* Estimate the rate of change of the timestep */
        if (!firstWT){
            tschange = (tswd-tswdprev)/ts;
            if (tschange<0.0) {
                //LOCAL_MAXNUMFIXED=MAXNUMFIXED+(int)(tschange/1.0e-1*MAXNUMFIXED);
                printf("LOCAL_MAXNUMFIXED %i %f\n",LOCAL_MAXNUMFIXED,tschange);
            }
            //printf("DTVALID: %f\n",tschange);
            //if (tschange > 1e-4){
            //    adaptive =1;
            //    numfixed =0;
            //}
            //else{
            //    adaptive =0;
            //    numfixed++;
            //}
        }
        
        if (numfixed>LOCAL_MAXNUMFIXED) {
            numfixed=0;
            adaptive=1;
        }else{
            adaptive=0;
            numfixed++;
        }
		#endif
        
        
        //fprintf(stderr,"One full step completed, t=%e\n",tt);
		
    }
	
    //-------------------------------------------------------------------
    // End Main Loop
    //-------------------------------------------------------------------
    cleanup_dfsp_lookuptable(report_level);
	destroy_nsm_sim_data(get_nsm_sim_data(model));
    FREE_propensities(rfun);

    free(ddiag);
    free(deltaex);
    free(xx);
	gsl_rng_free(runif);
	#ifdef DFSP_PROFILER
		profiler_print();
	#endif
	
	
#if defined(RECORD_TIMESTEPS)
	fclose(timesteps_fd);
#endif
	

#if defined(OUTPUT_ALL)
	timesteps = fclose(timesteps);
	for (i=0; i<Ndofs; i++) {
		for (j=0; j<tlen; j++) {
			fprintf(local_error,"%.16f ",ERR[i*tlen+j]);
		}
		fprintf(local_error,"\n");
	}
	fclose(local_error);
	free(ERR);
#endif
	
	
}

