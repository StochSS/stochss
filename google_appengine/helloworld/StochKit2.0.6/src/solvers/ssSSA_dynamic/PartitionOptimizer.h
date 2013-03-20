 /*
	a helper class for SlowScaleSSA and Groups
	provides info on the effectiveness of the various VFPs
	
	for example, will detect if the initial partition (t=0) leads to a quick timescale violation
	
	other functionality: detect if initial partition (based on presimulation data) is different from
		the initial partition that would have been used if the firing frequencies had been estimated using ffe
		
	in the future, would like it to do more complex analysis of partitions
		one example, could be recommending simulation time for ode solver in ffe
		another could be detecting scenarios (e.g. populations) where certain partitions are not good
 */

#ifndef _PARTITION_OPTIMIZER_H_
#define _PARTITION_OPTIMIZER_H_

#include <iostream>
#include <vector>
#include <fstream>
#include <cmath>
#include <cstdlib>

class PartitionOptimizer {
  public:
	PartitionOptimizer();
	
	void print_partition_data();
	
	void set_original_initial_partition(std::vector<std::size_t>& orig_partition);
	void set_alternate_initial_partition(std::vector<std::size_t>& alt_partition);
	
	void record_partition_data(double simulation_time, std::size_t realization, std::vector<std::size_t>& fast_reactions, std::size_t slowReactionCount, bool accuracyViolation);
	
	//returns set of fast reactions to use.
	std::vector<std::size_t> select_initial_partition(double simulation_time, std::size_t slowReactionCount);
	
	void serialize(std::string filename);
	void unserialize(std::string filename);

	//pardon the non-object-oriented form...
	double presim_original_estimate;//simulation time estimate based on presimulation data and original partition
	double presim_alt_estimate;//simulation time estimate based on presimulation data and alternate partition
	double ffe_original_estimate;//simulation time estimate based on forward reaction frequency estimate and original partition
	double ffe_alt_estimate;//simulation time estimate based on forward reaction frequency estimate and original partition
	
//	private:
	//
	std::vector<std::size_t> original_initial_partition;
	bool have_alt_partition;
	std::vector<std::size_t> alternate_initial_partition;
	
	bool previous_record_partition_data_was_t0;
	
	int calls_to_select_initial_partition;
	bool original_faster;
	bool original_has_fast_accuracy_violation;
	bool alt_has_fast_accuracy_violation;
	
	bool has_permanent_initial;//true if we have decided to use one initial fast process for all remaining realizations (will be true if have_alt_partition is false)
	std::vector<std::size_t> permanent_initial;
	
	std::vector<bool> used_alt_initial;//true if used alternate initial for realization i; will be size 6 since will use at most 6 realizations to choose a permanent
	struct ChangeRecord {
		ChangeRecord() : simulation_time(0), realization(0), number_slow_reactions_fired(0), new_partition(0), accuracyViolation(false)// changeReason(UNKNOWN)
		{}
		
		//keep track of info related to partition selected after initial partition
		double simulation_time;
		std::size_t realization;
		std::size_t number_slow_reactions_fired;
		std::vector<std::size_t> new_partition;//list of fast reactions after the partition (could be same as initial)
//		enum ChangeReason { UNKNOWN, SLOW_REACTION_LIMIT, ACCURACY_VIOLATION };
//		ChangeReason changeReason;
		bool accuracyViolation;
	};
	std::vector<ChangeRecord> changeRecords;
	
	void determine_permanent_initial(double simulation_time, std::size_t slowReactionCount);
};

#endif
