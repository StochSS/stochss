// Copyright 2008 Google Inc. All rights reserved.

package com.google.appengine.api.mail;

import com.google.appengine.api.mail.MailServicePb.MailAttachment;
import com.google.appengine.api.mail.MailServicePb.MailHeader;
import com.google.appengine.api.mail.MailServicePb.MailMessage;
import com.google.appengine.api.mail.MailServicePb.MailServiceError.ErrorCode;
import com.google.apphosting.api.ApiProxy;

import java.io.IOException;

/**
 * This class implements raw access to the mail service.
 * Applications that don't want to make use of Sun's JavaMail
 * can use it directly -- but they will forego the typing and
 * convenience methods that JavaMail provides.
 *
 */
class MailServiceImpl implements MailService {
  static final String PACKAGE = "mail";

  /** {@inheritDoc} */
  @Override
  public void sendToAdmins(Message message)
      throws IllegalArgumentException, IOException {
    doSend(message, true);
  }

  /** {@inheritDoc} */
  @Override
  public void send(Message message)
      throws IllegalArgumentException, IOException {
    doSend(message, false);
  }

  /**
   * Does the actual sending of the message.
   * @param message The message to be sent.
   * @param toAdmin Whether the message is to be sent to the admins.
   */
  private void doSend(Message message, boolean toAdmin)
      throws IllegalArgumentException, IOException {

    MailMessage msgProto = new MailMessage();
    if (message.getSender() != null) {
      msgProto.setSender(message.getSender());
    }
    if (message.getTo() != null) {
      for (String to : message.getTo()) {
        msgProto.addTo(to);
      }
    }
    if (message.getCc() != null) {
      for (String cc : message.getCc()) {
        msgProto.addCc(cc);
      }
    }
    if (message.getBcc() != null) {
      for (String bcc : message.getBcc()) {
        msgProto.addBcc(bcc);
      }
    }
    if (message.getReplyTo() != null) {
      msgProto.setReplyTo(message.getReplyTo());
    }
    if (message.getSubject() != null) {
      msgProto.setSubject(message.getSubject());
    }
    if (message.getTextBody() != null) {
      msgProto.setTextBody(message.getTextBody());
    }
    if (message.getHtmlBody() != null) {
      msgProto.setHtmlBody(message.getHtmlBody());
    }
    if (message.getAttachments() != null) {
      for (Attachment attach : message.getAttachments()) {
        MailAttachment attachProto = new MailAttachment();
        attachProto.setFileName(attach.getFileName());
        attachProto.setDataAsBytes(attach.getData());
        msgProto.addAttachment(attachProto);
      }
    }
    if (message.getHeaders() != null) {
      for (Header header : message.getHeaders()) {
        MailHeader headerProto = new MailHeader();
        headerProto.setName(header.getName());
        headerProto.setValue(header.getValue());
        msgProto.addHeader(headerProto);
      }
    }

    byte[] msgBytes = msgProto.toByteArray();
    try {
      if (toAdmin) {
        ApiProxy.makeSyncCall(PACKAGE, "SendToAdmins", msgBytes);
      } else {
        ApiProxy.makeSyncCall(PACKAGE, "Send", msgBytes);
      }
    } catch (ApiProxy.ApplicationException ex) {
      switch (ErrorCode.valueOf(ex.getApplicationError())) {
        case BAD_REQUEST:
          throw new IllegalArgumentException("Bad Request: " +
                                             ex.getErrorDetail());
        case UNAUTHORIZED_SENDER:
          throw new IllegalArgumentException("Unauthorized Sender: " +
                                             ex.getErrorDetail());
        case INVALID_ATTACHMENT_TYPE:
          throw new IllegalArgumentException("Invalid Attachment Type: " +
                                             ex.getErrorDetail());
        case INVALID_HEADER_NAME:
          throw new IllegalArgumentException("Invalid Header Name: " +
                                             ex.getErrorDetail());
        case INTERNAL_ERROR:
        default:
          throw new IOException(ex.getErrorDetail());
      }
    }
  }
}
