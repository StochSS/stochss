#include "BinHeap.h"

namespace STOCHKIT
{

  BinHeap::BinHeap(int n)
  {
    //set the number of rxns equal to the input
    nRxns = n;

    //allocate the three arrays necessary
    //for structure of the BinHeap and
    //set all values to zero.
    rtimes = (double*)calloc(n,sizeof(double) );
    whichRxn = (int*)calloc(n,sizeof(int) );
    heapPosition = (int*)calloc(n,sizeof(int) );
  }

  BinHeap::~BinHeap()
  {
    free(rtimes);
    free(whichRxn);
    free(heapPosition);
  }
  
void BinHeap::initializeHeap(double* initialRxnTimes)
  {
    /*
    for(int k=0; k<nRxns; k++)
      {
	if(initialRxnTimes[k] != std::numeric_limits<double>::infinity())
	  std::cout << "inputTimes[" << k << "] = " <<  initialRxnTimes[k] << ";" << std::endl;
	else
	  std::cout << "inputTimes[" << k << "] = " <<  "std::numeric_limits<double>::infinity()" << ";" << std::endl;
      }
    */

    //set values of whichRxn and heapPosition
    int i;
    for(i=0; i<nRxns; i++)
      {
	whichRxn[i]=i;
	heapPosition[i]=i;
      }

    //copy input array to rtimes
    size_t sizeOfRxnTimes=nRxns*sizeof(double);
    std::memcpy( rtimes, initialRxnTimes, sizeOfRxnTimes );

    //order BinHeap
    for(i=(nRxns-1)>>1; i>=0; i--)
      {
	percolate_down(i);
      }

    /*
    std::cout << "\n \n \n ";
    for(int k=0; k<nRxns; k++)
      {	
	std::cout << k << "\t" << rtimes[k] << std::endl;
      }
    */
  }

  void BinHeap::printBinHeap()
  {
    int nElementsInRow=1;

    int i;
    for(i=0; i<nRxns; i++)
      {
	if(i == nElementsInRow)
	  {
	    std::cout << std::endl;
	    nElementsInRow = (nElementsInRow<<1)+1;
	  }
	std::cout << whichRxn[i] << "   ";
      }
  }

  void BinHeap::printReactionTimes()
  {
    for(int i=0; i<nRxns; i++)
      {
	std::cout << i << "\t" << whichRxn[i] << "   ";
	printf(" %1.15f \n", rtimes[i]);
      }
  }

  double BinHeap::getNextRxnTime()
  {
    return rtimes[0];
  }

  int BinHeap::getNextRxnNumber()
  {
    return whichRxn[0];
  }

  void BinHeap::setNewRxnTime(int rxnNumber, double newRelativeTime)
  {
    //update the time of the input rxn
    int positionInHeap = heapPosition[rxnNumber];
    rtimes[positionInHeap] = newRelativeTime;

    //update position in minHeap
    update(positionInHeap);
  }

  double BinHeap::getRxnTime(int rxnNumber)
  {
    int positionInHeap = heapPosition[rxnNumber];
    return rtimes[positionInHeap];
  }

  void BinHeap::update(int positionInHeap)
  {
    int parent=(positionInHeap-1)>>1;
   
    if(positionInHeap>0 && rtimes[positionInHeap]<rtimes[parent]){
      //std::cout << "percolate up" << std::endl;
      percolate_up(positionInHeap);
    }
    else
      percolate_down(positionInHeap);
  }

  void BinHeap::percolate_down(int positionInHeap)
  {
    /*DECLARE VARIABLES */

    //index of given rxn in rtimes and whichRxn
    int givenRxnIndex=positionInHeap;

    //index of left child of given rxn in rtimes and whichRxn
    int childRxnIndex=(givenRxnIndex<<1)+1;

    //time until given rxn occurs
    double givenRxnTime=rtimes[givenRxnIndex];

    //the rxn number of the rxn in the place of the givenRxnIndex
    int givenRxnNumber=whichRxn[givenRxnIndex];

    //the rxn number of the rxn in the place of the givenRxnIndex
    int childRxnNumber;



    /*MAIN LOOP TO PERCOLATE DOWN*/

    //while the given reaction has a left child
    while (childRxnIndex < nRxns)
      {
	
	//if the right child's rxn is smaller than the
	//left child's rxn then make the right child
	//the child to potentially be percolated up
	if(childRxnIndex != (nRxns-1) && rtimes[childRxnIndex+1] < rtimes[childRxnIndex])
	  childRxnIndex++;
	
	//if the time at which the rxn of the child occurs
	//is smaller than the time at which the given reaction
	//will occur then switch the given rxn with it's child
	if(rtimes[childRxnIndex] < givenRxnTime)
	  {
	    //update child to parent's spot and make necessary changes
	    rtimes[givenRxnIndex]=rtimes[childRxnIndex];
	    childRxnNumber=whichRxn[childRxnIndex];
	    heapPosition[childRxnNumber]=givenRxnIndex;
	    whichRxn[givenRxnIndex]=childRxnNumber;
	    
	    //update the index of givenRxn to reflect lower position in heap
	    givenRxnIndex=childRxnIndex;

	    //find the new child of the given rxn now that i
	    //has a lower position in heap so we can execute
	    //the next iteration of the main while loop
	    childRxnIndex=(givenRxnIndex<<1)+1;
	  }
	
	//if the given reaction occurs at an earlier time than both
	//of its children then it is in the right position and
	//there is no need to move the given reaction
	else
	  break;

      }
    
    //update parent's information to reflect new position
    rtimes[givenRxnIndex]=givenRxnTime;
    whichRxn[givenRxnIndex]=givenRxnNumber;
    heapPosition[givenRxnNumber]=givenRxnIndex;
  }
  
  void BinHeap::percolate_up(int positionInHeap)
  {
    /*DECLARE VARIABLES */

    //index of given rxn in rtimes and whichRxn
    int givenRxnIndex=positionInHeap;

    //index of parent of given rxn in rtimes and whichRxn
    int parentRxnIndex=(givenRxnIndex-1)>>1;

    //time until given rxn occurs
    double givenRxnTime=rtimes[givenRxnIndex];

    //the rxn number of the rxn in the place of the givenRxnIndex
    int givenRxnNumber=whichRxn[givenRxnIndex];

    //the rxn number of the rxn in the place of the givenRxnIndex
    int parentRxnNumber;



    /*MAIN LOOP TO PERCOLATE UP*/

    //while the given reaction has a parent
    while (parentRxnIndex >= 0)
      {
	//if the time at which the rxn of the parent occurs
	//is bigger than the time at which the given reaction
	//will occur then switch the given rxn with it's parent
	if(rtimes[parentRxnIndex] > givenRxnTime)
	  {

	    //update parent to given's spot and make necessary changes
	    rtimes[givenRxnIndex]=rtimes[parentRxnIndex];
	    parentRxnNumber = whichRxn[parentRxnIndex];
	    heapPosition[parentRxnNumber]=givenRxnIndex;
	    whichRxn[givenRxnIndex]=parentRxnNumber;

	    //update the index of givenRxn to reflect higher position in heap
	    givenRxnIndex=parentRxnIndex;

	    //find the new parent of the given rxn now that i
	    //has a higher position in heap so we can execute
	    //the next iteration of the main while loop
	    parentRxnIndex=(givenRxnIndex-1)>>1;
	  }
	
	//if the given reaction occurs at a later time than
	//its parent then it is at the correct position and
	//there is no need to move the given reaction
	else
	  break;

      }
    
    //update information to reflect new position of given
    rtimes[givenRxnIndex]=givenRxnTime;
    whichRxn[givenRxnIndex]=givenRxnNumber;
    heapPosition[givenRxnNumber]=givenRxnIndex;

  }

}//close namespace STOCHKIT
