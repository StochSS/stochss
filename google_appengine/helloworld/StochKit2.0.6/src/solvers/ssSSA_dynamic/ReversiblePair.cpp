#include "ReversiblePair.h"

std::pair<std::size_t,std::size_t> ReversiblePair::get_reaction_indexes() {
	return reaction_indexes;
}

//	ReversiblePair();
	ReversiblePair::ReversiblePair(std::pair<std::size_t,std::size_t> reactionIndexes, std::vector<ElementaryReaction>& model) {
		//put smaller reaction index first.
		if (reactionIndexes.first<reactionIndexes.second) {
			reaction_indexes=std::pair<std::size_t,std::size_t>(reactionIndexes.first,reactionIndexes.second);
		}
		else {
			reaction_indexes=std::pair<std::size_t,std::size_t>(reactionIndexes.second,reactionIndexes.first);		
		}

		ElementaryReaction r1=model[reactionIndexes.first];
		ElementaryReaction r2=model[reactionIndexes.second];
		
//		std::cout << "building pair:\nr1: ";
//		r1.display();
//		std::cout << "\nr2: ";
//		r2.display();
//		std::cout << "\n";
		
		sparse_vec r1stoich=r1.getStoichiometry();
		sparse_vec r2stoich=r2.getStoichiometry();
	
		if (!ReversiblePair::stoichsAreOpposites(r1stoich,r2stoich)) {
			std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): invalid reversible pair (stoichiometries are not opposites). Terminating.\n";
			exit(1);
		}
				
		//get number of nonzeros in stoichiometry
		std::size_t nnz=0;
		for (sparse_vec::iterator it=r1stoich.begin(); it!=r1stoich.end(); ++it) {
			++nnz;
			if (*it>1) {
				std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): stoichiometry entry >1 in reversible pair, handler for this not yet implemented. Terminating.\n";
				exit(1);
			}
			if (*it==0) {
				std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): stoichiometry entry 0 in sparse vector, unknown error in reaction constructor. Terminating.\n";
				exit(1);
			}
		}
//		std::cout << "nnz="<<nnz<<"\n";
		
		if (nnz==0) {
			std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): invalid reversible pair (zero stoichiometry). Terminating.\n";
			exit(1);
		}
		else if (nnz==1) {
			//could be type 1: A<=>NULL or type 2: A->A+B, B->NULL
			//put reaction with -1 as r1 for simplicity...or at least consistency
			if ( *(r1stoich.begin()) != -1) {
				//swap
//				std::cout << "r2 was X->NULL reaction, swapping...\n";
				r1=model[reactionIndexes.second];
				r2=model[reactionIndexes.first];
				
//				std::cout << "now order is:\nr1: ";
//				r1.display();
//				std::cout << "\nr2: ";
//				r2.display();
//				std::cout << "\n";

			}
			
			//if type 1, then r1 will have one reactant of molecule count 1, r2 sill have one product of molecule count 1
			//BEGIN TESTS FOR DETECTING TYPE 1
			if (r1.getReactants().size()==1 && r1.getReactants()[0].getMoleculeCount()==1 && r2.getProducts().size()==1 && r2.getProducts()[0].getMoleculeCount()==1) {
				pairType=1;
				relaxationTimeFn=&ReversiblePair::type1fn;
				c1=r1.getRateConstant();
				c2=r2.getRateConstant();
				A=r1.getReactants()[0].getSpeciesIndex();
				species.insert(r1.getReactants()[0].getSpeciesIndex());
//				std::cout << "detected a type 1 reversible pair.\n";
			}
			//END TESTS FOR DETECTING TYPE 1
			else if (r1.getReactants().size()==1 && r1.getReactants()[0].getMoleculeCount()==1 && r2.getReactants().size()==1 && r2.getProducts().size()==2) {
//					std::cout << "detected a type 2 reversible pair.\n";
					//r1 is B->NULL with rate c2, and r2 is A->A+B with rate c1; note c2 goes with r1...
					pairType=2;
					relaxationTimeFn=&ReversiblePair::type2fn;
					c1=r2.getRateConstant();
					c2=r1.getRateConstant();
					//"B" is only reactant in r1
					B=r1.getReactants()[0].getSpeciesIndex();
					//"A" is only reactant in r2
					A=r2.getReactants()[0].getSpeciesIndex();
					species.insert(A);
					species.insert(B);
//					std::cout << "A="<<A<<", B="<<B<<", c1="<<c1<<", c2="<<c2<<"\n";
//					exit(1);
			}
			else {
				std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): encountered reversible pair type that is not implemented (reactions "<<reactionIndexes.first<<", "<<reactionIndexes.second<<"). Terminating.\n";
//				std::cout << "r1.getReactants().size()="<<r1.getReactants().size()<<" r1.getReactants()[0].getMoleculeCount()="<<r1.getReactants()[0].getMoleculeCount()<<" r2.getProducts().size()="<<r2.getProducts().size()<<" r2.getProducts()[0].getMoleculeCount()="<<r2.getProducts()[0].getMoleculeCount()<<"\n";
				exit(1);
			}
		}
		else if (nnz==2) {
			if (r1.getProducts().size()==1 && r1.getReactants().size()==1 && r2.getProducts().size()==1 && r2.getReactants().size()==1) {
				//we are type 3 or 4
				if (r1.getReactants()[0].getMoleculeCount()>1 || r2.getReactants()[0].getMoleculeCount()>1) {
					//we are type 3
//					std::cout << "detected a type 3 reversible pair. not implemented. terminating.\n";
					if (r2.getReactants()[0].getMoleculeCount()==2) {
//						std::cout << "r2 was A+A->B reaction, swapping...\n";
						r1=model[reactionIndexes.second];
						r2=model[reactionIndexes.first];
						
//						std::cout << "now order is:\nr1: ";
//						r1.display();
//						std::cout << "\nr2: ";
//						r2.display();
//						std::cout << "\n";						
					}
					else {
						//std::cout << "no need to swap.\n";
					}
					
					if (r1.getReactants()[0].getMoleculeCount()==2 && r1.getProducts()[0].getMoleculeCount()==1 && r2.getReactants()[0].getMoleculeCount()==1 && r2.getProducts()[0].getMoleculeCount()==2) {
						pairType=3;
						relaxationTimeFn=&ReversiblePair::type3fn;
						c1=r1.getRateConstant();
						c2=r2.getRateConstant();
						A=r1.getReactants()[0].getSpeciesIndex();
						B=r1.getProducts()[0].getSpeciesIndex();
						species.insert(A);
						species.insert(B);
					}
					else {
						std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): encountered reversible pair type that is not implemented (reactions "<<reactionIndexes.first<<", "<<reactionIndexes.second<<"). Terminating.\n";
						exit(1);			
					}
				}
				else {
					//we are type 4
					pairType=4;
					relaxationTimeFn=&ReversiblePair::type4fn;
					//order of reactions and species is irrelevant for this type.
					c1=r1.getRateConstant();
					c2=r2.getRateConstant();
					A=r1.getReactants()[0].getSpeciesIndex();
					B=r1.getProducts()[0].getSpeciesIndex();
					species.insert(A);
					species.insert(B);
				}
			}
			else if (r1.getProducts().size()==2 && r1.getReactants().size()==2 && r2.getProducts().size()==2 && r2.getReactants().size()==2) {
				//we are type 5...certain?
//				std::cout << "detected a type 5 reversible pair...\n";
				//A+B<=>B+C
				pairType=5;
				relaxationTimeFn=&ReversiblePair::type5fn;
				c1=r1.getRateConstant();
				c2=r2.getRateConstant();
				if (r1.getReactants()[0]==r1.getProducts()[0] || r1.getReactants()[0]==r1.getProducts()[1]) {
					B=r1.getReactants()[0].getSpeciesIndex();
					A=r1.getReactants()[1].getSpeciesIndex();
				}
				else {
					B=r1.getReactants()[1].getSpeciesIndex();
					A=r1.getReactants()[0].getSpeciesIndex();					
				}
				if (B!=r2.getReactants()[0].getSpeciesIndex()) {
					C=r2.getReactants()[0].getSpeciesIndex();
				}
				else {
					C=r2.getReactants()[1].getSpeciesIndex();
				}
				species.insert(A);
				species.insert(B);
				species.insert(C);
//				std::cout << "c1="<<c1<<", c2="<<c2<<", A="<<A<<", B="<<B<<", C="<<C<<"\n";
			}
			else {
				std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): encountered reversible pair type that is not implemented (reactions "<<reactionIndexes.first<<", "<<reactionIndexes.second<<"). Terminating.\n";
				exit(1);			
			}
		}
		else if (nnz==3) {
			//BEGIN TESTS FOR DETECTING TYPE 6
			//assume A+B<=>C is the only type of reversible pair with 3 nonzero entries
			//make A+B->C be "r1"
			if (r2.getReactants().size()==2) {
				//swap
//				std::cout << "r2 was A+B->C reaction, swapping...\n";
				r1=model[reactionIndexes.second];
				r2=model[reactionIndexes.first];
				
//				std::cout << "now order is:\nr1: ";
//				r1.display();
//				std::cout << "\nr2: ";
//				r2.display();
//				std::cout << "\n";
			}
			if (r1.getReactants()==r2.getProducts() && r1.getProducts()==r2.getReactants() && r1.getReactants().size()==2 && r1.getProducts().size()==1) {
//				std::cout << "so far, so good...\n";
				pairType=6;
				relaxationTimeFn=&ReversiblePair::type6fn;
				c1=r1.getRateConstant();
				c2=r2.getRateConstant();
				A=r1.getReactants()[0].getSpeciesIndex();
				B=r1.getReactants()[1].getSpeciesIndex();
				C=r1.getProducts()[0].getSpeciesIndex();
				species.insert(A);
				species.insert(B);
				species.insert(C);
//				std::cout << "detected a type 6 reversible pair.\n";
			}
			//END TESTS FOR DETECTING TYPE 6
			else {
				std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): encountered reversible pair type that is not implemented (reactions "<<reactionIndexes.first<<", "<<reactionIndexes.second<<"). Terminating.\n";
				exit(1);			
			}
		}
		else {
			std::cout << "StochKit ERROR (ReversiblePair::ReversiblePair): encountered reversible pair type that is not implemented (reactions "<<reactionIndexes.first<<", "<<reactionIndexes.second<<"). Terminating.\n";
			exit(1);
		}
	}

//	void ReversiblePair::set(std::pair<std::size_t,std::size_t> reactionIndexes, std::vector<ElementaryReaction>& model);

//	bool operator==(const ReversiblePair& other) const;

	double ReversiblePair::calculateRelaxationTime(dense_vec& population) {

		double t=(this->*relaxationTimeFn)(population);
	
		latestRelaxationTime=t;
		return t;
	}

	bool ReversiblePair::containsSpecies(std::size_t speciesIndex) {
		return (species.find(speciesIndex)!=species.end());
	}


	double ReversiblePair::type0fn(dense_vec& population) {
		std::cout << "StochKit ERROR (ReversiblePair::type0fn): invalid reversible pair. Terminating.\n";
		exit(1);
	}
	
	double ReversiblePair::type1fn(dense_vec& population) {
		//A<=>NULL
		//verified this formula via simulation
		return 1.0/c1;
	}

	double ReversiblePair::type2fn(dense_vec& population) {
		//A->A+B, B->NULL
		//assumes A!=0...
		//this seems wrong, 
//		return std::min(population(A)*c1,c2);
		return 1.0/c2;//I think this is correct.
	}

	double ReversiblePair::type3fn(dense_vec& population) {
		//A+A<=>B
//		std::cout << "ReversiblePair::type3fn not implemented. terminating.\n";
//		exit(1);
		return 1.0/(c1*population(A)+c2);
	}

	double ReversiblePair::type4fn(dense_vec& population) {
		//A<=>B
		//source: Cao et al. JCP 2005, 122, 014116
		return 1.0/(c1+c2);
	}

	double ReversiblePair::type5fn(dense_vec& population) {
		//A+B<=>B+C
		//like A<=>C with rates multiplied by B
//		std::cout << "in type5fn, population(B)="<<population(B)<<"\n";
		if (population(B)==0) {
			return 1.0/(c1+c2);//should this be 0?
		}
		else return 1.0/(population(B)*c1+population(B)*c2);
	}
	
	double ReversiblePair::type6fn(dense_vec& population) {
		//A+B<=>C
		return 1.0/( c1*(population(A)+population(B)) + c2 );
	}

	bool ReversiblePair::isReversiblePairByStoichiometry(ElementaryReaction& r1, ElementaryReaction& r2) {
		return stoichsAreOpposites(r1.getStoichiometry(),r2.getStoichiometry());
	}
	
	bool ReversiblePair::stoichsAreOpposites(sparse_vec& s1, sparse_vec& s2) {
		sparse_vec::iterator it1=s1.begin();
		sparse_vec::iterator it2=s2.begin();
		
		while (it1!=s1.end() && it2!=s2.end()) {
			if (it1.index()!=it2.index()) return false;
			if (*it1!=-*it2) return false;
			++it1;
			++it2;
		}
		if (it1!=s1.end() || it2!=s2.end()) return false;
		return true;
	}
