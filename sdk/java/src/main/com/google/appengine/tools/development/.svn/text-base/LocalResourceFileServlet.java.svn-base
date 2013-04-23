// Copyright 2008 Google Inc. All rights reserved.

package com.google.appengine.tools.development;

import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.apphosting.utils.config.WebXml;

import org.mortbay.jetty.handler.ContextHandler;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.Dispatcher;
import org.mortbay.jetty.servlet.PathMap;
import org.mortbay.jetty.servlet.ServletHandler;
import org.mortbay.resource.Resource;
import org.mortbay.util.URIUtil;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * {@code ResourceFileServlet} is a copy of {@code
 * org.mortbay.jetty.servlet.DefaultServlet} that has been trimmed
 * down to only support the subset of features that we want to take
 * advantage of (e.g. no gzipping, no chunked encoding, no buffering,
 * etc.).  A number of Jetty-specific optimizations and assumptions
 * have also been removed (e.g. use of custom header manipulation
 * API's, use of {@code ByteArrayBuffer} instead of Strings, etc.).
 *
 * A few remaining Jetty-centric details remain, such as use of the
 * {@link ContextHandler.SContext} class, and Jetty-specific request
 * attributes, but these are specific cases where there is no
 * servlet-engine-neutral API available.  This class also uses Jetty's
 * {@link Resource} class as a convenience, but could be converted to
 * use {@link ServletContext#getResource(String)} instead.
 *
 */
public class LocalResourceFileServlet extends HttpServlet {
  private static final Logger logger =
      Logger.getLogger(LocalResourceFileServlet.class.getName());

  private StaticFileUtils staticFileUtils;
  private Resource resourceBase;
  private String[] welcomeFiles;
  private String resourceRoot;

  /**
   * Initialize the servlet by extracting some useful configuration
   * data from the current {@link ServletContext}.
   */
  @Override
  public void init() throws ServletException {
    ContextHandler.SContext context = (ContextHandler.SContext) getServletContext();
    staticFileUtils = new StaticFileUtils(context);

    welcomeFiles = context.getContextHandler().getWelcomeFiles();

    AppEngineWebXml appEngineWebXml = (AppEngineWebXml) getServletContext().getAttribute(
        "com.google.appengine.tools.development.appEngineWebXml");

    resourceRoot = appEngineWebXml.getPublicRoot();
    try {
      resourceBase = context.getContextHandler().getResource(URIUtil.SLASH + resourceRoot);
    } catch (MalformedURLException ex) {
      logger.log(Level.WARNING, "Could not initialize:", ex);
      throw new ServletException(ex);
    }
  }

  /**
   * Retrieve the static resource file indicated.
   */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    String servletPath;
    String pathInfo;

    AppEngineWebXml appEngineWebXml = (AppEngineWebXml) getServletContext().getAttribute(
        "com.google.appengine.tools.development.appEngineWebXml");

    WebXml webXml = (WebXml) getServletContext().getAttribute(
        "com.google.appengine.tools.development.webXml");

    Boolean forwarded = (Boolean) request.getAttribute(Dispatcher.__FORWARD_JETTY);
    if (forwarded == null) {
      forwarded = Boolean.FALSE;
    }

    Boolean included = (Boolean) request.getAttribute(Dispatcher.__INCLUDE_JETTY);
    if (included != null && included) {
      servletPath = (String) request.getAttribute(Dispatcher.__INCLUDE_SERVLET_PATH);
      pathInfo = (String) request.getAttribute(Dispatcher.__INCLUDE_PATH_INFO);
      if (servletPath == null) {
        servletPath = request.getServletPath();
        pathInfo = request.getPathInfo();
      }
    } else {
      included = Boolean.FALSE;
      servletPath = request.getServletPath();
      pathInfo = request.getPathInfo();
    }

    String pathInContext = URIUtil.addPaths(servletPath, pathInfo);

    if (maybeServeWelcomeFile(pathInContext, included, request, response)) {
      return;
    }

    Resource resource = null;
    try {
      resource = getResource(pathInContext);

      if (resource != null && resource.isDirectory()) {
        if (included ||
            staticFileUtils.passConditionalHeaders(request, response, resource)) {
          response.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
      } else {
        if (resource == null || !resource.exists()) {
          logger.warning("No file found for: " + pathInContext);
          response.sendError(HttpServletResponse.SC_NOT_FOUND);
        } else {
          boolean isStatic = appEngineWebXml.includesStatic(resourceRoot + pathInContext);
          boolean isResource = appEngineWebXml.includesResource(
              resourceRoot + pathInContext);
          boolean usesRuntime = webXml.matches(pathInContext);
          Boolean isWelcomeFile = (Boolean)
              request.getAttribute("com.google.appengine.tools.development.isWelcomeFile");
          if (isWelcomeFile == null) {
            isWelcomeFile = false;
          }

          if (!isStatic && !usesRuntime && !(included || forwarded)) {
            logger.warning("Can not serve " + pathInContext + " directly.  " +
                           "You need to include it in <static-files> in your " +
                           "appengine-web.xml.");
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
          } else if (!isResource && !isWelcomeFile && (included || forwarded)) {
            logger.warning("Could not serve " + pathInContext + " from a forward or " +
                           "include.  You need to include it in <resource-files> in " +
                           "your appengine-web.xml.");
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
          }
          if (included || staticFileUtils.passConditionalHeaders(request, response, resource)) {
            staticFileUtils.sendData(request, response, included, resource);
          }
        }
      }
    } finally {
      if (resource != null) {
        resource.release();
      }
    }
  }

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    doGet(request,response);
  }

  /**
   * Get Resource to serve.
   * @param pathInContext The path to find a resource for.
   * @return The resource to serve.  Can be null.
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
   * exists within the directory referenced by the path.  If the
   * resource is not a directory, or no matching file is found, then
   * <code>null</code> is returned.  The list of welcome files is read
   * from the {@link ContextHandler} for this servlet, or
   * <code>"index.jsp" , "index.html"</code> if that is
   * <code>null</code>.
   * @return true if a welcome file was served, false otherwise
   * @throws IOException
   * @throws MalformedURLException
   */
  private boolean maybeServeWelcomeFile(String path,
                                        boolean included,
                                        HttpServletRequest request,
                                        HttpServletResponse response)
      throws IOException, ServletException {
    if (welcomeFiles == null) {
      return false;
    }

    if (!path.endsWith(URIUtil.SLASH)) {
      path += URIUtil.SLASH;
    }

    AppEngineWebXml appEngineWebXml = (AppEngineWebXml) getServletContext().getAttribute(
        "com.google.appengine.tools.development.appEngineWebXml");

    ContextHandler.SContext context = (ContextHandler.SContext) getServletContext();
    ServletHandler handler = ((Context) context.getContextHandler()).getServletHandler();
    PathMap.Entry defaultEntry = handler.getHolderEntry("/");
    PathMap.Entry jspEntry = handler.getHolderEntry("/foo.jsp");

    for (String welcomeName : welcomeFiles) {
      String welcomePath = path + welcomeName;
      String relativePath = welcomePath.substring(1);

      PathMap.Entry entry = handler.getHolderEntry(welcomePath);
      if (entry != defaultEntry && entry != jspEntry) {
        RequestDispatcher dispatcher = request.getRequestDispatcher(path + welcomeName);
        return staticFileUtils.serveWelcomeFileAsForward(dispatcher, included, request, response);
      }

      Resource welcomeFile = getResource(path + welcomeName);
      if (welcomeFile != null && welcomeFile.exists()) {
        if (entry != defaultEntry) {
          RequestDispatcher dispatcher = request.getRequestDispatcher(path + welcomeName);
          return staticFileUtils.serveWelcomeFileAsForward(dispatcher, included, request, response);
        }
        if (appEngineWebXml.includesResource(relativePath)) {
          RequestDispatcher dispatcher = request.getRequestDispatcher(path + welcomeName);
          return staticFileUtils.serveWelcomeFileAsForward(dispatcher, included, request, response);
        }
      }
      RequestDispatcher namedDispatcher = context.getNamedDispatcher(welcomeName);
      if (namedDispatcher != null) {
        return staticFileUtils.serveWelcomeFileAsForward(namedDispatcher, included,
                                                         request, response);
      }
    }

    return false;
  }
}
