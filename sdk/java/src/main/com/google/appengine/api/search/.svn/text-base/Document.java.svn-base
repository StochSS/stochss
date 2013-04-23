// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.checkers.DocumentChecker;
import com.google.appengine.api.search.checkers.FieldChecker;
import com.google.appengine.api.search.checkers.Preconditions;
import com.google.apphosting.api.search.DocumentPb;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Represents a user generated document. The following example shows how to
 * create a document consisting of a set of fields, some with plain text and
 * some in HTML.
 * <pre>
 *    Document document = Document.newBuilder().setId("document id")
 *       .setLocale(Locale.UK)
 *       .addField(Field.newBuilder()
 *           .setName("subject")
 *           .setText("going for dinner"))
 *       .addField(Field.newBuilder()
 *           .setName("body")
 *           .setHTML("&lt;html&gt;I found a restaurant.&lt;/html&gt;"))
 *       .addField(Field.newBuilder()
 *           .setName("signature")
 *           .setText("ten post jest przeznaczony dla odbiorcy")
 *           .setLocale(new Locale("pl")))
 *       .addField(Field.newBuilder()
 *           .setName("tag")
 *           .setText("food"))
 *       .addField(Field.newBuilder()
 *           .setName("tag")
 *           .setText("friend"))
 *       .build();
 * </pre>
 *
 * The following example shows how to access the fields within a document:
 * <pre>
 *    Document document = ...
 *
 *    for (Field field : document.getFields()) {
 *      switch (field.getType()) {
 *        case TEXT: use(field.getText()); break;
 *        case HTML: use(field.getHtml()); break;
 *        case ATOM: use(field.getAtom()); break;
 *        case DATE: use(field.getDate()); break;
 *      }
 *    }
 * </pre>
 *
 */
public class Document implements Serializable {

  static final int MAX_FIELDS_TO_STRING = 10;

  /**
   * A builder of documents. This is not thread-safe.
   */
  public static class Builder {
    private final Map<String, List<Field>> fieldMap = new HashMap<String, List<Field>>();
    private final List<Field> fields = new ArrayList<Field>();

    private final Set<String> noRepeatFields = new HashSet<String>();
 private String documentId; private Locale locale; private Integer rank;

    /**
     * Constructs a builder for a document.
     */
    protected Builder() {
    }

    /**
     * Set the document id to a unique valid value. A valid document id must
     * be a printable ASCII string of between 1 and
     * {@literal DocumentChecker#MAXIMUM_DOCUMENT_ID_LENGTH} characters, and
     * also not start with '!' which is reserved. If no document id is
     * provided, then the search service will provide one when the document
     * is indexed.
     *
     * @param documentId the unique id for the document to be built
     * @return this builder
     * @throws IllegalArgumentException if documentId is not valid
     */
    public Builder setId(String documentId) {
      if (documentId != null) {
        this.documentId = DocumentChecker.checkDocumentId(documentId);
      }
      return this;
    }

    /**
     * Adds the field builder to the document builder. Allows multiple
     * fields with the same name.
     *
     * @param builder the builder of the field to add
     * @return this document builder
     */
    public Builder addField(Field.Builder builder) {
      Preconditions.checkNotNull(builder, "field builder cannot be null");
      return addField(builder.build());
    }

    /**
     * Adds the field to the builder. Allows multiple
     * fields with the same name.
     *
     * @param field the field to add
     * @return this builder
     * @throws IllegalArgumentException if the field is invalid
     */
    public Builder addField(Field field) {
      Preconditions.checkNotNull(field, "field cannot be null");
      if (field.getType() == Field.FieldType.DATE || field.getType() == Field.FieldType.NUMBER) {
        Preconditions.checkArgument(!noRepeatFields.contains(field.getName()),
                                    "Number and date fields cannot be repeated.");
        noRepeatFields.add(field.getName());
      }

      fields.add(field);
      List<Field> fieldsForName = fieldMap.get(field.getName());
      if (fieldsForName == null) {
        fieldsForName = new ArrayList<Field>();
        fieldMap.put(field.getName(), fieldsForName);
      }
      fieldsForName.add(field);
      return this;
    }

    /**
     * Sets the {@link Locale} the document is written in.
     *
     * @param locale the {@link Locale} the document is written in
     * @return this document builder
     */
    public Builder setLocale(Locale locale) {
      this.locale = locale;
      return this;
    }

    /**
     * Sets the rank of this document, which determines the order of documents
     * returned by search, if no sorting or scoring is given. If it is not
     * specified, then the number of seconds since 2011/1/1 will be used.
     *
     * @param rank the rank of this document
     * @return this builder
     */
    public Builder setRank(int rank) {
      this.rank = rank;
      return this;
    }

    /**
     * Builds a valid document. The builder must have set a valid document
     * id, and have a non-empty set of valid fields.
     *
     * @return the document built by this builder
     * @throws IllegalArgumentException if the document built is not valid
     */
    public Document build() {
      return new Document(this);
    }
  }

  private static final long serialVersionUID = 309382038422977263L;

  private final String documentId;
  private final Map<String, List<Field>> fieldMap;
  private final List<Field> fields;

  private final int rank;

  private final Locale locale;

  /**
   * Constructs a document with the given builder.
   *
   * @param builder the builder capable of building a document
   */
  protected Document(Builder builder) {
    documentId = builder.documentId;
    fieldMap = new HashMap<String, List<Field>>(builder.fieldMap);
    fields = Collections.unmodifiableList(builder.fields);
    locale = builder.locale;
    rank = Util.defaultIfNull(builder.rank, DocumentChecker.getNumberOfSecondsSince());
    checkValid();
  }

  /**
   * @return an iterable of {@link Field} in the document
   */
  public Iterable<Field> getFields() {
    return fields;
  }

  /**
   * @return an unmodifiable {@link Set} of the field names in the document
   */
  public Set<String> getFieldNames() {
    return Collections.unmodifiableSet(fieldMap.keySet());
  }

  /**
   * Get an iterable of all fields with the given name.
   *
   * @param name the name of the field name whose values are to be returned
   * @return an unmodifiable {@link Iterable} of {@link Field} with the given name
   * or {@code null}
   */
  public Iterable<Field> getFields(String name) {
    List<Field> fieldsForName = fieldMap.get(name);
    if (fieldsForName == null) {
      return null;
    }
    return Collections.unmodifiableList(fieldsForName);
  }

  /**
   * Returns the single field with the given name.
   *
   * @param name the name of the field to return
   * @return the single field with name
   * @throws IllegalArgumentException if the document does not have exactly
   * one field with the name
   */
  public Field getOnlyField(String name) {
    List<Field> fieldsForName = fieldMap.get(name);
    Preconditions.checkArgument(
        fieldsForName != null && fieldsForName.size() == 1,
        "Field %s is present %d times; expected 1",
        name, (fieldsForName == null? 0 : fieldsForName.size()));
    return fieldsForName.get(0);
  }

  /**
   * Returns the number of times a field with the given name is present
   * in this document.
   *
   * @param name the name of the field to be counted
   * @return the number of times a field with the given name is present
   */
  public int getFieldCount(String name) {
    List<Field> fieldsForName = fieldMap.get(name);
    return fieldsForName == null ? 0 : fieldsForName.size();
  }

  /**
   * @return the id of the document
   */
  public String getId() {
    return documentId;
  }

  /**
   * @return the {@link Locale} the document is written in. Can be null
   */
  public Locale getLocale() {
    return locale;
  }

  /**
   * Returns the rank of this document. A document's rank is used to
   * determine the default order in which documents are returned by
   * search, if no sorting or scoring is specified.
   *
   * @return the rank of this document
   */
  public int getRank() {
    return rank;
  }

  @Override
  public int hashCode() {
    return documentId.hashCode();
  }

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof Document)) {
      return false;
    }
    Document doc = (Document) object;
    return documentId.equals(doc.getId());
  }

  /**
   * Checks whether the document is valid. A document is valid if
   * it has a valid document id, a locale, a non-empty collection of
   * valid fields.
   *
   * @return this document
   * @throws IllegalArgumentException if the document has an invalid
   * document id, has no fields, or some field is invalid
   */
  private Document checkValid() {
    if (documentId != null) {
      DocumentChecker.checkDocumentId(documentId);
    }
    Preconditions.checkArgument(fieldMap != null,
        "Null map of fields in document for indexing");
    Preconditions.checkArgument(fields != null,
        "Null list of fields in document for indexing");
    return this;
  }

  /**
   * Creates a new document builder. You must use this method to obtain a new
   * builder. The returned builder must be used to specify all properties of
   * the document. To obtain the document call the {@link Builder#build()}
   * method on the returned builder.
   *
   * @return a builder which constructs a document object
   */
  public static Builder newBuilder() {
    return new Builder();
  }

  /**
   * Creates a new document builder from the given document. All document
   * properties are copied to the returned builder.
   *
   * @param document the document protocol buffer to build a document object
   * from
   * @return the document builder initialized from a document protocol buffer
   * @throws SearchException if a field value is invalid
   */
  static Builder newBuilder(DocumentPb.Document document) {
    Document.Builder docBuilder = Document.newBuilder().setId(document.getId());
    if (document.hasLanguage()) {
      docBuilder.setLocale(FieldChecker.parseLocale(document.getLanguage()));
    }
    for (DocumentPb.Field field : document.getFieldList()) {
      docBuilder.addField(Field.newBuilder(field));
    }
    if (document.hasOrderId()) {
      docBuilder.setRank(document.getOrderId());
    }
    return docBuilder;
  }

  /**
   * Copies a {@link Document} object into a {@link DocumentPb.Document}
   * protocol buffer.
   *
   * @return the document protocol buffer copy of the document object
   * @throws IllegalArgumentException if any parts of the document are invalid
   * or the document protocol buffer is too large
   */
  DocumentPb.Document copyToProtocolBuffer() {
    DocumentPb.Document.Builder docBuilder = DocumentPb.Document.newBuilder();
    if (documentId != null) {
      docBuilder.setId(documentId);
    }
    if (locale != null) {
      docBuilder.setLanguage(locale.toString());
    }
    for (Field field : fields) {
      docBuilder.addField(field.copyToProtocolBuffer());
    }
    docBuilder.setOrderId(rank);
    return DocumentChecker.checkValid(docBuilder.build());
  }

  @Override
  public String toString() {
    return String.format("Document(documentId=%s, fields=%s%s, rank=%d)",
        documentId,
        Util.iterableToString(fields, MAX_FIELDS_TO_STRING),
        Util.fieldToString("locale", locale), rank);
  }

  boolean isIdenticalTo(Document other) {
    if (documentId == null) {
      if (other.documentId != null) {
        return false;
      }
    } else {
      if (!documentId.equals(other.documentId)) {
        return false;
      }
    }
    if (fields == null) {
      if (other.fields != null) {
        return false;
      }
    } else {
      if (!fields.equals(other.fields)) {
        return false;
      }
    }
    if (locale == null) {
      if (other.locale != null) {
        return false;
      }
    } else {
      if (!locale.equals(other.locale)) {
        return false;
      }
    }
    return rank == other.rank;
  }
}
