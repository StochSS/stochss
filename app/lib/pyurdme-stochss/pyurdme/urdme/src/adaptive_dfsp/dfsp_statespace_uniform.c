#ifndef DFSP_STATESPACE_C
#define DFSP_STATESPACE_C

/* Random number generators from GNU Scientific Library (GSL) */
#include <gsl/gsl_math.h>
#include <gsl/gsl_rng.h>
#include <gsl/gsl_randist.h>
#include <gsl/gsl_sort_double.h>
//#include <cblas.h>
#include <gsl/gsl_cblas.h>

dfsp_table*create_dfsp_lookuptable(urdme_model *model, const double tauD, const double error_tolerance, const int max_jump_in,
                          const int report_level){
	
    //----------------------------------------
    int Ndofs = model->Ncells*model->Mspecies;
    dfsp_table*table = (dfsp_table*)malloc(sizeof(dfsp_table));  //the return element
    //----------------------------------------
    int max_jump = max_jump_in;
    if(max_jump<0){ max_jump=3; } // set default
    //----------------------------------------
	int last_percent_reported=0;
    //----------------------------------------
    clock_t start_timer,end_timer;
    double elapsed_time;
   
  
    int i,j,k,m;
    //----------------------------------------
    if(report_level>0){ printf("Starting State-Space Exploration (uniformization): tau=%e tol=%e max=%i\n",tauD,error_tolerance,max_jump); }

    start_timer=clock();

    /* To hold the output */
    size_t *jcD_out,*irD_out;
    double *prD_out;
	
    /* Uniformization parameters. */
    
    /*
     * MAX_ITER affects the chosen timestep by the solver,
     * since we modify the timestep such that uniformization converges
     * in at most this number of iterations
     */
    
    int MAX_ITER = 50;
    double lambda_max;
	double poisspdf[MAX_ITER],totp=0.0,normp,max_error=0.0,rhs;

	size_t ix;
    
    jcD_out = (size_t *)malloc((Ndofs+1)*sizeof(size_t));
    jcD_out[0] = 0;
	
    /* To hold the current pvd */
    double *pdvi,*temp1,*temp2;
    pdvi = (double *)malloc(Ndofs*sizeof(double));
    temp1 = (double *)malloc(Ndofs*sizeof(double));
    temp2 = (double *)malloc(Ndofs*sizeof(double));

    /* Compute lambda_max */
    lambda_max = 0.0;
    for (i=0;i<Ndofs;i++){
      for (j=model->jcD[i];j<model->jcD[i+1];j++){	
        if (model->irD[j]==i)
          if (-model->prD[j]>lambda_max)
            lambda_max = -model->prD[j];
      }
    }
    if (report_level>1){
        printf("lambda_max %.4e\n",lambda_max);
    }
	
	/*
       We get a proposed timestep passed to the function (from error estimation). 
       If this is too large for uniformization to converge in MAX_ITER iterations,
	   we reduce the timestep.
     */
    double dt = tauD;
	totp = 1.0;
	do {
		totp=1.0;
		for (i=0; i<MAX_ITER; i++) {
			totp-=gsl_ran_poisson_pdf(i,lambda_max*dt);
		}
        if(totp>error_tolerance/2.0){
            dt/=2.0;
        }
	}while (totp>error_tolerance/2.0);
    if (dt<tauD){
       if (report_level>1){
          printf("Uniformization: overriding suggested tauD. Using tau_d = %e\n",dt);
        }
    }
	
    int start,stop;
    size_t nnz_coli=0;
    size_t nnz_coli_T=0;
    
	double cumsum;
	size_t *index;
	index = (size_t *)malloc(Ndofs*sizeof(size_t));
    
    /* Create the uniformized matrix. If memory is an issue, it is not necessary to  
	   form A expplicitly, but the code will run faster with A. */
    size_t *jcA,*irA;
    double *prA;
	int nnztot = model->jcD[Ndofs];
	
    jcA = (size_t *)malloc((Ndofs+1)*sizeof(size_t));
    irA = (size_t *)malloc(nnztot*sizeof(size_t));
    prA = (double *)malloc(nnztot*sizeof(double));
	
    memcpy(jcA,model->jcD,(Ndofs+1)*sizeof(size_t));
    memcpy(irA,model->irD,nnztot*sizeof(size_t));
    memcpy(prA,model->prD,nnztot*sizeof(double));
    
    /* Rescaled matrix. Obs. we do not add the eye-matrix here, since this may
     * cause error in the case of an all zero column. Instead we do that in 
     * the main matrix-vector multiply loop */ 
    for (i=0;i<Ndofs;i++){
      for (j=jcA[i];j<jcA[i+1];j++){
		prA[j]=prA[j]/lambda_max;
      }
    }
	
    /* Compute the Poisson PDF and determine how many iterations we need to do in the main loop. */
    int NUM_ITER=MAX_ITER;
    totp = 1.0;
    for (k=0;k<MAX_ITER;k++){
        poisspdf[k] = gsl_ran_poisson_pdf(k,lambda_max*dt);
        totp-=poisspdf[k];
        if (totp <= error_tolerance/2.0){
            NUM_ITER = k+1;
            break;
        }
    }
	
    for(i=0;i<Ndofs;i++){
        
       /* report every 5% */
       if(report_level>1){
            int cur_percent = (int) floor(((double)i/(double)Ndofs)*100.0);
            if(cur_percent > last_percent_reported + 4){
                last_percent_reported = cur_percent;
                end_timer=clock();
                elapsed_time = (double)(end_timer-start_timer)/CLOCKS_PER_SEC;
                printf("%i%% complete\t\telapsed: %es\n",last_percent_reported,elapsed_time);
            }
        }
        
        /* Initial condition */
		memset(pdvi,0.0,Ndofs*sizeof(double));
		memset(temp1,0.0,Ndofs*sizeof(double));
		memset(temp2,0.0,Ndofs*sizeof(double));

		temp1[i]=1.0;
		
		double *val,*valend;
		size_t *ind;
        
		totp=1.0;
		for(k=0; k<NUM_ITER; k++){
		  
			/* Add to pdvi */
			cblas_daxpy(Ndofs,poisspdf[k],temp1,1,pdvi,1);
			
			/* Sparse matrix-dense vector product. */
			for (m=0;m<Ndofs;m++){
				rhs = temp1[m];
				if (rhs > 0.0){ // > works since we know that temp1 will always be positive. 
                    
                   start = jcA[m];
                   stop  = jcA[m+1];
				   ix = (stop-start) % 4;
				   for (j=start; j<start+ix; j++) {
					  temp2[irA[j]] += rhs*prA[j];  
					  
				   }
				   for (j=start+ix; j+3<stop; j += 4) {
					   temp2[irA[j]]   += rhs*prA[j];  
					   temp2[irA[j+1]] += rhs*prA[j+1];  
					   temp2[irA[j+2]] += rhs*prA[j+2];  
					   temp2[irA[j+3]] += rhs*prA[j+3];
				   }
				   /* Add unit diagonal */
				   temp2[m] += 1.0*rhs;
				}
			}
			
			memcpy(temp1,temp2,Ndofs*sizeof(double));
			memset(temp2,0.0,Ndofs*sizeof(double));
        
		}
		
		/* Sort pdvi in decending order */
		memset(index,0,Ndofs*sizeof(size_t));
		gsl_sort_index(index,pdvi,1,(size_t)Ndofs);
        
		#if 0 //OLD WAY
		/* Count the number of non-zeros in this column (PDV) */
        cumsum = 0.0; j=Ndofs-1; nnz_coli=0;
        for (j=Ndofs-1; j>=0; j--){
            cumsum+=pdvi[index[j]];
            if (pdvi[index[j]]==0.0)
                break;
            nnz_coli++;	
        }
		#else  //CORRECT WAY
		/* Count the number of non-zeros in this column (PDV) */
		int min_col_sz = model->jcD[i+1]-model->jcD[i]; //size of the column of the D matrix
        cumsum = 0.0; j=Ndofs-1; nnz_coli=0;
        for (j=Ndofs-1; j>=0; j--){
            cumsum+=pdvi[index[j]];
            if (pdvi[index[j]]==0.0)
                break;
            nnz_coli++;
			if(nnz_coli>=min_col_sz && 1.0-cumsum < error_tolerance){ 
				break;
			}
        }
		#endif
        nnz_coli_T+=nnz_coli;
		
		/* Assemble into the lookup-table (sparse matrix) */
		jcD_out[i+1]=jcD_out[i]+(size_t)nnz_coli;  //record the begining of this colum
		
		if(i==0){
			irD_out = (size_t*) malloc(nnz_coli*sizeof(size_t));
		}else{
			irD_out = (size_t*) realloc(irD_out,jcD_out[i+1]*sizeof(size_t));
		}
		if(i==0){
		    prD_out = (double*) malloc(nnz_coli*sizeof(double));
		}else{
		    prD_out = (double*) realloc(prD_out,jcD_out[i+1]*sizeof(double));
		}

        /* For optimization purposes, we store the CDF rather than the PDF 
           here, since all we are going to do with this matrix is 
           inverse transform sampling during the DFSP step. */
		start = (int)jcD_out[i]; k=0; cumsum = 0.0;
		for (k=0;k<nnz_coli;k++){
			irD_out[start+k]  = index[Ndofs-k-1];  
			cumsum += pdvi[index[Ndofs-k-1]];
			prD_out[start+k] = cumsum;
		}
		
		/**
          * Renormalize, so that the PDF sums to 1.0
          * We spread the epsilon error equal on all the remaining states.
          * This is why we needed to compute to tol/2 accuracy.
        */
		for (k=0; k<nnz_coli; k++) {
			prD_out[start+k]/=cumsum;
		}
	
    }
    
    end_timer=clock();
    elapsed_time = (double)(end_timer-start_timer)/CLOCKS_PER_SEC;
   
    
    /* Stats */
    
    /* Average serch depth */
    /*double sdepth=0.0;
    for (i=0;i<Ndofs;i++){
        k=0;
        start = jcD_out[i];
        stop  = jcD_out[i+1];
        for (j=start; j<stop;j++){
           if(prD_out[j]>0.5) 
                break;
           k++;
        }      
        if (k>sdepth)
            sdepth = k;
    }*/
    
    int nnzi;
    int maxnnzi = 0;
    for (i=0;i<Ndofs;i++){
       nnzi = jcD_out[i+1]-jcD_out[i];
       if (nnzi>maxnnzi)
           maxnnzi = nnzi;
    }
    
    if(report_level>0){ printf("\tComplete: elapsed: %es, error=%e Nmax=%i\n",elapsed_time,error_tolerance,maxnnzi);}
    if(report_level>1){printf("Number of iterations: %i\n",NUM_ITER); }
   // printf("Max search depth: %f\n",sdepth);
    //----------------------------------------
   
    table->Ndofs = Ndofs;
    table->error_tolerance = max_error;
    table->tau_d = dt; 
    table->max_jump = max_jump;
   
    table->jcD = jcD_out;
    table->irD = irD_out;
    table->prD = prD_out;
	#ifdef DFSP_PROFILER
		profiler_addmemory("Lookup tables",(Ndofs+1)*sizeof(size_t) + jcD_out[Ndofs]*(sizeof(size_t)+sizeof(double)));
	#endif
    //----------------------------------------
    free(index);
    free(pdvi);
    free(temp1);
    free(temp2);
    
    free(jcA);
    free(irA);
    free(prA);
    //----------------------------------------
    return table;
}

#endif /*dfsp_statespace.c*/

