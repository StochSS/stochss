// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Environment;

import java.util.Collection;

/**
 * Helper class for {@link RequestEndListener}. This class provides two alternate ways to register
 * a {@link RequestEndListener}. The first method works with classes that implement a {@link
 * RequestEndListener}:
 * <blockquote><pre>
 *   RequestEndListener listener = ...;
 *   RequestEndListenerHelper.register(listener);
 * </pre></blockquote>
 * The second method is for classes able to extend this class:
 * <blockquote><pre>
 *   RequestEndListenerHelper listener = ...;
 *   listener.register();
 * </pre></blockquote>
 */
public abstract class RequestEndListenerHelper implements RequestEndListener {
  /**
   * Register the current instance to be called when a request ends.
   */
  public void register() {
    register(this);
  }

  /**
   * Register a RequestEndListener to be called when a request ends.
   *
   * @param listener The listener to register.
   */
  public static void register(RequestEndListener listener) {
    getListeners().add(listener);
  }

  /**
   * Get the collection of all the registered RequestEndListeners. The collection is mutable
   * so the caller may add or remove listeners
   *
   * @return The collection of registered RequestEndListeners.
   */
  public static Collection<RequestEndListener> getListeners() {
    Environment environment = ApiProxy.getCurrentEnvironment();
    @SuppressWarnings("unchecked")
    Collection<RequestEndListener> listenerSet = (Collection<RequestEndListener>)
        environment.getAttributes().get(LocalEnvironment.REQUEST_END_LISTENERS);
    return listenerSet;
  }
}
