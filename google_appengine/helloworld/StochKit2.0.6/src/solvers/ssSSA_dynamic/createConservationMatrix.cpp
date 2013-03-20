#include "createConservationMatrix.h"
#include "rref.h"

void rref(ublas_matrix& M) {
	to_reduced_row_echelon_form(M);
}

//mimic MATLAB's eps function
double eps(double X) {
	//if 2^E <= abs(X) < 2^(E+1)
	//then eps(X) = 2^(E-52)
	
	//first, find E
	int E=(int)ceil(log2(abs(X)));
	
	return pow(2.0,((double)E-(double)52));
}

std::size_t rank(ublas_matrix& NU) {

//	std::cout << "computing rank of matrix:\n";
//	for (std::size_t i=0; i!=NU.size1(); ++i) {
//		for (std::size_t j=0; j!=NU.size2(); ++j) {
//			std::cout << NU(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}

	//svd algorithm expects M>=N, if not, transpose
	if (NU.size1()<NU.size2()) {
		//M<N, so transpose
		gsl_matrix * gslNU = gsl_matrix_alloc(NU.size1(),NU.size2());
		for (std::size_t i=0; i!=NU.size1(); ++i) {
			for (std::size_t j=0; j!=NU.size2(); ++j) {
				gsl_matrix_set(gslNU,i,j,NU(i,j));
			}
		}

		gsl_matrix * gslNUtranspose=gsl_matrix_alloc(gslNU->size2,gslNU->size1);
		gsl_matrix_transpose_memcpy(gslNUtranspose,gslNU);
		gsl_matrix * V=gsl_matrix_alloc(gslNUtranspose->size2,gslNUtranspose->size2);
		gsl_vector * s=gsl_vector_alloc(gslNUtranspose->size2);
		gsl_vector * work=gsl_vector_alloc(gslNUtranspose->size2);
		
		gsl_linalg_SV_decomp(gslNUtranspose,V,s,work);

		//use the MATLAB strategy for computing rank from singular values
		double tol=((double)gslNUtranspose->size1)*eps(gsl_vector_get(s,0));
		
		std::size_t r=0;
		for (std::size_t i=0; i!=s->size; ++i) {
			if (gsl_vector_get(s,i)>tol) ++r;
		}
		
		gsl_matrix_free(gslNU);
		gsl_matrix_free(gslNUtranspose);
		gsl_matrix_free(V);
		gsl_vector_free(s);
		gsl_vector_free(work);

		return r;
	}
	else {
//		std::cout << "M>=N not implemented. Terminating.\n";
//		exit(1);
		gsl_matrix * gslNU = gsl_matrix_alloc(NU.size1(),NU.size2());
		for (std::size_t i=0; i!=NU.size1(); ++i) {
			for (std::size_t j=0; j!=NU.size2(); ++j) {
				gsl_matrix_set(gslNU,i,j,NU(i,j));
			}
		}

//		gsl_matrix * gslNUtranspose=gsl_matrix_alloc(gslNU->size2,gslNU->size1);
//		gsl_matrix_transpose_memcpy(gslNUtranspose,gslNU);
//		gsl_matrix * V=gsl_matrix_alloc(gslNUtranspose->size2,gslNUtranspose->size2);
//		gsl_vector * s=gsl_vector_alloc(gslNUtranspose->size2);
//		gsl_vector * work=gsl_vector_alloc(gslNUtranspose->size2);
		gsl_matrix * V=gsl_matrix_alloc(gslNU->size2,gslNU->size2);
		gsl_vector * s=gsl_vector_alloc(gslNU->size2);
		gsl_vector * work=gsl_vector_alloc(gslNU->size2);
		
		gsl_linalg_SV_decomp(gslNU,V,s,work);

		//use the MATLAB strategy for computing rank from singular values
		double tol=((double)gslNU->size1)*eps(gsl_vector_get(s,0));
		
		std::size_t r=0;
		for (std::size_t i=0; i!=s->size; ++i) {
			if (gsl_vector_get(s,i)>tol) ++r;
		}
		
		gsl_matrix_free(gslNU);
//		gsl_matrix_free(gslNUtranspose);
		gsl_matrix_free(V);
		gsl_vector_free(s);
		gsl_vector_free(work);

//		std::cout << "rank is "<<r<<"\n";

		return r;

	}

}




//NU is stoichiometry matrix
ublas_matrix createConservationMatrix(ublas_matrix& NU) {
//	std::cout << "in createConservationMatrix...\n";

	//implement Sauro's algorithm for computing the "conservation matrix"
	
	//get rank of NU
	std::size_t r=rank(NU);
//	std::cout << "rank of NU is "<<r<<"\n";

//	//get reduced row echelon form of NU
	ublas_matrix M=NU;
	rref(M);
//	std::cout << "rref(NU):\n";
//	for (std::size_t i=0; i!=M.size1(); ++i) {
//		for (std::size_t j=0; j!=M.size2(); ++j) {
//			std::cout << M(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}

	//throw away the first n columns, where n=rank(NU)
	//should use "project" function
	ublas_matrix P(M.size1(),M.size2()-r);
	for (std::size_t i=0; i!=P.size1(); ++i) {
		for (std::size_t j=0; j!=P.size2(); ++j) {
			P(i,j)=M(i,j+r);
		}
	}
//	std::cout << "after throwing away first (rank) columns:\n";
//	for (std::size_t i=0; i!=P.size1(); ++i) {
//		for (std::size_t j=0; j!=P.size2(); ++j) {
//			std::cout << P(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}
	
	//throw away the last m rows, where m=(rows-rank(NU))
	//should use "project" function
//	std::cout << "after throwing away last (rows-rank) rows:\n";
	ublas_matrix Q(r,P.size2());
	for (std::size_t i=0; i!=Q.size1(); ++i) {
		for (std::size_t j=0; j!=Q.size2(); ++j) {
			Q(i,j)=P(i,j);
//			std::cout << Q(i,j) << "\t";
		}
//		std::cout << "\n";
	}
	
	//create "L0"--Q is "L0 transpose" in Sauro's notation
	ublas_matrix L0=boost::numeric::ublas::trans(Q);
//	std::cout << "L0:\n";
//	for (std::size_t i=0; i!=L0.size1(); ++i) {
//		for (std::size_t j=0; j!=L0.size2(); ++j) {
//			std::cout << L0(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}
	
	//create gamma = [-L0 eye(cols(NU)-cols(L0))]
	boost::numeric::ublas::identity_matrix<double> myeye(L0.size1(),NU.size2()-L0.size2());
	ublas_matrix gamma(L0.size1(), L0.size2() + (NU.size2()-L0.size2()));
	
//	std::cout << "gamma dimensions: "<<gamma.size1()<<" x "<<gamma.size2()<<"\n";
	
	//loop over -L0, insert into gamma
	for (std::size_t i=0; i!=L0.size1(); ++i) {
		for (std::size_t j=0; j!=L0.size2(); ++j) {
			gamma(i,j)=-L0(i,j);
		}
	}
	//loop over "myeye", insert into gamma
	for (std::size_t i=0; i!=myeye.size1(); ++i) {
		for (std::size_t j=0; j!=myeye.size2(); ++j) {
			gamma(i,j+L0.size2())=myeye(i,j);
		}
	}

//	std::cout << "gamma:\n";
//	for (std::size_t i=0; i!=gamma.size1(); ++i) {
//		for (std::size_t j=0; j!=gamma.size2(); ++j) {
//			std::cout << gamma(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}

	return gamma;
}
