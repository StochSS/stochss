// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.spi;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * An annotation for service providers as described in {@link java.util.ServiceLoader}.
 * The
 * {@link com.google.appengine.spi.ServiceProviderProcessor ServiceProviderProcessor}
 * generates the configuration files which allows service providers
 * to be loaded with {@link java.util.ServiceLoader#load(Class) ServiceLoader.load(Class)}.
 * You must enable the processor, typically by specifying
 *   {@code "-processor com.google.appengine.spi.ServiceProviderProcessor"}
 * as a flag to javac.
 *
 * <p>
 * Service providers assert that they conform to the service provider
 * specification. Specifically they must:<ul>
 *  <li>be a non-inner, non-anonymous, concrete class</li>
 *  <li>have a publically accessible no-arg constructor</li>
 *  <li>implement the interface type returned by {@code value()}</li>
 * </ul>
 *
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ServiceProvider {

  public static final int DEFAULT_PRECEDENCE = 0;

  /**
   * Returns the interface implemented by this ServiceProvider.
   */
  Class<?> value();

  /**
   * Higher precedence will take priority over lower precedences for a given <code>value</code>.
   */
  int precedence() default DEFAULT_PRECEDENCE;
}
