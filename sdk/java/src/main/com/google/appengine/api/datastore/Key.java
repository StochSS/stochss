// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import com.google.common.base.Objects;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.Iterator;
import java.util.LinkedList;

/**
 * The primary key for a datastore entity.
 *
 * A datastore GUID. A Key instance uniquely identifies an entity
 * across all apps, and includes all information necessary to fetch
 * the entity from the datastore with {@code
 * DatastoreService.get(Key)}.
 * <p>
 * You can create {@code Key} objects directly by using {@link
 * KeyFactory#createKey} or {@link #getChild}.
 * <p>
 * You can also retrieve the {@code Key} automatically created when you
 * create a new {@link Entity}, or serialize {@code Key} objects, or
 * use {@link KeyFactory} to convert them to and from websafe String
 * values.
 *
 * @see KeyFactory
 *
 */
public final class Key implements Serializable, Comparable<Key> {
  static final long serialVersionUID = -448150158203091507L;

  static final long NOT_ASSIGNED = 0L;

  private Key parentKey;
  private String kind;

  private String appId;

  private long id;
  private String name;

  private transient AppIdNamespace appIdNamespace;

  /**
   * This constructor exists for frameworks (e.g. Google Web Toolkit)
   * that require it for serialization purposes.  It should not be
   * called explicitly.
   */
  @SuppressWarnings("unused")
  private Key() {
    parentKey = null;
    kind = null;
    appIdNamespace = null;
    id = NOT_ASSIGNED;
    name = null;
  }

  Key(String kind) {
    this(kind, null, NOT_ASSIGNED);
  }

  Key(String kind, String name) {
    this(kind, null, name);
  }

  Key(String kind, Key parentKey) {
    this(kind, parentKey, NOT_ASSIGNED);
  }

  Key(String kind, Key parentKey, long id) {
    this(kind, parentKey, id, null);
  }

  Key(String kind, Key parentKey, long id, AppIdNamespace appIdNamespace) {
    this(kind, parentKey, id, null, appIdNamespace);
  }

  Key(String kind, Key parentKey, String name) {
    this(kind, parentKey, name, null);
  }

  Key(String kind, Key parentKey, String name, AppIdNamespace appIdNamespace) {
    this(kind, parentKey, NOT_ASSIGNED, name, appIdNamespace);
  }

  Key(String kind, Key parentKey, long id, String name, AppIdNamespace appIdNamespace) {
    if (kind == null || kind.length() == 0) {
      throw new IllegalArgumentException("No kind specified.");
    }

    if (appIdNamespace == null) {
      if (parentKey == null) {
        appIdNamespace = DatastoreApiHelper.getCurrentAppIdNamespace();
      } else {
        appIdNamespace = parentKey.getAppIdNamespace();
      }
    }

    validateAppIdNamespace(parentKey, appIdNamespace);

    if (name != null) {
      if (name.length() == 0) {
        throw new IllegalArgumentException("Name may not be empty.");
      } else if (id != NOT_ASSIGNED) {
        throw new IllegalArgumentException(
            "Id and name may not both be specified at once.");
      }
    }

    this.id = id;
    this.parentKey = parentKey;
    this.name = getString(parentKey, name);
    this.kind = getString(parentKey, kind);
    this.appIdNamespace = appIdNamespace;
  }

  private static String getString(Key parentKey, String value) {
    if (value == null || parentKey == null) {
      return value;
    }
    return new String(value);
  }

  private void writeObject(ObjectOutputStream out) throws IOException {
    if (appIdNamespace != null) {
      appId = appIdNamespace.toEncodedString();
    }
    out.defaultWriteObject();
  }

  private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    if (appId != null) {
      appIdNamespace = AppIdNamespace.parseEncodedAppIdNamespace(appId);
      appId = null;
    } else {
      appIdNamespace = new AppIdNamespace(DatastoreApiHelper.getCurrentAppId(), "");
    }
    validateAppIdNamespace(parentKey, appIdNamespace);
  }

  private static void validateAppIdNamespace(Key parentKey, AppIdNamespace appIdNamespace) {
    if (parentKey != null && appIdNamespace != null && parentKey.getAppIdNamespace() != null &&
        !(parentKey.getAppIdNamespace().equals(appIdNamespace))) {
      throw new IllegalArgumentException(
          "Parent key must have same app id and namespace as child.");
    }
  }

  /**
   * Returns the kind of the {@code Entity} represented by this {@code
   * Key}.
   */
  public String getKind() {
    return kind;
  }

  /**
   * If this {@code Key} has a parent, return a {@code Key} that
   * represents it.  If not, simply return null.
   */
  public Key getParent() {
    return parentKey;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((appIdNamespace == null) ? 0 : appIdNamespace.hashCode());
    result = prime * result + (int) (id ^ (id >>> 32));
    result = prime * result + ((kind == null) ? 0 : kind.hashCode());
    result = prime * result + ((name == null) ? 0 : name.hashCode());
    result = prime * result + ((parentKey == null) ? 0 : parentKey.hashCode());
    return result;
  }

  @Override
  public String toString() {
    StringBuffer buffer = new StringBuffer();
    appendToString(buffer);
    return buffer.toString();
  }

  private void appendToString(StringBuffer buffer) {
    if (parentKey != null) {
      parentKey.appendToString(buffer);
      buffer.append("/");
    } else {
      if (appIdNamespace != null) {
        String namespace = appIdNamespace.getNamespace();
        if (namespace.length() > 0) {
          buffer.append("!");
          buffer.append(namespace);
          buffer.append(":");
        }
      }
    }
    buffer.append(kind);
    buffer.append("(");
    if (name != null) {
      buffer.append("\"" + name + "\"");
    } else if (id == NOT_ASSIGNED) {
      buffer.append("no-id-yet");
    } else {
      buffer.append(String.valueOf(id));
    }
    buffer.append(")");
  }

  /**
   * Compares two {@code Key} objects by comparing ids, kinds, parent
   * and appIdNamespace.
   * If both keys are assigned names rather than ids, compares names instead
   * of ids. If neither key has an id or a name, the keys are only equal if
   * they reference the same object.
   */
  @Override
  public boolean equals(Object object) {
    return equals(object, true);
  }

  /**
   * Helper function to determin equality.
   *
   * @param object the key to compare to
   * @param considerNotAssigned if NOT_ASSIGNED should be considered as different from any other.
   * @return if key is equal to this.
   */
  boolean equals(Object object, boolean considerNotAssigned) {
    if (object instanceof Key) {
      Key key = (Key) object;
      if (this == key) {
        return true;
      }
      if (!appIdNamespace.equals(key.appIdNamespace)) {
        return false;
      }
      if (considerNotAssigned && name == null && id == NOT_ASSIGNED && key.id == NOT_ASSIGNED) {
        return false;
      }
      if (id != key.id ||
          !kind.equals(key.kind) ||
          !Objects.equal(name, key.name)) {
        return false;
      }
      if (parentKey != key.parentKey && (parentKey == null ||
          !parentKey.equals(key.parentKey, considerNotAssigned))) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Returns the identifier of the application in which this {@code
   * Key} is stored, or {@code null} if the current application should be used.
   */
  AppIdNamespace getAppIdNamespace() {
    return appIdNamespace;
  }

  /**
   * Returns the appId for this {@link Key}.
   */
  public String getAppId() {
    return appIdNamespace.getAppId();
  }

  /**
   * Returns the namespace for this {@link Key}.
   */
  public String getNamespace() {
    return appIdNamespace.getNamespace();
  }

  /**
   * Returns the numeric identifier of this {@code Key}.
   */
  public long getId() {
    return id;
  }

  /**
   * Returns the name of this {@code Key}.
   */
  public String getName() {
    return name;
  }

  /**
   * Creates a new key having {@code this} as parent and the given numeric
   * identifier. The parent key must be complete.
   *
   * @param kind the kind of the child key to create
   * @param id the numeric identifier of the key in {@code kind}, unique
   * for this parent
   */
  public Key getChild(String kind, long id) {
    if (!isComplete()) {
      throw new IllegalStateException("Cannot get a child of an incomplete key.");
    }
    return new Key(kind, this, id);
  }

  /**
   * Creates a new key having {@code this} as parent and the given name. The
   * parent key must be complete.
   *
   * @param kind the kind of the child key to create
   * @param name the name of the key in {@code kind}, as an arbitrary string
   * unique for this parent
   */
  public Key getChild(String kind, String name) {
    if (!isComplete()) {
      throw new IllegalStateException("Cannot get a child of an incomplete key.");
    }
    return new Key(kind, this, name);
  }

  /**
   * Returns true if this Key has a name specified or has been assigned an identifier.
   */
  public boolean isComplete() {
    return id != NOT_ASSIGNED || name != null;
  }

  void setId(long id) {
    if (name != null) {
      throw new IllegalArgumentException("Cannot set id; key already has a name.");
    }
    this.id = id;
  }

  void simulatePutForTesting(long testId) {
    this.id = testId;
  }

  /**
   * Build an {@code Iterator} for the given {@code Key}
   * that returns all the keys that compose the key, starting
   * with the topmost ancestor and proceeding down to the most
   * recent child.
   */
  private static Iterator<Key> getPathIterator(Key key) {
    LinkedList<Key> stack = new LinkedList<Key>();
    do {
      stack.addFirst(key);
      key = key.getParent();
    } while(key != null);
    return stack.iterator();
  }

  /**
   * Compares two {@code Key} objects.  The algorithm proceeds as follows:
   * Turn each {@code Key} into an iterator where the first element returned
   * is the top-most ancestor, the next element is the child
   * of the previous element, and so on.  The last element will
   * be the {@code Key} we started with.  Once we have assembled these two
   * iterators (one for 'this' and one for the {@code Key} we're comparing to),
   * consume them in parallel, comparing the next element from each iterator.
   * If at any point the comparison of these two elements yields a non-zero
   * result, return that as the result of the overall comparison.  If we
   * exhaust the iterator built from 'this' before we exhaust
   * the iterator built from the other {@code Key}, we return less than.  An
   * example:
   *
   * app1.type1.4.app1.type2.9 < app1.type1.4.app1.type2.9.app1.type3.2
   *
   * If we exhaust the iterator built from the other {@code Key} before we
   * exhaust the iterator built from 'this', we return greater than.  An
   * example:
   *
   * app1.type1.4.app1.type2.9.app1.type3.2 > app1.type1.4.app1.type2.9
   *
   * The relationship between individual {@code Key Keys} is performed
   * by comparing app followed by kind followed by id.  If both keys are
   * assigned names rather than ids, compares names instead of ids. If neither
   * key has an id or a name we return an arbitrary but consistent result.
   * Assuming all other components are equal, all ids are less than all names.
   */
  @Override
  public int compareTo(Key other) {

    if (this == other) {
      return 0;
    }

    Iterator<Key> thisPath = getPathIterator(this);
    Iterator<Key> otherPath = getPathIterator(other);

    while (thisPath.hasNext()) {
      Key thisKey = thisPath.next();
      if (otherPath.hasNext()) {
        Key otherKey = otherPath.next();
        int result = compareToInternal(thisKey, otherKey);
        if (result != 0) {
          return result;
        }
      } else {
        return 1;
      }
    }
    return otherPath.hasNext() ? -1 : 0;
  }

  /**
   * Compares two {@code Key} objects, ignoring parentKey.  This comparison
   * relies on the result of {@link String#compareTo(String)}, which uses
   * Unicode code points.  This is consistent with how keys are compared in the
   * App Engine datastore.  Also see
   * http://en.wikipedia.org/wiki/UTF-8#Advantages
   *
   * @see #compareTo(Key)
   */
  private static int compareToInternal(Key thisKey, Key otherKey) {

    if (thisKey == otherKey) {
      return 0;
    }

    int result = thisKey.getAppIdNamespace().compareTo(otherKey.getAppIdNamespace());
    if (result != 0) {
      return result;
    }

    result = thisKey.getKind().compareTo(otherKey.getKind());
    if (result != 0) {
      return result;
    }

    if (!thisKey.isComplete() && !otherKey.isComplete()) {
      return compareToWithIdentityHash(thisKey, otherKey);
    }

    if (thisKey.getId() != NOT_ASSIGNED) {
      if (otherKey.getId() == NOT_ASSIGNED) {
        return -1;
      }
      return Long.valueOf(thisKey.getId()).compareTo(otherKey.getId());
    }

    if (otherKey.getId() != NOT_ASSIGNED) {
      return 1;
    }

    return thisKey.getName().compareTo(otherKey.getName());
  }

  /**
   * Helper method to compare 2 {@code Key} objects using their identity hash
   * codes.
   */
  static int compareToWithIdentityHash(Key k1, Key k2) {
    return Integer.valueOf(System.identityHashCode(k1))
        .compareTo(System.identityHashCode(k2));
  }
}
