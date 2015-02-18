/* propensities.h */

/* J. Cullhed   2008-06-18. */
/* A. Hellander 2010-01-10. */  
/* A. Hellander 2012-06-05 (rev). */  
/* B. Drawert   2012-09-08 */


#ifndef PROPENSITIES__H
#define PROPENSITIES__H

/* Global variable that can be used to pass parameters to the propensity functions. */
extern double *parameters;

/* Definition of the propensity function. */
// double rfun(const int *x, double t, const double vol, const double *data, int sd, int voxel, int *xx, const size_t *irK, const size_t *jcK, const double *prK)
//typedef double (*PropensityFun)(const int *, double, double, const double *, int, int, int *, const size_t *, const size_t *, const double *);
// double rfun(const int *x, double t, const double vol, const double *data, int sd)
typedef double (*PropensityFun)(const int *, double, double, const double *, int);

/* Declaration of allocation and deallocation of propensity list. */
PropensityFun *ALLOC_propensities(void);
void FREE_propensities(PropensityFun* ptr);


#endif 
/* PROPENSITIES__H */
