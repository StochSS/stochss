// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ConnectOptions;
import com.google.appengine.tools.util.ClientCookie;
import com.google.appengine.tools.util.ClientCookieManager;
import com.google.common.annotations.VisibleForTesting;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.prefs.Preferences;

/**
 */
public class ClientLoginServerConnection extends AbstractServerConnection {

  /**
   * Exception type for email/password mismatch failures.
   */
  public class ClientAuthFailException extends ClientLoginException {
    public ClientAuthFailException(String s) {
      super(s);
    }

    public ClientAuthFailException(String s, Throwable t) {
      super(s, t);
    }
  }
  /**
   * Exception type for login failures.
   */
  public class ClientLoginException extends IOException {
    public ClientLoginException(String s) {
      super(s);
    }

    public ClientLoginException(String s, Throwable t) {
      super(s, t);
    }
  }

  protected ClientCookieManager cookies;

  public ClientLoginServerConnection(ConnectOptions options) {
    super(options);
    cookies = options.getCookies();
    if (cookies == null) {
      cookies = new ClientCookieManager();
    }
  }

  /**
   * Authenticates the user.
   *
   * The authentication process works as follows: 1) We get a username and
   * password from the user 2) We use ClientLogin to obtain an AUTH token for
   * the user 3) We pass the auth token to /_ah/login on the server to obtain an
   * authentication cookie. If login was successful, it tries to redirect us to
   * the URL we provided.
   *
   * If we attempt to access the upload API without first obtaining an
   * authentication cookie, it returns a 401 response and directs us to
   * authenticate ourselves with ClientLogin.
   *
   * @param url which require authentication
   * @param account_type
   * @see <a
   *      href="http://code.google.com/apis/accounts/AuthForInstalledApps.html"></a>
   */
  private void authenticate(URL url, String account_type) throws ClientLoginException,
      IOException {
    for (int unused = 1;; ++unused) {
      try {
        String authToken = getAuthToken(url.getHost(), account_type);
        getAuthCookie(authToken);
        break;
      } catch (ClientLoginException e) {
        if (unused >= 3) {
          throw e;
        }
      }
    }
    checkAuthCookie(url);
  }

  @VisibleForTesting
  void checkAuthCookie(URL url) throws ClientLoginException {
    long minExpireTime = System.currentTimeMillis() + 60 * 1000;
    Iterator<ClientCookie> li = cookies.getCookies();
    while (li.hasNext()) {
      final ClientCookie cookie = li.next();
      if (cookie.getExpirationTime() > minExpireTime && cookie.match(url)) {
        return;
      }
    }

    throw new ClientLoginException("This system's clock appears to be set incorrectly. "+
                                   "Check the system time and set it to the correct time " +
                                   "before trying again.");
  }

  @Override
  protected void doHandleSendErrors(int status, URL url, HttpURLConnection conn,
      BufferedReader connReader) throws IOException {
    if (status == 401) {
      authenticate(url, null);
    } else if (status == 403) {
      System.out.println(constructHttpErrorMessage(conn, connReader));
      authenticate(url, null);
    } else if (status >= 500 && status <= 600) {
    } else if (status == 302) {
      Map<String, List<String>> headers = conn.getHeaderFields();
      String location = headers.get("Location").get(0);
      if (location.startsWith("https://www.google.com/accounts/ServiceLogin")) {
        authenticate(url, null);
      } else if (location.matches("https://www.google.com/a/[a-z0-9.-]+/ServiceLogin.*")) {
        authenticate(url, "HOSTED");
      }
    }
  }

  @Override
  protected void doPostConnect(String method, HttpURLConnection conn, DataPoster data)
      throws IOException {
    cookies.readCookies(conn);
    if (options.getUsePersistedCredentials()) {
      saveCookies();
    }
  }

  @Override
  protected void doPreConnect(String method, HttpURLConnection conn, DataPoster data) {
    cookies.writeCookies(conn);
  }

  private void getAuthCookie(String token) throws IOException {
    Map<String, String> params = new HashMap<String, String>();
    params.put("continue", "http://localhost/");
    params.put("auth", token);
    String query = buildQuery(params);
    URL url = buildURL("/_ah/login?" + query);
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    if (options.getHost() != null) {
      conn.setRequestProperty("Host", options.getHost());
    }

    IOException ioe = connect(POST, conn, null);
    if (conn.getResponseCode() != 302
        || !"http://localhost/".equals(conn.getHeaderField("Location"))) {
      throw new RuntimeException("Bad authentication response: " + conn.getResponseCode() + " "
          + conn.getResponseMessage());
    } else if (ioe != null) {
      throw ioe;
    }

  }

  private String getAuthToken(String host, String accountType) throws IOException,
      ClientLoginException {
    if (accountType == null) {
      if (host.endsWith(".google.com")) {
        accountType = "HOSTED_OR_GOOGLE";
      } else if (options.getHost() != null && options.getHost().endsWith(".google.com")) {
        accountType = "HOSTED_OR_GOOGLE";
      } else {
        accountType = "GOOGLE";
      }
    }
    URL url = new URL("https://www.google.com/accounts/ClientLogin");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();

    String password = options.getPasswordPrompt().getPassword();
    Map<String, String> params = new HashMap<String, String>();
    params.put("Email", options.getUserId());
    params.put("Passwd", password);
    params.put("service", "ah");
    params.put("source", "Google-appcfg-java-unknown");
    params.put("accountType", accountType);
    IOException ioe = connect(POST, conn, new StringPoster(buildQuery(params)));

    BufferedReader reader = getReader(conn);
    HashMap<String, String> response = new HashMap<String, String>();
    String line = null;
    while ((line = reader.readLine()) != null) {
      String[] pair = line.split("=", 2);
      if (pair.length == 2) {
        response.put(pair[0], pair[1]);
      }
    }

    if (conn.getResponseCode() == 200) {
      return response.get("Auth");
    } else if (conn.getResponseCode() == 403) {
      String reason = response.get("Error");
      if ("BadAuthentication".equals(reason)) {
        String info = response.get("Info");
        if ("InvalidSecondFactor".equals(info)) {
          throw new ClientLoginException(""
              + "Use an application-specific password instead of your regular account password. "
              + "See http://www.google.com/support/accounts/bin/answer.py?answer=185833",
              ioe);
        }
        else {
          throw new ClientLoginException("Email \"" + options.getUserId()
              + "\" and password do not match.", ioe);
        }
      } else if ("CaptchaRequired".equals(reason)) {
        throw new ClientLoginException("Please go to "
            + "https://www.google.com/accounts/DisplayUnlockCaptcha "
            + "and verify you are a human. Then try again.");
      } else if ("NotVerified".equals(reason)) {
        throw new ClientLoginException("Your account has not yet been "
            + "verfied. Please check your email to do that, then try again.");
      } else if ("TermsNotAgreed".equals(reason)) {
        throw new ClientLoginException("You have not yet agreed to the "
            + "Terms of Service on your account. Please do that, then try again.");
      } else if ("AccountDeleted".equals(reason)) {
        throw new ClientLoginException("Your user account has been deleted."
            + " If this is an error, contact account support at "
            + "http://www.google.com/support/accounts/");
      } else if ("AccountDisabled".equals(reason)) {
        throw new ClientLoginException("Your user account has been disabled."
            + " If this is an error, contact account support at "
            + "http://www.google.com/support/accounts/");
      } else if ("ServiceUnavailable".equals(reason)) {
        throw new ClientLoginException("The service is currently "
            + "unavailable; try again later.");
      }
      throw new ClientLoginException(response.get("Error"), ioe);
    } else if (conn.getResponseCode() == 401) {
      throw new ClientAuthFailException("Email \"" + options.getUserId()
          + "\" and password do not match.", ioe);
    } else {
      throw new RuntimeException("Bad authentication response: " + conn.getResponseCode() + " "
          + conn.getResponseMessage(), ioe);
    }
  }

  public void saveCookies() throws IOException {
    if (options.getUserId() == null) {
      return;
    }
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    new ObjectOutputStream(out).writeObject(cookies);
    byte[] bytes = out.toByteArray();
    Preferences prefs = Preferences.userNodeForPackage(ServerConnection.class);
    prefs.put("email", options.getUserId());
    prefs.putByteArray("cookies", bytes);
  }
}
