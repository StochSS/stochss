#include "writeEquilibriumCode.h"

typedef boost::numeric::ublas::mapped_vector<double> sparse_vec;

void write_computeDependentPopulationsCode(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies) {

	ublas_matrix NU=createDenseStoichiometry(reactions,NumberOfSpecies);

	std::size_t rankNU=rank(NU);

	ublas_matrix gamma=createConservationMatrix(NU);

	std::vector<std::string> elementCode(gamma.size1());
	for (std::size_t i=0; i!=elementCode.size(); ++i) {
		elementCode[i]=calculateConservationTermString(i+rankNU,gamma);
		elementCode[i]=codify(elementCode[i],"x",parens);
		elementCode[i]=codify(elementCode[i],"C",parens);
	}

	//NOW WE HAVE ELEMENT CODE, WRITE COMPLETE FUNCTION CODE
    std::ofstream outfile;
	//open for appending
	outfile.open(filename.c_str(),std::ios::out | std::ios::app);
	if (!outfile) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_computeDependentPopulationsCode) error opening output file. Terminating.\n";
		exit(1);
	}
	try {
		outfile<<"void "<<function_name<<"(boost::numeric::ublas::vector<double>& x, boost::numeric::ublas::vector<double>& C) {\n";

		for (std::size_t i=0; i!=elementCode.size(); ++i) {
			outfile<<"\tx("<<(i+rankNU)<<")=" << elementCode[i] << ";\n";
		}
		outfile << "}\n\n";
		outfile.close();
	}
    catch (...) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_computeDependentPopulationsCode) error writing to file. Terminating.\n";
		exit(1);	
	}	


	//print_b_ElementCode(elementCode);
}

void write_computeConservationConstantsCode(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies) {

	ublas_matrix NU=createDenseStoichiometry(reactions,NumberOfSpecies);

	ublas_matrix gamma=createConservationMatrix(NU);

	std::size_t k=gamma.size1();//k is number of conservation constants
	std::vector<std::string> elementCode(k, "");

	for (std::size_t i=0; i!=k; ++i) {
		elementCode[i]=calculateConservationConstantString(i, gamma);
	}

	//NOW WE HAVE ELEMENT CODE, WRITE COMPLETE FUNCTION CODE
    std::ofstream outfile;
	//open for appending
	outfile.open(filename.c_str(),std::ios::out | std::ios::app);
	if (!outfile) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_computeConservationConstantsCode): error opening file. Terminating.\n";
		exit(1);
	}
	try {
		outfile<<"void "<<function_name<<"(boost::numeric::ublas::vector<double>& x, boost::numeric::ublas::vector<double>& C) {\n";

		for (std::size_t i=0; i!=elementCode.size(); ++i) {
			outfile<<"\tC("<<i<<")=" << codify(elementCode[i],"x",parens) << ";\n";
		}
		outfile << "}\n\n";
		outfile.close();
	}
    catch (...) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_computeConservationConstantsCode) error writing to file. Terminating.\n";
		exit(1);	
	}	

//	std::cout << "element code for computeConservationConstantsCode:\n";
//	print_b_ElementCode(elementCode);
}

std::string codify(std::string term, std::string var, BracketType bracket) {
//	std::cout << "codifying "<<term<<"\n";
	//look for substrings of the form xiii..., replace with x[iii]
	std::size_t currentPos=0;
	while (currentPos<term.size()) {
//		std::cout << "analyzing position "<<currentPos<<", char is "<<term.substr(currentPos,1)<<"\n";
		if (term.substr(currentPos,1)==var) {
//			std::cout << "matches "<<var<<"\n";
			if (bracket==parens) {
//				std::cout << "before inserting paren, term is "<<term<<"\n";
				term.insert(++currentPos,"(");
//				std::cout << "after inserting paren, term is "<<term<<"\n";				
			}
			else if (bracket==square) {
				term.insert(++currentPos,"[");
			}
			else {
				std::cout << "StochKit ERROR (writeEquilibriumCode::codify): invalid bracket type in codify (bug). Terminating.\n";
				exit(1);
			}
			++currentPos;
			//continue until current char is not a number
			std::string c=term.substr(currentPos,1);
			while (c=="0" || c=="1" || c=="2" || c=="3" || c=="4" || c=="5" || c=="6" || c=="7" || c=="8" || c=="9") {
//				std::cout << "c is "<<c<<"\n";
				++currentPos;
				c=term.substr(currentPos,1);
			}
//			std::cout << "now we are at position "<<currentPos<<", char is "<<term.substr(currentPos,1)<<"\n";
			if (bracket==parens) {
//				std::cout << "before inserting CLOSING paren, term is "<<term<<"\n";
				term.insert(currentPos,")");
//				std::cout << "after inserting CLOSING paren, term is "<<term<<"\n";				
			}
			else if (bracket==square) {
				term.insert(currentPos,"]");
			}
		}
		else ++currentPos;
	}
	return term;
}

std::string calculateConservationTermString(std::size_t speciesIndex, ublas_matrix& gamma) {
	//gamma matrix looks like, e.g.
	//	-1      1       0       1       0       0       0
	//	1       -1      0       0       1       0       0
	//	0       -1      -1      0       0       1       0
	//	-0      1       1       0       0       0       1
	//where NumberOfSpecies=7, rank of NU is 3, so columns 3 through 6 is I
	//we want to "solve" for species speciesIndex (>=rank) in terms of first 0-(rank-1) species and
	//conservation values "Ci" for i=0-(NumberOfSpecies-rank) corresponding to rows in conservation matrix
	//e.g. if speciesIndex==4, returns (C1-x0+x1)
	
//	std::cout << "in calculateConservationTermString, gamma:\n";
//	for (std::size_t i=0; i!=gamma.size1(); ++i) {
//		for (std::size_t j=0; j!=gamma.size2(); ++j) {
//			std::cout << gamma(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}
		
	std::size_t rankNU=gamma.size2()-gamma.size1();
	
	if (speciesIndex<rankNU) {
		std::cout << "StochKit ERROR (writeEquilibriumCode): attempt to calculateConservationTermString on independent species. Terminating.\n";
		exit(1);
	}

	std::size_t row=speciesIndex-rankNU;
	
	std::string term="(C"+num2string(row);
	
	for (std::size_t i=0; i!=rankNU; ++i) {
		if (gamma(row,i)!=0.0) {
			if (abs(gamma(row,i))!=1.0) {
				if (gamma(row,i)<0.0) {
					term+="+";
				}
				term+=num2string(-1.0*gamma(row,i))+"*";
			}
			else {
				if (gamma(row,i)<0.0) {
					term+="+";
				}
				else term+="-";		
			}
			term+="x"+num2string(i);
		}
	}
	term+=")";
//	std::cout << "term="<<term<<"\n";
	
	return term;
}

std::string calculateConservationConstantString(std::size_t constantIndex, ublas_matrix& gamma) {
	//gamma matrix looks like, e.g.
	//	-1      1       0       1       0       0       0
	//	1       -1      0       0       1       0       0
	//	0       -1      -1      0       0       1       0
	//	-0      1       1       0       0       0       1
	//where NumberOfSpecies=7, rank of NU is 3, so columns 3 through 6 is I
	//we want to "solve" for species speciesIndex (>=rank) in terms of first 0-(rank-1) species and
	//conservation values "Ci" for i=0-(NumberOfSpecies-rank) corresponding to rows in conservation matrix
	//e.g. if constantIndex==1, returns "x0+x1"
	
//	std::cout << "in calculateConservationConstantString, gamma:\n";
//	for (std::size_t i=0; i!=gamma.size1(); ++i) {
//		for (std::size_t j=0; j!=gamma.size2(); ++j) {
//			std::cout << gamma(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}
		
	std::size_t rankNU=gamma.size2()-gamma.size1();
	
	if (constantIndex>(gamma.size2()-rankNU)) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::calculateConservationConstantString): attempt to calculateConservationConstantString on invalid constantIndex. Terminating.\n";
		exit(1);
	}

	std::size_t row=constantIndex;
	
	std::string term="";
	
	for (std::size_t i=0; i!=rankNU; ++i) {
		if (gamma(row,i)!=0.0) {
			if (abs(gamma(row,i))!=1.0) {
				if (gamma(row,i)>0.0) {
					if (term.size()!=0) {
						term+="+";
					}
				}
				term+=num2string(gamma(row,i))+"*";
			}
			else {
				if (gamma(row,i)>0.0) {
					if (term.size()!=0) {
						term+="+";
					}
				}
				else term+="-";		
			}
			term+="x"+num2string(i);
		}
	}
	term+="+x"+num2string(constantIndex+rankNU);
//	std::cout << "C"<<constantIndex<<"="<<term<<"\n";
	
	return term;
}

ublas_matrix createDenseStoichiometry(std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies) {
//	std::cout << "creating dense stoich (NumberOfSpecies="<<NumberOfSpecies<<")\n";
	ublas_matrix NU(reactions.size(),NumberOfSpecies);
	for (std::size_t i=0; i!=reactions.size(); ++i) {
		//initialize to zeros
		for (std::size_t j=0; j!=NumberOfSpecies; ++j) {
			NU(i,j)=0.0;
		}
		sparse_vec stoich=reactions[i].getStoichiometry();
		for (sparse_vec::const_iterator it=stoich.begin(); it!=stoich.end(); ++it) {
			NU(i,it.index())=*it;
		}
	}
	return NU;
}

std::string double2string(double x) {
	std::stringstream ss;
	ss<<x;
	return ss.str();
}

void print_A_ElementCode(std::vector<std::vector<std::string> >& elementCode) {
	for (std::size_t i=0; i!=elementCode.size(); ++i) {
		for (std::size_t j=0; j!=elementCode[i].size(); ++j) {
			std::cout << "elementCode["<<i<<"]["<<j<<"]="<<elementCode[i][j]<<"\n";
		}
	}
}

void write_A_code(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies) {
//	std::cout << "in write_A_code...\n";
	
	ublas_matrix NU=createDenseStoichiometry(reactions,NumberOfSpecies);
//	std::cout << "NU:\n";
//	for (std::size_t i=0; i!=NU.size1(); ++i) {
//		for (std::size_t j=0; j!=NU.size2(); ++j) {
//			std::cout << NU(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}
	std::size_t r=rank(NU);
//	std::cout << "rank is "<<r<<"\n";

	//matrix is rank x rank
	std::vector<std::vector<std::string> > elementCode(r, std::vector<std::string>(r,""));

	ublas_matrix G=createConservationMatrix(NU);

	std::vector<std::string> conservationTerms(NumberOfSpecies-r);
	for (std::size_t i=0; i!=conservationTerms.size(); ++i) {
		conservationTerms[i]=calculateConservationTermString(i+r,G);
	}

//	std::cout << "about to createFstring...\n";
	std::vector<std::string> f=createFstring(reactions, NumberOfSpecies);
//	std::cout << "done with createFstring...\n";

//	std::vector<std::vector<std::string> > J=dfdx(f,NumberOfSpecies-r);
//	std::cout << "about to create J...\n";
	std::vector<std::vector<std::string> > J=dfdx(f,NumberOfSpecies);
//	std::cout << "done with create J...\n";

	for (std::size_t i=0; i!=J.size(); ++i) {
		for (std::size_t j=0; j!=J.size(); ++j) {
			elementCode[i][j]="-h*("+codify(J[i][j],"x",parens)+")";
			if (i==j) {
				elementCode[i][j]+="+1";
			}
		}
	}

//	std::cout << "now we have element code, write complete function code...\n";

	//NOW WE HAVE ELEMENT CODE, WRITE COMPLETE FUNCTION CODE
    std::ofstream outfile;
	//open for appending
	outfile.open(filename.c_str(),std::ios::out | std::ios::app);
	if (!outfile) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_A_code) error opening file. Terminating.\n";
		exit(1);
	}
	try {
//		outfile<<"void createA(boost::numeric::ublas::matrix<double>& A, boost::numeric::ublas::vector<double> x, double h) {\n";
		outfile<<"void "<<function_name<<"(boost::numeric::ublas::matrix<double>& A, boost::numeric::ublas::vector<double>& x, double h, boost::numeric::ublas::vector<double>& C) {\n";
		
		//write conservation constants
//		for (std::size_t i=0; i!=(NumberOfSpecies-r); ++i) {
//			std::string Ci=calculateConservationConstantString(i, G);
//			outfile<<"\tdouble C"<<num2string(i)<<"="<<codify(Ci,"x",parens)<<";\n";
//		}

		for (std::size_t i=0; i!=elementCode.size(); ++i) {
			for (std::size_t j=0; j!=elementCode[i].size(); ++j) {
				outfile<<"\tA("<<i<<","<<j<<")=" << codify(elementCode[i][j],"C",parens) << ";\n";
			}
		}
		outfile << "}\n\n";
		outfile.close();
	}
    catch (...) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_A_code) error writing to output file. Terminating.\n";
		exit(1);	
	}	
	
//	std::cout << "calling print_A_ElementCode...\n";
//	print_A_ElementCode(elementCode);
}

void print_b_ElementCode(std::vector<std::string>& elementCode) {
	for (std::size_t i=0; i!=elementCode.size(); ++i) {
			std::cout << "elementCode["<<i<<"]="<<elementCode[i]<<"\n";
	}
}

void write_b_code(std::string filename, std::string function_name, std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies) {
	ublas_matrix NU=createDenseStoichiometry(reactions,NumberOfSpecies);
//	std::cout << "NU:\n";
//	for (std::size_t i=0; i!=NU.size1(); ++i) {
//		for (std::size_t j=0; j!=NU.size2(); ++j) {
//			std::cout << NU(i,j) << "\t";
//		}
//		std::cout << "\n";
//	}
	std::size_t r=rank(NU);
//	std::cout << "rank is "<<r<<"\n";

	//matrix is rank x rank
	std::vector<std::string> elementCode(r, "");

	ublas_matrix G=createConservationMatrix(NU);

	std::vector<std::string> f=createFstring(reactions, NumberOfSpecies);
	
	for (std::size_t i=0; i!=f.size(); ++i) {
		elementCode[i]="h*("+codify(f[i],"x",parens)+")+yn_1("+num2string(i)+")-x("+num2string(i)+")";
	}

	//NOW WE HAVE ELEMENT CODE, WRITE COMPLETE FUNCTION CODE
    std::ofstream outfile;
	//open for appending
	outfile.open(filename.c_str(),std::ios::out | std::ios::app);
	if (!outfile) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_b_code) error opening file. Terminating.\n";
		exit(1);
	}
	try {
//		outfile<<"void createb(boost::numeric::ublas::vector<double>& b, boost::numeric::ublas::vector<double>& yn_1, boost::numeric::ublas::vector<double>& x, double h) {\n";
		outfile<<"void "<<function_name<<"(boost::numeric::ublas::vector<double>& b, boost::numeric::ublas::vector<double>& yn_1, boost::numeric::ublas::vector<double>& x, double h, boost::numeric::ublas::vector<double>& C) {\n";

		//write conservation constants
//		for (std::size_t i=0; i!=(NumberOfSpecies-r); ++i) {
//			std::string Ci=calculateConservationConstantString(i, G);
//			outfile<<"\tdouble C"<<num2string(i)<<"="<<codify(Ci,"x",parens)<<";\n";
//		}

		for (std::size_t i=0; i!=elementCode.size(); ++i) {
			outfile<<"\tb("<<i<<")=" << codify(elementCode[i],"C",parens) << ";\n";
		}
		outfile << "}\n\n";
		outfile.close();
	}
    catch (...) {
		std::cout << "StochKit ERROR (writeEquilibriumCode::write_b_code) error writing to file. Terminating.\n";
		exit(1);	
	}	

//	std::cout << "b element code:\n";
//	print_b_ElementCode(elementCode);
}

std::vector<std::string> createFstring(std::vector<ElementaryReaction>& reactions, std::size_t NumberOfSpecies) {
//	std::cout << "in createFstring...\n";
	ublas_matrix NU=createDenseStoichiometry(reactions,NumberOfSpecies);
	std::size_t r=rank(NU);

	//matrix is rank x rank
	std::vector<std::string> elementCode(r, "");

	ublas_matrix G=createConservationMatrix(NU);

	//to avoid confusion, make this size of NumberOfSpecies
	std::vector<std::string> conservationTerms(NumberOfSpecies);
	for (std::size_t i=r; i!=NumberOfSpecies; ++i) {
		conservationTerms[i]=calculateConservationTermString(i,G);
	}
		
	//loop over reactions
	//for each nonzero element in stoich, insert term
	for (std::size_t i=0; i!=reactions.size(); ++i) {
//		std::cout << "processing reaction "<<i<<"...\n";
		sparse_vec stoich=reactions[i].getStoichiometry();
		for (sparse_vec::const_iterator it=stoich.begin(); it!=stoich.end(); ++it) {
			if (it.index()<r) {
				if (*it!=0.0) {
					if (*it>0.0 && elementCode[it.index()]!="") {
						elementCode[it.index()]+="+";
					}
					elementCode[it.index()]+=double2string(*it*reactions[i].getRateConstant());
					
					if (reactions[i].calculateReactionOrder()!=0) {
						elementCode[it.index()]+="*";
						if (reactions[i].calculateReactionOrder()==1) {
							if (reactions[i].getReactants()[0].getSpeciesIndex()<r) {
								elementCode[it.index()]+="x";
								elementCode[it.index()]+=num2string(reactions[i].getReactants()[0].getSpeciesIndex());
							}
							else {
								//term is a dependent species so replace term with conservation term
								elementCode[it.index()]+=conservationTerms[reactions[i].getReactants()[0].getSpeciesIndex()];
							}
						}
						else {//bimolecular; we assume no A+A type propensities
							if (reactions[i].getReactants()[0].getMoleculeCount()>=2) {
//								std::cout << "StochKit ERROR: slow-scale SSA (writeEquilibriumCode) currently cannot handle an \"A+A\" type reaction in the fast process...not tested...\n";
//								exit(1);
								//we need to insert a "/2.0" before the previous "*" that was automatically inserted after the rate constant
								elementCode[it.index()].insert(elementCode[it.index()].size()-1,"/2.0");
								if (reactions[i].getReactants()[0].getSpeciesIndex()<r) {
									//species is a "independent species"
									elementCode[it.index()]+="x";
									elementCode[it.index()]+=num2string(reactions[i].getReactants()[0].getSpeciesIndex());
									elementCode[it.index()]+="*";
									elementCode[it.index()]+="x";
									elementCode[it.index()]+=num2string(reactions[i].getReactants()[0].getSpeciesIndex());
								}
								else {
									//species is a "dependent species"
//									std::cout << "species index "<<reactions[i].getReactants()[0].getSpeciesIndex()<<" is a dependent species...n";
									elementCode[it.index()]+=conservationTerms[reactions[i].getReactants()[0].getSpeciesIndex()]+"*";
									elementCode[it.index()]+=conservationTerms[reactions[i].getReactants()[0].getSpeciesIndex()];									
								}
							}
							else {
								//should also check for 3rd order reactions...not implemented
								
								if (reactions[i].getReactants()[0].getSpeciesIndex()<r) {
									elementCode[it.index()]+="x";
									elementCode[it.index()]+=num2string(reactions[i].getReactants()[0].getSpeciesIndex());
									elementCode[it.index()]+="*";
								}
								else {
									elementCode[it.index()]+=conservationTerms[reactions[i].getReactants()[0].getSpeciesIndex()]+"*";								
								}
								if (reactions[i].getReactants()[1].getSpeciesIndex()<r) {
									elementCode[it.index()]+="x";
									elementCode[it.index()]+=num2string(reactions[i].getReactants()[1].getSpeciesIndex());
								}
								else {
									elementCode[it.index()]+=conservationTerms[reactions[i].getReactants()[1].getSpeciesIndex()];
								}
							}
						}
					}
				}
			}
		}
	}
//	std::cout << "printing f string element code:\n";
//	print_b_ElementCode(elementCode);
	return elementCode;
}//createFstring

std::vector<std::vector<std::string> > dfdx(std::vector<std::string> f, std::size_t NumberOfSpecies) {
	std::vector<std::vector<std::string> > J(f.size(), std::vector<std::string>(f.size(),""));

//	std::cout << "computing Jacobian (dfdx) string from f:\n";
//	for (std::size_t i=0; i!=f.size(); ++i) {
//		std::cout << "f("<<i<<")="<<f[i]<<"\n";
//	}

	std::size_t num_ind_x_terms=f.size(); //number of independent species
	std::size_t num_cons_terms=NumberOfSpecies-num_ind_x_terms;//number of conservation terms

	std::vector<GiNaC::symbol> C;//conservation term symbols
	for (std::size_t i=0; i!=num_cons_terms; ++i) {
		std::string sym="C"+STOCHKIT::StandardDriverUtilities::size_t2string(i);
//		std::cout << "adding symbol \""<<sym<<"\"\n";
		GiNaC::symbol tmpC(sym);
		C.push_back(tmpC);
	}


	std::vector<GiNaC::symbol> X;//species term symbols
	for (std::size_t i=0; i!=num_ind_x_terms; ++i) {
		std::string sym="x"+STOCHKIT::StandardDriverUtilities::size_t2string(i);
//		std::cout << "adding symbol \""<<sym<<"\"\n";
		GiNaC::symbol tmpX(sym);
		X.push_back(tmpX);
	}

	GiNaC::symtab table;
	for (std::size_t i=0; i!=num_cons_terms; ++i) {
		std::string sym="C"+STOCHKIT::StandardDriverUtilities::size_t2string(i);
		table[sym]=C[i];
	}

	for (std::size_t i=0; i!=num_ind_x_terms; ++i) {
		std::string sym="x"+STOCHKIT::StandardDriverUtilities::size_t2string(i);
		table[sym]=X[i];
	}

	GiNaC::parser reader(table);
//	std::string expression="-0.0254*x0*(C0+x0)+10*(C1-x0)";
//	GiNaC::ex test_expression=reader(expression);
//	GiNaC::ex e00=test_expression.diff(x0);
//	std::cout << "elementCode[0][0]="<<e00<<"\n";
//	std::string codified=codify(expression,"x",parens);
//	std::cout << "codify it: "<<codified<<"\n";
//	std::cout << "verify original expression is unchanged: "<<expression<<"\n";
//
//	std::string xi="x0";
//	GiNaC::ex etest=reader(expression).diff(GiNaC::ex_to<GiNaC::symbol>(table[xi]));
//	std::cout << "automatic differentiation wrt "<<xi<<": "<<etest<<"\n";

	//loop over terms in f
	for (std::size_t i=0; i!=f.size(); ++i) {
		std::string term=f[i];
		std::string xi;
		//loop over x_i, differentiating as we go
		for (std::size_t j=0; j!=f.size(); ++j) {
			xi="x"+num2string(j);
//			std::cout << "xi is "<<xi<<"\n";
			GiNaC::ex dydxi=reader(term).diff(GiNaC::ex_to<GiNaC::symbol>(table[xi]));
			std::stringstream ss;
			ss<<dydxi;
			J[i][j]=ss.str();
		}
	}

//	std::cout << "J:\n";
//	for (std::size_t i=0; i!=f.size(); ++i) {
//		for (std::size_t j=0; j!=f.size(); ++j) {
//			std::cout << "J["<<i<<"]["<<j<<"]="<<J[i][j]<<"\n";
//		}
//	}
	return J;
}





