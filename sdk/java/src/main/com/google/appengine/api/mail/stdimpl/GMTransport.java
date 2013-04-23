// Copyright 2008 Google Inc. All rights reserved.

package com.google.appengine.api.mail.stdimpl;

import com.google.appengine.api.mail.MailService;
import com.google.appengine.api.mail.MailServiceFactory;

import com.google.common.base.Joiner;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Header;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.SendFailedException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.URLName;
import javax.mail.event.TransportEvent;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.mail.internet.MimeMultipart;

/**
 * Implementation of the 'Google Message Transport' which really just
 * connects to the exposed MailService and uses it to deliver a message.
 * <p>
 * The special destination address "admins" results in a delivery
 * of the message to the owners of the application.
 * <p>
 * Note that most RFC822 headers are silently ignored.
 *
 *
 */
public class GMTransport extends Transport {

  private static final String ADMINS_ADDRESS = "admins";

  private static final String[] HEADERS_WHITELIST = new String[] {
      "In-Reply-To", "List-Id", "List-Unsubscribe", "On-Behalf-Of",
      "References", "Resent-Date", "Resent-From", "Resent-To"};

  public GMTransport(Session session, URLName urlName) {
    super(session, urlName);
  }

  /** {@inheritDoc} */
  @Override
  protected boolean protocolConnect(String host, int port,
      String user, String password) {
    return true;
  }

  /** {@inheritDoc} */
  @Override
  public void sendMessage(Message message, Address[] addresses)
      throws MessagingException {
    MailService service = MailServiceFactory.getMailService();
    MailService.Message msg = new MailService.Message();

    String sender = null;
    if (message instanceof MimeMessage) {
      Address senderAddr = ((MimeMessage) message).getSender();
      if (senderAddr != null) {
        sender = senderAddr.toString();
      }
    }
    if (sender == null && message.getFrom() != null
        && message.getFrom().length > 0) {
      sender = message.getFrom()[0].toString();
    }
    msg.setSender(sender);

    try {
      msg.setReplyTo(Joiner.on(", ").useForNull("null").join(message.getReplyTo()));
    } catch (NullPointerException e) {
    }

    boolean toAdmins = false;
    Address[] allRecipients = message.getAllRecipients();
    if (allRecipients != null) {
      for (Address addr : allRecipients) {
        if (ADMINS_ADDRESS.equals(addr.toString())) {
          toAdmins = true;
        }
      }
    }

    if (!toAdmins) {
      Set<String> allAddresses = new HashSet<String>();
      for (Address addr : addresses) {
        allAddresses.add(addr.toString());
      }
      msg.setTo(convertAddressFields(message.getRecipients(RecipientType.TO), allAddresses));
      msg.setCc(convertAddressFields(message.getRecipients(RecipientType.CC), allAddresses));
      msg.setBcc(convertAddressFields(message.getRecipients(RecipientType.BCC), allAddresses));
    }

    msg.setSubject(message.getSubject());

    Object textObject = null;
    Object htmlObject = null;
    String textType = null;
    String htmlType = null;
    Multipart otherMessageParts = null;

    List<MailService.Header> headers = new ArrayList<MailService.Header>();
    Enumeration originalHeaders = message.getMatchingHeaders(HEADERS_WHITELIST);
    while (originalHeaders.hasMoreElements()) {
      Header header = (Header) originalHeaders.nextElement();
      headers.add(new MailService.Header(header.getName(), header.getValue()));
    }
    msg.setHeaders(headers);

    if (message.getContentType() == null) {
      try {
        textObject = message.getContent();
        textType = message.getContentType();
      } catch (IOException e) {
        throw new MessagingException("Getting typeless content failed", e);
      }
    } else if (message.isMimeType("text/html")) {
      try {
        htmlObject = message.getContent();
        htmlType = message.getContentType();
      } catch (IOException e) {
        throw new MessagingException("Getting html content failed", e);
      }
    } else if (message.isMimeType("text/*")) {
      try {
        textObject = message.getContent();
        textType = message.getContentType();
      } catch (IOException e) {
        throw new MessagingException("Getting text/* content failed", e);
      }
    } else if (message.isMimeType("multipart/*")) {
      Multipart mp;
      try {
        mp = (Multipart) message.getContent();
        for (int i = 0; i < mp.getCount(); i++) {
          BodyPart bp = mp.getBodyPart(i);
          if (bp.isMimeType("text/plain") && textObject == null) {
            textObject = bp.getContent();
            textType = bp.getContentType();
          } else if (bp.isMimeType("text/html") && htmlObject == null) {
            htmlObject = bp.getContent();
            htmlType = bp.getContentType();
          } else {
            if (otherMessageParts == null) {
              String type = mp.getContentType();
              assert (type.startsWith("multipart/"));
              otherMessageParts = new MimeMultipart(
                  type.substring("multipart/".length()));
            }
            otherMessageParts.addBodyPart(bp);
          }
        }
      } catch (IOException e) {
        throw new MessagingException("Getting multipart content failed", e);
      }
    }

    if (textObject != null) {
      if (textObject instanceof String) {
        msg.setTextBody((String) textObject);
      } else if (textObject instanceof InputStream) {
        try {
          msg.setTextBody(inputStreamToString((InputStream) textObject, textType));
        } catch (IOException e) {
          throw new MessagingException("Stringifying text body failed", e);
        }
      } else {
        throw new MessagingException("Converting text body failed");
      }
    }

    if (htmlObject != null) {
      if (htmlObject instanceof String) {

        msg.setHtmlBody((String) htmlObject);
      } else if (htmlObject instanceof InputStream) {
        try {
          msg.setHtmlBody(inputStreamToString((InputStream) htmlObject, htmlType));
        } catch (IOException e) {
          throw new MessagingException("Stringifying html body failed", e);
        }
      } else {
        throw new MessagingException("Converting html body failed");
      }
    }

    if (otherMessageParts != null) {
      ArrayList<MailService.Attachment> attachments =
          new ArrayList<MailService.Attachment>(otherMessageParts.getCount());
      for (int i = 0; i < otherMessageParts.getCount(); i++) {
        BodyPart bp = otherMessageParts.getBodyPart(i);
        String name = bp.getFileName();
        byte[] data;
        try {
          Object o = bp.getContent();
          if (o instanceof InputStream) {
            data = inputStreamToBytes((InputStream) o);
          } else if (o instanceof String) {
              data = ((String) o).getBytes();
          } else {
            throw new MessagingException("Converting attachment data failed");
          }
        } catch (IOException e) {
          throw new MessagingException("Extracting attachment data failed", e);
        }
        MailService.Attachment attachment =
            new MailService.Attachment(name, data);
        attachments.add(attachment);
      }
      msg.setAttachments(attachments);
    }

    try {
      if (toAdmins) {
        service.sendToAdmins(msg);
      } else {
        service.send(msg);
      }
    } catch (IOException e) {
      notifyTransportListeners(
          TransportEvent.MESSAGE_NOT_DELIVERED, new Address[0], addresses,
          new Address[0], message);
      throw new SendFailedException("MailService IO failed", e);
    } catch (IllegalArgumentException e) {
      throw new MessagingException("Illegal Arguments", e);
    }

    notifyTransportListeners(
        TransportEvent.MESSAGE_DELIVERED, addresses, new Address[0],
        new Address[0], message);
  }

  public int hashCode() {
    return session.hashCode() * 13 + url.hashCode();
  }

  public boolean equals(Object obj) {
    if (obj instanceof GMTransport) {
      GMTransport transport = (GMTransport) obj;
      return session.equals(transport.session) && url.equals(transport.url);
    }
    return false;
  }

  /**
   * Converts an array of addresses into a collection of strings representing
   * those addresses
   * @param targetAddrs addresses to be converted
   * @param allAddrs all addresses for this transport
   * @return A collection of strings representing the intersection
   * between targetAddrs and allAddrs.
   */
  private Collection<String> convertAddressFields(Address[] targetAddrs, Set<String> allAddrs) {
    if (targetAddrs == null || targetAddrs.length == 0) {
      return null;
    }
    ArrayList<String> ourAddrs = new ArrayList<String>(targetAddrs.length);
    for (Address addr : targetAddrs) {
      String email = addr.toString();
      if (allAddrs.contains(email)) {
        ourAddrs.add(email);
      }
    }
    return ourAddrs;
  }

  /**
   * Gets all the available data in an InputStream and returns it as a String
   * using the character set specified in the type parameter.
   * @param in The input stream to be read.
   * @param type The encoding type of the stream.
   * @return A String containing the data.
   * @throws IOException If there is a problem with the input stream.
   */
  private String inputStreamToString(InputStream in, String type) throws IOException {
    String charset = null;
    String[] args = type.split(";");
    for (String arg : args) {
      if (arg.trim().startsWith("charset=")) {
        charset = arg.split("=")[1];
        break;
      }
    }
    if (charset != null) {
      return new String(inputStreamToBytes(in), charset);
    } else {
      return new String(inputStreamToBytes(in));
    }
  }

  /**
   * Gets all the available data in an InputStream and returns it as a byte
   * array.
   * @param in The input stream to be read.
   * @return A byte array containing the data.
   * @throws IOException If there is a problem with the input stream.
   */
  private byte[] inputStreamToBytes(InputStream in) throws IOException {
    byte[] bytes = new byte[in.available()];
    int count = in.read(bytes);
    return bytes;
  }
}
