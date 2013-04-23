// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.DatagramSocket;
import java.net.DatagramSocketImpl;
import java.net.DatagramSocketImplFactory;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketImpl;
import java.net.SocketImplFactory;
import java.security.AccessController;
import java.security.PrivilegedAction;

/**
 * Delegates between {@link java.net.SocksSocketImpl native SocketImpl} and
 * {@link com.google.appengine.api.socket.AppEngineSocketImpl App Engine SocketImpl}
 * for stream sockets and
 * {@link java.net.DefaultDatagramSocketImplFactory java's datagram socket factory} and
 * {@link com.google.appengine.api.socket.AppEngineSocketImpl App Engine DatagramSocketImpl}
 * factories depending on a thread-local "mode" flag.
 *
 * <p>This class is loaded by the system class loader and hence only one
 * instance of this class will exist. This gets around the issue of
 * multiple {@link DevAppServerClassLoader} class instances being
 * instantiated in various unit tests conflicting with
 * {@link java.net.Socket#setSocketImplFactory(SocketImplFactory) Socket.setSocketImplFactory()}
 * being called multiple times.
 *
 * <p>{@link com.google.appengine.api.socket.dev.DevSocketFilter DevSocketFilter} is
 * used to trigger when application code is entered into. Application code
 * invocations of {@link java.net.Socket Socket} needs to create sockets using
 * {@link com.google.appengine.api.socket.AppEngineSocketImpl App Engine Sockets}
 * while dev AppServer tools code should use {@link java.net.SocksSocketImpl native sockets}.
 *
 */
@SuppressWarnings("javadoc")
public class DevSocketImplFactory implements SocketImplFactory, DatagramSocketImplFactory {
  private static final ThreadLocal<Boolean> nativeSocketMode = new ThreadLocal<Boolean>() {
      @Override
      protected Boolean initialValue() {
          return true;
      }
    };
  private static final Constructor<?> SOCKS_SOCKET_IMPL_CONSTRUCTOR;

  private static final Method CREATE_DATAGRAM_SOCKET_IMPL;
  private static final Constructor<?> DATAGRAM_SOCKET_IMPL_CONSTRUCTOR;

  private static SocketImplFactory appEngineSocketImplFactory = null;
  private static DatagramSocketImplFactory appEngineDatagramSocketImplFactory = null;
  private static boolean isInstalled = false;
  private static DevSocketImplFactory instance;
  private static boolean override = false;

  private DevSocketImplFactory() {
  }

  static {
    try {
      SOCKS_SOCKET_IMPL_CONSTRUCTOR =
          Class.forName("java.net.SocksSocketImpl").getDeclaredConstructor();
    } catch (SecurityException e) {
      throw new IllegalStateException(e);
    } catch (NoSuchMethodException e) {
      throw new IllegalStateException(e);
    } catch (ClassNotFoundException e) {
      throw new IllegalStateException(e);
    }
    SOCKS_SOCKET_IMPL_CONSTRUCTOR.setAccessible(true);

    CREATE_DATAGRAM_SOCKET_IMPL = getDefaultCreateDatagramSocketImplMethod();

    if (CREATE_DATAGRAM_SOCKET_IMPL == null) {
      try {
        DATAGRAM_SOCKET_IMPL_CONSTRUCTOR =
            Class.forName("java.net.PlainDatagramSocketImpl").getDeclaredConstructor();
      } catch (SecurityException e) {
        throw new IllegalStateException(e);
      } catch (NoSuchMethodException e) {
        throw new IllegalStateException(e);
      } catch (ClassNotFoundException e) {
        throw new IllegalStateException(e);
      }
      DATAGRAM_SOCKET_IMPL_CONSTRUCTOR.setAccessible(true);
    } else {
      DATAGRAM_SOCKET_IMPL_CONSTRUCTOR = null;
    }
  }

  private static Method getDefaultCreateDatagramSocketImplMethod() {
    Method method;
    try {
      method = Class.forName("java.net.DefaultDatagramSocketImplFactory")
          .getDeclaredMethod("createDatagramSocketImpl", boolean.class);
    } catch (SecurityException e) {
      throw new IllegalStateException(e);
    } catch (NoSuchMethodException e) {
      return null;
    } catch (ClassNotFoundException e) {
      return null;
    }
    method.setAccessible(true);
    return method;
  }

  private static void setInstance(DevSocketImplFactory instance) {
    DevSocketImplFactory.instance = instance;
  }

  /**
   * Installs this factory into the java runtime.
   * <p>Only needs to be called once. Subsequent calls are no-op.
   */
  public static void install() {
    if (isInstalled) {
      return;
    }
    AccessController.doPrivileged(
        new PrivilegedAction<Void>() {
          @Override
          public Void run() {
            DevSocketImplFactory socketFactory = new DevSocketImplFactory();
            setInstance(socketFactory);
            try {
              Socket.setSocketImplFactory(socketFactory);
            } catch (IOException e) {
              throw new IllegalStateException("setSocketImplFactory failed.", e);
            }
            try {
              ServerSocket.setSocketFactory(socketFactory);
            } catch (IOException e) {
              throw new IllegalStateException("setSocketFactory failed.", e);
            }
            try {
              DatagramSocket.setDatagramSocketImplFactory(socketFactory);
            } catch (IOException e) {
              throw new IllegalStateException("setDatagramSocketImplFactory failed.", e);
            }
            return null;
          }
        });
    isInstalled  = true;
  }

  /**
   * @see java.net.SocketImplFactory#createSocketImpl()
   */
  @Override
  public SocketImpl createSocketImpl() {
    if (appEngineSocketImplFactory == null || nativeSocketMode.get() || override) {
      return createNativeSocketImpl();
    }
    return appEngineSocketImplFactory.createSocketImpl();
  }

  /**
   * @see java.net.DatagramSocketImplFactory#createDatagramSocketImpl()
   */
  @Override
  public DatagramSocketImpl createDatagramSocketImpl() {
    if (appEngineDatagramSocketImplFactory == null || nativeSocketMode.get() || override) {
      return createNativeDatagramSocketImpl();
    }
    return appEngineDatagramSocketImplFactory.createDatagramSocketImpl();
  }

  static DatagramSocketImpl createNativeDatagramSocketImpl() {
    if (CREATE_DATAGRAM_SOCKET_IMPL != null) {
      try {
        return (DatagramSocketImpl) CREATE_DATAGRAM_SOCKET_IMPL.invoke(null, false);
      } catch (IllegalArgumentException e) {
        throw new IllegalStateException(e);
      } catch (IllegalAccessException e) {
        throw new IllegalStateException(e);
      } catch (InvocationTargetException e) {
        throw new IllegalStateException(e);
      }
    }

    try {
      return (DatagramSocketImpl) DATAGRAM_SOCKET_IMPL_CONSTRUCTOR.newInstance();
    } catch (IllegalArgumentException e) {
      throw new IllegalStateException(e);
    } catch (InstantiationException e) {
      throw new IllegalStateException(e);
    } catch (IllegalAccessException e) {
      throw new IllegalStateException(e);
    } catch (InvocationTargetException e) {
      throw new IllegalStateException(e);
    }
  }

  static SocketImpl createNativeSocketImpl() {
    try {
      return (SocketImpl) SOCKS_SOCKET_IMPL_CONSTRUCTOR.newInstance();
    } catch (IllegalArgumentException e) {
      throw new IllegalStateException(e);
    } catch (InstantiationException e) {
      throw new IllegalStateException(e);
    } catch (IllegalAccessException e) {
      throw new IllegalStateException(e);
    } catch (InvocationTargetException e) {
      throw new IllegalStateException(e);
    }
  }

  /**
   * Sets the current {@link SocketImplFactory} to use for app engine sockets.
   */
  public static void setAppEngineSocketImplFactory(SocketImplFactory appEngineSocketImplFactory) {
    if (appEngineSocketImplFactory == null) {
      throw new IllegalArgumentException(
          "Parameter devAppserverSocketImplFactory may not be null.");
    }

    if (!isInstalled) {
      throw new IllegalStateException(
          "Calling setCurrentSocketImplFactory is ineffective since " +
          "DevSocketImplFactory is not installed.");
    }
    DevSocketImplFactory.appEngineSocketImplFactory = appEngineSocketImplFactory;
  }

  /**
   * Sets the current {@link SocketImplFactory} to use for app engine sockets.
   */
  public static void setAppEngineDatagramSocketImplFactory(
      DatagramSocketImplFactory appEngineDatagramSocketImplFactory) {
    if (appEngineSocketImplFactory == null) {
      throw new IllegalArgumentException(
          "Parameter devAppserverSocketImplFactory may not be null.");
    }

    if (!isInstalled) {
      throw new IllegalStateException(
          "Calling setCurrentSocketImplFactory is ineffective since " +
          "DevSocketImplFactory is not installed.");
    }
    DevSocketImplFactory.appEngineDatagramSocketImplFactory = appEngineDatagramSocketImplFactory;
  }

  /**
   * Returns true if {@link java.net.Socket} construction will result in native
   * sockets to be created.
   */
  public static boolean isNativeSocketMode() {
    return nativeSocketMode.get();
  }

  /**
   * Sets the types of sockets to create.
   *
   * @param nativeMode
   * @return The value of the native mode socket mode.
   */
  public static boolean setSocketNativeMode(boolean nativeMode) {
    synchronized (DevSocketImplFactory.class) {
      boolean lastMode = nativeSocketMode.get();
      nativeSocketMode.set(nativeMode);
      return lastMode;
    }
  }

  public static DevSocketImplFactory getInstance() {
    return instance;
  }

  /**
   * Sets the override mode to use native sockets (for all threads)
   * and returns the previous override mode.  Used in tests.
   */
  public static boolean setOverrideMode(boolean override) {
    boolean lastOverride = DevSocketImplFactory.override ;
    DevSocketImplFactory.override = override;
    return lastOverride;
  }
}
