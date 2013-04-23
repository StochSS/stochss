// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.DataTypeUtils.CheckValueOption.ALLOW_MULTI_VALUE;
import static com.google.appengine.api.datastore.DataTypeUtils.CheckValueOption.REQUIRE_MULTI_VALUE;
import static com.google.appengine.api.datastore.DataTypeUtils.CheckValueOption.VALUE_PRE_CHECKED_WITHOUT_NAME;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.users.User;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

/**
 * {@code DataTypeUtils} presents a simpler interface that allows
 * user-code to determine what Classes can safely be stored as
 * properties in the data store.
 *
 * Currently this list includes:
 * <ul>
 *   <li>{@link String} (but not {@link StringBuffer}),
 *
 *   <li>All numeric primitive wrappers ({@link Byte} through {@link
 *   Long}, {@link Float} and {@link Double}, but not {@link
 *   java.math.BigInteger} or {@link java.math.BigDecimal}.
 *
 *   <li>{@link Key}, for storing references to other {@link Entity}
 *   objects.
 *
 *   <li>{@link User}, for storing references to users.
 *
 *   <li>{@link ShortBlob}, for storing binary data small enough to be indexed.
 * This means properties of this type, unlike {@link Blob} properties, can be
 * filtered and sorted on in queries.
 *
 *   <li>{@link Blob}, for storing unindexed binary data less than 1MB.
 *
 *   <li>{@link Text}, for storing unindexed String data less than 1MB.
 *
 *   <li>{@link BlobKey}, for storing references to user uploaded
 *   blobs (which may exceed 1MB).
 *
 *   <li>{@link Date}.
 *
 *   <li>{@link Link}.
 * </ul>
 *
 */
public final class DataTypeUtils {

  /**
   * Options for checking if a property value is valid for a property.
   */
  enum CheckValueOption {

    /**
     * Allow the value to be a collection of values.
     */
    ALLOW_MULTI_VALUE,

    /**
     * Require the value to be a collection of values.
     */
    REQUIRE_MULTI_VALUE,

    /**
     * The value's validity has already been checked but not in conjunction with the property
     * name.
     */
    VALUE_PRE_CHECKED_WITHOUT_NAME
  }

  private static final Logger logger = Logger.getLogger(DataTypeUtils.class.getName());

  /**
   * This is the maximum number of characters that a string property
   * can contain.  If your string has more characters, you need to
   * wrap it in a {@link Text}.
   */
  public static final int MAX_STRING_PROPERTY_LENGTH = 500;

  /**
   * This is the maximum number of bytes that a {@code ShortBlob} property
   * can contain.  If your data is larger, you need to use a {@code Blob}.
   */
  public static final int MAX_SHORT_BLOB_PROPERTY_LENGTH = 500;

  public static final int MAX_LINK_PROPERTY_LENGTH = 2038;

  private static final Set<Class<?>> SUPPORTED_TYPES = new HashSet<Class<?>>();
  static {
    SUPPORTED_TYPES.add(RawValue.class);
    SUPPORTED_TYPES.add(Boolean.class);
    SUPPORTED_TYPES.add(String.class);
    SUPPORTED_TYPES.add(Byte.class);
    SUPPORTED_TYPES.add(Short.class);
    SUPPORTED_TYPES.add(Integer.class);
    SUPPORTED_TYPES.add(Long.class);
    SUPPORTED_TYPES.add(Float.class);
    SUPPORTED_TYPES.add(Double.class);
    SUPPORTED_TYPES.add(User.class);
    SUPPORTED_TYPES.add(Key.class);
    SUPPORTED_TYPES.add(Blob.class);
    SUPPORTED_TYPES.add(Text.class);
    SUPPORTED_TYPES.add(Date.class);
    SUPPORTED_TYPES.add(Link.class);
    SUPPORTED_TYPES.add(ShortBlob.class);
    SUPPORTED_TYPES.add(GeoPt.class);
    SUPPORTED_TYPES.add(Category.class);
    SUPPORTED_TYPES.add(Rating.class);
    SUPPORTED_TYPES.add(PhoneNumber.class);
    SUPPORTED_TYPES.add(PostalAddress.class);
    SUPPORTED_TYPES.add(Email.class);
    SUPPORTED_TYPES.add(IMHandle.class);
    SUPPORTED_TYPES.add(BlobKey.class);
    SUPPORTED_TYPES.add(EmbeddedEntity.class);
  }

  /**
   * If the specified object cannot be used as the value for a {@code
   * Entity} property, throw an exception with the appropriate
   * explanation.
   *
   * @throws NullPointerException if the specified value is null
   * @throws IllegalArgumentException if the type is not supported, or
   * if the object is in some other way invalid.
   */
  public static void checkSupportedValue(Object value) {
    checkSupportedValue(null, value);
  }

  /**
   * If the specified object cannot be used as the value for a {@code
   * Entity} property, throw an exception with the appropriate
   * explanation.
   *
   * @throws NullPointerException if the specified value is null
   * @throws IllegalArgumentException if the type is not supported, or
   * if the object is in some other way invalid.
   */
  public static void checkSupportedValue(String name, Object value) {
    checkSupportedValue(name, value, true, false);
  }

  /**
   * If the specified object cannot be used as the value for a {@code
   * Entity} property, throw an exception with the appropriate
   * explanation.
   *
   * @param name name of the property
   * @param value value in question
   * @param allowMultiValue if this property allows multivalue values
   * @param requireMultiValue if this property requires multivalue values
   *
   * @throws IllegalArgumentException if the type is not supported, or
   * if the object is in some other way invalid.
   */
  static void checkSupportedValue(String name, Object value,
      boolean allowMultiValue, boolean requireMultiValue) {
    EnumSet<CheckValueOption> options = EnumSet.noneOf(CheckValueOption.class);
    if (allowMultiValue) {
      options.add(ALLOW_MULTI_VALUE);
    }
    if (requireMultiValue) {
      options.add(REQUIRE_MULTI_VALUE);
    }
    checkSupportedValue(name, value, options, SUPPORTED_TYPES);
  }

  /**
   * If the specified object cannot be used as the value for a {@code
   * Entity} property, throw an exception with the appropriate
   * explanation.
   *
   * @param name name of the property
   * @param value value in question
   * @param options the options for this check invocation.
   * @param supportedTypes the types considered to be valid types for the value.
   *
   * @throws IllegalArgumentException if the type is not supported, or
   * if the object is in some other way invalid.
   */
  static void checkSupportedValue(String name, Object value, EnumSet<CheckValueOption> options,
      Set<Class<?>> supportedTypes) {
    if (value instanceof Collection<?>) {
      if (!options.contains(ALLOW_MULTI_VALUE)) {
        throw new IllegalArgumentException("A collection of values is not allowed.");
      }

      Collection<?> values = (Collection<?>) value;
      if (!values.isEmpty()) {
        for (Object obj : values) {
          checkSupportedSingleValue(name, obj, options, supportedTypes);
        }
      } else if (options.contains(REQUIRE_MULTI_VALUE)) {
        throw new IllegalArgumentException("A collection with at least one value is required.");
      }
    } else if (options.contains(REQUIRE_MULTI_VALUE)) {
      throw new IllegalArgumentException("A collection of values is required.");
    } else {
      checkSupportedSingleValue(name, value, options, supportedTypes);
    }
  }

  private static void checkSupportedSingleValue(String name, Object value,
      EnumSet<CheckValueOption> options, Set<Class<?>> supportedTypes) {
    if (value == null) {
      return;
    }

    if (Entity.KEY_RESERVED_PROPERTY.equals(name)) {
      if (!(value instanceof Key)) {
        logger.warning(Entity.KEY_RESERVED_PROPERTY + " value should be of type Key");
      }
    }

    if (options.contains(VALUE_PRE_CHECKED_WITHOUT_NAME)) {
      return;
    }

    String prefix;
    if (name == null) {
      prefix = "";
    } else {
      prefix = name + ": ";
    }

    if (!supportedTypes.contains(value.getClass())) {
      throw new IllegalArgumentException(
          prefix + value.getClass().getName() + " is not a supported property type.");
    }

    if (value instanceof String) {
      int length = ((String) value).length();
      if (length > MAX_STRING_PROPERTY_LENGTH) {
        throw new IllegalArgumentException(
            prefix + "String properties must be " + MAX_STRING_PROPERTY_LENGTH
            + " characters or less.  Instead, use " + Text.class.getName() + ", which can store "
            + "strings of any length.");
      }
    } else if (value instanceof Link) {
      int length = ((Link) value).getValue().length();
      if (length > MAX_LINK_PROPERTY_LENGTH) {
        throw new IllegalArgumentException(
            prefix + "Link properties must be " + MAX_LINK_PROPERTY_LENGTH
            + " characters or less.  Instead, use " + Text.class.getName() + ", which can store "
            + "strings of any length.");
      }
    } else if (value instanceof ShortBlob) {
      int length = ((ShortBlob) value).getBytes().length;
      if (length > MAX_SHORT_BLOB_PROPERTY_LENGTH) {
        throw new IllegalArgumentException(prefix + "byte[] properties must be "
            + MAX_SHORT_BLOB_PROPERTY_LENGTH
            + " bytes or less.  Instead, use " + Blob.class.getName() + ", which can store binary "
            + "data of any size.");
      }
    }
  }

  /**
   * Returns true if and only if the supplied {@code Class} can be
   * stored in the data store.
   */
  public static boolean isSupportedType(Class<?> clazz) {
    return SUPPORTED_TYPES.contains(clazz);
  }

  /**
   * Returns an unmodifiable {@code Set} of supported {@code Class}
   * objects.
   */
  public static Set<Class<?>> getSupportedTypes() {
    return Collections.unmodifiableSet(SUPPORTED_TYPES);
  }

  private DataTypeUtils() {
  }
}
