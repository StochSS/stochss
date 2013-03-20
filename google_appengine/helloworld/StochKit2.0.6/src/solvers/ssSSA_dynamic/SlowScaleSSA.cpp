#include "SlowScaleSSA.h"	

SlowScaleSSA::SlowScaleSSA(dense_vec& initialPopulation, std::vector<ElementaryReaction>& reactions, independentSpeciesFunction indSpecFunc) :
		initialPopulation(initialPopulation), reactions(reactions), currentEffectivePopulation(initialPopulation.size()), currentSlowPropensities(reactions.size()),
	NumberOfSpecies(initialPopulation.size()), NumberOfReactions(reactions.size()), vfp(reactions,NumberOfSpecies,indSpecFunc), stepsSinceLastPartition(0), defaultRelaxationTime(1000), defaultFFERunTime(100), seenNegativePropensityWarning(false)
{
//	std::cout << "in SlowScaleSSA constructor...\n";
	randomGenerator.Seed(time(NULL));//driver will call SlowScaleSSA.seed if a seed is specified
	buildNU(reactions,NumberOfSpecies);
	
	//build list of A+A-> type reactions
	for (std::size_t i=0; i!=this->reactions.size(); ++i) {
		Reactants r=reactions[i].getReactants();
		if (r.size()==1 && r[0].getMoleculeCount()==2) {
//			std::cout << "reaction "<<i<<" is A+A type...\n";
			AplusAreactions.push_back(i);
		}
	}
//	std::cout << "list of A+A reactions:\n";
//	for (std::size_t i=0; i!=AplusAreactions.size(); ++i) {
//		std::cout << AplusAreactions[i] << "\n";
//	}
//	std::cout << "exiting SlowScaleSSA constructor...\n";
}

//SlowScaleSSA::SlowScaleSSA(dense_vec& initialPopulation, std::vector<ElementaryReaction>& reactions, int seed) :
//		initialPopulation(initialPopulation), reactions(reactions), currentEffectivePopulation(initialPopulation.size()),  currentSlowPropensities(reactions.size()),
//	NumberOfSpecies(initialPopulation.size()), NumberOfReactions(reactions.size()), vfp(reactions,NumberOfSpecies), stepsSinceLastPartition(0)
//{
//	std::cout << "seeding random generator...\n";
//	randomGenerator.Seed(seed);
//	buildNU(reactions,NumberOfSpecies);
//}

void SlowScaleSSA::setInitialFastReactions(std::vector<std::size_t>& initialFastReactions) {

	vfp.buildInitialIVFP(initialFastReactions);

	updateAfterChangedVFP();
	//set all "initial" vfp-related stuff
	initialSlowReactions=slowReactionIndexes;
	initialssDependencyGraph=ssDependencyGraph;
	initialNumberOfSlowReactions=NumberOfSlowReactions;
	initialSlowRxnSlowSpeciesStoich=slowRxnSlowSpeciesStoich;
}


void SlowScaleSSA::buildNU(std::vector<ElementaryReaction>& model, std::size_t numberOfSpecies) {
	std::vector<dense_vec> nu(model.size(), dense_vec(numberOfSpecies));
	//first,fill with zeros
	for (std::size_t i=0; i!=nu.size(); ++i) {
		for (std::size_t j=0; j!=nu[i].size(); ++j) {
			nu[i](j)=0;
		}
		//now fill in nonzero terms using model
		sparse_vec stoich=reactions[i].getStoichiometry();
		typedef sparse_vec::iterator sparse_iterator;
		sparse_iterator it;
		for (it=stoich.begin(); it!=stoich.end(); ++it) {
			nu[i](it.index())=*it;
		}
	}	
	NU=nu;
}


void SlowScaleSSA::seed(int seed) {
	randomGenerator.Seed(seed);
}

double SlowScaleSSA::selectStepSize()	{
	if (slowPropensitySum<0.0) {
//		std::cout << "discovered negative propensity sum, recalculating all propensities...\n";
		//if slowPropensitySum negative, recalculate all propensities
		calculateAllSlowPropensities();
		//if still negative, give warning and return infinity
		if (slowPropensitySum<0.0) {
			if (!seenNegativePropensityWarning) {
				std::cerr << "StochKit WARNING (SlowScaleSSA::selectStepSize): slowPropensitySum<0, returning step size=infinity (this message will only be displayed once per thread).\n";
				seenNegativePropensityWarning=true;
			}
//			std::cout << "effective population=\n";
//			for (std::size_t i=0; i!=currentEffectivePopulation.size(); ++i) {
//				std::cout << currentEffectivePopulation[i] << "\n";
//			}
			return std::numeric_limits<double>::infinity();
		}
	}
	return randomGenerator.Exponential(1.0/slowPropensitySum);
}

void SlowScaleSSA::calculateAllSlowPropensities() {
	slowPropensitySum=0.0;
//	std::cout << "in calculateAllSlowPropensities, NumberOfSlowReactions="<<NumberOfSlowReactions<<"\n";
	
//	std::cout << "currentEffectivePopulation=\n";
//	for (std::size_t i=0; i!=currentEffectivePopulation.size(); ++i) {
//		std::cout << currentEffectivePopulation(i) << "\t";
//	}
//	std::cout << "\n";
	
	for (std::size_t i=0; i!=NumberOfSlowReactions; ++i) {
		currentSlowPropensities[slowReactionIndexes[i]]=reactions[slowReactionIndexes[i]].propensity(currentEffectivePopulation);
//		std::cout << "currentSlowPropensities["<<i<<"]= original index "<<slowReactionIndexes[i]<<"="<<currentSlowPropensities[slowReactionIndexes[i]]<<"\n";
		slowPropensitySum+=currentSlowPropensities[slowReactionIndexes[i]];
	}
}

//void SlowScaleSSA::partition(std::vector<std::size_t> fastReactionIndexes, std::vector<std::size_t> slowReactionIndexes) {
void SlowScaleSSA::updateAfterChangedVFP() {

//	std::cout << "in ssssa.updateAfterChangedVFP...\n";

	std::vector<std::size_t>& fastReactionIndexes=vfp.getFastReactionIndexesRef();	

	//get current list of slow reaction indexes by taking set difference of complete reaction index list and fast reaction index list
	slowReactionIndexes.clear();
	std::vector<size_t> allReactionIndexes(reactions.size());
	for (std::size_t i=0; i!=reactions.size(); ++i) {
		allReactionIndexes[i]=i;
	}
	std::set_difference(allReactionIndexes.begin(),allReactionIndexes.end(),fastReactionIndexes.begin(),fastReactionIndexes.end(), inserter(slowReactionIndexes,slowReactionIndexes.begin()));
		
//	std::cout << "after set difference, slowReactionIndexes.size()="<<slowReactionIndexes.size()<<"\n";
		
	NumberOfSlowReactions=slowReactionIndexes.size();

	//iterate over all A+A->something reactions
	//if A is a fast species, change propensity function to propensity11_ode, else set to propensity11
	for (std::size_t i=0; i!=AplusAreactions.size(); ++i) {
		std::size_t rxnIndex=AplusAreactions[i];
		if (vfp.isSpeciesFast(reactions[rxnIndex].getReactants()[0].getSpeciesIndex()) && std::find(fastReactionIndexes.begin(), fastReactionIndexes.end(),rxnIndex)==fastReactionIndexes.end()) {
//			std::cout << "setting propensity function for reaction "<<rxnIndex<<" to propensity11_ode\n";
			reactions[rxnIndex].propensityFunction=&ElementaryReaction::propensity11_ode;
		}
		else {
//			std::cout << "setting propensity function for reaction "<<rxnIndex<<" to propensity11\n";
			reactions[rxnIndex].propensityFunction=&ElementaryReaction::propensity11;
		}
	}
	
	//create a dependency graph
	//when slow reaction (reindexed) fires, we need to update some slow propensities
	//but the equilibrium calculation also affects some additional species, so
	//we need to update tke slow propensites affected by that too
	//first construct partial dependency graph based on just the slow reactions influence on slow propensities
	ssDependencyGraph=buildDependencyGraph(reactions);
	
	//right now, ssDependencyGraph contains influence on fast propensities, shouldn't be
	//loop over, clear entries for fast reactions and remove effect on fast propensities
	//first, create a list of fast reaction indexes
	for (std::size_t i=0; i!=ssDependencyGraph.size(); ++i) {
		if (std::find(fastReactionIndexes.begin(),fastReactionIndexes.end(),i)!=fastReactionIndexes.end()) {
			//rxn i is fast, so doesn't need an entry in dependency graph...i guess doesn't hurt either...
			ssDependencyGraph[i].clear();
		}
		else {
			//rxn i is slow, remove all fast rxns from ssDependencyGraph[i]
			//i assume they're sorted...right?
			std::vector<std::size_t> newv(ssDependencyGraph[i].size());
			std::vector<std::size_t>::iterator it;
			it=std::set_difference(ssDependencyGraph[i].begin(),ssDependencyGraph[i].end(),fastReactionIndexes.begin(),fastReactionIndexes.end(),newv.begin());
			newv.resize( int(it-newv.begin()) );
			ssDependencyGraph[i]=newv;
		}
	}
	
	
	//now we need to get the influence of the equilibrium calculation on the slow propensities

	//construct list of slow reactions whose propensity depends on a fast species
	//construct one list for each independent virtual fast process
	std::vector< std::vector<std::size_t> > slowRxnsThatDependOnFastSpecies(vfp.current_ivfps.size());


	for (std::size_t j=0; j!=NumberOfSlowReactions; j++) {
		for (std::size_t k=0; k!=reactions[slowReactionIndexes[j]].getReactants().size(); ++k) {
//			std::cout << "slow reaction "<<j<<" has reactant "<<slowReactions[j].getReactants()[k].getSpeciesIndex()<< std::endl;
			//see if reactant is in list of fast species
			std::size_t thereactantindex=reactions[slowReactionIndexes[j]].getReactants()[k].getSpeciesIndex();

			//loop over ivfps
			for (std::size_t m=0; m!=vfp.current_ivfps.size(); ++m) {
				std::vector<std::size_t> vfpmFastSpeciesIndexes=vfp.all_precompiled_ivfps[vfp.current_ivfps[m]].getFastSpeciesIndexes();
				if (std::find( vfpmFastSpeciesIndexes.begin(),vfpmFastSpeciesIndexes.end(), thereactantindex) != vfpmFastSpeciesIndexes.end()) {
					slowRxnsThatDependOnFastSpecies[m].push_back(slowReactionIndexes[j]);
//					std::cout << "slow reaction "<<j<<" affects ivfp "<<m<<" due to reactant index "<<thereactantindex<<"\n";
				}
			}
			
		}
	}


	//sort and remove duplicates
	for (std::size_t m=0; m!=vfp.current_ivfps.size(); ++m) {
		std::sort(slowRxnsThatDependOnFastSpecies[m].begin(),slowRxnsThatDependOnFastSpecies[m].end());
		slowRxnsThatDependOnFastSpecies[m].erase(std::unique(slowRxnsThatDependOnFastSpecies[m].begin(),slowRxnsThatDependOnFastSpecies[m].end()),slowRxnsThatDependOnFastSpecies[m].end());
	}
		
	//if slow rxn i affects fast subsystem, add slowRxnsThatDependOnFastSpecies to slow rxn i's dependency graph
	for (std::size_t i=0; i!=NumberOfSlowReactions; ++i) {
		for (std::size_t m=0; m!=vfp.current_ivfps.size(); ++m) {

			if (!vfp.all_precompiled_ivfps[vfp.current_ivfps[m]].slowRxnStoichIsZero[slowReactionIndexes[i]]) {
				ssDependencyGraph[slowReactionIndexes[i]].insert(ssDependencyGraph[slowReactionIndexes[i]].end(),slowRxnsThatDependOnFastSpecies[m].begin(),slowRxnsThatDependOnFastSpecies[m].end());
				std::sort(ssDependencyGraph[slowReactionIndexes[i]].begin(),ssDependencyGraph[slowReactionIndexes[i]].end());
				ssDependencyGraph[slowReactionIndexes[i]].erase(std::unique(ssDependencyGraph[slowReactionIndexes[i]].begin(),ssDependencyGraph[slowReactionIndexes[i]].end()),ssDependencyGraph[slowReactionIndexes[i]].end());
			}
		}
	}

	
	//build slow reaction slow species stoichiometry

	//copy full (fast and slow) stoich into slowRxnSlowSpeciesStoich

	slowRxnSlowSpeciesStoich=NU;

	//set all fast species stoichs to 0	
	for (std::size_t i=0; i!=slowReactionIndexes.size(); ++i) {
		sparse_vec stoich=reactions[slowReactionIndexes[i]].getStoichiometry();
		//loop over nonzero elements
		typedef sparse_vec::iterator sparse_iterator;
		sparse_iterator it;
		for (it=stoich.begin(); it!=stoich.end(); ++it) {
			if (vfp.isSpeciesFast(it.index())) {
				slowRxnSlowSpeciesStoich[slowReactionIndexes[i]](it.index())=0;
			}
		}
	}
		

//	std::cout << "fast species indexes are:\n";
//	std::vector<std::size_t> fastSpecies=vfp.getFastSpeciesIndexesRef();
//	for (std::size_t i=0; i!=fastSpecies.size(); ++i) {
//		std::cout << fastSpecies[i] << "\t";
//	}
//	exit(1);


//	std::cout << "exiting ssssa.updateAfterChangedVFP...\n";
}

int SlowScaleSSA::selectSlowReaction() {
	previousSlowReactionIndex=-1;
//	std::cout << "in SlowScaleSSA::selectSlowReaction...\n";
//	std::cout << "effective population:\n";
//	for (std::size_t i=0; i!=currentEffectivePopulation.size(); ++i) {
//		std::cout << "currentEffectivePopulation["<<i<<"]="<<currentEffectivePopulation[i]<<"\n";
//	}

	//previousSlowReactionIndex iterates over just the slow reaction indexes

	//generate a uniform random number between (0,slowPropensitySum)
	double r=randomGenerator.ContinuousOpen(0,1)*slowPropensitySum;
	double jsum=0;
//		std::cout << "NumberOfSlowReactions="<<NumberOfSlowReactions<<"\n";
	while (jsum < r) {
		++previousSlowReactionIndex;
//			std::cout << "previous slow reaction index = "<<previousSlowReactionIndex<<"\n";
		//test that we don't run off end of array
		if (previousSlowReactionIndex==(int)NumberOfSlowReactions) {
			calculateAllSlowPropensities();
			return selectSlowReaction();
		}
		else {
//			std::cout << "(slow) propensity "<<slowReactionIndexes[previousSlowReactionIndex]<<" is "<<currentSlowPropensities[slowReactionIndexes[previousSlowReactionIndex]]<<"\n";
			jsum+=currentSlowPropensities[slowReactionIndexes[previousSlowReactionIndex]];
		}
	}
  
//	indexAndPropensityOfSelectedSlowReaction.push_back(std::make_pair(slowReactionIndexes[previousSlowReactionIndex],currentSlowPropensities[slowReactionIndexes[previousSlowReactionIndex]]));
  
  	//before returning real (original) reaction index, have to convert previousSlowReactionIndex
	//by looking up in slowReactionIndexes

//	return previousSlowReactionIndex;

	if (previousSlowReactionIndex==-1) {
		//we should never get here, but print out stuff to figure out why..
		//actually, we can get here if random generator returns exactly zero, which it does sometimes.
//		std::cout << "returning -1 in SlowScaleSSA::selectSlowReaction, here's more details:\n";
		
//		std::cout << "r="<<r<<"\n";
		if (r==0.0) {
//			std::cout << "random number generator returned EXACTLY zero! Trying again...\n";
			return selectSlowReaction();
		}
		else {
//			std::cout << "returned -1 in SlowScaleSSA::selectSlowReaction, and random number generator did not return exactly zero...more info: \n";
			std::cout << "StochKit ERROR (SlowScaleSSA::selectSlowReaction): select of slow reaction returned invalid index. Terminating.\n";
			exit(1);
		}
//		std::cout << "setting jsum=0...\n";
//		jsum=0;
//	 	while (jsum < r) {
//			++previousSlowReactionIndex;
//			std::cout << "previous slow reaction index = "<<previousSlowReactionIndex<<"\n";
//			//test that we don't run off end of array
//			if (previousSlowReactionIndex==(int)NumberOfSlowReactions) {
//				calculateAllSlowPropensities();
//				return selectSlowReaction();
//			}
//			else {
//				std::cout << "(slow) propensity "<<slowReactionIndexes[previousSlowReactionIndex]<<" is "<<currentSlowPropensities[slowReactionIndexes[previousSlowReactionIndex]]<<"\n";
//				jsum+=currentSlowPropensities[slowReactionIndexes[previousSlowReactionIndex]];
//			}
//		}
//
//		return -1;
	}
	
	return slowReactionIndexes[previousSlowReactionIndex];
}

bool SlowScaleSSA::fireSlowReaction(int reactionIndex) {
//	std::cout << "in ssSSA fireSlowReaction index "<<reactionIndex<<")\n";

	if (reactionIndex==-1) {
		std::cout << "StochKit ERROR (SlowScaleSSA::fireSlowReaction): returning false in ssssa::fire because reactionIndex==-1 (bug).\n";
		return false;
	}
	else {
	

		if (!vfp.fireSlowReaction(reactionIndex,currentEffectivePopulation,currentTime,currentSlowPropensities[reactionIndex])) {
//			std::cout << "returning false in ssssa::fire because mvfp.fire failed.\n";
			return false;
//			std::cout << "call to vfp.fireSlowReaction failed! Terminating.\n";
//			exit(1);
		}
		

//	std::cout << "effective population before adding slowRxnSlowSpeciesStoich:\n";
//	for (std::size_t i=0 ; i!=currentEffectivePopulation.size(); ++i) {
//		std::cout << "population["<<i<<"]="<<currentEffectivePopulation(i)<<"\n";
//	}
//	std::cout << "\n";

		currentEffectivePopulation+=slowRxnSlowSpeciesStoich[reactionIndex];			
//			std::cout << "just added slowRxnSlowSpeciesStoich of:\n";
//			for (std::size_t i=0; i!=slowRxnSlowSpeciesStoich[reactionIndex].size(); ++i) {
//				std::cout << "\t"<< slowRxnSlowSpeciesStoich[reactionIndex](i);
//			}
//			std::cout << "\n";
//			exit(1);

		//update slow propensities
		std::size_t affectedReactionIndex;
		double oldPropensity;
		for (std::size_t i=0; i!=ssDependencyGraph[reactionIndex].size(); ++i) {
			affectedReactionIndex=ssDependencyGraph[reactionIndex][i];
			oldPropensity=currentSlowPropensities[affectedReactionIndex];
			currentSlowPropensities[affectedReactionIndex]=reactions[affectedReactionIndex].propensity(currentEffectivePopulation);
//			std::cout << "currentSlowPropensities[affectedReactionIndex="<<affectedReactionIndex<<"]="<<currentSlowPropensities[affectedReactionIndex]<<"\n";
			slowPropensitySum+=currentSlowPropensities[affectedReactionIndex]-oldPropensity;
		}

//	std::cout << "after firing, (slow) propensities are: \n";
//	for (std::size_t i=0; i!=slowReactionIndexes.size(); ++i) {
//		std::cout << "rxn "<<slowReactionIndexes[i]<<" propensity = "<< currentSlowPropensities[slowReactionIndexes[i]] <<"\n";
//	}
//	std::cout << "slow propensity sum="<<slowPropensitySum<<"\n";
		
		return true;
	}
}

void SlowScaleSSA::initialize(double startTime, double defaultRelaxationTime) {
	previousSlowReactionIndex=-1;
	currentTime=startTime;
	currentEffectivePopulation=initialPopulation;

//	std::cout << "done setting effective pop, initializing vfp...\n";
	vfp.initialize(defaultRelaxationTime,initialPopulation,currentEffectivePopulation);


	slowReactionIndexes=initialSlowReactions;
	ssDependencyGraph=initialssDependencyGraph;
	NumberOfSlowReactions=initialNumberOfSlowReactions;
	slowRxnSlowSpeciesStoich=initialSlowRxnSlowSpeciesStoich;


//	std::cout << "calculating all slow propensities in ssssa.initialize...\n";
	calculateAllSlowPropensities();
	
	stepsSinceLastPartition=0;//reset counter
	
//	std::cout << "done initializing vfp...\n";
}

bool SlowScaleSSA::dynamic_partition(std::size_t realizationNumber, std::string files_directory) {
	bool accuracy_was_violated=vfp.accuracy_violated;
	std::size_t slowSteps=stepsSinceLastPartition;
	
	stepsSinceLastPartition=0;//reset counter
	
	vfp.reset_accuracy_violated();
	
//	std::cout << "setting new group of fast reactions...\n";
	
	std::vector<std::size_t> previous_current_ivfps=vfp.current_ivfps;

	//sample fast species to get a real population sample before changing vfp...
	//create a realizable currentEffectivePopulation
	dense_vec samplePop=currentEffectivePopulation;
	for (std::size_t i=0; i!=previous_current_ivfps.size(); ++i) {
		std::vector<std::pair<std::size_t,double> > fastsample=vfp.all_precompiled_ivfps[previous_current_ivfps[i]].sampleFastSpecies();
		for (std::size_t j=0; j!=fastsample.size(); ++j) {
			samplePop(fastsample[j].first)=fastsample[j].second;
		}
	}
//	std::cout << "full sample population:\n";
//	for (std::size_t i=0; i!=samplePop.size(); ++i) {
//		std::cout << samplePop(i) << "\t";
//	}
//	std::cout << "\n";	

	currentEffectivePopulation=samplePop;
	
	//this time should be set automatically based on simulation time and/or relaxation time etc.
//	double finalTime=15000;
//	double finalTime=100;
//	double max_fast_relaxation_time=15000.0/50.0;
//	std::cout << "hard-coding ffe sim time ("<<finalTime<<") and max_fast_relaxation_time ("<<max_fast_relaxation_time<<")...\n";
	
	std::vector<double> sampleTimes;
//	sampleTimes.push_back(finalTime/2.0);
//	sampleTimes.push_back(finalTime);
	sampleTimes.push_back(defaultFFERunTime/2.0);
	sampleTimes.push_back(defaultFFERunTime);
	double max_fast_relaxation_time=defaultFFERunTime/5.0;

//	std::cout << "in ssssa.dynamic_partition, about to run ffe.run...\n";
	vfp.ffe.run(0, sampleTimes, currentEffectivePopulation);
	
//	std::cout << "cumulatve firing frequency estimate (tf="<<finalTime<<"):\n";
//	for (std::size_t i=0; i!=NumberOfReactions; ++i) {
//		std::cout << "rxn "<<i<<": "<<vfp.ffe.cumulativeFiringFrequencyEstimate[i]<<"\n";
//	}

	//now use those estimated firing frequencies to construct "groups"

//	vfp.groups.update(samplePop,vfp.ffe.cumulativeFiringFrequencyEstimate);
	vfp.groups.update(vfp.ffe.getSimulationOutputPopulationsRef().back(),vfp.ffe.cumulativeFiringFrequencyEstimate,defaultFFERunTime);//this must be setting simulation info into "groups" object

//std::cout << "try calling ssa.vfp.groups.partition...\n";
vfp.groups.partition(reactions, max_fast_relaxation_time);

//std::cout << "terminating in ssssa.dynamic_partition...\n";
//exit(1);
//	std::cout << "press enter key to continue.\n";
//	std::cin.get();


	std::vector<std::size_t> newFastReactions;

//	std::cout << "dynamic_partition selected the following ivfp reactions:\n";
	for (std::size_t i=0; i!=vfp.groups.currentFP.fast_groups.size(); ++i) {
		for (std::set<std::size_t>::iterator it=vfp.groups.currentFP.fast_groups[i].fastReactionIndexes.begin(); it!=vfp.groups.currentFP.fast_groups[i].fastReactionIndexes.end(); ++it) {
//			std::cout << *it << "\t";
			newFastReactions.push_back(*it);
		}		
	}

	sort(newFastReactions.begin(),newFastReactions.end());

//	std::cout << "\n\n ABOUT TO SET FAST REACTION INDEXES...\n\n";

//	std::cout << "calling setFastReactionIndexes with files_directory="<<files_directory<<"\n";

	partitionOptimizer.record_partition_data(currentTime, realizationNumber, newFastReactions, slowSteps, accuracy_was_violated);

	if (!vfp.setFastReactionIndexes(newFastReactions, files_directory)) {
		fastReactionsForOutput=newFastReactions;
		samplePopForOutput=samplePop;
		return false;//encountered at least one new ivfp, need to recompile
	}
	updateAfterChangedVFP();
	
	
	//call current ivfps .initialize functions here...
//	std::cout << "after changing, we have "<<vfp.current_ivfps.size()<<" current ivfps...\n";
	for (std::size_t i=0; i!=vfp.current_ivfps.size(); ++i) {
		vfp.all_precompiled_ivfps[vfp.current_ivfps[i]].initialize(defaultRelaxationTime,samplePop,currentEffectivePopulation);
	}

	calculateAllSlowPropensities();

//	std::cout << "(done with dynamic_partition(), press enter key to continue.\n";
//	std::cin.get();

	return true;
}//dynamic_partition

