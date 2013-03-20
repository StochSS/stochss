/******************************************************************************
 *  FILE:    DenseVectorSubset.h
 */

#ifndef _DENSE_VECTOR_SUBSET_H_
#define _DENSE_VECTOR_SUBSET_H_

#include <vector>
#include <fstream>

namespace STOCHKIT
{
 template<typename _denseVectorType>
 class DenseVectorSubset
 {

  public:
	void serialize(std::string filename) {
		std::ofstream outfile;
		outfile.open(filename.c_str(),std::ios::out | std::ios::app);
		if (!outfile) {
			std::cerr << "StochKit ERROR (DenseVectorSubset::serialize): Unable to open output file. Terminating.\n";
			exit(1);
		}
		outfile << keepAll <<"\n";
		if (!keepAll) {
			outfile << subsetIndices.size() << "\n";
			for (std::size_t i=0; i!=subsetIndices.size(); ++i) {
				outfile << subsetIndices[i] << " ";
			}
			outfile << "\n";
		}
		outfile.close();
	}

	void serialize(std::ofstream& outfile) {
		if (!outfile) {
			std::cerr << "StochKit ERROR (DenseVectorSubset::serialize): Unable to open output file. Terminating.\n";
			exit(1);
		}
		outfile << keepAll <<"\n";
//		std::cout << "just wrote keepAll="<<keepAll<<" in DenseVectorSubset::serialize...\n";
//		if (keepAll) {
//			std::cout << "that is, keepAll is true...\n";
//		}
//		else {
//			std::cout << "that is, keepAll is false...\n";
//		}
		
		if (!keepAll) {
			outfile << subsetIndices.size() << "\n";
			for (std::size_t i=0; i!=subsetIndices.size(); ++i) {
				outfile << subsetIndices[i] << " ";
			}
			outfile << "\n";
		}	
	}

	void unserialize(std::ifstream& fin) {
		if (!fin) {
			std::cerr << "StochKit ERROR (DenseVectorSubset::unserialize): Unable to open file.\n";
			exit(1);
		}
		bool inputBool;
		fin >> inputBool;
//		std::cout << "in DenseVectorSubset, inputBool (keepAll) is "<<inputBool<<"\n";
		if (!inputBool) {
			//keepAll is false, so we need to read in the subsetIndices
			std::size_t inputSize_t;
			fin >> inputSize_t;
			std::cout << "StochKit ERROR (DenseVectorSubset::unserialize): --species option not implemented in this beta version. Terminating.\n";
//			std::cout << "in DenseVectorSubset, inputSize_t is "<<inputSize_t << "\n";
//			std::cout << "would read in line of subsetIndices here, but not implemented. terminating.\n";
			exit(1);
		}
	}

  DenseVectorSubset(): keepAll(true)
  {}

  DenseVectorSubset(std::vector<std::size_t> subsetIndices):keepAll(false), subsetIndices(subsetIndices)
  {}

  void setSubsetIndices(std::vector<std::size_t> subsetIndices) {
    keepAll=false;
    this->subsetIndices=subsetIndices;
  }

  void setKeepAll() {
    keepAll=true;
  }

  bool keepAll;
  std::vector<std::size_t> subsetIndices;
  

  _denseVectorType getSubset(const _denseVectorType completeVector){
    if (keepAll) {
      return completeVector;
    }
    else {
      _denseVectorType subset(subsetIndices.size());
      for (std::size_t i=0; i!=subsetIndices.size(); ++i) {
	subset[i]=completeVector[subsetIndices[i]];
      }
      return subset;
    }
  }

  std::vector<std::size_t> getSubsetIndices() {
    //will be empty if keepAll=true
    return subsetIndices;
  }
  bool getKeepAll() {
    return keepAll;
  }
  
 };
}

#endif
  
