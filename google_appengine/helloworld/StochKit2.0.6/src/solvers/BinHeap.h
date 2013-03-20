#ifndef _BIN_HEAP_H_
#define _BIN_HEAP_H_

#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <sstream>
#include <vector>
#include <stack>
#include <cassert>
#include <string>
#include <utility>
#include <list>

#include <math.h>

namespace STOCHKIT
{
  /**
   *@class BinHeap
   *
   *@brief BinHeap for multiple variable key values.
   This class is a minHeap with one clear distinction:
   this class allows access to members besides the top member.
   This feature is necessary in certain applications where
   the key value of an element is subject to change at
   any time such is the case with the rxn times
   in the Next Reaction Method of Stochkit.
   */
  class BinHeap
  {
  public:
    
    /**
     Constructor.
     Allocates memory for BinHeap structure.
     *@param n the number of elements (reactions) to be stored in the BinHeap.
     */
    BinHeap(int n);
    

    /**
     Destructor.
     Deallocates memory for BinHeap structure.
     */
    ~BinHeap();

    /**
     Set values of BinHeap and order accordingly.
     Sets the time at which each respective reaction
     will occur next then orders the BinHeap with
     respect to the size of these times.
     *@param initialRxnTimes array of times until each respective rxn occurs ordered by rxn number;
     */
    void initializeHeap(double* initialRxnTimes);

    /**
     Print binHeap for debugging purposes.
     *The BinHeap is printed in the following format
     * o
     * o   o
     * o   o   o   o
     * o   o   o   o   o   o   o   o
     *where "o" represents an element.
     */
    void printBinHeap();

    /**
       Print the reactions in order of firing time.
    */
    void printReactionTimes();
    
    /**
    Get the time of the next reaction to occur.
    Get the time of the top reaction in the BinHeap
    which will be the next reaction to occur in
    absolute time. This is done in constant time.
    *@return time in seconds until next rxn occurs.
    */
    double getNextRxnTime();
   
    /**
     Return the number of the next reaction occur.
     Get the number of the top reaction in the BinHeap
     which will be the next reaction to occur in
     absolute time. This is done in constant time.
     *@return reaction number of the next reaction to occur.
     */
    int getNextRxnNumber();
    
    /**
     Update a reaction's time.
     Updates a reaction in the BinHeap to reflect
     a new relative time, this includes doing the
     necessary movements/updates to the BinHeap.
     *@param rxnNumber the number of the rxn to update.
     *@param newRelativeTime the new time until the given rxn occurs.
     */
    void setNewRxnTime(int rxnNumber, double newRelativeTime);
  
    /**
       Get the time until a rxn happens.
       *@param rxnNumber the number of the rxn to get the time of.
       *@return the time in seconds until the rxn occurs.
       */
    double getRxnTime(int rxnNumber);

  private:
    
    /**
     *The number of reactions in the BinHeap.
     */
    int nRxns;
    
    /**
     *Array of times until reaction occurs that
     *keeps the order of the BinHeap.
     */
    double* rtimes;
    
    
    /**
     *Array that keeps track of which rxn in
     *rtimes a time corresponds to e.g. if the
     *the value of whichRxn[3] is 6
     *then the value of rtimes[3] will be the
     *absolute time at which rxn 6 occurs.
     */
     int* whichRxn;
    
     /**
      *Array that keeps track of where in rtimes
      *and whichRxn a given rxn is e.g. if the
      *value of heapPosition[4] is 2 then rxn 4
      *will happen at the relative time rtimes[2]
      */
      int* heapPosition;
     
      /**
       *Updates the position of a rxn in the heap.
       *Internal function used to update and sort
       *the position of a rxn in the BinHeap once
       *the rxn's time has been modified.
       *@param positionInHeap the position in the heap of rxn to be updated.
       */
      void update(int positionInHeap);
     
      /**
       *Sends a rxn down in the heap.
       *Send a rxn to a lower position in the heap
       *if the rxn will occur at a later time than
       *its children's reactions will occur.
       *@param positionInHeap the position in the heap of rxn to be updated.
       */
      void percolate_down(int positionInHeap);

      /**
       *Sends a rxn up in the heap.
       *Send a rxn to a higher position in the heap
       *if the rxn will occur at an earlier time than
       *its parent's reactions will occur.
       *@param positionInHeap the position in the heap of rxn to be updated.
       */
      void percolate_up(int positionInHeap);
    
  };

}

#endif

