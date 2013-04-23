// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import sun.net.spi.nameservice.NameService;

import java.net.DatagramSocketImplFactory;
import java.net.SocketImpl;
import java.net.SocketImplFactory;

/**
 * Socket implementation factory for both {@link java.net.Socket Socket} and
 * {@link java.net.DatagramSocket DatagramSocket}.
 */
public class AppEngineSocketImplFactory implements SocketImplFactory, DatagramSocketImplFactory {
  static final SocketApiHelper SOCKET_API_HELPER = new SocketApiHelper();

  public static AppEngineSocketImplFactory newSocketImplFactory() {
    return new AppEngineSocketImplFactory();
  }

  /**
   * @see java.net.SocketImplFactory#createSocketImpl()
   */
  @Override
  public SocketImpl createSocketImpl() {
    return new AppEngineSocketImpl(SOCKET_API_HELPER);
  }

  /**
   * @see java.net.DatagramSocketImplFactory#createDatagramSocketImpl()
   */
  @Override
  public AppEngineDatagramSocketImpl createDatagramSocketImpl() {
    return new AppEngineDatagramSocketImpl(SOCKET_API_HELPER);
  }

  public NameService createNameService() {
    return new NameServiceImpl(SOCKET_API_HELPER);
  }
}
