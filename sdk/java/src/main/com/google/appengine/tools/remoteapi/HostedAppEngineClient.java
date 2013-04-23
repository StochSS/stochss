// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.remoteapi;

import com.google.appengine.api.urlfetch.HTTPHeader;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;

import org.apache.commons.httpclient.Cookie;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpMethodBase;

import java.io.IOException;
import java.net.URL;
import java.util.List;

/**
 * An {@link AppEngineClient} implementation that uses {@link URLFetchService}.
 * This implementation must be used when the client is an App Engine container
 * since URLFetchService is the only way to make HTTP requests in this
 * environment.
 *
 */
class HostedAppEngineClient extends AppEngineClient {

  private final URLFetchService urlFetch = URLFetchServiceFactory.getURLFetchService();

  HostedAppEngineClient(RemoteApiOptions options, List<Cookie> authCookies,
      String appId) {
    super(options, authCookies, appId);
  }

  private void addCookies(HTTPRequest req) {
    for (Cookie cookie : getAuthCookies()) {
      req.addHeader(
          new HTTPHeader("Cookie", String.format("%s=%s", cookie.getName(), cookie.getValue())));
    }
  }

  @Override
  Response get(String path) throws IOException {
    HTTPRequest req = new HTTPRequest(new URL(makeUrl(path)), HTTPMethod.GET);
    req.getFetchOptions().doNotFollowRedirects();
    for (String[] headerPair : getHeadersForGet()) {
      req.addHeader(new HTTPHeader(headerPair[0], headerPair[1]));
    }
    addCookies(req);
    HTTPResponse resp = urlFetch.fetch(req);
    return createResponse(resp);
  }

  @Override
  Response post(String path, String mimeType, byte[] body) throws IOException {
    HTTPRequest req = new HTTPRequest(new URL(makeUrl(path)), HTTPMethod.POST);
    req.getFetchOptions().doNotFollowRedirects();
    for (String[] headerPair : getHeadersForPost(mimeType)) {
      req.addHeader(new HTTPHeader(headerPair[0], headerPair[1]));
    }
    addCookies(req);
    req.setPayload(body);
    HTTPResponse resp = urlFetch.fetch(req);
    return createResponse(resp);
  }

  /**
   * A small hack to get access to
   * {@link HttpMethodBase#getContentCharSet(Header)} (which really ought to be
   * static) so that we don't need to write code to extract the charset out of
   * the Content-Type header.
   */
  private static class DummyMethod extends HttpMethodBase {
    private static final DummyMethod INSTANCE = new DummyMethod();
    static String getCharset(HTTPHeader header) {
      Header apacheHeader = new Header(header.getName(), header.getValue());
      return INSTANCE.getContentCharSet(apacheHeader);
    }

    @Override
    public String getName() {
      return "dummy";
    }
  }

  static Response createResponse(HTTPResponse resp) {
    byte[] body = resp.getContent();
    String charset = null;
    for (HTTPHeader header : resp.getHeaders()) {
      if (header.getName().toLowerCase().equals("content-type")) {
        charset = DummyMethod.getCharset(header);
        break;
      }
    }
    return new Response(resp.getResponseCode(), body, charset);
  }

}
