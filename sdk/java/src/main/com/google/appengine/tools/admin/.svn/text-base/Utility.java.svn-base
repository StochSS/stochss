// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import java.io.File;

/**
 * Utility methods for this package.
 *
 */
public class Utility {

  private static final String FORWARD_SLASH = "/";

  /**
   * Attempts to find a symlink executable, since Java doesn't natively
   * support them but we don't like excessive copying.
   *
   * @return either {@code null} if no links can be made, or an executable
   *   program that we believe will make symlinks.
   */
  public static File findLink() {
    File ln = null;
    if (isOsUnix()) {
      ln = new File("/bin/ln");
      if (!ln.exists()) {
        ln = new File("/usr/bin/ln");
        if (!ln.exists()) {
          ln = null;
        }
      }
    }
    return ln;
  }

  /**
   * Test for Unix (to include MacOS), vice Windows.
   */
  public static boolean isOsUnix() {
    return File.separator.equals(FORWARD_SLASH);
  }

  /**
   * Test for Windows, vice Unix (to include MacOS).
   */
  public static boolean isOsWindows() {
    return !isOsUnix();
  }

  public static String calculatePath(File f, File base) {
    int offset = base.getPath().length();
    String path = f.getPath().substring(offset);
    if (File.separatorChar == '\\') {
      path = path.replace('\\', '/');
    }

    for (offset = 0; path.charAt(offset) == '/'; ++offset) {
    }
    if (offset > 0) {
      path = path.substring(offset);
    }

    return path;
  }

  private Utility() {
  }
}
