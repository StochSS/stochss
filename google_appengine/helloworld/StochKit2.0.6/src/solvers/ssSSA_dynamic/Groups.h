 /*
 *  Groups.h
 */

#ifndef _GROUPS_H_
#define _GROUPS_H_

#include <iostream>
#include <set>
#include <map>
#include <list>
#include <algorithm>
#include <limits>
#include <queue>
#include <numeric>
#include "ReversiblePair.h"
#include "boost/unordered_map.hpp"
#define MINIMUMFIRINGS 0
#define FASTTOSLOWRATIO 10
#include "VectorManipulation.h"
#include "createConservationMatrix.h"
#include <iomanip>
#include <sys/time.h>

class Groups {
  public:
 	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;

	Groups(std::vector<ElementaryReaction>& model);

	class GroupNode {
		public:
		//construct a non-reversible node
		GroupNode(std::size_t nonreversible_index, std::vector<ElementaryReaction>& model) {
			reversible=false;
			relaxationTime=std::numeric_limits<double>::infinity();
//			relaxationTime=0;//initialize to 0?
			min_freq=std::numeric_limits<double>::infinity();
			max_freq=0;
			nonreversible=model[nonreversible_index];
			reaction_indexes.push_back(nonreversible_index);
			//get species indexes
			std::vector<Reactant> rs=nonreversible.getReactants().get();
			for (std::size_t i=0; i!=rs.size(); ++i) {
				species_indexes.insert(rs[i].getSpeciesIndex());
			}
			std::vector<Product> ps=nonreversible.getProducts().get();
			for (std::size_t i=0; i!=ps.size(); ++i) {
				species_indexes.insert(ps[i].getSpeciesIndex());
			}
			sampleTime=0.0;
		}
		//construct a reversible pair node
		GroupNode(std::pair<std::size_t,size_t> reversible_indexes, std::vector<ElementaryReaction>& model) : pair(reversible_indexes, model) {
			reversible=true;

			min_freq=std::numeric_limits<double>::infinity();
			max_freq=0;

			reaction_indexes.push_back(pair.reaction_indexes.first);
			reaction_indexes.push_back(pair.reaction_indexes.second);
			species_indexes=pair.species;
			sampleTime=0.0;
		}
		
		bool reversible;
		ReversiblePair pair;//only valid if reversible is true
		ElementaryReaction nonreversible;//only set if reversible is false
		std::set<std::size_t> species_indexes;
		double min_freq,max_freq;
		std::vector<std::size_t> reaction_indexes;
				
		std::vector<std::size_t> dependencyGraphLinks;//does not get built on construction

		void display() {
			std::cout << "reaction_indexes: ";
			for (std::size_t i=0; i!=reaction_indexes.size(); ++i) {
				std::cout << reaction_indexes[i] << "\t";
			}
			std::cout << "\n";
			std::cout << "\tspecies_indexes: ";
			for (std::set<std::size_t>::iterator it=species_indexes.begin(); it!=species_indexes.end(); ++it) {
				std::cout << *it << "\t";
			}
			std::cout << "\n";
			std::cout << "\tmin_freq="<<min_freq<<", max_freq="<<max_freq<<", reversible="<<reversible<<"\n";
			std::cout << "\tdependency graph links: ";
			for (std::size_t i=0; i!=dependencyGraphLinks.size(); ++i) {
				std::cout << dependencyGraphLinks[i] << "\t";
			}
			std::cout << "\n";			
		}

		void updateData(dense_vec& population, std::vector<double>& firing_freqs, double sample_time) {
			//sample_time is amount of simulation time that the firing frequencies represent
			updateRelaxationTime(population);
			min_freq=std::min(firing_freqs[reaction_indexes.front()],firing_freqs[reaction_indexes.back()]);
			max_freq=std::max(firing_freqs[reaction_indexes.front()],firing_freqs[reaction_indexes.back()]);
			sampleTime=sample_time;
		}
		
		double updateRelaxationTime(dense_vec& population) {//also sets relaxationTime
			if (!reversible) return relaxationTime;
			else {
				relaxationTime=pair.calculateRelaxationTime(population);
//				std::cout << "reversible, now relaxationTime="<<relaxationTime<<"\n";
				return relaxationTime;
			}
		}
		double relaxationTime;
		double sampleTime;

		enum mergeableResult { THIS_FASTER, MERGEABLE, OTHER_FASTER, NO_OVERLAP };
		mergeableResult mergeable(Groups::GroupNode other_node) {
//			std::cout << "in GroupNode::mergeable...\n";
			
			double scaleSeparation=10.0;
			
			//assumes that freqs/relaxation times have been set before this is called!
			
			//iterate over common species
			//if no common species, return NO_OVERLAP
			// if for all species that appear in both, min freq of one is 10x faster than max freq of the other
			// AND relaxation time is less than 1/10th of the other, than that one is faster
			// else, they are MERGEABLE meaning neither is "faster" than the other
			mergeableResult result=NO_OVERLAP;
			
			std::set<std::size_t>::iterator my_it=species_indexes.begin();
			std::set<std::size_t>::iterator other_it=other_node.species_indexes.begin();
			while (my_it!=species_indexes.end() && other_it!=other_node.species_indexes.end()) {
				if (*my_it < *other_it) {
					++my_it;
				}
				else if (*other_it < *my_it) {
					++other_it;
				}
				else {//we found an overlapping species
					//if result is currently NO_OVERLAP, then this is the first overlapping species, so find out if one is faster than other for this species
					if (result==NO_OVERLAP) {
//						std::cout << "found overlap...(species "<<*my_it<<")...\n";
//						std::cout << "my lowest freq: "<<min_freq<<", fastest: "<<max_freq<<", other: "<<other_node.min_freq<<","<<other_node.max_freq<<"\n";
						if ( (min_freq > scaleSeparation*(other_node.max_freq)) && (relaxationTime*scaleSeparation < other_node.relaxationTime) ) {
							result=THIS_FASTER;
						}
						else if ( (other_node.min_freq > scaleSeparation*(max_freq)) && (other_node.relaxationTime*scaleSeparation < relaxationTime) ) {
							result=OTHER_FASTER;
						}
						else {
//							std::cout << "setting result to MERGEABLE...\n";
							result=MERGEABLE;
							return result;
						}
					}
					else if (result==THIS_FASTER) {
						if (!( (min_freq > scaleSeparation*(other_node.max_freq)) && (relaxationTime*scaleSeparation < other_node.relaxationTime) )) {
							result=MERGEABLE;
							return result;
						}
					}
					else if (result==OTHER_FASTER) {
						if (!( (other_node.min_freq > scaleSeparation*(max_freq)) && (other_node.relaxationTime*scaleSeparation < relaxationTime) )) {
							result=MERGEABLE;
							return result;
						}
					}
					else {//shouldn't get here
						std::cout << "StochKit ERROR (Groups::Group::mergeable): reached invalid result (bug). Terminating.\n";
						exit(1);
					}
					++my_it;
					++other_it;
				}
			}//end while
			return result;//if we made it here, result is not MERGEABLE (it is either NO_OVERLAP or THIS_FASTER or OTHER_FASTER)
		}

	};//nested class GroupNode
	
	class FastGroup {
		public:
		double totalFiringFrequency;
		std::size_t numberOfFastReactions;//in this FastGroup
		std::set<std::size_t> fastReactionIndexes;
		double relaxationTime;
		std::set<std::size_t> initialNodesIndexes;//indexes into initialGroupNodes of nodes that appear in this fast group
		//map of involved species' min and max freq
		std::map<std::size_t, std::pair<double,double> > speciesFreqMap;//first is min, second is max freq
//		private://let's protect these.
		std::size_t r;//rank
		bool rankUpdated;//keeps track of whether rank is current (set to false on insert, set to true on call to compute rank)
		public:
		FastGroup() {
			totalFiringFrequency=0;
			numberOfFastReactions=0;
			r=0;
			rankUpdated=false;
		}


		//compute the rank of THIS FastGroup (not full model
		std::size_t compute_rank(std::vector<Groups::GroupNode>& all_nodes, std::vector<ElementaryReaction>& model) {
			if (rankUpdated) return r;
			
			//need to compute the rank of this group's stoichiometry...
			//this isn't the way to do it...
			//boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(model,maxSpeciesIndex+1);
			std::size_t numberOfFastSpecies=speciesFreqMap.size();
//			boost::numeric::ublas::matrix<double> groupNU(numberOfFastReactions,numberOfFastSpecies);//speciesFreqMap.size()=number of species in this group
			boost::numeric::ublas::matrix<double> groupNU(initialNodesIndexes.size(),numberOfFastSpecies);//only need as many rows as we have NODES (< reactions) because span of reversible pairs is equivalent
			//let's fill it with zeros
			for (std::size_t i=0; i!=groupNU.size1(); ++i) {
				for (std::size_t j=0; j!=groupNU.size2(); ++j) {
					groupNU(i,j)=0;
				}
			}
			
			//create a lookup table mapping original species indexes to indexes for groupNU
			//species 0 will be first in speciesFreqMap, species 1 will be second in speciesFreqMap, etc.
			std::map<std::size_t,std::size_t> lookupTable;
			std::size_t i=0;
			for (std::map<std::size_t, std::pair<double,double> >::iterator it=speciesFreqMap.begin(); it!=speciesFreqMap.end(); ++it) {
				lookupTable.insert(std::pair<std::size_t,std::size_t>(it->first,i));
				++i;
			}
//			std::cout << "lookupTable:\n";
//			for (std::map<std::size_t,std::size_t>::iterator it=lookupTable.begin(); it!=lookupTable.end(); ++it) {
//				std::cout << it->first << "="<<it->second << "\n";
//			}
			//build groupNU, a reindexed stoichiometry vector (reindexed so that it only contains columns for species involved)
			//for example, a node comprised of reversible pair X4+X8<=>X12 would map it to temp X0+X1<=>X2 for groupNU
			//iterate over initial nodes, then over the reactions within in, constructing
			//by the way, for computing the rank, we only need to use one reaction for each reversible pair since stoichs of pairs have same span
			std::size_t currentRow=0;//each row corresponds to an initial node
			for (std::set<std::size_t>::iterator it=initialNodesIndexes.begin(); it!=initialNodesIndexes.end(); ++it) {
				//for this node, insert a reindexed stoichiometry into currentRow in groupNU
				sparse_vec stoich_row=model[all_nodes[*it].reaction_indexes[0]].getStoichiometry();
//				std::cout << "processing reaction index " << all_nodes[*it].reaction_indexes[0] << "...\n";
				for (sparse_vec::iterator it=stoich_row.begin(); it!=stoich_row.end(); ++it) {
//					std::cout << "*it="<<*(it)<<", and it.index()="<<it.index()<<"\n";
					groupNU(currentRow,lookupTable[it.index()])=*(it);
				}
				++currentRow;
			}
			
//			std::cout << "groupNU:\n";
//			for (std::size_t i=0; i!=groupNU.size1(); ++i) {
//				for (std::size_t j=0; j!=groupNU.size2(); ++j) {
//					std::cout << groupNU(i,j) << "\t";
//				}
//				std::cout << "\n";
//			}
			
			
			r=rank(groupNU);
			
//			std::cout << "rank is "<<r<<"\n";
			rankUpdated=true;//should set it to true when properly implemented...
			return r;
		}
		
		
		void insert(std::vector<Groups::GroupNode>& all_nodes, std::size_t node_index) {
			rankUpdated=false;
			if (numberOfFastReactions==0) {
				if (all_nodes[node_index].reversible) {
					totalFiringFrequency=all_nodes[node_index].min_freq+all_nodes[node_index].max_freq;
				}
				else {
					totalFiringFrequency=all_nodes[node_index].min_freq;
				}
				relaxationTime=all_nodes[node_index].relaxationTime;
//				if (relaxationTime<=0) {
//					//std::cout << "StochKit MESSAGE (Groups::FastGroup::insert): initial node has relaxationTime=0, setting to infinity.\n";
//					relaxationTime=std::numeric_limits<double>::infinity();
//				}
				initialNodesIndexes.clear();
				initialNodesIndexes.insert(node_index);
				speciesFreqMap.clear();
				//iterate over species, insert into speciesFreqMap
				for (std::set<std::size_t>::iterator my_it=all_nodes[node_index].species_indexes.begin(); my_it!=all_nodes[node_index].species_indexes.end(); ++my_it) {
					speciesFreqMap.insert( std::pair<std::size_t, std::pair<double,double> >(*my_it, std::make_pair(all_nodes[node_index].min_freq,all_nodes[node_index].max_freq)));
				}
			}
			else {
				std::cout << "ERROR, Groups::FastGroup::insert with numberOfFastReactions!=0 case not yet implemented. Terminating.\n";
				exit(1);
			}
			numberOfFastReactions+=all_nodes[node_index].reaction_indexes.size();
			fastReactionIndexes.insert(all_nodes[node_index].reaction_indexes.begin(),all_nodes[node_index].reaction_indexes.end());
			if (numberOfFastReactions!=fastReactionIndexes.size()) {
				std::cout << "StochKit ERROR (Groups::FastGroup::insert): numberOfFastReactions does not equal fastReactionIndexes.size(). (Bug) Terminating.\n";
				exit(1);
			}
		}
		
		bool validate_nodes_species_consistency(std::vector<Groups::GroupNode>& all_nodes) {
//			std::cout << "in validate_nodes_species_consistency...\n";
			//returns false if species in speciesFreqMap do not match what is implied by species in initialNodesIndexes
			//first, construct a list of species from initialNodesIndexes
			std::set<std::size_t> testSpecies;
//			std::cout << "contains nodes: ";
			for (std::set<std::size_t>::iterator tmp_it=initialNodesIndexes.begin(); tmp_it!=initialNodesIndexes.end(); ++tmp_it) {
//				std::cout << *tmp_it << "\t";
				//std::set<std::size_t> species_indexes;
				testSpecies.insert(all_nodes[*tmp_it].species_indexes.begin(),all_nodes[*tmp_it].species_indexes.end());
			}
//			std::cout << "\n";
//			std::cout << "species based on nodes: ";
//			for (std::set<std::size_t>::iterator tmp_it=testSpecies.begin(); tmp_it!=testSpecies.end(); ++tmp_it) {
//				std::cout << *tmp_it << "\t";
//			}
//			std::cout << "\n";
			
			std::map<std::size_t, std::pair<double,double> >::iterator my_it=speciesFreqMap.begin();
			std::set<std::size_t>::iterator node_it=testSpecies.begin();
			bool valid=true;
			while (my_it!=speciesFreqMap.end() && node_it!=testSpecies.end()) {
				if (my_it->first < *node_it) {
//					std::cout << "species "<<my_it->first<<" in speciesFreqMap but should not be based on nodes.\n";
					valid=false;
					++my_it;
				}
				else if (*node_it < my_it->first) {
//					std::cout << "species "<<*node_it<<" is not in speciesFreqMap but should be based on nodes.\n";
					valid=false;
					++node_it;
				}
				else {//we found an overlapping species
//					std::cout << "species "<<*node_it<<" is in speciesFreqMap and should be. good.\n";
					++node_it;
					++my_it;
				}
			}
			while (my_it!=speciesFreqMap.end()) {
//				std::cout << "species "<<my_it->first<<" in speciesFreqMap but should not be based on nodes.\n";
				valid=false;
				++my_it;
			}
			while (node_it!=testSpecies.end()) {
//				std::cout << "species "<<*node_it<<" is not in speciesFreqMap but should be based on nodes.\n";
				valid=false;
				++node_it;
			}
			return valid;
		}
		
		enum mergeableResult { THIS_FASTER, MERGEABLE, OTHER_FASTER, NO_OVERLAP };
		mergeableResult mergeable(Groups::GroupNode& node) {
//			std::cout << "in FastGroup.mergeable(node)...\n";
//			
//			std::cout << "this fast group species: ";
//			for (std::map<std::size_t, std::pair<double,double> >::iterator tmp_it=speciesFreqMap.begin(); tmp_it!=speciesFreqMap.end(); ++tmp_it) {
//				std::cout << tmp_it->first << "\t";
//			}
//			std::cout << "\n";
//			std::cout << "this fast group nodes: ";
//			//std::set<std::size_t> initialNodesIndexes;
//			for (std::set<std::size_t>::iterator tmp_it=initialNodesIndexes.begin(); tmp_it!=initialNodesIndexes.end(); ++tmp_it) {
//				std::cout << *tmp_it << "\t";
//			}
//			std::cout << "\n";
//			std::cout << "this fast group reaction indexes: ";
//			//std::set<std::size_t> fastReactionIndexes
//			for (std::set<std::size_t>::iterator tmp_it=fastReactionIndexes.begin(); tmp_it!=fastReactionIndexes.end(); ++tmp_it) {
//				std::cout << *tmp_it << "\t";
//			}
//			std::cout << "\n";
//			std::cout << "node reactions: ";
//			for (std::size_t i=0; i!=node.reaction_indexes.size(); ++i) {
//				std::cout << node.reaction_indexes[i] << "\t";
//			}
//			std::cout << "\n";
//			std::cout << "node species: ";
//			for (std::set<std::size_t>::iterator tmp_it2=node.species_indexes.begin(); tmp_it2!=node.species_indexes.end(); ++tmp_it2) {
//				std::cout << *tmp_it2 << "\t";
//			}
//			std::cout << "\n";
			
			double scaleSeparation=10.0;
			
			//assumes that freqs/relaxation times have been set before this is called!
			
			//iterate over common species
			//if no common species, return NO_OVERLAP
			// if for all species that appear in both, min freq of one is 10x faster than max freq of the other
			// AND relaxation time is less than 1/10th of the other, than that one is faster
			// else, they are MERGEABLE meaning neither is "faster" than the other
			mergeableResult result=NO_OVERLAP;
			
			std::map<std::size_t, std::pair<double,double> >::iterator my_it=speciesFreqMap.begin();
			std::set<std::size_t>::iterator other_it=node.species_indexes.begin();
			while (my_it!=speciesFreqMap.end() && other_it!=node.species_indexes.end()) {
				if (my_it->first < *other_it) {
					++my_it;
				}
				else if (*other_it < my_it->first) {
					++other_it;
				}
				else {//we found an overlapping species
					//if result is currently NO_OVERLAP, then this is the first overlapping species, so find out if one is faster than other for this species
					if (result==NO_OVERLAP) {
//						std::cout << "found overlap...(species "<<my_it->first<<")...\n";
//						std::cout << "my lowest freq: "<<my_it->second.first<<", fastest: "<<my_it->second.second<<", other: "<<node.min_freq<<","<<node.max_freq<<"\n";
//						std::cout << "my relaxation time: "<<relaxationTime<<", other: "<<node.relaxationTime<<"\n";
						if ( (my_it->second.first > scaleSeparation*(node.max_freq)) && (relaxationTime*scaleSeparation < node.relaxationTime) ) {
							result=THIS_FASTER;
						}
						else if ( (node.min_freq > scaleSeparation*(my_it->second.second)) && (node.relaxationTime*scaleSeparation < relaxationTime) ) {
							result=OTHER_FASTER;
						}
						else {
//							std::cout << "setting result to MERGEABLE...\n";
							result=MERGEABLE;
							return result;
						}
					}
					else if (result==THIS_FASTER) {
						if (!( (my_it->second.first > scaleSeparation*(node.max_freq)) && (relaxationTime*scaleSeparation < node.relaxationTime) )) {
//							std::cout << "setting result to MERGEABLE...\n";
							result=MERGEABLE;
							return result;
						}
					}
					else if (result==OTHER_FASTER) {
						if (!( (node.min_freq > scaleSeparation*(my_it->second.second)) && (node.relaxationTime*scaleSeparation < relaxationTime) )) {
							result=MERGEABLE;
//							std::cout << "setting result to MERGEABLE...\n";
							return result;
						}
					}
					else {//shouldn't get here
						std::cout << "StochKit ERROR (Groups::Group::mergeable): reached invalid result (bug). Terminating.\n";
						exit(1);
					}
					++my_it;
					++other_it;
				}
			}//end while
//			if (result==NO_OVERLAP) {
//				std::cout << "returning NO_OVERLAP...\n";
//			}
//			else if (result==THIS_FASTER) {
//				std::cout << "returning THIS_FASTER...\n";			
//			}
//			else if (result==OTHER_FASTER) {
//				std::cout << "returning OTHER_FASTER...\n";			
//			}
//			else {
//				std::cout << "unexpected result. terminating.\n";
//				exit(1);
//			}
			return result;//if we made it here, result is not MERGEABLE (it is either NO_OVERLAP or THIS_FASTER or OTHER_FASTER)
		}

	};
	
	std::vector<GroupNode> initialGroupNodes;

	struct Graph {
		std::vector<GroupNode> nodes;
	};
	
	Graph graph;
	
	//a "fast process" consists of independent FastGroup objects plus network info
	struct FP {
		std::vector<FastGroup> fast_groups;
		std::map<std::size_t,std::set<std::size_t> > initialGroupNodesLinksToTheseFastGroups;//key is initialGroupNodes index, value is set of indexes in fast_groups to which that inititalGroupNode points, also, these should be only nodes that are not already in a fast_group...			
		std::vector<std::set<std::size_t> > fastGroupLinksToInitialGroupNodes;//index matches index of fast_groups
		
		std::set<std::size_t> nodes_to_insert;//used by insert_explore, contains list of nodes to be inserted into fast process
		std::set<std::size_t> updated_unexplored_fast_groups;//this list tells us which fast_groups have changed (and, therefore, have to be "explored"), used by insert_explore and related functions

		bool unstable;//if set, all other members should be assumed to be invalid.

		FP() : unstable(false) {}		

		void clear() {
			fast_groups.resize(0);
			initialGroupNodesLinksToTheseFastGroups.clear();
			fastGroupLinksToInitialGroupNodes.clear();
			nodes_to_insert.clear();
			updated_unexplored_fast_groups.clear();
			unstable=false;
		}

		double getTotalFastReactionFrequency() {
			double total=0;
			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
				total+=fast_groups[i].totalFiringFrequency;
			}
			return total;
		}

		std::size_t getTotalFastReactionChannels() {
			std::size_t total=0;
			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
				total+=fast_groups[i].numberOfFastReactions;
			}
			return total;
		}

		double getRelaxationTime() {
//			std::cout << "computing FP relaxation time...\n";
			double relaxTime=0;
			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
//				std::cout << "fast_group["<<i<<"].relaxationTime="<<fast_groups[i].relaxationTime<<"\n";
				relaxTime=std::max(relaxTime,fast_groups[i].relaxationTime);
			}
//			std::cout << "returning "<<relaxTime<<" in getRelaxationTime.\n";
			return relaxTime;
		}
		
		bool insert_explore2(std::size_t node_index, std::vector<Groups::GroupNode>& all_nodes) {
//			std::cout << "in FP::insert_explore2...node_index="<<node_index<<"\n";

			if (updated_unexplored_fast_groups.size()!=0) {
				std::cout << "StochKit ERROR (Groups::FP::insert_explore): updated fast groups not empty on call to insert_explore (bug). Terminating.\n";
			}
			if (!nodes_to_insert.empty()) {
				std::cout << "StochKit ERROR (Groups::FP::insert_explore): call to insert_explore while nodes_to_insert is not empty (bug). Terminating.\n";
				exit(1);
			}

			//see if node_index is already in the fast process. if so, just return true
			if (containsNode(node_index)) return true;

			nodes_to_insert.insert(node_index);
			
			while (!nodes_to_insert.empty()) {
				std::size_t currentNode=*nodes_to_insert.begin();
//				std::cout << "in !nodes_to_insert.empty() while loop, nodes_to_insert.size()="<<nodes_to_insert.size()<<"\n";
				if (!all_nodes[currentNode].reversible) {
					unstable=true;
					return false;
				}
				
				insert(currentNode,all_nodes);
				nodes_to_insert.erase(currentNode);
				
				while (!updated_unexplored_fast_groups.empty()) {
					//explore should either do nothing (remove the unexplored_fast_group?) or push a node onto the nodes_to_insert queue
					explore(*(updated_unexplored_fast_groups.begin()), all_nodes);
				}
			}

			return true;//if we got here, must be stable...
		}
		
		void explore(std::size_t fast_group_index, std::vector<Groups::GroupNode>& all_nodes) {
//			std::cout << "explore fast_group["<<fast_group_index<<"]...\n";
			
			//iterate over this fast group's adjacent nodes until we find one that must be merged with this fast group
			for (std::set<std::size_t>::iterator node_it=fastGroupLinksToInitialGroupNodes[fast_group_index].begin(); node_it!=fastGroupLinksToInitialGroupNodes[fast_group_index].end(); ++node_it) {
//				std::cout << "slow node "<< *node_it << " is adjacent to fast_group["<<fast_group_index<<"]...calling mergeable...\n";
				Groups::FastGroup::mergeableResult mr=fast_groups[fast_group_index].mergeable(all_nodes[*node_it]);
				//possible results: THIS_FASTER, MERGEABLE, OTHER_FASTER, NO_OVERLAP
				if (mr==Groups::FastGroup::MERGEABLE) {
//					std::cout << "MERGEABLE...\n";
//					std::cout << "so insert node "<<*(node_it)<<" into fast process.\n";
					updated_unexplored_fast_groups.erase(fast_group_index);//it will be added back to updated_unexplored_fast_groups when node is inserted into fast process					
					nodes_to_insert.insert(*node_it);
					return;
				}
				else if (mr==Groups::FastGroup::THIS_FASTER) {
//					std::cout << "THIS_FASTER...do nothing\n";
				}
				else if (mr==Groups::FastGroup::OTHER_FASTER) {
//					std::cout << "OTHER_FASTER...\n";
//					std::cout << "StochKit ERROR (Groups::FP::insert_explore): in insert_explore, found a node that was faster than the fast group. Situation not implemented in this beta version. Terminating.\n";
//					exit(1);
					//think all I have to do is treat it like mergeable
//					std::cout << "so insert node "<<*(node_it)<<" into fast process.\n";
					updated_unexplored_fast_groups.erase(fast_group_index);//it will be added back to updated_unexplored_fast_groups when node is inserted into fast process					
					nodes_to_insert.insert(*node_it);					
				}
				else {
//					std::cout << "NO_OVERLAP...\n";
					std::cout << "StochKit ERROR (Groups::FP::explore): found NO_OVERLAP between fast group and linked node (bug). Terminating.\n";
					exit(1);
				}
			}
			
			//if we made it here, fast group is "isolated" (doesn't need to be merged with any adjacent nodes)
			//so remove this group from list of nodes that need to be explored
			updated_unexplored_fast_groups.erase(fast_group_index);
		}
		
		void insert(std::size_t node_index, std::vector<Groups::GroupNode>& all_nodes) {
//			std::cout << "in Groups::FP::insert("<<node_index<<")...\n";
			
			std::map<std::size_t,std::set<std::size_t> >::iterator it_to_linked_nodes=initialGroupNodesLinksToTheseFastGroups.find(node_index);
			if (it_to_linked_nodes==initialGroupNodesLinksToTheseFastGroups.end()) {
//				std::cout << "node_index "<<node_index<<" does not overlap with any existing fast groups, so create a new group.\n";
				create_new_fast_group(node_index, all_nodes);
			}
			else {
//				std::cout << "node "<<node_index<<" overlaps with "<<it_to_linked_nodes->second.size()<<" existing fast groups.\n";
				while (it_to_linked_nodes->second.size()!=1) {
					//merge first and last elements
					std::size_t first_arg=*(it_to_linked_nodes->second.begin());
					std::size_t second_arg=*(it_to_linked_nodes->second.rbegin());
					merge_fast_groups( first_arg , second_arg );
//					std::cout << "after merge of fast groups"<<first_arg<<" and "<<second_arg<<" test consistency of fast group "<<std::min(first_arg,second_arg)<<"...\n";
//					bool valid_species=fast_groups[std::min(first_arg,second_arg)].validate_nodes_species_consistency(all_nodes);
//					//this is really for debugging...
//					if (valid_species) {
//						std::cout << "valid.\n";
//					}
//					else {
//						std::cout << "INVALID. Terminating.\n";
//						exit(1);
//					}
				}
				std::size_t fast_group_index=*(it_to_linked_nodes->second.begin());
//				std::cout << "at this point, node_index "<<node_index<<" overlaps with only one fast group (fast group "<<fast_group_index<<").\n";
//				
//				std::cout << "calling merge(fast group="<<fast_group_index<<", node="<<node_index<<")...\n";
				merge(fast_group_index, node_index, all_nodes);
//				std::cout << "after merge of fast group"<<fast_group_index<<" and node "<<node_index<<" test consistency of fast group "<<fast_group_index<<"...\n";
//				bool check_valid_species=fast_groups[fast_group_index].validate_nodes_species_consistency(all_nodes);
//				//this is really for debuggins...
//				if (check_valid_species) {
//					std::cout << "valid.\n";
//				}
//				else {
//					std::cout << "INVALID. Terminating.\n";
//					exit(1);
//				}

//				std::cout << "add "<<fast_group_index<<" to updated_unexplored_fast_groups...\n";
				updated_unexplored_fast_groups.insert(fast_group_index);
			}
		}
		
		void merge_fast_groups(std::size_t fast_group_index1, std::size_t fast_group_index2) {
			std::size_t keepIndex=std::min(fast_group_index1,fast_group_index2);
			std::size_t mergeIndex=std::max(fast_group_index1,fast_group_index2);
//			std::cout << "merging fast group "<<mergeIndex<<" INTO fast group "<<keepIndex<<"\n";

			fast_groups[keepIndex].totalFiringFrequency+=fast_groups[mergeIndex].totalFiringFrequency;
			fast_groups[keepIndex].numberOfFastReactions+=fast_groups[mergeIndex].numberOfFastReactions;
			fast_groups[keepIndex].fastReactionIndexes.insert(fast_groups[mergeIndex].fastReactionIndexes.begin(),fast_groups[mergeIndex].fastReactionIndexes.end());
			fast_groups[keepIndex].relaxationTime=std::max(fast_groups[keepIndex].relaxationTime,fast_groups[mergeIndex].relaxationTime);
			fast_groups[keepIndex].initialNodesIndexes.insert(fast_groups[mergeIndex].initialNodesIndexes.begin(),fast_groups[mergeIndex].initialNodesIndexes.end());
			//iterate over speciesFreqMap
//			std::map<std::size_t, std::pair<double,double> >::iterator keep_it=fast_groups[keepIndex].speciesFreqMap.begin();
//			std::map<std::size_t, std::pair<double,double> >::iterator merge_it=fast_groups[mergeIndex].speciesFreqMap.begin();

//			std::cout << "fast_group["<<keepIndex<<"] (keepIndex) species: ";
//			for (std::map<std::size_t, std::pair<double,double> >::iterator tmpit=fast_groups[keepIndex].speciesFreqMap.begin(); tmpit!=fast_groups[keepIndex].speciesFreqMap.end(); ++tmpit) {
//				std::cout << tmpit->first << "\t";
//			}
//			std::cout << "\n";
//			std::cout << "fast_group["<<mergeIndex<<"] (mergeIndex) species: ";
//			for (std::map<std::size_t, std::pair<double,double> >::iterator tmpit=fast_groups[mergeIndex].speciesFreqMap.begin(); tmpit!=fast_groups[mergeIndex].speciesFreqMap.end(); ++tmpit) {
//				std::cout << tmpit->first << "\t";
//			}
//			std::cout << "\n";

			std::pair<std::map<std::size_t, std::pair<double,double> >::iterator, bool> insert_return_val;
			for (std::map<std::size_t, std::pair<double,double> >::iterator merge_it=fast_groups[mergeIndex].speciesFreqMap.begin(); merge_it!=fast_groups[mergeIndex].speciesFreqMap.end(); ++merge_it) {
//				std::cout << "inserting info into speciesFreqMap for species index "<<merge_it->first<<"...\n";
				insert_return_val=fast_groups[keepIndex].speciesFreqMap.insert(std::pair<std::size_t, std::pair<double,double> >(merge_it->first,merge_it->second));
				//by definition, fast groups do not overlap, so on merge, they should share no common species. if they do share species, it is an error and terminate.
				if (insert_return_val.second==false) {
//					std::cout << "species index "<<merge_it->first<<" already present in fast_groups["<<keepIndex<<"] speciesFreqMap.\n";
//					std::cout << "in fast group "<< keepIndex<<" min freq="<<insert_return_val.first->second.first<<" and max freq="<<insert_return_val.first->second.second<<"\n";
//					std::cout << "while in fast group mergeIndex="<<mergeIndex<<" min freq="<<merge_it->second.first<<" and max freq="<<merge_it->second.second<<"\n";
					std::cout << "StochKit ERROR (Groups::FP::merge_fast_groups): attempt to merge fast groups that both contain the same species. This is unexpected (bug). Terminating.\n";
					exit(1);
				}
			}
			
			fast_groups[keepIndex].rankUpdated=false;

			//erase references to mergeIndex
			for (std::set<std::size_t>::iterator it=fastGroupLinksToInitialGroupNodes[mergeIndex].begin(); it!=fastGroupLinksToInitialGroupNodes[mergeIndex].end(); ++it) {
				//add to fastGroupLinksToInitialGroupNodes[keepIndex]
//				std::cout << "inserting node "<<*it<<" into fastGroupLinksToInitialGroupNodes["<<keepIndex<<"]...\n";
				fastGroupLinksToInitialGroupNodes[keepIndex].insert(*it);
				
				//add keepIndex to initialGroupNodesLinksToTheseFastGroups
//				std::cout << "inserting fast_group index "<<keepIndex<<" into node "<<*it<<"'s initialGroupNodesLinksToTheseFastGroups set...\n";
				std::map<std::size_t,std::set<std::size_t> >::iterator nodes_it=initialGroupNodesLinksToTheseFastGroups.find(*it);
				nodes_it->second.insert(keepIndex);
				
				//erase mergeIndex from initialGroupNodesLinksToTheseFastGroups
//				std::cout << "erasing fast_group index "<<mergeIndex<<" from node "<<*it<<"'s initialGroupNodesLinksToTheseFastGroups set...\n";
				nodes_it->second.erase(mergeIndex);
			}

			//now copy last element into mergeIndex position, then delete last element
			std::size_t backIndex=fast_groups.size()-1;
			if (mergeIndex!=backIndex) {
//				std::cout << "mergeIndex!=backIndex, so swap...\n";
				fast_groups[mergeIndex]=fast_groups[backIndex];
				fastGroupLinksToInitialGroupNodes[mergeIndex]=fastGroupLinksToInitialGroupNodes[backIndex];
				//change initialWhatever too...remove backIndex and add to mergeIndex
				for (std::set<std::size_t>::iterator it=fastGroupLinksToInitialGroupNodes[mergeIndex].begin(); it!=fastGroupLinksToInitialGroupNodes[mergeIndex].end(); ++it) {
					//insert mergeIndex
					std::map<std::size_t,std::set<std::size_t> >::iterator node_it=initialGroupNodesLinksToTheseFastGroups.find(*it);
					node_it->second.insert(mergeIndex);
					//remove backIndex
					node_it->second.erase(backIndex);
				}
			}
			
			fast_groups.pop_back();
			fastGroupLinksToInitialGroupNodes.pop_back();
			
			//in updated_unexplored_fast_groups, remove reference to mergeIndex, then change backIndex to mergeIndex
			updated_unexplored_fast_groups.erase(mergeIndex);
			std::set<std::size_t>::iterator back_it=updated_unexplored_fast_groups.find(backIndex);
			if (back_it!=updated_unexplored_fast_groups.end()) {
				updated_unexplored_fast_groups.erase(back_it);
				updated_unexplored_fast_groups.insert(mergeIndex);
			}
//			std::cout << "exiting merge_fast_groups...\n";
		}
		
		void create_new_fast_group(std::size_t node_index, std::vector<Groups::GroupNode>& all_nodes) {
//			std::cout << "creating a new fast_group...\n";
			std::size_t newGroupIndex=fast_groups.size();
//			std::cout << "newGroupIndex="<<newGroupIndex<<"\n";
			
			updated_unexplored_fast_groups.insert(newGroupIndex);
			
			Groups::FastGroup mygroup;
			fast_groups.push_back(mygroup);
			fast_groups.back().insert(all_nodes,node_index);
			std::set<std::size_t> empty_set;
			fastGroupLinksToInitialGroupNodes.push_back(empty_set);
			
//			std::cout << "initially, size of fastGroupLinksToInitialGroupNodes["<<newGroupIndex<<"]="<<fastGroupLinksToInitialGroupNodes[newGroupIndex].size()<<"\n";
//			std::cout << "here they are: ";
//			for (std::set<std::size_t>::iterator it=fastGroupLinksToInitialGroupNodes[newGroupIndex].begin(); it!=fastGroupLinksToInitialGroupNodes[newGroupIndex].end(); ++it) {
//				std::cout << *it << " ";
//			}
//			std::cout << "\n";
			
			//update initialGroupNodesLinksToTheseFastGroups and fastGroupLinksToNodes
			//iterate over nodes edges (dependencyGraphLinks)
			for (std::size_t i=0; i!=all_nodes[node_index].dependencyGraphLinks.size(); ++i) {
//				std::cout << "processing dependency graph, node="<< all_nodes[node_index].dependencyGraphLinks[i] <<"\n";
				initialGroupNodesLinksToTheseFastGroups[all_nodes[node_index].dependencyGraphLinks[i]].insert(newGroupIndex);
				fastGroupLinksToInitialGroupNodes[newGroupIndex].insert(all_nodes[node_index].dependencyGraphLinks[i]);
			}
			
//			std::cout << "after inserting elements, size of fastGroupLinksToInitialGroupNodes["<<newGroupIndex<<"]="<<fastGroupLinksToInitialGroupNodes[newGroupIndex].size()<<"\n";
//			
//			std::cout << "after creating new fast group, dependency graph links are: ";
//			for (std::set<std::size_t>::iterator it=fastGroupLinksToInitialGroupNodes[newGroupIndex].begin(); it!=fastGroupLinksToInitialGroupNodes[newGroupIndex].end(); ++it) {
//				std::cout << *it << " ";
//			}
//			std::cout << "\n";

		}//end create_new_fast_group
		
		//this inserts a node into the fast process, traverses the graph of reachable nodes,fast_groups that must be merged into the fast_groups
		//return false if adding node leads to an unstable fast process (ie if updated fast process contains a non-reversible reaction)
//		bool insert_explore(std::size_t node_index, std::vector<Groups::GroupNode>& all_nodes) {
//			std::cout << "in FP::insert_explore...node_index="<<node_index<<"\n";
//
//			if (updated_unexplored_fast_groups.size()!=0) {
//				std::cout << "StochKit ERROR (Groups::FP::insert_explore): updated fast groups not empty on call to insert_explore (bug). Terminating.\n";
//			}
//		
//			//returns false if any fast_group is becomes unstable (in this case, it is unstable if it contains a non-reversible reaction)
//			if (!all_nodes[node_index].reversible) {
//				unstable=true;
//				return false;
//			}
//			
//			
//			
//			//first, see if this node overlaps with an existing fast_group, if not, create a new fast group
//			std::map<std::size_t,std::set<std::size_t> >::iterator it_to_linked_nodes=initialGroupNodesLinksToTheseFastGroups.find(node_index);
//			if (it_to_linked_nodes==initialGroupNodesLinksToTheseFastGroups.end()) {
//				std::cout << "creating a new fast_group...\n";
//				std::size_t newGroupIndex=fast_groups.size();
//				std::cout << "newGroupIndex="<<newGroupIndex<<"\n";
//				
//				updated_unexplored_fast_groups.insert(newGroupIndex);
//				
//				Groups::FastGroup mygroup;
//				fast_groups.push_back(mygroup);
//				fast_groups.back().insert(all_nodes,node_index);
//				fastGroupLinksToInitialGroupNodes.push_back(std::set<std::size_t>());
//				
//				//update initialGroupNodesLinksToTheseFastGroups and fastGroupLinksToNodes
//				//iterate over nodes edges (dependencyGraphLinks)
//				for (std::size_t i=0; i!=all_nodes[node_index].dependencyGraphLinks.size(); ++i) {
//					std::cout << "processing dependency graph, node="<< all_nodes[node_index].dependencyGraphLinks[i] <<"\n";
//					initialGroupNodesLinksToTheseFastGroups[all_nodes[node_index].dependencyGraphLinks[i]].insert(newGroupIndex);
//					fastGroupLinksToInitialGroupNodes[newGroupIndex].insert(all_nodes[node_index].dependencyGraphLinks[i]);
//				}
//				
//				
//			}
//			else {
//				std::cout << "overlaps with (at least) one existing fast_group...\n";
//				std::cout << "in fact, overlaps with "<<it_to_linked_nodes->second.size()<<" fast groups.\n";
//				if (it_to_linked_nodes->second.size()!=1) {
//					std::cout << "overlaps not exactly one, not implemented. terminating.\n";
//					exit(1);
//					
//					//overlaps with multiple, so...
//					//if legal, need to merge fast groups
//					//remember to update the updated_unexplored_fast_groups list
//				}
//				else {
//					std::size_t fast_group_index=*(it_to_linked_nodes->second.begin());
//					std::cout << "IN THE 'OVERLAPS WITH EXISTING FAST GROUP' ELSE STATEMENT...SO OVERLAPS WITH EXACTLY ONE\n";
//					merge(fast_group_index, node_index, all_nodes);
//					updated_unexplored_fast_groups.insert(fast_group_index);
//				}
//			}
//			
//			//--------------------------------------------
//			/*
//				at this point, new node has been inserted and at least one fast group has been updated.
//			
//			*/
//			//--------------------------------------------
//			
//			//we have inserted a node, modifying at least one fast_group
//			std::cout << "we have updated the following fast groups indexes:\n";
//			//this while loop assumes the fast groups have no overlap at this point (though they could through NODES that will be discovered through explore process...)
////			while (!updated_unexplored_fast_groups.empty() && !overlapping_fast_groups.empty()) {
//			while (!updated_unexplored_fast_groups.empty()) {
//				std::set<std::size_t>::iterator it=updated_unexplored_fast_groups.begin();
//				std::cout << "exploring fast group "<< *it << "\n";
//				
//				std::cout << "before going any further, let's look at fastGroupLinksToInitialGroupNodes for fast group "<<*it<<":\n";
//				for (std::set<std::size_t>::iterator test_it=fastGroupLinksToInitialGroupNodes[*it].begin(); test_it!=fastGroupLinksToInitialGroupNodes[*it].end(); ++test_it) {
//					std::cout << "node "<<*test_it<<", ";
//				}
//				std::cout << "\n";
//				
//				//loop over the nodes that are linked to this fast group...
//				std::cout << "this fast group is linked to the following nodes (that are not yet in fast groups):\n";
//				for (std::set<std::size_t>::iterator node_it=fastGroupLinksToInitialGroupNodes[*it].begin(); node_it!=fastGroupLinksToInitialGroupNodes[*it].end(); ++node_it) {
//					std::cout << *node_it << "\n";
//					Groups::FastGroup::mergeableResult mr=fast_groups[*it].mergeable(all_nodes[*node_it]);
//					//possible results: THIS_FASTER, MERGEABLE, OTHER_FASTER, NO_OVERLAP
//					if (mr==Groups::FastGroup::MERGEABLE) {
//						std::cout << "MERGEABLE...\n";
//						std::cout << "not implemented, terminating.\n";
//						exit(1);
//					}
//					else if (mr==Groups::FastGroup::THIS_FASTER) {
//						std::cout << "THIS_FASTER...\n";
//					}
//					else if (mr==Groups::FastGroup::OTHER_FASTER) {
//						std::cout << "OTHER_FASTER...\n";
//						std::cout << "StochKit ERROR (Groups::FP::insert_explore): in insert_explore, found a node that was faster than the fast group. Situation not implemented in this beta version. Terminating.\n";
//						exit(1);
//					}
//					else {
//						std::cout << "NO_OVERLAP...\n";
//						std::cout << "StochKit ERROR (Groups::FP::insert_explore): found NO_OVERLAP between fast group and linked node (bug). Terminating.\n";
//						exit(1);
//					}
//				}
//
//				std::cout << "erasing it from updated_unexplored_fast_groups...might it be possible that it is now invalid due to changes in fast groups?\n";
//				std::cout << "maybe if I have to merge, I have to ...I don't know...need to think about it.\n";
//				updated_unexplored_fast_groups.erase(it);
//			}
//						
//			return true;//if we get here without returning false, resuling FP must be stable.
//		}//insert
		
//		bool merge(std::size_t fast_group_index, std::size_t node_index, std::vector<Groups::GroupNode>& all_nodes) {
		void merge(std::size_t fast_group_index, std::size_t node_index, std::vector<Groups::GroupNode>& all_nodes) {
//			std::cout << "merging fast_group "<<fast_group_index<<" and node "<<node_index<<"...\n";
//			
//			std::cout << "BEFORE merge, dependency graph links are: ";
//			for (std::set<std::size_t>::iterator it=fastGroupLinksToInitialGroupNodes[fast_group_index].begin(); it!=fastGroupLinksToInitialGroupNodes[fast_group_index].end(); ++it) {
//				std::cout << *it << " ";
//			}
//			std::cout << "\n";

			//node should be in initialGroupNodesLinksToTheseFastGroups map
			//enforce that fast_group_index be the ONLY value in value set
			std::map<std::size_t,std::set<std::size_t> >::iterator initialGroupNodeIter=initialGroupNodesLinksToTheseFastGroups.find(node_index);
			if (initialGroupNodeIter!=initialGroupNodesLinksToTheseFastGroups.end()) {
				//now verify that fast_group_index is in the value set, and erase it
				std::set<std::size_t>::iterator value_set_iter=initialGroupNodeIter->second.find(fast_group_index);
				initialGroupNodeIter->second.erase(value_set_iter);
								
				//now verify that the set is empty (for now we are enforcing that can only merge if fast_group_index is the only fast group linked to this node
				if (initialGroupNodeIter->second.size()!=0) {
					std::cout << "StochKit ERROR (Groups::FP::merge): attempt to merge a node that is linked to multiple fast groups, which is not permitted (bug). Terminating.\n";
					exit(1);
				}
			}
			else {
				std::cout << "StochKit ERROR (Groups::FP::merge): attempt to merge fast group and a node that are not connected (bug). Terminating.\n";
				exit(1);
			}
			
			if (!all_nodes[node_index].reversible) {
				//new version assumes it is reversible
				std::cout << "StochKit ERROR (Groups::FP::merge): attempt to insert non-reversible reaction into fast process (bug). Terminating.\n";
				exit(1);
			}
			else {
				fast_groups[fast_group_index].totalFiringFrequency+=all_nodes[node_index].min_freq+all_nodes[node_index].max_freq;
			}
			
			//remove node_index from list of nodes fast_group_index is lined to
			//first, add node_index's dependency graph link nodes to fast_group
			
			//iterate over node_index's (std::vector<std::size_t>) dependencyGraphLinks
//			std::cout << "inserting node "<<node_index<<"'s dependency graph links into fast_group["<<fast_group_index<<"]'s links to nodes.\n";
			for (std::size_t i=0; i!=all_nodes[node_index].dependencyGraphLinks.size(); ++i) {
//				std::cout << "processing dependency graph link node " << all_nodes[node_index].dependencyGraphLinks[i] << "\n";
				
				//insert it into this fast groups's fastGroupLinks set if node is not in this fast group
				//and add fast_group_index to this dependency graph node's initialWhatever
				if (fast_groups[fast_group_index].initialNodesIndexes.count(all_nodes[node_index].dependencyGraphLinks[i])==0) {
//					std::cout << "inserting node "<<all_nodes[node_index].dependencyGraphLinks[i]<<" into fastGroupLinksToInitialGroupNodes[fast_group_index].\n";
					fastGroupLinksToInitialGroupNodes[fast_group_index].insert(all_nodes[node_index].dependencyGraphLinks[i]);
					initialGroupNodesLinksToTheseFastGroups[all_nodes[node_index].dependencyGraphLinks[i]].insert(fast_group_index);
				}
				else {
//					std::cout << "NOT inserting node "<<all_nodes[node_index].dependencyGraphLinks[i]<<" into fastGroupLinksToInitialGroupNodes[fast_group_index].\n";				
				}
			}
//			std::cout << "\n";
						
			//std::vector<std::set<std::size_t> > fastGroupLinksToInitialGroupNodes;//index matches index of fast_groups
			std::set<std::size_t>::iterator linked_node_iter=fastGroupLinksToInitialGroupNodes[fast_group_index].find(node_index);
			if (linked_node_iter!=fastGroupLinksToInitialGroupNodes[fast_group_index].end()) {
				fastGroupLinksToInitialGroupNodes[fast_group_index].erase(linked_node_iter);
			}
			else {
				std::cout << "StochKit ERROR (Groups::FP::merge): attempt to merge a node that does not appear in fast process link set (bug). Terminating.\n";
				exit(1);
			}
			
			fast_groups[fast_group_index].relaxationTime=std::max(fast_groups[fast_group_index].relaxationTime,all_nodes[node_index].relaxationTime);
			fast_groups[fast_group_index].initialNodesIndexes.insert(node_index);
			//iterate over species, insert into speciesFreqMap or update if already in
			for (std::set<std::size_t>::iterator my_it=all_nodes[node_index].species_indexes.begin(); my_it!=all_nodes[node_index].species_indexes.end(); ++my_it) {
				std::map<std::size_t, std::pair<double,double> >::iterator speciesFreqMapIt=fast_groups[fast_group_index].speciesFreqMap.find(*my_it);
				if (speciesFreqMapIt==fast_groups[fast_group_index].speciesFreqMap.end()) {
					fast_groups[fast_group_index].speciesFreqMap.insert( std::pair<std::size_t, std::pair<double,double> >(*my_it, std::make_pair(all_nodes[node_index].min_freq,all_nodes[node_index].max_freq)));
				}
				else {
					//species is already in the map, just update the min/max freq values
					speciesFreqMapIt->second.first=std::min(speciesFreqMapIt->second.first,all_nodes[node_index].min_freq);
					speciesFreqMapIt->second.second=std::max(speciesFreqMapIt->second.second,all_nodes[node_index].max_freq);
				}
			}

			fast_groups[fast_group_index].numberOfFastReactions+=all_nodes[node_index].reaction_indexes.size();

			fast_groups[fast_group_index].fastReactionIndexes.insert(all_nodes[node_index].reaction_indexes.begin(),all_nodes[node_index].reaction_indexes.end());

			if (fast_groups[fast_group_index].numberOfFastReactions!=fast_groups[fast_group_index].fastReactionIndexes.size()) {
				std::cout << "StochKit ERROR (Groups::FastGroup::insert): numberOfFastReactions does not equal fastReactionIndexes.size(). (Bug) Terminating.\n";
				exit(1);
			}
			

			fast_groups[fast_group_index].rankUpdated=false;

//			std::cout << "after merge, dependency graph links are: ";
//			for (std::set<std::size_t>::iterator it=fastGroupLinksToInitialGroupNodes[fast_group_index].begin(); it!=fastGroupLinksToInitialGroupNodes[fast_group_index].end(); ++it) {
//				std::cout << *it << " ";
//			}
//			std::cout << "\n";

		}//end merge
		
		double estimate_equilibrium_sim_time(std::vector<Groups::GroupNode>& all_nodes, std::vector<ElementaryReaction>& model) {
			//estimate the elapsed time that will be spent evaluating equilibrium calls

			if (updated_unexplored_fast_groups.size()!=0) {
				std::cout << "StochKit ERROR (Groups::FP::estimate_equilibrium_sim_time): attempt to estimate simulation time for incomplete fast process (bug). Terminating.\n";
				exit(1);
			}
			
			double est=0;
			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
				//first, find out how many calls to equilibrium for group i we expect
				//to get this number, count frequency of all adjacent reactions
				//std::vector<std::set<std::size_t> > fastGroupLinksToInitialGroupNodes
				double callsToThisGroup=0.0;
								
				
				for (std::set<std::size_t>::iterator linked_nodes_it=fastGroupLinksToInitialGroupNodes[i].begin(); linked_nodes_it!=fastGroupLinksToInitialGroupNodes[i].end(); ++linked_nodes_it) {

					//get stoichiometry of one reaction...
					sparse_vec stoich_row=model[all_nodes[*linked_nodes_it].reaction_indexes[0]].getStoichiometry();
					bool has_nonzero_stoich_overlap=false;
					for (sparse_vec::iterator it=stoich_row.begin(); it!=stoich_row.end(); ++it) {
						if (*(it)!=0) {
							//std::map<std::size_t, std::pair<double,double> > speciesFreqMap
							if (fast_groups[i].speciesFreqMap.find(   it.index() )!=fast_groups[i].speciesFreqMap.end() ) {
								has_nonzero_stoich_overlap=true;
								break;
							}
						}
					}

					if (has_nonzero_stoich_overlap) {
						if (!all_nodes[*linked_nodes_it].reversible) {
							callsToThisGroup+=all_nodes[*linked_nodes_it].max_freq;//if reversible, add only min or max freq (both would be double counting since only one reaction in group)
//							std::cout << "adding "<<all_nodes[*linked_nodes_it].max_freq<< " to callsToThisGroup for reaction "<<all_nodes[*linked_nodes_it].reaction_indexes[0]<<"\n";
						}
						else {
							callsToThisGroup+=all_nodes[*linked_nodes_it].min_freq+all_nodes[*linked_nodes_it].max_freq;
//							std::cout << "adding "<<all_nodes[*linked_nodes_it].min_freq<<" and "<<all_nodes[*linked_nodes_it].max_freq<< " to callsToThisGroup for reactions "<<all_nodes[*linked_nodes_it].reaction_indexes[0]<<", "<<all_nodes[*linked_nodes_it].reaction_indexes[1]<<"\n";						
						}
					}
					
				}
//				std::cout << "we expect "<<callsToThisGroup<<" equilibrium calls for fast group index "<<i<<"\n";
				//now that we have calls to this group, use formula to compute cost of equilibrium calls to this group
				std::size_t independentSpecies=fast_groups[i].compute_rank(all_nodes, model);
				double y=0.15*(double)independentSpecies*(double)independentSpecies-0.044*(double)independentSpecies+1.1;//time per call in 1*10^-6 seconds
				double costForThisSubset=(double)callsToThisGroup*y*pow(10,-6);
//				std::cout << "estimated cost of equilibrium calls for this subset="<<costForThisSubset<<"\n";
				est+=costForThisSubset;
			}
			return est;
		}
		
		void print_fp_list() {
			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
				std::cout << "group "<<i<<": ";
				//std::set<std::size_t> fastReactionIndexes
				for (std::set<std::size_t>::iterator it=fast_groups[i].fastReactionIndexes.begin(); it!=fast_groups[i].fastReactionIndexes.end(); ++it) {
					std::cout << *it << "\t";
				}
				std::cout << "\n\tdepends on nodes: ";
				for (std::set<std::size_t>::iterator it2=fastGroupLinksToInitialGroupNodes[i].begin(); it2!=fastGroupLinksToInitialGroupNodes[i].end(); ++it2) {
					std::cout << *it2 << "\t";
				}
				std::cout << "\n";
			}
		}
		
		std::set<std::size_t> get_fast_reactions() {
			std::set<std::size_t> all_fast_reactions;
			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
				all_fast_reactions.insert(fast_groups[i].fastReactionIndexes.begin(),fast_groups[i].fastReactionIndexes.end());
			}
			
			return all_fast_reactions;
		}
		
		bool containsNode(std::size_t node_index) {
//			std::cout << "in FP.containsNode("<<node_index<<"). FP contains the following NODES:\n";
//			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
//				for (std::set<std::size_t>::iterator it=fast_groups[i].initialNodesIndexes.begin(); it!=fast_groups[i].initialNodesIndexes.end(); ++it) {
//					std::cout << *it << "\t";
//				}
//			}
//			std::cout << "\n";
			for (std::size_t i=0; i!=fast_groups.size(); ++i) {
				if (fast_groups[i].initialNodesIndexes.count(node_index)!=0) {
//					std::cout << "CONTAINS NODE INDEX "<<node_index<<"\n";
					return true;
				}
			}
//			std::cout << "DOES NOT CONTAIN NODE INDEX "<<node_index<<"\n";			
			return false;//if we made it, reaction is not in this FP
		}
	};//struct FP
	
	FP currentFP;
	FP provisionalFP;//new
	
	int	get_fastest_slow_stable_node(FP& fast_process, std::multimap<double,std::size_t>& freq_node_map, std::vector<Groups::GroupNode>& all_nodes);
	
	double calculateSimulationTime(FP& partition, std::vector<ElementaryReaction>& model);
	
	std::size_t totalReactionsChannelsInFullModel;
	double totalFiringFreqs;//updated each time update is called
	void update(dense_vec& population, std::vector<double>& firing_freqs,double sample_time);
	void petriNetAnalysis(std::vector< std::vector<std::pair<std::vector<std::pair<std::size_t, std::size_t> >, std::vector<std::size_t> > > >& output);
	
	void partition(std::vector<ElementaryReaction>& model, double max_fast_relaxation_time);
	
	static bool nodes_overlap(Groups::GroupNode n1, Groups::GroupNode n2) {
		//iterate over group's species map and node's species set. return true if any overlapping species, else return false
		std::set<std::size_t>::iterator it1=n1.species_indexes.begin();
		std::set<std::size_t>::iterator it2=n2.species_indexes.begin();
		while (it1!=n1.species_indexes.end() && it2!=n2.species_indexes.end()) {
			if (*it1 < *it2) ++it1;
			else if (*it2 < *it1) ++it2;
			else return true;
		}
		return false;
	}
public:
	double cumulative_partition_elapsed_time;//for development, see how long partition function is taking
	double sampleTime;
};

#endif
