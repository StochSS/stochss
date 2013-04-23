// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.apphosting.api.AppEngineInternal;
import com.google.apphosting.api.search.DocumentPb;
import com.google.common.base.Strings;
import com.google.common.collect.Sets;

import java.util.Set;

/**
 * Checks values of a {@link com.google.appengine.api.search.Document}.
 *
 */
@AppEngineInternal
public final class DocumentChecker {

  private static final long MILLIS_UP_TO_1ST_JAN_2011 = 1293840000000L;

  /**
   * Checks whether a document id is valid. A document id is a
   * non-null ASCII visible printable string of
   * {@literal #MAXIMUM_DOCUMENT_ID_LENGTH} characters which does not start
   * with '!' which is reserved for system documents.
   *
   * @param documentId the document id to check
   * @return the checked document id
   * @throws IllegalArgumentException if the document id is invalid
   */
  public static String checkDocumentId(String documentId) {
    Preconditions.checkArgument(!Strings.isNullOrEmpty(documentId), "Document id is null or empty");
    Preconditions.checkArgument(
        documentId.length() <= SearchApiLimits.MAXIMUM_DOCUMENT_ID_LENGTH,
        "Document id is longer than %d: %s",
        SearchApiLimits.MAXIMUM_DOCUMENT_ID_LENGTH, documentId);
    Preconditions.checkArgument(IndexChecker.isAsciiVisiblePrintable(documentId),
        "Document id must be ASCII visible printable: %s", documentId);
    Preconditions.checkArgument(!IndexChecker.isReserved(documentId),
        "Document id must not start with !: %s", documentId);
    return documentId;
  }

  /**
   * Checks whether a document's field set is valid.
   * A field set is valid if it does not contain any number or date fields with the same name.
   *
   * @param document the document to check
   * @throws IllegalArgumentException if the document contains an invalid set of fields.
   */
  public static void checkFieldSet(DocumentPb.Document document) {
    Set<String> noRepeatNames = Sets.newHashSet();
    for (DocumentPb.Field field : document.getFieldList()) {
      if (field.getValue().getType() == DocumentPb.FieldValue.ContentType.NUMBER ||
          field.getValue().getType() == DocumentPb.FieldValue.ContentType.DATE) {
        if (noRepeatNames.contains(field.getName())) {
          throw new IllegalArgumentException(
              "Invalid document " + document.getId() + ": field " + field.getName() +
              "with type date or number may not be repeated.");
        }
        noRepeatNames.add(field.getName());
      }
    }
  }

  /**
   * Checks whether a {@link DocumentPb.Document} has a valid set
   * of fields.
   *
   * @param pb the {@link DocumentPb.Document} protocol buffer to check
   * @return the checked document
   * @throws IllegalArgumentException if some field is invalid such as
   * document id or fields
   */
  public static DocumentPb.Document checkValid(DocumentPb.Document pb) {
    Preconditions.checkArgument(pb.getSerializedSize() <= SearchApiLimits.MAXIMUM_DOCUMENT_LENGTH,
                                "Document length %d is greater than the maximum %d bytes",
                                pb.getSerializedSize(), SearchApiLimits.MAXIMUM_DOCUMENT_LENGTH);
    if (pb.hasId()) {
      checkDocumentId(pb.getId());
    }
    mandatoryCheckValid(pb);
    return pb;
  }

  /**
   * Does only the {@link DocumentPb.Document} validity checks that must be satisfied for all
   * customer types that use the search API.
   *
   * @param pb the {@link DocumentPb.Document} protocol buffer to check
   * @throws IllegalArgumentException if the document is invalid.
   */
  static void mandatoryCheckValid(DocumentPb.Document pb) {
    Preconditions.checkArgument(pb.getFieldList() != null,
        "Null list of fields in document for indexing");
    checkFieldSet(pb);
  }

  /**
   * @return the number of seconds since 2011/1/1
   */
  public static int getNumberOfSecondsSince() {
    long millisSince = Math.max(0L,
        (System.currentTimeMillis() - MILLIS_UP_TO_1ST_JAN_2011) / 1000L);
    Preconditions.checkArgument(millisSince <= Integer.MAX_VALUE,
        "API failure due to date conversion overflow");
    return (int) millisSince;
  }
}
