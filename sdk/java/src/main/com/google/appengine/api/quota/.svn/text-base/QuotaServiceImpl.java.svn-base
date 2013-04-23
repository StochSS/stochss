// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.quota;

import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiStats;
import com.google.apphosting.api.ApiProxy.Environment;

/**
 * Implementation details for the QuotaService.
 *
 *
 */
class QuotaServiceImpl implements QuotaService {

  private static final double MCYCLES_PER_SECOND = 1200.0;

  private static ApiStats getStats() {
    Environment env = ApiProxy.getCurrentEnvironment();
    if (env == null) {
      return null;
    }
    return ApiStats.get(env);
  }

  public boolean supports(DataType type) {

    return getStats() != null;
  }

  public long getApiTimeInMegaCycles() {
    ApiStats stats = getStats();
    return (stats == null) ? 0L : stats.getApiTimeInMegaCycles();
  }

  public long getCpuTimeInMegaCycles() {
    ApiStats stats = getStats();
    return (stats == null) ? 0L : stats.getCpuTimeInMegaCycles();
  }

  @Override
  public long convertCpuSecondsToMegacycles(double cpuSeconds) {
    return (long) (cpuSeconds * MCYCLES_PER_SECOND);
  }

  @Override
  public double convertMegacyclesToCpuSeconds(long megaCycles) {
    return megaCycles / MCYCLES_PER_SECOND;
  }

}
