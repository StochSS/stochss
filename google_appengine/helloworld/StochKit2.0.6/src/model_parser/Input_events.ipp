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

#ifndef _INPUT_EVENTS_IPP_
#error This file is the implementation of Input_events.h
#endif

namespace STOCHKIT
{
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
parseXmlFile(char *xmlFilename)
{
	//! xml file handler of stochkit input xml file
	xmlDocPtr stochkitXml;
	stochkitXml = xmlParseFile(xmlFilename);

	xmlNodePtr root, cur;
	int flag = 00; // flag indicating if anything missing or redundant in xml file
		
	if (stochkitXml == NULL) {
		std::cerr << "StochKit ERROR (Input_events::parseXmlFile): Empty or not-wellformed xml input file\n";
		return false;
	}

	root = xmlDocGetRootElement(stochkitXml);
	if (root == NULL) {
		std::cerr << "StochKit ERROR (Input_events::parseXmlFile): Empty Document\n";
		xmlFreeDoc(stochkitXml);
		return false;
	}

	if (xmlStrcasecmp(root->name, (const xmlChar *) "Model")) {
		std::cerr << "StochKit ERROR (Input_events::parseXmlFile): Document of the wrong type, root node != Model\n";
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
		} else if ((!xmlStrcasecmp(cur->name, (const xmlChar *)"EventsList"))){
			if(!recordEventsList(cur)){  // record events
				xmlFreeDoc(stochkitXml);
				return false;
			}
			flag += 010000;
		} else if ((xmlStrcasecmp(cur->name, (const xmlChar *)"Description"))){
			std::cerr << "StochKit ERROR (Input_events::parseXmlFile): Unknown tag \"" << cur->name << "\" in \"Model\"." << std::endl;
			return false;
		}
	    }
	    cur = cur->next;
	}
		
	if ( flag != 011111 ){
		std::cerr << "StochKit ERROR (Input_events::parseXmlFile): Document error: necessary part missing or redundant\n";
		xmlFreeDoc(stochkitXml);
		return false;
	}

	xmlFreeDoc(stochkitXml);

	xmlCleanupParser();

	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
recordNumberOfReactions(xmlNodePtr cur)
{
	xmlChar *content;
	content = xmlNodeGetContent(cur);
	if(content == NULL){
		std::cerr << "StochKit ERROR (Input_events::recordNumberOfReactions): missing NumberOfReactions \n";
		return false;
	}
	NumberOfReactions = atoi((const char *)content);
	xmlFree(content);
	if(NumberOfReactions <= 0){
		std::cerr << "StochKit ERROR (Input_events::recordNumberOfReactions): NumberOfReactions <= 0 \n";
		return false;
	}
	return true;
}
  
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
recordNumberOfSpecies(xmlNodePtr cur)
{
	xmlChar *content;
	content = xmlNodeGetContent(cur);
	if(content == NULL){
		std::cerr << "StochKit ERROR (Input_events::recordNumberOfSpecies): missing NumberOfSpecies \n";
		return false;
	}
	NumberOfSpecies = atoi((const char *)content);
	xmlFree(content);
	if(NumberOfSpecies <= 0){
		std::cerr << "StochKit ERROR (Input_events::recordNumberOfSpecies): NumberOfSpecies <= 0 \n";
		return false;
	}
	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
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
						std::cerr << "StochKit ERROR (Input_events::recordParametersList): missing parameter Id \n";
						return false;
					}
					cur_ptr->Id = (const char *)content;
					xmlFree(content);
                                        for ( unsigned int i=0; i < cur_ptr->Id.length(); ++i ){
                                                if ( cur_ptr->Id.at(i) == ' ' ){
                                                        if( WhiteSpaceinId == false ){
                                                                std::cout << "StochKit WARNING (Input_events): removing white space in parameter or species Id \n";
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
						std::cerr << "StochKit ERROR (Input_events::recordParametersList): missing parameter Expression \n";
						return false;
					}
					cur_ptr->Expression = (const char *)content;
					xmlFree(content);
					flag += 010;
				} else if ((xmlStrcasecmp(cur_in_para->name, (const xmlChar *)"Description"))){
					std::cerr << "StochKit ERROR (Input_events::recordParametersList): Unknown tag \"" << cur_in_para->name << "\" in Parameter " << cur_ptr->Id << std::endl;
					return false;
				}
			    }
			    cur_in_para = cur_in_para->next;
			}
			cur_ptr->Type = 0;
			cur_ptr->CalculateFlag = -1;
			if ( flag != 011 ){
				if(!(flag & 01)){
					std::cerr << "StochKit ERROR (Input_events::recordParametersList): parameter Id missing\n";
				}else{
					std::cerr << "StochKit ERROR (Input_events::recordParametersList): necessary part missing or redundant while recording parameter " << cur_ptr->Id << std::endl;
				}
				return false;
			}
		} else {
			std::cerr << "StochKit ERROR (Input_events::recordParametersList): Unknown tag \"" << cur_para->name << "\" in \"ParametersList\"." << std::endl;
			return false;
		}
	    }
	    cur_para = cur_para->next;
	}
	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
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
						std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing Reaction Id \n";
						return false;
					}
					cur_ptr->Id = (const char *)content;
					xmlFree(content);
					flag += 01;
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Type"))){
					content = xmlNodeGetContent(cur_in_reac);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing Reaction Type \n";
						return false;
					}
					if(!xmlStrcasecmp(content, (const xmlChar *)"mass-action")){
						cur_ptr->Type = 0;	
					}else if(!xmlStrcasecmp(content, (const xmlChar *)"michaelis-menten")){
						cur_ptr->Type = 1;
					}else if(!xmlStrcasecmp(content, (const xmlChar *)"customized")){
						cur_ptr->Type = 2;
					}else{
						std::cerr << "StochKit ERROR (Input_events::recordReactionsList): reaction type \"" << (std::string)(const char *)content << "\" not recognized in reaction " << cur_ptr->Id << std::endl;
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
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing reactant id \n";
								return false;
							}
							cur_species_ptr->Id = (const char *)content;
							xmlFree(content);
                                                        for ( unsigned int i=0; i < cur_species_ptr->Id.length(); ++i ){
                                                                if ( cur_species_ptr->Id.at(i) == ' ' ){
                                                                        if( WhiteSpaceinId == false ){
                                                                                std::cout << "StochKit WARNING (Input_events): removing white space in parameter or species Id \n";
                                                                                WhiteSpaceinId = true;
                                                                        }
                                                                        cur_species_ptr->Id.erase(cur_species_ptr->Id.begin()+i);
                                                                        --i;
                                                                }
                                                        }
							if(cur_species_ptr->Id.empty()){
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): one of the reactants Id is missing in reaction " << cur_ptr->Id << std::endl;
								return false;
							}

							content = xmlGetProp(cur_species, (xmlChar *)"stoichiometry");
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing reactant stoichiometry in reaction " << cur_ptr->Id << std::endl;
								return false;
							}
							cur_species_ptr->Stoichiometry = -atoi( (const char *)content );
							xmlFree(content);
							if(cur_species_ptr->Stoichiometry == 0){
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): stoichiometry term is 0 or missing for reactant " << cur_species_ptr->Id << " in reaction " << cur_ptr->Id  << std::endl;
								return false;
							}
						} else {
				                        std::cerr << "StochKit ERROR (Input_events::recordReactionsList): Unknown tag \"" << cur_species->name << "\" in reactants list of reaction " << cur_ptr->Id << std::endl;
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
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing product id \n";
								return false;
							}
							cur_species_ptr->Id = (const char *)content;
							xmlFree(content);
                                                        for ( unsigned int i=0; i < cur_species_ptr->Id.length(); ++i ){
                                                                if ( cur_species_ptr->Id.at(i) == ' ' ){
                                                                        if( WhiteSpaceinId == false ){
                                                                                std::cout << "StochKit WARNING (Input_events): removing white space in parameter or species Id \n";
                                                                                WhiteSpaceinId = true;
                                                                        }
                                                                        cur_species_ptr->Id.erase(cur_species_ptr->Id.begin()+i);
                                                                        --i;
                                                                }
                                                        }
							if(cur_species_ptr->Id.empty()){
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): one of the products Id is missing in reaction " << cur_ptr->Id  << std::endl;
								return false;
							}

							content = xmlGetProp(cur_species, (xmlChar *)"stoichiometry");
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing product stoichiometry in reaction " << cur_ptr->Id << std::endl;
								return false;
							}
							cur_species_ptr->Stoichiometry = atoi( (const char *)content );
							xmlFree(content);
							if(cur_species_ptr->Stoichiometry == 0){
								std::cerr << "StochKit ERROR (Input_events::recordReactionsList): stoichiometry term is 0 or missing for product " << cur_species_ptr->Id << " in reaction " << cur_ptr->Id  << std::endl;
								return false;
							}
						} else {
				                        std::cerr << "StochKit ERROR (Input_events::recordReactionsList): Unknown tag \"" << cur_species->name << "\" in products list of reaction " << cur_ptr->Id << std::endl;
				                        return false;
				                }
					    }
					    cur_species = cur_species->next;
					}
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Rate"))){
					if(cur_ptr->Type != 0){
						std::cerr << "StochKit ERROR (Input_events::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing reaction rate \n";
							return false;
						}
						cur_ptr->Rate = (const char *)content;
						xmlFree(content);
					}
					flag += 0100;
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Vmax"))){
					if(cur_ptr->Type != 1){
						std::cerr << "StochKit ERROR (Input_events::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing reaction Vmax \n";
							return false;
						}
						cur_ptr->Vmax = (const char *)content;
						xmlFree(content);
					}
					flag += 0100;
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Km"))){
					if(cur_ptr->Type != 1){
						std::cerr << "StochKit ERROR (Input_events::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing reaction Km \n";
							return false;
						}
						cur_ptr->Km = (const char *)content;
						xmlFree(content);
					}
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"PropensityFunction"))){
					if(cur_ptr->Type != 2){
						std::cerr << "StochKit ERROR (Input_events::recordReactionsList): reaction type not compatible with rate type in reaction " << cur_ptr->Id  << std::endl;
						return false;
					} else {
						content = xmlNodeGetContent(cur_in_reac);
						if(content == NULL){
							std::cerr << "StochKit ERROR (Input_events::recordReactionsList): missing reaction Customized \n";
							return false;
						}
						cur_ptr->Customized = (const char *)content;
						xmlFree(content);
					}
					flag += 0100;
				} else if ((xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Description"))){
					std::cerr << "StochKit ERROR (Input_events::recordReactionsList): Unknown tag \"" << cur_in_reac->name << "\" in Reaction " << cur_ptr->Id << std::endl;
					return false;
				}
			    }
			    cur_in_reac = cur_in_reac->next;
			}
			if ( flag != 0111 ){
				if(!(flag & 01)){
					std::cerr << "StochKit ERROR (Input_events::recordReactionsList): reaction Id missing\n";
				}else{
					std::cerr << "StochKit ERROR (Input_events::recordReactionsList): necessary part missing or redundant while recording reaction " << cur_ptr->Id  << std::endl;
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
                        std::cerr << "StochKit ERROR (Input_events::recordReactionsList): Unknown tag \"" << cur_reac->name << "\" in \"ReactionsList\"." << std::endl;
                        return false;
                }
 	    }
	    cur_reac = cur_reac->next;
	}

	if( (int)ReactionsList.size() != NumberOfReactions ){
		std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): the number of Reactions in ReactionsList != NumberOfReactions\n";
		return false;
	}

	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
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
						std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): missing Species Id \n";
						return false;
					}
					cur_ptr->Id = (const char *)content;
					xmlFree(content);
                                        for ( unsigned int i=0; i < cur_ptr->Id.length(); ++i ){
                                                if ( cur_ptr->Id.at(i) == ' ' ){
                                                        if( WhiteSpaceinId == false ){
                                                                std::cout << "StochKit WARNING (Input_events): removing white space in parameter or species Id \n";
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
						std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): missing Species Initial Population \n";
						return false;
					}
					cur_ptr->InitialPopulation = (const char *)content;
					xmlFree(content);
					flag += 010;
				} else if ((xmlStrcasecmp(cur_in_spec->name, (const xmlChar *)"Description"))){
					std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): Unknown tag \"" << cur_in_spec->name << "\" in Species " << cur_ptr->Id << std::endl;
					return false;
				}
			    }
			    cur_in_spec = cur_in_spec->next;
			}

			if ( flag != 011 ){
				if(!(flag & 01)){
					std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): species Id missing\n";
				}else{
					std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): necessary part missing or redundant while recording species " << cur_ptr->Id << std::endl;
				}
				return false;
			}
                } else {
                        std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): Unknown tag \"" << cur_spec->name << "\" in \"SpeciesList\"." << std::endl;
                        return false;
                }
	    }
	    cur_spec = cur_spec->next;
	}

	if( (int)SpeciesList.size() != NumberOfSpecies ){
		std::cerr << "StochKit ERROR (Input_events::recordSpeciesList): the number of Species in SpeciesList != NumberOfSpecies\n";
		return false;
	}

	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
recordEventsList(xmlNodePtr cur)
{
	xmlNodePtr cur_event, cur_in_event;  // xml pointer to current event & xml pointer in current event
	xmlNodePtr cur_in_trigger, cur_action, cur_in_action; // xml pointer in current trigger & to current action & in current action
	xmlChar *content;
	Event *cur_ptr = NULL;
	Action *cur_action_ptr = NULL;

	cur_event = cur->xmlChildrenNode;

	while( cur_event != NULL ){
	    if(cur_event->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_event->name, (const xmlChar *)"Event"))){
			int flag = 00; // indicate if an event is recorded well
			EventsList.push_back(Event());
			++NumberOfEvents;
			cur_ptr = &EventsList.back();
			
			cur_ptr->Type = -1;
			cur_ptr->ActionsList.clear();

			cur_in_event = cur_event->xmlChildrenNode;
			while(cur_in_event != NULL){
	    		    if(cur_in_event->type == XML_ELEMENT_NODE){
				if ((!xmlStrcasecmp(cur_in_event->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_event);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Event Id \n";
						return false;
					}
					cur_ptr->Id = (const char *)content;
					xmlFree(content);
					flag += 01;
				} else if ((!xmlStrcasecmp(cur_in_event->name, (const xmlChar *)"AllowMultipleFirings"))){
					content = xmlNodeGetContent(cur_in_event);
					if(!xmlStrcasecmp(content, (const xmlChar *)"true")){
						cur_ptr->Type = 2;
					} else if (!xmlStrcasecmp(content, (const xmlChar *)"false")){
						cur_ptr->Type = 1;
					} else {
						std::cerr << "StochKit ERROR (Input_events::recordEventsList): AllowMultipleFirings parameter \"" << (std::string)(const char *)content << "\" not recognized in event " << cur_ptr->Id << std::endl;
						xmlFree(content);
						return false;
					}
					xmlFree(content);
				} else if ((!xmlStrcasecmp(cur_in_event->name, (const xmlChar *)"Trigger"))){
					cur_in_trigger = cur_in_event->xmlChildrenNode;
					while( cur_in_trigger != NULL ){
	    		    		    if(cur_in_trigger->type == XML_ELEMENT_NODE){
						if ((!xmlStrcasecmp(cur_in_trigger->name, (const xmlChar *)"Type"))){
							content = xmlNodeGetContent(cur_in_trigger);
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Event Trigger Type \n";
								return false;
							}
							if(!xmlStrcasecmp(content, (const xmlChar *)"time-based")){
								cur_ptr->Type = 0;
							}else if(!xmlStrcasecmp(content, (const xmlChar *)"state-based")){
								if(cur_ptr->Type != 2){
									cur_ptr->Type = 1;
								}
							}else{
								std::cerr << "StochKit ERROR (Input_events::recordEventsList): event type \"" << (std::string)(const char *)content << "\" not recognized in event " << cur_ptr->Id << std::endl;
								xmlFree(content);
								return false;
							}
							xmlFree(content);
							flag += 010;
						} else if ((!xmlStrcasecmp(cur_in_trigger->name, (const xmlChar *)"Value"))){
							content = xmlNodeGetContent(cur_in_trigger);
							if(content == NULL){
								std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Event Trigger Value \n";
								return false;
							}
							cur_ptr->Trigger = (const char *)content;
							xmlFree(content);
							flag += 0100;				
						} else if ((xmlStrcasecmp(cur_in_trigger->name, (const xmlChar *)"Description"))){
							std::cerr << "StochKit ERROR (Input_events::recordEventsList): Unknown tag \"" << cur_in_trigger->name << "\" in the Trigger of Event " << cur_ptr->Id << std::endl;
							return false;
						}
					    }
					    cur_in_trigger = cur_in_trigger->next;
					}
				} else if ((!xmlStrcasecmp(cur_in_event->name, (const xmlChar *)"Actions"))){
					cur_action = cur_in_event->xmlChildrenNode;
					while(cur_action != NULL){
	    		    		    if(cur_action->type == XML_ELEMENT_NODE){
						if((!xmlStrcasecmp(cur_action->name, (const xmlChar *)"Action"))){
							int flag = 00; // indicate if an action is well recorded
							cur_ptr->ActionsList.push_back(Action());
							cur_action_ptr = &cur_ptr->ActionsList.back();

							cur_in_action = cur_action->xmlChildrenNode;
							while(cur_in_action != NULL){
	    		    		    		    if(cur_in_action->type == XML_ELEMENT_NODE){
								if ((!xmlStrcasecmp(cur_in_action->name, (const xmlChar *)"Type"))){
									content = xmlNodeGetContent(cur_in_action);
									if(content == NULL){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Event Action Type \n";
										return false;
									}
									if(!xmlStrcasecmp(content, (const xmlChar *)"SimpleChangeSpeciesPopulation")){
										cur_action_ptr->Type = 0;
									}else if(!xmlStrcasecmp(content, (const xmlChar *)"CustomChangeSpeciesPopulation")){
										cur_action_ptr->Type = 1;
									}else if(!xmlStrcasecmp(content, (const xmlChar *)"ChangeParameter")){
										cur_action_ptr->Type = 2;
									}else{
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): action type \"" << (std::string)(const char *)content << "\" not recognized in event " << cur_ptr->Id << std::endl;
										xmlFree(content);
										return false;
									}
									xmlFree(content);
									flag += 01;
								} else if ((!xmlStrcasecmp(cur_in_action->name, (const xmlChar *)"SpeciesReference"))){
									content = xmlGetProp(cur_in_action, (xmlChar *)"id");
									if(content == NULL){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Species name in Event Action\n";
										return false;
									}
									cur_action_ptr->Id = (const char *)content;
									xmlFree(content);
				                                        for ( unsigned int i=0; i < cur_action_ptr->Id.length(); ++i ){
                                				                if ( cur_action_ptr->Id.at(i) == ' ' ){
				                                                        if( WhiteSpaceinId == false ){
                                				                                std::cout << "StochKit WARNING (Input_events): removing white space in parameter or species Id \n";
				                                                                WhiteSpaceinId = true;
                                				                        }
				                                                        cur_action_ptr->Id.erase(cur_action_ptr->Id.begin()+i);
                                				                        --i;
				                                                }
                                				        }
									if(cur_action_ptr->Id.empty()){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): Species Id missing in one action of event " << cur_ptr->Id << std::endl;
										return false;
									}
									content = xmlGetProp(cur_in_action, (xmlChar *)"value");
									if(content == NULL){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Species population value in Event Action\n";
										return false;
									}
									cur_action_ptr->Expression = (const char *)content;
									xmlFree(content);
									if(cur_action_ptr->Expression.empty()){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): Species value missing in one action of event " << cur_ptr->Id  << std::endl;
										return false;
									}
									flag += 010;
								} else if ((!xmlStrcasecmp(cur_in_action->name, (const xmlChar *)"ParameterReference"))){
									content = xmlGetProp(cur_in_action, (xmlChar *)"id");
									if(content == NULL){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Parameter name in Event Action\n";
										return false;
									}
									cur_action_ptr->Id = (const char *)content;
									xmlFree(content);
                                                                        for ( unsigned int i=0; i < cur_action_ptr->Id.length(); ++i ){
                                                                                if ( cur_action_ptr->Id.at(i) == ' ' ){
                                                                                        if( WhiteSpaceinId == false ){
                                                                                                std::cout << "StochKit WARNING (Input_events): removing white space in parameter or species Id \n";
                                                                                                WhiteSpaceinId = true;
                                                                                        }
                                                                                        cur_action_ptr->Id.erase(cur_action_ptr->Id.begin()+i);
                                                                                        --i;
                                                                                }
                                                                        }
									if(cur_action_ptr->Id.empty()){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): Parameter Id missing in one action of event " << cur_ptr->Id << std::endl;
										return false;
									}
									content = xmlGetProp(cur_in_action, (xmlChar *)"value");
									if(content == NULL){
										content = xmlGetProp(cur_in_action, (xmlChar *)"expression");
										if(content == NULL){
											std::cerr << "StochKit ERROR (Input_events::recordEventsList): missing Parameter expression in Event Action\n";
											return false;
										}
										cur_action_ptr->Type = 3;
										// if it's an expression, it shouldn't involve itself
										std::string new_expression = (const char *)content;
										std::string::size_type loc = new_expression.find(cur_action_ptr->Id, 0);
										while( loc != std::string::npos ){
											if( (loc + cur_action_ptr->Id.size()) == new_expression.size() ){
												if( loc == 0){
													std::cerr << "StochKit ERROR (Input_events::recordEventsList): Parameter expression shouldn't involve itself in one action of event " << cur_ptr->Id  << std::endl;
													return false;
												} else if(!isalnum(new_expression.at(loc-1))){
													std::cerr << "StochKit ERROR (Input_events::recordEventsList): Parameter expression shouldn't involve itself in one action of event " << cur_ptr->Id  << std::endl;
													return false;
												}											
												loc = std::string::npos;
											} else {
												if( (loc == 0) && (!isalnum(new_expression.at(loc + cur_action_ptr->Id.size()))) ){
													std::cerr << "StochKit ERROR (Input_events::recordEventsList): Parameter expression shouldn't involve itself in one action of event " << cur_ptr->Id  << std::endl;
													return false;
												} else if((!isalnum(new_expression.at(loc-1))) && (!isalnum(new_expression.at(loc + cur_action_ptr->Id.size())))){
													std::cerr << "StochKit ERROR (Input_events::recordEventsList): Parameter expression shouldn't involve itself in one action of event " << cur_ptr->Id  << std::endl;
													return false;
												}											
												loc = new_expression.find(cur_action_ptr->Id, loc + 1);
											}
										}
									}
									cur_action_ptr->Expression = (const char *)content;
									xmlFree(content);
									if(cur_action_ptr->Expression.empty()){
										std::cerr << "StochKit ERROR (Input_events::recordEventsList): Parameter value missing in one action of event " << cur_ptr->Id  << std::endl;
										return false;
									}
									flag += 010;
								} else if ((xmlStrcasecmp(cur_in_action->name, (const xmlChar *)"Description"))){
									std::cerr << "StochKit ERROR (Input_events::recordEventsList): Unknown tag \"" << cur_in_action->name << "\" in one of the actions of Event " << cur_ptr->Id << std::endl;
									return false;
								}
							    }
							    cur_in_action = cur_in_action->next;
							}
							if ( flag != 011 ){
								std::cerr << "StochKit ERROR (Input_events::recordEventsList): necessary part missing or redundant while recording one of the actions in event " << cur_ptr->Id  << std::endl;
								return false;
							}
                				} else {
				                        std::cerr << "StochKit ERROR (Input_events::recordEventsList): Unknown tag \"" << cur_action->name << "\" in actions list of \"EventsList\"." << std::endl;
				                        return false;
				                }
					    }
					    cur_action = cur_action->next;
					}
					flag += 01000;
				} else if ((xmlStrcasecmp(cur_in_event->name, (const xmlChar *)"Description"))){
					std::cerr << "StochKit ERROR (Input_events::recordEventsList): Unknown tag \"" << cur_in_event->name << "\" in Event " << cur_ptr->Id << std::endl;
					return false;
				}
 			    }
			    cur_in_event = cur_in_event->next;
			}
			if ( flag != 01111 ){
				if(!(flag & 01)){
					std::cerr << "StochKit ERROR (Input_events::recordEventsList): event Id missing\n";
				}else{
					std::cerr << "StochKit ERROR (Input_events::recordEventsList): necessary part missing or redundant while recording event " << cur_ptr->Id  << std::endl;
				}
				return false;
			}
                } else {
                        std::cerr << "StochKit ERROR (Input_events::recordEventsList): Unknown tag \"" << cur_event->name << "\" in \"EventsList\"." << std::endl;
                        return false;
                }
    	    }
	    cur_event = cur_event->next;
	}

	return true;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
linkParametersAndReactions()
{
	// loop through reactions
	// analyze which parameters affecting this reaction, add to parameter's affect reaction list
	// see if the parameters are changeable for mass-action
	// mark reactions as affected by changeable parameters if it's mass-action reaction
	class Reaction *cur_reaction;
        std::vector<unsigned int> ParametersAffectThis;
	int flag = 0;

	for( unsigned int i=0; i<ReactionsList.size(); ++i){
		cur_reaction = &ReactionsList[i];
		
		if(cur_reaction->Type == 0){
			ParametersAffectThis = ParametersList.analyzeParameterExpression(cur_reaction->Rate);
			flag = 0;
			for( unsigned int j = 0; j < ParametersAffectThis.size(); ++j ){
				ParametersList[ParametersAffectThis[j]].AffectReactions.push_back(i);
				if( ParametersList[ParametersAffectThis[j]].Type == 1 ){
					flag = 1;
				}
			}
			if( flag == 1 ){
				cur_reaction->Type = 3;
			}
		} else if(cur_reaction->Type == 1){
                        std::cerr << "StochKit ERROR (Input_events::linkParametersAndReactions): Michelis-Menten not implemented yet at reaction " << cur_reaction->Id<<std::endl;
                } else if(cur_reaction->Type == 2){
			ParametersAffectThis = ParametersList.analyzeParameterExpression(cur_reaction->Customized);
			for( unsigned int j = 0; j < ParametersAffectThis.size(); ++j ){
				ParametersList[ParametersAffectThis[j]].AffectReactions.push_back(i);
			}
                } else{
                	std::cerr<<"StochKit ERROR (Input_events::linkParametersAndReactions): Unrecogonized reaction type in reaction " << cur_reaction->Id<<std::endl;
                	exit(1);
                }
	}
	
	return true;
}
	
// record species reference order and parameter reference order in actions, and mark parameters which are changeable during simulation
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
linkActionsWithSpeciesOrParameters()
{
	class Event *cur_event;
	class Action *cur_action;
	int flag = 0;

	for( unsigned int i=0; i<EventsList.size(); ++i){
		cur_event = &EventsList[i];

		if(cur_event->ActionsList.size() != 0){
			for( unsigned int j=0; j<cur_event->ActionsList.size(); ++j){
				cur_action = &cur_event->ActionsList[j];
				flag = 0;

				unsigned int k=0;

				if(cur_action->Type == 0 || cur_action->Type == 1){
				       	while( (k<SpeciesList.size()) && (flag==0) ){
						if(cur_action->Id.compare(SpeciesList[k].Id) == 0){
	 						flag = 1;
	 						cur_action->Index = k;
	 					}
						++k;
					}
					if( flag == 0 ){
						std::cerr << "StochKit ERROR (Input_events::linkActionsWithSpeciesOrParameters): Species \"" << cur_action->Id << "\" in one of the actions in event " << cur_event->Id << " does not exist in SpeciesList\n"; 
						return false;
					}
				} else if(cur_action->Type == 2 || cur_action->Type == 3 ) {
				       	while( (k<ParametersList.size()) && (flag==0) ){
						if(cur_action->Id.compare(ParametersList[k].Id) == 0){
	 						flag = 1;
							ParametersList[k].Type = 1;
	 						cur_action->Index = k;
	 					}
						++k;
					}
					if( flag == 0 ){
						std::cerr << "StochKit ERROR (Input_events::linkActionsWithSpeciesOrParameters): Parameter " << cur_action->Id << " in one of the actions in event " << cur_event->Id << " does not exist in ParametersList\n"; 
						return false;
					}
				} else {
					std::cerr << "StochKit ERROR (Input_events::linkActionsWithSpeciesOrParameters): Action Type " << cur_action->Type << " not recognized\n";
					return false;
				}
			
			}
		}
		else{
			std::cout << "StochKit WARNING (Input_events::linkActionsWithSpeciesOrParameters): There is no action in event " << cur_event->Id << std::endl;
		}
	}
 
	return true;
}

// record species reference order of reactants and products in reactions, meanwhile write affect reactions in species list
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
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
						 if( cur_reaction->Type == 0 || cur_reaction->Type == 1 || cur_reaction->Type ==3 ){
	 					 	SpeciesList[k].AffectReactions.push_back(i);
						 }
	 					 cur_reactant->Index = k;
	 				 }
					 ++k;
				}
			
				if( flag == 0 ){
					std::cerr << "StochKit ERROR (Input_events::linkSpeciesAndReactions): reactant " << cur_reactant->Id << " in reaction " << cur_reaction->Id << " does not exist in SpeciesList\n"; 
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
                                                std::cout << "StochKit WARNING (Input_events::linkSpeciesAndReactions): reactant " << cur_reaction->Reactants[j].Id << " not shown in the propensity function of reaction " << cur_reaction->Id << ", this may cause negative population of this species." << std::endl;
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
					std::cerr << "StochKit ERROR (Input_events::linkSpeciesAndReactions): product " << cur_product->Id << " in reaction " << cur_reaction->Id << " does not exist in SpeciesList\n"; 
					return false;
				}
			}
		}
	}
 
	return true;
}

// calculate initial population based on the value stored in parameterslist
template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
typename
Input_events<_populationVectorType,
        _stoichiometryType,
        _dependencyGraphType>::
_populationValueType
Input_events<_populationVectorType,
        _stoichiometryType,
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
	                        std::cerr << "StochKit ERROR (Input_events::populationCalculation): while calculating rate " << equation << std::endl;
                                return BADRESULT;
                        }
                }
        }

        std::string substitutedEquation = ParametersList.parameterSubstitution(equation);
        if( substitutedEquation.empty() ){
                std::cerr << "StochKit ERROR (Input_events::populationCalculation): while calculating initial population " << equation << std::endl;
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
	typename _dependencyGraphType>
bool
Input_events<_populationVectorType,
        _stoichiometryType,
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
	typename _dependencyGraphType>
_populationVectorType
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
writeInitialPopulation()
{
	_populationValueType cur_population;
        _populationVectorType X(NumberOfSpecies);
		  
	for(int i=0; i<NumberOfSpecies; ++i){
		cur_population = populationCalculation(SpeciesList[i].InitialPopulation);
		if( cur_population == BADRESULT ){
                	std::cerr << "StochKit ERROR (Input_events::writeInitialPopulation): while calculating initial population of " << SpeciesList[i].Id << std::endl;
                	exit(1);
		}
			
	        X[i] = cur_population;
	}
		  
        return X;
}

template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _dependencyGraphType>
_stoichiometryType
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
writeStoichiometry()
{
	#ifdef MATRIX_STOICHIOMETRY
		_stoichiometryType nu(NumberOfReactions, NumberOfSpecies);
	#else
		typedef typename _stoichiometryType::value_type vectorType;
		_stoichiometryType nu(NumberOfReactions, vectorType(NumberOfSpecies));
	#endif

	// initialize values to 0
	#ifdef MATRIX_STOICHIOMETRY
		//do nothing--sparse matrix defaults to all zero
	#else
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
	typename _dependencyGraphType>
_dependencyGraphType
Input_events<_populationVectorType,
        _stoichiometryType,
	_dependencyGraphType>::
writeDependencyGraph()
{
	typedef typename _dependencyGraphType::value_type _vectorType;
	typedef typename _vectorType::value_type _memberType;
		
	_dependencyGraphType dg(NumberOfReactions);

        class SpeciesReference *cur_species = NULL;

	_stoichiometryType nu = writeStoichiometry();

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

