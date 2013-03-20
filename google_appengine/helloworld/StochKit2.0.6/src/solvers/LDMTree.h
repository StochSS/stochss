#ifndef _LDM_TREE_H_
#define _LDM_TREE_H_

#include <cstdlib>
#include <iostream>
#include <sstream>
#include <vector>
#include <stack>
#include <cassert>
#include <string>
#include <utility>
#include <list>

namespace STOCHKIT
{
 class LDMTree
 {
 public:
  class LDMTreeNode
  {
  public:
    LDMTreeNode();
    
    double sum;
    double propensity;
    int postOrderTraversalIndex;
    int parentIndex;
    int leftChildIndex;
    int rightChildIndex;
    bool leaf;
    
    void updatePropensity(double newPropensity);
    void updateChildSums(double leftSum, double rightSum);
    
  };

  LDMTree();
  LDMTree(int size);
  typedef LDMTreeNode node;
  std::vector<node> tree;
  
  void build(std::vector<double> &propensities);
  void updateTree(const std::vector<std::size_t> &postOrderIndexes, const std::vector<double> &propensities);

  void updateNode(std::size_t index);
  std::vector<std::size_t> sortPostOrder(const std::vector<std::size_t> &unorderedIndexes);
  std::size_t selectReactionIndex(double uniformRandomZeroOne);
  void printTree();

  void updatePropensity(std::size_t index, double newPropensity);

  LDMTreeNode& operator[](std::size_t index);
  
 };
}

#endif

