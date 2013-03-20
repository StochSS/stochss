
#ifndef _SLOW_SCALE_SSA_H_
#define _SLOW_SCALE_SSA_H_

#include "ElementaryReaction.h"
#include <algorithm>
#include "boost/numeric/ublas/operation.hpp"
#include "Random.h"
#include "MasterVirtualFastProcess.h"
#include <limits>
#include "buildDependencyGraph.h"
#include "PartitionOptimizer.h"
#include <iomanip>
#include <exception>

class SlowScaleSSA
{	
  public:

	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;
    typedef boost::numeric::ublas::compressed_matrix<double> sparse_matrix;

	typedef std::vector<std::size_t> (*independentSpeciesFunction) ();
	SlowScaleSSA(dense_vec& initialPopulation, std::vector<ElementaryReaction>& reactions, independentSpeciesFunction);
//	SlowScaleSSA(dense_vec& initialPopulation, std::vector<ElementaryReaction>& reactions, int seed);
	
	void seed(int seed);

	void calculateAllSlowPropensities();

	void setInitialFastReactions(std::vector<std::size_t>& initialFastReactions);


private:

//new. for dynamic partitioning
void updateAfterChangedVFP();
	
public:
	double selectStepSize();

	int selectSlowReaction();

	bool fireSlowReaction(int slowReactionIndex);
	
	void initialize(double startTime=0.0, double defaultRelaxationTime=1000);

	bool dynamic_partition(std::size_t realizationNumber, std::string files_directory="");//see MasterVirtualFastProcess::setFastReactionIndexes for info on this param

	template<typename IntervalOutputType>
	void save_state(std::string output_directory, IntervalOutputType& output, double currentTime, std::size_t currentRealization, std::size_t callsToRepartition, 
					std::size_t currentInterval, std::size_t stepsTaken) {
//		std::cout << "saving state...\n";

		output.serialize(output_directory+"/output_object_serialized.txt");
		
		partitionOptimizer.serialize(output_directory+"/partition_optimizer_serialized.txt");
		
		std::ofstream outfile;
		std::string simulation_progress_filename=output_directory+"/simulation_progress.txt";
		outfile.open(simulation_progress_filename.c_str());

		if (!outfile) {
			std::cerr << "StochKit ERROR (StandardDriverOutput::serialize): Unable to open simulation progress file for output. Terminating.\n";
			exit(1);
		}
	
		outfile << "PROGRESS\n";
		outfile << currentTime << "\n";
		outfile << currentRealization << "\n";
		outfile << callsToRepartition << "\n";
		outfile << currentInterval << "\n";
		outfile << stepsTaken << "\n";
		outfile << fastReactionsForOutput.size() << "\n";
		for (std::size_t i=0; i!=fastReactionsForOutput.size(); ++i) {
			outfile << fastReactionsForOutput[i] << " ";
		}
		outfile << "\n";
		//need a sample population...
		outfile << samplePopForOutput.size() << "\n";
		for (std::size_t i=0; i!=samplePopForOutput.size(); ++i) {
			outfile << samplePopForOutput[i] << " ";
		}
		outfile << "\n";
		
		outfile.close();
	}
	
	
//current dynamic code does not use this function. see resume_simulation below
	template<typename IntervalOutputType>
	void
	simulate(std::size_t realizations, double startTime, double endTime, IntervalOutputType& output) {

		std::cout << "StochKit MESSAGE (SlowScaleSSA::simulate): running simulation...\n";

		if (!output.initialize(realizations,startTime,endTime,initialPopulation)) {
			std::cerr << "StochKit ERROR (SlowScaleSSA::simulate): initialization of output object failed, simulation aborted\n";
			exit(1);
		}

		std::vector<double> outputTimes = output.getOutputTimes();
		std::size_t totalIntervals=outputTimes.size();

		std::size_t currentInterval;

	
		std::size_t stepsTaken=0;
		
		timeval timer3;
		timeval timer4;
		double ssssa_start;
		double ssssa_end;
		
		gettimeofday(&timer3,NULL);
		ssssa_start=timer3.tv_sec+(timer3.tv_usec/1000000.0);

updateAfterChangedVFP();
		
//		std::cout << "SLOW REACTION INDEXES (size="<<slowReactionIndexes.size()<<":\n";
//		for (std::size_t i=0; i!=slowReactionIndexes.size(); ++i) {
//			std::cout << slowReactionIndexes[i] <<"\n";
//		}
//		
//		std::cout << "entering main for loop...\n";

	std::size_t callsToRepartition=0;

		for (std::size_t currentRealization=0; currentRealization!=realizations; ++currentRealization) {
			initialize(startTime);
			
			//test call dynamic partition
//			std::cout << "calling dynamic partition at r=0, t=0...\n";
//			if (currentRealization==0 && currentTime==0) dynamic_partition();
//			std::cout << "exiting after calling dynamic_partition in ssssa.simulate...\n";
//			exit(1);
			
			
//			std::size_t stepsTaken=0;
			
			currentInterval=0;
			
//			std::cout << "realization "<<currentRealization<<"\n";
			
			//calculateAllSlowPropensities();

			currentTime+=selectStepSize();
//			std::cout << "selected initial step size of "<<currentTime<<"...\n";
			while (currentTime<endTime) {
				
//				std::cout << "ssssa.simulate in while loop...\n";
				
				while (currentInterval<totalIntervals && currentTime >=outputTimes[currentInterval]){
					output.record(currentRealization,currentInterval,currentEffectivePopulation);
					currentInterval++;
				}
//				std::cout << "about to select a slow reaction...\n";
//				std::cout << "slow propensities are:\n";
//				for (std::size_t i=0; i!=currentSlowPropensities.size(); ++i) {
//					std::cout << "a["<<i<<"]="<<currentSlowPropensities(i)<<"\n";
//				}

				int slowReactionIndex=selectSlowReaction();
//				std::cout << "to test deep alt stoich search, fire reaction 39...\n";
//				int slowReactionIndex=39;

				if (!fireSlowReaction(slowReactionIndex)) {
//					std::cout << "call to fire slow reaction failed...\n";
//					std::cout << "need to find out why...\n";
					if (vfp.accuracy_violated) {
						std::cout << "accuracy violated (ssssa)...calling repartition...\n";
						dynamic_partition(currentRealization);
						++callsToRepartition;
					}
					else {
						std::cout << "StochKit ERROR (SlowScaleSSA::simulate): firing of slow reaction failed for unknown reason (bug). Terminating.\n";
						exit(1);
					}
				}
				
//				std::cout << "terminating in SlowScaleSSA.h.\n";
//				exit(1);
				
				++stepsTaken;
				++stepsSinceLastPartition;
				
//				if (stepsTaken==50000) {
//					std::cout << "pausing at 50000 steps...\n";
//					
//					std::ofstream ofs("serialized_output.dat");
//					// save data to archive
//					{
//						boost::archive::text_oarchive oa(ofs);
//						// write class instance to archive
//						oa << output;
//						// archive and stream closed when destructors are called
//					}
//
//				}
				
//				std::cout << "taken "<<stepsTaken<<" steps in realization "<<currentRealization<<"\n";
//				std::cout << "effective population:\n";
//				bool foundNegative=false;
//				for (std::size_t i=0; i!=currentEffectivePopulation.size(); ++i) {
//					std::cout << currentEffectivePopulation[i] << "\t";
//					if (currentEffectivePopulation[i]<0.0) {
//						foundNegative=true;
//					}
//				}
//				std::cout << "\n";
//				if (foundNegative) {
//					std::cout << "detected negative effective population, terminating\n";
//					exit(1);
//				}
//				print_ublas_vector(currentEffectivePopulation,currentEffectivePopulation.size());
//				std::cout <<"\n";
//				std::size_t maxSteps=10;
//				
//				if (stepsTaken==maxSteps/2) {
////					std::cout << "setting new group of fast reactions at step "<<stepsTaken<<"\n";
//					dynamic_partition();
//				}
				
//				if (stepsTaken>=maxSteps) {
//					std::cout << "terminating after "<<maxSteps<<" steps\n";
//					exit(1);
//				}
				
//				std::cout << "stepsSinceLastPartition="<<stepsSinceLastPartition<<"\n";
				if (stepsSinceLastPartition==100000) {
//					std::cout << "calling repartition at t="<<currentTime<<" in realization "<<currentRealization<<"\n";
					dynamic_partition(currentRealization);
					++callsToRepartition;
				}
								
				//calculateAllSlowPropensities();

				currentTime+=selectStepSize();
//				std::cout << std::setprecision(10) << "currentTime="<<currentTime<<" (realization "<<currentRealization<<" of "<<realizations<<")\n";

			}
			while (currentInterval<totalIntervals && currentTime>=outputTimes[currentInterval]){
				output.record(currentRealization,currentInterval,currentEffectivePopulation);
				currentInterval++;
			}	
			
		}
		std::cout << "took "<<stepsTaken<<" total (slow) steps\n";
		std::cout << "called repartition "<<callsToRepartition<<" times.\n";

		gettimeofday(&timer4,NULL);
		ssssa_end=timer4.tv_sec+(timer4.tv_usec/1000000.0);
		double ssssa_time=(ssssa_end-ssssa_start);

		#ifdef PROFILE_VFP_TIMESCALES
		vfp.printTimescaleData();	
		#endif


//		std::cout << "simulate function time approximately "<<ssssa_time<<" seconds\n";

//		std::string slowdatafile="slow_rxn_data.txt";
//		std::ofstream outfile;
//		std::cout << "printing slow reactions and propensities to "<<slowdatafile<<"\n";
//				
//		outfile.open(slowdatafile.c_str());
//		if (!outfile) {
//			std::cout << "ERROR: Unable to open output file.\n";
//			exit(1);
//		}
//
//		for (std::size_t i=0; i!=indexAndPropensityOfSelectedSlowReaction.size(); ++i) {
//			outfile << indexAndPropensityOfSelectedSlowReaction[i].first << ","<< indexAndPropensityOfSelectedSlowReaction[i].second << "\n";
//		}
//		
//		outfile.close();


	}//end simulate	

//	template<typename IntervalOutputType>
//	bool assign_alternate_initial_partition(std::vector<std::size_t>& fast_reactions, std::string files_directory) {
//		if (!vfp.setFastReactionIndexes(fast_reactions, files_directory)) {
//			fastReactionsForOutput=fast_reactions;
//			samplePopForOutput=initialPopulation;
//			std::cout << "encountered at least one new ivfp, need to recompile.\n";
//			save_state<IntervalOutputType>(files_directory,output,currentTime,currentRealization,++callsToRepartition, currentInterval, stepsTaken);
//			return false;
//		}
//		//if we got here, all ivfps in selected_initial_partition have been precompiled
//		updateAfterChangedVFP();
//		
//		//call current ivfps .initialize functions here...
//	//	std::cout << "after changing, we have "<<vfp.current_ivfps.size()<<" current ivfps...\n";
//		for (std::size_t i=0; i!=vfp.current_ivfps.size(); ++i) {
//			vfp.all_precompiled_ivfps[vfp.current_ivfps[i]].initialize(1000,initialPopulation,currentEffectivePopulation);
//		}
//
//		calculateAllSlowPropensities();
//		
//		return true;
//	}


	template<typename IntervalOutputType>
	void
	resume_simulation(double resumeTime, std::size_t resumeRealization, std::size_t realizations, double startTime, double endTime, IntervalOutputType& output, std::string files_directory, std::size_t previousCallsToRepartition, std::size_t previousCurrentInterval, std::size_t previousStepsTaken, dense_vec previousPopulation, std::vector<std::size_t> previousFastReactions) {
		defaultRelaxationTime=endTime-startTime;
		defaultFFERunTime=defaultRelaxationTime*0.1;
//		std::cout << "StochKit MESSAGE (SlowScaleSSA::simulate): resuming simulation...\n";//files_directory="<<files_directory<<"\n";

//		std::cout << "StochKit MESSAGE (SlowScaleSSA::simulate): testing successful termination by calling exit(0).\n";
//		exit(0);
//		std::cout << "StochKit MESSAGE (SlowScaleSSA::simulate): testing termination due to error by calling exit(1).\n";
//		exit(1);


		if (resumeTime==0 && resumeRealization==0 && partitionOptimizer.calls_to_select_initial_partition==-1) {
			if (!output.initialize(realizations,startTime,endTime,initialPopulation)) {
				std::cerr << "StochKit ERROR (SlowScaleSSA::simulate): initialization of output object failed, simulation aborted\n";
				exit(1);
			}

			initialize(startTime,defaultRelaxationTime);//this must be called before checking for alternate initial partition, because otherwise there are uninitialized variables=>bad
			
			partitionOptimizer.set_original_initial_partition(vfp.getFastReactionIndexesRef());
			
			//see if our forward reaction frequency estimate method suggests a different initial partition
//			if (realizations>10) {//no need to worry about it if we're running a small ensemble
				check_for_alternate_initial_partition(files_directory);
//			}
			
//			partitionOptimizer.print_partition_data();
			
			std::vector<std::size_t> selected_initial_partition=partitionOptimizer.select_initial_partition(endTime,0);

//			std::cout << "selected_initial_partition=";
//			for (std::size_t i=0; i!=selected_initial_partition.size(); ++i) {
//				std::cout << selected_initial_partition[i] << " ";
//			}
//			std::cout << "\n";
//			std::vector<std::size_t> test_vec=vfp.getFastReactionIndexesRef();
//			std::cout << "VS vfp.getFastReactionIndexesRef()=";
//			for (std::size_t i=0; i!=test_vec.size(); ++i) {
//				std::cout << test_vec[i] << " ";
//			}
//			std::cout << "\n";
			
			partitionOptimizer.record_partition_data(0.0, 0, selected_initial_partition, 0, false);

			if (selected_initial_partition==vfp.getFastReactionIndexesRef()) {
//				std::cout << "using original initial partition, do nothing.\n";
			}
			else {
			//this section of code should never be called because partition optimizer always selects original partition on first realization
				std::cout << "StochKit ERROR (SlowScaleSSA::resume_simulation): reached unexpected internal state (bug 357). Terminating.\n";
				exit(1);
//				std::cout << "using an alternate initial partition, updating partition data structures...\n";
//				std::cout << "exiting after choosing alt initial partition.\n";
//				exit(1);
//				if (!vfp.setFastReactionIndexes(selected_initial_partition, files_directory)) {
//					fastReactionsForOutput=selected_initial_partition;
//					samplePopForOutput=initialPopulation;
//					std::cout << "encountered at least one new ivfp, need to recompile.\n";
//					save_state<IntervalOutputType>(files_directory,output,resumeTime,resumeRealization,previousCallsToRepartition, previousCurrentInterval, previousStepsTaken);
//					return;
//				}
//				else {
//					std::cout << "apparently, vfp.setfastreactionindexes returned true...\n";
//				}
//				//if we got here, all ivfps in selected_initial_partition have been precompiled
//				updateAfterChangedVFP();
//				
//				//call current ivfps .initialize functions here...
//			//	std::cout << "after changing, we have "<<vfp.current_ivfps.size()<<" current ivfps...\n";
//				for (std::size_t i=0; i!=vfp.current_ivfps.size(); ++i) {
//					vfp.all_precompiled_ivfps[vfp.current_ivfps[i]].initialize(defaultRelaxationTime,initialPopulation,currentEffectivePopulation);
//				}
//
//				calculateAllSlowPropensities();

			}

		}
		else {
//			std::cout << "...resuming simulation, current time="<<resumeTime<<", current realization="<<resumeRealization<<"...\n";
			currentEffectivePopulation=previousPopulation;

			vfp.setFastReactionIndexes(previousFastReactions,files_directory);

//			std::cout << "previousFastReactions: ";
//			for (std::size_t i=0; i!=previousFastReactions.size(); ++i) {
//				std::cout << previousFastReactions[i] << " ";
//			}
//			std::cout << "\n";
			//before overwriting progress file, save it so I can look at it
//			std::string syscmd="cp "+files_directory+"/simulation_progress.txt "+files_directory+"/simulation_progress_saved.txt";
//			system(syscmd.c_str());
			
//			std::cout << "writing 'FINISHED' to progress file...\n";
//			std::string system_command="echo 'FINISHED' > "+files_directory+"/simulation_progress.txt";
//			system(system_command.c_str());
//			exit(1);

			updateAfterChangedVFP();
			//call current ivfps .initialize functions here...
		//	std::cout << "after changing, we have "<<vfp.current_ivfps.size()<<" current ivfps...\n";
			for (std::size_t i=0; i!=vfp.current_ivfps.size(); ++i) {
				vfp.all_precompiled_ivfps[vfp.current_ivfps[i]].initialize(defaultRelaxationTime,previousPopulation,currentEffectivePopulation);
			}

			calculateAllSlowPropensities();
		}
		
		std::vector<double> outputTimes = output.getOutputTimes();
		std::size_t totalIntervals=outputTimes.size();

		std::size_t currentInterval=previousCurrentInterval;
		std::size_t stepsTaken=previousStepsTaken;
		std::size_t callsToRepartition=previousCallsToRepartition;
		currentTime=resumeTime;
		std::size_t currentRealization=resumeRealization;

//		std::cout << "SLOW REACTION INDEXES (size="<<slowReactionIndexes.size()<<":\n";
//		for (std::size_t i=0; i!=slowReactionIndexes.size(); ++i) {
//			std::cout << slowReactionIndexes[i] <<"\n";
//		}
//		
//		std::cout << "entering main for loop...\n";

		std::cout << "StochKit MESSAGE (SlowScaleSSA::resume_simulation): resuming simulation...\n";//, current time="<<resumeTime<<", current realization="<<resumeRealization<<"...\n";

		while (currentRealization<realizations) {

			currentTime+=selectStepSize();
//			std::cout << "selected initial step size of "<<currentTime<<"...\n";
			while (currentTime<endTime) {
				
//				std::cout << "ssssa.simulate in while loop...\n";
				
				while (currentInterval<totalIntervals && currentTime >=outputTimes[currentInterval]){
					output.record(currentRealization,currentInterval,currentEffectivePopulation);
					currentInterval++;
				}
//				std::cout << "about to select a slow reaction...\n";
//				std::cout << "slow propensities are:\n";
//				
//				for (std::size_t i=0; i!=slowReactionIndexes.size(); ++i) {
//					std::cout << "a["<<slowReactionIndexes[i]<<"]="<<currentSlowPropensities[slowReactionIndexes[i]]<<"\n";
//				}

				int slowReactionIndex=selectSlowReaction();

//				std::cout << "selected reaction index "<<slowReactionIndex<<"\n";

				if (!fireSlowReaction(slowReactionIndex)) {
//					std::cout << "call to fire slow reaction failed...\n";
//					std::cout << "need to find out why...\n";
					if (vfp.accuracy_violated) {
//						std::cout << "accuracy violated, repartitioning...at t="<<currentTime<<"\n";
//						std::cout << "effective population=";
//						for (std::size_t i=0; i!=currentEffectivePopulation.size(); ++i) {
//							std::cout << currentEffectivePopulation[i] << "\t";
//						}
//						std::cout << "\n";
						if (!dynamic_partition(currentRealization, files_directory)) {
							save_state<IntervalOutputType>(files_directory,output,currentTime,currentRealization,++callsToRepartition, currentInterval, stepsTaken);
							return;
						}
						++callsToRepartition;
					}
					else {
						//this WILL HAPPEN if we are confident that the slow reaction should not have fired...
						//if so, MVFP.fire should not have changed the internal realizable populations but may have changed effective populations
						//hence, we should recalculate all slow propensities...
//						if (!seenDeterminedNotToHaveFiredMessage) {
//							std::cout << "StochKit MESSAGE (SlowScaleSSA::resume_simulation): slow reaction deemed not to have fired. (This message will only be displayed once per thread.)\n";
//							seenDeterminedNotToHaveFiredMessage=true;
//						}
						calculateAllSlowPropensities();
						//manually adjust the offending reaction's propensity to be zero.
						double oldProp=currentSlowPropensities[slowReactionIndex];
						currentSlowPropensities[slowReactionIndex]=0.0;//reactions[slowReactionIndex].propensity(currentEffectivePopulation);
						slowPropensitySum+=currentSlowPropensities[slowReactionIndex]-oldProp;
					}
				}
				
//				std::cout << "terminating in SlowScaleSSA.h.\n";
//				exit(1);
				
				++stepsTaken;
				++stepsSinceLastPartition;
								
//				std::cout << "stepsSinceLastPartition="<<stepsSinceLastPartition<<"\n";
				if (stepsSinceLastPartition==100000) {
//					std::cout << "calling repartition at t="<<currentTime<<" in realization "<<currentRealization<<"\n";
					if (!dynamic_partition(currentRealization, files_directory)) {
						save_state<IntervalOutputType>(files_directory,output,currentTime,currentRealization,++callsToRepartition, currentInterval, stepsTaken);
						return;
					}
					++callsToRepartition;
				}
								
				//calculateAllSlowPropensities();

				currentTime+=selectStepSize();
//				std::cout << std::setprecision(10) << "currentTime="<<currentTime<<" (realization "<<currentRealization<<" of "<<realizations<<")\n";

			}
			while (currentInterval<totalIntervals && currentTime>=outputTimes[currentInterval]){
				output.record(currentRealization,currentInterval,currentEffectivePopulation);
				currentInterval++;
			}
			std::size_t slowSteps=stepsSinceLastPartition;
			initialize(startTime,defaultRelaxationTime);
			++currentRealization;
			currentInterval=0;
			
			if (currentRealization<=6) {
				std::vector<std::size_t> selected_initial_partition=partitionOptimizer.select_initial_partition(endTime,slowSteps);
				partitionOptimizer.record_partition_data(0.0, currentRealization, selected_initial_partition, slowSteps, false);
				
				if (selected_initial_partition==vfp.getFastReactionIndexesRef()) {
	//				std::cout << "using original initial partition, do nothing.\n";
				}
				else {
	//				std::cout << "using an alternate initial partition, updating partition data structures...\n";
	//				std::cout << "exiting after choosing alt initial partition.\n";
	//				exit(1);

					if (!vfp.setFastReactionIndexes(selected_initial_partition, files_directory)) {
						fastReactionsForOutput=selected_initial_partition;
						samplePopForOutput=initialPopulation;
//						std::cout << "encountered at least one new ivfp, need to recompile.\n";
						save_state<IntervalOutputType>(files_directory,output,currentTime,currentRealization,callsToRepartition, currentInterval, stepsTaken);
						return;
					}
					//if we got here, all ivfps in selected_initial_partition have been precompiled
					if (currentRealization==6) {
						if (!partitionOptimizer.has_permanent_initial || partitionOptimizer.permanent_initial!=selected_initial_partition) {
							std::cout << "StochKit ERROR (SlowScaleSSA::resume_simulation): unexpected error in partition optimizer (bug). Terminating.\n";
							exit(1);
						}
						else {
							//make alternate initial partition permanent
							setInitialFastReactions(selected_initial_partition);
							//write new permanenet initial partition to initial_vfp_reactions.txt
							std::ofstream initial_vfp_reactions_outfile;
							std::string initial_vfp_reactions_filename=files_directory+"/initial_vfp_reactions.txt";
							//open
							initial_vfp_reactions_outfile.open(initial_vfp_reactions_filename.c_str(),std::ios::out);
							if (!initial_vfp_reactions_outfile) {
								std::cout << "StochKit ERROR (ssssa_automatic): error opening initial vfp list text file. Terminating.\n";
								exit(1);
							}
							try {
								for (std::size_t i=0; i!=selected_initial_partition.size(); ++i) {
										initial_vfp_reactions_outfile << selected_initial_partition[i] << " ";
								}
								initial_vfp_reactions_outfile.close();
							}
							catch (...) {
								std::cout << "StochKit ERROR (ssssa_automatic): error writing to initial vfp list text file. Terminating.\n";
								exit(1);	
							}	

							std::cout << "StochKit MESSAGE (SlowScaleSSA::resume_simulation): changed initial (t=0) partition in attempt to improve performance.\n";
						}
					}
					
					
					updateAfterChangedVFP();
					
					//call current ivfps .initialize functions here...
				//	std::cout << "after changing, we have "<<vfp.current_ivfps.size()<<" current ivfps...\n";
					for (std::size_t i=0; i!=vfp.current_ivfps.size(); ++i) {
						vfp.all_precompiled_ivfps[vfp.current_ivfps[i]].initialize(defaultRelaxationTime,initialPopulation,currentEffectivePopulation);
					}

					calculateAllSlowPropensities();
				}
			}//end if (currentRealization<=6)
		}
		std::cout << "...simulation finished.\n";
//		std::cout << "took "<<stepsTaken<<" total (slow) steps\n";
//		std::cout << "called repartition "<<callsToRepartition<<" times.\n";
//		partitionOptimizer.print_partition_data();
//		std::cout << "total time spent in partition function="<<vfp.groups.cumulative_partition_elapsed_time<<"\n";

//		std::cout << "writing 'FINISHED' to progress file...\n";
		std::string system_command="echo 'FINISHED' > "+files_directory+"/simulation_progress.txt";
		system(system_command.c_str());

		#ifdef PROFILE_VFP_TIMESCALES
		vfp.printTimescaleData();	
		#endif


//		std::cout << "simulate function time approximately "<<ssssa_time<<" seconds\n";

//		std::string slowdatafile="slow_rxn_data.txt";
//		std::ofstream outfile;
//		std::cout << "printing slow reactions and propensities to "<<slowdatafile<<"\n";
//				
//		outfile.open(slowdatafile.c_str());
//		if (!outfile) {
//			std::cout << "ERROR: Unable to open output file.\n";
//			exit(1);
//		}
//
//		for (std::size_t i=0; i!=indexAndPropensityOfSelectedSlowReaction.size(); ++i) {
//			outfile << indexAndPropensityOfSelectedSlowReaction[i].first << ","<< indexAndPropensityOfSelectedSlowReaction[i].second << "\n";
//		}
//		
//		outfile.close();

	}//end resume_simulation

	void check_for_alternate_initial_partition(std::string files_directory) {
//		std::cout << "checking for an alternate initial partition...\n";
//		std::cout << "for reference, initial partition based on presimulation was:\n";
//		vfp.print_current_ivfps();

//		std::cout << "try using ffe based on initial population to partition...\n";
			//this time should be set automatically based on simulation time and/or relaxation time etc.
		//	double finalTime=15000;
//			double finalTime=500;
//			double max_fast_relaxation_time=finalTime/50.0;
		//	std::cout << "hard-coding ffe sim time ("<<finalTime<<") and max_fast_relaxation_time ("<<max_fast_relaxation_time<<")...\n";
			
			std::vector<double> sampleTimes;
//			sampleTimes.push_back(finalTime/2.0);
//			sampleTimes.push_back(finalTime);
			sampleTimes.push_back(defaultFFERunTime/2.0);
			sampleTimes.push_back(defaultFFERunTime);
			double max_fast_relaxation_time=defaultFFERunTime/5.0;

			vfp.ffe.run(0, sampleTimes, currentEffectivePopulation);
			
//			std::cout << "cumulatve firing frequency estimate (tf="<<finalTime<<"):\n";
			double ffe_freq_estimate=0;
			for (std::size_t i=0; i!=NumberOfReactions; ++i) {
//				std::cout << "rxn "<<i<<": "<<vfp.ffe.cumulativeFiringFrequencyEstimate[i]<<"\n";
				ffe_freq_estimate+=vfp.ffe.cumulativeFiringFrequencyEstimate[i];
			}
//			std::cout << std::setprecision(12) << "ffe_freq_estimate="<<ffe_freq_estimate<<"\n";
			
			//now use those estimated firing frequencies to construct "groups"

			vfp.groups.update(vfp.ffe.getSimulationOutputPopulationsRef().back(),vfp.ffe.cumulativeFiringFrequencyEstimate,defaultFFERunTime);//this must be setting simulation info into "groups" object
			vfp.groups.partition(reactions, max_fast_relaxation_time);

//			std::cout << "terminating in ssssa.check_for_alternate_initial_partition...\n";
//			exit(1);
			//	std::cout << "press enter key to continue.\n";
			//	std::cin.get();


				std::vector<std::size_t> newFastReactions;

//				std::cout << "dynamic_partition selected the following ivfp reactions:\n";
				for (std::size_t i=0; i!=vfp.groups.currentFP.fast_groups.size(); ++i) {
//					std::cout << "ivfp "<<i<<": ";
					for (std::set<std::size_t>::iterator it=vfp.groups.currentFP.fast_groups[i].fastReactionIndexes.begin(); it!=vfp.groups.currentFP.fast_groups[i].fastReactionIndexes.end(); ++it) {
//						std::cout << *it << "\t";
						newFastReactions.push_back(*it);
					}
//					std::cout << "\n";		
				}

				sort(newFastReactions.begin(),newFastReactions.end());

			//get list of current fast reactions and compare.
			if (newFastReactions==vfp.fastReactionIndexes) {
//				std::cout << "ffe led to same set as presimulation.\n";
			}
			else {
//				std::cout << "ffe suggested a different set of fast reactions\n";
				partitionOptimizer.set_alternate_initial_partition(newFastReactions);
				//std::string files_directory
				std::ofstream outfile;
				std::string alt_initial_vfp_reactions_file=files_directory+"/alternative_initial_vfp_reactions.txt";
				outfile.open(alt_initial_vfp_reactions_file.c_str());
				if (!outfile) {
					std::cout << "StochKit ERROR (SlowScaleSSA::check_for_alternate_initial_partition): Unable to open alternate initial vfp reactions file. Terminating.\n";
					exit(1);
				}
				try {
					for (std::size_t i=0; i!=newFastReactions.size(); ++i) {
						outfile << newFastReactions[i] << " ";
//						std::cout << newFastReactions[i] << " ";
					}
					outfile << "\n";
//					std::cout << "\n";
					outfile.close();
				}
				catch(...) {
					std::cout << "StochKit ERROR (SlowScaleSSA::check_for_alternate_initial_partition): error writing to alternate initial vfp reactions file. Terminating.\n";
					exit(1);							
				}
				
				//set the partitionOptimizer simulation time estimate variables

				partitionOptimizer.ffe_alt_estimate=vfp.groups.calculateSimulationTime(vfp.groups.currentFP,reactions);

				//could get equilvalent estimate using new quick_sim_time_estimate function
//				std::cout << "ffe alterate initial partition simulation estimate: "<<ffe_alt_estimate<<"\n";
//				std::set<std::size_t> altFastRxnSet=vfp.groups.currentFP.get_fast_reactions();
//				std::vector<std::size_t> altFastRxnVec(altFastRxnSet.begin(),altFastRxnSet.end());
//				std::cout << "using quick_sim_time_estimate gives: "<<quick_sim_time_estimate(vfp.ffe.cumulativeFiringFrequencyEstimate, altFastRxnVec)<<"\n";
				
				//now, lets try to estimate sim time using ffe reaction firing data and original initial partition
				partitionOptimizer.ffe_original_estimate=quick_sim_time_estimate(vfp.ffe.cumulativeFiringFrequencyEstimate, vfp.getFastReactionIndexesRef());
				
				//now, let's try to compare sim time estimate of original vs alt initial partition based on presimulation data
				//realizing that alt was probably not selected originally due to accuracy violation...but if alt might be faster, might be worth trying
				//get presim data
				std::vector<double> presim_data;
				std::ifstream presim_data_infile;
				std::string presim_data_filename=files_directory+"/presimulation_data.txt";
				//open for reading
				presim_data_infile.open(presim_data_filename.c_str(),std::ios::in);
				if (!presim_data_infile) {
					std::cout << "StochKit WARNING (check_for_alternate_initial_partition): error reading presimulation data text file. Continuing without evaluating alternate initial partition using presimulation data.\n";
				}
				else {
					try {
						
						//file is open, read in data...
						std::string line;
						std::size_t rxn_counter=0;
						while ( presim_data_infile.good() && rxn_counter<reactions.size())	{
							getline(presim_data_infile,line);
//							std::cout << line << "\n";
							//last token is the number of firings for this reaction
							std::size_t pos=line.rfind(" ");
							std::string num_string=line.substr(pos+1);
//							std::cout << "num_string is "<<num_string<<"\n";
							presim_data.push_back(strtod(num_string.c_str(),NULL));
							++rxn_counter;
						}

						presim_data_infile.close();
					}
					catch (std::exception& e) {
						std::cout << "StochKit ERROR (check_for_alternate_initial_partition): unexpected error reading presimulation data text file. Terminating.\n";
//						std::cout << "exception: "<<e.what()<<"\n";
						presim_data_infile.close();
						exit(1);	
					}	
				
//					std::cout << "presim data:\n";
//					for (std::size_t i=0; i!=presim_data.size(); ++i) {
//						std::cout << "reaction "<<i<<": "<<presim_data[i]<<"\n";
//					}
									
					if (presim_data.size()!=reactions.size()) {
						std::cout << "StochKit WARNING (check_for_alternate_initial_partition): error reading presimulation data text file. Continuing without evaluating alternate initial partition using presimulation data.\n";
					}
					else {
						partitionOptimizer.presim_original_estimate=quick_sim_time_estimate(presim_data,vfp.getFastReactionIndexesRef());
						std::set<std::size_t> altFastRxnSet=vfp.groups.currentFP.get_fast_reactions();
						std::vector<std::size_t> altFastRxnVec(altFastRxnSet.begin(),altFastRxnSet.end());
						partitionOptimizer.presim_alt_estimate=quick_sim_time_estimate(presim_data,altFastRxnVec);
					}
					
					
				}
			}

//					if (!vfp.setFastReactionIndexes(newFastReactions, files_directory)) {
//						fastReactionsForOutput=newFastReactions;
//						samplePopForOutput=samplePop;
//						return false;//encountered at least one new ivfp, need to recompile
//					}

//				dynamic_partition();
//				std::cout << "partition based on ffe:\n";
//				vfp.print_current_ivfps();
//		std::cout << "exiting in check_for_alternate_initial_partition.\n";
//		exit(1);
	}

double quick_sim_time_estimate(std::vector<double>& reaction_freqs, std::vector<std::size_t>& fast_reaction_indexes) {
//	std::cout << "doing quick sim time estimate...\n";
	double slowReactionChannels=(double)reactions.size()-(double)fast_reaction_indexes.size();
//	std::cout << "# of slow reaction channels using original initial partition="<<slowReactionChannels<<"\n";
	double freq_total=std::accumulate(reaction_freqs.begin(),reaction_freqs.end(),0.0);
//	std::cout << "freq total="<<freq_total<<"\n";
	double y=0.043*slowReactionChannels+4.5;//see kevin's notes on how this was fit
	//y is 1*10^-7 seconds per slow reaction step
	
	//find number of slow reaction firings in ffe
	double slowReactionFirings=freq_total;
	//now subtract fast reactions
	for (std::size_t i=0; i!=fast_reaction_indexes.size(); ++i) {
		slowReactionFirings-=reaction_freqs[fast_reaction_indexes[i]];
//		std::cout << std::setprecision(12) << "subtracting " << reaction_freqs[fast_reaction_indexes[i]]<<" for reaction "<<fast_reaction_indexes[i]<<"\n";
	}
	
	double presimElapsedTimeEstimate=y*(double)slowReactionFirings;//same units as y, multiplied by number of SLOW reactions
	double slowReactionCost=presimElapsedTimeEstimate*pow(10,-7);//units is seconds
	
//	std::cout << "slow freq total="<<slowReactionFirings<<"\n";
//	std::cout << "time for firing slow reactions estimated to be "<<slowReactionCost<<"\n";
	
	//now put fast reactions into independent groups
	std::vector<std::vector<std::size_t> > ind_subsystems=vfp.findIndependentSubsystems(fast_reaction_indexes);
	
	//find all species in ind. subsystems that affect fast reaction propensities when changed
	std::vector<std::set<std::size_t> > ind_subsystems_reactant_species(ind_subsystems.size());
	for (std::size_t i=0; i!=ind_subsystems.size(); ++i) {
		for (std::size_t j=0; j!=ind_subsystems[i].size(); ++j) {
			std::vector<Reactant> r=reactions[ind_subsystems[i][j]].getReactants().get();
			for (std::size_t k=0; k!=r.size(); ++k) {
				ind_subsystems_reactant_species[i].insert(r[k].getSpeciesIndex());
			}
		}
	}

//	std::cout << "independent subsystems species:\n";
//	for (std::size_t i=0; i!=ind_subsystems_reactant_species.size(); ++i) {
//		for (std::set<std::size_t>::iterator it=ind_subsystems_reactant_species[i].begin(); it!=ind_subsystems_reactant_species[i].end(); ++it) {
//			std::cout << *it << " ";
//		}
//		std::cout << "\n";
//	}

	double equilibriumCallCost=0.0;
//				//now add cost of fast process equilibrium calls
//				equilibriumCallCost+=partition.estimate_equilibrium_sim_time(initialGroupNodes, model);
	
	//iterate over independent fast subsystems
	//for each reaction not in the subsystem, see if stoichiometry affects the subsystem's reactant species
	//if so, add the cost of those equilibrium calls to equilibriumCallCost
	for (std::size_t i=0; i!=ind_subsystems.size(); ++i) {
//		std::cout << "looking at ind_subsystems["<<i<<"] (reactions = ";
//		for (std::size_t x=0; x!=ind_subsystems[i].size(); ++x) {
//			std::cout << ind_subsystems[i][x] << " ";
//		}
//		std::cout << "\n";
		//first, calculate rank of this subsystems stoichiometry matrix (ie # of "independent species")
//		std::cout << "compute rank of this subsystem...\n";
		std::size_t this_rank=fast_subsystem_rank(ind_subsystems[i],reactions);
//		std::cout << "rank is "<<this_rank<<"\n";
		
		double callsToThisSubsystem=0;
		
		//iterate over reactions
		for (std::size_t j=0; j!=reactions.size(); ++j) {
			//don't do anything if reaction j is in this independent subsystem
			if (std::find(ind_subsystems[i].begin(), ind_subsystems[i].end(), j)==ind_subsystems[i].end()) {
				//if firing reaction j modifies population in this independent subsystem, add calls to callsToThisSubsystem counter
				bool overlaps=false;
				sparse_vec stoich_row=reactions[j].getStoichiometry();
				for (sparse_vec::iterator it=stoich_row.begin(); it!=stoich_row.end(); ++it) {
					if (*(it) != 0) {
						if (ind_subsystems_reactant_species[i].find(it.index())!=ind_subsystems_reactant_species[i].end()) {
							overlaps=true;
						}
					}
				}

				if (overlaps) {
//					std::cout << "reaction "<<j<<" overlaps, adding "<<reaction_freqs[j]<<" to callsToThisSubsystem.\n";
					callsToThisSubsystem+=reaction_freqs[j];
				}
			}
		}
		
		//add cost of equilibrium calls to this subsystem
		double y=0.15*(double)this_rank*(double)this_rank-0.044*(double)this_rank+1.1;//time per call in 1*10^-6 seconds
		double costForThisSubset=(double)callsToThisSubsystem*y*pow(10,-6);
//		std::cout << "costForThisSubset="<<costForThisSubset<<"\n";
		equilibriumCallCost+=costForThisSubset;
	}
	
	
	return slowReactionCost+equilibriumCallCost;

}

//yarc...yet another rank calculation...
std::size_t fast_subsystem_rank(std::vector<std::size_t>& fast_reaction_indexes, std::vector<ElementaryReaction>& model) {
	std::set<std::size_t> fastSpeciesSet;
	
	//compute number of fast species...iterate over fast reactions and put species in a set
	for (std::size_t i=0; i!=fast_reaction_indexes.size(); ++i) {
		std::vector<Reactant> r=model[fast_reaction_indexes[i]].getReactants().get();
		for (std::size_t k=0; k!=r.size(); ++k) {
			fastSpeciesSet.insert(r[k].getSpeciesIndex());
//			std::cout << "inserted species index "<<r[k].getSpeciesIndex()<<"\n";
		}
		std::vector<Product> p=model[fast_reaction_indexes[i]].getProducts().get();
		for (std::size_t k=0; k!=p.size(); ++k) {
			fastSpeciesSet.insert(p[k].getSpeciesIndex());
//			std::cout << "inserted species index "<<p[k].getSpeciesIndex()<<"\n";
		}
	}

	std::size_t numberOfFastSpecies=fastSpeciesSet.size();
		
	boost::numeric::ublas::matrix<double> groupNU(fast_reaction_indexes.size(),numberOfFastSpecies);
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
	for (std::set<std::size_t>::iterator it=fastSpeciesSet.begin(); it!=fastSpeciesSet.end(); ++it) {
		lookupTable.insert(std::pair<std::size_t,std::size_t>(*it,i));
		++i;
	}
//			std::cout << "lookupTable:\n";
//			for (std::map<std::size_t,std::size_t>::iterator it=lookupTable.begin(); it!=lookupTable.end(); ++it) {
//				std::cout << it->first << "="<<it->second << "\n";
//			}
	//build groupNU, a reindexed stoichiometry vector (reindexed so that it only contains columns for species involved)
	//for example, a node comprised of reversible pair X4+X8<=>X12 would map it to temp X0+X1<=>X2 for groupNU
	//iterate over initial nodes, then over the reactions within in, constructing
	std::size_t currentRow=0;//each row corresponds to an initial node
	for (std::size_t i=0; i!=fast_reaction_indexes.size(); ++i) {
		//for this reaction, insert a reindexed stoichiometry into currentRow in groupNU
		sparse_vec stoich_row=model[fast_reaction_indexes[i]].getStoichiometry();
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
	
	std::size_t r=rank(groupNU);
	
//			std::cout << "rank is "<<r<<"\n";

	return r;
}

//  private:
public:
	SlowScaleSSA();
  
	dense_vec initialPopulation;
	std::vector<ElementaryReaction> reactions;
	std::vector<std::vector<std::size_t> > ssDependencyGraph;//slow reaction propensities that must be updated when slow reaction i fires
	dense_vec currentEffectivePopulation;

	dense_vec currentSlowPropensities;
	double slowPropensitySum;
	double currentTime;
	
	std::size_t NumberOfSpecies;
	std::size_t NumberOfReactions;
	
	std::size_t NumberOfSlowReactions;
	
	STOCHKIT::RandomGenerator randomGenerator;

	int previousSlowReactionIndex;

	MasterVirtualFastProcess vfp;

//	std::vector<bool> isSpeciesFast;

//	std::vector<sparse_vec> slowRxnSlowSpeciesStoich;
	std::vector<dense_vec> slowRxnSlowSpeciesStoich;
	std::vector<std::size_t> slowReactionIndexes;

	void buildNU(std::vector<ElementaryReaction>& model, std::size_t numberOfSpecies);
	std::vector<dense_vec> NU;//full stoichiometry matrix of model

	std::vector<std::size_t> initialSlowReactions;
	std::vector<std::vector<std::size_t> > initialssDependencyGraph;
	std::size_t initialNumberOfSlowReactions;
	std::vector<dense_vec> initialSlowRxnSlowSpeciesStoich;

	std::size_t stepsSinceLastPartition;
	
	std::vector<std::size_t> fastReactionsForOutput;//used only when dynamic_partition returns false;
	dense_vec samplePopForOutput;
	
	PartitionOptimizer partitionOptimizer;//helper class for optimizing dynamic_partition decisions
//	std::vector<std::pair<std::size_t,double> > indexAndPropensityOfSelectedSlowReaction;
	double defaultRelaxationTime;
	double defaultFFERunTime;

	std::vector<std::size_t> AplusAreactions;//list of reactions that are of the form A+A-> something
	bool seenNegativePropensityWarning;
	
};//class SlowScaleSSA

#endif
