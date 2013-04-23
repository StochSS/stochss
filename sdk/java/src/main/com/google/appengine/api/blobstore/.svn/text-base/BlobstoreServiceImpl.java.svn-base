// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.blobstore;

import com.google.appengine.api.blobstore.BlobstoreServicePb.BlobstoreServiceError;
import com.google.appengine.api.blobstore.BlobstoreServicePb.CreateEncodedGoogleStorageKeyRequest;
import com.google.appengine.api.blobstore.BlobstoreServicePb.CreateEncodedGoogleStorageKeyResponse;
import com.google.appengine.api.blobstore.BlobstoreServicePb.CreateUploadURLRequest;
import com.google.appengine.api.blobstore.BlobstoreServicePb.CreateUploadURLResponse;
import com.google.appengine.api.blobstore.BlobstoreServicePb.DeleteBlobRequest;
import com.google.appengine.api.blobstore.BlobstoreServicePb.FetchDataRequest;
import com.google.appengine.api.blobstore.BlobstoreServicePb.FetchDataResponse;
import com.google.apphosting.api.ApiProxy;
import com.google.common.annotations.VisibleForTesting;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * {@code BlobstoreServiceImpl} is an implementation of {@link
 * BlobstoreService} that makes API calls to {@link ApiProxy}.
 *
 */
class BlobstoreServiceImpl implements BlobstoreService {
  static final String PACKAGE = "blobstore";
  static final String SERVE_HEADER = "X-AppEngine-BlobKey";
  static final String UPLOADED_BLOBKEY_ATTR = "com.google.appengine.api.blobstore.upload.blobkeys";
  static final String UPLOADED_BLOBINFO_ATTR =
      "com.google.appengine.api.blobstore.upload.blobinfos";
  static final String BLOB_RANGE_HEADER = "X-AppEngine-BlobRange";
  static final String CREATION_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";

  @Override
  public String createUploadUrl(String successPath) {
    return createUploadUrl(successPath, UploadOptions.Builder.withDefaults());
  }

  @Override
  public String createUploadUrl(String successPath, UploadOptions uploadOptions) {
    if (successPath == null) {
      throw new NullPointerException("Success path must not be null.");
    }

    CreateUploadURLRequest request = new CreateUploadURLRequest();
    request.setSuccessPath(successPath);

    if (uploadOptions.hasMaxUploadSizeBytesPerBlob()) {
      request.setMaxUploadSizePerBlobBytes(uploadOptions.getMaxUploadSizeBytesPerBlob());
    }

    if (uploadOptions.hasMaxUploadSizeBytes()) {
      request.setMaxUploadSizeBytes(uploadOptions.getMaxUploadSizeBytes());
    }

    if (uploadOptions.hasGoogleStorageBucketName()) {
      request.setGsBucketName(uploadOptions.getGoogleStorageBucketName());
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "CreateUploadURL", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (BlobstoreServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case URL_TOO_LONG:
          throw new IllegalArgumentException("The resulting URL was too long.");
        case INTERNAL_ERROR:
          throw new BlobstoreFailureException("An internal blobstore error occured.");
        default:
          throw new BlobstoreFailureException("An unexpected error occurred.", ex);
      }
    }

    CreateUploadURLResponse response = new CreateUploadURLResponse();
    response.mergeFrom(responseBytes);
    return response.getUrl();
  }

  @Override
  public void serve(BlobKey blobKey, HttpServletResponse response) {
    serve(blobKey, (ByteRange) null, response);
  }

  @Override
  public void serve(BlobKey blobKey, String rangeHeader, HttpServletResponse response) {
    serve(blobKey, ByteRange.parse(rangeHeader), response);
  }

  @Override
  public void serve(BlobKey blobKey, ByteRange byteRange, HttpServletResponse response) {
    if (response.isCommitted()) {
      throw new IllegalStateException("Response was already committed.");
    }

    response.setStatus(HttpServletResponse.SC_OK);
    response.setHeader(SERVE_HEADER, blobKey.getKeyString());
    if (byteRange != null) {
      response.setHeader(BLOB_RANGE_HEADER, byteRange.toString());
    }
  }

  @Override
  public ByteRange getByteRange(HttpServletRequest request) {
    @SuppressWarnings("unchecked")
    Enumeration<String> rangeHeaders = request.getHeaders("range");
    if (!rangeHeaders.hasMoreElements()) {
      return null;
    }

    String rangeHeader = rangeHeaders.nextElement();
    if (rangeHeaders.hasMoreElements()) {
      throw new UnsupportedRangeFormatException("Cannot accept multiple range headers.");
    }

    return ByteRange.parse(rangeHeader);
  }

  @Override
  public void delete(BlobKey... blobKeys) {
    DeleteBlobRequest request = new DeleteBlobRequest();
    for (BlobKey blobKey : blobKeys) {
      request.addBlobKey(blobKey.getKeyString());
    }

    if (request.blobKeySize() == 0) {
      return;
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "DeleteBlob", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (BlobstoreServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case INTERNAL_ERROR:
          throw new BlobstoreFailureException("An internal blobstore error occured.");
        default:
          throw new BlobstoreFailureException("An unexpected error occurred.", ex);
      }
    }
  }

  @Override
  @Deprecated public Map<String, BlobKey> getUploadedBlobs(HttpServletRequest request) {
    Map<String, List<BlobKey>> blobKeys = getUploads(request);
    Map<String, BlobKey> result = new HashMap<String, BlobKey>(blobKeys.size());

    for (Map.Entry<String, List<BlobKey>> entry : blobKeys.entrySet()) {
      if (!entry.getValue().isEmpty()) {
        result.put(entry.getKey(), entry.getValue().get(0));
      }
    }
    return result;
  }

  @Override
  public Map<String, List<BlobKey>> getUploads(HttpServletRequest request) {
    @SuppressWarnings("unchecked")
    Map<String, List<String>> attributes =
        (Map<String, List<String>>) request.getAttribute(UPLOADED_BLOBKEY_ATTR);
    if (attributes == null) {
      throw new IllegalStateException("Must be called from a blob upload callback request.");
    }
    Map<String, List<BlobKey>> blobKeys = new HashMap<String, List<BlobKey>>(attributes.size());
    for (Map.Entry<String, List<String>> attr : attributes.entrySet()) {
      List<BlobKey> blobs = new ArrayList<BlobKey>(attr.getValue().size());
      for (String key : attr.getValue()) {
        blobs.add(new BlobKey(key));
      }
      blobKeys.put(attr.getKey(), blobs);
    }
    return blobKeys;
  }

  @Override
  public Map<String, List<BlobInfo>> getBlobInfos(HttpServletRequest request) {
    @SuppressWarnings("unchecked")
    Map<String, List<Map<String, String>>> attributes =
        (Map<String, List<Map<String, String>>>) request.getAttribute(UPLOADED_BLOBINFO_ATTR);
    if (attributes == null) {
      throw new IllegalStateException("Must be called from a blob upload callback request.");
    }
    Map<String, List<BlobInfo>> blobInfos = new HashMap<String, List<BlobInfo>>(attributes.size());
    for (Map.Entry<String, List<Map<String, String>>> attr : attributes.entrySet()) {
      List<BlobInfo> blobs = new ArrayList<BlobInfo>(attr.getValue().size());
      for (Map<String, String> info : attr.getValue()) {
        BlobKey key = new BlobKey(info.get("key"));
        String contentType = info.get("content-type");
        Date creationDate = parseCreationDate(info.get("creation-date"));
        String filename = info.get("filename");
        int size = Integer.parseInt(info.get("size"));
        String md5Hash = info.get("md5-hash");
        blobs.add(new BlobInfo(key, contentType, creationDate, filename, size, md5Hash));
      }
      blobInfos.put(attr.getKey(), blobs);
    }
    return blobInfos;
  }

  @Override
  public Map<String, List<FileInfo>> getFileInfos(HttpServletRequest request) {
    @SuppressWarnings("unchecked")
    Map<String, List<Map<String, String>>> attributes =
        (Map<String, List<Map<String, String>>>) request.getAttribute(UPLOADED_BLOBINFO_ATTR);
    if (attributes == null) {
      throw new IllegalStateException("Must be called from a blob upload callback request.");
    }
    Map<String, List<FileInfo>> fileInfos = new HashMap<String, List<FileInfo>>(attributes.size());
    for (Map.Entry<String, List<Map<String, String>>> attr : attributes.entrySet()) {
      List<FileInfo> files = new ArrayList<FileInfo>(attr.getValue().size());
      for (Map<String, String> info : attr.getValue()) {
        String contentType = info.get("content-type");
        Date creationDate = parseCreationDate(info.get("creation-date"));
        String filename = info.get("filename");
        int size = Integer.parseInt(info.get("size"));
        String md5Hash = info.get("md5-hash");
        String gsObjectName = null;
        if (info.containsKey("gs-name")) {
          gsObjectName = info.get("gs-name");
        }
        files.add(new FileInfo(contentType, creationDate, filename, size, md5Hash,
                               gsObjectName));
      }
      fileInfos.put(attr.getKey(), files);
    }
    return fileInfos;
  }

  @VisibleForTesting
  protected static Date parseCreationDate(String date) {
    Date creationDate = null;
    try {
      date = date.trim().substring(0, CREATION_DATE_FORMAT.length());
      SimpleDateFormat dateFormat = new SimpleDateFormat(CREATION_DATE_FORMAT);
      dateFormat.setLenient(false);
      creationDate = dateFormat.parse(date);
    } catch (IndexOutOfBoundsException e) {
    } catch (ParseException e) {
    }
    return creationDate;
  }

  @Override
  public byte[] fetchData(BlobKey blobKey, long startIndex, long endIndex) {
    if (startIndex < 0) {
      throw new IllegalArgumentException("Start index must be >= 0.");
    }

    if (endIndex < startIndex) {
      throw new IllegalArgumentException("End index must be >= startIndex.");
    }

    long fetchSize = endIndex - startIndex + 1;
    if (fetchSize > MAX_BLOB_FETCH_SIZE) {
      throw new IllegalArgumentException("Blob fetch size " + fetchSize + " is larger " +
                                         "than maximum size " + MAX_BLOB_FETCH_SIZE + " bytes.");
    }

    FetchDataRequest request = new FetchDataRequest();
    request.setBlobKey(blobKey.getKeyString());
    request.setStartIndex(startIndex);
    request.setEndIndex(endIndex);

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "FetchData", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (BlobstoreServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case PERMISSION_DENIED:
          throw new SecurityException("This application does not have access to that blob.");
        case BLOB_NOT_FOUND:
          throw new IllegalArgumentException("Blob not found.");
        case INTERNAL_ERROR:
          throw new BlobstoreFailureException("An internal blobstore error occured.");
        default:
          throw new BlobstoreFailureException("An unexpected error occurred.", ex);
      }
    }

    FetchDataResponse response = new FetchDataResponse();
    response.mergeFrom(responseBytes);
    return response.getDataAsBytes();
  }

  @Override
  public BlobKey createGsBlobKey(String filename) {

    if (!filename.startsWith("/gs/")) {
      throw new IllegalArgumentException("Google storage filenames must be" +
          " prefixed with /gs/");
    }
    CreateEncodedGoogleStorageKeyRequest request = new CreateEncodedGoogleStorageKeyRequest();
    request.setFilename(filename);

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE,
          "CreateEncodedGoogleStorageKey", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (BlobstoreServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case INTERNAL_ERROR:
          throw new BlobstoreFailureException("An internal blobstore error occured.");
        default:
          throw new BlobstoreFailureException("An unexpected error occurred.", ex);
      }
    }

    CreateEncodedGoogleStorageKeyResponse response = new CreateEncodedGoogleStorageKeyResponse();
    response.mergeFrom(responseBytes);
    return new BlobKey(response.getBlobKey());
  }
}
