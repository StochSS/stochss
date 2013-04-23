package com.google.appengine.api.search.checkers;

import static com.google.appengine.api.search.checkers.DocumentChecker.mandatoryCheckValid;

import com.google.apphosting.api.AppEngineInternal;
import com.google.apphosting.api.search.DocumentPb;
import com.google.common.base.Strings;

/**
 * This class performs {@link DocumentPb.Document} validity checks for search customers that only
 * use the query API.
 */
@AppEngineInternal
public class QueryOnlyCustomerDocumentChecker {

  /**
   * Checks whether a {@link DocumentPb.Document} has a valid set of fields for clients that only
   * use the search query API.
   *
   * @param pb the {@link DocumentPb.Document} protocol buffer to check.
   * @throws IllegalArgumentException if the document is invalid.
   */
  public static void checkValid(DocumentPb.Document pb) {
    Preconditions.checkArgument(pb.hasId(), "Document id is not specified");
    Preconditions.checkArgument(!Strings.isNullOrEmpty(pb.getId()), "Document id is null or empty");
    mandatoryCheckValid(pb);
  }

}
