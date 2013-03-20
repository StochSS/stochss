#include "MasterVirtualFastProcess.h"

MasterVirtualFastProcess::MasterVirtualFastProcess(std::vector<ElementaryReaction>& model,std::size_t numberOfSpecies, independentSpeciesFunction indSpecFunc): model(model), ffe(indSpecFunc), groups(model), isSpeciesFastBools(numberOfSpecies), accuracy_violated(false), seenUnableToRecoverWarning(false) {
//	std::cout << "in MVFP constructor...\n";

	//should probably check that initialFastReactions is a valid vfp...implement later...

	//set forward frequency estimate object
	std::vector<std::size_t> nums(model.size());
	for (std::size_t i=0; i!=model.size(); ++i) {
		nums[i]=i;
	}
	ffe.fullModelProcess.setVFP(nums, model);	
	ffe.setModel(model,numberOfSpecies);

//	std::cout << "exiting MVFP constructor...\n";	
}

void MasterVirtualFastProcess::buildAllPrecompiledIVFPs(std::vector<std::vector<std::size_t> >& ivfp_reaction_lists) {
//	std::cout << "in MVFP::buildAllPrecompiledIVFPs, ivfp_reaction_lists:\n";
//	for (std::size_t i=0; i!=ivfp_reaction_lists.size(); ++i) {
//		std::cout << i << ": ";
//		for (std::size_t j=0; j!=ivfp_reaction_lists[i].size(); ++j) {
//			std::cout << ivfp_reaction_lists[i][j] << " ";
//		}
//		std::cout << "\n";
//	}

	builtAllPrecompiledIVFPs=true;
	
	all_precompiled_ivfps.clear();
	all_precompiled_ivfps.resize(ivfp_reaction_lists.size());
	
//	std::cout << "note all_precompiled_ivfps.size="<<all_precompiled_ivfps.size()<<"...\n";

	for (std::size_t i=0; i!=ivfp_reaction_lists.size(); ++i) {
		ivfp_index_map.insert( std::pair<std::vector<std::size_t>,std::size_t>(ivfp_reaction_lists[i],i));
//		std::cout << "calling setVFP...\n";
		all_precompiled_ivfps[i].setVFP(ivfp_reaction_lists[i], model);
//		std::cout << "done calling setVFP...\n";
	}
//	std::cout << "exiting MVFP::buildAllPrecompiledIVFPs.\n";
}
	
void MasterVirtualFastProcess::buildInitialIVFP(std::vector<std::size_t>& initialFastReactions) {
	if (!builtAllPrecompiledIVFPs) {
		std::cout << "StochKit ERROR (MasterVirtualFastProcess::buildInitialIVFP): builtAllPrecompiledIVFPs must be true before proceeding (bug). Terminating\n";
		exit(1);
	}
//	std::cout << "calling setFastReactionIndexes in MasterVirtualFastProcess::buildInitialIVFP (with empty files_directory)...\n";
	setFastReactionIndexes(initialFastReactions);
	initialFastReactionIndexes=initialFastReactions;
	initial_ivfps=current_ivfps;
	initialFastSpeciesIndexes=fastSpeciesIndexes;
	initialIsSpeciesFastBools=isSpeciesFastBools;
}



void MasterVirtualFastProcess::updateIsSpeciesFastBools() {
//	std::cout << "in updateIsSpeciesFastBools...isSpeciesFastBools.size()="<<isSpeciesFastBools.size()<<"\n";
	//set all isSpeciesFastBools to false, then update with trues as needed
	for (std::size_t i=0; i!=isSpeciesFastBools.size(); ++i) {
		isSpeciesFastBools[i]=false;
	}
	for (std::size_t i=0; i!=this->fastSpeciesIndexes.size(); ++i) {
		isSpeciesFastBools[fastSpeciesIndexes[i]]=true;
	}
//	std::cout << "exiting updateIsSpeciesFastBools...\n";
}

bool MasterVirtualFastProcess::isSpeciesFast(std::size_t speciesIndex) {
	return isSpeciesFastBools[speciesIndex];
}

void MasterVirtualFastProcess::calculateCurrentFastSpeciesIndexes() {
	fastSpeciesIndexes.clear();
	
//	std::cout << "in calculateCurrentFastSpeciesIndexes(), size of current ivfps is "<<current_ivfps.size()<<"\n";

	//loop over current_ivfps, getting all fast species indexes
	for (std::size_t i=0; i!=current_ivfps.size(); ++i) {
		std::vector<std::size_t> ivfps_i_fast_species=all_precompiled_ivfps[current_ivfps[i]].getFastSpeciesIndexes();
//		std::cout << "in calculateCurrentFastSpeciesIndexes(), inserting "<<ivfps_i_fast_species.size()<<" fast species from ivfp index "<<current_ivfps[i]<<"\n";
		fastSpeciesIndexes.insert(fastSpeciesIndexes.end(),ivfps_i_fast_species.begin(),ivfps_i_fast_species.end());
	}
	
	//sort
	std::sort(fastSpeciesIndexes.begin(), fastSpeciesIndexes.end());

	//remove duplicates
	fastSpeciesIndexes.erase(std::unique(fastSpeciesIndexes.begin(),fastSpeciesIndexes.end()),fastSpeciesIndexes.end());
//	std::cout << "in calculateCurrentFastSpeciesIndexes(), the "<<fastSpeciesIndexes.size()<<" fast species are:\n";
//	for (std::size_t i=0; i!=fastSpeciesIndexes.size();++i) {
//		std::cout << fastSpeciesIndexes[i]<<"\n";
//	}
//	std::cout << "exiting calculateCurrentFastSpeciesIndexes...\n";
}

std::vector<std::size_t>& MasterVirtualFastProcess::getFastSpeciesIndexesRef() {
	return fastSpeciesIndexes;
}

bool MasterVirtualFastProcess::setFastReactionIndexes(std::vector<std::size_t>& fastReactions, std::string files_directory) {
//	std::cout << "in setFastReactionIndexes...with files_directory="<<files_directory<<"\n";
//	std::cout << "fastReactions: ";
//	for (std::size_t i=0; i!=fastReactions.size(); ++i) {
//		std::cout << fastReactions[i] << "\t";
//	}
//	std::cout << "\n";
	//if files_directory equals empty string the program will give error and exit upon encountering an ivfp that has not been previously precompiled
	//if files_directory is not empty, then in the same situation, the previously uncompiled ivfp reactions will be written to the file
	
	fastReactionIndexes=fastReactions;
		
	current_ivfps.clear();
	
	std::vector<std::vector<std::size_t> > ivfp_reaction_lists=findIndependentSubsystems(fastReactions);
	//find indexes in ivfp_index_map
	
//	std::cout << "ivfp_reaction_lists from find independent subsystems is: ";
//	for (std::size_t i=0; i!=ivfp_reaction_lists.size(); ++i) {
//		std::cout << "\n\tlist "<<i<<": ";
//		for (std::size_t j=0; j!=ivfp_reaction_lists[i].size(); ++j) {
//			std::cout << ivfp_reaction_lists[i][j] << "\t";
//		}
//		std::cout << "\n";
//	}

	bool detectedNewIvfp=false;
	
	//clear new_ivfps_to_compile.txt file...actually, should already have been deleted...oh well...
	//files_directory will only be empty string if called by buidInitialIVFP (or by non compile-on-the-fly version), which doesn't need to mess with the new ivfps file
	if (files_directory!="") {
		std::string system_command="touch "+files_directory+"/new_ivfps_to_compile.txt; rm "+files_directory+"/new_ivfps_to_compile.txt; touch "+files_directory+"/new_ivfps_to_compile.txt";
		system(system_command.c_str());
	}
	
	for (std::size_t i=0; i!=ivfp_reaction_lists.size(); ++i) {
		std::map<std::vector<std::size_t>,std::size_t>::iterator it=ivfp_index_map.find(ivfp_reaction_lists[i]);
		if (it==ivfp_index_map.end()) {
			detectedNewIvfp=true;
			if (files_directory=="") {
				std::cout << "StochKit ERROR (MasterVirtualFastProcess::setFastReactionIndexes): encountered an IVFP that has not been precompiled.\n";
				std::cout << "Please add the following line to your <model name>_generated_code/ivfp_list.txt file and re-run precompile_ivfps:\n";
				for (std::size_t j=0; j!=ivfp_reaction_lists[i].size(); ++j) {
					std::cout << ivfp_reaction_lists[i][j] << " ";
				}
			}
			else {
				//write new ivfp to file
				std::ofstream outfile;
				std::string new_ivfp_filename=files_directory+"/new_ivfps_to_compile.txt";
				outfile.open(new_ivfp_filename.c_str(), std::ios::out | std::ios::app);//open for appending

				if (!outfile) {
					std::cerr << "StochKit ERROR (MasterVirtualFastProcess::setFastReactionIndexes): Unable to open new IVFP file for output. Terminating.\n";
					exit(1);
				}
//				std::cout << "new ivfp: ";
				for (std::size_t j=0; j!=ivfp_reaction_lists[i].size(); ++j) {
					outfile << ivfp_reaction_lists[i][j] << " ";
//					std::cout << ivfp_reaction_lists[i][j] << " ";
				}
//				std::cout << "\n";
				outfile << "\n";

			}
		}
		else {
//			std::cout << "setting ivfp index "<<it->second<<"\n";
//			if (it->second==3 || it->second==4) {
//			if (it->second!=0 && it->second!=1) {
//				std::cout << "fyi using ivfp index "<<it->second<<"\n";
//				std::cout << "detected unexpected ivfp, terminating for analysis.\n";
//				exit(1);
//			}
			current_ivfps.push_back(it->second);
		}
	}

	if (detectedNewIvfp) {
		if (files_directory=="") {
			std::cout << "\nStochKit ERROR (MasterVirtualFastProcess:setFastReactionIndexes): detected new IVFP but files_directory is empty. Terminating.\n";
			exit(1);
		}
		else {
			std::cout << "StochKit MESSAGE (MasterVirtualFastProcess::setFastReactionIndexes): detected an IVFP that has not yet been compiled.\n";
			return false;
		}
	}

	calculateCurrentFastSpeciesIndexes();
	updateIsSpeciesFastBools();
	
//	std::cout << "exiting setFastReactionIndexes...\n";
	return true;
}


std::vector<std::vector<std::size_t> > MasterVirtualFastProcess::findIndependentSubsystems(std::vector<std::size_t>& fastReactions) {
//separates fastReactionIndexes into uncoupled subsets
//uncoupled subsets are themselves sorted but order within main vector is random.

//	std::cout << "finding independent subsystems...fast reaction list:\n";
//	for (std::size_t i=0; i!=fastReactions.size(); ++i) {
//		std::cout << "rxn "<<i<<": "<<fastReactions[i]<< "\n";
//	}

	std::vector<std::vector<std::size_t> > tmp_ivfp_list;
	if (fastReactions.size()==0) return tmp_ivfp_list;
	std::vector<std::set<std::size_t> > tmp_ivfp_species;//for each tmp_ivfp in list, list of involved species (reactants and products)

	//we'll have at least one vfp...	
	tmp_ivfp_list.push_back(std::vector<std::size_t>(1,fastReactions[0]));//now there is one tmp vfp that includes reaction index 0
	tmp_ivfp_species.push_back(std::set<std::size_t>());//empty set
	//loop over reactants
	Reactants tmpReactants=model[fastReactions[0]].getReactants();
	for (std::size_t i=0; i!=tmpReactants.getRef().size(); ++i) {
		tmp_ivfp_species[0].insert(tmpReactants.getRef()[i].getSpeciesIndex());
	}	
	//loop over products
	Products tmpProducts=model[fastReactions[0]].getProducts();
	for (std::size_t i=0; i!=tmpProducts.getRef().size(); ++i) {
		tmp_ivfp_species[0].insert(tmpProducts.getRef()[i].getSpeciesIndex());
	}
	
//	std::cout << "initial ivfp includes the following species:\n";
//	for (std::set<std::size_t>::iterator it=tmp_ivfp_species[0].begin(); it!=tmp_ivfp_species[0].end(); ++it) {
//		std::cout << *it << "\n";
//	}
	
	//now loop over other fast reactions
	for (std::size_t i=1; i!=fastReactions.size(); ++i) {
		std::set<std::size_t> involvedSpecies;
		//loop over reactants
		Reactants tmpReactants=model[fastReactions[i]].getReactants();
		for (std::size_t j=0; j!=tmpReactants.getRef().size(); ++j) {
			involvedSpecies.insert(tmpReactants.getRef()[j].getSpeciesIndex());
		}	
		//loop over products
		Products tmpProducts=model[fastReactions[i]].getProducts();
		for (std::size_t j=0; j!=tmpProducts.getRef().size(); ++j) {
			involvedSpecies.insert(tmpProducts.getRef()[j].getSpeciesIndex());
		}		

		//if overlaps with multiple vfps, those vfps are not independent and must be combined
		std::vector<std::size_t> overlapsWith_tmp_ivfp;
		//now I have set of involved species for rxn i, find intersection with each tmp ivfps
		std::set<std::size_t> species_intersection;
		for (std::size_t j=0; j!=tmp_ivfp_list.size(); ++j) {
			species_intersection.clear();
			std::set_intersection(involvedSpecies.begin(),involvedSpecies.end(),tmp_ivfp_species[j].begin(),tmp_ivfp_species[j].end(),inserter(species_intersection,species_intersection.begin()));
			//if species in reaction i overlaps with species in this tmp_ivfp, insert i into overlapsWith list
			if (species_intersection.size()>0) {
				overlapsWith_tmp_ivfp.push_back(j);
			}
		}
		//
		if (overlapsWith_tmp_ivfp.size()==0) {
//			std::cout << "fast reaction "<<i<<" does not overlap with any current tmp_ivfps. creating new.\n";
			//create a new tmp_ivfp
			tmp_ivfp_list.push_back(std::vector<std::size_t>(1,fastReactions[i]));
			tmp_ivfp_species.push_back(involvedSpecies);
		}
		else if (overlapsWith_tmp_ivfp.size()==1) {
//			std::cout << "fast reaction "<<i<<" overlaps with tmp_ivfp "<<overlapsWith_tmp_ivfp[0]<<", adding to it.\n";
			tmp_ivfp_list[overlapsWith_tmp_ivfp[0]].push_back(fastReactions[i]);
			tmp_ivfp_species[overlapsWith_tmp_ivfp[0]].insert(involvedSpecies.begin(),involvedSpecies.end());
		}
		else {
//			std::cout << "fast reaction "<<fastReactions[i]<<" overlaps with more than one tmp_ivfp...\n";
			//need to combine overlapping tmp_ivfps into single...later
			
			//make copies of old ones
			std::vector<std::vector<std::size_t> > old_tmp_ivfp_list=tmp_ivfp_list;
			std::vector<std::set<std::size_t> > old_tmp_ivfp_species=tmp_ivfp_species;
	
			//clear real ones
			tmp_ivfp_list.clear();
			tmp_ivfp_species.clear();
			
			//rebuild, start with all the overlapping ones in the first element
			//create empty first element
			tmp_ivfp_list.push_back(std::vector<std::size_t>());
			tmp_ivfp_species.push_back(std::set<std::size_t>());
			for (std::size_t j=0; j!=overlapsWith_tmp_ivfp.size(); ++j) {
				tmp_ivfp_list[0].insert(tmp_ivfp_list[0].end(),old_tmp_ivfp_list[overlapsWith_tmp_ivfp[j]].begin(),old_tmp_ivfp_list[overlapsWith_tmp_ivfp[j]].end());
				tmp_ivfp_species[0].insert(old_tmp_ivfp_species[overlapsWith_tmp_ivfp[j]].begin(),old_tmp_ivfp_species[overlapsWith_tmp_ivfp[j]].end());
			}
			tmp_ivfp_list[0].push_back(fastReactions[i]);//insert the fast reaction we were looking at
			tmp_ivfp_species[0].insert(involvedSpecies.begin(),involvedSpecies.end());
			
			
			//now, copy all from old_ that are not in overlap list
			for (std::size_t j=0; j!=old_tmp_ivfp_list.size(); ++j) {
				if (find(overlapsWith_tmp_ivfp.begin(),overlapsWith_tmp_ivfp.end(),j)==overlapsWith_tmp_ivfp.end()) {//if (j is NOT in overlapsWith_tmp_ivfp) {
					tmp_ivfp_list.push_back(old_tmp_ivfp_list[j]);
					tmp_ivfp_species.push_back(old_tmp_ivfp_species[j]);
				}
			}
			
		}
	}
	
	//sort within ivfps
	for (std::size_t i=0; i!=tmp_ivfp_list.size(); ++i) {
		std::sort(tmp_ivfp_list[i].begin(), tmp_ivfp_list[i].end());
	}
	
	return tmp_ivfp_list;
}//end findIndependentSubsystems

bool MasterVirtualFastProcess::fireSlowReaction(std::size_t reactionIndex, dense_vec& currentEffectivePopulation, double currentSimulationTime, double reaction_propensity) {
//	std::cout << "in MasterVFP.fireSlowReaction, reaction index="<<reactionIndex<<"\n";

	/* there are 3 conditions where this function will return false:
		1. if accuracy is violated
		2. if an IVFP returns false and we know it was a slow A+A type reaction with A fast and slow propensity<=1.0
		3. an IVFP returned false and the number of fast reactions in that IVFP <=4 (because alternate stoichiometry will explore entire space in this case, so if IVFP returns false, then we know the reaction should never have fired.)
		
		in all other cases, this function will return false, including case where IVFP returns false but none of the above 3 conditions is true. in that case, we use a recover mechanism based on rounding...
	*/

	#ifdef PROFILE_SLOW_REACTION_TIMESCALES
	slow_reaction_data[reactionIndex].push_back(currentSimulationTime);
	#endif

	std::vector<std::size_t> failed_ivfps_without_accuracy_violation;

	bool ivfp_fire_success=true;
	for (std::size_t i=0; i!=current_ivfps.size(); ++i) {
//			std::cout << "firing in ivfp "<<i<<"\n";
			if (!all_precompiled_ivfps[current_ivfps[i]].fireSlowReaction(reactionIndex,currentEffectivePopulation, reaction_propensity)) {
				//rather than returning false here, just set this indicator to false so that the reaction gets properly applied
				//to all current_ivfps
				ivfp_fire_success=false;
				if (all_precompiled_ivfps[current_ivfps[i]].accuracy_violated) {
//					std::cout << "accuracy violation detected (MVFP)...\n";
					accuracy_violated=true;
				}
				else {
//					std::cout << "fire failed in ivfp index "<<current_ivfps[i]<<", but accuracy violated is false!?\n";
//					std::cout << "must be failed apply alt stoich...\n";
					failed_ivfps_without_accuracy_violation.push_back(current_ivfps[i]);
				}
			}			
	}
	
	if (failed_ivfps_without_accuracy_violation.size()>0) {
//		std::cout << "note that at most 2 IVFPs have slow reaction REACTANTS...\n";
//		std::cout << "if made reaction_propensity pass by reference, could set it to zero...nope, because would get updated...\n";
//		std::cout << "in most cases (except when slow A+A with fast A) COULD set effective population to REALIZABLE...\n";
		
		bool AplusAfail=(model[reactionIndex].getReactants().size()==1 && model[reactionIndex].getReactants()[0].getMoleculeCount()==2 && isSpeciesFast(model[reactionIndex].getReactants()[0].getSpeciesIndex()) && reaction_propensity<=1.0);
		bool ivfpLess4rxnsFail=(failed_ivfps_without_accuracy_violation.size()==1 && all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[0]].NumberOfFastReactions<=4 && model[reactionIndex].getReactants().size()==1 && all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[0]].isFastSpecies(model[reactionIndex].getReactants()[0].getSpeciesIndex()));
		
		if (AplusAfail || ivfpLess4rxnsFail) {
//			std::cout << "recovering from failed slow A+A with A fast reaction...(reaction_propensity was "<<reaction_propensity<<")\n";
			//OR recovering from //if # reactions in failed IVFP <= 4, we can safely say that the reaction should NOT have fired...
			//we have decided that the slow reaction should not have fired
			
			//'unfire' those IVFPs that did not fail (we assume those must have only positive entries in the stoichiometry because only negative entries should be in the failed IVFP only)
			for (std::size_t i=0; i!=current_ivfps.size(); ++i) {
				if (!all_precompiled_ivfps[current_ivfps[i]].slowRxnStoichIsZero[reactionIndex] && current_ivfps[i]!=failed_ivfps_without_accuracy_violation[0]) {
					all_precompiled_ivfps[current_ivfps[i]].latestRealizablePopulation-=all_precompiled_ivfps[current_ivfps[i]].slowRxnFastSpeciesStoich[reactionIndex];
					all_precompiled_ivfps[current_ivfps[i]].equilibrium(all_precompiled_ivfps[current_ivfps[i]].defaultRelaxationTime,currentEffectivePopulation);
				}
			}
			
			//re-call equilibrium for the IVFP that failed
			all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[0]].equilibrium(all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[0]].defaultRelaxationTime,currentEffectivePopulation);
			//at this point, the call to fire should not have changed the state because we determined the slow reaction should not have fired and we undid everything...i think.
			return false;
		}
		else {
			//if # reactions in failed IVFP <= 4, we can safely say that the reaction should NOT have fired...
//			if (failed_ivfps_without_accuracy_violation.size()==1 && all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[0]].NumberOfFastReactions<=4 && model[reactionIndex].getReactants().size()==1 && all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[0]].isFastSpecies(model[reactionIndex].getReactants()[0].getSpeciesIndex())) {
//				//'unfire' those IVFPs that did not fail (we assume those must have only positive entries in the stoichiometry because only negative entries should be in the failed IVFP only)
//				for (std::size_t i=0; i!=current_ivfps.size(); ++i) {
//					if (!all_precompiled_ivfps[current_ivfps[i]].slowRxnStoichIsZero[reactionIndex] && current_ivfps[i]!=failed_ivfps_without_accuracy_violation[0]) {
//						all_precompiled_ivfps[current_ivfps[i]].latestRealizablePopulation-=all_precompiled_ivfps[current_ivfps[i]].slowRxnFastSpeciesStoich[reactionIndex];
//						all_precompiled_ivfps[current_ivfps[i]].equilibrium(all_precompiled_ivfps[current_ivfps[i]].defaultRelaxationTime,currentEffectivePopulation);
//					}
//				}
//				//at this point, the call to fire should not have changed the state because we determined the slow reaction should not have fired and we undid everything...i think.
//				return false;
//			}

			//can't say for certain that the slow reaction should not have fired, so recover by firing it, solving for equilibrium value, and then rounding for the failed ivfps. then return true (assuming no accuracy violation)
			//iterate over the failed ivfps
			for (std::size_t i=0; i!=failed_ivfps_without_accuracy_violation.size(); ++i) {
				//if we got here, we will just do our best effort to try to fire the slow reaction. may result in conservation violations.
	//			std::cout << "latest realizable population for failed_ivfps_without_accuracy_violation:\n";
	//			print_ublas_vector(all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[i]].latestRealizablePopulation,all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[i]].latestRealizablePopulation.size());
	//			std::cout << "\n";
				IndependentVirtualFastProcess& the_ivfp=all_precompiled_ivfps[failed_ivfps_without_accuracy_violation[i]];
	//			std::cout << "slow reaction fast stoichiometry:\n";
				dense_vec stoich=the_ivfp.slowRxnFastSpeciesStoich[reactionIndex];
	//			for (std::size_t i=0; i!=stoich.size(); ++i) {
	//				std::cout << stoich(i) << "\t";
	//			}
	//			std::cout << "\n";

				//"fire" regular stoichiometry
	//			std::cout << "\"fire\" slow reaction stoichiometry...\n";
				the_ivfp.latestRealizablePopulation+=stoich;
	//			std::cout << "new latest \"realizable\" population:\n";
	//			print_ublas_vector(the_ivfp.latestRealizablePopulation,the_ivfp.latestRealizablePopulation.size());
	//			std::cout << "\n";
	//				
	//				//need to create a dummy "currentEffectivePopulation" for call to equilibrium
				dense_vec dummyEffectivePopulation(currentEffectivePopulation.size());
				
	//			std::cout << "calling equilibrium on dummyEffectivePopulation...\n";
				the_ivfp.equilibrium(the_ivfp.defaultRelaxationTime,dummyEffectivePopulation,false);//"false" so equilibrium doesn't set a negative equilibrium value to 0
				
				//copy rounded dummy effective values into latest realizable population
				for (std::size_t i=0; i!=the_ivfp.NumberOfFastSpecies; ++i) {
					if (dummyEffectivePopulation(the_ivfp.fastSpeciesIndexes[i]) < -1e-11) {
						//no need to display this warning, they already see a warning from IVFP.fire
	//					if (!seenUnableToRecoverWarning) {
	//						std::cout << "StochKit WARNING (MasterVirtualFastProcessVirtualFastProcess::fireSlowReaction): unable to recover. Setting negative equilibrium value to zero and continuing but simulation may be inaccurate. (This message will only be displayed once per thread.)\n";
	//						seenUnableToRecoverWarning=true;
	//					}
						
						the_ivfp.latestRealizablePopulation[i]=0;
					}
					else {
						the_ivfp.latestRealizablePopulation[i]=round(dummyEffectivePopulation(the_ivfp.fastSpeciesIndexes[i]));
					}
				}

	//			std::cout << "updated realizable population:\n";
	//			print_ublas_vector(the_ivfp.latestRealizablePopulation,the_ivfp.latestRealizablePopulation.size());
	//			std::cout << "\n";		

			}//end iterate over failed_ivfps_without_accuracy_violation
		}
		
		if (!accuracy_violated) return true;
	}
	
	return ivfp_fire_success;
}


void MasterVirtualFastProcess::initialize(double initialRelaxationTime, dense_vec& initialPopulation, dense_vec& currentEffectivePopulation) {

	fastReactionIndexes=initialFastReactionIndexes;
	current_ivfps=initial_ivfps;
	fastSpeciesIndexes=initialFastSpeciesIndexes;
	isSpeciesFastBools=initialIsSpeciesFastBools;
	
	//
	accuracy_violated=false;

//	std::cout << "in MVFP.initialize, current_ivfps.size="<<current_ivfps.size()<<"\n";
	for (std::size_t i=0; i!=current_ivfps.size(); ++i) {
//		std::cout << "initializing current_ivfps[i]="<<current_ivfps[i]<<"\n";
		all_precompiled_ivfps[current_ivfps[i]].initialize(initialRelaxationTime, initialPopulation, currentEffectivePopulation);
	}
//	std::cout << "after initializing MVFP, fast reactions are: \n";
//	std::vector<std::size_t> myfastlist=getFastReactionIndexesRef();
//	for (std::size_t i=0; i!=myfastlist.size(); ++i) {
//		std::cout << myfastlist[i] << " ";
//	}
//	std::cout << "\n";
}

bool MasterVirtualFastProcess::areOpposites(boost::numeric::ublas::matrix_row<boost::numeric::ublas::matrix<double> > row1, boost::numeric::ublas::matrix_row<boost::numeric::ublas::matrix<double> > row2) {
	//assumes equal size...
	for (std::size_t i=0; i!=row1.size(); ++i) {
		if (row1(i)==0 && row2(i)!=0) return false;
		if (row1(i)!=0 && row2(i)!=-row1(i)) return false;
	}
	return true;
}

std::vector<std::size_t>& MasterVirtualFastProcess::getFastReactionIndexesRef() {
//	std::cout << "in MVFP.getfastreactionsindexesref, the "<<fastReactionIndexes.size()<<" fast reactions are:\n";
//	for (std::size_t i=0; i!=fastReactionIndexes.size(); ++i) {
//		std::cout << fastReactionIndexes[i]<<"\n";
//	}
	return fastReactionIndexes;
}

std::vector<std::vector<std::size_t> > MasterVirtualFastProcess::create_groups(std::vector<double>& firing_frequency_estimates, dense_vec& tf_population) {
	std::cout << "MVFP create_groups not yet implemented! terminating.\n";
	exit(1);
	std::vector<std::vector<std::size_t> > groups;
	return groups;
}


void MasterVirtualFastProcess::print_current_ivfps() {
	for (std::size_t i=0; i!=current_ivfps.size(); ++i) {
		std::cout << "ivfp "<<i<<": ";
		for (std::size_t j=0; j!=all_precompiled_ivfps[current_ivfps[i]].fastReactionIndexes.size(); ++j) {
			std::cout << all_precompiled_ivfps[current_ivfps[i]].fastReactionIndexes[j] << " ";
		}
		std::cout << "\n";
	}
}


void MasterVirtualFastProcess::reset_accuracy_violated() {
	accuracy_violated=false;
	for (std::size_t i=0; i!=current_ivfps.size(); ++i) {
		all_precompiled_ivfps[current_ivfps[i]].accuracy_violated=false;
	}
}
