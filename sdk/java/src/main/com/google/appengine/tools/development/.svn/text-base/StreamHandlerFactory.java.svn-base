// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLStreamHandler;
import java.net.URLStreamHandlerFactory;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * A {@link URLStreamHandlerFactory} which installs
 * {@link URLStreamHandler URLStreamHandlers} that App Engine needs to support.
 * (For example, the "http" and "https" protocols).  This factory returns
 * handlers that delegate to the
 * {@link com.google.appengine.api.urlfetch.URLFetchService} when running in an
 * App Engine container, and returns the default handlers when running outside
 * an App Engine container.
 *
 */
public class StreamHandlerFactory implements URLStreamHandlerFactory {

  private static boolean factoryIsInstalled;

  /**
   * Need to access this method via reflection because it is protected on
   * {@link URL}.
   */ private static final Method GET_URL_STREAM_HANDLER;

  static {
    Method m = null;
    try {
      m = URL.class.getDeclaredMethod("getURLStreamHandler", String.class);
      m.setAccessible(true);
    } catch (NoSuchMethodException e) {
      Logger.getLogger(StreamHandlerFactory.class.getName()).info(
          "Unable to register default URLStreamHandlers.  You will be unable to "
              + "access http and https URLs outside the App Engine environment.");
    }
    GET_URL_STREAM_HANDLER = m;
  }

  private Map<String, URLStreamHandler> handlers = new HashMap<String, URLStreamHandler>();

  /**
   * Installs this StreamHandlerFactory.
   *
   * @throws IllegalStateException if a factory has already been installed, and
   * it is not a StreamHandlerFactory.
   * @throws RuntimeException if an unexpected, catastrophic failure occurs
   * while installing the handler.
   */
  public static void install() {
    synchronized (StreamHandlerFactory.class) {
      if (!factoryIsInstalled) {
        StreamHandlerFactory factory = new StreamHandlerFactory();

        try {
          URL.setURLStreamHandlerFactory(factory);
        } catch (Error e) {

          Object currentFactory;

          try {
            Field f = URL.class.getDeclaredField("factory");
            f.setAccessible(true);
            currentFactory = f.get(null);
          } catch (Exception ex) {
            throw new RuntimeException("Failed to find the currently installed factory", ex);
          }

          if (currentFactory == null) {
            throw new RuntimeException("The current factory is null, but we were unable "
                + "to set a new factory", e);
          }

          String currentFactoryType = currentFactory.getClass().getName();
          if (currentFactoryType.equals(StreamHandlerFactory.class.getName())) {
            factoryIsInstalled = true;
            return;
          }

          throw new IllegalStateException("A factory of type " + currentFactoryType +
              " has already been installed");
        }
      }
    }
  }

  private StreamHandlerFactory() {
    for (String protocol : Arrays.asList("http", "https")) {
      URLStreamHandler fallbackHandler = getFallbackStreamHandler(protocol);
      handlers.put(protocol, new LocalURLFetchServiceStreamHandler(fallbackHandler));
    }
  }

  @Override
  public URLStreamHandler createURLStreamHandler(String protocol) {
    return handlers.get(protocol);
  }

  /**
   * All calls to this method must take place before we register the
   * stream handler factory with URL.
   */
  private static URLStreamHandler getFallbackStreamHandler(String protocol) {
    if (GET_URL_STREAM_HANDLER == null) {
      return null;
    }
    URLStreamHandler existingHandler =
        (URLStreamHandler) invoke(null, GET_URL_STREAM_HANDLER, protocol);
    if (existingHandler.getClass().getName().equals(
            LocalURLFetchServiceStreamHandler.class.getName())) {
      Method getFallbackHandler =
          getDeclaredMethod(existingHandler.getClass(), "getFallbackHandler");
      return (URLStreamHandler) invoke(existingHandler, getFallbackHandler);
    }
    return existingHandler;
  }

  static Object invoke(Object target, Method m, Object... args) {
    try {
      return m.invoke(target, args);
    } catch (IllegalAccessException e) {
      throw new RuntimeException(e);
    } catch (InvocationTargetException e) {
      if (e.getTargetException() instanceof RuntimeException) {
        throw (RuntimeException) e.getTargetException();
      }
      throw new RuntimeException(e.getTargetException());
    }
  }

  static Method getDeclaredMethod(Class<?> cls, String methodName, Class<?>... args) {
    try {
      Method m = cls.getDeclaredMethod(methodName, args);
      m.setAccessible(true);
      return m;
    } catch (NoSuchMethodException e) {
      throw new RuntimeException(e);
    }
  }
}
