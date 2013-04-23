// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.info;

import com.google.appengine.tools.util.ApiVersionFinder;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Collection;
import java.util.Set;
import java.util.HashSet;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * {@code LocalVersionFactory} generates {@link Version} objects
 * that represents the release information for the SDK that is
 * currently running.
 *
 */
public class LocalVersionFactory {
  private static final Logger logger =
      Logger.getLogger(LocalVersionFactory.class.getName());

  private final Collection<File> apiJars;
  private final ApiVersionFinder versionFinder;

  public LocalVersionFactory(Collection<File> apiJars) {
    this.apiJars = apiJars;
    this.versionFinder = new ApiVersionFinder();
  }

  public Version getVersion() {
    Package toolsPackage = LocalVersionFactory.class.getPackage();
    if (toolsPackage == null) {
      return Version.UNKNOWN;
    }

    String release = toolsPackage.getSpecificationVersion();
    Date timestamp = convertToDate(toolsPackage.getImplementationVersion());

    Set<String> apiVersions = new HashSet<String>();
    for (File apiJar : apiJars) {
      try {
        String apiVersion = versionFinder.findApiVersion(apiJar);
        if (apiVersion != null) {
          apiVersions.add(apiVersion);
        }
      } catch (IOException ex) {
        logger.log(Level.FINE, "Could not find API version from " + apiJar, ex);
      }
    }

    return new Version(release, timestamp, apiVersions);
  }

  private Date convertToDate(String timestamp) {
    if (timestamp == null) {
      return null;
    } else {
      return new Date(Long.valueOf(timestamp) * 1000);
    }
  }
}
