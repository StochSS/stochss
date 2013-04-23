// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.info.SdkInfo;
import com.google.appengine.tools.util.ClientCookieManager;

import java.io.File;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.Collections;
import java.util.Set;

/**
 * Creates a new {@link AppAdmin} for a designated App Engine application.
 *
 */
public class AppAdminFactory {

  private static final String JAVA_CMD_PROP = "appengine.java";
  private static final String JAVAC_CMD_PROP = "appengine.javac";

  private ApplicationProcessingOptions appOptions = new ApplicationProcessingOptions();

  private Class<? extends AppVersionUpload> appVersionUploadClass = AppVersionUpload.class;

  /**
   * Creates a new {@link AppAdmin} that can be used to administer the
   * designated App Engine application.
   *
   * @param options The options used to connect to the remote server. Must not
   *        be {@code null}.
   * @param app The application to be administered. May be {@code null}.
   * @param errorWriter A writer to which error logs can be written. The logs
   *        can be used for diagnosis if a failure occurs during operation. May
   *        be {@code null}.
   * @return a not {@code null} AppAdmin
   */
  public AppAdmin createAppAdmin(ConnectOptions options, Application app, PrintWriter errorWriter) {
    return new AppAdminImpl(options, app, errorWriter, appOptions, appVersionUploadClass);
  }

  /**
   * Creates a new {@link AppAdmin} that can be used to administer the
   * designated App Engine application.
   *
   * @param options The options used to connect to the remote server. Must not
   *        be {@code null}.
   * @param app The application to be administered. May be {@code null}.
   * @param errorWriter A writer to which error logs can be written. The logs
   *        can be used for diagnosis if a failure occurs during operation. May
   *        be {@code null}.
   * @return a not {@code null} AppAdmin
   */
  public AppAdmin createAppAdmin(ConnectOptions options, GenericApplication app,
      PrintWriter errorWriter) {
    return new AppAdminImpl(options, app, errorWriter, appOptions, appVersionUploadClass);
  }

  public ApplicationProcessingOptions getAppOptions() {
    return appOptions;
  }

  public Class<? extends AppVersionUpload> getAppVersionUploadClass() {
    return appVersionUploadClass;
  }

  /**
   * Sets the class used for uploading the application to the server. Should
   * only be used for advanced customization of the upload process.
   */
  public void setAppVersionUploadClass(Class<? extends AppVersionUpload> klass) {
    appVersionUploadClass = klass;
  }

  /**
   * Callback that is invoked to prompt the user to enter a password.
   */
  public interface PasswordPrompt {
    String getPassword();
  }

  /**
   * The options used to connect to the remote App Engine administration server.
   *
   */
  public static class ConnectOptions {

    /**
     * Retrieves the user's email address used to authenticate to the server.
     *
     * @return user identity
     */
    public String getUserId() {
      return userId;
    }

    /**
     * The user id for the App Engine account. This should be the same e-mail
     * address used to register the account owning the App Engine application.
     *
     * @param userId the not {@code null} e-mail address
     */
    public void setUserId(String userId) {
      this.userId = userId;
    }

    /**
     * Retrieves the prompter used to get the user's password.
     *
     * @return the {@link PasswordPrompt} to be used
     */
    public PasswordPrompt getPasswordPrompt() {
      return passwordPrompt;
    }

    /**
     * The password prompt to get the user's password.
     *
     * @param prompt the {@link PasswordPrompt} that's being used
     */
    public void setPasswordPrompt(PasswordPrompt prompt) {
      this.passwordPrompt = prompt;
    }

    /** Returns the server address to connect to. */
    public String getServer() {
      return server;
    }

    /**
     * The remote administration server to connect to. This is an advanced
     * option that should rarely be set by users.
     *
     * @param server May be set to {@code null} to use the default server.
     */
    public void setServer(String server) {
      this.server = server;
    }

    /**
     * Returns the value used for the Host header sent to the server with RPCs.
     *
     * @return hostname to insert into request headers
     */
    public String getHost() {
      return host;
    }

    /**
     * The host name to supply to the remote server. This is an advanced option
     * that should rarely be set by users.
     *
     * @param host May be set to {@code null} to use the default host name.
     */
    public void setHost(String host) {
      this.host = host;
    }

    /**
     * Controls whether we clean up our temporary files, or leave it for
     * debugging.
     */
    public void setRetainUploadDir(boolean flag) {
      this.keepUpload = flag;
    }

    /** Returns {@code true} if the upload directory should not be deleted. */
    public boolean getRetainUploadDir() {
      return keepUpload;
    }

    /** Returns the location of the AppEngine SDK directory. */
    public String getSdkRoot() {
      return sdkRoot;
    }

    /**
     * A file path to the top directory of the Google App Engine SDK.
     *
     * @param sdkRoot the not {@code null} path to the SDK
     */
    public void setSdkRoot(String sdkRoot) {
      this.sdkRoot = sdkRoot;
    }

    /**
     * Retrieves the current cookie manager.
     *
     * @return the cookie manager set with
     *         {@link #setCookies(ClientCookieManager)}.
     */
    public ClientCookieManager getCookies() {
      return cookies;
    }

    /**
     * Associates a {@link ClientCookieManager} to store cookies received from
     * the server, for later reuse in other requests.
     *
     * @param cookies the cookie manager to use
     */
    public void setCookies(ClientCookieManager cookies) {
      this.cookies = cookies;
    }

    /**
     * Returns whether to use HTTPS for communicating with the Admin Console. By
     * default, this returns true.
     */
    public boolean getSecure() {
      return secure;
    }

    /**
     * Sets whether to use HTTPS for communicating with the Admin Console.
     *
     * @param secure true for HTTPS, false for HTTP
     */
    public void setSecure(boolean secure) {
      this.secure = secure;
    }

    /**
     * Sets the OAuth 2.0 token to use for authentication (instead of requiring
     * a username and password).
     */
    public void setOauthToken(String oauthToken) {
      this.oauthToken = oauthToken;
    }

    /**
     * Returns the OAuth 2.0 token being used for authentication, or {@code
     * null} if none.
     */
    public String getOauthToken() {
      return oauthToken;
    }

    /**
     * Sets whether to use persisted credentials (load/save to/from disk).
     */
    public void setUsePersistedCredentials(boolean usePersistedCredentials) {
      this.usePersistedCredentials = usePersistedCredentials;
    }

    /**
     * Returns whether to use persisted credentials (load/save to/from disk).
     */
    public boolean getUsePersistedCredentials() {
      return usePersistedCredentials;
    }

    private String userId;
    private String server = SdkInfo.getDefaultServer();
    private String host;
    private String sdkRoot;
    boolean keepUpload;
    private ClientCookieManager cookies;
    private PasswordPrompt passwordPrompt;
    private boolean secure = true;
    private String oauthToken;
    private boolean usePersistedCredentials = true;

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }
      ConnectOptions that = (ConnectOptions) o;

      if (host != null ? !host.equals(that.host) : that.host != null) {
        return false;
      }
      if (server != null ? !server.equals(that.server) : that.server != null) {
        return false;
      }
      if (userId != null ? !userId.equals(that.userId) : that.userId != null) {
        return false;
      }
      if (sdkRoot != null ? !sdkRoot.equals(that.sdkRoot) : that.sdkRoot != null) {
        return false;
      }

      return true;
    }

    @Override
    public int hashCode() {
      int result;
      result = (userId != null ? userId.hashCode() : 0);
      result = 31 * result + (server != null ? server.hashCode() : 0);
      result = 31 * result + (host != null ? host.hashCode() : 0);
      result = 31 * result + (sdkRoot != null ? sdkRoot.hashCode() : 0);
      return result;
    }
  }

  /**
   * Options used in preparing an application directory for upload.
   */
  public static class ApplicationProcessingOptions {
    private File java;
    private File javac;
    private boolean compileJsps = true;
    private boolean doBatch = true;
    private String compileEncoding = "UTF-8";
    private boolean splitJars = false;
    private boolean jarJSPs = true;
    private boolean jarClasses = false;
    private boolean deleteJSPs = false;
    private Set<String> splitExcludes = Collections.emptySet();

    /**
     * Returns an appropriate "java" executable. If a prior call to
     * {@link #setJavaExecutable(File)} was made, that value is returned (on
     * windows, the algorithm is forgiving if ".exe" was omitted, and will add
     * it). If not, the system property {@code java.home} is used to identify
     * the currently-running JVM, and if that directory contains a file named
     * {@code bin/java} (Unix) or {@code bin\\java.exe} (Windows), that is
     * returned.
     *
     * @return the Java executable, as a {@link File}.
     * @throws IllegalStateException if the java cannot be found by the
     *         heuristic above, but {@link #setJavaExecutable(File)} has not
     *         been called, or if it has been called, but the specified file
     *         cannot be found.
     */
    public File getJavaExecutable() {
      if (java != null) {
        return java;
      }

      String javaProp = System.getProperty(JAVA_CMD_PROP);
      if (javaProp != null) {
        java = new File(javaProp);
        if (!java.exists()) {
          if (Utility.isOsWindows() && !javaProp.endsWith(".exe")
              && (new File(javaProp + ".exe")).exists()) {
            java = new File(javaProp + ".exe");
          } else {
            throw new IllegalStateException("cannot find java executable \"" + javaProp + "\"");
          }
        }
      } else {
        String javaHome = System.getProperty("java.home");
        String javaCmd =
            javaHome + File.separator + "bin" + File.separator + "java"
                + (Utility.isOsWindows() ? ".exe" : "");
        java = new File(javaCmd);
        if (!java.exists()) {
          java = null;
          throw new IllegalStateException("cannot find java executable "
              + "based on java.home, tried \"" + javaCmd + "\"");
        }
      }
      return java;
    }

    /**
     * Explicitly requests a specific {@code java} program be used for launched
     * tasks, such as compiling JSP files.
     *
     * @param java the executable file to run.
     */
    void setJavaExecutable(File java) {
      this.java = java;
    }

    /**
     * Returns an appropriate "javac" executable. If a prior call to
     * {@link #setJavaCompiler(File)} was made, that value is returned (on
     * windows, the algorithm is forgiving if ".exe" was omitted, and will add
     * it). If not, the system property {@code java.home} is used to identify
     * the currently-running JVM. If that pathname ends with "jre", then its
     * parent is used instead as a hoped-for JDK root. If that directory
     * contains a file named {@code bin/javac} (Unix) or {@code bin\\javac.exe}
     * (Windows), that is returned.
     *
     * @return the Java compiler, as a {@link File}.
     * @throws IllegalStateException if the javac cannot be found by the
     *         heuristic above, but {@link #setJavaCompiler(File)} has not be
     *         called, or if it has been called but the file does not exist.
     */
    public File getJavaCompiler() {
      if (javac != null) {
        return javac;
      }

      String javacProp = System.getProperty(JAVAC_CMD_PROP);
      if (javacProp != null) {
        javac = new File(javacProp);
        if (!javac.exists()) {
          if (Utility.isOsWindows() && !javacProp.endsWith(".exe")
              && (new File(javacProp + ".exe")).exists()) {
            javac = new File(javacProp + ".exe");
          } else {
            throw new IllegalStateException("cannot find javac executable \"" + javacProp + "\"");
          }
        }
      } else {
        String javaHome = System.getProperty("java.home");
        String javacDir = javaHome;
        String javacCmd =
            javacDir + File.separator + "bin" + File.separator + "javac"
                + (Utility.isOsWindows() ? ".exe" : "");
        javac = new File(javacCmd);
        if (!javac.exists()) {
          javac = null;
          javacDir = (new File(javaHome)).getParentFile().getPath();
          String javacCmd2 =
              javacDir + File.separator + "bin" + File.separator + "javac"
                  + (Utility.isOsWindows() ? ".exe" : "");
          javac = new File(javacCmd2);
          if (!javac.exists()) {
            javac = null;
            throw new IllegalStateException("cannot find javac executable "
                + "based on java.home, tried \"" + javacCmd + "\" and \"" + javacCmd2 + "\"");
          }
        }
      }
      return javac;
    }

    /**
     * Explicitly requests a specific {@code javac} program be used for launched
     * Java compilations, such as compiling JSP files into classes.
     *
     * @param javac the executable file to run.
     */
    void setJavaCompiler(File javac) {
      this.javac = javac;
    }

    /** Returns whether we should attempt to compile JSPs */
    public boolean isCompileJspsSet() {
      return compileJsps;
    }

    /**
     * Requests that *.jsp files should be compiled into Java byte code, or if
     * false should be left untouched.
     *
     * @param doJsps {@code true} to compile .jsp files
     */
    void setCompileJsps(boolean doJsps) {
      this.compileJsps = doJsps;
    }

    /**
     * Returns whether we should use batch upload
     */
    public boolean isBatchModeSet() {
      return doBatch;
    }

    /**
     * Requests we use the upload batch mode
     *
     * @param doBatch {@code true} to use batch mode
     */
    void setBatchMode(boolean doBatch) {
      this.doBatch = doBatch;
    }

    public String getCompileEncoding() {
      return compileEncoding;
    }

    public void setCompileEncoding(String compileEncoding) {
      this.compileEncoding = compileEncoding;
    }

    /** Returns whether we should split large jar files. */
    public boolean isSplitJarsSet() {
      return splitJars;
    }

    /** Sets whether we should split large jar files. */
    public void splitJars(boolean b) {
      splitJars = b;
    }

    /** Sets whether we should jar the classes generated from JSPs. */
    public void setJarJSPs(boolean b) {
      jarJSPs = b;
    }

    /** Returns whether we should jar the classes generated from JSPs. */
    public boolean isJarJSPsSet() {
      return jarJSPs;
    }

    /** Sets whether we should jar the WEB-INF/classes content. */
    public void setJarClasses(boolean b) {
      jarClasses = b;
    }

    /** Returns whether we should jar the WEB-INF/classes content. */
    public boolean isJarClassesSet() {
      return jarClasses;
    }

    /** Sets whether we should delete the JSP source files. */
    public void setDeleteJSPs(boolean b) {
      deleteJSPs = b;
    }

    /** Returns whether we should delete the JSP source files. */
    public boolean isDeleteJSPs() {
      return deleteJSPs;
    }

    /**
     * Sets suffixes of filenames to exclude when splitting jars.
     *
     * @param jarSplittingExcludeSuffixes suffixes of filenames to exclude when
     *        splitting jars.
     */
    void setJarSplittingExcludes(Set<String> jarSplittingExcludeSuffixes) {
      splitExcludes = jarSplittingExcludeSuffixes;
    }

    /**
     * Returns the set of suffixes of filenames that should be excluded when
     * splitting jars.
     *
     * @return a set of suffixes of filenames to exclude.
     */
    public Set<String> getJarSplittingExcludes() {
      return splitExcludes;
    }
  }

  /**
   * Specifies the location of a java executable, used when compiling JSPs. By
   * default, the system property {@code java.home} is used to identify the
   * currently-running JVM, and if that directory contains a file named {@code
   * bin/java} (Unix) or {@code bin\\java.exe} (Windows), that is returned.
   *
   * @param java the Java executable to be used.
   */
  public void setJavaExecutable(File java) {
    appOptions.setJavaExecutable(java);
  }

  /**
   * Specifies the location of a javac executable, used when compiling JSPs. By
   * default, the system property {@code java.home} is used to identify the
   * currently-running JVM. If that pathname ends with "jre", then its parent is
   * used instead as a hoped-for JDK root. If that directory contains a file
   * named {@code bin/javac} (Unix) or {@code bin\\javac.exe} (Windows), that is
   * returned.
   *
   * @param javac the Java compiler executable to be used.
   */
  public void setJavaCompiler(File javac) {
    appOptions.setJavaCompiler(javac);
  }

  /**
   * Requests that *.jsp files should be compiled into Java byte code, or if
   * false should be left untouched.
   *
   * @param flag {@code true} to compile .jsp files
   */
  public void setCompileJsps(boolean flag) {
    appOptions.setCompileJsps(flag);
  }

   /**
   * Requests we do upload using batch
   * *
   * @param flag {@code true} to use batch mode for upload
   */
  public void setBatchMode(boolean flag) {
    appOptions.setBatchMode(flag);
  }

  /**
   * Enables or disables jar splitting.
   *
   * @param doSplit {@code false} to leave jars unsplit, and perhaps fail to
   *        upload due to large files, {@code true} to split into chunks of some
   *        uploadable size.
   */
  public void setJarSplittingEnabled(boolean doSplit) {
    appOptions.splitJars(doSplit);
  }

  /**
   * Enables or disables jarring classes generated from JSPs.
   *
   * @param doJarJSPs {@code true} to jar the generated classes from JSPs.
   */
  public void setJarJSPsEnabled(boolean doJarJSPs) {
    appOptions.setJarJSPs(doJarJSPs);
  }

  /**
   * Enables or disables jarring WEB-INF/classes content.
   *
   * @param doJarClasses {@code true} to jar the WEB-INF/classes content.
   */
  public void setJarClassessEnabled(boolean doJarClasses) {
    appOptions.setJarClasses(doJarClasses);
  }

  /**
   * Deletes or not the JSPs source files.
   *
   * @param deleteJSPs {@code true} remove all JSPs source (not needed after compilation).
   */
  public void setDeleteJSPs(boolean deleteJSPs) {
    appOptions.setDeleteJSPs(deleteJSPs);
  }
  /**
   * Sets suffixes for files to exclude when performing jar splitting.
   *
   * @param jarSplittingExcludeSuffixes a set of filename suffixes to exclude
   *        when performing jar splitting.
   */
  public void setJarSplittingExcludes(Set<String> jarSplittingExcludeSuffixes) {
    appOptions.setJarSplittingExcludes(jarSplittingExcludeSuffixes);
  }

  /**
   * Sets the character encoding to use when compiling JSP files.
   *
   * @throws IllegalArgumentException If the specified encoding is illegal or
   *         not supported.
   */
  public void setCompileEncoding(String compileEncoding) {
    Charset.forName(compileEncoding);
    appOptions.setCompileEncoding(compileEncoding);
  }
}
