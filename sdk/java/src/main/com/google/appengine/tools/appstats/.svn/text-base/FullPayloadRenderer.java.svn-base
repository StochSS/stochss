// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.tools.appstats.InternalProtos.EmptyProto;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.TextFormat;

/**
 * Renders the full payload of a request as a string. Potentially large
 * and thus will probably break if too many rpcs within a request will be made.
 * Use with caution.
 *
 */
public class FullPayloadRenderer implements PayloadRenderer {

  @Override
  public String renderPayload(String packageName, String methodName, byte[] payload,
      boolean isRequestPayload) {
    try {
      EmptyProto proto = InternalProtos.EmptyProto.newBuilder().mergeFrom(payload).build();
      return TextFormat.printToString(proto.getUnknownFields());
    } catch (InvalidProtocolBufferException e) {
      return "???";
    }
  }

}
