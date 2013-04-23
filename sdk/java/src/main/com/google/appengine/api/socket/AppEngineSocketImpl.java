// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import com.google.appengine.api.socket.AppEngineSocketOptions.Option;
import com.google.appengine.api.socket.SocketServicePb.AcceptReply;
import com.google.appengine.api.socket.SocketServicePb.AcceptRequest;
import com.google.appengine.api.socket.SocketServicePb.AddressPort;
import com.google.appengine.api.socket.SocketServicePb.CloseReply;
import com.google.appengine.api.socket.SocketServicePb.CloseRequest;
import com.google.appengine.api.socket.SocketServicePb.ConnectReply;
import com.google.appengine.api.socket.SocketServicePb.ConnectRequest;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketReply;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketRequest;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketRequest.SocketFamily;
import com.google.appengine.api.socket.SocketServicePb.CreateSocketRequest.SocketProtocol;
import com.google.appengine.api.socket.SocketServicePb.GetSocketNameReply;
import com.google.appengine.api.socket.SocketServicePb.GetSocketNameRequest;
import com.google.appengine.api.socket.SocketServicePb.GetSocketOptionsReply;
import com.google.appengine.api.socket.SocketServicePb.GetSocketOptionsRequest;
import com.google.appengine.api.socket.SocketServicePb.ListenReply;
import com.google.appengine.api.socket.SocketServicePb.ListenRequest;
import com.google.appengine.api.socket.SocketServicePb.ReceiveReply;
import com.google.appengine.api.socket.SocketServicePb.ReceiveRequest;
import com.google.appengine.api.socket.SocketServicePb.RemoteSocketServiceError;
import com.google.appengine.api.socket.SocketServicePb.RemoteSocketServiceError.ErrorCode;
import com.google.appengine.api.socket.SocketServicePb.RemoteSocketServiceError.SystemError;
import com.google.appengine.api.socket.SocketServicePb.SendReply;
import com.google.appengine.api.socket.SocketServicePb.SendRequest;
import com.google.appengine.api.socket.SocketServicePb.SetSocketOptionsReply;
import com.google.appengine.api.socket.SocketServicePb.SetSocketOptionsRequest;
import com.google.appengine.api.socket.SocketServicePb.ShutDownReply;
import com.google.appengine.api.socket.SocketServicePb.ShutDownRequest;
import com.google.appengine.api.socket.SocketServicePb.SocketOption.SocketOptionName;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.net.ConnectException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.net.SocketException;
import java.net.SocketImpl;
import java.net.SocketOptions;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Implements the {@link SocketImpl} interface for App Engine based sockets.
 *
 */
class AppEngineSocketImpl extends SocketImpl implements AppEngineSocketOptionsClient, Serializable {
  private static final long serialVersionUID = -2683691443688405980L;

  static enum SocketState {
    /**
     * Socket is uninitialized.
     */
    UNINITIALIZED,

    /**
     * {@link #create(boolean)} has been called.
     * Note that this does not relate to remote socket create.
     */
    CREATE_CALLED,

    /**
     * Socket is bound.
     */
    BOUND,

    /**
     * Socket is connected.
     */
    CONNECTED,

    /**
     * Socket is listening.
     */
    LISTEN,

    /**
     * Socket is closed.
     */
    CLOSED
  }

  SocketState currentState = SocketState.UNINITIALIZED;

  private SocketApiHelper socketHelper = null;

  String descriptor = null;

  int soTimeout = -1;

  private boolean readsShutdown = false;
  private boolean writesShutdown = false;

  private final AtomicLong sendOffset = new AtomicLong(0);

  private AppEngineSocketInputStream socketInputStream = null;

 /**
  * True indicates that this socket is for a (TCP) stream socket otherwise
  * it is a datagram socket (UDP).
  */
  private boolean stream;

  private InetAddress localAddress;

  AppEngineSocketImpl() {
  }

  AppEngineSocketImpl(SocketApiHelper socketHelper) {
    this.socketHelper = socketHelper;
  }

  SocketApiHelper getSocketApiHelper() {
    return socketHelper == null ? AppEngineSocketImplFactory.SOCKET_API_HELPER : socketHelper;
  }

  protected InetAddress toInetAddress(AddressPort addressPort) throws UnknownHostException {
    return InetAddress.getByAddress(addressPort.getPackedAddressAsBytes());
  }

  void setOption(
      AppEngineSocketOptions.Option option, Object value) throws SocketException {
    checkNotClosed();
    option.validateAndApply(this, value);
  }

  private void createSocketOrCheckNotClosed() throws SocketException {
    if (currentState == SocketState.CREATE_CALLED) {
      try {
        createSocket(null, 0, null, 0, false);
      } catch (SocketTimeoutException e) {
        throw new SocketException(e.getMessage());
      }
    } else {
      checkNotClosed();
    }
  }

  /**
   * @see java.net.SocketOptions#setOption(int, java.lang.Object)
   */
  @Override
  public void setOption(int opt, Object value) throws SocketException {
    AppEngineSocketOptions.Option option = AppEngineSocketOptions.getOptionById(opt);
    if (option == null) {
      throw new SocketException("unrecognized socket option: " + opt);
    }
    setOption(option, value);
  }

  String statesToString(SocketState...socketStates) {
    StringBuilder builder = new StringBuilder();
    String prefix = "";
    for (SocketState state : socketStates) {
      builder.append(prefix);
      prefix = ", ";
      builder.append(state.toString());
    }
    return builder.toString();
  }

  void checkStateIsOneOf(String errorMsg, SocketState...socketStates) throws SocketException {
    for (SocketState state : socketStates) {
      if (currentState == state) {
        return;
      }
    }
    throw new SocketException(errorMsg + ": Expected to be in one of states : (" +
                              statesToString(socketStates) + "), was in state " + currentState);
  }

  void checkStateIsNotOneOf(String errorMsg, SocketState...socketStates) throws SocketException {
    for (SocketState state : socketStates) {
      if (currentState == state) {
        throw new SocketException(errorMsg + ": Expected to not be in one of (" +
                                  statesToString(socketStates) + "), was in state " + currentState);
      }
    }
  }

  /**
   * Checks that the socket is not closed.
   */
  private void checkNotClosed() throws SocketException {
    checkStateIsNotOneOf("Socket is closed", SocketState.UNINITIALIZED, SocketState.CLOSED);
  }

  /**
   * Implements the remote service SetSocketOptions call.
   */
  @Override
  public void setSocketOptionAsBytes(AppEngineSocketOptions.Option opt, byte[] value)
      throws SocketException {
    SocketOptionName name = opt.getOptName();
    if (name == null) {
      return;
    }
    createSocketOrCheckNotClosed();
    SetSocketOptionsRequest request = new SetSocketOptionsRequest();
    SetSocketOptionsReply response = new SetSocketOptionsReply();
    request.setSocketDescriptor(descriptor);
    request.addOptions().setLevel(opt.getLevel()).setOption(name).setValueAsBytes(value);

    getSocketApiHelper().makeSyncCall("SetSocketOptions", request, response, null);
  }

  @Override
  public void setTimeout(int timeout) {
    soTimeout = timeout;
  }

  /**
   * @see java.net.SocketOptions#getOption(int)
   */
  @Override
  public Object getOption(int optID) throws SocketException {
    if (SocketOptions.SO_BINDADDR == optID) {
      if (localAddress == null) {
        createSocketOrCheckNotClosed();
        fixLocalAddress();
      }
      return localAddress;
    }
    if (SocketOptions.SO_TIMEOUT == optID) {
      return soTimeout <= 0 ? 0 : soTimeout;
    }

    AppEngineSocketOptions.Option option = AppEngineSocketOptions.getOptionById(optID);
    if (option == null) {
      throw new SocketException("unrecognized socket option: " + optID);
    }

    try {
      return getOption(option);
    } catch (SocketException e) {
      if (SocketOptions.SO_LINGER == optID) {
        return -1;
      }
      throw e;
    }
  }

  /**
   * Returns the value of the given option.
   * @throws SocketException
   */
  private Object getOption(Option option) throws SocketException {
    createSocketOrCheckNotClosed();
    return option.getOption(this);
  }

  /**
   * Called by {@link Option#getOption(AppEngineSocketImpl)}.
   * @see AppEngineSocketOptionsClient#getSocketOptionAsBytes(Option)
   */
  @Override
  public byte[] getSocketOptionAsBytes(Option option) throws SocketException {
    GetSocketOptionsRequest request = new GetSocketOptionsRequest();
    GetSocketOptionsReply response = new GetSocketOptionsReply();
    request.setSocketDescriptor(descriptor);
    request.addOptions().setLevel(option.getLevel()).setOption(option.getOptName());
    getSocketApiHelper().makeSyncCall("GetSocketOptions", request, response, null);
    return response.optionss().get(0).getValueAsBytes();
  }

  /**
   * @see java.net.SocketImpl#create(boolean)
   */
  @Override
  protected synchronized void create(boolean stream) throws IOException {
    checkStateIsOneOf("Socket is already created", SocketState.UNINITIALIZED);
    currentState = SocketState.CREATE_CALLED;
    this.stream = stream;
  }

  /**
   * @see java.net.SocketImpl#connect(java.lang.String, int)
   */
  @Override
  protected synchronized void connect(String host, int port) throws IOException {
    try {
      InetAddress address = InetAddress.getByName(host);
      connectToAddress(address, port, null);
    } catch (UnknownHostException e) {
      releaseSocket();
      throw e;
    }
  }

  /**
   * @see java.net.SocketImpl#connect(java.net.InetAddress, int)
   */
  @Override
  protected synchronized void connect(InetAddress address, int port) throws IOException {
    if (address == null) {
      throw new IllegalArgumentException("null address is illegal for connect");
    }

    checkStateIsOneOf("socket is not created", SocketState.CREATE_CALLED, SocketState.BOUND);

    connectToAddress(address, port, null);
  }

  /**
   * @see java.net.SocketImpl#connect(java.net.SocketAddress, int)
   */
  @Override
  protected synchronized void connect(SocketAddress socketAddress, int timeout) throws IOException {
    if (socketAddress == null) {
      throw new IllegalArgumentException("null address is illegal for connect");
    }

    if (!(socketAddress instanceof InetSocketAddress)) {
      throw new IllegalArgumentException("Address must be of type InetSocketAddress");
    }

    InetSocketAddress addr = (InetSocketAddress) socketAddress;

    if (addr.isUnresolved()) {
      throw new UnknownHostException(addr.getHostName());
    }

    connectToAddress(addr.getAddress(), addr.getPort(), timeout == 0 ? null : timeout);
  }

  private void connectToAddress(InetAddress address, int port, Integer timeoutMillis)
      throws SocketException, SocketTimeoutException {
    switch (currentState) {
      case CREATE_CALLED: {
        if (timeoutMillis == null) {
          createSocket(null, 0, address, port, true);
        } else {
          createSocket(null, 0, address, port, false);
          connectSocket(address, port, timeoutMillis);
        }
        break;
      }
      case BOUND: {
        connectSocket(address, port, timeoutMillis);
        break;
      }
      default: {
        break;
      }
    }

    this.port = port;
    this.address = address;
  }

  private void processConnectError(RemoteSocketServiceError serviceError)
      throws SocketException, SocketTimeoutException {
    releaseSocket();
    if (SystemError.valueOf(serviceError.getSystemError()) == SystemError.SYS_EINPROGRESS) {
      throw new SocketTimeoutException();
    }
    if (SystemError.valueOf(serviceError.getSystemError()) == SystemError.SYS_ETIMEDOUT) {
      throw new SocketTimeoutException();
    }
    if (SystemError.valueOf(serviceError.getSystemError()) == SystemError.SYS_ECONNREFUSED) {
      throw new ConnectException(serviceError.getErrorDetail());
    }
    throw SocketApiHelper.translateError(
        ErrorCode.SYSTEM_ERROR.getValue(),
        "errno: " + serviceError.getSystemError() + ", detail:" + serviceError.getErrorDetail());
  }

  /**
   * Performs connect given a timeout.
   */
  private void connectSocket(InetAddress remoteAddress, int remotePort, Integer timeoutMillis)
      throws SocketException, SocketTimeoutException {
    if (remoteAddress == null) {
      throw new IllegalArgumentException("remoteAddress must not be null if connect requested");
    }

    ConnectRequest request = new ConnectRequest().setSocketDescriptor(descriptor);
    ConnectReply response = new ConnectReply();

    request.getMutableRemoteIp()
        .setPort(remotePort)
        .setPackedAddressAsBytes(AppEngineSocketUtils.addrAsIpv6Bytes(remoteAddress));
    if (timeoutMillis != null) {
      request.setTimeoutSeconds(0.001D * timeoutMillis);
    }

    RemoteSocketServiceError serviceError = new RemoteSocketServiceError();
    if (!getSocketApiHelper().makeSyncCall("Connect", request, response, serviceError)) {
      processConnectError(serviceError);
    }

    currentState = SocketState.CONNECTED;
    fixLocalAddress();
  }

  /**
   * Releases the socket and absorbs any exceptions.
   */
  private void releaseSocket() {
    readsShutdown = false;
    writesShutdown = false;
    try {
      close();
    } catch (IOException ignored) {
    }
    currentState = SocketState.CLOSED;
  }

  private void fixLocalAddress() throws SocketException {
    GetSocketNameRequest request = new GetSocketNameRequest().setSocketDescriptor(descriptor);
    GetSocketNameReply response = new GetSocketNameReply();

    getSocketApiHelper().makeSyncCall("GetSocketName", request, response, null);
    AddressPort externalIp = response.getProxyExternalIp();
    this.localport = externalIp.getPort();

    try {
      localAddress = toInetAddress(externalIp);
    } catch (UnknownHostException e) {
      throw new SocketException(e.toString());
    }
  }

  /**
   * Create the remote socket with an optional bind and connect. Either the
   * remoteAddress or bindAddress or both parameters must be provided.
   * It is used to determine if socket is to be created with an IPV4 or IPV6
   * address family.
   * @throws SocketException
   * @throws SocketTimeoutException
   */
  private void createSocket(
      InetAddress bindAddress, int bindPort, InetAddress remoteAddress,
      int remotePort, boolean connect)
      throws SocketException, SocketTimeoutException {

    CreateSocketRequest request = new CreateSocketRequest();
    CreateSocketReply response = new CreateSocketReply();

    request.setFamily(SocketFamily.IPv6);
    request.setProtocol(stream ? SocketProtocol.TCP : SocketProtocol.UDP);

    if (bindAddress != null) {
      request.getMutableProxyExternalIp()
          .setPort(bindPort)
          .setPackedAddressAsBytes(AppEngineSocketUtils.addrAsIpv6Bytes(bindAddress));
    }

    if (connect) {
      if (remoteAddress == null) {
        throw new IllegalArgumentException("remoteAddress must not be null if connect requested");
      }
      request.getMutableRemoteIp()
          .setPort(remotePort)
          .setPackedAddressAsBytes(AppEngineSocketUtils.addrAsIpv6Bytes(remoteAddress));
      RemoteSocketServiceError serviceError = new RemoteSocketServiceError();
      if (!getSocketApiHelper().makeSyncCall("CreateSocket", request, response, serviceError)) {
        processConnectError(serviceError);
      }
    } else {
      getSocketApiHelper().makeSyncCall("CreateSocket", request, response, null);
    }

    descriptor = response.getSocketDescriptor();
    currentState = connect ? SocketState.CONNECTED : SocketState.BOUND;

    if (connect) {
      fixLocalAddress();
    }
  }

  /**
   * @see java.net.SocketImpl#bind(java.net.InetAddress, int)
   */
  @Override
  protected synchronized void bind(InetAddress host, int port) throws IOException {
    createSocket(host, port, null, 0, false);
    currentState = SocketState.BOUND;
  }

  /**
   * @see java.net.SocketImpl#listen(int)
   */
  @Override
  protected void listen(int backlog) throws IOException {
    checkStateIsNotOneOf("Socket must be in a bound state.", SocketState.UNINITIALIZED,
        SocketState.CREATE_CALLED, SocketState.CONNECTED, SocketState.CLOSED);
    ListenRequest request = new ListenRequest().setSocketDescriptor(descriptor).setBacklog(backlog);
    getSocketApiHelper().makeSyncCall("Listen", request, new ListenReply(), null);
    currentState = SocketState.LISTEN;
  }

  /**
   * @see java.net.SocketImpl#accept(java.net.SocketImpl)
   */
  @Override
  protected void accept(SocketImpl s) throws IOException {
    checkStateIsOneOf("Socket is not in passive (accepting) mode.", SocketState.LISTEN);
    if (!(s instanceof AppEngineSocketImpl)) {
      throw new IllegalStateException(
          "Expected a SocketImpl compatable with '" + this.getClass().getName() +
          "'. A '" + s.getClass().getName() + "' was received.");
    }

    AppEngineSocketImpl acceptingSocket = (AppEngineSocketImpl) s;
    AcceptReply response = new AcceptReply();
    AcceptRequest request = new AcceptRequest().setSocketDescriptor(descriptor);
    getSocketApiHelper().makeSyncCall("Accept", request, response, null);
    acceptingSocket.doAccept(response);
  }

  /**
   * Initializes an AppEngineSocketImpl from an AcceptReply message.
   * @throws SocketException
   */
  private void doAccept(AcceptReply response) throws SocketException {
    switch (currentState) {
      case UNINITIALIZED:
      case CREATE_CALLED:
      case CLOSED: {
        break;
      }
      default: {
        releaseSocket();
      }
    }

    stream = true;
    descriptor = response.getNewSocketDescriptor();
    AddressPort addressPort = response.getRemoteAddress();
    try {
      address = InetAddress.getByAddress(addressPort.getPackedAddressAsBytes());
    } catch (UnknownHostException e) {
      throw new SocketException(e.getMessage());
    }

    port = addressPort.getPort();
    currentState = SocketState.CONNECTED;
  }

  /**
   * @see java.net.SocketImpl#getInputStream()
   */
  @Override
  protected InputStream getInputStream() throws IOException {
    if (currentState == SocketState.CLOSED) {
      throw new IOException("Socket closed.");
    }

    if (readsShutdown) {
      throw new IOException("Socket input is shutdown.");
    }

    if (socketInputStream == null) {
        socketInputStream = new AppEngineSocketInputStream(this);
    }
    return socketInputStream;
  }

  /**
   * @see java.net.SocketImpl#getOutputStream()
   */
  @Override
  protected OutputStream getOutputStream() throws IOException {
    if (currentState == SocketState.CLOSED) {
      throw new IOException("Socket closed.");
    }

    if (writesShutdown) {
      throw new IOException("Socket output is shutdown.");
    }

    return new AppEngineSocketOutputStream(this);
  }

  /**
   * @see java.net.SocketImpl#available()
   */
  @Override
  protected int available() throws IOException {
    return 0;
  }

  /**
   * @see java.net.SocketImpl#close()
   */
  @Override
  protected void close() throws IOException {
    if (descriptor != null) {
      try {
        CloseRequest request = new CloseRequest().setSocketDescriptor(descriptor)
                                                 .setSendOffset(sendOffset.get());
        getSocketApiHelper().makeSyncCall("Close", request, new CloseReply(), null);
      } finally {
        currentState = SocketState.CLOSED;
        descriptor = null;
      }
    }
  }

  /**
   * @see java.net.SocketImpl#sendUrgentData(int)
   */
  @Override
  protected void sendUrgentData(int data) throws IOException {
    throw new IllegalStateException(
        "AppEngineSocketImpl#sendUrgentData() function is unimplemented.");
  }

  /**
   * @see java.net.SocketImpl#shutdownInput
   */
  @Override
  protected void shutdownInput() throws IOException {
    if (currentState == SocketState.CONNECTED && !readsShutdown) {
      ShutDownRequest request = new ShutDownRequest().setSocketDescriptor(descriptor)
                                                     .setSendOffset(sendOffset.get())
                                                     .setHow(ShutDownRequest.How.SOCKET_SHUT_RD);
      getSocketApiHelper().makeSyncCall("ShutDown", request, new ShutDownReply(), null);
      readsShutdown = true;
    }
  }

  /**
   * @see java.net.SocketImpl#shutdownOutput
   */
  @Override
  protected void shutdownOutput() throws IOException {
    if (currentState == SocketState.CONNECTED && !writesShutdown) {
      ShutDownRequest request = new ShutDownRequest().setSocketDescriptor(descriptor)
                                                     .setSendOffset(sendOffset.get())
                                                     .setHow(ShutDownRequest.How.SOCKET_SHUT_WR);
      getSocketApiHelper().makeSyncCall("ShutDown", request, new ShutDownReply(), null);
      writesShutdown = true;
    }
  }

  /**
   * Used by {@link AppEngineSocketOutputStream} to send data.
   *
   * @param buf Buffer of bytes to write.
   * @param off Offset into the buffer.
   * @param len The length of bytes to write.
   * @throws IOException On error conditions
   */
  protected void send(byte buf[], int off, int len) throws IOException {
    checkStateIsNotOneOf("Socket is closed.",
        SocketState.UNINITIALIZED, SocketState.CREATE_CALLED, SocketState.CLOSED);
    if (writesShutdown) {
      throw new IOException("Socket output is shutdown.");
    }

    byte copy[] = Arrays.copyOfRange(buf, off, off + len);
    SendRequest request = new SendRequest().setSocketDescriptor(descriptor)
                                           .setStreamOffset(sendOffset.getAndAdd(copy.length))
                                           .setDataAsBytes(copy);
    if (soTimeout > 0) {
      request.setTimeoutSeconds(soTimeout * 0.001);
    }

    RemoteSocketServiceError serviceError = new RemoteSocketServiceError();
    if (!getSocketApiHelper().makeSyncCall("Send", request, new SendReply(), serviceError)) {
      if (serviceError.getSystemError() == SystemError.SYS_EAGAIN.getValue()) {
        throw new SocketTimeoutException("Write timed out");
      } else {
        throw SocketApiHelper.translateError(
            ErrorCode.SYSTEM_ERROR.getValue(),
            "errno: " + serviceError.getSystemError() +
            ", detail:" + serviceError.getErrorDetail());
      }
    }
  }

  /**
   * This is wrapped by {@link AppEngineSocketInputStream} and has the
   * same semantics as {@link java.io.InputStream#read(byte[], int, int)}.
   * @throws IOException On error conditions
   */
  protected int receive(byte[] buf, int off, int len) throws IOException {
    checkStateIsNotOneOf("Socket is closed.",
        SocketState.UNINITIALIZED, SocketState.CREATE_CALLED, SocketState.CLOSED);

    if (readsShutdown) {
      throw new IOException("Socket input is shutdown.");
    }

    if (len < 0 || off < 0 || buf.length - off < len) {
      if (len == 0) {
        return 0;
      }
      throw new ArrayIndexOutOfBoundsException();
    }

    ReceiveReply response = new ReceiveReply();
    ReceiveRequest request = new ReceiveRequest().setSocketDescriptor(descriptor)
                                                 .setDataSize(len);
    if (soTimeout > 0) {
      request.setTimeoutSeconds(soTimeout * 0.001);
    }
    RemoteSocketServiceError serviceError = new RemoteSocketServiceError();
    if (!getSocketApiHelper().makeSyncCall("Receive", request, response, serviceError)) {
      if (serviceError.getSystemError() == SystemError.SYS_EAGAIN.getValue()) {
        throw new SocketTimeoutException("Read timed out");
      } else {
        throw SocketApiHelper.translateError(
            ErrorCode.SYSTEM_ERROR.getValue(),
            "errno: " + serviceError.getSystemError() +
            ", detail:" + serviceError.getErrorDetail());
      }
    }

    byte readBytes[] = response.getDataAsBytes();

    if (readBytes.length > 0) {
      System.arraycopy(readBytes, 0, buf, off, readBytes.length);
    } else {
      return -1;
    }

    return readBytes.length;
  }
}
