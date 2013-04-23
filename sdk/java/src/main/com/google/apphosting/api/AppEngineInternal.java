// Copyright 2012 Google. All Rights Reserved.
package com.google.apphosting.api;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation that marks a package or class as internal to App Engine. When
 * applied to package, all subpackages are also considered to be internal. User
 * code cannot safely depend on any class with this annotation or any class
 * belonging to a package or a parent package with this annotation.
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value = {ElementType.PACKAGE, ElementType.TYPE})
public @interface AppEngineInternal {

  /**
   * @return A custom message to be printed when an unsafe reference to an
   * internal class is detected.
   */
  String message() default "";
}
