// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.agent.runtime;

import com.google.apphosting.api.AppEngineInternal;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * The only reason this class is split out from {@link Runtime} is so that we
 * can have tests that don't need to worry about Runtime's crazy static
 * initialization business.
 *
 */
class RuntimeHelper {
  private static final Logger logger = Logger.getLogger(RuntimeHelper.class.getName());

  static final Map<String, AppEngineInternal> internalAnnotationCache =
      Collections.synchronizedMap(new HashMap<String, AppEngineInternal>());

  private static final boolean appEngineInternalOnClasspath;

  static {
    boolean exists = false;
    try {
      AppEngineInternal.class.getName();
      exists = true;
    } catch (NoClassDefFoundError ncdf) {
    }
    appEngineInternalOnClasspath = exists;
  }

  private RuntimeHelper() { }

  /**
   * Check to see if the class identified by {@code classStr} is a restricted
   * class. If it is, either output a warning or throw
   * {@link NoClassDefFoundError}, depending on the value of
   * {@code violationIsError}.
   *
   * @param violationIsError If {@code true}, throw
   * {@link NoClassDefFoundError} if the class is restricted, otherwise log a
   * warning.
   * @param classStr The class to check.
   * @param callingClassStr The class that is referencing {@code classStr}.
   * @param callingClassCodeSource The codesource of the class that is
   * referencing {@code classStr}.
   */
  public static void checkRestricted(boolean violationIsError, String classStr,
      String callingClassStr, String callingClassCodeSource) {
    if (!appEngineInternalOnClasspath) {
      return;
    }
    if (classStr.startsWith("java.") || classStr.startsWith("javax.")) {
      return;
    }
    try {
      Class<?> cls = Class.forName(classStr);
      AppEngineInternal anno = getAppEngineInternalAnnotation(cls);
      if (anno != null) {
        String errorMsg = String.format("Class %s loaded from %s has a dependency on class %s "
            + "loaded from %s, which is not part of App Engine's supported API.", callingClassStr,
            callingClassCodeSource, cls.getName(), cls.getProtectionDomain().getCodeSource());
        if (!anno.message().isEmpty()) {
          errorMsg += "\n" + anno.message();
        }
        if (violationIsError) {
          throw new NoClassDefFoundError(errorMsg);
        } else {
          logger.warning(errorMsg + "\nYou are strongly discouraged "
              + "from using this class - your app may stop working in production at any moment.");
        }
      }
    } catch (ClassNotFoundException e) {
    }
  }

  /**
   * @param cls The for which we are trying to locate the annotation.
   * @return The annotation. Can be null.
   */
  static AppEngineInternal getAppEngineInternalAnnotation(Class<?> cls) {
    List<String> namesExamined = new LinkedList<String>();
    String name = cls.getName();
    boolean firstPass = true;
    while (name != null) {
      if (internalAnnotationCache.containsKey(name)) {
        AppEngineInternal anno = internalAnnotationCache.get(name);
        updateInternalAnnotationCache(namesExamined, anno);
        return anno;
      }
      try {
        namesExamined.add(name);
        if (!firstPass) {
          cls = Class.forName(name + ".package-info");
        } else {
        }
        AppEngineInternal anno = cls.getAnnotation(AppEngineInternal.class);
        if (anno != null) {
          updateInternalAnnotationCache(namesExamined, anno);
          return anno;
        }
      } catch (ClassNotFoundException cnfe) {
      }
      name = getOwningPackage(name);
      firstPass = false;
    }
    updateInternalAnnotationCache(namesExamined, null);
    return null;
  }

  /**
   * Update the internal annotation cache. Since the cache represents a tree
   * hierarchy, we want to update the entire branch we just walked. Consider
   * the case of starting at package a.b.c.d and finding the annotation at
   * a.b. We want to cache the annotation at a.b, a.b.c and a.b.c.d. This
   * way if our next lookup just starts at a.b.c we will find it immediately.
   *
   * @param namesToUpdate The list of names to update with the annotation.
   * @param anno The annotation that we found. May be null.
   */
  static void updateInternalAnnotationCache(List<String> namesToUpdate,
      AppEngineInternal anno) {
    for (String name : namesToUpdate) {
      internalAnnotationCache.put(name, anno);
    }
  }

  /**
   * Get the name of the package that owns the provided resource.
   * The resource can be another package or a class name. Returns {@code null}
   * if there is no owning package.
   */
  static String getOwningPackage(String resource) {
    int lastDot = resource.lastIndexOf('.');
    if (lastDot == -1) {
      return null;
    }
    return resource.substring(0, lastDot);
  }
}
