// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ConnectOptions;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Connection to the AppEngine hosting service, as set by {@link ConnectOptions}
 *
 */
public abstract class AbstractServerConnection implements ServerConnection {

  private static final int MAX_SEND_RETRIES = 3;

  protected interface DataPoster {
    void post(OutputStream s) throws IOException;
  }

  private static class FilePoster implements DataPoster {
    private static final int BUFFER_SIZE = 4 * 1024;
    private File file;

    public FilePoster(File file) {
      assert (file != null && file.exists());
      this.file = file;
    }

    @Override
    public void post(OutputStream out) throws IOException {
      InputStream in = new FileInputStream(file);
      try {
        byte[] buf = new byte[BUFFER_SIZE];
        int len;
        while ((len = in.read(buf)) != -1) {
          out.write(buf, 0, len);
        }
      } finally {
        in.close();
      }
    }
  }

  static class StringPoster implements DataPoster {
    private String str;

    public StringPoster(String s) {
      str = s;
    }

    @Override
    public void post(OutputStream s) throws IOException {
      s.write(str.getBytes("UTF-8"));
    }
  }

  protected static final String POST = "POST";

  protected static final String GET = "GET";

  protected ConnectOptions options;

  protected static Logger logger =
      Logger.getLogger(AbstractServerConnection.class.getCanonicalName());

  protected AbstractServerConnection() {
  }

  protected AbstractServerConnection(ConnectOptions options) {
    this.options = options;
    if (System.getProperty("http.proxyHost") != null) {
      logger.info("proxying HTTP through " + System.getProperty("http.proxyHost") + ":"
          + System.getProperty("http.proxyPort"));
    }
    if (System.getProperty("https.proxyHost") != null) {
      logger.info("proxying HTTPS through " + System.getProperty("https.proxyHost") + ":"
          + System.getProperty("https.proxyPort"));
    }
  }

  protected String buildQuery(Map<String, String> params) throws UnsupportedEncodingException {
    StringBuffer buf = new StringBuffer();
    for (String key : params.keySet()) {
      buf.append(URLEncoder.encode(key, "UTF-8"));
      buf.append('=');
      buf.append(URLEncoder.encode(params.get(key), "UTF-8"));
      buf.append('&');
    }
    return buf.toString();
  }

  protected URL buildURL(String path) throws MalformedURLException {
    String protocol = options.getSecure() ? "https" : "http";
    return new URL(protocol + "://" + options.getServer() + path);
  }

  protected IOException connect(String method, HttpURLConnection conn, DataPoster data)
      throws IOException {
    doPreConnect(method, conn, data);
    conn.setInstanceFollowRedirects(false);
    conn.setRequestMethod(method);

    if (POST.equals(method)) {
      conn.setDoOutput(true);
      OutputStream out = conn.getOutputStream();
      if (data != null) {
        data.post(out);
      }
      out.close();
    }

    try {
      conn.getInputStream();
    } catch (IOException ex) {
      return ex;
    } finally {
      doPostConnect(method, conn, data);
    }

    return null;
  }

  protected String constructHttpErrorMessage(HttpURLConnection conn, BufferedReader reader)
      throws IOException {
    StringBuilder sb = new StringBuilder("Error posting to URL: ");
    sb.append(conn.getURL());
    sb.append('\n');
    sb.append(conn.getResponseCode());
    sb.append(' ');
    sb.append(conn.getResponseMessage());
    sb.append('\n');
    if (reader != null) {
      for (String line; (line = reader.readLine()) != null;) {
        sb.append(line);
        sb.append('\n');
      }
    }
    return sb.toString();
  }

  protected abstract void doHandleSendErrors(int status, URL url, HttpURLConnection conn,
      BufferedReader connReader) throws IOException;

  protected abstract void doPostConnect(String method, HttpURLConnection conn, DataPoster data)
      throws IOException;

  protected abstract void doPreConnect(String method, HttpURLConnection conn, DataPoster data)
      throws IOException;

  @Override
  public String get(String url, Map<String, String> params) throws IOException {
    return send(GET, url, null, null, params);
  }

  private static InputStream getInputStream(HttpURLConnection conn) {
    InputStream is;
    try {
      return conn.getInputStream();
    } catch (IOException ex) {
      return conn.getErrorStream();
    }
  }

  private static BufferedReader getReader(InputStream is) {
    if (is == null) {
      return null;
    }
    return new BufferedReader(new InputStreamReader(is));
  }

  protected static String getString(InputStream is) throws IOException {
    StringBuffer response = new StringBuffer();
    InputStreamReader reader = new InputStreamReader(is);
    char buffer[] = new char[8192];
    int read = 0;
    while ((read = reader.read(buffer)) != -1) {
      response.append(buffer, 0, read);
    }
    return response.toString();
  }

  protected static BufferedReader getReader(HttpURLConnection conn) {
    return getReader(getInputStream(conn));
  }

  @Override
  public String post(String url, File payload, String contentType, Map<String, String> params)
      throws IOException {
    return send(POST, url, new FilePoster(payload), contentType, params);
  }

  @Override
  public String post(String url, File payload, String contentType, String... params)
      throws IOException {
    return send(POST, url, new FilePoster(payload), contentType, getParamMap(params));
  }

  @Override
  public String post(String url, List<AppVersionUpload.FileInfo> payload, String... params)
      throws IOException {
    return sendBatch(POST, url, payload, getParamMap(params));
  }

  @Override
  public String post(String url, String payload, Map<String, String> params) throws IOException {
    return send(POST, url, new StringPoster(payload), null, params);
  }

  @Override
  public String post(String url, String payload, String... params) throws IOException {
    return send(POST, url, new StringPoster(payload), null, getParamMap(params));
  }

  /**
   * Returns an input stream that reads from this open connection. If the server returned
   * an error (404, etc), return the error stream instead.
   *
   * @return {@code InputStream} for the server response.
   */
  @Override
  public InputStream postAndGetInputStream(String url, String payload, String... params)
    throws IOException {
    return send1(POST, url, new StringPoster(payload), null, getParamMap(params));
  }

  protected HttpURLConnection openConnection(URL url) throws IOException {
    return (HttpURLConnection) url.openConnection();
  }

  protected String send(String method, String path, DataPoster payload, String content_type,
                        Map<String, String> params) throws IOException {
    return getString(send1(method, path, payload, content_type, params));
  }

  private Map<String, String> getParamMap(String... params) {
    Map<String, String> paramMap = new HashMap<String, String>();
    for (int i = 0; i < params.length; i += 2) {
      paramMap.put(params[i], params[i + 1]);
    }
    return paramMap;
  }

  private InputStream send1(String method, String path, DataPoster payload, String content_type,
      Map<String, String> params) throws IOException {

    URL url = buildURL(path + '?' + buildQuery(params));

    if (content_type == null) {
      content_type = Application.guessContentTypeFromName(path);
    }

    int tries = 0;
    while (true) {
      HttpURLConnection conn = openConnection(url);
      conn.setRequestProperty("Content-type", content_type);
      conn.setRequestProperty("X-appcfg-api-version", "1");

      if (options.getHost() != null) {
        conn.setRequestProperty("Host", options.getHost());
      }

      IOException ioe = connect(method, conn, payload);

      int status = conn.getResponseCode();

      if (status == HttpURLConnection.HTTP_OK) {
        return getInputStream(conn);
      } else {
        BufferedReader reader = getReader(conn);
        logger.finer("Got http error " + status + ". this is try #" + tries);
        if (++tries > MAX_SEND_RETRIES) {
          throw new HttpIoException(constructHttpErrorMessage(conn, reader),
              status);
        }
        doHandleSendErrors(status, url, conn, reader);
      }
    }
  }

  protected String sendBatch(String method, String path, List<AppVersionUpload.FileInfo> payload,
      Map<String, String> params) throws IOException {
    return getString(sendBatchPayload(method, path, payload, params));
  }

  private InputStream sendBatchPayload(String method, String path,
      List<AppVersionUpload.FileInfo> payload,
      Map<String, String> params) throws IOException {

    URL url = buildURL(path + '?' + buildQuery(params));

    int tries = 0;
    while (true) {
      String boundary = "boundary" + Long
          .toHexString(System.currentTimeMillis());
      HttpURLConnection conn = openConnection(url);
      conn.setRequestProperty("MIME-Version", "1.0");
      conn.setRequestProperty("Content-Type", "message/rfc822");
      conn.setRequestProperty("X-appcfg-api-version", "1");
      doPreConnect(method, conn, null);
      conn.setDoOutput(true);
      conn.setRequestMethod(method);

      if (options.getHost() != null) {
        conn.setRequestProperty("Host", options.getHost());
      }
      conn.setInstanceFollowRedirects(false);

      populateMixedPayloadStream(conn.getOutputStream(), payload, boundary);

      doPostConnect(method, conn, null);

      int status = conn.getResponseCode();
      if (status == HttpURLConnection.HTTP_OK) {
        return getInputStream(conn);
      } else {
        BufferedReader reader = getReader(conn);
        logger.finer("Got http error " + status + ". this is try #" + tries);
        if (++tries > MAX_SEND_RETRIES) {
          throw new IOException(constructHttpErrorMessage(conn, reader));
        }
        doHandleSendErrors(status, url, conn, reader);
      }

    }
  }

  void populateMixedPayloadStream(OutputStream output,
      List<AppVersionUpload.FileInfo> payload, String boundary) throws IOException {

    String charset = "UTF-8";
    String lf = "\n";
    PrintWriter writer = null;
    try {
      writer = new PrintWriter(new OutputStreamWriter(output, charset),
          true);
      writer.append("Content-Type: multipart/mixed; boundary=\"" + boundary + "\"").append(lf);
      writer.append("MIME-Version: 1").append(lf);
      writer.append(lf).append("This is a message with multiple parts in MIME format.").append(lf);

      for (AppVersionUpload.FileInfo fileInfo : payload) {

        File binaryFile = fileInfo.file;
        writer.append("--" + boundary).append(lf);
        writer.append("X-Appcfg-File: ").append(URLEncoder.encode(fileInfo.path, "UTF-8"))
            .append(lf);
        writer.append("X-Appcfg-Hash: ").append(fileInfo.hash).append(lf);
        String mimeValue = fileInfo.mimeType;
        if (mimeValue == null) {
          mimeValue = Application.guessContentTypeFromName(binaryFile.getName());
        }
        writer.append("Content-Type: " + mimeValue).append(lf);
        writer.append("Content-Length: ").append("" + binaryFile.length()).append(lf);
        writer.append("Content-Transfer-Encoding: 8bit").append(lf);

        writer.append(lf).flush();
        FilePoster filePoster = new FilePoster(binaryFile);
        filePoster.post(output);
        writer.append(lf).flush();
      }
      writer.append("--" + boundary + "--").append(lf);
      writer.append(lf).flush();

    } finally {
      if (writer != null) {
        writer.close();
      }
    }
  }
}
