// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.development;

import static com.google.appengine.tools.development.LatencyPercentiles.UNDEFINED;

import java.util.Arrays;
import java.util.Random;

/**
 * Uses {@link LatencyPercentiles} to simulate production service latency in
 * the dev appserver.
 *
 */
class LatencySimulator {

  /**
   * A random number generator we'll use to select an index into the
   * {@link #latencies} array.
   */
  private static final Random RANDOM = new Random();

  final DynamicLatencyAdjuster adjuster;

  /**
   * An array containing latencies that correspond to the percentiles.  If the
   * 25th percentile is 5, the 50th percentile is 10, the 75th percentile is
   * 15, the 95th percentile is 20, and the 99th percentile is 25, then slots
   * 0 through 24 will contain 5, slots 25 through 49 will contain 10, slots 50
   * through 74 will contain 15, slots 75 through 94 will contain 20, and slots
   * 95 through 99 will contain 25.  We use {@link #RANDOM} to generate random
   * indexes into this array and the use the value stored at the location to
   * which we index as the latency to simulate.  Given enough rpcs, this should
   * yield latencies which correspond to the given percentiles.
   */
  final int[] latencies = new int[100];

  public LatencySimulator(LatencyPercentiles latencyPercentiles) {
    try {
      adjuster = latencyPercentiles.dynamicAdjuster().newInstance();
    } catch (InstantiationException e) {
      throw new RuntimeException(e);
    } catch (IllegalAccessException e) {
      throw new RuntimeException(e);
    }
    Arrays.fill(latencies, 0, 25, latencyPercentiles.latency25th() != UNDEFINED ?
        latencyPercentiles.latency25th() : latencyPercentiles.latency50th());
    Arrays.fill(latencies, 25, 50, latencyPercentiles.latency50th());
    Arrays.fill(latencies, 50, 75, latencyPercentiles.latency75th() != UNDEFINED ?
        latencyPercentiles.latency75th() : latencyPercentiles.latency50th());
    Arrays.fill(latencies, 75, 95, latencyPercentiles.latency95th() != UNDEFINED ?
        latencyPercentiles.latency95th() : latencies[50]);
    Arrays.fill(latencies, 95, 100, latencyPercentiles.latency99th() != UNDEFINED ?
        latencyPercentiles.latency99th() : latencies[75]);
    validate();
  }

  /**
   * Simulates latency for an RPC.
   *
   * @param actualLatencyMs The actual latency for the local RPC.  We subtract
   * this amount from the latency we add.
   * @param service The service on which we're running the RPC.  Used by the
   * {@link #adjuster}.
   * @param request The request that was processed by the service.  Used by
   * the {@link #adjuster}.
   */
  public void simulateLatency(long actualLatencyMs, LocalRpcService service, Object request) {
    long latency = adjuster.adjust(service, request, latencies[nextInt()]);
    if (actualLatencyMs > latency) {
      return;
    }
    sleep(latency - actualLatencyMs);
  }

  int nextInt() {
    return RANDOM.nextInt(100);
  }

  void sleep(long millis) {
    try {
      Thread.sleep(millis);
    } catch (InterruptedException e) {
      throw new RuntimeException("Interrupted while simulating latency." , e);
    }
  }

  private void validate() {
    int last = 0;
    for (int latency : latencies) {
      if (latency < last) {
        throw new IllegalArgumentException(String.format(
            "Illegal latency progression - shrank from %d to %d", last, latency));
      }
      last = latency;
    }
  }
}
