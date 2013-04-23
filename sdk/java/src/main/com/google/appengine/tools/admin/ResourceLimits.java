// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.YamlUtils;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

/**
 *
 */
public final class ResourceLimits {
  private final Map<String, Long> resourceLimitsMap;

  /**
   * The names of our resources. Must be kept in sync with the admin console
   * (see //apphosting/client/admin_console/api/appversion.py
   * GetResourceLimitsHandler)
   */
  static final String MAX_BLOB_SIZE_KEY = "max_blob_size";
  static final String MAX_FILE_COUNT_KEY = "max_file_count";
  static final String MAX_FILE_SIZE_KEY = "max_file_size";
  static final String MAX_FILES_TO_CLONE_KEY = "max_files_to_clone";
  static final String MAX_TOTAL_FILE_SIZE_KEY = "max_total_file_size";

  /**
   * Map of our default max resource limits.
   */
  private static final HashMap<String, Long> DEFAULT_RESOURCE_LIMITS;
  static {
    DEFAULT_RESOURCE_LIMITS = new HashMap<String, Long>();
    final long MILLION = 1000 * 1000;
    final long MEGA = 1024 * 1024;
    DEFAULT_RESOURCE_LIMITS.put(MAX_BLOB_SIZE_KEY, 32 * MILLION);
    DEFAULT_RESOURCE_LIMITS.put(MAX_FILE_COUNT_KEY, 10000L);
    DEFAULT_RESOURCE_LIMITS.put(MAX_FILE_SIZE_KEY, 32 * MILLION);
    DEFAULT_RESOURCE_LIMITS.put(MAX_FILES_TO_CLONE_KEY, 100L);
    DEFAULT_RESOURCE_LIMITS.put(MAX_TOTAL_FILE_SIZE_KEY, 150 * MEGA);
  }

  /**
   * Constructs a ResourceLimits object. The method is private; users of
   * the class should create instance with {@code getResourceLimits()}.
   *
   * @param resourceLimitsMap A map that has (at a minimum) the expected
   * resource limits (it may include extra entries).
   */
  private ResourceLimits(Map<String, Long> resourceLimitsMap) {
    this.resourceLimitsMap = resourceLimitsMap;
  }

  /**
   * Gets the maximum blob size.
   *
   * @return The maximum blob size.
   */
  public long maxBlobSize() {
    return resourceLimitsMap.get(MAX_BLOB_SIZE_KEY).longValue();
  }

  /**
   * Gets the maximum file count.
   *
   * @return The maximum file count.
   */
  public long maxFileCount() {
    return resourceLimitsMap.get(MAX_FILE_COUNT_KEY).longValue();
  }

  /**
   * Gets the maximum file size.
   *
   * @return The maximum file size.
   */
  public long maxFileSize() {
    return resourceLimitsMap.get(MAX_FILE_SIZE_KEY).longValue();
  }

  /**
   * Gets the maximum files to clone in a single request.
   *
   * @return The maximum files to clone in a single request.
   */
  public long maxFilesToClone() {
    return resourceLimitsMap.get(MAX_FILES_TO_CLONE_KEY).longValue();
  }

  /**
   * Gets the maximum total file size.
   *
   * @return The maximum total file size.
   */
  public long maxTotalFileSize() {
    return resourceLimitsMap.get(MAX_TOTAL_FILE_SIZE_KEY).longValue();
  }

  /**
   * Get the set of all resource limits.
   *
   * @return The set of all resource limits.
   */
  public Set<String> keySet() {
    return resourceLimitsMap.keySet();
  }

  /**
   * Get a resource limit by name. This should be used in conjunction with
   * {@code keySet()} for display purposes.
   *
   * @param key The name of the resource limit as returned by {@code keySet()}.
   * @return The value of the resource limit.
   */
  public long get(String key) {
    return resourceLimitsMap.get(key);
  }

  /**
   * Gets the resource limits. The values returned are a combination of
   * values reported by the adminconsole/appserver plus locally defined
   * defaults for any missing values.
   *
   * @param connection A connection to the adminconsole.
   *
   * @return A ResourceLimits instance.
   *
   * @throws IOException for errors regarding communicating with the
   * server.
   */
  public static ResourceLimits request(ServerConnection connection,
      GenericApplication app) throws IOException {
    Map<String, Long> remoteResourceLimits = remoteRequest(connection, app);
    for (Entry<String, Long> defaultEntry : DEFAULT_RESOURCE_LIMITS.entrySet()) {
      if (!remoteResourceLimits.containsKey(defaultEntry.getKey())) {
        remoteResourceLimits.put(defaultEntry.getKey(),
            defaultEntry.getValue());
      }
    }

    return new ResourceLimits(remoteResourceLimits);
  }

  /**
   * Gets the resource limits as reported by the server.
   *
   * @param connection A connection to the adminconsole.
   *
   * @return A map of all the resource limits reported by the current
   * adminconsole.
   *
   * @throws AdminException for errors regarding the data returned from
   * the server.
   *
   * @throws IOException for errors regarding communicating with the
   * server.
   */
  private static Map<String, Long> remoteRequest(ServerConnection connection,
      GenericApplication app) throws IOException {
    String reply = null;
    try {
      reply = connection.post("/api/appversion/getresourcelimits", "",
          "app_id", app.getAppId(), "version", app.getVersion());
      return YamlUtils.genericParse(reply,
          new YamlUtils.ObjectConverter<Long>() {
            @Override
            public Long convert(Object obj) {
              return Long.parseLong((String) obj);
            }
          });
    } catch (AppEngineConfigException exc) {
      throw new AdminException("Error parsing YAML: " + reply, exc);
    } catch (HttpIoException exc) {
      if (exc.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND) {
        return new HashMap<String, Long>();
      }
      throw exc;
    }
  }

  /**
   * Generate a resource limits object for testing purposes.
   *
   * @param testValues A map of values to use.
   *
   * @return A ResourceLimits instance.
   */
  static ResourceLimits generate(Map<String, Long> testValues) {
    return new ResourceLimits(testValues);
  }
}
