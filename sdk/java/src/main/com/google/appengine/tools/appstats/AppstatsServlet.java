// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.tools.appstats.Recorder.Clock;
import com.google.appengine.tools.appstats.StatsProtos.RequestStatProto;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A servlet that can be used to render statistics to the user.
 *
 */
@SuppressWarnings("serial")
public class AppstatsServlet extends HttpServlet {

  private static final String PREFIX = "/apphosting/ext/appstats/static/";

  private static final Map<String, String> CONTENT_TYPES;
  static {
    Map<String, String> contentTypes = new HashMap<String, String>();
    contentTypes.put("css", "text/css");
    contentTypes.put("js", "application/javascript");
    contentTypes.put("gif", "image/gif");
    CONTENT_TYPES = Collections.unmodifiableMap(contentTypes);

  }

  private boolean requireAdminAuthentication = true;
  private final MemcacheWriter memcache;
  private final Renderer renderer;
  Clock clock = new Clock();

  AppstatsServlet(MemcacheWriter writer, Renderer renderer) {
    this.memcache = writer;
    this.renderer = renderer;
  }

  public AppstatsServlet() {
    this(
        new MemcacheWriter(
            new Clock(), MemcacheServiceFactory.getMemcacheService(MemcacheWriter.STATS_NAMESPACE)),
        new Renderer());
  }

  @Override
  public void init(ServletConfig config) throws ServletException {
    String requireAuthParam = config.getInitParameter("requireAdminAuthentication");
    if (requireAuthParam != null) {
      requireAdminAuthentication = "yes".equalsIgnoreCase(requireAuthParam)
          || "true".equalsIgnoreCase(requireAuthParam);
    }
  }

  private boolean requireAdminAuthentication(UserService userService,
      HttpServletRequest req, HttpServletResponse resp) throws IOException {
    if (!requireAdminAuthentication) {
      return true;
    }

    if (!userService.isUserLoggedIn()) {
      resp.sendRedirect(userService.createLoginURL(req.getRequestURI()));
      return false;
    }

    if (!userService.isUserAdmin()) {
      resp.sendError(HttpServletResponse.SC_FORBIDDEN);
      return false;
    }

    return true;
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String path = req.getPathInfo();

    if (path == null) {

      resp.sendRedirect(req.getServletPath() + "/stats");
    } else if (path.startsWith("/static/")) {

      serveStaticContent(req, resp);
    } else if (path.equals("/details")) {

      RequestStatProto data;
      try {
        long asTimeStamp = Long.parseLong(req.getParameter("time"));
        data = memcache.getFull(asTimeStamp);
      } catch (NumberFormatException e) {
        data = null;
      }
      if (data == null) {
        resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        return;
      }

      authenticateAndServeDetails(data, req, resp);
    } else if (path.equals("/stats")) {

      if (!requireAdminAuthentication(UserServiceFactory.getUserService(), req, resp)) {
        return;
      }
      renderer.renderSummaries(resp.getWriter(), memcache.getSummaries());
    } else {

      resp.sendRedirect(req.getServletPath() + "/stats");
    }
  }

  /**
   * Helper: Checks authentication as needed and renders the details view, either
   * as HTML or JSON depending on the contents of the query string.
   */
  private void authenticateAndServeDetails(RequestStatProto data, HttpServletRequest req,
      HttpServletResponse resp) throws IOException {
    String type = req.getParameter("type");

    UserService userService = UserServiceFactory.getUserService();
    if (type == null) {
      if (requireAdminAuthentication(userService, req, resp)) {
        renderer.renderDetails(resp.getWriter(), data);
      }
      return;
    }

    if ("json".equalsIgnoreCase(type)) {
      if (requireAdminAuthentication(userService, req, resp)) {
        resp.setContentType("application/json");
        renderer.renderDetailsAsJson(resp.getWriter(), data);
      } else {
        resp.sendError(HttpServletResponse.SC_FORBIDDEN);
      }
      return;
    }

    resp.sendError(HttpServletResponse.SC_NOT_FOUND);
  }

  /**
   * Helper: loads static content bundled with this class and serves it as part
   * of this servlet.
   */
  void serveStaticContent(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    String resource = req.getRequestURI();
    resource = PREFIX + resource.substring(resource.lastIndexOf('/') + 1);
    URL byName = AppstatsServlet.class.getResource(resource);
    if (byName == null) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    if (resource.lastIndexOf('.') < 0) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
    }
    String ext = resource.substring(resource.toLowerCase().lastIndexOf('.') + 1);
    if (!CONTENT_TYPES.containsKey(ext)) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
    }

    resp.addHeader("Content-type", CONTENT_TYPES.get(ext));
    resp.addHeader("Cache-Control", "public, max-age=expiry");
    SimpleDateFormat httpDateFormat = new SimpleDateFormat(
        "EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
    httpDateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
    resp.addHeader("Expires", httpDateFormat.format(
        new Date(clock.currentTimeMillis() + 3600000L)));

    ServletOutputStream out = resp.getOutputStream();
    InputStream in = byName.openStream();
    try {
      byte[] b = new byte[256];
      int len = in.read(b);
      while (len > 0) {
        out.write(b, 0, len);
        len = in.read(b);
      }
    } finally {
      try {
        in.close();
      } finally {
        out.close();
      }
    }
  }
}
