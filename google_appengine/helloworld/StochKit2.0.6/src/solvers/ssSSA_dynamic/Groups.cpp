 #include "Groups.h"

Groups::Groups(std::vector<ElementaryReaction>& model) {

	totalReactionsChannelsInFullModel=model.size();
	
	std::vector<bool> indexIsNonreversible(model.size(),true);//set these to false as we find reversible pairs
	
	//find reversible pairs
	for (std::size_t i=0; i<model.size(); ++i) {
		for (std::size_t j=i+1; j!=model.size(); ++j) {
//			std::cout << "comparing rxn "<<i<<" and "<<j<<"\n";
			if (ReversiblePair::isReversiblePairByStoichiometry(model[i],model[j])) {
//				std::cout << "reactions "<<i<<" and "<<j<<" are reversible pairs...\n";
				indexIsNonreversible[i]=false;
				indexIsNonreversible[j]=false;
				initialGroupNodes.push_back(Groups::GroupNode(std::pair<std::size_t,std::size_t>(i,j), model));
			}
		}
	}
	for (std::size_t i=0; i!=indexIsNonreversible.size(); ++i) {
		if (indexIsNonreversible[i]) {
			initialGroupNodes.push_back(Groups::GroupNode(i,model));
		}
	}
	
	//build graph...
	graph.nodes=initialGroupNodes;
	for (std::size_t i=0; i<initialGroupNodes.size(); ++i) {
		for (std::size_t j=i+1; j!=initialGroupNodes.size(); ++j) {
			if (Groups::nodes_overlap(initialGroupNodes[i], initialGroupNodes[j])) {
				graph.nodes[i].dependencyGraphLinks.push_back(j);
				initialGroupNodes[i].dependencyGraphLinks.push_back(j);
				graph.nodes[j].dependencyGraphLinks.push_back(i);
				initialGroupNodes[j].dependencyGraphLinks.push_back(i);
			}
		}
	}
	
//	std::cout << "in Groups constructor, display initial group nodes...\n";
//	for (std::size_t i=0; i!=graph.nodes.size(); ++i) {
//		std::cout << "node "<<i<<": ";
//		graph.nodes[i].display();
//	}
cumulative_partition_elapsed_time=0.0;
}//end Groups::Groups(std::vector<ElementaryReaction>& model)

void Groups::update(dense_vec& population, std::vector<double>& firing_freqs, double sample_time) {
	for (std::size_t i=0; i!=initialGroupNodes.size(); ++i) {
//		std::cout << "updating node "<<i<<"\n";
		initialGroupNodes[i].updateData(population,firing_freqs, sample_time);
		graph.nodes[i].updateData(population,firing_freqs, sample_time);
	}
	totalFiringFreqs=std::accumulate(firing_freqs.begin(),firing_freqs.end(),0.0);
	sampleTime=sample_time;
}//end Groups::update

void Groups::petriNetAnalysis(std::vector< std::vector<std::pair<std::vector<std::pair<std::size_t, std::size_t> >, std::vector<std::size_t> > > >& output)
{
	std::size_t NumberOfReactions=graph.nodes.size();
	std::queue<std::size_t> currentFastGroup;
	std::vector<std::size_t> reactionMark(NumberOfReactions);
	std::vector<std::pair<double, std::size_t> > reactionArray;
	//	std::vector<std::pair<double, std::size_t>* > reactionArrayPointer(NumberOfReactions);
	std::vector<std::vector<std::size_t> > fastGroupLinks; // shows only the faster groups that affect this group
	
	std::vector<std::size_t> emptyFastGroupLinks; // shows only the faster groups that affect this group
	
	std::vector<std::size_t> reactionCounts(NumberOfReactions);
	for(std::size_t i=0; i<NumberOfReactions; ++i) {
		reactionCounts[i]=graph.nodes[i].max_freq;
//		std::cout << "reactionCounts["<<i<<"]="<<reactionCounts[i]<<"\n";
		reactionArray.push_back(std::make_pair((double)reactionCounts[i], i));
	}
	sort(reactionArray.rbegin(),reactionArray.rend());
	
	//	for(std::size_t i=0; i<reactionArray.size(); ++i){
	//		reactionArrayPointer[reactionArray[i].second] = &reactionArray[i];
	//	}
	/*
	 for(std::size_t i=0; i<reactionArray.size(); ++i){
		 std::cout << reactionArray[i].first << " " <<  reactionArray[i].second << std::endl;
	 }
	 */
	std::size_t currentLeadReaction=0;
	std::size_t currentFastGroupNumber = 1;
	std::size_t currentReaction=0;
	std::size_t adjacentReaction=0;
	
	fastGroupLinks.push_back(emptyFastGroupLinks); // extra empty "0"-th fast group, just to make the other ids match
	
	while(currentLeadReaction < NumberOfReactions){
		// find the true id of the current lead reaction
		currentReaction = reactionArray[currentLeadReaction].second;
		
		// if the current lead reaction is unmarked, then find the fast group associated with the reaction
		if(reactionMark[currentReaction] == 0){
			//			std::cout << "fast group " << currentFastGroupNumber << " begin" << std::endl;
			fastGroupLinks.push_back(emptyFastGroupLinks); // new fast group
			
			// breath-first search of connected reactions with similar reaction rate
			// reactions with similar reaction rate: [current reaction rate/10, current reaction rate * 10]
			currentFastGroup.push(currentReaction);
			reactionMark[currentReaction] = currentFastGroupNumber;
			
			while(!currentFastGroup.empty()){
				currentReaction = currentFastGroup.front();
				//				std::cout << "current reaction: " << currentReaction << std::endl;
				
				// find adjacent reactions with similar reaction rate
				// reactions with similar reaction rate: [current reaction rate/10, current reaction rate * 10]
				for(std::size_t i=0; i<graph.nodes[currentReaction].dependencyGraphLinks.size(); ++i){
					adjacentReaction = graph.nodes[currentReaction].dependencyGraphLinks[i];
					
					if(adjacentReaction != currentReaction){
						if(reactionCounts[currentReaction] < MINIMUMFIRINGS){
							// both fires less than minimum firings 
							if(reactionCounts[adjacentReaction] < MINIMUMFIRINGS){
								// adjacent reaction unmarked, mark it and push into the queue
								// if it's marked already, no need to do anything, must be marked this round
								if(reactionMark[adjacentReaction] == 0){
									reactionMark[adjacentReaction] = currentFastGroupNumber;
									currentFastGroup.push(adjacentReaction);
								} else if(reactionMark[adjacentReaction] != currentFastGroupNumber){
									std::cerr << "StochKit ERROR (petriNetAnalysis): adjacent reaction " << adjacentReaction << " and " << currentReaction << " with very small reaction rate but in different group. Impossible! (bug) Terminating." << std::endl;
									exit(1);
								}
							} else {
								// current reaction count is less than minimum firings, adjacent reaction count is larger than
								// minimum firings,
								// adjacent reaction must have been marked, link current fast group to that fast group
								if(reactionMark[adjacentReaction] != 0){
									STOCHKIT::insertToSortedArray<std::vector<std::size_t>, std::size_t> (fastGroupLinks[currentFastGroupNumber], reactionMark[adjacentReaction]);
								} else {
									std::cerr << "StochKit ERROR (petriNetAnalysis): reaction " << adjacentReaction << " unmarked while adjacent reaction " << currentReaction << " with very small reaction rate marked. Impossible! (bug) Terminating." << std::endl;
									exit(1);
								}
							}
						} else {
							// current reaction count is larger than minimum firings
							// if adjacent reaction count is less than minimum firings, don't mark the adjacent reaction
							// only do something if the adjacent reaction count is larger than minimum firings
							if(reactionCounts[adjacentReaction] >= MINIMUMFIRINGS ){
								// adjacent reaction is slower
								if(reactionCounts[currentReaction] >= reactionCounts[adjacentReaction]){
									// the speed of adjacent reaction is close to current reaction
									if (graph.nodes[currentReaction].mergeable(graph.nodes[adjacentReaction])==Groups::GroupNode::MERGEABLE) {
										if(reactionMark[adjacentReaction] == 0){
											reactionMark[adjacentReaction] = currentFastGroupNumber;
											currentFastGroup.push(adjacentReaction);
										} else if(reactionMark[adjacentReaction] != currentFastGroupNumber){
											std::cerr << "StochKit ERROR (petriNetAnalysis): adjacent reaction " << adjacentReaction << " and " << currentReaction << " with similar reaction rate but in different group. Impossible! (bug) Terminating." << std::endl;
											exit(1);
										}
									} else{
										// the speed of adjacent reaction is much slower
										// if it's already marked, link that group to this group
										// if it's not marked yet, don't do anything
										if(reactionMark[adjacentReaction] != 0 && reactionMark[adjacentReaction] != currentFastGroupNumber){
											STOCHKIT::insertToSortedArray<std::vector<std::size_t>, std::size_t> (fastGroupLinks[reactionMark[adjacentReaction]], currentFastGroupNumber);
										}
									}
								} else{
									//adjacent reaction is faster
									// the speed of adjacent reaction is close to current reaction
									if (graph.nodes[currentReaction].mergeable(graph.nodes[adjacentReaction])==Groups::GroupNode::MERGEABLE) {
										if(reactionMark[adjacentReaction] == 0){
											reactionMark[adjacentReaction] = currentFastGroupNumber;
											currentFastGroup.push(adjacentReaction);
										} else if(reactionMark[adjacentReaction] != currentFastGroupNumber){
											std::cerr << "StochKit ERROR (petriNetAnalysis): adjacent reaction " << adjacentReaction << " and " << currentReaction << " with similar reaction rate but in different group. Impossible! (bug) Terminating." << std::endl;
											exit(1);
										}
									} else{
										// the speed of current reaction is much slower
										// if it's already marked, link this group to that group
										// if it's not marked yet, don't do anything
										if(reactionMark[adjacentReaction] != 0 && reactionMark[adjacentReaction] != currentFastGroupNumber){
											STOCHKIT::insertToSortedArray<std::vector<std::size_t>, std::size_t> (fastGroupLinks[currentFastGroupNumber], reactionMark[adjacentReaction]);
										}
									}
								}
							}
						}
					}
				}
				
				currentFastGroup.pop();
			}
			
			//			std::cout << "fast group " << currentFastGroupNumber << " done" << std::endl;
			++currentFastGroupNumber;
			++currentLeadReaction;
		} else{
			++currentLeadReaction;
		}
	}
	
	// all marked, output
	std::vector<std::pair<std::size_t, std::size_t> > currentOutputFastGroup;
	std::vector<std::pair<std::vector<std::pair<std::size_t,std::size_t> >, std::vector<std::size_t> > > currentAllFastGroups;
	
	std::size_t currentOutputFastGroupNumber = 1;
	std::size_t currentGroupReactionCounts = 0;
	
	// currentFastGroupNumber == totalFastGroupNumber + 1
	while(currentOutputFastGroupNumber < currentFastGroupNumber){
		currentOutputFastGroup.clear();
		currentGroupReactionCounts = 0;
		
		for(std::size_t i=0; i<NumberOfReactions; ++i){
			if(reactionMark[reactionArray[i].second] == currentOutputFastGroupNumber){
				currentOutputFastGroup.push_back(std::make_pair(reactionArray[i].second, reactionCounts[reactionArray[i].second]));
				currentGroupReactionCounts += reactionCounts[reactionArray[i].second];
			}
		}
		
		currentOutputFastGroup.push_back(std::make_pair(NumberOfReactions,currentGroupReactionCounts));
		
		currentAllFastGroups.push_back(std::make_pair(currentOutputFastGroup, fastGroupLinks[currentOutputFastGroupNumber]));
		
		++currentOutputFastGroupNumber;
	}
	
	output.push_back(currentAllFastGroups);
}

int Groups::get_fastest_slow_stable_node(FP& fast_process, std::multimap<double,std::size_t>& freq_node_map, std::vector<Groups::GroupNode>& all_nodes) {
	//return fastest stable node that is not in fast_process
	//-1 indicates not found (e.g. if all stable nodes are in the fast process)
	
	int found_node=-1;
	
	//iterate over multimap starting from fastest reaction (ie. reverse iterate over freqs (keys))
	std::multimap<double,std::size_t>::reverse_iterator rit=freq_node_map.rbegin();

	//stop when found fastest
	while (rit!=freq_node_map.rend() && found_node==-1) {
		
		std::size_t node_index=rit->second;
		double node_freq=rit->first;
		
		//see if this node is in the fast process
		if (!fast_process.containsNode(node_index)) {
			//if we made it here, we are looking at a "slow" node
			
			if (all_nodes[node_index].reversible) {
				//if we made it here, we are looking at a node that is slow and stable (ie a reversible pair)
				if (found_node==-1) {
					found_node=node_index;
				}
			}
		}
		
		++rit;
	}
	
	return found_node;
}

void Groups::partition(std::vector<ElementaryReaction>& model, double max_fast_relaxation_time) {
	timeval timer0;
	gettimeofday(&timer0,NULL);
	double partition_start=timer0.tv_sec+(timer0.tv_usec/1000000.0);

//	std::cout << "in new Groups::partition...\n";
	currentFP.clear();
	provisionalFP.clear();
	
//	std::cout << "first, sort initialGroupNodes by reaction frequency...\n";
	//use a multimap with reaction frequency as KEY, index into initialGroupNodes as VALUE, then reverse iterate over it
	std::multimap<double,std::size_t> mymultimap;
	std::multimap<double,std::size_t>::reverse_iterator rit;
	//loop over initialGroupNodes, enter into multimap
	
	int fastest_unstable_node=-1;
	double fastest_unstable_node_freq=0;
	
//	std::cout << "initialGroupNodes.size()="<<initialGroupNodes.size()<<"\n";
	for (std::size_t i=0; i!=initialGroupNodes.size(); ++i) {
		if (initialGroupNodes[i].reversible) {
			double totalFreq=initialGroupNodes[i].min_freq+initialGroupNodes[i].max_freq;
//			std::cout << "inserting totalFreq="<<totalFreq<<" for node index "<<i<<"\n";
			mymultimap.insert (std::pair<double,std::size_t>(  totalFreq ,i));
		}
		else {
			double totalFreq=initialGroupNodes[i].max_freq;//max_freq and min_freq should be equal since only one reaction since not reversible
//			std::cout << "inserting totalFreq="<<totalFreq<<" for node index "<<i<<"\n";
			mymultimap.insert (std::pair<double,std::size_t>( totalFreq  ,i));
			if (totalFreq>fastest_unstable_node_freq) {
				fastest_unstable_node=i;
				fastest_unstable_node_freq=totalFreq;
			}
		}
	}
	
	
	double best_simulation_time=calculateSimulationTime(currentFP, model);
//	std::cout << "before partitioning, estimate of simulation time would be:"<<best_simulation_time<<"\n";;
	
	
	//iterate over initialGroupNodes, in descending order of total reaction frequency
	rit=mymultimap.rbegin();
	while (rit!=mymultimap.rend()) {
		//currentFP is best (fastest) candidate fast process we have so far
		//we will create a provisional fast process (provisionalFP) by considering next node from initialGroupNodes

		//first, copy currentFP to provisionalFP
		provisionalFP=currentFP;
	
		//now add next initialGroupNode to provisionalFP
		
		std::size_t node_index=rit->second;
//		std::cout << "about to try to insert node index "<<node_index<<" (total freq="<<rit->first<<") display: ";
//		initialGroupNodes[node_index].display();
		
		//groups are ordered by reaction frequency, if the group we are looking at is slow, stop.
		//define slow: if fastest reaction in group fires at rate less than 1/(simulation end time/50) 
//		std::cout << "for reference, this group's max_freq is "<<initialGroupNodes[node_index].max_freq<<"...\n";
//		std::cout << "that equates to a rate of "<<initialGroupNodes[node_index].max_freq/initialGroupNodes[node_index].sampleTime<<"...\n";

		if (initialGroupNodes[node_index].max_freq/initialGroupNodes[node_index].sampleTime*max_fast_relaxation_time<1.0) {
//			std::cout << "don't look any further because we're already looking at very slow reactions.\n";
			break;
		}
		
		if (!currentFP.containsNode(node_index)) {//don't try adding this node if it is already in the current fast process.
			bool insert_result=provisionalFP.insert_explore2(node_index,initialGroupNodes);
			
			if (insert_result) {
//				std::cout << "insert resulted in a stable partitioning...see if it is usable and better than previous...\n";
//				std::cout << "first, print provisional fast process: \n";
//				provisionalFP.print_fp_list();
				double this_simulation_time=calculateSimulationTime(provisionalFP, model);
//				std::cout << "estimate provisional FP simulation time to be "<<this_simulation_time<<"...\n";

				int fastest_slow_stable_node=get_fastest_slow_stable_node(provisionalFP, mymultimap, initialGroupNodes);
//				std::cout << "fastest unstable node: "<<fastest_unstable_node<<" (freq="<<fastest_unstable_node_freq<<")\n";
//				std::cout << "fastest stable node: "<<fastest_slow_stable_node<<" (freq="<<initialGroupNodes[fastest_slow_stable_node].min_freq+initialGroupNodes[fastest_slow_stable_node].max_freq<<")\n";
//
//				std::cout << "provisional relaxation time="<<provisionalFP.getRelaxationTime()<<"\n";
				
				//select new partitioning if simulation time is faster
				//and certain criteria are met: at least one slow reaction, ...what else?
				if (this_simulation_time<(0.9*best_simulation_time) && provisionalFP.getRelaxationTime()<max_fast_relaxation_time && provisionalFP.getTotalFastReactionChannels()<model.size()) {
//					std::cout << "new partition is better!\n";
					best_simulation_time=this_simulation_time;
					currentFP=provisionalFP;
				}
				else {
//					std::cout << "old partition is better...\n";
//					if (!(this_simulation_time<(0.9*best_simulation_time))) {
//						std::cout << "new simulation time not significantly faster.\n";
//					}
//					if (!(provisionalFP.getRelaxationTime()<max_fast_relaxation_time)) {
//						std::cout << "new relaxation time not sufficiently fast ("<<provisionalFP.getRelaxationTime()<<" vs max allowable of "<<max_fast_relaxation_time<<").\n";
//					}
//					if (!(provisionalFP.getTotalFastReactionChannels()<model.size())) {
//						std::cout << "new partition has no slow reaction channels.\n";
//					}
				}
			}
			else {
//				std::cout << "insert resulted in unstable partitioning, would do nothing here.\n";
			}
		}
		
//		std::cout << "\nAFTER EXPLORING ADDING NODE_INDEX="<<node_index<<", BEST PARTITION SO FAR IS:\n";
//		currentFP.print_fp_list();
//		std::cout << "\n";
		
		++rit;
	}

//	std::cout << "exiting Groups::partition...\n";
	gettimeofday(&timer0,NULL);
	double partition_end=timer0.tv_sec+(timer0.tv_usec/1000000.0);
	cumulative_partition_elapsed_time+=(partition_end-partition_start);

}

double Groups::calculateSimulationTime(FP& partition, std::vector<ElementaryReaction>& model) {
	//provides an estimate of the simulation time based on the data that was used to create the partition
	//typically, this data is a presimulation or a "forward frequency estimate" using a very crude ODE solver
	//it generally is not an ensemble estimate and may not be a full realization estimate (if presim time or ffe time is less than the full simulation time)
	
//	std::cout << "calculating simulation time for partition...\n";

	double slowReactionChannels=(double)model.size()-partition.getTotalFastReactionChannels();
//	std::cout << "number of slow reaction channels = "<<slowReactionChannels<<"\n";
	
//	double y=0.043*totalReactionsChannelsInFullModel+4.5;//see kevin's notes on how this was fit
	double y=0.043*slowReactionChannels+4.5;//see kevin's notes on how this was fit
	//y is 1*10^-7 seconds per slow reaction step
	
	//find number of slow reaction in presim
	double slowReactionFirings=totalFiringFreqs;
	
//	std::cout << "total firings (before subtracting fast): "<<slowReactionFirings<<"\n";
	
	//now subtract fast reactions
	for (std::size_t i=0; i!=partition.fast_groups.size(); ++i) {
		slowReactionFirings-=partition.fast_groups[i].totalFiringFrequency;
//		std::cout << std::setprecision(12) << "subtracting " << partition.fast_groups[i].totalFiringFrequency<<"\n";
		//		std::set<std::size_t> fastReactionIndexes;
//		std::cout << "\t above is for reactions ";
//		for (std::set<std::size_t>::iterator it=partition.fast_groups[i].fastReactionIndexes.begin(); it!=partition.fast_groups[i].fastReactionIndexes.end(); ++it) {
//			std::cout << *it << " ";
//		}
//		std::cout << "\n";
	}
	

	double presimElapsedTimeEstimate=y*(double)slowReactionFirings;//same units as y, multiplied by number of SLOW reactions
	double slowReactionCost=presimElapsedTimeEstimate*pow(10,-7);//units is seconds
	
//	std::cout << "slow reaction frequency total="<<slowReactionFirings<<"\n";
//	std::cout << "time for firing slow reactions estimated to be "<<slowReactionCost<<"\n";
	
	double equilibriumCallCost=0.0;
	//now add cost of fast process equilibrium calls
	equilibriumCallCost+=partition.estimate_equilibrium_sim_time(initialGroupNodes, model);
	
//	std::cout << "equilibriumCallCost="<<equilibriumCallCost<<"\n";
	
//	return (double)realizations*slowReactionCost;
//	std::cout << "returning "<<(slowReactionCost+equilibriumCallCost)<<"\n";
	return (slowReactionCost+equilibriumCallCost);
}

