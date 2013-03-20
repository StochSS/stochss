#include "IVFP_version_for_ode.h"	

template <typename Iterator>
inline bool next_combination(const Iterator first, Iterator k, const Iterator last)
{
   /* Credits: Thomas Draper */
   if ((first == last) || (first == k) || (last == k))
      return false;
   Iterator itr1 = first;
   Iterator itr2 = last;
   ++itr1;
   if (last == itr1)
      return false;
   itr1 = last;
   --itr1;
   itr1 = k;
   --itr2;
   while (first != itr1)
   {
      if (*--itr1 < *itr2)
      {
         Iterator j = k;
         while (!(*itr1 < *j)) ++j;
         std::iter_swap(itr1,j);
         ++itr1;
         ++j;
         itr2 = k;
         std::rotate(itr1,j,last);
         while (last != j)
         {
            ++j;
            ++itr2;
         }
         std::rotate(k,itr2,last);
         return true;
      }
   }
   std::rotate(first,k,last);
   return false;
}


IVFP_version_for_ode::IVFP_version_for_ode(independentSpeciesFunction indSpecFunc) : pmatrix(0),initial_pmatrix(0), seenFailedApplyAltStoichWarning(false), independentSpeciesFn(indSpecFunc) {
	#ifdef PROFILE_EQUILIBRIUM
	//altStoich_time=0;
	equilibrium_time=0;
	equilibrium_calls=0;
	A_time=0;
	b_time=0;
	solve_time=0;
	#endif
}

bool IVFP_version_for_ode::equals(dense_vec& a, dense_vec& b) {
	for (std::size_t i=0; i!=a.size(); ++i) {
		if (a(i)!=b(i)) {
			return false;
		}
	}
	return true;
}


void IVFP_version_for_ode::setVFP(std::vector<std::size_t> fastReactionIndexes, std::vector<ElementaryReaction>& allReactions) {

//	std::cout << "in IVFP_version_for_ode::setVFP...\n";
//	std::cout << "fastReactionIndexes=";
//	for (std::size_t i=0; i!=fastReactionIndexes.size(); ++i) {
//		std::cout << fastReactionIndexes[i] << "\t";
//	}
//	std::cout << "\n";
	
	this->fastReactionIndexes=fastReactionIndexes;

//	std::cout << "about to buildFastReactionsReindexed...\n";

	buildFastReactionsReindexed(allReactions);
	
	buildSlowRxnFastSpeciesStoich(allReactions);

	buildListOfSlowRxnStoichIsZero();

	//create the alternate stoichiometries...
	//AlternateStoichiometries::create needs...a complicated list of fast Reactants...create it
	//these "dependencies" are...fast species that must exist...in order to fire...slow...rxn...?
	std::vector<Reactants> slowRxnFastSpeciesReindexedStoichDependencies(slowRxnFastSpeciesStoich.size());
	for (std::size_t i=0; i!=allReactions.size(); ++i) {
		//first, copy reactants from original reaction into slowRxnFastSpeciesReindexedStoichDependencies
		Reactants originalReactants=allReactions[i].getReactants();
		std::vector<Reactant> slowRxnFastSpeciesReindexedReactants;
		//now loop over reactants, if fast species, reindex and add to kept Reactant list
		for (std::size_t j=0; j!=originalReactants.size(); ++j) {
			if (isFastSpecies(originalReactants[j].getSpeciesIndex())) {
				Reactant theReactant(fastIndex(originalReactants[j].getSpeciesIndex()),originalReactants[j].getMoleculeCount());
				slowRxnFastSpeciesReindexedReactants.push_back(theReactant);
			}
		}
		std::sort(slowRxnFastSpeciesReindexedReactants.begin(),slowRxnFastSpeciesReindexedReactants.end(),Reactants::compareReactantSpeciesIndexes);//
		slowRxnFastSpeciesReindexedStoichDependencies[i]=slowRxnFastSpeciesReindexedReactants;
	}

	
	NumberOfFastSpecies=fastSpeciesIndexes.size();
	NumberOfFastReactions=fastReactionsReindexed.size();

//	std::cout << "number of species in full model: "<<NumberOfFastSpecies<<"\n";

	//need to know rank of NU to get matrix and vector sizes right
	boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(fastReactionsReindexed,NumberOfFastSpecies);
	std::size_t rankNU=rank(tmpNU);

//	std::cout << "rank is "<<rankNU<<"\n";

	conservationConstants.resize(NumberOfFastSpecies-rankNU);
	
	J=boost::numeric::ublas::zero_matrix<double>(rankNU,rankNU);
	J_template=boost::numeric::ublas::zero_matrix<double>(NumberOfFastSpecies,NumberOfFastSpecies);//no longer used
	latestRealizablePopulation.resize(NumberOfFastSpecies);
//	std::cout << "just resized latestRealizablePopulation in IVFP_version_for_ode to be size "<<latestRealizablePopulation.size()<<"\n";
	std::fill(latestRealizablePopulation.begin(),latestRealizablePopulation.end(),0.0);
	b.resize(rankNU);
	std::fill(b.begin(),b.end(),0.0);

	NU=boost::numeric::ublas::zero_matrix<double>(NumberOfFastReactions,NumberOfFastSpecies);

	propensities.resize(NumberOfFastReactions);
	std::fill(propensities.begin(),propensities.end(),0.0);
	equilibriumPopulation.resize(NumberOfFastSpecies);
	std::fill(equilibriumPopulation.begin(),equilibriumPopulation.end(),0.0);

	buildJ_template();
	
	//copy J_template into J
	//gsl_matrix_memcpy(J,J_template);		
//	J=J_template;
	
	//build NU
	for (std::size_t row=0; row!=fastReactionsReindexed.size(); ++row) {
		//iterate over nonzero elements, store in NU
		//for now, just iterate over all elements...
		for (std::size_t col=0; col!=fastReactionsReindexed[row].getStoichiometry().size(); ++col) {
			NU(row,col)=fastReactionsReindexed[row].getStoichiometry()(col);
		}
	}

	pmatrix.resize(NumberOfFastSpecies);
	initial_pmatrix.resize(NumberOfFastSpecies);
	for (std::size_t i=0; i!=NumberOfFastSpecies; ++i) {
		initial_pmatrix(i)=i;
	}
	buildSecondOrderFastReactionReindexedList();

}//end setVFP

void IVFP_version_for_ode::buildSecondOrderFastReactionReindexedList() {
	for (std::size_t i=0; i!=NumberOfFastReactions; ++i) {
		if (fastReactionsReindexed[i].calculateReactionOrder()==2) {
			secondOrderFastReactionReindexedList.push_back(i);
		}
	}
}

void IVFP_version_for_ode::buildJ_template() {
	//build J_template
	//loop over fast reactions, if 0th order, do nothing
	//if first-order, add term to J_template
	for (std::size_t i=0; i!=NumberOfFastReactions; ++i) {
		std::size_t rxnOrder=fastReactionsReindexed[i].calculateReactionOrder();
		if (rxnOrder==1) {
			std::size_t theReactant=fastReactionsReindexed[i].getReactants()[0].getSpeciesIndex();
			double unscaled_jacobian_term=fastReactionsReindexed[i].d_dx_i(theReactant,b);//dummy population value
			//iterate over nonzero elements in stoichiometry
			sparse_vec stoich=fastReactionsReindexed[i].getStoichiometry();
			for (sparse_vec::iterator it=stoich.begin(); it!=stoich.end(); ++it) {
				double scaled_jacobian_term=(*it)*unscaled_jacobian_term;
				std::size_t row=it.index();
				std::size_t col=theReactant;
				J_template(row,col)=J(row,col)+scaled_jacobian_term;
			}
		}
	}
}

void IVFP_version_for_ode::buildFastReactionsReindexed(std::vector<ElementaryReaction>& allReactions) {
//	std::cout << "in buildFastReactionsReindexed...\n";
	std::vector<ElementaryReaction> fastRxns(fastReactionIndexes.size());

	for (std::size_t i=0; i!=fastReactionIndexes.size(); ++i) {
		fastRxns[i]=allReactions[fastReactionIndexes[i]];
	}

	fastReactionsReindexed.clear();
	fastReactionsReindexed.resize(fastRxns.size());
	//loop over reactions, fast species indexes
	
	//keep maxSpeciesIndex for later
	std::size_t maxSpeciesIndex=0;
	
	for (std::size_t i=0; i!=fastRxns.size(); ++i) {
		//get Reactants
		Reactants r=fastRxns[i].getReactants();
		for (std::size_t j=0; j!=r.size(); ++j) {
//			fastSpeciesIndexes.push_back(r[j].getSpeciesIndex());
			if (r[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=r[j].getSpeciesIndex();
		}
		//get Products
		Products p=fastRxns[i].getProducts();
		for (std::size_t j=0; j!=p.size(); ++j) {
//			fastSpeciesIndexes.push_back(p[j].getSpeciesIndex());
			if (p[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=p[j].getSpeciesIndex();
		}
		
	}
	//remove duplicates
//	std::sort(fastSpeciesIndexes.begin(), fastSpeciesIndexes.end());
//	fastSpeciesIndexes.erase(std::unique(fastSpeciesIndexes.begin(),fastSpeciesIndexes.end()),fastSpeciesIndexes.end());
		

	boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(fastRxns,maxSpeciesIndex+1);
	
//	std::cout << "rank is: ";
	std::size_t rankNU=rank(tmpNU);
//	std::cout << rankNU << "\n";
	
//	std::cout << "exiting here in build fast reactions reindexed\n";
//	exit(1);
	
	boost::numeric::ublas::matrix<double> trialIndependentNU(fastRxns.size(),rankNU);

//	std::cout << "StochKit MESSAGE (IVFP_version_for_ode::buildFastReactionsReindexed): reordering species (this function not optimized, may take a few moments)...\n";
	//reorder the species so that the first rankNU species indexes are linearly independent
	//old code used a brute force search, slow.
	//so moved the brute force search to the precompile phase and created the independnet species function that returns a list of independent species

	if (independentSpeciesFn==0) {
		std::cout << "StochKit MESSAGE (IVFP_version_for_ode::buildFastReactionsReindexed): independent species function not assigned. Terminating.\n";
		exit(1);
	}

//	std::cout << "independentSpeciesFn IS assigned, here is what it would return:\n";
	std::vector<std::size_t> independentSpecies=independentSpeciesFn();
//	for (std::size_t i=0; i!=independentSpecies.size(); ++i) {
//		std::cout << independentSpecies[i] << "\t";
//	}
//	std::cout << "\n";
//
//	//see if first rankNU columns has rank=rankNU
//	//build a matrix using only first rankNU columns of NU
//	std::size_t mycounter=0;
//	do {
////		std::cout << "mycounter="<< ++mycounter << "\n";
//		for (std::size_t i=0; i!=rankNU; ++i) {
//			//get the column from tmpNU that corresponds to the fast species index that appears in the ith position of fastSpeciesOrder
//			boost::numeric::ublas::matrix_column<boost::numeric::ublas::matrix<double> > col(tmpNU,fastSpeciesIndexes[i]);
//					
////			std::cout << "inserting fast species "<<fastSpeciesIndexes[i]<< " stoich into column "<<i<<"\n";
//			
//			//put the values of the column into trialIndependentNU
//			for (std::size_t j=0; j!=col.size(); ++j) {
//				trialIndependentNU(j,i)=col(j);
//			}
//		}
//
//		std::size_t testRank=rank(trialIndependentNU);
////		std::cout << "rank of trialIndependentNU is "<<testRank<<"\n";
//		if (testRank==rankNU) {
////			std::cout << "linearly independent columns found, don't need to try any other combinations.\n";
//			break;
//		}
//	} while(next_combination(fastSpeciesIndexes.begin(),fastSpeciesIndexes.begin()+rankNU,fastSpeciesIndexes.end()));
//
//std::cout << "fast species indexes now looks like: \n";
//for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
//	std::cout << fastSpeciesIndexes[i] << "\t";
//}
//std::cout << "\n";

	//append missing species indexes to back of independentSpecies
	//but just put it into fastSpeciesIndexes so I don't have to change any code below...
	fastSpeciesIndexes=independentSpecies;
	for (std::size_t i=0; i<=maxSpeciesIndex; ++i) {
		if (find(independentSpecies.begin(),independentSpecies.end(),i)==independentSpecies.end()) {
			fastSpeciesIndexes.push_back(i);
		}
	}


	//end section to fix stoich column=0 fast species
	
//		std::cout << "StochKit MESSAGE (IVFP_version_for_ode::buildFastReactionsReindexed): reordering complete, continuing...\n";
	
	//build a new reaction set with new indexes to only have fast reactions
	//e.g. if fastSpeciesIndexes are 2 and 3, create new elementaryReaction objects with species indexes 0 and 1
	//which correspond to species 2 and 3 in the full system
	for (std::size_t i=0; i!=fastRxns.size(); ++i) {
		
		Reactants oldReactants=fastRxns[i].getReactants();
		std::vector<Reactant> newReactantVector;
		//loop over oldReactants
		for (std::size_t j=0; j!=oldReactants.size(); ++j) {
			std::size_t newIndex=fastIndex(oldReactants[j].getSpeciesIndex());
			int count=oldReactants[j].getMoleculeCount();
			Reactant r(newIndex, count);
			newReactantVector.push_back(r);
		}
		Products oldProducts=fastRxns[i].getProducts();
		std::vector<Product> newProductVector;
		//loop over oldProducts
		for (std::size_t j=0; j!=oldProducts.size(); ++j) {

			std::size_t newIndex=fastIndex(oldProducts[j].getSpeciesIndex());
			int count=oldProducts[j].getMoleculeCount();
			Product p(newIndex, count);
			newProductVector.push_back(p);
		}

		Reactants newReactants(newReactantVector);
		Products newProducts(newProductVector);

		ElementaryReaction rxn(fastRxns[i].getRateConstant(),newReactants,newProducts,fastSpeciesIndexes.size());

		fastReactionsReindexed[i]=rxn;
	}
	
//	std::cout << "finished building reindexed fast process...\n";
//	std::cout << "fast species reindexed and original indexes:\n";
//	for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
//		std::cout << "fastIndex "<<fastIndex(fastSpeciesIndexes[i])<<" corresponds to original index "<<fastSpeciesIndexes[i]<<"\n";
//	}
//	
//	std::cout << "reindexed fast reactions:\n";
//	for (std::size_t i=0; i!=fastReactionsReindexed.size(); ++i) {
//		std::cout << "fast rxn "<<i<<": ";
//		fastReactionsReindexed[i].display();
//		std::cout << "\n";
//	}
}

void IVFP_version_for_ode::buildSlowRxnFastSpeciesStoich(std::vector<ElementaryReaction>& allReactions) {
//	std::cout << "in buildSlowRxnFastSpeciesStoich...\n";

	slowRxnFastSpeciesStoich.resize(allReactions.size());
		
	//loop over allReactions
	for (std::size_t i=0; i!=allReactions.size(); ++i) {
		//if reaction is slow, loop over its stoichiometry
//		if ( std::find(fastReactionIndexes.begin(),fastReactionIndexes.end(),i) == fastReactionIndexes.end()) {
//			std::cout << "reaction "<<i<<" is not in this vfp...\n";
			//first fill fast stoich with zeroes
			slowRxnFastSpeciesStoich[i].resize(fastSpeciesIndexes.size());
			std::fill(slowRxnFastSpeciesStoich[i].begin(),slowRxnFastSpeciesStoich[i].end(),0.0);
			//now loop over stoichiometry
			sparse_vec fullStoichVec=allReactions[i].getStoichiometry();
			//loop over full stoichiometry, put fast species components into slowRxnFastSpeciesStoich
			sparse_vec::iterator sparse_it;
			for (sparse_it=fullStoichVec.begin(); sparse_it!=fullStoichVec.end(); ++sparse_it) {
				if (isFastSpecies(sparse_it.index())) {
					slowRxnFastSpeciesStoich[i](fastIndex(sparse_it.index()))=*sparse_it;
				}
			}
//		}
	}
//	std::cout << "exiting buildSlowRxnFastSpeciesStoich\n";
}

void IVFP_version_for_ode::buildListOfSlowRxnStoichIsZero() {
//	std::cout << "in buildListOfSlowRxnStoichIsZero...\n";
	slowRxnStoichIsZero.resize(slowRxnFastSpeciesStoich.size());

	//loop over slowRxnFastSpeciesStoich
	for (std::size_t i=0; i!=slowRxnFastSpeciesStoich.size(); ++i) {
		bool foundNonzero=false;
		for (std::size_t j=0; j!=slowRxnFastSpeciesStoich[i].size(); ++j) {
			if (slowRxnFastSpeciesStoich[i](j)!=0.0) {
				foundNonzero=true;
				break;
			}
		}
		if (foundNonzero) {
			slowRxnStoichIsZero[i]=false;
		}
		else {
			slowRxnStoichIsZero[i]=true;
		}
	}
//	std::cout << "exiting buildListOfSlowRxnStoichIsZero\n";
}


void IVFP_version_for_ode::update_J(dense_vec& y) {
	J=J_template;

//	std::cout << "after copying J_template\n";
//	print_ublas_matrix(J,NumberOfFastSpecies,NumberOfFastSpecies);

//	std::cout << "secondOrderFastReactionReindexedList.size()="<<secondOrderFastReactionReindexedList.size()<<"\n";
	
//	std::cout << "y is "<<"\n";
//	print_ublas_vector(y,y.size());
//	std::cout << "\n";
	
	//then we get the population-dependent terms that come from 2nd order reactions
	//iterate over 2nd order reactions
	for (std::size_t i=0; i!=secondOrderFastReactionReindexedList.size(); ++i) {
		//iterate over the reactions' reactants
		const std::size_t fastrxn=secondOrderFastReactionReindexedList[i];
		std::cout << "working on fastrxn "<<fastrxn<<"\n";
		Reactants theReactants=fastReactionsReindexed[fastrxn].getReactants();
		for (std::size_t j=0; j!=theReactants.size(); ++j) {
			const std::size_t currentReactant=theReactants[j].getSpeciesIndex();
			std::cout << "working on currentReactant "<<currentReactant<<"\n";
			double unscaled_jacobian_term=fastReactionsReindexed[fastrxn].d_dx_i(currentReactant,y);
			std::cout << "unscaled_jacobian term: "<<unscaled_jacobian_term<<"\n";
			//add the APPROPRIATELY SCALED jacobian term to each row
			//non zero terms will be in rows corresponding to nonzero stoichiometry values

			//iterate over nonzero elements in fast stoichiometry
			sparse_vec stoich=fastReactionsReindexed[fastrxn].getStoichiometry();
			for (sparse_vec::const_iterator it=stoich.begin(); it!=stoich.end(); ++it) {
				double scaled_jacobian_term=(*it)*unscaled_jacobian_term;
				const std::size_t row=it.index();
				const std::size_t col=currentReactant;
				J(row,col)+=scaled_jacobian_term;
				std::cout << "adding "<<scaled_jacobian_term<< "to row,col "<<row<<","<<col<<"\n";
			}

		}
	}

//	std::cout << "after inserting terms from 2nd order reaction:\n";
//	print_ublas_m(J);

}


void IVFP_version_for_ode::update_A(dense_vec& y, double h) {
	update_J(y);
		
	J*=-h;
	for (std::size_t i=0; i!=NumberOfFastSpecies; ++i) {
		J(i,i)+=1;
	}
	
//	std::cout << "after updating A, A=\n";
//	print_ublas_m(J);
}

void IVFP_version_for_ode::update_b(dense_vec& yn_1, dense_vec& current_guess, double h) {
	
	update_propensities(propensities,current_guess);//moved this
	
//	std::cout << "propensities:\n";
//	print_ublas_vector(propensities,NumberOfFastReactions);
//	std::cout << "\n";
//	
//	std::cout << "NU=\n";
//	print_ublas_matrix(NU,NumberOfFastReactions,NumberOfFastSpecies);
	
	//multiply vector of propensities by h*NU to get hf(yn_v) term

	//NU*=h;
	axpy_prod(propensities*h,NU,b,true);
	
	b+=yn_1-current_guess;
//	std::cout << "b=\n";
//	print_ublas_vector(b,b.size());
//	std::cout << "\n";
}



int IVFP_version_for_ode::equilibrium(double relaxationTime, dense_vec& effectivePopulation, bool setNegativesToZero) {

//	std::cout << "in equilibrium (relaxationTime="<<relaxationTime<<")\n";
//	std::cout << "latest realizable population (size is "<<latestRealizablePopulation.size()<<"):\n";
//	print_ublas_v(latestRealizablePopulation);
//	std::cout << "\n";
//	std::cout << "previous effective population:\n";
//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
//	std::cout << "\n";
	
//	update_propensities(propensities,latestRealizablePopulation);
//	if (norm_1(propensities)==0) {
//		for (std::size_t i=0; i!=NumberOfFastSpecies; ++i) {
//			effectivePopulation(fastSpeciesIndexes[i])=latestRealizablePopulation(i);
//		}
//		return 0;
//	}
	
	equilibriumPopulation=latestRealizablePopulation;

//	std::cout << "the \"equilibriumPopulation\" before doing anything is:\n";
//	print_ublas_v(equilibriumPopulation);
//	std::cout << "\n";

	conservationConstantsFn(equilibriumPopulation,conservationConstants);

	A_function(J,equilibriumPopulation,relaxationTime,conservationConstants);

//	std::cout << "A:\n";
//	print_ublas_matrix(J,J.size1(),J.size2());

	//update_b(latestRealizablePopulation,equilibriumPopulation,relaxationTime);
	b_function(b,latestRealizablePopulation,equilibriumPopulation,relaxationTime,conservationConstants);
	
	//solve A*delta=b for delta
	
	pmatrix=initial_pmatrix;
	lu_factorize(J,pmatrix);	
	lu_substitute(J, pmatrix, b);//b gets overwritten with solution
	
	//first copy old population ito equilibriumPopulation
	//equilibriumPopulation=latestRealizablePopulation;
	//now add delta to equilibrium
	//noalias(equilibriumPopulation)=latestRealizablePopulation+b;//delta;
		
//	std::cout << "the \"equilibriumPopulation\" before adding b in first iteration:\n";
//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
//	std::cout << "\n";
	
//	equilibriumPopulation+=b;
	for (std::size_t i=0; i!=b.size(); ++i) {
		equilibriumPopulation(i)+=b(i);
	}

//	std::cout << "equilibrium after adding b:\n";
//	print_ublas_v(equilibriumPopulation);
//	std::cout << "\n";

	//begin 2nd iteration
//	std::cout << "beginning 2nd iteration...\n";

	A_function(J,equilibriumPopulation,relaxationTime,conservationConstants);
	
	b_function(b,latestRealizablePopulation,equilibriumPopulation,relaxationTime,conservationConstants);

	pmatrix=initial_pmatrix;
	lu_factorize(J,pmatrix);	
	lu_substitute(J, pmatrix, b);//b gets overwritten with solution

//	std::cout << "equilibrium before adding b:\n";
//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
//	std::cout << "\n";

	//now add delta to equilibrium
//	equilibriumPopulation+=b;//delta;
	for (std::size_t i=0; i!=b.size(); ++i) {
		//std::cout << "adding b("<<i<<")="<<b(i)<<"\n";
		equilibriumPopulation(i)+=b(i);
	}

//	std::cout << "equilibrium after adding b:\n";
//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
//	std::cout << "\n";

	//set values of dependent species
	dependentPopulationFn(equilibriumPopulation,conservationConstants);

//	std::cout << "equilibrium after second iteration and applying conservation constants:\n";
//	print_ublas_v(equilibriumPopulation);
//	std::cout << "\n";

	
	//now copy equilibrium population values to "effectivePopulation" vector
	//note, we could just add delta directly...
	bool foundNegative=false;
	for (std::size_t i=0; i!=NumberOfFastSpecies; ++i) {
		effectivePopulation(fastSpeciesIndexes[i])=equilibriumPopulation(i);
//		std::cout << "effectivePopulation["<<fastSpeciesIndexes[i]<<"]="<<effectivePopulation(fastSpeciesIndexes[i])<<"\n";
	
		if (effectivePopulation(fastSpeciesIndexes[i])<0.0 && setNegativesToZero) {
			foundNegative=true;
//			std::cout << "StochKit WARNING (IVFP_version_for_ode::equilibrium): negative equilibrium population detected, setting to 0.\n";
			//would probably be better to try a third iteration in this case...
			effectivePopulation(fastSpeciesIndexes[i])=0;
		}
	}

//	if (foundNegative) {
//		//do another iteration...
//		A_function(J,equilibriumPopulation,relaxationTime,conservationConstants);
//		
//		b_function(b,latestRealizablePopulation,equilibriumPopulation,relaxationTime,conservationConstants);
//
//		pmatrix=initial_pmatrix;
//		lu_factorize(J,pmatrix);	
//		lu_substitute(J, pmatrix, b);//b gets overwritten with solution
//
//	//	std::cout << "equilibrium before adding b:\n";
//	//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
//	//	std::cout << "\n";
//
//		//now add delta to equilibrium
//	//	equilibriumPopulation+=b;//delta;
//		for (std::size_t i=0; i!=b.size(); ++i) {
//			//std::cout << "adding b("<<i<<")="<<b(i)<<"\n";
//			equilibriumPopulation(i)+=b(i);
//		}
//
//	//	std::cout << "equilibrium after adding b:\n";
//	//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
//	//	std::cout << "\n";
//
//		//set values of dependent species
//		dependentPopulationFn(equilibriumPopulation,conservationConstants);
//		
//	}
//	
//	foundNegative=false;
//	for (std::size_t i=0; i!=NumberOfFastSpecies; ++i) {
//		effectivePopulation(fastSpeciesIndexes[i])=equilibriumPopulation(i);
////		std::cout << "effectivePopulation["<<fastSpeciesIndexes[i]<<"]="<<effectivePopulation(fastSpeciesIndexes[i])<<"\n";
//	
//		if (effectivePopulation(fastSpeciesIndexes[i])<0.0 && setNegativesToZero) {
//			foundNegative=true;
////			std::cout << "StochKit WARNING (IVFP_version_for_ode::equilibrium): negative equilibrium population detected (3rd iteration), setting to 0.\n";
//			effectivePopulation(fastSpeciesIndexes[i])=0;
//		}
//	}

	return 0;
}//end equilibrium


std::vector<std::size_t> IVFP_version_for_ode::getFastSpeciesIndexes() {
	return fastSpeciesIndexes;
}

bool IVFP_version_for_ode::isFastSpecies(std::size_t speciesIndex) {
	//inefficient--should instead have vector of bools indicating if fast or not
	if ( std::find(fastSpeciesIndexes.begin(),fastSpeciesIndexes.end(),speciesIndex) == fastSpeciesIndexes.end() ) {
		return false;
	}
	return true;
}

std::size_t IVFP_version_for_ode::originalIndex(std::size_t fastIndex) {
	if (fastIndex>fastSpeciesIndexes.size()) {
		std::cout << "StochKit ERROR (IVFP_version_for_ode::originalIndex): attempt to look up fast species index out of range. Terminating.\n";
		exit(1);
	}
	return fastSpeciesIndexes[fastIndex];
}
std::size_t IVFP_version_for_ode::fastIndex(std::size_t originalIndex) {
	//slow
	for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
		if (fastSpeciesIndexes[i]==originalIndex) {
			return i;
		}
	}
	std::cout << "StochKit ERROR (IVFP_version_for_ode::fastIndex): attempt to look up species not in list of fast species (originalIndex="<<originalIndex<<"). Terminating.\n";
	exit(1);
	return 0;
}

//	std::vector<ElementaryReaction<sparse_vec,dense_vec> >& getFastReactionsReindexed() {
std::vector<ElementaryReaction>& IVFP_version_for_ode::getFastReactionsReindexed() {
	return fastReactionsReindexed;
}

void IVFP_version_for_ode::update_propensities(dense_vec& propensities, dense_vec& population) {
	for (std::size_t i=0; i!=NumberOfFastReactions; ++i) {
		propensities(i)=fastReactionsReindexed[i].propensity(population);
	}
}

