// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.tools.development.DevAppServer;

import org.junit.runners.BlockJUnit4ClassRunner;
import org.junit.runners.model.FrameworkField;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.InitializationError;
import org.junit.runners.model.Statement;
import org.junit.runners.model.TestClass;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * A JUnit4 test runner that runs tests in the isolated classloader of a
 * running app engine app.  Test classes that are run with this test runner
 * must also be annotated with {@link DevAppServerTest}.
 *
 * For example:
 * <blockquote>
 * <pre>
 * &#64RunWith(DevAppServerTestRunner.class)
 * &#64DevAppServerTest(MyTest.TestConfig.class)
 * public void MyTest {
 *
 *   private final LocalServiceTestHelper testHelper = new LocalServiceTestHelper(
 *     new LocalURLFetchServiceTestConfig(), new LocalDatastoreServiceTestConfig());
 *
 *   public static class TestConfig extends BaseDevAppServerTestConfig {
 *
 *     public File getSdkRoot() {
 *       return sdkRoot;
 *     }
 *
 *     public File getAppDir() {
 *       return appDir;
 *     }
 *
 *     public List<URL> getClasspath() {
 *       return urls;
 *     }
 *   }
 *
 *   &#64Before
 *   public void setUpHelper() {
 *     testHelper.setUp();
 *   }
 *
 *   &#64After
 *   public void tearDownHelper() {
 *     testHelper.tearDown();
 *   }
 *
 *   &#64Test
 *   public void testEndToEnd() throws Exception {
 *     URLFetchService fetchService = URLFetchServiceFactory.getURLFetchService();
 *     HTTPResponse resp = fetchService.fetch(new URL("http://localhost:" +
 *       System.getProperty(DevAppServerTest.DEFAULT_PORT_SYSTEM_PROPERTY) + "/insertFoo?id=33"));
 *     assertEquals(200, resp.getResponseCode());
 *     DatastoreServiceFactory.getDatastoreService().get(KeyFactory.createKey("foo", 33));
 *   }
 * }
 * </pre>
 * </blockquote>
 *
 */
public class DevAppServerTestRunner extends BlockJUnit4ClassRunner {

  public DevAppServerTestRunner(Class<?> klass) throws InitializationError {
    super(startServerAndIsolateClass(klass));
  }

  private static Class<?> startServerAndIsolateClass(Class<?> klass) throws InitializationError {
    DevAppServerTest testAnno = klass.getAnnotation(DevAppServerTest.class);
    if (testAnno == null) {
      throw new InitializationError(String.format(
          "Test uses %s but is not also annotated with %s.",
          DevAppServerTestRunner.class.getSimpleName(), DevAppServerTest.class.getSimpleName()));
    }
    try {
      DevAppServerTestConfig config = testAnno.value().newInstance();
      DevAppServer devServer = DevAppServerTestHelper.startServer(config);
      return devServer.getAppContext().getClassLoader().loadClass(klass.getName());
    } catch (InstantiationException e) {
      throw new InitializationError(e);
    } catch (IllegalAccessException e) {
      throw new InitializationError(e);
    } catch (ClassNotFoundException e) {
      throw new InitializationError(e);
    }
  }

  @Override
  protected void collectInitializationErrors(List<Throwable> errors) {
    try {
      rewriteAnnotationMap("fMethodsForAnnotations");
      rewriteAnnotationMap("fFieldsForAnnotations");
      super.collectInitializationErrors(errors);
    } catch (InitializationError initializationError) {
      errors.add(initializationError);
    }
  }

  /**
   * {@link TestClass} has 2 maps.  One maps annotation classes to a list of
   * {@link FrameworkMethod}, one entry in the list per method annotated with
   * the map key.  The other maps classes to a list of {@link FrameworkField},
   * one entry in the list per field annotated with the map key.  These maps
   * are constructed when the TestClass is constructed.  The problem with these
   * maps is that the keys are annotation classes that were loaded by the
   * isolated classloader, but when junit tries to look up entries in these
   * maps it provides annotation classes that were loaded by the junit
   * classloader (typically the system classloader).  As a result, the map
   * lookups return null and we get all sorts of errors.  Our solution is to
   * rewrite these maps to include the same entries but with keys that belong
   * to junit's classloader.  This allows lookups to succeed whether the key
   * was loaded by junit's classloader or the isolated classloader.
   */
  private void rewriteAnnotationMap(String mapFieldName) throws InitializationError {
    Field annotationMapField;
    try {
      annotationMapField = getTestClass().getClass().getDeclaredField(mapFieldName);
      annotationMapField.setAccessible(true);
      @SuppressWarnings("unchecked")
      Map<Class<?>, List<?>> annotationMap =
          (Map<Class<?>, List<?>>) annotationMapField.get(getTestClass());
      Map<Class<?>, List<?>> copy = new HashMap<Class<?>, List<?>>(annotationMap);
      ClassLoader junitClassLoader = getClass().getClassLoader();
      for (Map.Entry<Class<?>, List<?>> entry : copy.entrySet()) {
        annotationMap.put(junitClassLoader.loadClass(entry.getKey().getName()), entry.getValue());
      }
    } catch (NoSuchFieldException e) {
      throw new InitializationError(e);
    } catch (IllegalAccessException e) {
      throw new InitializationError(e);
    } catch (ClassNotFoundException e) {
      throw new InitializationError(e);
    }
  }

  @Override
  protected Statement withAfterClasses(Statement statement) {
    final Statement statementWithAfter = super.withAfterClasses(statement);
    return new Statement() {
      @Override
      public void evaluate() throws Throwable {
        Throwable exception = null;
        try {
          statementWithAfter.evaluate();
        } catch (Throwable e) {
          exception = e;
        } finally {
          try {
            DevAppServerTestHelper.stopServer();
          } catch (Throwable e) {
            if (exception == null) {
              exception = e;
            }
          }
        }
        if (exception != null) {
          throw exception;
        }
      }
    };
  }
}
