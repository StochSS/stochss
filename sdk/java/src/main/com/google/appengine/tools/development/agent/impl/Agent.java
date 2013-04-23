// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import java.util.Set;

/**
 * The Agent implementation intended for use by
 * {@link com.google.appengine.tools.development.agent.runtime.Runtime Runtime}.
 *
 */
public interface Agent {

  /**
   * Returns the blacklist.
   */
  Set<String> getBlackList();

  /**
   * Records {@code loader} as a ClassLoader created by the application. This
   * aids the agent in distinguishing between application ClassLoaders and
   * implementation ClassLoaders.
   */
  void recordAppClassLoader(ClassLoader loader);
}
