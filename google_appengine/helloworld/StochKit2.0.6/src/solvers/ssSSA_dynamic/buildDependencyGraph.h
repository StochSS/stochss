#ifndef _BUILD_DEPENDENCY_GRAPH_H_
#define _BUILD_DEPENDENCY_GRAPH_H_

#include "ElementaryReaction.h"
#include <algorithm>

std::vector<std::vector<std::size_t> > buildDependencyGraph(std::vector<ElementaryReaction> reactions);

#endif
