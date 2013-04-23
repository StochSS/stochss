// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.info.SdkInfo;
import com.google.appengine.tools.info.UpdateCheck;
import com.google.appengine.tools.plugins.SDKPluginManager;
import com.google.appengine.tools.plugins.SDKRuntimePlugin;
import com.google.appengine.tools.plugins.SDKRuntimePlugin.ApplicationDirectories;
import com.google.appengine.tools.util.Action;
import com.google.appengine.tools.util.Logging;
import com.google.appengine.tools.util.Option;
import com.google.appengine.tools.util.Parser;
import com.google.appengine.tools.util.Parser.ParseResult;
import com.google.apphosting.utils.config.GenerationDirectory;
import com.google.common.annotations.VisibleForTesting;
import com.google.common.collect.ImmutableList;

import java.awt.Toolkit;
import java.io.File;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

/**
 * The command-line entry point for DevAppServer.
 *
 */
public class DevAppServerMain {

  public static final String EXTERNAL_RESOURCE_DIR_ARG = "external_resource_dir";
  public static final String GENERATE_WAR_ARG = "generate_war";
  public static final String GENERATED_WAR_DIR_ARG = "generated_war_dir";
  private static final String DEFAULT_RDBMS_PROPERTIES_FILE = ".local.rdbms.properties";
  private static final String RDBMS_PROPERTIES_FILE_SYSTEM_PROPERTY = "rdbms.properties.file";

  private static String originalTimeZone;

  private final Action ACTION = new StartAction();

  private String server = SdkInfo.getDefaultServer();

  private String address = DevAppServer.DEFAULT_HTTP_ADDRESS;
  private int port = DevAppServer.DEFAULT_HTTP_PORT;
  private boolean disableUpdateCheck;
  private String generatedDirectory = null;
  private boolean disableRestrictedCheck = false;
  private String externalResourceDir = null;
  private List<String> propertyOptions = null;

  /**
   * An {@code Option} for running {@link DevAppServerMain}.
   */
  private abstract static class DevAppServerOption extends Option {

    protected DevAppServerMain main;

    /**
     * Constructor.
     *
     * @param main the instance of DevAppServerMain for which this is an option. This may be
     *        {@code null} if {@link Option#Apply()} will never be invoked.
     * @param shortName The short name to support. May be {@code null}.
     * @param longName The long name to support. May be {@code null}.
     * @param isFlag true to indicate that the Option represents a boolean value.
     */
    DevAppServerOption(DevAppServerMain main, String shortName, String longName, boolean isFlag) {
      super(shortName, longName, isFlag);
      this.main = main;
    }

  }

  /**
   * Returns the list of built-in {@link Option Options} for the given instance of
   * {@link DevAppServerMain}. The built-in options are those that are independent of any
   * {@link SDKRuntimePlugin SDKRuntimePlugins} that may be installed.
   *
   * @param main The instance of {@code DevAppServerMain} for which the built-in options are being
   *        requested. This may be {@code null} if {@link Option#apply()} will never be invoked on
   *        any of the returned {@code Options}.
   * @return The list of built-in options
   */
  private static List<Option> getBuiltInOptions(DevAppServerMain main) {
    return Arrays.asList(
        new Option("h", "help", true) {
          @Override
          public void apply() {
            printHelp(System.err);
            System.exit(0);
          }
          @Override
          public List<String> getHelpLines() {
            return ImmutableList.of(
                " --help, -h                 Show this help message and exit.");
          }
        },
        new DevAppServerOption(main, "s", "server", false) {
          @Override
          public void apply() {
            this.main.server = getValue();
          }
          @Override
          public List<String> getHelpLines() {
            return ImmutableList.of(
                " --server=SERVER            The server to use to determine the latest",
                "  -s SERVER                   SDK version.");
          }
        },
        new DevAppServerOption(main, "a", "address", false) {
          @Override
          public void apply() {
            this.main.address = getValue();
          }
          @Override
          public List<String> getHelpLines() {
            return ImmutableList.of(
                " --address=ADDRESS          The address of the interface on the local machine",
                "  -a ADDRESS                  to bind to (or 0.0.0.0 for all interfaces).");
          }
        },
        new DevAppServerOption(main, "p", "port", false) {
          @Override
          public void apply() {
            this.main.port = Integer.valueOf(getValue());
          }
          @Override
          public List<String> getHelpLines() {
            return ImmutableList.of(
                " --port=PORT                The port number to bind to on the local machine.",
                "  -p PORT");
          }
        },
        new DevAppServerOption(main, null, "sdk_root", false) {
          @Override
          public void apply() {
            System.setProperty("appengine.sdk.root", getValue());
          }
          @Override
          public List<String> getHelpLines() {
            return ImmutableList.of(
                " --sdk_root=DIR             Overrides where the SDK is located.");
          }
        },
        new DevAppServerOption(main, null, "disable_update_check", true) {
          @Override
          public void apply() {
            this.main.disableUpdateCheck = true;
          }
          @Override
          public List<String> getHelpLines() {
            return ImmutableList.of(
                " --disable_update_check     Disable the check for newer SDK versions.");
          }
        },
        new DevAppServerOption(main, null, "generated_dir", false) {
          @Override
          public void apply() {
            this.main.generatedDirectory = getValue();
          }
          @Override
          public List<String> getHelpLines() {
            return ImmutableList.of(
                " --generated_dir=DIR        Set the directory where generated files are created.");
          }
        },
        new DevAppServerOption(main, null, "disable_restricted_check", true) {
          @Override
          public void apply() {
            this.main.disableRestrictedCheck = true;
          }
        },
        new DevAppServerOption(main, null, EXTERNAL_RESOURCE_DIR_ARG, false) {
          @Override
          public void apply() {
            this.main.externalResourceDir = getValue();
          }
        },
        new DevAppServerOption(main, null, "property", false) {
          @Override
          public void apply() {
            this.main.propertyOptions = getValues();
          }
        }
    );
  }

  /**
   * Builds the complete list of {@link Option Options} for the given instance of
   * {@link DevAppServerMain}. The list consists of the built-in options, possibly modified and
   * extended by any {@link SDKRuntimePlugin SDKRuntimePlugins} that may be installed.
   *
   * @param main The instance of {@code DevAppServerMain} for which the options are being requested.
   *        This may be {@code null} if {@link Option#apply()} will never be invoked on any of the
   *        returned {@code Options}.
   * @return The list of all options
   */
  private static List<Option> buildOptions(DevAppServerMain main) {
    List<Option> options = getBuiltInOptions(main);
    for (SDKRuntimePlugin runtimePlugin : SDKPluginManager.findAllRuntimePlugins()) {
      options = runtimePlugin.customizeDevAppServerOptions(options);
    }
    return options;
  }

  private final List<Option> PARSERS = buildOptions(this);

  @SuppressWarnings("unchecked")
  public static void main(String args[]) throws Exception {
    recordTimeZone();
    Logging.initializeLogging();
    if (System.getProperty("os.name").equalsIgnoreCase("Mac OS X")) {
      Toolkit.getDefaultToolkit();
    }
    new DevAppServerMain(args);
  }

  /**
   * We attempt to record user.timezone before the JVM alters its value.
   * This can happen just by asking for
   * {@link java.util.TimeZone#getDefault()}.
   *
   * We need this information later, so that we can know if the user
   * actually requested an override of the timezone. We can still be wrong
   * about this, for example, if someone directly or indirectly calls
   * {@code TimeZone.getDefault} before the main method to this class.
   * This doesn't happen in the App Engine tools themselves, but might
   * theoretically happen in some third-party tool that wraps the App Engine
   * tools. In that case, they can set {@code appengine.user.timezone}
   * to override what we're inferring for user.timezone.
   */
  private static void recordTimeZone() {
    originalTimeZone = System.getProperty("user.timezone");
  }

  public DevAppServerMain(String[] args) throws Exception {
    Parser parser = new Parser();
    ParseResult result = parser.parseArgs(ACTION, PARSERS, args);
    result.applyArgs();
  }

  public static void printHelp(PrintStream out) {
    out.println("Usage: <dev-appserver> [options] <app directory>");
    out.println("");
    out.println("Options:");
    for (Option option : buildOptions(null)) {
      for (String helpString : option.getHelpLines()) {
        out.println(helpString);
      }
    }
    out.println(" --jvm_flag=FLAG            Pass FLAG as a JVM argument. May be repeated to");
    out.println("                              supply multiple flags.");
  }

  class StartAction extends Action {
    StartAction() {
      super("start");
    }

    @Override
    public void apply() {
      List<String> args = getArgs();
      try {
        File externalResourceDir = getExternalResourceDir();
        if (args.size() != 1) {
          printHelp(System.err);
          System.exit(1);
        }
        File appDir = new File(args.get(0)).getCanonicalFile();
        validateWarPath(appDir);

        SDKRuntimePlugin runtimePlugin = SDKPluginManager.findRuntimePlugin(appDir);
        if (runtimePlugin != null) {
          ApplicationDirectories appDirs = runtimePlugin.generateApplicationDirectories(appDir);
          appDir = appDirs.getWarDir();
          externalResourceDir = appDirs.getExternalResourceDir();
        }

        UpdateCheck updateCheck = new UpdateCheck(server, appDir, true);
        if (updateCheck.allowedToCheckForUpdates() && !disableUpdateCheck) {
          updateCheck.maybePrintNagScreen(System.err);
        }
        updateCheck.checkJavaVersion(System.err);

        DevAppServer server = new DevAppServerFactory().createDevAppServer(appDir,
            externalResourceDir, address, port);

        @SuppressWarnings("rawtypes")
        Map properties = System.getProperties();
        @SuppressWarnings("unchecked")
        Map<String, String> stringProperties = properties;
        setTimeZone(stringProperties);
        setGeneratedDirectory(stringProperties);
        if (disableRestrictedCheck) {
          stringProperties.put("appengine.disableRestrictedCheck", "");
        }
        setRdbmsPropertiesFile(stringProperties, appDir, externalResourceDir);
        stringProperties.putAll(parsePropertiesList(propertyOptions));
        server.setServiceProperties(stringProperties);

        server.start();

        try {
          while (true) {
            Thread.sleep(1000 * 60 * 60);
          }
        } catch (InterruptedException e) {
        }

        System.out.println("Shutting down.");
        System.exit(0);
      } catch (Exception ex) {
        ex.printStackTrace();
        System.exit(1);
      }
    }

    private void setTimeZone(Map<String,String> serviceProperties) {
      String timeZone = serviceProperties.get("appengine.user.timezone");
      if (timeZone != null) {
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
      } else {
        timeZone = originalTimeZone;
      }
      serviceProperties.put("appengine.user.timezone.impl", timeZone);
    }

    private void setGeneratedDirectory(Map<String, String> stringProperties) {
      if (generatedDirectory != null) {
        File dir = new File(generatedDirectory);
        String error = null;
        if (dir.exists()) {
          if (!dir.isDirectory()) {
            error = generatedDirectory + " is not a directory.";
          } else if (!dir.canWrite()) {
            error = generatedDirectory + " is not writable.";
          }
        } else if (!dir.mkdirs()) {
          error = "Could not make " + generatedDirectory;
        }
        if (error != null) {
          System.err.println(error);
          System.exit(1);
        }
       stringProperties.put(GenerationDirectory.GENERATED_DIR_PROPERTY, generatedDirectory);
      }
    }

    /**
     * Sets the property named {@link #RDBMS_PROPERTIES_FILE_SYSTEM_PROPERTY} to the default value
     * {@link #DEFAULT_RDBMS_PROPERTIES_FILE} if the property is not already set and if there is a
     * file by that name in either {@code appDir} or {@code externalResourceDir}.
     *
     * @param stringProperties The map in which the value will be set
     * @param appDir The appDir, aka the WAR dir
     * @param externalResourceDir the external resource dir, or {@code null} if there is not one.
     */
    private void setRdbmsPropertiesFile(
        Map<String, String> stringProperties, File appDir, File externalResourceDir) {
      if (stringProperties.get(RDBMS_PROPERTIES_FILE_SYSTEM_PROPERTY) != null) {
        return;
      }
      File file = findRdbmsPropertiesFile(externalResourceDir);
      if (file == null) {
        file = findRdbmsPropertiesFile(appDir);
      }
      if (file != null) {
        String path = file.getPath();
        System.out.println("Reading local rdbms properties from " + path);
        stringProperties.put(RDBMS_PROPERTIES_FILE_SYSTEM_PROPERTY, path);
      }
    }

    /**
     * Returns the default rdbms properties file in the given dir if it exists.
     * @param dir The directory in which to look
     * @return The default rdbs properties file, or {@code null}.
     */
    private File findRdbmsPropertiesFile(File dir) {
      File candidate = new File(dir, DEFAULT_RDBMS_PROPERTIES_FILE);
      if (candidate.isFile() && candidate.canRead()) {
        return candidate;
      }
      return null;
    }

    private File getExternalResourceDir() {
      if (externalResourceDir == null) {
        return null;
      }
      externalResourceDir = externalResourceDir.trim();
      String error = null;
      File dir = null;
      if (externalResourceDir.isEmpty()) {
        error = "The empty string was specified for external_resource_dir";
      } else {
        dir = new File(externalResourceDir);
        if (dir.exists()) {
          if (!dir.isDirectory()) {
            error = externalResourceDir + " is not a directory.";
          }
        } else {
          error = "No such directory: " + externalResourceDir;
        }
      }
      if (error != null) {
        System.err.println(error);
        System.exit(1);
      }
      return dir;
    }

  }

  public static void validateWarPath(File war) {
    if (!war.exists()) {
      System.out.println("Unable to find the webapp directory " + war);
      printHelp(System.err);
      System.exit(1);
    } else if (!war.isDirectory()) {
      System.out.println("dev_appserver only accepts webapp directories, not war files.");
      printHelp(System.err);
      System.exit(1);
    }
  }

  /**
   * Parse the properties list. Each string in the last may take the the form:
   *   name=value
   *   name          shorthand for name=true
   *   noname        shorthand for name=false
   *   name=         required syntax to specify an empty value
   *
   * @param properties A list of unparsed properties (may be null).
   * @returns A map from property names to values.
   */
  @VisibleForTesting
  static Map<String, String> parsePropertiesList(List<String> properties) {
    Map<String, String> parsedProperties = new HashMap<String, String>();
    if (properties != null) {
      for (String property : properties) {
        String[] propertyKeyValue = property.split("=", 2);
        if (propertyKeyValue.length == 2) {
          parsedProperties.put(propertyKeyValue[0], propertyKeyValue[1]);
        } else if (propertyKeyValue[0].startsWith("no")) {
          parsedProperties.put(propertyKeyValue[0].substring(2), "false");
        } else {
          parsedProperties.put(propertyKeyValue[0], "true");
        }
      }
    }
    return parsedProperties;
  }
}
