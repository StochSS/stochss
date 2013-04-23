// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * A helper class for reading and writing Services files.
 *
 * @see java.util.ServiceLoader
 *
 */
public class ServicesFile {

  public static final String SERVICES_PATH = "META-INF/services";

  private ServicesFile() {
  }

  /**
   * Returns an absolute path to a service file given the class
   * name of the service.
   *
   * @param serviceName not {@code null}
   * @return SERVICES_PATH + serviceName
   */
  public static String getPath(String serviceName) {
    return SERVICES_PATH + "/" + serviceName;
  }

  /**
   * Reads the set of service classes from a service file.
   *
   * @param input not {@code null}. Closed after use.
   * @return a not {@code null Set} of service class names.
   * @throws IOException
   */
  public static Set<String> readServiceFile(InputStream input) throws IOException {
    BufferedReader r = null;
    HashSet<String> serviceClasses = new HashSet<String>();
    try {
      r = new BufferedReader(new InputStreamReader(input, "UTF-8"));
      String line;
      while ((line = r.readLine()) != null) {
        int commentStart = line.indexOf('#');
        if (commentStart >= 0) {
          line = line.substring(0, commentStart);
        }
        line = line.trim();
        if (!line.equals("")) {
          serviceClasses.add(line);
        }
      }
    } finally {
      try {
        if (r != null) {
          r.close();
        }
      } catch (IOException e) {
      }
    }
    return serviceClasses;
  }

  /**
   * Writes the set of service class names to a service file.
   *
   * @param output not {@code null}. Not closed after use.
   * @param services a not {@code null Collection} of service class names.
   * @throws IOException
   */
  public static void writeServiceFile(Collection<String> services, OutputStream output) throws
      IOException {
    BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(output, "UTF-8"));
    for (String service : services) {
      writer.write(service);
      writer.newLine();
    }
    writer.flush();
  }
}
