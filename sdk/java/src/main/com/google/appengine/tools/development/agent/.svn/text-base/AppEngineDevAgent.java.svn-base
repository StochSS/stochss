// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent;

import static com.google.apphosting.utils.clearcast.ClearCast.cast;
import static com.google.apphosting.utils.clearcast.ClearCast.staticCast;

import java.io.File;
import java.lang.instrument.Instrumentation;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.security.PermissionCollection;
import java.security.CodeSource;
import java.security.AllPermission;

/**
 * An instrumentation agent for the dev_appserver. Implements whitelisting and any
 * other facilities that require instrumentation.
 *
 */
public class AppEngineDevAgent {

  private static final String AGENT_IMPL =
      "com.google.appengine.tools.development.agent.impl.AgentImpl";

  private static final String AGENT_IMPL_JAR = "appengine-agentimpl.jar";

  private static final String AGENT_DIR_PROP = "appengine-agent-dir";

  private static final Logger logger = Logger.getLogger(AppEngineDevAgent.class.getName());

  private static Object impl;

  interface AgentImplStruct {
    void run(Instrumentation instrumentation, boolean treatRestrictedClassListViolationsAsErrors); Object getInstance();
  }

  public static void premain(String agentArgs, Instrumentation inst) {

    URL agentImplLib = findAgentImplLib();
    URLClassLoader agentImplLoader = new URLClassLoader(new URL[] {agentImplLib}) {
      @Override
      protected PermissionCollection getPermissions(CodeSource codesource) {
        PermissionCollection perms = super.getPermissions(codesource);
        perms.add(new AllPermission());
        return perms;
      }
    };
    try {
      Class<?> implClass = agentImplLoader.loadClass(AGENT_IMPL);
      impl = staticCast(implClass, AgentImplStruct.class).getInstance();
      AgentImplStruct agentImplStruct = cast(impl, AgentImplStruct.class);
      agentImplStruct.run(inst, treatRestrictedClassListViolationsAsErrors(agentArgs));
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Unable to load the App Engine dev agent. Security restrictions " +
          "will not be completely emulated.", e);
    }
  }

  private static boolean treatRestrictedClassListViolationsAsErrors(String agentArgs) {
    return "treatRestrictedClassListViolationsAsErrors=true".equals(agentArgs);
  }

  /**
   * Returns the agent implementation, which is loaded in its own ClassLoader.
   * The Agent structurally conforms to the {@link Agent Agent} interface.
   */
  public static Object getAgent() {
    return impl;
  }

  private static URL findAgentImplLib() {

    URL codeLocation = AppEngineDevAgent.class.getProtectionDomain().getCodeSource().getLocation();
    File agentDir;

    String agentDirFromSysProps = System.getProperty(AGENT_DIR_PROP);
    if (agentDirFromSysProps != null) {
      agentDir = new File(agentDirFromSysProps);
    } else {
      try {
        agentDir = new File(codeLocation.toURI());
      } catch (URISyntaxException e) {
        agentDir = new File(codeLocation.getFile());
      }

      agentDir = agentDir.getParentFile();
    }
    if (!agentDir.isDirectory()) {
      throw new RuntimeException(
          "Unable to find agent directory at " + agentDir.getAbsolutePath());
    }

    File agentImplLib = new File(agentDir, AGENT_IMPL_JAR);

    if (!agentImplLib.exists()) {
      throw new RuntimeException("Unable to find " + AGENT_IMPL_JAR + " in " +
          agentDir.getAbsolutePath());
    }

    try {
      return agentImplLib.toURI().toURL();
    } catch (MalformedURLException e) {
      throw new RuntimeException("Unable to retrieve a URL for " + agentImplLib.getAbsolutePath(),
          e);
    }
  }
}
