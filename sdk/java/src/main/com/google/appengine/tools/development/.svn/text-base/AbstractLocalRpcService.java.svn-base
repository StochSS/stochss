// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.util.Map;

/**
 * An abstract implementation of {@link LocalRpcService} which runs no
 * setup logic and provides no deadline hints.
 *
 */
public abstract class AbstractLocalRpcService implements LocalRpcService {

  @Override
  public void init(LocalServiceContext context, Map<String, String> properties) {
  }

  @Override
  public void start() {
  }

  @Override
  public void stop() {
  }

  @Override
  public Double getDefaultDeadline(boolean isOfflineRequest) {
    return null;
  }

  @Override
  public Double getMaximumDeadline(boolean isOfflineRequest) {
    return null;
  }

  @Override
  public Integer getMaxApiRequestSize() {
    return null;
  }
}
