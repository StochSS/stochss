// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import com.google.appengine.api.socket.AppEngineSocketOptions.Option;
import com.google.appengine.api.socket.SocketServicePb.AddressPort;
import com.google.appengine.api.socket.SocketServicePb.BindReply;
import com.google.appengine.api.socket.SocketServicePb.BindRequest;
import com.google.appengine.api.socket.SocketServicePb.CloseReply;
import com.google.appengine.api.socket.SocketServicePb.CloseRequest;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketReply;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketRequest;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketRequest.SocketFamily;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketRequest.SocketProtocol;
import com.google.appengine.api.socket.SocketServicePb.GetSocketNameReply;
import com.google.appengine.api.socket.SocketServicePb.GetSocketNameRequest;
import com.google.appengine.api.socket.SocketServicePb.GetSocketOptionsReply;
import com.google.appengine.api.socket.SocketServicePb.GetSocketOptionsRequest;
import com.google.appengine.api.socket.SocketServicePb.ReceiveReply;
import com.google.appengine.api.socket.SocketServicePb.ReceiveRequest;
import com.google.appengine.api.socket.SocketServicePb.SendReply;
import com.google.appengine.api.socket.SocketServicePb.SendRequest;
import com.google.appengine.api.socket.SocketServicePb.SetSocketOptionsReply;
import com.google.appengine.api.socket.SocketServicePb.SetSocketOptionsRequest;
import com.google.appengine.api.socket.SocketServicePb.SocketOption.SocketOptionName;

import java.io.IOException;
import java.io.Serializable;
import java.net.DatagramPacket;
import java.net.DatagramSocketImpl;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketAddress;
import java.net.SocketException;
import java.net.SocketOptions;
import java.util.Arrays;

/**
 * Implements the {@link DatagramSocketImpl} interface for App Engine based datagram sockets.
 *
 */
class AppEngineDatagramSocketImpl
    extends DatagramSocketImpl implements AppEngineSocketOptionsClient, Serializable {

  private SocketApiHelper socketHelper = null;

  String descriptor;
  volatile int timeout = -1;

  AppEngineDatagramSocketImpl() {
  }

  AppEngineDatagramSocketImpl(SocketApiHelper socketHelper) {
    this.socketHelper = socketHelper;
  }

  SocketApiHelper getSocketApiHelper() {
    return socketHelper == null ? AppEngineSocketImplFactory.SOCKET_API_HELPER : socketHelper;
  }

  void setOption(
      AppEngineSocketOptions.Option option, Object value) throws SocketException {
    checkNotClosed();
    option.validateAndApply(this, value);
  }

  @Override
  public void setTimeout(int timeout) {
    this.timeout = timeout;
  }

  @Override
  public void setSocketOptionAsBytes(Option option, byte[] value) throws SocketException {
    SocketOptionName name = option.getOptName();
    if (name == null) {
      return;
    }

    SetSocketOptionsRequest request = new SetSocketOptionsRequest();
    request.setSocketDescriptor(descriptor);
    request.addOptions().setLevel(option.getLevel()).setOption(name).setValueAsBytes(value);

    getSocketApiHelper().makeSyncCall(
        "SetSocketOptions", request, new SetSocketOptionsReply(), null);
  }

  @Override
  public void setOption(int optID, Object value) throws SocketException {
    AppEngineSocketOptions.Option option = AppEngineSocketOptions.getOptionById(optID);
    if (option == null) {
      throw new SocketException("unrecognized socket option: " + optID);
    }
    setOption(option, value);
  }

  @Override
  public Object getOption(int optID) throws SocketException {
    if (SocketOptions.SO_TIMEOUT == optID) {
      checkNotClosed();
      return timeout < 0 ? Integer.MAX_VALUE : timeout;
    }
    AppEngineSocketOptions.Option option = AppEngineSocketOptions.getOptionById(optID);
    if (option == null) {
      throw new SocketException("unrecognized socket option: " + optID);
    }
    return getOption(option);
  }

  /**
   * Returns the value of the given option.
   * @throws SocketException
   */
  private Object getOption(Option option) throws SocketException {
    return option.getOption(this);
  }

  /**
   * @throws SocketException
   * @see AppEngineSocketOptionsClient#getSocketOptionAsBytes(Option)
   */
  @Override
  public byte[] getSocketOptionAsBytes(Option option) throws SocketException {
    checkNotClosed();
    switch (option) {
      case SO_BINDADDR_OPT: {
        GetSocketNameRequest request = new GetSocketNameRequest();
        GetSocketNameReply response = new GetSocketNameReply();
        request.setSocketDescriptor(descriptor);
        getSocketApiHelper().makeSyncCall("GetSocketName", request, response, null);
        return response.getProxyExternalIp().getPackedAddressAsBytes();
      }
      default: {
        GetSocketOptionsRequest request = new GetSocketOptionsRequest();
        GetSocketOptionsReply response = new GetSocketOptionsReply();
        request.setSocketDescriptor(descriptor);
        request.addOptions().setLevel(option.getLevel()).setOption(option.getOptName());
        getSocketApiHelper().makeSyncCall("GetSocketOptions", request, response, null);
        return response.optionss().get(0).getValueAsBytes();
      }
    }
  }

  /**
   * @throws SocketException if the socket is not open.
   */
  private void checkNotClosed() throws SocketException {
    if (descriptor == null) {
      throw new SocketException("socket closed");
    }
  }

  @Override
  protected void create() throws SocketException {
    if (descriptor != null) {
      throw new SocketException("create may not be called on an already created socket.");
    }

    CreateSocketRequest request = new CreateSocketRequest();
    CreateSocketReply response = new CreateSocketReply();

    request.setFamily(SocketFamily.IPv6);
    request.setProtocol(SocketProtocol.UDP);

    getSocketApiHelper().makeSyncCall("CreateSocket", request, response, null);
    descriptor = response.getSocketDescriptor();
  }

  @Override
  protected void bind(int lport, InetAddress laddr) throws SocketException {
    checkNotClosed();
    BindRequest request = new BindRequest().setSocketDescriptor(descriptor);
    request.setProxyExternalIp(AppEngineSocketUtils.toAddressPort(laddr, lport));
    getSocketApiHelper().makeSyncCall("Bind", request, new BindReply(), null);
  }

  @Override
  protected void send(DatagramPacket p) throws IOException {
    checkNotClosed();
    byte[] bytes = p.getData();
    int off = p.getOffset();
    int len = p.getLength();
    if (bytes.length != len || off != 0) {
      bytes = Arrays.copyOfRange(bytes, off, off + len);
    }
    SendRequest request = new SendRequest().setSocketDescriptor(descriptor)
                                           .setDataAsBytes(bytes);
    InetAddress addr = p.getAddress();
    if (addr != null) {
      request.setSendTo(AppEngineSocketUtils.toAddressPort(addr, p.getPort()));
    }
    if (timeout != -1) {
      request.setTimeoutSeconds(timeout * 0.001);
    }
    getSocketApiHelper().makeSyncCall("Send", request, new SendReply(), null);
  }

  @Override
  protected int peek(InetAddress i) throws IOException {
    throw new SocketException("#peek(InetAddress) is not implemented.");
  }

  @Override
  protected int peekData(DatagramPacket p) throws IOException {
    checkNotClosed();
    receiveOrPeek(p, true);
    return p.getPort();
  }

  @Override
  protected void receive(DatagramPacket p) throws IOException {
    checkNotClosed();
    receiveOrPeek(p, false);
  }

  private void receiveOrPeek(DatagramPacket p, boolean isPeek) throws IOException {
    checkNotClosed();

    ReceiveReply response = new ReceiveReply();
    ReceiveRequest request = new ReceiveRequest().setSocketDescriptor(descriptor)
                                                 .setDataSize(p.getLength());
    if (timeout != -1) {
      request.setTimeoutSeconds(timeout * 0.001);
    }

    if (isPeek) {
      request.setFlags(ReceiveRequest.Flags.MSG_PEEK.getValue());
    }

    getSocketApiHelper().makeSyncCall("Receive", request, response, null);

    byte readBytes[] = response.getDataAsBytes();

    if (readBytes.length > 0) {
      System.arraycopy(readBytes, 0, p.getData(), p.getOffset(), readBytes.length);
    }
    p.setLength(readBytes.length);

    AddressPort addrPort = response.getReceivedFrom();
    p.setPort(addrPort.getPort());
    p.setAddress(InetAddress.getByAddress(addrPort.getPackedAddressAsBytes()));
  }

  @Deprecated
  @Override
  protected void setTTL(byte ttl) throws IOException {
    setTimeToLive(ttl);
  }

  @Deprecated
  @Override
  protected byte getTTL() throws IOException {
    return (byte) getTimeToLive();
  }

  @Override
  protected void setTimeToLive(int ttl) throws IOException {
    throw new SecurityException("App Engine does not allow multicast setTimeToLive");
  }

  @Override
  protected int getTimeToLive() throws IOException {
    throw new SecurityException("App Engine does not allow multicast getTimeToLive");
  }

  @Override
  protected void join(InetAddress inetaddr) throws IOException {
    throw new SecurityException("App Engine does not allow multicast join");
  }

  @Override
  protected void leave(InetAddress inetaddr) throws IOException {
    throw new SecurityException("App Engine does not allow multicast leave");
  }

  @Override
  protected void joinGroup(SocketAddress mcastaddr, NetworkInterface netIf) throws IOException {
    throw new SecurityException("App Engine does not allow multicast joinGroup");
  }

  @Override
  protected void leaveGroup(SocketAddress mcastaddr, NetworkInterface netIf) throws IOException {
    throw new SecurityException("App Engine does not allow multicast leaveGroup");
  }

  @Override
  protected void close() {
    if (descriptor != null) {
      try {
        CloseRequest request = new CloseRequest().setSocketDescriptor(descriptor);
        getSocketApiHelper().makeSyncCall("Close", request, new CloseReply(), null);
      } catch (SocketException e) {
      } finally {
        descriptor = null;
      }
    }
  }
}
