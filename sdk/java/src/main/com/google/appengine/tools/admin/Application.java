// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ApplicationProcessingOptions;
import com.google.appengine.tools.info.SdkImplInfo;
import com.google.appengine.tools.info.SdkInfo;
import com.google.appengine.tools.plugins.AppYamlProcessor;
import com.google.appengine.tools.plugins.SDKPluginManager;
import com.google.appengine.tools.plugins.SDKRuntimePlugin;
import com.google.appengine.tools.util.ApiVersionFinder;
import com.google.appengine.tools.util.FileIterator;
import com.google.appengine.tools.util.JarSplitter;
import com.google.appengine.tools.util.JarTool;
import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.apphosting.utils.config.AppEngineWebXmlReader;
import com.google.apphosting.utils.config.BackendsXml;
import com.google.apphosting.utils.config.BackendsXmlReader;
import com.google.apphosting.utils.config.BackendsYamlReader;
import com.google.apphosting.utils.config.CronXml;
import com.google.apphosting.utils.config.CronXmlReader;
import com.google.apphosting.utils.config.CronYamlReader;
import com.google.apphosting.utils.config.DosXml;
import com.google.apphosting.utils.config.DosXmlReader;
import com.google.apphosting.utils.config.DosYamlReader;
import com.google.apphosting.utils.config.GenerationDirectory;
import com.google.apphosting.utils.config.IndexesXml;
import com.google.apphosting.utils.config.IndexesXmlReader;
import com.google.apphosting.utils.config.QueueXml;
import com.google.apphosting.utils.config.QueueXmlReader;
import com.google.apphosting.utils.config.QueueYamlReader;
import com.google.apphosting.utils.config.WebXml;
import com.google.apphosting.utils.config.WebXmlReader;
import com.google.common.collect.ImmutableSet;
import com.google.common.io.Files;

import org.mortbay.io.Buffer;
import org.mortbay.jetty.MimeTypes;
import org.xml.sax.SAXException;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

import javax.activation.FileTypeMap;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;
import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.SchemaFactory;

/**
 * An App Engine application. You can {@link #readApplication read} an
 * {@code Application} from a path, and
 * {@link com.google.appengine.tools.admin.AppAdminFactory#createAppAdmin create}
 * an {@link com.google.appengine.tools.admin.AppAdmin} to upload, create
 * indexes, or otherwise manage it.
 *
 */
public class Application implements GenericApplication {

  private static final int MAX_COMPILED_JSP_JAR_SIZE = 1024 * 1024 * 5;
  private static final String COMPILED_JSP_JAR_NAME_PREFIX = "_ah_compiled_jsps";

  private static final int MAX_CLASSES_JAR_SIZE = 1024 * 1024 * 5;
  private static final String CLASSES_JAR_NAME_PREFIX = "_ah_webinf_classes";

  private static Pattern JSP_REGEX = Pattern.compile(".*\\.jspx?");

  /** If available, this is set to a program to make symlinks, e.g. /bin/ln */
  private static File ln = Utility.findLink();
  private static File sdkDocsDir;
  private static synchronized File getSdkDocsDir(){
    if (null == sdkDocsDir){
      sdkDocsDir = new File(SdkInfo.getSdkRoot(), "docs");
    }
    return sdkDocsDir;
  }

  private static final String STAGEDIR_PREFIX = "appcfg";

  private static final Logger logger = Logger.getLogger(Application.class.getName());

  private static final MimeTypes mimeTypes = new MimeTypes();

  private AppEngineWebXml appEngineWebXml;
  private WebXml webXml;
  private CronXml cronXml;
  private DosXml dosXml;
  private String pagespeedYaml;
  private QueueXml queueXml;
  private IndexesXml indexesXml;
  private BackendsXml backendsXml;
  private File baseDir;
  private File stageDir;
  private File externalResourceDir;
  private String apiVersion;
  private String appYaml;

  private UpdateListener listener;
  private PrintWriter detailsWriter;
  private int updateProgress = 0;
  private int progressAmount = 0;

  protected Application(){
  }

  /**
   * Builds a normalized path for the given directory in which
   * forward slashes are used as the file separator on all platforms.
   * @param dir A directory
   * @return The normalized path
   */
  private static String buildNormalizedPath(File dir) {
    String normalizedPath = dir.getPath();
    if (File.separatorChar == '\\') {
      normalizedPath = normalizedPath.replace('\\', '/');
    }
    return normalizedPath;
  }

  private Application(String explodedPath, String appId, String server, String appVersion) {
    this.baseDir = new File(explodedPath);
    explodedPath = buildNormalizedPath(baseDir);
    File webinf = new File(baseDir, "WEB-INF");
    if (!webinf.getName().equals("WEB-INF")) {
      throw new AppEngineConfigException("WEB-INF directory must be capitalized.");
    }

    String webinfPath = webinf.getPath();
    AppEngineWebXmlReader aewebReader = new AppEngineWebXmlReader(explodedPath);
    WebXmlReader webXmlReader = new WebXmlReader(explodedPath);
    AppYamlProcessor.convert(webinf, aewebReader.getFilename(), webXmlReader.getFilename());

    validateXml(aewebReader.getFilename(), new File(getSdkDocsDir(), "appengine-web.xsd"));
    appEngineWebXml = aewebReader.readAppEngineWebXml();
    appEngineWebXml.setSourcePrefix(explodedPath);
    if (appId != null) {
      appEngineWebXml.setAppId(appId);
    }
    if (server != null) {
      appEngineWebXml.setServer(server);
    }
    if (appVersion != null) {
      appEngineWebXml.setMajorVersionId(appVersion);
    }

    webXml = webXmlReader.readWebXml();
    webXml.validate();

    CronXmlReader cronReader = new CronXmlReader(explodedPath);
    validateXml(cronReader.getFilename(), new File(getSdkDocsDir(), "cron.xsd"));
    cronXml = cronReader.readCronXml();
    if (cronXml == null) {
      CronYamlReader cronYaml = new CronYamlReader(webinfPath);
      cronXml = cronYaml.parse();
    }

    QueueXmlReader queueReader = new QueueXmlReader(explodedPath);
    validateXml(queueReader.getFilename(), new File(getSdkDocsDir(), "queue.xsd"));
    queueXml = queueReader.readQueueXml();
    if (queueXml == null) {
      QueueYamlReader queueYaml = new QueueYamlReader(webinfPath);
      queueXml = queueYaml.parse();
    }

    DosXmlReader dosReader = new DosXmlReader(explodedPath);
    validateXml(dosReader.getFilename(), new File(getSdkDocsDir(), "dos.xsd"));
    dosXml = dosReader.readDosXml();
    if (dosXml == null) {
      DosYamlReader dosYaml = new DosYamlReader(webinfPath);
      dosXml = dosYaml.parse();
    }

    if (getAppEngineWebXml().getPagespeed() != null) {
      StringBuilder pagespeedYamlBuilder = new StringBuilder();
      AppYamlTranslator.appendPagespeed(
          getAppEngineWebXml().getPagespeed(), pagespeedYamlBuilder, 0);
      pagespeedYaml = pagespeedYamlBuilder.toString();
    }

    IndexesXmlReader indexReader = new IndexesXmlReader(explodedPath);
    validateXml(indexReader.getFilename(), new File(getSdkDocsDir(), "datastore-indexes.xsd"));
    indexesXml = indexReader.readIndexesXml();

    BackendsXmlReader backendsReader = new BackendsXmlReader(explodedPath);
    validateXml(backendsReader.getFilename(), new File(getSdkDocsDir(), "backends.xsd"));
    backendsXml = backendsReader.readBackendsXml();
    if (backendsXml == null) {
      BackendsYamlReader backendsYaml = new BackendsYamlReader(webinfPath);
      backendsXml = backendsYaml.parse();
    }
  }

  /**
   * Reads the App Engine application from {@code path}. The path may either
   * be a WAR file or the root of an exploded WAR directory.
   *
   * @param path a not {@code null} path.
   *
   * @throws IOException if an error occurs while trying to read the
   * {@code Application}.
   * @throws com.google.apphosting.utils.config.AppEngineConfigException if the
   * {@code Application's} appengine-web.xml file is malformed.
   */
  public static Application readApplication(String path)
      throws IOException {
    return new Application(path, null, null, null);
  }

  /**
   * Sets the external resource directory. Call this method before invoking
   * {@link #createStagingDirectory(ApplicationProcessingOptions, ResourceLimits)}.
   * <p>
   * The external resource directory is a directory outside of the war directory where additional
   * files live. These files will be copied into the staging directory during an upload, after the
   * war directory is copied there. Consequently if there are any name collisions the files in the
   * external resource directory will win.
   *
   * @param path a not {@code null} path to an existing directory.
   *
   * @throws IllegalArgumentException If {@code path} does not refer to an existing
   *         directory.
   */
  public void setExternalResourceDir(String path) {
    if (path == null) {
      throw new NullPointerException("path is null");
    }
    if (stageDir != null) {
      throw new IllegalStateException(
          "This method must be invoked prior to createStagingDirectory()");
    }
    File dir = new File(path);
    if (!dir.exists()) {
      throw new IllegalArgumentException("path does not exist: " + path);
    }
    if (!dir.isDirectory()) {
      throw new IllegalArgumentException(path + " is not a directory.");
    }
    this.externalResourceDir = dir;
  }

  /**
   * Reads the App Engine application from {@code path}. The path may either
   * be a WAR file or the root of an exploded WAR directory.
   *
   * @param path a not {@code null} path.
   * @param appId if non-null, use this as an application id override.
   * @param server if non-null, use this as an server id override.
   * @param appVersion if non-null, use this as an application version override.
   *
   * @throws IOException if an error occurs while trying to read the
   * {@code Application}.
   * @throws com.google.apphosting.utils.config.AppEngineConfigException if the
   * {@code Application's} appengine-web.xml file is malformed.
   */
  public static Application readApplication(String path,
      String appId,
      String server,
      String appVersion) throws IOException {
    return new Application(path, appId, server, appVersion);
  }

  /**
   * Returns the application identifier, from the AppEngineWebXml config
   * @return application identifier
   */
  @Override
  public String getAppId() {
    return appEngineWebXml.getAppId();
  }

  /**
   * Returns the application version, from the AppEngineWebXml config
   * @return application version
   */
  @Override
  public String getVersion() {
    return appEngineWebXml.getMajorVersionId();
  }

  @Override
  public String getSourceLanguage() {
    return appEngineWebXml.getSourceLanguage();
  }

  @Override
  public String getServer() {
    return appEngineWebXml.getServer();
  }

  @Override
  public String getInstanceClass() {
    return appEngineWebXml.getInstanceClass();
  }

  @Override
  public boolean isPrecompilationEnabled() {
    return appEngineWebXml.getPrecompilationEnabled();
  }

  @Override
  public List<ErrorHandler> getErrorHandlers() {
    class ErrorHandlerImpl implements ErrorHandler {
      private AppEngineWebXml.ErrorHandler errorHandler;
      public ErrorHandlerImpl(AppEngineWebXml.ErrorHandler errorHandler) {
        this.errorHandler = errorHandler;
      }
      @Override
      public String getFile() {
        return "__static__/" + errorHandler.getFile();
      }
      @Override
      public String getErrorCode() {
        return errorHandler.getErrorCode();
      }
      @Override
      public String getMimeType() {
        return getMimeTypeIfStatic(getFile());
      }
    }
    List<ErrorHandler> errorHandlers = new ArrayList<ErrorHandler>();
    for (AppEngineWebXml.ErrorHandler errorHandler: appEngineWebXml.getErrorHandlers()) {
      errorHandlers.add(new ErrorHandlerImpl(errorHandler));
    }
    return errorHandlers;
  }

  @Override
  public String getMimeTypeIfStatic(String path) {
    if (!path.contains("__static__/")) {
      return null;
    }
    String mimeType = webXml.getMimeTypeForPath(path);
    if (mimeType != null) {
      return mimeType;
    }
    return guessContentTypeFromName(path);
  }

  /**
   * @param fileName path of a file with extension
   * @return the mimetype of the file (or application/octect-stream if not recognized)
   */
  public static String guessContentTypeFromName(String fileName) {
    String defaultValue = "application/octet-stream";
    try {
      Buffer buffer = mimeTypes.getMimeByExtension(fileName);
      if (buffer != null) {
        return new String(buffer.asArray());
      }
      String lowerName = fileName.toLowerCase();
      if (lowerName.endsWith(".json")) {
        return "application/json";
      }
      FileTypeMap typeMap = FileTypeMap.getDefaultFileTypeMap();
      String ret = typeMap.getContentType(fileName);
      if (ret != null) {
        return ret;
      }
      ret = URLConnection.guessContentTypeFromName(fileName);
      if (ret != null) {
        return ret;
      }
      return defaultValue;
    } catch (Throwable t) {
      logger.log(Level.WARNING, "Error identify mimetype for " + fileName, t);
      return defaultValue;
    }
  }
  /**
   * Returns the AppEngineWebXml describing the application.
   *
   * @return a not {@code null} deployment descriptor
   */
  public AppEngineWebXml getAppEngineWebXml() {
    return appEngineWebXml;
  }

  /**
   * Returns the CronXml describing the applications' cron jobs.
   * @return a cron descriptor, possibly empty or {@code null}
   */
  @Override
  public CronXml getCronXml() {
    return cronXml;
  }

  /**
   * Returns the QueueXml describing the applications' task queues.
   * @return a queue descriptor, possibly empty or {@code null}
   */
  @Override
  public QueueXml getQueueXml() {
    return queueXml;
  }

  /**
   * Returns the DosXml describing the applications' DoS entries.
   * @return a dos descriptor, possibly empty or {@code null}
   */
  @Override
  public DosXml getDosXml() {
    return dosXml;
  }

  /**
   * Returns the pagespeed.yaml describing the applications' PageSpeed configuration.
   * @return a pagespeed.yaml string, possibly empty or {@code null}
   */
  @Override
  public String getPagespeedYaml() {
    return pagespeedYaml;
  }

  /**
   * Returns the IndexesXml describing the applications' indexes.
   * @return a index descriptor, possibly empty or {@code null}
   */
  @Override
  public IndexesXml getIndexesXml() {
    return indexesXml;
  }

  /**
   * Returns the WebXml describing the applications' servlets and generic web
   * application information.
   *
   * @return a WebXml descriptor, possibly empty but not {@code null}
   */
  public WebXml getWebXml() {
    return webXml;
  }

  @Override
  public BackendsXml getBackendsXml() {
    return backendsXml;
  }

  /**
   * Returns the desired API version for the current application, or
   * {@code "none"} if no API version was used.
   *
   * @throws IllegalStateException if createStagingDirectory has not been called.
   */
  @Override
  public String getApiVersion() {
    if (apiVersion == null) {
      throw new IllegalStateException("Must call createStagingDirectory first.");
    }
    return apiVersion;
  }

  /**
   * Returns a path to an exploded WAR directory for the application.
   * This may be a temporary directory.
   *
   * @return a not {@code null} path pointing to a directory
   */
  @Override
  public String getPath() {
    return baseDir.getAbsolutePath();
  }

  /**
   * Returns the staging directory, or {@code null} if none has been created.
   */
  @Override
  public File getStagingDir() {
    return stageDir;
  }

  @Override
  public void resetProgress() {
    updateProgress = 0;
    progressAmount = 0;
  }

  /**
   * Creates a new staging directory, if needed, or returns the existing one
   * if already created.
   *
   * @param opts User-specified options for processing the application.
   * @return staging directory
   * @throws IOException
   */
  @Override
  public File createStagingDirectory(ApplicationProcessingOptions opts,
      ResourceLimits resourceLimits) throws IOException {
    if (stageDir != null) {
      return stageDir;
    }

    int i = 0;
    while (stageDir == null && i++ < 3) {
      try {
        stageDir = File.createTempFile(STAGEDIR_PREFIX, null);
      } catch (IOException ex) {
        continue;
      }
      stageDir.delete();
      if (stageDir.mkdir() == false) {
        stageDir = null;
      }
    }
    if (i == 3) {
      throw new IOException("Couldn't create a temporary directory in 3 tries.");
    }
    statusUpdate("Created staging directory at: '" + stageDir.getPath() + "'", 20);

    File staticDir = new File(stageDir, "__static__");
    staticDir.mkdir();
    copyOrLink(baseDir, stageDir, staticDir, false, opts);
    if (externalResourceDir != null) {
      String previousPrefix = appEngineWebXml.getSourcePrefix();
      String newPrefix = buildNormalizedPath(externalResourceDir);
      try {
        appEngineWebXml.setSourcePrefix(newPrefix);
        copyOrLink(externalResourceDir, stageDir, staticDir, false, opts);
      } finally {
        appEngineWebXml.setSourcePrefix(previousPrefix);
      }
    }
    if (Boolean.getBoolean(AppCfg.USE_JAVA6_SYSTEM_PROP)) {
      CheckJava7Classes verifier = new CheckJava7Classes(new File(stageDir, "WEB-INF"));
      if (verifier.isJava7App()) {
        throw new AppEngineConfigException("The application contains Java 7 bytecode " +
            "which cannot run on a Java 6 runtime.");
      } else {
        statusUpdate("Deploying the application to a Java 6 runtime. Note that the Java 6 " +
            "runtime will decommissioned in the near future.");
      }
    }

    if (opts.isCompileJspsSet()) {
      compileJsps(stageDir, opts);
    }

    apiVersion = findApiVersion(stageDir, true);

    appYaml = generateAppYaml(stageDir);

    if (GenerationDirectory.getGenerationDirectory(stageDir).mkdirs()) {
      writePreparedYamlFile("app", appYaml);
      writePreparedYamlFile("backends", backendsXml == null ? null : backendsXml.toYaml());
      writePreparedYamlFile("index", indexesXml.size() == 0 ? null : indexesXml.toYaml());
      writePreparedYamlFile("cron", cronXml == null ? null : cronXml.toYaml());
      writePreparedYamlFile("queue", queueXml == null ? null : queueXml.toYaml());
      writePreparedYamlFile("dos", dosXml == null ? null : dosXml.toYaml());
    }

    int maxJarSize = (int) resourceLimits.maxFileSize();

    if (opts.isSplitJarsSet()) {
      splitJars(new File(new File(stageDir, "WEB-INF"), "lib"),
                maxJarSize, opts.getJarSplittingExcludes());
    }

    if (getSourceLanguage() != null) {
      SDKRuntimePlugin runtimePlugin = SDKPluginManager.findRuntimePlugin(getSourceLanguage());
      if (runtimePlugin != null) {
        runtimePlugin.processStagingDirectory(stageDir);
      }
    }

    return stageDir;
  }

  /**
   * Write yaml file to generation subdirectory within stage directory.
   */
  private void writePreparedYamlFile(String yamlName, String yamlString) throws IOException {
    File f = new File(GenerationDirectory.getGenerationDirectory(stageDir), yamlName + ".yaml");
    if (yamlString != null  && f.createNewFile()) {
      FileWriter fw = new FileWriter(f);
      fw.write(yamlString);
      fw.close();
    }
  }

  private static String findApiVersion(File baseDir, boolean deleteApiJars) {
    ApiVersionFinder finder = new ApiVersionFinder();

    String foundApiVersion = null;
    File webInf = new File(baseDir, "WEB-INF");
    File libDir = new File(webInf, "lib");
    for (File file : new FileIterator(libDir)) {
      if (file.getPath().endsWith(".jar")) {
        try {
          String apiVersion = finder.findApiVersion(file);
          if (apiVersion != null) {
            if (foundApiVersion == null) {
              foundApiVersion = apiVersion;
            } else if (!foundApiVersion.equals(apiVersion)) {
              logger.warning("Warning: found duplicate API version: " + foundApiVersion +
                             ", using " + apiVersion);
            }
            if (deleteApiJars) {
              file.delete();
            }
          }
        } catch (IOException ex) {
          logger.log(Level.WARNING, "Could not identify API version in " + file, ex);
        }
      }
    }

    if (foundApiVersion == null) {
      foundApiVersion = "none";
    }
    return foundApiVersion;
  }

  /**
   * Validates a given XML document against a given schema.
   *
   * @param xmlFilename filename with XML document
   * @param schema XSD schema to validate with
   *
   * @throws AppEngineConfigException for malformed XML, or IO errors
   */
  private static void validateXml(String xmlFilename, File schema) {
    File xml = new File(xmlFilename);
    if (!xml.exists()) {
      return;
    }
    try {
      SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
      try {
        factory.newSchema(schema).newValidator().validate(
            new StreamSource(new FileInputStream(xml)));
      } catch (SAXException ex) {
        throw new AppEngineConfigException("XML error validating " +
            xml.getPath() + " against " + schema.getPath(), ex);
      }
    } catch (IOException ex) {
      throw new AppEngineConfigException("IO error validating " +
          xml.getPath() + " against " + schema.getPath(), ex);
    }
  }

  private static final String JSPC_MAIN = "com.google.appengine.tools.development.LocalJspC";

  private void compileJsps(File stage, ApplicationProcessingOptions opts)
      throws IOException {
    statusUpdate("Scanning for jsp files.");

    if (matchingFileExists(new File(stage.getPath()), JSP_REGEX)) {
      statusUpdate("Compiling jsp files.");

      File webInf = new File(stage, "WEB-INF");

      for (File file : SdkImplInfo.getUserJspLibFiles()) {
        copyOrLinkFile(file, new File(new File(webInf, "lib"), file.getName()));
      }
      for (File file : SdkImplInfo.getSharedJspLibFiles()) {
        copyOrLinkFile(file, new File(new File(webInf, "lib"), file.getName()));
      }

      File classes = new File(webInf, "classes");
      File generatedWebXml = new File(webInf, "generated_web.xml");
      File tempDir = Files.createTempDir();
      String classpath = getJspClasspath(classes, tempDir);

      String javaCmd = opts.getJavaExecutable().getPath();
      String[] args = new String[] {
        javaCmd,
        "-classpath", classpath,
        "-D" + AppCfg.USE_JAVA6_SYSTEM_PROP + "=" +
            Boolean.getBoolean(AppCfg.USE_JAVA6_SYSTEM_PROP),
        JSPC_MAIN,
        "-uriroot", stage.getPath(),
        "-p", "org.apache.jsp",
        "-l", "-v",
        "-webinc", generatedWebXml.getPath(),
        "-d", tempDir.getPath(),
        "-javaEncoding", opts.getCompileEncoding(),
      };
      Process jspc = startProcess(args);

      int status = 1;
      try {
        status = jspc.waitFor();
      } catch (InterruptedException ex) { }

      if (status != 0) {
        detailsWriter.println("Error while executing: " + formatCommand(Arrays.asList(args)));
        throw new JspCompilationException("Failed to compile jsp files.",
                                          JspCompilationException.Source.JASPER);
      }

      compileJavaFiles(classpath, webInf, tempDir, opts);

      webXml = new WebXmlReader(stage.getPath()).readWebXml();

    }
  }

  private void compileJavaFiles(String classpath, File webInf, File jspClassDir,
      ApplicationProcessingOptions opts) throws IOException {

    JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
    if (compiler == null) {
      throw new RuntimeException(
          "Cannot get the System Java Compiler. Please use a JDK, not a JRE.");
    }
    StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);

    ArrayList<File> files = new ArrayList<File>();
    for (File f : new FileIterator(jspClassDir)) {
      if (f.getPath().toLowerCase().endsWith(".java")) {
        files.add(f);
      }
    }
    if (files.size() == 0) {
      return;
    }
    List<String> optionList = new ArrayList<String>();
    optionList.addAll(Arrays.asList("-classpath", classpath.toString()));
    optionList.addAll(Arrays.asList("-d", jspClassDir.getPath()));
    optionList.addAll(Arrays.asList("-encoding", opts.getCompileEncoding()));
    if (Boolean.getBoolean(AppCfg.USE_JAVA6_SYSTEM_PROP)) {
      optionList.addAll(Arrays.asList("-source", "6"));
      optionList.addAll(Arrays.asList("-target", "6"));
    }

    Iterable<? extends JavaFileObject> compilationUnits =
        fileManager.getJavaFileObjectsFromFiles(files);
    boolean success = compiler.getTask(
        null, fileManager, null, optionList, null, compilationUnits).call();
    fileManager.close();

    if (!success) {
      throw new JspCompilationException("Failed to compile the generated JSP java files.",
          JspCompilationException.Source.JSPC);
    }
    if (opts.isJarJSPsSet()) {
      zipJasperGeneratedFiles(webInf, jspClassDir);
    } else {
      copyOrLinkDirectories(jspClassDir, new File(webInf, "classes"));
    }
    if (opts.isDeleteJSPs()) {
      for (File f : new FileIterator(webInf.getParentFile())) {
        if (f.getPath().toLowerCase().endsWith(".jsp")) {
          f.delete();
        }
      }
    }
    if (opts.isJarClassesSet()) {
      zipWebInfClassesFiles(webInf);

    }
  }

  private void zipJasperGeneratedFiles(File webInfDir, File jspClassDir) throws IOException {
    Set<String> fileTypesToExclude = ImmutableSet.of(".java");
    File libDir = new File(webInfDir, "lib");
    JarTool jarTool = new JarTool(
        COMPILED_JSP_JAR_NAME_PREFIX, jspClassDir, libDir, MAX_COMPILED_JSP_JAR_SIZE,
        fileTypesToExclude);
    jarTool.run();
    recursiveDelete(jspClassDir);
  }

  private void zipWebInfClassesFiles(File webInfDir) throws IOException {
    File libDir = new File(webInfDir, "lib");
    File classesDir = new File(webInfDir, "classes");
    JarTool jarTool = new JarTool(
        CLASSES_JAR_NAME_PREFIX, classesDir, libDir, MAX_CLASSES_JAR_SIZE,
        null);
    jarTool.run();
    recursiveDelete(classesDir);
    classesDir.mkdir();
  }

  private String getJspClasspath(File classDir, File genDir) {
    StringBuilder classpath = new StringBuilder();
    for (URL lib : SdkImplInfo.getImplLibs()) {
      classpath.append(lib.getPath());
      classpath.append(File.pathSeparatorChar);
    }
    for (File lib : SdkInfo.getSharedLibFiles()) {
      classpath.append(lib.getPath());
      classpath.append(File.pathSeparatorChar);
    }

    classpath.append(classDir.getPath());
    classpath.append(File.pathSeparatorChar);
    classpath.append(genDir.getPath());
    classpath.append(File.pathSeparatorChar);

    for (File f : new FileIterator(new File(classDir.getParentFile(), "lib"))) {
      String filename = f.getPath().toLowerCase();
      if (filename.endsWith(".jar") || filename.endsWith(".zip")) {
        classpath.append(f.getPath());
        classpath.append(File.pathSeparatorChar);
      }
    }

    return classpath.toString();
  }

  private Process startProcess(String... args) throws IOException {
    ProcessBuilder builder = new ProcessBuilder(args);
    Process proc = builder.redirectErrorStream(true).start();
    logger.fine(formatCommand(builder.command()));
    new Thread(new OutputPump(proc.getInputStream(), detailsWriter)).start();
    return proc;
  }

  private String formatCommand(Iterable<String> args) {
    StringBuilder command = new StringBuilder();
    for (String chunk : args) {
      command.append(chunk);
      command.append(" ");
    }
    return command.toString();
  }

  /**
   * Scans a given directory tree, testing whether any file matches a given
   * pattern.
   *
   * @param dir the directory under which to scan
   * @param regex the pattern to look for
   * @returns Returns {@code true} on the first instance of such a file,
   *   {@code false} otherwise.
   */
  private static boolean matchingFileExists(File dir, Pattern regex) {
    for (File file : dir.listFiles()) {
      if (file.isDirectory()) {
        if (matchingFileExists(file, regex)) {
          return true;
        }
      } else {
        if (regex.matcher(file.getName()).matches()) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Invokes the JarSplitter code on any jar files found in {@code dir}.  Any
   * jars larger than {@code max} will be split into fragments of at most that
   * size.
   * @param dir the directory to search, recursively
   * @param max the maximum allowed size
   * @param excludes a set of suffixes to exclude.
   * @throws IOException on filesystem errors.
   */
  private static void splitJars(File dir, int max, Set<String> excludes) throws IOException {
    String children[] = dir.list();
    if (children == null) {
      return;
    }
    for (String name : children) {
      File subfile = new File(dir, name);
      if (subfile.isDirectory()) {
        splitJars(subfile, max, excludes);
      } else if (name.endsWith(".jar")) {
        if (subfile.length() > max) {
          new JarSplitter(subfile, dir, max, false, 4, excludes).run();
          subfile.delete();
        }
      }
    }
  }

  private static final Pattern SKIP_FILES = Pattern.compile(
      "^(.*/)?((#.*#)|(.*~)|(.*/RCS/.*)|)$");

  /**
   * Copies files from the app to the upload staging directory, or makes
   * symlinks instead if supported.  Puts the files into the correct places for
   * static vs. resource files, recursively.
   *
   * @param sourceDir application war dir, or on recursion a subdirectory of it
   * @param resDir staging resource dir, or on recursion a subdirectory matching
   *    the subdirectory in {@code sourceDir}
   * @param staticDir staging {@code __static__} dir, or an appropriate recursive
   *    subdirectory
   * @param forceResource if all files should be considered resource files
   * @param opts processing options, used primarily for handling of *.jsp files
   * @throws FileNotFoundException
   * @throws IOException
   */
  private void copyOrLink(File sourceDir, File resDir, File staticDir, boolean forceResource,
      ApplicationProcessingOptions opts)
    throws FileNotFoundException, IOException {

    for (String name : sourceDir.list()) {
      File file = new File(sourceDir, name);

      String path = file.getPath();
      if (File.separatorChar == '\\') {
        path = path.replace('\\', '/');
      }

      if (file.getName().startsWith(".") ||
          file.equals(GenerationDirectory.getGenerationDirectory(baseDir))) {
        continue;
      }

      if (file.isDirectory()) {
        if (file.getName().equals("WEB-INF")) {
          copyOrLink(file, new File(resDir, name), new File(staticDir, name), true, opts);
        } else {
          copyOrLink(file, new File(resDir, name), new File(staticDir, name), forceResource,
              opts);
        }
      } else {
        if (SKIP_FILES.matcher(path).matches()) {
          continue;
        }

        if (forceResource || appEngineWebXml.includesResource(path) ||
            (opts.isCompileJspsSet() && name.toLowerCase().endsWith(".jsp"))) {
          copyOrLinkFile(file, new File(resDir, name));
        }
        if (!forceResource && appEngineWebXml.includesStatic(path)) {
          copyOrLinkFile(file, new File(staticDir, name));
        }
      }
    }
  }

  /**
   * Attempts to symlink a single file, or copies it if symlinking is either
   * unsupported or fails.
   *
   * @param source source file
   * @param dest destination file
   * @throws FileNotFoundException
   * @throws IOException
   */
  private void copyOrLinkFile(File source, File dest)
      throws FileNotFoundException, IOException {
    dest.getParentFile().mkdirs();
    if (ln != null && !source.getName().endsWith("web.xml")) {

      try {
        dest.delete();
      } catch (Exception e) {
        System.err.println("Warning: We tried to delete " + dest.getPath());
        System.err.println("in order to create a symlink from " + source.getPath());
        System.err.println("but the delete failed with message: " + e.getMessage());
      }

      Process link = startProcess(ln.getAbsolutePath(), "-s",
                                  source.getAbsolutePath(),
                                  dest.getAbsolutePath());
      try {
        int stat = link.waitFor();
        if (stat == 0) {
          return;
        }
        System.err.println(ln.getAbsolutePath() + " returned status " + stat
            + ", copying instead...");
      } catch (InterruptedException ex) {
        System.err.println(ln.getAbsolutePath() + " was interrupted, copying instead...");
      }
      if (dest.delete()) {
        System.err.println("ln failed but symlink was created, removed: " + dest.getAbsolutePath());
      }
    }
    byte buffer[] = new byte[1024];
    int readlen;
    FileInputStream inStream = new FileInputStream(source);
    FileOutputStream outStream = new FileOutputStream(dest);
    try {
      readlen = inStream.read(buffer);
      while (readlen > 0) {
        outStream.write(buffer, 0, readlen);
        readlen = inStream.read(buffer);
      }
    } finally {
      try {
        inStream.close();
      } catch (IOException ex) {
      }
      try {
        outStream.close();
      } catch (IOException ex) {
      }
    }
  }
  /** Copy (or link) one directory into another one.
   */
  private void copyOrLinkDirectories(File sourceDir, File destination)
      throws IOException {

    for (String name : sourceDir.list()) {
      File file = new File(sourceDir, name);
      if (file.isDirectory()) {
        copyOrLinkDirectories(file, new File(destination, name));
      } else {
        copyOrLinkFile(file, new File(destination, name));
      }
    }
  }

  /** deletes the staging directory, if one was created. */
  @Override
  public void cleanStagingDirectory() {
    if (stageDir != null) {
      recursiveDelete(stageDir);
    }
  }

  /** Recursive directory deletion. */
  public static void recursiveDelete(File dead) {
    String[] files = dead.list();
    if (files != null) {
      for (String name : files) {
        recursiveDelete(new File(dead, name));
      }
    }
    dead.delete();
  }

  @Override
  public void setListener(UpdateListener l) {
    listener = l;
  }

  @Override
  public void setDetailsWriter(PrintWriter detailsWriter) {
    this.detailsWriter = detailsWriter;
  }

  @Override
  public void statusUpdate(String message, int amount) {
    updateProgress += progressAmount;
    if (updateProgress > 99) {
      updateProgress = 99;
    }
    progressAmount = amount;
    if (listener != null) {
      listener.onProgress(new UpdateProgressEvent(
                              Thread.currentThread(), message, updateProgress));
    }
  }

  @Override
  public void statusUpdate(String message) {
    int amount = progressAmount / 4;
    updateProgress += amount;
    if (updateProgress > 99) {
      updateProgress = 99;
    }
    progressAmount -= amount;
    if (listener != null) {
      listener.onProgress(new UpdateProgressEvent(
                              Thread.currentThread(), message, updateProgress));
    }
  }

  private String generateAppYaml(File stageDir) {
    Set<String> staticFiles = new HashSet<String>();
    for (File f : new FileIterator(new File(stageDir, "__static__"))) {
      staticFiles.add(Utility.calculatePath(f, stageDir));
    }

    AppYamlTranslator translator =
        new AppYamlTranslator(getAppEngineWebXml(), getWebXml(), getBackendsXml(),
                              getApiVersion(), staticFiles, null);
    String yaml = translator.getYaml();
    logger.fine("Generated app.yaml file:\n" + yaml);
    return yaml;
  }

  /**
   * Returns the app.yaml string.
   *
   * @throws IllegalStateException if createStagingDirectory has not been called.
   */
  @Override
  public String getAppYaml() {
    if (appYaml == null) {
      throw new IllegalStateException("Must call createStagingDirectory first.");
    }
    return appYaml;
  }

  /**
   * Utility to check if an application contains Java7 bytes code class.
   * It only checks the first class available.
   */
   static class CheckJava7Classes {
    boolean oneClassFound = false;
    boolean classRequiresJava7 = false;
    File webInf;

    public CheckJava7Classes(File webInfDirectory) {
      webInf = webInfDirectory;
    }

    /**
     *
     * @return true if the app contains a java7 class.
     */
    public boolean isJava7App() {
      processClassesInDirectory(new File(webInf, "classes"));
      if (!classRequiresJava7) {
        processJarsInDirectory(new File(webInf, "lib"));
      }
      return classRequiresJava7;
    }

    private void processClassesInDirectory(File dir) {
      File[] files = dir.listFiles();
      if (files != null) {
        for (File f : files) {
          if (oneClassFound) {
            break;
          }
          if (f.isDirectory()) {
            processClassesInDirectory(f);
          } else if (f.getName().endsWith(".class")) {
            oneClassFound = true;
            try {
              processStream(new FileInputStream(f));
            } catch (IOException e) {
              logger.severe(e.getMessage());
            }
          }
        }
      }
    }

    /**
     * Check for all jars in the given directory (WEB-INF/lib).
     */
    private void processJarsInDirectory(File webInfLib) {
      File[] files = webInfLib.listFiles();
      if (files != null) {
        for (File f : files) {
          if (f.getName().endsWith(".jar")) {
            try {
              processJar(f);
            } catch (IOException e) {
              logger.severe(e.getMessage());
            }
            if (classRequiresJava7) {
              break;
            }
          }
        }
      }
    }

    private void processJar(File f) throws IOException {
        JarFile jarFile = new JarFile(f);
        Enumeration<JarEntry> entries = jarFile.entries();
        while (entries.hasMoreElements()) {
          JarEntry entry = entries.nextElement();
          if (entry.getName().endsWith(".class")) {
            processStream(jarFile.getInputStream(entry));
            break;
          }
        }
    }

    private void processStream(InputStream is) {
      DataInputStream in = null;
      try {
        in = new DataInputStream(is);
        int magic = in.readInt();
        if (magic != 0xcafebabe) {
          return;
        }
        int minor = in.readUnsignedShort();
        int major = in.readUnsignedShort();
        classRequiresJava7 = major == 51;

      } catch (IOException e) {
      } finally {
        if (in != null) {
          try {
            in.close();
          } catch (IOException ex) {
          }
        }
      }
    }
  }
}
