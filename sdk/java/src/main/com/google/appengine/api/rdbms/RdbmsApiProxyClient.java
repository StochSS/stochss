// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.rdbms;

import com.google.apphosting.api.ApiProxy;
import com.google.cloud.sql.jdbc.internal.Exceptions;
import com.google.cloud.sql.jdbc.internal.SqlProtoClient;
import com.google.cloud.sql.jdbc.internal.SqlRpc;
import com.google.cloud.sql.jdbc.internal.SqlRpcOptions;
import com.google.cloud.sql.jdbc.internal.SqlState;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.Message;
import com.google.protobuf.MessageLite;
import com.google.protos.cloud.sql.CloseConnectionRequest;
import com.google.protos.cloud.sql.CloseConnectionResponse;
import com.google.protos.cloud.sql.ExecOpRequest;
import com.google.protos.cloud.sql.ExecOpResponse;
import com.google.protos.cloud.sql.ExecRequest;
import com.google.protos.cloud.sql.ExecResponse;
import com.google.protos.cloud.sql.MetadataRequest;
import com.google.protos.cloud.sql.MetadataResponse;
import com.google.protos.cloud.sql.OpenConnectionRequest;
import com.google.protos.cloud.sql.OpenConnectionResponse;

import java.sql.SQLException;
import java.util.concurrent.TimeUnit;

/**
 * A {@link SqlProtoClient} extension that uses the app engine
 * {@link ApiProxy}.
 *
 */
class RdbmsApiProxyClient extends SqlProtoClient {

  static final String PACKAGE = "rdbms";

  RdbmsApiProxyClient(String rdbmsInstance) {
    super(rdbmsInstance, new ApiProxyBlockingInterface());
  }

  static final class ApiProxyBlockingInterface implements SqlRpc {

    ApiProxyBlockingInterface() {
    }

    @Override
    public ExecResponse exec(SqlRpcOptions options, ExecRequest request)
        throws SQLException {
      return makeSyncCall("Exec", request, createApiConfig(options.getQueryTimeOutMillis()),
          ExecResponse.newBuilder()).build();
    }

    @Override
    public ExecOpResponse execOp(SqlRpcOptions options, ExecOpRequest request)
        throws SQLException {
      return makeSyncCall("ExecOp", request, createApiConfig(options.getQueryTimeOutMillis()),
          ExecOpResponse.newBuilder()).build();
    }

    @Override
    public MetadataResponse getMetadata(SqlRpcOptions options,
        MetadataRequest request) throws SQLException {
      return makeSyncCall(
          "GetMetadata", request, createApiConfig(options.getQueryTimeOutMillis()),
          MetadataResponse.newBuilder()).build();
    }

    @Override
    public OpenConnectionResponse openConnection(SqlRpcOptions options,
        OpenConnectionRequest request) throws SQLException {
      return makeSyncCall(
          "OpenConnection", request, createApiConfig(options.getConnectTimeOutMillis()),
          OpenConnectionResponse.newBuilder()).build();
    }

    @Override
    public CloseConnectionResponse closeConnection(SqlRpcOptions options,
        CloseConnectionRequest request) throws SQLException {
      return makeSyncCall(
          "CloseConnection", request, createApiConfig(options.getQueryTimeOutMillis()),
          CloseConnectionResponse.newBuilder()).build();
    }

    private static ApiProxy.ApiConfig createApiConfig(long deadlineMillis) {
      ApiProxy.ApiConfig config = new ApiProxy.ApiConfig();
      config.setDeadlineInSeconds((double) TimeUnit.MILLISECONDS.toSeconds(deadlineMillis));
      return config;
    }

    <T extends Message.Builder> T makeSyncCall(String method, MessageLite request,
        ApiProxy.ApiConfig apiConfig, T responseBuilder) throws SQLException {
      try {
        byte[] responseBytes =
            ApiProxy.makeSyncCall(PACKAGE, method, request.toByteArray(), apiConfig);
        if (responseBytes != null) {
          try {
            responseBuilder.mergeFrom(responseBytes);
          } catch (InvalidProtocolBufferException e) {
            throw new SQLException(e.getMessage(), e);
          }
        }
      } catch (ApiProxy.ApiDeadlineExceededException exception) {
        throw Exceptions.newTimeoutException();
      } catch (ApiProxy.ApplicationException exception) {
        String sqlstate = method.equals("OpenConnection")
            ? SqlState.forOpenConnectionError(exception.getApplicationError())
            : SqlState.forError(exception.getApplicationError());
        throw new SQLException(
            exception.getErrorDetail(), sqlstate, exception.getApplicationError());
      }
      return responseBuilder;
    }
  }
}
