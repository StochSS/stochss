// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import com.google.apphosting.api.ApiProxy;

import java.io.IOException;

/**
 * An exception that indicates one of two possible cases:
 *
 * <ol>
 *   <li>An exclusive lock on a file is held by a different App Engine request and
 * so the file may not be accessed in this request
 *   <li>This request is trying to acquire an exclusive lock on a file but the
 * file is already opened in a different App Engine request
 * </ol>
 *
 */
public class LockException extends IOException {
  LockException() {
  }

  LockException(String message, ApiProxy.ApplicationException cause) {
    super(message, cause);
  }
}
