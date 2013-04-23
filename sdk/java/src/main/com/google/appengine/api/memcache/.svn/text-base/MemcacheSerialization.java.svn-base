// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache;

import static com.google.common.base.Charsets.US_ASCII;
import static com.google.common.base.Charsets.UTF_8;
import static com.google.common.io.BaseEncoding.base64;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Static serialization helpers shared by {@link MemcacheServiceImpl} and
 * {@link com.google.appengine.api.memcache.dev.LocalMemcacheService}.
 *
 * This class is thread-safe.
 *
 *
 */
public class MemcacheSerialization {

  /**
   * Values used as flags on the MemcacheService's values.
   */
  public enum Flag {
    BYTES,
    UTF8,
    OBJECT,
    INTEGER,
    LONG,
    BOOLEAN,
    BYTE,
    SHORT;

    private static final Flag[] VALUES = Flag.values();

    /**
     * While the enum is convenient, the implementation wants {@code int}s...
     * this factory converts {@code int} value to Flag value.
     */
    public static Flag fromInt(int i) {
      if (i < 0 || i >= VALUES.length) {
        throw new IllegalArgumentException();
      }
      return VALUES[i];
    }
  }

  /**
   * Tuple of a serialized byte array value and associated flags to interpret
   * that value.  Used as the return from {@link MemcacheSerialization#serialize}.
   */
  public static class ValueAndFlags {
    public final byte[] value;
    public final Flag flags;

    private ValueAndFlags(byte[] value, Flag flags) {
      this.value = value;
      this.flags = flags;
    }
  }

  private static final byte FALSE_VALUE = '0';
  private static final byte TRUE_VALUE = '1';
  private static final String MYCLASSNAME = MemcacheSerialization.class.getName();

  /**
   * The SHA1 checksum engine, cached for reuse.  We did test the hashing time
   * was negligible (17us/kb, linear); we don't "need" crypto-secure, but it's
   * a good way to minimize collisions.
   */
  private static final MessageDigest SHA1;

  static {
    try {
      SHA1 = MessageDigest.getInstance("SHA-1");
    } catch (NoSuchAlgorithmException ex) {
      Logger.getLogger(MYCLASSNAME).log(Level.SEVERE,
          "Can't load SHA-1 MessageDigest!", ex);
      throw new MemcacheServiceException("No SHA-1 algorithm, cannot hash keys for memcache", ex);
    }
  }

  private MemcacheSerialization() {
  }

  /**
   * Deserialize the object, according to its flags.  This would have private
   * visibility, but is also used by LocalMemcacheService for the increment
   * operation.
   *
   * @param value
   * @param flags
   * @return the Object originally stored
   * @throws ClassNotFoundException if the object can't be re-instantiated due
   *    to being an unlocatable type
   * @throws IOException if the object can't be re-instantiated for some other
   *    reason
   */
  public static Object deserialize(byte[] value, int flags)
      throws ClassNotFoundException, IOException {
    Flag flagval = Flag.fromInt(flags);

    switch (flagval) {
      case BYTES:
        return value;

      case BOOLEAN:
        if (value.length != 1) {
          throw new InvalidValueException("Cannot deserialize Boolean: bad length", null);
        }
        switch (value[0]) {
          case TRUE_VALUE:
            return Boolean.TRUE;
          case FALSE_VALUE:
            return Boolean.FALSE;
        }
        throw new InvalidValueException("Cannot deserialize Boolean: bad contents", null);

      case BYTE:
      case SHORT:
      case INTEGER:
      case LONG:
        long val = new BigInteger(new String(value, US_ASCII)).longValue();
        switch (flagval) {
          case BYTE:
            return (byte) val;
          case SHORT:
            return (short) val;
          case INTEGER:
            return (int) val;
          case LONG:
            return val;
          default:
            throw new InvalidValueException("Cannot deserialize number: bad contents", null);
        }

      case UTF8:
        return new String(value, UTF_8);

      case OBJECT:
        if (value.length == 0) {
          return null;
        }
        ByteArrayInputStream baos = new ByteArrayInputStream(value);
        ObjectInputStream objIn = new ObjectInputStream(baos);
        Object response = objIn.readObject();
        objIn.close();
        return response;

      default:
        assert false;
    }
    return null;
  }

  /**
   * Converts the user's key Object into a byte[] for the MemcacheGetRequest.
   * Because the underlying service has a length limit, we actually use the
   * SHA1 hash of the serialized object as its key if it's not a basic type.
   * For the basic types (that is, {@code String}, {@code Boolean}, and the
   * fixed-point numbers), we use a human-readable representation.
   *
   * @param key
   * @return hash result.  For the key {@code null}, the hash is also
   *   {@code null}.
   */
  public static byte[] makePbKey(Object key) throws IOException {
    if (key == null) {
      return new byte[0];
    }
    if (key instanceof String && ((String) key).length() < 250) {
      return ("\"" + key + "\"").getBytes(UTF_8);

    } else if (key instanceof Long || key instanceof Integer
               || key instanceof Short || key instanceof Byte) {
      return (key.getClass().getName() + ":" + key).getBytes(UTF_8);

    } else if (key instanceof Boolean) {
      return (((Boolean) key) ? "true" : "false").getBytes(UTF_8);

    } else {
      ValueAndFlags vaf = serialize(key);
      byte sha1hash[];
      synchronized (SHA1) {
        SHA1.update(vaf.value);
        sha1hash = SHA1.digest();
      }
      return base64().encode(sha1hash).getBytes(UTF_8);
    }
  }

  /**
   * @param value
   * @return the ValueAndFlags containing a serialized representation of the
   *    Object and the flags to hint deserialization.
   * @throws IOException for serialization errors, normally due to a
   *    non-serializable object type
   */
  public static ValueAndFlags serialize(Object value)
      throws IOException {
    Flag flags;
    byte[] bytes;

    if (value == null) {
      bytes = new byte[0];
      flags = Flag.OBJECT;

    } else if (value instanceof byte[]) {
      flags = Flag.BYTES;
      bytes = (byte[]) value;

    } else if (value instanceof Boolean) {
      flags = Flag.BOOLEAN;
      bytes = new byte[1];
      bytes[0] = ((Boolean) value) ? TRUE_VALUE : FALSE_VALUE;

    } else if (value instanceof Integer || value instanceof Long
        || value instanceof Byte || value instanceof Short) {
      bytes = value.toString().getBytes(US_ASCII);
      if (value instanceof Integer) {
        flags = Flag.INTEGER;
      } else if (value instanceof Long) {
        flags = Flag.LONG;
      } else if (value instanceof Byte) {
        flags = Flag.BYTE;
      } else {
        flags = Flag.SHORT;
      }

    } else if (value instanceof String) {
      flags = Flag.UTF8;
      bytes = ((String) value).getBytes(UTF_8);

    } else if (value instanceof Serializable) {
      flags = Flag.OBJECT;
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ObjectOutputStream objOut = new ObjectOutputStream(baos);
      objOut.writeObject(value);
      objOut.close();
      bytes = baos.toByteArray();

    } else {
      throw new IllegalArgumentException("can't accept " + value.getClass()
          + " as a memcache entity");
    }
    return new ValueAndFlags(bytes, flags);
  }
}
