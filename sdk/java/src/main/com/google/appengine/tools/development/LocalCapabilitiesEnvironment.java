// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.api.capabilities.CapabilityStatus;
import com.google.common.collect.ImmutableSet;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 */
public class LocalCapabilitiesEnvironment {

  /**
   * delimiter added to get a unique key from a package name and a capability name
   */
  private static final String KEY_DELIMITER = ".";

  /**
   * prefix used to detect which properties are relevant to the Capability Service. All property
   * keys not starting with this prefix will be ignored in the initialization on the service.
   */
  public static final String KEY_PREFIX = "capability.status.";

  public static final ImmutableSet<String> DATASTORE_WRITE_RPCS = new ImmutableSet.Builder<String>()
      .add("Delete")
      .add("Put")
      .add("Touch")
      .add("Commit")
      .add("CreateIndex")
      .add("UpdateIndex")
      .add("DeleteIndex")
      .add("AddActions")
      .add("AllocateIds")
      .build();
  /**
   * a map of capability to status. The key to the map is the concatenation of the prefix, the
   * package name, delimiter and capability name. the corresponding value holds the SummaryStatus
   * desired for the capability
   */
  Map<String, CapabilityStatus> capabilitiesStatus = Collections
      .synchronizedMap(new HashMap<String, CapabilityStatus>());

  /**
   * initialize a LocalCapabilitiesEnvironment with all the properties that
   * start with the correct KEY_PREFIX
   * @param properties setting up some capability states
   */
  public LocalCapabilitiesEnvironment(Properties properties) {
    for (String capabilityName : properties.stringPropertyNames()) {
      if (!capabilityName.startsWith(KEY_PREFIX)) {
        continue;
      }
      String status = properties.getProperty(capabilityName);
      CapabilityStatus s = CapabilityStatus.valueOf(status);
      capabilitiesStatus.put(capabilityName, s);

    }
  }

  public static String geCapabilityPropertyKey(String packageName, String capability) {
    return KEY_PREFIX + packageName + KEY_DELIMITER + capability;
  }

  /**
   * modify the capability status based on the capability property name property names that do not
   * start with  "capability.status" are ignored
   *
   * @param capabilityName property name with prefix as "capability.status.memcache"
   * @param status         required status for the given capability
   */
  public void setCapabilitiesStatus(String capabilityName, CapabilityStatus status) {
    if (!capabilityName.startsWith(KEY_PREFIX)) {
      return;
    }

    if (status == null) {
      throw new IllegalArgumentException("Capability Status: " + " is not known");
    }

    capabilitiesStatus.put(capabilityName, status);
  }

  /**
   * @param capabilityName name fo the capability (for ex "datastore_v3")
   * @param methodName     RPC method name (for example "Get")
   * @return the capability status for the given method
   */
  public CapabilityStatus getStatusFromMethodName(String capabilityName, String methodName) {
    CapabilityStatus status;
    if (capabilityName.equals("datastore_v3")) {
      status = capabilitiesStatus.get(geCapabilityPropertyKey(capabilityName, "write"));
      if ((status != null) && (!status.equals(CapabilityStatus.ENABLED))) {
        if (DATASTORE_WRITE_RPCS.contains(methodName)) {
          return status;
        }
      }
    }
    status = capabilitiesStatus.get(geCapabilityPropertyKey(capabilityName, "*"));
    if (status != null) {
      return status;
    } else {
      return CapabilityStatus.ENABLED;
    }
  }

  /**
   * @param packageName    package Name  name fo the capability (for ex "datastore_v3")
   * @param capabilityName name fo the capability (for example, "write" or "*")
   * @return the capability status for the given capability
   */
  public CapabilityStatus getStatusFromCapabilityName(String packageName, String capabilityName) {
    CapabilityStatus status;

    status = capabilitiesStatus.get(geCapabilityPropertyKey(packageName, capabilityName));
    if (status != null) {
      return status;
    } else {
      return CapabilityStatus.ENABLED;
    }
  }
}
