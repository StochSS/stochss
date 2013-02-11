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

#ifndef _INPUT_ODE_BEFORE_COMPILE_H_
#define _INPUT_ODE_BEFORE_COMPILE_H_

#include "Input.h"
#include <fstream>

//#define _CUSTOM_PROPENSITY_FUNCTIONS_FILENAME_ "CustomPropensityFunctions.h"
namespace STOCHKIT
{

 template<typename _populationVectorType,
	typename _stoichiometryType,
	typename _propensitiesFunctorType,
	typename _dependencyGraphType>
 class Input_ODE_before_compile :
	public Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>
 {
	std::vector<std::string> rightHandSide;
	std::vector<std::string> jacobian;
	bool ODE_ready;
	double volume, NATIMESVOLUME;
	static const double AvogadroConstant = 6.02214E23;

 public:
        Input_ODE_before_compile(char *xmlFilename):
		Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>(xmlFilename),
		rightHandSide(this->NumberOfSpecies, "RCONST(0)"),
		jacobian(this->NumberOfSpecies*this->NumberOfSpecies,"RCONST(0)"),
		ODE_ready(false),
		NATIMESVOLUME(1.0)
	{
	}

 protected:
	// calculate rate based on the value stored in parameterslist
        double rateCalculation(std::string equation)
	{
		std::vector<unsigned int> ParametersAffectRate;
		std::vector<unsigned int>::iterator para_it; // iterator of parameters in link graph
		
		ParametersAffectRate = this->ParametersList.analyzeParameterExpression(equation);
	
		bool calculationStatus = false;

		for( para_it = ParametersAffectRate.begin(); para_it < ParametersAffectRate.end(); ++para_it ){
			if( this->ParametersList[*para_it].CalculateFlag == -1 ){
				calculationStatus = this->ParametersList.calculateParameter(*para_it);
				if(!calculationStatus){                   
					std::cerr << "StochKit ERROR (Input_mass_action::rateCalculation): while calculating rate " << equation << std::endl;
					return BADRESULT;
				}
			}
		}
		
		std::string substitutedEquation = this->ParametersList.parameterSubstitution(equation);
		if( substitutedEquation.empty() ){
			std::cerr << "StochKit ERROR (Input_mass_action::rateCalculation): while calculating rate " << equation << std::endl;
			return BADRESULT;
		}
		
		return this->simpleCalculator.calculateString(substitutedEquation);
	}

	bool getODEReady()
	{
                double rate;

                typename Input<_populationVectorType, _stoichiometryType, _propensitiesFunctorType, _dependencyGraphType>::Reaction *cur_reaction;

		int volume_position;
		if((volume_position = findParameterWithId("Volume")) != -1){
		} else if((volume_position = findParameterWithId("VOLUME")) != -1){
		} else if((volume_position = findParameterWithId("volume")) != -1){
		} else {
			std::cout << "StochKit WARNING (Input_ODE_before_compile::getODEReady): no volume parameter is specified, assuming model file is written in concentration style." << std::endl;
			volume = 1.0;
			NATIMESVOLUME = 1.0;
		}

		if(volume_position != -1){
			if(this->ParametersList[volume_position].CalculateFlag != 1){
				std::cerr << "StochKit ERROR (Input_ODE_before_compile::getODEReady): ParametersList not calculated." << std::endl;
				exit(1);
			}
			volume = this->ParametersList[volume_position].Value;
			NATIMESVOLUME = volume * AvogadroConstant;
		}

		std::string customized_propensities;
		std::ostringstream temp_expressions;

                for(int i=0; i<this->NumberOfReactions; ++i){
                        cur_reaction = &this->ReactionsList[i];

                        if(cur_reaction->Type == 0){
                                rate = rateCalculation(cur_reaction->Rate);
                                if( rate == BADRESULT ){
                                        std::cerr << "StochKit ERROR (Input_ODE_before_compile::getODEReady): while calculating rate of reaction " << cur_reaction->Id << "\n";
                                        return false;
                                }
                                switch ( cur_reaction->Reactants.size() ){
                                        case 0:
//						std::cout << "0-th order: " << i << std::endl;
						for(std::size_t j=0; j<cur_reaction->Products.size(); ++j){
							temp_expressions.str("");
							temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*rate/NATIMESVOLUME << ")";
							rightHandSide[cur_reaction->Products[j].Index] += temp_expressions.str();
						}
                                                break;
                                        case 1:
                                                if( cur_reaction->Reactants[0].Stoichiometry == -1 ) {
//							std::cout << "1-st order: " << i << std::endl;
							temp_expressions.str("");
							temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[0].Stoichiometry*rate << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
							rightHandSide[cur_reaction->Reactants[0].Index] += temp_expressions.str();
							
							temp_expressions.str("");
							temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[0].Stoichiometry*rate <<")" ;
							jacobian[cur_reaction->Reactants[0].Index * this->NumberOfSpecies + cur_reaction->Reactants[0].Index] += temp_expressions.str();

							for(std::size_t j=0; j<cur_reaction->Products.size(); ++j){
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*rate << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
								rightHandSide[cur_reaction->Products[j].Index] += temp_expressions.str();
							
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*rate <<")";
								jacobian[cur_reaction->Products[j].Index * this->NumberOfSpecies + cur_reaction->Reactants[0].Index] += temp_expressions.str();
							}
						}
                                                else if( cur_reaction->Reactants[0].Stoichiometry == -2 ) {
//							std::cout << "2-nd order of same species: " << i << std::endl;
							temp_expressions.str("");
							temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[0].Stoichiometry*rate*NATIMESVOLUME << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
							rightHandSide[cur_reaction->Reactants[0].Index] += temp_expressions.str();
							
							temp_expressions.str("");
							temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[0].Stoichiometry*2*rate*NATIMESVOLUME << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
							jacobian[cur_reaction->Reactants[0].Index * this->NumberOfSpecies + cur_reaction->Reactants[0].Index] += temp_expressions.str();

							for(std::size_t j=0; j<cur_reaction->Products.size(); ++j){
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*rate*NATIMESVOLUME << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
								rightHandSide[cur_reaction->Products[j].Index] += temp_expressions.str();
							
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*2*rate*NATIMESVOLUME << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
								jacobian[cur_reaction->Products[j].Index * this->NumberOfSpecies + cur_reaction->Reactants[0].Index] += temp_expressions.str();
							}
						}
                                                else{
                                                        std::cerr << "StochKit ERROR (Input_ODE_before_compile::getODEReady): currently the highest order mass-action reaction supported is bi-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
                                                        return false;
                                                }
                                                break;
                                        case 2:
                                                if( cur_reaction->Reactants[0].Stoichiometry != -1 || cur_reaction->Reactants[1].Stoichiometry != -1 ){
                                                        std::cerr << "StochKit ERROR (Input_ODE_before_compile::getODEReady): currently the highest order mass-action reaction supported is bi-molecular reaction while Reaction " << cur_reaction->Id << " is not\n";
                                                        return false;
						}
						else{
//							std::cout << "2-nd order of different species: " << i << std::endl;
							for(std::size_t j=0; j<cur_reaction->Reactants.size(); ++j){
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[j].Stoichiometry*rate*NATIMESVOLUME << ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")*Ith(y," << cur_reaction->Reactants[1].Index+1 << ")";
								rightHandSide[cur_reaction->Reactants[j].Index] += temp_expressions.str();
							
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[j].Stoichiometry*rate*NATIMESVOLUME << ")*Ith(y," << cur_reaction->Reactants[1].Index+1 << ")";
								jacobian[cur_reaction->Reactants[j].Index * this->NumberOfSpecies + cur_reaction->Reactants[0].Index] += temp_expressions.str();
							
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[j].Stoichiometry*rate*NATIMESVOLUME<< ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
								jacobian[cur_reaction->Reactants[j].Index * this->NumberOfSpecies + cur_reaction->Reactants[1].Index] += temp_expressions.str();
							}
							for(std::size_t j=0; j<cur_reaction->Products.size(); ++j){
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*rate*NATIMESVOLUME<< ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")*Ith(y," << cur_reaction->Reactants[1].Index+1 << ")";
								rightHandSide[cur_reaction->Products[j].Index] += temp_expressions.str();
							
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*rate*NATIMESVOLUME<< ")*Ith(y," << cur_reaction->Reactants[1].Index+1 << ")";
								jacobian[cur_reaction->Products[j].Index * this->NumberOfSpecies + cur_reaction->Reactants[0].Index] += temp_expressions.str();
							
								temp_expressions.str("");
								temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry*rate*NATIMESVOLUME<< ")*Ith(y," << cur_reaction->Reactants[0].Index+1 << ")";
								jacobian[cur_reaction->Products[j].Index * this->NumberOfSpecies + cur_reaction->Reactants[1].Index] += temp_expressions.str();
							}
                                                }
                                                break;
                                        default:
                                                std::cerr << "StochKit ERROR (Input_ODE_before_compile::getODEReady): more than 2 reactants in mass-action reaction " << cur_reaction->Id << "\n";
                                                return false;
                                }
                        }
			else if (cur_reaction->Type == 2) {
				customized_propensities = customPropensitySubstitution(cur_reaction->Customized);
                                for(std::size_t j=0; j<cur_reaction->Reactants.size(); ++j){
					temp_expressions.str("");
                                        temp_expressions << " +RCONST(" << (double)cur_reaction->Reactants[j].Stoichiometry/NATIMESVOLUME << ")*" << customized_propensities;
					rightHandSide[cur_reaction->Reactants[j].Index] += temp_expressions.str();
				}
				for(std::size_t j=0; j<cur_reaction->Products.size(); ++j){
					temp_expressions.str("");
					temp_expressions << " +RCONST(" << (double)cur_reaction->Products[j].Stoichiometry/NATIMESVOLUME<< ")*" << customized_propensities;
					rightHandSide[cur_reaction->Products[j].Index] += temp_expressions.str();
				}
                        } else{
                                  std::cerr << "StochKit ERROR (Input_ODE_before_compile::getODEReady): reaction " << cur_reaction->Id << " is not a mass-action or customized reaction\n";
                                  return false;
                        }
                }

		ODE_ready = true;
		return true;
	}

	// substitute parameters and species in custom propensities
	std::string customPropensitySubstitution(std::string equation)
	{
		// locate a parameter name in equation
		unsigned int begin = 0, end = 0;
		std::string substitutedEquation = equation;

		while( begin < substitutedEquation.length() ){
			if( (isalpha(substitutedEquation.at(begin)) || substitutedEquation.at(begin) == '_') && ( (begin==0) || ((substitutedEquation.at(begin) != 'e') && (substitutedEquation.at(begin) != 'E')) || !(isalnum(substitutedEquation.at(begin-1)) || substitutedEquation.at(begin-1) == '_') )){
				end = begin+1;
				while( (end<substitutedEquation.length()) && (isalnum(substitutedEquation.at(end)) || substitutedEquation.at(end) == '_') )
					++end;
				
				std::string parameterName = substitutedEquation.substr(begin,end-begin);
				
				// search for the parameter in ParametersList
				unsigned int i = 0;
				while( (i < this->ParametersList.size()) && (parameterName.compare(this->ParametersList[i].Id)!=0) )
					++i;

				if( i != this->ParametersList.size() ){
					// substitute parameter with its value
					std::ostringstream parameterValue;
					parameterValue <<  this->ParametersList[i].Value;
					substitutedEquation.replace(begin, end-begin, parameterValue.str());
					
					begin = begin + parameterValue.str().size();
				}
				else{
					// search for species in SpeciessList
					unsigned int j = 0;
					while( (j < this->SpeciesList.size()) && (parameterName.compare(this->SpeciesList[j].Id)!=0) )
						++j;

					if( j != this->SpeciesList.size() ){
						// substitute species name with its population variable
						std::ostringstream speciesReference;
						speciesReference << "Ith(y," << j+1 <<")*"<<NATIMESVOLUME;
						substitutedEquation.replace(begin, end-begin, speciesReference.str());
						
						begin = begin + speciesReference.str().size();
					}
					else{
						std::cout << "StochKit WARNING (Input_ODE_before_compile::customPropensitySubstitution): function \"" << parameterName << "\" written into custom propensity function, please make sure it's a legitimate c++ function \n";
						begin = begin + parameterName.size();
					}
				}
			}
			else if (substitutedEquation.at(begin) == '/'){
				substitutedEquation.replace(begin, 1, "/(double)");
				begin += 9;
			}
			else{
				++begin;
			}
		}

		return substitutedEquation;
	}

 public:
	bool writeODEFile(char *ODETemplateFileName, char *ODEFileName, std::vector<std::size_t> output_species_index, std::vector<std::string> output_species_names)
	{
		if(!ODE_ready){
			getODEReady();
		}
		
		if(output_species_index.size() != output_species_names.size()){
			std::cerr << "StochKit ERROR (Input_ODE_before_compile::writeODEFile): output_species_index.size() != output_species_names.size(), something is seriously wrong." << std::endl;
			exit(1);
		} else if(output_species_index.size() == 0){
			std::cerr << "StochKit ERROR (Input_ODE_before_compile::writeODEFile): output_species_index.size() == 0. Please set approapriate species to output." << std::endl;
			exit(1);
		}

		std::ifstream ODETemplateFile;
		std::ofstream ODEFile;
		ODETemplateFile.open(ODETemplateFileName);
		ODEFile.open(ODEFileName);

		if( !ODETemplateFile.is_open() ){
			std::cerr << "StochKit ERROR (Input_ODE_before_compile::writeODEFile): open ODE template file " << ODETemplateFileName << " failed." << std::endl;
			exit(1);
		} else if( !ODEFile.is_open() ) {
			std::cerr << "StochKit ERROR (Input_ODE_before_compile::writeODEFile): open write-to ODE file " << ODEFileName << " failed." << std::endl;
			exit(1);
		}

		_populationVectorType initialPop = this->writeInitialPopulation();

		std::string line;
		std::size_t insert_found;

		while(ODETemplateFile.good()){
			getline(ODETemplateFile, line);
			insert_found = line.find("INSERT GENERATED");
			if(insert_found == std::string::npos){
				ODEFile << line << std::endl;
			} else {
				if(line.find("CONSTANTS") != std::string::npos){
					ODEFile << line << std::endl;
					ODEFile << "#define NEQ   " << this->NumberOfSpecies << "          /* number of equations  */" << std::endl;
					ODEFile << "#define OUTPUT_SPECIES_NUMBER  " << output_species_index.size() << "    /* number of species in output  */" << std::endl;
				} else if (line.find("INITIAL CONDITION") != std::string::npos){
					ODEFile << line << std::endl;
					for(int i=0;i<this->NumberOfSpecies;++i){
						ODEFile << "  Ith(y," << i+1 << ") = RCONST(" << (double)initialPop[i]/volume <<");" << std::endl;
					}
				} else if (line.find("RIGHT HAND SIDE") != std::string::npos){
					ODEFile << line << std::endl;
					for(int i=0;i<this->NumberOfSpecies;++i){
						ODEFile << "  Ith(ydot," << i+1 << ") = " << rightHandSide[i] << ";" << std::endl;
					}
				} else if (line.find("OUTPUT SPECIES NAMES") != std::string::npos){
					ODEFile << line << std::endl;
					ODEFile << "  char *species_names[" << output_species_index.size() << "];" << std::endl;
					for(std::size_t i=0;i<output_species_index.size();++i){
						ODEFile << "   species_names[" << i << "] = \"" << output_species_names[i] << "\";" << std::endl;
					}
				} else if (line.find("OUTPUT SPECIES INDEX") != std::string::npos){
					ODEFile << line << std::endl;
					ODEFile << "  int species_index[" << output_species_index.size() << "] = { ";
					for(std::size_t i=0;i<output_species_index.size()-1;++i){
						ODEFile << " " << output_species_index[i] << ", ";
					}
					ODEFile << " " << output_species_index[output_species_index.size()-1] << " ";
					ODEFile << " };" << std::endl;
				} else{
					std::cerr << "StochKit ERROR (Input_ODE_before_compile::writeODEFile): template file corrupted, indication line not recognized: " << line;
					ODETemplateFile.close();
					ODEFile.close();
					exit(1);
				}
/*
				while(ODETemplateFile.good()){
					getline(ODETemplateFile, line);
					end_found = line.find("END OF GENERATED");
					if(end_found != std::string::npos){
						ODEFile << line;
						break;
					}
				}
*/
			}
		}

		ODETemplateFile.close();
		ODEFile.close();
		
		return true;
	}

  protected:
	int findParameterWithId(std::string givenId)
	{
	        int found = -1;
	        for( unsigned int i = 0; i < this->ParametersList.size(); ++i ){
        	        if(this->ParametersList[i].Id.compare(givenId) == 0){
                	        found = (int)i;
                        	break;
	                }
        	}
	        return found;
	}

 };

}
#endif

