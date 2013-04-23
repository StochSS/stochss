// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

/**
 * A class that simply forwards {@link QueryResult} methods to one delegate
 * and forwards {@link List} to another.
 *
 * @param <T> the type of result returned by the query
 *
 */
class QueryResultListDelegator<T> implements QueryResultList<T> {

  private final QueryResult queryResultDelegate;
  private final List<T> listDelegate;

  public QueryResultListDelegator(QueryResult queryResultDelegate,
                                  List<T> listDelegate) {
    this.queryResultDelegate = queryResultDelegate;
    this.listDelegate = listDelegate;
  }

  @Override
  public List<Index> getIndexList() {
    return queryResultDelegate.getIndexList();
  }

  @Override
  public Cursor getCursor() {
    return queryResultDelegate.getCursor();
  }

  @Override
  public int size() {
    return listDelegate.size();
  }

  @Override
  public boolean isEmpty() {
    return listDelegate.isEmpty();
  }

  @Override
  public boolean contains(Object o) {
    return listDelegate.contains(o);
  }

  @Override
  public Iterator<T> iterator() {
    return listDelegate.iterator();
  }

  @Override
  public Object[] toArray() {
    return listDelegate.toArray();
  }

  @Override
  public <T> T[] toArray(T[] ts) {
    return listDelegate.toArray(ts);
  }

  @Override
  public boolean add(T t) {
    return listDelegate.add(t);
  }

  @Override
  public boolean remove(Object o) {
    return listDelegate.remove(o);
  }

  @Override
  public boolean containsAll(Collection<?> objects) {
    return listDelegate.containsAll(objects);
  }

  @Override
  public boolean addAll(Collection<? extends T> ts) {
    return listDelegate.addAll(ts);
  }

  @Override
  public boolean addAll(int i, Collection<? extends T> ts) {
    return listDelegate.addAll(i, ts);
  }

  @Override
  public boolean removeAll(Collection<?> objects) {
    return listDelegate.removeAll(objects);
  }

  @Override
  public boolean retainAll(Collection<?> objects) {
    return listDelegate.retainAll(objects);
  }

  @Override
  public void clear() {
    listDelegate.clear();
  }

  @Override
  public boolean equals(Object o) {
    return listDelegate.equals(o);
  }

  @Override
  public int hashCode() {
    return listDelegate.hashCode();
  }

  @Override
  public T get(int i) {
    return listDelegate.get(i);
  }

  @Override
  public T set(int i, T t) {
    return listDelegate.set(i, t);
  }

  @Override
  public void add(int i, T t) {
    listDelegate.add(i, t);
  }

  @Override
  public T remove(int i) {
    return listDelegate.remove(i);
  }

  @Override
  public int indexOf(Object o) {
    return listDelegate.indexOf(o);
  }

  @Override
  public int lastIndexOf(Object o) {
    return listDelegate.lastIndexOf(o);
  }

  @Override
  public ListIterator<T> listIterator() {
    return listDelegate.listIterator();
  }

  @Override
  public ListIterator<T> listIterator(int i) {
    return listDelegate.listIterator(i);
  }

  @Override
  public List<T> subList(int i, int i1) {
    return listDelegate.subList(i, i1);
  }

  @Override
  public String toString() {
    return listDelegate.toString();
  }
}
