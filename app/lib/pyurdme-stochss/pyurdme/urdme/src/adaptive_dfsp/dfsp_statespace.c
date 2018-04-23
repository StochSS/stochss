#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include "dfsp.h"
#include "urdmemodel.h"

#include "dfsp_statespace_uniform.c" // Uses uniformization

int max_table_tau_found=0;
double max_table_tau=0.0;
dfsp_table*max_table_tau_table=NULL;
int cache_size=0;
dfsp_table**cache;
double *cache_tau;

//#################################################################################################
void destroy_dfsp_lookuptable(dfsp_table*table){
    free(table->irD);
    free(table->jcD);
    free(table->prD);
    free(table);
}

//#################################################################################################
void cleanup_dfsp_lookuptable(int report_level){
    int i;
    if(report_level>0)printf("cleanup_dfsp_lookuptable() cache_size=%i\n",cache_size);
    for(i=0;i<cache_size;i++){
        if(report_level>0){printf("\ttau=%e\t\t\t%e\n",cache_tau[i],cache[i]->tau_d);}
        destroy_dfsp_lookuptable(cache[i]);
    }
    free(cache);
    free(cache_tau);
}
//##############################################################################################################

dfsp_table*get_dfsp_lookuptable(urdme_model *model, const double tauD, const double error_tolerance, const int max_jump,
                          const int report_level){
    //----------------------------------------
    //static int cache_size=0;
    //static dfsp_table**cache;
    //static double *cache_tau;
    //----------------------------------------
    clock_t start_timer,end_timer;
    double elapsed_time;
    
    //----------------------------------------
    //This accounts for the possibility that the tauD returned from create() will be different than
    //      the one requested.  cache_tau is a map of requests: tau_in => tau_out
    if(!cache_size){ //initialize cache
        cache_size=1;
        cache = (dfsp_table**)malloc(sizeof(dfsp_table*));
        cache_tau=(double*)malloc(cache_size*sizeof(double));
        // IS THIS A BUG???? 
        //cache_tau[0]=tauD;
        start_timer=clock();
        #ifdef DFSP_PROFILER
        profiler_stoptimer();  //end previous timer
        profiler_startimer("lookup table-generate");
        #endif
        cache[0] = create_dfsp_lookuptable(model,tauD,error_tolerance,max_jump,report_level);
        // HERE IS A MAJOR MODIFICATION OF BRIANS CODE
        cache_tau[0]=cache[0]->tau_d;
        end_timer=clock();
        elapsed_time = (double)(end_timer-start_timer)/CLOCKS_PER_SEC;
        if(report_level>1)printf("sse time: %es\n",elapsed_time);
        
        //---------------------------
        // Check if max table tau found, if so set flag to prevent un-needed generations
        // HERE IS A MAJOR CHANGE! UNIFORMIZATION SPECIFIC
        if(tauD > cache[0]->tau_d){
            max_table_tau_found=1;
            max_table_tau=cache[0]->tau_d;
            max_table_tau_table=cache[0];
        }
        
        //---------------------------
        return cache[0];
    }else{
        //---------------------------------------
        if(max_table_tau_found && tauD>max_table_tau){
            //asking for a tau that is larger than the max available from the lookup-table computation algorithm
            return max_table_tau_table;
        }
        //---------------------------------------
        // search cache for the selected timestep. If tauD is not already present in the cache,
        // we look for the table with a timestep closest to, but smaller than the one we try to compute.
        double closest_tau=0.0;
        dfsp_table *closest_table = NULL;
        int i;
        for(i=0;i<cache_size;i++){
            if( fabs( tauD - cache_tau[i] ) < 1e-10){  //found
                return cache[i];
            }else{
                if (fabs(tauD-cache_tau[i])<fabs(tauD-closest_tau) && cache_tau[i]<tauD) {
                    closest_tau = cache_tau[i];
                    closest_table = cache[i];
                }
            }
        }
        //---------------------------------------
        //not found, so we need to compute a new one
        cache_size++;
        cache=(dfsp_table**)realloc(cache,cache_size*sizeof(dfsp_table*));
        cache_tau=(double*)realloc(cache_tau,cache_size*sizeof(double));
        // MAJOR MODIFICATION HERE!!!!
        cache_tau[cache_size-1]=tauD;
        #ifdef DFSP_PROFILER
        profiler_stoptimer();  //end previous timer
        profiler_startimer("lookup table-generate");
        #endif
        //cache[cache_size-1] = create_dfsp_lookuptable(model,tauD,error_tolerance,max_jump,report_level,closest_table);
        cache[cache_size-1] = create_dfsp_lookuptable(model,tauD,error_tolerance,max_jump,report_level);
        cache_tau[cache_size-1]=cache[cache_size-1]->tau_d;
        
        //---------------------------
        // Check if max table tau found, if so set flag to prevent un-needed generations
        // MAJOR MODIFICATION. UNIFORMIZATION SPECIFIC!! 
        if(tauD > cache[cache_size-1]->tau_d){
            if(max_table_tau_found){
                if(cache[cache_size-1]->tau_d > max_table_tau){
                    max_table_tau=cache[cache_size-1]->tau_d;
                    max_table_tau_table=cache[cache_size-1];
                }
            }else{
                max_table_tau_found=1;
                max_table_tau=cache[cache_size-1]->tau_d;
                max_table_tau_table=cache[cache_size-1];
            }
        }
        //---------------------------
        return cache[cache_size-1];
    }
    //---------------------------------------
}
