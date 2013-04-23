// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.apphosting.api;

import sun.misc.Unsafe;

import java.lang.reflect.Field;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.security.PrivilegedExceptionAction;
import java.util.HashSet;
import java.util.Set;

/**
 * Provides special reflection utilities to frameworks running on Google App
 * Engine.  Most applications will not need to use this class. The
 * utilities provided by this class are similar to those provided by the
 * class {@link sun.misc.Unsafe}.
 * <p>
 * As of this writing we only expose one method:
 * {@link #allocateInstance(Class)}. This is needed by GWT for their
 * serialization strategy.
 *
 */
public final class ReflectionUtils {

  private static final String USER_CLASSLOADER_PROD =
    "com.google.apphosting.runtime.security.UserClassLoader";

  private static final String USER_CLASS_LOADER_DEV =
    "com.google.appengine.tools.development.IsolatedAppClassLoader";

  private ReflectionUtils(){}

  private static Unsafe theUnsafe;

  /**
   * We only support the method {@link #allocateInstance(Class)} on user classes
   * and a small set of exceptions.
   */
  private static final Set<String> allocateInstanceExceptionSet;

  static {
    try {
      AccessController.doPrivileged(new PrivilegedExceptionAction<Object>() {
        public Object run() throws NoSuchFieldException, IllegalAccessException {
          Class<?> klass = sun.misc.Unsafe.class;
          Field field = klass.getDeclaredField("theUnsafe");
          field.setAccessible(true);
          theUnsafe = (sun.misc.Unsafe) field.get(null);
          return null;
        }
      });

      allocateInstanceExceptionSet = new HashSet<String>(2);
      allocateInstanceExceptionSet.add(Object.class.getName());
      allocateInstanceExceptionSet.add(Number.class.getName());
    } catch (Throwable t) {
      throw new RuntimeException("Error initializing com.google.apphosting.api.ReflectionUtils", t);
    }
  }

  /**
   * Allocate an instance of a given class but do not run any constructor.
   * This can be useful to frameworks implementing serialization. This method
   * only supports App Engine user classes, not JRE classes.
   *
   * @param klass The class
   * @return An instance of the class
   * @throws SecurityException if klass is not a legal class.
   */
  public static Object allocateInstance(Class<?> klass) throws InstantiationException{
    if (null == klass) {
      throw new NullPointerException();
    }
    checkFullClassHierarchyIsSafeToAllocateInstance(klass, getUserClassLoader());
    return theUnsafe.allocateInstance(klass);
  }

  /**
   * Retrieves the UserClassLoader in both the prod and
   * dev environments.
   */
  private static ClassLoader getUserClassLoader() {
    ClassLoader userClassLoader = getUserClassLoader(USER_CLASSLOADER_PROD);
    if (null == userClassLoader){
      userClassLoader = getUserClassLoader(USER_CLASS_LOADER_DEV);
    }
    return userClassLoader;
  }

  /**
   * Attempts to locate the "current" UserClassLoader by using the Thread
   * contextClassLoader. This method may return null, indicating that the current
   * thread is not an App Engine user thread.
   */
  private static ClassLoader getUserClassLoader(final String classLoaderClassName) {
    return AccessController.doPrivileged(new PrivilegedAction<ClassLoader>(){
      public ClassLoader run(){
        ClassLoader current = Thread.currentThread().getContextClassLoader();
        while (current != null) {
          if (current.getClass().getName().equals(classLoaderClassName)) {
            return current;
          }
          current = current.getClass().getClassLoader();
        }
        return current;
      }
    });
  }

  /**
   * Recursively checks that the provided class and all of its ancestors satisfy
   * one of the following two conditions:
   * <ul>
   *   <li> The class was loaded by the user class loader, or
   *   <li> {@link #isExceptionToAllocateInstanceRule(Class)} is true
   * </ul>
   * @param klass A non-null Class object
   */
  private static void checkFullClassHierarchyIsSafeToAllocateInstance(
      Class<?> klass, ClassLoader userClassLoader) {
    if (null == userClassLoader){
      return;
    }
    if (!wasLoadedByUserClassLoader(klass, userClassLoader)
        && !isExceptionToAllocateInstanceRule(klass)) {
      throw new SecurityException("App Engine only supports the use of the method "
          + "ReflectionUtils.allocateInstance(Class klass) on selected classes. "
          + "The following may not be in the type hierarchy of the supplied class: "
          + klass.getName());
    }
    klass = klass.getSuperclass();
    if (null != klass){
      checkFullClassHierarchyIsSafeToAllocateInstance(klass, userClassLoader);
    }
  }

  /**
   * Checks whether or not the provided class is an exception
   * to our rule that we only support {@link #allocateInstance(Class)}
   * for user classes. Currently we keep a static set of such excpetions.
   * @param klass non-null Class object
   * @return boolean indicating whether or not the class is an exception.
   */
  private static boolean isExceptionToAllocateInstanceRule(Class<?> klass){
    return allocateInstanceExceptionSet.contains(klass.getName());
  }

  private static boolean wasLoadedByUserClassLoader(final Class<?> klass,
      final ClassLoader userClassLoader) {
    return AccessController.doPrivileged(new PrivilegedAction<Boolean>() {
      public Boolean run() {
        ClassLoader currentLoader = klass.getClassLoader();
        while (true) {
          if (currentLoader == null) {
            return false;
          }
          if (currentLoader == userClassLoader) {
            return true;
          }
          currentLoader = currentLoader.getClass().getClassLoader();
        }
      }
    });
  }

}
