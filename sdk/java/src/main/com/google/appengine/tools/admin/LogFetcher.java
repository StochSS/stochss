// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdmin.LogSeverity;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Class to (repeatedly, as necessary) request logs from the server.
 *
 *
 */
public class LogFetcher {

  private static final String LOG_URL = "/api/request_logs";
  private static final String APP_ID_TAG = "app_id";
  private static final String SERVER_TAG = "server";
  private static final String VERSION_TAG = "version";
  private static final String LOG_LIMIT_TAG = "limit";
  private static final String LOG_LIMIT = "100";
  private static final String OFFSET_TAG = "offset";
  private static final String SEVERITY_TAG = "severity";

  private static final Pattern NEXTOFFSET_PATTERN =
      Pattern.compile("^#\\s*next_offset=(\\S+)\\s*$");
  private static final char NEWLINE = '\n';

  private ServerConnection connection;
  private GenericApplication app;

  /**
   * Creates a {@code LogFetcher} for a specific application version's logs.
   *
   * @param app the application to fetch logs from
   * @param connection the server connection information to use when fetching
   */
  public LogFetcher(GenericApplication app, ServerConnection connection) {
    this.app = app;
    this.connection = connection;
  }

  /**
   * Fetches log records into the supplied output stream.
   *
   * @param numDays the nubmer of days of log records to fetch
   * @param severity the minimum severity to fetch
   * @param out the output location for log records
   * @throws IOException
   */
  public void fetch(int numDays, LogSeverity severity, OutputStream out)
      throws IOException {
    PrintWriter writer = new PrintWriter(out);
    String response;
    Date stopDate;
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MMM/yyyy", Locale.US);
    if (numDays > 0) {
      Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("America/Los_Angeles"),
          Locale.US);
      calendar.add(Calendar.DAY_OF_MONTH, -numDays);
      calendar.set(Calendar.HOUR_OF_DAY, 0);
      calendar.set(Calendar.MINUTE, 0);
      calendar.set(Calendar.SECOND, 0);
      calendar.set(Calendar.MILLISECOND, 0);
      stopDate = calendar.getTime();
    } else {
      stopDate = new Date(0L);
    }

    int recordCount = 0;

    app.statusUpdate("Beginning to retrieve log records...", 100);
    boolean moreLogs = true;
    String nextOffset = null;
    Map<String, String> httpArgs = new HashMap<String, String>();
    httpArgs.put(APP_ID_TAG, app.getAppId());
    if (app.getServer() != null) {
      httpArgs.put(SERVER_TAG, app.getServer());
    }
    httpArgs.put(VERSION_TAG, app.getVersion());
    httpArgs.put(LOG_LIMIT_TAG, LOG_LIMIT);
    if (severity != null) {
      httpArgs.put(SEVERITY_TAG, Integer.toString(severity.ordinal()));
    }

    while (moreLogs) {
      response = connection.get(LOG_URL, httpArgs);

      if (response.charAt(0) == '#') {
        String firstLine = response.substring(0, response.indexOf(NEWLINE));
        Matcher matcher = NEXTOFFSET_PATTERN.matcher(firstLine);
        if (matcher.matches()) {
          nextOffset = matcher.group(1);
          httpArgs.put(OFFSET_TAG, nextOffset);
        }
        response = response.substring(response.indexOf(NEWLINE) + 1);
      }
      if (response.lastIndexOf("\n#") > 0 || response.startsWith("#")) {
        response = response.substring(0, response.lastIndexOf("#"));
      }

      if (response.length() > 0) {
        int pos = 0;
        while (pos >= 0) {
          int lastpos = pos;
          if ((pos = response.indexOf(NEWLINE, pos)) >= 0) {
            pos++;
            String record = response.substring(lastpos, pos);
            Date recordDate = dateFormat.parse(record,
                new ParsePosition(record.indexOf('[') + 1));
            if (recordDate.before(stopDate)) {
              nextOffset = null;
              break;
            }
            record = record.replace("\0", "\n\t");
            writer.print(record);
            recordCount++;
          }
        }
        app.statusUpdate("Received " + recordCount + " log records...");
      }
      moreLogs = (nextOffset != null && response.length() > 0);
    }
    writer.close();
  }
}
