// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.prospectivesearch;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityTranslator;
import com.google.appengine.api.prospectivesearch.ProspectiveSearchPb.*;
import com.google.apphosting.api.ApiProxy;
import com.google.common.util.Base64;
import com.google.io.protocol.ProtocolMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

/**
 * The ProspectiveSearchServiceImpl class is a proxy to a remote
 * Prospective Search service.  Calls are dispatched via AppEngine's
 * ApiProxy system.  All responses are checked for validity or a
 * RuntimeException is thrown.
 *
 */
class ProspectiveSearchServiceImpl implements ProspectiveSearchService {

  static final String PACKAGE = "matcher";

  static final Logger LOGGER = Logger.getLogger(ProspectiveSearchServiceImpl.class.getName());

  @Override
  public void subscribe(String topic,
                        String subId,
                        long leaseDurationSeconds,
                        String query,
                        Map<String, FieldType> schema)
      throws QuerySyntaxException {
    SubscribeRequest req = new SubscribeRequest();
    req.setTopic(topic);
    req.setSubId(subId);
    if (leaseDurationSeconds < 0) {
      throw new IllegalArgumentException("Lease duration must be non-negative: "
                                         + leaseDurationSeconds);
    }
    req.setLeaseDurationSec(leaseDurationSeconds);
    req.setVanillaQuery(query);

    for (Map.Entry<String, FieldType> entries : schema.entrySet()) {
      SchemaEntry entry = new SchemaEntry();
      entry.setName(entries.getKey());
      entry.setType(entries.getValue().internalType);
      req.addSchemaEntry(entry);
    }

    try {
      doCall("Subscribe", req, new SubscribeResponse());
    } catch (ApiProxy.ApplicationException e) {
      switch (ErrorPb.Error.ErrorCode.valueOf(e.getApplicationError())) {
      case BAD_REQUEST: throw new QuerySyntaxException(subId, topic, query, e.getErrorDetail());
      default: throw e;
      }
    }
  }

  @Override
  public void unsubscribe(String topic, String subId) {
    UnsubscribeRequest req = new UnsubscribeRequest();
    req.setTopic(topic);
    req.setSubId(subId);

    try {
      doCall("Unsubscribe", req, new UnsubscribeResponse());
    } catch (ApiProxy.ApplicationException e) {
      switch (ErrorPb.Error.ErrorCode.valueOf(e.getApplicationError())) {
      case BAD_REQUEST: throw new IllegalArgumentException(e.getErrorDetail());
      default: throw e;
      }
    }
  }

  @Override
  public void match(Entity entity, String topic) {
    match(entity, topic, "");
  }

  @Override
  public void match(Entity entity, String topic, String resultKey) {
    match(entity, topic, resultKey,
          DEFAULT_RESULT_RELATIVE_URL,
          DEFAULT_RESULT_TASK_QUEUE_NAME,
          DEFAULT_RESULT_BATCH_SIZE,
          true);
  }

  @Override
  public void match(Entity entity,
                    String topic,
                    String resultKey,
                    String relativeUrl,
                    String taskQueueName,
                    int batchSize,
                    boolean resultReturnDocument) {
    MatchRequest req = new MatchRequest();
    req.setDocument(EntityTranslator.convertToPb(entity));
    req.setTopic(topic);
    req.setResultKey(resultKey);
    req.setResultRelativeUrl(relativeUrl);
    req.setResultTaskQueue(taskQueueName);
    req.setResultBatchSize(batchSize);
    if (resultReturnDocument) {
      req.setResultPythonDocumentClass(MatchRequest.PythonDocumentClass.ENTITY);
    }

    doCall("Match", req, new MatchResponse());
  }

  @Override
  public List<Subscription> listSubscriptions(String topic) {
    return listSubscriptions(topic, "",
                             DEFAULT_LIST_SUBSCRIPTIONS_MAX_RESULTS,
                             0);
  }

  @Override
  public List<Subscription> listSubscriptions(String topic,
                                              String subIdStart,
                                              int maxResults,
                                              long expiresBefore) {
    ListSubscriptionsRequest req = new ListSubscriptionsRequest();
    req.setTopic(topic);
    req.setSubscriptionIdStart(subIdStart);
    req.setMaxResults(maxResults);
    if (expiresBefore > 0) {
      req.setExpiresBefore(expiresBefore);
    }
    ListSubscriptionsResponse rsp = new ListSubscriptionsResponse();

    doCall("ListSubscriptions", req, rsp);
    return convertSubscriptionList(rsp.subscriptions());
  }

  @Override
  public Subscription getSubscription(String topic, String subId) {
    List<Subscription> subs =
      listSubscriptions(topic, subId, 1, 0);
    if (subs.size() > 0) {
      Subscription sub = subs.get(0);
      if (sub.getId().equals(subId)) {
        return sub;
      }
    }
    throw new IllegalArgumentException(String.format("No such subscription topic: %s, id: %s",
                                                     topic, subId));
  }

  @Override
  public List<String> listTopics(String topicStart, long maxResults) {
    ListTopicsRequest req = new ListTopicsRequest();
    if (!topicStart.equals("")) {
      req.setTopicStart(topicStart);
    }
    req.setMaxResults(maxResults);
    ListTopicsResponse rsp = new ListTopicsResponse();
    doCall("ListTopics", req, rsp);
    return rsp.topics();
  }

  @Override
  public Entity getDocument(HttpServletRequest matchCallbackPost) {
    try {
      byte [] docBuf = Base64.decodeWebSafe(matchCallbackPost.getParameter("document").getBytes());
      return EntityTranslator.createFromPbBytes(docBuf);
    } catch (IllegalArgumentException e) {
      LOGGER.log(Level.WARNING, "Could not decode returned matching message.", e);
      return null;
    }
  }

  static void doCall(String name, ProtocolMessage<?> request, ProtocolMessage<?> response) {
    byte[] serializedResponse = ApiProxy.makeSyncCall(PACKAGE, name, request.toByteArray());
    if (!response.mergeFrom(serializedResponse)) {
      throw new ApiProxy.ArgumentException(PACKAGE, name);
    }
  }

  /**
   * Converts List<SubscriptionRecord> to List<Subscription>.
   */
  static List<Subscription> convertSubscriptionList(List<SubscriptionRecord> from) {
    List<Subscription> to = new ArrayList<Subscription>();
    for (SubscriptionRecord internal : from) {
      to.add(new Subscription(internal));
    }
    return to;
  }
}
