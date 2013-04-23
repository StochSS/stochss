
// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.api.client.auth.oauth2.Credential;
import com.google.appengine.tools.admin.AppAdmin.LogSeverity;
import com.google.appengine.tools.admin.AppAdminFactory.ConnectOptions;
import com.google.appengine.tools.admin.ClientLoginServerConnection.ClientAuthFailException;
import com.google.appengine.tools.admin.IndexDeleter.DeleteIndexAction;
import com.google.appengine.tools.development.DevAppServerMain;
import com.google.appengine.tools.info.SupportInfo;
import com.google.appengine.tools.info.UpdateCheck;
import com.google.appengine.tools.plugins.ActionsAndOptions;
import com.google.appengine.tools.plugins.SDKPluginManager;
import com.google.appengine.tools.plugins.SDKRuntimePlugin;
import com.google.appengine.tools.plugins.SDKRuntimePlugin.ApplicationDirectories;
import com.google.appengine.tools.util.Action;
import com.google.appengine.tools.util.ClientCookieManager;
import com.google.appengine.tools.util.Logging;
import com.google.appengine.tools.util.Option;
import com.google.appengine.tools.util.Parser;
import com.google.appengine.tools.util.Parser.ParseResult;
import com.google.appengine.tools.wargen.WarGenerator;
import com.google.appengine.tools.wargen.WarGeneratorFactory;
import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.BackendsXml;
import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableList;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;
import java.util.prefs.Preferences;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSession;

/**
 * The command-line SDK tool for administration of App Engine applications.
 *
 */
public class AppCfg {

  public static final String USE_JAVA6_SYSTEM_PROP = "com.google.apphosting.runtime.use_java6";

  private static final String EXTERNAL_RESOURCE_DIR_ARG =
      DevAppServerMain.EXTERNAL_RESOURCE_DIR_ARG;
  private static final String GENERATE_WAR_ARG =
      DevAppServerMain.GENERATE_WAR_ARG;
  private static final String GENERATED_WAR_DIR_ARG =
      DevAppServerMain.GENERATED_WAR_DIR_ARG;

  private final ConnectOptions connectOptions;
  private String externalResourceDir;
  private boolean generateWar = false;
  private String generatedWarDir;
  private AppCfgAction action;
  private String applicationDirectory;
  private AppAdmin admin;
  private boolean passin;
  private boolean doBatch = true;
  private boolean doJarSplitting = false;
  private Set<String> jarSplittingExcludeSuffixes = null;
  private boolean disablePrompt = false;
  private File logFile = null;
  private String compileEncoding = null;
  private LoginReader loginReader = null;
  private String overrideAppId;
  private String overrideServer;
  private String overrideAppVersion;
  private boolean oauth2 = false;
  private String oauth2RefreshToken = null;
  private String oauth2ClientId = null;
  private String oauth2ClientSecret = null;
  private boolean useCookies = true;
  private boolean doJarJSPs = true;
  private boolean doJarClasses = false;
  private boolean deleteJSPs = false;

  public static void main(String[] args) {
    Logging.initializeLogging();
    new AppCfg(args);
  }

  protected AppCfg(String[] cmdLineArgs) {
    this(new AppAdminFactory(), cmdLineArgs);
  }

  public AppCfg(AppAdminFactory factory, String[] cmdLineArgs) {
    connectOptions = new ConnectOptions();
    Parser parser = new Parser();

    PrintWriter logWriter;

    try {
      logFile = File.createTempFile("appcfg", ".log");
      logWriter = new PrintWriter(new FileWriter(logFile), true);
    } catch (IOException e) {
      throw new RuntimeException("Unable to enable logging.", e);
    }

    try {
      ParseResult result =
          parser.parseArgs(actionsAndOptions.actions, actionsAndOptions.options, cmdLineArgs);
      action = (AppCfgAction) result.getAction();
      try {
        result.applyArgs();
      } catch (IllegalArgumentException e) {
        e.printStackTrace(logWriter);
        System.out.println("Bad argument: " + e.getMessage());
        System.out.println(action.getHelpString());
        System.exit(1);
      }
      if (System.getProperty("http.proxyHost") != null &&
          System.getProperty("https.proxyHost") == null) {
        System.setProperty("https.proxyHost",
            System.getProperty("http.proxyHost"));
        if (System.getProperty("http.proxyPort") != null &&
            System.getProperty("https.proxyPort") == null) {
          System.setProperty("https.proxyPort",
              System.getProperty("http.proxyPort"));
        }
      }

      Application app = null;
      if (applicationDirectory != null) {
        File appDirectoryFile = new File(applicationDirectory);
        validateWarPath(appDirectoryFile);

        UpdateCheck updateCheck = new UpdateCheck(connectOptions.getServer(), appDirectoryFile,
            connectOptions.getSecure());
        updateCheck.maybePrintNagScreen(System.out);
        updateCheck.checkJavaVersion(System.out);

        if (oauth2) {
          authorizeOauth2(connectOptions);
        } else {
          loadCookies(connectOptions);
        }

        factory.setBatchMode(doBatch);

        factory.setJarClassessEnabled(doJarClasses);
        factory.setJarJSPsEnabled(doJarJSPs);
        factory.setDeleteJSPs(deleteJSPs);
        factory.setJarSplittingEnabled(doJarSplitting);
        if (jarSplittingExcludeSuffixes != null) {
          factory.setJarSplittingExcludes(jarSplittingExcludeSuffixes);
        }
        if (compileEncoding != null) {
          factory.setCompileEncoding(compileEncoding);
        }
        System.out.println("Reading application configuration data...");
        app = Application.readApplication(applicationDirectory,
            overrideAppId,
            overrideServer,
            overrideAppVersion);
        if (externalResourceDir != null) {
          app.setExternalResourceDir(externalResourceDir);
        }
        if ("vm".equals(app.getAppEngineWebXml().getRuntime())) {
          factory.setCompileJsps(false);
        }
        app.setListener(new UpdateListener() {
            @Override
            public void onProgress(UpdateProgressEvent event) {
              System.out.println(event.getPercentageComplete() + "% " + event.getMessage());
            }

            @Override
            public void onSuccess(UpdateSuccessEvent event) {
              System.out.println("Operation complete.");
            }

            @Override
            public void onFailure(UpdateFailureEvent event) {
              System.out.println(event.getFailureMessage());
            }
          });

        admin = factory.createAppAdmin(connectOptions, app, logWriter);

        System.out.println("Beginning server interaction for " + app.getAppId() + "...");
      } else {
        admin = factory.createAppAdmin(connectOptions, null, logWriter);
      }

      try {
        action.execute();
      } catch (AdminException ex) {
        System.out.println(ex.getMessage());
        ex.printStackTrace(logWriter);
        printLogLocation();
        System.exit(1);
      }
      System.out.println("Success.");

      if (app != null) {
        if (!connectOptions.getRetainUploadDir()) {
          System.out.println("Cleaning up temporary files...");
          app.cleanStagingDirectory();
        } else {
          File stage = app.getStagingDir();
          if (stage == null) {
            System.out.println("Temporary staging directory was not needed, and not created");
          } else {
            System.out.println("Temporary staging directory left in " + stage.getCanonicalPath());
          }
        }
      }

    } catch (IllegalArgumentException e) {
      e.printStackTrace(logWriter);
      System.out.println("Bad argument: " + e.getMessage());
      printHelp();
      System.exit(1);
    } catch (AppEngineConfigException e) {
      e.printStackTrace(logWriter);
      System.out.println("Bad configuration: " + e.getMessage());
      if (e.getCause() != null) {
        System.out.println("  Caused by: " + e.getCause().getMessage());
      }
      printLogLocation();
      System.exit(1);
    } catch (Exception e) {
      System.out.println("Encountered a problem: " + e.getMessage());
      e.printStackTrace(logWriter);
      printLogLocation();
      System.exit(1);
    }
  }

  /**
   * Prints a uniform message to direct the user to the given logfile for
   * more information.
   */
  private void printLogLocation() {
    if (logFile != null) {
      System.out.println("Please see the logs [" + logFile.getAbsolutePath() +
          "] for further information.");
    }
  }

  private String loadCookies(final ConnectOptions options) {
    Preferences prefs = Preferences.userNodeForPackage(ServerConnection.class);
    String prefsEmail = prefs.get("email", null);

    if (options.getUsePersistedCredentials() && prefsEmail != null) {
      ClientCookieManager cookies = null;
      byte[] serializedCookies = prefs.getByteArray("cookies", null);
      if (serializedCookies != null) {
        try {
          cookies = (ClientCookieManager)
              new ObjectInputStream(
                  new ByteArrayInputStream(serializedCookies)).readObject();
        } catch (ClassNotFoundException ex) {
        } catch (IOException ex) {
        }
      }

      if (options.getUserId() == null ||
          prefsEmail.equals(options.getUserId())) {
        options.setCookies(cookies);
      }
    }

    options.setPasswordPrompt(new AppAdminFactory.PasswordPrompt() {
        @Override
        public String getPassword() {
          doPrompt();
          options.setUserId(loginReader.getUsername());
          return loginReader.getPassword();
        }
      });
    return prefsEmail;
  }

  /**
   * Tries to get an OAuth2 access token and set it in the ConnectOptions.
   * It exists with exit code 1 in case no token could be obtained.
   */
  private void authorizeOauth2(final ConnectOptions options){
    OAuth2Native client =
        new OAuth2Native(useCookies, oauth2ClientId, oauth2ClientSecret, oauth2RefreshToken);
    Credential credential = client.authorize();
    if (credential != null && credential.getAccessToken() != null) {
      options.setOauthToken(credential.getAccessToken());
    } else {
      System.exit(1);
    }
  }

  /**
   * Helper function for generating a war directory based on an app.yaml file located in an external
   * resource directory. First the command line arguments are checked to ensure that they are
   * appropriate for war generation. If there is a problem then a {@link RuntimeException} is
   * thrown. Otherwise a war directory is generated and its path is returned, and a success
   * message is written to standard out.
   *
   * @return The path of the generated war directory.
   */
  private String validateArgsAndGenerateWar() {
    if (externalResourceDir == null) {
      throw new IllegalArgumentException("When generating a war directory --"
          + EXTERNAL_RESOURCE_DIR_ARG + " must also be specified.");
    }
    File externalResourceDirectory = new File(externalResourceDir);
    if (!externalResourceDirectory.isDirectory()) {
      throw new IllegalArgumentException(externalResourceDir + " is not an existing directory.");
    }
    File appYamlFile = new File(externalResourceDirectory, WarGenerator.APP_YAML);
    if (!appYamlFile.isFile()) {
      throw new IllegalArgumentException(appYamlFile.getPath() + " not found.");
    }
    File destination = (generatedWarDir == null ? null : new File(generatedWarDir));
    try {
      WarGenerator warGen =
          WarGeneratorFactory.newWarGenerator(externalResourceDirectory, destination);
      String warDir =  warGen.generateWarDirectory().getPath();
      System.out.println("Successfully generated war directory at " + warDir);
      return warDir;
    } catch (IOException e) {
      throw new RuntimeException("Unable to generate a war directory.", e);
    }
  }

  private void doPrompt() {

    if (disablePrompt) {
      System.out.println("Your authentication credentials can't be found and may have expired.\n" +
        "Please run appcfg directly from the command line to re-establish your credentials.");
      System.exit(1);
    }

    getLoginReader().doPrompt();

  }

  private LoginReader getLoginReader() {
    if (loginReader == null) {
      loginReader = LoginReaderFactory.createLoginReader(connectOptions, passin);
    }
    return loginReader;
  }

  private static final List<String> generalOptionNamesInHelpOrder =
      ImmutableList.of(
          "server",
          "email",
          "host",
          "proxy",
          "proxy_https",
          "no_cookies",
          "sdk_root",
          "passin",
          "insecure",
          "ignore_bad_cert",
          "application",
          "version",
          "oauth2",
          "use_java7");

  private static final List<String> optionNamesInHelpOrder =
      ImmutableList.<String>builder().addAll(generalOptionNamesInHelpOrder).add(
          "enable_jar_splitting",
          "jar_splitting_excludes",
          "disable_jar_jsps",
          "enable_jar_classes",
          "delete_jsps",
          "retain_upload_dir",
          "compile_encoding",
          "num_days",
          "severity",
          "append",
          "num_runs",
          "force"
      ).build();

  private static final List<String> actionNamesInHelpOrder =
      ImmutableList.of(
          "help",
          "download_app",
          "request_logs",
          "rollback",
          "start",
          "stop",
          "update",
          "update_indexes",
          "update_cron",
          "update_queues",
          "update_dos",
          "version",
          "set_default_version",
          "cron_info",
          "resource_limits_info",
          "vacuum_indexes",
          "backends list",
          "backends update",
          "backends rollback",
          "backends start",
          "backends stop",
          "backends delete",
          "backends configure");

  private String helpText = null;
  private void printHelp() {
    if (helpText == null) {
      List<String> helpLines = new LinkedList<String>();
      helpLines.add("usage: AppCfg [options] <action> [<app-dir>] [<argument>]");
      helpLines.add("");
      helpLines.add("Action must be one of:");
      for (String actionName : actionsAndOptions.actionNames) {
        Action action = actionsAndOptions.getAction(actionName);
        if (action != null) {
          helpLines.add("  " + actionName + ": " + action.getShortDescription());
        }
      }
      helpLines.add("Use 'help <action>' for a detailed description.");
      helpLines.add("");
      helpLines.add("options:");
      for (String optionName : actionsAndOptions.optionNames) {
        Option option = actionsAndOptions.getOption(optionName);
        helpLines.addAll(option.getHelpLines());
      }
      helpText = Joiner.on("\n").join(helpLines);
    }
    System.out.println(helpText);
    System.out.println();
  }

  private final List<Option> builtInOptions = Arrays.asList(

      new Option("h", "help", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -h, --help            Show the help message and exit.");
        }
        @Override
        public void apply() {
          printHelp();
          System.exit(1);
        }
      },

      new Option("s", "server", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -s SERVER, --server=SERVER",
              "                        The server to connect to.");
        }
        @Override
        public void apply() {
          connectOptions.setServer(getValue());
        }
      },

      new Option("e", "email", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -e EMAIL, --email=EMAIL",
              "                        The username to use. Will prompt if omitted.");
        }
        @Override
        public void apply() {
          connectOptions.setUserId(getValue());
        }
      },

      new Option("H", "host", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -H HOST, --host=HOST  Overrides the Host header sent with all RPCs.");
        }
        @Override
        public void apply() {
          connectOptions.setHost(getValue());
        }
      },

      new Option("p", "proxy", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -p PROXYHOST[:PORT], --proxy=PROXYHOST[:PORT]",
              "                        Proxies requests through the given proxy server.",
              "                        If --proxy_https is also set, only HTTP will be",
              "                        proxied here, otherwise both HTTP and HTTPS will.");
        }
        @Override
        public void apply() {
          HostPort hostport = new HostPort(getValue());

          System.setProperty("http.proxyHost", hostport.getHost());
          if (hostport.hasPort()) {
            System.setProperty("http.proxyPort", hostport.getPort());
          }
        }
      },

      new Option(null, "proxy_https", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --proxy_https=PROXYHOST[:PORT]",
              "                        Proxies HTTPS requests through the given proxy server.");
        }
        @Override
        public void apply() {
          HostPort hostport = new HostPort(getValue());

          System.setProperty("https.proxyHost", hostport.getHost());
          if (hostport.hasPort()) {
            System.setProperty("https.proxyPort", hostport.getPort());
          }
        }
      },

      new Option(null, "insecure", true) {
        @Override
        public void apply() {
          connectOptions.setSecure(false);
        }
      },

      new Option(null, "ignore_bad_cert", true) {
        @Override
        public void apply() {
          HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
              return true;
            }
          });
        }
      },

      new Option(null, "no_cookies", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(

              "  --no_cookies          Do not save/load access credentials to/from disk.");
        }
        @Override
        public void apply() {
          useCookies = false;
          connectOptions.setUsePersistedCredentials(false);
        }
      },

      new Option("f", "force", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -f, --force           Force deletion of indexes without being prompted.");
        }
        @Override
        public void apply(){
          if (action instanceof VacuumIndexesAction){
            VacuumIndexesAction viAction = (VacuumIndexesAction) action;
            viAction.promptUserForEachDelete = false;
          }
        }
      },

      new Option("a", "append", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -a, --append          Append to existing file.");
        }
        @Override
        public void apply() {
          if (action instanceof RequestLogsAction) {
            RequestLogsAction logsAction = (RequestLogsAction) action;
            logsAction.append = true;
          }
        }
      },

      new Option("n", "num_days", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -n NUM_DAYS, --num_days=NUM_DAYS",
              "                        Number of days worth of log data to get. The cut-off",
              "                        point is midnight UTC. Use 0 to get all available",
              "                        logs. Default is 1.");
        }
        @Override
        public void apply() {
          if (action instanceof RequestLogsAction) {
            RequestLogsAction logsAction = (RequestLogsAction) action;
            try {
              logsAction.numDays = Integer.parseInt(getValue());
            } catch (NumberFormatException e) {
              throw new IllegalArgumentException("num_days must be an integral number.");
            }
          } else if (action instanceof CronInfoAction) {
            CronInfoAction croninfoAction = (CronInfoAction) action;
            croninfoAction.setNumRuns(getValue());
          }
        }
      },

      new Option(null, "num_runs", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -n NUM_RUNS, --num_runs=NUM_RUNS",
              "                        Number of scheduled execution times to compute");
        }
        @Override
        public void apply() {
          if (action instanceof CronInfoAction) {
            CronInfoAction croninfoAction = (CronInfoAction) action;
            croninfoAction.setNumRuns(getValue());
          }
        }
      },

      new Option(null, "severity", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --severity=SEVERITY   Severity of app-level log messages to get. The range",
              "                        is 0 (DEBUG) through 4 (CRITICAL). If omitted, only",
              "                        request logs are returned.");
        }
        @Override
        public void apply() {
          RequestLogsAction logsAction = (RequestLogsAction) action;
          try {
            int severity = Integer.parseInt(getValue());
            int maxSeverity = LogSeverity.values().length;
            if (severity < 0 || severity > maxSeverity) {
              throw new IllegalArgumentException("severity must be between 0 and " + maxSeverity);
            }
            logsAction.severity = severity;
          } catch (NumberFormatException e) {
            for (Enum<LogSeverity> severity : LogSeverity.values()) {
              if (getValue().equalsIgnoreCase(severity.toString())) {
                logsAction.severity = severity.ordinal();
                return;
              }
            }
            throw new IllegalArgumentException("severity must be an integral "
                + "number 0-4, or one of DEBUG, INFO, WARN, ERROR, CRITICAL");
          }
        }
      },

      new Option(null, "sdk_root", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --sdk_root=root       Overrides where the SDK is located.");
        }
        @Override
        public void apply() {
          connectOptions.setSdkRoot(getValue());
        }
      },

      new Option(null, "disable_jar_jsps", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --disable_jar_jsps",
              "                        Do not jar the classes generated from JSPs.");
        }

        @Override
        public void apply() {
          doJarJSPs = false;
        }
      },

      new Option(null, "enable_jar_classes", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --enable_jar_classes",
              "                        Jar the WEB-INF/classes content.");
        }

        @Override
        public void apply() {
          doJarClasses = true;
        }
      },
      new Option(null, "delete_jsps", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --delete_jsps",
              "                        Delete the JSP source files after compilation.");
        }

        @Override
        public void apply() {
          deleteJSPs = true;
        }
      },

      new Option(null, "enable_jar_splitting", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --enable_jar_splitting",
              "                        Split large jar files (> 10M) into smaller fragments.");
        }
        @Override
        public void apply() {
          doJarSplitting = true;
        }
      },

      new Option(null, "jar_splitting_excludes", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --jar_splitting_excludes=SUFFIXES",
              "                        When --enable-jar-splitting is set, files that match",
              "                        the list of comma separated SUFFIXES will be excluded",
              "                        from all jars.");
        }
        @Override
        public void apply() {
          jarSplittingExcludeSuffixes = new HashSet<String>(Arrays.asList(getValue().split(",")));
        }
      },

      new Option(null, "retain_upload_dir", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --retain_upload_dir",
              "                        Do not delete temporary (staging) directory used in",
              "                        uploading.");
        }
        @Override
        public void apply() {
          connectOptions.setRetainUploadDir(true);
        }
      },

      new Option(null, "passin", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --passin              Always read the login password from stdin.");
        }
        @Override
        public void apply() {
          passin = true;
        }
      },

      new Option(null, "no_batch", true) {
        @Override
        public void apply() {
          doBatch = false;
        }
      },
      new Option(null, "compile_encoding", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --compile_encoding",
              "                        The character encoding to use when compiling JSPs.");
        }
        @Override
        public void apply() {
          compileEncoding = getValue();
        }
      },

      new Option(null, "disable_prompt", true) {
        @Override
        public void apply() {
          disablePrompt = true;
        }
      },

      new Option("A", "application", false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -A APP_ID, --application=APP_ID",
              "                        Override application id from appengine-web.xml or app.yaml");
        }
        @Override
        public void apply() {
          overrideAppId = getValue();
        }
      },

      new Option("S", "server_id" , false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -S SERVER_ID, --server_id=SERVER_ID",
              "                        Override server from appengine-web.xml or app.yaml");
        }
        @Override
        public void apply() {
          overrideServer = getValue();
        }
      },

      new Option("V", "version" , false) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  -V VERSION, --version=VERSION",
              "                        Override (major) version from appengine-web.xml " +
              "or app.yaml");
        }
        @Override
        public void apply() {
          overrideAppVersion = getValue();
        }
      },

      new Option(null, "oauth2", true) {
        @Override
        public List<String> getHelpLines() {
          return ImmutableList.<String>of(
              "  --oauth2              Use OAuth2 instead of password auth.");
        }
        @Override
        public void apply() {
          oauth2 = true;
        }
      },

      new Option(null, "oauth2_refresh_token", false) {
        @Override
        public void apply() {
          oauth2RefreshToken = getValue();
          useCookies = false;
        }
      },

      new Option(null, "oauth2_client_id", false) {
        @Override
        public void apply() {
          oauth2ClientId = getValue();
          useCookies = false;
        }
      },

      new Option(null, "oauth2_client_secret", false) {
        @Override
        public void apply() {
          oauth2ClientSecret = getValue();
          useCookies = false;
        }
      },

      new Option(null, "oauth2_config_file", false) {
        @Override
        public void apply() {
          final Properties props = new Properties();
          try {
            props.load(new FileInputStream(getValue()));
          } catch (FileNotFoundException e) {
            throw new RuntimeException(
                String.format("OAuth2 configuration file does not exist: %s", getValue()), e);
          } catch (IOException e) {
            throw new RuntimeException(
                String.format("Could not read OAuth2 configuration file: %s", getValue()), e);
          }

          oauth2RefreshToken = props.getProperty("oauth2_refresh_token");
          oauth2ClientId = props.getProperty("oauth2_client_id");
          oauth2ClientSecret = props.getProperty("oauth2_client_secret");

          if (oauth2RefreshToken != null ||
              oauth2ClientId != null ||
              oauth2ClientSecret != null) {
            useCookies = false;
          }
        }
      },

      new Option(null, "use_java7", true) {
        @Override
        public void apply() {
          System.setProperty(USE_JAVA6_SYSTEM_PROP, "false");
        }
      },

      new Option(null, EXTERNAL_RESOURCE_DIR_ARG, false) {
        @Override
        public void apply() {
          externalResourceDir = getValue();
        }
      },

      new Option(null, GENERATE_WAR_ARG, true) {
        @Override
        public void apply() {
          generateWar = true;
        }
      },

      new Option(null, "use_java6", true) {
        @Override
        public void apply() {
          System.setProperty(USE_JAVA6_SYSTEM_PROP, "true");
        }
      },

      new Option(null, GENERATED_WAR_DIR_ARG, false) {
        @Override
        public void apply() {
          generateWar = true;
          generatedWarDir = getValue();
        }
      });

  private final List<Action> builtInActions = Arrays.<Action>asList(
        new UpdateAction(),
        new RequestLogsAction(),
        new RollbackAction(),
        new UpdateIndexesAction(),
        new UpdateCronAction(),
        new UpdateDosAction(),
        new UpdateQueueAction(),
        new CronInfoAction(),
        new VacuumIndexesAction(),
        new HelpAction(),
        new DownloadAppAction(),
        new VersionAction(),
        new SetDefaultVersionAction(),
        new ResourceLimitsInfoAction(),
        new StartAction(),
        new StopAction(),
        new BackendsListAction(),
        new BackendsRollbackAction(),
        new BackendsUpdateAction(),
        new BackendsStartAction(),
        new BackendsStopAction(),
        new BackendsDeleteAction(),
        new BackendsConfigureAction(),
        new BackendsAction()
        );

  private Map<String, Option> builtInOptionMap;

  private List<Option> builtInOptions(String... optionNames) {
    if (builtInOptionMap == null) {
      builtInOptionMap = new HashMap<String, Option>(builtInOptions.size());
      for (Option option : builtInOptions){
        builtInOptionMap.put(option.getLongName(), option);
      }
    }
    List<Option> options = new LinkedList<Option>();
    for (String name : optionNames) {
      Option option = builtInOptionMap.get(name);
      if (option != null) {
        options.add(option);
      }
    }
    return options;
  }

  private final ActionsAndOptions actionsAndOptions = buildActionsAndOptions();

  private ActionsAndOptions buildActionsAndOptions() {
    ActionsAndOptions actionsAndOptions = getBuiltInActionsAndOptions();
    for (SDKRuntimePlugin runtimePlugin : SDKPluginManager.findAllRuntimePlugins()) {
      runtimePlugin.customizeAppCfgActionsAndOptions(actionsAndOptions);
    }
    return actionsAndOptions;
  }

  /**
   * Builds the collection of built-in Actions and Options.
   */
  private ActionsAndOptions getBuiltInActionsAndOptions() {
    ActionsAndOptions actionsAndOptions = new ActionsAndOptions();
    actionsAndOptions.actions = builtInActions;
    actionsAndOptions.actionNames = actionNamesInHelpOrder;
    actionsAndOptions.options = builtInOptions;
    actionsAndOptions.optionNames = optionNamesInHelpOrder;
    actionsAndOptions.generalOptionNames = generalOptionNamesInHelpOrder;
    return actionsAndOptions;
  }

  abstract class AppCfgAction extends Action {

    AppCfgAction(String... names) {
      this(null, names);
    }

    AppCfgAction(List<Option> options, String... names) {
      super(options, names);
    }

    @Override
    protected void setArgs(List<String> args) {
      super.setArgs(args);
    }

    @Override
    public void apply() {
      if (generateWar) {
        applicationDirectory = validateArgsAndGenerateWar();
        List<String> args = getArgs();
        List<String> newArgs = new ArrayList<String>(args.size() + 1);
        newArgs.add(applicationDirectory);
        newArgs.addAll(args);
        setArgs(newArgs);
      } else {
        if (getArgs().size() < 1) {
          throw new IllegalArgumentException("Expected the application directory"
              + " as an argument after the action name.");
        }
        applicationDirectory = getArgs().get(0);

        SDKRuntimePlugin runtimePlugin = SDKPluginManager.findRuntimePlugin(
            new File(applicationDirectory));
        if (runtimePlugin != null) {
          try {
            ApplicationDirectories appDirs = runtimePlugin.generateApplicationDirectories(
                new File(applicationDirectory));
            applicationDirectory = appDirs.getWarDir().getPath();
            getArgs().set(0, applicationDirectory);
            externalResourceDir = appDirs.getExternalResourceDir().getPath();
          } catch (IOException e) {
            throw new RuntimeException("Unable to generate the war directory", e);
          }
        }

      }
    }
    public abstract void execute();

    @Override
    protected List<String> getHelpLines() {
      List<String> helpLines = new LinkedList<String>();
      helpLines.addAll(getInitialHelpLines());
      helpLines.add("");
      helpLines.add("Options:");
      for (String optionName : actionsAndOptions.generalOptionNames) {
        Option option = actionsAndOptions.getOption(optionName);
        if (option != null) {
          helpLines.addAll(option.getHelpLines());
        }
      }
      if (extraOptions != null) {
        for (Option option : extraOptions) {
          helpLines.addAll(option.getHelpLines());
        }
      }
      return helpLines;
    }

    /**
     * Returns a list of Strings to be displayed as the initial lines of a help text. Subclasses
     * should override this method.
     * <p>
     * The text returned by this method should describe the base Action without any of its options.
     * Text describing the options will be added in lines below this text.
     */
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of();
    }

  }

  class UpdateAction extends AppCfgAction {
    UpdateAction() {
      super(builtInOptions("enable_jar_splitting", "jar_splitting_excludes", "retain_upload_dir",
          "compile_encoding", "disable_jar_jsps", "delete_jsps", "enable_jar_classes"), "update");
      shortDescription = "Create or update an app version.";
    }

    @Override
    public void execute() {
      admin.update(new AppCfgUpdateListener());
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] update <app-dir>",
          "",
          "Installs a new version of the application onto the server, as the",
          "default version for end users.");
    }
  }

  class RequestLogsAction extends AppCfgAction {
    String outputFile;
    int numDays = 1;
    int severity = -1;
    boolean append = false;

    RequestLogsAction() {
      super(builtInOptions("num_days", "severity", "append"), "request_logs");
      shortDescription = "Write request logs in Apache common log format.";
    }
    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() != 2) {
        throw new IllegalArgumentException("Expected the application directory"
            + " and log file as arguments after the request_logs action name.");
      }
      outputFile = getArgs().get(1);
    }
    @Override
    public void execute() {
      Reader reader = admin.requestLogs(numDays,
         severity >= 0 ? LogSeverity.values()[severity] : null);
      if (reader == null) {
        return;
      }

      BufferedReader r = new BufferedReader(reader);
      PrintWriter writer = null;
      try {
        if (outputFile.equals("-")) {
          writer = new PrintWriter(System.out);
        } else {
          writer = new PrintWriter(new FileWriter(outputFile, append));
        }
        String line = null;
        while ((line = r.readLine()) != null) {
          writer.println(line);
        }
      } catch (IOException e) {
        throw new RuntimeException("Failed to read logs: " + e);
      } finally {
        if (writer != null) {
          writer.close();
        }
        try {
          r.close();
        } catch (IOException e) {
        }
      }
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] request_logs <app-dir> <output-file>",
          "",
          "Populates the output-file with recent logs from the application.");
    }
  }

  class RollbackAction extends AppCfgAction {
    RollbackAction() {
      super("rollback");
      shortDescription = "Rollback an in-progress update.";
    }
    @Override
    public void execute() {
      admin.rollback();
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] rollback <app-dir>",
          "",
          "The 'update' command requires a server-side transaction.",
          "Use 'rollback' if you experience an error during 'update'",
          "and want to begin a new update transaction.");
    }
  }

  class UpdateIndexesAction extends AppCfgAction {
    UpdateIndexesAction() {
      super("update_indexes");
      shortDescription = "Update application indexes.";
    }
    @Override
    public void execute() {
      admin.updateIndexes();
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] update_indexes <app-dir>",
          "",
          "Updates the datastore indexes for the server to add any in the current",
          "application directory.  Does not alter the running application version, nor",
          "remove any existing indexes.");
    }
  }

  class UpdateCronAction extends AppCfgAction {
    UpdateCronAction() {
      super("update_cron");
      shortDescription = "Update application cron jobs.";
    }
    @Override
    public void execute() {
      admin.updateCron();
      shortDescription = "Update application cron jobs.";
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] update_cron <app-dir>",
          "",
          "Updates the cron jobs for the server. Updates any new, removed or changed",
          "cron jobs. Does not otherwise alter the running application version.");
    }
  }

  class UpdateDosAction extends AppCfgAction {
    UpdateDosAction() {
      super("update_dos");
      shortDescription = "Update application DoS protection configuration.";
    }
    @Override
    public void execute() {
      admin.updateDos();
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] update_dos <app-dir>",
          "",
          "Updates the DoS protection configuration for the server.",
          "Does not otherwise alter the running application version.");
    }
  }

  class UpdateQueueAction extends AppCfgAction {
    UpdateQueueAction() {
      super("update_queues");
      shortDescription = "Update application task queue definitions.";
    }
    @Override
    public void execute() {
      admin.updateQueues();
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] " + getNameString() + " <app-dir>",
          "",
          "Updates any new, removed or changed task queue definitions.",
          "Does not otherwise alter the running application version.");
    }
  }

  class CronInfoAction extends AppCfgAction {
    int numRuns = 5;

    CronInfoAction() {
      super(builtInOptions("num_runs"), "cron_info");
      shortDescription = "Displays times for the next several runs of each cron job.";
    }
    @Override
    public void execute() {
      List<CronEntry> entries = admin.cronInfo();
      if (entries.size() == 0) {
        System.out.println("No cron jobs defined.");
      } else {
        System.out.println(entries.size() + " cron entries defined.\n");
        for (CronEntry entry : entries) {
          System.out.println(entry.toXml());
          System.out.println("Next " + numRuns + " execution times:");
          Iterator<String> iter = entry.getNextTimesIterator();
          for (int i = 0; i < numRuns; i++) {
            System.out.println("  " + iter.next());
          }
          System.out.println("");
        }
      }
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] cron_info <app-dir>",
          "",
          "Displays times for the next several runs of each cron job.");
    }
    public void setNumRuns(String numberString) {
      try {
        numRuns = Integer.parseInt(numberString);
      } catch (NumberFormatException e) {
        throw new IllegalArgumentException("num_runs must be an integral number.");
      }
      if (numRuns < 0) {
        throw new IllegalArgumentException("num_runs must be positive.");
      }
    }
  }

  class VacuumIndexesAction extends AppCfgAction {
    public boolean promptUserForEachDelete = true;

    VacuumIndexesAction() {
      super(builtInOptions("force"), "vacuum_indexes");
      shortDescription = "Delete unused indexes from application.";
    }

    @Override
    public void execute() {
      ConfirmationCallback<IndexDeleter.DeleteIndexAction> callback = null;
      if (promptUserForEachDelete) {
        callback = new ConfirmationCallback<IndexDeleter.DeleteIndexAction>() {
          @Override
          public Response confirmAction(DeleteIndexAction action) {
            while (true) {
              String prompt = "\n" + action.getPrompt() + " (N/y/a): ";
              System.out.print(prompt);
              System.out.flush();
              BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
              String response;
              try {
                response = in.readLine();
              } catch (IOException ioe) {
                response = null;
              }
              response = (null == response ? "" : response.trim().toLowerCase());
              if ("y".equals(response)) {
                return Response.YES;
              }
              if ("n".equals(response) || response.isEmpty()) {
                return Response.NO;
              }
              if ("a".equals(response)) {
                return Response.YES_ALL;
              }
            }
          }
        };
      }
      admin.vacuumIndexes(callback, new AppCfgVacuumIndexesListener());
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] vacuum_indexes <app-dir>",
          "",
          "Deletes indexes on the server that are not present in the local",
          "index configuration file.  The user is prompted before each delete.");
    }
  }

  class HelpAction extends AppCfgAction {
    HelpAction() {
      super("help");
      shortDescription = "Print help for a specific action.";
    }
    @Override
    public void apply() {
      if (getArgs().isEmpty()) {
        printHelp();
      } else {
        Action foundAction = Parser.lookupAction(actionsAndOptions.actions,
                                                 getArgs().toArray(new String[0]), 0);
        if (foundAction == null) {
          System.out.println("No such command \"" + getArgs().get(0) + "\"\n\n");
          printHelp();
        } else {
          System.out.println(foundAction.getHelpString());
          System.out.println();
        }
      }
      System.exit(1);
    }
    @Override
    public void execute() {
    }
    @Override
    protected List<String> getHelpLines() {
      return ImmutableList.of("AppCfg help <command>",
          "",
          "Prints help about a specific command.",
          "");
    }
  }

  class DownloadAppAction extends AppCfgAction {
    DownloadAppAction() {
      super("download_app");
      shortDescription = "Download a previously uploaded app version.";
    }
    @Override
    public void apply() {
      if (getArgs().size() != 1) {
        throw new IllegalArgumentException("Expected download directory"
            + " as an argument after download_app.");
      }
      File downloadDir = new File(getArgs().get(0));
      if (overrideAppId == null) {
        throw new IllegalArgumentException("You must specify an app ID via -A or --application");
      }

      if (oauth2) {
        authorizeOauth2(connectOptions);
      } else {
        loadCookies(connectOptions);
      }

      AppDownload appDownload =
        new AppDownload(ServerConnectionFactory.getServerConnection(connectOptions),
          new AppCfgListener("download_app"));
      int exitCode = appDownload.download(overrideAppId,
                                          overrideServer,
                                          overrideAppVersion,
                                          downloadDir) ? 0 : 1;
      System.exit(exitCode);
    }
    @Override
    public void execute() {
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] -A app_id [ -S server ] [ -V version ] download_app <out-dir>",
          "",
          "Download a previously-uploaded app to the specified directory.  The app",
          "ID is specified by the \"-A\" option.  The optional server is specified by the \"-S\" ",
          "option and the optional version is specified by the \"-V\" option.");
    }
  }

  class VersionAction extends AppCfgAction {
    VersionAction() {
      super("version");
      shortDescription = "Prints version information.";
    }
    @Override
    public void apply() {
      System.out.println(SupportInfo.getVersionString());
      System.exit(0);
    }
    @Override
    public void execute() {
    }
    @Override
    protected List<String> getHelpLines() {
      return ImmutableList.of(
          "AppCfg version",
          "",
          "Prints version information.");
    }
  }

  class SetDefaultVersionAction extends AppCfgAction {
    SetDefaultVersionAction() {
      super("set_default_version");
      shortDescription = "Set the default serving version.";
    }
    @Override
    public void execute() {
      admin.setDefaultVersion();
    }
    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] set_default_version <app-dir>",
          "",
          "Sets the default (serving) version");
    }
  }

  class ResourceLimitsInfoAction extends AppCfgAction {
    public ResourceLimitsInfoAction() {
      super("resource_limits_info");
      shortDescription = "Display resource limits.";
    }

    @Override
    public void execute() {
      ResourceLimits resourceLimits = admin.getResourceLimits();
      for (String key : new TreeSet<String>(resourceLimits.keySet())) {
        System.out.println(key + ": " + resourceLimits.get(key));
      }
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] resource_limits_info <app-dir>",
          "",
          "Displays the resource limits available to the app. An app will",
          "not update if any of the app's resources are larger than the",
          "appropriate resource limit.");
    }
  }

  class BackendsListAction extends AppCfgAction {
    BackendsListAction() {
      super("backends", "list");
      shortDescription = "List the currently configured backends.";
    }

    @Override
    public void execute() {
      for (BackendsXml.Entry backend : admin.listBackends()) {
        System.out.println(backend.toString());
      }
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends list <app-dir>",
          "",
          "List the currently configured backends.");
    }
  }

  class BackendsRollbackAction extends AppCfgAction {
    private String backendName;

    BackendsRollbackAction() {
      super("backends", "rollback");
      shortDescription = "Roll back a previously in-progress update.";
    }

    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() < 1 || getArgs().size() > 2) {
        throw new IllegalArgumentException("Expected <app-dir> [<backend-name>]");
      } else if (getArgs().size() == 2) {
        backendName = getArgs().get(1);
      }
    }

    @Override
    public void execute() {
      List<String> backends;
      if (backendName != null) {
        admin.rollbackBackend(backendName);
      } else {
        admin.rollbackAllBackends();
      }
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends rollback <app-dir> [<backend-name>]",
          "",
          "The 'backends update' command requires a server-side transaction.",
          "Use 'backends rollback' if you experience an error during 'backends update'",
          "and want to begin a new update transaction.");
    }
  }

  class BackendsUpdateAction extends AppCfgAction {
    private String backendName;

    BackendsUpdateAction() {
      super(builtInOptions("enable_jar_splitting", "jar_splitting_excludes", "retain_upload_dir",
          "compile_encoding", "disable_jar_jsps", "delete_jsps", "enable_jar_classes"),
          "backends", "update");
      shortDescription = "Update the specified backend or all backends.";
    }

    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() < 1 || getArgs().size() > 2) {
        throw new IllegalArgumentException("Expected <app-dir> [<backend-name>]");
      } else if (getArgs().size() == 2) {
        backendName = getArgs().get(1);
      }
    }

    @Override
    public void execute() {
      List<String> backends;
      if (backendName != null) {
        admin.updateBackend(backendName, new AppCfgUpdateListener());
      } else {
        admin.updateAllBackends(new AppCfgUpdateListener());
      }
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends update <app-dir> [<backend-name>]",
          "",
          "Update the specified backend or all backends.");
    }
  }

  class BackendsStartAction extends AppCfgAction {
    private String backendName;

    BackendsStartAction() {
      super("backends", "start");
      shortDescription = "Start the specified backend.";
    }

    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() != 2) {
        throw new IllegalArgumentException("Expected the backend name");
      }
      backendName = getArgs().get(1);
    }

    @Override
    public void execute() {
      admin.setBackendState(backendName, BackendsXml.State.START);
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends start <app-dir> <backend>",
          "",
          "Starts the backend with the specified name.");
    }
  }

  class BackendsStopAction extends AppCfgAction {
    private String backendName;

    BackendsStopAction() {
      super("backends", "stop");
      shortDescription = "Stop the specified backend.";
    }

    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() != 2) {
        throw new IllegalArgumentException("Expected the backend name");
      }
      backendName = getArgs().get(1);
    }
    @Override
    public void execute() {
      admin.setBackendState(backendName, BackendsXml.State.STOP);
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends stop <app-dir> <backend>",
          "",
          "Stops the backend with the specified name.");
    }
  }

  class BackendsDeleteAction extends AppCfgAction {
    private String backendName;

    BackendsDeleteAction() {
      super("backends", "delete");
      shortDescription = "Delete the specified backend.";
    }

    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() != 2) {
        throw new IllegalArgumentException("Expected the backend name");
      }
      backendName = getArgs().get(1);
    }
    @Override
    public void execute() {
      admin.deleteBackend(backendName);
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends delete",
          "",
          "Deletes the specified backend.");
    }
  }

  class BackendsConfigureAction extends AppCfgAction {
    private String backendName;

    BackendsConfigureAction() {
      super("backends", "configure");
      shortDescription = "Configure the specified backend.";
    }

    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() != 2) {
        throw new IllegalArgumentException("Expected the backend name");
      }
      backendName = getArgs().get(1);
    }
    @Override
    public void execute() {
      admin.configureBackend(backendName);
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends configure <app-dir> <backend>",
          "",
          "Updates the configuration of the backend with the specified name, without",
          "stopping instances that are currently running.  Only valid for certain",
          "settings (instances, options: failfast, options: public).");
    }
  }

  /**
   * This is a catchall for the case where the user enters "appcfg.sh
   * backends app-dir sub-command" rather than "appcfg.sh backends
   * sub-command app-dir".  It was added to maintain compatibility
   * with Python.  It simply remaps the arguments and dispatches the
   * appropriate action.
   */
  class BackendsAction extends AppCfgAction {
    private AppCfgAction subAction;

    BackendsAction() {
      super("backends");
    }

    @Override
    public void apply() {
      super.apply();
      if (getArgs().size() < 2) {
        throw new IllegalArgumentException("Expected backends <app-dir> <sub-command> [...]");
      }
      String dir = getArgs().get(0);
      String subCommand = getArgs().get(1);
      subAction = (AppCfgAction) Parser.lookupAction(actionsAndOptions.actions,
                                                     new String[] {"backends", subCommand},
                                                     0);
      if (subAction instanceof BackendsAction) {
        throw new IllegalArgumentException("Unknown backends subcommand.");
      }
      List<String> newArgs = new ArrayList<String>();
      newArgs.add(dir);
      newArgs.addAll(getArgs().subList(2, getArgs().size()));
      subAction.setArgs(newArgs);
      subAction.apply();
    }

    @Override
    public void execute() {
      subAction.execute();
    }

    @Override
    protected List<String> getHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] backends list: List the currently configured backends.",
          "AppCfg [options] backends update: Update the specified backend or all backends.",
          "AppCfg [options] backends rollback: Roll back a previously in-progress update.",
          "AppCfg [options] backends start: Start the specified backend.",
          "AppCfg [options] backends stop: Stop the specified backend.",
          "AppCfg [options] backends delete: Delete the specified backend.",
          "AppCfg [options] backends configure: Configure the specified backend.");
    }
  }

  class StartAction extends AppCfgAction {
    StartAction() {
      super("start");
      shortDescription = "Start the specified server version.";
    }

    @Override
    public void execute() {
      admin.startServer();
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] start <app-dir>",
          "",
          "Starts the specified server version.");
    }
  }

  class StopAction extends AppCfgAction {
    StopAction() {
      super("stop");
      shortDescription = "Stop the specified server version.";
    }

    @Override
    public void execute() {
      admin.stopServer();
    }

    @Override
    protected List<String> getInitialHelpLines() {
      return ImmutableList.of(
          "AppCfg [options] stop <app-dir>",
          "",
          "Stops the specified server version.");
    }
  }

  private static class AppCfgListener implements UpdateListener {
    private final String operationName;

    AppCfgListener(String opName){
      operationName = opName;
    }
    @Override
    public void onProgress(UpdateProgressEvent event) {
      System.out.println(event.getPercentageComplete() + "% " + event.getMessage());
    }

    @Override
    public void onSuccess(UpdateSuccessEvent event) {
      String details = event.getDetails();
      if (details.length() > 0) {
        System.out.println();
        System.out.println("Details:");
        System.out.println(details);
      }

      System.out.println();
      System.out.println(operationName + " completed successfully.");
    }

    @Override
    public void onFailure(UpdateFailureEvent event) {
      String details = event.getDetails();
      if (details.length() > 0) {
        System.out.println();
        System.out.println("Error Details:");
        System.out.println(details);
      }

      System.out.println();
      String failMsg = event.getFailureMessage();
      System.out.println(failMsg);
      if (event.getCause() instanceof ClientAuthFailException) {
        System.out.println("Consider using the -e EMAIL option if that"
                           + " email address is incorrect.");
      }
    }
  }

  private static class AppCfgUpdateListener extends AppCfgListener {
    AppCfgUpdateListener(){
      super("Update");
    }
  }

  private static class AppCfgVacuumIndexesListener extends AppCfgListener {
    AppCfgVacuumIndexesListener(){
      super("vacuum_indexes");
    }
  }

  private static class HostPort {
    private final String host;
    private final String port;

    public HostPort(String hostport) {
      int colon = hostport.indexOf(':');
      host = colon < 0 ? hostport : hostport.substring(0, colon);
      port = colon < 0 ? "" : hostport.substring(colon + 1);
    }

    public String getHost() {
      return host;
    }

    public String getPort() {
      return port;
    }

    public boolean hasPort() {
      return port.length() > 0;
    }
  }

  private  void validateWarPath(File war) {
    if (!war.exists()) {
      System.out.println("Unable to find the webapp directory " + war);
      printHelp();
      System.exit(1);
    } else if (!war.isDirectory()) {
      System.out.println("appcfg only accepts webapp directories, not war files.");
      printHelp();
      System.exit(1);
    }
  }
}
