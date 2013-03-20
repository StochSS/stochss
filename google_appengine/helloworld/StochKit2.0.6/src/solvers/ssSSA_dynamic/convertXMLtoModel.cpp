#include "convertXMLtoModel.h"


//std::vector<ElementaryReaction<boost::numeric::ublas::mapped_vector<double>, boost::numeric::ublas::vector<double> > > convertXML(std::string modelFile) {
std::vector<ElementaryReaction> convertXML(std::string modelFile) {
	
	//std::string testModelFile="models/examples/dimer_decay.xml";
    char* modelFileName;
	
    modelFileName=const_cast<char*>(modelFile.c_str());
    
    STOCHKIT::Input_mass_action<STOCHKIT::StandardDriverTypes::populationType, STOCHKIT::StandardDriverTypes::stoichiometryType, STOCHKIT::StandardDriverTypes::propensitiesType, STOCHKIT::StandardDriverTypes::graphType> model(modelFileName);
	
//	std::vector<ElementaryReaction<boost::numeric::ublas::mapped_vector<double>, boost::numeric::ublas::vector<double> > > reactions;
	std::vector<ElementaryReaction> reactions;
		
	STOCHKIT::StandardDriverTypes::populationType originalInitialPopulation=model.writeInitialPopulation();
	//expect MATRIX_STOICHIOMETRY to be defined for ssSSA
	STOCHKIT::StandardDriverTypes::stoichiometryType originalStoichiometry=model.writeStoichiometry();
	STOCHKIT::StandardDriverTypes::propensitiesType originalPropensities=model.writePropensities();
	//	model.writeDependencyGraph());
	//loop over propensities, create "ElementaryReaction" objects
	std::vector<Reactant> reactants;
	std::vector<Product> products;
	std::size_t N=originalInitialPopulation.size();
	for (std::size_t i=0; i!=originalPropensities.size(); ++i) {
//		std::cout << "processing reaction "<<i<<"...\n";
		reactants.clear();
		products.clear();
		if (originalPropensities.propensities_index[i].first==0) {
			double rateConstant=originalPropensities.simplePropensities[originalPropensities.propensities_index[i].second].rateConstant;
			int reactantIndex1=originalPropensities.simplePropensities[originalPropensities.propensities_index[i].second].reactantIndex1;
			int reactantIndex2=originalPropensities.simplePropensities[originalPropensities.propensities_index[i].second].reactantIndex2;
			//detect reactions of form A+A->something
			if (reactantIndex1==reactantIndex2 && reactantIndex2!=-1) {
//				std::cout << "detected A+A type reaction\n";
				//std::cout << "StochKit MESSAGE (convertXML): convertXML does not yet fully support A+A type reaction propensities...\n";
				//exit(1);
				Reactant bimolecular_same_species_reactant(reactantIndex1,2);
//				std::cout << "before pushing bimolecular_same_species_reactant onto reactants, reactants.size="<<reactants.size()<<"\n";
				reactants.push_back(bimolecular_same_species_reactant);
//				std::cout << "after, reactants.size="<<reactants.size()<<"\n";
				STOCHKIT::StandardDriverTypes::stoichiometryRow stoich(originalStoichiometry,i);
				STOCHKIT::StandardDriverTypes::stoichiometryRow::iterator it;
				for (it=stoich.begin(); it!=stoich.end(); ++it) {
					if (*it<0) {
						if ((int)it.index()!=reactantIndex1) {
							std::cout << "StochKit ERROR (convertXML): looks like A+A type reaction with species index "<<reactantIndex1<<" but stoichiometry of species index "<<it.index()<<" is negative ("<<*it<<"). Terminating.\n";
							exit(1);
						}
					}
					//create Product object
					else {
						Product zero_order_product(it.index(),*it);//(speciesIndex, moleculeCount)
//						std::cout << "pushing product ("<<it.index()<<","<<*it<<") onto products.\n";
						products.push_back(zero_order_product);
						
					}
				}
				if (stoich(reactantIndex1)==-1 || stoich(reactantIndex1)==0) {
					Product the_product(reactantIndex1,stoich(reactantIndex1)+2);//(speciesIndex, moleculeCount)
//					std::cout << "pushing special product ("<<reactantIndex1<<","<<(stoich(reactantIndex1)+2)<<") onto products.\n";
					products.push_back(the_product);									
				}

				//create ElementaryReaction...
				//ElementaryReaction<boost::numeric::ublas::mapped_vector<double>, boost::numeric::ublas::vector<double> > rxn(rateConstant,reactants,products,N);
//				std::cout << "before creating ElementaryReaction object, reactants.size="<<reactants.size()<<"\n";
				ElementaryReaction rxn(rateConstant,reactants,products,N);
				
				reactions.push_back(rxn);

				
			}
			//detect 0th order synthesis reaction
			else if (reactantIndex1==-1) {
				//ensure that 0th order synthesis reaction doesn't consume any species
				STOCHKIT::StandardDriverTypes::stoichiometryRow stoich(originalStoichiometry,i);
				//typename StandardDriverTypes::stoichiometryRow::iterator it;
				STOCHKIT::StandardDriverTypes::stoichiometryRow::iterator it;
				for (it=stoich.begin(); it!=stoich.end(); ++it) {
					if (*it<0) {
						std::cout << "StochKit ERROR (convertXML): reaction index "<<i<<" is invalid: propensity looks like 0th order synthesis but stoichiometry consumes species index "<<it.index()<<". Terminating.\n";
						exit(1);
					}
					//create Product object
					else {
						Product zero_order_product(it.index(),*it);//(speciesIndex, moleculeCount)
						products.push_back(zero_order_product);
						
					}
				}
				//create ElementaryReaction...
				//ElementaryReaction<boost::numeric::ublas::mapped_vector<double>, boost::numeric::ublas::vector<double> > rxn(rateConstant,reactants,products,N);
				ElementaryReaction rxn(rateConstant,reactants,products,N);
				reactions.push_back(rxn);
			}
			else if (reactantIndex2==-1) { // detect first order reaction
				STOCHKIT::StandardDriverTypes::stoichiometryRow stoich(originalStoichiometry,i);
				STOCHKIT::StandardDriverTypes::stoichiometryRow::iterator it;
				Reactant first_order_reactant(reactantIndex1,1);
				reactants.push_back(first_order_reactant);
				for (it=stoich.begin(); it!=stoich.end(); ++it) {
					if (*it<0 && (int)it.index()!=reactantIndex1) {
						std::cout << "StochKit ERROR (): reaction index "<<i<<" is invalid: propensity looks like first order consuming species index "<<reactantIndex1<<" but stoichiometry consumes species index "<<it.index()<<". Terminating.\n";
						exit(1);					
					}
					if (*it < -1) {
						std::cout << "StochKit ERROR (): reaction index "<<i<<" is invalid: propensity looks like first order but stoichiometry has a "<<*it<<" term. Terminating.\n";
						exit(1);
					}
					if (*it>0) {
						if ((int)it.index()!=reactantIndex1) {
							Product the_product(it.index(),*it);//(speciesIndex, moleculeCount)
							products.push_back(the_product);
						}
						else {
							std::cout << "StochKit WARNING (): reaction index "<<i<<" is strange: propensity looks like first order consuming species index "<<reactantIndex1<<" but stoichiometry for that species is "<<*it<<".\n";
							Product the_product(it.index(),*it+1);//(speciesIndex, moleculeCount)
							products.push_back(the_product);						
						}
					}
				}
				//catch an A->A+something reaction
				if (stoich(reactantIndex1)==0) {
						Product the_product(reactantIndex1,stoich(reactantIndex1)+1);//(speciesIndex, moleculeCount)
						products.push_back(the_product);									
				}
				//create ElementaryReaction...
				//ElementaryReaction<boost::numeric::ublas::mapped_vector<double>, boost::numeric::ublas::vector<double> > rxn(rateConstant,reactants,products,N);
				ElementaryReaction rxn(rateConstant,reactants,products,N);
				reactions.push_back(rxn);
			}
			else { // bimolecular with two different reactants
				STOCHKIT::StandardDriverTypes::stoichiometryRow stoich(originalStoichiometry,i);
				STOCHKIT::StandardDriverTypes::stoichiometryRow::iterator it;
				Reactant first_order_reactant1(reactantIndex1,1);
				reactants.push_back(first_order_reactant1);
				Reactant first_order_reactant2(reactantIndex2,1);
				reactants.push_back(first_order_reactant2);

				for (it=stoich.begin(); it!=stoich.end(); ++it) {
					if ( *it<0 && (int)it.index()!=reactantIndex1 && (int)it.index()!=reactantIndex2) {
						std::cout << "StochKit ERROR (): reaction index "<<i<<" is invalid: propensity looks like 2nd order consuming species index "<<reactantIndex1<<" and "<<reactantIndex2<<" but stoichiometry consumes species index "<<it.index()<<". Terminating.\n";
						exit(1);					
					}
					if (*it < -1) {
						std::cout << "StochKit ERROR (): reaction index "<<i<<" is invalid: propensity looks like 2nd order with different reactants but stoichiometry has a "<<*it<<" term. Terminating.\n";
						exit(1);
					}
					if (*it>0) {
						if ((int)it.index()!= reactantIndex1 && (int)it.index()!=reactantIndex2) {
							Product the_product(it.index(),*it);//(speciesIndex, moleculeCount)
							products.push_back(the_product);
						}
						else {
							std::cout << "StochKit WARNING (): reaction index "<<i<<" is strange: propensity looks like bimolecular consuming species indexes "<<reactantIndex1<<" and "<<reactantIndex2<<" but stoichiometry for one reactant species is "<<*it<<".\n";
							Product the_product(it.index(),*it+1);//(speciesIndex, moleculeCount)
							products.push_back(the_product);												
						}
					}
				}
				//catch an A+B->A+something reactions
				if (stoich(reactantIndex1)==0) {
					Product the_product(reactantIndex1,stoich(reactantIndex1)+1);//(speciesIndex, moleculeCount)
					products.push_back(the_product);									
				}
				if (stoich(reactantIndex2)==0) {
					Product the_product(reactantIndex2,stoich(reactantIndex2)+1);//(speciesIndex, moleculeCount)
					products.push_back(the_product);									
				}
				//create ElementaryReaction...
				//ElementaryReaction<boost::numeric::ublas::mapped_vector<double>, boost::numeric::ublas::vector<double> > rxn(rateConstant,reactants,products,N);
				ElementaryReaction rxn(rateConstant,reactants,products,N);
				reactions.push_back(rxn);
			}
		}
		else {
			std::cout << "StochKit ERROR (convertXML): convertXML does not yet support custom propensity functions. Terminating.\n";
			exit(1);
		}
	}
	
//	std::cout << "creating set of "<<reactions.size()<<" reactions...\n";
	
	return reactions;
}
	