// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import com.google.apphosting.api.ApiProxy;

import java.io.IOException;

/**
 * A {@code KeyOrderingException} is thrown by the method
 * {@link FileWriteChannel#write(java.nio.ByteBuffer, String)
 * FileWriteChannel.write(ByteBuffer, String)} if the {@code sequenceKey}
 * parameter is not {@code null} and the backend system already has recorded a
 * last good sequence key for the file and {@code sequenceKey} is not
 * lexicographically strictly greater than the last good sequence key. The last
 * good sequence key may then be retrieved via the method
 * {@link #getLastGoodSequenceKey()}
 *
 */
public class KeyOrderingException extends IOException {

  private String lastGoodSequenceKey;

  KeyOrderingException() {
  }

  KeyOrderingException(String message, ApiProxy.ApplicationException cause) {
    super(message, cause);
    lastGoodSequenceKey = cause.getErrorDetail();
  }

  public String getLastGoodSequenceKey() {
    return lastGoodSequenceKey;
  }
}
