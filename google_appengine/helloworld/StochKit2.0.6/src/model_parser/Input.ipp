/*!
	\brief Text file input handler

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
//read file
//parse by libxml2
//some check
//write data structure
//write to a file if need compile
//compile
*/

#ifndef _INPUT_IPP_
#error This file is the implementation of Input.h
#endif

namespace STOCHKIT
{

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
parseXmlFile(char *xmlFilename)
{
	//! xml file handler of stochkit input xml file
	xmlDocPtr stochkitXml;
	stochkitXml = xmlParseFile(xmlFilename);

	xmlNodePtr root, cur;
	int flag = 00; // flag indicating if anything missing or redundant in xml file
		
	if (stochkitXml == NULL) {
		std::cerr << "StochKit ERROR (Input::parseXmlFile): Empty or not well-formed xml input file\n";
		return false;
	}

	root = xmlDocGetRootElement(stochkitXml);
	if (root == NULL) {
		std::cerr << "StochKit ERROR (Input::parseXmlFile): Empty Document\n";
		xmlFreeDoc(stochkitXml);
		return false;
	}

	if (xmlStrcasecmp(root->name, (const xmlChar *) "Model")) {
		std::cerr << "StochKit ERROR (Input::parseXmlFile): Document of the wrong type, root node != Model\n";
		xmlFreeDoc(stochkitXml);
		return false;
	}
						
	cur = root->xmlChildrenNode;
	while (cur != NULL) {
		if(cur->type == XML_ELEMENT_NODE){
			if ((!xmlStrcasecmp(cur->name, (const xmlChar *)"NumberOfReactions"))){
				if(!recordNumberOfReactions(cur)){  // record number of reactions
					xmlFreeDoc(stochkitXml);
					return false;
				}
				flag += 01;
			} else if ((!xmlStrcasecmp(cur->name, (const xmlChar *)"NumberOfSpecies"))){
				if(!recordNumberOfSpecies(cur)){  // record number of species
					xmlFreeDoc(stochkitXml);
					return false;
				}
				flag += 010;
			} else if ((!xmlStrcasecmp(cur->name, (const xmlChar *)"ParametersList"))){
				if(!recordParametersList(cur)){  // record parameters
					xmlFreeDoc(stochkitXml);
					return false;
				}
			} else if ((!xmlStrcasecmp(cur->name, (const xmlChar *)"ReactionsList"))){
				if(!recordReactionsList(cur)){  // record reactions
					xmlFreeDoc(stochkitXml);
					return false;
				}
				flag += 0100;
			} else if ((!xmlStrcasecmp(cur->name, (const xmlChar *)"SpeciesList"))){
				if(!recordSpeciesList(cur)){  // record species
					xmlFreeDoc(stochkitXml);
					return false;
				}
				flag += 01000;
			} else if ((xmlStrcasecmp(cur->name, (const xmlChar *)"Description"))){
				std::cerr << "StochKit ERROR (Input::parseXmlFile): Unknown tag \"" << cur->name << "\" in \"Model\"." << std::endl;
				return false;
			}
		}
		cur = cur->next;
	}
		
	if ( flag != 01111 ){
		std::cerr << "StochKit ERROR (Input::parseXmlFile): Document error: necessary part missing or redundant\n";
		xmlFreeDoc(stochkitXml);
		return false;
	}

	xmlFreeDoc(stochkitXml);

	xmlCleanupParser();

	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
recordNumberOfReactions(xmlNodePtr cur)
{
	xmlChar *content;
	content = xmlNodeGetContent(cur);
	if(content == NULL){
		std::cerr << "StochKit ERROR (Input::recordNumberOfReactions): missing NumberOfReactions \n";
		return false;
	}
	NumberOfReactions = atoi((const char *)content);
	xmlFree(content);
	if(NumberOfReactions <= 0){
		std::cerr << "StochKit ERROR (Input::recordNumberOfReactions): NumberOfReactions <= 0 \n";
		return false;
	}
	return true;
}
  
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
recordNumberOfSpecies(xmlNodePtr cur)
{
	xmlChar *content;
	content = xmlNodeGetContent(cur);
	if(content == NULL){
		std::cerr << "StochKit ERROR (Input::recordNumberOfSpecies): missing NumberOfSpecies \n";
		return false;
	}
	NumberOfSpecies = atoi((const char *)content);
	xmlFree(content);
	if(NumberOfSpecies <= 0){
		std::cerr << "StochKit ERROR (Input::recordNumberOfSpecies): NumberOfSpecies <= 0 \n";
		return false;
	}
	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
recordParametersList(xmlNodePtr cur)
{
	xmlNodePtr cur_para, cur_in_para;  // xml pointer to current parameter and xml pointer in current parameter
	Parameter *cur_ptr = NULL;
	xmlChar *content;

	cur_para = cur->xmlChildrenNode;

	while( cur_para != NULL ){
            if(cur_para->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_para->name, (const xmlChar *)"Parameter"))){
			int flag = 00; // indicate if a Parameter is well recorded
			ParametersList.push_back(Parameter());
			++NumberOfParameters;
			cur_ptr = &ParametersList.back(); // reference to current parameter
			cur_in_para = cur_para->xmlChildrenNode;
			while(cur_in_para != NULL){
			    if(cur_in_para->type == XML_ELEMENT_NODE){
				if ((!xmlStrcasecmp(cur_in_para->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_para);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input::recordParametersList): missing parameter Id \n";
						return false;
					}
					cur_ptr->Id = (const char *)content;
					xmlFree(content);
                                        for ( unsigned int i=0; i < cur_ptr->Id.length(); ++i ){
                                                if ( cur_ptr->Id.at(i) == ' ' ){
							if( WhiteSpaceinId == false ){
								std::cout << "StochKit WARNING (Input): removing white space in parameter or species Id \n";
								WhiteSpaceinId = true;
							}
                                                        cur_ptr->Id.erase(cur_ptr->Id.begin()+i);
                                                        --i;
                                                }
                                        }
					flag += 01;
				} else if ((!xmlStrcasecmp(cur_in_para->name, (const xmlChar *)"Expression"))){
					content = xmlNodeGetContent(cur_in_para);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input::recordParametersList): missing parameter Expression \n";
						return false;
					}
					cur_ptr->Expression = (const char *)content;
					xmlFree(content);
					flag += 010;
				} else if ((xmlStrcasecmp(cur_in_para->name, (const xmlChar *)"Description"))){
					std::cerr << "StochKit ERROR (Input::recordParametersList): Unknown tag \"" << cur_in_para->name << "\" in Parameter " << cur_ptr->Id << std::endl;
					return false;
				}
			    }
			    cur_in_para = cur_in_para->next;
			}
                        cur_ptr->Type = 0;
                        cur_ptr->CalculateFlag = -1;
			if ( flag != 011 ){
				if(!(flag & 01)){
					std::cerr << "StochKit ERROR (Input::recordParametersList): parameter Id missing\n";
				}else{
					std::cerr << "StochKit ERROR (Input::recordParametersList): necessary part missing or redundant while recording parameter " << cur_ptr->Id << std::endl;
				}
				return false;
			}
		} else {
			std::cerr << "StochKit ERROR (Input::recordParametersList): Unknown tag \"" << cur_para->name << "\" in \"ParametersList\"." << std::endl;
			return false;
		}
	    }
	    cur_para = cur_para->next;
	}
	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
recordReactionsList(xmlNodePtr cur)
{
	xmlNodePtr cur_reac, cur_in_reac;  // xml pointer to current reaction & xml pointer in current reaction
	xmlNodePtr cur_species; // xml pointer to current species in reactants or products list
	xmlChar *content;
	Reaction *cur_ptr = NULL;
	SpeciesReference *cur_species_ptr = NULL;

	cur_reac = cur->xmlChildrenNode;

	while( cur_reac != NULL ){
	    if(cur_reac->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_reac->name, (const xmlChar *)"Reaction"))){
			int flag = 00; // indicate if a reaction is recorded well
			ReactionsList.push_back(Reaction());
			cur_ptr = &ReactionsList.back();
			
			cur_ptr->Reactants.clear();
			cur_ptr->Products.clear();

			cur_in_reac = cur_reac->xmlChildrenNode;
			while(cur_in_reac != NULL){
			    if(cur_in_reac->type == XML_ELEMENT_NODE){
				if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_reac);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input::recordReactionsList): missing Reaction Id \n";
						return false;
					}
					cur_ptr->Id = (const char *)content;
					xmlFree(content);
					flag += 01;
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Type"))){
					content = xmlNodeGetContent(cur_in_reac);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input::recordReactionsList): missing Reaction Type \n";
						return false;
					}
					if(!xmlStrcasecmp(content, (const xmlChar *)"mass-action")){
						cur_ptr->Type = 0;	
					}else if(!xmlStrcasecmp(content, (const xmlChar *)"michaelis-menten")){
						cur_ptr->Type = 1;
					}else if(!xmlStrcasecmp(content, (const xmlChar *)"customized")){
						cur_ptr->Type = 2;
					}else{
						std::cerr << "StochKit ERROR (Input::recordReactionsList): reaction type \"" << (std::string)(const char *)content << "\" not recognized in reaction " << cur_ptr->Id << std::endl;
						xmlFree(content);
						return false;
					}
					xmlFree(content);
					flag += 010;
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Reactants"))){
					cur_species = cur_in_reac->xmlChildrenNode;
					while(cur_species != NULL){
			    		    if(cur_species->type == XML_ELEMENT_NODE){
						if((!xmlStrcasecmp(cur_species->name, (const xmlChar *)"SpeciesReference"))){
							cur_ptr->Reactants.push_back(SpeciesReference());
							cur_species_ptr = &cur_ptr->Reactants.back();

							content = xmlGetProp(cur_species, (xmlChar *)"id");
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): missing reactant id \n";
								return false;
							}
							cur_species_ptr->Id = (const char *)content;
							xmlFree(content);
		                                        for ( unsigned int i=0; i < cur_species_ptr->Id.length(); ++i ){
                		                                if ( cur_species_ptr->Id.at(i) == ' ' ){
                                		                        if( WhiteSpaceinId == false ){
                                                		                std::cout << "StochKit WARNING (Input): removing white space in parameter or species Id \n";
		                                                                WhiteSpaceinId = true;
                		                                        }
                                		                        cur_species_ptr->Id.erase(cur_species_ptr->Id.begin()+i);
                                                		        --i;
		                                                }
                		                        }
							if(cur_species_ptr->Id.empty()){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): one of the reactants Id missing in reaction " << cur_ptr->Id << std::endl;
								return false;
							}

							content = xmlGetProp(cur_species, (xmlChar *)"stoichiometry");
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): missing reactant stoichiometry in reaction " << cur_ptr->Id << std::endl;
								return false;
							}
							cur_species_ptr->Stoichiometry = -atoi( (const char *)content );
							xmlFree(content);
							if(cur_species_ptr->Stoichiometry == 0){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): stoichiometry term is 0 or missing for reactant " << cur_species_ptr->Id << " in reaction " << cur_ptr->Id  << std::endl;
								return false;
							}
						} else {
				                        std::cerr << "StochKit ERROR (Input::recordReactionsList): Unknown tag \"" << cur_species->name << "\" in reactants list of reaction " << cur_ptr->Id << std::endl;
				                        return false;
				                }
					    }
					    cur_species = cur_species->next;
					}
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Products"))){
					cur_species = cur_in_reac->xmlChildrenNode;
					while(cur_species != NULL){
			    		    if(cur_species->type == XML_ELEMENT_NODE){
						if((!xmlStrcasecmp(cur_species->name, (const xmlChar *)"SpeciesReference"))){
							cur_ptr->Products.push_back(SpeciesReference());
							cur_species_ptr = &cur_ptr->Products.back();

							content = xmlGetProp(cur_species, (xmlChar *)"id");
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): missing product id \n";
								return false;
							}
							cur_species_ptr->Id = (const char *)content;
							xmlFree(content);
		                                        for ( unsigned int i=0; i < cur_species_ptr->Id.length(); ++i ){
                		                                if ( cur_species_ptr->Id.at(i) == ' ' ){
                                		                        if( WhiteSpaceinId == false ){
                                                		                std::cout << "StochKit WARNING (Input): removing white space in parameter or species Id \n";
		                                                                WhiteSpaceinId = true;
                		                                        }
                                		                        cur_species_ptr->Id.erase(cur_species_ptr->Id.begin()+i);
                                                		        --i;
		                                                }
                		                        }
							if(cur_species_ptr->Id.empty()){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): one of the products Id missing in reaction " << cur_ptr->Id  << std::endl;
								return false;
							}

							content = xmlGetProp(cur_species, (xmlChar *)"stoichiometry");
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): missing product stoichiometry in reaction " << cur_ptr->Id << std::endl;
								return false;
							}
							cur_species_ptr->Stoichiometry = atoi( (const char *)content );
							xmlFree(content);
							if(cur_species_ptr->Stoichiometry == 0){
								std::cerr << "StochKit ERROR (Input::recordReactionsList): stoichiometry term is 0 or missing for product " << cur_species_ptr->Id << " in reaction " << cur_ptr->Id  << std::endl;
								return false;
							}
						} else {
				                        std::cerr << "StochKit ERROR (Input::recordReactionsList): Unknown tag \"" << cur_species->name << "\" in products list of reaction " << cur_ptr->Id << std::endl;
				                        return false;
				                }
			                    }
			    		    cur_species = cur_species->next;
					}
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Rate"))){
					if(cur_ptr->Type != 0){
						std::cerr << "StochKit ERROR (Input::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input::recordReactionsList): missing reaction rate \n";
							return false;
						}
						cur_ptr->Rate = (const char *)content;
						xmlFree(content);
					}
					flag += 0100;
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Vmax"))){
					if(cur_ptr->Type != 1){
						std::cerr << "StochKit ERROR (Input::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input::recordReactionsList): missing reaction Vmax \n";
							return false;
						}
						cur_ptr->Vmax = (const char *)content;
						xmlFree(content);
					}
					flag += 0100;
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Km"))){
					if(cur_ptr->Type != 1){
						std::cerr << "StochKit ERROR (Input::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input::recordReactionsList): missing reaction Km \n";
							return false;
						}
						cur_ptr->Km = (const char *)content;
						xmlFree(content);
					}
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"PropensityFunction"))){
					if(cur_ptr->Type != 2){
						std::cerr << "StochKit ERROR (Input::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input::recordReactionsList): missing reaction Km \n";
							return false;
						}
						cur_ptr->Customized = (const char *)content;
						xmlFree(content);
					}
					flag += 0100;
				} else if ((xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Description"))){
					std::cerr << "StochKit ERROR (Input::recordReactionsList): Unknown tag \"" << cur_in_reac->name << "\" in Reaction " << cur_ptr->Id << std::endl;
					return false;
				}
			    }
			    cur_in_reac = cur_in_reac->next;
			}
			if ( flag != 0111 ){
				if(!(flag & 01)){
					std::cerr << "StochKit ERROR (Input::recordReactionsList): reaction Id missing\n";
				}else{
					std::cerr << "StochKit ERROR (Input::recordReactionsList): necessary part missing or redundant while recording reaction " << cur_ptr->Id  << std::endl;
				}
				return false;
			}
			if( cur_ptr->Type == 0 ){
				int reaction_order = 0;
				for( unsigned int i = 0; i < cur_ptr->Reactants.size(); ++i )
					reaction_order += cur_ptr->Reactants[i].Stoichiometry;
				if( reaction_order < -3 ){
					std::cerr << "StochKit ERROR (Input::reacordReactionsList): Reaction order > 3 for mass-action reaction " << cur_ptr->Id << std::endl;
					return false;
				}
			}
                } else {
                        std::cerr << "StochKit ERROR (Input::recordReactionsList): Unknown tag \"" << cur_reac->name << "\" in \"ReactionsList\"." << std::endl;
                        return false;
                }
	    }
	    cur_reac = cur_reac->next;
	}

	if( (int)ReactionsList.size() != NumberOfReactions ){
		std::cerr << "StochKit ERROR (Input::recordSpeciesList): the number of Reactions in ReactionsList != NumberOfReactions\n";
		return false;
	}

	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
recordSpeciesList(xmlNodePtr cur)
{
	xmlNodePtr cur_spec, cur_in_spec;  // xml pointer to current species & xml pointer in current species
	xmlChar *content;
	Species *cur_ptr = NULL;

	cur_spec = cur->xmlChildrenNode;

	while( cur_spec != NULL ){
	    if(cur_spec->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_spec->name, (const xmlChar *)"Species"))){
			int flag = 00; // indicate if a Species is well recorded
			SpeciesList.push_back(Species());
			cur_ptr = &SpeciesList.back();

			cur_in_spec = cur_spec->xmlChildrenNode;
			while(cur_in_spec != NULL){
	    		    if(cur_in_spec->type == XML_ELEMENT_NODE){
				if ((!xmlStrcasecmp(cur_in_spec->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_spec);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input::recordSpeciesList): missing Species Id \n";
						return false;
					}
					cur_ptr->Id = (const char *)content;
					xmlFree(content);
                                        for ( unsigned int i=0; i < cur_ptr->Id.length(); ++i ){
                                                if ( cur_ptr->Id.at(i) == ' ' ){
							if( WhiteSpaceinId == false ){
								std::cout << "StochKit WARNING (Input): removing white space in parameter or species Id \n";
								WhiteSpaceinId = true;
							}
                                                        cur_ptr->Id.erase(cur_ptr->Id.begin()+i);
                                                        --i;
                                                }
                                        }
					flag += 01;
				} else if ((!xmlStrcasecmp(cur_in_spec->name, (const xmlChar *)"InitialPopulation"))){
					content = xmlNodeGetContent(cur_in_spec);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input::recordSpeciesList): missing Species Id \n";
						return false;
					}
					cur_ptr->InitialPopulation = (const char *)content;
					xmlFree(content);
					flag += 010;
				} else if ((xmlStrcasecmp(cur_in_spec->name, (const xmlChar *)"Description"))){
					std::cerr << "StochKit ERROR (Input::recordSpeciesList): Unknown tag \"" << cur_in_spec->name << "\" in Species " << cur_ptr->Id << std::endl;
					return false;
				}
			    }
	  		    cur_in_spec = cur_in_spec->next;
			}

			if ( flag != 011 ){
				if(!(flag & 01)){
					std::cerr << "StochKit ERROR (Input::recordSpeciesList): species Id missing\n";
				}else{
					std::cerr << "StochKit ERROR (Input::recordSpeciesList): necessary part missing or redundant while recording species " << cur_ptr->Id << std::endl;
				}
				return false;
			}
                } else {
                        std::cerr << "StochKit ERROR (Input::recordSpeciesList): Unknown tag \"" << cur_spec->name << "\" in \"SpeciesList\"." << std::endl;
                        return false;
                }
	    }
    	    cur_spec = cur_spec->next;
	}

	if( (int)SpeciesList.size() != NumberOfSpecies ){
		std::cerr << "StochKit ERROR (Input::recordSpeciesList): the number of Species in SpeciesList != NumberOfSpecies\n";
		return false;
	}

	return true;
}
	
// record species reference order of reactants and products in reactions, meanwhile write affect reactions in species list
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
linkSpeciesAndReactions()
{
	class Reaction *cur_reaction;
	class SpeciesReference *cur_reactant, *cur_product;
	int flag = 0;

	for( unsigned int i=0; i<ReactionsList.size(); ++i){
		cur_reaction = &ReactionsList[i];

		if(cur_reaction->Reactants.size() != 0){
			for( unsigned int j=0; j<cur_reaction->Reactants.size(); ++j){
				cur_reactant = &cur_reaction->Reactants[j];
				flag = 0;

				unsigned int k=0;
			       	while( (k<SpeciesList.size()) && (flag==0) ){
 					 if(cur_reactant->Id.compare(SpeciesList[k].Id) == 0){
 						 flag = 1;
						 if(cur_reaction->Type == 0 || cur_reaction->Type == 1){
	 						 SpeciesList[k].AffectReactions.push_back(i);
						 }
 						 cur_reactant->Index = k;
	 				 }
					 ++k;
				}
		
				if( flag == 0 ){
					std::cerr << "StochKit ERROR (Input::linkSpeciesAndReactions): reactant " << cur_reactant->Id << " in reaction " << cur_reaction->Id << " does not exist in SpeciesList\n"; 
					return false;
				}
			}
		}
		if(cur_reaction->Type == 2){
                        unsigned int begin=0, end=0;
                        std::string substitutedEquation = cur_reaction->Customized;
                        std::vector<unsigned int> species_involved_in_propensity;

                        while( begin < substitutedEquation.length() ){
                                if( (isalpha(substitutedEquation.at(begin)) || substitutedEquation.at(begin) == '_') && ( (begin==0) || ((substitutedEquation.at(begin) != 'e') && (substitutedEquation.at(begin) != 'E')) || !(isalnum(substitutedEquation.at(begin-1)) || substitutedEquation.at(begin-1) == '_') )){
                                        end = begin+1;
                                        while( (end<substitutedEquation.length()) && (isalnum(substitutedEquation.at(end)) || substitutedEquation.at(end) == '_') )
                                                ++end;

                                        std::string parameterName = substitutedEquation.substr(begin,end-begin);

                                        // search for species in SpeciessList
                                        unsigned int j = 0;
                                        while( (j < SpeciesList.size()) && (parameterName.compare(SpeciesList[j].Id)!=0) )
                                                ++j;

                                        if( j != SpeciesList.size() ){
                                                // substitute species name with its population variable
                                                SpeciesList[j].AffectReactions.push_back(i);
                                                species_involved_in_propensity.push_back(j);
                                        }

                                        begin = begin + parameterName.size();
                                }
                                else{
                                        ++begin;
                                }
                        }


                        // check if the propensity function is related to all the reactants, otherwise gives warning that the population of that species may go negative.
			if(cur_reaction->Reactants.size() != 0 ){
	                        for(unsigned int j=0; j<cur_reaction->Reactants.size() ; ++j){
        	                        unsigned int k=0;
                	                while( (k < species_involved_in_propensity.size()) && ((int)species_involved_in_propensity[k] != cur_reaction->Reactants[j].Index) )
                        	                ++k;

	                                if( k == species_involved_in_propensity.size() ){
        	                                std::cout << "StochKit WARNING (Input::linkSpeciesAndReactions): reactant " << cur_reaction->Reactants[j].Id << " not shown in the propensity function of reaction " << cur_reaction->Id << ", this may cause negative population of this species." << std::endl;
                	                }
	                        }
			}
		}

		if(cur_reaction->Products.size() != 0){
			for( unsigned int j=0; j<cur_reaction->Products.size(); ++j){
				cur_product = &cur_reaction->Products[j];
				flag = 0;

				unsigned int k=0;
			       	while( (k<SpeciesList.size()) && (flag==0) ){
	 				 if(cur_product->Id.compare(SpeciesList[k].Id) == 0){
	 					 flag = 1;
	 					 cur_product->Index = k;
	 				 }
					 ++k;
				}
			
				if( flag == 0 ){
					std::cerr << "StochKit ERROR (Input::linkSpeciesAndReactions): product " << cur_product->Id << " in reaction " << cur_reaction->Id << " does not exist in SpeciesList\n"; 
					return false;
				}
			}
		}
	}
 
	return true;
}

// calculate rate based on the value stored in parameterslist
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
typename
Input<_populationVectorType,
        _stoichiometryType,
        _propensitiesFunctorType,
        _dependencyGraphType>::
_populationValueType
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
populationCalculation(std::string equation)
{
        std::vector<unsigned int> ParametersAffectRate;
        std::vector<unsigned int>::iterator para_it; // iterator of parameters in link graph

        ParametersAffectRate = ParametersList.analyzeParameterExpression(equation);

	bool calculationStatus = false;

        for( para_it = ParametersAffectRate.begin(); para_it < ParametersAffectRate.end(); ++para_it ){
                if( ParametersList[*para_it].CalculateFlag == -1 ){
                        calculationStatus = ParametersList.calculateParameter(*para_it);
                        if(!calculationStatus){                   
	                        std::cerr << "StochKit ERROR (Input::populationCalculation): while calculating rate " << equation << std::endl;
                                return BADRESULT;
                        }
                }
        }

        std::string substitutedEquation = ParametersList.parameterSubstitution(equation);
        if( substitutedEquation.empty() ){
                std::cerr << "StochKit ERROR (Input::populationCalculation): while calculating initial population " << equation << std::endl;
                return BADRESULT;
        }

	double calculatedPopulation = simpleCalculator.calculateString(substitutedEquation);
	double roundedPopulation = floor(calculatedPopulation+0.5);
	if( fabs(roundedPopulation-calculatedPopulation) > 1e-7 ){
		std::cout.precision(10);
		std::cout << "StochKit WARNING (Input::populationCalculation): population was rounded from " << calculatedPopulation << " to " << roundedPopulation << std::endl;
	}

        return (_populationValueType)roundedPopulation;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
bool
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
checkUniqueID()
{
	for( int i=0; i< NumberOfSpecies; ++i ){
		for( int j=i+1; j<NumberOfSpecies; ++j){
			if( SpeciesList[i].Id.compare(SpeciesList[j].Id) == 0 ){
				std::cerr << "StochKit ERROR (Input::checkUniqueID): there are two species having the same ID \"" << SpeciesList[i].Id << "\"\n";
				return false;
			}
		}
		
		for( int j=0; j<NumberOfParameters; ++j){
			if( SpeciesList[i].Id.compare(ParametersList[j].Id) == 0 ){
				std::cerr << "StochKit ERROR (Input::checkUniqueID): there are one species and one parameter having the same ID \"" << SpeciesList[i].Id << "\"\n";
				return false;
			}
		}
	}

	for( int i=0; i< NumberOfParameters; ++i ){
		for( int j=i+1; j<NumberOfParameters; ++j){
			if( ParametersList[i].Id.compare(ParametersList[j].Id) == 0 ){
				std::cerr << "StochKit ERROR (Input::checkUniqueID): there are two parameters having the same ID \"" << ParametersList[i].Id << "\"\n";
				return false;
			}
		}
	}

	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
_populationVectorType
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
writeInitialPopulation()
{
	  _populationValueType cur_population;
	  _populationVectorType X(NumberOfSpecies);
		  
	  for(int i=0; i<NumberOfSpecies; ++i){
                cur_population = populationCalculation(SpeciesList[i].InitialPopulation);
                if( cur_population == BADRESULT ){
                        std::cerr << "StochKit ERROR (Input::writeInitialPopulation): while calculating initial population of " << SpeciesList[i].Id << std::endl;
                        exit(1);
                }

                X[i] = cur_population;
	  }
		  
	  return X;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
_stoichiometryType
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
writeStoichiometry()
{
	#ifdef MATRIX_STOICHIOMETRY
		_stoichiometryType nu(NumberOfReactions, NumberOfSpecies);
	#else
		typedef typename _stoichiometryType::value_type vectorType;
		_stoichiometryType nu(NumberOfReactions, vectorType(NumberOfSpecies));
		// initialize values to 0
		for(unsigned int i=0; i<nu.size(); ++i) {
			for(unsigned int j=0; j<nu[i].size(); ++j) {
				if( nu[i][j] != 0 ){
					nu[i][j] = 0;
				}
			}
		}
	#endif

	//calculate Stoichiometry and write
	class SpeciesReference *cur_species = NULL;

	for(int i=0; i<NumberOfReactions; ++i){ // the i-th reaction
		// write reactants stoichiometry
		for(unsigned int j=0; j<ReactionsList[i].Reactants.size(); ++j){
			cur_species = &ReactionsList[i].Reactants[j];
			#ifdef MATRIX_STOICHIOMETRY
				nu(i,cur_species->Index) += cur_species->Stoichiometry;
			#else
				nu[i][cur_species->Index] += cur_species->Stoichiometry;
			#endif
		}

		// write products stoichiometry
		for(unsigned int j=0; j<ReactionsList[i].Products.size(); ++j){
			cur_species = &ReactionsList[i].Products[j];
			#ifdef MATRIX_STOICHIOMETRY
				nu(i,cur_species->Index) += cur_species->Stoichiometry;
			#else
				nu[i][cur_species->Index] += cur_species->Stoichiometry;
			#endif
		}
	}

	return nu;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
_dependencyGraphType
Input<_populationVectorType,
        _stoichiometryType,
	_propensitiesFunctorType,
	_dependencyGraphType>::
writeDependencyGraph()
{
	typedef typename _dependencyGraphType::value_type _vectorType;
	typedef typename _vectorType::value_type _memberType;
		
	_dependencyGraphType dg(NumberOfReactions);

	_stoichiometryType nu = writeStoichiometry();

        class SpeciesReference *cur_species = NULL;

	for(int i=0; i<NumberOfReactions; ++i){
		for(int j=0; j<NumberOfSpecies; ++j){
	 	    #ifdef MATRIX_STOICHIOMETRY
			if(nu(i,j) != 0)
		    #else
			if(nu[i][j] != 0)
		    #endif
				mergeToSortedArray<std::vector<int>, std::vector<_memberType> >(SpeciesList[j].AffectReactions, dg[i]);
		}

                // add reactions i to species s's affectreactions list if species s is a reactant of reaction i, even if the stiochiometry is 0
                for(unsigned int j=0; j<ReactionsList[i].Reactants.size(); ++j){
                        cur_species = &ReactionsList[i].Reactants[j];
			mergeToSortedArray<std::vector<int>, std::vector<_memberType> >(SpeciesList[cur_species->Index].AffectReactions, dg[i]);
                }

	}

	return dg;
}

}
