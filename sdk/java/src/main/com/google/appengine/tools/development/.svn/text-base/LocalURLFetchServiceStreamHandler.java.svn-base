// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.development;

import static com.google.appengine.tools.development.StreamHandlerFactory.getDeclaredMethod;
import static com.google.appengine.tools.development.StreamHandlerFactory.invoke;

import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.utils.security.urlfetch.URLFetchServiceStreamHandler;

import java.io.IOException;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;

/**
 * Extension to {@link URLFetchServiceStreamHandler} that can fall back to a
 * default stream handler when the url fetch service is not available.
 * <p>
 * The Dev AppServer registers a custom stream handler, which is global (not
 * classloader global, jvm global).  In addition, the jdk only lets you set a
 * custom stream handler once, so once it's set, it's set.  This is
 * unfortunate, because you may have a program like an integration test or a
 * remote api test that spends some time operating in an App Engine context and
 * some time operating in a non-App Engine context.  Without the ability to fall
 * back to a default stream handler, you are effectively prevented from doing
 * anything involving stream handlers once you stop operating in an App Engine
 * context.
 *
 */
public class LocalURLFetchServiceStreamHandler extends URLFetchServiceStreamHandler {
 private final URLStreamHandler fallbackHandler;
  private final Method openConnection1Arg;
  private final Method openConnection2Arg;

  /**
   * Constructs a LocalURLFetchServiceStreamHandler
   *
   * @param fallbackHandler Receives requests to open connections when the url
   * fetch service is not available.
   */
  public LocalURLFetchServiceStreamHandler( URLStreamHandler fallbackHandler) {
    this.fallbackHandler = fallbackHandler;
    openConnection1Arg = getDeclaredMethod(fallbackHandler.getClass(), "openConnection", URL.class);
    openConnection2Arg = getDeclaredMethod(
        fallbackHandler.getClass(), "openConnection", URL.class, Proxy.class);
  }

  @Override
  protected HttpURLConnection openConnection(URL u) throws IOException {
    if (fallbackHandler != null && ApiProxy.getDelegate() == null) {
      return (HttpURLConnection) invoke(fallbackHandler, openConnection1Arg, u);
    }
    return super.openConnection(u);
  }

  @Override
  protected URLConnection openConnection(URL u, Proxy p) throws IOException {
    if (fallbackHandler != null && ApiProxy.getDelegate() == null) {
      return (HttpURLConnection) invoke(fallbackHandler, openConnection2Arg, u, p);
    }
    return super.openConnection(u, p);
  }

  public URLStreamHandler getFallbackHandler() {
    return fallbackHandler;
  }
}
