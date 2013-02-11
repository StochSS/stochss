/*
 * -----------------------------------------------------------------
 * $Revised from cvRoberts_dns.c in cvode examples$
 * $Date: 2012/09 $
 * -----------------------------------------------------------------
 * Example problem:
 * 
 * The following is a simple example problem, with the coding
 * needed for its solution by CVODE. The problem is from
 * chemical kinetics, and consists of equations:
 *    dy/dt = f(y)
 * on the interval from t = 0.0 to t = t_end, with initial
 * conditions: y(0). The problem is stiff.
 * This program solves the problem with the BDF method,
 * Newton iteration with the CVDENSE dense linear solver.
 * It uses a scalar relative tolerance and a vector absolute
 * tolerance. 
 * -----------------------------------------------------------------
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>

/* Header files with a description of contents used */

#include <cvode/cvode.h>             /* prototypes for CVODE fcts., consts. */
#include <nvector/nvector_serial.h>  /* serial N_Vector types, fcts., macros */
#include <cvode/cvode_dense.h>       /* prototype for CVDense */
#include <sundials/sundials_dense.h> /* definitions DlsMat DENSE_ELEM */
#include <sundials/sundials_types.h> /* definition of type realtype */

/* User-defined vector and matrix accessor macros: Ith, IJth */

/* These macros are defined in order to write code which exactly matches
   the mathematical problem description given above.

   Ith(v,i) references the ith component of the vector v, where i is in
   the range [1..NEQ] and NEQ is defined below. The Ith macro is defined
   using the N_VIth macro in nvector.h. N_VIth numbers the components of
   a vector starting from 0.

   IJth(A,i,j) references the (i,j)th element of the dense matrix A, where
   i and j are in the range [1..NEQ]. The IJth macro is defined using the
   DENSE_ELEM macro in dense.h. DENSE_ELEM numbers rows and columns of a
   dense matrix starting from 0. */

#define Ith(v,i)    NV_Ith_S(v,i-1)       /* Ith numbers components 1..NEQ */
#define IJth(A,i,j) DENSE_ELEM(A,i-1,j-1) /* IJth numbers rows,cols 1..NEQ */


/* Problem Constants */

/* INSERT GENERATED CONSTANTS */
#define NEQ   3          /* number of equations  */
#define OUTPUT_SPECIES_NUMBER  3    /* number of species in output  */
#define RTOL  RCONST(1.0e-4)   /* scalar relative tolerance            */
#define ATOL  RCONST(1.0e-8)    /* scalar absolute tolerance components */
#define MXSTEPS 2000           /* max steps before tout */
/* END OF GENERATED CONSTANTS */

/* Initialize y */

static int InitY(realtype t, N_Vector y);

/* Functions Called by the Solver */

static int f(realtype t, N_Vector y, N_Vector ydot, void *user_data);

/* Private functions to output results */

static void PrintOutputHeader(FILE *output_file);
static void PrintOutput(realtype t, N_Vector y, FILE *output_file);

/* Private function to print final statistics */

static void PrintFinalStats(void *cvode_mem);

/* Private function to check function return values */

static int check_flag(void *flagvalue, char *funcname, int opt);


/*
 *-------------------------------
 * Main Program
 *-------------------------------
 */

int main(int argc, char* argv[])
{
  realtype abstol, reltol, t, tout, tinterval;
  N_Vector y;
  void *cvode_mem;
  int flag, flagr, iout, NOUT;
  char *OUTPUT_FILENAME;
  FILE *output_file;
  realtype T0, T1;
  int keep_label;

  if(argc != 6){
    fprintf(stderr, "\nSUNDIALS_ERROR: please use the format: \n  ./cvode_dns (start_time) (end_time) (output_intervals) (output_filename) (keep_label)\n         keep_label=0:donot keep labels in output, keep_label=1:keep labels in output\n");
    return(1);
  }
  T0 = (realtype)atof(argv[1]);
  T1 = (realtype)atof(argv[2]);
  NOUT = atoi(argv[3]);
  OUTPUT_FILENAME = argv[4];
  keep_label = atoi(argv[5]);

#ifdef DEBUG
  fprintf(stdout, "\nstart_time:%f\nend_time:%f\noutput_intervals:%d\noutput_file:%s\n", T0, T1, NOUT, OUTPUT_FILENAME);
#endif

  y = NULL;
  cvode_mem = NULL;

  /* Create serial vector of length NEQ for I.C. and abstol */
  y = N_VNew_Serial(NEQ);
  if (check_flag((void *)y, "N_VNew_Serial", 0)) return(1);

  /* Initialize y */
  t = T0;
  InitY(t, y);

  /* Set the scalar relative tolerance */
  reltol = RTOL;
  /* Set the scalar absolute tolerance */
  abstol = ATOL;

  /* Call CVodeCreate to create the solver memory and specify the 
   * Backward Differentiation Formula and the use of a Newton iteration */
  cvode_mem = CVodeCreate(CV_BDF, CV_NEWTON);
  if (check_flag((void *)cvode_mem, "CVodeCreate", 0)) return(1);
  
  /* Call CVodeInit to initialize the integrator memory and specify the
   * user's right hand side function in y'=f(t,y), the inital time T0, and
   * the initial dependent variable vector y. */
  flag = CVodeInit(cvode_mem, f, T0, y);
  if (check_flag(&flag, "CVodeInit", 1)) return(1);

  /* Call CVodeSStolerances to specify the scalar relative tolerance
   * and scalar absolute tolerances */
  flag = CVodeSStolerances(cvode_mem, reltol, abstol);
  if (check_flag(&flag, "CVodeSVtolerances", 1)) return(1);

  flag = CVodeSetMaxNumSteps(cvode_mem, MXSTEPS);
  if (check_flag(&flag, "CVodeSetMaxNumSteps", 1)) return(1);

  /* Call CVDense to specify the CVDENSE dense linear solver */
  flag = CVDense(cvode_mem, NEQ);
  if (check_flag(&flag, "CVDense", 1)) return(1);

  /* Set the Jacobian routine to Jac (user-supplied) */
//  user-supplied Jac not currently implemented
//  flag = CVDlsSetDenseJacFn(cvode_mem, Jac);
//  if (check_flag(&flag, "CVDlsSetDenseJacFn", 1)) return(1);

  /* In loop, call CVode, print results, and test for error.
     Break out of loop when NOUT preset output times have been reached.  */

  if((output_file = fopen(OUTPUT_FILENAME, "r")) == NULL){
      output_file = fopen(OUTPUT_FILENAME, "w");
  }else{
    fclose(output_file);
    fprintf(stderr, "\nSUNDIALS_ERROR: open output file %s failed - the file already existed\n\n", OUTPUT_FILENAME);
    return(1);
  }
  if(output_file == NULL){
    fprintf(stderr, "\nSUNDIALS_ERROR: open output file %s failed - returned NULL pointer\n\n", OUTPUT_FILENAME);
    return(1);
  }

  iout = 0;  tinterval = (T1 - T0)/NOUT;
  tout = T0 + tinterval;
  if(keep_label || OUTPUT_SPECIES_NUMBER != NEQ){
    PrintOutputHeader(output_file);
  }
  PrintOutput(t, y, output_file);
  while(1) {
    flag = CVode(cvode_mem, tout, y, &t, CV_NORMAL);
    PrintOutput(t, y, output_file);

    if (check_flag(&flag, "CVode", 1)) break;
    if (flag == CV_SUCCESS) {
      iout++;
      tout+=tinterval;
    }

    if (iout == NOUT) break;
  }

  /* Print some final statistics */
  PrintFinalStats(cvode_mem);

  /* Close output file */
  fclose(output_file);

  /* Free y and abstol vectors */
  N_VDestroy_Serial(y);

  /* Free integrator memory */
  CVodeFree(&cvode_mem);

  return(0);
}


/*
 *-------------------------------
 * Functions called by the solver
 *-------------------------------
 */

/*
 * InitY routine. Initialize y.
 */
static int InitY(realtype t, N_Vector y)
{
 /* INSERT GENERATED INITIAL CONDITION */
  Ith(y,1) = RCONST(10000);
  Ith(y,2) = RCONST(0);
  Ith(y,3) = RCONST(0);

 /* END OF GENERATED INITIAL CONDITION */

  return(0);
}

/*
 * f routine. Compute function f(t,y). 
 */

static int f(realtype t, N_Vector y, N_Vector ydot, void *user_data)
{
 /* INSERT GENERATED RIGHT HAND SIDE */
  Ith(ydot,1) = RCONST(0) +RCONST(-1)*Ith(y,1) +RCONST(-0.004)*Ith(y,1)*Ith(y,1) +RCONST(1)*Ith(y,2);
  Ith(ydot,2) = RCONST(0) +RCONST(0.002)*Ith(y,1)*Ith(y,1) +RCONST(-0.5)*Ith(y,2) +RCONST(-0.04)*Ith(y,2);
  Ith(ydot,3) = RCONST(0) +RCONST(0.04)*Ith(y,2);

 /* END OF GENERATED RIGHT HAND SIDE */

  return(0);
}

/*
 *-------------------------------
 * Private helper functions
 *-------------------------------
 */

static void PrintOutputHeader(FILE *output_file)
{
  int i;
 /* INSERT GENERATED OUTPUT SPECIES NAMES */
  char *species_names[3];
   species_names[0] = "S1";
   species_names[1] = "S2";
   species_names[2] = "S3";

 /* END OF GENERATED OUTPUT SPECIES NAMES */
  fprintf(output_file, "time\t");
  for(i=0;i<OUTPUT_SPECIES_NUMBER;++i){
    fprintf(output_file, "%s\t", species_names[i]);
  }
  fprintf(output_file, "\n");
}

static void PrintOutput(realtype t, N_Vector y, FILE *output_file)
{
  int i;
 /* INSERT GENERATED OUTPUT SPECIES INDEX */
  int species_index[3] = {  0,  1,  2  };

 /* END OF GENERATED OUTPUT SPECIES INDEX */

#if defined(SUNDIALS_EXTENDED_PRECISION)
  fprintf(output_file, "%0.4Le\t", t);
  for(i=0;i<OUTPUT_SPECIES_NUMBER;++i){
    fprintf(output_file, "%14.6Le\t", Ith(y,species_index[i]+1));
  }
  fprintf(output_file, "\n");
#elif defined(SUNDIALS_DOUBLE_PRECISION)
  fprintf(output_file, "%0.4le\t", t);
  for(i=0;i<OUTPUT_SPECIES_NUMBER;++i){
    fprintf(output_file, "%14.6le\t", Ith(y,species_index[i]+1));
  }
  fprintf(output_file, "\n");
#else
  fprintf(output_file, "%0.4e\t", t);
  for(i=0;i<OUTPUT_SPECIES_NUMBER;++i){
    fprintf(output_file, "%14.6e\t", Ith(y,species_index[i]+1));
  }
  fprintf(output_file, "\n");
#endif

  return;
}

/* 
 * Get and print some final statistics
 */

static void PrintFinalStats(void *cvode_mem)
{
  long int nst, nfe, nsetups, nje, nfeLS, nni, ncfn, netf, nge;
  int flag;

  flag = CVodeGetNumSteps(cvode_mem, &nst);
  check_flag(&flag, "CVodeGetNumSteps", 1);
  flag = CVodeGetNumRhsEvals(cvode_mem, &nfe);
  check_flag(&flag, "CVodeGetNumRhsEvals", 1);
  flag = CVodeGetNumLinSolvSetups(cvode_mem, &nsetups);
  check_flag(&flag, "CVodeGetNumLinSolvSetups", 1);
  flag = CVodeGetNumErrTestFails(cvode_mem, &netf);
  check_flag(&flag, "CVodeGetNumErrTestFails", 1);
  flag = CVodeGetNumNonlinSolvIters(cvode_mem, &nni);
  check_flag(&flag, "CVodeGetNumNonlinSolvIters", 1);
  flag = CVodeGetNumNonlinSolvConvFails(cvode_mem, &ncfn);
  check_flag(&flag, "CVodeGetNumNonlinSolvConvFails", 1);

  flag = CVDlsGetNumJacEvals(cvode_mem, &nje);
  check_flag(&flag, "CVDlsGetNumJacEvals", 1);
  flag = CVDlsGetNumRhsEvals(cvode_mem, &nfeLS);
  check_flag(&flag, "CVDlsGetNumRhsEvals", 1);

  flag = CVodeGetNumGEvals(cvode_mem, &nge);
  check_flag(&flag, "CVodeGetNumGEvals", 1);

  printf("\nSUNDIALS Cvode Final Statistics:\n");
  printf("nst = %-6ld nfe  = %-6ld nsetups = %-6ld nfeLS = %-6ld nje = %ld\n",
	 nst, nfe, nsetups, nfeLS, nje);
  printf("nni = %-6ld ncfn = %-6ld netf = %-6ld nge = %ld\n \n",
	 nni, ncfn, netf, nge);
}

/*
 * Check function return value...
 *   opt == 0 means SUNDIALS function allocates memory so check if
 *            returned NULL pointer
 *   opt == 1 means SUNDIALS function returns a flag so check if
 *            flag >= 0
 *   opt == 2 means function allocates memory so check if returned
 *            NULL pointer 
 */

static int check_flag(void *flagvalue, char *funcname, int opt)
{
  int *errflag;

  /* Check if SUNDIALS function returned NULL pointer - no memory allocated */
  if (opt == 0 && flagvalue == NULL) {
    fprintf(stderr, "\nSUNDIALS_ERROR: %s() failed - returned NULL pointer\n\n",
	    funcname);
    return(1); }

  /* Check if flag < 0 */
  else if (opt == 1) {
    errflag = (int *) flagvalue;
    if (*errflag < 0) {
      fprintf(stderr, "\nSUNDIALS_ERROR: %s() failed with flag = %d\n\n",
	      funcname, *errflag);
      return(1); }}

  /* Check if function returned NULL pointer - no memory allocated */
  else if (opt == 2 && flagvalue == NULL) {
    fprintf(stderr, "\nMEMORY_ERROR: %s() failed - returned NULL pointer\n\n",
	    funcname);
    return(1); }

  return(0);
}

