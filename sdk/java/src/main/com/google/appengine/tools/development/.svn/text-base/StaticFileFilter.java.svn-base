// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.tools.development;

import com.google.apphosting.utils.config.AppEngineWebXml;

import org.mortbay.jetty.handler.ContextHandler;
import org.mortbay.jetty.servlet.Dispatcher;
import org.mortbay.resource.Resource;
import org.mortbay.util.URIUtil;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

/**
 * {@code StaticFileFilter} is a {@link Filter} that replicates the
 * static file serving logic that is present in the PFE and AppServer.
 * This logic was originally implemented in {@link
 * LocalResourceFileServlet} but static file serving needs to take
 * precedence over all other servlets and filters.
 *
 */
public class StaticFileFilter implements Filter {
  private static final Logger logger =
      Logger.getLogger(StaticFileFilter.class.getName());

  private StaticFileUtils staticFileUtils;
  private AppEngineWebXml appEngineWebXml;
  private Resource resourceBase;
  private String[] welcomeFiles;
  private String resourceRoot;
  private ContextHandler.SContext servletContext;

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    servletContext = (ContextHandler.SContext) filterConfig.getServletContext();
    staticFileUtils = new StaticFileUtils(servletContext);

    welcomeFiles = servletContext.getContextHandler().getWelcomeFiles();

    appEngineWebXml = (AppEngineWebXml) servletContext.getAttribute(
        "com.google.appengine.tools.development.appEngineWebXml");
    resourceRoot = appEngineWebXml.getPublicRoot();

    try {
      resourceBase = servletContext.getContextHandler().getResource(URIUtil.SLASH + resourceRoot);
    } catch (MalformedURLException ex) {
      logger.log(Level.WARNING, "Could not initialize:", ex);
      throw new ServletException(ex);
    }
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    Boolean forwarded = (Boolean) request.getAttribute(Dispatcher.__FORWARD_JETTY);
    if (forwarded == null) {
      forwarded = Boolean.FALSE;
    }

    Boolean included = (Boolean) request.getAttribute(Dispatcher.__INCLUDE_JETTY);
    if (included == null) {
      included = Boolean.FALSE;
    }

    if (forwarded || included) {
      chain.doFilter(request, response);
      return;
    }

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;
    String servletPath = httpRequest.getServletPath();
    String pathInfo = httpRequest.getPathInfo();
    String pathInContext = URIUtil.addPaths(servletPath, pathInfo);

    if (maybeServeWelcomeFile(pathInContext, httpRequest, httpResponse)) {
      return;
    }

    Resource resource = null;
    try {
      resource = getResource(pathInContext);

      if (resource != null && resource.exists() && !resource.isDirectory()) {
        if (appEngineWebXml.includesStatic(resourceRoot + pathInContext)) {
          if (staticFileUtils.passConditionalHeaders(httpRequest, httpResponse, resource)) {
            staticFileUtils.sendData(httpRequest, httpResponse, false, resource);
          }
          return;
        }
      }
    } finally {
      if (resource != null) {
        resource.release();
      }
    }
    chain.doFilter(request, response);
  }

  /**
   * Get Resource to serve.
   * @param pathInContext The path to find a resource for.
   * @return The resource to serve.
   */
  private Resource getResource(String pathInContext) {
    try {
      if (resourceBase != null) {
        return resourceBase.addPath(pathInContext);
      }
    } catch (IOException ex) {
      logger.log(Level.WARNING, "Could not find: " + pathInContext, ex);
    }
    return null;
  }

  /**
   * Finds a matching welcome file for the supplied path and, if
   * found, serves it to the user.  This will be the first entry in
   * the list of configured {@link #welcomeFiles welcome files} that
   * exists within the directory referenced by the path.
   * @param path
   * @param request
   * @param response
   * @return true if a welcome file was served, false otherwise
   * @throws IOException
   * @throws MalformedURLException
   */
  private boolean maybeServeWelcomeFile(String path,
                                        HttpServletRequest request,
                                        HttpServletResponse response)
      throws IOException, ServletException {
    if (welcomeFiles == null) {
      return false;
    }

    if (!path.endsWith(URIUtil.SLASH)) {
      path += URIUtil.SLASH;
    }

    for (String welcomeName : welcomeFiles) {
      final String welcomePath = path + welcomeName;

      Resource welcomeFile = getResource(path + welcomeName);
      if (welcomeFile != null && welcomeFile.exists()) {
        if (appEngineWebXml.includesStatic(resourceRoot + welcomePath)) {
          RequestDispatcher dispatcher = servletContext.getNamedDispatcher("_ah_default");
          request = new HttpServletRequestWrapper(request) {
              @Override
              public String getServletPath() {
                return welcomePath;
              }

              @Override
              public String getPathInfo() {
                return "";
              }
          };
          return staticFileUtils.serveWelcomeFileAsForward(dispatcher, false, request, response);
        }
      }
    }

    return false;
  }

  @Override
  public void destroy() {
  }
}
