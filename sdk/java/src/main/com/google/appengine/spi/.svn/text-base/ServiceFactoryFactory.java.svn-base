// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.spi;

import com.google.common.base.Preconditions;

import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.ServiceConfigurationError;
import java.util.ServiceLoader;
import java.util.concurrent.atomic.AtomicReference;

/**
 * <b>This class is not intended for end users.</b>
 *
 * <p>Provide factory instances for AppEngine APIs. Each API will have an associated
 * {@link FactoryProvider} registered with this class. N.B. <i>Once {@link #getFactory(Class)} has
 * been called, no further mappings may be registered with this class.</i>
 *
 * <p>To construct the runtime mapping, this class first uses {@code java.util.ServiceLoader} to
 * find all registered {@link FactoryProvider} entities using the {@code ClassLoader} of
 * {@code ServiceFactoryFactory}. Finally, the explicitly registered providers
 * {@link #register(FactoryProvider)} are merged in.
 *
 * <p>If {@code ServiceLoader} locates multiple providers for a given factory interface, the
 * ambiguity can be resolved by using the {@link ServiceProvider#precedence} annotation property
 * (higher precedence wins; <i>the google implementations all have precedence
 * Integer.MIN_VALUE</i>). An exception is raised if the ambiguity cannot be resolved. Note that
 * explicit registration ({@link #register(FactoryProvider)}) always takes precedence (it does not
 * honor the {@link ServiceProvider#precedence} annotation property).
 *
 * <p>Authors of {@link FactoryProvider}s are encouraged to leverage {@link ServiceProvider} and
 * {@link ServiceProviderProcessor}.
 *
 */
public final class ServiceFactoryFactory {

  /**
   * Providers should be registered with this entity prior to the first call to getFactory().
   */
  private static AtomicReference<FactoryProviderRegistry> explicitRegistry =
      new AtomicReference<FactoryProviderRegistry>(new FactoryProviderRegistry());

  /**
   * Used by AppEngine service factories. Returns an instance of the factory implementing the
   * interface provide by {@code base}. Since there must always be a provider registered for a given
   * base, an error will be raised if no appropriate registration is found.
   *
   * @param base The returned factory must extend this class.
   * @param <T> The type of the factory
   *
   * @throws IllegalArgumentException raised if the client requests a factory that does not have a
   *         provider registered for it.
   * @throws ServiceConfigurationError raised if there is a problem creating the factory instance
   */
  public static <T> T getFactory(Class<T> base) {

    FactoryProvider<T> p = RuntimeRegistry.runtimeRegistry.getFactoryProvider(base);

    if (p == null) {
      throw new IllegalArgumentException(
          "No provider was registered for " + base.getCanonicalName());
    }

    try {
      return p.getFactoryInstance();
    } catch (Exception e) {
      throw new ServiceConfigurationError(
          "Exception while getting factory instance for " + base.getCanonicalName(), e);
    }

  }

  /**
   * Explicitly register a provider. This does not take the precedence (see
   * {@link FactoryProvider#getPrecedence()}) of the provider into consideration; subsequent
   * registrations will always override previous ones.
   *
   * @param p The provider to register
   *
   * @throws IllegalStateException raised if calls to getFactoryProvider have already been made.
   */
  public static synchronized <I> void register(FactoryProvider<I> p) {

    FactoryProviderRegistry temp = explicitRegistry.get();

    Preconditions.checkState(
        temp != null, "No modifications allowed after calls to getFactoryProvider");

    temp.register(p);
  }

  private static final class RuntimeRegistry {
    static final FactoryProviderRegistry runtimeRegistry = new FactoryProviderRegistry();

    static {

      FactoryProviderRegistry explicitRegistrations = explicitRegistry.getAndSet(null);

      List<FactoryProvider<?>> providers = getProvidersUsingServiceLoader();

      Collections.sort(providers);

      for (FactoryProvider<?> provider : providers) {
        FactoryProvider<?> previous = runtimeRegistry.register(provider);
        Preconditions.checkState(!provider.equals(previous),
            "Ambiguous providers: " + provider + " versus " + previous);
      }

      for (FactoryProvider<?> provider : explicitRegistrations.getAllProviders())
      {
        runtimeRegistry.register(provider);
      }
    }
  }

  /**
   * Retrieves the list of factory providers from the classpath
   */
  private static List<FactoryProvider<?>> getProvidersUsingServiceLoader() {
    return AccessController.doPrivileged(new PrivilegedAction<List<FactoryProvider<?>>>() {
      @Override
      public List<FactoryProvider<?>> run() {
        List<FactoryProvider<?>> result = new LinkedList<FactoryProvider<?>>();

        ClassLoader classLoader = ServiceFactoryFactory.class.getClassLoader();

        @SuppressWarnings("rawtypes")
        ServiceLoader<FactoryProvider> providers =
            ServiceLoader.load(FactoryProvider.class, classLoader);

        if (providers != null) {
          for (FactoryProvider<?> provider : providers) {
            result.add(provider);
          }
        }

        return result;
      }
    });
  }
}
