// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.info;

import java.io.File;
import java.io.FileFilter;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

/**
 * {@code UpdateCheck} is responsible for gathering version
 * information about the local SDK, uploading this information to
 * Google's servers in exchange for information about the latest
 * version available, and making both sets of information available
 * programmatically via {@link UpdateCheckResults} and for direct user
 * consumption via a nag screen printed to a specified {@link
 * PrintStream}.
 *
 */
public class UpdateCheck {
  private static final Logger logger = Logger.getLogger(UpdateCheck.class.getName());

  /**
   * Nag the user no more frequently than once per week.
   */
  private static final long MAX_NAG_FREQUENCY = 60 * 60 * 24 * 7;

  /**
   * Users can create this file in their home directories to disable
   * the check for updates and nag screens.
   */
  private static final String OPT_OUT_FILE = ".appcfg_no_nag";

  private final String server;
  private final File appDirectory;
  private final Preferences prefs;
  private final boolean secure;

  /**
   * Create a new {@code UpdateCheck}.
   *
   * @param server The remote server to connect to when retrieving
   * remote version information.
   */
  public UpdateCheck(String server) {
    this(server, null, false);
  }

  /**
   * Create a new {@code UpdateCheck}.
   *
   * @param server The remote server to connect to when retrieving
   * remote version information.
   * @param appDirectory The application directory that you plan to
   * test or publish, or {@code null} if no application directory is
   * available.
   * @param secure if {@code true}, use an https (instead of http)
   * connection to the remote server.
   */
  public UpdateCheck(String server, File appDirectory, boolean secure) {
    this.server = server;
    this.appDirectory = appDirectory;
    this.secure = secure;
    prefs = Preferences.userNodeForPackage(UpdateCheck.class);
  }

  /**
   * Returns true if the user wants to check for updates even when we
   * don't need to.  We assume that users will want this
   * functionality, but they can opt out by creating an .appcfg_no_nag
   * file in their home directory.
   */
  public boolean allowedToCheckForUpdates() {
    File optOutFile = new File(System.getProperty("user.home"), OPT_OUT_FILE);
    return !optOutFile.exists();
  }

  /**
   * Check to see if there is a new version of the SDK available and
   * return a {@link UpdateCheckResults} summarizing the results.
   *
   * <p>Callers that do not already communicate with Google explicitly
   * (e.g. the DevAppServer) should check {@code
   * allowedToCheckForUpdates} before calling this method.
   */
  public UpdateCheckResults checkForUpdates() {
    Version localVersion = getLocalVersion();
    logger.fine("Local Version: " + localVersion);

    Version remoteVersion = new RemoteVersionFactory(localVersion, server, secure).getVersion();
    logger.fine("Remote Version: " + remoteVersion);

    return new UpdateCheckResults(localVersion, remoteVersion);
  }

  /**
   * Gets the local version for the purposes of the update check.  If
   * an application directory was specified, the jars in that
   * directory will be examined.  Otherwise, the user jars provided
   * with the SDK will be used.
   */
  Version getLocalVersion() {
    if (appDirectory != null) {
      File libDir = new File(new File(appDirectory, "WEB-INF"), "lib");
      if (libDir.exists()) {
        File[] libFiles = libDir.listFiles(new FileFilter() {
            public boolean accept(File file) {
              String lowercasePath = file.getPath().toLowerCase();
              return lowercasePath.endsWith(".jar") || lowercasePath.endsWith(".zip");
            }
        });
        if (libFiles != null) {
          return new LocalVersionFactory(Arrays.asList(libFiles)).getVersion();
        }
      }
    }
    return SdkInfo.getLocalVersion();
  }

  /**
   * Check to see if there is a new version of the SDK available and,
   * if sufficient time has passed since the last nag, print a nag
   * screen to {@code out}.  This method always errs on the side of
   * not nagging the user if errors are encountered.
   *
   * <p>Callers that do not already communicate with Google explicitly
   * (e.g. the DevAppServer) should check {@code
   * allowedToCheckForUpdates} before calling this method.
   *
   * @return true if a nag screen was printed, false otherwise
   */
  public boolean maybePrintNagScreen(PrintStream out) {
    if (doNagScreen(out)) {
      prefs.putLong("lastNagTime", System.currentTimeMillis());
      try {
        prefs.flush();
      } catch (BackingStoreException ex) {
        logger.log(Level.WARNING, "Could not update last nag time:", ex);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns true if enough time has elapsed since we last nagged the
   * user that we can nag them again.
   */
  private boolean canNagUser() {
    try {
      prefs.sync();
    } catch (BackingStoreException ex) {
      logger.log(Level.WARNING, "Could not sync last nag time:", ex);
    }

    long lastNagTime = prefs.getLong("lastNagTime", 0);
    return (System.currentTimeMillis() - lastNagTime) > MAX_NAG_FREQUENCY;
  }

  private boolean doNagScreen(PrintStream out) {
    UpdateCheckResults results = checkForUpdates();

    if (!canNagUser()) {
      return false;
    }

    if (results.isLocalApiVersionNoLongerSupported()) {
      printNagMessage("The API version in this SDK is no longer supported on the server!",
                      out, results);
      return true;
    }

    if (results.isNewerReleaseAvailable()) {
      if (results.isNewerApiVersionAvailable()) {
        printNagMessage("You are using a deprecated API version.  Please upgrade.",
                        out, results);
        return true;
      }

      printNagMessage("There is a new version of the SDK available.",
                      out, results);
      return true;
    }

    return false;
  }

  private void printNagMessage(String message, PrintStream out, UpdateCheckResults results) {
    out.println("********************************************************");
    out.println(message);
    out.println("-----------");
    out.println("Latest SDK:");
    out.println(results.getRemoteVersion());
    out.println("-----------");
    out.println("Your SDK:");
    out.println(results.getLocalVersion());
    out.println("-----------");
    out.println(
        "Please visit https://developers.google.com/appengine/downloads for the latest SDK.");
    out.println("********************************************************");
  }

  static boolean validateVersion(String version, PrintStream out) {
    if (version != null) {
      String[] versions = version.split("\\.");
      if (versions.length >= 2) {
        if (versions[0].equals("1")) {
          try {
            int minor = Integer.parseInt(versions[1]);
            if (minor < 6) {
              out.println("********************************************************");
              out.println("Warning: Future versions of the Dev App Server will require "
                  + "Java 1.6 or later. Please upgrade your JRE.");
              out.println("********************************************************");
              return true;
            }
          } catch (NumberFormatException e) {
          }
        }
      }
    }
    return false;
  }

  public boolean checkJavaVersion(PrintStream out) {
    return validateVersion(System.getProperty("java.specification.version"), out);
  }

}
