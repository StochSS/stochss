// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;

import com.google.common.base.Objects;

import java.util.Map;

/**
 * A property projection.
 *
 * If specified on a query, this will cause the query return the specified property.
 *
 * @see Query#getProjections()
 */
public final class PropertyProjection extends Projection {
  private final String propertyName;
  private final Class<?> type;

  /**
   * Constructs a property projection.
   *
   * If type is specified, {@link RawValue#asType(Class)} will be used to restore
   * the original value of the property. Otherwise instances of {@link RawValue}
   * will be returned.
   *
   * @param propertyName The name of the property to project
   * @param type The type of values stored in the projected properties or
   * {@null} if the type is not known or variable. If {@code null}, {@link
   * RawValue RawValues} are returned.
   */
  public PropertyProjection(String propertyName, Class<?> type) {
    checkArgument(type == null || DataTypeTranslator.getTypeMap().containsKey(type),
        "Unsupported type: " + type);
    this.propertyName = checkNotNull(propertyName);
    this.type = type;
  }

  @Override
  public String getName() {
    return propertyName;
  }

  /**
   * Returns the type specified for this projection.
   */
  public Class<?> getType() {
    return type;
  }

  @Override
  String getPropertyName() {
    return propertyName;
  }

  @Override
  Object getValue(Map<String, Object> values) {
    checkArgument(values.containsKey(propertyName));
    Object value = values.get(propertyName);
    if (type != null && value != null) {
      checkArgument(value instanceof RawValue);
      value = ((RawValue) value).asType(type);
    }
    return value;
  }

  @Override
  public String toString() {
    return propertyName;
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(propertyName, type);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    PropertyProjection other = (PropertyProjection) obj;
    if (!propertyName.equals(other.propertyName)) return false;
    if (type == null) {
      if (other.type != null) return false;
    } else if (!type.equals(other.type)) return false;
    return true;
  }
}
