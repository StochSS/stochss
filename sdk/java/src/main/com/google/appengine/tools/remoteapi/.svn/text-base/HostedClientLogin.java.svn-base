// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.remoteapi;

import com.google.appengine.api.urlfetch.FetchOptions;
import com.google.appengine.api.urlfetch.HTTPHeader;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;

import org.apache.commons.httpclient.Cookie;
import org.apache.commons.httpclient.cookie.CookieSpecBase;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * {@link ClientLogin} implementation for use inside an App Engine container.
 * We use {@link URLFetchService} to issue HTTP requests since that's the only
 * way to do it from inside App Engine.
 *
 */
public class HostedClientLogin extends ClientLogin {

  private final URLFetchService fetchService = URLFetchServiceFactory.getURLFetchService();

  @Override
  PostResponse executePost(String urlStr, List<String[]> postParams) throws IOException {
    URL url = new URL(urlStr);
    StringBuilder payload = new StringBuilder();
    for (String[] param : postParams) {
      payload.append(String.format("%s=%s&", param[0], param[1]));
    }
    payload.setLength(payload.length() - 1);
    HTTPRequest req = new HTTPRequest(url, HTTPMethod.POST);
    req.setPayload(payload.toString().getBytes());
    HTTPResponse resp = fetchService.fetch(req);
    HostedAppEngineClient.Response response =
        HostedAppEngineClient.createResponse(resp);
    return new PostResponse(resp.getResponseCode(), response.getBodyAsString());
  }

  @Override
  List<Cookie> getAppEngineLoginCookies(String urlStr) throws IOException {
    FetchOptions fetchOptions = FetchOptions.Builder.doNotFollowRedirects();
    URL url = new URL(urlStr);
    HTTPRequest req = new HTTPRequest(url, HTTPMethod.GET, fetchOptions);
    HTTPResponse resp = fetchService.fetch(req);
    if (resp.getResponseCode() != 302) {
      throw new LoginException("unexpected response from app engine: " + resp.getResponseCode());
    }
    List<Cookie> cookies = new ArrayList<Cookie>();
    for (HTTPHeader header : resp.getHeaders()) {
      if (header.getName().toLowerCase().equals("set-cookie")) {
        CookieSpecBase spec = new CookieSpecBase();
        cookies.addAll(Arrays.asList(spec.parse(url.getHost(),
            url.getPort() == -1 ? 0 : url.getPort(), url.getPath(),
            url.getProtocol().equals("https"), header.getValue())));
      }
    }
    return cookies;
  }
}
