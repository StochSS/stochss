// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import java.io.IOException;

/**
 * Thrown when there's an error logging in.
 *
 */
public class LoginException extends IOException {
    public LoginException(String s) {
      super(s);
    }
}
