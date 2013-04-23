// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.compilation;

import com.google.common.base.Joiner;
import com.google.common.base.Preconditions;
import com.google.common.base.Splitter;
import com.google.common.collect.LinkedHashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

/**
 * Helper that keeps track of the callbacks we encounter and writes them out in
 * the appropriate format.
 *
 * @see DatastoreCallbacksProcessor
 *
 */
class DatastoreCallbacksConfigWriter {

  static final String INCORRECT_FORMAT_MESSAGE = "Existing config file has incorrect "
      + "format version. Please do a clean rebuild of your application.";

  /**
   * Property that stores the format version of the individual entries.  This
   * property is not a valid callback key, so there is no risk of a collision with
   * real data.
   */
  static final String FORMAT_VERSION_PROPERTY = "DatastoreCallbacksFormatVersion";

  /**
   * Right now we only have one format version, so we can hardcode this.
   */
  private static final String FORMAT_VERSION = Integer.valueOf(1).toString();

  /**
   * Key is the kind (possibly the empty string), value is a {@link Map} where
   * the key is the callback type and the value is a {@link List} of
   * {@link String Strings}, each of which uniquely identifies a method that
   * implements the callback for the kind and callback type.  Each of these
   * Strings is of the form fqn:method_name.  We're not using a LinkedHashMap
   * to make the iteration order deterministic because we're using
   * {@link Properties} to write this data to a file, and Properties, unlike
   * LinkedHashMap, does not have a deterministic ordering.
   */
  final Map<String, Multimap<String, String>> callbacks = Maps.newHashMap();

  /**
   * Maps the fully-qualified classnames of all classes with callbacks to the
   * methods on those classes that are callbacks.
   */
  final Multimap<String, String> methodsWithCallbacks = LinkedHashMultimap.create();

  final Properties props = new Properties();

  /**
   * Used to avoid logging about the same pruned class more than once.  This
   * member should not be read until after {@link #store(java.io.OutputStream)}
   * has been called.
   */
  final Set<String> prunedClasses = Sets.newHashSet();

  /**
   * @param inputStream a (possibly {@code null} stream from which we can read
   * an existing config
   */
  DatastoreCallbacksConfigWriter( InputStream inputStream) throws IOException {
    if (inputStream != null) {
      props.loadFromXML(inputStream);
      Preconditions.checkState(
          FORMAT_VERSION.equals(props.remove(FORMAT_VERSION_PROPERTY)), INCORRECT_FORMAT_MESSAGE);
    }
  }

  /**
   * Overwrites the contents of the provided {@link InputStream} (if provided)
   * with the callback config and then stores it to disk.
   */
  public void store(OutputStream outputStream) throws IOException {
    pruneExistingConfig();

    props.setProperty(FORMAT_VERSION_PROPERTY, FORMAT_VERSION);

    for (String kind : callbacks.keySet()) {
      Multimap<String, String> kindMap = callbacks.get(kind);
      for (String callbackType : kindMap.keySet()) {
        String propKey = String.format("%s.%s", kind, callbackType);
        Collection<String> newMethods = kindMap.get(callbackType);
        StringBuilder combinedMethods = new StringBuilder();
        String oldMethods = props.getProperty(propKey);
        if (oldMethods != null) {
          combinedMethods.append(oldMethods).append(",");
        }
        props.setProperty(propKey, Joiner.on(",").appendTo(combinedMethods, newMethods).toString());
      }
    }
    props.storeToXML(outputStream, "Datastore Callbacks. DO NOT EDIT BY HAND!");
  }

  private void pruneExistingConfig() {
    for (String propName : props.stringPropertyNames()) {
      String propVal = props.getProperty(propName);
      List<String> methodsToPreserve = Lists.newArrayList();
      for (String method : Splitter.on(',').split(propVal)) {
        String classStr = method.split(":")[0];
        if (!methodsWithCallbacks.containsKey(classStr) && classExists(classStr)) {
          methodsToPreserve.add(method);
        }
      }
      if (methodsToPreserve.isEmpty()) {
        props.remove(propName);
      } else {
        props.setProperty(propName, Joiner.on(",").join(methodsToPreserve));
      }
    }
  }

  private boolean classExists(String classStr) {
    try {
      Class.forName(classStr);
      return true;
    } catch (ClassNotFoundException e) {
      prunedClasses.add(classStr);
      return false;
    }
  }

  public void addCallback(Set<String> kinds, String callbackType, String cls, String method) {
    String clsMethod = String.format("%s:%s", cls, method);
    if (kinds.isEmpty()) {
      kinds = Collections.singleton("");
    }
    for (String kind : kinds) {
      Multimap<String, String> kindMap = callbacks.get(kind);
      if (kindMap == null) {
        kindMap = LinkedHashMultimap.create();
        callbacks.put(kind, kindMap);
      }
      kindMap.put(callbackType, clsMethod);
    }
    methodsWithCallbacks.put(cls, method);
  }

  @Override
  public String toString() {
    return String.format(
        "Datastore Callbacks: %s\nPruned Classes: %s", callbacks.toString(), prunedClasses);
  }

  public boolean hasCallback(String cls, String method) {
    return methodsWithCallbacks.containsEntry(cls, method);
  }
}
