/*!
	\brief Several Vector Manipulation Functions
*/

#ifndef _VECTOR_MANIPULATION_H_
#define _VECTOR_MANIPULATION_H_

#include <iostream>
#include <sstream>
#include <algorithm>
#include <stdio.h>
#include <stdlib.h>
#include <boost/shared_ptr.hpp>
#include <vector>
#include <limits>

namespace STOCHKIT
{

// difference between sorted vector set src and vector dest
// return a vector containing all the elements in src but not in dest
template<typename _vectorType>
_vectorType vectorDifference(_vectorType src, _vectorType dest)
{
	_vectorType difference;
	difference.clear();

	typedef typename _vectorType::value_type _memberType;
	typedef typename _vectorType::iterator _iterator;
	_iterator src_it, dest_it;

	int found_flag;

	for( src_it = src.begin(); src_it < src.end(); ++src_it ){
		found_flag = 0;
		for( dest_it = dest.begin(); dest_it < dest.end(); ++dest_it ){
			if( *dest_it == *src_it ){
				found_flag = 1;
				break;
			}
		}
		
		if(found_flag == 0){
			difference.push_back(*src_it);
		}
	}

	return difference;
}

// insert an element to a sorted array
template<typename _vectorType,
	 typename _elementType>
bool insertToSortedArray(_vectorType &sortedArray, _elementType insertElement)
{
	typedef typename _vectorType::value_type _memberType;
	typedef typename _vectorType::iterator _iterator;
	_iterator array_it;

	int found_flag = 0;

	for( array_it=sortedArray.begin(); array_it<sortedArray.end(); ++array_it ){
		if( *array_it == (_memberType)insertElement ){
			found_flag = 1;
			break;
		}
		else if(*array_it > (_memberType)insertElement){
			found_flag = 1;
			sortedArray.insert(array_it, (_memberType)insertElement);
			break;
		}
		// fall through if *array_it < insertElement, keep searching
	}
	// if fall all the way down here, add to the end
	if(found_flag == 0){
		sortedArray.push_back((_memberType)insertElement);
		found_flag = 1;
	}

	return true;
}

// delete an element from a sorted array
template<typename _vectorType,
	 typename _elementType>
bool delFromSortedArray(_vectorType &sortedArray, _elementType delElement)
{
	typedef typename _vectorType::value_type _memberType;
	typedef typename _vectorType::iterator _iterator;
	_iterator array_it;

	for( array_it = sortedArray.begin(); array_it < sortedArray.end(); ++array_it ){
		if(*array_it == (_memberType)delElement){
			sortedArray.erase(array_it);
			return true;
		}
	}

	std::cerr << "StochKit ERROR (Vector_Manipulation::delFromSortedArray): delete non-existing element from sorted array" << std::endl;
	return false;
}

// merge elements in vector src into vector dest without duplication, dest will be a sorted vector
template<typename _srcVectorType,
	 typename _destVectorType>
bool mergeToSortedArray(_srcVectorType src, _destVectorType& dest)
{
	typedef typename _srcVectorType::value_type _srcMemberType;
	typedef typename _destVectorType::value_type _destMemberType;

	// make sure dest is a sorted vector if it's not empty
	if(src.empty()){ // src is empty, no need to procees
		return true;
	}else if(dest.empty()){  // src is not empty but dest is empty, push the first element in src if src is not empty, else return
		dest.push_back((_destMemberType)(*(src.begin())));
	}else{  // either src or dest is not empty, make sure dest is sorted
		sort(dest.begin(),dest.end());
	}

	int found_flag = 0;

	typedef typename _srcVectorType::iterator _srcIterator;
	_srcIterator src_it;
        typedef typename _destVectorType::iterator _destIterator;
        _destIterator dest_it;

	for( src_it=src.begin(); src_it<src.end(); ++src_it ){
		found_flag = 0;

		for( dest_it=dest.begin(); dest_it<dest.end(); ++dest_it ){
			if(((_destMemberType)(*src_it)) == *dest_it){  // no duplicate
				found_flag = 1;
				break;
			}
			else if(((_destMemberType)(*src_it)) < *dest_it){  // find position
				found_flag = 1;
				dest.insert(dest_it, (_destMemberType)(*src_it));
				break;
			}
			// fall through if *src_it > *dest_it, keep searching
		}
		// if fall all the way down here, add to the end
		if(found_flag == 0){
			dest.push_back((_destMemberType)(*src_it));
			found_flag = 1;
		}
	}

	return true;
}

}

#endif

