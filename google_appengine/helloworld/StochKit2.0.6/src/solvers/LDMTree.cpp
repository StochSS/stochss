#include "LDMTree.h"

namespace STOCHKIT
{

LDMTree::LDMTree()
{
}

LDMTree::LDMTree(int size):tree(size) {
}

void LDMTree::build(std::vector<double> &propensities) {
  //go through entire tree, assigning values to nodes

  if (tree[0].sum!=-1.0) {
    //error
    std::cout << "ERROR: LDMTree::build on already built tree" << std::endl;
  }

  std::size_t currentNode=0;
  double leftChildSum=0.0;
  double rightChildSum=0.0;
  std::size_t postOrderIndex=-1;
  std::stack<std::size_t> toProcess;
  
  //start at root, proceed to left-most leaf, do post-order traversal
  toProcess.push(currentNode);

  while (!toProcess.empty()) {
    currentNode=toProcess.top();

    //if we're at a leaf, set values appropriately
    if (currentNode*2+1>=tree.size()) {
      tree[currentNode].leaf=true;
      tree[currentNode].propensity=propensities[currentNode];
      tree[currentNode].sum=propensities[currentNode];
      tree[currentNode].postOrderTraversalIndex=++postOrderIndex;
      tree[currentNode].parentIndex=(currentNode-1)/2;
      toProcess.pop();
    }
    //else, we're not a leaf
    //if our left subtree has not been done yet, do it
    else if (tree[currentNode*2+1].parentIndex==-1) {
      tree[currentNode].leftChildIndex=currentNode*2+1;
      toProcess.push(currentNode*2+1);
    }
    //if our right subtree hasn't been done yet, do it
    else if (currentNode*2+2<tree.size() && tree[currentNode*2+2].parentIndex==-1) {
      tree[currentNode].rightChildIndex=currentNode*2+2;
      toProcess.push(currentNode*2+2);
    }
    else {//currentNode is not a leaf and both subtrees have been done
      tree[currentNode].leaf=false;
      tree[currentNode].propensity=propensities[currentNode];
      leftChildSum=tree[tree[currentNode].leftChildIndex].sum;
      currentNode*2+2<tree.size() ? rightChildSum=tree[tree[currentNode].rightChildIndex].sum : rightChildSum=0.0;
      tree[currentNode].sum=propensities[currentNode]+leftChildSum+rightChildSum;
      tree[currentNode].postOrderTraversalIndex=++postOrderIndex;
      if (currentNode!=0) {
	tree[currentNode].parentIndex=(currentNode-1)/2;
      }
      toProcess.pop();
    } 
  }
}//build

void LDMTree::printTree() {
  for (std::size_t i=0; i!=tree.size(); i++) {
    std::cout << "tree( " << i << ") = " << tree[i].sum << " (sum) and " << tree[i].propensity << " (propensity) " << " (postOrder index=" << tree[i].postOrderTraversalIndex << ")" << std::endl;
  }
}

void LDMTree::updateTree(const std::vector<std::size_t> &postOrderIndexes, const std::vector<double> &propensities)
{
  //assumes the input is in order of a postOrder traversal
  //a lot of work to avoid multiple visits to the same node...probably slower

  if (postOrderIndexes.size()==0) {
    return;
  }

  if (postOrderIndexes.size()!=propensities.size()) {
    std::cout << "ERROR: unequal sizes in updateTree()" << std::endl;
  }
  

  std::stack<int> parentIndexesToUpdate;
  int currentIndex=-1;

  double newPropensity;

  std::size_t tempIndex;

  for (std::size_t i=0; i<postOrderIndexes.size(); ++i) {
    currentIndex=postOrderIndexes[i];
    newPropensity=propensities[i];    
    while (!parentIndexesToUpdate.empty() && parentIndexesToUpdate.top()<currentIndex) {
      tempIndex=parentIndexesToUpdate.top();
      parentIndexesToUpdate.pop();
      updateNode(tempIndex);
      if (tempIndex!=0) {
	if (parentIndexesToUpdate.empty() || parentIndexesToUpdate.top()!=tree[currentIndex].parentIndex) {
	  parentIndexesToUpdate.push(tree[tempIndex].parentIndex);
	}
      }
    }
    
    //if propensity changed and it was a parent of a previous updated propensity, pop it off the stack
    if (!parentIndexesToUpdate.empty() && parentIndexesToUpdate.top()==currentIndex) {
      parentIndexesToUpdate.pop();
    }

    updatePropensity(currentIndex, newPropensity);
    if (currentIndex!=0) {
      if (parentIndexesToUpdate.empty() || parentIndexesToUpdate.top()!=tree[currentIndex].parentIndex) {
	parentIndexesToUpdate.push(tree[currentIndex].parentIndex);
      }
    }

  }
  

  //process remaining parentIndexes
  while(!parentIndexesToUpdate.empty()) {
    tempIndex=parentIndexesToUpdate.top();
    parentIndexesToUpdate.pop();
    updateNode(tempIndex);
    if (tempIndex!=0) {
      if (parentIndexesToUpdate.empty() || parentIndexesToUpdate.top()!=tree[currentIndex].parentIndex) {
	parentIndexesToUpdate.push(tree[tempIndex].parentIndex);
      }
    }
  }
}//updateTree

void LDMTree::updateNode(std::size_t index)
{
  tree[index].sum=0.0;
  if (tree[index].leftChildIndex!=-1) {
    tree[index].sum+=tree[tree[index].leftChildIndex].sum;
  }
  if (tree[index].rightChildIndex!=-1) {
    tree[index].sum+=tree[tree[index].rightChildIndex].sum;
  }
  tree[index].sum+=tree[index].propensity;
}//updateNode

std::vector<std::size_t> LDMTree::sortPostOrder(const std::vector<std::size_t> &unorderedIndexes)
{
  std::vector<std::size_t> postOrderedVector(unorderedIndexes.size());

  if (unorderedIndexes.size()==0) {
    std::cout << "WARNING: trying to sort zero length vector in LDMTree::sortPostOrder (empty row in dependency graph?)" << std::endl;
    return postOrderedVector;
  }

  std::list<std::size_t> mylist;
  std::list<std::size_t>::iterator it;
  
  mylist.push_back(unorderedIndexes[0]);

  for (std::size_t i=1; i<unorderedIndexes.size(); ++i) {
    it=mylist.begin();
    while (it!=mylist.end() && tree[unorderedIndexes[i]].postOrderTraversalIndex > tree[*it].postOrderTraversalIndex) {
      it++;
    }
    mylist.insert(it,unorderedIndexes[i]);
  }

  //copy (the now post order sorted) linked list into the return vector
  int count=0;
  for (it=mylist.begin(); it!=mylist.end(); it++) {
    postOrderedVector[count]=*it;
    count++;
  }
  
  return postOrderedVector;
}

std::size_t LDMTree::selectReactionIndex(double uniformRandomZeroOne)
{
  double r=uniformRandomZeroOne*tree[0].sum;
  double tempSum=0.0;
  
  //start at root
  std::size_t reactionIndex=0;
  
  bool finished=false;
  while (!finished) {
    if (tree[reactionIndex].leaf) {
      return reactionIndex;
    }
    else {
      if (r<tempSum+tree[tree[reactionIndex].leftChildIndex].sum) {
	reactionIndex=tree[reactionIndex].leftChildIndex;
      }
      else {
	if (tree[reactionIndex].rightChildIndex==-1) {
	  return reactionIndex;
	}
	tempSum+=tree[tree[reactionIndex].leftChildIndex].sum;
	if (r<tempSum+tree[tree[reactionIndex].rightChildIndex].sum) {
	  reactionIndex=tree[reactionIndex].rightChildIndex;
	}
	else {
	  return reactionIndex;
	}
	
      }
    }
  }
  //don't expect it to get here...
  return reactionIndex;
}

void LDMTree::updatePropensity(std::size_t index, double newPropensity) {
  double childSum=0.0;
  if (tree[index].leftChildIndex!=-1) {
    childSum+=tree[tree[index].leftChildIndex].sum;
  }
  if (tree[index].rightChildIndex!=-1) {
    childSum+=tree[tree[index].rightChildIndex].sum;
  }
  tree[index].sum=childSum+newPropensity;
  tree[index].propensity=newPropensity;
}

LDMTree::LDMTreeNode& LDMTree::operator[](std::size_t index)
{
  return (tree[index]);
}

LDMTree::LDMTreeNode::LDMTreeNode() : sum(-1),
				      propensity(-1),
				      postOrderTraversalIndex(-1),
				      parentIndex(-1),
				      leftChildIndex(-1),
				      rightChildIndex(-1)
{
}

void LDMTree::LDMTreeNode::updatePropensity(double newPropensity)
{
  sum=sum+newPropensity-propensity;
  propensity=newPropensity;
}

void LDMTree::LDMTreeNode::updateChildSums(double leftSum, double rightSum)
{
  sum=propensity+leftSum+rightSum;
}

}
