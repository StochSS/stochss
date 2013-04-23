// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.util;

import java.io.File;
import java.io.IOException;
import java.util.jar.JarFile;
import java.util.jar.Manifest;
import java.util.jar.Attributes;

/**
 * {@code ApiVersionFinder} extracts the {@code Specification-Version}
 * from the Jar manifest of the specified jar file.
 *
 */
public class ApiVersionFinder {
  private static final String DESIRED_VENDOR_ID = "com.google";
  private static final String API_PACKAGE_NAME = "com/google/appengine/api/";

  public static void main(String[] args) throws IOException {
    ApiVersionFinder finder = new ApiVersionFinder();
    String apiVersion = finder.findApiVersion(args[0]);
    if (apiVersion == null) {
      System.exit(1);
    }

    System.out.println(apiVersion);
    System.exit(0);
  }

  public String findApiVersion(String fileName) throws IOException {
    return findApiVersion(new File(fileName));
  }

  public String findApiVersion(File inputJar) throws IOException {
    JarFile jarFile = new JarFile(inputJar);
    try {
      Manifest manifest = jarFile.getManifest();

      if (manifest != null) {
        Attributes attr = manifest.getAttributes(API_PACKAGE_NAME);
        if (attr != null) {
          String vendorId = attr.getValue(Attributes.Name.IMPLEMENTATION_VENDOR_ID);
          if (!DESIRED_VENDOR_ID.equals(vendorId)) {
            return null;
          }

          return attr.getValue(Attributes.Name.SPECIFICATION_VERSION);
        }
      }
      return null;
    } finally {
      try {
        jarFile.close();
      } catch (IOException ex) {
      }
    }
  }
}
