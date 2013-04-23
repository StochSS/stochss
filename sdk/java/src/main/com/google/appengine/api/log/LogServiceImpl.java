// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.log;

import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.logservice.LogServicePb.LogReadRequest;
import com.google.apphosting.api.logservice.LogServicePb.LogReadResponse;
import com.google.apphosting.api.logservice.LogServicePb.LogServerVersion;
import com.google.apphosting.api.logservice.LogServicePb.LogServiceError;
import com.google.apphosting.api.logservice.LogServicePb.LogServiceError.ErrorCode;
import com.google.common.base.Pair;
import com.google.common.collect.Sets;

import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * {@code LogServiceImpl} is an implementation of {@link LogService}
 * that makes API calls to {@link ApiProxy}.
 *
 */
final class LogServiceImpl implements LogService {
  static final String PACKAGE = "logservice";
  static final String READ_RPC_NAME = "Read";

  @Override
  public LogQueryResult fetch(LogQuery query) {
    try {
      return fetchAsync(query).get();
    } catch (ExecutionException e) {
      if (e.getCause() instanceof LogServiceException) {
        throw (LogServiceException) e.getCause();
      } else if (e.getCause() instanceof InvalidRequestException) {
        throw (InvalidRequestException) e.getCause();
      } else {
        throw new LogServiceException(e.getMessage());
      }
    } catch (InterruptedException e) {
      throw new LogServiceException(e.getMessage());
    }
  }

  Future<LogQueryResult> fetchAsync(LogQuery query) {
    LogReadRequest request = new LogReadRequest();

    request.setAppId(ApiProxy.getCurrentEnvironment().getAppId());

    Long startTimeUs = query.getStartTimeUsec();
    if (startTimeUs != null) {
      request.setStartTime(startTimeUs);
    }

    Long endTimeUs = query.getEndTimeUsec();
    if (endTimeUs != null) {
      request.setEndTime(endTimeUs);
    }

    request.setCount(query.getBatchSize());

    if (query.getMinLogLevel() != null) {
      request.setMinimumLogLevel(query.getMinLogLevel().ordinal());
    }

    request.setIncludeIncomplete(query.getIncludeIncomplete());
    request.setIncludeAppLogs(query.getIncludeAppLogs());

    Set<Pair<String, String>> convertedServerVersions = Sets.newHashSet();

    if (query.getMajorVersionIds().isEmpty() && query.getServerVersions().isEmpty()) {
      String currentVersionId = ApiProxy.getCurrentEnvironment().getVersionId();
      String versionId = currentVersionId.split("\\.")[0];
      convertedServerVersions.add(Pair.of("default", versionId));
    }

    if (query.getMajorVersionIds().size() > 0) {
      for (String versionId : query.getMajorVersionIds()) {
        convertedServerVersions.add(Pair.of("default", versionId));
      }
    } else if (query.getServerVersions().size() > 0) {
      convertedServerVersions.addAll(query.getServerVersions());
    }

    for (Pair<String, String> serverVersion : convertedServerVersions) {
      LogServerVersion requestServerVersion = request.addServerVersion();
      if (!serverVersion.first.equals("default")) {
        requestServerVersion.setServerId(serverVersion.first);
      }
      requestServerVersion.setVersionId(serverVersion.second);
    }

    for (String requestId : query.getRequestIds()) {
      request.addRequestId(requestId);
    }

    String offset = query.getOffset();
    if (offset != null) {
      request.setOffset(LogQueryResult.parseOffset(offset));
    }

    final LogQuery finalizedQuery = query;
    ApiProxy.ApiConfig apiConfig = new ApiProxy.ApiConfig();

    Future<byte[]> responseBytes = ApiProxy.makeAsyncCall(PACKAGE,
      READ_RPC_NAME, request.toByteArray(), apiConfig);
    return new FutureWrapper<byte[], LogQueryResult>(responseBytes) {
      @Override
      protected LogQueryResult wrap(byte[] responseBytes) {
        LogReadResponse response = new LogReadResponse();
        response.mergeFrom(responseBytes);
        return new LogQueryResult(response, finalizedQuery);
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        if (cause instanceof ApiProxy.ApplicationException) {
          ApiProxy.ApplicationException e = (ApiProxy.ApplicationException) cause;
          ErrorCode errorCode = LogServiceError.ErrorCode.valueOf(e.getApplicationError());
          if (errorCode == LogServiceError.ErrorCode.INVALID_REQUEST) {
            return new InvalidRequestException(e.getErrorDetail());
          }
          return new LogServiceException(e.getErrorDetail());
        }
        return cause;
      }
    };
  }
}
