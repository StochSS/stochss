// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api;

import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Environment;

import java.util.Map;
import java.util.regex.Pattern;

/**
 * Provides functions for manipulating the current namespace used for
 * App Engine APIs.
 *
 * <p>The "current namespace" is the string that is returned by
 * {@link #get()} and used by a number of APIs including Datatore,
 * Memcache and Task Queue.
 *
 * <p>When a namespace aware class (e.g.,
 * {@link com.google.appengine.api.datastore.Key},
 * {@link com.google.appengine.api.datastore.Query} and
 * {@link com.google.appengine.api.memcache.MemcacheService}) is constructed, it
 * determines which namespace will be used by calling
 * {@link NamespaceManager#get()} if it is otherwise unspecified. If
 * {@link NamespaceManager#get()} returns null, the current namespace is unset
 * and these APIs will use the empty ("") namespace in its place.
 *
 * <p>Example: <code><pre>
 * {@link NamespaceManager}.{@link #set}("a-namespace");
 * MemcacheService memcache = MemcacheServiceFactory.getMemcacheService();
 * // Store record in namespace "a-namespace"
 * memcache.put("key1", "value1");
 *
 * {@link NamespaceManager}.{@link #set}("other-namespace");
 * // Store record in namespace "other-namespace"
 * memcache.put("key2", "value2");
 *
 * MemcacheService boundMemcache =
 *     MemcacheServiceFactory.getMemcacheService("specific-namespace");
 * {@link NamespaceManager}.{@link #set}("whatever-namespace");
 * // The record is still stored in namespace "specific-namespace".
 * boundMemcache.put("key3", "value3");
 * </pre></code>
 *
 * <p>MemcacheService {@code memcache} (in the above example) uses the current
 * namespace and {@code key1} will be stored in namespace {@code "a-namespace"},
 * while {@code key2} is stored in namespace {@code "other-namespace"}. It is
 * possible to override the current namespace and store data in specific
 * namespace. In the above example {@code key3} is stored in namespace
 * {@code "specific-namespace"}.
 *
 * <p>The Task Queue {@link com.google.appengine.api.taskqueue.Queue#add}
 * methods will forward the {@link NamespaceManager} settings into the task
 * being added causing the added task to be executed with the same current
 * namespace as the task creator. The exception is that an unset current
 * namespace (i.e. {@link NamespaceManager#get()} returns null) will be
 * forwarded as an empty ("") namespace to the created task's requests.
 *
 * @see <a
 * href="http://code.google.com/appengine/docs/java/multitenancy/">
 * Multitenancy and the Namespaces Java API.  In <em>Google App Engine
 * Developer's Guide</em></a>.
 */
public final class NamespaceManager {
  private final static int NAMESPACE_MAX_LENGTH = 100;
  private final static String NAMESPACE_REGEX = "[0-9A-Za-z._-]{0," + NAMESPACE_MAX_LENGTH +"}";
  private static final Pattern NAMESPACE_PATTERN = Pattern.compile(NAMESPACE_REGEX);

  /**
   * We store the current namespace as an environment attribute identified
   * by this key.
   */
  private static final String CURRENT_NAMESPACE_KEY =
    NamespaceManager.class.getName() + ".currentNamespace";
  private static final String APPS_NAMESPACE_KEY =
    NamespaceManager.class.getName() + ".appsNamespace";

  /**
   * Set the value used to initialize the namespace of namespace-aware services.
   *
   * @param newNamespace the new namespace.
   * @throws IllegalArgumentException if namespace string is invalid.
   */
  public static void set(String newNamespace) {
    if (newNamespace == null) {
      ApiProxy.getCurrentEnvironment().getAttributes().remove(CURRENT_NAMESPACE_KEY);
    } else {
      validateNamespace(newNamespace);
      Environment environment = ApiProxy.getCurrentEnvironment();
      environment.getAttributes().put(CURRENT_NAMESPACE_KEY, newNamespace);
    }
  }

  /**
   * Returns the current namespace setting or {@code null} if not set.
   *
   * <p>If the current namespace is unset, callers should assume
   * the use of the "" (empty) namespace in all namespace-aware services.
   */
  public static String get() {
    Map<String, Object> attributes = ApiProxy.getCurrentEnvironment().getAttributes();
    return (String) attributes.get(CURRENT_NAMESPACE_KEY);
  }

  /**
   * Returns the Google Apps domain referring this request or
   * otherwise the empty string ("").
   */
  public static String getGoogleAppsNamespace() {
    Map<String, Object> attributes = ApiProxy.getCurrentEnvironment().getAttributes();
    String appsNamespace = (String) attributes.get(APPS_NAMESPACE_KEY);
    return appsNamespace == null ? "" : appsNamespace;
  }

  /**
   * Validate the format of a namespace string.
   * @throws IllegalArgumentException If the format of the namespace string
   *     is invalid.
   */
  public static void validateNamespace(String namespace) {
    if (!NAMESPACE_PATTERN.matcher(namespace).matches()) {
        throw new IllegalArgumentException(
            "Namespace '" + namespace + "' does not match pattern '" + NAMESPACE_PATTERN + "'.");
    }
  }

  private NamespaceManager() {
  }
}
