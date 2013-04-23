// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import java.lang.instrument.Instrumentation;
import java.util.Set;
import java.util.WeakHashMap;

/**
 * Performs the actual agent work.
 *
 */
public class AgentImpl implements Agent {

  static final String AGENT_RUNTIME =
      "com/google/appengine/tools/development/agent/runtime/Runtime";

  private static AgentImpl self = new AgentImpl();

  private WeakHashMap<ClassLoader,Object> appUrlClassLoaders =
      new WeakHashMap<ClassLoader,Object>();

  public void run(Instrumentation instrumentation,
      boolean treatRestrictedClassListViolationsAsErrors) {
    instrumentation.addTransformer(new Transformer(treatRestrictedClassListViolationsAsErrors));
  }

  @Override
  public Set<String> getBlackList() {
    return BlackList.getBlackList();
  }

  @Override
  public void recordAppClassLoader(ClassLoader loader) {
    appUrlClassLoaders.put(loader, null);
  }

  public static AgentImpl getInstance() {
    return self;
  }

  public boolean isAppConstructedURLClassLoader(ClassLoader loader) {
    return appUrlClassLoaders.containsKey(loader);
  }
}
