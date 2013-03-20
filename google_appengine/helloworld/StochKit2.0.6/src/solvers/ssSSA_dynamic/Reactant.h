 /*
 *  Reactant.h
 *  
 *
 *  Created by Kevin Sanft on 8/13/10.
 *
 */

#ifndef _REACTANT_H_
#define _REACTANT_H_

#include <iostream>

class Reactant {
  public:
	Reactant();
	Reactant(std::size_t speciesIndex, std::size_t moleculeCount);
	void setSpeciesIndex(std::size_t index);
	std::size_t getSpeciesIndex() const;
	void setMoleculeCount(std::size_t number);
	std::size_t getMoleculeCount() const;

	bool operator==(const Reactant& other) const;

	void display();

  private:
	std::size_t speciesIndex;
	std::size_t moleculeCount;
};

typedef Reactant Product;

#endif