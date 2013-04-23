// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.capabilities;

/**
 * A capability represents a particular feature or set of features
 * available on the App Engine platform.
 *
 * To check the availability of a particular capability, use the
 * {@link CapabilitiesService} API.
 *
 *
 */
public class Capability {
  /**
   * Availability of BlobstoreService.
   */
  public static final Capability BLOBSTORE = new Capability("blobstore");
  /**
   * Availability of the datastore.
   */
  public static final Capability DATASTORE = new Capability("datastore_v3");
  /**
   * Availability of datastore writes.
   */
  public static final Capability DATASTORE_WRITE = new Capability("datastore_v3", "write");
  /**
   * Availability of the ImagesService.
   */
  public static final Capability IMAGES = new Capability("images");
  /**
   * Availability of theMailService.
   */
  public static final Capability MAIL = new Capability("mail");
   /**
   * Availability of the ProspectiveSearchService.
   */
  public static final Capability PROSPECTIVE_SEARCH = new Capability("matcher");
  /**
   * Availability ofMemcacheService.
   */
  public static final Capability MEMCACHE = new Capability("memcache");
  /**
   * Availability of TaskQueueService.
   */
  public static final Capability TASKQUEUE = new Capability("taskqueue");
  /**
   * Availability of the URLFetchService.
   */
  public static final Capability URL_FETCH = new Capability("urlfetch");
  /**
   * Availability of the XMPPService.
   */
  public static final Capability XMPP = new Capability("xmpp");

  private final String packageName;
  private final String name;

  /**
   *
   * Creates a new instance of a Capability.
   *
   * @param packageName name of the package associated with this capability.
   *
   */
  public Capability(String packageName) {
    this(packageName, "*");
  }

  /**
   * Creates a new instance of a Capability.
   *
   * @param packageName name of the package associated with this capability.
   * @param name name of the capability.
   */
  public Capability(String packageName, String name) {
    this.packageName = packageName;
    this.name = name;
  }

  /**
   * Returns the package name associated with this capability.
   *
   * @return the package name associated with this capability.
   */
  public String getPackageName() {
    return packageName;
  }

  /**
   * Returns the name associated with this capability.
   *
   * @return the name associated with this capability.
   */
  public String getName() {
    return name;
  }
}
