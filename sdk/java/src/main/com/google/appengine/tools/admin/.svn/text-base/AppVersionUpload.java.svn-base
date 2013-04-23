// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.GenericApplication.ErrorHandler;
import com.google.appengine.tools.util.FileIterator;
import com.google.common.annotations.VisibleForTesting;

import com.google.common.base.Joiner;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.Callable;
import java.util.logging.Logger;
import java.util.regex.Pattern;

/**
 * Uploads a new appversion to the hosting service.
 *
 */
public class AppVersionUpload {
  /**
   * Don't try to precompile more than this number of files in one request.
   */
  private static final int MAX_FILES_PER_PRECOMPILE = 50;

  protected ServerConnection connection;
  protected GenericApplication app;
  protected final String backend;
  private final Logger logger = Logger.getLogger(AppVersionUpload.class.getName());
  private boolean inTransaction = false;
  private Map<String, FileInfo> files = new HashMap<String, FileInfo>();
  private boolean deployed = false;
  private final UploadBatcher fileBatcher;
  private final UploadBatcher blobBatcher;

  public AppVersionUpload(ServerConnection connection, GenericApplication app) {
    this(connection, app, null, Boolean.TRUE);
  }

  /**
   * Create a new {@link AppVersionUpload} instance that can deploy a new
   * versions of {@code app} via {@code connection}.
   *
   * @param connection to connect to the server
   * @param app that contains the code to be deployed
   * @param backend if supplied and non-{@code null}, a particular backend is
   *        being updated
   */
  public AppVersionUpload(ServerConnection connection, GenericApplication app,
      String backend, boolean batchMode) {
    this.connection = connection;
    this.app = app;
    this.backend = backend;
    fileBatcher = new UploadBatcher("file", batchMode);
    blobBatcher = new UploadBatcher("blob", batchMode);
  }

  /***
   * Uploads a new appversion to the server.
   *
   * @throws IOException if a problem occurs in the upload.
   */
  public void doUpload(ResourceLimits resourceLimits) throws IOException {
    try {
      File basepath = getBasepath();

      app.statusUpdate("Scanning files on local disk.", 20);
      int numFiles = 0;
      long resourceTotal = 0;
      for (File f : new FileIterator(basepath)) {
        FileInfo fileInfo = new FileInfo(f, basepath);
        fileInfo.setMimeType(app);
        logger.fine("Processing file '" + f + "'.");
        long maxFileBlobSize = fileInfo.mimeType != null ?
            resourceLimits.maxBlobSize() : resourceLimits.maxFileSize();
        if (f.length() > maxFileBlobSize) {
          String message;
          if (f.getName().toLowerCase().endsWith(".jar")) {
            message = "Jar " + f.getPath() + " is too large. Consider "
                + "using --enable_jar_splitting.";
          } else {
            message = "File " + f.getPath() + " is too large (limit "
                + maxFileBlobSize + " bytes).";
          }
          throw new IOException(message);
        }
        resourceTotal += addFile(fileInfo);

        if (++numFiles % 250 == 0) {
          app.statusUpdate("Scanned " + numFiles + " files.");
        }
      }
      if (numFiles > resourceLimits.maxFileCount()) {
        throw new IOException("Applications are limited to "
            + resourceLimits.maxFileCount() + " files, you have " + numFiles
            + ".");
      }
      if (resourceTotal > resourceLimits.maxTotalFileSize()) {
        throw new IOException("Applications are limited to "
            + resourceLimits.maxTotalFileSize() + " bytes of resource files, "
            + "you have " + resourceTotal + ".");
      }

      Collection<FileInfo> missingFiles = beginTransaction(resourceLimits);
      app.statusUpdate("Uploading " + missingFiles.size() + " files.", 50);
      if (missingFiles.size() > 0) {
        numFiles = 0;
        int quarter = Math.max(1, missingFiles.size() / 4);
        for (FileInfo missingFile : missingFiles) {
          logger.fine("Uploading file '" + missingFile + "'");
          uploadFile(missingFile);
          if (++numFiles % quarter == 0) {
            app.statusUpdate("Uploaded " + numFiles + " files.");
          }
        }
      }
      uploadErrorHandlers(app.getErrorHandlers(), basepath);
      if (app.isPrecompilationEnabled()) {
        precompile();
      }
      fileBatcher.flush();
      blobBatcher.flush();
      commit();
    } finally {
      rollback();
    }

    updateIndexes();
    updateCron();
    updateQueue();
    updateDos();
    updatePagespeed();
  }

  private void uploadErrorHandlers(List<ErrorHandler> errorHandlers, File basepath)
    throws IOException {
    if (!errorHandlers.isEmpty()) {
      app.statusUpdate("Uploading " + errorHandlers.size() + " file(s) "
          + "for static error handlers.");
      for (ErrorHandler handler : errorHandlers) {
        File file = new File(basepath, handler.getFile());
        FileInfo info = new FileInfo(file, basepath);
        String error = info.checkValidFilename();
        if (error != null) {
          throw new IOException("Could not find static error handler: " + error);
        }
        info.mimeType = handler.getMimeType();
        String errorType = handler.getErrorCode();
        if (errorType == null) {
          errorType = "default";
        }
        send("/api/appversion/adderrorblob", info.file, info.mimeType, "path",
            errorType);
      }
    }
  }

  public void precompile() throws IOException {
    app.statusUpdate("Initializing precompilation...");
    List<String> filesToCompile = new ArrayList<String>();

    int errorCount = 0;
    while (true) {
      try {
        filesToCompile.addAll(sendPrecompileRequest(Collections
            .<String> emptyList()));
        break;
      } catch (IOException ex) {
        if (errorCount < 3) {
          errorCount++;
          try {
            Thread.sleep(1000);
          } catch (InterruptedException ex2) {
            IOException ex3 =
                new IOException("Interrupted during precompilation.");
            ex3.initCause(ex2);
            throw ex3;
          }
        } else {
          IOException ex2 =
              new IOException(
                  "Precompilation failed.  Consider adding <precompilation-enabled>false"
                      + "</precompilation-enabled> to your appengine-web.xml and trying again.");
          ex2.initCause(ex);
          throw ex2;
        }
      }
    }

    errorCount = 0;
    IOException lastError = null;
    while (!filesToCompile.isEmpty()) {
      try {
        if (precompileChunk(filesToCompile)) {
          errorCount = 0;
        }
      } catch (IOException ex) {
        lastError = ex;
        errorCount++;
        Collections.shuffle(filesToCompile);
        try {
          Thread.sleep(1000);
        } catch (InterruptedException ex2) {
          IOException ex3 =
              new IOException("Interrupted during precompilation.");
          ex3.initCause(ex2);
          throw ex3;
        }
      }

      if (errorCount > 3) {
        IOException ex2 =
            new IOException("Precompilation failed with "
                + filesToCompile.size() + " file(s) remaining.  "
                + "Consider adding"
                + " <precompilation-enabled>false</precompilation-enabled>"
                + " to your " + "appengine-web.xml and trying again.");
        ex2.initCause(lastError);
        throw ex2;
      }
    }
  }

  /**
   * Attempt to precompile up to {@code MAX_FILES_PER_PRECOMPILE} files from
   * {@code filesToCompile}.
   *
   * @param filesToCompile a list of file names, which will be mutated to remove
   *        any files that were successfully compiled.
   *
   * @return true if filesToCompile was reduced in size (i.e. progress was
   *         made).
   */
  private boolean precompileChunk(List<String> filesToCompile)
      throws IOException {
    int filesLeft = filesToCompile.size();
    if (filesLeft == 0) {
      app.statusUpdate("Initializing precompilation...");
    } else {
      app.statusUpdate(MessageFormat.format(
          "Precompiling... {0} file(s) left.", filesLeft));
    }

    List<String> subset =
        filesToCompile
            .subList(0, Math.min(filesLeft, MAX_FILES_PER_PRECOMPILE));
    List<String> remainingFiles = sendPrecompileRequest(subset);
    subset.clear();
    filesToCompile.addAll(remainingFiles);
    return filesToCompile.size() < filesLeft;
  }

  private List<String> sendPrecompileRequest(List<String> filesToCompile)
      throws IOException {
    String response =
        send("/api/appversion/precompile", Joiner.on("\n").useForNull("null").join(filesToCompile));
    if (response.length() > 0) {
      return Arrays.asList(response.split("\n"));
    } else {
      return Collections.emptyList();
    }
  }

  public void updateIndexes() throws IOException {
    if (app.getIndexesXml() != null) {
      app.statusUpdate("Uploading index definitions.");
      send("/api/datastore/index/add", getIndexYaml());
    }

  }

  public void updateCron() throws IOException {
    String yaml = getCronYaml();
    if (yaml != null) {
      app.statusUpdate("Uploading cron jobs.");
      send("/api/datastore/cron/update", yaml);
    }
  }

  public void updateQueue() throws IOException {
    String yaml = getQueueYaml();
    if (yaml != null) {
      app.statusUpdate("Uploading task queues.");
      send("/api/queue/update", yaml);
    }
  }

  public void updateDos() throws IOException {
    String yaml = getDosYaml();
    if (yaml != null) {
      app.statusUpdate("Uploading DoS entries.");
      send("/api/dos/update", yaml);
    }
  }

  public void updatePagespeed() throws IOException {
    String yaml = getPagespeedYaml();
    if (yaml != null) {
      app.statusUpdate("Uploading PageSpeed entries.");
      send("/api/appversion/updatepagespeed", yaml);
    } else {
      try {
        send("/api/appversion/updatepagespeed", "");
      } catch (HttpIoException exc) {
        if (exc.getResponseCode() != HttpURLConnection.HTTP_NOT_FOUND) {
          throw exc;
        }
      }
    }
  }

  public void setDefaultVersion() throws IOException {
    app.statusUpdate("Setting default version to " + app.getVersion() + ".");
    send("/api/appversion/setdefault", "");
  }

  protected String getIndexYaml() {
    return app.getIndexesXml().toYaml();
  }

  protected String getCronYaml() {
    if (app.getCronXml() != null) {
      return app.getCronXml().toYaml();
    } else {
      return null;
    }
  }

  protected String getQueueYaml() {
    if (app.getQueueXml() != null) {
      return app.getQueueXml().toYaml();
    } else {
      return null;
    }
  }

  protected String getDosYaml() {
    if (app.getDosXml() != null) {
      return app.getDosXml().toYaml();
    } else {
      return null;
    }
  }

  protected String getPagespeedYaml() {
    return app.getPagespeedYaml();
  }

  private File getBasepath() {
    File path = app.getStagingDir();
    if (path == null) {
      path = new File(app.getPath());
    }
    return path;
  }

  /**
   * Adds a file for uploading, returning the bytes counted against the total
   * resource quota.
   *
   * @param info
   * @return 0 for a static file, or file.length() for a resource file.
   * @throws IOException
   */
  private long addFile(FileInfo info) throws IOException {
    if (inTransaction) {
      throw new IllegalStateException("Already in a transaction.");
    }

    String error = info.checkValidFilename();
    if (error != null) {
      logger.severe(error);
      return 0;
    }

    files.put(info.path, info);

    return info.mimeType != null ? 0 : info.file.length();
  }

  /**
   * Begins the transaction, returning a list of files that need uploading.
   *
   * All calls to addFile must be made before calling beginTransaction().
   *
   * @param resourceLimits is the collection of resource limits for AppCfg.
   * @return A list of pathnames that should be uploaded using uploadFile()
   *         before calling commit().
   */
  private Collection<FileInfo> beginTransaction(ResourceLimits resourceLimits)
      throws IOException {
    if (inTransaction) {
      throw new IllegalStateException("Already in a transaction.");
    }

    if (backend == null) {
      app.statusUpdate("Initiating update.");
    } else {
      app.statusUpdate("Initiating update of backend " + backend + ".");
    }
    send("/api/appversion/create", app.getAppYaml());
    inTransaction = true;
    Collection<FileInfo> blobsToClone = new ArrayList<FileInfo>(files.size());
    Collection<FileInfo> filesToClone = new ArrayList<FileInfo>(files.size());

    for (FileInfo f : files.values()) {
      if (f.mimeType == null) {
        filesToClone.add(f);
      } else {
        blobsToClone.add(f);
      }
    }

    TreeMap<String, FileInfo> filesToUpload = new TreeMap<String, FileInfo>();
    cloneFiles("/api/appversion/cloneblobs", blobsToClone, "static",
        filesToUpload, resourceLimits.maxFilesToClone());
    cloneFiles("/api/appversion/clonefiles", filesToClone, "application",
        filesToUpload, resourceLimits.maxFilesToClone());

    logger.fine("Files to upload :");
    for (FileInfo f : filesToUpload.values()) {
      logger.fine("\t" + f);
    }

    this.files = filesToUpload;
    return new ArrayList<FileInfo>(filesToUpload.values());
  }

  private static final String LIST_DELIMITER = "\n";

  /**
   * Sends files to the given url.
   *
   * @param url server URL to use.
   * @param filesParam List of files to clone.
   * @param type Type of files ( "static" or "application")
   * @param filesToUpload Files that need to be uploaded are added to this
   *        Collection.
   * @param maxFilesToClone Max number of files to clone at a single time.
   */
  private void cloneFiles(String url, Collection<FileInfo> filesParam,
      String type, Map<String, FileInfo> filesToUpload, long maxFilesToClone)
      throws IOException {
    if (filesParam.isEmpty()) {
      return;
    }
    app.statusUpdate("Cloning " + filesParam.size() + " " + type + " files.");

    int cloned = 0;
    int remaining = filesParam.size();
    ArrayList<FileInfo> chunk = new ArrayList<FileInfo>((int) maxFilesToClone);
    for (FileInfo file : filesParam) {
      chunk.add(file);
      if (--remaining == 0 || chunk.size() >= maxFilesToClone) {
        if (cloned > 0) {
          app.statusUpdate("Cloned " + cloned + " files.");
        }
        String result = send(url, buildClonePayload(chunk));
        if (result != null && result.length() > 0) {
          for (String path : result.split(LIST_DELIMITER)) {
            if (path == null || path.length() == 0) {
              continue;
            }
            FileInfo info = this.files.get(path);
            if (info == null) {
              logger.warning("Skipping " + path + ": missing FileInfo");
              continue;
            }
            filesToUpload.put(path, info);
          }
        }
        cloned += chunk.size();
        chunk.clear();
      }
    }
  }

  /**
   * Uploads a file to the hosting service.
   *
   * Must only be called after beginTransaction(). The file provided must be on
   * of those that were returned by beginTransaction();
   *
   * @param file FileInfo for the file to upload.
   */
  private void uploadFile(FileInfo file) throws IOException {
    if (!inTransaction) {
      throw new IllegalStateException(
          "beginTransaction() must be called before uploadFile().");
    }
    if (!files.containsKey(file.path)) {
      throw new IllegalArgumentException("File " + file.path
          + " is not in the list of files to be uploaded.");
    }

    files.remove(file.path);
    if (file.mimeType == null) {
      fileBatcher.addToBatch(file);
    } else {
      blobBatcher.addToBatch(file);
    }
  }

  /**
   * Commits the transaction, making the new app version available.
   *
   * All the files returned by beginTransaction must have been uploaded with
   * uploadFile() before commit() may be called.
   */
  private void commit() throws IOException {
    deploy();
    try {
      boolean ready = retryWithBackoff(1, 2, 60, 20, new Callable<Boolean>() {
        @Override
        public Boolean call() throws Exception {
          return isReady();
        }
      });

      if (ready) {
        startServing();
      } else {
        logger.severe("Version still not ready to serve, aborting.");
        throw new RuntimeException("Version not ready.");
      }
    } catch (IOException ioe) {
      throw ioe;
    } catch (RuntimeException e) {
      throw e;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * Deploys the new app version but does not make it default.
   *
   * All the files returned by beginTransaction must have been uploaded with
   * uploadFile() before commit() may be called.
   */
  private void deploy() throws IOException {
    if (!inTransaction) {
      throw new IllegalStateException(
          "beginTransaction() must be called before uploadFile().");
    }
    if (files.size() > 0) {
      throw new IllegalStateException(
          "Some required files have not been uploaded.");
    }
    app.statusUpdate("Deploying new version.", 20);
    send("/api/appversion/deploy", "");
    deployed = true;
  }

  /**
   * Check if the new app version is ready to serve traffic.
   *
   * @return true if the server returned that the app is ready to serve.
   */
  private boolean isReady() throws IOException {
    if (!deployed) {
      throw new IllegalStateException(
          "deploy() must be called before isReady()");
    }
    String result = send("/api/appversion/isready", "");
    return "1".equals(result.trim());
  }

  private void startServing() throws IOException {
    if (!deployed) {
      throw new IllegalStateException(
          "deploy() must be called before startServing()");
    }
    app.statusUpdate("Closing update: new version is ready to start serving.");
    send("/api/appversion/startserving", "");
    inTransaction = false;
  }

  public void forceRollback() throws IOException {
    app.statusUpdate("Rolling back the update" + (this.backend == null ? "."
        : " on backend " + this.backend + "."));
    send("/api/appversion/rollback", "");
  }

  private void rollback() throws IOException {
    if (!inTransaction) {
      return;
    }
    forceRollback();
  }

  @VisibleForTesting
  String send(String url, String payload, String... args)
      throws IOException {
    return connection.post(url, payload, addVersionToArgs(args));
  }

  @VisibleForTesting
  String send(String url, File payload, String mimeType, String... args)
      throws IOException {
    return connection.post(url, payload, mimeType, addVersionToArgs(args));
  }

  private String[] addVersionToArgs(String... args) {
    List<String> result = new ArrayList<String>();
    result.addAll(Arrays.asList(args));
    result.add("app_id");
    result.add(app.getAppId());
    if (backend != null) {
      result.add("backend");
      result.add(backend);
    } else if (app.getVersion() != null) {
      result.add("version");
      result.add(app.getVersion());
    }
    if (app.getServer() != null) {
      result.add("server");
      result.add(app.getServer());
    }
    return result.toArray(new String[result.size()]);
  }

  /**
   * Calls a function multiple times, backing off more and more each time.
   *
   * @param initialDelay Inital delay after the first try, in seconds.
   * @param backoffFactor Delay will be multiplied by this factor after each
   *        try.
   * @param maxDelay Maximum delay factor.
   * @param maxTries Maximum number of tries.
   * @param callable Callable to call.
   * @return true if the Callable returned true in one of its tries.
   */
  private boolean retryWithBackoff(double initialDelay, double backoffFactor,
      double maxDelay, int maxTries, Callable<Boolean> callable)
      throws Exception {
    long delayMillis = (long) (initialDelay * 1000);
    long maxDelayMillis = (long) (maxDelay * 1000);
    if (callable.call()) {
      return true;
    }
    while (maxTries > 1) {
      app.statusUpdate("Will check again in " + (delayMillis / 1000)
          + " seconds.");
      Thread.sleep(delayMillis);
      delayMillis *= backoffFactor;
      if (delayMillis > maxDelayMillis) {
        delayMillis = maxDelayMillis;
      }
      maxTries--;
      if (callable.call()) {
        return true;
      }
    }
    return false;
  }

  private static final String TUPLE_DELIMITER = "|";

  /**
   * Build the post body for a clone request.
   *
   * @param files List of FileInfos for the files to clone.
   * @return A string containing the properly delimited tuples.
   */
  private static String buildClonePayload(Collection<FileInfo> files) {
    StringBuffer data = new StringBuffer();
    boolean first = true;
    for (FileInfo file : files) {
      if (first) {
        first = false;
      } else {
        data.append(LIST_DELIMITER);
      }
      data.append(file.path);
      data.append(TUPLE_DELIMITER);
      data.append(file.hash);
      if (file.mimeType != null) {
        data.append(TUPLE_DELIMITER);
        data.append(file.mimeType);
      }
    }

    return data.toString();
  }

  static class FileInfo implements Comparable<FileInfo> {
    public File file;
    public String path;
    public String hash;
    public String mimeType;

    public FileInfo(File f, File base) throws IOException {
      this.file = f;
      this.path = Utility.calculatePath(f, base);
      this.hash = calculateHash();
    }

    public void setMimeType(GenericApplication app) {
      mimeType = app.getMimeTypeIfStatic(path);
    }

    @Override
    public String toString() {
      return (mimeType == null ? "" : mimeType) + '\t' + hash + "\t" + path;
    }

    @Override
    public int compareTo(FileInfo other) {
      return path.compareTo(other.path);
    }

    @Override
    public int hashCode() {
      return path.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
      if (obj instanceof FileInfo) {
        return path.equals(((FileInfo) obj).path);
      }
      return false;
    }

    private static final Pattern FILE_PATH_POSITIVE_RE =
        Pattern.compile("^[ 0-9a-zA-Z._+/$-]{1,256}$");

    private static final Pattern FILE_PATH_NEGATIVE_RE_1 =
        Pattern.compile("[.][.]|^[.]/|[.]$|/[.]/|^-");

    private static final Pattern FILE_PATH_NEGATIVE_RE_2 =
        Pattern.compile("//|/$");

    private static final Pattern FILE_PATH_NEGATIVE_RE_3 =
        Pattern.compile("^ | $|/ | /");

    private String checkValidFilename() {
      if (!FILE_PATH_POSITIVE_RE.matcher(path).matches()) {
        return "Invalid character in filename: " + path;
      }
      if (FILE_PATH_NEGATIVE_RE_1.matcher(path).find()) {
        return "Filname cannot contain '.' or '..' or start with '-': " + path;
      }
      if (FILE_PATH_NEGATIVE_RE_2.matcher(path).find()) {
        return "Filname cannot have trailing / or contain //: " + path;
      }
      if (FILE_PATH_NEGATIVE_RE_3.matcher(path).find()) {
        return "Any spaces must be in the middle of a filename: '" + path + "'";
      }
      return null;
    }

    private static final char[] HEX =
        {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
            'e', 'f'};

    public String calculateHash() throws IOException {
      InputStream s = new FileInputStream(file);
      byte[] buf = new byte[4096];
      try {
        MessageDigest digest = MessageDigest.getInstance("SHA-1");
        for (int numRead; (numRead = s.read(buf)) != -1;) {
          digest.update(buf, 0, numRead);
        }
        StringBuffer hashValue = new StringBuffer(40);
        int i = 0;
        for (byte b : digest.digest()) {
          if ((i > 0) && ((i % 4) == 0)) {
            hashValue.append('_');
          }
          hashValue.append(HEX[(b >> 4) & 0xf]);
          hashValue.append(HEX[b & 0xf]);
          ++i;
        }

        return hashValue.toString();
      } catch (NoSuchAlgorithmException e) {
        throw new RuntimeException(e);
      } finally {
        try {
          s.close();
        } catch (IOException ex) {
        }
      }
    }
  }

  class UploadBatcher {

    private static final int MAX_BATCH_SIZE = 3200000;
    private static final int MAX_BATCH_COUNT = 100;
    private static final int MAX_BATCH_FILE_SIZE = 200000;
    private static final int BATCH_OVERHEAD = 500;

    String what;
    String singleUrl;
    String batchUrl;
    boolean batching = true;
    List<FileInfo> batch = new ArrayList<FileInfo>();
    long batchSize = 0;

    /**
     * @param what     Either "file" or "blob" or "errorblob" indicating what kind of objects this
     *                 batcher uploads. Used in messages and URLs.
     * @param batching whether or not we want to really do batch.
     */
    public UploadBatcher(String what, boolean batching) {
      this.what = what;
      this.singleUrl = "/api/appversion/add" + what;
      this.batchUrl = singleUrl + "s";
      this.batching = batching;
    }

    /**
     * Send the current batch on its way and reset the batrch buffer when done
     */
    public void sendBatch() throws IOException {

      app.statusUpdate(
          "Sending batch containing " + batch.size() + " "+ what +"(s) totaling " +
              batchSize / 1000 + "KB.");
      connection.post(batchUrl, batch, addVersionToArgs("", ""));
      batch = new ArrayList<FileInfo>();
      batchSize = 0;
    }

    /**
     * """Flush the current batch.
     *
     * This first attempts to send the batch as a single request; if that fails because the server
     * doesn"t support batching, the files are sent one by one, and self.batching is reset to
     * False.
     *
     * At the end, self.batch and self.batchSize are reset
     */
    public void flush() throws IOException {
      if (batch.isEmpty()) {
        return;
      }
      try {
        sendBatch();
      } catch (Exception e) {
        app.statusUpdate("Exception in flushing batch payload, so sending 1 by 1..."
            + e.getMessage());
        batching = false;
        for (FileInfo fileInfo : batch) {
          send(singleUrl, fileInfo.file, fileInfo.mimeType, "path", fileInfo.path);
        }
        batch = new ArrayList<FileInfo>();
        batchSize = 0;
      }
    }

    /**
     * Batch a file, possibly flushing first, or perhaps upload it directly.
     *
     * Args: path: The name of the file. payload: The contents of the file. mime_type: The MIME
     * Content-type of the file, or None.
     *
     * If mime_type is None, application/octet-stream is substituted. """
     */
    public void addToBatch(FileInfo fileInfo) throws IOException {

      long size = fileInfo.file.length();

      if (size <= MAX_BATCH_FILE_SIZE) {
        if ((batch.size() >= MAX_BATCH_COUNT) ||
            (batchSize + size > MAX_BATCH_SIZE)) {
          flush();
        }
        if (batching) {
          batch.add(fileInfo);
          batchSize += size + BATCH_OVERHEAD;
          return;
        }
      }
      send(singleUrl, fileInfo.file, fileInfo.mimeType, "path", fileInfo.path);

    }
  }

}
