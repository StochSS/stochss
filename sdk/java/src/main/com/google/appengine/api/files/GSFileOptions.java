// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import com.google.common.base.Preconditions;

import java.util.Map;
import java.util.TreeMap;

/**
 * Container class for holding options for creating Google Storage files.
 *
 * @see <a href="http://code.google.com/apis/storage/">Google Storage
 * API</a>.
 */
public class GSFileOptions {
  public static final String GS_USER_METADATA_PREFIX = "x-goog-meta-";

  final String fileName;
  final String mimeType;
  final String acl;
  final String cacheControl;
  final String contentEncoding;
  final String contentDisposition;
  final Map<String, String> userMetadata = new TreeMap<String, String>();

  private GSFileOptions(String bucket,
                        String key,
                        String mimeType,
                        String acl,
                        String cacheControl,
                        String contentEncoding,
                        String contentDisposition,
                        Map<String, String> userMetadata) {
    Preconditions.checkArgument(bucket != null && !bucket.isEmpty(), "Must provide bucket");
    Preconditions.checkArgument(key != null && !key.isEmpty(), "Must provide key");
    this.fileName = FileServiceImpl.GS_FILESYSTEM_PREFIX + bucket + "/" + key;
    this.mimeType = (mimeType == null || mimeType.trim().isEmpty())
        ? FileServiceImpl.GS_DEFAULT_MIME_TYPE : mimeType;
    this.acl = acl;
    this.cacheControl = cacheControl;
    this.contentEncoding = contentEncoding;
    this.contentDisposition = contentDisposition;
    if (userMetadata != null) {
      this.userMetadata.putAll(userMetadata);
    }
  }

  /**
   * A builder of GSFileOptions.
   */
  public static class GSFileOptionsBuilder {
    String bucket;
    String key;
    String mimeType;
    String acl;
    String cacheControl;
    String contentEncoding;
    String contentDisposition;
    Map<String, String> userMetadata = new TreeMap<String, String>();

   /**
     * Sets the name of the bucket. Required.
     * @param bucket name of the Google Storage bucket
     * @return this for chaining.
     */
    public GSFileOptionsBuilder setBucket(String bucket) {
      this.bucket = Preconditions.checkNotNull(bucket);
      return this;
    }

    /**
     * Sets the key of the object. Required.
     * @param key of the Google Storage object
     * @return this for chaining.
     */
    public GSFileOptionsBuilder setKey(String key) {
      this.key = Preconditions.checkNotNull(key);
      return this;
    }

    /**
     * Sets the mime type of the object. If not set, default Google Storage
     * mime type is used when served out of Google Storage.
     * {@link "http://code.google.com/apis/storage/docs/reference-headers.html#contenttype"}
     * @param mimeType of the Google Storage object.
     * @return this for chaining.
     */
    public GSFileOptionsBuilder setMimeType(String mimeType) {
      this.mimeType = Preconditions.checkNotNull(mimeType);
      return this;
    }

    /**
     * Sets the acl of the object. If not set, defaults to none (ie, bucket default).
     * {@link "http://code.google.com/apis/storage/docs/accesscontrol.html"}
     * @param acl to use for the Google Storage object.
     * @return this for chaining.
     */
    public GSFileOptionsBuilder setAcl(String acl) {
      this.acl = Preconditions.checkNotNull(acl);
      return this;
    }

    /**
     * Sets the cache control for the object. If not set, default value is used.
     * {@link "http://code.google.com/apis/storage/docs/reference-headers.html#cachecontrol"}
     * @param cacheControl to use for the Google Storage object.
     * @return this for chaining.
     */
    public GSFileOptionsBuilder setCacheControl(String cacheControl) {
      this.cacheControl = Preconditions.checkNotNull(cacheControl);
      return this;
    }

    /**
     * Sets the content encoding for the object. If not set, default value is used.
     * {@link "http://code.google.com/apis/storage/docs/reference-headers.html#contentencoding"}
     * @param contentEncoding to use for the Google Storage object.
     * @return this for chaining.
     */
    public GSFileOptionsBuilder setContentEncoding(String contentEncoding) {
      this.contentEncoding = Preconditions.checkNotNull(contentEncoding);
      return this;
    }

    /**
     * Sets the content disposition for the object. If not set, default value is used.
     * {@link "http://code.google.com/apis/storage/docs/reference-headers.html#contentdisposition"}
     * @param contentDisposition to use for the Google Storage object.
     * @return this for chaining.
     */
    public GSFileOptionsBuilder setContentDisposition(String contentDisposition) {
      this.contentDisposition = Preconditions.checkNotNull(contentDisposition);
      return this;
    }

    /**
     * Adds user specific metadata that will be added to object headers when
     * served through Google Storage:
     *         {@link "http://code.google.com/apis/storage/docs/reference-headers.html#xgoogmeta"}
     *         Each entry will be prefixed with x-goog-meta- when serving out.
     *         For example, if you add 'foo'->'bar' entry to userMetadata map,
     *         it will be served out as a header:
     *         x-goog-meta-foo: bar
     * @param key
     * @param value
     * @return this for chaining.
     */
    public GSFileOptionsBuilder addUserMetadata(String key, String value) {
      Preconditions.checkArgument(key != null && !key.isEmpty());
      Preconditions.checkArgument(value != null && !value.isEmpty());
      userMetadata.put(key, value);
      return this;
    }

    public GSFileOptions build() {
      return new GSFileOptions(bucket,
        key,
        mimeType,
        acl,
        cacheControl,
        contentEncoding,
        contentDisposition,
        userMetadata);
    }
  }
}
