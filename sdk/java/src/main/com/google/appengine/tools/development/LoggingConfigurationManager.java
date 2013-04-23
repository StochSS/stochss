package com.google.appengine.tools.development;

import com.google.common.annotations.VisibleForTesting;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.LogManager;
import java.util.logging.Logger;

/**
 * Manager for a web application's logging configurations.
 * <p>
 * When the web application is read from an EAR directory this supports
 * combining the logging configurations from each contained WAR directory. In
 * the case two configurations define the logging level for the same logger the
 * more verbose level applies.
 */
class LoggingConfigurationManager {
  @VisibleForTesting
  static final Logger LOGGER = Logger.getLogger(LoggingConfigurationManager.class.getName());
  public static final String LOGGING_CONFIG_FILE = "java.util.logging.config.file";
  private final Properties readProperties = new Properties();

  /**
   * Reads and remember the logging configuration for a single server. This
   * reads up to two files.
   * <ul>
   *
   * <li>
   * The file specified by the {@link #LOGGING_CONFIG_FILE}
   * property value from {@link #userSystemProperties} (from appengine-web.xml).
   * This interprets the file name in up to 3 ways looking for a valid
   * logging.properties file.
   * <ol>
   * <li> As an absolute file name.
   * <li> As a relative file name qualified by {@link #warDir}.
   * <li> As a relative file name qualified by {@link #externalResourceDir}.
   * </ol>
   * </li>
   *
   * <li>
   * The file specified by the {@link #LOGGING_CONFIG_FILE} property value
   * from  {@link SystemProperties} (from {@link System#getProperties}.
   * <li>The file specified by the {@link #LOGGING_CONFIG_FILE}
   * property value from {@link #userSystemProperties} (from appengine-web.xml).
   * This interprets the file name in up to 2 ways looking for a valid
   * logging.properties file.
   * <ol>
   * <li> As an absolute file name.
   * <li> As a relative file name qualified by {@link #warDir}.
   * </ol>
   * </li>
   *
   * </ul>
   * When the same multiple configurations specify the level for the same
   * logger, the more verbose level wins.
   * @param systemProperties
   * @param userSystemProperties
   */
  void read(Properties systemProperties,  Map<String, String> userSystemProperties,
      File warDir, File externalResourceDir) {
    String userConfigFile = userSystemProperties.get(LOGGING_CONFIG_FILE);

    boolean shouldLogWarning = (externalResourceDir == null);
    Properties userProperties = loadPropertiesFile(userConfigFile, warDir, shouldLogWarning);
    if (userProperties == null && externalResourceDir != null) {
      userProperties = loadPropertiesFile(userConfigFile, externalResourceDir, true);
    }
    String sdkConfigFile = systemProperties.getProperty(LOGGING_CONFIG_FILE);
    Properties sdkProperties = loadPropertiesFile(sdkConfigFile, warDir, true);
    if (sdkProperties != null) {
      mergeProperties(sdkProperties);
    }
    if (userProperties != null) {
      mergeProperties(userProperties);
    }
  }

  @VisibleForTesting
  Properties getReadProperties() {
    Properties result = new Properties();
    result.putAll(readProperties);
    return result;
  }

  /**
   * Updates the JVM's logging configuration based on the combined already read
   * logging configurations.
   */
  void updateLoggingConfiguration() {
    ByteArrayOutputStream out = new ByteArrayOutputStream();

    try {
      readProperties.store(out, null);
      LogManager.getLogManager().readConfiguration(new ByteArrayInputStream(out.toByteArray()));
    } catch (IOException e) {
      LOGGER.log(Level.WARNING, "Unable to configure logging properties.", e);
    }
  }

  private void mergeProperties(Properties additional) {
    for (Map.Entry<Object, Object> entry : additional.entrySet()){
      if (!(entry.getKey() instanceof String)) {
        continue;
      }
      String key = (String) entry.getKey();
      if (!(entry.getValue() instanceof String)) {
        continue;
      }
      String newValue = (String) entry.getValue();
      String oldValue = readProperties.getProperty(key);
      if (oldValue == null
          || !key.endsWith(".level")
          || compareLevels(newValue, oldValue) > 0) {
        readProperties.setProperty(key, newValue);
      }
    }
  }

  @VisibleForTesting
  int compareLevels(String levelName1, String levelName2) {
    if (levelName1.equals(levelName2)) {
      return 0;
    }
    Integer level1;
    try {
      level1 = Integer.valueOf(Level.parse(levelName1).intValue());
    } catch (IllegalArgumentException iae) {
      return -1;
    }
    Integer level2;
    try {
      level2 = Integer.valueOf(Level.parse(levelName2).intValue());
    } catch (IllegalArgumentException iae) {
      return 1;
    }
    return level2.compareTo(level1);

  }

  private static Properties loadPropertiesFile(String file, File appDir, boolean logWarning) {
    if (file == null) {
      return null;
    }
    file = file.replace('/', File.separatorChar);
    File f = new File(file);
    if (!f.isAbsolute()) {
      f = new File(appDir + File.separator + f.getPath());
    }
    InputStream inputStream = null;
    try {
      inputStream = new BufferedInputStream(new FileInputStream(f));
      Properties props = new Properties();
      props.load(inputStream);
      return props;
    } catch (IOException e) {
      if (logWarning) {
        LOGGER.log(Level.WARNING, "Unable to load properties file, " + f.getAbsolutePath(), e);
      }
      return null;
    } finally {
      if (inputStream != null) {
        try {
          inputStream.close();
        } catch (IOException e) {
          LOGGER.log(Level.WARNING, "Stream close failure", e);
        }
      }
    }
  }
}
