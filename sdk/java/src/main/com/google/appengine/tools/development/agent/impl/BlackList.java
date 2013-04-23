// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import com.google.appengine.tools.plugins.SharedConstants;
import com.google.apphosting.runtime.security.WhiteList;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The list of JRE classes that we don't support in user code.
 *
 */
public class BlackList {

  private static final Logger logger = Logger.getLogger(BlackList.class.getName());

  private static Set<String> blackList = new HashSet<String>();

  static {
    initBlackList();
  }

  private static void initBlackList() {

    Set<File> jreJars = getCurrentJreJars();

    for (File f : jreJars) {
      JarFile jarFile = null;
      try {
        jarFile = new JarFile(f);
      } catch (IOException e) {
        logger.log(Level.SEVERE, "Unable to read a jre library while constructing the blacklist. " +
            "Security restrictions may not be entirely emulated. " + f.getAbsolutePath());
        continue;
      }

      Enumeration<JarEntry> entries = jarFile.entries();

      while (entries.hasMoreElements()) {
        JarEntry entry = entries.nextElement();
        String entryName = entry.getName();
        if (!entryName.endsWith(".class")) {
          continue;
        }
        String className = entryName.replace('/', '.').substring(0, entryName.length() -
            ".class".length());
        if (isBlackListed(className)) {
          blackList.add(className.replace('.', '/'));
        }
      }
    }

    blackList = Collections.unmodifiableSet(blackList);
  }

  private static boolean isBlackListed(String className) {
    Set<String> whiteList = WhiteList.getWhiteList();
    if (whiteList.contains(className)) {
      return false;
    }
    if (className.startsWith("com.sun.xml.internal.bind.")) {
      return false;
    }
    if (inApplicationPreparationMode()
        && (className.startsWith("java.io") || className.startsWith("java.nio"))) {
      return false;
    }
    return true;
  }

  private static boolean inApplicationPreparationMode() {
    return Boolean.valueOf(
        System.getProperty(SharedConstants.APPLICATION_PREPARATION_MODE_SYSTEM_PROPERTY));
  }

  /**
   * Returns a list of classes that are blacklisted. Unlike the WhiteList,
   * classes are in JVMS binary format, for example, "java/lang/String".
   */
  public static Set<String> getBlackList() {
    return blackList;
  }

  private static Set<File> getCurrentJreJars() {
    return getJreJars(System.getProperty("java.home"));
  }

  private static Set<File> getJreJars(String jreHome) {
    Set<File> matchingFiles = new HashSet<File>();
    FilenameFilter filter = new FilenameFilter() {
      @Override
      public boolean accept(File dir, String name) {
        return name.endsWith(".jar");
      }
    };

    getFilesRecursive(matchingFiles, new File(jreHome + File.separator + "lib"), filter);

    return matchingFiles;
  }

  private static void getFilesRecursive(final Set<File> matchingFiles, final File dir,
      final FilenameFilter filter) {
    File[] files = dir.listFiles();

    for (File f : files) {
      if (f.isDirectory()) {
        getFilesRecursive(matchingFiles, f, filter);
      } else if (filter.accept(dir, f.getName())) {
        matchingFiles.add(f);
      }
    }
  }

}
