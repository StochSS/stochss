// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.remoteapi;

import org.apache.commons.httpclient.Cookie;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.ByteArrayRequestEntity;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;

import java.io.IOException;
import java.util.List;

/**
 * An {@link AppEngineClient} implementation that uses apache's
 * {@link HttpClient}.  This implementation must be used when the client is
 * not an App Engine container, since it cannot not rely on the availability of
 * the local urlfetch service.
 *
 */
class StandaloneAppEngineClient extends AppEngineClient {
  private final HttpClient httpClient;

  StandaloneAppEngineClient(RemoteApiOptions options, List<Cookie> authCookies, String appId) {
    super(options, authCookies, appId);
    HttpClient httpClient = new HttpClient(new MultiThreadedHttpConnectionManager());
    httpClient.getState().addCookies(getAuthCookies());
    this.httpClient = httpClient;
  }

  @Override
  Response get(String path) throws IOException {
    GetMethod method = new GetMethod(makeUrl(path));

    method.setFollowRedirects(false);
    addHeaders(method, getHeadersForGet());
    httpClient.executeMethod(method);
    return createResponse(method);
  }

  @Override
  Response post(String path, String mimeType, byte[] body)
      throws IOException {
    PostMethod post = new PostMethod(makeUrl(path));

    post.setFollowRedirects(false);
    addHeaders(post, getHeadersForPost(mimeType));
    post.setRequestEntity(new ByteArrayRequestEntity(body));
    httpClient.executeMethod(post);
    return createResponse(post);
  }

  private void addHeaders(HttpMethodBase method, List<String[]> headers) {
    for (String[] headerPair : headers) {
      method.addRequestHeader(headerPair[0], headerPair[1]);
    }
  }

  private Response createResponse(HttpMethodBase method) throws IOException {
    byte[] body = method.getResponseBody(getMaxResponseSize());
    return new Response(method.getStatusCode(),
        body, method.getResponseCharSet());
  }
}
