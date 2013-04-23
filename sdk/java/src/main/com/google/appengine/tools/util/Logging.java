// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.util;

import com.google.appengine.tools.info.SdkImplInfo;

import java.io.File;
import java.util.logging.LogManager;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A utility class for working with Logging.
 *
 */
public class Logging {

  public static final String LOGGING_CONFIG_FILE = "java.util.logging.config.file";

  private static final Logger log = Logger.getLogger(Logging.class.getName());

  /**
   * Initializes logging if the system property, {@link #LOGGING_CONFIG_FILE},
   * has not been set. Also sets the system property to the default SDK
   * logging config file.
   * <p>
   * Since this property re-initializes the entire logging system,
   * it should generally only be used from the entry point of an application
   * rather than from arbitrary code.
   */
  public static void initializeLogging() {
    String logConfig = System.getProperty(LOGGING_CONFIG_FILE);
    if (logConfig == null) {
      File config = SdkImplInfo.getLoggingProperties();
      System.setProperty(LOGGING_CONFIG_FILE, config.getAbsolutePath());
      try {
        LogManager.getLogManager().readConfiguration();
      } catch (Exception e) {
        log.log(Level.INFO, "Failed to read the default logging configuration", e);
      }
    }
  }

  private Logging() {
  }
}
