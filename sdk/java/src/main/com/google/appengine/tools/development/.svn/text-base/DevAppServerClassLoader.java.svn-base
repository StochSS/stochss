// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.info.SdkImplInfo;
import com.google.appengine.tools.info.SdkInfo;

import java.net.URL;
import java.net.URLClassLoader;
import java.security.AllPermission;
import java.security.CodeSource;
import java.security.PermissionCollection;
import java.util.ArrayList;
import java.util.List;

/**
 * Isolates the DevAppServer and all of its dependencies into its own classloader.
 * This ClassLoader refuses to load anything off of the JVM's System ClassLoader
 * except for JRE classes (i.e. it ignores classpath and JAR manifest entries).
 *
 */
class DevAppServerClassLoader extends URLClassLoader {

  private final ClassLoader delegate;

  private static final String DEV_APP_SERVER_INTERFACE
      = "com.google.appengine.tools.development.DevAppServer";

  private static final String APP_CONTEXT_INTERFACE
      = "com.google.appengine.tools.development.AppContext";

  private static final String DEV_APP_SERVER_AGENT
      = "com.google.appengine.tools.development.agent.AppEngineDevAgent";

  private static final String DEV_SOCKET_IMPL_FACTORY
      = "com.google.appengine.tools.development.DevSocketImplFactory";

  /**
   * Creates a new {@code DevAppServerClassLoader}, which will load
   * libraries from the App Engine SDK.
   *
   * @param delegate A delegate ClassLoader from which a few shared
   * classes will be loaded (e.g. DevAppServer).
   */
  public static DevAppServerClassLoader newClassLoader(ClassLoader delegate) {
    List<URL> libs = new ArrayList<URL>(SdkInfo.getSharedLibs());
    libs.addAll(SdkImplInfo.getImplLibs());
    libs.addAll(SdkImplInfo.getUserJspLibs());
    return new DevAppServerClassLoader(libs.toArray(new URL[libs.size()]), delegate);
  }

  DevAppServerClassLoader(URL[] urls, ClassLoader delegate) {
    super(urls, null);
    this.delegate = delegate;
  }

  @Override
  protected synchronized Class<?> loadClass(String name, boolean resolve)
      throws ClassNotFoundException {

    if (name.equals(DEV_APP_SERVER_INTERFACE) ||
        name.equals(APP_CONTEXT_INTERFACE) ||
        name.equals(DEV_APP_SERVER_AGENT) ||
        name.equals(DEV_SOCKET_IMPL_FACTORY) ||
        name.startsWith("com.google.appengine.tools.info.") ||
        name.startsWith("com.google.appengine.tools.plugins")) {
      Class<?> c = delegate.loadClass(name);
      if (resolve) {
        resolveClass(c);
      }
      return c;
    }

    return super.loadClass(name, resolve);
  }

  @Override
  protected PermissionCollection getPermissions(CodeSource codesource) {
    PermissionCollection permissions = super.getPermissions(codesource);
    permissions.add(new AllPermission());
    return permissions;
  }
}
