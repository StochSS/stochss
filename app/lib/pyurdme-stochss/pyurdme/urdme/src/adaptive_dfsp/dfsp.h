#ifndef DFSP__H
#define DFSP__H
#include "propensities.h"
#include "report.h"
#include "urdmemodel.h"
#include "outputwriter.h"
#include <gsl/gsl_math.h>
#include <gsl/gsl_rng.h>
#include <gsl/gsl_randist.h>

//#define DFSP_NUM_THREADS   4


gsl_rng * runif;


typedef struct {
    int Ndofs;
    size_t *irD;
    size_t *jcD;
    double *prD;
    double tau_d;
    int max_jump;
    double error_tolerance;
} dfsp_table;


void dfsp_core(urdme_model *model, urdme_output_writer *writer);
//void dfsp_core(const size_t *irD, const size_t *jcD, const double *prD,
//               const int *u0, const size_t *irN, const size_t *jcN, const int *prN,
//               const size_t *irG, const size_t *jcG, const double *tspan, const size_t tlen, int *U,
//               const double *vol, const double *data, const int *sd, const size_t Ncells,
//               const size_t Mspecies, const size_t Mreactions, const size_t dsize,
//               const int report_level, 
//               const double tau_d, const int max_jump, const double error_tolerance);

//int dfsp_diffusion(int *xx, const size_t *irD, const size_t *jcD, const double *prD,
//            const size_t Ncells,int Mspecies);
//int dfsp_diffusion(int *xx, const size_t *irD, const size_t *jcD, const double *prD,
//                int Ndofs,const double tauD, const double error_tolerance, const int max_jump,const int report_level);
int dfsp_diffusion(int *xx, urdme_model *model,const double tauD, const double error_tolerance, const int max_jump,const int report_level,dfsp_table*t);

//int dfsp_reactions(int *xx,
//            const size_t *irN, const size_t *jcN, const int *prN,
//            const size_t *irG, const size_t *jcG,
//            PropensityFun *rfun,
//            double tau_d, double tt,
//            const double *vol, const double *data, const int *sd,
//            const size_t Ncells,int Mspecies,int Mreactions,const size_t dsize);
int dfsp_reactions(int *xx,urdme_model *model,PropensityFun *rfun,double tau_d, double tt);

//dfsp_table*get_dfsp_lookuptable(const size_t *irD_in, const size_t *jcD_in, const double *prD_in, 
//                          const int Ndofs,
//                          const double tauD, const double error_tolerance, const int max_jump,
//                          const int report_level);
dfsp_table*get_dfsp_lookuptable(urdme_model *model,const double tauD, const double error_tolerance,
                            const int max_jump, const int report_level);

void cleanup_dfsp_lookuptable(int report_level);

#endif
