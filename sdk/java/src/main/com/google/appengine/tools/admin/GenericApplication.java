// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ApplicationProcessingOptions;
import com.google.apphosting.utils.config.BackendsXml;
import com.google.apphosting.utils.config.CronXml;
import com.google.apphosting.utils.config.DosXml;
import com.google.apphosting.utils.config.IndexesXml;
import com.google.apphosting.utils.config.QueueXml;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * An App Engine application (may be Java/Python).
 *
 */
public interface GenericApplication {

  /**
   * Returns the application identifier
   * @return application identifier
   */
  public abstract String getAppId();

  /**
   * Returns the application version
   * @return application version
   */
  public abstract String getVersion();

  /**
   * Returns the application source-language or null if not specified.
   */
  public abstract String getSourceLanguage();

  /**
   * Returns the application server name or null if not specified.
   */
  public abstract String getServer();

  /**
   * Returns the application instance class name or null if not specified.
   */
  public abstract String getInstanceClass();

  /**
   * Returns whether precompilation is enabled for this application
   * @return precompilation setting
   */
  public abstract boolean isPrecompilationEnabled();

  /**
   * Returns the list of error handlers for this application
   * @return error handlers
   */
  public abstract List<ErrorHandler> getErrorHandlers();

  /**
   * Returns the mime-type if path corresponds to static content, {@code null} otherwise.
   * @return mime-type, possibly {@code null}
   */
  public abstract String getMimeTypeIfStatic(String path);

  /**
   * Returns the CronXml describing the applications' cron jobs.
   * @return a cron descriptor, possibly empty or {@code null}
   */
  public abstract CronXml getCronXml();

  /**
   * Returns the QueueXml describing the applications' task queues.
   * @return a queue descriptor, possibly empty or {@code null}
   */
  public abstract QueueXml getQueueXml();

  /**
   * Returns the DosXml describing the applications' DoS entries.
   * @return a dos descriptor, possibly empty or {@code null}
   */
  public abstract DosXml getDosXml();

  /**
   * Returns a string containing the applications' pagespeed.yaml configuration.
   * @return a pagespeed.yaml config, possibly empty or {@code null}
   */
  public abstract String getPagespeedYaml();

  /**
   * Returns the IndexesXml describing the applications' indexes.
   * @return an indexes descriptor, possibly empty or {@code null}
   */
  public abstract IndexesXml getIndexesXml();

  /**
   * Returns the BackendsXml describing the applications' backends.
   * @return a backends descriptor, possibly empty or {@code null}
   */
  public abstract BackendsXml getBackendsXml();

  /**
   * Returns the desired API version for the current application, or
   * {@code "none"} if no API version was used.
   *
   * @throws IllegalStateException if createStagingDirectory has not been called.
   */
  public abstract String getApiVersion();

  /**
   * Returns a path to an exploded WAR directory for the application.
   * This may be a temporary directory.
   *
   * @return a not {@code null} path pointing to a directory
   */
  public abstract String getPath();

  /**
   * Returns the staging directory, or {@code null} if none has been created.
   */
  public abstract File getStagingDir();

  public abstract void resetProgress();

  /**
   * Creates a new staging directory, if needed, or returns the existing one
   * if already created.
   *
   * @param opts User-specified options for processing the application.
   * @param resourceLimits Various resource limits provided by the cloud.
   * @return staging directory
   * @throws IOException
   */
  public abstract File createStagingDirectory(ApplicationProcessingOptions opts,
      ResourceLimits resourceLimits) throws IOException;

  /** deletes the staging directory, if one was created. */
  public abstract void cleanStagingDirectory();

  public abstract void setListener(UpdateListener l);

  public abstract void setDetailsWriter(PrintWriter detailsWriter);

  public abstract void statusUpdate(String message, int amount);

  public abstract void statusUpdate(String message);

  /**
   * Returns the yaml string describing this application's configuration.
   * @return application configuration yaml string
   */
  public abstract String getAppYaml();

  /**
   * Interface describing the application's error handlers.
   */
  public interface ErrorHandler {
    /** Returns the not {@code null} error handler file name. */
    public abstract String getFile();
    /** Returns the error code, possibly {@code null}. */
    public abstract String getErrorCode();
    /** Returns the not {@code null} error handler mime-type. */
    public abstract String getMimeType();
  }
}
