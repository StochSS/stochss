/*
 * Copyright 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
package com.google.appengine.api.datastore;

import com.google.appengine.api.datastore.Query.SortDirection;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

/**
 * A Datastore {@code Index} definition.
 *
 */
public final class Index implements Serializable {

  /**
   * Indicates the state of the {@link Index}.
   */
  public enum IndexState {
    /**
     * Indicates the given {@link Index} is being built and therefore can not
     * be used to service queries.
     */
    BUILDING,
    /**
     * Indicates the given {@link Index} is ready to service queries.
     */
    SERVING,
    /**
     * Indicates the given {@link Index} is being deleted.
     */
    DELETING,
    /**
     * Indicates the given {@link Index} encountered an error in the
     * {@code BUILDING} state.
     */
    ERROR
  }

  /**
   * An indexed property.
   */
  public static class Property implements Serializable {

    private static final long serialVersionUID = -5946842287951548217L;

    private String name;
    private SortDirection direction;

    @SuppressWarnings("unused")
    private Property() {}

    /**
     * Constructs a new unmodifiable {@code Property} object.
     *
     * @param name the property name
     * @param direction the sort order for this property
     */
    Property(String name, SortDirection direction) {
      if (name == null) {
        throw new NullPointerException("name must not be null");
      }
      if (direction == null) {
        throw new NullPointerException("direction must not be null");
      }
      this.name = name;
      this.direction = direction;
    }

    public String getName() {
      return name;
    }

    public SortDirection getDirection() {
      return direction;
    }

    @Override
    public boolean equals(Object obj) {
      if (obj instanceof Property) {
        Property other = (Property) obj;
        return name.equals(other.name) && direction.equals(other.direction);
      }
      return false;
    }

    @Override
    public int hashCode() {
      return name.hashCode() * 31 + direction.hashCode();
    }

    @Override
    public String toString() {
      return name + " " + direction;
    }
  }

  private static final long serialVersionUID = 8595801877003574982L;

  private long id;
  private String kind;
  private boolean isAncestor;
  private List<Property> properties;

  @SuppressWarnings("unused")
  private Index() {}

  /**
   * Constructs a new unmodifiable {@code Index} object.
   *
   * @param id unique index identifier
   * @param kind specifies the kind of the entities to index
   * @param isAncestor true if the index supports a query that filters entities
   *    by the entity group parent, false otherwise.
   * @param properties the entity properties to index. The order of the
   *    {@code properties} elements specifies the order in the index.
   */
  Index(long id, String kind, boolean isAncestor, List<Property> properties) {
    if (kind == null) {
      throw new NullPointerException("kind must not be null");
    }
    if (properties == null) {
      throw new NullPointerException("properties must not be null");
    }
    this.id = id;
    this.kind = kind;
    this.isAncestor = isAncestor;
    this.properties = properties;
  }

  public long getId() {
    return id;
  }

  /**
   * Get the index's kind, or the empty string ("") if it has none.
   */
  public String getKind() {
    return kind;
  }

  public boolean isAncestor() {
    return isAncestor;
  }

  public List<Property> getProperties() {
    return Collections.unmodifiableList(properties);
  }

  @Override
  public boolean equals(Object obj) {
    if (obj instanceof Index) {
      Index other = (Index) obj;
      return id == other.id
          && kind.equals(other.kind)
          && isAncestor == other.isAncestor
          && properties.equals(other.properties);
    }
    return false;
  }

  @Override
  public int hashCode() {
    int result = Long.valueOf(id).hashCode();
    result = result * 31 + properties.hashCode();
    result = result * 31 + kind.hashCode();
    return result * 31 + Boolean.valueOf(isAncestor).hashCode();
  }

  @Override
  public String toString() {
    StringBuilder stBuilder = new StringBuilder("INDEX [").append(id)
    .append("] ON ").append(kind).append('(');
    if (!properties.isEmpty()) {
      for (Property property : properties) {
        stBuilder.append(property).append(", ");
      }
      stBuilder.setLength(stBuilder.length() - 2);
    }
    stBuilder.append(")");
    if (isAncestor) {
      stBuilder.append(" INCLUDES ANCESTORS");
    }
    return stBuilder.toString();
  }
}
