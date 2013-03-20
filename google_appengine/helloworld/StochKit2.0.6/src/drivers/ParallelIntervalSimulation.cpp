#include "ParallelIntervalSimulation.h"

namespace STOCHKIT
{
	ParallelIntervalSimulation::ParallelIntervalSimulation(int ac, char* av[]):commandLine(ac,av), masterProc(0), engine((boost::uint32_t) std::time(0))
	{
		numberOfProcesses=commandLine.getProcesses();
		//if default number of processes, 0, is chosen, automatically determine
		if (numberOfProcesses==0) {
			numberOfProcesses=boost::thread::hardware_concurrency();
			if (numberOfProcesses==0) {
				std::cout << "StochKit MESSAGE (ParallelIntervalSimulation()): unable to detect number of processors.  Simulation will run on one processor.\n";
				numberOfProcesses=1;
			}
		}

		if (commandLine.getUseSeed()) {
			boost::mt19937 newEngine(commandLine.getSeed());
			engine=newEngine;
		}
		//give a warning if they're about to generate a lot of data
		warnIfLargeOutput();
		std::cout << std::flush;
	}

	void ParallelIntervalSimulation::run(std::string executableName) {  
		boost::uniform_int<> distribution(1, RAND_MAX) ;
		boost::variate_generator<boost::mt19937, boost::uniform_int<> > seedOfNewThread(engine, distribution);

		StandardDriverUtilities::createOutputDirs(commandLine,true,numberOfProcesses);
		std::cout << "StochKit MESSAGE: created output directory \""+commandLine.getOutputDir()+"\"...\n";

		//record full command in a log file
		std::string command;

		//need to convert size_t to strings
		std::string threadNumString;
		std::size_t subRealizations;
		std::string subRealizationsString;
		std::string seedString;
		std::string assignmentCounterString;

		std::size_t numRuns=commandLine.getRealizations();
		std::cout << "running simulation...";
		std::cout.flush();

#ifdef WIN32
		LARGE_INTEGER begin, end, freq;
		QueryPerformanceFrequency(&freq);
		QueryPerformanceCounter(&begin);
#else
		timeval timer;
		double startTime, endTime;
		gettimeofday(&timer,NULL);
		startTime=timer.tv_sec+(timer.tv_usec/1000000.0);
#endif
		int newseed;

		std::size_t assignmentCounter=0;

		for (std::size_t i=0; i<numberOfProcesses; i++) {
			newseed = seedOfNewThread();
			seedString=StandardDriverUtilities::size_t2string(newseed);

			subRealizations = assignment(numRuns, i);
			numRuns -= subRealizations;

			processorRealizationAssignments.push_back(subRealizations);
			if (i==masterProc && processorRealizationAssignments[i]==0) {
				++masterProc;
			}

			if (subRealizations>0) {
				threadNumString=StandardDriverUtilities::size_t2string(i);
				subRealizationsString=StandardDriverUtilities::size_t2string(subRealizations);

				command=executableName+commandLine.getCmdArgs()+" --use-existing-output-dirs --histograms-dir histograms/.parallel/thread"+threadNumString+" --stats-dir stats/.parallel --means-file means"+threadNumString+".txt --variances-file variances"+threadNumString+".txt --stats-info-file .stats-info-"+threadNumString+".txt";

				//append seed to command
				if (!commandLine.getUseSeed()) {
					command+=" --seed "+seedString;
				}
				else {
					//seed already exists in the command line arguments, so we have to replace it with seedString
					command=ParallelIntervalSimulation::modifyCmdArgsSeed(command,seedString);
				}

				command=ParallelIntervalSimulation::modifyCmdArgsRealizations(command,subRealizationsString);

				//if keeping trajectories, need to supply a trajectory offset
				if (commandLine.getKeepTrajectories()) {
					assignmentCounterString=StandardDriverUtilities::size_t2string(assignmentCounter);
					command+=" --trajectories-offset "+assignmentCounterString;
					//increment assignmentCounter
					assignmentCounter+=subRealizations;
				}

				//if keeping histograms, thread 0 needs to write a histogram info file
				if (commandLine.getKeepHistograms() && i==masterProc) {
					command+=" --histograms-info-file ../.histogram-info.txt ";//should create it in the histograms/.parallel directory
				}

				//redirect messages from executable to log file
#ifdef WIN32
				command+=" > \""+commandLine.getOutputDir()+"\\.StochKit\\thread-log"+threadNumString+".txt\"";
				command="\""+command+"\" 2>&1";
#else
				command+=" > "+commandLine.getOutputDir()+"/.StochKit/thread-log"+threadNumString+".txt 2>&1";
#endif

				sthreads.create_thread(boost::bind(&ParallelIntervalSimulation::executable, this, command));
#ifdef WIN32
				std::string commandStr="\"echo 'THREAD "+threadNumString+":"+command+"' >> \""+commandLine.getOutputDir()+"/.StochKit/command-log.txt\"\"";  
#else
				std::string commandStr="echo 'THREAD "+threadNumString+":"+command+"' >> "+commandLine.getOutputDir()+"/.StochKit/command-log.txt"; 
#endif
				system(commandStr.c_str());
			}
		}

		//wait for all threads to finish
		sthreads.join_all();
		double elapsedTime;
#ifdef WIN32
		QueryPerformanceCounter(&end);
		elapsedTime=(double)(end.QuadPart-begin.QuadPart)/freq.QuadPart;
#else
		gettimeofday(&timer,NULL);
		endTime=timer.tv_sec+(timer.tv_usec/1000000.0);
		elapsedTime=endTime-startTime;
#endif
		std::cout << "finished (simulation time approx. " << elapsedTime << " second";
		if (elapsedTime!=1) {
			std::cout << "s";
		}
		std::cout << ")"<<std::endl;
	}

	inline void ParallelIntervalSimulation::executable(std::string command) {
		system(command.c_str());
	}

	inline std::size_t ParallelIntervalSimulation::assignment(std::size_t totalRealizations, std::size_t threadid) {
		if(threadid<(numberOfProcesses-1)){
			std::size_t subRealizations = totalRealizations/(numberOfProcesses-threadid);
			return subRealizations;
		}else{
			return totalRealizations;
		}
	}

	void ParallelIntervalSimulation::mergeOutput() {
		std::string threadNumString="";
		std::string command="";
		bool empty_flag = true;
#ifdef WIN32
		std::ofstream editor;
		std::string OutputFile;
		std::string OutputDir=commandLine.getOutputDir();
#endif

		for (std::size_t i=0; i<numberOfProcesses; i++) {
			threadNumString=StandardDriverUtilities::size_t2string(i);
#ifdef WIN32
			command=OutputDir+"\\.StochKit\\thread-log"+threadNumString+".txt";
			boost::filesystem::path p(command, boost::filesystem::native);
			//test 

			int emptyLog=0;
			if(!boost::filesystem::exists(p))
				emptyLog=1;
			else if(boost::filesystem::file_size(p)==0)
				emptyLog=1;
#else
			command="test -s "+commandLine.getOutputDir()+"/.StochKit/thread-log"+threadNumString+".txt";
			int emptyLog=system(command.c_str());
#endif

			if (!emptyLog) {
				empty_flag = false;
#ifdef WIN32
				OutputFile=OutputDir+"\\.StochKit\\pthread-log"+threadNumString;
				editor.open(OutputFile.c_str());
				editor<<"THREAD "<<threadNumString<<" :\n";
				editor.close();
				command="copy /B \""+OutputFile+"\" + \""+OutputDir+"\\.StochKit\\thread-log"+threadNumString + ".txt\" \""+OutputFile+"\" >nul";
#else
				//command="sed \'1 i\\THREAD "+threadNumString+" :\' "+commandLine.getOutputDir()+"/.StochKit/thread-log"+threadNumString + ".txt > " + commandLine.getOutputDir()+"/.StochKit/pthread-log"+threadNumString;
				command="echo 'THREAD "+threadNumString+" :'> "+commandLine.getOutputDir()+"/.StochKit/pthread-log"+threadNumString+"; cat "+commandLine.getOutputDir()+"/.StochKit/thread-log"+threadNumString + ".txt >> " + commandLine.getOutputDir()+"/.StochKit/pthread-log"+threadNumString;
#endif
				system(command.c_str());
#ifndef WIN32
				command="echo >> \""+ commandLine.getOutputDir()+"/.StochKit/pthread-log"+threadNumString+"\"";
				system(command.c_str());
#endif
			}
		}

		if(!empty_flag){
			//merge thread log files
#ifdef WIN32
			command="copy /B \""+OutputDir+"\\.StochKit\\pthread-log*\" \""+OutputDir+"\\log.txt\" >nul";
#else
			command="cat "+commandLine.getOutputDir()+"/.StochKit/pthread-log* > "+commandLine.getOutputDir()+"/log.txt";
#endif	
			//int emptyLog=system(command.c_str());
			system(command.c_str());

#ifdef WIN32
			command="del /F \""+OutputDir+"\\.StochKit\\pthread-log*\"";
			system(command.c_str());
#else
			//command="rm -f "+commandLine.getOutputDir()+"/.StochKit/pthread-log*";
			//system(command.c_str());
#endif



			//customize message to user based on if "ERROR" appears in log or not
#ifdef WIN32
			command="find \"ERROR\" \""+OutputDir+"\\log.txt\" >nul";//for visual studio
#else
			command="grep -q 'ERROR' "+commandLine.getOutputDir()+"/log.txt";
#endif
			int grepERROR=system(command.c_str());
			if (grepERROR==0) {
				std::cout << "StochKit ERROR: errors encountered during simulation, exiting...\n";
#ifdef WIN32
				std::cout << "error messages written to log file: \"" << OutputDir<<"\\log.txt\"\n";
#else
				std::cout << "error messages written to log file: \"" << commandLine.getOutputDir()<<"/log.txt\"\n";
#endif
				exit(1);//exit here since merging stats probably won't work and any other data could be invalid
			}
			else {
#ifdef WIN32
				std::cout << "StochKit WARNING: messages written to log file: \"" << OutputDir<<"\\log.txt\"\n";   
#else
				std::cout << "StochKit WARNING: messages written to log file: \"" << commandLine.getOutputDir()<<"/log.txt\"\n"; 
#endif
			}
		}

		//	std::string threadNumString;//used for merging stats and histograms

		//merge stats output	
		if (commandLine.getKeepStats()) {
			std::cout << "creating statistics output files...\n";
			std::cout.flush();

			typedef StatsOutput<StandardDriverTypes::populationType> StatsOutputType;

			//masterProc is first processor that was assigned at least one realization
			//we do assume that at least one realization was run
#ifdef WIN32
			StatsOutputType master=StatsOutputType::createFromFiles(OutputDir+"\\"+commandLine.getStatsDir()+"\\.parallel\\means"+StandardDriverUtilities::size_t2string(masterProc)+".txt",OutputDir+"\\"+commandLine.getStatsDir()+"\\.parallel\\variances"+StandardDriverUtilities::size_t2string(masterProc)+".txt",OutputDir+"\\"+commandLine.getStatsDir()+"\\.parallel\\.stats-info-"+StandardDriverUtilities::size_t2string(masterProc)+".txt");
#else
			StatsOutputType master=StatsOutputType::createFromFiles(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/.parallel/means"+StandardDriverUtilities::size_t2string(masterProc)+".txt",commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/.parallel/variances"+StandardDriverUtilities::size_t2string(masterProc)+".txt",commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/.parallel/.stats-info-"+StandardDriverUtilities::size_t2string(masterProc)+".txt");
#endif
			StatsOutputType tmpOut;

			//merge data from other processors onto the master
			for (std::size_t i=masterProc+1; i<numberOfProcesses; ++i) {
				if (processorRealizationAssignments[i]>0) {
					threadNumString=StandardDriverUtilities::size_t2string(i);
#ifdef WIN32
					tmpOut=StatsOutputType::createFromFiles(OutputDir+"\\"+commandLine.getStatsDir()+"\\.parallel\\means"+threadNumString+".txt",OutputDir+"\\"+commandLine.getStatsDir()+"\\.parallel\\variances"+threadNumString+".txt",OutputDir+"\\"+commandLine.getStatsDir()+"\\.parallel\\.stats-info-"+threadNumString+".txt");
#else
					tmpOut=StatsOutputType::createFromFiles(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/.parallel/means"+threadNumString+".txt",commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/.parallel/variances"+threadNumString+".txt",commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/.parallel/.stats-info-"+threadNumString+".txt");
#endif
					master.merge(tmpOut);
				}
			}

			if (commandLine.getLabel()) {
#ifdef WIN32
				IntervalOutput<StandardDriverTypes::populationType>::writeLabelsToFile(OutputDir+"\\"+commandLine.getStatsDir()+"\\means.txt",commandLine.getSpeciesNames());
				master.writeMeansToFile(OutputDir+"\\"+commandLine.getStatsDir()+"\\means.txt",true,true);
				IntervalOutput<StandardDriverTypes::populationType>::writeLabelsToFile(OutputDir+"\\"+commandLine.getStatsDir()+"\\variances.txt",commandLine.getSpeciesNames());
				master.writeVariancesToFile(OutputDir+"\\"+commandLine.getStatsDir()+"\\variances.txt",true,true);		  
			}
			else {
				master.writeMeansToFile(OutputDir+"\\"+commandLine.getStatsDir()+"\\means.txt");
				master.writeVariancesToFile(OutputDir+"\\"+commandLine.getStatsDir()+"\\variances.txt");
			}
#else
				IntervalOutput<StandardDriverTypes::populationType>::writeLabelsToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/means.txt",commandLine.getSpeciesNames());
				master.writeMeansToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/means.txt",true,true);
				IntervalOutput<StandardDriverTypes::populationType>::writeLabelsToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/variances.txt",commandLine.getSpeciesNames());
				master.writeVariancesToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/variances.txt",true,true);		  
			}
			else {
				master.writeMeansToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/means.txt");
				master.writeVariancesToFile(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/variances.txt");
			}
#endif

			//after merging stats, remove stats/parallel directory
#ifdef WIN32
			boost::filesystem::remove_all(OutputDir+"\\"+commandLine.getStatsDir()+"\\.parallel");
#else
			boost::filesystem::remove_all(commandLine.getOutputDir()+"/"+commandLine.getStatsDir()+"/.parallel");
#endif
		}

		//merge histograms here
		if (commandLine.getKeepHistograms()) {
			std::cout << "creating histogram output files...\n";
			std::cout.flush();

			//read in number of species from info file
#ifdef WIN32
			std::string infoFileName=OutputDir+"\\"+commandLine.getHistogramsDir()+"\\.parallel\\.histogram-info.txt";
#else
			std::string infoFileName=commandLine.getOutputDir()+"/"+commandLine.getHistogramsDir()+"/.parallel/.histogram-info.txt";
#endif

			std::ifstream fin(infoFileName.c_str());
			if (!fin) {
				std::cerr << "StochKit ERROR (ParallelIntervalSimulation::mergeOutput): Unable to open histograms info file.\n";
				exit(1);
			}
			std::size_t numberOfSpecies;
			fin >> numberOfSpecies;//first line of info file contains number of species
			fin.close();
			//loop over intervals, species, threads
			typedef HistogramSingle<StandardDriverTypes::populationType::value_type> histogramType;
			histogramType masterHistogram;
			histogramType tmpHistogram;
			std::string intervalStr;
			std::string speciesIndexStr;

			std::size_t intervals=commandLine.getIntervals();
			std::vector<double> outputTimes=IntervalOutput<StandardDriverTypes::populationType>::createUniformOutputTimes(0.0,commandLine.getSimulationTime(),intervals);

			for (std::size_t i=0; i!=outputTimes.size(); ++i) {
				for (std::size_t j=0; j!=numberOfSpecies; ++j) {
					intervalStr=StandardDriverUtilities::size_t2string(i);
					speciesIndexStr=StandardDriverUtilities::size_t2string(j);
					threadNumString=StandardDriverUtilities::size_t2string(masterProc);

#ifdef WIN32
					masterHistogram=histogramType::createFromFiles(OutputDir+"\\"+commandLine.getHistogramsDir()+"\\.parallel\\thread"+threadNumString+"\\hist_"+speciesIndexStr+"_"+intervalStr+".dat");
#else
					masterHistogram=histogramType::createFromFiles(commandLine.getOutputDir()+"/"+commandLine.getHistogramsDir()+"/.parallel/thread"+threadNumString+"/hist_"+speciesIndexStr+"_"+intervalStr+".dat");
#endif
					for (std::size_t p=masterProc+1; p<numberOfProcesses; ++p) {
						intervalStr=StandardDriverUtilities::size_t2string(i);
						speciesIndexStr=StandardDriverUtilities::size_t2string(j);
						threadNumString=StandardDriverUtilities::size_t2string(p);		
#ifdef WIN32
						tmpHistogram=histogramType::createFromFiles(OutputDir+"\\"+commandLine.getHistogramsDir()+"\\.parallel\\thread"+threadNumString+"\\hist_"+speciesIndexStr+"_"+intervalStr+".dat");	
#else
						tmpHistogram=histogramType::createFromFiles(commandLine.getOutputDir()+"/"+commandLine.getHistogramsDir()+"/.parallel/thread"+threadNumString+"/hist_"+speciesIndexStr+"_"+intervalStr+".dat");
#endif
						masterHistogram.mergeHistogram(tmpHistogram);
					}
					//after merged all processes histogram, write it to file
#ifdef WIN32
					masterHistogram.writeToFile(OutputDir+"\\"+commandLine.getHistogramsDir()+"\\hist_"+commandLine.getSpeciesNames()[j]+"_"+intervalStr+".dat", outputTimes, commandLine.getSpeciesNames()[j]);
#else
					masterHistogram.writeToFile(commandLine.getOutputDir()+"/"+commandLine.getHistogramsDir()+"/hist_"+commandLine.getSpeciesNames()[j]+"_"+intervalStr+".dat", outputTimes, commandLine.getSpeciesNames()[j]);
#endif
				}
			}
			boost::filesystem::remove_all(commandLine.getOutputDir()+"/"+commandLine.getHistogramsDir()+"/.parallel");
		}
		std::cout << "done!\n";
	}

	std::string ParallelIntervalSimulation::modifyCmdArgsRealizations(std::string commandLineArguments, std::string subRealizations) {
		//append a space at the beginning to avoid the condition where string starts with "-r" or "--realizations"
		//this ensures we can find realizations by looking for first occurrence of " -r" or " --realizations"
		std::string tmpArgs=" "+commandLineArguments+" ";
		//find first occurrence of " -r" or " --realizations"
		std::size_t minus_minus_realizations=tmpArgs.find(" --realizations");
		std::size_t minus_r=tmpArgs.find(" -r");

		std::size_t cutStart;
		std::size_t cutEnd;

		if (minus_minus_realizations!=std::string::npos) {//found " --realizations"
			cutStart=minus_minus_realizations;
			cutEnd=tmpArgs.find(" -",cutStart+4);//will find next " -" after " --realizations"
		}
		else {
			if (minus_r==std::string::npos) {
				std::cerr << "StochKit ERROR (ParallelIntervalSimulation::ModifyCmdArgsRealizations): could not find number of realizations in command line arguments\nSimulation terminated.\n";
				exit(1);
			}
			cutStart=minus_r;
			cutEnd=tmpArgs.find(" -",cutStart+4);//will find next " -" after " -r"
		}

		std::string modifiedCmdArgs=tmpArgs.substr(0,cutStart)+" "+"--realizations "+subRealizations+tmpArgs.substr(cutEnd,tmpArgs.length()-cutEnd);
		return modifiedCmdArgs;
	}

	std::string ParallelIntervalSimulation::modifyCmdArgsSeed(std::string commandLineArguments, std::string newSeed) {
		//append a space at the beginning to avoid the condition where string starts with "--seed"
		//this ensures we can find seed by looking for first occurrence of " --seed"
		std::string tmpArgs=" "+commandLineArguments+" ";
		//find first occurrence of " --seed"
		std::size_t minus_minus_seed=tmpArgs.find(" --seed");

		std::size_t cutStart;
		std::size_t cutEnd;

		if (minus_minus_seed!=std::string::npos) {//found " --seed"
			cutStart=minus_minus_seed;
			cutEnd=tmpArgs.find(" -",cutStart+4);//will find next " -" after " --seed"
		}
		else {
			std::cerr << "StochKit ERROR (ParallelIntervalSimulation::ModifyCmdArgsSeed): could not find seed in command line arguments\nSimulation terminated.\n";
			exit(1);
		}


		std::string modifiedCmdArgs=tmpArgs.substr(0,cutStart)+" --seed "+newSeed+tmpArgs.substr(cutEnd,tmpArgs.length()-cutEnd);
		return modifiedCmdArgs;
	}

	void ParallelIntervalSimulation::warnIfLargeOutput() {
		std::size_t numIntervals=commandLine.getIntervals()+1;
		std::size_t numSpecies=commandLine.getSpeciesNames().size();
		std::size_t numRealizations=commandLine.getRealizations();
		std::size_t numFiles=0;
		std::size_t dataSize=0;//bytes, very rough approximation
		if (commandLine.getKeepStats()) {
			numFiles+=2;
			dataSize+=numIntervals*(numSpecies+1)*2*2;//intervals*(species+1 column for time)*2 files * 2 columns including tab character
		}
		if (commandLine.getKeepTrajectories()) {
			numFiles+=numRealizations;
			dataSize+=numRealizations*numIntervals*(numSpecies+1)*2;
		}
		if (commandLine.getKeepHistograms()) {
			numFiles+=numIntervals*numSpecies;
			std::size_t numBins=commandLine.getHistogramBins();
			dataSize+=numIntervals*numSpecies*numBins*2;
		}

		if (numFiles>10000 || dataSize>10000000) {
			std::cout << "StochKit WARNING: simulation will generate large amounts of data (approx. "<<dataSize/1000000<<"MB in "<< numFiles <<" files)...initializing...\n";
		}
		std::cout.flush();
	}

}
