// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

/**
 * Renders each payload into an empty string, thus minimizing the data
 * that needs to be persisted in app stats. This is the default setting if the
 * AppstatsFilter is not configured differently.
 *
 */
public class NullPayloadRenderer implements PayloadRenderer {

  @Override
  public String renderPayload(String packageName, String methodName, byte[] payload,
      boolean isRequestPayload) {
    return "";
  }

}
