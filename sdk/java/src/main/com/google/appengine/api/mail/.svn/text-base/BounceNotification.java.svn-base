package com.google.appengine.api.mail;

import javax.mail.internet.MimeMessage;

/**
 * The {@code BounceNotification} object represents an incoming bounce
 * notification.
 *
 */
public final class BounceNotification {
  /**
   * The {@code BounceNotification.Details} class describes either the original
   * message that caused a bounce, or the notification message describing the
   * bounce.
   */
  public final static class Details {
    private final String from;
    private final String to;
    private final String subject;
    private final String text;

    private Details(String from, String to, String subject, String text) {
      this.from = from;
      this.to = to;
      this.subject = subject;
      this.text = text;
    }

    /**
     * @return the 'from' field for this detail item. Can be null.
     */
    public String getFrom() {
      return from;
    }

    /**
     * @return the 'to' field for this detail item. Can be null.
     */
    public String getTo() {
      return to;
    }

    /**
     * @return the 'subject' field for this detail item. Can be null.
     */
    public String getSubject() {
      return subject;
    }

    /**
     * @return the 'text' field for this detail item. Can be null.
     */
    public String getText() {
      return text;
    }
  }

  static class DetailsBuilder {
    private String from;
    private String to;
    private String subject;
    private String text;

    public Details build() {
      return new Details(from, to, subject, text);
    }

    public DetailsBuilder withFrom(String from) {
      this.from = from;
      return this;
    }

    public DetailsBuilder withTo(String to) {
      this.to = to;
      return this;
    }

    public DetailsBuilder withSubject(String subject) {
      this.subject = subject;
      return this;
    }

    public DetailsBuilder withText(String text) {
      this.text = text;
      return this;
    }
  }

  static class BounceNotificationBuilder {
    public BounceNotification build() {
      return new BounceNotification(rawMessage, original, notification);
    }

    public BounceNotificationBuilder withRawMessage(MimeMessage rawMessage) {
      this.rawMessage = rawMessage;
      return this;
    }

    public BounceNotificationBuilder withOriginal(BounceNotification.Details original) {
      this.original = original;
      return this;
    }

    public BounceNotificationBuilder withNotification(BounceNotification.Details notification) {
      this.notification = notification;
      return this;
    }

    private MimeMessage rawMessage;
    private BounceNotification.Details original;
    private BounceNotification.Details notification;
  }

  BounceNotification(MimeMessage rawMessage, Details original, Details notification) {
    this.rawMessage = rawMessage;
    this.original = original;
    this.notification = notification;
  }

  /**
   * @return the original MIME message that caused the bounce. Can be null.
   */
  public final MimeMessage getRawMessage() {
    return rawMessage;
  }

  /**
   * @return the parsed Details of the original message. Can be null.
   */
  public final Details getOriginal() {
    return original;
  }

  /**
   * @return the parsed Details describing the bounce. Can be null.
   */
  public final Details getNotification() {
    return notification;
  }

  private final MimeMessage rawMessage;
  private final Details original;
  private final Details notification;
}
