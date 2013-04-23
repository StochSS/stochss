// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.info.SdkImplInfo;
import com.google.appengine.tools.info.SdkInfo;
import com.google.appengine.tools.plugins.SharedConstants;
import com.google.apphosting.utils.io.IoUtil;

import sun.security.util.SecurityConstants;

import java.io.File;
import java.io.FilePermission;
import java.io.IOException;
import java.lang.reflect.ReflectPermission;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.net.URLConnection;
import java.security.AccessController;
import java.security.AllPermission;
import java.security.CodeSource;
import java.security.Permission;
import java.security.PermissionCollection;
import java.security.Permissions;
import java.security.Policy;
import java.security.PrivilegedAction;
import java.security.ProtectionDomain;
import java.security.Provider;
import java.security.SecurityPermission;
import java.security.UnresolvedPermission;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.PropertyPermission;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.LoggingPermission;

/**
 * A webapp {@code ClassLoader}. This {@code ClassLoader} isolates
 * webapps from the {@link DevAppServer} and anything else
 * that might happen to be on the system classpath.
 * It also grants the appropriate security permissions to the
 * webapp classes that it loads.
 *
 */
public class IsolatedAppClassLoader extends URLClassLoader {

  private static Logger logger = Logger.getLogger(IsolatedAppClassLoader.class.getName());

  private static final String DEV_APP_SERVER_AGENT
  = "com.google.appengine.tools.development.agent.AppEngineDevAgent";

  private final PermissionCollection appPermissions;
  private final Permissions appPermissionsAsPermissions;
  private final ClassLoader devAppServerClassLoader;
  private final Set<URL> sharedCodeLibs;
  private final Set<URL> agentRuntimeLibs;

  public IsolatedAppClassLoader(File appRoot, File externalResourceDir, URL[] urls,
      ClassLoader devAppServerClassLoader) {
    super(urls, null);
    checkWorkingDirectory(appRoot, externalResourceDir);
    boolean allowWrites = inApplicationPreparationMode();
    appPermissions = createAppPermissions(appRoot, externalResourceDir, allowWrites);
    appPermissionsAsPermissions = new Permissions();
    addAllPermissions(appPermissions, appPermissionsAsPermissions);
    installPolicyProxy(appRoot);
    this.devAppServerClassLoader = devAppServerClassLoader;
    this.sharedCodeLibs = new HashSet<URL>(SdkInfo.getSharedLibs());
    this.agentRuntimeLibs = new HashSet<URL>(SdkImplInfo.getAgentRuntimeLibs());
  }

  /**
   * Issues a warning if the current working directory != {@code appRoot},
   * or {@code externalResourceDir}.
   *
   * The working directory of remotely deployed apps always == appRoot.
   * For DevAppServer, We don't currently force users to set their working
   * directory equal to the appRoot. We also don't set it for them
   * (due to extent ramifications). The best we can do at the moment is to
   * warn them that they may experience permission problems in production
   * if they access files in a working directory != appRoot.
   *
   * If we are using an external resource directory, then it is also fine
   * for the working directory to point there.
   *
   * @param appRoot
   */
  private static void checkWorkingDirectory(File appRoot, File externalResourceDir) {
    File workingDir = new File(System.getProperty("user.dir"));

    String canonicalWorkingDir = null;
    String canonicalAppRoot = null;
    String canonicalExternalResourceDir = null;

    try {
      canonicalWorkingDir = workingDir.getCanonicalPath();
      canonicalAppRoot = appRoot.getCanonicalPath();
      if (externalResourceDir != null) {
        canonicalExternalResourceDir = externalResourceDir.getCanonicalPath();
      }
    } catch (IOException e) {
      logger.log(Level.FINE, "Unable to compare the working directory and app root.", e);
    }

    if (canonicalWorkingDir != null && !canonicalWorkingDir.equals(canonicalAppRoot)) {
      if (canonicalExternalResourceDir != null
          && canonicalWorkingDir.equals(canonicalExternalResourceDir)) {
        return;
      }
      String newLine = System.getProperty("line.separator");
      String workDir = workingDir.getAbsolutePath();
      String appDir = appRoot.getAbsolutePath();
      String msg = "Your working directory, (" + workDir + ") is not equal to your " + newLine
          + "web application root (" + appDir + ")" + newLine
          + "You will not be able to access files from your working directory on the "
          + "production server." + newLine;
      logger.warning(msg);
    }
  }

  private static boolean inApplicationPreparationMode() {
    boolean inMode = Boolean.valueOf(
        System.getProperty(SharedConstants.APPLICATION_PREPARATION_MODE_SYSTEM_PROPERTY));
    if (inMode) {
      String newLine = System.getProperty("line.separator");
      String msg = newLine + "** Running in application-preparation mode. **." + newLine
          + "** Code will be allowed to write to you application "
          + "directory while running locally. **" + newLine
          + "** But writing will not be allowed when " + "your code is uploaded to App Engine! **"
          + newLine;
      logger.warning(msg);
    }
    return inMode;
  }

  @Override
  public URL getResource(String name) {
    URL resource = devAppServerClassLoader.getResource(name);
    if (resource != null) {
      if (resource.getProtocol().equals("jar")) {
        int bang = resource.getPath().indexOf('!');
        if (bang > 0) {
          try {
            URL url = new URL(resource.getPath().substring(0, bang));
            if (sharedCodeLibs.contains(url)) {
              return resource;
            }
          } catch (MalformedURLException ex) {
            logger.log(Level.WARNING, "Unexpected exception while loading " + name, ex);
          }
        }
      }
    }
    return super.getResource(name);
  }

  @Override
  protected synchronized Class<?> loadClass(String name, boolean resolve)
      throws ClassNotFoundException {

    try {
      final Class<?> c = devAppServerClassLoader.loadClass(name);

      CodeSource source = AccessController.doPrivileged(
          new PrivilegedAction<CodeSource>() {
            @Override
            public CodeSource run() {
              return c.getProtectionDomain().getCodeSource();
            }
          });

      if (source == null) {
        return c;
      }

      URL location = source.getLocation();
      if (sharedCodeLibs.contains(location) ||
          location.getFile().endsWith("/appengine-agent.jar")
          || name.equals(DEV_APP_SERVER_AGENT)) {
        if (resolve) {
          resolveClass(c);
        }
        return c;
      }
    } catch (ClassNotFoundException e) {
    }

    return super.loadClass(name, resolve);
  }

  @Override
  protected PermissionCollection getPermissions(CodeSource codesource) {
    PermissionCollection permissions = super.getPermissions(codesource);
    if (agentRuntimeLibs.contains(codesource.getLocation())) {
      permissions.add(new AllPermission());
    } else {
      addAllPermissions(appPermissions, permissions);
    }
    return permissions;
  }

  public Permissions getAppPermissions() {
    return appPermissionsAsPermissions;
  }

  private PermissionCollection createAppPermissions(
      File appRoot, File externalResourceDir, boolean allowWriteAccess) {
    PermissionCollection permissions = new Permissions();
    addAllPermissions(buildPermissionsToAccessAppFiles(appRoot, allowWriteAccess), permissions);
    if (externalResourceDir != null) {
      addAllPermissions(
          buildPermissionsToAccessAppFiles(externalResourceDir, allowWriteAccess), permissions);
    }

    if (Boolean.valueOf(System.getProperty("--enable_all_permissions"))) {
      permissions.add(new AllPermission());
      return permissions;
    }

    permissions.add(new RuntimePermission("getClassLoader"));
    permissions.add(new RuntimePermission("setContextClassLoader"));
    permissions.add(new RuntimePermission("createClassLoader"));
    permissions.add(new RuntimePermission("getProtectionDomain"));
    permissions.add(new RuntimePermission("accessDeclaredMembers"));
    permissions.add(new ReflectPermission("suppressAccessChecks"));
    permissions.add(new LoggingPermission("control", ""));
    permissions.add(new RuntimePermission("getStackTrace"));
    permissions.add(new RuntimePermission("getenv.*"));
    permissions.add(new RuntimePermission("setIO"));
    permissions.add(new PropertyPermission("*", "read,write"));

    permissions.add(new
        RuntimePermission("accessClassInPackage.com.sun.xml.internal.ws.*"));

    permissions.add(new RuntimePermission("loadLibrary.keychain"));

    permissions.add(new UnresolvedPermission("javax.jdo.spi.JDOPermission", "getMetadata", null,
        null));
    permissions.add(new UnresolvedPermission("javax.jdo.spi.JDOPermission", "setStateManager", null,
        null));
    permissions.add(new UnresolvedPermission("javax.jdo.spi.JDOPermission", "manageMetadata", null,
        null));
    permissions.add(new UnresolvedPermission("javax.jdo.spi.JDOPermission",
        "closePersistenceManagerFactory", null, null));

    permissions.add(new UnresolvedPermission("groovy.security.GroovyCodeSourcePermission", "*",
        null, null));

    permissions.add(new FilePermission(System.getProperty("user.dir") + File.separatorChar + "-",
        SecurityConstants.FILE_READ_ACTION));

    permissions.add(getJreReadPermission());

    for (File f : SdkInfo.getSharedLibFiles()) {
      permissions.add(new FilePermission(f.getAbsolutePath(), SecurityConstants.FILE_READ_ACTION));
    }

    permissions.add(new SecurityPermission("putProviderProperty.*"));
    permissions.add(new SecurityPermission("insertProvider.*"));
    permissions.add(new SecurityPermission("removeProvider.*"));

    permissions.add(new SecurityPermission("getProperty.ssl.KeyManagerFactory.algorithm"));

    permissions.setReadOnly();

    return permissions;
  }

  /**
   * This is a terrible hack so that we can get Jasper to grant JSPs
   * the permissions they need (since JasperLoader is not configurable
   * in terms of the permissions it grants). We know that JspRuntimeContext
   * uses the permissions returned from Policy.getPermissions() on the
   * codeSource for the path of the webapp context.
   */
  private void installPolicyProxy(File appRoot) {

    Policy p = Policy.getPolicy();
    if (p instanceof ProxyPolicy) {
      return;
    }
    Policy.setPolicy(new ProxyPolicy(p, appRoot));
  }

  class ProxyPolicy extends Policy {
    private Policy delegate;
    private File appRoot;
    ProxyPolicy(Policy delegate, File appRoot) {
      this.delegate = delegate;
      this.appRoot = appRoot;
    }

    @Override
    public Provider getProvider() {
      return delegate.getProvider();
    }

    @Override
    public String getType() {
      return delegate.getType();
    }

    @Override
    public Parameters getParameters() {
      return delegate.getParameters();
    }

    @Override
    public PermissionCollection getPermissions(final CodeSource codeSource) {
      return AccessController.doPrivileged(new PrivilegedAction<PermissionCollection>() {
        @SuppressWarnings({"deprecation"})
        @Override
        public PermissionCollection run() {
          PermissionCollection delegatePerms = delegate.getPermissions(codeSource);

          try {
            if (appRoot.toURL().equals(codeSource.getLocation())) {
              Permissions newPerms = new Permissions();
              addAllPermissions(delegatePerms, newPerms);
              addAllPermissions(appPermissions, newPerms);
              return newPerms;
            }
          } catch (MalformedURLException ex) {
            throw new RuntimeException("Could not turn " + appRoot + "into a URL", ex);
          }
          return delegatePerms;
        }
      });
    }

    @Override
    public PermissionCollection getPermissions(ProtectionDomain domain) {
      return getPermissions(domain.getCodeSource());
    }

    @Override
    public boolean implies(final ProtectionDomain domain, final Permission permission) {
      return AccessController.doPrivileged(new PrivilegedAction<Boolean>(){
        @Override
        public Boolean run() {
          return delegate.implies(domain, permission);
        }
      });
    }

    @Override
    public void refresh() {
      delegate.refresh();
    }
  }

  private static PermissionCollection buildPermissionsToAccessAppFiles(
      File contextRoot, boolean allowWrites) {
    PermissionCollection permissions = new Permissions();
    addPermissionsToAccessAppFiles(permissions, contextRoot, allowWrites);

    List<File> allFiles = IoUtil.getFilesAndDirectories(contextRoot);

    for (File file : allFiles) {
      addPermissionsToAccessAppFiles(permissions, file, allowWrites);
    }

    permissions.setReadOnly();
    return permissions;
  }

  private static void addPermissionsToAccessAppFiles(
      PermissionCollection permissions, File fileOrDirectory, boolean allowWrites) {
    String path = fileOrDirectory.getAbsolutePath();
    permissions.add(new FilePermission(path, SecurityConstants.FILE_READ_ACTION));
    permissions.add(new FilePermission(path + "/-", SecurityConstants.FILE_READ_ACTION));
    if (allowWrites) {
      permissions.add(new FilePermission(path, SecurityConstants.FILE_WRITE_ACTION));
      permissions.add(new FilePermission(path, SecurityConstants.FILE_DELETE_ACTION));
      permissions.add(new FilePermission(path + "/-", SecurityConstants.FILE_WRITE_ACTION));
      permissions.add(new FilePermission(path + "/-", SecurityConstants.FILE_DELETE_ACTION));
    }
  }

  private static Permission getReadPermission(URL url) {
    Permission p;
    try {
      URLConnection urlConnection = url.openConnection();
      p = urlConnection.getPermission();
    } catch (IOException e) {
      throw new RuntimeException("Unable to obtain the permission for " + url, e);
    }
    return new FilePermission(p.getName(), SecurityConstants.FILE_READ_ACTION);
  }

  private static Permission getJreReadPermission() {
    return getReadPermission(Object.class.getResource("/java/lang/Object.class"));
  }

  /**
   * Utility method that adds the contents of one permission collection (the
   * source) into another permission collection (the dest).
   */
  private static void addAllPermissions(PermissionCollection src, PermissionCollection dest) {
    Enumeration<Permission> srcElements = src.elements();
    while (srcElements.hasMoreElements()) {
      dest.add(srcElements.nextElement());
    }
  }
}
