// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import org.apache.commons.httpclient.Cookie;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * {@link ClientLogin} implementation for use inside a standalone Java app.  We
 * use {@link HttpClient} to issue HTTP requests.
 *
 */
class StandaloneClientLogin extends ClientLogin {
  private static final int MAX_RESPONSE_SIZE = 1024 * 1024;

  StandaloneClientLogin() {}

  @Override
  PostResponse executePost(String url, List<String[]> postParams) throws IOException {
    PostMethod post = new PostMethod(url);
    for (String[] param : postParams) {
      post.addParameter(param[0], param[1]);
    }
    HttpClient client = new HttpClient();
    client.executeMethod(post);
    String body = post.getResponseBodyAsString(MAX_RESPONSE_SIZE);
    return new PostResponse(post.getStatusCode(), body);
  }

  @Override
  List<Cookie> getAppEngineLoginCookies(String url) throws IOException {
    GetMethod get = new GetMethod(url);
    get.setFollowRedirects(false);

    HttpClient client = new HttpClient();
    client.executeMethod(get);

    if (get.getStatusCode() == 302) {
      return new ArrayList<Cookie>(Arrays.asList(client.getState().getCookies()));
    } else {
      throw new LoginException("unexpected response from app engine: " + get.getStatusCode());
    }
  }
}
