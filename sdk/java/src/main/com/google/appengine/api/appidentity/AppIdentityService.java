// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.appidentity;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

/**
 * The {@code AppIdentityService} allows you to sign arbitrary byte
 * array using per app private key maintained by App Egnine, and also
 * you can retrieve a list of public certificates which can be used to
 * verify the signature.
 *
 * <p>App Engine is responsible for maintaining per application
 * private key.  AppEngine will keep rotating private keys
 * periodically. App Engine never gives these private keys to outside.
 *
 * <p>Since private keys are rotated periodically,
 * {@link #getPublicCertificatesForApp} could return a list of public
 * certificates, it's caller's responsibility to try these
 * certificates one by one when doing signature verification.
 *
 */
public interface AppIdentityService {

  /**
   * {@code SigningResult} is returned by signForApp, which contains
   * signing key name and signature.
   */
  public static class SigningResult {
    private final String keyName;
    private byte[] signature;

    public SigningResult(String keyName, byte[] signature) {
      this.keyName = keyName;
      this.signature = signature;
    }

    public String getKeyName() {
      return keyName;
    }

    public byte[] getSignature() {
      return signature;
    }
  }

  /**
   * {@code GetAccessTokenResult} is returned by getAccessToken. It
   * contains the access token and the expiration time for the token.
   */
  public static class GetAccessTokenResult implements Serializable {
    private static final long serialVersionUID = 1311635361L;
    private final String accessToken;
    private final Date expirationTime;

    public GetAccessTokenResult(String accessToken, Date expirationTime) {
      this.accessToken = accessToken;
      this.expirationTime = expirationTime;
    }

    public String getAccessToken() {
      return accessToken;
    }

     public Date getExpirationTime() {
      return expirationTime;
    }
  }

  /**
   * Class holding the results of parsing a full application id into its constituent parts.
   * @see #parseFullAppId
   */
  public static final class ParsedAppId {
    private final String partition;
    private final String domain;
    private final String id;

    ParsedAppId(String partition, String domain, String id) {
      this.partition = partition;
      this.domain = domain;
      this.id = id;
    }

    /** Returns the partition the application runs in. */
    public String getPartition() {
      return partition;
    }

    /** Returns the application's domain or the empty string if no domain. */
    public String getDomain() {
      return domain;
    }

    /** Returns the display application id. */
    public String getId() {
      return id;
    }
  }

  /**
   * Requests to sign arbitrary byte array using per app private key.
   *
   * @param signBlob string blob.
   * @return a SigningResult object which contains signing key name and
   * signature.
   * @throws AppIdentityServiceFailureException
   */
  SigningResult signForApp(byte[] signBlob);

  /**
   * Retrieves a list of public certificates.
   *
   * @return a list of public certificates.
   * @throws AppIdentityServiceFailureException
   */
  Collection<PublicCertificate> getPublicCertificatesForApp();

  /**
   * Gets service account name of the app.
   *
   * @return service account name of the app.
   */
  String getServiceAccountName();

  /**
   * OAuth2 access token to act on behalf of the application, uncached.
   *
   * Most developers should use getAccessToken instead.
   *
   * @param scopes iterable of scopes to request.
   * @return a GetAccessTokenResult object with the access token and expiration
   * time.
   * @throws AppIdentityServiceFailureException
   */
  GetAccessTokenResult getAccessTokenUncached(Iterable<String> scopes);

  /**
   * OAuth2 access token to act on behalf of the application.
   *
   * Generates and caches an OAuth2 access token for the service account for the
   * appengine application.
   *
   * Each application has an associated Google account. This function returns
   * OAuth2 access token corresponding to the running app. Access tokens are
   * safe to cache and reuse until their expiry time as returned. This method
   * will do that using memcache.
   *
   * @param scopes iterable of scopes to request.
   * @return a GetAccessTokenResult object with the access token and expiration
   * time.
   * @throws AppIdentityServiceFailureException
   */
  GetAccessTokenResult getAccessToken(Iterable<String> scopes);

  /**
   * Parse a full app id into partition, domain name and display app_id.
   *
   * @param fullAppId The full partitioned app id.
   * @return An {@link ParsedAppId} instance with the parsing results.
   */
  ParsedAppId parseFullAppId(String fullAppId);
}
