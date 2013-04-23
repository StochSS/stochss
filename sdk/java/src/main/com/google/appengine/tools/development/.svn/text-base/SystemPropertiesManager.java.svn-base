package com.google.appengine.tools.development;

import com.google.appengine.api.utils.SystemProperty;
import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.common.annotations.VisibleForTesting;

import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

import javax.annotation.concurrent.GuardedBy;

/**
 * Manager for a web applications System Properties.
 * <p>
 * In production each Server Instance has its own independent System Properties.
 * In the Java Development Server the System Properties are shared.
 * <p>
 * We modify the system properties when the dev appserver is launched using
 * key/value pairs defined in appengine-web.xml. This can make it very easy to
 * leak state across tests that launch instances of the dev appserver, so we
 * keep track of the original values all system properties at start-up.
 * We then restore the values when we shutdown the server.
 *
 */
public class SystemPropertiesManager {
  private static final Logger LOGGER = Logger.getLogger(SystemPropertiesManager.class.getName());

  @GuardedBy("this")
  private final Map<String, File> propertyNameToFileMap;
  @GuardedBy("this")
  private final Properties originalSystemProperties;

  SystemPropertiesManager() {
    propertyNameToFileMap = new HashMap<String, File>();
    originalSystemProperties = new Properties();
    originalSystemProperties.putAll(System.getProperties());
  }

  Properties getOriginalSystemProperties() {
    Properties result =  new Properties();
    result.putAll(originalSystemProperties);
    return result;
  }

  /**
   * Sets {@link SystemProperty} values for the current application.
   * <p>
   * In a single server application (loaded from a single WAR):
   * <ol>
   * <b>appId</b> should be set to {@link AppEngineWebXml#getAppId()}
   * </li>.
   * <li>
   * <b>majorVersionId</b> should be set to the {@link
   * com.google.apphosting.utils.config.AppEngineWebXml#getMajorVersionId()}.
   * </li>
   * </ol>
   * <p>
   * In a multi server application (loaded from an EAR):
   * <ol>
   * <li>
   * <b>appId</b> should be set to {@link
   * com.google.apphosting.utils.config.AppEngineApplicationXml#getApplicationId()}
   * </li>.
   * <li>
   * <b>majorVersionId</b> should be set to the {@link AppEngineWebXml#getMajorVersionId()}
   * for the first web application in the EAR directory according to
   * {@link com.google.apphosting.utils.config.EarHelper#readEarInfo(String)}.
   * This setting is for compatibility purposes. The value may not match the
   * configuration for all servers in cases different servers have different
   * major versions.
   * </li>
   * @param release the SDK release (SdkInfo.getLocalVersion().getRelease()).
   * @param applicationId the application id.
   * @param majorVersionId the application version.
   */
  public void setAppengineSystemProperties(String release, String applicationId,
      String majorVersionId) {
    SystemProperty.environment.set(SystemProperty.Environment.Value.Development);
    if (release == null) {
      release = "null";
    }
    SystemProperty.version.set(release);
    SystemProperty.applicationId.set(applicationId);
    SystemProperty.applicationVersion.set(majorVersionId + ".1");
  }

  public synchronized void setSystemProperties(AppEngineWebXml appEngineWebXml,
      File appengineWebXmlFile) throws AppEngineConfigException {
    Map<String, String> originalSystemProperties = copySystemProperties();

    for (Map.Entry<String, String> entry : appEngineWebXml.getSystemProperties().entrySet()) {
      if (propertyNameToFileMap.containsKey(entry.getKey())
          && !entry.getValue().equals(System.getProperty(entry.getKey()))
          && !propertyNameToFileMap.get(entry.getKey()).equals(appengineWebXmlFile)) {
        String template = "Property %s is defined in %s and in %s with different values. "
            + "Currently Java Development Server requires matching values.";
        String message = String.format(template, entry.getKey(),
            appengineWebXmlFile.getAbsolutePath(), propertyNameToFileMap.get(entry.getKey()));
        LOGGER.severe(message);
        throw new AppEngineConfigException(message);
      }
      if (originalSystemProperties.containsKey(entry.getKey())) {
        String message = String.format(
            "Overwriting system property key '%s', value '%s' with value '%s' from '%s'",
            entry.getKey(), originalSystemProperties.get(entry.getKey()),
                entry.getValue(), appengineWebXmlFile.getAbsolutePath());
        LOGGER.info(message);
      }
    }

    for (Iterator<Map.Entry<String, File>> iterator =
        propertyNameToFileMap.entrySet().iterator();
        iterator.hasNext();) {
      Map.Entry<String, File> entry = iterator.next();
      if (entry.getValue().equals(appengineWebXmlFile.getAbsolutePath())) {
        iterator.remove();
      }
    }

    for (Map.Entry<String, String> entry : appEngineWebXml.getSystemProperties().entrySet()) {
      propertyNameToFileMap.put(entry.getKey(), appengineWebXmlFile);
    }
    System.getProperties().putAll(appEngineWebXml.getSystemProperties());
  }

  /**
   * Clears system properties we set in {@link #setSystemProperties}. Also,
   * restores system properties to their values at the time this
   * {@link SystemPropertiesManager} was constructed. Additional system
   * properties added after this {@link SystemPropertiesManager} was
   * constructed are not cleared for historical reasons.
   * <p>
   * Note that restoring system properties that have been set by non-user
   * code we did not write could theoretically affect behavior.
   */
  public synchronized void restoreSystemProperties () {
    for (String key : propertyNameToFileMap.keySet()) {
      System.clearProperty(key);
    }

    propertyNameToFileMap.clear();

    System.getProperties().putAll(originalSystemProperties);
  }

  /**
   * Returns a map with a copy of return value from {@link System#getProperties()}.
   */
  @VisibleForTesting
  static Map<String, String> copySystemProperties() {
    HashMap<String, String> copy = new HashMap<String, String>();
    for (String key : System.getProperties().stringPropertyNames()) {
      copy.put(key, System.getProperties().getProperty(key));
    }
    return copy;
  }
}
