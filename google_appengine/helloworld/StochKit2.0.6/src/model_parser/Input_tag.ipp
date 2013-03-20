/*!
        \brief Input text file tag marker

	ALL IDS MUST START WITH AN ALPHABETIC LETTER, FOLLOWED BY LETTERS OR DIGITS
*/

#ifndef _INPUT_TAG_IPP_
#error This file is the implementation of Input_tag.h
#endif

namespace STOCHKIT
{

template<typename _modelTagType>
bool
Input_tag<_modelTagType>::
parseXmlFile(char *xmlFilename)
{
	//! xml file handler of stochkit input xml file
	xmlDocPtr stochkitXml;
	stochkitXml = xmlParseFile(xmlFilename);

	xmlNodePtr root, cur;
	int flag = 00; // flag indicating if anything missing or redundant in xml file
		
	if (stochkitXml == NULL) {
		std::cerr << "StochKit ERROR (Input_tag::parseXmlFile): Empty or not well-formed xml input file\n";
		return false;
	}

	root = xmlDocGetRootElement(stochkitXml);
	if (root == NULL) {
		std::cerr << "StochKit ERROR (Input_tag::parseXmlFile): Empty Document\n";
		xmlFreeDoc(stochkitXml);
		return false;
	}

	if (xmlStrcasecmp(root->name, (const xmlChar *) "Model")) {
		std::cerr << "StochKit ERROR (Input_tag::parseXmlFile): Document of the wrong type, root node != Model\n";
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
                        std::cerr << "StochKit ERROR (Input_tag::parseXmlFile): Unknown tag \"" << cur->name << "\" in \"Model\"." << std::endl;
                        return false;
		}
	    }
	    cur = cur->next;
	}
		
	if ( flag != 01111 && flag != 011111 ){
		std::cerr << "StochKit ERROR (Input_tag::parseXmlFile): Document error: necessary part missing or redundant\n";
		xmlFreeDoc(stochkitXml);
		return false;
	}

	xmlFreeDoc(stochkitXml);

        xmlCleanupParser();

	return true;
}

template<typename _modelTagType>
bool
Input_tag<_modelTagType>::
recordNumberOfReactions(xmlNodePtr cur)
{
	xmlChar *content;
	content = xmlNodeGetContent(cur);
	if(content == NULL){
		std::cerr << "StochKit ERROR (Input_tag::recordNumberOfReactions): missing NumberOfReactions \n";
		return false;
	}
	NumberOfReactions = atoi((const char *)content);
	xmlFree(content);
	if(NumberOfReactions <= 0){
		std::cerr << "StochKit ERROR (Input_tag::recordNumberOfReactions): NumberOfReactions <= 0 \n";
		return false;
	}
	return true;
}
  
template<typename _modelTagType>
bool
Input_tag<_modelTagType>::
recordNumberOfSpecies(xmlNodePtr cur)
{
	xmlChar *content;
	content = xmlNodeGetContent(cur);
	if(content == NULL){
		std::cerr << "StochKit ERROR (Input_tag::recordNumberOfSpecies): missing NumberOfSpecies \n";
		return false;
	}
	NumberOfSpecies = atoi((const char *)content);
	xmlFree(content);
	if(NumberOfSpecies <= 0){
		std::cerr << "StochKit ERROR (Input_tag::recordNumberOfSpecies): NumberOfSpecies <= 0 \n";
		return false;
	}
	return true;
}

template<typename _modelTagType>
bool
Input_tag<_modelTagType>::
recordParametersList(xmlNodePtr cur)
{
	xmlNodePtr cur_para, cur_in_para;  // xml pointer to current parameter and xml pointer in current parameter
	xmlChar *content;

	cur_para = cur->xmlChildrenNode;

	while( cur_para != NULL ){
	    if(cur_para->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_para->name, (const xmlChar *)"Parameter"))){
			++NumberOfParameters;
			cur_in_para = cur_para->xmlChildrenNode;
			while(cur_in_para != NULL){
				if ((!xmlStrcasecmp(cur_in_para->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_para);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input_tag::recordParametersList): missing parameter Id \n";
						return false;
					}
					ParametersList.push_back(std::string((const char *)content));
					xmlFree(content);
				}
				cur_in_para = cur_in_para->next;
			}
                } else {
                        std::cerr << "StochKit ERROR (Input_tag::recordParametersList): Unknown tag \"" << cur_para->name << "\" in \"ParametersList\"." << std::endl;
                        return false;
                }
	    }
	    cur_para = cur_para->next;
	}

	if( (int)ParametersList.size() != NumberOfParameters){
		std::cerr << "StochKit ERROR (Input_tag::recordParametersList): missing parameter Id \n";
		return false;
	}

	return true;
}

template<typename _modelTagType>
bool
Input_tag<_modelTagType>::
recordReactionsList(xmlNodePtr cur)
{
	xmlNodePtr cur_reac, cur_in_reac;  // xml pointer to current reaction & xml pointer in current reaction
	xmlChar *content;

	cur_reac = cur->xmlChildrenNode;

	while( cur_reac != NULL ){
	    if(cur_reac->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_reac->name, (const xmlChar *)"Reaction"))){
			cur_in_reac = cur_reac->xmlChildrenNode;
			while(cur_in_reac != NULL){
				if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_reac);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input_tag::recordReactionsList): missing Reaction Id \n";
						return false;
					}
					ReactionsList.push_back(std::string((const char *)content));
					xmlFree(content);
				} else if ((!xmlStrcasecmp(cur_in_reac->name, (const xmlChar *)"Type"))){
					content = xmlNodeGetContent(cur_in_reac);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input_tag::recordReactionsList): missing Reaction Type \n";
						return false;
					}
					if(!xmlStrcasecmp(content, (const xmlChar *)"michaelis-menten")){
						std::cerr << "StochKit ERROR (Input_tag::recordReactionsList): reaction type michaelis-menton not supported yet. Please treat with customized propensity." << std::endl;
						xmlFree(content);
						return false;
					}else if(!xmlStrcasecmp(content, (const xmlChar *)"customized")){
						mass_action_flag = false;
					}
					xmlFree(content);
				}
				cur_in_reac = cur_in_reac->next;
			}
                } else {
                        std::cerr << "StochKit ERROR (Input_tag::recordReactionsList): Unknown tag \"" << cur_reac->name << "\" in \"ReactionsList\"." << std::endl;
                        return false;
                }
	    }
	    cur_reac = cur_reac->next;
	}

	if( (int)ReactionsList.size() != NumberOfReactions ){
		std::cerr << "StochKit ERROR (Input_tag::recordSpeciesList): the number of Reactions in ReactionsList != NumberOfReactions\n";
		return false;
	}

	return true;
}

template<typename _modelTagType>
bool
Input_tag<_modelTagType>::
recordSpeciesList(xmlNodePtr cur)
{
	xmlNodePtr cur_spec, cur_in_spec;  // xml pointer to current species & xml pointer in current species
	xmlChar *content;

	cur_spec = cur->xmlChildrenNode;

	while( cur_spec != NULL ){
	    if(cur_spec->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_spec->name, (const xmlChar *)"Species"))){
			cur_in_spec = cur_spec->xmlChildrenNode;
			while(cur_in_spec != NULL){
				if ((!xmlStrcasecmp(cur_in_spec->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_spec);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input_tag::recordSpeciesList): missing Species Id \n";
						return false;
					}
					SpeciesList.push_back(std::string((const char *)content));
					xmlFree(content);
				}
				cur_in_spec = cur_in_spec->next;
			}
                } else {
                        std::cerr << "StochKit ERROR (Input_tag::recordSpeciesList): Unknown tag \"" << cur_spec->name << "\" in \"SpeciesList\"." << std::endl;
                        return false;
                }
	    }
	    cur_spec = cur_spec->next;
	}

	if( (int)SpeciesList.size() != NumberOfSpecies ){
		std::cerr << "StochKit ERROR (Input_tag::recordSpeciesList): the number of Species in SpeciesList != NumberOfSpecies\n";
		return false;
	}

	return true;
}

template<typename _modelTagType>
bool
Input_tag<_modelTagType>::
recordEventsList(xmlNodePtr cur)
{
	xmlNodePtr cur_event, cur_in_event;  // xml pointer to current event & xml pointer in current event
	xmlChar *content;

	cur_event = cur->xmlChildrenNode;

	while( cur_event != NULL ){
	    if(cur_event->type == XML_ELEMENT_NODE){
		if((!xmlStrcasecmp(cur_event->name, (const xmlChar *)"Event"))){
			++NumberOfEvents;
			cur_in_event = cur_event->xmlChildrenNode;
			while(cur_in_event != NULL){
				if ((!xmlStrcasecmp(cur_in_event->name, (const xmlChar *)"Id"))){
					content = xmlNodeGetContent(cur_in_event);
					if(content == NULL){
						std::cerr << "StochKit ERROR (Input_tag::recordEventsList): missing Event Id \n";
						return false;
					}
					EventsList.push_back(std::string((const char *)content));
					xmlFree(content);
				}
				cur_in_event = cur_in_event->next;
			}
                } else {
                        std::cerr << "StochKit ERROR (Input_tag::recordEventsList): Unknown tag \"" << cur_event->name << "\" in \"EventsList\"." << std::endl;
                        return false;
                }
	    }
	    cur_event = cur_event->next;
	}

	if( (int)EventsList.size() != NumberOfEvents){
		std::cerr << "StochKit ERROR (Input_tag::recordEventsList): missing event Id \n";
		return false;
	}

	if( NumberOfEvents != 0 ){
		event_flag = true;
	}

	return true;
}

template<typename _modelTagType>
_modelTagType
Input_tag<_modelTagType>::
writeModelTag()
{
	_modelTagType modeltag;

	if( event_flag == true ){
		modeltag.Type = _modelTagType::events_enabled;
	} else {
		if( mass_action_flag == true ){
			modeltag.Type = _modelTagType::mass_action;
		} else {
			modeltag.Type = _modelTagType::mixed;
		}
	}

	modeltag.NumberOfReactions = NumberOfReactions;
	modeltag.NumberOfSpecies = NumberOfSpecies;

	modeltag.SpeciesList = SpeciesList;
	  
	return modeltag;
}

}
