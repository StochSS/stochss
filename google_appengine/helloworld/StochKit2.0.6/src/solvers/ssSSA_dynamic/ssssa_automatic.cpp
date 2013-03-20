/*
 */
#include "boost_headers.h"

#include <iostream>
#include <string>
#include "SlowScaleSSA.h"
#include "convertXMLtoModel.h"
//#include "precompile_ivfps_CommandLineInterface.h"
#include "CommandLineInterface.h"
#include "boost/filesystem.hpp"
#include "writeEquilibriumCode.h"
#include "rref.h"
#include "SSA_Direct.h"
#include "Input_mass_action.h"
#include "StandardDriverTypes.h"
#include "Groups.h"

using namespace STOCHKIT;

//ublas_matrix createDenseStoichiometry(std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies) {
////	std::cout << "creating dense stoich (NumberOfSpecies="<<NumberOfSpecies<<")\n";
//typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;
//	ublas_matrix NU(reactions.size(),NumberOfSpecies);
//	for (std::size_t i=0; i!=reactions.size(); ++i) {
//		//initialize to zeros
//		for (std::size_t j=0; j!=NumberOfSpecies; ++j) {
//			NU(i,j)=0.0;
//		}
//		sparse_vec stoich=reactions[i].getStoichiometry();
//		for (sparse_vec::const_iterator it=stoich.begin(); it!=stoich.end(); ++it) {
//			NU(i,it.index())=*it;
//		}
//	}
//	return NU;
//}


std::size_t findFastIndex(std::size_t originalIndex, std::vector<std::size_t>& fastSpeciesIndexes) {
	for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
		if (fastSpeciesIndexes[i]==originalIndex) {
			return i;
		}
	}
	std::cout << "StochKit ERROR: attempt to look up species not in list of fast species (originalIndex="<<originalIndex<<"). Terminating.\n";
	exit(1);
	return 0;
}

std::vector<std::size_t> getFullModelIndependentSpeciesIndexes(std::vector<ElementaryReaction>& model) {
//	std::cout << "in getFullModelIndependentSpeciesIndexes...\n";

	//function to determine a linearly independent set of species

	//loop over reactions, species indexes
	
	//keep maxSpeciesIndex for later
	std::size_t maxSpeciesIndex=0;
	
	for (std::size_t i=0; i!=model.size(); ++i) {
		//get Reactants
		Reactants r=model[i].getReactants();
		for (std::size_t j=0; j!=r.size(); ++j) {
			if (r[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=r[j].getSpeciesIndex();
		}
		//get Products
		Products p=model[i].getProducts();
		for (std::size_t j=0; j!=p.size(); ++j) {
			if (p[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=p[j].getSpeciesIndex();
		}
		
	}
		
	boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(model,maxSpeciesIndex+1);
	
	std::size_t rankNU=rank(tmpNU);
//	std::cout << "rank is: ";
//	std::cout << rankNU << "\n";
	
//the following is basically duplicated from reindex_ivfp_reactions function...smarter code wouldn't duplicate it in this way...	
	
	boost::numeric::ublas::matrix<double> testNU=tmpNU;
	to_reduced_row_echelon_form(testNU);
//std::cout << "testNU:\n";
//print_ublas_matrix(testNU,testNU.size1(), testNU.size2());
//std::cout << "\n";
//std::cout << "done with test...\n";
//std::cout << "find the pivot columns...\n";
std::vector<std::size_t> independent_species;
for (std::size_t i=0; i!=rankNU;++i) {
	//find the first nonzero element in the row
	std::size_t j=i;
	while (testNU(i,j)==0) {
		++j;
	}
	//now I think j is a pivot column, corresponding to an independent species
	if (!(testNU(i,j)==1)) {
		std::cout << "StochKit ERROR (ssssa_automatic::getFullModelIndependentSpeciesIndexes): error, expected testNU("<<i<<","<<j<<") to equal 1 (but it equals "<<testNU(i,j)<<") (bug). Terminating.\n";
		exit(1);
	}
	independent_species.push_back(j);
}
//std::cout << "determined that the following columns correspond to a rank number of independent species:\n";
//for (std::size_t i=0; i!=independent_species.size(); ++i) {
//	std::cout << independent_species[i] << "\n";
//}

if (independent_species.size()!=rankNU) {
	std::cout << "StochKit ERROR (ssssa_automatic::getFullModelIndependentSpeciesIndexes): expected number of independent species to equal rank (bug). Terminating.\n";
	exit(1);
}

	boost::numeric::ublas::matrix<double> trialIndependentNU(model.size(),rankNU);
//		for (std::size_t i=0; i!=rankNU; ++i) {
		for (std::size_t i=0; i!=independent_species.size(); ++i) {
			//get the column from tmpNU that corresponds to the fast species index that appears in the ith position of fastSpeciesOrder
//			boost::numeric::ublas::matrix_column<boost::numeric::ublas::matrix<double> > col(tmpNU,fastSpeciesIndexes[i]);
			boost::numeric::ublas::matrix_column<boost::numeric::ublas::matrix<double> > col(tmpNU,independent_species[i]);
					
//			std::cout << "inserting fast species "<<fastSpeciesIndexes[i]<< " stoich into column "<<i<<"\n";
			
			//put the values of the column into trialIndependentNU
			for (std::size_t j=0; j!=col.size(); ++j) {
				trialIndependentNU(j,i)=col(j);
			}
		}

//		std::cout << "\"trialIndependentNU\":\n";
//		print_ublas_matrix(trialIndependentNU,trialIndependentNU.size1(), trialIndependentNU.size2());
		std::size_t testRank=rank(trialIndependentNU);
//		std::cout << "rank of trialIndependentNU is "<<testRank<<"\n";
	if (testRank!=rankNU) {
		std::cout << "StochKit ERROR (ssssa_automatic::getFullModelIndependentSpeciesIndexes): rank of independent species stoichiometry does not equal rank of full stoichiometry matrix (bug). Terminating.\n";
		exit(1);
	}
	
	
//	boost::numeric::ublas::matrix<double> trialIndependentNU(model.size(),rankNU);

	std::vector<std::size_t> allSpeciesIndexes;
	for (std::size_t i=0; i<=maxSpeciesIndex; ++i) {
		allSpeciesIndexes.push_back(i);
	}

	return independent_species;
}

std::pair<std::vector<ElementaryReaction>,std::size_t> reindex_ivfp_reactions(std::vector<std::size_t> fastReactionIndexes, std::vector<ElementaryReaction>& allReactions) {
	//for a given ivfp, create a "reindexed" set of elementary reactions
	
//	std::cout << "in reindex_ivfp_reactions...\n";
	std::vector<ElementaryReaction> fastRxns(fastReactionIndexes.size());

	for (std::size_t i=0; i!=fastReactionIndexes.size(); ++i) {
		fastRxns[i]=allReactions[fastReactionIndexes[i]];
	}

	std::vector<ElementaryReaction>	fastReactionsReindexed(fastRxns.size());

	std::vector<std::size_t> fastSpeciesIndexes;

	//loop over reactions, fast species indexes
	
	//keep maxSpeciesIndex for later
	std::size_t maxSpeciesIndex=0;
	
	for (std::size_t i=0; i!=fastRxns.size(); ++i) {
		//get Reactants
		Reactants r=fastRxns[i].getReactants();
		for (std::size_t j=0; j!=r.size(); ++j) {
			fastSpeciesIndexes.push_back(r[j].getSpeciesIndex());
			if (r[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=r[j].getSpeciesIndex();
		}
		//get Products
		Products p=fastRxns[i].getProducts();
		for (std::size_t j=0; j!=p.size(); ++j) {
			fastSpeciesIndexes.push_back(p[j].getSpeciesIndex());
			if (p[j].getSpeciesIndex()>maxSpeciesIndex) maxSpeciesIndex=p[j].getSpeciesIndex();
		}
		
	}
	//remove duplicates
	std::sort(fastSpeciesIndexes.begin(), fastSpeciesIndexes.end());
	fastSpeciesIndexes.erase(std::unique(fastSpeciesIndexes.begin(),fastSpeciesIndexes.end()),fastSpeciesIndexes.end());
		
	boost::numeric::ublas::matrix<double> tmpNU=createDenseStoichiometry(fastRxns,maxSpeciesIndex+1);
//	std::cout << "full NU (may include empty slow species columns):\n";
//	print_ublas_matrix(tmpNU,tmpNU.size1(),tmpNU.size2());
	
	std::size_t rankNU=rank(tmpNU);
//	std::cout << "rank is: ";
//	std::cout << rankNU << "\n";
	
//std::cout << "to find a set of rank independent species, reduce tmpNU to reduced row echelon form, look for pivot columns (which correspond to independent species)...\n";
	boost::numeric::ublas::matrix<double> testNU=tmpNU;
	to_reduced_row_echelon_form(testNU);
//std::cout << "testNU:\n";
//print_ublas_matrix(testNU,testNU.size1(), testNU.size2());
//std::cout << "\n";
//std::cout << "done with test...\n";
//std::cout << "find the pivot columns...\n";
std::vector<std::size_t> independent_species;
for (std::size_t i=0; i!=rankNU;++i) {
	//find the first nonzero element in the row
	std::size_t j=i;
	while (testNU(i,j)==0) {
		++j;
	}
	//now I think j is a pivot column, corresponding to an independent species
	if (!(testNU(i,j)==1)) {
		std::cout << "StochKit ERROR (ssssa_automatic::reindex_ivfp_reactions): expected testNU("<<i<<","<<j<<") to equal 1 (but it equals "<<testNU(i,j)<<") (bug). Terminating.\n";
		exit(1);
	}
	independent_species.push_back(j);
}
//std::cout << "determined that the following columns correspond to a rank number of independent species:\n";
//for (std::size_t i=0; i!=independent_species.size(); ++i) {
//	std::cout << independent_species[i] << "\n";
//}

if (independent_species.size()!=rankNU) {
	std::cout << "StochKit ERROR (ssssa_automatic::reindex_ivfp_reactions): expected number of independent species to equal rank (bug). Terminating.\n";
	exit(1);
}



	boost::numeric::ublas::matrix<double> trialIndependentNU(fastRxns.size(),rankNU);
//		for (std::size_t i=0; i!=rankNU; ++i) {
		for (std::size_t i=0; i!=independent_species.size(); ++i) {
			//get the column from tmpNU that corresponds to the fast species index that appears in the ith position of fastSpeciesOrder
//			boost::numeric::ublas::matrix_column<boost::numeric::ublas::matrix<double> > col(tmpNU,fastSpeciesIndexes[i]);
			boost::numeric::ublas::matrix_column<boost::numeric::ublas::matrix<double> > col(tmpNU,independent_species[i]);
					
//			std::cout << "inserting fast species "<<fastSpeciesIndexes[i]<< " stoich into column "<<i<<"\n";
			
			//put the values of the column into trialIndependentNU
			for (std::size_t j=0; j!=col.size(); ++j) {
				trialIndependentNU(j,i)=col(j);
			}
		}

//		std::cout << "\"trialIndependentNU\":\n";
//		print_ublas_matrix(trialIndependentNU,trialIndependentNU.size1(), trialIndependentNU.size2());
		std::size_t testRank=rank(trialIndependentNU);
//		std::cout << "rank of trialIndependentNU is "<<testRank<<"\n";
	if (testRank!=rankNU) {
		std::cout << "StochKit ERROR (ssssa_automatic::reindex_ivfp_reactions): rank of independent species stoichiometry does not equal rank of full stoichiometry matrix (bug). Terminating.\n";
		exit(1);
	}

//order fastSpeciesIndexes so that independent species appear first
std::vector<std::size_t> tmpSpeciesList=independent_species;
//loop over fastSpeciesIndexes
for (std::size_t i=0; i!=fastSpeciesIndexes.size(); ++i) {
	//loop over tmpSpeciesList
	bool inList=false;
	for (std::size_t j=0; j!=tmpSpeciesList.size(); ++j) {
		if (fastSpeciesIndexes[i]==tmpSpeciesList[j]) {
			inList=true;
		}
	}
	if (!inList) {
		tmpSpeciesList.push_back(fastSpeciesIndexes[i]);
	}
}
fastSpeciesIndexes=tmpSpeciesList;	
	
	//build a new reaction set with new indexes to only have fast reactions
	//e.g. if fastSpeciesIndexes are 2 and 3, create new elementaryReaction objects with species indexes 0 and 1
	//which correspond to species 2 and 3 in the full system
	for (std::size_t i=0; i!=fastRxns.size(); ++i) {
		
		Reactants oldReactants=fastRxns[i].getReactants();
		std::vector<Reactant> newReactantVector;
		//loop over oldReactants
		for (std::size_t j=0; j!=oldReactants.size(); ++j) {
			std::size_t newIndex=findFastIndex(oldReactants[j].getSpeciesIndex(),fastSpeciesIndexes);
			int count=oldReactants[j].getMoleculeCount();
			Reactant r(newIndex, count);
			newReactantVector.push_back(r);
		}
		Products oldProducts=fastRxns[i].getProducts();
		std::vector<Product> newProductVector;
		//loop over oldProducts
		for (std::size_t j=0; j!=oldProducts.size(); ++j) {

			std::size_t newIndex=findFastIndex(oldProducts[j].getSpeciesIndex(),fastSpeciesIndexes);
			int count=oldProducts[j].getMoleculeCount();
			Product p(newIndex, count);
			newProductVector.push_back(p);
		}

		Reactants newReactants(newReactantVector);
		Products newProducts(newProductVector);

		ElementaryReaction rxn(fastRxns[i].getRateConstant(),newReactants,newProducts,fastSpeciesIndexes.size());

		fastReactionsReindexed[i]=rxn;
	}
	
	return make_pair(fastReactionsReindexed,fastSpeciesIndexes.size());
}//end reindex_ivfp_reactions

void build_new_ivfps(std::string ivfp_code_directory, std::vector<std::vector<std::size_t> > ivfp_reaction_lists, std::vector<ElementaryReaction>& model) {
//	std::cout << "in build_new_ivfps...\n";
	std::string commandStr="touch "+ivfp_code_directory+"/ivfp_functions.h "+ivfp_code_directory+"/ivfp_functions.cpp ";
	system(commandStr.c_str());
	
	std::ofstream outfile;
	//open for appending
//	outfile.open((ivfp_code_directory+"/ivfp_functions.h").c_str(),std::ios::out | std::ios::app);
	//open for overwriting
	outfile.open((ivfp_code_directory+"/ivfp_functions.h").c_str(),std::ios::out | std::ios::trunc);

	if (!outfile) {
		std::cout << "StochKit ERROR (ssssa_automatic::build_new_ivfps): error opening output file. Terminating.\n";
		exit(1);
	}
	std::ofstream outfile2;//cpp file
	//open for appending
//	outfile2.open((ivfp_code_directory+"/ivfp_functions.cpp").c_str(),std::ios::out | std::ios::app);
	//open for overwriting
	outfile2.open((ivfp_code_directory+"/ivfp_functions.cpp").c_str(),std::ios::out | std::ios::trunc);
	if (!outfile2) {
		std::cout << "StochKit ERROR (ssssa_automatic::build_new_ivfps) error opening file. Terminating.\n";
		exit(1);
	}

	try {
//			std::cout << "in try block...\n";
	
		outfile<<"#ifndef _IVFP_FUNCTIONS_H_\n";
		outfile<<"#define _IVFP_FUNCTIONS_H_\n";
		outfile<<"#include \"boost/numeric/ublas/matrix.hpp\"\n";
		outfile<<"#include \"boost/numeric/ublas/vector.hpp\"\n";
		outfile2<<"#include \"ivfp_functions.h\"\n";
		outfile2.close();

		for (std::size_t i=0; i!=ivfp_reaction_lists.size(); ++i) {
//			std::cout << "...processing ivfp_reaction_lists row "<<i<<"...\n";
			std::pair<std::vector<ElementaryReaction>,std::size_t> current_ivfp_and_NumberOfFastSpecies=reindex_ivfp_reactions(ivfp_reaction_lists[i], model);

			//write function signatures into header file
			outfile<<"void "<<"createA_"<<StandardDriverUtilities::size_t2string(i)<<"(boost::numeric::ublas::matrix<double>& A, boost::numeric::ublas::vector<double>& x, double h, boost::numeric::ublas::vector<double>& C);\n";
			outfile<<"void "<<"createb_"<<StandardDriverUtilities::size_t2string(i)<<"(boost::numeric::ublas::vector<double>& b, boost::numeric::ublas::vector<double>& yn_1, boost::numeric::ublas::vector<double>& x, double h, boost::numeric::ublas::vector<double>& C);\n";
			outfile<<"void "<<"computeDependentPopulations_"<<StandardDriverUtilities::size_t2string(i)<<"(boost::numeric::ublas::vector<double>& x, boost::numeric::ublas::vector<double>& C);\n";
			outfile<<"void "<<"computeConservationConstants_"<<StandardDriverUtilities::size_t2string(i)<<"(boost::numeric::ublas::vector<double>& x, boost::numeric::ublas::vector<double>& C);\n";

//				std::cout << "generating code for ivfp index "<<i<<"...\n";

			//write function code into .cpp file
			write_A_code(ivfp_code_directory+"/ivfp_functions.cpp", "createA_"+StandardDriverUtilities::size_t2string(i), current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);
//				std::cout << "about to write \"b\" code...\n";
			write_b_code(ivfp_code_directory+"/ivfp_functions.cpp", "createb_"+StandardDriverUtilities::size_t2string(i), current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);
			write_computeDependentPopulationsCode(ivfp_code_directory+"/ivfp_functions.cpp", "computeDependentPopulations_"+StandardDriverUtilities::size_t2string(i), current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);
			write_computeConservationConstantsCode(ivfp_code_directory+"/ivfp_functions.cpp", "computeConservationConstants_"+StandardDriverUtilities::size_t2string(i), current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);
		}

		outfile<<"#endif\n";
		outfile.close();

	}//try
	catch (...) {
		std::cout << "StochKit ERROR (ssssa_automatic::build_new_ivfps) error writing to file. Terminating.\n";
		outfile.close();
		outfile2.close();
		exit(1);
	}	
}//end build_new_ivfps

void build_precompiled_full_model(std::string ivfp_code_directory, std::vector<ElementaryReaction>& model) {
//	std::cout << "...processing full model...\n";
//	std::vector<std::vector<std::size_t> > ivfp_reaction_lists;
	std::vector<std::size_t> reaction_list(model.size());
	for (std::size_t i=0; i!=reaction_list.size(); ++i) {
		reaction_list[i]=i;
	}
	
	std::string commandStr="touch "+ivfp_code_directory+"/full_model_functions.h "+ivfp_code_directory+"/full_model_functions.cpp ";
	system(commandStr.c_str());
	
	std::ofstream outfile;
	//open for overwriting
	outfile.open((ivfp_code_directory+"/full_model_functions.h").c_str(),std::ios::out | std::ios::trunc);

	if (!outfile) {
		std::cout << "StochKit ERROR (ssssa_automatic::build_precompiled_full_model): error opening file. Terminating.\n";
		exit(1);
	}
	std::ofstream outfile2;//cpp file
	//open for overwriting
	outfile2.open((ivfp_code_directory+"/full_model_functions.cpp").c_str(),std::ios::out | std::ios::trunc);
	if (!outfile2) {
		std::cout << "StochKit ERROR (ssssa_automatic::build_precompiled_full_model): error opening file. Terminating.\n";
		exit(1);
	}

	try {
//			std::cout << "in try block...\n";
	
		outfile<<"#ifndef _FULL_MODEL_FUNCTIONS_H_\n";
		outfile<<"#define _FULL_MODEL_FUNCTIONS_H_\n";
		outfile<<"#include \"boost/numeric/ublas/matrix.hpp\"\n";
		outfile<<"#include \"boost/numeric/ublas/vector.hpp\"\n";
		outfile2<<"#include \"full_model_functions.h\"\n";
		outfile2.close();

			std::pair<std::vector<ElementaryReaction>,std::size_t> current_ivfp_and_NumberOfFastSpecies=reindex_ivfp_reactions(reaction_list, model);

			//write function signatures into header file
			outfile<<"void "<<"createA(boost::numeric::ublas::matrix<double>& A, boost::numeric::ublas::vector<double>& x, double h, boost::numeric::ublas::vector<double>& C);\n";
			outfile<<"void "<<"createb(boost::numeric::ublas::vector<double>& b, boost::numeric::ublas::vector<double>& yn_1, boost::numeric::ublas::vector<double>& x, double h, boost::numeric::ublas::vector<double>& C);\n";
			outfile<<"void "<<"computeDependentPopulations(boost::numeric::ublas::vector<double>& x, boost::numeric::ublas::vector<double>& C);\n";
			outfile<<"void "<<"computeConservationConstants(boost::numeric::ublas::vector<double>& x, boost::numeric::ublas::vector<double>& C);\n";
			outfile<<"std::vector<std::size_t> "<<"fullModelIndependentSpecies();\n";

			//write function code into .cpp file
			write_A_code(ivfp_code_directory+"/full_model_functions.cpp", "createA", current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);
			write_b_code(ivfp_code_directory+"/full_model_functions.cpp", "createb", current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);
			write_computeDependentPopulationsCode(ivfp_code_directory+"/full_model_functions.cpp", "computeDependentPopulations", current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);
			write_computeConservationConstantsCode(ivfp_code_directory+"/full_model_functions.cpp", "computeConservationConstants", current_ivfp_and_NumberOfFastSpecies.first,current_ivfp_and_NumberOfFastSpecies.second);

			std::vector<std::size_t> independentSpecies=getFullModelIndependentSpeciesIndexes(model);
			//write get independent species function to file
			//open for appending
			outfile2.open((ivfp_code_directory+"/full_model_functions.cpp").c_str(),std::ios::out | std::ios::app);
			if (!outfile2) {
				std::cout << "StochKit ERROR (ssssa_automatic::build_precompiled_full_model): error opening file. Terminating.\n";
				exit(1);
			}
			outfile2 << "std::vector<std::size_t> fullModelIndependentSpecies() {\n";
			outfile2 << "std::vector<std::size_t> independentSpecies;\n";
			for (std::size_t i=0; i!=independentSpecies.size(); ++i) {
				outfile2 << "independentSpecies.push_back("<<independentSpecies[i]<<");\n";
			}
			outfile2 << "return independentSpecies;\n";
			outfile2 << "}\n";
			outfile2.close();

		outfile<<"#endif\n";
		outfile.close();

	}//try
	catch (...) {
		std::cout << "StochKit ERROR (ssssa_automatic::build_precompiled_full_model): error writing to file. Terminating.\n";
//		std::cout << "yes, here.\n";
		outfile.close();
		outfile2.close();
		exit(1);	
	}	
}//end build_precompiled_full_model

bool simulation_finished(std::string progress_file_name) {
	//try to read first line of the file...
	std::ifstream fin(progress_file_name.c_str());
    if (!fin) {
      std::cerr << "StochKit ERROR (ssssa_automatic::simulation_finished): Unable to open simulation progress file. Terminating.\n";
      exit(1);
    }
    std::string status;
    fin >> status;//first line of info file will contain "FINISHED" if finished.
	//std::cout << "status is "<<status<<"...\n";

	if (status.compare("FINISHED")==0) {
//		std::cout << "returning true.\n";
		return true;
	}
	else {
//		std::cout << "returning false.\n";
		return false;
	}
}

void compile_new_ivfps(CommandLineInterface& commandLine, std::vector<ElementaryReaction>& reactions) {
	//read in list of new ivfps to compile from output directory's ivfp_list.txt file

	//SINCE WE ARE NOT WRITING INDIVIDUAL FILES FOR EACH IVFP, WE WILL JUST APPEND THE NEW_IVFPS
	//TO THE NORMAL IVFP LIST AND REWRITE THEM ALL OVER THE ORIGINAL FILE

	//SO, NOTE THAT NEW_IVFP_REACTION_LISTS WILL CONTAIN ALL IVFPS, NOT JUST THE NEW ONES!!!

//	std::string new_ivfp_list_filename=commandLine.getGeneratedCodeDir()+"/new_ivfps_to_compile.txt";
	//move contents of new_ivfps_to_compile to ivfp_list.txt
	std::string commandStr="cat "+commandLine.getGeneratedCodeDir()+"/new_ivfps_to_compile.txt >> "+commandLine.getGeneratedCodeDir()+"/ivfp_list.txt";
	system(commandStr.c_str());
	//delete new_ivfps_to_compile.txt
	commandStr="rm "+commandLine.getGeneratedCodeDir()+"/new_ivfps_to_compile.txt";
	

	std::string new_ivfp_list_filename=commandLine.getGeneratedCodeDir()+"/ivfp_list.txt";
	std::ifstream new_ivfp_list_file(new_ivfp_list_filename.c_str());
	if (!new_ivfp_list_file) {
	  std::cerr << "StochKit ERROR (ssssa_automatic): Unable to open list of IVFPs to compile (ivfp_list.txt). Terminating.\n";
	  exit(1);
	}
		
	boost::char_separator<char> sep;//(" ","\t","\n");
	
	std::string line;

	std::vector<std::vector<std::size_t> > new_ivfp_reaction_lists;//all
	std::vector<std::size_t> current_ivfp;//the one we are currently processing
	std::size_t current_rxn_index;
	
	while (std::getline(new_ivfp_list_file,line)) {
		current_ivfp.clear();
		boost::tokenizer<boost::char_separator<char> > tokens(line,sep);
		BOOST_FOREACH(std::string t, tokens) {
			std::istringstream ss(t);
			ss >> current_rxn_index;
			current_ivfp.push_back(current_rxn_index);
		}
		//store popRow in data[0] and data[1]
		new_ivfp_reaction_lists.push_back(current_ivfp);
	}

	std::cout << "StochKit MESSAGE (ssssa_automatic): generating code...\n";
	build_new_ivfps(commandLine.getGeneratedCodeDir(), new_ivfp_reaction_lists, reactions);

//	std::cout << "...writing function assignment code...\n";

//	commandStr="head -n 55 /Users/kevinsanft/Desktop/ucsb/StochKit2_current_ssSSA/in_dev/src/solvers/ssSSA_dynamic/ssssa_auto_custom_serial.cpp > "+ commandLine.getGeneratedCodeDir() + "/ssssa_auto_custom_serial.cpp";
	//assume we're in main stochkit directory
	commandStr="head -n 55 src/solvers/ssSSA_dynamic/ssssa_auto_custom_serial.cpp > "+ commandLine.getGeneratedCodeDir() + "/ssssa_auto_custom_serial.cpp";
	system(commandStr.c_str());

	std::ofstream outfile;
	//open for appending
	outfile.open((commandLine.getGeneratedCodeDir() + "/ssssa_auto_custom_serial.cpp").c_str(),std::ios::out | std::ios::app);
	if (!outfile) {
		std::cout << "StochKit ERROR (ssssa_automatic::compile_new_ivfps): unable to open custom code file. Terminating.\n";
		exit(1);
	}

	outfile << "\n";

	outfile << "std::vector<std::vector<std::size_t> > precompiled_ivfp_reaction_lists("<<new_ivfp_reaction_lists.size()<<");\n";

	for (std::size_t i=0; i!=new_ivfp_reaction_lists.size(); ++i) {
		for (std::size_t j=0; j!=new_ivfp_reaction_lists[i].size(); ++j) {
			outfile << "precompiled_ivfp_reaction_lists["<<i<<"].push_back("<<new_ivfp_reaction_lists[i][j]<<");\n";
		}
	}

	outfile << "ssssa.vfp.buildAllPrecompiledIVFPs(precompiled_ivfp_reaction_lists);//this must be called before we try to set function pointers\n";

	for (std::size_t i=0; i!=new_ivfp_reaction_lists.size(); ++i) {
		outfile << "ssssa.vfp.all_precompiled_ivfps["<<i<<"].A_function=&createA_"<<i<<";\n";
		outfile << "ssssa.vfp.all_precompiled_ivfps["<<i<<"].b_function=&createb_"<<i<<";\n";
		outfile << "ssssa.vfp.all_precompiled_ivfps["<<i<<"].dependentPopulationFn=&computeDependentPopulations_"<<i<<";\n";
		outfile << "ssssa.vfp.all_precompiled_ivfps["<<i<<"].conservationConstantsFn=&computeConservationConstants_"<<i<<";\n";
	}

	outfile << "std::vector<std::size_t> initialFastRxns;\n";

	//iterate over initial fast reaction list
	//first, have to read in list...
	std::string initial_vfp_reactions_list_path=commandLine.getGeneratedCodeDir()+"/initial_vfp_reactions.txt";
	std::ifstream initial_vfp_reactions_list_file(initial_vfp_reactions_list_path.c_str());
	if (!initial_vfp_reactions_list_file) {
	  std::cerr << "StochKit ERROR (ssssa_automatic::compile_new_ivfps): Unable to open initial_vfp_reactions.txt ("<<initial_vfp_reactions_list_path<<"). Terminating.\n";
	  exit(1);
	}
		
	std::vector<double> theRxns;

	std::string theLine;
	std::size_t index;

	std::vector<std::size_t> vfp_rxns;

	while (std::getline(initial_vfp_reactions_list_file,theLine)) {
		boost::tokenizer<boost::char_separator<char> > tokens(theLine,sep);
		BOOST_FOREACH(std::string t, tokens) {
			std::istringstream ss(t);
			ss >> index;
			vfp_rxns.push_back(index);
		}
	}

	for (std::size_t i=0; i!=vfp_rxns.size(); ++i) {
		outfile << "initialFastRxns.push_back("<<vfp_rxns[i] << ");\n";
	}

	outfile << "ssssa.setInitialFastReactions(initialFastRxns);\n";

	//set full model functions
	outfile << "ssssa.vfp.ffe.fullModelProcess.A_function=&createA;\n";
	outfile << "ssssa.vfp.ffe.fullModelProcess.b_function=&createb;\n";
	outfile << "ssssa.vfp.ffe.fullModelProcess.dependentPopulationFn=&computeDependentPopulations;\n";
	outfile << "ssssa.vfp.ffe.fullModelProcess.conservationConstantsFn=&computeConservationConstants;\n";
	outfile << "ssssa.vfp.ffe.fullModelProcess.independentSpeciesFn=&fullModelIndependentSpecies;\n";
	outfile << "\n";

	outfile.close();

//	commandStr="sed -n '55,180p' /Users/kevinsanft/Desktop/ucsb/StochKit2_current_ssSSA/in_dev/src/solvers/ssSSA_dynamic/ssssa_auto_custom_serial.cpp >> "+ commandLine.getGeneratedCodeDir() + "/ssssa_auto_custom_serial.cpp";
	//assume we're in main stochkit directory
	commandStr="sed -n '55,189p' src/solvers/ssSSA_dynamic/ssssa_auto_custom_serial.cpp >> "+ commandLine.getGeneratedCodeDir() + "/ssssa_auto_custom_serial.cpp";
	system(commandStr.c_str());

	//end code generation section

	//compile

	//if commandLine.getGeneratedCodeDir()/bin dir does not yet exist, create it
	std::string binPath=commandLine.getGeneratedCodeDir()+"/bin";
	if (!boost::filesystem::exists(binPath)) {
		boost::filesystem::create_directory(binPath);
	}

	//commandStr="make ssssa_auto_custom_compiled GENERATED_CODE_PATH=/Users/kevinsanft/Desktop/ucsb/StochKit2_current_ssSSA/in_dev/models/examples/test_dynamic_partitioning_generated_code/
	//record current path so we can cd back to it after compiling
	std::string currentPath=boost::filesystem::current_path().string();

//	std::string makeCommand=(std::string)"cd /Users/kevinsanft/Desktop/ucsb/StochKit2_current_ssSSA/in_dev/src/solvers/ssSSA_dynamic; make ssssa_auto_custom_compiled GENERATED_CODE_PATH="+currentPath+"/"+commandLine.getGeneratedCodeDir()+" --silent";
	//assume we're in main stochkit directory...
	std::string makeCommand=(std::string)"cd src/solvers/ssSSA_dynamic; make ssssa_auto_custom_compiled GENERATED_CODE_PATH="+commandLine.getGeneratedCodeDir()+" --silent";

	//redirect any errors from make to a log file
//	makeCommand+=" >& "+currentPath+"/"+commandLine.getGeneratedCodeDir()+"/compile-log.txt";
	makeCommand+=" >& "+commandLine.getGeneratedCodeDir()+"/compile-log.txt";

	//std::cout << "about to call makeCommand: "<<makeCommand<<"\n";
	std::cout << "StochKit MESSAGE: compiling generated code...this will take a few moments...\n";
	int returnValue=system(makeCommand.c_str());

	if (returnValue!=0) {
		std::cout << "StochKit ERROR: compile of generated code failed.  Terminating.\n";
//		std::string logPath=currentPath+"/"+commandLine.getGeneratedCodeDir()+"/compile-log.txt";
		std::string logPath=commandLine.getGeneratedCodeDir()+"/compile-log.txt";
		std::cout << "Check log file \"" << logPath << "\" for error messages.\n";
		exit(1);
	}

}

int main(int ac, char* av[])
{

	timeval timer0;
	gettimeofday(&timer0,NULL);
	double main_start=timer0.tv_sec+(timer0.tv_usec/1000000.0);

	//SSSSA::CommandLineInterface commandLine(ac,av);
	CommandLineInterface commandLine(ac,av);

    char* modelFileName;
#ifdef WIN32
	std::string name;
	name=commandLine.getModelFileName();
    modelFileName=const_cast<char*>(name.c_str());
#else
	modelFileName=const_cast<char*>(commandLine.getModelFileName().c_str());
#endif
	
//	std::cout << "calling convertXML...\n";
	std::vector<ElementaryReaction> reactions=convertXML(modelFileName);
//	std::cout << "done calling convertXML...\n";

	//ensure <model name>_generated_code directory exists
	if (!(boost::filesystem::exists(commandLine.getGeneratedCodeDir()))) {
		//create output directory
		boost::filesystem::create_directories(commandLine.getGeneratedCodeDir());
	}
	
	//should check here to see if existing unfinished runs exist and provide a warning if they do
	//each "in progress" run should have a unique output file "in progress" directory, made unique by, say, appending a timestamp
	//instead, we will just provide a generic warning
	std::cout<<"\nStochKit MESSAGE (ssssa_automatic): starting slow-scale SSA simulation (beta version)...\n";

	//here could check if this model has already been run by seeing if model file being simulated matches version that was copied to output directory by previous simulation are identical
	//if model has been previously run (successfully), then there should already exist presimulation data, initial vfp reaction list, and ivfp lists.

	//here is where we would call the presimulation program
	//output is a file named initial_vfp_reactions and a file named new_ivfps_to_compile
	typedef SSA_Direct<StandardDriverTypes::populationType,
		StandardDriverTypes::stoichiometryType, 
		StandardDriverTypes::propensitiesType,
		StandardDriverTypes::graphType> SSA;

    Input_mass_action<StandardDriverTypes::populationType, StandardDriverTypes::stoichiometryType, StandardDriverTypes::propensitiesType, StandardDriverTypes::graphType> model(modelFileName);

	SSA ssa(model.writeInitialPopulation(),
		       model.writeStoichiometry(),
		       model.writePropensities(),
		       model.writeDependencyGraph());

    if (commandLine.getUseSeed()) {
      ssa.seed(commandLine.getSeed());
    }

	//run a little ssa simulation, keep track of firing frequency of each reaction channel
	//in practice, if we've already ran a presimulation from a previous ensemble, there would be no need to run another one. but do it for testing/development/timing
	//stop after simulation time is exceeded or a maximum number of reaction steps have been fired
	//this could be a crude tau-leaping instead
	//decisions to be made about what to do with data for initial transient period
	//would like to keep transient data (perhaps up to longest allowable "fast" relaxation time), then a separate data set for post-transient results
		//ideally, the presim would go sufficiently past the transient time

	std::size_t max_presim_steps=5000000;
	std::size_t presim_steps=0;
	
	//hard-code "transient time" to be 1/50 of total simulation time
	double transientTime=commandLine.getSimulationTime()/50.0;
	std::vector<double> transientData(reactions.size(),0.0);
	std::vector<double> postTransientData(reactions.size(),0.0);
	
	std::cout << "StochKit MESSAGE (ssssa_automatic): running presimulation...\n";
	
	//keep track of how long the presimulation took...
	timeval timer1;
	gettimeofday(&timer1,NULL);
	double presim_start=timer1.tv_sec+(timer1.tv_usec/1000000.0);

	ssa.initialize(0);
	double tau=ssa.selectStepSize();
	ssa.setCurrentTime(ssa.getCurrentTime()+tau);
	while (ssa.getCurrentTime()<commandLine.getSimulationTime() && presim_steps<max_presim_steps) {
	
		int rxnIndex=ssa.selectReaction();
		if (rxnIndex==-1) {
			std::cout << "StochKit ERROR (ssssa_automatic): unexpected error in presimulation. Terminating.\n";
			exit(1);
		}
//		std::cout << "selected reaction index "<<rxnIndex<<"\n";
		ssa.fireReaction(rxnIndex);
	
		if (ssa.getCurrentTime()<transientTime) {
			++transientData[rxnIndex];
		}
		else {
			++postTransientData[rxnIndex];
		}
		++presim_steps;
	
		tau=ssa.selectStepSize();
//		std::cout << "selected tau="<<tau<<"\n";
		ssa.setCurrentTime(ssa.getCurrentTime()+tau);
//		std::cout << "currentTime is now "<<ssa.getCurrentTime()<<"\n";
	}
	
	
	gettimeofday(&timer1,NULL);
	double presim_end=timer1.tv_sec+(timer1.tv_usec/1000000.0);
	double presim_time=(presim_end-presim_start);

	std::cout << "StochKit MESSAGE (ssssa_automatic): presimulation finished (took "<<presim_time<<" seconds to simulate "<<presim_steps<<" steps).\n";
	
	//the part of the presimulation that we will use for the partitioning
	std::vector<double> presimulationDataForPartition=postTransientData;

	bool usedTransientData=false;
	if (ssa.getCurrentTime()<commandLine.getSimulationTime()) {
		std::cout << "StochKit MESSAGE (ssssa_automatic): presimulation reached max steps allowed at t="<<ssa.getCurrentTime()-tau<<".\n";
		//check to see if presimulation was long enough...
		if (std::accumulate(postTransientData.begin(),postTransientData.end(),0.0) < 10000) {
			std::cout << "StochKit WARNING (ssssa_automatic): presimulation may not have simulated long enough to provide a good sample, so including transient data to determine initial partition.\n";
			usedTransientData=true;
			for (std::size_t i=0; i!=transientData.size(); ++i) {
				presimulationDataForPartition[i]+=transientData[i];
			}
		}
	}
	
	double ssa_ensemble_sim_time_estimate=presim_time*(double)commandLine.getRealizations();	
	if (ssa.getCurrentTime()<commandLine.getSimulationTime()) {
		//if presim_time is based on only a partial realization, need to scale it
		ssa_ensemble_sim_time_estimate=presim_time*((double)commandLine.getSimulationTime()/(double)ssa.getCurrentTime())*(double)commandLine.getRealizations();
	}
	
	//compare ssa_ensemble_sim_time_estimate to my estimate based on # of reactions (function fit using Kevin Sanft's old Macbook)
	double y=0.043*(double)reactions.size()+4.5;//see kevin's notes on how this was fit
	//y is 1*10^-7 seconds per slow reaction step
	
	double my_estimate=y*pow(10.0,-7.0)*(double)presim_steps;
//	std::cout << "my estimate of presim elapsed time would have been: "<<my_estimate<<"\n";
	double scale_factor=presim_time/my_estimate;
//	std::cout << "therefore, my scale factor is "<<scale_factor<<"\n";
	
	//create a partition from presimulationDataForPartition...
//	std::cout << "presimulation data to be used to determine initial partition:\n";
//	for (std::size_t i=0; i!=presimulationDataForPartition.size(); ++i) {
//		std::cout << "reaction "<<i<<": "<<presimulationDataForPartition[i]<<"\n";
//	}
	
	//write presim data to file
	std::ofstream presim_data_outfile;
	std::string presim_data_filename=commandLine.getGeneratedCodeDir()+"/presimulation_data.txt";
	//open
	presim_data_outfile.open(presim_data_filename.c_str(),std::ios::out);
	if (!presim_data_outfile) {
		std::cout << "StochKit ERROR (ssssa_automatic): error opening presimulation data text file. Terminating.\n";
		exit(1);
	}
	try {
		for (std::size_t i=0; i!=presimulationDataForPartition.size(); ++i) {
			presim_data_outfile << "reaction "<<i<<": "<<presimulationDataForPartition[i]<<"\n";
		}
		presim_data_outfile.close();
	}
	catch (...) {
		std::cout << "StochKit ERROR (ssssa_automatic): error writing to presimulation data text file. Terminating.\n";
		exit(1);	
	}	

	Groups groups(reactions);
	StandardDriverTypes::populationType presim_end_pop=ssa.getCurrentPopulation();
//	std::cout << "presim_end_pop: ";
//	for (std::size_t i=0; i!=presim_end_pop.size(); ++i) {
//		std::cout << presim_end_pop(i) << "\t";
//	}
//	std::cout << "\n";
	//compute how long the presim data represents in simulation
	double presim_data_run_time=std::min(ssa.getCurrentTime(),commandLine.getSimulationTime());//needed in case ssa.getCurrentTime==infinity
	if (!usedTransientData) presim_data_run_time-=transientTime;
//	std::cout << "fyi, presim_data_run_time="<<presim_data_run_time<<"\n";
	groups.update(presim_end_pop,presimulationDataForPartition,presim_data_run_time);
	
//	std::cout << "for now, exiting before calling partition.\n";
//	exit(1);

	groups.partition(reactions,transientTime);
	
	double presim_ssssa_time=groups.calculateSimulationTime(groups.currentFP,reactions);

	//estimate slow-scale ssa simulation time
	double ssssa_ensemble_sim_time_estimate=presim_ssssa_time*(double)commandLine.getRealizations();	
	if (ssa.getCurrentTime()<commandLine.getSimulationTime()) {
		//if presim_time is based on only a partial realization, need to scale it
		ssssa_ensemble_sim_time_estimate=scale_factor*presim_ssssa_time*((double)commandLine.getSimulationTime()/(double)ssa.getCurrentTime())*(double)commandLine.getRealizations();
	}
	
	std::cout << "Based on presimulation, estimated simulation times are:\n";
	std::cout << "\texact SSA simulation (direct method): "<<ssa_ensemble_sim_time_estimate<<" seconds.\n";
	if (groups.currentFP.get_fast_reactions().size()==0) {
		std::cout << "\tslow-scale SSA: "<<ssa_ensemble_sim_time_estimate<<" seconds (NOT INCLUDING VFP COMPILE TIME AND REPARTITION OVERHEAD).\n";	
		std::cout << "StochKit WARNING (ssssa_automatic): based on presimulation, slow-scale SSA might not be beneficial.\n";
		//ssssa might still be beneficial if:
		//a) an alternate initial partition is selected AND/OR
		//b) the ssa presimulation only covered a small portion of the total simulation time and a repartitioning selects a valid (nonzero) vfp
	}
	else {
		std::cout << "\tslow-scale SSA: "<<ssssa_ensemble_sim_time_estimate<<" seconds (NOT INCLUDING VFP COMPILE TIME AND REPARTITION OVERHEAD).\n";
	}
	
//	std::cout << "based on presimulation, the initial partition will be:\n";
//	groups.currentFP.print_fp_list();	
//	std::cout << "for now, exiting without running a simulation.\n";
//	exit(1);

	//for now, clear old ivfp_list.txt (in practice, there would be no good reason to throw out this data, but delete it for testing.)
	std::string system_command="rm -f "+commandLine.getGeneratedCodeDir()+"/ivfp_list.txt";
	system(system_command.c_str());
	
	//add code to write ivfp_list.txt and new_ivfps_to_compile.txt
	//initially, don't write to ivfp_list--items on new_ivfps_to_compile get copied there
	//std::ofstream ivfp_list_outfile;
	//std::string ivfp_list_filename=commandLine.getGeneratedCodeDir()+"/ivfp_list.txt";
	std::ofstream new_ivfps_to_compile_outfile;
	std::string new_ivfps_to_compile_filename=commandLine.getGeneratedCodeDir()+"/new_ivfps_to_compile.txt";
	//open
	//ivfp_list_outfile.open(ivfp_list_filename.c_str(),std::ios::out);
	new_ivfps_to_compile_outfile.open(new_ivfps_to_compile_filename.c_str(),std::ios::out);
	//if (!(ivfp_list_outfile && new_ivfps_to_compile_outfile)) {
	if (!new_ivfps_to_compile_outfile) {
		std::cout << "StochKit ERROR (ssssa_automatic): error opening fast process list text file. Terminating.\n";
		exit(1);
	}
	try {
		for (std::size_t i=0; i!=groups.currentFP.fast_groups.size(); ++i) {
			for (std::set<std::size_t>::iterator it=groups.currentFP.fast_groups[i].fastReactionIndexes.begin(); it!=groups.currentFP.fast_groups[i].fastReactionIndexes.end(); ++it) {
	//			std::cout << *it << "\t";
	//			ivfp_list_outfile << *it << " ";
				new_ivfps_to_compile_outfile << *it << " ";
			}		
	//			ivfp_list_outfile << "\n";
				new_ivfps_to_compile_outfile << "\n";
		}

	//	ivfp_list_outfile.close();
		new_ivfps_to_compile_outfile.close();
	}
	catch (...) {
		std::cout << "StochKit ERROR (ssssa_automatic): error writing to fast process list text file. Terminating.\n";
		exit(1);	
	}	

	//write initial_vfp_reactions.txt
	std::ofstream initial_vfp_reactions_outfile;
	std::string initial_vfp_reactions_filename=commandLine.getGeneratedCodeDir()+"/initial_vfp_reactions.txt";
	//open
	initial_vfp_reactions_outfile.open(initial_vfp_reactions_filename.c_str(),std::ios::out);
	if (!initial_vfp_reactions_outfile) {
		std::cout << "StochKit ERROR (ssssa_automatic): error opening initial vfp list text file. Terminating.\n";
		exit(1);
	}
	try {
		std::set<std::size_t> initial_fast_reaction_set=groups.currentFP.get_fast_reactions();

		for (std::set<std::size_t>::iterator it=initial_fast_reaction_set.begin(); it!=initial_fast_reaction_set.end(); ++it) {

				initial_vfp_reactions_outfile << *it << " ";
		}

		initial_vfp_reactions_outfile.close();
	}
	catch (...) {
		std::cout << "StochKit ERROR (ssssa_automatic): error writing to initial vfp list text file. Terminating.\n";
		exit(1);	
	}	

//	
//	//and get a copy of new_ivfps_to_compile.txt
//	system_command="cp "+commandLine.getGeneratedCodeDir()+"/new_ivfps_to_compile_backup.txt "+commandLine.getGeneratedCodeDir()+"/new_ivfps_to_compile.txt";
//	system(system_command.c_str());
//
//	//write status info to simulation_progress.txt
	system_command="echo 'STARTED' > "+commandLine.getGeneratedCodeDir()+"/simulation_progress.txt";
	system(system_command.c_str());

	build_precompiled_full_model(commandLine.getGeneratedCodeDir(), reactions);
	
	timeval timer2;
	gettimeofday(&timer1,NULL);
	double compile_time=0;//keep track of how much time spent compiling
	
	int systemResult=-999;
	
	//while simulation is not finished, compile new
	while (!simulation_finished(commandLine.getGeneratedCodeDir()+"/simulation_progress.txt")) {
//		std::cout << "compile then restart simulation here...\n";

		gettimeofday(&timer2,NULL);
		double compile_start_time=timer2.tv_sec+(timer2.tv_usec/1000000.0);
		compile_new_ivfps(commandLine,reactions);
		gettimeofday(&timer2,NULL);
		double compile_end_time=timer2.tv_sec+(timer2.tv_usec/1000000.0);
		compile_time+=(compile_end_time-compile_start_time);
		
		//resume the simulation...
		system_command=commandLine.getGeneratedCodeDir()+"/bin/ssssa_auto_custom_compiled "+commandLine.getCmdArgs();
//		std::cout << "calling the following command: "<<system_command<<"\n";
		systemResult=system(system_command.c_str());

//		std::cout << "systemResult="<<systemResult<<"\n";

//std::cout << "terminating in ssssa_automatic.main after resuming simulation...\n";
//exit(1);

		if (systemResult!=0) {
			//the simulation terminated with an error, so stop.
			std::cout << "StochKit ERROR (ssssa_automatic): simulation exited with an error (systemResult="<<systemResult<<"). Setting simulation progress to FINISHED. Terminating.\n";
			system_command="echo 'FINISHED' > "+commandLine.getGeneratedCodeDir()+"/simulation_progress.txt";
			system(system_command.c_str());
		}

	}
	

	gettimeofday(&timer0,NULL);
	double main_end=timer0.tv_sec+(timer0.tv_usec/1000000.0);
	double main_time=(main_end-main_start);

	std::cout << "StochKit MESSAGE (ssssa_automatic): total elapsed time was approximately "<<main_time<<" seconds.\n";
	std::cout << "StochKit MESSAGE (ssssa_automatic): time spent compiling was approximately "<<compile_time<<" seconds.\n";
	std::cout << "done!\n";

	return 0;
}
