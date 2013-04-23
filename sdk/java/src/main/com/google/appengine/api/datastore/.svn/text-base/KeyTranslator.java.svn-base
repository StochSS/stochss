// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import com.google.storage.onestore.v3.OnestoreEntity.Path;
import com.google.storage.onestore.v3.OnestoreEntity.Reference;
import com.google.storage.onestore.v3.OnestoreEntity.Path.Element;

import java.util.List;

/**
 * {@code KeyTranslator} contains the logic to translate a {@link Key}
 * into the protocol buffers that are used to pass it to the
 * implementation of the API.
 *
 */
class KeyTranslator {

  public static Key createFromPb(Reference reference) {
    Key parentKey = null;
    Path path = reference.getPath();
    List<Element> elements = path.elements();
    if (elements.isEmpty()) {
      throw new IllegalArgumentException("Invalid Key PB: no elements.");
    }

    AppIdNamespace appIdNamespace = new AppIdNamespace(reference.getApp(),
        reference.hasNameSpace() ? reference.getNameSpace() : "");

    for (Element e : elements) {
      String kind = e.getType();
      if (e.hasName() && e.hasId()) {
        throw new IllegalArgumentException("Invalid Key PB: both id and name are set.");
      } else if (e.hasName()) {
        parentKey = new Key(kind, parentKey, Key.NOT_ASSIGNED, e.getName(), appIdNamespace);
      } else if (e.hasId()) {
        parentKey = new Key(kind, parentKey, e.getId(), null, appIdNamespace);
      } else {
        parentKey = new Key(kind, parentKey, Key.NOT_ASSIGNED, null, appIdNamespace);
      }
    }

    return parentKey;
  }

  public static Reference convertToPb(Key key) {
    Reference reference = new Reference();

    reference.setApp(key.getAppIdNamespace().getAppId());
    String nameSpace = key.getAppIdNamespace().getNamespace();
    if (nameSpace.length() != 0) {
      reference.setNameSpace(nameSpace);
    }

    Path path = reference.getMutablePath();
    while (key != null) {
      Element pathElement = new Element();
      pathElement.setType(key.getKind());
      if (key.getName() != null) {
        pathElement.setName(key.getName());
      } else if (key.getId() != Key.NOT_ASSIGNED) {
        pathElement.setId(key.getId());
      }
      path.insertElement(0, pathElement);
      key = key.getParent();
    }
    return reference;
  }

  public static void updateKey(Reference reference, Key key) {

    if (key.getName() == null) {
      Path path = reference.getPath();
      key.setId(path.getElement(path.elementSize() - 1).getId());
    }
  }

  KeyTranslator() { }
}
