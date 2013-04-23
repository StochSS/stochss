// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.info.SdkInfo;
import com.google.apphosting.utils.io.IoUtil;
import com.google.apphosting.utils.jetty.AppEngineWebAppContext;

import org.mortbay.jetty.security.ConstraintMapping;

import java.io.File;
import java.io.IOException;
import java.util.Enumeration;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * An AppEngineWebAppContext for the DevAppServer.
 *
 */
public class DevAppEngineWebAppContext extends AppEngineWebAppContext {

  private static final Logger logger =
      Logger.getLogger(DevAppEngineWebAppContext.class.getName());

  private static final String JASPER_SERVLET_CLASSPATH = "org.apache.catalina.jsp_classpath";

  private static final String X_GOOGLE_DEV_APPSERVER_SKIPADMINCHECK =
      "X-Google-DevAppserver-SkipAdminCheck";

  private static final String SKIP_ADMIN_CHECK_ATTR =
      "com.google.apphosting.internal.SkipAdminCheck";

  private final Object transportGuaranteeLock = new Object();
  private boolean transportGuaranteesDisabled = false;

  public DevAppEngineWebAppContext(File appDir, File externalResourceDir, String serverInfo,
      ApiProxyLocal apiProxyLocal) {
    super(appDir, serverInfo);

    setAttribute(JASPER_SERVLET_CLASSPATH, buildClasspath());

    _scontext.setAttribute("com.google.appengine.devappserver.ApiProxyLocal", apiProxyLocal);

    if (externalResourceDir != null) {
      try {
        resolveWebApp();
        setBaseResource(new ExtendedRootResource(getBaseResource(), externalResourceDir));
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
    }
  }

  @Override
  public void handle(String target, HttpServletRequest request, HttpServletResponse response,
      int dispatch) throws IOException, ServletException {

    if (hasSkipAdminCheck(request)) {
      request.setAttribute(SKIP_ADMIN_CHECK_ATTR, Boolean.TRUE);
    }

    disableTransportGuarantee();

    System.setProperty("devappserver-thread-" + Thread.currentThread().getName(), "true");
    try {
      super.handle(target, request, response, dispatch);
    } finally {
      System.clearProperty("devappserver-thread-" + Thread.currentThread().getName());
    }
  }

  /**
   * Returns true if the X-Google-Internal-SkipAdminCheck header is
   * present.  There is nothing preventing usercode from setting this header
   * and circumventing dev appserver security, but the dev appserver was not
   * designed to be secure.
   */
  private boolean hasSkipAdminCheck(HttpServletRequest request) {
    for (Enumeration<?> headerNames = request.getHeaderNames(); headerNames.hasMoreElements(); ) {
      String name = (String) headerNames.nextElement();
      if (name.equalsIgnoreCase(X_GOOGLE_DEV_APPSERVER_SKIPADMINCHECK)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Builds a classpath up for the webapp for JSP compilation.
   */
  private String buildClasspath() {
    StringBuffer classpath = new StringBuffer();

    for (File f : SdkInfo.getSharedLibFiles()) {
      classpath.append(f.getAbsolutePath());
      classpath.append(File.pathSeparatorChar);
    }

    String webAppPath = getWar();

    classpath.append(webAppPath + File.separator + "classes" + File.pathSeparatorChar);

    List<File> files = IoUtil.getFilesAndDirectories(new File(webAppPath,"lib"));
    for (File f : files) {
      if (f.isFile() && f.getName().endsWith(".jar")) {
        classpath.append(f.getAbsolutePath());
        classpath.append(File.pathSeparatorChar);
      }
    }

    return classpath.toString();
  }

  /**
   * The first time this method is called it will walk through the
   * constraint mappings on the current SecurityHandler and disable
   * any transport guarantees that have been set.  This is required to
   * disable SSL requirements in the DevAppServer because it does not
   * support SSL.
   */
  private void disableTransportGuarantee() {
    synchronized (transportGuaranteeLock) {
      if (!transportGuaranteesDisabled) {
        if (getSecurityHandler() != null) {
          ConstraintMapping[] mappings = getSecurityHandler().getConstraintMappings();
          if (mappings != null) {
            for (ConstraintMapping mapping : mappings) {
              if (mapping.getConstraint().getDataConstraint() > 0) {
                logger.info("Ignoring <transport-guarantee> for " + mapping.getPathSpec() +
                            " as the SDK does not support HTTPS.  It will still be used" +
                            " when you upload your application.");
                mapping.getConstraint().setDataConstraint(0);
              }
            }
          }
        }
      }
      transportGuaranteesDisabled = true;
    }
  }
}
