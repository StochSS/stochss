// Copyright 2008 Google Inc. All rights reserved.

package com.google.appengine.api.mail;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Factory for creating a {@link MailService}.
 */
public class MailServiceFactory {

  /**
   * Returns an implementation of the {@link MailService}.
   * @return a mail service implementation.
   */
  public static MailService getMailService() {
    return getFactory().getMailService();
  }

  private static IMailServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IMailServiceFactory.class);
  }
}
