// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

import com.google.appengine.api.datastore.DatastoreApiHelper;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueServiceError.ErrorCode;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.io.protocol.ProtocolMessage;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * Provides translation of calls between userland and appserver land.
 *
 */
class QueueApiHelper {
  static final String PACKAGE = "taskqueue";

  <T extends ProtocolMessage<T>, V extends ProtocolMessage<V>> void makeSyncCall(
      String method,
      ProtocolMessage<T> request,
      ProtocolMessage<V> response) {
    try {
      byte[] responseBytes =
        ApiProxy.makeSyncCall(PACKAGE, method, request.toByteArray());
      if (responseBytes != null) {
        response.mergeFrom(responseBytes);
      }
    } catch (ApiProxy.ApplicationException exception) {
      throw translateError(exception);
    }
  }

  /**
   * Issue an async rpc against the taskqueue package with the given request and
   * response pbs as input and apply standard exception handling.  Do not
   * use this helper function if you need non-standard exception handling.
   */
  <T extends ProtocolMessage<T>> Future<T> makeAsyncCall(
      String method,
      ProtocolMessage<?> request,
      final T responseProto,
      ApiConfig apiConfig) {
    Future<byte[]> response =
        ApiProxy.makeAsyncCall(PACKAGE, method, request.toByteArray(), apiConfig);
    return new FutureWrapper<byte[], T>(response) {
      @Override
      protected Throwable convertException(Throwable cause) {
        if (cause instanceof ApiProxy.ApplicationException) {
          return translateError((ApiProxy.ApplicationException) cause);
        }
        return cause;
      }

      @Override
      protected T wrap(byte[] responseBytes) {
        if (responseBytes != null) {
          responseProto.parseFrom(responseBytes);
        }
        return responseProto;
      }
    };
  }

  /***
   * Extract the future's result.
   */
  static <T> T getInternal(Future<T> future) {
    try {
      return future.get();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new ApiProxy.ApplicationException(ErrorCode.TRANSIENT_ERROR.getValue(),
                                              "Interrupted while waiting for RPC response.");
    } catch (ExecutionException e) {
      Throwable cause = e.getCause();
      if (cause instanceof RuntimeException) {
        throw (RuntimeException) cause;
      } else if (cause instanceof Error) {
        throw (Error) cause;
      } else {
        throw new RuntimeException(cause);
      }
    }
  }

  static RuntimeException translateError(int error, String detail) {
    ErrorCode errorCode = ErrorCode.valueOf(error);

    int datastoreErrorCode = ErrorCode.DATASTORE_ERROR.getValue();
    if (error >= datastoreErrorCode) {
      ApiProxy.ApplicationException datastoreApplicationException =
        new ApiProxy.ApplicationException(error - datastoreErrorCode, detail);
      TransactionalTaskException taskqueueException = new TransactionalTaskException();
      taskqueueException.initCause(
          DatastoreApiHelper.translateError(datastoreApplicationException));
      return taskqueueException;
    }

    switch (errorCode) {
      case UNKNOWN_QUEUE:
        return new IllegalStateException("The specified queue is unknown : " + detail);
      case TRANSIENT_ERROR:
        return new TransientFailureException(detail);
      case INTERNAL_ERROR:
        return new InternalFailureException(detail);
      case TASK_TOO_LARGE:
        return new IllegalArgumentException("Task size is too large : " + detail);
      case INVALID_TASK_NAME:
        return new IllegalArgumentException("Invalid task name : " + detail);
      case INVALID_QUEUE_NAME:
        return new IllegalArgumentException("Invalid queue name : " + detail);
      case INVALID_URL:
        return new IllegalArgumentException("Invalid URL : " + detail);
      case INVALID_QUEUE_RATE:
        return new IllegalArgumentException("Invalid queue rate : " + detail);
      case PERMISSION_DENIED:
        return new SecurityException("Permission for requested operation is denied : " + detail);
      case TASK_ALREADY_EXISTS:
        return new TaskAlreadyExistsException("Task name already exists : " + detail);
      case TOMBSTONED_TASK:
        return new TaskAlreadyExistsException("Task name is tombstoned : " + detail);
      case INVALID_ETA:
        return new IllegalArgumentException("ETA is invalid : " + detail);
      case INVALID_REQUEST:
        return new IllegalArgumentException("Invalid request : " + detail);
      case UNKNOWN_TASK:
        return new TaskNotFoundException("Task does not exist : " + detail);
      case TOMBSTONED_QUEUE:
        return new IllegalStateException(
            "The queue has been marked for deletion and is no longer usable : " + detail);
      case DUPLICATE_TASK_NAME:
        return new IllegalArgumentException("Identical task names in request : " + detail);
      case TOO_MANY_TASKS:
        return new IllegalArgumentException("Request contains too many tasks : " + detail);
      case INVALID_QUEUE_MODE:
        return new InvalidQueueModeException(
            "Target queue mode does not support this operation : " + detail);
      case TASK_LEASE_EXPIRED:
        return new IllegalStateException(
            "The task lease has expired : " + detail);
      case QUEUE_PAUSED:
        return new IllegalStateException(
            "The queue is paused and cannot process the request : " + detail);
      default:
        return new QueueFailureException("Unspecified error (" + errorCode + ") : " + detail);
    }
  }

  static RuntimeException translateError(ApiProxy.ApplicationException exception) {
    return translateError(exception.getApplicationError(), exception.getErrorDetail());
  }

  public static void validateQueueName(String queueName) {
    if (queueName == null || queueName.length() == 0 ||
        !QueueConstants.QUEUE_NAME_PATTERN.matcher(queueName).matches()) {
      throw new IllegalArgumentException(
          "Queue name does not match expression " + QueueConstants.QUEUE_NAME_REGEX +
          "; found '" + queueName + "'");
    }
  }
}
