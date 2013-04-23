// Copyright (c) 2011-2012 Google Inc.

package com.google.appengine.tools.admin;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.CredentialStore;
import com.google.api.client.auth.oauth2.TokenResponseException;
import com.google.api.client.extensions.java6.auth.oauth2.FileCredentialStore;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.google.common.base.Preconditions;

import java.awt.Desktop;
import java.awt.Desktop.Action;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.Arrays;

/**
 * Implements OAuth authentication "native" flow recommended for installed clients in which the end
 * user must grant access in a web browser and then copy a code into the application.
 *
 * <p>
 * Warning: the client ID and secret are not secured and are plainly visible to users.
 * It is a hard problem to secure client credentials in installed applications.
 * </p>
 *
 */
public class OAuth2Native {
  /**
   * Browser to open in case {@link Desktop#isDesktopSupported()} is {@code false} or {@code null}
   * to prompt user to open the URL in their favorite browser.
   */
  private static final String BROWSER = "google-chrome";

  protected static final String OAUTH2_CLIENT_ID = "550516889912.apps.googleusercontent.com";
  protected static final String OAUTH2_CLIENT_SECRET = "ykPq-0UYfKNprLRjVx1hBBar";
  protected static final String OAUTH2_SCOPE = "https://www.googleapis.com/auth/appengine.admin";
  protected static final long MIN_EXPIRES_SECONDS = 300;

  /** Token store filename. */
  protected static final String TOKEN_STORE_BASE = ".appcfg_oauth2_tokens_java";

  /** Google client secrets. */
  private static final GoogleClientSecrets DEFAULT_CLIENT_SECRETS =
      createClientSecrets(OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET);

  private GoogleClientSecrets clientSecrets;
  private String refreshTokenOverride;

  private GoogleAuthorizationCodeFlow flow;
  private final VerificationCodeReceiver receiver;
  private final String userId;

  /**
   * Creates the client secrets used for authentication
   *
   * @param clientIdOverride The client id to use
   * @param clientSecretOverride The client secret to use
   * @return The client secrets
   */
  private static GoogleClientSecrets createClientSecrets(
      final String clientIdOverride, final String clientSecretOverride) {
    return new GoogleClientSecrets().setInstalled(new GoogleClientSecrets.Details().setClientId(
        clientIdOverride).setClientSecret(clientSecretOverride));
  }

  public OAuth2Native(boolean usePersistedCredentials) {
    this(usePersistedCredentials, null, null, null);
  }

  /**
   * Initialize a native OAuth2 flow using the specific client id and client secret provided.
   *
   * @param usePersistedCredentials {@code true} to use a file to store credentials, {@code false}
   *        otherwise
   * @param clientIdOverride A client id to use for authentication requests or {@code null} to use
   *        the default for this application. If provided, {@code clientSecretOverride} must also be
   *        provided.
   * @param clientSecretOverride A client secret to use for authentication requests or {@code null}
   *        to use the default for this application. If provided, {@code clientIdOverride} must also
   *        be provided.
   * @param refreshTokenOverride An alternate oauth2 refresh token to use for authorization or
   *        {@code null} to use the default token from the credential store.
   */
  public OAuth2Native(boolean usePersistedCredentials, String clientIdOverride,
      String clientSecretOverride, String refreshTokenOverride) {
    this(new PromptReceiver(), System.getProperty("user.name"), null);

    Preconditions.checkArgument(!(clientIdOverride == null ^ clientSecretOverride == null),
        "If either is given, both a client id and a client secret must be provided");

    if (clientIdOverride != null) {
      clientSecrets = createClientSecrets(clientIdOverride, clientSecretOverride);
    }

    Preconditions.checkArgument(refreshTokenOverride == null || !usePersistedCredentials,
        "A credential store cannot be used when overriding the refresh token");

    this.refreshTokenOverride = refreshTokenOverride;

    try {
      flow = getAuthorizationCodeFlow(usePersistedCredentials);
    } catch (IOException e) {
      System.err.println("Error creating the Authorization Flow: " + e);
    } catch (IllegalArgumentException e) {
      if (exceptionMentionsJson(e)) {
        System.err.format("The credentials file is malformed. Please delete the file '%s'.%n",
                          getTokenStoreFile());
      } else {
        throw e;
      }
    }
  }

  public OAuth2Native(VerificationCodeReceiver receiver, String userId,
                      GoogleAuthorizationCodeFlow flow) {
    this.receiver = receiver;
    this.userId = userId;
    this.flow = flow;
    this.clientSecrets = DEFAULT_CLIENT_SECRETS;
    this.refreshTokenOverride = null;
  }

  /**
   * @return the Google client secrets.
   */
  public GoogleClientSecrets getClientSecrets() {
    return clientSecrets;
  }

  /**
   * @return a File representing the token store file name in the user's home directory.
   */
  protected File getTokenStoreFile() {
    String userDir = System.getProperty("user.home");
    return new File(userDir, TOKEN_STORE_BASE);
  }

  /**
   * Returns the CredentialStore to be used when calling
   * {@link OAuth2Native#getAuthorizationCodeFlow(boolean)} with parameter {@code true}.
   */
  protected CredentialStore getCredentialStore(JsonFactory jsonFactory) throws IOException {
    return new FileCredentialStore(getTokenStoreFile(), jsonFactory);
  }

  /**
   * Creates an authorization code flow with the right CredentialStore based on the argument.
   *
   * @param usePersistedCredentials whether or not to persist the credentials
   * @return a GoogleAuthorizationCodeFlow
   */
  protected GoogleAuthorizationCodeFlow getAuthorizationCodeFlow(boolean usePersistedCredentials)
      throws IOException {
    HttpTransport httpTransport = new NetHttpTransport();
    JsonFactory jsonFactory = new JacksonFactory();
    Iterable<String> scopes = Arrays.asList(OAUTH2_SCOPE);
    GoogleClientSecrets clientSecrets = getClientSecrets();
    GoogleAuthorizationCodeFlow flow;
    if (usePersistedCredentials) {
      flow = new GoogleAuthorizationCodeFlow.Builder(
        httpTransport, jsonFactory, clientSecrets, scopes).setAccessType("offline")
        .setApprovalPrompt("force").setCredentialStore(getCredentialStore(jsonFactory)).build();
    } else {
      flow = new GoogleAuthorizationCodeFlow.Builder(
        httpTransport, jsonFactory, clientSecrets, scopes).setAccessType("online")
        .setApprovalPrompt("auto").build();
    }
    return flow;
  }

  /**
   * Checks if an exception mention JSON in its message. This method is intended to detect a
   * specific code path and is somewhat fragile.
   *
   * @param  exception the exception to check
   * @return           true if the exception mentions JSON in its message, false otherwise.
   */
  private static boolean exceptionMentionsJson(Exception exception) {
    return exception.getMessage().toLowerCase().indexOf("json") >= 0;
  }

  /**
   * Calls the method refreshToken if there is no access token or if the token is close to expire.
   * Returns true if refreshToken was called. If the token was refreshed and credentialStore is not
   * null, it saves the updated credential.
   *
   * @param  credential the credential to check
   * @return            whether the credential was refreshed or not
   */
  protected boolean refreshCredentialIfNeeded(Credential credential) throws IOException {
    if (credential != null) {
      Long expiresInSeconds = credential.getExpiresInSeconds();
      if (credential.getAccessToken() == null || expiresInSeconds == null ||
          expiresInSeconds < MIN_EXPIRES_SECONDS) {
        credential.refreshToken();

        if (flow.getCredentialStore() != null) {
          flow.getCredentialStore().store(userId, credential);
        }

        return true;
      }
    }
    return false;
  }

  /**
   * Authorizes the installed application to access user's protected data.
   *
   * @return a credential with the accesToken or null if no authorization token could be obtained.
   */
  public Credential authorize(){
    if (flow == null) {
      return null;
    }
    try {
      String redirectUri = receiver.getRedirectUri();

      final Credential credential = getCredential();
      refreshCredentialIfNeeded(credential);
      if (credential != null && credential.getAccessToken() != null){
        return credential;
      }

      browse(flow.newAuthorizationUrl().setRedirectUri(redirectUri).build());
      String code = receiver.waitForCode();
      GoogleTokenResponse response =
          flow.newTokenRequest(code).setRedirectUri(redirectUri).execute();
      return flow.createAndStoreCredential(response, userId);
    } catch (TokenResponseException e) {
      System.err.format("Either the access code is invalid or the OAuth token is revoked." +
                        "Details: %s%n.", e.getDetails().getError());
    } catch (IOException e) {
      System.err.println(e);
    } catch (VerificationCodeReceiverRedirectUriException e) {
      System.err.println(e.getMessage());
    } finally {
      try {
        receiver.stop();
      } catch (VerificationCodeReceiverStopException e) {
        System.err.println(e.getMessage());
      }
    }
    return null;
  }

  /**
   * Gets a new credential either from the configured credential store, or with a specific refresh
   * token.
   *
   * @return A newly created and credential
   * @throws IOException
   */
  Credential getCredential() throws IOException {
    if (refreshTokenOverride == null) {
      return flow.loadCredential(userId);
    }

    final Credential credential =
        new Credential.Builder(flow.getMethod()).setTransport(flow.getTransport())
            .setJsonFactory(flow.getJsonFactory())
            .setTokenServerEncodedUrl(flow.getTokenServerEncodedUrl())
            .setClientAuthentication(flow.getClientAuthentication())
            .setRequestInitializer(flow.getRequestInitializer())
            .setClock(flow.getClock())
            .build();
    credential.setRefreshToken(refreshTokenOverride);

    return credential;
  }

  /**
   * Open a browser at the given URL.
   * <p>
   * It attempts to open the browser using {@link Desktop#isDesktopSupported()}.
   * If that fails, on Windows it tries {@code rundll32}. If that fails, it opens the browser
   * specified in {@link #BROWSER}.
   * Note though that currently we've only tested this code with Google Chrome (hence this is the
   * default value).
   * </p>
   *
   * @param url absolute url to open in the browser
   */
  protected void browse(String url) {
    if (Desktop.isDesktopSupported()) {
      Desktop desktop = Desktop.getDesktop();
      if (desktop.isSupported(Action.BROWSE)) {
        try {
          desktop.browse(URI.create(url));
          return;
        } catch (IOException e) {
        }
      }
    }
    try {
      Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
      return;
    } catch (IOException e) {
    }
    if (BROWSER != null) {
      try {
        Runtime.getRuntime().exec(new String[] {BROWSER, url});
        return;
      } catch (IOException e) {
      }
    }
    System.out.format("Please open the following URL in your browser:%n  %s%n", url);
  }
}
