#include "buildDependencyGraph.h"

std::vector<std::vector<std::size_t> > buildDependencyGraph(std::vector<ElementaryReaction> reactions) {
	typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;
	typedef boost::numeric::ublas::vector<double> dense_vec;	

	std::size_t NumberOfReactions=reactions.size();
	std::vector<std::vector<std::size_t> > dg(NumberOfReactions);
	
	//for each reaction i, look at nonzero elements in stoichiometry,
	//if found as a reactant in another reaction, put that other reaction index into dg[i] vector
	for (std::size_t i=0; i!=NumberOfReactions; ++i) {
		sparse_vec stoich=reactions[i].getStoichiometry();
		typedef sparse_vec::iterator sparse_iterator;
		sparse_iterator it;
		for (it=stoich.begin(); it!=stoich.end(); ++it) {
			for (std::size_t j=0; j!=NumberOfReactions; j++) {
				for (std::size_t k=0; k!=reactions[j].getReactants().size(); ++k) {
					if (it.index()==reactions[j].getReactants()[k].getSpeciesIndex()) {
						dg[i].push_back(j);
					}
				}
			}
		}
		//sort and remove duplicates
		std::sort(dg[i].begin(),dg[i].end());
		dg[i].erase(std::unique(dg[i].begin(),dg[i].end()),dg[i].end());
	}
	
	return dg;
}
