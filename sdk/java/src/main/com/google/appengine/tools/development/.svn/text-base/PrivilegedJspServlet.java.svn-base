// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import org.apache.jasper.servlet.JspServlet;
import java.security.AccessController;
import java.security.PrivilegedExceptionAction;
import java.security.PrivilegedActionException;

import javax.servlet.ServletException;
import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * {@code PrivilegedJspServlet} wraps the Jasper {@link JspServlet}
 * with {@code doPrivileged} blocks.
 *
 */
public class PrivilegedJspServlet extends JspServlet {

  /**
   * The request attribute that contains the name of the JSP file, when the
   * request path doesn't refer directly to the JSP file (for example,
   * it's instead a servlet mapping).
   */
  private static final String JASPER_JSP_FILE = "org.apache.catalina.jsp_file";

  @Override
  public void init(final ServletConfig config) throws ServletException {
    try {
      AccessController.doPrivileged(new PrivilegedExceptionAction<Object>() {
        @Override
        public Object run() throws ServletException {
          PrivilegedJspServlet.super.init(config);
          return null;
        }
      });
    } catch (PrivilegedActionException ex) {
      Throwable cause = ex.getException();
      if (cause instanceof ServletException) {
        throw (ServletException) cause;
      } else {
        throw new RuntimeException(cause);
      }
    }
  }

  @Override
  public void service (final HttpServletRequest request, final HttpServletResponse response)
      throws ServletException, IOException {
    fixupJspFileAttribute(request);

    try {
      AccessController.doPrivileged(new PrivilegedExceptionAction<Object>() {
        @Override
          public Object run() throws IOException, ServletException {
            PrivilegedJspServlet.super.service(request, response);
            return null;
          }
      });
    } catch (PrivilegedActionException ex) {
      Throwable cause = ex.getException();
      if (cause instanceof IOException) {
        throw (IOException) cause;
      } else if (cause instanceof ServletException) {
        throw (ServletException) cause;
      } else {
        throw new RuntimeException(cause);
      }
    }
  }

  private void fixupJspFileAttribute(HttpServletRequest request) {
    String jspFile = (String)request.getAttribute(JASPER_JSP_FILE);

    if (jspFile != null) {
      if (jspFile.length() == 0) {
        jspFile = "/";
      } else if (jspFile.charAt(0) != '/') {
        jspFile = "/" + jspFile;
      }
      request.setAttribute(JASPER_JSP_FILE, jspFile);
    }
  }
}
