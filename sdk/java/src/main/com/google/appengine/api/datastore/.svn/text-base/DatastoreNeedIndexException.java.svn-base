// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

/**
 * {@code DatastoreNeedIndexException} is thrown when no matching index was
 * found for a query requiring an index.  Check the Indexes page in the Admin
 * Console and your datastore-indexes.xml file.
 *
 */
public class DatastoreNeedIndexException extends RuntimeException {

  static final long serialVersionUID = 9218197931741583584L;

  static final String NO_XML_MESSAGE = "\nAn index is missing but we are unable to tell you which "
      + "one due to a bug in the App Engine SDK.  If your query only contains equality filters you "
      + "most likely need a composite index on all the properties referenced in those filters.";

  String xml;

  public DatastoreNeedIndexException(String message) {
    super(message);
  }

  @Override
  public String getMessage() {
    return super.getMessage() + (xml == null ? NO_XML_MESSAGE :
        "\nThe suggested index for this query is:\n" + xml);
  }

  /**
   * @return The xml defining the missing index.  Can be {@code null}.
   */
  public String getMissingIndexDefinitionXml() {
    return xml;
  }

  void setMissingIndexDefinitionXml(String xml) {
    this.xml = xml;
  }
}
