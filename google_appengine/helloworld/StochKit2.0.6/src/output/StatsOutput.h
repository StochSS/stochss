/******************************************************************************
 *  FILE:    StatsOutput.h
 */

#ifndef _STATS_OUTPUT_H_
#define _STATS_OUTPUT_H_

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <iomanip>
#include "boost/foreach.hpp"
#include "boost/tokenizer.hpp"
#include <limits>
#include "IntervalOutput.h"

namespace STOCHKIT
{
 template<typename _populationVectorType>
//STOCHKIT BETA: update to have IntervalOutput member, rather than subclassing
  class StatsOutput : public IntervalOutput<_populationVectorType>
 {	
public:
	void serialize(std::ofstream& outfile) {
		//assumes ofstream position is at the start of this objects serizlied data
		//first write out base class data
		Base::serialize(outfile);

		if (!outfile) {
			std::cerr << "StochKit ERROR (StatsOutput::serialize): Unable to open output file.\n";
			exit(1);
		}

		outfile << m_n << "\n";
	}
	
	void unserialize(std::ifstream& fin) {
		Base::unserialize(fin);

		if (!fin) {
			std::cerr << "StochKit ERROR (StatsOutput::unserialize): Unable to open file.\n";
			exit(1);
		}		
		std::size_t inputSize_t;
		fin >> inputSize_t;
		m_n=inputSize_t;
	}
	

 protected:
  typedef IntervalOutput<_populationVectorType> Base;

  using Base::data;
  using Base::outputTimes;
  using Base::writeLabelsToFile;

  /* to understand this class in terms of the notation from http://www.johndcook.com/standard_deviation.html:
     data[0] is m_oldM
     data[1] is m_newM
     data[2] is m_oldS
     data[3] is m_newS
  */

  std::size_t m_n;

  public:

  StatsOutput() : Base(4)
  {}

  virtual bool initialize(std::size_t realizations, double startTime, double endTime, _populationVectorType& samplePopulationVector) {

    m_n=0;

    //need to set up the stats data structures...
    return Base::initialize(4,startTime,endTime,samplePopulationVector);
  }


  virtual void record(std::size_t realization, std::size_t interval,_populationVectorType population) {
    //should have some checks here...
    //e.g. if realization!=m_n, there is a problem

    _populationVectorType x=Base::speciesSubset.getSubset(population);
    std::size_t xSize=x.size();

    //adapted from B.P. Welford 1962; Knuth's Art of Computer Programming Vol 2, 3rd ed.; www.johndcook.com/standard_deviation.html
    //see note above regarding notaion

    m_n=realization+1;

    if (m_n==1) {
      data[1][interval]=x;
      //create a zero vector for variance (since vector might not initialize to 0)
      _populationVectorType zero(xSize);
      for (std::size_t i=0; i!=xSize; ++i) {
	zero[i]=0.0;
      }
      data[3][interval]=zero;
    }
    else {
      for (std::size_t i=0; i!=xSize; ++i) {
	data[1][interval][i]=data[0][interval][i]+(x[i]-data[0][interval][i])/(double)m_n;
	data[3][interval][i]=data[2][interval][i]+(x[i]-data[0][interval][i])*(x[i]-data[1][interval][i]);	
      }
    }
    data[0][interval]=data[1][interval];
    data[2][interval]=data[3][interval];
  }

  virtual void setSpeciesSubset(std::vector<std::size_t> speciesIndices) {
    Base::setSpeciesSubset(speciesIndices);
  }

  void writeMeansToFile(std::string filename, bool printTime=true, bool append=false, bool highPrecision=false) {
    if (m_n==0) {
      std::cout << "StochKit ERROR (StatsOutput::writeMeansToFile) can't write means to file when number of realizations = 0\n";
    }
    else {
      Base::writeDataToFile(1,filename,printTime,append,highPrecision);
    }
  }

  void writeVariancesToFile(std::string filename, bool printTime=true, bool append=false, bool highPrecision=false) {
    if (m_n==0) {
      std::cout << "StochKit ERROR (StatsOutput::writeVariancesToFile) can't write variances to file when number of realizations = 0" << std::endl;
    }
    else {
      std::ofstream outfile;
      
      if (append) {
	outfile.open(filename.c_str(),std::ios::out | std::ios::app);
      }
      else {
	outfile.open(filename.c_str());
      }
      
      if (!outfile) {
	std::cerr << "StochKit ERROR (StatsOutput::writeVariancesToFile): Unable to open output file\n";
	exit(1);
      }
      
      double currentVariance;
      
      try {
	for (std::size_t interval=0; interval!=outputTimes.size(); ++interval) {
	  if (printTime) {
	    outfile << outputTimes[interval] << "\t";
	  }
	  for (size_t index=0; index!=data[3][interval].size(); ++index) {
	    if (m_n==1) {
	      currentVariance=0.0;
	    }
	    else {
	      currentVariance=data[3][interval][index]/(double)(m_n-1);
	    }
	    if (currentVariance<0.0) {
	      currentVariance=0.0;
	    }
	    //what happens if this value has not yet been written? probably seg fault
	    if (highPrecision) {
	      outfile << std::setprecision(std::numeric_limits<double>::digits10)<<currentVariance << "\t";
	    }
	    else {
	      outfile << std::setprecision(8) << currentVariance << "\t";
	    }
	  }
	  outfile << "\n";
	}
	outfile.close();
      }
      catch (...) {
	std::cout << "StochKit ERROR (StatsOutput::writeVariancesToFile): error writing data to output file.\n";
	exit(1);
      }
    }
  }

  void writeStandardDeviationsToFile(std::string filename, bool printTime=true, bool append=false) {
    if (m_n<=1) {
      std::cout << "StochKit ERROR (StatsOutput::writeStandardDeviationsToFile) can't write standard deviations to file when m_n<=1" << std::endl;
    }
    else {
      std::ofstream outfile;

      if (append) {
	outfile.open(filename.c_str(),std::ios::out | std::ios::app);
      }
      else {
	outfile.open(filename.c_str());
      }

      if (!outfile) {
	std::cerr << "StochKit ERROR (StatsOutput::writeStandardDeviationToFile): Unable to open output file.\n";
	exit(1);
      }

      try{
	for (std::size_t interval=0; interval!=outputTimes.size(); ++interval) {
	  if (printTime) {
	    outfile << outputTimes[interval] << "\t";
	  }
	  for (size_t index=0; index!=data[3][interval].size(); ++index) {
	    //what happens if this value has not yet been written? probably seg fault
	    outfile << std::setprecision(8) << sqrt(data[3][interval][index]/(double)(m_n-1)) << "\t";
	  }
	  outfile << "\n";
	}
	outfile.close();
      }
      catch (...) {
	std::cout << "StochKit ERROR (StatsOutput::writeStandardDeviationToFile): error writing data to output file.\n";
	exit(1);
      }
    }
  }

  virtual void merge(StatsOutput<_populationVectorType> other) {
    //should add checks to ensure it makes sense to merge (debug mode)

    std::size_t new_n=m_n+other.m_n;

    double this_m;//the mean of this
    double this_v;//the variance (with m_n as denominator not m_n-1) of this
    double other_v;//the variance (with other.m_n as denominator) of other

    std::size_t numIntervals=outputTimes.size();
    std::size_t xSize=data[1][0].size();
    //loop over intervals
    for (std::size_t interval=0; interval!=numIntervals; ++interval) {
      //loop over species
      for (std::size_t x=0; x!=xSize; ++x) {
	this_m=data[1][interval][x];

	//compute new mean
	data[1][interval][x]=(m_n*data[1][interval][x] + other.m_n*other.data[1][interval][x])/new_n;

	//compute new variance
	this_v=data[3][interval][x]/(double)m_n;//note denominator is m_n not m_n-1
	other_v=other.data[3][interval][x]/(double)other.m_n;//again note denominator
	//this calculation can lead to significant roundoff error
	data[3][interval][x]=m_n*(this_v+pow(this_m,2.0))+other.m_n*(other_v+pow(other.data[1][interval][x],2.0))-(1.0/(double)new_n)*pow((m_n*this_m+other.m_n*other.data[1][interval][x]),2.0);
      }
      //make sure the value of the "old mean" (m_oldM) is also consistent
      data[0][interval]=data[1][interval];
      //same for "old S"
      data[2][interval]=data[3][interval];
    }
    
    m_n=new_n;
  }


  virtual void merge(std::vector<StatsOutput<_populationVectorType> > others) {
    for (std::size_t i=0; i!=others.size(); ++i) {
      this->merge(others[i]);
    }
  }


  static StatsOutput createFromFiles(std::string meansFileName, std::string variancesFileName, std::string simulationInfoFileName) {
    //read in numberOfRealizations from info file
    std::ifstream fin(simulationInfoFileName.c_str());
    if (!fin) {
      std::cerr << "StochKit ERROR (StatsOutput::createFromFiles): Unable to open simulation info file "<<simulationInfoFileName<<".\n";
      exit(1);
    }
    std::size_t numberOfRealizations;
    fin >> numberOfRealizations;//first line of info file contains number of realizations
    std::size_t numberOfSpecies;
    fin >> numberOfSpecies;
    
    return createFromFiles(meansFileName, variancesFileName, numberOfRealizations, numberOfSpecies);
  }
  
  static StatsOutput createFromFiles(std::string meansFileName, std::string variancesFileName, std::size_t numberOfRealizations, std::size_t numberOfSpecies) {
    std::ifstream meansIn(meansFileName.c_str());
    if (!meansIn) {
      std::cerr << "StochKit ERROR (StatsOutput::createFromFiles): Unable to open means file "<< meansFileName<<".\n";
      exit(1);
    }
    
    StatsOutput statsOutput;
    
    std::vector<double> theOutputTimes;
    boost::char_separator<char> sep("\t","\n");
    
    //read lines from means file
    //first element is a time point, remaining elements are means that go in data[0][time point][species index] and data[1];
    std::string line;
    std::size_t tokenCounter;
    double timePoint;
    _populationVectorType popRow(numberOfSpecies);
    typename _populationVectorType::value_type popVal;

    while (std::getline(meansIn,line)) {
      //now that we have a line, put the first element into theOutputTimes
      boost::tokenizer<boost::char_separator<char> > tokens(line,sep);
      tokenCounter=0;
      BOOST_FOREACH(std::string t, tokens) {
	std::istringstream ss(t);
	if (tokenCounter==0) {
	  ss >> timePoint;
	  theOutputTimes.push_back(timePoint);
	}
	else {
	  ss >> popVal;
	  popRow.insert_element(tokenCounter-1,popVal);
	}
	tokenCounter++;
      }
      //store popRow in data[0] and data[1]
      statsOutput.data[0].push_back(popRow);
      statsOutput.data[1].push_back(popRow);
    }
    statsOutput.setOutputTimes(theOutputTimes);
    statsOutput.set_m_n(numberOfRealizations);

    std::ifstream variancesIn(variancesFileName.c_str());
    if (!variancesIn) {
      std::cerr << "StochKit ERROR (StatsOutput::createFromFiles): Unable to open variances file "<< variancesFileName<<".\n";
      exit(1);
    }
        
    //read lines from variances file
    //first element is a time point, remaining elements are means that go in data[2][time point][species index] and data[3];

    while (std::getline(variancesIn,line)) {
      //now that we have a line, put the first element into theOutputTimes
      boost::tokenizer<boost::char_separator<char> > tokens(line,sep);
      tokenCounter=0;
      BOOST_FOREACH(std::string t, tokens) {
	std::istringstream ss(t);
	if (tokenCounter==0) {
	  ss >> timePoint;
	  theOutputTimes.push_back(timePoint);
	}
	else {
	  ss >> popVal;
	  popRow.insert_element(tokenCounter-1,popVal*(double)(numberOfRealizations-1));
	}
	tokenCounter++;
      }
      //store popRow in data[2] and data[3]
      statsOutput.data[2].push_back(popRow);
      statsOutput.data[3].push_back(popRow);
    }

    return statsOutput;
  }
  
  void writeSimulationInfoFile(std::string infoFileName) {
    std::ofstream outfile;
    outfile.open(infoFileName.c_str());
    if (!outfile) {
      std::cerr << "StochKit ERROR (StatsOutput::writeSimulationInfoFile): Unable to open simulation info file.\n";
      exit(1);
    }
    
    outfile << m_n << "\n";
    //outfile << data[0].size() << "\n";//number of intervals
    outfile << data[0][0].size()<<"\n";//number of species//doesn't yet work for species subset
    
    outfile.close();
  }

  //should only be called when creating output object from file;
  void set_m_n(std::size_t new_m_n) {
    m_n=new_m_n;
  }

 };
}
#endif
  
