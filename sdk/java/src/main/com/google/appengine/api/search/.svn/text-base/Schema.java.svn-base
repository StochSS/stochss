// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.checkers.FieldChecker;
import com.google.apphosting.api.search.DocumentPb;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Contains information about the kinds of document {@link Field Fields}
 * which are supported by the {@link Index}.
 * <p>
 * <pre>
 *   // Get the searchService for the default namespace
 *   SearchService searchService = SearchServiceFactory.getSearchService();
 *
 *   // Get the first page of indexes available and retrieve schemas
 *   GetResponse<Index> response = searchService.getIndexes(
 *       GetIndexesRequest.newBuilder().setSchemaFetched(true).build());
 *
 *   // List out elements of Schema
 *   for (Index index : response) {
 *     Schema schema = index.getSchema();
 *     for (String fieldName : schema.getFieldNames()) {
 *        List<FieldType> typesForField = schema.getFieldTypes(fieldName);
 *     }
 *   }
 * </pre>
 *
 */
public final class Schema {

  /**
   * A builder which constructs Schema objects.
   */
  public static final class Builder {
    private final Map<String, List<Field.FieldType>> fieldMap =
        new HashMap<String, List<Field.FieldType>>();

    /**
     * Constructs a builder for a schema.
     */
    protected Builder() {
    }

    /**
     * Adds typed field name to the schema builder. Allows multiple
     * field types with the same name.
     *
     * @param fieldName the field name to add to the schema
     * @return this document builder
     */
    public Builder addTypedField(String fieldName, Field.FieldType fieldType) {
      FieldChecker.checkFieldName(fieldName);
      List<Field.FieldType> types = fieldMap.get(fieldName);
      if (types == null) {
        types = new ArrayList<Field.FieldType>();
        fieldMap.put(fieldName, types);
      }
      types.add(fieldType);
      return this;
    }

    /**
     * Builds a valid document. The builder must have set a valid document
     * id, and have a non-empty set of valid fields.
     *
     * @return the schema built by this builder
     * @throws IllegalArgumentException if the document built is not valid
     */
    public Schema build() {
      return new Schema(this);
    }
  }

  private final Map<String, List<Field.FieldType>> fieldMap;

  /**
   * Creates a {@link Schema} from a {@link Builder}.
   *
   * @param builder the builder
   */
  private Schema(Builder builder) {
    this.fieldMap = Collections.unmodifiableMap(builder.fieldMap);
  }

  /**
   * @return the set of field names supported in the schema
   */
  public Set<String> getFieldNames() {
    return fieldMap.keySet();
  }

  /**
   * @param fieldName the name of the field to return supported types
   * @return a list of {@link Field.FieldType} supported for the given field
   * name
   */
  public List<Field.FieldType> getFieldTypes(String fieldName) {
    return Collections.unmodifiableList(fieldMap.get(fieldName));
  }

  @Override
  public String toString() {
    return String.format("Schema{fieldMap: %s}", fieldMap);
  }

  /**
   * Maps between DocumentPb.FieldValue.ContentType enums and the public
   * Field.FieldType.
   */
  static Field.FieldType mapPBFieldTypeToPublic(DocumentPb.FieldValue.ContentType type) {
    switch (type) {
      case TEXT:
        return Field.FieldType.TEXT;
      case HTML:
        return Field.FieldType.HTML;
      case ATOM:
        return Field.FieldType.ATOM;
      case DATE:
        return Field.FieldType.DATE;
      case NUMBER:
        return Field.FieldType.NUMBER;
      case GEO:
        return Field.FieldType.GEO_POINT;
      default:
        throw new IllegalArgumentException("Unsupported field type " + type);
    }
  }

  /**
   * Maps between public Field.Field enums and the protocol buffer
   * TypeDocumentPb.FieldValue.ContentType enums.
   */
  static DocumentPb.FieldValue.ContentType mapPublicFieldTypeToPB(Field.FieldType type) {
    switch (type) {
      case TEXT:
        return DocumentPb.FieldValue.ContentType.TEXT;
      case HTML:
        return DocumentPb.FieldValue.ContentType.HTML;
      case ATOM:
        return DocumentPb.FieldValue.ContentType.ATOM;
      case DATE:
        return DocumentPb.FieldValue.ContentType.DATE;
      case NUMBER:
        return DocumentPb.FieldValue.ContentType.NUMBER;
      case GEO_POINT:
        return DocumentPb.FieldValue.ContentType.GEO;
      default:
        throw new IllegalArgumentException("Unsupported field type " + type);
    }
  }

  /**
   * Creates a {@link Schema} from a {@link SearchServicePb.IndexMetadata}.
   *
   * @param metadata the proto buffer containing supported field names
   * and types.
   * @return a {@link Schema} containing supported field names and field
   * types for those names
   */
  static Schema createSchema(SearchServicePb.IndexMetadata metadata) {
    if (metadata.getFieldCount() == 0) {
      return null;
    }
    Map<String, List<Field.FieldType>> fieldMap = new HashMap<String, List<Field.FieldType>>();
    Builder builder = newBuilder();
    for (DocumentPb.FieldTypes fieldTypes : metadata.getFieldList()) {
      String fieldName = fieldTypes.getName();
      for (DocumentPb.FieldValue.ContentType type : fieldTypes.getTypeList()) {
        builder.addTypedField(fieldName, mapPBFieldTypeToPublic(type));
      }
    }
    return builder.build();
  }

  @Override
  public int hashCode() {
    return fieldMap.hashCode();
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (getClass() != obj.getClass()) {
      return false;
    }
    return fieldMap.equals(((Schema) obj).fieldMap);
  }

  /**
   * Creates a schema builder.
   *
   * @return a new builder for creating a schema
   */
  public static Builder newBuilder() {
    return new Builder();
  }
}
