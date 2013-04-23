// Copyright 2010 Google Inc. All Rights Reserved.
package com.google.appengine.api.search;

import static com.google.appengine.api.search.FutureHelper.quietGet;

import com.google.appengine.api.search.SearchServicePb.SearchServiceError.ErrorCode;
import com.google.appengine.api.search.checkers.DocumentChecker;
import com.google.appengine.api.search.checkers.Preconditions;
import com.google.appengine.api.search.checkers.SearchApiLimits;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.search.DocumentPb;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

/**
 * The default implementation of {@link Index}. This class uses a
 * {@link SearchApiHelper} to forward all requests to an appserver.
 *
 */
class IndexImpl implements Index {

  private final SearchApiHelper apiHelper;
  private final IndexSpec spec;
  private final String namespace;
  private final Schema schema;

  /**
   * Creates new index specification.
   *
   * @param apiHelper the helper used to forward all calls
   * @param indexSpec the index specification
   */
  IndexImpl(SearchApiHelper apiHelper, String namespace, IndexSpec indexSpec) {
    this(apiHelper, namespace, indexSpec, null);
  }

  /**
   * Creates new index specification.
   *
   * @param apiHelper the helper used to forward all calls
   * @param indexSpec the index specification
   * @param schema the {@link Schema} defining the names and types of fields
   * supported
   */
  IndexImpl(SearchApiHelper apiHelper, String namespace, IndexSpec indexSpec, Schema schema) {
    this.apiHelper = Preconditions.checkNotNull(apiHelper, "Internal error");
    this.namespace = Preconditions.checkNotNull(namespace, "Internal error");
    this.spec = Preconditions.checkNotNull(indexSpec, "Internal error");
    this.schema = schema;
  }

  @Override
  public String getName() {
    return spec.getName();
  }

  @Override
  public String getNamespace() {
    return namespace;
  }

  @Override
  public Schema getSchema() {
    return schema;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + spec.hashCode();
    result = prime * result + ((schema == null) ? 0 : schema.hashCode());
    return result;
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
    IndexImpl other = (IndexImpl) obj;
    return Util.equalObjects(spec, other.spec) &&
        Util.equalObjects(schema, other.schema);
  }

  @Override
  public String toString() {
    return String.format("IndexImpl{namespace: %s, %s, %s}", namespace, spec,
                         (schema == null ? "(null schema)" : schema));
  }

  @Override
  public Future<Void> deleteSchemaAsync() {
    SearchServicePb.DeleteSchemaParams.Builder builder =
        SearchServicePb.DeleteSchemaParams.newBuilder().addIndexSpec(
            spec.copyToProtocolBuffer(namespace));
    SearchServicePb.DeleteSchemaRequest request =
        SearchServicePb.DeleteSchemaRequest.newBuilder().setParams(builder).build();
    SearchServicePb.DeleteSchemaResponse.Builder responseBuilder =
        SearchServicePb.DeleteSchemaResponse.newBuilder();

    Future<SearchServicePb.DeleteSchemaResponse.Builder> future =
        apiHelper.makeAsyncCall("DeleteSchema", request, responseBuilder);
    return new FutureWrapper<SearchServicePb.DeleteSchemaResponse.Builder,
           Void>(future) {
      @Override
      protected Throwable convertException(Throwable cause) {
        OperationResult result = OperationResult.convertToOperationResult(cause);
        return (result == null) ? cause : new DeleteException(result);
      }

      @Override
      protected Void wrap(SearchServicePb.DeleteSchemaResponse.Builder key)
          throws Exception {
        SearchServicePb.DeleteSchemaResponse response = key.build();
        ArrayList<OperationResult> results = new ArrayList<OperationResult>(
            response.getStatusCount());
        for (SearchServicePb.RequestStatus status : response.getStatusList()) {
          results.add(new OperationResult(status));
        }
        if (response.getStatusList().size() != 1) {
          throw new DeleteException(
              new OperationResult(
                  StatusCode.INTERNAL_ERROR,
                  String.format("Expected 1 removed schema, but got %d",
                                response.getStatusList().size())),
              results);
        }
        for (OperationResult result : results) {
          if (result.getCode() != StatusCode.OK) {
            throw new DeleteException(result, results);
          }
        }
        return null;
      }
    };
  }

  @Override
  public Future<Void> deleteAsync(String... documentIds) {
    return deleteAsync(Arrays.asList(documentIds));
  }

  @Override
  public Future<Void> deleteAsync(final Iterable<String> documentIds) {
    Preconditions.checkArgument(documentIds != null,
        "Delete documents given null collection of document ids");
    SearchServicePb.DeleteDocumentParams.Builder builder =
        SearchServicePb.DeleteDocumentParams.newBuilder().setIndexSpec(
            spec.copyToProtocolBuffer(namespace));
    int size = 0;
    for (String documentId : documentIds) {
      size++;
      builder.addDocId(DocumentChecker.checkDocumentId(documentId));
    }
    if (size > SearchApiLimits.PUT_MAXIMUM_DOCS_PER_REQUEST) {
      throw new IllegalArgumentException(
          String.format("number of doc ids, %s, exceeds maximum %s", size,
                        SearchApiLimits.PUT_MAXIMUM_DOCS_PER_REQUEST));
    }
    final int documentIdsSize = size;
    SearchServicePb.DeleteDocumentRequest request =
        SearchServicePb.DeleteDocumentRequest.newBuilder().setParams(builder).build();
    SearchServicePb.DeleteDocumentResponse.Builder responseBuilder =
        SearchServicePb.DeleteDocumentResponse.newBuilder();

    Future<SearchServicePb.DeleteDocumentResponse.Builder> future =
        apiHelper.makeAsyncCall("DeleteDocument", request, responseBuilder);
    return new FutureWrapper<SearchServicePb.DeleteDocumentResponse.Builder,
           Void>(future) {
      @Override
      protected Throwable convertException(Throwable cause) {
        OperationResult result = OperationResult.convertToOperationResult(cause);
        return (result == null) ? cause : new DeleteException(result);
      }

      @Override
      protected Void wrap(SearchServicePb.DeleteDocumentResponse.Builder key)
          throws Exception {
        SearchServicePb.DeleteDocumentResponse response = key.build();
        ArrayList<OperationResult> results = new ArrayList<OperationResult>(
            response.getStatusCount());
        for (SearchServicePb.RequestStatus status : response.getStatusList()) {
          results.add(new OperationResult(status));
        }
        if (documentIdsSize != response.getStatusList().size()) {
          throw new DeleteException(
              new OperationResult(
                  StatusCode.INTERNAL_ERROR,
                  String.format("Expected %d removed documents, but got %d", documentIdsSize,
                                response.getStatusList().size())),
              results);
        }
        for (OperationResult result : results) {
          if (result.getCode() != StatusCode.OK) {
            throw new DeleteException(result, results);
          }
        }
        return null;
      }
    };
  }

  @Override
  public Future<PutResponse> putAsync(Document... documents) {
    return putAsync(Arrays.asList(documents));
  }

  @Override
  public Future<PutResponse> putAsync(Document.Builder... builders) {
    List<Document> documents = new ArrayList<Document>();
    for (int i = 0; i < builders.length; i++) {
      documents.add(builders[i].build());
    }
    return putAsync(documents);
  }

  @Override
  public Future<PutResponse> putAsync(final Iterable<Document> documents) {
    Preconditions.checkNotNull(documents, "document list cannot be null");
    if (!documents.iterator().hasNext()) {
      return new FutureHelper.FakeFuture<PutResponse>(
          new PutResponse(Collections.<OperationResult>emptyList(),
                                     Collections.<String>emptyList()));
    }
    SearchServicePb.IndexDocumentParams.Builder builder =
        SearchServicePb.IndexDocumentParams.newBuilder()
            .setIndexSpec(spec.copyToProtocolBuffer(namespace));
    Map<String, Document> docMap = new HashMap<String, Document>();
    int size = 0;
    for (Document document : documents) {
      Document other = null;
      if (document.getId() != null) {
        other = docMap.put(document.getId(), document);
      }
      if (other != null) {
        if (!document.isIdenticalTo(other)) {
          throw new IllegalArgumentException(
              String.format(
                  "Put request with documents with the same ID \"%s\" but differnt content",
                  document.getId()));
        }
      }
      if (other == null) {
        size++;
        builder.addDocument(Preconditions.checkNotNull(document, "document cannot be null")
            .copyToProtocolBuffer());
      }
    }
    if (size > SearchApiLimits.PUT_MAXIMUM_DOCS_PER_REQUEST) {
      throw new IllegalArgumentException(
          String.format("number of documents, %s, exceeds maximum %s", size,
                        SearchApiLimits.PUT_MAXIMUM_DOCS_PER_REQUEST));
    }
    final int documentsSize = size;
    SearchServicePb.IndexDocumentRequest request =
        SearchServicePb.IndexDocumentRequest.newBuilder().setParams(builder).build();
    SearchServicePb.IndexDocumentResponse.Builder responseBuilder =
        SearchServicePb.IndexDocumentResponse.newBuilder();
    Future<SearchServicePb.IndexDocumentResponse.Builder> future =
        apiHelper.makeAsyncCall("IndexDocument", request, responseBuilder);
    return new FutureWrapper<SearchServicePb.IndexDocumentResponse.Builder,
           PutResponse>(future) {
      @Override
      protected Throwable convertException(Throwable cause) {
        OperationResult result = OperationResult.convertToOperationResult(cause);
        return (result == null) ? cause : new PutException(result);
      }

      @Override
      protected PutResponse wrap(SearchServicePb.IndexDocumentResponse.Builder key)
          throws Exception {
        SearchServicePb.IndexDocumentResponse response = key.build();
        List<OperationResult> results = newOperationResultList(response);
        if (documentsSize != response.getStatusList().size()) {
          throw new PutException(
              new OperationResult(
                  StatusCode.INTERNAL_ERROR,
                  String.format("Expected %d indexed documents, but got %d", documentsSize,
                      response.getStatusList().size())), results, response.getDocIdList());
        }
        for (OperationResult result : results) {
          if (result.getCode() != StatusCode.OK) {
            throw new PutException(result, results, response.getDocIdList());
          }
        }
        return new PutResponse(results, response.getDocIdList());
      }

      /**
       * Constructs a list of OperationResult from an index document response.
       *
       * @param response the index document response to extract operation
       * results from
       * @return a list of OperationResult
       */
      private List<OperationResult> newOperationResultList(
          SearchServicePb.IndexDocumentResponse response) {
        ArrayList<OperationResult> results = new ArrayList<OperationResult>(
            response.getStatusCount());
        for (SearchServicePb.RequestStatus status : response.getStatusList()) {
          results.add(new OperationResult(status));
        }
        return results;
      }
    };
  }

  private Future<Results<ScoredDocument>> executeSearchForResults(
      SearchServicePb.SearchParams.Builder params) {
    SearchServicePb.SearchResponse.Builder responseBuilder =
        SearchServicePb.SearchResponse.newBuilder();
    SearchServicePb.SearchRequest request = SearchServicePb.SearchRequest.newBuilder()
        .setParams(params).build();

    Future<SearchServicePb.SearchResponse.Builder> future =
        apiHelper.makeAsyncCall("Search", request, responseBuilder);
    return new FutureWrapper<SearchServicePb.SearchResponse.Builder,
           Results<ScoredDocument>>(future) {
      @Override
      protected Throwable convertException(Throwable cause) {
        OperationResult result = OperationResult.convertToOperationResult(cause);
        return (result == null) ? cause : new SearchException(result);
      }

      @Override
      protected Results<ScoredDocument> wrap(SearchServicePb.SearchResponse.Builder key)
      throws Exception {
        SearchServicePb.SearchResponse response = key.build();
        SearchServicePb.RequestStatus status = response.getStatus();
        if (status.getCode() != SearchServicePb.SearchServiceError.ErrorCode.OK) {
          throw new SearchException(new OperationResult(status));
        }
        List<ScoredDocument> scoredDocs = new ArrayList<ScoredDocument>();
        for (SearchServicePb.SearchResult result : response.getResultList()) {
          List<Field> expressions = new ArrayList<Field>();
          for (DocumentPb.Field expression : result.getExpressionList()) {
            expressions.add(Field.newBuilder(expression).build());
          }
          ScoredDocument.Builder scoredDocBuilder = ScoredDocument.newBuilder(result.getDocument());
          for (Double score : result.getScoreList()) {
            scoredDocBuilder.addScore(score);
          }
          for (Field expression : expressions) {
            scoredDocBuilder.addExpression(expression);
          }
          if (result.hasCursor()) {
            scoredDocBuilder.setCursor(
                Cursor.newBuilder().build("true:" + result.getCursor()));
          }
          scoredDocs.add(scoredDocBuilder.build());
        }
        Results<ScoredDocument> scoredResults = new Results<ScoredDocument>(
            new OperationResult(status),
            scoredDocs, response.getMatchedCount(), response.getResultCount(),
            (response.hasCursor() ?
                Cursor.newBuilder().build("false:" + response.getCursor()) : null));

        return scoredResults;
      }
    };
  }

  @Override
  public Future<Results<ScoredDocument>> searchAsync(String query) {
    return searchAsync(Query.newBuilder().build(
        Preconditions.checkNotNull(query, "query cannot be null")));
  }

  @Override
  public Future<Results<ScoredDocument>> searchAsync(Query query) {
    Preconditions.checkNotNull(query, "query cannot be null");
    return executeSearchForResults(
        query.copyToProtocolBuffer().setIndexSpec(spec.copyToProtocolBuffer(namespace)));
  }

  @Override
  public Future<GetResponse<Document>> getRangeAsync(GetRequest.Builder builder) {
    return getRangeAsync(builder.build());
  }

  @Override
  public Future<GetResponse<Document>> getRangeAsync(GetRequest request) {
    Preconditions.checkNotNull(request, "list documents request cannot be null");

    SearchServicePb.ListDocumentsParams.Builder params =
        request.copyToProtocolBuffer().setIndexSpec(spec.copyToProtocolBuffer(namespace));
    SearchServicePb.ListDocumentsResponse.Builder responseBuilder =
        SearchServicePb.ListDocumentsResponse.newBuilder();
    SearchServicePb.ListDocumentsRequest requestPb = SearchServicePb.ListDocumentsRequest
        .newBuilder().setParams(params).build();

    Future<SearchServicePb.ListDocumentsResponse.Builder> future =
        apiHelper.makeAsyncCall("ListDocuments", requestPb, responseBuilder);
    return new FutureWrapper<SearchServicePb.ListDocumentsResponse.Builder,
        GetResponse<Document>>(future) {
      @Override
      protected Throwable convertException(Throwable cause) {
        OperationResult result = OperationResult.convertToOperationResult(cause);
        return (result == null) ? cause : new GetException(result);
      }

      @Override
      protected GetResponse<Document> wrap(
          SearchServicePb.ListDocumentsResponse.Builder key) throws Exception {
        SearchServicePb.ListDocumentsResponse response = key.build();
        SearchServicePb.RequestStatus status = response.getStatus();

        if (status.getCode() != ErrorCode.OK) {
          throw new GetException(new OperationResult(status));
        }

        List<Document> results = new ArrayList<Document>();
        for (DocumentPb.Document document : response.getDocumentList()) {
          results.add(Document.newBuilder(document).build());
        }
        return new GetResponse<Document>(results);
      }
    };
  }

  @Override
  public Document get(String documentId) {
    Preconditions.checkNotNull(documentId, "documentId must not be null");
    GetResponse<Document> response =
        getRange(GetRequest.newBuilder().setStartId(documentId).setLimit(1));
    for (Document document : response) {
      if (documentId.equals(document.getId())) {
        return document;
      }
    }
    return null;
  }

  @Override
  public void deleteSchema() {
    quietGet(deleteSchemaAsync());
  }

  @Override
  public void delete(String... documentIds) {
    quietGet(deleteAsync(documentIds));
  }

  @Override
  public void delete(Iterable<String> documentIds) {
    quietGet(deleteAsync(documentIds));
  }

  @Override
  public PutResponse put(Document... documents) {
    return quietGet(putAsync(documents));
  }

  @Override
  public PutResponse put(Document.Builder... builders) {
    return quietGet(putAsync(builders));
  }

  @Override
  public PutResponse put(Iterable<Document> documents) {
    return quietGet(putAsync(documents));
  }

  @Override
  public Results<ScoredDocument> search(String query) {
    return quietGet(searchAsync(query));
  }

  @Override
  public Results<ScoredDocument> search(Query query) {
    return quietGet(searchAsync(query));
  }

  @Override
  public GetResponse<Document> getRange(GetRequest request) {
    return quietGet(getRangeAsync(request));
  }

  @Override
  public GetResponse<Document> getRange(GetRequest.Builder builder) {
    return getRange(builder.build());
  }
}
