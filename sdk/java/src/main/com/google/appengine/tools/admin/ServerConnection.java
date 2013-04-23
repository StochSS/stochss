// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * Interface for connections to the AppEngine hosting service.
 * 
 */
public interface ServerConnection {

  String get(String url, Map<String, String> params) throws IOException;

  String post(String url, File payload, String contentType, Map<String, String> params)
      throws IOException;

  String post(String url, File payload, String contentType, String... params) throws IOException;

  String post(String url, List<AppVersionUpload.FileInfo> payload, String... params)
      throws IOException;

  String post(String url, String payload, Map<String, String> params) throws IOException;

  String post(String url, String payload, String... params) throws IOException;
  
  /**
   * Returns an input stream that reads from this open connection. If the server returned
   * an error (404, etc), return the error stream instead.
   * 
   * @return {@code InputStream} for the server response.
   */
  InputStream postAndGetInputStream(String url, String payload, String... params)
      throws IOException;
}
