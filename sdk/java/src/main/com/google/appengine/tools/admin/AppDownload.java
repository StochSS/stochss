// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.ServerConnection;
import com.google.appengine.tools.admin.UpdateFailureEvent;
import com.google.appengine.tools.admin.UpdateListener;
import com.google.appengine.tools.admin.UpdateProgressEvent;
import com.google.appengine.tools.admin.UpdateSuccessEvent;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Class to download application code.
 *
 */
public class AppDownload {

  private ServerConnection connection;
  private UpdateListener listener;
  private int downloadProgress;
  private static final char NEWLINE = '\n';

  public AppDownload(ServerConnection connection, UpdateListener listener) {
    this.connection = connection;
    this.listener = listener;
  }

  private void reportProgress(String message) {
    if (listener != null) {
      listener.onProgress(new UpdateProgressEvent(
                              Thread.currentThread(), message, downloadProgress));
    }
  }

  private void reportSuccess(String message) {
    if (listener != null) {
      listener.onSuccess(new UpdateSuccessEvent(message));
    }
  }

  private void reportFailure(String message) {
    reportFailure(message, "");
  }

  private void reportFailure(String message, String details) {
    if (listener != null) {
      listener.onFailure(new UpdateFailureEvent(null, message, details));
    }
  }

  private boolean downloadFile(File outDir, String appId, String appVersion, String fileId,
                               int fileSize, String filePath) {
    BufferedInputStream fileStream;
    try {
       fileStream = new BufferedInputStream(
         connection.postAndGetInputStream("/api/files/get", "", "app_id", appId,
           "version", appVersion, "id", fileId));
    } catch (IOException ioe) {
      reportFailure("Unable to download file " + filePath, ioe.getMessage());
      return false;
    }

    File outFile = new File(outDir, filePath);
    File parentDir = outFile.getParentFile();
    if (parentDir != null) {
      try {
        parentDir.mkdirs();
      } catch (SecurityException se) {
        reportFailure("Could not create directory " + parentDir.getPath(), se.getMessage());
        return false;
      }
    }

    int downloadedFileSize = 0;
    try {
      byte[] b = new byte[4096];
      FileOutputStream outStream = new FileOutputStream(outFile);
      int len;
      while ((len = fileStream.read(b)) != -1) {
        outStream.write(b, 0, len);
        downloadedFileSize += len;
      }
      outStream.close();
    } catch (FileNotFoundException fnfe) {
      reportFailure("Could not create file " + outFile.getPath(), fnfe.getMessage());
      return false;
    } catch (IOException ioe) {
      reportFailure("Could not write to file " + outFile.getPath(), ioe.getMessage());
      return false;
    }

    if (downloadedFileSize != fileSize) {
      reportFailure("File " + filePath + ": server listed as " + fileSize
        + " bytes but served " + downloadedFileSize + " bytes.");
      return false;
    }

    return true;
  }

  public boolean download(String appId, String server, String appVersion, File outDir) {
    downloadProgress = 0;

    if (outDir.exists()) {
      if (outDir.isFile()) {
        reportFailure("Cannot download to path \"" + outDir.getPath()
          + "\": there's a file in the way.");
        return false;
      }
      if (outDir.list().length > 0) {
        reportFailure("Cannot download to path \"" + outDir.getPath()
          + "\": directory already exists and it isn't empty.");
        return false;
      }
    }

    reportProgress("Fetching file list...");
    Map<String, String> urlArgs = new HashMap<String, String>();
    urlArgs.put("app_id", appId);
    if (server != null) {
      urlArgs.put("server", server);
    }
    if (appVersion != null) {
      urlArgs.put("version_match", appVersion);
    }
    String response;
    try {
      response = connection.post("/api/files/list", "", urlArgs);
    } catch (IOException ioe) {
      reportFailure("Unable to fetch file list.", ioe.getMessage());
      return false;
    }
    String[] lines = response.split("" + NEWLINE);
    if (lines.length < 1) {
      reportFailure("Invalid response from server: empty");
      return false;
    }
    String fullAppVersion = lines[0];

    reportProgress("Fetching files...");
    for (int i = 1; i < lines.length; i++) {
      String[] parts = lines[i].split("\\|");
      if (parts.length != 3) {
        reportFailure("Invalid response from server: expecting \"<id>|<size>|<path>\", "
          + "found: " + lines[i]);
        return false;
      }
      String fileId = parts[0];
      int fileSize;
      try {
        fileSize = Integer.parseInt(parts[1]);
      } catch (NumberFormatException nfe) {
        reportFailure("Invalid file list entry from server: invalid size: " + parts[1],
          nfe.getMessage());
        return false;
      }
      String filePath = parts[2];

      reportProgress("[" + i + "/" + (lines.length - 1) + "] " + filePath);
      if (!downloadFile(outDir, appId, fullAppVersion, fileId, fileSize, filePath)) {
        return false;
      }
      downloadProgress = (100 * i) / (lines.length - 1);
    }

    reportSuccess("");
    return true;
  }
}
