#include "IndependentVirtualFastProcess.h"	

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


IndependentVirtualFastProcess::IndependentVirtualFastProcess() : pmatrix(0),initial_pmatrix(0), seenFailedApplyAltStoichWarning(false), seenSampleConservationWarning(false), seenFirePropensityZeroWarning(false), defaultRelaxationTime(1000) //just ensure not zero, but this value should be set to a correct value later
{
	#ifdef PROFILE_EQUILIBRIUM
	//altStoich_time=0;
	equilibrium_time=0;
	equilibrium_calls=0;
	A_time=0;
	b_time=0;
	solve_time=0;
	#endif
}

void IndependentVirtualFastProcess::update_propensities(dense_vec& propensities, dense_vec& population) {
	for (std::size_t i=0; i!=NumberOfFastReactions; ++i) {
		propensities(i)=fastReactionsReindexed[i].propensity(population);
	}
}

bool IndependentVirtualFastProcess::equals(dense_vec& a, dense_vec& b) {
	for (std::size_t i=0; i!=a.size(); ++i) {
		if (a(i)!=b(i)) {
			return false;
		}
	}
	return true;
}


void IndependentVirtualFastProcess::setVFP(std::vector<std::size_t> fastReactionIndexes, std::vector<ElementaryReaction>& allReactions) {
//	std::cout << "in IVFP setVFP...\n";
//	std::cout << "fastReactionIndexes=";
//	for (std::size_t i=0; i!=fastReactionIndexes.size(); ++i) {
//		std::cout << fastReactionIndexes[i] << "\t";
//	}
//	std::cout << "\n";

	slowRxnTimescaleViolationCounters.resize(allReactions.size());
	std::fill(slowRxnTimescaleViolationCounters.begin(),slowRxnTimescaleViolationCounters.end(),0);
	
	
	this->fastReactionIndexes=fastReactionIndexes;

//	std::cout << "about to buildFastReactionsReindexed...\n";

	buildFastReactionsReindexed(allReactions);

//	std::cout << "about to buildSlowRxnFastSpeciesStoich...\n";
	
	buildSlowRxnFastSpeciesStoich(allReactions);

//	std::cout << "about to buildListOfSlowRxnStoichIsZero...\n";

	buildListOfSlowRxnStoichIsZero();
	
//	std::cout << "creating alternate stoichiometries...\n";

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

//		std::cout << "slowRxnFastSpeciesReindexedStoichDependencies: size="<<slowRxnFastSpeciesReindexedStoichDependencies.size()<<"\n";
//		for (std::size_t i=0; i!=slowRxnFastSpeciesReindexedStoichDependencies.size(); ++i) {
//			Reactants theReactants=slowRxnFastSpeciesReindexedStoichDependencies[i];
//			std::cout << "slow rxn "<<i<<": ";
//			for (std::size_t j=0; j!=theReactants.size(); ++j) {
//				std::cout << theReactants[j].getSpeciesIndex() << " ("<<theReactants[j].getMoleculeCount()<<")\t";
//			}
//			std::cout << "\n";
//		}
//


//	std::cout << "about to create altStoichs...\n";
	altStoichs.create(fastReactionsReindexed,slowRxnFastSpeciesStoich,slowRxnFastSpeciesReindexedStoichDependencies);
//	std::cout << "done with altStoichs.create...\n";
	
	NumberOfFastSpecies=fastSpeciesIndexes.size();
	NumberOfFastReactions=fastReactionsReindexed.size();

//	std::cout << "number of fast species in this ivfp: "<<NumberOfFastSpecies<<"\n";

	//need to know rank of NU to get matrix and vector sizes right
	boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(fastReactionsReindexed,NumberOfFastSpecies);
//	std::size_t rankNU=rank(tmpNU);
	rankNU=rank(tmpNU);
	
	conservationConstants.resize(NumberOfFastSpecies-rankNU);
	
	J=boost::numeric::ublas::zero_matrix<double>(rankNU,rankNU);
	latestRealizablePopulation.resize(NumberOfFastSpecies);
	std::fill(latestRealizablePopulation.begin(),latestRealizablePopulation.end(),0.0);
	b.resize(rankNU);
	std::fill(b.begin(),b.end(),0.0);

	NU=boost::numeric::ublas::zero_matrix<double>(NumberOfFastReactions,NumberOfFastSpecies);

	propensities.resize(NumberOfFastReactions);
	std::fill(propensities.begin(),propensities.end(),0.0);
	equilibriumPopulation.resize(NumberOfFastSpecies);
	std::fill(equilibriumPopulation.begin(),equilibriumPopulation.end(),0.0);
	
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

//	std::cout << "building VFP ReversiblePair list...\n";
	//first, identify reversible pairs by stoichiometry
	//use reindexed to identify
	std::vector<std::vector<std::size_t> > pairs_reindexed=find_reversible_pairs_by_stoichiometry(fastReactionsReindexed);
	
//	std::cout << "number of reversible pairs="<<pairs_reindexed.size()<<"\n";
	
//	std::cout << "reindexed reversible pairs:\n";
//	for (std::size_t i=0; i!=pairs_reindexed.size(); ++i) {
//		for (std::size_t j=0; j!=pairs_reindexed[i].size(); ++j) {
//			std::cout << pairs_reindexed[i][j] << "\t";
//		}
//		std::cout << "\n";
//	}
	//build reversible pairs using ORIGINAL reactions
//	std::cout << "original indexed reversible pairs:\n";
//	for (std::size_t i=0; i!=pairs_reindexed.size(); ++i) {
//		for (std::size_t j=0; j!=pairs_reindexed[i].size(); ++j) {
//			std::cout << fastReactionIndexes[ pairs_reindexed[i][j] ] << "\t";
//		}
//		std::cout << "\n";
//	}
	for (std::size_t i=0; i!=pairs_reindexed.size(); ++i) {
		if (pairs_reindexed[i].size()!=2) {
			std::cout << "StochKit ERROR (IndependentVirtualFastProcess::setVFP): invalid reversible pair detected in VFP. Terminating.\n";
			exit(1);
		}
		ReversiblePair mypair(std::make_pair(  fastReactionIndexes[ pairs_reindexed[i][0] ] , fastReactionIndexes[ pairs_reindexed[i][1] ]),allReactions);
		reversiblePairs.push_back(mypair);
//		reversiblePairs_timescales.push_back(0.0);//initialize timescale to zero
		reversiblePairs_timescales.push_back( std::min(1.0/mypair.c1,1.0/mypair.c2) );//seems better estimate than 0
//		reversiblePairs_default_timescales.push_back(0.0);//initialize timescale to zero
	}

//std::cout << "reversiblePairs.size()="<<reversiblePairs.size()<<"\n";
//std::cout << "lets print the reversible pairs:\n";
//for (std::size_t i=0; i!=reversiblePairs.size(); ++i) {
//	std::cout << "reversiblePairs[i="<<i<<"]:\n";
//	allReactions[reversiblePairs[i].get_reaction_indexes().first].display();
//	std::cout << "\n";
//	allReactions[reversiblePairs[i].get_reaction_indexes().second].display();
//	std::cout << "\n";	
//}

	//build reaction_reversiblePairs_dependency
	reaction_reversiblePairs_dependency.resize(allReactions.size());
	//loop over reactions, find nonzero stoichiometry entries that are species in reversible pair list
	for (std::size_t i=0; i!=allReactions.size(); ++i) {
//		std::cout << "processing reaction i="<<i<<", display: ";
//		allReactions[i].display();
//		std::cout << "\n";
		sparse_vec stoich=allReactions[i].getStoichiometry();
		for (sparse_vec::iterator it=stoich.begin(); it!=stoich.end(); ++it) {
			std::size_t speciesIndex=it.index();
			for (std::size_t j=0; j!=reversiblePairs.size(); ++j) {
				if (reversiblePairs[j].containsSpecies(speciesIndex)) {
//					std::cout << "reversiblePairs["<<j<<"] contains species "<<speciesIndex<<", so...";
//					std::cout << "reaction "<<i<<" overlaps with reversible pair "<<j<<"...\n";
					reaction_reversiblePairs_dependency[i].push_back(j);
				}
//				else std::cout << "reversiblePairs["<<j<<"] DOES NOT CONTAIN species "<<speciesIndex<<"\n";
			}
		}
		//sort and remove duplicates
		std::sort(reaction_reversiblePairs_dependency[i].begin(), reaction_reversiblePairs_dependency[i].end());
		reaction_reversiblePairs_dependency[i].erase(std::unique(reaction_reversiblePairs_dependency[i].begin(),reaction_reversiblePairs_dependency[i].end()),reaction_reversiblePairs_dependency[i].end());		
	}

//	std::cout << "exiting setVFP\n";
}//end setVFP

void IndependentVirtualFastProcess::buildSecondOrderFastReactionReindexedList() {
	for (std::size_t i=0; i!=NumberOfFastReactions; ++i) {
		if (fastReactionsReindexed[i].calculateReactionOrder()==2) {
			secondOrderFastReactionReindexedList.push_back(i);
		}
	}
}

void IndependentVirtualFastProcess::buildFastReactionsReindexed(std::vector<ElementaryReaction>& allReactions) {
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
			fastSpeciesIndexes.push_back(r[j].getSpeciesIndex());
			if (r[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=r[j].getSpeciesIndex();
		}
		//get Products
		Products p=fastRxns[i].getProducts();
		for (std::size_t j=0; j!=p.size(); ++j) {
			fastSpeciesIndexes.push_back(p[j].getSpeciesIndex());
			if (p[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=p[j].getSpeciesIndex();
		}
		
	}
	//remove duplicates
	std::sort(fastSpeciesIndexes.begin(), fastSpeciesIndexes.end());
	fastSpeciesIndexes.erase(std::unique(fastSpeciesIndexes.begin(),fastSpeciesIndexes.end()),fastSpeciesIndexes.end());
		
//	std::cout << "fast species indexes in this vfp:\n";
//	for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
//		std::cout << fastSpeciesIndexes[i] <<"\t";
//	}
//	std::cout << "\n";
		
	//2011-07-13 kevin: this section is to fix stoich column=0 fast species
	//this occurs when a fast species appears in a vfp as an enzyme
	//this is a problem because the dy/dt is 0
	//to solve, check for stoich=0 column and put that species at back of list
	//don't think the other code relies on fast species being in same order as original indexes...
//	std::cout << "fixing zero column fast stoichiometry by reordering fast species...\n";

	//2011-07-20 kevin: UPDATE the true problem is that you must choose r=rank number of columns (species)
	//that themselves form a rank r matrix.  ideally, I would use a systematic method of pulling out r
	//independent columns.  instead, my strategy is to iterate through the combinations of r species
	//until I find one that leads to rank r. 
	//note: I have solved this in a better way elsewhere in the code, but this will do for now...I guess
	//	could have poor performance if IVFP was very large (ie contained many reaction channels)

	boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(fastRxns,maxSpeciesIndex+1);
//	std::cout << "full NU (may include empty slow species columns):\n";
//	print_ublas_matrix(tmpNU,tmpNU.size1(),tmpNU.size2());
	
//	std::cout << "rank is: ";
	std::size_t rankNU=rank(tmpNU);
//	std::cout << rankNU << "\n";
	
	boost::numeric::ublas::matrix<double> trialIndependentNU(fastRxns.size(),rankNU);

	//see if first rankNU columns has rank=rankNU
	//build a matrix using only first rankNU columns of NU
	do {
		for (std::size_t i=0; i!=rankNU; ++i) {
			//get the column from tmpNU that corresponds to the fast species index that appears in the ith position of fastSpeciesOrder
			boost::numeric::ublas::matrix_column<boost::numeric::ublas::matrix<double> > col(tmpNU,fastSpeciesIndexes[i]);
					
//			std::cout << "inserting fast species "<<fastSpeciesIndexes[i]<< " stoich into column "<<i<<"\n";
			
			//put the values of the column into trialIndependentNU
			for (std::size_t j=0; j!=col.size(); ++j) {
				trialIndependentNU(j,i)=col(j);
			}
		}

//		std::cout << "\"trialIndependentNU\":\n";
//		print_ublas_matrix(trialIndependentNU,trialIndependentNU.size1(), trialIndependentNU.size2());
		std::size_t testRank=rank(trialIndependentNU);
//		std::cout << "rank of trialIndependentNU is "<<testRank<<"\n";
		if (testRank==rankNU) {
//			std::cout << "linearly independent columns found, don't need to try any other combinations.\n";
			break;
		}
	} while(next_combination(fastSpeciesIndexes.begin(),fastSpeciesIndexes.begin()+rankNU,fastSpeciesIndexes.end()));
//	std::cout << "fast species order to be used: \n";
//	for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
//		std::cout << fastSpeciesIndexes[i] << "\t";
//	}
//	std::cout << "\n";
	
//	std::cout << "exiting here.\n";
//	exit(1);

	//end section to fix stoich column=0 fast species
	
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

void IndependentVirtualFastProcess::buildSlowRxnFastSpeciesStoich(std::vector<ElementaryReaction>& allReactions) {
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

void IndependentVirtualFastProcess::buildListOfSlowRxnStoichIsZero() {
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

void IndependentVirtualFastProcess::initialize(double initialRelaxationTime, dense_vec& initialPopulation, dense_vec& currentEffectivePopulation) {
	defaultRelaxationTime=initialRelaxationTime;
//	std::cout << "in IVFP.initialize...\n";
	//need to map original species indexes to fast species reindexed
	for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
//		std::cout << "setting latestRealizablePopulation("<<i<<")=initialPopulation("<<fastSpeciesIndexes[i]<<")="<<initialPopulation(fastSpeciesIndexes[i])<<"\n";
		latestRealizablePopulation(i)=initialPopulation(fastSpeciesIndexes[i]);
	}
	
	equilibriumPopulation=latestRealizablePopulation;
	
	equilibrium(defaultRelaxationTime, currentEffectivePopulation);
	
	//set reversible pair's timescales...
//	for (std::size_t i=0; i!= reversiblePairs.size(); ++i) {
//		reversiblePairs_timescales[i]=reversiblePairs[i].calculateRelaxationTime(currentEffectivePopulation);
//		//std::cout << "reversible pair "<<i<<" relaxation time="<<reversiblePairs_timescales[i]<<"\n";
//	//		if (reversiblePairs_default_timescales[i]==0) {
//	//			if (reversiblePairs_timescales[i]!=0) {
//	//				reversiblePairs_default_timescales[i]=reversiblePairs_timescales[i]
//	//			}
//	//			else {
//	//				reversiblePairs_default_timescales[i]=initialRelaxationTime;
//	//			}
//	//		}
//	}

	//is there a test we can do rather than assume that initially it is correct?
	accuracy_violated=false;
	std::fill(slowRxnTimescaleViolationCounters.begin(),slowRxnTimescaleViolationCounters.end(),0);
}

bool IndependentVirtualFastProcess::fireSlowReaction(std::size_t reactionIndex, dense_vec& currentEffectivePopulation, double reaction_propensity) {
//	std::cout << "in IVFP::fireSlowReaction...\n";
	//if slowRxn fast species stoichiometry is zero, we don't have to do anything
	if (slowRxnStoichIsZero[reactionIndex]) {
//		std::cout << "slow reaction stoichiometry is zero, returning true in fireSlowReaction\n";
		return true;
	}

	if (!altStoichs.applyAlternateStoichiometry(reactionIndex,latestRealizablePopulation)) {
		//see if this ivfp's fast propensities are all zero...
//		std::cout << "here I would see if this ivfp's propensities are all zero (which could happen, e.g., if A+A propensity has population 1)...\n";
//		std::cout << "for reference, \"latestRealizablePopulation\"=\n";
//		print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
//		std::cout << "\n";
//		bool allZeroPropensities=true;
//		for (std::size_t i=0; i!=NumberOfFastReactions; ++i) {
////			std::cout << "fast propensity "<<i<<"="<<fastReactionsReindexed[i].propensity(latestRealizablePopulation) << "\n";
//			if (fastReactionsReindexed[i].propensity(latestRealizablePopulation)!=0.0) allZeroPropensities=false;
//		}
//		//if all zero propensities, then fast species effective populations must all be zero! FALSE!
//		if (allZeroPropensities) {
//			for (std::size_t i=0; i!=latestRealizablePopulation.size(); ++i) {
////				currentEffectivePopulation[originalIndex(i)]=0.0;
//				
//			}
//			if (!seenFirePropensityZeroWarning) {
////				std::cout << "StochKit MESSAGE (IndependentVirtualFastProcess::fireSlowReaction): setting effective fast population to zero because fast process has propensity 0. (This message will only be displayed once per thread.)\n";
//				std::cout << "StochKit MESSAGE (IndependentVirtualFastProcess::fireSlowReaction): setting effective fast population to latest realizable population because fast process has propensity 0. (This message will only be displayed once per thread.)\n";
//				seenFirePropensityZeroWarning=true;
//			}
//			return true;
//		}

//this doesn't work because we don't have access to AplusAreactions
//		if (AplusAreactions.find(reactionIndex)!=AplusAreactions.end() && currentEffectivePopulation(reactions[reactionIndex].getReactants()[0].getSpeciesIndex()<=1.0)) {
//			std::cout << "StochKit MESSAGE (IndependentVirtualFastProcess::fireSlowReaction): offending reaction was A+A type with effective A population<=1.0...\n";
//			std::cout << "currentEffectivePopulation: \n";
//			print_ublas_vector(currentEffectivePopulation,currentEffectivePopulation.size());
//			std::cout << "\n";
//
//		}

		if (!seenFailedApplyAltStoichWarning) {
//			std::cout << "StochKit WARNING (IndependentVirtualFastProcess::fireSlowReaction): unable to apply an exact alternate stoichiometry (slow reaction index "<<reactionIndex<<"), will attempt to recover (conservation may be violated). (This message will only be displayed once per thread.)\n";
			std::cout << "StochKit WARNING (IndependentVirtualFastProcess::fireSlowReaction): unable to apply an exact alternate stoichiometry, will attempt to recover (conservation may be violated). (This message will only be displayed once per thread.)\n";
			seenFailedApplyAltStoichWarning=true;
			
//			std::cout << "more info:\n";
//			std::cout << "fast reaction indexes (this IVFP): ";
//			for (std::size_t i=0; i!=fastReactionIndexes.size(); ++i) {
//				std::cout << fastReactionIndexes[i] << "\t";
//			}
//			std::cout << "\n";
//			for (std::size_t i=0; i!=fastReactionsReindexed.size(); ++i) {
//				fastReactionsReindexed[i].display();
//				std::cout << "\n";
//			}
//			std::cout << "\n";
//			std::cout << "latest realizable pop: \n";
//			print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
//			std::cout << "\n";
//			std::cout << "exiting here\n";
//			exit(1);
		}
		
		//instead of trying to recover, just return false and let MasterVirtualFastProcess do the recovery.
//		std::cout << "returning false in IVFP::fire where previous version would have tried to recover...\n";
//		std::cout << "first, see latest realizable population:\n";
//		print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
//		std::cout << "\n";

		return false;
		
//		//try to just apply the true stoichiometry, then recalculate equilibrium, then round, set rounded value to new "realizable population"
//		std::cout << "trying to recover...\n";
//		
//		
//		std::cout << "latest realizable population:\n";
//		print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
//		std::cout << "\n";
////
////		std::cout << "slow reaction fast stoichiometry:\n";
//		dense_vec stoich=slowRxnFastSpeciesStoich[reactionIndex];
////		for (std::size_t i=0; i!=stoich.size(); ++i) {
////			std::cout << stoich(i) << "\t";
////		}
////		std::cout << "\n";
////
////		//"fire" regular stoichiometry
////		std::cout << "\"fire\" slow reaction stoichiometry...\n";
//		latestRealizablePopulation+=stoich;
////		std::cout << "new latest \"realizable\" population:\n";
////		print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
////		std::cout << "\n";
//		
//		//need to create a dummy "currentEffectivePopulation" for call to equilibrium
//		//size has to be able to accomodate largest original index of fast species
////		std::cout << "fast species indexes:\n";
////		for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
////			std::cout << fastSpeciesIndexes[i] << "\t";
////		}
////		std::cout << "\n";
////		std::size_t max_value=*(std::max_element(fastSpeciesIndexes.begin(),fastSpeciesIndexes.end()));
////		std::cout << "max value is "<<max_value<<"\n";
////		dense_vec dummyEffectivePopulation(max_value+1);
//		dense_vec dummyEffectivePopulation(currentEffectivePopulation.size());
//		
////		std::cout << "calling equilibrium on dummyEffectivePopulation...\n";
//		equilibrium(defaultRelaxationTime,dummyEffectivePopulation,false);//"false" so equilibrium doesn't set a negative equilibrium value to 0
//		
//		//copy rounded dummy effective values into latest realizable population
//		for (std::size_t i=0; i!=NumberOfFastSpecies; ++i) {
//			if (dummyEffectivePopulation(fastSpeciesIndexes[i]) < -1e-11) {
//				std::cout << "StochKit WARNING (IndependentVirtualFastProcess::fireSlowReaction): unable to recover. Setting negative value to zero and continuing but simulation may be inaccurate.\n";
//				
//				latestRealizablePopulation[i]=0;
//			}
//			else {
//				latestRealizablePopulation[i]=round(dummyEffectivePopulation(fastSpeciesIndexes[i]));
//			}
//		}
//
//		std::cout << "updated realizable population:\n";
//		print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
//		std::cout << "\n";		
//		
////		std::cout << "continuing...\n";
//		//return false;
	}
	
//	std::cout << "updated realizable population:"<<std::endl;
//	print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
//	std::cout << "\n";		

	
	//update equilibrium
	#ifdef PROFILE_EQUILIBRIUM
	gettimeofday(&timer3,NULL);
	et_start=timer3.tv_sec+(timer3.tv_usec/1000000.0);
	#endif
	++equilibrium_calls;

//	std::cout << "calling equilibrium in IVFP::fireSlowReaction...\n";

	if (equilibrium(defaultRelaxationTime,currentEffectivePopulation)!=0) {
//	if (equilibrium(500000,currentEffectivePopulation)!=0) {
		#ifdef PROFILE_EQUILIBRIUM
		gettimeofday(&timer4,NULL);
		et_end=timer4.tv_sec+(timer4.tv_usec/1000000.0);
		equilibrium_time+=(et_end-et_start);
		#endif
		return false;
	}
	
	#ifdef PROFILE_EQUILIBRIUM
	gettimeofday(&timer4,NULL);
	et_end=timer4.tv_sec+(timer4.tv_usec/1000000.0);
	equilibrium_time+=(et_end-et_start);
	#endif

	//update timescales...
	double longestTimescale=0.0;
	std::size_t longestTimescalePairIndex;

//	std::cout << "updating timescales...\n";
	for (std::size_t i=0; i!=reversiblePairs_timescales.size(); ++i) {
			reversiblePairs_timescales[i]=reversiblePairs[i].calculateRelaxationTime(currentEffectivePopulation);
//			std::cout << "timescale for pair i="<<i<<": "<<reversiblePairs_timescales[i]<<"\n";
			if (reversiblePairs_timescales[i]>longestTimescale) {
				longestTimescale=reversiblePairs_timescales[i];
				longestTimescalePairIndex=i;
			}
	}
	//look for timescale violation
	
	
//	std::cout << "longest timescale: "<<longestTimescale<<"\n";
//	std::cout << "longest timescale corresponds to reversible pair of reactions "<<reversiblePairs[longestTimescalePairIndex].get_reaction_indexes().first<<" and "<<reversiblePairs[longestTimescalePairIndex].get_reaction_indexes().second<<"\n";
//	std::cout << "reversible pair members: A="<<reversiblePairs[longestTimescalePairIndex].A<<" c1="<<reversiblePairs[longestTimescalePairIndex].c1<<" c2="<<reversiblePairs[longestTimescalePairIndex].c2<<"\n";
//	std::cout << "press enter key to continue.\n";
//	std::cin.get();
	
	
	
	//check for timescale violation
	//but note that we're checking CURRENT timescales against PREVIOUS slow reaction propensity...?
	
	if (8.0*reaction_propensity > 1.0/longestTimescale) {
//		std::cout << "StochKit WARNING: longestTimescale is "<<longestTimescale<<", but slow reaction propensity is "<<reaction_propensity<<"; insufficient scale separation.\n";
//		std::cout << "More details:\n";
//		std::cout << "reactionIndex="<<reactionIndex<<"\n";
//		std::cout << "effective pop:\n";
//		print_ublas_vector(currentEffectivePopulation,currentEffectivePopulation.size());
//		std::cout << "\n";
		++slowRxnTimescaleViolationCounters[reactionIndex];
//		std::cout << "this reaction ("<<reactionIndex<<") has seen "<<slowRxnTimescaleViolationCounters[reactionIndex]<<" timescale violations without a reset...\n";
////		std::cout << "latest realizable population is:\n";
//		std::cout << "longest timescale corresponds to reversible pair of reactions "<<reversiblePairs[longestTimescalePairIndex].get_reaction_indexes().first<<" and "<<reversiblePairs[longestTimescalePairIndex].get_reaction_indexes().second<<"\n";
//		std::cout << "reversible pair members: A="<<reversiblePairs[longestTimescalePairIndex].A<<" c1="<<reversiblePairs[longestTimescalePairIndex].c1<<" c2="<<reversiblePairs[longestTimescalePairIndex].c2<<"\n";
//		std::cout << "press enter key to continue.\n";
//		std::cin.get();
		if (slowRxnTimescaleViolationCounters[reactionIndex]>=3) {
//			std::cout << "limit of 3 timescale violations reached, setting accuracy_violated to true and returning false in IVFP.fire...\n";
			accuracy_violated=true;
			return false;
		}
	}
	else {
		if (slowRxnTimescaleViolationCounters[reactionIndex]!=0) {
//			std::cout << "resetting timescale violation counter for reaction index "<<reactionIndex<<" (longestTimescale="<<longestTimescale<<", reaction_propensity="<<reaction_propensity<<")\n";
//			std::cout << "press enter key to continue.\n";
//			std::cin.get();
		}
		slowRxnTimescaleViolationCounters[reactionIndex]=0;
	}
	return true;
}//end fireSlowReaction




int IndependentVirtualFastProcess::equilibrium(double relaxationTime, dense_vec& effectivePopulation, bool setNegativesToZero) {

//	std::cout << "in equilibrium (relaxationTime="<<relaxationTime<<")\n";
//	std::cout << "latest realizable population:\n";
//	print_ublas_vector(latestRealizablePopulation,latestRealizablePopulation.size());
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
	
//	std::cout << "EXITING IN IVFP::EQUILIBRIUM.\n";
//	exit(1);
	
	equilibriumPopulation=latestRealizablePopulation;

//	std::cout << "the \"equilibriumPopulation\" before doing anything is:\n";
//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
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
//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
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
//	print_ublas_vector(equilibriumPopulation,equilibriumPopulation.size());
//	std::cout << "\n";

	
	//now copy equilibrium population values to "effectivePopulation" vector
	//note, we could just add delta directly...
	bool foundNegative=false;
	for (std::size_t i=0; i!=NumberOfFastSpecies; ++i) {
		effectivePopulation(fastSpeciesIndexes[i])=equilibriumPopulation(i);
//		std::cout << "effectivePopulation["<<fastSpeciesIndexes[i]<<"]="<<effectivePopulation(fastSpeciesIndexes[i])<<"\n";
	
		if (effectivePopulation(fastSpeciesIndexes[i])<0.0 && setNegativesToZero) {
			foundNegative=true;
			//std::cout << "StochKit WARNING (IndependentVirtualFastProcess::equilibrium): negative equilibrium population detected, setting to 0.\n";
			//would probably be better to first try another iteration...
			effectivePopulation(fastSpeciesIndexes[i])=0;
			//should I recalculate dependent populations here? or below if foundNegative
		}
	}

//below would do another iteration...
//		A_function(J,equilibriumPopulation,relaxationTime,conservationConstants);	
//		b_function(b,latestRealizablePopulation,equilibriumPopulation,relaxationTime,conservationConstants);
//
//		pmatrix=initial_pmatrix;
//		lu_factorize(J,pmatrix);	
//		lu_substitute(J, pmatrix, b);//b gets overwritten with solution
//
//		//now add delta to equilibrium
//		for (std::size_t i=0; i!=b.size(); ++i) {
//			//std::cout << "adding b("<<i<<")="<<b(i)<<"\n";
//			equilibriumPopulation(i)+=b(i);
//		}
//
//		//set values of dependent species
//		dependentPopulationFn(equilibriumPopulation,conservationConstants);			

	return 0;
}//end equilibrium


std::vector<std::size_t> IndependentVirtualFastProcess::getFastSpeciesIndexes() {
	return fastSpeciesIndexes;
}

bool IndependentVirtualFastProcess::isFastSpecies(std::size_t speciesIndex) {
	//inefficient--should instead have vector of bools indicating if fast or not
	if ( std::find(fastSpeciesIndexes.begin(),fastSpeciesIndexes.end(),speciesIndex) == fastSpeciesIndexes.end() ) {
		return false;
	}
	return true;
}

bool IndependentVirtualFastProcess::isFastReaction(std::size_t reactionIndex) {
	//inefficient--should instead do this once for each index and then have vector of bools indicating if fast or not
	if ( std::find(fastReactionIndexes.begin(),fastReactionIndexes.end(),reactionIndex) == fastReactionIndexes.end() ) {
		return false;
	}
	return true;
}

bool IndependentVirtualFastProcess::isSlowReaction(std::size_t reactionIndex) {
	return (!isFastReaction(reactionIndex));
}

std::size_t IndependentVirtualFastProcess::originalIndex(std::size_t fastIndex) {
	if (fastIndex>fastSpeciesIndexes.size()) {
		std::cout << "StochKit ERROR (IndependentVirtualFastProcess::originalIndex): attempt to look up fast species index out of range. Terminating.\n";
		exit(1);
	}
	return fastSpeciesIndexes[fastIndex];
}
std::size_t IndependentVirtualFastProcess::fastIndex(std::size_t originalIndex) {
	//slow
	for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
		if (fastSpeciesIndexes[i]==originalIndex) {
			return i;
		}
	}
	std::cout << "StochKit ERROR (IndependentVirtualFastProcess::fastIndex): attempt to look up species not in list of fast species (originalIndex="<<originalIndex<<"). Terminating.\n";
	exit(1);
	return 0;
}

//	std::vector<ElementaryReaction<sparse_vec,dense_vec> >& getFastReactionsReindexed() {
std::vector<ElementaryReaction>& IndependentVirtualFastProcess::getFastReactionsReindexed() {
	return fastReactionsReindexed;
}

//void IndependentVirtualFastProcess::printProfileData() {
//	std::cout << "calls to IndependentVirtualFastProcess.applyAlternateStoichiometry took approximately "<<altStoich_time<<" seconds\n";
//	std::cout << "calls to IndependentVirtualFastProcess.equilibrium took approximately "<<equilibrium_time<<" seconds on "<<equilibrium_calls<<" calls\n";
//	std::cout << "\ttime constructing A: "<<A_time<<", b: "<<b_time<<", and solving: "<<solve_time<<"\n";
//	std::cout << "time constructing A: "<<A_time<<"\n";
//}

std::vector<std::pair<std::size_t,double> > IndependentVirtualFastProcess::sampleFastSpecies() {
//	std::cout << "ideally would use timescale somehow here (in IndependentVirtualFastProcess::sampleFastSpecies)...\n";

	//see if realizable pop is "close" to equilibrium pop
	bool realizableCloseToEquilibrium=true;
	for (std::size_t i=0; i!=equilibriumPopulation.size(); ++i) {
//		std::cout << "equilibriumPopulation("<<i<<")="<<equilibriumPopulation(i)<<", latestRealizablePopulation("<<i<<")="<<latestRealizablePopulation(i)<<"\n";
		if ( abs(equilibriumPopulation(i)-latestRealizablePopulation(i)) > 3.0) {
			realizableCloseToEquilibrium=false;
//			break;
		}
	}

	dense_vec samplePopulation=latestRealizablePopulation;

	//if realizable pop is "close" to equilibrium pop, start with it
//	if (realizableCloseToEquilibrium) {
////		std::cout << "realizable pop is close to equilibrium, so using it to start sample...\n";
//		samplePopulation=latestRealizablePopulation;
//	}
//	else {	
//		//else...use a more sophisticated method
//		//ideally, I would apply fast reactions in large numbers to get an pop near equilibrium
//		//for now...just round, which can cause conservation problems...
//		//	std::cout << "lazy sampling, could violate conservation...\n";
//		samplePopulation=equilibriumPopulation;
//		for (std::size_t i=0; i!=equilibriumPopulation.size(); ++i) {
////			std::cout << "rounding "<<equilibriumPopulation(i)<<" to "<<round(equilibriumPopulation(i))<<"\n";
//			samplePopulation(i)=round(samplePopulation(i));
//		}
////		std::cout << "temporarily using latestRealizablePopulation as initial samplePopulation in IndependentVirtualFastProcess::sampleFastSpecies()...\n";
////		samplePopulation=latestRealizablePopulation;
//	}
	//if not close
	if (!realizableCloseToEquilibrium) {
//		std::cout << "realizable not close to equilibrium, so try to use conservation to choose initial sample pop...\n";
		//try to use conservation relations to better choose an initial sample population
		conservationConstantsFn(samplePopulation,conservationConstants);
		samplePopulation=equilibriumPopulation;

//		for (std::size_t i=0; i!=equilibriumPopulation.size(); ++i) {
		for (std::size_t i=0; i!=rankNU;++i) {
//			std::cout << "rounding "<<equilibriumPopulation(i)<<" to "<<round(equilibriumPopulation(i))<<"\n";
			samplePopulation(i)=round(samplePopulation(i));
		}

		dependentPopulationFn(samplePopulation,conservationConstants);

		//at this point, it is possible to have non-integer values (particularly if we have an A+A-> type reaction)
		bool noninteger_discovered=false;
//		std::cout << "after applying dependentPopulationFn, sample population is:\n";
		for (std::size_t i=0; i!=samplePopulation.size(); ++i) {
//			std::cout << samplePopulation[i]<<"\n";
			if (floor(samplePopulation[i])!=ceil(samplePopulation[i])) noninteger_discovered=true;
		}
		
		if (noninteger_discovered) {
//			std::cout << "discovered a non-integer value...trying to fix it...\n";
			//use a brute force search if # of independent species is small enough
			bool fixed=false;
			if (rankNU<6) {
				//adapted from http://www.cplusplus.com/forum/general/21716/
				int nTemp = (int)pow(2, (int)rankNU) - 1;
//				for (int i = 0; i <= nTemp; i++)
				int i=0;
				while (i<=nTemp && !fixed)
				{
					for (int k = 0; k < (int)rankNU; k++)
					{
						if ((i >> k) & 0x1)
						{
//							std::cout<<"1";
							//if here, round up
							samplePopulation[k]=ceil(equilibriumPopulation(k));
						}
						else
						{
//							std::cout<<"0";
							//if here, round down
							samplePopulation[k]=floor(equilibriumPopulation(k));
						}

					}
//					std::cout<<std::endl;
					dependentPopulationFn(samplePopulation,conservationConstants);

					fixed=true;
//					std::cout << "latest samplePopulation try:\n";
					for (std::size_t j=0; j!=samplePopulation.size(); ++j) {
//						std::cout << samplePopulation[j]<<"\n";
						if (floor(samplePopulation[j])!=ceil(samplePopulation[j])) fixed=false;
					}
//					if (!fixed) std::cout << "still not fixed!\n";
//					else std::cout << "fixed!\n";
					++i;
//					std::cout << "now i="<<i<<"\n";
				}
			
			}
						
			//if we couldn't fix the problem, round and give warning...
			if (!fixed) {
				for (std::size_t i=0; i!=rankNU;++i) {
//					std::cout << "rounding "<<equilibriumPopulation(i)<<" to "<<round(equilibriumPopulation(i))<<"\n";
					samplePopulation(i)=round(samplePopulation(i));
				}

				dependentPopulationFn(samplePopulation,conservationConstants);

				if (!seenSampleConservationWarning) {
					std::cout << "StochKit WARNING (IndependentVirtualFastProcess::sampleFastSpecies): rounding realizable population (conservation may be violated). (This message will only be displayed once per thread.)\n";
					seenSampleConservationWarning=true;
				}
			}
		}
	}
	
	//run a few SSA steps...
//	std::cout << "now running a few SSA steps...\n";
	internal_ssa(1, samplePopulation, 5);
	
//	return samplePopulation;
//convert sample problem to output format pair(original species index, population)
	std::vector<std::pair<std::size_t, double> > sampleOutput;
	
	for (std::size_t i=0; i!=samplePopulation.size(); ++i) {
		sampleOutput.push_back(std::pair<std::size_t,double>(fastSpeciesIndexes[i],samplePopulation(i)));
	}
	
	return sampleOutput;
}

void IndependentVirtualFastProcess::internal_ssa(double simulationTime, dense_vec& population, std::size_t max_steps) {
//	STOCHKIT::RandomGenerator randomGenerator;//move this to class level
//	randomGenerator.Seed(time(NULL));//in order for command line seed option to work, it must be coordinated with this

	double currentTime=0;
	std::size_t steps=0;
	std::size_t numrxns=fastReactionsReindexed.size();
	std::vector<double> props(numrxns);
	while (currentTime<simulationTime && steps<max_steps) {
		double propensitySum=0;
		for (std::size_t i=0; i!=numrxns; ++i) {
			props[i]=fastReactionsReindexed[i].propensity(population);
			propensitySum+=props[i];
		}
//		std::cout << "propensitySum="<<propensitySum<<"\n";
		currentTime+=randomGenerator.Exponential(1.0/propensitySum);

		if (propensitySum==0) return;

		int selectedReactionIndex=-1;
		double r=randomGenerator.ContinuousOpen(0,1)*propensitySum;
		double jsum=0;
		while (jsum < r) {
			++selectedReactionIndex;
			//test that we don't run off end of array
			if (selectedReactionIndex==(int)numrxns) {
				break;
			}
			else {
				jsum+=props[selectedReactionIndex];
			}
		}

		//fire selectedReactionIndex
		population+=fastReactionsReindexed[selectedReactionIndex].getStoichiometry();
		
//		std::cout << "in ivfp internal ssa, fired "<<selectedReactionIndex<<"\n";
//		std::cout << "population is: ";
//		for (std::size_t i=0; i!=population.size(); ++i) {
//			std::cout << population(i) <<"\t";
//		}
//		std::cout << "\n";
		++steps;
	}
	
	if (steps==max_steps) {
//		std::cout << "reached max steps...\n";
		//could randomize whether or not to take one or a few more steps
	}
}
