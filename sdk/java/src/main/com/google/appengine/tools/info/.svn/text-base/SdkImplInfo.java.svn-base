// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.info;

import java.io.File;
import java.net.URL;
import java.util.Collections;
import java.util.List;

/**
 * Contains implementation information about the SDK.
 * <p>
 * Although this class is public, it is not intended for public consumption.
 *
 */
public class SdkImplInfo {

  private static List<File> allLibFiles = Collections.unmodifiableList(
      SdkInfo.getLibsRecursive(SdkInfo.getSdkRoot(), ""));

  private static List<File> implLibFiles = Collections.unmodifiableList(
      SdkInfo.getLibs(SdkInfo.getSdkRoot(), "impl"));
  private static List<URL> implLibs = Collections.unmodifiableList(
      SdkInfo.toURLs(implLibFiles));

  private static List<File> agentRuntimeLibFiles = Collections.unmodifiableList(
      SdkInfo.getLibsRecursive(SdkInfo.getSdkRoot(), "impl/agent"));
  private static List<URL> agentRuntimeLibs = Collections.unmodifiableList(
      SdkInfo.toURLs(agentRuntimeLibFiles));

  private static List<URL> toolOrmUrls;

  private static List<File> userJspLibFiles = Collections.unmodifiableList(
      SdkInfo.getLibsRecursive(SdkInfo.getSdkRoot(), "tools/jsp"));
  private static List<URL> userJspLibs = Collections.unmodifiableList(
      SdkInfo.toURLs(userJspLibFiles));

  private static List<File> sharedJspLibFiles = Collections.unmodifiableList(
      SdkInfo.getLibsRecursive(SdkInfo.getSdkRoot(), "shared/jsp"));
  private static List<URL> sharedJspLibs = Collections.unmodifiableList(
      SdkInfo.toURLs(sharedJspLibFiles));

  private static List<File> webApiToolLibFiles = Collections.unmodifiableList(
      SdkInfo.getLibsRecursive(SdkInfo.getSdkRoot(), "opt/tools/appengine-local-endpoints/v1"));
  private static List<URL> webApiToolLibs = Collections.unmodifiableList(
      SdkInfo.toURLs(webApiToolLibFiles));

  /**
   * @deprecated Call {@code SdkInfo.getOptionalToolsLib("datanucleus")}
   * instead.
   */
  @Deprecated
  public static List<URL> getOrmToolLibs() {
    if (toolOrmUrls == null) {
      List<File> toolOrmFiles = Collections.unmodifiableList(
          SdkInfo.getLibsRecursive(SdkInfo.getSdkRoot(), "tools/orm"));
      toolOrmUrls = Collections.unmodifiableList(
          SdkInfo.toURLs(toolOrmFiles));
    }
    return toolOrmUrls;
  }

  /**
   * Returns the full paths of all java agent runtime libraries for the SDK.
   */
  public static List<URL> getAgentRuntimeLibs() {
    return agentRuntimeLibs;
  }

  /**
   * Returns the full paths of all implementation libraries for the SDK.
   */
  public static List<URL> getImplLibs() {
    return implLibs;
  }

  /**
   * Returns the full paths of all JSP libraries that do not need any
   * special privileges in the SDK.
   */
  public static List<URL> getUserJspLibs() {
    return userJspLibs;
  }

  /**
   * Returns the paths of all JSP libraries that do not need any
   * special privileges in the SDK.
   */
  public static List<File> getUserJspLibFiles() {
    return userJspLibFiles;
  }

  /**
   * Returns the full paths of all JSP libraries that need to be
   * treated as shared libraries in the SDK.
   */
  public static List<URL> getSharedJspLibs() {
    return sharedJspLibs;
  }

  /**
   * Returns the paths of all JSP libraries that need to be treated as
   * shared libraries in the SDK.
   */
  public static List<File> getSharedJspLibFiles() {
    return sharedJspLibFiles;
  }

  public static List<URL> getWebApiToolLibs() {
    return webApiToolLibs;
  }

  /**
   * Returns the File containing the SDK logging properties.
   */
  public static File getLoggingProperties() {
    return new File(SdkInfo.getSdkRoot() + File.separator + "config" + File.separator +
        "sdk" + File.separator + "logging.properties");
  }

  /**
   * Returns the URL to the tools API jar.
   */
  public static URL getToolsApiJar() {
    File f = new File(SdkInfo.getSdkRoot() + File.separator + "lib" + File.separator
        + "appengine-tools-api.jar");
    return SdkInfo.toURL(f);
  }

  /**
   * Returns all jar files under the lib directory.
   */
  public static List<File> getAllLibFiles() {
    return allLibFiles;
  }
}
