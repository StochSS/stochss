// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.tools.appstats.StatsProtos.IndividualRpcStatsProto;
import com.google.appengine.tools.appstats.StatsProtos.RequestStatProto;
import com.google.appengine.tools.appstats.TemplateTool.Option;
import com.google.apphosting.api.ApiProxy;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.Writer;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Wraps access to the templating library.
 * This class is thread-safe.
 *
 */
class Renderer {

  private final TemplateTool templateTool;

  private final Logger log = Logger.getLogger(getClass().getName());

  public Renderer() {
    this(false);
  }

  /**
   * Constructor, visible for testing
   * @param strict if set to true, template rendering will throw an exception
   *   whenever a field could not be found or a command is not known.
   */
  Renderer(boolean strict) {
    templateTool = new TemplateTool(strict ? Option.STRICT : Option.NON_STRICT){
      private final String prefix = "/apphosting/ext/appstats/templates/";

      @Override
      protected CharSequence loadTemplateSource(String name) throws IOException {
        return super.loadTemplateSource(prefix + name);
      }
      @Override
      public void format(Map<String, ?> parameters, Writer out, String templateName,
          String... parents) throws IOException, ParseException {
        Map<String, Object> extendedParams = new HashMap<String, Object>(parameters);
        Map<String, Object> env = new HashMap<String, Object>();
        extendedParams.put("env", env);
        env.put("APPLICATION_ID", getAppId());
        env.put("CURRENT_VERSION_ID", getCurrentVersionId());
        super.format(extendedParams, out, templateName, parents);
      }
    };
  }

  String getAppId() {
    return ApiProxy.getCurrentEnvironment().getAppId();
  }

  String getCurrentVersionId() {
    return ApiProxy.getCurrentEnvironment().getVersionId();
  }

  public void renderSummaries(Writer out, List<RequestStatProto> summaries) throws IOException {
    try {
      templateTool.format(
          StatsUtil.createSummaryStats(summaries),
          out,
          "main.html");
    } catch (ParseException e) {
      throw new AssertionError(e);
    }
  }

  public void renderDetails(Writer out, RequestStatProto detailedStats) throws IOException {
    try {
      templateTool.format(
          StatsUtil.createDetailedStats(detailedStats),
          out,
          "details.html");
    } catch (ParseException e) {
      throw new AssertionError(e);
    }
  }

  public boolean renderDetailsAsJson(Writer out, RequestStatProto detailedStats) {
    JSONObject json = new JSONObject();
    try {
      json.put("http_method", detailedStats.getHttpMethod());
      json.put("http_status", detailedStats.getHttpStatus());
      json.put("http_path", detailedStats.getHttpPath());
      json.put("http_query", detailedStats.getHttpQuery());
      json.put("duration", detailedStats.getDurationMilliseconds());
      json.put("format", "appstats");
      json.put("processor_total", StatsUtil.megaCyclesToMilliseconds(
          detailedStats.getProcessorMcycles()));
      JSONArray statsArray = new JSONArray();
      for (IndividualRpcStatsProto stat : detailedStats.getIndividualStatsList()) {
        JSONObject statJson = new JSONObject();
        statJson.put("name", stat.getServiceCallName());
        statJson.put("success", stat.getWasSuccessful());
        statJson.put("start", stat.getStartOffsetMilliseconds());
        statJson.put("duration", stat.getDurationMilliseconds());
        if (stat.hasCallCostMicrodollars()) {
          statJson.put("cost_micropennies", stat.getCallCostMicrodollars());
        }
        statsArray.put(statJson);
      }
      json.put("children", statsArray);
      json.write(out);
      return true;
    } catch (JSONException e) {
      log.fine("Unable to create JSON (" + e.getMessage() + ")");
      return false;
    }
  }
}
