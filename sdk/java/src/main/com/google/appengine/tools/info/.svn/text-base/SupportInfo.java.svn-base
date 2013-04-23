// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.info;

import java.util.List;
import java.util.Arrays;

/**
 * Provides support information for the SDK.
 *
 */
public class SupportInfo {

  private static final List<String> systemProperties = Arrays.asList(
      "java.vm.vendor",
      "java.vm.version",
      "java.version",
      "os.name",
      "os.version"
  );

  private static final String newLine = System.getProperty("line.separator");

  private SupportInfo() {
  }

  /**
   * Returns version information that is useful in terms of support.
   * This includes information about the JVM, operating system, and the SDK.
   *
   * @return a non {@code null} value.
   */
  public static String getVersionString() {
    Version sdkVersion = SdkInfo.getLocalVersion();
    StringBuffer versionString = new StringBuffer();

    versionString.append(sdkVersion.toString());
    versionString.append(newLine);

    for (String property : systemProperties) {
      versionString.append(property);
      versionString.append(": ");
      versionString.append(System.getProperty(property));
      versionString.append(newLine);
    }

    return versionString.toString();
  }
}
