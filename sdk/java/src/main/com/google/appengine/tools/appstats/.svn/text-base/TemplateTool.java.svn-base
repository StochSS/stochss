// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.text.ParseException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Supports rendering a subset of the Django template language in Java.
 *
 */
class TemplateTool {

  private static final Logger LOG = Logger.getLogger(TemplateTool.class.getName());

  /**
   * Represent options that can be used to customize this class with.
   */
  public static enum Option {

    NO_CACHE,

    STRICT,

    NON_STRICT;

    private void configure(TemplateTool tool) {
      switch (this) {
        case NO_CACHE:
          tool.caching = false;
          tool.templateCache = null;
          break;
        case STRICT:
          tool.strict = true;
          break;
        case NON_STRICT:
          tool.strict = false;
          break;
        default:
          throw new IllegalStateException("Unknown option: " + this);
      }
    }
  }

  private boolean caching = true;
  private boolean strict = false;
  private Map<String, TemplateObjectModel> templateCache =
      new ConcurrentHashMap<String, TemplateObjectModel>();

  /**
   * Constructor.
   * @param options a list of options that modify the object's behavior from its default/
   */
  public TemplateTool(Option... options) {
    for (Option option : options) {
      option.configure(this);
    }
  }

  /**
   * Applies a given template to a given map of values.
   * @param templateName the name of the template
   * @param parameters a map of parameters
   * @param out the writer to direct output to
   * @param parents a hierarchy of templates that this template inherits from.
   *   The direct parent is the first element in the array, the others follow
   *   in that order. This is an "advanced" mode for special cases only;
   *   in general, the tool should be able to figure out and load the parents on its
   *   own.
   * @throws IOException if the template cannot be loaded or the output cannot be written to
   * @throws NullPointerException if the template cannot be located
   * @throws ParseException if the template was located but could not be parsed
   */
  public void format(
      Map<String, ?> parameters,
      Writer out,
      String templateName,
      String... parents)
      throws IOException, ParseException {
    TemplateObjectModel parent = null;
    for (int i = parents.length - 1; i >= 0; i--) {
      parent = getTemplate(parents[i], parent);
    }
    TemplateObjectModel tom = getTemplate(templateName, parent);
    TemplateValueHelper data = new TemplateValueHelper(parameters, strict);
    data.setTemplateTool(this);
    tom.execute(out, data);
  }

  /**
   * Resolves a given name against the file system or resources and loads the
   * source of the template into memory. Default implementation is to consider
   * the name a resource-name, and to use Class.getResource. Can be overloaded
   * by subclasses.
   */
  protected CharSequence loadTemplateSource(String name) throws IOException {
    Reader resource = null;
    try {
      resource = new InputStreamReader(getClass().getResourceAsStream(name), "UTF-8");
      BufferedReader in = new BufferedReader(resource);
      StringBuilder sb = new StringBuilder();
      char[] buffer = new char[100];
      int i = 0;
      while (i >= 0) {
        i = in.read(buffer);
        if (i >= 0) {
          sb.append(buffer, 0, i);
        }
      }
      return sb;
    } catch (UnsupportedEncodingException e) {
      LOG.log(Level.WARNING, "encoding UTF-8 does not seem to be supported", e);
      return null;
    } finally {
      if (resource != null) {
        resource.close();
      }
    }
  }

  TemplateObjectModel getTemplate(String name, TemplateObjectModel parent)
      throws IOException, ParseException {
    if (caching && templateCache.containsKey(name)) {
      return templateCache.get(name);
    }
    CharSequence rawString = loadTemplateSource(name);
    if (rawString == null) {
      return null;
    }
    TemplateObjectModel model = TemplateObjectModel.buildFrom(rawString, parent, this);
    if (caching && model != null) {
      templateCache.put(name, model);
    }
    return model;
  }

}
