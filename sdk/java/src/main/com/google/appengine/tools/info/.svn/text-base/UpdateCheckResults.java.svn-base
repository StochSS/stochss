// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.info;

import java.util.Set;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

/**
 * Makes information about the local SDK version and the latest remote
 * version available.
 *
 */
public class UpdateCheckResults {
  private static final VersionComparator COMPARATOR = new VersionComparator();

  private final Version localVersion;
  private final Version remoteVersion;

  UpdateCheckResults(Version localVersion, Version remoteVersion) {
    this.localVersion = localVersion;
    this.remoteVersion = remoteVersion;
  }

  /**
   * Returns a {@link Version} for the current local SDK.
   */
  public Version getLocalVersion() {
    return localVersion;
  }

  /**
   * Returns a {@link Version} for the remote servers.
   */
  public Version getRemoteVersion() {
    return remoteVersion;
  }

  /**
   * Returns true if there is a newer SDK release available on the
   * remote server.
   */
  public boolean isNewerReleaseAvailable() {
    String localRelease = localVersion.getRelease();
    String remoteRelease = remoteVersion.getRelease();

    if (localRelease != null && remoteRelease != null) {
      return COMPARATOR.compare(remoteRelease, localRelease) > 0;
    } else {
      return false;
    }
  }

  /**
   * Returns true if the server supports a new API version that the
   * local SDK does not.
   */
  public boolean isNewerApiVersionAvailable() {
    Set<String> localApiVersions = localVersion.getApiVersions();
    Set<String> remoteApiVersions = remoteVersion.getApiVersions();

    if (localApiVersions != null && remoteApiVersions != null) {
      if (localApiVersions.isEmpty()) {
        return false;
      }

      List<String> sortedApiVersions = new ArrayList<String>(remoteApiVersions);
      Collections.sort(sortedApiVersions, COMPARATOR);
      String largestVersion = sortedApiVersions.get(sortedApiVersions.size() - 1);
      return !localApiVersions.contains(largestVersion);
    } else {
      return false;
    }
  }

  /**
   * Returns true if the server does not support any of the API
   * versions supported by the local SDK.
   */
  public boolean isLocalApiVersionNoLongerSupported() {
    Set<String> localApiVersions = localVersion.getApiVersions();
    Set<String> remoteApiVersions = remoteVersion.getApiVersions();

    if (localApiVersions != null && remoteApiVersions != null) {
      if (localApiVersions.isEmpty()) {
        return false;
      }

      return Collections.disjoint(localApiVersions, remoteApiVersions);
    } else {
      return false;
    }
  }

  /**
   * Returns true if {@code apiVersion} is supported on the server.
   */
  public boolean isApiVersionSupportedRemotely(String apiVersion) {
    Set<String> remoteApiVersions = remoteVersion.getApiVersions();
    if (remoteApiVersions != null) {
      return remoteApiVersions.contains(apiVersion);
    } else {
      return true;
    }
  }

  /**
   * Returns true if {@code apiVersion} is supported by the local SDK.
   */
  public boolean isApiVersionSupportedLocally(String apiVersion) {
    Set<String> localApiVersions = localVersion.getApiVersions();
    if (localApiVersions != null) {
      return localApiVersions.contains(apiVersion);
    } else {
      return true;
    }
  }

  /**
   * {@code VersionComparator} compares strings that represent dotted
   * version numbers (e.g. "1.1.2").  These string are compared using
   * the ordering laid out in the <a
   * href="http://java.sun.com/jse/1.5.0/docs/guide/versioning/spec/versioning2.html#wp90779">Specification
   * Versioning section of the Java Production Versioning Guide</a>.
   */
  public static class VersionComparator implements Comparator<String> {
    public int compare(String string1, String string2) throws NumberFormatException {
      String[] array1 = string1.split("\\.");
      String[] array2 = string2.split("\\.");

      for (int i = 0; i < Math.max(array1.length, array2.length); i++) {
        int i1 = (i < array1.length) ? Integer.parseInt(array1[i]) : 0;
        int i2 = (i < array2.length) ? Integer.parseInt(array2[i]) : 0;
        if (i1 != i2) {
          return i1 - i2;
        }
      }
      return 0;
    }
  }
}
