package com.google.appengine.api.capabilities;

import com.google.appengine.api.capabilities.CapabilityServicePb.IsEnabledRequest;
import com.google.appengine.api.capabilities.CapabilityServicePb.IsEnabledResponse;
import com.google.appengine.api.capabilities.CapabilityServicePb.IsEnabledRequest.Builder;
import com.google.appengine.api.capabilities.CapabilityServicePb.IsEnabledResponse.SummaryStatus;
import com.google.apphosting.api.ApiProxy;
import com.google.protobuf.InvalidProtocolBufferException;

/**
 * Implementation for {@link CapabilitiesService}.
 *
 *
 */
class CapabilitiesServiceImpl implements CapabilitiesService {

  private final static String PACKAGE_NAME = "capability_service";
  private final static String METHOD_NAME = "IsEnabled";

  @Override
  public CapabilityState getStatus(Capability capability) {

    Builder builder = CapabilityServicePb.IsEnabledRequest.newBuilder();
    builder.setPackage(capability.getPackageName());
    builder.addCapability(capability.getName());
    IsEnabledRequest request = builder.build();

    try {
      byte[] responseBytes =
          ApiProxy.makeSyncCall(PACKAGE_NAME, METHOD_NAME, request.toByteArray());
      IsEnabledResponse response = CapabilityServicePb.IsEnabledResponse.parseFrom(responseBytes);
      SummaryStatus status = response.getSummaryStatus();
      CapabilityStatus statusValue;
      long timeUntilScheduled = -1;
      switch (status) {
        case ENABLED:
          statusValue = CapabilityStatus.ENABLED;
          break;
        case SCHEDULED_NOW:
          timeUntilScheduled = 0;
          statusValue = CapabilityStatus.SCHEDULED_MAINTENANCE;
          break;
        case SCHEDULED_FUTURE:
          timeUntilScheduled = response.getTimeUntilScheduled();
          statusValue = CapabilityStatus.SCHEDULED_MAINTENANCE;
          break;
        case DISABLED:
          statusValue = CapabilityStatus.DISABLED;
          break;
        default:
          statusValue = CapabilityStatus.UNKNOWN;
          break;
      }

      return new CapabilityState(capability, statusValue, timeUntilScheduled);

    } catch (InvalidProtocolBufferException ex) {
      throw new ApiProxy.ArgumentException(PACKAGE_NAME, METHOD_NAME);
    }
  }

}
