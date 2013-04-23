// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;

import com.google.appengine.api.datastore.DataTypeTranslator.Type;
import com.google.appengine.api.users.User;
import com.google.storage.onestore.v3.OnestoreEntity.PropertyValue;

import java.io.IOException;
import java.io.Serializable;

/**
 * A raw datastore value.
 *
 * These are returned by projection queries when a {@link PropertyProjection} does not
 * specify a type.
 *
 * @see Query#getProjections()
 */
public final class RawValue implements Serializable {
  private transient PropertyValue propertyValue;

  RawValue(PropertyValue propertyValue) {
    this.propertyValue = checkNotNull(propertyValue);
  }

  /**
   * Returns an object of the exact type passed in.
   *
   * @param type the class object for the desired type
   * @return an object of type T or {@code null}
   * @throws IllegalArgumentException if the raw value cannot be converted into the given type
   */
  @SuppressWarnings("unchecked")
  public <T> T asStrictType(Class<T> type) {
    Object value = asType(type);
    if (value != null) {
      checkArgument(type.isAssignableFrom(value.getClass()), "Unsupported type: " + type);
    }
    return (T) value;
  }

  /**
   * Returns the object normally returned by the datastore if given type is passed in.
   *
   * All integer values are returned as {@link Long}.
   * All floating point values are returned as {@link Double}.
   *
   * @param type the class object for the desired type
   * @return an object of type T or {@code null}
   * @throws IllegalArgumentException if the raw value cannot be converted into the given type
   */
  public Object asType(Class<?> type) {
    Type<?> typeAdapter = DataTypeTranslator.getTypeMap().get(type);
    checkArgument(typeAdapter != null, "Unsupported type: " + type);

    if (!typeAdapter.hasPropertyValue(propertyValue)) {
      checkArgument(propertyValue.equals(PropertyValue.IMMUTABLE_DEFAULT_INSTANCE),
          "Type mismatch.");
      return null;
    }

    return typeAdapter.getPropertyValue(propertyValue);
  }

  /**
   * Returns the raw value.
   *
   * @return An object of type {@link Boolean}, {@link Double}, {@link GeoPt}, {@link Key},
   * {@code byte[]}, {@link User} or {@code null}.
   */
  public Object getValue() {
    if (propertyValue.hasBooleanValue()) {
      return propertyValue.isBooleanValue();
    } else if (propertyValue.hasDoubleValue()) {
      return propertyValue.getDoubleValue();
    } else if (propertyValue.hasInt64Value()) {
      return propertyValue.getInt64Value();
    } else if (propertyValue.hasPointValue()) {
      return asType(GeoPt.class);
    } else if (propertyValue.hasReferenceValue()) {
      return asType(Key.class);
    } else if (propertyValue.hasStringValue()) {
      return propertyValue.getStringValueAsBytes();
    } else if (propertyValue.hasUserValue()) {
      return asType(User.class);
    }
    return null;
  }

  private void writeObject(java.io.ObjectOutputStream out) throws IOException {
    out.write(1);
    propertyValue.writeTo(out);
    out.defaultWriteObject();
  }

  private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException {
    checkArgument(in.read() == 1);
    propertyValue = new PropertyValue();
    propertyValue.parseFrom(in);
    in.defaultReadObject();
  }

  @Override
  public int hashCode() {
    return propertyValue.hashCode();
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    RawValue other = (RawValue) obj;
    return propertyValue.equals(other.propertyValue);
  }

  @Override
  public String toString() {
    return "RawValue [value=" + getValue() + "]";
  }
}
