// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import org.mortbay.resource.FileResource;
import org.mortbay.resource.Resource;
import org.mortbay.resource.ResourceCollection;

import java.io.File;

/**
 * A {@code Resource} that represents a web root extended to include an external resource directory.
 * <p>
 * We replace Jetty's baseResource with an instance of this class in order to implement our
 * "External Resource Directory" feature.
 *
 */
public class ExtendedRootResource extends ResourceCollection {
  public ExtendedRootResource(Resource webRoot, File externalResourceDir) {
    super(new Resource[] {toResource(externalResourceDir), webRoot});
  }

  private static Resource toResource(File f) {
    if (f == null) {
      throw new NullPointerException("externalResourceDir may not be null");
    }
    try {
      return new FileResource(f.toURI().toURL());
    } catch (Exception e) {
      throw new IllegalArgumentException("Invalid externalResourceDirectory: " + f.getPath(), e);
    }
  }

}
