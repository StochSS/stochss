// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * {@link UserCodeClasspathManager} that derives the classpath from a WEB-INF
 * directory relative to the application's root.
 *
 */
class WebAppUserCodeClasspathManager implements UserCodeClasspathManager {

  private static final Logger log =
      Logger.getLogger(WebAppUserCodeClasspathManager.class.getName());

  @Override
  public Collection<URL> getUserCodeClasspath(File root) {
    List<URL> appUrls = new ArrayList<URL>();
    try {
      File classes = new File(new File(root, "WEB-INF"), "classes");
      if (classes.exists()) {
        appUrls.add(classes.toURI().toURL());
      }
    } catch (MalformedURLException ex) {
      log.log(Level.WARNING, "Could not add WEB-INF/classes", ex);
    }

    File libDir = new File(new File(root, "WEB-INF"), "lib");
    if (libDir.isDirectory()) {
      for (File file : libDir.listFiles()) {
        try {
          appUrls.add(file.toURI().toURL());
        } catch (MalformedURLException ex) {
          log.log(Level.WARNING, "Could not get URL for file: " + file, ex);
        }
      }
    }
    return appUrls;
  }

  @Override
  public boolean requiresWebInf() {
    return true;
  }
}
