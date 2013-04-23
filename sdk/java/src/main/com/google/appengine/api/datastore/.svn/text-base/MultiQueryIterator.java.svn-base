// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import com.google.appengine.api.datastore.MultiQueryComponent.Order;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.common.collect.Lists;
import com.google.common.collect.Queues;

import java.util.ArrayList;
import java.util.Deque;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * This class constructs lists of filters as defined by the components as needed.
 *
 * It uses both recursive and local stack algorithms so it can save it's
 * position in the query construction algorithm between calls to next.
 *
 */
class MultiQueryIterator implements Iterator<List<List<FilterPredicate>>> {
  private final List<MultiQueryComponent> components;
  private final List<Integer> componentSubIndex;
  private final Deque<List<FilterPredicate>> filtersStack = Queues.newArrayDeque();
  private int componentIndex = 0;
  private int parallelCount = 0;

  private boolean moreResults = true;

  public MultiQueryIterator(List<FilterPredicate> baseFilters,
      List<MultiQueryComponent> components) {
    this.components = components;
    filtersStack.push(baseFilters);

    componentSubIndex = new ArrayList<Integer>(components.size());
    for (MultiQueryComponent component : components) {
      componentSubIndex.add(0);
    }
  }

  /**
   * Pushes a components filters onto the stack. The stack is cumulative so all
   * filters added to the stack exist in the top element of the stack.
   *
   * @param componentFilters the filters to add to the stack
   */
  private void pushFilters(List<FilterPredicate> componentFilters) {
    List<FilterPredicate> baseFilters = filtersStack.peek();
    List<FilterPredicate> filters =
        new ArrayList<FilterPredicate>(baseFilters.size() + componentFilters.size());
    filters.addAll(baseFilters);
    filters.addAll(componentFilters);
    filtersStack.push(filters);
  }

  /**
   * This function updates {@link #componentIndex} to point to the next combination
   * of serial component filters
   *
   * @return false if the next combination has looped back to the first combination
   */
  private boolean advanceSerialComponents() {
    for (int i = components.size() - 1; i >= 0; --i) {
      MultiQueryComponent component = components.get(i);
      if (component.getOrder() != Order.PARALLEL) {
        boolean isLastFilter = componentSubIndex.get(i) + 1 == component.getFilters().size();
        if (isLastFilter) {
          componentSubIndex.set(i, 0);
        } else {
          componentSubIndex.set(i, componentSubIndex.get(i) + 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * The function accumulates a set of queries that are intended to be run in
   * parallel.
   *
   * @param result the list new filters lists are added to
   * @param minIndex the index to stop at when looking for more results
   */
  private void buildNextResult(List<List<FilterPredicate>> result, int minIndex) {
    while (componentIndex >= minIndex) {
      if (componentIndex >= components.size()) {
        result.add(filtersStack.peek());
        --componentIndex;
        continue;
      }

      MultiQueryComponent component = components.get(componentIndex);
      if (component.getOrder() == Order.PARALLEL) {
        ++parallelCount;
        ++componentIndex;
        for (List<FilterPredicate> componentFilters : component.getFilters()) {
          pushFilters(componentFilters);
          buildNextResult(result, componentIndex);
          filtersStack.pop();
        }
        --parallelCount;
        componentIndex -= 2;
      } else {
        if (filtersStack.size() <= componentIndex + 1) {
          pushFilters(component.getFilters().get(componentSubIndex.get(componentIndex)));
          ++componentIndex;
        } else {
          filtersStack.pop();
          boolean isLastFilter =
              componentSubIndex.get(componentIndex) + 1 == component.getFilters().size();
          --componentIndex;
          if ((parallelCount == 0) && !isLastFilter) {
            break;
          }
        }
      }
    }
    ++componentIndex;
  }

  @Override
  public boolean hasNext() {
    return moreResults;
  }

  @Override
  public List<List<FilterPredicate>> next() {
    if (!moreResults) {
      throw new NoSuchElementException();
    }
    List<List<FilterPredicate>> result = Lists.newArrayList();
    buildNextResult(result, 0);
    moreResults = advanceSerialComponents();
    return result;
  }

  @Override
  public void remove() {
    throw new UnsupportedOperationException();
  }
}
