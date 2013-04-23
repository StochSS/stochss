// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.mail;

/**
 * Factory for creating a {@link MailService}.
 */
public interface IMailServiceFactory {

  /**
   * Returns an implementation of the {@link MailService}.
   * @return a mail service implementation.
   */
   MailService getMailService();
}
