// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.prospectivesearch;

import com.google.appengine.api.prospectivesearch.ProspectiveSearchPb.SchemaEntry;

/**
 * Type identifiers for describing document schemas.
 *
 */
public enum FieldType {
  BOOLEAN(SchemaEntry.Type.BOOLEAN),
  DOUBLE(SchemaEntry.Type.DOUBLE),
  INT32(SchemaEntry.Type.INT32),
  STRING(SchemaEntry.Type.STRING),
  TEXT(SchemaEntry.Type.STRING);

  final SchemaEntry.Type internalType;

  FieldType(SchemaEntry.Type t) {
    internalType = t;
  }
}
