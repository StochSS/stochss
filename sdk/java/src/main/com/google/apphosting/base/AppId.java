// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.apphosting.base;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Class used for parsing the various components of the AppId.
 *
 */
public class AppId {
  private static final int APP_ID_MAX_LEN = 100;
  private static final Pattern DISPLAY_APP_ID_RE =
      Pattern.compile("[a-z\\d\\-]{1," + APP_ID_MAX_LEN + "}", Pattern.CASE_INSENSITIVE);
  private static final Pattern DOMAIN_RE =
      Pattern.compile("([a-z\\d\\-\\.]{1," + APP_ID_MAX_LEN + "})?\\:", Pattern.CASE_INSENSITIVE);
  private static final Pattern PARTITION_RE =
      Pattern.compile("([a-z\\d\\-]{1," + APP_ID_MAX_LEN + "})?\\~", Pattern.CASE_INSENSITIVE);
  private static final Pattern APP_ID_RE =
      Pattern.compile(
          "(?:" + PARTITION_RE + ")?((?:" + DOMAIN_RE + ")?(" + DISPLAY_APP_ID_RE + "))",
          Pattern.CASE_INSENSITIVE);

  public static final String DEFAULT_ENGINE_ID = "default";
  private static final int ENGINE_ID_MAX_LENGTH = 63;
  private static final int ENGINE_VERSION_ID_MAX_LENGTH = 100;
  private static final int MINOR_VERSION_ID_LENGTH = 20;

  private static final String ENGINE_ID_RE =
      String.format("[a-z\\d][a-z\\d\\-]{0,%d}", ENGINE_ID_MAX_LENGTH - 1);

  private static final String ENGINE_VERSION_ID_RE =
      String.format("[a-z\\d][a-z\\d\\-]{0,%d}", ENGINE_VERSION_ID_MAX_LENGTH - 1);

  private static final String MAJOR_VERSION_RE =
      String.format("(?:(?:(%s):)?)(%s)", ENGINE_ID_RE, ENGINE_VERSION_ID_RE);

  private static final String FULL_VERSION_RE =
      String.format("(%s)\\.(\\d{1,%d})",  MAJOR_VERSION_RE, MINOR_VERSION_ID_LENGTH);

  private static final Pattern FULL_VERSION_PATTERN = Pattern.compile(FULL_VERSION_RE);

  private String appId;
  private String domain;
  private String longAppId;
  private String displayAppId;
  private String partition;

  /**
   * Create a new AppId based on an appId formatted as follows:
   *
   * [(partition)~][(domain):](display-app-id)
   *
   * @param appId The appId to parse.
   */
  private AppId(String appId) {
    this.appId = appId;
    if (appId == null || appId.length() == 0) {
      return;
    }
    Matcher matcher = APP_ID_RE.matcher(appId);
    if (!matcher.matches()) {
      return;
    }
    this.partition = matcher.group(1);
    this.longAppId = matcher.group(2);
    this.domain = matcher.group(3);
    this.displayAppId = matcher.group(4);
  }

  /**
   * @return The full appId.
   */
  public String getAppId() {
    return appId;
  }

  /**
   * @return The domain component of this appId.
   */
  public String getDomain() {
    return domain;
  }

  /**
   * @return The display-app-id component of this appId.
   */
  public String getDisplayAppId() {
    return displayAppId;
  }

  /**
   * @return The partition component of the appId.
   */
  public String getPartition() {
    return partition;
  }

  /**
   * @return The appId without the partition component.
   */
  public String getLongAppId() {
    return longAppId;
  }

  /**
   * Returns a new AppId object based on an appId formatted as follows:
   *
   * [(partition)~][(domain):](display-app-id)
   *
   * @param appId The appId to parse.
   *
   * @return AppId object with the parsed appid components.
   */
  public static AppId parse(String appId) {
    return new AppId(appId);
  }

  /**
   * Parses an engine ID from a full version ID. A full version ID is of the form
   * {@code <major-version>.<minor-version>}. This method supports two styles of major version ID
   * strings:
   * <ol>
   * <li>engineID:engineVersionID
   * <li>Older major version Strings that do not contain a colon. In this case the default engine ID
   * is returned.
   * </ol>
   *
   * @param versionId A full version ID String of the form {@code <major-version>.<minor-version>}
   *        where major-version is in either the new syntax that includes a colon or the older
   *        syntax that does not.
   * @return The expressed or implied engine ID.
   */
  public static String engineIdFromFullVersionId(String versionId) {
    Matcher m = FULL_VERSION_PATTERN.matcher(versionId);
    if (!m.matches()) {
      throw new IllegalArgumentException("Invalid major version ID: " + versionId);
    }
    String engineId = m.group(2);
    return (null == engineId ? DEFAULT_ENGINE_ID : engineId);
  }

}
