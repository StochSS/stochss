// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.info.SdkInfo;

import java.util.ServiceLoader;

/**
 * helper to load a {@link ContainerService} instance
 *
 */
public class ContainerUtils {
  /**
   * Load a {@link ContainerService} instance based on the implementation
   * located by the {@code ServiceLoader}.
   * 
   * When more than one implementations are found, an
   * <code>IllegalArgumentException</code> will be thrown. In other words,
   * only one {@link ContainerService} implementation should be packaged and
   * deployed.
   * 
   * To ease debugging/testing (e.g. from IDE), an internal system property is
   * defined to explicitly specify a required container service provider, such
   * as -Ddevappserver.container=OpenGSEContainerService.
   * 
   * Classpath resource(s) that match
   * META-INF/services/com.google.appengine.tools.development.ContainerService
   * are used to resolve the ContainerService implementations.
   * 
   * If using an IDE, create a package/directory called META-INF/services/ and
   * add a text file with the name
   * "com.google.appengine.tools.development.ContainerService" containing one
   * line - the implementation class (some IDEs have a resource pattern that
   * is used to determine which files are added to the runtime classpath. If
   * your implementation class isn't being recognized, adjusting this pattern
   * to include the text file may help.
   * 
   * 
   * @return the deployed {@link ContainerService} instance.
   * @throws IllegalArgumentException if {@code ServiceLoader} fails to find
   *         any {@link ContainerService} implementation or more than one
   *         {@link ContainerService} implementations are available.
   */
  public static ContainerService loadContainer() {
    String containerClazz = System.getProperty("devappserver.container");
    ContainerService result = null;
    for (ContainerService container : ServiceLoader.load(ContainerService.class,
        DevAppServerImpl.class.getClassLoader())) {
      if (containerClazz == null || containerClazz.length() == 0) {
        if (result == null) {
          result = container;
        } else {
          System.err.println("Warning: Found more than one servlet container provider: "
              + result.getClass() + ", " + container.getClass()
              + ". And the first one will be used!");
          break;
        }
      } else {
        if (container.getClass().getName().endsWith(containerClazz)) {
          result = container;
          break;
        }
      }
    }
    if (result == null) {
      throw new IllegalArgumentException("Cannot load any servlet container.");
    }
    return result;
  }

  /**
   * @return the server info string with the dev-appserver version
   */
  public static String getServerInfo() {
    return "Google App Engine Development/" + SdkInfo.getLocalVersion().getRelease();
  }
}