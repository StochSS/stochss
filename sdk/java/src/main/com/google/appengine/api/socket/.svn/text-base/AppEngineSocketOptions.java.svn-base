// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import static com.google.appengine.api.socket.SocketServicePb.SocketOption.SocketOptionLevel.SOCKET_SOL_IP;
import static com.google.appengine.api.socket.SocketServicePb.SocketOption.SocketOptionLevel.SOCKET_SOL_SOCKET;
import static com.google.appengine.api.socket.SocketServicePb.SocketOption.SocketOptionLevel.SOCKET_SOL_TCP;

import com.google.appengine.api.socket.SocketServicePb.SocketOption;
import com.google.appengine.api.socket.SocketServicePb.SocketOption.SocketOptionName;

import java.net.InetAddress;
import java.net.SocketException;
import java.net.SocketOptions;
import java.net.UnknownHostException;
import java.util.Arrays;

/**
 */
class AppEngineSocketOptions {
  private abstract static class OptionValueConverter {
    abstract byte[] toBytes(Object value);
    abstract Object toObject(byte[] data);
  }

  private static class IntegerConverter extends OptionValueConverter {
    static int convert(byte[] data, int offset) {
      return ((data[0 + offset] & 0xff) << 24) +
             ((data[1 + offset] & 0xff) << 16) +
             ((data[2 + offset] & 0xff) << 8) +
             (data[3 + offset] & 0xff);
    }

    @Override
    byte[] toBytes(Object objectValue) {
      int value = (Integer) objectValue;
      byte[] result = {
          (byte) (value >>> 24), (byte) (value >>> 16), (byte) (value >>> 8), (byte) value};
      return result;
    }

    @Override
    Object toObject(byte[] data) {
      return convert(data, 0);
    }
  }

  private static class BooleanConverter extends OptionValueConverter {
    @Override
    byte[] toBytes(Object objectValue) {
      boolean value = (Boolean) objectValue;
      byte[] result = {
          (byte) 0, (byte) 0, (byte) 0, (byte) (value ? 1 : 0)};
      return result;
    }

    @Override
    Object toObject(byte[] data) {
      return IntegerConverter.convert(data, 0) != 0;
    }
  }

  private static class AddressConverter extends OptionValueConverter {
    @Override
    byte[] toBytes(Object objectValue) {
      InetAddress value = (InetAddress) objectValue;
      return value.getAddress();
    }

    @Override
    Object toObject(byte[] data) {
      try {
        return InetAddress.getByAddress(data);
      } catch (UnknownHostException e) {
        throw new IllegalStateException("Failed to create InetAddress", e);
      }
    }
  }

  static class ByteBuilder {
    byte[] buffer = new byte[4];
    int usedCount = 0;

    void append(int value) {
      append(INTEGER_CONVERTER.toBytes(value));
    }

    void append(byte[] value) {
      ensureAppendCapacity(value.length);
      System.arraycopy(value, 0, buffer, usedCount, value.length);
      usedCount += value.length;
    }

    private void ensureAppendCapacity(int appendCapacity) {
      if (buffer.length - usedCount < appendCapacity) {
        buffer = Arrays.copyOf(buffer, usedCount + appendCapacity + 16);
      }
    }

    byte[] getBytes() {
      if (usedCount == buffer.length) {
        return buffer;
      }
      return Arrays.copyOf(buffer, usedCount);
    }
  }

  static class LingerConverter extends OptionValueConverter {
    @Override
    byte[] toBytes(Object objectValue) {
      ByteBuilder builder = new ByteBuilder();
      if (objectValue instanceof Boolean || (Integer) objectValue == -1) {
        builder.append(0);
        builder.append(0);
        return builder.getBytes();
      }

      builder.append(1);
      builder.append((Integer) objectValue);
      return builder.getBytes();
    }

    @Override
    Object toObject(byte[] data) {
      if (data.length != 8) {
        throw new IllegalStateException("Failed to convert linger data.");
      }
      if (IntegerConverter.convert(data, 0) == 0) {
        return -1;
      }
      return IntegerConverter.convert(data, 4);
    }
  }

  private abstract static class CheckFunction {
    abstract Object equivalenceClassObject();
    @SuppressWarnings("unused")
    void check(Option opt, Object value, boolean isDatagramSocket) throws SocketException {
    }
    void apply(Option option, AppEngineSocketOptionsClient socketImpl, Object value)
        throws SocketException {
      socketImpl.setSocketOptionAsBytes(option, option.converter.toBytes(value));
    }
  }

  private static class IntegerCheckFunction extends CheckFunction {
    @Override
    Object equivalenceClassObject() {
      return 0;
    }
  }

  private static class BooleanCheckFunction extends CheckFunction {
    @Override
    Object equivalenceClassObject() {
      return false;
    }
    @Override
    void apply(Option option, AppEngineSocketOptionsClient socketImpl, Object value)
        throws SocketException {
      socketImpl.setSocketOptionAsBytes(option, option.converter.toBytes(value));
    }
  }

  private static class UnimplimentedCheckFunction extends CheckFunction {
    @Override
    Object equivalenceClassObject() {
      return new Object();
    }
    @Override
    void check(Option opt, Object value, boolean isDatagramSocket) throws SocketException {
      throw new SocketException(opt.optionName() + " is not implimented.");
    }
  }

  private static class GreaterThanZeroCheckFunction extends IntegerCheckFunction {
    @Override
    void check(Option opt, Object value, boolean isDatagramSocket) throws SocketException {
      if (((Integer) value).intValue() <= 0) {
        throw new SocketException("bad parameter for '" + opt.optionName() + "'" +
                                  " Must be greater than zero. value = " + value);
      }
    }
  }

  private static class OnlyAllowedForTCP extends IntegerCheckFunction {
    @Override
    void check(Option opt, Object value, boolean isDatagramSocket) throws SocketException {
      if (isDatagramSocket) {
        throw new SocketException("Option '" + opt.optionName() + "'" +
            " is not allowed for datagram sockets.");
      }
    }
  }

  private static final CheckFunction INTEGER_CHECK = new IntegerCheckFunction();
  private static final CheckFunction INTEGER_GT0_CHECK = new GreaterThanZeroCheckFunction();
  private static final CheckFunction BOOLEAN_CHECK = new BooleanCheckFunction();
  private static final CheckFunction UNIMPLIMENTED_CHECK = new UnimplimentedCheckFunction();

  private static final OptionValueConverter INTEGER_CONVERTER = new IntegerConverter();
  private static final OptionValueConverter BOOLEAN_CONVERTER = new BooleanConverter();
  private static final OptionValueConverter ADDRESS_CONVERTER = new AddressConverter();

  /**
   * Enumeration of all available socket options.
   */
  public static enum Option {
    SO_LINGER_OPT(SocketOptions.SO_LINGER, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_LINGER,
                  new LingerConverter(), INTEGER_CHECK,
                  new BooleanCheckFunction() {
                    @Override
                    void apply(Option option, AppEngineSocketOptionsClient socketImpl, Object val)
                        throws SocketException {
                      socketImpl.setSocketOptionAsBytes(option, option.converter.toBytes(false));
                    }
                  }, new OnlyAllowedForTCP()),
    SO_TIMEOUT_OPT(SocketOptions.SO_TIMEOUT, SOCKET_SOL_SOCKET, null, INTEGER_CONVERTER,
                   new IntegerCheckFunction() {
                     @Override
                     void check(Option opt, Object value, boolean isDatagramSocket) {
                        if ((Integer) value < 0) {
                            throw new IllegalArgumentException(
                                opt.optionName() + " requires timeout value >= 0: timeout given = "
                                + value);
                        }
                     }
                     @Override
                     void apply(
                         Option option, AppEngineSocketOptionsClient socketImpl, Object value)
                         throws SocketException {
                       socketImpl.setTimeout((Integer) value);
                       socketImpl.setSocketOptionAsBytes(option, option.converter.toBytes(value));
                     }
                   }),
    IP_TOS_OPT(SocketOptions.IP_TOS, SOCKET_SOL_IP, SocketOptionName.SOCKET_IP_TOS,
               INTEGER_CONVERTER, INTEGER_CHECK),
    SO_BINDADDR_OPT(SocketOptions.SO_BINDADDR, SOCKET_SOL_SOCKET, null,
                    ADDRESS_CONVERTER, UNIMPLIMENTED_CHECK),
    TCP_NODELAY_OPT(SocketOptions.TCP_NODELAY, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_NODELAY,
                    BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    SO_SNDBUF_OPT(SocketOptions.SO_SNDBUF, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_SNDBUF,
                  INTEGER_CONVERTER, INTEGER_GT0_CHECK),
    SO_RCVBUF_OPT(SocketOptions.SO_RCVBUF, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_RCVBUF,
                  INTEGER_CONVERTER, INTEGER_GT0_CHECK),
    SO_KEEPALIVE_OPT(SocketOptions.SO_KEEPALIVE,
                     SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_KEEPALIVE,
                     BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    SO_OOBINLINE_OPT(SocketOptions.SO_OOBINLINE, SOCKET_SOL_SOCKET,
                     SocketOptionName.SOCKET_SO_OOBINLINE,
                     BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    SO_REUSEADDR_OPT(SocketOptions.SO_REUSEADDR,
                     SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_REUSEADDR,
                     BOOLEAN_CONVERTER, BOOLEAN_CHECK),

    SO_DEBUG_OPT(null, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_DEBUG,
                 BOOLEAN_CONVERTER, BOOLEAN_CHECK),
    SO_TYPE_OPT(null, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_TYPE, INTEGER_CONVERTER),
    SO_ERROR_OPT(null, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_ERROR, INTEGER_CONVERTER),
    SO_DONTROUTE_OPT(null, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_DONTROUTE,
                     BOOLEAN_CONVERTER, BOOLEAN_CHECK),
    SO_BROADCAST_OPT(null, SOCKET_SOL_SOCKET, SocketOptionName.SOCKET_SO_BROADCAST,
                     BOOLEAN_CONVERTER, BOOLEAN_CHECK),

    IP_TTL_OPT(null, SOCKET_SOL_IP, SocketOptionName.SOCKET_IP_TTL,
               INTEGER_CONVERTER, INTEGER_CHECK),
    IP_HDRINCL_OPT(null, SOCKET_SOL_IP, SocketOptionName.SOCKET_IP_HDRINCL,
                   BOOLEAN_CONVERTER, BOOLEAN_CHECK),
    IP_OPTIONS_OPT(null, SOCKET_SOL_IP, SocketOptionName.SOCKET_IP_OPTIONS, null,
                   UNIMPLIMENTED_CHECK),

    TCP_MAXSEG_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_MAXSEG,
                   INTEGER_CONVERTER, INTEGER_CHECK, new OnlyAllowedForTCP()),
    TCP_CORK_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_CORK,
                 BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    TCP_KEEPIDLE_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_KEEPIDLE,
                     INTEGER_CONVERTER, INTEGER_CHECK, new OnlyAllowedForTCP()),
    TCP_KEEPINTVL_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_KEEPINTVL,
                      INTEGER_CONVERTER, INTEGER_CHECK, new OnlyAllowedForTCP()),
    TCP_KEEPCNT_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_KEEPCNT,
                    INTEGER_CONVERTER, INTEGER_CHECK, new OnlyAllowedForTCP()),
    TCP_SYNCNT_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_SYNCNT,
                   INTEGER_CONVERTER, INTEGER_CHECK, new OnlyAllowedForTCP()),
    TCP_LINGER2_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_LINGER2,
                    BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    TCP_DEFER_ACCEPT_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_DEFER_ACCEPT,
                         BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    TCP_WINDOW_CLAMP_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_WINDOW_CLAMP,
                         BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    TCP_INFO_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_INFO,
                 BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    TCP_QUICKACK_OPT(null, SOCKET_SOL_TCP, SocketOptionName.SOCKET_TCP_QUICKACK,
                     BOOLEAN_CONVERTER, BOOLEAN_CHECK, new OnlyAllowedForTCP()),
    ;

    private SocketOption.SocketOptionLevel level;
    private SocketOption.SocketOptionName optName;
    private Integer opt;
    private OptionValueConverter converter;
    private CheckFunction[] checkFuncs;

    Option(Integer opt,
           SocketOption.SocketOptionLevel level,
           SocketOption.SocketOptionName name,
           OptionValueConverter converter,
           CheckFunction... checkFuncs) {
      this.optName = name;
      this.level = level;
      this.opt = opt;
      this.converter = converter;
      this.checkFuncs = checkFuncs;
    }

    /**
     * Return the string form of the option's name.
     */
    String optionName() {
      return name().substring(0, name().length() - "_OPT".length());
    }

    /**
     * Perform validation for this option and apply the set option changes.
     * @throws SocketException
     */
    private void validateAndApply(
        AppEngineSocketOptionsClient socketImpl, Object val, boolean isDatagramSocket)
        throws SocketException {
      if (val == null) {
        throw new SocketException("Bad value 'null' for option " + optionName());
      }
      if (checkFuncs.length == 0) {
        throw new SocketException("Option " + optionName() + " is not allowed to be set.");
      }
      for (CheckFunction checkFunc : checkFuncs) {
        if (val.getClass().isInstance(checkFunc.equivalenceClassObject())) {
          checkFunc.check(this, val, isDatagramSocket);
        }
      }
      for (CheckFunction checkFunc : checkFuncs) {
        if (val.getClass().isInstance(checkFunc.equivalenceClassObject())) {
          checkFunc.apply(this, socketImpl, val);
          return;
        }
      }
      throw new SocketException("Bad parameter type of '" + val.getClass().getName() +
                                "' for option " + optionName());
    }

    void validateAndApply(AppEngineDatagramSocketImpl socketImpl, Object val)
        throws SocketException {
      validateAndApply(socketImpl, val, true);
    }

    void validateAndApply(AppEngineSocketImpl socketImpl, Object val)
        throws SocketException {
      validateAndApply(socketImpl, val, false);
    }

    /**
     * @return the corresponding protobuffer's SocketOptionLevel
     */
    public SocketOption.SocketOptionLevel getLevel() {
      return level;
    }

    /**
     * @return the corresponding protobuffer's SocketOptionName
     */
    public SocketOption.SocketOptionName getOptName() {
      return optName;
    }

    /**
     * @return the SocketOptions integer value of the option or null if not specified.
     */
    public Integer getOpt() {
      return opt;
    }

    public Object getOption(AppEngineSocketOptionsClient client, boolean isDatagramSocket)
        throws SocketException {
      if (converter == null) {
        throw new SocketException("Option " + optionName() + " is not implimented.");
      }
      return converter.toObject(client.getSocketOptionAsBytes(this));
    }

    public Object getOption(AppEngineSocketImpl socketImpl) throws SocketException {
      return getOption(socketImpl, false);
    }

    public Object getOption(AppEngineDatagramSocketImpl socketImpl) throws SocketException {
      return getOption(socketImpl, true);
    }
  }

  static Option getOptionById(int optionId) {
    for (Option option : Option.values()) {
      if (option.opt == null) {
        continue;
      }
      if (option.opt == optionId) {
        return option;
      }
    }
    return null;
  }

  AppEngineSocketOptions() {
  }
}
