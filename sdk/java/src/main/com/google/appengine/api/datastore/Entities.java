// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

/**
 * Utility functions and constants for entities.
 *
 */
public final class Entities {
  /**
   * A metadata kind that can be used to query for kinds that exist in the
   * datastore.
   */
  public static final String KIND_METADATA_KIND = "__kind__";

  /**
   * A metadata kind that can be used to query for properties that exist in the
   * datastore.
   */
  public static final String PROPERTY_METADATA_KIND = "__property__";

  /**
   * A metadata kind that can be used to query for namespaces that exist in the
   * datastore.
   */
  public static final String NAMESPACE_METADATA_KIND = "__namespace__";

  /**
   * The numeric ID for __namespace__ keys representing the empty namespace.
   */
  public static final long NAMESPACE_METADATA_EMPTY_ID = 1;

  /**
   * A metadata kind that can be used to get information about entity groups.
   * The metadata for the entity group with root entity key R is fetched using a
   * {@link DatastoreService#get} call on key
   * {@code KeyFactory.createKey(R, ENTITY_GROUP_METADATA_KIND,
   * ENTITY_GROUP_METADATA_ID)}.
   *
   * <p>The resulting entity has a {@link Entity#VERSION_RESERVED_PROPERTY}
   * numeric property whose value is guaranteed to increase on every change to
   * the entity group. This value may also occasionally increase without any
   * user-visible change to the entity group.
   */
  public static final String ENTITY_GROUP_METADATA_KIND = "__entity_group__";

  /**
   * ID for __entity_group__ entities.
   * @see #ENTITY_GROUP_METADATA_KIND
   */
  public static final long ENTITY_GROUP_METADATA_ID = 1;

  /**
   * Create a __kind__ key for {@code kind}.
   *
   * @param kind Kind to create key for.
   * @return __kind__ key.
   */
  public static Key createKindKey(String kind) {
    return KeyFactory.createKey(KIND_METADATA_KIND, kind);
  }

  /**
   * Create a __property__ key for {@code property} of {@code kind}.
   *
   * @param kind Kind to create key for.
   * @param property Property to create key for.
   * @return __property__ key.
   */
  public static Key createPropertyKey(String kind, String property) {
    return KeyFactory.createKey(createKindKey(kind), PROPERTY_METADATA_KIND, property);
  }

  /**
   * Create a __namespace__ key for {@code namespace}.
   *
   * @param namespace Namespace to create key for.
   * @return __namespace__ key.
   */
  public static Key createNamespaceKey(String namespace) {
    if (namespace.isEmpty()) {
      return KeyFactory.createKey(NAMESPACE_METADATA_KIND, NAMESPACE_METADATA_EMPTY_ID);
    } else {
      return KeyFactory.createKey(NAMESPACE_METADATA_KIND, namespace);
    }
  }

  /**
   * Extract the namespace name from a __namespace__ key.
   *
   * @param namespaceKey Key to extract namespace from.
   * @return The namespace name.
   */
  public static String getNamespaceFromNamespaceKey(Key namespaceKey) {
    if (namespaceKey.getId() == NAMESPACE_METADATA_EMPTY_ID) {
      return "";
    } else {
      return namespaceKey.getName();
    }
  }

  /**
   * Create an __entity_group__ key for the entity group containing {@code key}.
   *
   * @param key Key of any entity in the entity group.
   * @return __entity_group__ key.
   */
  public static Key createEntityGroupKey(Key key) {
    while (key.getParent() != null) {
      key = key.getParent();
    }
    return KeyFactory.createKey(key, ENTITY_GROUP_METADATA_KIND, ENTITY_GROUP_METADATA_ID);
  }

  /**
   * Get the value of the __version__ property from {@code entity}.
   *
   * @param entity Entity to fetch __version__ from (must have a numeric
   * __version__ property).
   * @return __version__ property value.
   */
  public static long getVersionProperty(Entity entity) {
    return ((Number) entity.getProperty(Entity.VERSION_RESERVED_PROPERTY)).longValue();
  }
}
