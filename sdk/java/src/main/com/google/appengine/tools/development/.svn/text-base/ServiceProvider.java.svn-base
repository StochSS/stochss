// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.lang.annotation.Documented;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;

/**
 * An annotation for service providers as described in {@link java.util.ServiceLoader}.
 * The
 * {@link com.google.appengine.tools.development.ServiceProviderProcessor ServiceProviderProcessor}
 * generates the configuration files which allows service providers
 * to be loaded with {@link java.util.ServiceLoader#load(Class) ServiceLoader.load(Class)}.
 * You must enable the processor, typically by specifying
 *   {@code "-processor com.google.appengine.tools.development.ServiceProviderProcessor"}
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
@Target(ElementType.TYPE)
public @interface ServiceProvider {

  /**
   * Returns the interface implemented by this ServiceProvider.
   */
  Class<?> value();
}
