// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.info;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.Date;
import java.util.Set;
import java.util.HashSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.net.URL;

/**
 * {@code RemoteVersionFactory} generates {@link Version} objects that
 * represents the release information for the latest release available
 * on a remote server.
 *
 * <p>Along with gathering release information from the remote server,
 * this class also uploads the local SDK release information to the
 * remote server.
 *
 */
public class RemoteVersionFactory {
  private static final Pattern RELEASE_RE =
      Pattern.compile("^release: *[\"'](.*)[\"']$");
  private static final Pattern TIMESTAMP_RE =
      Pattern.compile("^timestamp: *(\\d+)$");
  private static final Pattern API_VERSIONS_RE =
      Pattern.compile("^api_versions: \\[[\"'](.*)[\"']\\]$");
  private static final Pattern API_VERSION_SPLIT_RE =
      Pattern.compile("[\"'], *[\"']");

  private static final Logger logger =
      Logger.getLogger(RemoteVersionFactory.class.getName());

  private final Version localVersion;
  private final String server;
  private final boolean secure;

  /**
   * Creates a {@code RemoteVersionFactory} that will upload {@code
   * localVersion} to {@code server} and download the latest release
   * information.
   *
   * @param secure if {@code true}, connect to the {@code server}
   *     using https, otherwise connect with http.
   */
  public RemoteVersionFactory(Version localVersion, String server,
      boolean secure) {
    if (server == null) {
      throw new NullPointerException("No server specified.");
    }

    this.localVersion = localVersion;
    this.server = server;
    this.secure = secure;
  }

  public Version getVersion() {
    URL checkUrl;
    try {
      checkUrl = buildCheckURL();
    } catch (IOException ex) {
      logger.log(Level.INFO, "Unable to build remote version URL:", ex);
      return Version.UNKNOWN;
    }

    try {
      InputStream stream = checkUrl.openStream();
      try {
        return parseVersionResult(stream);
      } finally {
        stream.close();
      }
    } catch (IOException ex) {
      logger.log(Level.INFO, "Unable to access " + checkUrl, ex);
      return Version.UNKNOWN;
    }
  }

  URL buildCheckURL() throws IOException {
    StringBuilder buffer = new StringBuilder();
    buffer.append(secure ? "https://" : "http://");
    buffer.append(server);
    buffer.append("/api/updatecheck?runtime=java");
    if (localVersion.getRelease() != null) {
      buffer.append("&release=");
      buffer.append(localVersion.getRelease());
    }
    if (localVersion.getTimestamp() != null) {
      buffer.append("&timestamp=");
      buffer.append(localVersion.getTimestamp().getTime() / 1000);
    }
    if (localVersion.getApiVersions() != null) {
      buffer.append("&api_versions=[");

      boolean first = true;
      for (String apiVersion : localVersion.getApiVersions()) {
        if (first) {
          first = false;
        } else {
          buffer.append(", ");
        }
        buffer.append("'" + apiVersion + "'");
      }
      buffer.append("]");
    }
    return new URL(buffer.toString());
  }

  static Version parseVersionResult(InputStream stream) throws IOException {
    BufferedReader reader = new BufferedReader(new InputStreamReader(stream));

    String release = null;
    Date timestamp = null;
    Set<String> apiVersions = null;

    String line;
    while ((line = reader.readLine()) != null) {
      {
        Matcher match = RELEASE_RE.matcher(line);
        if (match.matches()) {
          release = match.group(1);
        }
      }
      {
        Matcher match = TIMESTAMP_RE.matcher(line);
        if (match.matches()) {
          timestamp = new Date(Long.valueOf(match.group(1)) * 1000);
        }
      }
      {
        Matcher match = API_VERSIONS_RE.matcher(line);
        if (match.matches()) {
          apiVersions = new HashSet<String>();
          for (String version : API_VERSION_SPLIT_RE.split(match.group(1))) {
            apiVersions.add(version);
          }
        }
      }
    }
    return new Version(release, timestamp, apiVersions);
  }
}
