#include<fstream>
#include<vector>
#include<list>
#include<sstream>
#include<algorithm>
#include<sbml/SBMLTypes.h>
#include<string.h>
#include<vector>

#include <libxml/tree.h>
using namespace std;

struct myNode
{
	ASTNodeType_t type;
	myNode *leftChild;
	myNode *rightChild;
	myNode *parent;
};
class myModel
{
public:
	myModel(Model *inputmodel, const char *inputfilename):model(inputmodel), filename(inputfilename){}
	void output()
	{
		int i, j, num, NumberOfReactions, NumberOfSpecies, NumberOfGlobalParameters;
		double value;
		string name, units, reaction_name;
		Parameter *parameter=NULL;
		Species *species;
		SpeciesReference *speciesreference;
		ModifierSpeciesReference *modifierreference;
		Compartment *compartment;
		const ASTNode *astnode;
		bool Is_Massaction;
		vector<string> paremeter_in_reaction;
		vector<string> for_check;
		istringstream filter;
		list<string> componentOfFormula;
		list<string>::iterator lsIterator;


		xmlDocPtr doc;
		doc=xmlNewDoc((const xmlChar *)"1.0");
		xmlNodePtr cur, child, localpara;
		xmlChar *xname;

		//	check

		if(model->getNumCompartments()>1)
		{
			cout<<"StochKit Error: Current version of Stochkit does not support multiple compartments"<<endl;
			exit(1);
		}
		if(model->getNumFunctionDefinitions()>=1)
		{
			cout<<"StochKit Warning: Current version of Stochkit does not support function definition"<<endl;
		}
		if(model->getNumEvents()>=1)
		{
			cout<<"StochKit Warning: To add events, please modify the stochkit specified xml file"<<endl;
		}
		if(model->getNumConstraints()>=1)
		{
			cout<<"StochKit Warning: Current version of Stochkit does not support constraints"<<endl;
		}
		if(model->getNumInitialAssignments()>=1)
		{
			cout<<"StochKit Warning: Current version of Stochkit does not support initial assignments"<<endl;
		}
		if(model->getNumRules()>=1)
		{
			cout<<"StochKit Warning: Current version of Stochkit does not support rules"<<endl;
		}
		if(model->getNumSpeciesWithBoundaryCondition()>=1)
		{
			cout<<"StochKit Warning: Current version of Stochkit does not support boundary condition for species"<<endl;
		}
		if(model->getNumUnitDefinitions()>=1)
		{
			cout<<"StochKit Warning: Current version of Stochkit does not support unit definition"<<endl;
		}

		//	model
		doc->children=xmlNewDocNode(doc, NULL, (const xmlChar *)"Model", NULL);
		cur=doc->children;

		//	description
		name=model->getId();
		if(name.empty())
			name=model->getName();
		if(!name.empty())
		{
			xname=typetoxmlchar<string>(name);
			xmlNewChild(cur, NULL, (const xmlChar *)"Description", xname);
			xmlFree(xname);
		}
		else 
			cout<<"Warning: No model name is provided."<<endl;

		//	number of reactions
		NumberOfReactions=model->getNumReactions();
		if(NumberOfReactions==0)
			cout<<"Warning: Number of reactions is zero."<<endl;
		xname=typetoxmlchar<int>(NumberOfReactions);
		xmlNewChild(cur, NULL, (const xmlChar *)"NumberOfReactions", xname);
		xmlFree(xname);

		//	number of species
		NumberOfSpecies=model->getNumSpecies();
		if(NumberOfSpecies==0)
			cout<<"Warning: Number of Species is zero."<<endl;
		xname=typetoxmlchar<int>(NumberOfSpecies);
		xmlNewChild(cur, NULL, (const xmlChar *)"NumberOfSpecies", xname);
		xmlFree(xname);

		//	parameter list
		child=xmlNewChild(cur, NULL, (const xmlChar *)"ParametersList", NULL);
		localpara=child;

		//		volume

		if(model->getNumCompartments()==0)
		{
			//	cout<<"StochKit Warning: The model has no compartment. You can ignore this warning if all the reactions are assumed to be in one compartment and the initial population are given in the form of initial amount"<<endl;
		}
		else
		{
			compartment=model->getCompartment(0);//******************here we assume that the system has only one compartment 
			if(!compartment->isSetSize())
			{
				//	cout<<"StochKit Warning: The size of the compartment '"<<compartment->getId()<<"' is unkonw.If the species' initial population are give in the form of initial amount (not initial concentration), just ignor this warning."<<endl;
			}
			else{
				cur=child;
				name=compartment->getId();//"Size";
				if(!name.empty())//construct the globalParameter list
					globalParameters.push_back(name);
				value=compartment->getSize();
				child=xmlNewChild(cur, NULL, (const xmlChar *)"Parameter", NULL);
				xname=typetoxmlchar<string>(name);
				xmlNewChild(child, NULL, (const xmlChar *)"Id", xname);
				xmlFree(xname);
				xname=typetoxmlchar<double>(value);
				xmlNewChild(child, NULL, (const xmlChar *)"Expression", xname);
				xmlFree(xname);
				units=compartment->getUnits();
				if(!compartment->isSetUnits())
				{
					//	cout<<"StochKit Warning: The units of the size of compartment '"<<compartment->getId()<<"' is not set."<<endl; 
					units="Unknown";
				}		
				xname=typetoxmlchar<string>(units);
				xmlNewChild(child, NULL, (const xmlChar *)"Units", xname);
				xmlFree(xname);
				child=child->parent;
			}
		}
		//		golobal parameters
		NumberOfGlobalParameters=model->getNumParameters();//**********************get the number of global parameters
		if(NumberOfGlobalParameters!=0)
		{
			if(cur!=child)
			{
				cur=child;
			}
			for(i=0;i<NumberOfGlobalParameters;i++)
			{
				parameter=model->getParameter(i);
				child=xmlNewChild(cur, NULL, (const xmlChar *)"Parameter", NULL);
				name=parameter->getId();
				if(!parameter->isSetId())
				{
					cout<<"StochKit Warning: The "<<i+1<<"th global parameter missed its id."<<endl; 
					name="Unknown";
				}
				else //construct the global paralemter list
					globalParameters.push_back(name);
				xname=typetoxmlchar<string>(name);
				xmlNewChild(child, NULL, (const xmlChar *)"Id", xname);
				xmlFree(xname);
				if(!parameter->isSetValue())
				{
					cout<<"StochKit Warning: The value of the "<<i+1<<"th global parameter '"<<name<<"' is not set."<<endl;
					xname=(xmlChar *)"Unknown";
					xmlNewChild(child, NULL, (const xmlChar *)"Expression", xname);
				}
				else
				{
					value=parameter->getValue();
					xname=typetoxmlchar<double>(value);
					xmlNewChild(child, NULL, (const xmlChar *)"Expression", xname);
					xmlFree(xname);
				}
			}
		}
		if(!xmlStrcmp(cur->name, (const xmlChar *)"ParametersList"))
			cur=cur->parent;

		//	reaction list
		child=xmlNewChild(cur, NULL, (const xmlChar *)"ReactionsList", NULL);
		cur=child;
		for(i=0;i<NumberOfReactions;i++)
		{
			child=xmlNewChild(cur, NULL, (const xmlChar *)"Reaction", NULL);
			reaction=model->getReaction(i);

			//		id
			reaction_name=reaction->getId();
			if(!reaction->isSetId())
			{
				cout<<"StochKit Warning:Reaction "<<i+1<<" missed its id."<<endl; 
				reaction_name="Unknown";
			}
			xname=typetoxmlchar<string>(reaction_name);
			xmlNewChild(child, NULL, (const xmlChar *)"Id", xname);
			xmlFree(xname);

			//		propensity
			kineticlaw=reaction->getKineticLaw();
			if(!reaction->isSetKineticLaw())
			{
				cout<<"StochKit Warning:The "<<i+1<<"th reaction '"<<name<<"' doesn't have kineticlaw."<<endl;
				formula="Unknown";
			}
			else
				formula=kineticlaw->getFormula();
			astnode=kineticlaw->getMath();

			//		type
			Is_Massaction=IsMassaction (astnode);
			if(Is_Massaction)
			{
				componentOfFormula.clear();
				filter.clear();
				formula=kineticlaw->getFormula();
				filter.str(formula);
				while(filter>>name)
					componentOfFormula.push_back(name);
				while(componentOfFormula.front()=="1")//remove the starting "1*" from the formula
				{
					lsIterator=componentOfFormula.begin();
					lsIterator++;
					if(lsIterator!=componentOfFormula.end() && *lsIterator=="*")
					{
						componentOfFormula.pop_front();
						componentOfFormula.pop_front();
					}
					else
						break;
				}
				for(lsIterator=componentOfFormula.begin(); lsIterator!=componentOfFormula.end();)
				{
					if(*lsIterator=="1" && lsIterator!=componentOfFormula.begin())
					{
						lsIterator--;
						if(*lsIterator=="*")
						{
							lsIterator=componentOfFormula.erase(lsIterator);
							lsIterator=componentOfFormula.erase(lsIterator);
						}
						else
						{
							lsIterator++;
							lsIterator++;
						}
					}
					else
						lsIterator++;
				}
				formula.clear();
				for(lsIterator=componentOfFormula.begin(); lsIterator!=componentOfFormula.end(); lsIterator++)
					formula+=*lsIterator;
				if(NumberOfx_1==1)
					formula="2*("+formula+")";
				xmlNewChild(child, NULL, (const xmlChar *)"Type", (const xmlChar *)"mass-action");
				xname=typetoxmlchar<string>(formula);
				xmlNewChild(child, NULL, (const xmlChar *)"Rate", xname);
				xmlFree(xname);
			}
			else
			{
				xname=typetoxmlchar<string>(formula);
				xmlNewChild(child, NULL, (const xmlChar *)"Type", (const xmlChar *)"customized");
				xmlNewChild(child, NULL, (const xmlChar *)"PropensityFunction", xname);
				xmlFree(xname);
			}

			//		reactants
			cur=child;
			num=reaction->getNumReactants();
			if(num!=0)
			{
				child=xmlNewChild(cur, NULL, (const xmlChar *)"Reactants", NULL);
				cur=child;
				for(j=0;j<num;j++)
				{
					child=xmlNewChild(cur, NULL, (const xmlChar *)"SpeciesReference", NULL);
					speciesreference=reaction->getReactant(j);
					name=speciesreference->getSpecies();
					if(!speciesreference->isSetSpecies())
					{
						cout<<"StochKit Warning:The "<<j+1<<"th reactant in the "<<i+1<<"th reaction '"<<reaction_name<<"' missed its id."<<endl;
						name="Unknown";
					}
					xname=typetoxmlchar<string>(name);
					xmlSetProp(child, (const xmlChar *)"id", xname);
					xmlFree(xname);
					value=speciesreference->getStoichiometry(); 
					xname=typetoxmlchar<double>(value);
					xmlSetProp(child, (const xmlChar *)"stoichiometry", xname);
					xmlFree(xname);
				}
				cur=cur->parent;
			}

			//		products
			num=reaction->getNumProducts();
			if(num!=0)
			{
				child=xmlNewChild(cur, NULL, (const xmlChar *)"Products", NULL);
				cur=child;
				for(j=0;j<num;j++)
				{
					child=xmlNewChild(cur, NULL, (const xmlChar *)"SpeciesReference", NULL);
					speciesreference=reaction->getProduct(j);
					name=speciesreference->getSpecies();
					if(!speciesreference->isSetSpecies())
					{
						cout<<"StochKit Warning:The "<<j+1<<"th product in the "<<i+1<<"th reaction '"<<reaction_name<<"' missed its id."<<endl;
						name="Unknown";
					}
					xname=typetoxmlchar<string>(name);
					xmlSetProp(child, (const xmlChar *)"id", xname);
					xmlFree(xname);
					value=speciesreference->getStoichiometry(); 
					xname=typetoxmlchar<double>(value);
					xmlSetProp(child, (const xmlChar *)"stoichiometry", xname);
					xmlFree(xname);
				}
				cur=cur->parent;
			}

			//		modifier
			num=reaction->getNumModifiers();
			if(num!=0)
			{
				cout<<"StochKit Warning: Stochkit2 does not support models with modifiers"<<endl;
				child=xmlNewChild(cur, NULL, (const xmlChar *)"Modifiers", NULL);
				cur=child;
				for(j=0;j<num;j++)
				{
					child=xmlNewChild(cur, NULL, (const xmlChar *)"ModifierSpeciesReference", NULL);
					modifierreference=reaction->getModifier(j);
					name=modifierreference->getSpecies();
					if(!modifierreference->isSetSpecies())
					{
						cout<<"StochKit Warning:The "<<j+1<<"th modifier in the "<<i+1<<"th reaction '"<<reaction_name<<"' missed its id."<<endl;
						name="Unknown";
					}
					xname=typetoxmlchar<string>(name);
					xmlSetProp(child, (const xmlChar *)"id", xname);
					xmlFree(xname);
				}
				cur=cur->parent;
			}
			cur=cur->parent;

			//		local parameters
			num=kineticlaw->getNumParameters();//*******************get the number of local parameters
			if(num!=0)
			{
				for(j=0;j<num;j++)
				{
					parameter=kineticlaw->getParameter(j);
					name=parameter->getId();
					if(!parameter->isSetId())
					{
						cout<<"StochKit Warning:The "<<j+1<<"th parameter in the "<<i+1<<"th reaction '"<<reaction_name<<"' missed its id."<<endl; 
						name="Unknown";
					}

					//check if conflict

					xname=typetoxmlchar<string>(name);
					if(IsInList(doc, localpara, (const xmlChar *)"Id", xname))
						cout<<"StochKit Warning: more than 1 local parameters use the name <"<<name<<">, please assign different names to them"<<endl;
					child=xmlNewChild(localpara, NULL, (const xmlChar *)"Parameter", NULL);
					xmlNewChild(child, NULL, (const xmlChar *)"Id", xname);
					xmlFree(xname);
					if(!parameter->isSetValue())
					{
						cout<<"StochKit Warning: The value of the "<<j+1<<"th parameter '"<<name<<"' in the "<<i+1<<"th reaction '"<<reaction_name<<"'is not set."<<endl;
						xname=(xmlChar *)"Unknown";
						xmlNewChild(child, NULL, (const xmlChar *)"Expression", xname);
					}
					else
					{
						value=parameter->getValue();
						xname=typetoxmlchar<double>(value);
						xmlNewChild(child, NULL, (const xmlChar *)"Expression", xname);
						xmlFree(xname);
					}
				}
				//	cur=cur->parent;
			}
		}
		cur=cur->parent;

		//species list
		child=xmlNewChild(cur, NULL, (const xmlChar *)"SpeciesList", NULL);
		cur=child;
		for(i=0;i<NumberOfSpecies;i++)
		{
			child=xmlNewChild(cur, NULL, (const xmlChar *)"Species", NULL);
			species=model->getSpecies(i);
			name=species->getId();
			if(!species->isSetId())
			{
				cout<<"StochKit Warning:The "<<i+1<<"th species in the species list missed its id."<<endl;
				name="Unknown";
			}
			xname=typetoxmlchar<string>(name);
			xmlNewChild(child, NULL, (const xmlChar *)"Id", xname);
			xmlFree(xname);
			if(species->isSetInitialAmount())
			{
				value=species->getInitialAmount();
				if(value<0)
					cout<<"StochKit Warning: Initial amount of the "<<i+1<<"th species '"<<name<<"' is negtive."<<endl;
				xname=typetoxmlchar<double>(value);
				xmlNewChild(child, NULL, (const xmlChar *)"InitialPopulation", xname);
				xmlFree(xname);
			}
			else if(species->isSetInitialConcentration())
			{
				cout<<"StochKit Warning: The initial polulation of the "<<i+1<<"th species '"<<name<<"' is given in the form of initial concentration."<<endl;
				value=species->getInitialConcentration();
				if(value<0)
					cout<<"StochKit Warning: Initial concentration of the "<<i+1<<"th species '"<<name<<"' is negtive."<<endl;
				xname=typetoxmlchar<double>(value);
				xmlNewChild(child, NULL, (const xmlChar *)"InitialConcentration", xname);
				xmlFree(xname);
				units=species->getUnits();
				if(!species->isSetUnits())
				{
					cout<<"StochKit Warning: The units of the initial concentration of the "<<i+1<<"th species '"<<name<<" is not set."<<endl; 
					units="Unknown";
				}		
				xname=typetoxmlchar<string>(units);
				xmlNewChild(child, NULL, (const xmlChar *)"Units", xname);
				xmlFree(xname);
			}
			else
				cout<<"StochKit Warning: Initial amount and initial concentration of the "<<i+1<<"th species '"<<name<<"' is unknown."<<endl;
		}
		cur=cur->parent;
		xmlIndentTreeOutput=1;
		xmlSaveFormatFile(filename, doc, 1);
		xmlFreeDoc(doc);
	}

private:
	Model *model;
	const char *filename;
	Reaction *reaction;
	KineticLaw *kineticlaw;
	int NumberOfGlobalParameters;
	vector<string> globalParameters;
	vector<myNode*> reactantPointer;
	vector<ASTNode*> reactantASTNodePointer;
	vector<string> reactantList;
	int NumberOfx_1;
	string formula;

	template<class TYPE>
	inline xmlChar *typetoxmlchar(TYPE n)
	{
		stringstream stream;
		string str;
		stream<<n;
		str=stream.str();
		const char *c=str.c_str();
		return xmlCharStrdup(c);
	}
	bool IsInList(xmlDocPtr doc, const xmlNodePtr node, const xmlChar *prop, const xmlChar *newname)
	{
		xmlNodePtr cur, child;
		xmlChar *name;
		cur=node->children;
		while(cur!=NULL)
		{
			child=cur->children;
			while(child!=NULL)
			{
				if(!xmlStrcmp(child->name, prop))
				{
					name = xmlNodeListGetString(doc, child->children, 1);
					if(!xmlStrcmp(name, newname))
					{
						xmlFree(name);
						return 1;
					}
					xmlFree(name);
					break;
				}
				child=child->next;
			}
			cur=cur->next;
		}
		return 0;
	}

	bool Isx_1 (const ASTNode *astnode, string &s)
	{
		const ASTNode *leftchild, *rightchild;
		ASTNodeType_t type;
		type=astnode->getType();
		if(type!=AST_MINUS)//[]-[]
			return false;
		rightchild=astnode->getRightChild();
		leftchild=astnode->getLeftChild();//[leftchild]-[rightchild]
		if(!rightchild->isNumber())
			return false;
		if(rightchild->getInteger()!=1 && rightchild->getReal()!=1)//[leftchild]-1
			return false;
		if(!leftchild->isName())//x-1
			return false;
		s=leftchild->getName();//s-1
		return true;
	}

	bool IsGlobalParameter (string s)
	{
		if(find(globalParameters.begin(), globalParameters.end(), s)!=globalParameters.end())
			return true;
		else
			return false;
	}
	bool IsLocalParameter(string s){return IsLocalParameter (s, this->kineticlaw);}
	bool IsLocalParameter (string s, KineticLaw *klaw)
	{
		int i, num;
		Parameter *parameter;
		num=klaw->getNumParameters();
		for(i=0; i<num; i++)
		{
			parameter=klaw->getParameter(i);
			if(s==parameter->getId())
				return true;
		}
		return false;
	}
	bool IsReactant (string s){return IsReactant (s, this->reaction);}
	bool IsReactant (string s, Reaction *rxn)
	{
		int i, num;
		SpeciesReference *speciesreference;
		num=rxn->getNumReactants();
		for(i=0; i<num; i++)
		{
			speciesreference=rxn->getReactant(i);
			if(s==speciesreference->getSpecies())
				return true;
		}
		return false;
	}
	bool tranverse(ASTNode *astnode, myNode *root)
	{
		myNode *newNode, *currentNode;
		ASTNode *leftchild, *rightchild, *currentASTNode;
		string s;
		currentNode=root;
		currentASTNode=astnode;
		bool massactionPossible;

		if(currentASTNode!=NULL)
		{
			if(Isx_1(currentASTNode, s))
			{
				if(IsReactant(s))
				{
					reactantList.push_back(s);
					reactantPointer.push_back(currentNode);
					reactantASTNodePointer.push_back(currentASTNode);
					NumberOfx_1++;
				}
				else if(!IsLocalParameter(s) && !IsGlobalParameter(s))
				{
					if(model->getSpecies(s)==NULL)
						cout<<"StochKit Warning: "<<s<<" is an unrecognized parameter in reaction '"<<reaction->getId()<<"'"<<endl;
					return false;
				}
			}
			else if(currentASTNode->isName())
			{
				s=currentASTNode->getName();
				if(IsReactant(s))
				{
					reactantList.push_back(s);
					reactantPointer.push_back(currentNode);
					reactantASTNodePointer.push_back(currentASTNode);
				}
				else if(!IsLocalParameter(s) && !IsGlobalParameter(s))
				{
					if(model->getSpecies(s)==NULL)
						cout<<"StochKit Warning: "<<s<<" is an unrecognized parameter in reaction '"<<reaction->getId()<<"'"<<endl;
					return false;
				}
			}
			else
			{
				leftchild=currentASTNode->getLeftChild();
				rightchild=currentASTNode->getRightChild();
				if(leftchild!=NULL)
				{
					newNode=new myNode;
					currentNode->leftChild=newNode;
					newNode->parent=currentNode;
					newNode->type=leftchild->getType();
					newNode->leftChild=NULL;
					newNode->rightChild=NULL;
					massactionPossible=tranverse(leftchild, newNode);
					if(!massactionPossible)
						return false;
				}
				if(rightchild!=NULL)
				{
					newNode=new myNode;
					currentNode->rightChild=newNode;
					newNode->parent=currentNode;
					newNode->type=rightchild->getType();
					newNode->leftChild=NULL;
					newNode->rightChild=NULL;
					massactionPossible=tranverse(rightchild, newNode);
					if(!massactionPossible)
						return false;
				}
			}
		}
		return true;
	}
	void deleteMyTree(myNode *root)
	{
		if(root!=NULL)
		{
			deleteMyTree(root->leftChild);
			deleteMyTree(root->rightChild);
			delete root;
		}
	}
	bool IsMassaction (const ASTNode *inputastnode)
	{
		SpeciesReference *speciesreference;
		bool isMassaction;
		myNode *root, *pointer;
		int i, reactantNumber;
		ASTNode *astnode;
		astnode=inputastnode->deepCopy();
		NumberOfx_1=0;
		reactantPointer.clear();
		reactantASTNodePointer.clear();
		reactantList.clear();
		root=new myNode;
		root->type=astnode->getType();
		root->parent=NULL;
		root->leftChild=NULL;
		root->rightChild=NULL;

		if(reaction->getNumReactants()>2)//accept at most two reactants
		{
			deleteMyTree(root);//delete my custom tree
			astnode->~ASTNode();
			return false;
		}

		isMassaction=tranverse(astnode, root);
		reactantNumber=reactantList.size();
		if(!isMassaction)
		{
			deleteMyTree(root);//delete my custom tree
			astnode->~ASTNode();
			return false;
		}
		if(reactantNumber>2)
		{
			deleteMyTree(root);//delete my custom tree
			astnode->~ASTNode();
			return false;
		}
		if(reactantNumber==0 && reaction->getNumReactants()!=0)
		{
			deleteMyTree(root);//delete my custom tree
			astnode->~ASTNode();
			return false;
		}
		if(reactantNumber==1)
		{
			if(NumberOfx_1==1 || reaction->getNumReactants()!=1)
			{
				deleteMyTree(root);//delete my custom tree
				astnode->~ASTNode();
				return false;
			}
			speciesreference=reaction->getReactant(0);
			if(speciesreference->getStoichiometry()!=1)
			{
				deleteMyTree(root);//delete my custom tree
				astnode->~ASTNode();
				return false;
			}
		}
		if(reactantNumber==2)
		{
			if(NumberOfx_1>1)
			{
				deleteMyTree(root);//delete my custom tree
				astnode->~ASTNode();
				return false;
			}
			if(NumberOfx_1==1)
			{
				speciesreference=reaction->getReactant(0);
				if(speciesreference->getStoichiometry()!=2 || reaction->getNumReactants()!=1)
				{
					deleteMyTree(root);//delete my custom tree
					astnode->~ASTNode();
					return false;
				}
			}
			if(NumberOfx_1==0)
			{
				if(reactantList[0]!=reactantList[1])
				{
					speciesreference=reaction->getReactant(0);
					if(speciesreference->getStoichiometry()!=1)
					{
						deleteMyTree(root);//delete my custom tree
						astnode->~ASTNode();
						return false;
					}
					speciesreference=reaction->getReactant(1);
					if(speciesreference->getStoichiometry()!=1)
					{
						deleteMyTree(root);//delete my custom tree
						astnode->~ASTNode();
						return false;
					}
				}
				else
				{
					speciesreference=reaction->getReactant(0);
					if(speciesreference->getStoichiometry()!=2 || reaction->getNumReactants()!=1)
					{
						deleteMyTree(root);//delete my custom tree
						astnode->~ASTNode();
						return false;
					}
				}
			}
		}
		for(i=0; i<reactantNumber; i++)
		{
			pointer=reactantPointer[i];
			while(pointer->parent!=NULL)
			{
				pointer=pointer->parent;
				if(pointer->type!=AST_TIMES && pointer->type!=AST_DIVIDE)
				{
					deleteMyTree(root);//delete my custom tree
					astnode->~ASTNode();
					return false;
				}
			}
		}

		//if we get here, the formular should propably be massaction
		if(reactantNumber==2 && NumberOfx_1==0 && reactantList[0]==reactantList[1])
		{
			cout<<"StochKit Warning: The propensity function of reaction "<<reaction->getId()<<" is "<<formula<<", we changed it to the mass-action form rate*"<<reactantList[1]<<"*("<<reactantList[1]<<"-1)/2"<<endl;
		}				

		//set the value of reactantASTNodePointer to be 1 for rate constant
		for(i=0; i<reactantNumber; i++)
		{
			//the order of removal matters
			reactantASTNodePointer[i]->removeChild(1);
			reactantASTNodePointer[i]->removeChild(0);
			reactantASTNodePointer[i]->setValue(1);
		}
		kineticlaw->setMath(astnode);
		
		deleteMyTree(root);//delete my custom tree
		astnode->~ASTNode();
		return true;
	}

};