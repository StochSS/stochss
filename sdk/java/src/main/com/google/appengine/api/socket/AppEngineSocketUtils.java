// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.api.socket;

import com.google.appengine.api.socket.SocketServicePb.AddressPort;

import java.net.InetAddress;

/**
 * Utility methods.
 *
 */
class AppEngineSocketUtils {
  private static final int IPV6_LEN = 16;
  private static final int IPV4_LEN = 4;

  /**
   * Convert an inet address and port to an IPv6 AddressPort. IPv4 addresses
   * are mapped to the IPv6 compatible address.
   */
  static AddressPort toAddressPort(InetAddress address, int port) {
    return new AddressPort().setPort(port).setPackedAddressAsBytes(addrAsIpv6Bytes(address));
  }

  static byte[] addrAsIpv6Bytes(InetAddress address) {
    byte[] bytes = address.getAddress();
    if (bytes.length == IPV6_LEN) {
      return bytes;
    }

    if (bytes.length == IPV4_LEN) {
      return new byte[] {
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, bytes[0], bytes[1], bytes[2], bytes[3]};
    }
    throw new IllegalArgumentException(
        "address must be IPV4 or IPV6 - unknown size: " + bytes.length);
  }

  private AppEngineSocketUtils() {}
}
