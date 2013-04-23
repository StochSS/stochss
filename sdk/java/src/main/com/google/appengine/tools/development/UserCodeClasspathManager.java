// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.development;

import java.io.File;
import java.net.URL;
import java.util.Collection;

/**
 * Describes an object that can answer classpath-related questions about an app
 * running in the dev appserver.
 *
 */
public interface UserCodeClasspathManager {

  /**
   * Returns the classpath for the app.
   */
  Collection<URL> getUserCodeClasspath(File root);

  /**
   * {@code true} if a WEB-INF directory must exist, {@code false} otherwise.
   */
  boolean requiresWebInf();
}
