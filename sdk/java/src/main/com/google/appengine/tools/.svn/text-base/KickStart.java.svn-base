// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools;

import com.google.appengine.tools.admin.OutputPump;
import com.google.appengine.tools.development.DevAppServerMain;
import com.google.appengine.tools.info.SdkInfo;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * Launches a process in an operating-system agnostic way. Helps us avoid
 * idiosyncracies in scripts for different platforms. Currently this only
 * works for DevAppServerMain.
 *
 * Takes a command line invocation like:
 *
 * <pre>
 * java -cp ../lib/appengine-tools-api.jar com.google.appengine.tools.KickStart \
 *   --jvm_flag="-Dlog4j.configuration=log4j.props"
 *   com.google.appengine.tools.development.DevAppServerMain \
 *   --jvm_flag="-agentlib:jdwp=transport=dt_socket,server=y,address=7000"
 *   --address=localhost --port=5005 appDir
 * </pre>
 *
 * and turns it into:
 *
 * <pre>
 * java -cp &lt;an_absolute_path&gt;/lib/appengine-tools-api.jar \
 *   -Dlog4j.configuration=log4j.props \
 *   -agentlib:jdwp=transport=dt_socket,server=y,address=7000 \
 *   com.google.appengine.tools.development.DevAppServerMain \
 *   --address=localhost --port=5005 &lt;an_absolute_path&gt;/appDir
 * </pre>
 *
 * while also setting its working directory (if appropriate).
 * <p>
 * All arguments between {@code com.google.appengine.tools.KickStart} and
 * {@code com.google.appengine.tools.development.DevAppServerMain}, as well as
 * all {@code --jvm_flag} arguments after {@code DevAppServerMain}, are consumed
 * by KickStart. The remaining options after {@code DevAppServerMain} are
 * given as arguments to DevAppServerMain, without interpretation by
 * KickStart.
 *
 * At present, the only valid option to KickStart itself is:
 * <DL>
 * <DT>--jvm_flag=&lt;vm_arg&gt;</DT><DD>Passes &lt;vm_arg&gt; as a JVM
 * argument for the child JVM.  May be repeated.</DD>
 * </DL>
 * Additionally, if the --external_resource_dir argument is specified, we use it
 * to set the working directory instead of the application war directory.
 *
 */
public class KickStart {

  private static final Logger logger = Logger.getLogger(KickStart.class.getName());

  private static final String EXTERNAL_RESOURCE_DIR_FLAG =
      "--" + DevAppServerMain.EXTERNAL_RESOURCE_DIR_ARG;
  private static final String EXTERNAL_RESOURCE_DIR_ERROR_MESSAGE =
      EXTERNAL_RESOURCE_DIR_FLAG + "=<path> expected.";

  private static final String GENERATE_WAR_FLAG = "--" + DevAppServerMain.GENERATE_WAR_ARG;

  private static final String GENERATED_WAR_DIR_FLAG =
      "--" + DevAppServerMain.GENERATED_WAR_DIR_ARG;

  private static final String JVM_FLAG = "--jvm_flag";
  private static final String JVM_FLAG_ERROR_MESSAGE =
      JVM_FLAG + "=<flag> expected.\n" + JVM_FLAG + " may be repeated to supply multiple flags";

  private static final String START_ON_FIRST_THREAD_FLAG = "--startOnFirstThread";
  private static final String START_ON_FIRST_THREAD_ERROR_MESSAGE =
      START_ON_FIRST_THREAD_FLAG + "=<boolean> expected";

  private static final String SDK_ROOT_FLAG = "--sdk_root";
  private static final String SDK_ROOT_ERROR_MESSAGE = SDK_ROOT_FLAG + "=<path> expected";

  private Process serverProcess = null;

  public static void main(String[] args) {
    new KickStart(args);
  }

  private KickStart(String[] args) {
    String entryClass = null;

    ProcessBuilder builder = new ProcessBuilder();
    String home = System.getProperty("java.home");
    String javaExe = home + File.separator + "bin" + File.separator + "java";

    List<String> jvmArgs = new ArrayList<String>();
    ArrayList<String> appServerArgs = new ArrayList<String>();
    List<String> command = builder.command();
    command.add(javaExe);

    boolean startOnFirstThread = System.getProperty("os.name").equalsIgnoreCase("Mac OS X");
    String externalResourceDirArg = null;
    boolean generateWar = false;

    for (int i = 0; i < args.length; i++) {
      if (args[i].startsWith(EXTERNAL_RESOURCE_DIR_FLAG)) {
        externalResourceDirArg = extractValue(args[i], EXTERNAL_RESOURCE_DIR_ERROR_MESSAGE);
      } else if (args[i].startsWith(GENERATED_WAR_DIR_FLAG)
          || args[i].startsWith(GENERATE_WAR_FLAG)) {
        generateWar = true;
      }
      if (args[i].startsWith(JVM_FLAG)) {
        jvmArgs.add(extractValue(args[i], JVM_FLAG_ERROR_MESSAGE));
      } else if (args[i].startsWith(START_ON_FIRST_THREAD_FLAG)) {
        startOnFirstThread =
            Boolean.valueOf(extractValue(args[i], START_ON_FIRST_THREAD_ERROR_MESSAGE));
      } else if (entryClass == null) {
        if (args[i].charAt(0) == '-') {
          throw new IllegalArgumentException("Only --jvm_flag may precede classname, not "
              + args[i]);
        } else {
          entryClass = args[i];
          if (!entryClass.equals(DevAppServerMain.class.getName())) {
            throw new IllegalArgumentException("KickStart only works for DevAppServerMain");
          }
        }
      } else {
        appServerArgs.add(args[i]);
      }
    }

    if (entryClass == null) {
      throw new IllegalArgumentException("missing entry classname");
    }

    if (externalResourceDirArg == null && generateWar) {
      System.err.println(
          "Generating a war directory requires " + "--" + EXTERNAL_RESOURCE_DIR_FLAG);
      System.exit(1);
    }
    File newWorkingDir = newWorkingDir(externalResourceDirArg, args);
    builder.directory(newWorkingDir);

    if (startOnFirstThread) {
      jvmArgs.add("-XstartOnFirstThread");
    }

    String classpath = System.getProperty("java.class.path");
    StringBuffer newClassPath = new StringBuffer();
    assert classpath != null : "classpath must not be null";
    String[] paths = classpath.split(File.pathSeparator);
    for (int i = 0; i < paths.length; ++i) {
      newClassPath.append(new File(paths[i]).getAbsolutePath());
      if (i != paths.length - 1) {
        newClassPath.append(File.pathSeparator);
      }
    }

    String sdkRoot = null;

    List<String> absoluteAppServerArgs = new ArrayList<String>(appServerArgs.size());

    for (int i = 0; i < appServerArgs.size(); ++i) {
      String arg = appServerArgs.get(i);
      if (arg.startsWith(SDK_ROOT_FLAG)) {
        sdkRoot = new File(extractValue(arg, SDK_ROOT_ERROR_MESSAGE)).getAbsolutePath();
        arg = SDK_ROOT_FLAG + "=" + sdkRoot;
      } else if (arg.startsWith(EXTERNAL_RESOURCE_DIR_FLAG)) {
        arg = EXTERNAL_RESOURCE_DIR_FLAG + "="
            + new File(extractValue(arg, EXTERNAL_RESOURCE_DIR_ERROR_MESSAGE)).getAbsolutePath();
      } else if (i == appServerArgs.size() - 1) {
        if (!arg.startsWith("-")) {
          File file = new File(arg);
          if (file.exists()) {
            arg = new File(arg).getAbsolutePath();
          }
        }
      }
      absoluteAppServerArgs.add(arg);
    }

    if (sdkRoot == null) {
      sdkRoot = SdkInfo.getSdkRoot().getAbsolutePath();
    }

    String agentJar = sdkRoot + "/lib/agent/appengine-agent.jar";
    agentJar = agentJar.replace('/', File.separatorChar);
    jvmArgs.add("-javaagent:" + agentJar);

    String jdkOverridesJar = sdkRoot + "/lib/override/appengine-dev-jdk-overrides.jar";
    jdkOverridesJar = jdkOverridesJar.replace('/', File.separatorChar);
    jvmArgs.add("-Xbootclasspath/p:" + jdkOverridesJar);

    command.addAll(jvmArgs);
    command.add("-Ddatastore.auto_id_allocation_policy=scattered");
    command.add("-classpath");
    command.add(newClassPath.toString());
    command.add(entryClass);
    command.add("--property=kickstart.user.dir=" + System.getProperty("user.dir"));
    command.addAll(absoluteAppServerArgs);

    logger.fine("Executing " + command);

    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        if (serverProcess != null) {
          serverProcess.destroy();
        }
      }
    });

    try {
      serverProcess = builder.start();
    } catch (IOException e) {
      throw new RuntimeException("Unable to start the process", e);
    }

    new Thread(new OutputPump(serverProcess.getInputStream(),
        new PrintWriter(System.out, true))).start();
    new Thread(new OutputPump(serverProcess.getErrorStream(),
        new PrintWriter(System.err, true))).start();

    try {
      serverProcess.waitFor();
    } catch (InterruptedException e) {
    }

    serverProcess.destroy();
    serverProcess = null;
  }

  private static String extractValue(String argument, String errorMessage) {
    int indexOfEqualSign = argument.indexOf('=');
    if (indexOfEqualSign == -1) {
      throw new IllegalArgumentException(errorMessage);
    }
    return argument.substring(argument.indexOf('=') + 1);
  }

  /**
   * Encapsulates the logic to determine the working directory that should be set for the dev
   * appserver process. If one is explicitly specified it will be used. Otherwise the last
   * command-line argument will be used.
   *
   * @param workingDirectoryArg An explicitly specified path. If not {@code null} then it will be
   *        used.
   * @param args The command-line arguments. If {@code workingDirectory} is {@code null} then the
   *        last command-line argument will be used as the working directory.
   * @return The working directory to use. If the path to an existing directory was not specified
   * then we exist with a failure.
   */
  private static File newWorkingDir(String workingDirectoryArg, String[] args) {
    String workingDirPath;
    if (workingDirectoryArg != null) {
      workingDirPath = workingDirectoryArg;
    } else {
      if (args.length < 2 || args[args.length - 1].startsWith("-")) {
        DevAppServerMain.printHelp(System.out);
        System.exit(1);
      }
      workingDirPath = args[args.length - 1];
    }
    File newDir = new File(workingDirPath);
    if (!newDir.isDirectory()) {
      if (workingDirectoryArg != null) {
        System.err.println(workingDirectoryArg + " is not an existing directory.");
        System.exit(1);
      } else {
        DevAppServerMain.validateWarPath(newDir);
      }
    }
    return newDir;
  }
}
