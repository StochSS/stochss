// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import static com.google.appengine.api.search.FutureHelper.quietGet;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.checkers.Preconditions;
import com.google.appengine.api.utils.FutureWrapper;

import java.util.ArrayList;
import java.util.concurrent.Future;

/**
 * A concrete implementation of {@link SearchService}.
 *
 */
class SearchServiceImpl implements SearchService {

  private final SearchApiHelper apiHelper;
  private final String namespace;

  /** Only our classes may create instances of this class. */
  SearchServiceImpl(SearchApiHelper apiHelper, String namespace) {
    this.apiHelper = apiHelper;
    this.namespace = getAppNamespace(namespace);
  }

  @Override
  public GetResponse<Index> getIndexes(GetIndexesRequest request) {
    return quietGet(getIndexesAsync(request));
  }

  @Override
  public GetResponse<Index> getIndexes(GetIndexesRequest.Builder builder) {
    return getIndexes(builder.build());
  }

  @Override
  public Future<GetResponse<Index>> getIndexesAsync(GetIndexesRequest.Builder builder) {
    return getIndexesAsync(builder.build());
  }

  @Override
  public Future<GetResponse<Index>> getIndexesAsync(GetIndexesRequest request) {
    SearchServicePb.ListIndexesParams.Builder paramsBuilder = request
        .copyToProtocolBuffer().setNamespace(namespace);
    SearchServicePb.ListIndexesRequest pbRequest = SearchServicePb.ListIndexesRequest.newBuilder()
        .setParams(paramsBuilder)
        .build();
    SearchServicePb.ListIndexesResponse.Builder responseBuilder =
        SearchServicePb.ListIndexesResponse.newBuilder();
    Future<SearchServicePb.ListIndexesResponse.Builder> future =
        apiHelper.makeAsyncCall("ListIndexes", pbRequest, responseBuilder);
    return new FutureWrapper<SearchServicePb.ListIndexesResponse.Builder,
           GetResponse<Index>>(future) {
      @Override
      protected Throwable convertException(Throwable cause) {
        OperationResult result = OperationResult.convertToOperationResult(cause);
        return (result == null) ? cause : new GetException(result);
      }

      @Override
      protected GetResponse<Index> wrap(
          SearchServicePb.ListIndexesResponse.Builder key) throws Exception {
        SearchServicePb.ListIndexesResponse response = key.build();
        OperationResult operationResult = new OperationResult(response.getStatus());
        if (operationResult.getCode() != StatusCode.OK) {
          throw new GetException(operationResult);
        }
        ArrayList<Index> indexes = new ArrayList<Index>(response.getIndexMetadataCount());
        for (SearchServicePb.IndexMetadata metadata : response.getIndexMetadataList()) {
          SearchServicePb.IndexSpec indexSpec = metadata.getIndexSpec();
          IndexSpec.Builder builder = IndexSpec.newBuilder().setName(indexSpec.getName());
          if (indexSpec.hasNamespace()) {
            Preconditions.checkArgument(indexSpec.getNamespace().equals(namespace),
                String.format("Index with incorrect namespace received '%s' != '%s'",
                    indexSpec.getNamespace(), namespace));
          } else if (!namespace.isEmpty()) {
            Preconditions.checkArgument(indexSpec.getNamespace().equals(namespace),
                String.format("Index with incorrect namespace received '' != '%s'", namespace));
          }
          indexes.add(new IndexImpl(
              apiHelper, indexSpec.getNamespace(), builder.build(), Schema.createSchema(metadata)));
        }
        return new GetResponse<Index>(indexes);
      }
    };
  }

  @Override
  public Index getIndex(IndexSpec.Builder builder) {
    return getIndex(builder.build());
  }

  @Override
  public Index getIndex(IndexSpec indexSpec) {
    return new IndexImpl(apiHelper, namespace, indexSpec);
  }

  @Override
  public String getNamespace() {
    return namespace;
  }

  /**
   * Returns a namespace, preferring one passed via {@code namespaceGiven}
   * parameter. If {@code null} is passed, it attempts to use namespace set
   * in the {@link NamespaceManager}. If that one is not set, it returns
   * an empty namespace.
   *
   * @param namespaceGiven the externally provided namespace
   * @return a namespace which will not be null
   */
  private static String getAppNamespace(String namespaceGiven) {
    if (namespaceGiven != null) {
      return namespaceGiven;
    }
    String currentNamespace = NamespaceManager.get();
    return (currentNamespace == null) ? "" : currentNamespace;
  }
}
