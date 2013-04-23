// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Used to configure a JUnit4 test that has been annotated with
 * {@code &#64RunWith(DevAppServerTestRunner.class}.
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface DevAppServerTest {

  /**
   * @return A class that can provide the configuration of the dev appserver
   * that will be launched for the test.  This class must be public and have a
   * public, no-arg constructor.
   */
  Class<? extends DevAppServerTestConfig> value();
}
