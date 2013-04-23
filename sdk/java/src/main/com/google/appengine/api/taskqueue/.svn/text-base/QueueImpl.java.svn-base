// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

import static com.google.appengine.api.taskqueue.QueueApiHelper.getInternal;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.taskqueue.TaskOptions.Param;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueAddRequest;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueAddRequest.Header;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueBulkAddRequest;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueBulkAddResponse;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueDeleteRequest;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueDeleteResponse;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueMode;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueModifyTaskLeaseRequest;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueModifyTaskLeaseResponse;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueuePurgeQueueRequest;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueuePurgeQueueResponse;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueQueryAndOwnTasksRequest;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueQueryAndOwnTasksResponse;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueRetryParameters;
import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueServiceError;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.io.protocol.ProtocolMessage;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * Implements the {@link Queue} interface.
 * {@link QueueImpl} is thread safe.
 *
 */
class QueueImpl implements Queue {
  private final String queueName;
  private final DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();
  private final QueueApiHelper apiHelper;

  /**
   * The name of the HTTP header specifying the default namespace
   * for API calls.
   */
  static final String DEFAULT_NAMESPACE_HEADER = "X-AppEngine-Default-Namespace";
  static final String CURRENT_NAMESPACE_HEADER = "X-AppEngine-Current-Namespace";

  static final double DEFAULT_LEASE_TASKS_DEADLINE_SECONDS = 10.0;
  static final double DEFAULT_FETCH_STATISTICS_DEADLINE_SECONDS = 10.0;

  QueueImpl(String queueName, QueueApiHelper apiHelper) {
    QueueApiHelper.validateQueueName(queueName);

    this.apiHelper = apiHelper;
    this.queueName = queueName;
  }

  /**
   * Transform a future returning a single-entry list into a future returning that entry.
   * @param future  A future whose result is a singleton list.
   * @return A future whose result is the only element of the list.
   */
  private <T> Future<T> extractSingleEntry(Future<List<T>> future) {
    return new FutureAdapter<List<T>, T>(future) {
      @Override
      protected T wrap(List<T> key) throws Exception {
        if (key.size() != 1) {
          throw new InternalFailureException(
              "An internal error occurred while accessing queue '" + queueName + "'");
        }
        return key.get(0);
      }
    };
  }

  /**
   * See {@link Queue#add()}
   */
  @Override
  public TaskHandle add() {
    return getInternal(addAsync());
  }

  /**
   * See {@link Queue#addAsync()}
   */
  @Override
  public Future<TaskHandle> addAsync() {
    return addAsync(
        getDatastoreService().getCurrentTransaction(null), TaskOptions.Builder.withDefaults());
  }

  /**
   * Returns a {@link URI} validated to only contain legal components.
   * <p>The "scheme", "authority" and "fragment" components of a URI
   * must not be specified.  The path component must be absolute
   * (i.e. start with "/").
   *
   * @param urlString The "url" specified by the client.
   * @throws IllegalArgumentException The provided urlString is null, too long or does not have
   *         correct syntax.
   */
  private URI parsePartialUrl(String urlString) {
    if (urlString == null) {
      throw new IllegalArgumentException("url must not be null");
    }

    if (urlString.length() > QueueConstants.maxUrlLength()) {
      throw new IllegalArgumentException(
          "url is longer than " + ((Integer) QueueConstants.maxUrlLength()).toString() + ".");
    }

    URI uri;
    try {
      uri = new URI(urlString);
    } catch (URISyntaxException exception) {
      throw new IllegalArgumentException("URL syntax error", exception);
    }

    uriCheckNull(uri.getScheme(), "scheme");
    uriCheckNull(uri.getRawAuthority(), "authority");
    uriCheckNull(uri.getRawFragment(), "fragment");
    String path = uri.getPath();

    if (path == null || path.length() == 0 || path.charAt(0) != '/') {
      if (path == null) {
        path = "(null)";
      } else if (path.length() == 0) {
        path = "<empty string>";
      }
      throw new IllegalArgumentException(
          "url must contain a path starting with '/' part - contains :" + path);
    }

    return uri;
  }

  private void uriCheckNull(String value, String valueName) {
    if (value != null) {
      throw new IllegalArgumentException(
          "url must not contain a '" + valueName + "' part - contains :" + value);
    }
  }

  private void checkPullTask(String url,
      HashMap<String, List<String>> headers,
      byte[] payload,
      RetryOptions retryOptions) {
    if (url != null && !url.isEmpty()) {
      throw new IllegalArgumentException("May not specify url in tasks that have method PULL");
    }
    if (!headers.isEmpty()) {
      throw new IllegalArgumentException(
          "May not specify any header in tasks that have method PULL");
    }
    if (retryOptions != null) {
      throw new IllegalArgumentException(
          "May not specify retry options in tasks that have method PULL");
    }
    if (payload == null) {
      throw new IllegalArgumentException("payload must be specified for tasks with method PULL");
    }
  }

  private void checkPostTask(List<Param> params, byte[] payload, String query) {
    if (query != null && query.length() != 0) {
      throw new IllegalArgumentException(
          "POST method may not have a query string; use setParamater(s) instead");
    }
  }

  /**
   * Construct a byte array data from params if payload is not specified.
   * If it sees payload is specified, return null.
   * @throws IllegalArgumentException if params and payload both exist
   */
  private byte[] constructPayloadFromParams(List<Param> params, byte[] payload) {
    if (!params.isEmpty() && payload != null) {
      throw new IllegalArgumentException(
          "Message body and parameters may not both be present; "
          + "only one of these may be supplied");
    }
    return payload != null ? null : encodeParamsPost(params);

  }

  private void validateAndFillAddRequest(com.google.appengine.api.datastore.Transaction txn,
      TaskOptions taskOptions,
      TaskQueueAddRequest addRequest) {
    boolean useUrlEncodedContentType = false;

    HashMap<String, List<String>> headers = taskOptions.getHeaders();
    String url = taskOptions.getUrl();
    byte[] payload = taskOptions.getPayload();
    List<Param> params = taskOptions.getParams();
    RetryOptions retryOptions = taskOptions.getRetryOptions();
    TaskOptions.Method method = taskOptions.getMethod();

    URI parsedUrl;
    if (url == null) {
      parsedUrl = parsePartialUrl(defaultUrl());
    } else {
      parsedUrl = parsePartialUrl(url);
    }
    String query = parsedUrl.getQuery();
    StringBuilder relativeUrl = new StringBuilder(parsedUrl.getRawPath());
    if (query != null && query.length() != 0 && !params.isEmpty()) {
      throw new IllegalArgumentException(
          "Query string and parameters both present; only one of these may be supplied");
    }

    byte[] constructedPayload;
    if (method == TaskOptions.Method.PULL) {
      constructedPayload = constructPayloadFromParams(params, payload);
      if (constructedPayload != null) {
        payload = constructedPayload;
      }
      checkPullTask(url, headers, payload, retryOptions);
    } else if (method == TaskOptions.Method.POST) {
      constructedPayload = constructPayloadFromParams(params, payload);
      if (constructedPayload != null) {
        payload = constructedPayload;
        useUrlEncodedContentType = true;
      }
      checkPostTask(params, payload, query);
    } else {
      if (!params.isEmpty()) {
        query = encodeParamsUrlEncoded(params);
      }
      if (query != null && query.length() != 0) {
        relativeUrl.append("?").append(query);
      }
    }
    if (payload != null && payload.length != 0 && !taskOptions.getMethod().supportsBody()) {
      throw new IllegalArgumentException(
          taskOptions.getMethod().toString() + " method may not specify a payload.");
    }

    fillAddRequest(txn,
        queueName,
        taskOptions.getTaskName(),
        determineEta(taskOptions),
        method,
        relativeUrl.toString(),
        payload,
        headers,
        retryOptions,
        useUrlEncodedContentType,
        taskOptions.getTagAsBytes(),
        addRequest);
  }

  private void fillAddRequest(com.google.appengine.api.datastore.Transaction txn,
      String queueName,
      String taskName,
      long etaMillis,
      TaskOptions.Method method,
      String relativeUrl,
      byte[] payload,
      HashMap<String, List<String>> headers,
      RetryOptions retryOptions,
      boolean useUrlEncodedContentType,
      byte[] tag,
      TaskQueueAddRequest addRequest) {
    addRequest.setQueueName(queueName);
    addRequest.setTaskName(taskName == null ? "" : taskName);

    if (method == TaskOptions.Method.PULL) {
      addRequest.setMode(TaskQueueMode.Mode.PULL.getValue());
    } else {
      addRequest.setUrl(relativeUrl.toString());
      addRequest.setMode(TaskQueueMode.Mode.PUSH.getValue());
      addRequest.setMethod(method.getPbMethod());
    }

    if (payload != null) {
      addRequest.setBodyAsBytes(payload);
    }

    addRequest.setEtaUsec(etaMillis * 1000);

    if (taskName != null && !taskName.equals("") && txn != null) {
      throw new IllegalArgumentException(
          "transactional tasks cannot be named: " + taskName);
    }
    if (txn != null) {
      addRequest.setTransaction(localTxnToRemoteTxn(txn));
    }

    if (retryOptions != null) {
      fillRetryParameters(retryOptions, addRequest.getMutableRetryParameters());
    }

    if (NamespaceManager.getGoogleAppsNamespace().length() != 0) {
      if (!headers.containsKey(DEFAULT_NAMESPACE_HEADER)) {
        headers.put(DEFAULT_NAMESPACE_HEADER,
                    Arrays.asList(NamespaceManager.getGoogleAppsNamespace()));
      }
    }
    if (!headers.containsKey(CURRENT_NAMESPACE_HEADER)) {
      String namespace = NamespaceManager.get();
      headers.put(CURRENT_NAMESPACE_HEADER, Arrays.asList(namespace == null ? "" : namespace));
    }
    for (Entry<String, List<String>> entry : headers.entrySet()) {
      if (useUrlEncodedContentType && entry.getKey().toLowerCase().equals("content-type")) {
        continue;
      }

      for (String value : entry.getValue()) {
        Header header = addRequest.addHeader();
        header.setKey(entry.getKey());
        header.setValue(value);
      }
    }
    if (useUrlEncodedContentType) {
      Header contentTypeHeader = addRequest.addHeader();
      contentTypeHeader.setKey("content-type");
      contentTypeHeader.setValue("application/x-www-form-urlencoded");
    }

    if (tag != null) {
      if (method != TaskOptions.Method.PULL) {
        throw new IllegalArgumentException("Only PULL tasks can have a tag.");
      }
      if (tag.length > QueueConstants.maxTaskTagLength()) {
        throw new IllegalArgumentException(
            "Task tag must be no more than " + QueueConstants.maxTaskTagLength() + " bytes.");
      }
      addRequest.setTagAsBytes(tag);
    }

    if (method == TaskOptions.Method.PULL) {
      if (addRequest.encodingSize() > QueueConstants.maxPullTaskSizeBytes()) {
        throw new IllegalArgumentException("Task size too large");
      }
    } else {
      if (addRequest.encodingSize() > QueueConstants.maxPushTaskSizeBytes()) {
        throw new IllegalArgumentException("Task size too large");
      }
    }
  }

  /**
   * Translates a local transaction to the Datastore PB.
   * Due to pb dependency issues, Transaction pb is redefined for TaskQueue.
   * Keep in sync with DatastoreServiceImpl.localTxnToRemoteTxn.
   */
  private static Transaction localTxnToRemoteTxn(
      com.google.appengine.api.datastore.Transaction local) {
    Transaction remote = new Transaction();
    remote.setApp(local.getApp());
    remote.setHandle(Long.parseLong(local.getId()));
    return remote;
  }

  /**
   * Translates from RetryOptions to TaskQueueRetryParameters.
   * Also checks ensures minBackoffSeconds and maxBackoffSeconds are ordered
   * correctly.
   */
  private static void fillRetryParameters(
      RetryOptions retryOptions,
      TaskQueueRetryParameters retryParameters) {
    if (retryOptions.getTaskRetryLimit() != null) {
      retryParameters.setRetryLimit(retryOptions.getTaskRetryLimit());
    }
    if (retryOptions.getTaskAgeLimitSeconds() != null) {
      retryParameters.setAgeLimitSec(retryOptions.getTaskAgeLimitSeconds());
    }
    if (retryOptions.getMinBackoffSeconds() != null) {
      retryParameters.setMinBackoffSec(retryOptions.getMinBackoffSeconds());
    }
    if (retryOptions.getMaxBackoffSeconds() != null) {
      retryParameters.setMaxBackoffSec(retryOptions.getMaxBackoffSeconds());
    }
    if (retryOptions.getMaxDoublings() != null) {
      retryParameters.setMaxDoublings(retryOptions.getMaxDoublings());
    }

    if (retryParameters.hasMinBackoffSec() && retryParameters.hasMaxBackoffSec()) {
      if (retryParameters.getMinBackoffSec() > retryParameters.getMaxBackoffSec()) {
        throw new IllegalArgumentException(
            "minBackoffSeconds must not be greater than maxBackoffSeconds.");
      }
    } else if (retryParameters.hasMinBackoffSec()) {
      if (retryParameters.getMinBackoffSec() > retryParameters.getMaxBackoffSec()) {
        retryParameters.setMaxBackoffSec(retryParameters.getMinBackoffSec());
      }
    } else if (retryParameters.hasMaxBackoffSec()) {
      if (retryParameters.getMinBackoffSec() > retryParameters.getMaxBackoffSec()) {
        retryParameters.setMinBackoffSec(retryParameters.getMaxBackoffSec());
      }
    }
  }

  /**
   * See {@link Queue#add(TaskOptions)}.
   */
  @Override
  public TaskHandle add(TaskOptions taskOptions) {
    return getInternal(addAsync(taskOptions));
  }

  /**
   * See {@link Queue#addAsync(TaskOptions)}.
   */
  @Override
  public Future<TaskHandle> addAsync(TaskOptions taskOptions) {
    return addAsync(getDatastoreService().getCurrentTransaction(null), taskOptions);
  }

  /**
   * See {@link Queue#add(Iterable)}.
   */
  @Override
  public List<TaskHandle> add(Iterable<TaskOptions> taskOptions) {
    return getInternal(addAsync(taskOptions));
  }

  /**
   * See {@link Queue#addAsync(Iterable)}.
   */
  @Override
  public Future<List<TaskHandle>> addAsync(Iterable<TaskOptions> taskOptions) {
    return addAsync(getDatastoreService().getCurrentTransaction(null), taskOptions);
  }

  /**
   * See {@link Queue#add(com.google.appengine.api.datastore.Transaction, TaskOptions)}.
   */
  @Override
  public TaskHandle add(com.google.appengine.api.datastore.Transaction txn,
      TaskOptions taskOptions) {
    return getInternal(addAsync(txn, taskOptions));
  }

  /**
   * See {@link Queue#addAsync(com.google.appengine.api.datastore.Transaction, TaskOptions)}.
   */
  @Override
  public Future<TaskHandle> addAsync(
      com.google.appengine.api.datastore.Transaction txn, TaskOptions taskOptions) {
    return extractSingleEntry(addAsync(txn, Collections.singletonList(taskOptions)));
  }

  /**
   * See {@link
   * Queue#add(com.google.appengine.api.datastore.Transaction, Iterable)}.
   */
  @Override
  public List<TaskHandle> add(com.google.appengine.api.datastore.Transaction txn,
      Iterable<TaskOptions> taskOptions) {
    return getInternal(addAsync(txn, taskOptions));
  }

  /**
   * See {@link
   * Queue#addAsync(com.google.appengine.api.datastore.Transaction, Iterable)}.
   */
  @Override
  public Future<List<TaskHandle>> addAsync(
      com.google.appengine.api.datastore.Transaction txn, Iterable<TaskOptions> taskOptions) {
    final List<TaskOptions> taskOptionsList = new ArrayList<TaskOptions>();
    Set<String> taskNames = new HashSet<String>();

    final TaskQueueBulkAddRequest bulkAddRequest = new TaskQueueBulkAddRequest();

    boolean hasPushTask = false;
    boolean hasPullTask = false;
    for (TaskOptions option : taskOptions) {
      TaskQueueAddRequest addRequest = bulkAddRequest.addAddRequest();
      validateAndFillAddRequest(txn, option, addRequest);
      if (addRequest.getMode() == TaskQueueMode.Mode.PULL.getValue()) {
        hasPullTask = true;
      } else {
        hasPushTask = true;
      }

      taskOptionsList.add(option);
      if (option.getTaskName() != null && !option.getTaskName().equals("")) {
        if (!taskNames.add(option.getTaskName())) {
          throw new IllegalArgumentException(
              String.format("Identical task names in request : \"%s\" duplicated",
                  option.getTaskName()));
        }
      }
    }
    if (bulkAddRequest.addRequestSize() > QueueConstants.maxTasksPerAdd()) {
      throw new IllegalArgumentException(
          String.format("No more than %d tasks can be added in a single add call",
              QueueConstants.maxTasksPerAdd()));
    }

    if (hasPullTask && hasPushTask) {
      throw new IllegalArgumentException(
          "May not add both push tasks and pull tasks in the same call.");
    }

    if (txn != null &&
        bulkAddRequest.encodingSize() > QueueConstants.maxTransactionalRequestSizeBytes()) {
      throw new IllegalArgumentException(
          String.format("Transactional add may not be larger than %d bytes: %d bytes requested.",
              QueueConstants.maxTransactionalRequestSizeBytes(),
              bulkAddRequest.encodingSize()));
    }

    Future<TaskQueueBulkAddResponse> responseFuture = makeAsyncCall(
        "BulkAdd", bulkAddRequest, new TaskQueueBulkAddResponse());
    return new FutureAdapter<TaskQueueBulkAddResponse, List<TaskHandle>>(responseFuture) {
      @Override
      protected List<TaskHandle> wrap(TaskQueueBulkAddResponse bulkAddResponse) {
        if (bulkAddResponse.taskResultSize() != bulkAddRequest.addRequestSize()) {
            throw new InternalFailureException(
                String.format("expected %d results from BulkAdd(), got %d",
                    bulkAddRequest.addRequestSize(), bulkAddResponse.taskResultSize()));
        }

        List<TaskHandle> tasks = new ArrayList<TaskHandle>();
        for (int i = 0; i < bulkAddResponse.taskResultSize(); ++i) {
          TaskQueueBulkAddResponse.TaskResult taskResult = bulkAddResponse.taskResults().get(i);
          TaskQueueAddRequest addRequest = bulkAddRequest.getAddRequest(i);
          TaskOptions options = taskOptionsList.get(i);

          if (taskResult.getResult() == TaskQueueServiceError.ErrorCode.OK.getValue()) {
            String taskName = options.getTaskName();
            if (taskResult.hasChosenTaskName()) {
              taskName = taskResult.getChosenTaskName();
            }
            TaskOptions taskResultOptions = new TaskOptions(options);
            taskResultOptions.taskName(taskName).payload(addRequest.getBodyAsBytes());
            TaskHandle handle = new TaskHandle(taskResultOptions, queueName);
            tasks.add(handle.etaUsec(addRequest.getEtaUsec()));
          } else if (taskResult.getResult() != TaskQueueServiceError.ErrorCode.SKIPPED.getValue()) {
            throw QueueApiHelper.translateError(taskResult.getResult(), options.getTaskName());
          }
        }
        return tasks;
      }
    };
  }

  long currentTimeMillis() {
    return System.currentTimeMillis();
  }

  private long determineEta(TaskOptions taskOptions) {
    Long etaMillis = taskOptions.getEtaMillis();
    Long countdownMillis = taskOptions.getCountdownMillis();
    if (etaMillis == null) {
      if (countdownMillis == null) {
        return currentTimeMillis();
      } else {
        if (countdownMillis > QueueConstants.getMaxEtaDeltaMillis()) {
          throw new IllegalArgumentException("ETA too far into the future");
        }
        if (countdownMillis < 0) {
          throw new IllegalArgumentException("Negative countdown is not allowed");
        }
        return currentTimeMillis() + countdownMillis;
      }
    } else {
      if (countdownMillis == null) {
        if (etaMillis - currentTimeMillis() > QueueConstants.getMaxEtaDeltaMillis()) {
          throw new IllegalArgumentException("ETA too far into the future");
        }
        if (etaMillis < 0) {
          throw new IllegalArgumentException("Negative ETA is invalid");
        }
        return etaMillis;
      } else {
        throw new IllegalArgumentException(
            "Only one or neither of EtaMillis and CountdownMillis may be specified");
      }
    }
  }

  byte[] encodeParamsPost(List<Param> params) {
    byte[] payload;
    try {
      payload = encodeParamsUrlEncoded(params).getBytes("UTF-8");
    } catch (UnsupportedEncodingException exception) {
      throw new UnsupportedTranslationException(exception);
    }

    return payload;
  }

  String encodeParamsUrlEncoded(List<Param> params) {
    StringBuilder result = new StringBuilder();
    try {
      String appender = "";
      for (Param param : params) {
        result.append(appender);
        appender = "&";
        result.append(param.getURLEncodedName());
        result.append("=");
        result.append(param.getURLEncodedValue());
      }
    } catch (UnsupportedEncodingException exception) {
      throw new UnsupportedTranslationException(exception);
    }
    return result.toString();
  }

  private String defaultUrl() {
    return DEFAULT_QUEUE_PATH + "/" + queueName;
  }

  /**
   * See {@link Queue#getQueueName()}.
   */
  @Override
  public String getQueueName() {
    return queueName;
  }

  DatastoreService getDatastoreService() {
    return datastoreService;
  }

  /**
   * See {@link Queue#purge()}.
   */
  @Override
  public void purge() {
    TaskQueuePurgeQueueRequest purgeRequest = new TaskQueuePurgeQueueRequest();
    TaskQueuePurgeQueueResponse purgeResponse = new TaskQueuePurgeQueueResponse();

    purgeRequest.setQueueName(queueName);
    apiHelper.makeSyncCall("PurgeQueue", purgeRequest, purgeResponse);
  }

  /**
   * See {@link Queue#deleteTask(String)}.
   */
  @Override
  public boolean deleteTask(String taskName) {
    return getInternal(deleteTaskAsync(taskName));
  }

  /**
   * See {@link Queue#deleteTaskAsync(String)}.
   */
  @Override
  public Future<Boolean> deleteTaskAsync(String taskName) {
    TaskHandle.validateTaskName(taskName);
    return deleteTaskAsync(new TaskHandle(TaskOptions.Builder.withTaskName(taskName),
        queueName));
  }

  /**
   * See {@link Queue#deleteTask(TaskHandle)}.
   */
  @Override
  public boolean deleteTask(TaskHandle taskHandle) {
    return getInternal(deleteTaskAsync(taskHandle));
  }

  /**
   * See {@link Queue#deleteTaskAsync(TaskHandle)}.
   */
  @Override
  public Future<Boolean> deleteTaskAsync(TaskHandle taskHandle) {
    return extractSingleEntry(deleteTaskAsync(Collections.singletonList(taskHandle)));
  }

  /**
   * See {@link Queue#deleteTask(List<TaskHandle>)}.
   */
  @Override
  public List<Boolean> deleteTask(List<TaskHandle> taskHandles) {
    return getInternal(deleteTaskAsync(taskHandles));
  }

  /**
   * See {@link Queue#deleteTaskAsync(List<TaskHandle>)}.
   */
  @Override
  public Future<List<Boolean>> deleteTaskAsync(List<TaskHandle> taskHandles) {

    final TaskQueueDeleteRequest deleteRequest = new TaskQueueDeleteRequest();
    deleteRequest.setQueueName(queueName);

    for (TaskHandle taskHandle : taskHandles) {
      if (taskHandle.getQueueName().equals(this.queueName)) {
        deleteRequest.addTaskName(taskHandle.getName());
      } else {
        throw new QueueNameMismatchException(
          String.format("The task %s is associated with the queue named %s "
              + "and cannot be deleted from the queue named %s.",
              taskHandle.getName(), taskHandle.getQueueName(), this.queueName));
      }
    }

    Future<TaskQueueDeleteResponse> responseFuture = makeAsyncCall(
        "Delete", deleteRequest, new TaskQueueDeleteResponse());
    return new FutureAdapter<TaskQueueDeleteResponse, List<Boolean>>(responseFuture) {
      @Override
      protected List<Boolean> wrap(TaskQueueDeleteResponse deleteResponse) {
        List<Boolean> result = new ArrayList<Boolean>(deleteResponse.resultSize());

        for (int i = 0; i < deleteResponse.resultSize(); ++i) {
          int errorCode = deleteResponse.getResult(i);
          if (errorCode != TaskQueueServiceError.ErrorCode.OK.getValue() &&
              errorCode != TaskQueueServiceError.ErrorCode.TOMBSTONED_TASK.getValue() &&
              errorCode != TaskQueueServiceError.ErrorCode.UNKNOWN_TASK.getValue()) {
            throw QueueApiHelper.translateError(errorCode, deleteRequest.getTaskName(i));
          }
          result.add(errorCode == TaskQueueServiceError.ErrorCode.OK.getValue());
        }

        return result;
      }
    };
  }

  private Future<List<TaskHandle>> leaseTasksInternal(LeaseOptions options) {
    long leaseMillis = options.getUnit().toMillis(options.getLease());
    if (leaseMillis > QueueConstants.maxLease(TimeUnit.MILLISECONDS)) {
      throw new IllegalArgumentException(
          String.format("A lease period can be no longer than %d seconds",
              QueueConstants.maxLease(TimeUnit.SECONDS)));
    }

    if (options.getCountLimit() > QueueConstants.maxLeaseCount()) {
      throw new IllegalArgumentException(
          String.format("No more than %d tasks can be leased in one call",
              QueueConstants.maxLeaseCount()));
    }

    TaskQueueQueryAndOwnTasksRequest leaseRequest = new TaskQueueQueryAndOwnTasksRequest();

    leaseRequest.setQueueName(queueName);
    leaseRequest.setLeaseSeconds(leaseMillis / 1000.0);
    leaseRequest.setMaxTasks(options.getCountLimit());
    if (options.getGroupByTag()) {
      leaseRequest.setGroupByTag(true);
      if (options.getTag() != null) {
        leaseRequest.setTagAsBytes(options.getTag());
      }
    }

    ApiConfig apiConfig = new ApiConfig();
    if (options.getDeadlineInSeconds() == null) {
      apiConfig.setDeadlineInSeconds(DEFAULT_LEASE_TASKS_DEADLINE_SECONDS);
    } else {
      apiConfig.setDeadlineInSeconds(options.getDeadlineInSeconds());
    }

    Future<TaskQueueQueryAndOwnTasksResponse> responseFuture = apiHelper.makeAsyncCall(
        "QueryAndOwnTasks", leaseRequest, new TaskQueueQueryAndOwnTasksResponse(), apiConfig);
    return new FutureAdapter<TaskQueueQueryAndOwnTasksResponse, List<TaskHandle>>(responseFuture) {
      @Override
      protected List<TaskHandle> wrap(TaskQueueQueryAndOwnTasksResponse leaseResponse) {
        List<TaskHandle> result = new ArrayList<TaskHandle>();
        for (TaskQueueQueryAndOwnTasksResponse.Task response : leaseResponse.tasks()) {
          TaskOptions taskOptions = TaskOptions.Builder.withTaskName(response.getTaskName())
                                                  .payload(response.getBodyAsBytes())
                                                  .method(TaskOptions.Method.PULL);
          if (response.hasTag()) {
            taskOptions.tag(response.getTagAsBytes());
          }
          TaskHandle handle = new TaskHandle(taskOptions, queueName, response.getRetryCount());
          result.add(handle.etaUsec(response.getEtaUsec()));
        }

        return result;
      }
    };
  }

  /**
   * See {@link Queue#leaseTasks(long, TimeUnit, long)}.
   */
  @Override
  public List<TaskHandle> leaseTasks(long lease, TimeUnit unit, long countLimit) {
    return getInternal(leaseTasksAsync(lease, unit, countLimit));
  }

  /**
   * See {@link Queue#leaseTasksAsync(long, TimeUnit, long)}.
   */
  @Override
  public Future<List<TaskHandle>> leaseTasksAsync(
      long lease, TimeUnit unit, long countLimit) {
    return leaseTasksInternal(LeaseOptions.Builder.withLeasePeriod(lease, unit)
                                                  .countLimit(countLimit));
  }

  /**
   * See {@link Queue#leaseTasksByTagBytes(long, TimeUnit, long, byte[])}.
   */
  @Override
  public List<TaskHandle> leaseTasksByTagBytes(
      long lease, TimeUnit unit, long countLimit, byte[] tag) {
    return getInternal(leaseTasksByTagBytesAsync(lease, unit, countLimit, tag));
  }

  /**
   * See {@link Queue#leaseTasksByTagBytesAsync(long, TimeUnit, long, byte[])}.
   */
  @Override
  public Future<List<TaskHandle>> leaseTasksByTagBytesAsync(
      long lease, TimeUnit unit, long countLimit, byte[] tag) {
    LeaseOptions options = LeaseOptions.Builder.withLeasePeriod(lease, unit)
                                               .countLimit(countLimit);
    if (tag != null) {
      options.tag(tag);
    } else {
      options.groupByTag();
    }
    return leaseTasksInternal(options);
  }

  /**
   * See {@link Queue#leaseTasksByTag(long, TimeUnit, long, String)}.
   */
  @Override
  public List<TaskHandle> leaseTasksByTag(long lease, TimeUnit unit,
                                          long countLimit, String tag) {
    return getInternal(leaseTasksByTagAsync(lease, unit, countLimit, tag));
  }

  /**
   * See {@link Queue#leaseTasksByTagAsync(long, TimeUnit, long, String)}.
   */
  @Override
  public Future<List<TaskHandle>> leaseTasksByTagAsync(
      long lease, TimeUnit unit, long countLimit, String tag) {
    LeaseOptions options = LeaseOptions.Builder.withLeasePeriod(lease, unit)
                                               .countLimit(countLimit);
    if (tag != null) {
      options.tag(tag);
    } else {
      options.groupByTag();
    }
    return leaseTasksInternal(options);
  }

  /**
   * See {@link Queue#leaseTasks(LeaseOptions)}.
   */
  @Override
  public List<TaskHandle> leaseTasks(LeaseOptions options) {
    return getInternal(leaseTasksAsync(options));
  }

  /**
   * See {@link Queue#leaseTasksAsync(LeaseOptions)}.
   */
  @Override
  public Future<List<TaskHandle>> leaseTasksAsync(LeaseOptions options) {
    if (options.getLease() == null) {
      throw new IllegalArgumentException("The lease period must be specified");
    }
    if (options.getCountLimit() == null) {
      throw new IllegalArgumentException("The count limit must be specified");
    }
    return leaseTasksInternal(options);
  }

  /**
   * See {@link Queue#modifyTaskLease(TaskHandle, long, TimeUnit)}.
   */
  @Override
  public TaskHandle modifyTaskLease(TaskHandle taskHandle, long lease, TimeUnit unit) {
    long leaseMillis = unit.toMillis(lease);
    if (leaseMillis > QueueConstants.maxLease(TimeUnit.MILLISECONDS)) {
      throw new IllegalArgumentException(
          String.format("The lease time specified (%s seconds) is too large. " +
              "Lease period can be no longer than %d seconds.",
              formatLeaseTimeInSeconds(leaseMillis),
              QueueConstants.maxLease(TimeUnit.SECONDS)));
    }
    if (leaseMillis < 0) {
      throw new IllegalArgumentException(
        String.format("The lease time must not be negative. " +
          "Specified lease time was %s seconds.",
          formatLeaseTimeInSeconds(leaseMillis)));
    }

    TaskQueueModifyTaskLeaseRequest request = new TaskQueueModifyTaskLeaseRequest();
    TaskQueueModifyTaskLeaseResponse response = new TaskQueueModifyTaskLeaseResponse();

    request.setQueueName(this.queueName);
    request.setTaskName(taskHandle.getName());
    request.setLeaseSeconds(leaseMillis / 1000.0);
    request.setEtaUsec(taskHandle.getEtaUsec());

    apiHelper.makeSyncCall("ModifyTaskLease", request, response);
    taskHandle.etaUsec(response.getUpdatedEtaUsec());
    return taskHandle;
  }

  private String formatLeaseTimeInSeconds(long milliSeconds) {
    long seconds = TimeUnit.SECONDS.convert(milliSeconds, TimeUnit.MILLISECONDS);
    long remainder = milliSeconds - TimeUnit.MILLISECONDS.convert(seconds, TimeUnit.SECONDS);
    String formatString = milliSeconds < 0 ? "-%01d.%03d" : "%01d.%03d";
    return String.format(formatString, Math.abs(seconds), Math.abs(remainder));
  }

  /**
   * See {@link Queue#fetchStatistics()}.
   */
  @Override
  public QueueStatistics fetchStatistics() {
    return getInternal(fetchStatisticsAsync(null));
  }

  /**
   * See {@link Queue#fetchStatisticsAsync(Double)}.
   */
  @Override
  public Future<QueueStatistics> fetchStatisticsAsync( Double deadlineInSeconds) {
    if (deadlineInSeconds == null) {
      deadlineInSeconds = DEFAULT_FETCH_STATISTICS_DEADLINE_SECONDS;
    }

    if (deadlineInSeconds <= 0.0) {
      throw new IllegalArgumentException("Deadline must be > 0, got " +
                                         deadlineInSeconds);
    }

    List<Queue> queues = Collections.<Queue>singletonList(this);
    Future<List<QueueStatistics>> future = QueueStatistics.fetchForQueuesAsync(
        queues, apiHelper, deadlineInSeconds);
    return extractSingleEntry(future);
  }

  <T extends ProtocolMessage<T>> Future<T> makeAsyncCall(
      String methodName, ProtocolMessage<?> request, T response) {
      return apiHelper.makeAsyncCall(methodName, request, response, new ApiConfig());
  }
}
