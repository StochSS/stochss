#include "AlternateStoichiometries.h"	

AlternateStoichiometries::AlternateStoichiometries() : seenFailedBuiltAltStoichWarning(false), seenFailedAltStoichSearchWarning(false), maxSearchDepth(4) { }

void AlternateStoichiometries::create(std::vector<ElementaryReaction>& fastRxnsReindexed, std::vector<dense_vec>& slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed) {
//	std::cout << "creating alternate stoichiometries...\n";

//	std::cout << "slowRxnFastStoich passed to create has size: "<<slowRxnFastStoich.size()<<"\n";		
			
	fastReactions=fastRxnsReindexed;
	slowRxnStoich=slowRxnFastStoich;
	slowRxnFastReactants=slowRxnFastReactantsReindexed;
	
//	std::cout << "slowRxnFastReactants.size()="<<slowRxnFastReactants.size()<<"\n";
//	for (std::size_t i=0; i!=slowRxnFastReactants.size(); ++i) {
//		std::cout << "slowRxnFastReactants["<<i<<"].display: ";
//		slowRxnFastReactants[i].display();
//		std::cout << "\n";
//	}
	
//		std::cout << "slowRxn stoichiometries (size="<<slowRxnStoich.size()<<"): \n";
//		for (std::size_t i=0; i!=slowRxnStoich.size(); ++i) {
//			//print_dense_vec(slowRxnStoich[i]);
//			std::cout << "rxn "<<i<<": ";
//			for (std::size_t j=0; j!=slowRxnStoich[i].size(); ++j) {
//				std::cout << slowRxnStoich[i][j] << "\t";
//			}
//			std::cout << "\n";
//		}
	
	createLevel0AlternateStoichiometries(slowRxnFastStoich,slowRxnFastReactantsReindexed);
//		std::cout << "level 0 alternate stoichiometries:\n";
//		for (std::size_t i=0; i!=level0.size(); ++i) {
//			std::cout << "reaction "<<i<<":";
//			level0[i].display();
//		}

	//buildReactantSets();

//std::cout << "about to create level 1...\n";

	createLevel1(slowRxnFastStoich,slowRxnFastReactantsReindexed);

//std::cout << "about to create level 2...\n";

	createLevel2(slowRxnFastStoich,slowRxnFastReactantsReindexed);

//std::cout << "about to buildAltStoichVectors...\n";

	buildAltStoichVectors(slowRxnFastStoich);
	
//std::cout << "done building alt stoich vectors, done with AlternateStoichiometries::create.\n";
}

bool AlternateStoichiometries::applyAlternateStoichiometry(std::size_t slowRxnIndex, dense_vec& currentRealizableFastPopulation) {
//	std::cout << "in applyAlternateStoichiometry...\n";	

	//could probably speed this up on average if cached most recently used one or two alternate stoichiometries for each slow reaction

//		std::cout << "applying alt stoich for slow rxn "<<slowRxnIndex<<"\n";
//		std::cout << "realizable fast pop before:\n";
//		print_dense_vec(currentRealizableFastPopulation);

	//first, check level 0
	if (level0[slowRxnIndex].dependencyIsSatisfied(currentRealizableFastPopulation)) {
		level0[slowRxnIndex].applyStoichiometry(currentRealizableFastPopulation);
//			std::cout << "applied level 0 stoichiometry\n";
//			std::cout << "realizable fast pop after:\n";
//			print_dense_vec(currentRealizableFastPopulation);

		return true;
	}
	else {
		if (level0[slowRxnIndex].numberOfMoleculesInDependency()==1) {
			for (std::size_t i=0; i!=oneReactantZero[slowRxnIndex].size(); ++i) {
				//within each level, iterate over the vector of possible alternate stoichiometries
				if (oneReactantZero[slowRxnIndex][i].dependencyIsSatisfied(currentRealizableFastPopulation)) {
					oneReactantZero[slowRxnIndex][i].applyStoichiometry(currentRealizableFastPopulation);
					return true;
				}
			}
		}
		else if (level0[slowRxnIndex].numberOfMoleculesInDependency()==2) {
			if (slowRxnFastReactants[slowRxnIndex][0].getMoleculeCount()!=2) {
				//we know it is not an A+A-> type reaction
				//how to quickly tell if first, second or both reactants are short?
				std::pair<std::size_t,std::size_t> thepair(slowRxnFastReactants[slowRxnIndex][0].getSpeciesIndex(),slowRxnFastReactants[slowRxnIndex][1].getSpeciesIndex());
				std::vector<bool>(2,false);
				if (slowRxnFastReactants[slowRxnIndex][0].getMoleculeCount()>currentRealizableFastPopulation(slowRxnFastReactants[slowRxnIndex][0].getSpeciesIndex())) {
					if (slowRxnFastReactants[slowRxnIndex][1].getMoleculeCount()>currentRealizableFastPopulation(slowRxnFastReactants[slowRxnIndex][1].getSpeciesIndex())) {
						//both are zero
						for (std::size_t i=0; i!=twoReactantBothZero[slowRxnIndex].size(); ++i) {
							//within each level, iterate over the vector of possible alternate stoichiometries
							if (twoReactantBothZero[slowRxnIndex][i].dependencyIsSatisfied(currentRealizableFastPopulation)) {
								twoReactantBothZero[slowRxnIndex][i].applyStoichiometry(currentRealizableFastPopulation);
								return true;
							}
						}							
					}
					else {
						//only the first is zero
						for (std::size_t i=0; i!=twoReactantFirstZero[slowRxnIndex].size(); ++i) {
							//within each level, iterate over the vector of possible alternate stoichiometries
							if (twoReactantFirstZero[slowRxnIndex][i].dependencyIsSatisfied(currentRealizableFastPopulation)) {
								twoReactantFirstZero[slowRxnIndex][i].applyStoichiometry(currentRealizableFastPopulation);
								return true;
							}
						}							
						
					}
				}
				//since dependency was not satisfied, must be 2nd reactant that is zero
				for (std::size_t i=0; i!=twoReactantSecondZero[slowRxnIndex].size(); ++i) {
					//within each level, iterate over the vector of possible alternate stoichiometries
					if (twoReactantSecondZero[slowRxnIndex][i].dependencyIsSatisfied(currentRealizableFastPopulation)) {
						twoReactantSecondZero[slowRxnIndex][i].applyStoichiometry(currentRealizableFastPopulation);
						return true;
					}
				}							
				
			}
			//here handle A+A-> type reactions
			else {
//				std::cout << "not yet able to handle A+A-> slow reaction when A is a fast species. terminating\n";
				if (currentRealizableFastPopulation(slowRxnFastReactants[slowRxnIndex][0].getSpeciesIndex())==0) {
//					std::cout << "twoSameReactantZero["<<slowRxnIndex<<"].size="<<twoSameReactantZero[slowRxnIndex].size()<<"\n";
					for (std::size_t i=0; i!=twoSameReactantZero[slowRxnIndex].size(); ++i) {
//						std::cout << "checking if dependency for entry "<<i<<" is satisfied...\n";
						if (twoSameReactantZero[slowRxnIndex][i].dependencyIsSatisfied(currentRealizableFastPopulation)) {
//							std::cout << i << ": dependency IS satisfied, attempting to apply stoichiometry...\n";
							twoSameReactantZero[slowRxnIndex][i].applyStoichiometry(currentRealizableFastPopulation);
//							std::cout << "successfully applied alt stoich from TwoSameReactantZero.\n";
							return true;
						}
						else {
//							std::cout << i << ": dependency is NOT satisfied...\n";
						}
					}
				}
				else if (currentRealizableFastPopulation(slowRxnFastReactants[slowRxnIndex][0].getSpeciesIndex())==1) {
//					std::cout << "twoSameReactantOne.size="<<twoSameReactantOne.size()<<"\n";
					for (std::size_t i=0; i!=twoSameReactantOne[slowRxnIndex].size(); ++i) {
						if (twoSameReactantOne[slowRxnIndex][i].dependencyIsSatisfied(currentRealizableFastPopulation)) {
							twoSameReactantOne[slowRxnIndex][i].applyStoichiometry(currentRealizableFastPopulation);
//							std::cout << "successfully applied alt stoich from TwoSameReactantOne.\n";
							return true;
						}
					}				
				}
				else {
					std::cout << "StochKit ERROR (AlternateStoichiometries::applyAlternateStoichiometry): reached unexpected internal state for A+A type reaction (bug). Terminating.\n";
					exit(1);
				}
			}
		}
		else {
			//should never reach here, it is a bug if it does
			std::cout << "StochKit ERROR (AlternateStoichiometry::applyAlternateStoichiometry): unable to fire slow reaction (debug: slow rxn index="<<slowRxnIndex<<", numberOfMoleculesInDependency="<<level0[slowRxnIndex].numberOfMoleculesInDependency()<<"\n";
			exit(1);
		}
	}
	
//	std::cout << "StochKit MESSAGE (AlternateStoichiometries::applyAlternateStoichiometry): unable to apply exact alternate stoichiometry (perhaps due to numerical error in equilibrium solution of virtual fast process or perhaps due to a complex virtual fast process)\n";
//	
//	std::cout << "more info: reindexed fast stoichiometry is:\n";
//	for (std::size_t i=0; i!=slowRxnStoich[slowRxnIndex].size(); ++i) {
//		std::cout << slowRxnStoich[slowRxnIndex](i) << "  ";
//	}
//	std::cout << "\n";

	if (maxSearchDepth>2) {
//		std::cout << "attempting a deeper search for an alternate stoichiometry...\n";
		return deeperAltStoichSearch(slowRxnIndex, currentRealizableFastPopulation);
	}

	return false;
}//applyAlternateStoichiometry dense_vec version


void AlternateStoichiometries::buildAltStoichVectors(std::vector<dense_vec> slowRxnFastStoich) {

//	std::cout << "in buildAltStoichVectors, size of slowRxnFastStoich is "<<slowRxnFastStoich.size()<<"\n";//size should be number of reactions in full model

	oneReactantZero.clear();
	twoSameReactantZero.clear();
	twoSameReactantOne.clear();
	twoReactantBothZero.clear();
	twoReactantFirstZero.clear();
	twoReactantSecondZero.clear();
	oneReactantZero.resize(slowRxnFastStoich.size());
	twoSameReactantZero.resize(slowRxnFastStoich.size());
	twoSameReactantOne.resize(slowRxnFastStoich.size());
	twoReactantBothZero.resize(slowRxnFastStoich.size());
	twoReactantFirstZero.resize(slowRxnFastStoich.size());
	twoReactantSecondZero.resize(slowRxnFastStoich.size());


	//use the alternate stoichiometries created, apply slowRxnFastStoich to create the actual alternate stoichiometry vectors
	for (std::size_t i=0; i!=slowRxnFastReactants.size(); ++i) {
		
		//see how many fast species are in reactants
//		std::cout << "slowRxnFastReactants[i].size="<<slowRxnFastReactants[i].size()<<"...\n";
		if (slowRxnFastReactants[i].size()==0) continue;
		else if (slowRxnFastReactants[i].size()==1) {
			//includes A->  and A+A->  reactions
			if (slowRxnFastReactants[i][0].getMoleculeCount()==1) {

				//iterate over the "levels" that create the consumed species				
				if (oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())==oneReactantMoleculeLevels.end()) {

					//decided this warning does not offer much info. only matters if "unable to apply alt stoich", in which case we have a message for that
//					if (!seenFailedBuiltAltStoichWarning) {
//						std::cout << "StochKit WARNING (AlternateStoichiometries::buildAltStoichVectors): at least one build of alternate stoichiometry failed (fast species may be consumed by slow reaction but is not produced by any fast reaction; likely to lead to \"unable to apply alternate stoichiometry\" warning. This message will be displayed at most once per IVFP.).\n";
//						seenFailedBuiltAltStoichWarning=true;
//					}
					continue;
					//std::cout << "StochKit ERROR (AlternateStoichiometries::buildAltStoichVectors): build of alternate stoichiometry vector failed (unstable fast species in stable subset?). Terminating.\n";
//					std::cout << "slowRxnFastReactants[i][0].getSpeciesIndex()="<<slowRxnFastReactants[i][0].getSpeciesIndex()<<"\n";
//					std::cout << "not found in oneReactantMoleculeLevels...\n"; 
//					exit(1);
				}

				std::vector<AlternateStoichiometry > thing;
				if (oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())!=oneReactantMoleculeLevels.end()) {
				 thing=oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())->second;
				}

				for (std::vector<AlternateStoichiometry >::iterator it=thing.begin(); it!=thing.end(); ++it) {
					oneReactantZero[i].push_back(*it);
					//update the stoichiometry to include affect of "real" stoichiometry
					oneReactantZero[i].back().incrementStoich(slowRxnFastStoich[i]);
				}
			 }
			 else {
				//A+A-> type reaction
//				std::cout << "StochKit ERROR (AlternateStoichiometries::buildAltStoichVectors): reaction consumes two molecules of one fast species--ssSSA does not yet support this. Terminating.\n";
//				exit(1);
				//first handle situation where we are short one
				//iterate over the "levels" that create the consumed species
				if (oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())!=oneReactantMoleculeLevels.end()) {
					for (std::vector<AlternateStoichiometry >::iterator it=oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())->second.begin();
						it!=oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())->second.end(); ++it)
					{
						twoSameReactantOne[i].push_back(*it);
						//update the stoichiometry to include affect of "real" stoichiometry
						twoSameReactantOne[i].back().incrementStoich(slowRxnFastStoich[i]);
					}
				}
				
				//now handle when we are short both
				std::pair<std::size_t,std::size_t> thepair(slowRxnFastReactants[i][0].getSpeciesIndex(),slowRxnFastReactants[i][0].getSpeciesIndex());
//				std::cout << "processing pair "<<thepair.first<<", "<<thepair.second<<" for reaction "<<i<<"\n";
//				std::cout<<" that pair has "<<twoReactantMoleculeLevels.find(thepair)->second.size()<<" alternate stoichs...\n";
				if (twoReactantMoleculeLevels.find(thepair)!=twoReactantMoleculeLevels.end()) {
					for (std::vector<AlternateStoichiometry >::iterator it=twoReactantMoleculeLevels.find(thepair)->second.begin();
						it!=twoReactantMoleculeLevels.find(thepair)->second.end(); ++it)
					{
						twoSameReactantZero[i].push_back(*it);
						//update the stoichiometry to include affect of "real" stoichiometry
						twoSameReactantZero[i].back().incrementStoich(slowRxnFastStoich[i]);
					}
				}
			 }
		}
		else {
			std::vector<AlternateStoichiometry> tmpVec;

			//A+B-> type reaction
			//first handle situation where only one of the two species is zero
			//iterate over the "levels" that create the consumed species
			//reactant 0 first
			if (oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())!=oneReactantMoleculeLevels.end()) {
				tmpVec=oneReactantMoleculeLevels.find(slowRxnFastReactants[i][0].getSpeciesIndex())->second;
			}
			for (std::size_t j=0; j!=tmpVec.size(); ++j) {
				twoReactantFirstZero[i].push_back(tmpVec[j]);
				//update the stoichiometry to include affect of "real" stoichiometry
				twoReactantFirstZero[i].back().incrementStoich(slowRxnFastStoich[i]);
				//also have to add the dependency on reactant 1? probably don't have to, but just in case
				twoReactantFirstZero[i].back().addDependency(slowRxnFastReactants[i][1].getSpeciesIndex(),1);
			}

			//now reactant 1
			tmpVec.clear();
			if (oneReactantMoleculeLevels.find(slowRxnFastReactants[i][1].getSpeciesIndex())!=oneReactantMoleculeLevels.end()) {
				tmpVec=oneReactantMoleculeLevels.find(slowRxnFastReactants[i][1].getSpeciesIndex())->second;
			}
			for (std::size_t j=0; j!=tmpVec.size(); ++j) {
				twoReactantSecondZero[i].push_back(tmpVec[j]);
				//update the stoichiometry to include affect of "real" stoichiometry
				twoReactantSecondZero[i].back().incrementStoich(slowRxnFastStoich[i]);
				//also have to add the dependency on reactant 0? probably don't have to, but just in case
				twoReactantSecondZero[i].back().addDependency(slowRxnFastReactants[i][0].getSpeciesIndex(),1);
			}

			//now handle when both reactants are zero
			std::pair<std::size_t,std::size_t> thepair(slowRxnFastReactants[i][0].getSpeciesIndex(),slowRxnFastReactants[i][1].getSpeciesIndex());
			tmpVec.clear();
			if (twoReactantMoleculeLevels.find(thepair)!=twoReactantMoleculeLevels.end()) {
				tmpVec=twoReactantMoleculeLevels.find(thepair)->second;
			}
			for (std::size_t j=0; j!=tmpVec.size(); ++j) {
				twoReactantBothZero[i].push_back(tmpVec[j]);
				//update the stoichiometry to include affect of "real" stoichiometry
				twoReactantBothZero[i].back().incrementStoich(slowRxnFastStoich[i]);
			}
			
		}
	}
	
//		std::cout << "alternate stoichiometries...one reactant only:\n";
//		for (std::size_t i=0; i!=oneReactantZero.size(); ++i) {
//			std::cout << "rxn "<<i<<": \n";
//			for (std::size_t j=0; j!=oneReactantZero[i].size(); ++j) {
//				oneReactantZero[i][j].display();
//			}
//		}
//		std::cout << "alternate stoichiometries...two reactant first zero:\n";
//		for (std::size_t i=0; i!=twoReactantFirstZero.size(); ++i) {
//			std::cout << "rxn "<<i<<": \n";
//			for (std::size_t j=0; j!=twoReactantFirstZero[i].size(); ++j) {
//				twoReactantFirstZero[i][j].display();
//			}
//		}
//		std::cout << "alternate stoichiometries...two reactant second zero:\n";
//		for (std::size_t i=0; i!=twoReactantSecondZero.size(); ++i) {
//			std::cout << "rxn "<<i<<": \n";
//			for (std::size_t j=0; j!=twoReactantSecondZero[i].size(); ++j) {
//				twoReactantSecondZero[i][j].display();
//			}
//		}
//		std::cout << "alternate stoichiometries...two reactant both zero:\n";
//		for (std::size_t i=0; i!=twoReactantBothZero.size(); ++i) {
//			std::cout << "rxn "<<i<<": \n";
//			for (std::size_t j=0; j!=twoReactantBothZero[i].size(); ++j) {
//				twoReactantBothZero[i][j].display();
//			}
//		}
//		std::cout << "alternate stoichiometries...two same reactant, one:\n";
//		for (std::size_t i=0; i!=twoSameReactantOne.size(); ++i) {
//			std::cout << "rxn "<<i<<": \n";
//			for (std::size_t j=0; j!=twoSameReactantOne[i].size(); ++j) {
//				twoSameReactantOne[i][j].display();
//			}
//		}
//		std::cout << "alternate stoichiometries...two same reactant, zero:\n";
//		for (std::size_t i=0; i!=twoSameReactantZero.size(); ++i) {
//			std::cout << "rxn "<<i<<": \n";
//			for (std::size_t j=0; j!=twoSameReactantZero[i].size(); ++j) {
//				twoSameReactantZero[i][j].display();
//			}
//		}

//	std::cout << "terminating here.\n";
//	exit(1);
	
}

void AlternateStoichiometries::createLevel0AlternateStoichiometries(std::vector<dense_vec> slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed) {
	level0.clear();
	level0.resize(slowRxnFastStoich.size());
//		std::cout << "creating level 0...(slowRxnFastStoich.size()="<<slowRxnFastStoich.size()<<")\n";
//		
//		std::cout << "slowRxnFastReactantsReindexed...\n";
//		for (std::size_t i=0; i!=slowRxnFastReactantsReindexed.size(); ++i) {
//			std::cout << "i="<<i<<": ";
//			slowRxnFastReactantsReindexed[i].display();
//			std::cout << "\n";
//		}
		
	for (std::size_t i=0; i!=slowRxnFastStoich.size(); ++i) {
		AlternateStoichiometry tmpAltStoich;
		std::map<std::size_t, std::size_t> tmpDependency;
		for (std::size_t j=0; j!=slowRxnFastReactantsReindexed[i].size(); ++j) {
			tmpDependency.insert(std::pair<std::size_t,std::size_t>(slowRxnFastReactantsReindexed[i][j].getSpeciesIndex(),slowRxnFastReactantsReindexed[i][j].getMoleculeCount()));
		}
		tmpAltStoich.setStoich(slowRxnFastStoich[i]);
		tmpAltStoich.setDependency(tmpDependency);
		level0[i]=tmpAltStoich;
	}
}

//void AlternateStoichiometries::buildReactantSets() {
//	for (std::size_t i=0; i!=fastReactions.size(); ++i) {
//		Reactants tmpReactants=fastReactions[i].getReactants();
//		//determine if 0 1 or 2 fast reactant molecules
//		std::size_t numReactantMolecules=0;
//		for (std::size_t j=0; j!=tmpReactants.size(); ++j) {
//			numReactantMolecules+=tmpReactants[j].getMoleculeCount();
//		}
//		if (numReactantMolecules==1) {
//			oneReactant.insert(tmpReactants[0].getSpeciesIndex());
//		}
//		else if (numReactantMolecules==2) {
//			std::pair<std::size_t,std::size_t> tmpPair(0,0);
//			if (tmpReactants.size()==1) {
//				tmpPair.first=tmpReactants[0].getSpeciesIndex();
//				tmpPair.second=tmpPair.first;
//			}
//			else {
//				if (tmpReactants[0].getSpeciesIndex()<tmpReactants[1].getSpeciesIndex()) {
//					tmpPair.first=tmpReactants[0].getSpeciesIndex();
//					tmpPair.second=tmpReactants[1].getSpeciesIndex();
//				}
//				else {
//					tmpPair.first=tmpReactants[1].getSpeciesIndex();
//					tmpPair.second=tmpReactants[0].getSpeciesIndex();
//				}
//			}
//			twoReactant.insert(tmpPair);
//		}
//		else if (numReactantMolecules>2) {
//			std::cout << "StochKit ERROR (AlternateStoichiometries::buildReactantSets): detected reaction with order > 2 (ssSSA does not handle beyond 2nd order reactions)\n";
//			exit(1);
//		}
//	}
////		std::cout << "just built reactant sets:\n";
////		std::cout << "single reactants:\n";
////		for (std::set<std::size_t>::iterator it=oneReactant.begin(); it!=oneReactant.end(); ++it) {
////			std::cout << *it << "\t";
////		}
////		std::cout << "\n";
////		std::cout << "two reactants:\n";
////		for (std::set<std::pair<std::size_t,std::size_t> >::iterator it=twoReactant.begin(); it!=twoReactant.end(); ++it) {
////			std::cout << it->first << "," << it->second << "\t";
////		}
////		std::cout << "\n";		
//}


//"level 1" refers to stoichiometries that can be reached in 2 reaction steps
//we only care about produced species
//e.g. in enzyme substrate, when ES->E+P fires, level 0 is direct application of that stoichiometry: subtract 1 ES, add one E (do nothing to P since it is a slow species)
//then level one will apply 
//assumes fastReactions is already set
void AlternateStoichiometries::createLevel1(std::vector<dense_vec> slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed) {
//	std::cout << "creating level 1...\n";
	dense_vec zero_vec(slowRxnFastStoich.size());
	for (std::size_t i=0; i!=zero_vec.size(); ++i) {
		zero_vec(i)=0;
	}
	
	for (std::size_t i=0; i!=fastReactions.size(); ++i) {
//			std::cout << "PROCESSING FAST REACTION "<<i<<": ";
//			fastReactions[i].display();
		AlternateStoichiometry tmpAltStoich;
		dense_vec stoich_i=fastReactions[i].getStoichiometry();//result of applying fast reaction i
		tmpAltStoich.setStoich(stoich_i);
		//create dependencies list
		Reactants reactants_i=fastReactions[i].getReactants();//slowRxnFastReactantsReindexed[i];

		tmpAltStoich.setDependency(AlternateStoichiometry::generateDependencyFromReactants(reactants_i));
//			std::cout << "reactants_i: ";
//			reactants_i.display();
//			std::cout << "\n";
//			std::cout << "tmpAltStoich (compare dependency to above): ";
//			tmpAltStoich.display();
		//now we have a (temp) alternate stoichiometry (including dependencies) that results when fast rxns i is fired
		//now we want to look at all the POSITIVE entries in the stoichiometry
		//because it's these positive entries that we can then use to fire a slow reaction that consumes those positive entries
		std::vector<std::size_t> listOfProducedSpecies;
		for (std::size_t k=0; k!=tmpAltStoich.getStoich().size(); ++k) {
			if (tmpAltStoich.getStoich()(k)>0) {
//					std::cout << "fast reaction "<<i<<" produces fast species index "<<k<<"\n";
				listOfProducedSpecies.push_back(k);
			}
		}
		//loop over the produced species and insert into oneReactantMoleculeLevels
//			std::cout << "list of produced species.size is "<<listOfProducedSpecies.size()<<"\n";
		for (std::size_t k=0; k!=listOfProducedSpecies.size(); ++k) {
			if (oneReactantMoleculeLevels.find(listOfProducedSpecies[k])==oneReactantMoleculeLevels.end()) {
//					std::cout << "inserting into oneReactantMoleculeLevels for species "<<listOfProducedSpecies[k]<<"\n";
				oneReactantMoleculeLevels.insert( std::pair<std::size_t,std::vector<AlternateStoichiometry > >(listOfProducedSpecies[k],std::vector<AlternateStoichiometry >()));
//					std::cout << "now oneReactantMoleculeLevels.size()="<<oneReactantMoleculeLevels.size()<<"\n";
			}

			//now an entry for the species exists in oneReactantMoleculeLevels
			//before inserting, see if an existing has a strictly weaker or equal dependency (if so, don't insert)
			bool existingEqualOrWeaker=false;
			std::vector<AlternateStoichiometry > currentAlts;
			currentAlts=(oneReactantMoleculeLevels.find(listOfProducedSpecies[k]))->second;
			for (std::size_t m=0; m!=currentAlts.size(); ++m) {
				if (currentAlts[m].dependencyIsEqualOrStrictlyWeaker(tmpAltStoich)) {
					existingEqualOrWeaker=true;
				}
			}
			if (existingEqualOrWeaker==false) {
				//we want to insert, but before we do, delete any where tmpAltStoich is strictly weaker than other
//					std::cout << "existingEqualOrWeaker is false...next erase entries where tmpAltStoich is strictly better...\n";
//					std::size_t sizebefore=currentAlts.size();
				currentAlts.erase(std::remove_if(currentAlts.begin(),currentAlts.end(),std::bind1st(std::mem_fun_ref(&AlternateStoichiometry::dependencyIsStrictlyWeakerNonRef),tmpAltStoich) ),currentAlts.end());
//					std::cout << "erased "<<sizebefore-currentAlts.size()<<" elements\n";
//					
//					std::cout << "now inserting tmpAltStoich...\n";
				//insert it into local copy, then copy local copy
				currentAlts.push_back(tmpAltStoich);
				oneReactantMoleculeLevels.find(listOfProducedSpecies[k])->second=currentAlts;
			}
		}
		//do a similar thing to insert into twoReactantMoleculeLevels
		//double loop over listOfProducedSpecies
//			std::cout << "look for two species opportunities (listOfProducedSpecies.size()="<<listOfProducedSpecies.size()<<"\n";
		for (std::size_t k=0; k!=listOfProducedSpecies.size(); ++k) {
			for (std::size_t m=k; m!=listOfProducedSpecies.size(); ++m) {	
				//if k==m, only makes sense if stoich(lops[k])>=2
				if (k==m && tmpAltStoich.getStoich()(listOfProducedSpecies[k])<2) {
//						std::cout << "don't bother with k=m ("<<k<<")\n";
					continue;
				}
			
				std::pair<std::size_t,std::size_t> reactantPair(listOfProducedSpecies[k],listOfProducedSpecies[m]);
//					std::cout << "pair "<<listOfProducedSpecies[k]<<","<<listOfProducedSpecies[m]<<"\n";
				if (twoReactantMoleculeLevels.find(reactantPair)==twoReactantMoleculeLevels.end()) {
//						std::cout << "inserting for species pair "<<listOfProducedSpecies[k]<<", "<<listOfProducedSpecies[m]<<"\n";
					twoReactantMoleculeLevels.insert( std::pair<  std::pair<std::size_t,std::size_t>,std::vector<AlternateStoichiometry > >(reactantPair,std::vector<AlternateStoichiometry >()));//(1,tmpAltStoich)));
//						std::cout << "now twoReactantMoleculeLevels.size()="<<twoReactantMoleculeLevels.size()<<"\n";
				}

				//now entry exists in twoReactantMoleculeLevels
				//insert altStoich into vector and/or delete inferior existing elements as necessary
				//before inserting, see if an existing has a strictly weaker or equal dependency (if so, don't insert)
				bool existingEqualOrWeaker2=false;
				std::vector<AlternateStoichiometry > currentAlts=(twoReactantMoleculeLevels.find(reactantPair))->second;
				for (std::size_t m=0; m!=currentAlts.size(); ++m) {
					if (currentAlts[m].dependencyIsEqualOrStrictlyWeaker(tmpAltStoich)) {
						existingEqualOrWeaker2=true;
					}
				}
				if (existingEqualOrWeaker2==false) {
					//we want to insert, but before we do, delete any where tmpAltStoich is strictly weaker than other
//						std::cout << "existingEqualOrWeaker is false...next erase entries where tmpAltStoich is strictly better...\n";
//						std::size_t sizebefore=currentAlts.size();
					currentAlts.erase(std::remove_if(currentAlts.begin(),currentAlts.end(),std::bind1st(std::mem_fun_ref(&AlternateStoichiometry::dependencyIsStrictlyWeakerNonRef),tmpAltStoich) ),currentAlts.end());
//						std::cout << "erased "<<sizebefore-currentAlts.size()<<" elements\n";
//						
//						std::cout << "now inserting tmpAltStoich...\n";
					//insert it into local copy, then copy local copy
					currentAlts.push_back(tmpAltStoich);
					twoReactantMoleculeLevels.find(reactantPair)->second=currentAlts;
				}


			}
		}
	}
	//output what we've created...
//		std::cout << "SINGLE MOLECULE:\n";
//	typedef std::map<std::size_t,std::vector<AlternateStoichiometry > > mapone;
//	mapone::iterator it;
//		for (it=oneReactantMoleculeLevels.begin(); it!=oneReactantMoleculeLevels.end(); ++it) {
//			std::cout << "for species "<<it->first<<":\n";
//			for (std::size_t i=0; i!=it->second.size(); ++i) {
//				it->second[i].display();
//			}
//		}
//		std::cout << "TWO MOLECULE:\n";
//	typedef std::map< std::pair<std::size_t,std::size_t> ,std::vector<AlternateStoichiometry > > maptwo;
//	maptwo::iterator it2;
//		for (it2=twoReactantMoleculeLevels.begin(); it2!=twoReactantMoleculeLevels.end(); ++it2) {
//			std::cout << "for species "<<it2->first.first<<", "<<it2->first.second<<":\n";
//			for (std::size_t i=0; i!=it2->second.size(); ++i) {
//				it2->second[i].display();
//			}
//		}
//
//	std::cout << "ending create level 1.\n";
//	std::cout << "terminating.\n";
//	exit(1);
}

void AlternateStoichiometries::createLevel2(std::vector<dense_vec> slowRxnFastStoich, std::vector<Reactants>& slowRxnFastReactantsReindexed) {
	dense_vec zero_vec(slowRxnFastStoich.size());
	for (std::size_t i=0; i!=zero_vec.size(); ++i) {
		zero_vec(i)=0;
	}
	
	for (std::size_t i=0; i!=fastReactions.size(); ++i) {
		for (std::size_t j=0; j!=fastReactions.size(); ++j) {
			AlternateStoichiometry tmpAltStoich;
			dense_vec stoich_i=fastReactions[i].getStoichiometry();//result of applying fast reaction i
			dense_vec stoich_j=fastReactions[j].getStoichiometry();//result of applying fast reaction j
			dense_vec stoich_iplusj=stoich_i+stoich_j;
//				std::cout << "stoich_"<<i<<"+stoich_"<<j<<":";
//				print_dense_vec(stoich_iplusj);
			tmpAltStoich.setStoich(stoich_iplusj);
			//create dependencies list
			Reactants reactants_i=fastReactions[i].getReactants();//slowRxnFastReactantsReindexed[i];
			Reactants reactants_j=fastReactions[j].getReactants();//slowRxnFastReactantsReindexed[j];

			tmpAltStoich.setDependency(AlternateStoichiometry::generateDependencyFromReactants(reactants_i));
			
			//dependency is all the reactants in reaction i (the first reaction) plus all the reactants from reaction j that were not created as products from reaction i
			//loop over reactants_j
			for (std::size_t k=0; k!=reactants_j.size(); ++k) {
				//see if reactants_j[k] was produced by rxn i
				int effectiveDependencyMoleculeCount=reactants_j[k].getMoleculeCount();
				if (stoich_i(reactants_j[k].getSpeciesIndex())>0) {
					effectiveDependencyMoleculeCount-=stoich_i(reactants_j[k].getSpeciesIndex());
				}
				//if effect count > 0, then add it to tmpreactants
				if (effectiveDependencyMoleculeCount>0) {
					tmpAltStoich.addDependency(reactants_j[k].getSpeciesIndex(),effectiveDependencyMoleculeCount);
				}
			}
			
			//now we have a (temp) alternate stoichiometry (including dependencies) that results when fast rxns i and j are fired
			//now we want to look at all the POSITIVE entries in the stoichiometry
			//because it's these positive entries that we can then use to fire a slow reaction that consumes those positive entries
			std::vector<std::size_t> listOfProducedSpecies;
			for (std::size_t k=0; k!=tmpAltStoich.getStoich().size(); ++k) {
				if (tmpAltStoich.getStoich()(k)>0) {
//						std::cout << "fast reactions "<<i<<" + "<<j<<" produces fast species index "<<k<<"\n";
					listOfProducedSpecies.push_back(k);
				}
			}
				
			//loop over the produced species and insert into oneReactantMoleculeLevels
//				std::cout << "list of produced species.size is "<<listOfProducedSpecies.size()<<"\n";
			for (std::size_t k=0; k!=listOfProducedSpecies.size(); ++k) {
				if (oneReactantMoleculeLevels.find(listOfProducedSpecies[k])==oneReactantMoleculeLevels.end()) {
//						std::cout << "inserting for species "<<listOfProducedSpecies[k]<<"\n";
					oneReactantMoleculeLevels.insert( std::pair<std::size_t,std::vector<AlternateStoichiometry > >(listOfProducedSpecies[k],std::vector<AlternateStoichiometry >()));//(1,tmpAltStoich)));
//						std::cout << "now oneReactantMoleculeLevels.size()="<<oneReactantMoleculeLevels.size()<<"\n";
				}

				//now an entry for the species exists in oneReactantMoleculeLevels
				//before inserting, see if an existing has a strictly weaker or equal dependency (if so, don't insert)
				bool existingEqualOrWeaker=false;
				std::vector<AlternateStoichiometry > currentAlts;
				currentAlts=(oneReactantMoleculeLevels.find(listOfProducedSpecies[k]))->second;
				for (std::size_t m=0; m!=currentAlts.size(); ++m) {
					if (currentAlts[m].dependencyIsEqualOrStrictlyWeaker(tmpAltStoich)) {
						existingEqualOrWeaker=true;
					}
				}
				if (existingEqualOrWeaker==false) {
					//we want to insert, but before we do, delete any where tmpAltStoich is strictly weaker than other
//						std::cout << "existingEqualOrWeaker is false...next erase entries where tmpAltStoich is strictly better...\n";
//						std::size_t sizebefore=currentAlts.size();
					currentAlts.erase(std::remove_if(currentAlts.begin(),currentAlts.end(),std::bind1st(std::mem_fun_ref(&AlternateStoichiometry::dependencyIsStrictlyWeakerNonRef),tmpAltStoich) ),currentAlts.end());
//						std::cout << "erased "<<sizebefore-currentAlts.size()<<" elements\n";
//						
//						std::cout << "now inserting tmpAltStoich...\n";
					//insert it into local copy, then copy local copy
					currentAlts.push_back(tmpAltStoich);
					oneReactantMoleculeLevels.find(listOfProducedSpecies[k])->second=currentAlts;
				}
			}
			//do a similar thing to insert into twoReactantMoleculeLevels
			//double loop over listOfProducedSpecies
//				std::cout << "look for two species opportunities (listOfProducedSpecies.size()="<<listOfProducedSpecies.size()<<"\n";
			for (std::size_t k=0; k!=listOfProducedSpecies.size(); ++k) {
				for (std::size_t m=k; m!=listOfProducedSpecies.size(); ++m) {	
					//if k==m, only makes sense if stoich(lops[k])>=2
					if (k==m && tmpAltStoich.getStoich()(listOfProducedSpecies[k])<2) {
//							std::cout << "don't bother with k=m ("<<k<<")\n";
						continue;
					}
				
					std::pair<std::size_t,std::size_t> reactantPair(listOfProducedSpecies[k],listOfProducedSpecies[m]);
//						std::cout << "pair "<<listOfProducedSpecies[k]<<","<<listOfProducedSpecies[m]<<"\n";
					if (twoReactantMoleculeLevels.find(reactantPair)==twoReactantMoleculeLevels.end()) {
//							std::cout << "inserting for species pair "<<listOfProducedSpecies[k]<<", "<<listOfProducedSpecies[m]<<"\n";
						twoReactantMoleculeLevels.insert( std::pair<  std::pair<std::size_t,std::size_t>,std::vector<AlternateStoichiometry > >(reactantPair,std::vector<AlternateStoichiometry >()));//(1,tmpAltStoich)));
//							std::cout << "now twoReactantMoleculeLevels.size()="<<twoReactantMoleculeLevels.size()<<"\n";
					}

					//now entry exists in twoReactantMoleculeLevels
					//insert altStoich into vector and/or delete inferior existing elements as necessary
					//before inserting, see if an existing has a strictly weaker or equal dependency (if so, don't insert)
					bool existingEqualOrWeaker2=false;
					std::vector<AlternateStoichiometry > currentAlts=(twoReactantMoleculeLevels.find(reactantPair))->second;
					for (std::size_t m=0; m!=currentAlts.size(); ++m) {
						if (currentAlts[m].dependencyIsEqualOrStrictlyWeaker(tmpAltStoich)) {
							existingEqualOrWeaker2=true;
						}
					}
					if (existingEqualOrWeaker2==false) {
						//we want to insert, but before we do, delete any where tmpAltStoich is strictly weaker than other
//							std::cout << "existingEqualOrWeaker is false...next erase entries where tmpAltStoich is strictly better...\n";
//							std::size_t sizebefore=currentAlts.size();
						currentAlts.erase(std::remove_if(currentAlts.begin(),currentAlts.end(),std::bind1st(std::mem_fun_ref(&AlternateStoichiometry::dependencyIsStrictlyWeakerNonRef),tmpAltStoich) ),currentAlts.end());
//							std::cout << "erased "<<sizebefore-currentAlts.size()<<" elements\n";
						
//							std::cout << "now inserting tmpAltStoich...\n";
						//insert it into local copy, then copy local copy
						currentAlts.push_back(tmpAltStoich);
						twoReactantMoleculeLevels.find(reactantPair)->second=currentAlts;
					}


				}
			}
			
		}
	}
	
//		std::cout << "AFTER LEVEL 2...\n";
//		std::cout << "SINGLE MOLECULE:\n";
//	typedef std::map<std::size_t,std::vector<AlternateStoichiometry > > mapone;
//	mapone::iterator it;
//		for (it=oneReactantMoleculeLevels.begin(); it!=oneReactantMoleculeLevels.end(); ++it) {
//			std::cout << "for species "<<it->first<<":\n";
//			for (std::size_t i=0; i!=it->second.size(); ++i) {
//				it->second[i].display();
//			}
//		}
//		std::cout << "TWO MOLECULE:\n";
//	typedef std::map< std::pair<std::size_t,std::size_t> ,std::vector<AlternateStoichiometry > > maptwo;
//	maptwo::iterator it2;
//		for (it2=twoReactantMoleculeLevels.begin(); it2!=twoReactantMoleculeLevels.end(); ++it2) {
//			std::cout << "for species "<<it2->first.first<<", "<<it2->first.second<<":\n";
//			for (std::size_t i=0; i!=it2->second.size(); ++i) {
//				it2->second[i].display();
//			}
//		}		
}

bool AlternateStoichiometries::deeperAltStoichSearch(std::size_t slowRxnIndex, dense_vec& currentRealizableFastPopulation) {
//	std::cout << "in AlternateStoichiometries::deeperAltStoichSearch...searching for alt stoich for reaction index "<<slowRxnIndex<<"\n";
//	std::cout << "currentRealizableFastPopulation is:\n";
//	for (std::size_t i=0; i!=currentRealizableFastPopulation.size(); ++i) {
//		std::cout << currentRealizableFastPopulation(i) << "\t";
//	}
//	std::cout << "\n";
//
//	std::cout << "maxSearchDepth="<<maxSearchDepth<<"\n";
	
	//verify that current population does not satisfy level 0 dependency
//	std::cout << "does current population satisfy level 0 dependency: "<<level0[slowRxnIndex].dependencyIsSatisfied(currentRealizableFastPopulation)<<"\n";

	typedef std::pair<AlternateStoichiometry,dense_vec> altStoichRealizablePopPair;

	std::vector<altStoichRealizablePopPair> reachablePaths;

	//level 1 is easy, just see which reactions can fire, given current realizable population
	for (std::size_t rxnIndex=0; rxnIndex!=fastReactions.size(); ++rxnIndex) {
//		std::cout << "checking fast reaction "<<rxnIndex<<", propensity="<<fastReactions[rxnIndex].propensity(currentRealizableFastPopulation)<<"\n";
		if (fastReactions[rxnIndex].propensity(currentRealizableFastPopulation)>0) {
			sparse_vec rxnIndexStoich=fastReactions[rxnIndex].getStoichiometry();
			dense_vec dense_rxnIndexStoich(rxnIndexStoich.size());
			for (std::size_t i=0; i!=rxnIndexStoich.size(); ++i) {
				dense_rxnIndexStoich(i)=rxnIndexStoich(i);
			}
			//create a new alt stoich and realizable pop pair corresponding to the "path" of firing this rxn
			AlternateStoichiometry tmpAltStoich;
			tmpAltStoich.setStoich(dense_rxnIndexStoich);
			//update the dependencies in the alt stoich
			//by looking at reactants (for future steps, will also look at the alt stoich stoichiometry)
			std::vector<Reactant> reactants=fastReactions[rxnIndex].getReactants().get();
			for (std::size_t r=0; r!=reactants.size(); ++r) {
				tmpAltStoich.addDependency(reactants[r].getSpeciesIndex(),reactants[r].getMoleculeCount());
			}
			//insert new alt stoich and realizable pop into reachable paths
			dense_vec tmpRealizablePop=currentRealizableFastPopulation;
			tmpAltStoich.applyStoichiometry(tmpRealizablePop);
			reachablePaths.push_back(std::make_pair(tmpAltStoich,tmpRealizablePop));
			
			if (level0[slowRxnIndex].dependencyIsSatisfied(tmpRealizablePop)) {
				std::cout << "StochKit ERROR (AlternateStoichiometries::deeperAltStoichSearch): unexpectedly satisfied alternate stoichiometry dependency at level 1 (bug). Terminating.\n";
				exit(1);
			}
		}
	}

	if (reachablePaths.size()==0) {
		//don't need to print this warning message because a message is displayed in IVFP.fire
//		if (!seenFailedAltStoichSearchWarning) {
//			std::cout << "StochKit WARNING (AlternateStoichiometries::deeperAltStoichSearch): Unable to find an alternate stoichiometry. (Fast process has propensity 0?) (This message will only be displayed once per thread.)\n";
//			seenFailedAltStoichSearchWarning=true;
//		}
		return false;
//		std::cout << "StochKit ERROR (AlternateStoichiometries::deeperAltStoichSearch): Unable to find an alternate stoichiometry. (fast process has propensity 0?)\n";
//		std::cout << "slowRxnIndex="<<slowRxnIndex<<", currentRealizableFastPopulation=[";
//		for (std::size_t i=0; i!=currentRealizableFastPopulation.size(); ++i) {
//			std::cout << currentRealizableFastPopulation(i) << " ";
//		}
//		std::cout << "]\n";
//		exit(1);
	}
//	std::cout << "detected "<<reachablePaths.size()<<" reachable paths from level 1...\n";

	//level 2
	//for each "reachable path" we have so far, loop over fast reactions...
	std::vector<altStoichRealizablePopPair> previousLevelPaths=reachablePaths;
	reachablePaths.clear();
	for (std::size_t path=0; path!=previousLevelPaths.size(); ++path) {
		for (std::size_t rxnIndex=0; rxnIndex!=fastReactions.size(); ++rxnIndex) {
//			std::cout << "checking fast reaction "<<rxnIndex<<", propensity="<<fastReactions[rxnIndex].propensity(previousLevelPaths[path].second)<<"\n";
			
			if (fastReactions[rxnIndex].propensity(previousLevelPaths[path].second)>0) {
				sparse_vec rxnIndexStoich=fastReactions[rxnIndex].getStoichiometry();
				dense_vec dense_rxnIndexStoich(rxnIndexStoich.size());
				for (std::size_t i=0; i!=rxnIndexStoich.size(); ++i) {
					dense_rxnIndexStoich(i)=rxnIndexStoich(i);
				}				
				//create a new alt stoich and realizable pop pair corresponding to the "path" of firing this rxn
				AlternateStoichiometry tmpAltStoich=previousLevelPaths[path].first;

				//update the dependencies
				//loop over reactants, if alt stoich for that species is less than molecule count, add to dependency
				std::vector<Reactant> reactants=fastReactions[rxnIndex].getReactants().get();
				for (std::size_t r=0; r!=reactants.size(); ++r) {
					if (reactants[r].getMoleculeCount() - tmpAltStoich.getStoich()(reactants[r].getSpeciesIndex()) > 0) {
						//add reactants[r].getSpeciesIndex() to dependency (add function handles whether it already exists or not)
						tmpAltStoich.addDependency(reactants[r].getSpeciesIndex(), (reactants[r].getMoleculeCount() - tmpAltStoich.getStoich()(reactants[r].getSpeciesIndex())) );
					}
				
				}
				tmpAltStoich.incrementStoich(dense_rxnIndexStoich);
				bool altStoichIsZero=true;
				dense_vec newStoich=tmpAltStoich.getStoich();
				for (std::size_t i=0; i!=newStoich.size(); ++i) {
					if (newStoich(i)!=0) {
						altStoichIsZero=false;
						break;
					}
				}
				
				if (!altStoichIsZero) {
					//insert new alt stoich and realizable pop into reachable paths
					dense_vec tmpRealizablePop=currentRealizableFastPopulation;
					tmpAltStoich.applyStoichiometry(tmpRealizablePop);
					reachablePaths.push_back(std::make_pair(tmpAltStoich,tmpRealizablePop));
					
					if (level0[slowRxnIndex].dependencyIsSatisfied(tmpRealizablePop)) {
						std::cout << "StochKit ERROR (AlternateStoichiometries::deeperAltStoichSearch): unexpectedly satisfied alternate stoichiometry dependency at level 2 (bug). Terminating.\n";
						exit(1);
					}
				}//if (!altStoichIsZero)
			}//if
		}//rxnIndex
	}//path


	//level N
	for (std::size_t level=2; level<=maxSearchDepth; ++level) {
		//for each "reachable path" we have so far, loop over fast reactions...
		previousLevelPaths=reachablePaths;
		reachablePaths.clear();
		for (std::size_t path=0; path!=previousLevelPaths.size(); ++path) {
			for (std::size_t rxnIndex=0; rxnIndex!=fastReactions.size(); ++rxnIndex) {
//				std::cout << "checking fast reaction "<<rxnIndex<<", propensity="<<fastReactions[rxnIndex].propensity(previousLevelPaths[path].second)<<"\n";
				
				if (fastReactions[rxnIndex].propensity(previousLevelPaths[path].second)>0) {
					sparse_vec rxnIndexStoich=fastReactions[rxnIndex].getStoichiometry();
					dense_vec dense_rxnIndexStoich(rxnIndexStoich.size());
					for (std::size_t i=0; i!=rxnIndexStoich.size(); ++i) {
						dense_rxnIndexStoich(i)=rxnIndexStoich(i);
					}				
					//create a new alt stoich and realizable pop pair corresponding to the "path" of firing this rxn
					AlternateStoichiometry tmpAltStoich=previousLevelPaths[path].first;

					//update the dependencies
					//loop over reactants, if alt stoich for that species is less than molecule count, add to dependency
					std::vector<Reactant> reactants=fastReactions[rxnIndex].getReactants().get();
					for (std::size_t r=0; r!=reactants.size(); ++r) {
						if (reactants[r].getMoleculeCount() - tmpAltStoich.getStoich()(reactants[r].getSpeciesIndex()) > 0) {
							//add reactants[r].getSpeciesIndex() to dependency (add function handles whether it already exists or not)
							tmpAltStoich.addDependency(reactants[r].getSpeciesIndex(), (reactants[r].getMoleculeCount() - tmpAltStoich.getStoich()(reactants[r].getSpeciesIndex())) );
						}
					
					}
					tmpAltStoich.incrementStoich(dense_rxnIndexStoich);

					bool altStoichIsZero=true;
					dense_vec newStoich=tmpAltStoich.getStoich();
					for (std::size_t i=0; i!=newStoich.size(); ++i) {
						if (newStoich(i)!=0) {
							altStoichIsZero=false;
							break;
						}
					}
					
					if (!altStoichIsZero) {
						//insert new alt stoich and realizable pop into reachable paths
						dense_vec tmpRealizablePop=currentRealizableFastPopulation;
						tmpAltStoich.applyStoichiometry(tmpRealizablePop);
						reachablePaths.push_back(std::make_pair(tmpAltStoich,tmpRealizablePop));
												
						if (level0[slowRxnIndex].dependencyIsSatisfied(tmpRealizablePop)) {
//							std::cout << "success, satisfied dependency at level "<<level<<". now we can stop looking. terminating.\n";
							
							//add original reaction fast stoich to our alt stoich
							dense_vec slowRxnFastStoich=slowRxnStoich[slowRxnIndex];
							tmpAltStoich.incrementStoich( slowRxnStoich[slowRxnIndex] );

//							std::cout << "new alternate stoichiometry is:\n";
//							dense_vec newStoich=tmpAltStoich.getStoich();
//							for (std::size_t i=0; i!=newStoich.size(); ++i) {
//								std::cout << newStoich(i) <<"\t";
//							}
//							std::cout << "\ndisplay:";
//							tmpAltStoich.display();
//							std::cout << "\n";
							
							//add our new alt stoich ....
							//...figure out if it should be in oneReactantZero, or twoReactantWhatever...
							
							
							if (level0[slowRxnIndex].numberOfMoleculesInDependency()==1) {
//								std::cout << "add it to oneReactantZero\n";
								oneReactantZero[slowRxnIndex].push_back(tmpAltStoich);
							}
							else if (level0[slowRxnIndex].numberOfMoleculesInDependency()==2) {
								if (slowRxnFastReactants[slowRxnIndex][0].getMoleculeCount()!=2) {
									//we know it is not an A+A-> type reaction
									//how to quickly tell if first, second or both reactants are short?
									std::pair<std::size_t,std::size_t> thepair(slowRxnFastReactants[slowRxnIndex][0].getSpeciesIndex(),slowRxnFastReactants[slowRxnIndex][1].getSpeciesIndex());
									std::vector<bool>(2,false);
									if (slowRxnFastReactants[slowRxnIndex][0].getMoleculeCount()>currentRealizableFastPopulation(slowRxnFastReactants[slowRxnIndex][0].getSpeciesIndex())) {
										if (slowRxnFastReactants[slowRxnIndex][1].getMoleculeCount()>currentRealizableFastPopulation(slowRxnFastReactants[slowRxnIndex][1].getSpeciesIndex())) {
											//both are zero
//											std::cout << "add to twoReactantBothZero\n";
											twoReactantBothZero[slowRxnIndex].push_back(tmpAltStoich);
										}
										else {
											//only the first is zero
//											std::cout << "add to twoReactantFirstZero\n";
											twoReactantFirstZero[slowRxnIndex].push_back(tmpAltStoich);											
										}
									}
									//since dependency was not satisfied, must be 2nd reactant that is zero
//									std::cout << "add to twoReactantSecondZero\n";
									twoReactantSecondZero[slowRxnIndex].push_back(tmpAltStoich);
								}
								//here handle A+A-> type reactions
								else {
									std::cout << "StochKit ERROR (AlternateStoichiometries::deeperAltStoichSearch): handler for this reaction type not yet implemented (beta). Terminating\n";
									exit(1);
								}
							}
//							std::cout << "returning true in deeperAltStoichSearch...\n";
							return true;
						}
					}//if (!altStoichIsZero)
				}//if
			}//rxnIndex
		}//path
	}//level

//	std::cout << "StochKit WARNING (AlternateStoichiometries::deeperAltStoichSearch) unable to find an alternate stoichiometry (increasing max search depth might prevent this message).\n";
	return false;
}

void AlternateStoichiometries::setMaxSearchDepth(std::size_t depth) {
	if (depth<2) {
		std::cout << "StochKit ERROR (AlternateStoichiometries::setMaxSearchDepth): attempt to set alternate stoichiometry search depth to invalid value less than 2. Terminating.\n";
		exit(1);
	}
	else {
		maxSearchDepth=depth;
	}
}

