#include "ElementaryReaction.h"
	
ElementaryReaction::sparse_vec& ElementaryReaction::getStoichiometry() {
	return stoichiometry;
}


ElementaryReaction::ElementaryReaction() : reactants(), products(), rateConstant(0), stoichiometry()
{}

ElementaryReaction::ElementaryReaction(double rateConstant, Reactants reactants, Products products, std::size_t populationVectorSize) :
	reactants(reactants), products(products), rateConstant(rateConstant), stoichiometry(populationVectorSize)
{
	if (!rebuild(populationVectorSize)) {
		std::cout << "StochKit ERROR (ElementaryReaction): error constructing ElementaryReaction.\n";
	}
}

//double ElementaryReaction::propensity(ElementaryReaction::dense_vec& population) {
//	return (this->*propensityFunction)(population);
//}

//double ElementaryReaction::propensity(gsl_vector * population) {
//	return (this->*gslPropensityFunction)(population);
//}

Reactants ElementaryReaction::getReactants() { return reactants; }
Products ElementaryReaction::getProducts() { return products; }

std::size_t ElementaryReaction::calculateReactionOrder() { //0 for synthesis, 1 for isomer, 2 for bimolecular
	std::size_t order=0;
	//use reactants to calculate reaction order
	for (std::size_t i=0; i!=reactants.get().size(); ++i) {
		order+=reactants[i].getMoleculeCount();
	}
	
	return order;
}

bool ElementaryReaction::rebuild(std::size_t populationVectorSize) {

	bool flag=true;//true if no errors
	std::size_t rxnOrder=calculateReactionOrder();
	if (rxnOrder>2) {
		flag=false;
		std::cout << "StochKit ERROR (ElementaryReaction): reaction order >2 not valid for ElementaryReaction.\n";
	}
	std::vector<Reactant> theReactants=reactants.get();
	if (theReactants.size()>rxnOrder) {
		flag=false;
		std::cout << "StochKit ERROR (ElementaryReaction): error in Reactants.\n";
	}
	
	//assign propensity function and partial derivative function
	if (rxnOrder==0) {
		reactantIndex1=-1;
		reactantIndex2=-1;
		propensityFunction=&ElementaryReaction::propensity0;
		d_dx_i_function=&ElementaryReaction::partial_0th_order;
	}
	else if (rxnOrder==1) {
		reactantIndex1=reactants.get()[0].getSpeciesIndex();
		reactantIndex2=-1;
		propensityFunction=&ElementaryReaction::propensity1;
		d_dx_i_function=&ElementaryReaction::partial_1st_order;
	}
	else if (rxnOrder==2) {
		reactantIndex1=reactants.get()[0].getSpeciesIndex();
		if (reactants.get()[0].getMoleculeCount()==2) {
			reactantIndex2=-1;
			propensityFunction=&ElementaryReaction::propensity11;
			d_dx_i_function=&ElementaryReaction::partial_2nd_order_same_reactant;
		}
		else {
			reactantIndex2=reactants.get()[1].getSpeciesIndex();
			propensityFunction=&ElementaryReaction::propensity2;
			d_dx_i_function=&ElementaryReaction::partial_2nd_order;
		}
	}
	
//		std::cout << "creating stoichiometry...\n";
	stoichiometry=products.calculateStoichiometry(populationVectorSize)-reactants.calculateStoichiometry(populationVectorSize);
//		std::cout << "finished creating stoichiometry...\n";
	return flag;
}

double ElementaryReaction::getRateConstant() {
	return rateConstant;
}

double ElementaryReaction::d_dx_i(std::size_t speciesIndex, dense_vec& population) {
	return (this->*d_dx_i_function)(speciesIndex,population);
}

void ElementaryReaction::display() {
	if (reactants.size()==0) {
		std::cout << "NULL";
	}
	else {
		for (std::size_t i=0; i!=reactants.size(); ++i) {
			if (i>0) std::cout << " + ";
			std::cout << "X["<<reactants[i].getSpeciesIndex()<<"]";
			for (std::size_t j=1; j!=reactants[i].getMoleculeCount(); ++j) {
				std::cout << " + "<< "X["<<reactants[i].getSpeciesIndex()<<"]";
			}
		}
	}
	
	std::cout << " --("<<rateConstant<<")--> ";

	if (products.size()==0) {
		std::cout << "NULL";
	}
	else {
		for (std::size_t i=0; i!=products.size(); ++i) {
			if (i>0) std::cout << " + ";
			std::cout << "X["<<products[i].getSpeciesIndex()<<"]";
			for (std::size_t j=1; j!=products[i].getMoleculeCount(); ++j) {
				std::cout << " + "<< "X["<<products[i].getSpeciesIndex()<<"]";
			}
		}
	}
	
}
  
bool ElementaryReaction::isDuplicate(ElementaryReaction& other) {
	//see if equivalent EXCEPT for rate constant
	if (reactants==other.reactants && products==other.products) return true;
	else return false;
}//end isDuplicate

//double ElementaryReaction::partial_0th_order(std::size_t speciesIndex, gsl_vector * population) {
//	return 0.0;
//}
//
//double ElementaryReaction::partial_1st_order(std::size_t speciesIndex, gsl_vector * population) {
//	if ((int)speciesIndex!=reactantIndex1) {
//		return 0.0;
//	}
//	else return rateConstant;
//}
//
//double ElementaryReaction::partial_2nd_order(std::size_t speciesIndex, gsl_vector * population) {
//	//assumes reactantIndex1!=reactantIndex2
//	if ((int)speciesIndex!=reactantIndex1 && (int)speciesIndex!=reactantIndex2) {
//		return 0.0;
//	}
//	else if ((int)speciesIndex==reactantIndex1) {
//		return rateConstant*gsl_vector_get(population,reactantIndex2);
//	}
//	else {
//		return rateConstant*gsl_vector_get(population,reactantIndex1);
//	}
//}
//
//double ElementaryReaction::partial_2nd_order_same_reactant(std::size_t speciesIndex, gsl_vector * population) {
//	//assumes reactantIndex1==reactantIndex2
//	if ((int)speciesIndex!=reactantIndex1) {
//		return 0.0;
//	}
//	else {
//		return rateConstant*gsl_vector_get(population,reactantIndex1);
//	}
//}
//
//double ElementaryReaction::propensity0(ElementaryReaction::dense_vec& population) {
//	return rateConstant;
//}
//double ElementaryReaction::propensity1(ElementaryReaction::dense_vec& population) {
//  return rateConstant*population(reactantIndex1);
//}
////bimolecular, same species
//double ElementaryReaction::propensity11(ElementaryReaction::dense_vec& population) {
//	//return scaledRateConstant*population[reactantIndex1]*(population[reactantIndex1]-1);
//	return 0.5*rateConstant*population(reactantIndex1)*(population(reactantIndex1)-1);
//
//}
//double ElementaryReaction::propensity2(ElementaryReaction::dense_vec& population) {
//	return rateConstant*population(reactantIndex1)*population(reactantIndex2);
//}
//
//double ElementaryReaction::gslPropensity0(gsl_vector * population) {
//	return rateConstant;
//}
//double ElementaryReaction::gslPropensity1(gsl_vector * population) {
//  return rateConstant*gsl_vector_get(population,reactantIndex1);
//}
////bimolecular, same species
//double ElementaryReaction::gslPropensity11(gsl_vector * population) {
//	//return scaledRateConstant*population[reactantIndex1]*(population[reactantIndex1]-1);
//	return 0.5*rateConstant*gsl_vector_get(population,reactantIndex1)*(gsl_vector_get(population,reactantIndex1)-1);
//
//}
//double ElementaryReaction::gslPropensity2(gsl_vector * population) {
//	return rateConstant*gsl_vector_get(population,reactantIndex1)*gsl_vector_get(population,reactantIndex2);
//}
