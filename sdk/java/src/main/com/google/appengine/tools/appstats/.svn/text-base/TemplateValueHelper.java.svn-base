// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.protobuf.Descriptors;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Message;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.logging.Logger;

/**
 * Represents a helper class that can excecute certain template-based logic,
 * such as extracting parameters or validating conditions.
 *
 */
class TemplateValueHelper {

  /**
   * Keeps track of iterating through a loop.
   */
  public class Loop {

    private Loop parentloop;
    private List<? extends Object> content;
    private int index;
    private TemplateValueHelper helper;
    private String[] fields;

    private Loop(
        List<? extends Object> content,
        Loop parent,
        TemplateValueHelper helper,
        String[] fields) {
      this.content = content;
      this.parentloop = parent;
      this.helper = helper;
      this.fields = fields;
    }

    public boolean hasNext() {
      return index + 1 < content.size();
    }

    public boolean hasCurrent() {
      return index < content.size();
    }

    Object getCurrent() {
      return content.get(index);
    }

    public void next() {
      index++;
    }

    public Loop getParentLoop() {
      return parentloop;
    }

    public void close() {
      helper.parameters.put("forloop", parentloop);
    }

    Object extract(int i, String... fieldNames) {
      String field = fieldNames[i];
      if ("counter".equals(field)) {
        return index + 1;
      } else if ("counter0".equals(field)) {
        return index;
      } else if ("revcounter".equals(field)) {
        return content.size() - index;
      } else if ("revcounter0".equals(field)) {
        return content.size() - index - 1;
      } else if ("first".equals(field)) {
        return index == 0;
      } else if ("last".equals(field)) {
        return index + 1 == content.size();
      } else if ("parentloop".equals(field)) {
        return parentloop.extract(i + 1, fieldNames);
      } else {
        int idx = 0;
        for (String f : fields) {
          if (f.equals(field)) {
            Object current = getCurrent();
            if (idx == 0 && fields.length == 1) {
              return helper.extract(current, i + 1, fieldNames);
            }
            if (current instanceof List) {
              return helper.extract(((List<?>) current).get(idx), i + 1, fieldNames);
            }
            if (current instanceof Map.Entry) {
              if (idx == 0) {
                return helper.extract(((Map.Entry<?, ?>) current).getKey(), i + 1, fieldNames);
              }
              if (idx == 1) {
                return helper.extract(((Map.Entry<?, ?>) current).getValue(), i + 1, fieldNames);
              }
              throw new AssertionError("Map.Entry not supported for index " + idx);
            }
          }
          idx++;
        }
      }
      if (strict) {
        throw new AssertionError(
            "Could not extract position " + i + " of " + Arrays.asList(fieldNames));
      }
      return null;
    }
  }

  private final Logger log;
  private final Map<String, Object> parameters;
  private Map<String, TemplateObjectModel> blocks;
  private boolean autoEscape;
  private TemplateTool templateTool;
  private final boolean strict;

  TemplateValueHelper(Map<String, ?> parameters) {
    this(parameters, false);
  }

  /**
   * @param parameters a set of parameters that the template should be aware
   *   of. A defensive copy of the input is made.
   */
  TemplateValueHelper(Map<String, ?> parameters, boolean strict) {
    if (parameters == null) {
      this.parameters = new HashMap<String, Object>();
    } else {
      this.parameters = new HashMap<String, Object>(parameters);
    }
    blocks = new HashMap<String, TemplateObjectModel>();
    log = Logger.getLogger(getClass().getName());
    this.strict = strict;
  }

  /**
   * Opens a loop on this opject.
   * @return the newly created loop object
   */
  public Loop openLoop(List<? extends Object> content, String... fields) {
    Loop parent = (Loop) parameters.get("forloop");
    Loop child = new Loop(content, parent, this, fields);
    parameters.put("forloop", child);
    return child;
  }

  /**
   * Navigates along the tree of known parameters and returns the node
   *   that it detects.
   * @param fieldNames a list of parameter names to navigate along.
   * @return the extracted value, or null if the value is not set
   * @exception ClassCastException if the method does not know how to handle
   *   a particular node class
   * @exception IllegalArgumentException if the object navigation follows
   *   a branch that id deemed illegal
   */
  public Object extract(String... fieldNames) {
    return extract(parameters, 0, fieldNames);
  }

  /**
   * Similarily to extract, navigate along the tree and return the node.
   * In addition to extract, convert the node to a string using the filter
   * specified in the tag parameter.
   * @param tag the tag to look for with filtter, such as "foo.bar|escape"
   * @return a non-null string describing the field.
   */
  public String format(String tag) {
    String[] tagsAndFilter = tag.split("\\|");
    tag = tagsAndFilter[0];
    String[] subTags = tag.split("\\.");
    String transformation = null;
    Object rawObject = extract(subTags);
    if (rawObject == null) {
      return "";
    }
    if (tagsAndFilter.length == 1 && autoEscape) {
      return escape(String.valueOf(rawObject));
    }
    for (int i = 1; i < tagsAndFilter.length; i++) {
      rawObject = transform(rawObject, tagsAndFilter[i].trim());
    }
    return String.valueOf(rawObject);
  }

  /**
   * Evaluates a condition from an if-statement to true or false.
   * Does not do full syntax validation.
   */
  public boolean eval(String condition) {
    boolean hasNot = false;
    boolean hasAnd = false;
    boolean hasOr = false;
    Boolean result = null;
    for (String c : condition.split("\\s")) {
      if (c.equals("not")) {
        hasNot = true;
        continue;
      }
      if (c.equals(hasAnd)) {
        hasAnd = true;
        continue;
      }
      if (c.equals(hasOr)) {
        hasOr = true;
        continue;
      }
      Object rawObject = extract(c.split("\\."));
      boolean asBool = !(rawObject == null || rawObject.equals(false) ||
          rawObject.equals("") ||
          ((rawObject instanceof Number) && ((Number) rawObject).doubleValue() == 0.0));
      if (hasNot) {
        asBool = !asBool;
        hasNot = false;
      }
      if (hasAnd) {
        result = result & asBool;
      } else if (hasOr) {
        result = result | asBool;
      } else {
        result = asBool;
      }
      hasAnd = false;
      hasOr = false;
    }
    return result;
  }

  public void registerBlock(String name, TemplateObjectModel block) {
    if (!blocks.containsKey(name)) {
      blocks.put(name, block);
    }
  }

  public TemplateObjectModel getBlock(String name) {
    if (!blocks.containsKey(name)) {
      throw new AssertionError("Block not found: " + name);
    }
    return blocks.get(name);
  }

  /**
   * Turn auto-escaping on or off for this object.
   */
  public void setAutoEscape(boolean autoEscape) {
    this.autoEscape = autoEscape;
  }

  /**
   * Sets a value.
   */
  void setValue(String tag, Object value) {
    if (value == null) {
      parameters.remove(tag);
    } else {
      parameters.put(tag, value);
    }
  }

  /**
   * Gets a value (as object, unformatted) from the helper
   */
  public Object getValue(String fullyQualifiedName) {
    try {
      return extract(fullyQualifiedName.split("(\\s|\\.)+"));
    } catch (RuntimeException e) {
      log.warning("Failed to extract " + fullyQualifiedName);
      throw e;
    }
  }

  private static String unwrap(String s) {
    while ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith("\"") && s.endsWith("\""))) {
      s = s.substring(1, s.length() - 1);
    }
    return s;
  }

  private static String escape(String s) {
    StringBuilder sb = new StringBuilder();
    char[] toEscape = s.toCharArray();
    for (int i = 0; i < toEscape.length; i++) {
      switch (toEscape[i]) {
        case '<':
          sb.append("&lt;");
          break;
        case '>':
          sb.append("&gt;");
          break;
        case '\'':
          sb.append("&#39;");
          break;
        case '\"':
          sb.append("&quot;");
          break;
        case '&':
          sb.append("&amp;");
          break;
        default:
          sb.append(toEscape[i]);
          break;
      }
    }
    return sb.toString();
  }

  static BigDecimal parse(Object o) {
    if (o instanceof Integer || o instanceof Long) {
      return new BigDecimal(((Number) o).longValue());
    }
    if (o instanceof Number) {
      return new BigDecimal(((Number) o).doubleValue());
    }
    String s = unwrap(o.toString().trim());
    return new BigDecimal(s);
  }

  String transform(Object transformThis, String transformation) {
    if (transformation == null || transformation.length() == 0) {
      return autoEscape ? escape(String.valueOf(transformThis)) : String.valueOf(transformThis);
    }
    String[] split = transformation.split(":");
    String name = split[0];
    if (name.equals("add")) {
      return parse(transformThis).add(parse(split[1])).toString();
    } else if (name.equals("floatformat")) {
      int digits = -1;
      if (split.length == 2) {
        digits = parse(split[1]).intValue();
      }
      BigDecimal roundThis = parse(transformThis);
      StringBuilder sb = new StringBuilder("#########0.");
      char c = (digits < 0) ? '#' : '0';
      for (int i = Math.abs(digits); i > 0; i--) {
        sb.append(c);
      }
      return new DecimalFormat(sb.toString()).format(roundThis.doubleValue());
    } else if (name.equals("rjust")) {
      int width = parse(split[1]).intValue();
      StringBuilder sb = new StringBuilder(transformThis.toString());
      while (sb.length() < width) {
        sb.insert(0, ' ');
      }
      return sb.toString();
    } else if (name.equals("pluralize")) {
      String suffix = "s";
      if (split.length == 2) {
        suffix = unwrap(split[1]);
      }
      if (1 != parse(transformThis).intValue()) {
        return suffix;
      } else {
        return "";
      }
    } else if (name.equals("safe")) {
      return transformThis.toString();
    } else if (name.equals("escape")) {
      return escape(transformThis.toString());
    } else {
      if (strict) {
        throw new AssertionError("Unknown template filter " + transformation);
      }
      log.warning("Unknown template filter " + transformation + ", ignoring for now");
    }
    return autoEscape ? escape(String.valueOf(transformThis)) : String.valueOf(transformThis);
  }

  @SuppressWarnings("unchecked")
  Object extract(Object source, int index, String... fieldNames) {
    if (source == null && index == 1) {
      for (Loop loop = (Loop) parameters.get("forloop"); loop != null;
          loop = loop.getParentLoop()) {
        Object o = loop.extract(0, fieldNames);
        if (o != null) {
          return o;
        }
      }
    }
    if (index == fieldNames.length) {
      return source;
    }
    if (source == null) {
      return null;
    }
    if (source instanceof Map) {
      return extract(
          ((Map) source).get(fieldNames[index]), index + 1, fieldNames);
    }
    if (source instanceof Loop) {
      return ((Loop) source).extract(index, fieldNames);
    }

    if (source instanceof Message) {
      Message m = (Message) source;
      for (FieldDescriptor field : m.getDescriptorForType().getFields()) {
        if (field.getName().equals(fieldNames[index])) {
          return extract(m.getField(field), index + 1, fieldNames);
        }
        if (field.isRepeated() && (field.getName() + "_size").equals(fieldNames[index])) {
          return extract(m.getRepeatedFieldCount(field), index + 1, fieldNames);
        }
        if (field.isRepeated() && (field.getName() + "_list").equals(fieldNames[index])) {
          return extract(m.getField(field), index + 1, fieldNames);
        }
      }
      throw new IllegalArgumentException("Unknown field: " + fieldNames[index]);
    }

    if (source instanceof Descriptors.EnumValueDescriptor) {
      Descriptors.EnumValueDescriptor enumDesc = (Descriptors.EnumValueDescriptor) source;
      return enumDesc.getName();
    }

    if (source instanceof List) {
      int idx = Integer.parseInt(fieldNames[index]);
      List l = (List) source;
      Object value = null;
      try {
        value = l.get(idx);
      } catch (IndexOutOfBoundsException e) {
        return "";
      }
      return extract(value, index + 1, fieldNames);
    }
    if (source instanceof Map.Entry) {
      int idx = Integer.parseInt(fieldNames[index]);
      Map.Entry e = (Entry) source;
      if (idx == 0) {
        return extract(e.getKey(), index + 1, fieldNames);
      }
      if (idx == 1) {
        return extract(e.getValue(), index + 1, fieldNames);
      }
    }
    throw new ClassCastException(
        "Not supported (yet) for field '"
        + fieldNames[index] + "': " + source.getClass());
  }

  public TemplateTool getTemplateTool() {
    return templateTool;
  }

  public void setTemplateTool(TemplateTool templateTool) {
    this.templateTool = templateTool;
  }

}
