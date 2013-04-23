// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.mail.dev.LocalMailService;
import com.google.appengine.tools.development.ApiProxyLocal;

import java.util.logging.Level;

/**
 * Config for accessing the local mail service in tests.
 * {@link #tearDown()} wipes out sent messages so that there is no state passed
 * between tests.
 *
 */
public class LocalMailServiceTestConfig implements LocalServiceTestConfig {

  private Boolean logMailBody;
  private Level logMailLevel;

  @Override
  public void setUp() {
    ApiProxyLocal proxy = LocalServiceTestHelper.getApiProxyLocal();
    if (logMailBody != null) {
      proxy.setProperty(LocalMailService.LOG_MAIL_BODY_PROPERTY, logMailBody.toString());
    }
    if (logMailLevel != null) {
      proxy.setProperty(LocalMailService.LOG_MAIL_LEVEL_PROPERTY, logMailLevel.getName());
    }
  }

  @Override
  public void tearDown() {
    LocalMailService mailService = getLocalMailService();
    mailService.clearSentMessages();
  }

  public Boolean getLogMailBody() {
    return logMailBody;
  }

  /**
   * Controls whether or not the message body is logged.
   * @param logMailBody
   * @return {@code this} (for chaining)
   */
  public LocalMailServiceTestConfig setLogMailBody(boolean logMailBody) {
    this.logMailBody = logMailBody;
    return this;
  }

  public Level getLogMailLevel() {
    return logMailLevel;
  }

  /**
   * Controls the level at which each message is logged.
   * @param logMailLevel
   * @return {@code this} (for chaining)
   */
  public LocalMailServiceTestConfig setLogMailLevel(Level logMailLevel) {
    this.logMailLevel = logMailLevel;
    return this;
  }

  public static LocalMailService getLocalMailService() {
    return (LocalMailService) LocalServiceTestHelper.getLocalService(
        LocalMailService.PACKAGE);
  }
}
