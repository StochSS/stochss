// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.development;

/**
 * Adjusts local RPC latency using runtime information.
 *
 */
public interface DynamicLatencyAdjuster {

  /**
   *
   * @param service The service on which the rpc is being invoked.
   * @param request The request that was provided to the service.
   * @param latencyMs The latency to adjust.
   * @return The adjusted latency.
   */
  int adjust(LocalRpcService service, Object request, int latencyMs);

  /**
   * Default implementation of a {@link DynamicLatencyAdjuster} that provides
   * no adjustment.
   */
  final class Default implements DynamicLatencyAdjuster {
    @Override
    public int adjust(LocalRpcService service, Object request, int latencyMs) {
      return latencyMs;
    }
  }
}
