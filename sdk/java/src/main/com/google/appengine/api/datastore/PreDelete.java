// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Identifies a callback method to be invoked before an {@link Entity} of any
 * of the specified kinds is deleted from the datastore.  If {@link #kinds()}
 * is not provided the callback will execute for all kinds.  Methods with this
 * annotation must return {@code void}, must accept a single argument of type
 * {@link DeleteContext}, must not throw any checked exceptions, must not be
 * static, and must belong to a class with a no-arg constructor.  Neither the
 * method nor the no-arg constructor of the class to which it belongs are
 * required to be public.  Methods with this annotation are free to throw any
 * unchecked exception they like.  Throwing an unchecked exception will prevent
 * callbacks that have not yet been executed from running, and the exception
 * will propagate to the code that invoked the datastore operation that
 * resulted in the invocation of the callback.  Throwing an unchecked exception
 * from a callback will prevent the datastore operation from executing.
 *
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface PreDelete {

  /**
   * The kinds to which this callback applies.  The default value is an empty
   * array, which indicates that the callback should run for all kinds.
   *
   * @return The kinds to which this callback applies.
   */
  String[] kinds() default {};
}
