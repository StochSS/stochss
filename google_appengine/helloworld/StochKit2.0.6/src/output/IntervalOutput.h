/******************************************************************************
 *  FILE:    IntervalOutput.h
 */

#ifndef _INTERVAL_OUTPUT_H_
#define _INTERVAL_OUTPUT_H_

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <limits>
#include <iomanip>

#include "DenseVectorSubset.h"

namespace STOCHKIT
{
 template<typename _populationVectorType>
 class IntervalOutput
 {	
public:
	void serialize(std::ofstream& outfile) {
		//assumes outfile is open to position where this object's serialized data begins
		if (!outfile) {
			std::cerr << "StochKit ERROR (IntervalOutput::serialize): Unable to open output file. Terminating.\n";
			exit(1);
		}
		outfile << data.size() << "\n";
		outfile << data[0].size() << "\n";//assume rectangular
		outfile << data[0][0].size() << "\n";//ditto
		for (std::size_t i=0; i!=data.size(); ++i) {
			for (std::size_t j=0; j!=data[0].size(); ++j) {
				for (std::size_t k=0; k!=data[0][0].size(); ++k) {
					outfile << data[i][j](k) << " ";
				}
				outfile << "\n";
			}
		}

		//
		speciesSubset.serialize(outfile);

		if (!outfile) {
			std::cerr << "StochKit ERROR (IntervalOutput::serialize): Unable to open output file. Terminating.\n";
			exit(1);
		}

		outfile << outputTimes.size() << "\n";
		for (std::size_t i=0; i!=outputTimes.size(); ++i) {
			outfile << outputTimes[i] << " ";
		}
		outfile << "\n";
	}
	
	void unserialize(std::ifstream& fin) {
		if (!fin) {
			std::cerr << "StochKit ERROR (StatsOutput::unserialize): Unable to open file.\n";
			exit(1);
		}
		std::size_t inputSize_t;
		fin >> inputSize_t;
		std::size_t size1=inputSize_t;
		fin >> inputSize_t;
		std::size_t size2=inputSize_t;
		fin >> inputSize_t;
		std::size_t size3=inputSize_t;
		
		data.resize(size1);
		double inputDouble;
		for (std::size_t i=0; i!=size1; ++i) {
			data[i].resize(size2);
			for (std::size_t j=0; j!=size2; ++j) {
				data[i][j].resize(size3);
				for (std::size_t k=0; k!=size3; ++k) {
					fin >> inputDouble;
					data[i][j](k)=inputDouble;
				}
			}
		}
		
		speciesSubset.unserialize(fin);
		
		if (!fin) {
			std::cerr << "StochKit ERROR (StatsOutput::unserialize): Unable to open file.\n";
			exit(1);
		}
		fin >> inputSize_t;
		outputTimes.resize(inputSize_t);
		for (std::size_t i=0; i!=outputTimes.size(); ++i) {
			fin >> inputDouble;
			outputTimes[i]=inputDouble;
		}
	}

  protected:
  std::vector< std::vector<_populationVectorType> > data;//for now, stats output needs this to be public...or protected

  DenseVectorSubset<_populationVectorType> speciesSubset;

  protected:
  
  std::vector<double> outputTimes;
  
  protected:
  void resize(std::size_t realizations, std::size_t intervals, std::size_t populationVectorSubsetSize) {
    //beware off-by-1 error
    //doesn't change outputTimes
    data.resize(realizations);
    for (std::size_t i=0; i!=realizations; ++i) {
      data[i].resize(intervals, _populationVectorType(populationVectorSubsetSize));
    }
  }
    
  public:

  IntervalOutput(std::size_t realizations=0) : data(realizations)
  {}

  virtual ~IntervalOutput() {
  }

  virtual bool initialize(std::size_t realizations, double startTime, double endTime, _populationVectorType& samplePopulationVector) {
    if (outputTimes.size()==0) {
      std::vector<double> defaultOutputTimes;
      defaultOutputTimes.push_back(endTime);
      setOutputTimes(defaultOutputTimes);
    }
    //need to add checks for consistency. e.g. output times are increasing order, never less than start time or greater than end time

    data.clear();
    resize(realizations,outputTimes.size(),speciesSubset.getSubset(samplePopulationVector).size());
    setOutputTimes(outputTimes);
    return true;
  }
  
  std::vector<double> getOutputTimes() {
    return outputTimes;
  }

  static std::vector<double> createUniformOutputTimes(double startTime, double endTime, std::size_t intervals){
    //beware off-by-1 error! size of returned vector is intervals+1
    //e.g. createUniformOutputTimes(0.0, 1.0, 4) returns the size=5 vector: [0.0, 0.25, 0.5, 0.75, 1.0]
    //if intervals=0, then only end time is recorded
    if (startTime>=endTime) {
      std::cerr << "StochKit ERROR (IntervalOutput::createUniformOutputTimes): startTime must be before endTime\n";
      exit(1);
    }
    std::vector<double> outTimes(intervals+1);
    outTimes[0]=startTime;
    for (std::size_t i=1; i<intervals; ++i) {
      outTimes[i]=(double)i*(endTime-startTime)/(double)intervals+startTime;
    }
    outTimes[intervals]=endTime;

    return outTimes;
  }
  
  void setOutputTimes(std::vector<double> outputTimes){
    //check to ensure no duplicates and increasing order
    this->outputTimes=outputTimes;
  }

  virtual void setSpeciesSubset(std::vector<std::size_t> speciesIndices) {
    speciesSubset.setSubsetIndices(speciesIndices);
  }

  virtual void record(std::size_t realization, std::size_t interval,_populationVectorType population) {
    //to achieve best performance, this function does no consistency checking
    data[realization][interval]=speciesSubset.getSubset(population);
  }
  
  virtual void merge(IntervalOutput other) {
    data.insert(data.end(),other.data.begin(),other.data.end());
  }

  virtual void merge(std::vector<IntervalOutput> others) {
    for (std::size_t i=0; i!=others.size(); ++i) {
      this->merge(others[i]);
    }
  }

  //should add an option to print a column header (e.g. species names)
  void writeDataToFile(size_t realization, std::string filename, bool printTime=true, bool append=false, bool highPrecision=false) {

    //doesn't ensure that entire realization has been stored in data
    std::ofstream outfile;

    if (append) {
      outfile.open(filename.c_str(),std::ios::out | std::ios::app);
    }
    else {
      outfile.open(filename.c_str());
    }

    if (!outfile) {
      std::cout << "StochKit ERROR (IntervalOutput::writeDataToFile): Unable to open output file.\n";
      exit(1);
    }
    try {
      for (std::size_t interval=0; interval!=outputTimes.size(); ++interval) {
	if (printTime) {
	  outfile << outputTimes[interval] << "\t";
	}
	for (size_t index=0; index!=data[realization][interval].size(); ++index) {
	  //what happens if this value has not yet been written? probably seg fault
	  if (highPrecision) {
	    outfile << std::setprecision(std::numeric_limits<double>::digits10)<< data[realization][interval][index] << "\t";
	  }
	  else {
	    outfile << std::setprecision(8) << data[realization][interval][index] << "\t";
	  }
	}
	outfile << "\n";
      }
      outfile.close();
    }
    catch (...) {
      std::cout << "StochKit ERROR (IntervalOutput::writeDataToFile): error writing data to output file.\n";
      exit(1);
    }
  }
  
  static void writeLabelsToFile(std::string filename, std::vector<std::string> columnLabels, bool printTime=true) {
    
    //doesn't ensure that entire realization has been stored in data
    std::ofstream outfile;
    
    outfile.open(filename.c_str());
    if (!outfile) {
      std::cout << "StochKit ERROR (IntervalOutput::writeLabelsToFile): Unable to open output file.\n";
      exit(1);
    }
    try {
      if (printTime) {
	outfile << "time\t";
      }
      for (std::size_t label=0; label!=columnLabels.size(); ++label) {
	outfile << columnLabels[label] << "\t";
      }
      outfile << "\n";
      
      outfile.close();
    }
    catch (...) {
      std::cout << "StochKit ERROR (IntervalOutput::writeLabelsToFile): error writing column labels to output file.\n";
      exit(1);
    }    
  }

 };
}
#endif
  
