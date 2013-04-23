// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.prospectivesearch;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.taskqueue.QueueFactory;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

/**
 * The Prospective Search App Engine API exposes the real-time and
 * highly scalable Google Prospective Search Infrastructure as an App
 * Engine service. The ProspectiveSearch API allows an app to register
 * a set of queries (in a simple query format) to match against
 * documents that are presented. For every document presented, the
 * matcher will return the ids of all of the matching queries. To
 * allow the app to handle a potentially large number of matched
 * queries, the matched ids are enqueued as tasks on the TaskQueue.
 * The target for these match notifications is defined in the member
 * DEFAULT_RESULT_RELATIVE_URL.
 *
 */
public interface ProspectiveSearchService {

  /**
   * The default lease duration value of zero means no expiration.
   */
  public static final int DEFAULT_LEASE_DURATION_SEC = 0;
  public static final int DEFAULT_LIST_SUBSCRIPTIONS_MAX_RESULTS = 1000;
  public static final int DEFAULT_LIST_TOPICS_MAX_RESULTS = 1000;
  public static final int DEFAULT_RESULT_BATCH_SIZE = 100;

  /**
   * The default URI path to which matches will be POSTed.  Your
   * application should install a handler at this location.
   */
  public static final String DEFAULT_RESULT_RELATIVE_URL = "/_ah/prospective_search";

  /**
   * Uses the default task queue.  Equivalent to:
   *
   * com.google.appengine.api.taskqueue.QueueFactory.getDefaultQueue().getQueueName()
   */
  public static final String DEFAULT_RESULT_TASK_QUEUE_NAME =
    QueueFactory.getDefaultQueue().getQueueName();

  /**
   * The subscribe call is used to register subscriptions, which
   * comprise of a subscription id and a query. A delay of a few
   * seconds is expected between subscribe returning successfully and
   * the subscription being registered.  If this call returns without
   * throwing an exception the subscription will eventually be
   * registered.
   *
   * @param topic Specifies the namespace for the
   * subscription. Subscriptions of a particular topic will only be
   * matched against documents of the same topic.
   * @param subId Is a unique string for this subscription; subscribe
   * will overwrite subscriptions with the same subId.
   * @param query Is a query written in the simple query format.
   * @param leaseDurationSeconds Seconds before the subscription is
   * automatically removed or a value of 0 for no expiration.
   * @param schema Map of schema field names to their corresponding
   * types.
   * @throws QuerySyntaxException raised when query is invalid or does not
   * match schema.
   * @throws ApiProxy.ApplicationException Call failed.  See the
   * message detail for the reason.
   */
  void subscribe(String topic,
                 String subId,
                 long leaseDurationSeconds,
                 String query,
                 Map<String, FieldType> schema);

  /**
   * Subscriptions are removed from the system using the unsubscribe
   * call. A successful unsubscribe call guarantees that the
   * subscription will eventually be removed. A delay of a few seconds
   * is expected between the unsubscribe returning successfully and
   * the subscription being removed. Once the last subscription for a
   * given topic is removed, the topic also no longer exists.
   *
   * @param topic Must be the same as the topic of the subscription to
   * be removed.
   * @param subId Is the id of the subscription to remove.
   * @throws IllegalArgumentException if the given topic does not
   * exist or has no subscription with the given subId.
   * @throws ApiProxy.ApplicationException Call failed.  See the
   * message detail for the reason.
   */
  void unsubscribe(String topic, String subId);

  /**
   * Equivalent to:
   *
   *   match(entity, topic, "");
   *
   * @see #match(Entity, String, String)
   */
  void match(Entity document, String topic);

  /**
   * Equivalent to:
   *
   *   match(entity, topic, resultKey,
   *         DEFAULT_RESULT_RELATIVE_URL,
   *         DEFAULT_RESULT_TASK_QUEUE_NAME,
   *         DEFAULT_RESULT_BATCH_SIZE,
   *         true);
   *
   * @see #match(Entity, String, String, String, String, int, bool)
   */
  void match(Entity document, String topic, String resultKey);

  /**
   * The match call is used to present a document for matching against
   * all registered subscriptions of the same topic. The set of
   * subscriptions matched are enqueued in batches as tasks on the
   * TaskQueue.
   *
   * @param document To match.
   * @param topic Specifies the namespace for the subscriptions to
   * match. Subscriptions of a particular topic will only be matched
   * against documents of the same topic.
   * @param resultKey is a user defined key returned with the results
   * that can be used to associate the result batch with a particular
   * document.
   * @param resultRelativeUrl is the relative url on which to generate
   * the http POST event that delivers the result batch.
   * @param resultTaskQueue The TaskQueue to use for delivering results.
   * @param resultBatchSize specifies the maximum number of
   * subscription ids to put inside one result batch.
   * @throws ApiProxy.ApplicationException Call failed.  See the
   * message detail for the reason.
   */
  void match(Entity document,
             String topic,
             String resultKey,
             String resultRelativeUrl,
             String resultTaskQueueName,
             int resultBatchSize,
             boolean resultReturnDocument);

  /**
   * Equivalent to:
   *
   *   listSubscriptions(topic, "",
   *                     DEFAULT_LIST_SUBSCRIPTIONS_MAX_RESULTS,
   *                     0);
   *
   * @see #listSubscriptions(String, String, int, long)
   */
  List<Subscription> listSubscriptions(String topic);

  /**
   * The listSubscriptions call lists subscriptions that are currently
   * active.
   *
   * @param topic The topic specified should be the same as that used
   * in the subscribe call.
   * @param subIdStart Subscriptions which are lexicographically
   * greater or equal to the given value should be returned.  NOTE:
   * The empty string precedes all others.
   * @param maxResults Sets the maximum number of subscriptions that
   * should be returned.
   * @param expiresBefore Limits the returned subscriptions to those
   * that expire before the given time in seconds since epoch, or 0
   * for no expiration.
   * @return A list of subscriptions.
   * @throws ApiProxy.ApplicationException Call failed.  See the
   * message detail for the reason.
   */
  List<Subscription> listSubscriptions(String topic,
                                       String subIdStart,
                                       int maxResults,
                                       long expiresBefore);

  /**
   * Get subscription information.
   *
   * @param topic The associated topic.
   * @param subId The subscription ID to lookup.
   * @return The requested Subscription or {@code null} if the specified
   * subscription does not exist.
   * @throws IllegalArgumentExcpetion Subscription with specified id
   * does not exist.
   * @throws ApiProxy.ApplicationException Call failed.  See the
   * message detail for the reason.
   */
  Subscription getSubscription(String topic, String subId);

  /**
   * List all topics from a given offset to a given limit.  Topics
   * will be returned in lexicographic order from the first or given
   * start.
   *
   * @param topicStart The topic from which to start listing.
   * @param maxResults The maximum number of topics to return.  A good
   * default is 1000.
   * @return A list of topic names.
   * @throws ApiProxy.ApplicationException Call failed.  See the
   * message detail for the reason.
   */
  List<String> listTopics(String topicStart, long maxResults);

  /**
   * Decodes document from {@see #match(Entity, String, String,
   * String, String, int, bool)} result POST request.
   *
   * @param matchCallbackPost The received POST request.
   * @return The Entity that matched a subscription as the result of a
   * match call, or null if it cannot be decoded.
   */
  Entity getDocument(HttpServletRequest matchCallbackPost);
}
