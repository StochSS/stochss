// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ApplicationProcessingOptions;
import com.google.appengine.tools.admin.AppAdminFactory.ConnectOptions;
import com.google.apphosting.utils.config.BackendsXml;
import com.google.apphosting.utils.config.BackendsYamlReader;
import com.google.apphosting.utils.config.CronXml;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.StringWriter;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Our implementation of the AppAdmin interface.
 *
 */
public class AppAdminImpl implements AppAdmin {

  private ConnectOptions options;
  private GenericApplication app;
  private PrintWriter errorWriter;
  private ApplicationProcessingOptions appOptions;
  private final Class<? extends AppVersionUpload> appVersionUploadClass;

  protected AppAdminImpl(ConnectOptions options, GenericApplication app, PrintWriter errorWriter,
      ApplicationProcessingOptions appOptions,
      Class<? extends AppVersionUpload> appVersionUploadClass) {
    this.options = options;
    this.app = app;
    this.errorWriter = errorWriter;
    this.appOptions = appOptions;
    this.appVersionUploadClass = appVersionUploadClass;
  }

  protected ServerConnection getServerConnection(ConnectOptions options) {
    return ServerConnectionFactory.getServerConnection(options);
  }

  @Override
  public void update(UpdateListener listener) {
    ServerConnection connection = getServerConnection(options);
    doUpdate(connection, listener, null);
    listener.onSuccess(new UpdateSuccessEvent(""));
  }

  @Override
  public void updateBackend(String backendName, UpdateListener listener) {
    ServerConnection connection = getServerConnection(options);
    doUpdate(connection, listener, backendName);
    listener.onSuccess(new UpdateSuccessEvent(""));
  }

  @Override
  public void updateBackends(List<String> backendNames, UpdateListener listener) {
    ServerConnection connection = getServerConnection(options);
    for (String backendName : backendNames) {
      doUpdate(connection, listener, backendName);
    }
    listener.onSuccess(new UpdateSuccessEvent(""));
  }

  @Override
  public void updateAllBackends(UpdateListener listener) {
    ServerConnection connection = getServerConnection(options);
    if (app.getBackendsXml() != null) {
      for (BackendsXml.Entry backend : app.getBackendsXml().getBackends()) {
        doUpdate(connection, listener, backend.getName());
      }
    }
    listener.onSuccess(new UpdateSuccessEvent(""));
  }

  @Override
  public void rollback() {
    rollbackBackend(null);
  }

  @Override
  public void rollbackBackend(String backend) {
    ServerConnection connection = getServerConnection(options);
    try {
      AppVersionUpload uploader = createAppVersionUpload(connection, app, backend);
      uploader.forceRollback();
    } catch (Throwable t) {
      errorWriter.println("Unable to rollback:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to rollback app: " + t.getMessage(), t);
    }
  }

  @Override
  public void rollbackAllBackends() {
    ServerConnection connection = getServerConnection(options);
    if (app.getBackendsXml() != null) {
      try {
        for (BackendsXml.Entry backend : app.getBackendsXml().getBackends()) {
          AppVersionUpload uploader = createAppVersionUpload(connection, app, backend.getName());
          uploader.forceRollback();
        }
      } catch (Throwable t) {
        errorWriter.println("Unable to rollback:");
        t.printStackTrace(errorWriter);
        throw new AdminException("Unable to rollback app: " + t.getMessage(), t);
      }
    }
  }

  @Override
  public void setBackendState(String backendName, BackendsXml.State newState) {
    String url;
    switch (newState) {
      case START:
        url = "/api/backends/start";
        break;
      case STOP:
        url = "/api/backends/stop";
        break;
      default:
        throw new IllegalArgumentException("Cannot change to state: " + newState);
    }

    ServerConnection connection = getServerConnection(options);
    try {
      connection.post(url, "", "app_id", app.getAppId(), "backend", backendName);
    } catch (Throwable t) {
      errorWriter.println("Unable to change backend state:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to change backend state: " + t.getMessage(), t);
    }
  }

  @Override
  public List<BackendsXml.Entry> listBackends() {
    ServerConnection connection = getServerConnection(options);
    try {
      String yaml = connection.post("/api/backends/list", "", "app_id", app.getAppId());
      if (yaml.contains("No backends configured")) {
        return Collections.<BackendsXml.Entry>emptyList();
      } else {
        BackendsXml xml = BackendsYamlReader.parse(yaml);
        return xml.getBackends();
      }
    } catch (Throwable t) {
      errorWriter.println("Unable to list backends:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to list backends: " + t.getMessage(), t);
    }
  }

  @Override
  public void deleteBackend(String backendName) {
    ServerConnection connection = getServerConnection(options);
    try {
      connection.post("/api/backends/delete", "", "app_id", app.getAppId(), "backend", backendName);
    } catch (Throwable t) {
      errorWriter.println("Unable to delete backend:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to delete backend: " + t.getMessage(), t);
    }
  }

  @Override
  public void configureBackend(String backendName) {
    ServerConnection connection = getServerConnection(options);
    try {
      connection.post("/api/backends/configure", app.getBackendsXml().toYaml(),
                      "app_id", app.getAppId(), "backend", backendName);
    } catch (Throwable t) {
      errorWriter.println("Unable to configure backend:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to configure backend: " + t.getMessage(), t);
    }
  }

  private void changeServerState(String url) {
    ServerConnection connection = getServerConnection(options);
    try {
      connection.post(url,
                      "",
                      "app_id", app.getAppId(),
                      "server", app.getServer() != null ? app.getServer() : "",
                      "version", app.getVersion());
    } catch (Throwable t) {
      errorWriter.println("Unable to change server state:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to change server state: " + t.getMessage(), t);
    }
  }

  @Override
  public void startServer() {
    changeServerState("/api/servers/start");
  }

  @Override
  public void stopServer() {
    changeServerState("/api/servers/stop");
  }

  @Override
  public void updateIndexes() {
    ServerConnection connection = getServerConnection(options);
    try {
      AppVersionUpload uploader = createAppVersionUpload(connection, app, null);
      uploader.updateIndexes();
    } catch (Throwable t) {
      errorWriter.println("Unable to update indexes:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to update indexes for app: " + t.getMessage(), t);
    }
  }

  @Override
  public void updateCron() {
    ServerConnection connection = getServerConnection(options);
    try {
      AppVersionUpload uploader = createAppVersionUpload(connection, app, null);
      uploader.updateCron();
    } catch (Throwable t) {
      errorWriter.println("Unable to update cron entries:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to update cron entries for app: " + t.getMessage(), t);
    }
  }

  @Override
  public void updateQueues() {
    ServerConnection connection = getServerConnection(options);
    try {
      AppVersionUpload uploader = createAppVersionUpload(connection, app, null);
      uploader.updateQueue();
    } catch (Throwable t) {
      errorWriter.println("Unable to upload:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to update task queues for app: " + t.getMessage(), t);
    }
  }

  @Override
  public void updateDos() {
    ServerConnection connection = getServerConnection(options);
    try {
      AppVersionUpload uploader = createAppVersionUpload(connection, app, null);
      uploader.updateDos();
    } catch (Throwable t) {
      errorWriter.println("Unable to update DoS entries:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to update DoS entries for app: " + t.getMessage(), t);
    }
  }

  @Override
  public void setDefaultVersion() {
    ServerConnection connection = getServerConnection(options);
    try {
      AppVersionUpload uploader = createAppVersionUpload(connection, app, null);
      uploader.setDefaultVersion();
    } catch (Throwable t) {
      errorWriter.println("Unable to set default version:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to set default version for app: " + t.getMessage(), t);
    }
  }

  @Override
  public List<CronEntry> cronInfo() {
    try {
      List<CronEntry> result = new ArrayList<CronEntry>();

      CronXml cron = app.getCronXml();
      if (cron == null) {
        return result;
      }
      for (CronXml.Entry entry : cron.getEntries()) {
        result.add(new CronEntryImpl(entry.getUrl(), entry.getDescription(), entry.getSchedule(),
            entry.getTimezone()));
      }
      return result;
    } catch (Throwable t) {
      errorWriter.println("Unable to display run times for cron entries:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to display run times for cron entries for app: "
          + t.getMessage(), t);
    }
  }

  @Override
  public ResourceLimits getResourceLimits() {
    ServerConnection connection = getServerConnection(options);
    try {
      return ResourceLimits.request(connection, app);
    } catch (Throwable t) {
      errorWriter.println("Unable to get resource limits:");
      t.printStackTrace(errorWriter);
      throw new AdminException("Unable to get resource limits: "
          + t.getMessage(), t);
    }
  }

  @Override
  public void vacuumIndexes(ConfirmationCallback<IndexDeleter.DeleteIndexAction> callback,
      UpdateListener listener) {
    String appID = app.getAppId();
    if (null == appID || appID.isEmpty()) {
      String message = "This application does not have an ID.";
      String detailMessage =
          "The vacuum_indexes operation may not be performed for"
              + " an application that does not have an ID.";
      AdminException e = new AdminException(message);
      listener.onFailure(new UpdateFailureEvent(e, message, detailMessage));
      throw e;
    }
    ServerConnection connection = getServerConnection(options);
    IndexDeleter deleter = new IndexDeleter(connection, app, callback, errorWriter, listener);
    try {
      deleter.deleteUnusedIndexes();
    } catch (Exception e) {
      String message = "Unable to perform vacuum_indexes";
      listener.onFailure(new UpdateFailureEvent(e, message, e.getMessage()));
      throw new AdminException(message, e);
    }
  }

  @Override
  public Reader requestLogs(int numDays, LogSeverity severity) {
    ServerConnection connection = getServerConnection(options);
    try {
      File logFile = File.createTempFile(app.getAppId() + "-" + app.getVersion(), ".log");
      logFile.deleteOnExit();
      LogFetcher logFetcher = new LogFetcher(app, connection);
      logFetcher.fetch(numDays, severity, new FileOutputStream(logFile));
      return new BufferedReader(new FileReader(logFile));
    } catch (Exception ex) {
      throw new AdminException("Unable to retrieve the remote application logs:", ex);
    }
  }

  /**
   * Deploy a new version of this application. If successful, this method will
   * return without throwing an exception but will not call
   * {@link UpdateListener#onSuccess(UpdateSuccessEvent)}. The caller is responsible for
   * calling that method.
   */
  private void doUpdate(ServerConnection connection, UpdateListener listener, String backend) {
    StringWriter detailsWriter = new StringWriter();
    try {
      AppVersionUpload uploader = createAppVersionUpload(connection, app,
          backend);
      ResourceLimits resourceLimits = ResourceLimits.request(connection, app);
      app.resetProgress();
      app.setListener(listener);
      app.setDetailsWriter(new PrintWriter(detailsWriter, true));
      app.createStagingDirectory(appOptions, resourceLimits);
      uploader.doUpload(resourceLimits);
    } catch (Throwable t) {
      errorWriter.println("Unable to update:");
      t.printStackTrace(errorWriter);
      listener.onFailure(new UpdateFailureEvent(t, t.toString(), detailsWriter.toString()));
      throw new AdminException("Unable to update app: " + t.getMessage(), t);
    }
  }

  private AppVersionUpload createAppVersionUpload(ServerConnection connection,
      GenericApplication app, String backend) throws Exception {
    Constructor<? extends AppVersionUpload> constructor =
        appVersionUploadClass.getConstructor(ServerConnection.class, GenericApplication.class,
            String.class, Boolean.TYPE);
    return constructor.newInstance(connection, app, backend, appOptions.isBatchModeSet());
  }
}
