#include "PartitionOptimizer.h"

PartitionOptimizer::PartitionOptimizer() :
	presim_original_estimate(0), presim_alt_estimate(0), ffe_original_estimate(0), ffe_alt_estimate(0), original_initial_partition(0), have_alt_partition(false), alternate_initial_partition(0), previous_record_partition_data_was_t0(false), 
	calls_to_select_initial_partition(-1), original_faster(false), original_has_fast_accuracy_violation(false), alt_has_fast_accuracy_violation(false),
	has_permanent_initial(false), permanent_initial(0), used_alt_initial(6,false), changeRecords(0)
{}

void PartitionOptimizer::print_partition_data() {
	std::cout << "in PartitionOptimizer::print_partition_data...printing partition summary data:\n";

	std::cout << "Original initial partition: ";
	for (std::size_t i=0; i!=original_initial_partition.size(); ++i) {
		std::cout << original_initial_partition[i] << " ";
	}
	std::cout << "\n";
	
	if (!have_alt_partition) {
		std::cout << "No alternate initial partition.\n";
	}
	else {
		std::cout << "Alternate initial partition (# of reactions="<<alternate_initial_partition.size()<<"): ";
		for (std::size_t i=0; i!=alternate_initial_partition.size(); ++i) {
			std::cout << alternate_initial_partition[i] << " ";
		}
		std::cout << "\n";
		std::cout << "Called initial partition optimizer "<<calls_to_select_initial_partition<<" times.\n";
		if (calls_to_select_initial_partition>0) {
			std::cout << "Results for the first "<<std::min(calls_to_select_initial_partition,(int)6)<<" calls to initial partition optimizer:\n";
			for (std::size_t i=0; i!=(std::size_t)std::min(calls_to_select_initial_partition,(int)6); ++i) {
				std::cout << "realization "<<i<<" "<<( (used_alt_initial[i]) ? "used alternate" : "used original")<<" initial partition.\n";
			}
		}
		
		std::cout << "Initial partition comparison not implemented.\n";
	}
	
	std::cout << "Partition change records:\n";
	for (std::size_t i=0; i!=changeRecords.size(); ++i) {
		std::cout << i << ": ";
		std::cout << changeRecords[i].realization << ", " << changeRecords[i].simulation_time << ", "<<changeRecords[i].number_slow_reactions_fired << ", "<< (changeRecords[i].accuracyViolation ? "true":"false") <<", ";
		for (std::size_t j=0; j!=changeRecords[i].new_partition.size(); ++j) {
			std::cout << changeRecords[i].new_partition[j] << " ";
		}
		std::cout << "\n";
	}
	
	std::cout << "print_partition_data finished.\n";
}

void PartitionOptimizer::set_original_initial_partition(std::vector<std::size_t>& orig_partition) {
	original_initial_partition=orig_partition;
}

void PartitionOptimizer::set_alternate_initial_partition(std::vector<std::size_t>& alt_partition) {
	have_alt_partition=true;
	alternate_initial_partition=alt_partition;
}

void PartitionOptimizer::record_partition_data(double simulation_time, std::size_t realization, std::vector<std::size_t>& fast_reactions, std::size_t slowReactionCount, bool accuracyViolation) {
//	std::cout << "Recording partition data...(slowReactionCount="<<slowReactionCount<<")\n";

	if (!have_alt_partition || has_permanent_initial) return;//do nothing if there's no alternate initial partition or we've already decided which to use
	//in the future, we can eliminate the above statement and use the data to refine partitions during the ensembles, not just the initial partition

//	if (previous_record_partition_data_was_t0) {
//		//this is first new partition since beginning of the realization
//		if (simulation_time==0) {
////			std::cout << "Previous partition was used for entire previous realization.\n";
//		}
//		else {
//			//we are in the middle of a realization and considering changing
////			std::cout << "Recording within a realization.\n";
//		}
//	}

	ChangeRecord icr;

	icr.simulation_time=simulation_time;
	icr.realization=realization;
	icr.number_slow_reactions_fired=slowReactionCount;
	icr.new_partition=fast_reactions;
	icr.accuracyViolation=accuracyViolation;
	changeRecords.push_back(icr);
	
	if (simulation_time==0.0) {
		previous_record_partition_data_was_t0=true;
	}
}

//pass same data as record
std::vector<std::size_t> PartitionOptimizer::select_initial_partition(double simulation_time, std::size_t slowReactionCount) {
	++calls_to_select_initial_partition;
//	std::cout << "setting calls_to_select_initial_partition to "<<calls_to_select_initial_partition<<" in select_initial_partition\n";

	if (calls_to_select_initial_partition==0) {
		//first time this function is called, set some variables
		if (have_alt_partition && presim_original_estimate<presim_alt_estimate && ffe_original_estimate<ffe_alt_estimate) {
			if (ffe_original_estimate!=0.0 && ffe_alt_estimate!=0.0 && presim_original_estimate!=0.0 && presim_alt_estimate!=0.0) {
				original_faster=true;
			}
		}
	}
//	else {
//
//		if (previous_record_partition_data_was_t0) {
//			std::cout << "previous realization completed without repartitioning.\n";
//			std::cout << "here, we would want to record data about previous realization...how?\n";
//		}
//		else {
//			std::cout << "previous realization repartitioned at least once during the simulation.\n";
//		}
//	}
	
//	std::cout << "selecting initial partition...\n";
	if (!have_alt_partition) {
		return original_initial_partition;
	}
	else if (has_permanent_initial) {
		return permanent_initial;
	} else {
//		std::cout << "we don't have a permanent initial partition...\n";
		//we have an alt partition, use a strategy to determine which to use
		if (original_faster && !original_has_fast_accuracy_violation) {
			//easy case, use original
			//if 3 realizations and we've not seen too many accuracy violations, let original be permanent
			if (calls_to_select_initial_partition>2) {
				has_permanent_initial=true;
				permanent_initial=original_initial_partition;
			}
			return original_initial_partition;
		}
		
		//now we begin the more interesting section because we need to evaluate which to use
		//let's use a simple strategy: use original for the first 3 realizations, then use alt for next 3
		if (calls_to_select_initial_partition<=2) {
			return original_initial_partition;
		}
		else {
			if (calls_to_select_initial_partition>5) {
				determine_permanent_initial(simulation_time, slowReactionCount);
				return permanent_initial;
			}
			else {
				used_alt_initial[calls_to_select_initial_partition]=true;
				return alternate_initial_partition;
			}
		}
	}
}

//slowReactionCount only used in case where last entry in changeRecords is t=0 for realization 5
//when this happens, we know the initial partition did not change during realization 5
void PartitionOptimizer::determine_permanent_initial(double simulation_time, std::size_t slowReactionCount) {
//	print_partition_data();
	
	//look at the results of the original vs alternate initial partition
	std::vector<double> original_simulation_time;
	std::vector<double> alternate_simulation_time;
	std::vector<bool> original_accuracy_violations;
	std::vector<bool> alternate_accuracy_violations;

	std::size_t realization_counter=0;
	std::size_t changeRecordCounter=1;
	while (realization_counter<6) {
		if (changeRecords[changeRecordCounter-1].simulation_time==0.0) {
			if (used_alt_initial[realization_counter]) {
				if (changeRecords.size()==changeRecordCounter) {
					//can only happen if realization 5 completed without changing initial partition
					alternate_simulation_time.push_back(simulation_time);
					alternate_accuracy_violations.push_back(false);
				}
				else {
					if (changeRecords[changeRecordCounter].simulation_time==0.0) {
						//can only happen if realization completed without changing initial partition
						alternate_simulation_time.push_back(simulation_time);
						alternate_accuracy_violations.push_back(false);						
					}
					else {
						alternate_simulation_time.push_back(changeRecords[changeRecordCounter].simulation_time);
						alternate_accuracy_violations.push_back(changeRecords[changeRecordCounter].accuracyViolation);
					}
				}
			}
			else {
				if (changeRecords[changeRecordCounter].simulation_time==0.0) {
					//can only happen if realization completed without changing initial partition
					original_simulation_time.push_back(simulation_time);
					original_accuracy_violations.push_back(false);						
				}
				else {
					original_simulation_time.push_back(changeRecords[changeRecordCounter].simulation_time);
					original_accuracy_violations.push_back(changeRecords[changeRecordCounter].accuracyViolation);
				}
			}
			++realization_counter;
		}
		++changeRecordCounter;
	}
	
//	std::cout << "results of initial partitions:" << std::endl;
//	for (std::size_t i=0; i!=original_simulation_time.size(); ++i) {
//		std::cout << "original result "<< i << ": ";
//		std::cout << original_simulation_time[i] << ", " << (original_accuracy_violations[i] ? "true":"false") <<"\n";
//	}
//	for (std::size_t i=0; i!=alternate_simulation_time.size(); ++i) {
//		std::cout << "alternate result "<< i << ": ";
//		std::cout << alternate_simulation_time[i] << ", " << (alternate_accuracy_violations[i] ? "true":"false") <<"\n";
//	}
	
	//use simple strategy of choosing the one that has the longest cumulative simulation time elapsed
	//unless they both have equal (or nearly equal) (which could occur in the case where both always finish the realization), then
	//compare accuracy violations, and if those are equal, choose original
	double original_elapsed_time=0.0;
	double alternate_elapsed_time=0.0;
	for (std::size_t i=0; i!=original_simulation_time.size(); ++i) {
		original_elapsed_time+=original_simulation_time[i];
	}	
	for (std::size_t i=0; i!=alternate_simulation_time.size(); ++i) {
		alternate_elapsed_time+=alternate_simulation_time[i];
	}
	
//	std::cout << "total elapsed time for original="<<original_elapsed_time<<"\n";
//	std::cout << "total elapsed time for alternate="<<alternate_elapsed_time<<"\n";
	
	//see if elapsed time is similar between the two options
	double relative_diff=(std::abs((alternate_elapsed_time-original_elapsed_time) ) / std::max(original_elapsed_time,alternate_elapsed_time));
//	std::cout << "relative difference in elapsed time is: "<<relative_diff<<"\n";
	if (relative_diff < 0.1) {
		std::size_t original_violations=0;
		std::size_t alternate_violations=0;
		for (std::size_t i=0; i!=original_accuracy_violations.size(); ++i) {
			if (original_accuracy_violations[i]) ++original_violations;
		}	
		for (std::size_t i=0; i!=alternate_accuracy_violations.size(); ++i) {
			if (alternate_accuracy_violations[i]) ++alternate_violations;
		}
		if (original_violations<=alternate_violations) {
//			std::cout << "selecting (as permenent) original here.\n";
			has_permanent_initial=true;
			permanent_initial=original_initial_partition;
		}
		else {
//			std::cout << "selecting (as permenent) alternate here.\n";
			has_permanent_initial=true;
			permanent_initial=alternate_initial_partition;
		}
	}
	//the relative difference in elapsed time is significant, so choose the one that gets us farther
	else {
		if (alternate_elapsed_time<original_elapsed_time) {
//			std::cout << "selecting (as permenent) original here.\n";
			has_permanent_initial=true;
			permanent_initial=original_initial_partition;
		}
		else {
//			std::cout << "selecting (as permenent) alternate here.\n";
			has_permanent_initial=true;
			permanent_initial=alternate_initial_partition;
		}
	}
}

void PartitionOptimizer::serialize(std::string filename) {
//	std::cout << "serializing partition optimizer...\n";
	std::ofstream outfile;
	outfile.open(filename.c_str());

	if (!outfile) {
		std::cerr << "StochKit ERROR (StandardDriverOutput::serialize): Unable to open output file. Terminating.\n";
		exit(1);
	}

	outfile << original_initial_partition.size() << "\n";
	for (std::size_t i=0; i!=original_initial_partition.size(); ++i) {
		outfile << original_initial_partition[i] << " ";
	}
	outfile << "\n";
	
	outfile << have_alt_partition << "\n";
	
	outfile << alternate_initial_partition.size() << "\n";
	for (std::size_t i=0; i!=alternate_initial_partition.size(); ++i) {
		outfile << alternate_initial_partition[i] << " ";
	}
	outfile << "\n";
	
	outfile << previous_record_partition_data_was_t0 << "\n";
	outfile << calls_to_select_initial_partition << "\n";
	outfile << original_faster << "\n";
	outfile << original_has_fast_accuracy_violation << "\n";
	outfile << alt_has_fast_accuracy_violation << "\n";
	
	outfile << has_permanent_initial << "\n";
	outfile << permanent_initial.size() << "\n";
	for (std::size_t i=0; i!=permanent_initial.size(); ++i) {
		outfile << permanent_initial[i] << " ";
	}
	outfile << "\n";
	
	outfile << used_alt_initial.size() << "\n";
	for (std::size_t i=0; i!=used_alt_initial.size(); ++i) {
		outfile << used_alt_initial[i] << " ";
	}
	outfile << "\n";
	
	outfile << changeRecords.size() << "\n";
	for (std::size_t i=0; i!=changeRecords.size(); ++i) {
		outfile << changeRecords[i].simulation_time << " " << changeRecords[i].realization << " " << changeRecords[i].number_slow_reactions_fired << "\n";
		outfile << changeRecords[i].new_partition.size() << "\n";
		for (std::size_t j=0; j!=changeRecords[i].new_partition.size(); ++j) {
			outfile << changeRecords[i].new_partition[j] << " ";
		}
		outfile << "\n";
		outfile << changeRecords[i].accuracyViolation << "\n";
	}
	
	outfile.close();
}

void PartitionOptimizer::unserialize(std::string filename) {
//	std::cout << "in PartitionOptimizer::unserialize...\n";

	//open file for reading
	std::ifstream fin(filename.c_str());
	if (!fin) {
		std::cerr << "StochKit ERROR (PartitionOptimizer::unserialize): Unable to open file.\n";
		exit(1);
	}
	std::string inputString;
//	fin >> inputString;//first line of file should contain string "trajectories"...
	bool inputBool;
//	fin >> inputBool;
	std::size_t inputSize_t;
	double inputDouble;
	int inputInt;
	
	fin >> inputSize_t;
	original_initial_partition.resize(inputSize_t);
//	std::cout << "resizing original_initial_partition to "<<inputSize_t<<"\n";
	
	for (std::size_t i=0; i!=original_initial_partition.size(); ++i) {
		fin >> inputSize_t;
		original_initial_partition[i]=inputSize_t;
//		std::cout << "inserting "<<inputSize_t<< " into original_initial_partition["<<i<<"]\n";
	}

	fin >> inputBool;
	have_alt_partition=inputBool;
//	std::cout << "setting have_alt_partition to "<<( (inputBool) ? "true":"false")<<"\n";

	fin >> inputSize_t;
	alternate_initial_partition.resize(inputSize_t);
	for (std::size_t i=0; i!=alternate_initial_partition.size(); ++i) {
		fin >> inputSize_t;
		alternate_initial_partition[i]=inputSize_t;
	}
	
	fin >> inputBool;
	previous_record_partition_data_was_t0=inputBool;

	fin >> inputSize_t;
	calls_to_select_initial_partition=inputSize_t;
//	std::cout << "setting calls_to_select_initial_partition to "<<calls_to_select_initial_partition<<"\n";
	fin >> inputBool;
	original_faster=inputBool;
	fin >> inputBool;
	original_has_fast_accuracy_violation=inputBool;
	fin >> inputBool;
	alt_has_fast_accuracy_violation=inputBool;
	fin >> inputBool;
	has_permanent_initial=inputBool;

	fin >> inputSize_t;
	permanent_initial.resize(inputSize_t);
//	std::cout << "resizing permanent_initial to "<<permanent_initial.size()<<"\n";
	for (std::size_t i=0; i!=permanent_initial.size(); ++i) {
		fin >> inputSize_t;
		permanent_initial[i]=inputSize_t;
//		std::cout << "setting permanent_initial["<<i<<"] to "<<permanent_initial[i]<<"\n";
	}

	fin >> inputSize_t;
	used_alt_initial.resize(inputSize_t);
	for (std::size_t i=0; i!=used_alt_initial.size(); ++i) {
		fin >> inputBool;
		used_alt_initial[i]=inputBool;
//		std::cout << "setting used_alt_initial["<<i<<"] to "<<( (inputBool) ? "true":"false")<<"\n";
	}

	fin >> inputSize_t;
	changeRecords.resize(inputSize_t);
//	std::cout << "resizing changeRecords to "<<inputSize_t<<"\n";
	for (std::size_t i=0; i!=changeRecords.size(); ++i) {
		fin >> inputDouble;
		changeRecords[i].simulation_time=inputDouble;
//		std::cout << "setting changeRecords["<<i<<"].simulationTime to "<<changeRecords[i].simulation_time_elapsed<<"\n";
		fin >> inputSize_t;
		changeRecords[i].realization=inputSize_t;
		fin >> inputSize_t;
		changeRecords[i].number_slow_reactions_fired=inputSize_t;
//		std::cout << "setting changeRecords["<<i<<"].number_slow_reactions_fired to "<<changeRecords[i].number_slow_reactions_fired<<"\n";
		fin >> inputSize_t;
		changeRecords[i].new_partition.resize(inputSize_t);
//		std::cout <<"resizing changeRecords["<<i<<"].new_partition to "<<changeRecords[i].new_partition.size()<<"\n";
		for (std::size_t j=0; j!=changeRecords[i].new_partition.size(); ++j) {
			fin >> inputSize_t;
			changeRecords[i].new_partition[j]=inputSize_t;
//			std::cout << "setting changeRecords["<<i<<"].new_partition["<<j<<"] to "<<changeRecords[i].new_partition[j]<<"\n";
		}
//		fin >> inputInt;
//		changeRecords[i].changeReason=(ChangeRecord::ChangeReason)inputInt;
//		std::cout << "setting changeRecords["<<i<<"].changeReason to "<<changeRecords[i].changeReason<<"\n";
		fin >> inputBool;
		changeRecords[i].accuracyViolation=inputBool;
	}

	fin.close();
}


