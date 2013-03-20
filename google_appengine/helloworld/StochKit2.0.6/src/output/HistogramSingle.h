#ifndef _HISTOGRAM_SINGLE_H_
#define _HISTOGRAM_SINGLE_H_
#include <cmath>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <limits>
#include <numeric>
#include <stdio.h>
#include <stdlib.h>
#include <sstream>
#include <string>
#include <vector>
#include "boost/foreach.hpp"
#include "boost/tokenizer.hpp"
#include <limits>

//export LD_LIBRARY_PATH=libs/boost_1_41_0/stage/lib/

namespace STOCHKIT
{
 template<typename _populationValueType>
 class HistogramSingle
 {
public:
	void serialize(std::ofstream& outfile) {
		//assumes outfile is open to position where this object's serialized data begins
		if (!outfile) {
			std::cerr << "StochKit ERROR (Histogram::serialize): Unable to open output file. Terminating.\n";
			exit(1);
		}
		outfile << _lowerBound << "\n";
		outfile << _upperBound << "\n";
		outfile << _width << "\n";
		outfile << _inverseWidth << "\n";
		outfile << _size << "\n";
		outfile << _timeIndex << "\n";
		outfile << _speciesIndex << "\n";
		outfile << _data.size() << "\n";
		for (std::size_t i=0; i!=_data.size(); ++i) {
			outfile << _data[i] << " ";
		}
		outfile << "\n";
	}
 
 	void unserialize(std::ifstream& fin) {
		if (!fin) {
			std::cerr << "StochKit ERROR (HistogramSingle::unserialize): Unable to open file.\n";
			exit(1);
		}
		double inputDouble;
		fin >> inputDouble;
		_lowerBound=inputDouble;
		fin >> inputDouble;
		_upperBound=inputDouble;
		fin >> inputDouble;
		_width=inputDouble;
		fin >> inputDouble;
		_inverseWidth=inputDouble;
		std::size_t inputSize_t;
		fin >> inputSize_t;
		_size=inputSize_t;
		fin >> inputSize_t;
		_timeIndex=inputSize_t;
		fin >> inputSize_t;
		_speciesIndex=inputSize_t;
		fin >> inputSize_t;		
		_data.resize(inputSize_t);
		int inputInt;
		for (std::size_t i=0; i!=_data.size(); ++i) {
			fin >> inputInt;
			_data[i]=inputInt;
		}
	}//unserialize

 protected:
  //! The closed lower bound is a multiple of the width.
  double _lowerBound;
  //! The open upper bound.
  /*! _upperBound == _lowerBound + _width * _bins.size() */
  double _upperBound;
  //! The width of a bin is a power of 2.
  double _width;
  //! The inverse of the bin width.
  double _inverseWidth;
  //! The number of bins.
  std::size_t _size;
  //! Time index of the histogram
  std::size_t _timeIndex;
  //! Species index of the histogram
  std::size_t _speciesIndex;
  //! The data container
  std::vector<int> _data;
  void setHistogramData(std::vector<int> data, double lb, double ub, double wd, double iwd){
    _lowerBound=lb;
    _upperBound=ub;
    _width=wd;
    _inverseWidth=iwd;
#ifndef DEBUG_StochKit 
    if (data.size()!=_size){
      std::cout<<"StochKit ERROR (HistogramSingle::setHistogramData): requires bin sizes to be the same\n";
      exit(1);
    }
#endif
    for(std::size_t i=0;i<_size;i++){
      _data[i]=data[i];
    }
    // std::cout<<"lb: "<<_lowerBound<<" ub:"<<_upperBound<<" width:"<<_width<<" iwidth:"<<_inverseWidth<<'\n';
  }

 
 public:

 HistogramSingle() :
  _lowerBound(0),
    _upperBound(0),
    _width(0),
    _inverseWidth(0),
    _size(0) 
      { 
      }
    
  //! Construct from the number of bins 
 HistogramSingle(const std::size_t size,const std::size_t tIndex, const std::size_t sIndex) :
  _lowerBound(0),
    _upperBound(size),
    _width(1),
    _inverseWidth(1),
    _size(size),
    _timeIndex(tIndex),
    _speciesIndex(sIndex),
    _data(size,0){
#ifndef DEBUG_StochKit 
    if(size<1){
      std::cout<<"StochKit ERROR (HistogramSingle::HistogramSingle): requires bin size greater than 0\n";
      exit(1);
    }
#endif
  }

  //! Copy constructor. Used in merge to avoid error by modifying constant (referenced) histogram object
 HistogramSingle(const HistogramSingle& x) :
  _lowerBound(x._lowerBound),
    _upperBound(x._upperBound),
    _width(x._width),
    _inverseWidth(x._inverseWidth),
    _size(x._size),
    _timeIndex(x._timeIndex),
    _speciesIndex(x._speciesIndex),
    _data(x._data) {
  }

  //! Destructor
  ~HistogramSingle() {}

  //! Initialize with the number of bins and a pointer to the bin data.
  
  void initialize(const std::size_t size, std::size_t tIndex, std::size_t sIndex) {
#ifndef DEBUG_StochKit
    if (size<1){
      std::cout<<"StochKit ERROR (HistogramSingle::initialize): requires bin size greater than 0\n";
      exit(1);
    }
    if (_size>0){ // bin size is already determined. cannot be overwriiten unless syncro function is used
      std::cout<<"StochKit ERROR (HistogramSingle::initialize): bin size is already determined\n";
      exit(1);
    }
#endif
    _lowerBound = 0;
    _width = 1;
    _inverseWidth = 1;
    _upperBound = size;
    _size = size;
    _timeIndex = tIndex;
    _speciesIndex = sIndex;
    std::size_t i;
    for(i=0; i!=size;i++)
      _data.push_back(0);
  }
      
  //! Return the number of bins.
  std::size_t size() const {
    return _size;
  }

  //! Return the closed lower bound.
  double getLowerBound() const {
    return _lowerBound;
  }

  //! Return the bin width.
  double getWidth() const {
    return _width;
  }

  //! Return the open upper bound.
  double getUpperBound() const {
    return _upperBound;
  }

  //! Return the inverse width, used in a copy constructor.
  double getInverseWidth() const {
    return _inverseWidth;
  }

  //! Return the time index
  std::size_t _getTimeIndex() const {
    return _timeIndex;
  }

  //! Return the species index
  std::size_t _getSpeciesIndex() const {
    return _speciesIndex;
  }
 
  //! Clear the histogram. Empty the bins but do not alter the lower bound or width.
  void clear() {
    std::size_t i;
    for(i=0; i!=_data.size();i++){
      _data[i]=0;
    }
  }

  //! Reset the histogram. Empty the bins. Reset the lower bound and width.
  void reset() {
    _lowerBound = 0;
    _width = 1;
    _inverseWidth = 1;
    _upperBound = size();
    clear();
  }

  //! Compute the sum of counts for all bins
  int computeSum() const {
    int tSum=0;
    for(std::size_t i=0;i<_size; i++)
      tSum += _data[i];
    return tSum;
  }

  //! Compute the minimum non-zero element
  double computeMinimumNonzero() const {
    for (std::size_t i = 0; i != _size; i++) {
      if (_data[i] != 0) {
	return _lowerBound + i * _width;
      }
    }
#ifndef DEBUG_StochKit
    std::cout<<"StochKit ERROR (HistogramSingle::computeMinimumNonzero)  \n";
    return 0.;
#endif
  }
 
  //! Compute the minimum non-zero element
  double  computeMaximumNonzero() const {
    for (std::size_t i = _size; i != 0; i--) {
      if (_data[i-1] != 0) {
	return _lowerBound + i * _width;
      }
    }
#ifndef DEBUG_StochKit
    std::cout<<"StochKit ERROR (HistogramSingle::computeMaximumNonzero)  \n";
    return 0.;
#endif
  }
  //! Compute the number of data in the histogram
  int getCounts(std::size_t index) const{
#ifndef DEBUG_StochKit
    if (index<0 || index>=_size){
      std::cout<<"StochKit ERROR (HistogramSingle::getCounts) requires 0 <= index < numberOfBins  \n";
      return 1;
    }
#endif
    return(_data[index]);
  }

  //! Add an event
  void accumulate(const _populationValueType event) {

    // The bin width is a power of 2.
    // The lower bound is a multiple of the bin width.
    // If an event lies outside of the range of the current histogram, the bin width is doubled (and the lower bound adjusted) until all events lie within the histogram's rang

#ifndef DEBUG_StochKit
    if (event<0){
      std::cout<<"StochKit ERROR (HistogramSingle::accumulate) requires population to be non-negative \n";
      exit(1);
    }
#endif
    rebuild(event);
    _data[std::size_t((event-_lowerBound)*_inverseWidth)]+=1;
    return;
  }
   
  //! If necessary, rebuild the histogram so it can contain the specified event.
  void rebuild(const _populationValueType event) {
    // Do nothing if the event will be placed in the current histogram.
    if (_lowerBound <= event && event < _upperBound) {
      return;
    }

    // Determine the new lower bound.
    _populationValueType lower = event;
    if (_lowerBound < lower) {
      std::size_t i;
      for (i = 0; i != size(); i++) {
	if (_data[i] != 0) {
	  break;
	}
      }
      if (i != size() && _lowerBound + i * _width < lower) {
	lower = _lowerBound + i * _width;
      }
    }
    // Determine the new open upper bound.
    // Add one half to get an open upper bound.
    double upper = event + 0.5;
    if (_upperBound > upper) {
      int i;
      for (i = size() - 1; i >= 0; i--) {
	if (_data[i] != 0) {
	  break;
	}
      }
      if (i != -1 && (double)_lowerBound + ((double)i + 1.0) *(double) _width > upper) {
	upper =(double)_lowerBound + ((double)i + 1.0) * (double)_width;
      }
    }
    // Rebuild with the new lower and upper bounds.
    rebuild(lower, upper, _width);
  }

  //! Rebuild the histogram so it covers the specified range and has at least the specified minimum width.
  void rebuild( _populationValueType low,  double high, double newWidth) {
#ifndef DEBUG_StochKit
    if(low < 0 || low >= high){
      std::cout<<"StochKit ERROR (HistogramSingle::rebuild): invalid population counts\n";
      exit(1);
    }
#endif
    // Determine the new bounds and a bin width.
    // Note that the width is only allowed to grow.
    _populationValueType newLowerBound = std::floor(low / newWidth) * newWidth;
    double newUpperBound = newLowerBound + size() * newWidth;
    while (high > newUpperBound) {
      newWidth *= 2;
      newLowerBound = std::floor(low / newWidth) * newWidth;
      newUpperBound = newLowerBound + size() * newWidth;
    }
    // Rebuild the histogram.
    double newInverseWidth = 1. / newWidth;
    std::vector<int> newData(size(), 0);
    for (std::size_t i = 0; i != size(); i++) {
      if (_data[i] != 0) {
	_populationValueType event = _lowerBound + i * _width;

#ifndef DEBUG_StochKit
	if(newLowerBound>event || event>= newUpperBound){
	  std::cout<<"StochKit ERROR (HistogramSingle::rebuild): invalid new upper and/or lower bound\n";
	  exit(1);
	}
#endif	 
	newData[std::size_t((event - newLowerBound) * newInverseWidth)] += _data[i];
      }
    }
    for (std::size_t i = 0; i != size(); i++) 
      _data[i] = newData[i];

    // New bounds and width.
    _lowerBound = newLowerBound;
    _width = newWidth;
    _inverseWidth = newInverseWidth;
    _upperBound = newUpperBound;
  }


  void mergeHistogram( HistogramSingle<_populationValueType> x){
#ifndef DEBUG_StochKit
    if (size() != x.size()){
      std::cout<<"StochKit ERROR (HistogramSingle::mergeHistogram): bin size of two histograms must be equal\n";
      exit(1);
    }
#endif   
    // check to make sure time and species index are identical
    if (x._getSpeciesIndex()!=_speciesIndex){
      std::cout<<"StochKit ERROR (HistogramSingle::mergeHistogram): species indices must match\n";
      exit(1);
    }
    if (x._getTimeIndex()!= _timeIndex){
     std::cout<<"StochKit ERROR (HistogramSingle::mergeHistogram): time indices must match\n";
      exit(1);
    }

 
    double lower, upper; 
    if (computeSum()==0){
      
      lower = x.getLowerBound();
      upper = x.getUpperBound();
      
    }
    else if (x.computeSum()==0){
      lower = _lowerBound;
      upper = _upperBound;
    }
    else {
      lower = std::min(computeMinimumNonzero(), x.computeMinimumNonzero());
      upper = std::max(computeMaximumNonzero(), x.computeMaximumNonzero());
    }
    
    double width = std::max(getWidth(), x.getWidth());
    rebuild(lower, upper, width);
    x.rebuild(lower, upper, width);
    if(x.getLowerBound()!=_lowerBound){
      std::cout << "StochKit ERROR (HistogramSingle::mergeHistogram): lower bounds do not match after rebuild.\n";
      exit(1);
    }
    if(x.getWidth()!=_width){
      std::cout << "StochKit ERROR (HistogramSingle::mergeHistogram): lower bounds do not match after rebuild.\n";
      exit(1);
    }
    // merge data
    for(std::size_t i=0; i<_size;i++)
      _data[i] += x.getCounts(i);
  }   

  void writeToFile(std::string filename, std::vector<double>& outputTimes) {
    std::ofstream outfile;
    //   std::size_t numberOfProcesses=commandLine.getProcesses();
    //   append the processor at the end for parallel simulation
    /*
    std::ostringstream buffer;
    buffer << _timeIndex;
    std::ostringstream buffer2;
    buffer2 << _speciesIndex;
    */

    //std::string fname = filename+"-"+buffer.str()+"-"+buffer2.str();

    outfile.open(filename.c_str());
    if (!outfile) {
      std::cout << "StochKit ERROR (HistogramSingle::writeToFile): Unable to open output file \"" << filename << "\".\n";
      exit(1);
    }
    try {
      // time index and species index 
      outfile << _speciesIndex << "\t"<<outputTimes[_timeIndex] << "\t"<< _speciesIndex <<"\t"<<_timeIndex<<"\n";
      // other necessary information
      outfile << _lowerBound<<"\t"<<_upperBound<<"\t"<<_width<<"\t"<<_size<<"\t"<<_inverseWidth<<"\n";

      for (std::size_t i=0; i<_data.size(); i++) {
	  outfile << _data[i] << "\t";
      }
      outfile << "\n";
      outfile.close();
    }
    catch (...) {
      std::cout << "StochKit ERROR (HistogramSingle::writeToFile): error writing data to output file.\n";
      exit(1);
    } 
  }
  
  void writeToFile(std::string filename, std::vector<double>& outputTimes, std::string speciesID) {
    std::ofstream outfile;

    outfile.open(filename.c_str());
    if (!outfile) {
      std::cout << "StochKit ERROR (HistogramSingle::writeToFile): Unable to open output file \"" << filename << "\".\n";
      exit(1);
    }
    try {
      // time index and species index 
      outfile << speciesID <<"\t"<< outputTimes[_timeIndex] << "\t"<< _speciesIndex <<"\t"<<_timeIndex<<"\n";
      // other necessary information
      outfile << _lowerBound<<"\t"<<_upperBound<<"\t"<<_width<<"\t"<<_size<<"\t"<<_inverseWidth<<"\n";

      for (std::size_t i=0; i<_data.size(); i++) {
	  outfile << _data[i] << "\t";
      }
      outfile << "\n";
      outfile.close();
    }
    catch (...) {
      std::cout << "StochKit ERROR (HistogramSingle::writeToFile): error writing data to output file.\n";
      exit(1);
    } 
  }

  static HistogramSingle<_populationValueType> createFromFiles(std::string filename) {

    std::ifstream histIn(filename.c_str());
    boost::char_separator<char> sep("\t","\n");
   

    if (!histIn) {
      std::cerr << "StochKit ERROR (HistogramSingle::createFromFiles): Unable to open histogram file "<< filename<<".\n";
      exit(1);
    }
    // HistogramSingle member variables 
    double lowerBound;
    double upperBound;
    double width;
    double inverseWidth;
    double actualTime; //not used
    double speciesID;  //not used
    std::size_t size;
    std::size_t timeIndex;
    std::size_t speciesIndex;
    std::vector<int> data;

    // HistogramSingle object that will be filled with information from file and returned
    HistogramSingle hist;
    // variables used in reading from a file
    std::string line;
    //std::size_t tokenCounter;
   
  
    //read in the first line
    std::getline(histIn,line);
    boost::tokenizer<boost::char_separator<char> > tokens(line,sep);
    boost::tokenizer<boost::char_separator<char> >::iterator beg=tokens.begin();
    std::istringstream e(*beg);
    e >> speciesID; //not used
    beg++;
    std::istringstream f(*beg);
    f >> actualTime; //not used
    beg++;
    std::istringstream g(*beg);
    g >> speciesIndex;
    beg++;
    std::istringstream h(*beg);
    h >> timeIndex;

    //read in the second line  
    std::vector<double> tempV(4,0.0);
    std::getline(histIn,line);
    int j=0;
    boost::tokenizer<boost::char_separator<char> > tokens2(line,sep);
    beg=tokens2.begin();
    for(int i=0; i<5; i++){
      std::istringstream f(*beg);
      if (i!=3) { //size is size_t, not double
	f>>tempV.at(j);
	j++;
      }
      else
	f>>size;
      beg++;
    }
    // assign a value to member variables
    lowerBound = tempV.at(0);
    upperBound = tempV.at(1);
    width = tempV.at(2);
    inverseWidth = tempV.at(3);
    //std::cout<<lowerBound<<'\t'<<upperBound<<'\t'<<width<<'\t'<<size<<'\t'<<inverseWidth<<'\n';   

    //read in the third line -> data
    std::getline(histIn,line);
    boost::tokenizer<boost::char_separator<char> > tokens3(line,sep);
    beg = tokens3.begin();
    for(std::size_t i=0;i<size;i++){ 
      std::istringstream f(*beg); 
      f>> j; 
      data.push_back(j);
      beg++; 
    }  
    // initialize the HistogramSingle object
    hist.initialize(size,timeIndex,speciesIndex);
    // fill in the rest of the data
    hist.setHistogramData(data,lowerBound,upperBound,width,inverseWidth);
    
    histIn.close();

    return hist;   
  }

 };
}

#endif
