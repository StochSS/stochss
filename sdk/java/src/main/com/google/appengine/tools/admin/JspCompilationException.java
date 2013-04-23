// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

public class JspCompilationException extends RuntimeException {
  public enum Source { JASPER, JSPC }

  private final Source source;

  public JspCompilationException(String message, Source source) {
    super(message);
    this.source = source;
  }

  public Source getSource() {
    return source;
  }
}
