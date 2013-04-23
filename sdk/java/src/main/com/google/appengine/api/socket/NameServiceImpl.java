// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import com.google.appengine.api.socket.SocketServicePb.CreateSocketRequest;
import com.google.appengine.api.socket.SocketServicePb.RemoteSocketServiceError;
import com.google.appengine.api.socket.SocketServicePb.ResolveReply;
import com.google.appengine.api.socket.SocketServicePb.ResolveRequest;

import sun.net.spi.nameservice.NameService;

import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.List;

/**
 * Implements a {@link NameService} using the remote socket gateway.
 *
 */
class NameServiceImpl implements NameService {
  private static final byte[] LOCAL_HOST_ADDR = {127, 0, 0, 1};
  private static final String LOCAL_HOST = "localhost";

  private final SocketApiHelper socketHelper;

  NameServiceImpl(SocketApiHelper socketHelper) {
    if (socketHelper == null) {
      throw new IllegalArgumentException("socketHelper must not be null.");
    }
    this.socketHelper = socketHelper;
  }

  SocketApiHelper getSocketApiHelper() {
    return socketHelper;
  }

  @Override
  public InetAddress[] lookupAllHostAddr(String host) throws UnknownHostException {
    if (host.equals(LOCAL_HOST)) {
      InetAddress[] result = new InetAddress[1];
      result[0] = InetAddress.getByAddress(host, LOCAL_HOST_ADDR);
      return result;
    }

    ResolveRequest request = new ResolveRequest().setName(host);

    request.mutableAddressFamiliess().addAll(Arrays.asList(
        CreateSocketRequest.SocketFamily.IPv4.getValue(),
        CreateSocketRequest.SocketFamily.IPv6.getValue()));
    ResolveReply response = new ResolveReply();

    try {
      RemoteSocketServiceError serviceError = new RemoteSocketServiceError();
      if (!socketHelper.makeSyncCall("Resolve", request, response, serviceError)) {
        ResolveReply.ErrorCode errorCode =
            ResolveReply.ErrorCode.valueOf(serviceError.getSystemError());
        if (errorCode == null) {
          throw new RuntimeException(
              "Resolve failed: host:'" + host + "' " + serviceError.toFlatString());
        }
        switch (ResolveReply.ErrorCode.valueOf(serviceError.getSystemError())) {
          case SOCKET_EAI_NONAME:
          case SOCKET_EAI_AGAIN: {
            throw new UnknownHostException(host);
          }
          default: {
            throw new RuntimeException(
                "Resolve failed: host:'" + host + "' " + serviceError.toFlatString());
          }
        }
      }
    } catch (SocketException e) {
      throw new RuntimeException("Resolve failed: Request=" + host + " Exception=" + e);
    }

    if (response.packedAddresssAsBytes().isEmpty()) {
      throw new UnknownHostException(host);
    }

    List<byte[]> addresses = response.packedAddresssAsBytes();
    InetAddress[] result = new InetAddress[addresses.size()];

    for (int i = 0; i < result.length; ++i) {
      result[i] = InetAddress.getByAddress(host, addresses.get(i));
    }

    return result;
  }

  @Override
  public String getHostByAddr(byte[] addr) throws UnknownHostException {
    if (Arrays.equals(LOCAL_HOST_ADDR, addr)) {
      return LOCAL_HOST;
    }

    if (addr.length == 4) {
      return getHostAddrForPackedAddr(addr);
    } else if (addr.length == 16) {
      return getHostAddrForPackedAddr(addr);
    } else {
      throw new UnknownHostException(getHostAddrForPackedAddr(addr));
    }
  }

  static String getHostAddrForPackedAddr(byte[] addr) {
    StringBuilder builder = new StringBuilder();
    if (addr.length == 16) {
      String separator = "";
      for (int i = 0; i < 16; i += 2) {
        int val = (((0 + addr[i]) & 0xff) << 8) + ((0 + addr[i + 1]) & 0xff);
        builder.append(separator);
        separator = ":";
        builder.append(Integer.toHexString(val));
      }
    } else {
      String separator = "";
      for (byte val : addr) {
        builder.append(separator);
        separator = ".";
        builder.append(Integer.toString((0 + val) & 0xff));
      }
    }
    return builder.toString();
  }
}
