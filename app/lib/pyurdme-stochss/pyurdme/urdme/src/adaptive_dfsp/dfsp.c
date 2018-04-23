/* Stand-alone dfsp solver for use with URDME. */

#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include "propensities.h"
#include "dfsp.h"
#include "urdmemodel.h"



int main(int argc, char *argv[])
{
    char *infile,*outfile;
	int i, nt=1, report_level=1;
	
	/* TODO. Parsing of input with error checking. 
	   Input syntax on form: -numtraj=4 etc. ?*/
	
	if (argc < 3){
		printf("To few arguments to nsm.");
	    exit(-1);	
	}
	
	/* Input file. */
	infile  = argv[1];
	
	/* Output file (or directory). */
	outfile = argv[2]; 
	
	/* Read model specification */
	urdme_model *model;
	model = read_model(infile);
	model->infile = infile;
	
	if (model == NULL){
		printf("Fatal error. Couldn't load model file or currupt model file.");
		return(-1);
	}
	
    /*reopen MAT file*/
    MATFile *input_file;
    mxArray *temp,*sopts;

    input_file = matOpen(infile,"r");
    if (input_file == NULL){
        printf("Failed to open mat-file.\n");
        return(-1);   
    }

	/* Initialize RNG(s).  */
    /* Look for seed */
    temp = matGetVariable(input_file, "seed");

    /* Initialize rng from GSL. */
    const gsl_rng_type * T;
    T = gsl_rng_taus2;
    gsl_rng_env_setup();
    runif = gsl_rng_alloc (T);
    //gsl_rng_set (runif, 463728648);  //Why would we seed the name number each time??

    long int seed;
    /* If seed is provided as a parameter, it takes precedence. */
    if (argc > 3) {
        srand48((long int)atoi(argv[3]));
        gsl_rng_set(runif,(long int)atoi(argv[3]));
    }else if(temp != NULL){
        seed = (long int) mxGetScalar(temp);
        srand48(seed);
        gsl_rng_set(runif,seed);
    }else{
		/* Not a foolproof solution */
        //srand48((long int)time(NULL)+(long int)(1e9*clock()));
        srand48( time(NULL) * getpid() );
        gsl_rng_set(runif,time(NULL) * getpid());
    }
	
	/* Look for an optional parameter matrix. */
	const double *matfile_parameters; 
	int mpar = 0;
	int npar = 0;
	int param_case=0;
	
    temp = matGetVariable(input_file, "parameters");
	if (temp != NULL) {
		matfile_parameters = (double *)mxGetPr(temp);
		mpar = mxGetM(temp);
		npar = mxGetN(temp); 
	}
	
	/* Look if a parameter case if supplied as a parameter. */
	if (argc > 4) {
	    param_case = (int)atoi(argv[4]);
	}
	
	if (param_case > npar ) {
		printf("nsmcore: Fatal error, parameter case is larger than n-dimension in parameter matrix.\n");
		exit(-1);
	}
	
	/* Create global parameter variable for this parameter case. */
	parameters = (double *)malloc(mpar*sizeof(double));
	memcpy(parameters,&matfile_parameters[npar*param_case],mpar*sizeof(double));
	
    /* Initialize extra args */
	model->num_extra_args = 4;
	model->extra_args=malloc(model->num_extra_args*sizeof(void *));
	
	/* Set report level */
    temp = matGetVariable(input_file, "report");
   
    if (temp != NULL)
        report_level = (int) mxGetScalar(temp);
    else
        if (nt > 1)
            report_level=0;
        else
            report_level=1;

	model->extra_args[0] = malloc(sizeof(int));
	*(int *)(model->extra_args[0]) = report_level;

    /* Set tau_d */
    sopts = matGetVariable(input_file, "sopts");
    if(sopts==NULL){
        printf("Step length (tau_d) is missing in the model file\n");
        return(-1);   
    }
    model->extra_args[1] = malloc(sizeof(double));
    model->extra_args[2] = malloc(sizeof(double));
    model->extra_args[3] = malloc(sizeof(double));
    double*sopts_tmp = mxGetPr(sopts);
    //printf("HERE: tau_d=%e\n",sopts_tmp[0]);
    //printf("HERE: max_jump=%e\n",sopts_tmp[1]);
    //printf("HERE: err_tol=%e\n",sopts_tmp[2]);
    *(double*)model->extra_args[1] = sopts_tmp[0];
    *(double*)model->extra_args[2] = sopts_tmp[1];
    *(double*)model->extra_args[3] = sopts_tmp[2];
    //printf("HERE: tau_d=%e\n",*(double *)(model->extra_args[1]));
    //printf("HERE: max_jump=%e\n",*(double *)(model->extra_args[2]));
    //printf("HERE: err_tol=%e\n",*(double *)(model->extra_args[3]));
    /* close MAT file*/
    matClose(input_file);

	/* Allocate memory to hold nt solutions. */
	init_sol(model,nt);

    /* Get a writer to store the output trajectory on a hdf5 file. */
    urdme_output_writer *writer;
    writer = get_urdme_output_writer(model,outfile);
    printf("writer = get_urdme_output_writer(model,%s);\n",outfile);
	
    printf("dfsp_core\n");
    dfsp_core(model, writer);
	
    /* Write the timespan vector to the output file */
    printf("write_tspan\n");
    write_tspan(writer,model);

    
    //free(parameters);
    
    printf("destroy_output_writer\n");
    destroy_output_writer(writer);
    printf("destroy_model\n");
    destroy_model(model);
	
	return(0);
	
}



 
