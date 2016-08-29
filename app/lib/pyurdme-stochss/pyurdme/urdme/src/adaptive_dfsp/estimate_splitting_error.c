#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "estimate_splitting_error.h"
#include "urdmemodel.h"
#include "propensities.h"
#include <math.h>
#include <gsl/gsl_cblas.h>

/* Sparse matrix-dense vector product. (double) */
inline void smvd(double *x, int N,size_t *ir, size_t *jc, double *s,double *y)
{
	int i,j,start,stop;
	double rhs;
	
	start = jc[0];
	
	for(i=0;i<N;i++){
		
		rhs = x[i];
		stop=jc[i+1];
		
		for(j=start;j<stop;j++)
			y[ir[j]]+=s[j]*rhs;
		
		start = stop;
		
	}
	
}

/* Sparse matrix-dense vector product. (int) */ 
inline void smvi(int *x, int N,size_t *ir, size_t *jc, int *s,double *y)
{
	int i,j,start,stop;
	double rhs;
	
	start = jc[0];
	
	for(i=0;i<N;i++){
		
		rhs = (double) x[i];
		stop=jc[i+1];
		
		for(j=start;j<stop;j++)
			y[ir[j]]+=s[j]*rhs;
		
		start = stop;
		
	}
	
}
//====================================================
void estimate_splitting_error_sub( size_t *jcD,size_t *irD,double *prD,
								   int *x,double *ddiag,double *deltax,
								   const urdme_model*model
								   ){
    int j,j2,r,l,dof;
	size_t j3;
	int success;
	
	int NUM_RXNS = model->Mreactions;
	int NUM_SPECIES = model->Mspecies;
    int NUM_VOXELS = model->Ncells;
    
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
    
	size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;
	
    int Ndofs = NUM_VOXELS*NUM_SPECIES;
    size_t dsize = model->dsize; 
	//printf("estimate_splitting_error_sub(): Mreactions=%i Mspecies=%i Ndofs=%i\n",Mreactions,Mspecies,Ndofs);
    //double a1,a2,a3,a4,e1,e2,e3,e4,err_temp;
    
    int spec;
	int sv;
	
	double rtemp;
	double *datavector;
	int sdd;
	
	double rp,rm;
	
	//printf("%s:%i  malloc() xx\n",__FILE__,__LINE__);
    //int* xx=(int*)malloc(Mspecies*sizeof(int));
	int xx[NUM_SPECIES];
	
   	/* First evaluate the propesities in the needed points */
	//printf("%s:%i  malloc() tr\n",__FILE__,__LINE__);
	//double *tr = (double *)calloc(Mspecies,sizeof(double));
	double tr[NUM_SPECIES];
	double rhs;//,rhs1,rhs2;
	
	//======================================================
	//======================================================
	//printf("%s:%i  malloc() Dx_l\n",__FILE__,__LINE__);
	//double*Dx_l=(double*)calloc(Mspecies,sizeof(double));
	double Dx_l[NUM_SPECIES];
	memset(Dx_l,0,NUM_SPECIES);
	//printf("%s:%i  malloc() DRx_l\n",__FILE__,__LINE__);
	//double*DRx_l=(double*)calloc(Mspecies,sizeof(double));
	double DRx_l[NUM_SPECIES];
	memset(DRx_l,0,NUM_SPECIES);
	//printf("%s:%i  malloc() r0_l\n",__FILE__,__LINE__);
	//double*r0_l=(double*)calloc(Mreactions,sizeof(double));
	double r0_l[NUM_RXNS];
	memset(r0_l,0,NUM_RXNS);
	//======================================================
	//======================================================
	//for debugging
	//double*Dx_l_check = (double*)malloc(Ndofs*sizeof(double));
	//double*DRx_l_check = (double*)malloc(Ndofs*sizeof(double));
	
	//======================================================
	
	for (sv=0; sv<NUM_VOXELS; sv++) {
		// inversion of the above loop
	    for (r=0; r<NUM_RXNS; r++) {
			r0_l[r]=(*rfun[r])(&x[NUM_SPECIES*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
			//r0_l[r]=call_propensity(r,&x[NUM_SPECIES*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
	    }
        
		for (spec=0; spec<NUM_SPECIES; spec++) {
			dof = sv*NUM_SPECIES+spec;
			DRx_l[spec]=0.0;
			Dx_l[spec]=0.0;
			for (j=jcD[dof];j<jcD[dof+1]; j++) {
                
				int other_dof=irD[j];
				int other_sv=floor(other_dof/NUM_SPECIES);
				
                if (other_dof!=dof) {
#if 0
					//THIS IS WRONG!  diffusion is not symmetric
					Dx_l[spec]+=prD[j]*x[other_dof];  // assuming symmetric diffusion
#else
					success=0;
					for(j3=jcD[other_dof];j3<jcD[other_dof+1];j3++){
						if(irD[j3]==dof){
							Dx_l[spec]+=prD[j3]*x[other_dof];
							success=1;
							//printf("dof=%i, other_dof=%i, other_sv=%i j3=%lu jcD[other_dof]=%i irD[j3]=%i jcD[other_dof+1]=%i\n",dof,other_dof,other_sv,j3,jcD[other_dof],irD[j3],jcD[other_dof+1]);
							break;
						}
					}
					if(!success){
						printf("%s:%i ERROR[%i]: 'Dx' looking in column %i for connection to %i, not found\n",__FILE__,__LINE__,sv,other_dof,dof);
						exit(0);
						return;
					}
#endif
					//if(sv==0){printf("%i: Dx_l[spec=%i]+=prD[j]*x[other_dof=%i]=(%e)*(%i)\n",sv,spec,other_dof,prD[j],x[other_dof]);}
					double tr_l=0.0;
					for (r=0; r<NUM_RXNS;r++ ) {
						rhs=(*rfun[r])(&x[NUM_SPECIES*other_sv],0.0,model->vol[other_sv], &(model->data[other_sv*dsize]),model->sd[other_sv]);
						//rhs=call_propensity(r,&x[NUM_SPECIES*other_sv],0.0,model->vol[other_sv], &(model->data[other_sv*dsize]),model->sd[other_sv]);
						for (j2=jcN[r]; j2<jcN[r+1]; j2++) {
							if(irN[j2]==spec){
								//if(sv==0){printf("%i: tr_l+=rhs+N[spec=%i][r=%i]=(%e)*(%i) [dof=%i]\n",sv,spec,r,rhs,prN[j2],other_dof);}
								tr_l+=rhs*prN[j2];
							}
						}
					}
#if 0
					//THIS IS WRONG!  diffusion is not symmetric
					DRx_l[spec]+=prD[j]*tr_l;
#else
					success=0;
					for(j3=jcD[other_dof];j3<jcD[other_dof+1];j3++){
						if(irD[j3]==dof){
							DRx_l[spec]+=prD[j3]*tr_l;
							success=1;
							//printf("dof=%i, other_dof=%i, other_sv=%i j3=%lu jcD[other_dof]=%i irD[j3]=%i jcD[other_dof+1]=%i\n",dof,other_dof,other_sv,j3,jcD[other_dof],irD[j3],jcD[other_dof+1]);
							break;
						}
					}
					if(!success){
						printf("%s:%i ERROR[%i]: 'DRx' looking in column %i for connection to %i, not found\n",__FILE__,__LINE__,sv,other_dof,dof);
						exit(0);
						return;
					}
#endif
					//if(sv==0){printf("%i DRx_l[spec=%i]+=prD[j]*tr_l=(%e)*(%e) [dof=%i]\n",sv,spec,prD[j],tr_l,other_dof);}
				}else{
					//irD==dof
					double tr_l=0.0;
					for (r=0; r<NUM_RXNS;r++ ) {
						rhs=r0_l[r];
						for (j2=jcN[r]; j2<jcN[r+1]; j2++) {
							if(irN[j2]==spec){
								tr_l+=rhs*prN[j2];
								//if(sv==0){printf("%i: tr_l+=rhs+N[spec=%i][r=%i]=(%e)*(%i) [dof=%i]\n",sv,spec,r,rhs,prN[j2],dof);}
							}
							
						}
					}
					DRx_l[spec]+=prD[j]*tr_l;
					//if(sv==0){printf("%i DRx_l[spec=%i]+=prD[j]*tr_l=(%e)*(%e) [dof=%i]\n",sv,spec,prD[j],tr_l,dof);}
				}
				//DRx_l[spec]+=prD[j]*tr[irD[j]]; 
				// 
			}
			
		}
		//======================================================
		//debugging
		//for (spec=0; spec<Mspecies; spec++) {
		//	dof = sv*Mspecies+spec;
		//	Dx_l_check[dof]=Dx_l[spec];
		//	DRx_l_check[dof]=DRx_l[spec];
		//}
		//======================================================
		
		//for(spec=0;spec<Mspecies;spec++){
		//	if(sv==0){printf("%i DRx_l[spec=%i]=(%e)\n",sv,spec,DRx_l[spec]);}
		//}
		//for(spec=0;spec<Mspecies;spec++){
		//	if(sv==0){printf("%i Dx_l[spec=%i]=(%e)\n",sv,spec,Dx_l[spec]);}
		//}
		
		// --- --- --- --- --- --- --- --- --- --- ---
		// --- rest of the lower loop below here
		// --- --- --- --- --- --- --- --- --- --- ---
		/* Copy the state to a smaller vector */
		for(spec=0;spec<NUM_SPECIES;spec++){
			xx[spec]=x[sv*NUM_SPECIES+spec];
		}
		datavector=(&model->data[sv*dsize]);
		sdd = model->sd[sv];
		
		for (r=0; r<NUM_RXNS; r++) {
			rtemp = r0_l[r];
			r0_l[r]=0;
			/* For those n_irs that are non_zero. (For mass action it should be sum over reactants only). */
			for (l=jcN[r];l<jcN[r+1];l++){
			    spec=irN[l];
				xx[spec]++;
				rp=(*rfun[r])(xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				//rp=call_propensity(r,xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				xx[spec]--;
				xx[spec]--;
				rm=(*rfun[r])(xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				//rm=call_propensity(r,xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				xx[spec]++;
				r0_l[r]+=(ddiag[sv*NUM_SPECIES+spec]*rm*xx[spec]+rp*Dx_l[spec]);
				
			}	
		}
		// Calculate delta[X]
		memset(tr,0.0,NUM_SPECIES*sizeof(double));
		for (r=0; r<NUM_RXNS;r++ ) {
			rhs=r0_l[r];
			for (j=jcN[r]; j<jcN[r+1]; j++) {
				tr[irN[j]]+=(rhs*prN[j]);
			}
		}
		for (spec=0; spec<NUM_SPECIES; spec++) {
			deltax[sv*NUM_SPECIES+spec] = DRx_l[spec]-tr[spec];
		}
	}
	
	//printf("%s:%i  free() xx\n",__FILE__,__LINE__);
    //free(xx);
	//printf("%s:%i  free() tr\n",__FILE__,__LINE__);
	//free(tr);
	//printf("%s:%i  free() Dx_l\n",__FILE__,__LINE__);
	//free(Dx_l);
	//printf("%s:%i  free() DRx_l\n",__FILE__,__LINE__);
	//free(DRx_l);
	//printf("%s:%i  free() r0_l\n",__FILE__,__LINE__);
	//free(r0_l);	
	//printf("estimate_splitting_error_sub(): done\n");
}
//=====================================================================================

//====================================================
void estimate_splitting_error_sub2( size_t *jcD,size_t *irD,double *prD,
                                  int *x,double *ddiag,double *deltax,
                                  const urdme_model*model
                                  ){
    int j,j2,r,l,dof;
	size_t j3;
	int success;
	
	int NUM_RXNS = model->Mreactions;
	int NUM_SPECIES = model->Mspecies;
    int NUM_VOXELS = model->Ncells;
    
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
    
	size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;
	
    int Ndofs = NUM_VOXELS*NUM_SPECIES;
    size_t dsize = model->dsize;

    int spec;
	int sv;
	
	double rtemp;
	double *datavector;
	int sdd;
	
	double rp,rm;
	int xx[NUM_SPECIES];
	
   	/* First evaluate the propesities in the needed points */
	//double *tr = (double *)calloc(Mspecies,sizeof(double));
	double tr[NUM_SPECIES];
	double rhs;//,rhs1,rhs2;
    
    //=====================================================
	double Dx_l[NUM_SPECIES];
	memset(Dx_l,0,NUM_SPECIES);
	//printf("%s:%i  malloc() DRx_l\n",__FILE__,__LINE__);
	//double*DRx_l=(double*)calloc(Mspecies,sizeof(double));
	double DRx_l[NUM_SPECIES];
	memset(DRx_l,0,NUM_SPECIES);
	//printf("%s:%i  malloc() r0_l\n",__FILE__,__LINE__);
	//double*r0_l=(double*)calloc(Mreactions,sizeof(double));
	double r0_l[NUM_RXNS];
	memset(r0_l,0,NUM_RXNS);
	//======================================================
	//======================================================
	//for debugging
	//double*Dx_l_check = (double*)malloc(Ndofs*sizeof(double));
	//double*DRx_l_check = (double*)malloc(Ndofs*sizeof(double));
	
	//======================================================
	
    
    /* Evaluate the propensities at the current state x.
     THIS COMPUTATION CAN BE OVERLAPPED WITH INITIALIZATION OF THE REACTION STEP!!*/
	//int sv;
	//for (sv=0; sv<Ncells; sv++) {
	//    for (r=0; r<R; r++) {
    //        r0g[sv*Mreactions+r]=(*rfun[r])(&x[Mspecies*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
	//    }
	//}
    
	/* Assemble right-hand side of RREs, R(x) */
	double *rre_rhs;
	rre_rhs = (double *)calloc(Ndofs,sizeof(double));
	//double *trg;
	//tr = (double *)calloc(Mspecies,sizeof(double));
	//double rhs;
	int start,stop;
    double *r0g;
    r0g = (double *)calloc(NUM_RXNS*NUM_VOXELS,sizeof(double));
	/* First pass, compute R(x) for each dof */
	for (sv=0; sv<NUM_VOXELS; sv++) {
		memset(tr,0.0,NUM_SPECIES*sizeof(double));
		start = jcN[0];
		for (r=0; r<NUM_RXNS;r++ ) {
			rhs=(*rfun[r])(&x[NUM_SPECIES*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
			r0g[NUM_RXNS*sv+r]=rhs;
            stop = jcN[r+1];
			for (j=start; j<stop; j++) {
				tr[irN[j]]+=rhs*prN[j];
			}
			start=stop;
		}
		for (spec=0; spec<NUM_SPECIES; spec++) {
			rre_rhs[sv*NUM_SPECIES+spec]=tr[spec];
		}
	}
	
    
	for (sv=0; sv<NUM_VOXELS; sv++) {
		// inversion of the above loop
	    for (r=0; r<NUM_RXNS; r++) {
			//r0_l[r]=(*rfun[r])(&x[NUM_SPECIES*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
            r0_l[r]=r0g[NUM_RXNS*sv+r];
			//r0_l[r]=call_propensity(r,&x[NUM_SPECIES*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
	    }
        
        
        
		for (spec=0; spec<NUM_SPECIES; spec++) {
			dof = sv*NUM_SPECIES+spec;
			DRx_l[spec]=0.0;
			Dx_l[spec]=0.0;
			for (j=jcD[dof];j<jcD[dof+1]; j++) {
				int other_dof=irD[j];
				int other_sv=floor(other_dof/NUM_SPECIES);
                
				if (other_dof!=dof) {
#if 0
					//THIS IS WRONG!  diffusion is not symmetric
					Dx_l[spec]+=prD[j]*x[other_dof];  // assuming symmetric diffusion
#else
					success=0;
					for(j3=jcD[other_dof];j3<jcD[other_dof+1];j3++){
						if(irD[j3]==dof){
							Dx_l[spec]+=prD[j3]*x[other_dof];
							success=1;
							//printf("dof=%i, other_dof=%i, other_sv=%i j3=%lu jcD[other_dof]=%i irD[j3]=%i jcD[other_dof+1]=%i\n",dof,other_dof,other_sv,j3,jcD[other_dof],irD[j3],jcD[other_dof+1]);
							break;
						}
					}
					if(!success){
						printf("%s:%i ERROR[%i]: 'Dx' looking in column %i for connection to %i, not found\n",__FILE__,__LINE__,sv,other_dof,dof);
						exit(0);
						return;
					}
#endif
					//if(sv==0){printf("%i: Dx_l[spec=%i]+=prD[j]*x[other_dof=%i]=(%e)*(%i)\n",sv,spec,other_dof,prD[j],x[other_dof]);}
					double tr_l=0.0;
                    tr_l =rre_rhs[other_dof];
					//for (r=0; r<NUM_RXNS;r++ ) {
					//	rhs=(*rfun[r])(&x[NUM_SPECIES*other_sv],0.0,model->vol[other_sv], &(model->data[other_sv*dsize]),model->sd[other_sv]);
						//rhs=call_propensity(r,&x[NUM_SPECIES*other_sv],0.0,model->vol[other_sv], &(model->data[other_sv*dsize]),model->sd[other_sv]);
					//	for (j2=jcN[r]; j2<jcN[r+1]; j2++) {
					//		if(irN[j2]==spec){
					//			//if(sv==0){printf("%i: tr_l+=rhs+N[spec=%i][r=%i]=(%e)*(%i) [dof=%i]\n",sv,spec,r,rhs,prN[j2],other_dof);}
					//			tr_l+=rhs*prN[j2];
					//		}
					//	}
					//}
#if 0
					//THIS IS WRONG!  diffusion is not symmetric
					DRx_l[spec]+=prD[j]*tr_l;
#else
					success=0;
					for(j3=jcD[other_dof];j3<jcD[other_dof+1];j3++){
						if(irD[j3]==dof){
							DRx_l[spec]+=prD[j3]*tr_l;
							success=1;
							//printf("dof=%i, other_dof=%i, other_sv=%i j3=%lu jcD[other_dof]=%i irD[j3]=%i jcD[other_dof+1]=%i\n",dof,other_dof,other_sv,j3,jcD[other_dof],irD[j3],jcD[other_dof+1]);
							break;
						}
					}
					if(!success){
						printf("%s:%i ERROR[%i]: 'DRx' looking in column %i for connection to %i, not found\n",__FILE__,__LINE__,sv,other_dof,dof);
						exit(0);
						return;
					}
#endif
					//if(sv==0){printf("%i DRx_l[spec=%i]+=prD[j]*tr_l=(%e)*(%e) [dof=%i]\n",sv,spec,prD[j],tr_l,other_dof);}
				}else{
					//irD==dof
					double tr_l=0.0;
					for (r=0; r<NUM_RXNS;r++ ) {
						rhs=r0_l[r];
						for (j2=jcN[r]; j2<jcN[r+1]; j2++) {
							if(irN[j2]==spec){
								tr_l+=rhs*prN[j2];
								//if(sv==0){printf("%i: tr_l+=rhs+N[spec=%i][r=%i]=(%e)*(%i) [dof=%i]\n",sv,spec,r,rhs,prN[j2],dof);}
							}
							
						}
					}
					DRx_l[spec]+=prD[j]*tr_l;
					//if(sv==0){printf("%i DRx_l[spec=%i]+=prD[j]*tr_l=(%e)*(%e) [dof=%i]\n",sv,spec,prD[j],tr_l,dof);}
				}
				//DRx_l[spec]+=prD[j]*tr[irD[j]];
				//
			}
			
		}
		//======================================================
		//debugging
		//for (spec=0; spec<Mspecies; spec++) {
		//	dof = sv*Mspecies+spec;
		//	Dx_l_check[dof]=Dx_l[spec];
		//	DRx_l_check[dof]=DRx_l[spec];
		//}
		//======================================================
		
		//for(spec=0;spec<Mspecies;spec++){
		//	if(sv==0){printf("%i DRx_l[spec=%i]=(%e)\n",sv,spec,DRx_l[spec]);}
		//}
		//for(spec=0;spec<Mspecies;spec++){
		//	if(sv==0){printf("%i Dx_l[spec=%i]=(%e)\n",sv,spec,Dx_l[spec]);}
		//}
		
		// --- --- --- --- --- --- --- --- --- --- ---
		// --- rest of the lower loop below here
		// --- --- --- --- --- --- --- --- --- --- ---
		/* Copy the state to a smaller vector */
		for(spec=0;spec<NUM_SPECIES;spec++){
			xx[spec]=x[sv*NUM_SPECIES+spec];
		}
		datavector=(&model->data[sv*dsize]);
		sdd = model->sd[sv];
		
		for (r=0; r<NUM_RXNS; r++) {
			rtemp = r0_l[r];
			r0_l[r]=0;
			/* For those n_irs that are non_zero. (For mass action it should be sum over reactants only). */
			for (l=jcN[r];l<jcN[r+1];l++){
			    spec=irN[l];
				xx[spec]++;
				rp=(*rfun[r])(xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				//rp=call_propensity(r,xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				xx[spec]--;
				xx[spec]--;
				rm=(*rfun[r])(xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				//rm=call_propensity(r,xx,0.0,model->vol[sv], datavector,sdd)-rtemp;
				xx[spec]++;
				r0_l[r]+=(ddiag[sv*NUM_SPECIES+spec]*rm*xx[spec]+rp*Dx_l[spec]);
				
			}
		}
		// Calculate delta[X]
		memset(tr,0.0,NUM_SPECIES*sizeof(double));
		for (r=0; r<NUM_RXNS;r++ ) {
			rhs=r0_l[r];
			for (j=jcN[r]; j<jcN[r+1]; j++) {
				tr[irN[j]]+=(rhs*prN[j]);
			}
		}
		for (spec=0; spec<NUM_SPECIES; spec++) {
			deltax[sv*NUM_SPECIES+spec] = DRx_l[spec]-tr[spec];
		}
	}
	
    
    free(rre_rhs);
    free(r0g);
    
	//printf("%s:%i  free() xx\n",__FILE__,__LINE__);
    //free(xx);
	//printf("%s:%i  free() tr\n",__FILE__,__LINE__);
	//free(tr);
	//printf("%s:%i  free() Dx_l\n",__FILE__,__LINE__);
	//free(Dx_l);
	//printf("%s:%i  free() DRx_l\n",__FILE__,__LINE__);
	//free(DRx_l);
	//printf("%s:%i  free() r0_l\n",__FILE__,__LINE__);
	//free(r0_l);
	//printf("estimate_splitting_error_sub(): done\n");
}
//=====================================================================================


void estimate_splitting_error(const urdme_model *model,int *x,double *ddiag,double *deltax)
{	
	//estimate_splitting_error_sub(model->jcD,model->irD,model->prD,x,ddiag,deltax,model);
    estimate_splitting_error_mean(model,x,ddiag,deltax);
	return;
//#if defined(ESTIMATE_ERROR_MEAN)
//	estimate_splitting_error_mean(model,x,ddiag,deltax);
//#elif defined(ESTIMATE_ERROR_VAR)
//	estimate_splitting_error_var(model,x,ddiag,deltax);
//#elif defined(ESTIMATE_ERROR_BRUTE)
//	estimate_splitting_error_brute(model,x,ddiag,deltax);
//#else // default
//	estimate_splitting_error_mean(model,x,ddiag,deltax);
//#endif
	
}


/* For the general version. Estimates the error in g(X_{is}). */
inline double g(int x);
inline double g(int x)
{	
	int moment=1;	
	return pow((double)x,moment);		
}

#if defined(ESTIMATE_ERROR_BRUTE)
/* Estimate the local error in the conditional pdf. Any function g(X_{is}) */
void estimate_splitting_error_brute(const urdme_model *model,int *x,double *ddiag,double *deltax)
{
    double maxe=0.0;
    int i,j,k,r,l,s,m,dof,to_dof;
    int R,Mspecies;
    
    size_t *jcD = model->jcD;
    size_t *irD = model->irD;
    double *prD = model->prD;
    
    size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;	
    
    R = model->Mreactions;
    int Ndofs = model->Ncells*model->Mspecies; 
    Mspecies = model->Mspecies; 	    
    size_t dsize = model->dsize;
	
    /* We estimate l_1 error in pdf and l_infty (Kolmogorov distance) */	   
    double err_l1=0.0;
    double err_w1=0.0;	
    double cdf=0.0;
	
    double a1,a2,a3,a4,e1,e2,e3,e4,err_temp;
    
    int subvol,tosv,spec;
    int Ncells = model->Ncells;
	
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
	
	memset(deltax,0.0,Ndofs*sizeof(double));
    //double *deltax;
    //deltax = calloc(Ndofs,sizeof(double));		
	
    double *e5;
    e5 = (double *)calloc(20,sizeof(double));
    double err_nir[R];
    /* Evaluate contributions from states x^n +n_kr + nu_ijs */
	
    /* Loop over all degrees of fredom (species in a voxel) */
    double rates_k[R];
    int xx[Mspecies];	 		
	
    /* IN THIS IMPLEMENTAION WE ARE NOT USING THE FULL SPARSITY OF EQN (12) */
    for (subvol=0;subvol<Ncells;subvol++){
		
		for (r=0; r<R; r++) {
		    err_nir[r]=0.0;
		    rates_k[r]=(*rfun[r])(&x[Mspecies*subvol],0.0,model->vol[subvol], &(model->data[subvol*dsize]),model->sd[subvol]);
		}
		
		for (spec=0;spec<Mspecies;spec++){
        	
			dof = subvol*Mspecies+spec;			
			
			for(l=0;l<(jcD[dof+1]-jcD[dof]);l++)
				e5[l]=0.0; 		
			
			
			/* Loop over all reactions */ 		
			for (r=0;r<R;r++){
				
				a1=rates_k[r];
				
				/* Loop over all diffusion directions (edges from the subvolume to a neighbor) */
				m=0;
				for(j=jcD[dof];j<jcD[dof+1];j++){
					
					/* If not the diagonal entry in the D-matrix*/  
					if (irD[j]!=dof){ 
						
						/* We are considering the edge that connects sv and tosv */
						tosv   = irD[j]/Mspecies; 			    
						to_dof=tosv*Mspecies+spec;
						
						e4=prD[j]*x[dof]*a1;
						
						/* x + v_ijs */	
						x[dof]--;	
						a2 = (*rfun[r])(&x[Mspecies*subvol],0.0,model->vol[subvol], &(model->data[subvol*dsize]),model->sd[subvol]);	
						x[dof]++;
						
						e1=prD[j]*x[dof]*a2;
						
						/* Accumulate terms for state x^n+nu_{ijs} */
						e5[m]+=(prD[j]*x[dof]*(a2-a1));
						
						/* x+n_ir */
						for(s=0;s<Mspecies;s++)
							xx[s]=x[Mspecies*subvol+s];	
						
						for(l=jcN[r];l<jcN[r+1];l++)
							xx[irN[l]]+=prN[l];
						
						e2=prD[j]*xx[spec]*a1;
						
						/* x^n+n_kr+nu_ijs if k=i */
						e1 = e2-e1;
						
						/* "Strong error", l_1 error in pdf */
						err_l1+=fabs(e1);
						err_w1+=e1; // this is for an error check, err_w1 should be zero at the end.
						
						/* Weak error */
						xx[spec]--;
						
						for (s=0;s<Mspecies;s++)
							deltax[subvol*Mspecies+s]+=(g(xx[s])-g(x[Mspecies*subvol+s]))*e1;						
						
						deltax[to_dof]+=((g(x[to_dof]+1)-g(x[to_dof]))*e1);		
						
						/* Accumulate terms for state x^n+n_ir*/ 
						err_nir[r]+=(e4-e2);
						
						a3 = (*rfun[r])(&x[Mspecies*tosv],0.0, model->vol[tosv], &(model->data[tosv*dsize]),model->sd[tosv]);
						
						x[to_dof]++;
						a4 = (*rfun[r])(&x[Mspecies*tosv],0.0, model->vol[tosv], &(model->data[tosv*dsize]),model->sd[tosv]);
						x[to_dof]--;
						
						/* x^n+n_kr+nu_ijs if k=j */
						e1 = prD[j]*x[dof]*(a3-a4); 
						
						/* x+n_jr */
						for(s=0;s<Mspecies;s++)
							xx[s]=x[Mspecies*tosv+s];	
						
						for(l=jcN[r];l<jcN[r+1];l++)
							xx[irN[l]]+=prN[l];
						
						xx[spec]++;
						
						for (s=0;s<Mspecies;s++)
							deltax[tosv*Mspecies+s]+=((g(xx[s])-g(x[Mspecies*tosv+s]))*e1);
						
						deltax[dof]+=((g(x[dof]-1)-g(x[dof]))*e1);							
						
						err_l1+=fabs(e1);
						err_w1+=e1;
						
						/* Accumulate terms for state x^n+nu_{ijs} */
						e5[m]+=prD[j]*x[dof]*(a4-a3);	   					
						
						
					}
					m++;
				}// edge-loop
				
				
			}// Reaction-loop
			
			err_temp=0.0;
			for(m=0;m<(jcD[dof+1]-jcD[dof]);m++){
				
				err_l1+=fabs(e5[m]);	
				err_temp+=e5[m];				
				err_w1+=e5[m];	
				
				/* Weak error */
				to_dof = irD[jcD[dof]+m];
				if (to_dof!=dof){ 
					deltax[dof]+=((g(x[dof]-1)-g(x[dof]))*e5[m]);
					deltax[to_dof]+=((g(x[to_dof]+1)-g(x[to_dof]))*e5[m]);
				}
			}
			
			
	    } // Species-loop
		err_temp=0.0;	
		for (r=0; r<R; r++) {
			
			err_l1+=fabs(err_nir[r]);
			err_w1+=err_nir[r];
			err_temp+=err_nir[r];
			
			/* Weak error */
			for(s=0;s<Mspecies;s++)
			    xx[s]=x[Mspecies*subvol+s];
		    
			if (rates_k[r]>0.0)
				for(l=jcN[r];l<jcN[r+1];l++)
					xx[irN[l]]+=prN[l];
			
			for (s=0;s<Mspecies;s++)
				deltax[subvol*Mspecies+s]+=(g(xx[s])-g(x[Mspecies*subvol+s]))*err_nir[r];
		}
		
		
	} // Subvolume-loop

	
    free(e5);
	FREE_propensities(rfun);	
    		  	
}
#endif


/* Estimates the local error in mean based on the formulas derived from the PDE case. These 
 * coincide with the error in mean formulas in the manuscript for linear propensities only. */
void estimate_splitting_error_mean_pde(const urdme_model *model,int *x,double *ddiag,double *deltax)
{
    double maxe=0.0;
    int i,j,k,r,l,s,m,dof,to_dof;
    int R,Mspecies;
    	
    size_t *jcD = model->jcD;
    size_t *irD = model->irD;
    double *prD = model->prD;
    
    size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;	
    
    R = model->Mreactions;
    int Ndofs = model->Ncells*model->Mspecies; 
    Mspecies = model->Mspecies; 	    
    size_t dsize = model->dsize;
		
    double a1,a2,a3,a4,e1,e2,e3,e4,err_temp;
    
    int subvol,tosv,spec;
    int Ncells = model->Ncells;
	
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
		
	
    /* Evaluate contributions from states x^n +n_kr + nu_ijs */
	
    int xx[Mspecies];	 		
	
	/* INSERT NEW IMPLEMENTATION HERE */
	int Mreactions=R;

   	/* First evaluate the propesities in the needed points */
	double *r0,*rplus,*rminus;
	r0 = (double *)calloc(Ncells*Mreactions,sizeof(double));
		
	/* Evaluate the propensities at the current state x.
	   THIS COMPUTATION CAN BE OVERLAPPED WITH THE INITIALIZATION OF REACTION STEP!!*/
	int sv;
	for (sv=0; sv<Ncells; sv++) {
		for (r=0; r<R; r++) {
			r0[sv*Mreactions+r]=(*rfun[r])(&x[Mspecies*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
		}
	}
		
	
	/* Assemble right-hand side of RREs */
	double *rre_rhs;
	rre_rhs = (double *)calloc(Ndofs,sizeof(double));
	double *tr;
	tr = (double *)calloc(Mspecies,sizeof(double));
	double rhs;
	int start,stop;

	
	for (sv=0; sv<Ncells; sv++) {
		
		memset(tr,0.0,Mspecies*sizeof(double));
		
		start = jcN[0];
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			stop = jcN[r+1];
			for (j=start; j<stop; j++) {
				tr[irN[j]]+=rhs*prN[j];
			}
			start=stop;
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			rre_rhs[sv*Mspecies+spec]=tr[spec];
		}

	}
	
	/* Compute DR(x) and D*x. */
	double *Dx;
	Dx = (double *)calloc(Ndofs,sizeof(double)); 
	double *DRx;
	DRx = (double *)calloc(Ndofs,sizeof(double));
	double *RDx;
	RDx = (double *)calloc(Ndofs,sizeof(double));
	
	/* Dx */
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = x[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++) {
		    if (irD[j]!=i) {
			   Dx[irD[j]] += prD[j]*rhs;
			}			
		}
		start=stop;
	}
	
	/* DR(x) */
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = rre_rhs[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++)
			DRx[irD[j]] += prD[j]*rhs;
		start=stop;
	}
	
	/* R(Dx) */
	for (sv=0; sv<Ncells; sv++) {
        
		memset(tr,0.0,Mspecies*sizeof(double));
		
        start = jcN[0];
		for (r=0; r<Mreactions;r++ ) {
			rhs=(*rfun[r])(&Dx[Mspecies*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
			stop = jcN[r+1];
			for (j=start; j<stop; j++) {
				tr[irN[j]]+=rhs*prN[j];
			}
			start=stop;
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			RDx[sv*Mspecies+spec]=tr[spec];
		}

	}
	

	for (sv=0; sv<Ncells; sv++) {
		for (spec=0; spec<Mspecies; spec++) {
			deltax[sv*Mspecies+spec] = DRx[sv*Mspecies+spec]-RDx[sv*Mspecies+spec];
		}
	}
	
	free(rre_rhs);
	free(Dx);
	free(DRx);
	free(RDx);
	free(r0);
	free(tr);
	FREE_propensities(rfun);	
	
	
}


/* Estimates the local error in mean based on the conditional error in pdf. This is based on the error in 
   mean forumlas in the manuscript. */
void estimate_splitting_error_mean(const urdme_model *model,int *x,double *ddiag,double *deltax)
{
    
    double maxe=0.0;
    int i,j,k,r,l,s,m,dof,to_dof;
    int R,Mspecies;
	
    size_t *jcD = model->jcD;
    size_t *irD = model->irD;
    double *prD = model->prD;
    
    size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;	
    
    R = model->Mreactions;
    int Ndofs = model->Ncells*model->Mspecies; 
    Mspecies = model->Mspecies; 	    
    size_t dsize = model->dsize;
		
    double a1,a2,a3,a4,e1,e2,e3,e4,err_temp;
    
    int subvol,tosv,spec;
    int Ncells = model->Ncells;
	
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
		
    int* xx=(int*)malloc(Mspecies*sizeof(int));
	int Mreactions=R;

   	/* First evaluate the propesities in the needed points */
	double *r0,*rplus,*rminus;
	r0     = (double *)calloc(Ncells*Mreactions,sizeof(double));
	rplus  = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	rminus = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	
	
	/* Evaluate the propensities at the current state x.
	   THIS COMPUTATION CAN BE OVERLAPPED WITH INITIALIZATION OF THE REACTION STEP!!*/
	int sv;
	for (sv=0; sv<Ncells; sv++) {
	    for (r=0; r<R; r++) {
		r0[sv*Mreactions+r]=(*rfun[r])(&x[Mspecies*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
	    }
	}
		
	/* Assemble right-hand side of RREs, R(x) */
	double *rre_rhs;
	rre_rhs = (double *)calloc(Ndofs,sizeof(double));
	double *tr;
	tr = (double *)calloc(Mspecies,sizeof(double));
	double rhs;
	int start,stop;

	
	for (sv=0; sv<Ncells; sv++) {
		memset(tr,0.0,Mspecies*sizeof(double));
		start = jcN[0];
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			stop = jcN[r+1];
			for (j=start; j<stop; j++) {
				tr[irN[j]]+=rhs*prN[j];
			}
			start=stop;
		}
		for (spec=0; spec<Mspecies; spec++) {
			rre_rhs[sv*Mspecies+spec]=tr[spec];
		}
	}
	
	/* Compute DR(x) and D*x. */
	double *Dx;
	Dx = (double *)calloc(Ndofs,sizeof(double)); 
	
	double *DRx;
	DRx = (double *)calloc(Ndofs,sizeof(double)); 
			
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = x[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++) {
		    if (irD[j]!=i) {
			   Dx[irD[j]] += prD[j]*rhs;
			}			
		}
		start=stop;
	}
	
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = rre_rhs[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++)
			DRx[irD[j]] += prD[j]*rhs;
		start=stop;
	}
	
	double rtemp;
	double *datavector,vol;
	int sdd;
	
	double *temp1;
	temp1=(double *)calloc(Ncells,sizeof(double));
	
	double rp,rm;
	double templhs;

	for (sv=0; sv<Ncells; sv++) {
		
		dof = sv*Mspecies;
		
		/* Copy the state to a smaller vector */
		for(spec=0;spec<Mspecies;spec++)
			xx[spec]=x[dof+spec];
		
		datavector=(&model->data[sv*dsize]);
		sdd = model->sd[sv];
		vol = model->vol[sv];
		
		templhs=0.0;
		
		for (r=0; r<Mreactions; r++) {
			rtemp = r0[sv*Mreactions+r];
			r0[sv*Mreactions+r]=0.0;
			/* For those n_irs that are non_zero. (For mass action it should be sum over reactants only). */
			for (l=jcN[r];l<jcN[r+1];l++){
			    /* SHOULD CHECK THE SIGN HERE FOR FURTHER OPTIMIZATIONS! */
			    spec=irN[l];
				//if (prN[l]<0) {
					xx[spec]++;
					rp=(*rfun[r])(xx,0.0,vol, datavector,sdd)-rtemp;
					xx[spec]--;
					xx[spec]--;
					rm=(*rfun[r])(xx,0.0,vol, datavector,sdd)-rtemp;
					xx[spec]++;
					r0[sv*Mreactions+r]+=(ddiag[dof+spec]*rm*xx[spec]+rp*Dx[dof+spec]);
				//}
			}	
		
		}
	
	}
	
	
	for (sv=0; sv<Ncells; sv++) {
		memset(tr,0.0,Mspecies*sizeof(double));
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			for (j=jcN[r]; j<jcN[r+1]; j++) {
				tr[irN[j]]+=(rhs*prN[j]);
			}
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			deltax[sv*Mspecies+spec] = DRx[sv*Mspecies+spec]-tr[spec];
		}
		
	}
	
	
	free(rre_rhs);	
	free(Dx);
	free(DRx);
    free(xx);
	free(r0);
	free(rplus);
	free(rminus);
	free(temp1);
	free(tr);
	FREE_propensities(rfun);	
	
	
}

/* Estimates the local error in mean based on the conditional error in pdf. This is based on the error in
 mean forumlas in the manuscript. */
double estimate_splitting_error_mean_2(const urdme_model *model,int *x,double *ddiag,double *deltax)
{
    
    double maxe=0.0;
    int i,j,k,r,l,s,m,dof,to_dof;
    int R,Mspecies;
	
    size_t *jcD = model->jcD;
    size_t *irD = model->irD;
    double *prD = model->prD;
    
    size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;
        
    R = model->Mreactions;
    int Ndofs = model->Ncells*model->Mspecies;
    Mspecies = model->Mspecies;
    size_t dsize = model->dsize;
    
    double a1,a2,a3,a4,e1,e2,e3,e4,err_temp;
    
    int subvol,tosv,spec;
    int Ncells = model->Ncells;
	
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
    
    int* xx=(int*)malloc(Mspecies*sizeof(int));
	int Mreactions=R;
    
   	/* First evaluate the propesities in the needed points */
	double *r0,*rplus,*rminus;
	r0     = (double *)calloc(Ncells*Mreactions,sizeof(double));
	rplus  = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	rminus = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	
	
	/* Evaluate the propensities at the current state x.
     THIS COMPUTATION CAN BE OVERLAPPED WITH INITIALIZATION OF THE REACTION STEP!!*/
	int sv;
	for (sv=0; sv<Ncells; sv++) {
	    for (r=0; r<R; r++) {
            r0[sv*Mreactions+r]=(*rfun[r])(&x[Mspecies*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
	    }
	}
    
	/* Assemble right-hand side of RREs, R(x) */
	double *rre_rhs;
	rre_rhs = (double *)calloc(Ndofs,sizeof(double));
	double *tr;
	tr = (double *)calloc(Mspecies,sizeof(double));
	double rhs;
	int start,stop;
    
	
	for (sv=0; sv<Ncells; sv++) {
		
		memset(tr,0.0,Mspecies*sizeof(double));
		
		start = jcN[0];
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			stop = jcN[r+1];
			for (j=start; j<stop; j++) {
				tr[irN[j]]+=rhs*prN[j];
			}
			start=stop;
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			rre_rhs[sv*Mspecies+spec]=tr[spec];
		}
        
	}

	/* Compute DR(x) and D*x. */
	double *Dx;
	Dx = (double *)calloc(Ndofs,sizeof(double));
	
	double *DRx;
	DRx = (double *)calloc(Ndofs,sizeof(double));
    
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = x[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++) {
		    if (irD[j]!=i) {
                Dx[irD[j]] += prD[j]*rhs;
			}
		}
		start=stop;
	}
	
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = rre_rhs[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++)
			DRx[irD[j]] += prD[j]*rhs;
		start=stop;
	}
    
    /* Determing for how long this estimated timestep should be
       valid in the global algorithm. Based on the rate of change of E[X]. */
    double normx[Mspecies],normdx[Mspecies];
    for (spec=0; spec<Mspecies; spec++) {
        normx[spec]=0.0;
        normdx[spec]=0.0;
    }
    
    for (sv=0;sv<Ncells;sv++){
        for (spec=0;spec<Mspecies;spec++){
            normdx[spec] += model->vol[sv]*fabs((Dx[sv*Mspecies+spec]-ddiag[sv*Mspecies+spec]*x[sv*Mspecies+spec]+rre_rhs[sv*Mspecies+spec]));
            normx[spec]  += model->vol[sv]*x[sv*Mspecies+spec];
        }
    }
    
    double maxrelnorm=0.0;
        for (spec=0;spec<Mspecies;spec++){
        if (normx[spec]>0.0){
            if (normdx[spec]>maxrelnorm) {
                maxrelnorm=normdx[spec]/normx[spec];
            }
        }
    }
        
        
    
	
	double rtemp;
	double *datavector,vol;
	int sdd;
	
	double *temp1;
	temp1=(double *)calloc(Ncells,sizeof(double));
	
	double rp,rm;
	double templhs;
    
	for (sv=0; sv<Ncells; sv++) {
		
		dof = sv*Mspecies;
		
		/* Copy the state to a smaller vector */
		for(spec=0;spec<Mspecies;spec++)
			xx[spec]=x[dof+spec];
		
		datavector=(&model->data[sv*dsize]);
		sdd = model->sd[sv];
		vol = model->vol[sv];
		
		templhs=0.0;
		
		for (r=0; r<Mreactions; r++) {
			
			
			rtemp = r0[sv*Mreactions+r];
			r0[sv*Mreactions+r]=0;
			/* For those n_irs that are non_zero. (For mass action it should be sum over reactants only). */
			for (l=jcN[r];l<jcN[r+1];l++){
				
			    /* SHOULD CHECK THE SIGN HERE FOR FURTHER OPTIMIZATIONS! */
			    spec=irN[l];
				//if (prN[l]<0) {
                xx[spec]++;
                rp=(*rfun[r])(xx,0.0,vol, datavector,sdd)-rtemp;
                xx[spec]--;
                xx[spec]--;
                rm=(*rfun[r])(xx,0.0,vol, datavector,sdd)-rtemp;
                xx[spec]++;
                r0[sv*Mreactions+r]+=(ddiag[dof+spec]*rm*xx[spec]+rp*Dx[dof+spec]);
				//}
				
			}
            
		}
        
	}
	
	
	for (sv=0; sv<Ncells; sv++) {
		
		memset(tr,0.0,Mspecies*sizeof(double));
		
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			for (j=jcN[r]; j<jcN[r+1]; j++) {
				tr[irN[j]]+=(rhs*prN[j]);
			}
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			deltax[sv*Mspecies+spec] = DRx[sv*Mspecies+spec]-tr[spec];
		}
		
	}
	
	
	free(rre_rhs);
	free(Dx);
	free(DRx);
    free(xx);
	free(r0);
	free(rplus);
	free(rminus);
	free(temp1);
	free(tr);
	FREE_propensities(rfun);	
	
    return maxrelnorm;
	
}



/* Estimates the local error in mean based on the conditional error in pdf. This is based on the error in 
mean forumlas in the manuscript. */
void estimate_splitting_error_mean_opt(const urdme_model *model,int *x,double *ddiag,double *deltax)
{
    double maxe=0.0;
    int i,j,k,r,l,s,m,dof,to_dof;
    int R,Mspecies;
    
	size_t *jcD = model->jcD;
    size_t *irD = model->irD;
    double *prD = model->prD;
    
    size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;	
    
    R = model->Mreactions;
    int Ndofs = model->Ncells*model->Mspecies; 
    Mspecies = model->Mspecies; 	    
    size_t dsize = model->dsize;
	
    double a1,a2,a3,a4,e1,e2,e3,e4,err_temp;
    
    int subvol,tosv,spec;
    int Ncells = model->Ncells;
	
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
	
    int xx[Mspecies];	 		
	int Mreactions=R;
	
   	/* First evaluate the propesities in the needed points */
	double *r0,*rplus,*rminus;
	r0     = (double *)calloc(Ncells*Mreactions,sizeof(double));
	rplus  = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	rminus = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	
	
	/* Evaluate the propensities at the current state x.
	 THIS COMPUTATION CAN BE OVERLAPPED WITH INITIALIZATION OF THE REACTION STEP!!*/
	int sv;
	for (r=0; r<Mreactions; r++) {
	for (sv=0; sv<Ncells; sv++) {
			r0[sv*Mreactions+r]=(*rfun[r])(&x[Mspecies*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
	    }
	}
	
	/* Assemble right-hand side of RREs, R(x) */
	double *rre_rhs;
	rre_rhs = (double *)calloc(Ndofs,sizeof(double));
	double *tr;
	tr = (double *)calloc(Mspecies,sizeof(double));
	double rhs;
	int start,stop;
	
	
	for (sv=0; sv<Ncells; sv++) {
		
		memset(tr,0.0,Mspecies*sizeof(double));
		
		start = jcN[0];
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			stop = jcN[r+1];
			for (j=start; j<stop; j++) {
				tr[irN[j]]+=rhs*prN[j];
			}
			start=stop;
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			rre_rhs[sv*Mspecies+spec]=tr[spec];
		}
		
	}
	
	/* Compute DR(x) and D*x. */
	
	
	double *Dx;
	Dx = (double *)calloc(Ndofs,sizeof(double)); 
	double *DRx;
	DRx = (double *)calloc(Ndofs,sizeof(double)); 
	double rhs1,rhs2;
	
	double *DxDRx;
	DxDRx = (double *)calloc(2*Ndofs,sizeof(double));
	double *val,*valend;
	size_t *ind;
	size_t ix;
			
	
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		
		rhs1  = x[i];
		rhs2  = rre_rhs[i];
		
		stop = jcD[i+1];
		for (j=start;j<stop; j++) {
		    if (irD[j]!=i) {
				Dx[irD[j]] += prD[j]*rhs1;
			}
			DRx[irD[j]] += prD[j]*rhs2;
		}
		start=stop;
	}

	
	double rtemp;
	double *datavector,vol;
	int sdd;
	
	//double *temp1;
	//temp1=(double *)calloc(Ncells,sizeof(double));
	
	double rp,rm;
	double templhs;
	int xd;
	
	int *xplus;
	int *xminus;
	xplus = (int *)malloc(Ndofs*sizeof(int));
	xminus = (int *)malloc(Ndofs*sizeof(int));
   	
	for (r=0; r<Mreactions; r++) {
		
		start = jcN[r]; stop = jcN[r+1];
		
		// For non-zero n_irs 	
		for (l=start;l<stop;l++){
			
			if (prN[l]<0) {
				
				spec=irN[l];
				memcpy(xplus,x,Ndofs*sizeof(int));
				memcpy(xminus,x,Ndofs*sizeof(int));
				
				for (i=0; i<Ncells; i++) {
					xplus[i*Mspecies+spec]+=1.0;
				}
				for (i=0; i<Ncells; i++) {
					xminus[i*Mspecies+spec]-=1.0;
				}
				
				if (stop-start>1) {
					
					for (sv=0; sv<Ncells; sv++) {
						
						dof = sv*Mspecies;
						rtemp = r0[sv*Mreactions+r];
						r0[sv*Mreactions+r]=0.0;
						
						
						datavector=(&model->data[sv*dsize]);
						sdd = model->sd[sv];
						vol = model->vol[sv];
						
						rp=(*rfun[r])(&xplus[dof],0.0,vol, datavector,sdd)-rtemp;
						rm=(*rfun[r])(&xminus[dof],0.0,vol, datavector,sdd)-rtemp;
						r0[sv*Mreactions+r]+=(ddiag[dof+spec]*rm*x[dof+spec]+rp*Dx[dof+spec]);
						
					}
				}
				// If a linear reaction.
				//else if (stop-start>1){
				//	r0[sv*Mreactions+r]+=(*rfun[r])(&Dx[dof],0.0,vol, datavector,sdd);
				//}
				
			}		
		}
	}
	
	
	for (sv=0; sv<Ncells; sv++) {
		
		memset(tr,0.0,Mspecies*sizeof(double));
		
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			for (j=jcN[r]; j<jcN[r+1]; j++) {
				tr[irN[j]]+=(rhs*prN[j]);
			}
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			deltax[sv*Mspecies+spec] = DRx[sv*Mspecies+spec]-tr[spec];
		}
		
	}
	
	
	free(xplus);
	free(xminus);
	free(rre_rhs);	
	free(Dx);
	free(DxDRx);
	free(DRx);
	free(r0);
	free(rplus);
	free(rminus);
	//free(temp1);
	free(tr);
	FREE_propensities(rfun);	
	
	
}


#if defined(ESTIMATE_ERROR_VAR)
/* Estimates the local error in second moment based on the conditional error in pdf. This is based on the error in 
   variance forumlas in the manuscript. */
void estimate_splitting_error_var(const urdme_model *model,int *x,double *ddiag,double *deltax)
{
    double maxe=0.0;
    int i,j,k,r,l,s,m,dof,to_dof;
    int R,Mspecies;
    
    size_t *jcD = model->jcD;
    size_t *irD = model->irD;
    double *prD = model->prD;
    
    size_t *irN = model->irN;
    size_t *jcN = model->jcN;
    int *prN    = model->prN;	
    
    R = model->Mreactions;
    int Ndofs = model->Ncells*model->Mspecies; 
    Mspecies = model->Mspecies; 	    
    size_t dsize = model->dsize;
		
    double a1,a2,a3,a4,e1,e2,e3,e4,err_temp;
    
    int subvol,tosv,spec;
    int Ncells = model->Ncells;
	
    PropensityFun *rfun;
    rfun = ALLOC_propensities();
		
	
    /* Evaluate contributions from states x^n +n_kr + nu_ijs */
	
    int*xx = (int*)malloc(Mspecies*sizeof(int));
	
	/* INSERT NEW IMPLEMENTATION HERE */
	int Mreactions=R;

   	/* First evaluate the propesities in the needed points */
	double *r0,*rS,*rL,*rplus,*rminus;
	r0     = (double *)calloc(Ncells*Mreactions,sizeof(double));
	rS     = (double *)calloc(Ncells*Mspecies,sizeof(double));
	rL     = (double *)calloc(Ncells*Mreactions,sizeof(double));
	rplus  = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	rminus = (double *)calloc(Ncells*Mreactions*Mspecies,sizeof(double));
	memset(rS,0.0,Ncells*Mspecies*sizeof(double));
	
	
	/* Evaluate the propensities at the current state x.
	   THIS COMPUTATION CAN BE OVERLAPPED WITH INITIALIZATION OF REACTION STEP!!*/
	
	int sv;
	for (sv=0; sv<Ncells; sv++) {
		for (r=0; r<R; r++) {
			r0[sv*Mreactions+r]=(*rfun[r])(&x[Mspecies*sv],0.0,model->vol[sv], &(model->data[sv*dsize]),model->sd[sv]);
		}
	}
		
	
	/* Assemble right-hand side of RREs */
	double *rre_rhs;
	rre_rhs = (double *)calloc(Ndofs,sizeof(double));
	double *tr;
	tr = (double *)calloc(Mspecies,sizeof(double));
	double *trt;
	trt = (double *)calloc(Mspecies,sizeof(double));
	double *trl;
	trl = (double *)calloc(Mspecies,sizeof(double));
	double rhs;
	double rhs2;
	int start,stop;

	
	for (sv=0; sv<Ncells; sv++) {
		
		memset(tr,0.0,Mspecies*sizeof(double));
		
		start = jcN[0];
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
			stop = jcN[r+1];
			for (j=start; j<stop; j++) {
				tr[irN[j]]+=rhs*prN[j];
			}
			start=stop;
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			rre_rhs[sv*Mspecies+spec]=tr[spec];
		}

	}
	
	/* Compute DR(x) and D*x. */
	double *Dx;
	Dx = (double *)calloc(Ndofs,sizeof(double)); 
	
	double *DRx;
	DRx = (double *)calloc(Ndofs,sizeof(double)); 
			
	double *aDRx;
	aDRx = (double *)calloc(Ndofs,sizeof(double)); 
			
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = x[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++) {
		    if (irD[j]!=i) {
			   Dx[irD[j]] += prD[j]*rhs;
			}			
		}
		start=stop;
	}
	
	start=jcD[0];
	for (i=0; i<Ndofs; i++) {
		rhs  = rre_rhs[i];
		stop = jcD[i+1];
		for (j=start;j<stop; j++)
			DRx[irD[j]] += prD[j]*rhs;
			aDRx[irD[j]] += fabs(prD[j])*rhs;//first term in eq 21 (this can be done more efficiently just adding double the -diagonal to DRx)
		start=stop;
	}
	
	double rtemp;
	double *datavector,vol;
	int sdd;
	
	double *temp1;
	temp1=(double *)calloc(Ncells,sizeof(double));
	
	double rp,rm;
	double templhs;

	for (sv=0; sv<Ncells; sv++) {
		
		dof = sv*Mspecies;
		
		datavector=(&model->data[sv*dsize]);
		sdd = model->sd[sv];
		vol = model->vol[sv];
		
		/* Copy the state to a smaller vector */
		for(spec=0;spec<Mspecies;spec++){
			xx[spec]=x[dof+spec];
        }
		templhs=0.0;
		
		for (r=0; r<Mreactions; r++) {
			
			rtemp = r0[sv*Mreactions+r];
			r0[sv*Mreactions+r]=0;
			/* For those n_irs that are non_zero. (For mass action it should be sum over reactants only). */
			for (l=jcN[r];l<jcN[r+1];l++){
			    /* SHOULD CHECK THE SIGN HERE FOR FURTHER OPTIMIZATIONS! */
			    spec=irN[l];
				xx[spec]++;
			    rp=(*rfun[r])(xx,0.0,vol, datavector,sdd)-rtemp;
				xx[spec]--;
				xx[spec]--;
			    rm=(*rfun[r])(xx,0.0,vol, datavector,sdd)-rtemp;
				xx[spec]++;
				r0[sv*Mreactions+r]+=(ddiag[dof+spec]*rm*xx[spec]+rp*Dx[dof+spec]);
                rS[sv*Mspecies + spec] += (ddiag[dof+spec]*rm*xx[spec]-rp*Dx[dof+spec])*prN[l];//third term in eq 21
				rL[sv*Mreactions+r]+=(ddiag[dof+spec]*rtemp);
			}	
		}
	}
	
	
	for (sv=0; sv<Ncells; sv++) {
		
		memset(tr,0.0,Mspecies*sizeof(double));
		memset(trt,0.0,Mspecies*sizeof(double));
		memset(trl,0.0,Mspecies*sizeof(double));
		
		for (r=0; r<Mreactions;r++ ) {
			rhs=r0[sv*Mreactions+r];
            rhs2=rL[sv*Mreactions+r];
			for (j=jcN[r]; j<jcN[r+1]; j++) {
				tr[irN[j]]+=(rhs*prN[j]);
				trt[irN[j]]+=(rhs*prN[j]*prN[j]);//fourth term in eq 21
				trl[irN[j]]+=(rhs2*prN[j]*prN[j]);//fifth term in eq 21
			}
		}
		
		for (spec=0; spec<Mspecies; spec++) {
			deltax[sv*Mspecies+spec] = aDRx[sv*Mspecies+spec]  +  2*x[sv*Mspecies+spec]*(DRx[sv*Mspecies+spec]-tr[spec])  -  2*rS[sv*Mspecies+spec];//  -  trt[spec] - 2*trl[spec];
		}
		
	}
	
	

	free(Dx);
	free(DRx);
	free(aDRx);
    free(xx);
	free(r0);
	free(rS);
	free(rL);
	free(rplus);
	free(rminus);
	free(temp1);
	free(tr);
	free(trt);
	free(trl);
	FREE_propensities(rfun);	
	
	
}
#endif







