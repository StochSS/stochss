// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import com.google.appengine.api.blobstore.BlobKey;

import java.io.FileNotFoundException;
import java.io.IOException;

/**
 * This is the interface for interacting with the Google App Engine File
 * Service. A {@code FileService} instance is obtained via
 * {@link FileServiceFactory#getFileService()}.
 *
 * Currently there are two file systems supported:
 * {@link com.google.appengine.api.files.AppEngineFile.FileSystem#BLOBSTORE
 * BLOBSTORE}
 * and
 * {@link com.google.appengine.api.files.AppEngineFile.FileSystem#GS
 * GS}
 *
 * When writing files in GS (Google Storage), you have to first create a
 * writable file handle by using {@link createNewGSFile}, append to it and
 * when all done writing, you must finalize the file for it to persist.
 * Typical usage to create a new file in Google Storage is as follows:
 *
 * <pre>   {@code
 *    FileService fileService = FileServiceFactory.getFileService();
 *    GSFileOptionsBuilder optionsBuilder = new GSFileOptionsBuilder()
 *        .setBucket("mybucket")
 *        .setKey("myfile")
 *        .setMimeType("text/html")
 *        .setAcl("public_read")
 *        .addUserMetadata("myfield1", "my field value");
 *    AppEngineFile writableFile =
 *        fileService.createNewGSFile(optionsBuilder.build());
 *    // Open a channel to write to it
 *    boolean lock = false;
 *    FileWriteChannel writeChannel =
 *        fileService.openWriteChannel(writableFile, lock);
 *    // Different standard Java ways of writing to the channel
 *    // are possible. Here we use a PrintWriter:
 *    PrintWriter out = new PrintWriter(Channels.newWriter(writeChannel, "UTF8"));
 *    out.println("The woods are lovely dark and deep.");
 *    out.println("But I have promises to keep.");
 *
 *    // Close without finalizing and save the file path for writing later
 *    out.close();
 *    String path = writableFile.getFullPath();
 *
 *    // Write more to the file in a separate request:
 *    writableFile = new AppEngineFile(path);
 *
 *    // This time lock because we intend to finalize
 *    lock = true;
 *    writeChannel = fileService.openWriteChannel(writableFile, lock);
 *
 *    // This time we write to the channel directly.
 *    writeChannel.write(ByteBuffer.wrap(
 *        "And miles to go before I sleep.".getBytes()));
 *
 *    // Now finalize
 *    writeChannel.closeFinally();
 *    // At this point the file is visible in App Engine as:
 *    // "/gs/mybucket/myfile"
 *    // and to anybody on the Internet through Google Storage as:
 *    // (http://storage.googleapis.com/mybucket/myfile)
 *    // So reading it through Files API:
 *    String filename = "/gs/mybucket/myfile";
 *    AppEngineFile readableFile = new AppEngineFile(filename);
 *    FileReadChannel readChannel =
 *        fileService.openReadChannel(readableFile, false);
 *    // Again, different standard Java ways of reading from the channel.
 *    BufferedReader reader =
 *        new BufferedReader(Channels.newReader(readChannel, "UTF8"));
 *    String line = reader.readLine();
 *    // line = "The woods are lovely dark and deep."
 *    readChannel.close();}</pre>
 *
 */
public interface FileService {

  /**
   * Creates a new empty file in the BlobStore of the specified mime-type and
   * returns an {@code AppEngineFile} representing the file. The returned
   * instance will have a {@link AppEngineFile#getFileSystem() file system} of
   * {@link com.google.appengine.api.files.AppEngineFile.FileSystem#BLOBSTORE
   * BLOBSTORE}.
   *
   * @param mimeType the mime-type of the file to be created. This parameter may
   *        be used to inform the BlobStore of the mime-type for the file. The
   *        mime-type will be returned by the BlobStore in an HTTP response if
   *        the file is requested directly from the BlobStore using the
   *        blob-key.
   * @return A {@code AppEngineFile} representing the newly created file.
   * @throws IOException If there is any problem communicating with the backend
   *         system
   */
  AppEngineFile createNewBlobFile(String mimeType) throws IOException;

  /**
   * Creates a new empty file in the BlobStore of the specified mime-type and
   * returns an {@code AppEngineFile} representing the file. The returned
   * instance will have a {@link AppEngineFile#getFileSystem() file system} of
   * {@link com.google.appengine.api.files.AppEngineFile.FileSystem#BLOBSTORE
   * BLOBSTORE}.
   *
   * @param mimeType the mime-type of the file to be created. This parameter may
   *        be used to inform the BlobStore of the mime-type for the file. The
   *        mime-type will be returned by the BlobStore in an HTTP response if
   *        the file is requested directly from the BlobStore using the
   *        blob-key.
   * @param blobInfoUploadedFileName BlobStore will store this name in the
   *        BlobInfo's fileName field. This string will <em>not</em> be
   *        the {@link AppEngineFile#getNamePart() name} of the returned
   *        {@code AppEngineFile}. It will be returned by the BlobStore in an HTTP
   *        response if the file is requested directly from the BlobStore using
   *        the blob-key.
   * @return A {@code AppEngineFile} representing the newly created file.
   * @throws IOException If there is any problem communicating with the backend
   *         system
   */
  AppEngineFile createNewBlobFile(String mimeType, String blobInfoUploadedFileName)
  throws IOException;

  /**
   * Creates a new writable file in Google Storage of the specified mime-type
   * and returns an {@code AppEngineFile} representing the file. The returned
   * instance can only be used for writing and must be
   * {@link RecordWriteChannel#closeFinally() finalized} before reading it.
   * The returned file will have a
   * {@link AppEngineFile#getFileSystem() file system} of
   * {@link com.google.appengine.api.files.AppEngineFile.FileSystem#GS GS}.
   * For complete write/read lifecycle, please refer to the comments at the
   * top of this file.
   *
   * @param fileOptions {@code GSFileOptions} for creating a Google Storage
   *        file.
   * @return A writable {@code AppEngineFile}.
   * @throws IOException If there is any problem communicating with the backend
   *         system
   */
  AppEngineFile createNewGSFile(final GSFileOptions fileOptions) throws IOException;

  /**
   * Given an {@code AppEngineFile}, returns a {@code FileWriteChannel} that may
   * be used for appending bytes to the file.
   *
   * @param file the file to which to append bytes. The file must exist and it
   *        must not yet have been finalized. Furthermore, if the file is a
   *        {@link com.google.appengine.api.files.AppEngineFile.FileSystem#GS GS}
   *        file then it must be {@link AppEngineFile#isWritable() writable}.
   * @param lock should the file be locked for exclusive access?
   * @throws FileNotFoundException if the file does not exist in the backend
   *         repository. The file may have been deleted by another request, or
   *         the file may have been lost due to system failure or a scheduled
   *         relocation. Each backend repository offers different guarantees
   *         regarding when this is possible.
   * @throws FinalizationException if the file has already been finalized. The
   *         file may have been finalized by another request.
   * @throws LockException if the file is locked in a different App Engine
   *         request, or if {@code lock = true} and the file is opened in a
   *         different App Engine request
   * @throws IOException if any other unexpected problem occurs
   */
  FileWriteChannel openWriteChannel(AppEngineFile file, boolean lock)
      throws FileNotFoundException, FinalizationException, LockException, IOException;

  /**
   * Given an {@code AppEngineFile}, returns a {@code FileReadChannel} that may
   * be used for reading bytes from the file.
   *
   * @param file The file from which to read bytes. The file must exist and it
   *        must have been finalized. Furthermore, if the file is a
   *        {@link com.google.appengine.api.files.AppEngineFile.FileSystem#GS GS}
   *        file then it must be {@link AppEngineFile#isReadable() readable}.
   * @param lock Should the file be locked for exclusive access?
   * @throws FileNotFoundException if the file does not exist in the backend
   *         repository. The file may have been deleted by another request, or
   *         the file may have been lost due to system failure or a scheduled
   *         relocation. Each backend repository offers different guarantees
   *         regarding when this is possible.
   * @throws FinalizationException if the file has not yet been finalized
   * @throws LockException if the file is locked in a different App Engine
   *         request, or if {@code lock = true} and the file is opened in a
   *         different App Engine request
   * @throws IOException if any other problem occurs contacting the backend
   *         system
   */
  FileReadChannel openReadChannel(AppEngineFile file, boolean lock)
      throws FileNotFoundException, LockException, IOException;

  /**
   * Given a
   * {@link com.google.appengine.api.files.AppEngineFile.FileSystem#BLOBSTORE
   * BLOBSTORE} file that has been finalized, returns the {@code BlobKey} for
   * the corresponding blob.
   *
   * @param file A {@link
   *        com.google.appengine.api.files.AppEngineFile.FileSystem#BLOBSTORE
   *        BLOBSTORE} file that has been finalized
   * @return The corresponding {@code BlobKey}, or {@code null} if none can be
   *         found. This can occur if the file has not been finalized, or if it
   *         does not exist.
   * @throws IllegalArgumentException if {@code file} is not a {@code BLOBSTORE}
   *         file.
   */
  BlobKey getBlobKey(AppEngineFile file);

  /**
   * Given a {@code BlobKey}, returns an instance of {@code AppEngineFile} with
   * the given key. This method does not check whether the file actually exists
   * although the file corresponding to the key should be a finalized one.
   *
   * @param blobKey A blobkey
   * @return an instance of {@code AppEngineFile} with the given key.
   */
  AppEngineFile getBlobFile(BlobKey blobKey);

  /**
   * Given an {@link AppEngineFile} returns a {@link RecordWriteChannel} that may be used for
   * writing to the file using the leveldb log format.
   *
   * @param file the file to which to write records. The file must exist, be closed, and it
   *        must not yet have been finalized.
   * @param lock should the file be locked for exclusive access?
   * @throws FileNotFoundException if the file does not exist in the backend
   *         repository. The file may have been deleted by another request, or
   *         the file may have been lost due to system failure or a scheduled
   *         relocation. Each backend repository offers different guarantees
   *         regarding when this is possible.
   * @throws FinalizationException if the file has already been finalized. The
   *         file may have been finalized by another request.
   * @throws LockException if the file is locked in a different App Engine
   *         request, or if {@code lock = true} and the file is opened in a
   *         different App Engine request
   * @throws IOException if any other unexpected problem occurs
   */
  RecordWriteChannel openRecordWriteChannel(AppEngineFile file, boolean lock)
      throws FileNotFoundException, FinalizationException, LockException, IOException;

  /**
   * Given an {@link AppEngineFile}, returns a {@link RecordReadChannel} that may
   * be used for reading records from a file written using the leveldb log format.
   *
   * @param file The file from which to read records. The file must exist, be closed, and it
   *        must have been finalized.
   * @param lock Should the file be locked for exclusive access?
   * @throws FileNotFoundException if the file does not exist in the backend
   *         repository. The file may have been deleted by another request, or
   *         the file may have been lost due to system failure or a scheduled
   *         relocation. Each backend repository offers different guarantees
   *         regarding when this is possible.
   * @throws FinalizationException if the file has not yet been finalized
   * @throws LockException if the file is locked in a different App Engine
   *         request, or if {@code lock = true} and the file is opened in a
   *         different App Engine request
   * @throws IOException if any other problem occurs contacting the backend
   *         system
   */
  RecordReadChannel openRecordReadChannel(AppEngineFile file, boolean lock)
      throws FileNotFoundException, LockException, IOException;

  /**
   * Returns a string that represents the default Google Storage bucket name
   * for the application.
   *
   * @throws IOException if any other problem occurs contacting the backend
   *         system
   */
  String getDefaultGsBucketName() throws IOException;

  /**
   * Given a finalized {@link AppEngineFile}, return a {@link FileStat} object
   * that contains information about it.
   *
   * Limitations in current implementation:
   * <ol>
   *    <li>File must be finalized before stat can be called.</li>
   *    <li>Only {@code filename}, {@code finalized}, and {@code length} are filled
   *        in the {@link FileStat} returned.</li>
   * </ol>
   *
   * @param file the appEngfile to fetch file stat.
   * @return {@link FileStat} object that has metadata about the appEngineFile.
   * @throws FileNotFoundException if the file does not exist in the backend
   *         repository. The file may have been deleted by another request, or
   *         the file may have been lost due to system failure or a scheduled
   *         relocation. Each backend repository offers different guarantees
   *         regarding when this is possible.
   * @throws FinalizationException if the file has not yet been finalized.
   * @throws LockException if the file is locked in a different App Engine
   *         request.
   * @throws IOException if any other problem occurs contacting the backend
   *         system.
   */
  FileStat stat(AppEngineFile file) throws IOException;

  /**
   * Given {@link AppEngineFile}s with finalized filename,
   * permanently delete them in bulk.
   *
   * Delete on non-existent/non-finalized files is a no-op. Thus a file is
   * guaranteed to be non-existent if no exception is thrown after delete.
   *
   * After validating file type, this method tries to delete as many files as
   * possible and will throw an exception in the end if any single deletion failed.
   *
   * @param files to delete.
   * @throws NullPointerException if files is {@code null} or any file is {@code null}.
   * @throws UnsupportedOperationException if a file's type is not supported by delete
   *         or file does not have a finalized name.
   * @throws IOException if any other problem occurs contacting the backend system.
   */
  void delete(AppEngineFile... files) throws IOException;
}
