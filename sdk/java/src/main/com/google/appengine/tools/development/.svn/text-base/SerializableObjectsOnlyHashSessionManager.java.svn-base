// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development;

import org.mortbay.jetty.servlet.AbstractSessionManager;
import org.mortbay.jetty.servlet.HashSessionManager;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.Serializable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * A specialization of {@link HashSessionManager} that creates {@link HttpSession} objects that only
 * allow the insertion of {@link Serializable} objects.
 *
 */
class SerializableObjectsOnlyHashSessionManager extends HashSessionManager {

  @Override
  protected AbstractSessionManager.Session newSession(HttpServletRequest request) {
    return new SerializableObjectsOnlyHttpSession(request);
  }

  /**
   * An {@link HttpSession} implementation for the dev appserver that only allows the insertion of
   * {@link Serializable} objects. The behavior here differs slightly from production in that
   * this implementation fails immediately, while prod fails at the end of the request. The
   * important thing, though, is that both implementations fail on non-serializable objects.
   */
  class SerializableObjectsOnlyHttpSession extends HashSessionManager.Session {

    public SerializableObjectsOnlyHttpSession(HttpServletRequest request) {
      super(request);
    }

    @Override
    public void setAttribute(String s, Object o) {
      super.setAttribute(s, checkCanSerialize(o));
    }

    @Deprecated
    @Override
    public void putValue(String s, Object o) {
      super.putValue(s, checkCanSerialize(o));
    }

    /**
     * Verifies the given object can be serialized. This may introduce performance overhead, but
     * it's comparable to what users will see in prod since we serialize their session data there as
     * well.
     *
     * @param value The object to serialize.
     * @return The value that was passed in.
     */
    Object checkCanSerialize(Object value) {
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      try {
        ObjectOutputStream oos = new ObjectOutputStream(baos);
        oos.writeObject(value);
      } catch (IOException ex) {
        throw new RuntimeException(ex);
      }
      return value;
    }
  }
}
