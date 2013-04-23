// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.users;

import java.io.Serializable;

/**
 * {@code User} represents a specific user, represented by the
 * combination of an email address and a specific Google Apps domain
 * (which we call an {@code authDomain}).  For normal Google login,
 * {@code authDomain} will be set to "gmail.com".
 *
 */
public final class User implements Serializable, Comparable<User> {
  static final long serialVersionUID = 8691571286358652288L;

  private String email;

  private String authDomain;

  private String userId;

  private String federatedIdentity;

  /**
   * This constructor exists for frameworks (e.g. Google Web Toolkit)
   * that require it for serialization purposes.  It should not be
   * called explicitly.
   */
  @SuppressWarnings("unused")
  private User() {
  }

  /**
   * Creates a new User.
   *
   * @param email a not {@code null} email address.
   * @param authDomain a not {@code null} domain name into which this
   * user has authenticated, or "gmail.com" for normal Google
   * authentication.
   */
  public User(String email, String authDomain) {
    this(email, authDomain, null);
  }

  /**
   * Creates a new User.
   *
   * @param email a not {@code null} email address.
   * @param authDomain a not {@code null} domain name into which this
   * user has authenticated, or "gmail.com" for normal Google
   * authentication.
   * @param userId a possibly-null string uniquely identifying the specified user.
   */
  public User(String email, String authDomain, String userId) {
    if (email == null) {
      throw new NullPointerException("email must be specified");
    }
    if (authDomain == null) {
      throw new NullPointerException("authDomain must be specified");
    }
    this.email = email;
    this.authDomain = authDomain;
    this.userId = userId;
  }

  /**
   * Creates a new User with a federated identity.
   *
   * @param email an optional field holding the user's email.
   * @param authDomain the URL of the identity provider. Could be null.
   * @param userId a unique id for this user. Could be null.
   * @param federatedIdentity a not {@code null} asserted federated identity.
   */
  public User(String email, String authDomain, String userId, String federatedIdentity) {
    if (federatedIdentity == null) {
      throw new NullPointerException("Identity must be specified");
    }
    if (authDomain == null) {
      this.authDomain = "";
    } else {
      this.authDomain = authDomain;
    }
    if (userId == null) {
      this.userId = "";
    } else {
      this.userId = userId;
    }
    this.email = email;
    this.federatedIdentity = federatedIdentity;
  }
  /**
   * Return this user's nickname.
   *
   * The nickname will be a unique, human readable identifier for this user
   * with respect to this application. It will be an email address for some
   * users, but not all.
   */
  public String getNickname() {
    int indexOfDomain = email.indexOf("@" + authDomain);
    if (indexOfDomain == -1) {
      return email;
    }
    return email.substring(0, indexOfDomain);
  }

  public String getAuthDomain() {
    return authDomain;
  }

  public String getEmail() {
    return email;
  }

  /**
   * Returns an opaque string that uniquely identifies the user
   * represented by this {@code User} object.
   *
   * <p>May be null if this {@code User} object was created explicitly
   * and no user ID was supplied.
   */
  public String getUserId() {
    return userId;
  }

  public String getFederatedIdentity() {
    return federatedIdentity;
  }

  @Override
  public String toString() {
    return email;
  }

  @Override
  public boolean equals(Object object) {
    if (!(object instanceof User)) {
      return false;
    }

    User user = (User) object;
    if ((federatedIdentity != null) && (!federatedIdentity.equals(""))) {
      return user.federatedIdentity.equals(federatedIdentity);
    }
    return user.email.equals(email) && user.authDomain.equals(authDomain);
  }

  @Override
  public int hashCode() {
    return 17 * email.hashCode() + authDomain.hashCode();
  }

  public int compareTo(User user) {
    return email.compareTo(user.email);
  }
}
