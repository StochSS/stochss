 /*
 *  ReversiblePair.h
 */

#ifndef _REVERSIBLE_PAIR_H_
#define _REVERSIBLE_PAIR_H_

#include <iostream>
#include <set>
#include <algorithm>
#include "ElementaryReaction.h"

class ReversiblePair {
  public:
 	typedef boost::numeric::ublas::vector<double> dense_vec;
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;

 	typedef double (ReversiblePair::* RelaxationTimeFunction) (dense_vec& population);

	ReversiblePair() {};//not really implemented, shouldn't be used...
	ReversiblePair(std::pair<std::size_t,std::size_t> reactionIndexes, std::vector<ElementaryReaction>& model);

//	void set(std::pair<std::size_t,std::size_t> reactionIndexes, std::vector<ElementaryReaction>& model);

//	bool operator==(const ReversiblePair& other) const;

	double calculateRelaxationTime(dense_vec& population);//also sets latestRelaxationTime
//	double getLatestRelaxationTime();//doesn't recalculate, just gets
//	double getLatestNonzeroRelaxationTime();//doesn't recalculate, just gets
//	double firingRate(std::size_t speciesIndex, dense_vec& population);
//	double firingRate(dense_vec& population);
	
	bool containsSpecies(std::size_t speciesIndex);
	
//  private:
	std::size_t pairType;
	//type 1: A<=>NULL
	//type 2: A->A+B, B->NULL
	//type 3: A+A<=>B
	//type 4: A<=>B
	//type 5: A+B<=>B+C
	//type 6: A+B<=>C
	std::set<std::size_t> species;
	double latestRelaxationTime;
//	double latestNonzeroRelaxationTime;
	
	std::size_t A;//species index representing "A" in pairType
	std::size_t B;
	std::size_t C;
	std::size_t D;
	double c1;
	double c2;
	
//	ElementaryReaction r1;
//	ElementaryReaction r2;
	std::pair<std::size_t,std::size_t> reaction_indexes;
	std::pair<std::size_t,std::size_t> get_reaction_indexes();
	
	//need a function pointer and some functions to point to for calculating relaxation time for different types...
	RelaxationTimeFunction relaxationTimeFn;
	double type0fn(dense_vec& population);
	double type1fn(dense_vec& population);
	double type2fn(dense_vec& population);
	double type3fn(dense_vec& population);
	double type4fn(dense_vec& population);
	double type5fn(dense_vec& population);
	double type6fn(dense_vec& population);
	
	static bool isReversiblePairByStoichiometry(ElementaryReaction& r1, ElementaryReaction& r2);
	static bool stoichsAreOpposites(sparse_vec& s1, sparse_vec& s2);
};

#endif