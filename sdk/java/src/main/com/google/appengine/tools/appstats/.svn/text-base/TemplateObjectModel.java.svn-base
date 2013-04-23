// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.tools.appstats.TemplateValueHelper.Loop;

import java.io.IOException;
import java.io.Writer;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Represents the logic to parse a template and represent it as an object
 * structure.
 *
 */
abstract class TemplateObjectModel implements Cloneable {

  private static final Pattern ROOT_PATTERN = Pattern.compile(
      "(\\{\\{[^\\{\\}]+\\}\\})|(\\{%[^\\{\\}]+%\\})|(\\{#[^\\{\\}]+#\\})|([\\{\\}]?([^\\{\\}]+))");
  private static final Pattern FOR_PATTERN = Pattern.compile("for\\s+(.+)\\s+in\\s+([^,]+)");
  private static final Pattern IFEQUAL_PATTERN = Pattern.compile("ifequal\\s+(\\S+)\\s+(\\S+)\\s*");
  private static final Pattern IF_PATTERN = Pattern.compile("if\\s+(.+)\\s*");

  private static String unwrap(String s) {
    return s.substring(2, s.length() - 2).trim();
  }

  /**
   * Represents one or more nodes that are executed serially.
   */
  static class CompositeNode extends TemplateObjectModel {
    private List<TemplateObjectModel> nodes = new ArrayList<TemplateObjectModel>();
    private String blockName;
    private Map<String, TemplateObjectModel> blocks;
    private CompositeNode baseTemplate;

    CompositeNode add(TemplateObjectModel node) {
      nodes.add(node);
      return this;
    }

    @Override
    void execute(Writer out, TemplateValueHelper helper) throws IOException {

      registerBlocks(helper);

      if (baseTemplate != null) {
        baseTemplate.execute(out, helper);
        return;
      }

      if (blockName != null) {
        TemplateObjectModel replacementBlock = helper.getBlock(blockName);
        if (replacementBlock != this) {
          replacementBlock.execute(out, helper);
          return;
        }
      }

      for (TemplateObjectModel node : nodes) {
        node.execute(out, helper);
      }
    }

    void registerBlocks(TemplateValueHelper helper) {
      if (blocks != null) {
        for (Map.Entry<String, TemplateObjectModel> block : blocks.entrySet()) {
          helper.registerBlock(block.getKey(), block.getValue());
        }
      }
      if (baseTemplate != null) {
        baseTemplate.registerBlocks(helper);
      }
    }
  }

  /**
   * Includes a SIMPLE template (does not work for all cases)
   */
  static class IncludeNode extends TemplateObjectModel {

    private final String toInclude;
    private final boolean isLiteral;

    IncludeNode(String includeThis) throws ParseException {
      if (includeThis.charAt(0) == '\"') {
        isLiteral = true;
        toInclude = includeThis.substring(1, includeThis.length() - 1).trim();
      } else {
        isLiteral = false;
        toInclude = includeThis;
        throw new ParseException("not supported yet", 0);
      }
    }

    @Override
    void execute(Writer out, TemplateValueHelper helper) throws IOException {
      if (isLiteral) {
        try {
          helper.getTemplateTool().getTemplate(toInclude, null).execute(out, helper);
        } catch (ParseException e) {
          throw new IOException("Could not load sub-template: " + toInclude);
        }
      } else {
        throw new IOException("not supported yet");
      }
    }

  }

  /**
   * Represents a comment node
   */
  static class CommentNode extends TemplateObjectModel {
    CompositeNode subNode = new CompositeNode();

    @Override
    void execute(Writer out, TemplateValueHelper helper) {
    }
  }

  /**
   * Represents static text.
   */
  static class TextNode extends TemplateObjectModel {
    private final String text;

    TextNode(String text) {
      this.text = text;
    }

    @Override
    void execute(Writer out, TemplateValueHelper helper) throws IOException {
      out.write(text);
    }
  }

  /**
   * Represents an expression that is evaluated and formatted.
   */
  static class FieldNode extends TemplateObjectModel {
    private final String fieldExpression;

    FieldNode(String fieldExpression) {
      this.fieldExpression = fieldExpression;
    }

    @Override
    void execute(Writer out, TemplateValueHelper helper) throws IOException {
      out.write(helper.format(fieldExpression));
    }
  }

  /**
   * Represents an if command.
   */
  static class IfNode extends TemplateObjectModel {
    private String condition;
    TemplateObjectModel onTrue = new CompositeNode();
    TemplateObjectModel onFalse = new CompositeNode();

    IfNode(String condition) {
      this.condition = condition.trim();
    }

    @Override
    void execute(Writer out, TemplateValueHelper helper) throws IOException {
      if (helper.eval(condition)) {
        onTrue.execute(out, helper);
      } else {
        onFalse.execute(out, helper);
      }
    }
  }

  /**
   * Represents an IfEqual command
   */
  static class IfEqualNode extends TemplateObjectModel {

    private String refArg1;
    private String refArg2;
    private String valArg1;
    private String valArg2;
    TemplateObjectModel onTrue = new CompositeNode();
    TemplateObjectModel onFalse = new CompositeNode();

    private static String asValOrNull(String val) {
      val = val.trim();
      if ((val.startsWith("\"") && val.endsWith("\"")) ||
          (val.startsWith("'") && val.endsWith("'"))){
        return val.substring(1, val.length() - 1);
      } else {
        return null;
      }
    }

    private static Object getValue(TemplateValueHelper helper, String refArg, String valArg) {
      if (valArg != null) {
        return valArg;
      }
      return helper.getValue(refArg);
    }

    private Boolean eval(TemplateValueHelper helper) {
      Object o1 = getValue(helper, refArg1, valArg1);
      Object o2 = getValue(helper, refArg2, valArg2);
      if (o1 == null && o2 == null) {
        return true;
      }
      if (o1 != null && o2 != null && o1.equals(o2)) {
        return true;
      }
      return false;
    }

    public IfEqualNode(String arg1, String arg2) {
      valArg1 = asValOrNull(arg1);
      if (valArg1 == null) {
        refArg1 = arg1.trim();
      }
      valArg2 = asValOrNull(arg2);
      if (valArg2 == null) {
        refArg2 = arg2.trim();
      }
    }

    @Override
    void execute(Writer out, TemplateValueHelper helper) throws IOException {
      if (eval(helper)) {
        onTrue.execute(out, helper);
      } else {
        onFalse.execute(out, helper);
      }
    }

  }

  /**
   * Represents a for loop
   */
  static class ForLoopNode extends TemplateObjectModel {

    private final String[] variables;
    private final String iterateOn;
    TemplateObjectModel subTree = new CompositeNode();

    ForLoopNode(String variables, String iterateOn) {
      this.iterateOn = iterateOn;
      this.variables = variables.split(",");
      for (int i = 0; i < this.variables.length; i++) {
        this.variables[i] = this.variables[i].trim();
      }
    }

    @Override
    void execute(Writer out, TemplateValueHelper helper) throws IOException {
      if (subTree == null) {
        return;
      }
      Object o = helper.getValue(iterateOn);
      if (o != null && !(o instanceof List<?>)) {
        throw new AssertionError(
            iterateOn + " should be a list, but was " + o.getClass() + ": " + o);
      }
      List<?> l = (List<?>) o;
      if (l == null) {
        return;
      }
      Loop loop = helper.openLoop(l, variables);
      while (loop.hasCurrent()) {
        subTree.execute(out, helper);
        loop.next();
      }
      loop.close();
    }

  }

  private static void append(List<TemplateObjectModel> stack, TemplateObjectModel cmd)
      throws ParseException {
    TemplateObjectModel last = stack.get(stack.size() - 1);
    if (last instanceof CompositeNode) {
      ((CompositeNode) last).add(cmd);
    } else if (last instanceof CommentNode) {
      CommentNode node = (CommentNode) last;
      node.subNode.add(cmd);
    } else {
      throw new ParseException("Cannot append a sub-node to " + last.getClass().getSimpleName(), 0);
    }
  }

  private TemplateObjectModel() {
  }

  abstract void execute(Writer out, TemplateValueHelper helper) throws IOException;

  public static TemplateObjectModel buildFrom(
      CharSequence parseThis,
      TemplateObjectModel baseTemplate,
      TemplateTool tool) throws ParseException {
    Map<String, TemplateObjectModel> blocks = new HashMap<String, TemplateObjectModel>();
    List<TemplateObjectModel> stack = new ArrayList<TemplateObjectModel>();
    List<TemplateObjectModel> ifStack = new ArrayList<TemplateObjectModel>();
    stack.add(new CompositeNode());
    Matcher matcher = ROOT_PATTERN.matcher(parseThis);
    while (matcher.find()) {
      if (matcher.group(1) != null) {
        if (stack.get(stack.size() - 1) instanceof CommentNode) {
          append(stack, new TextNode(matcher.group(1)));
        } else {
          append(stack, new FieldNode(unwrap(matcher.group(1))));
        }
      } else if (matcher.group(2) != null) {

        if (stack.get(stack.size() - 1) instanceof CommentNode) {
          String[] tokens = unwrap(matcher.group(2)).split("\\s");
          if (tokens[0].equals("endcomment")) {
            CommentNode node = (CommentNode) stack.remove(stack.size() - 1);
            append(stack, node);
          } else {
            append(stack, new TextNode(matcher.group(2)));
          }
        } else {
          String[] tokens = unwrap(matcher.group(2)).split("\\s");
          if (tokens[0].equals("else")) {
            CompositeNode node = (CompositeNode) stack.remove(stack.size() - 1);
            TemplateObjectModel ifNode = ifStack.get(ifStack.size() - 1);
            if (ifNode instanceof IfNode) {
              stack.add(((IfNode) ifNode).onFalse);
            } else if (ifNode instanceof IfEqualNode) {
              stack.add(((IfEqualNode) ifNode).onFalse);
            } else {
              throw new ParseException("else not supported for " + ifNode.getClass(), 0);
            }
          } else if (tokens[0].equals("comment")) {
            stack.add(new CommentNode());
          } else if (tokens[0].equals("extends")) {
            String filename = tokens[1];
            if (filename.startsWith("\"")) {
              filename = filename.substring(1, filename.length() - 1);
            }
            if (stack.size() != 1) {
              throw new ParseException("Can only extend root template node", 0);
            }
            if (baseTemplate != null) {
              throw new ParseException("Cannot set base template twice", 0);
            }
            try {
              baseTemplate = tool.getTemplate(filename, null);
            } catch (IOException e) {
              throw new ParseException("Cannot load template parent " + filename + ": " + e, 0);
            }
          } else if (tokens[0].equals("include")) {
            String includeName = tokens[1];
            append(stack, new IncludeNode(includeName));
          } else if (tokens[0].equals("block")) {
            String blockName = tokens[1];
            if (blocks.containsKey(blockName)) {
              throw new ParseException("block already defined: " + blockName, 0);
            }
            CompositeNode block = new CompositeNode();
            block.blockName = blockName;
            append(stack, block);
            stack.add(block);
            blocks.put(blockName, block);
          } else if (tokens[0].equals("for")) {
            Matcher forMatcher = FOR_PATTERN.matcher(unwrap(matcher.group(2)));
            if (!forMatcher.matches()) {
              throw new ParseException("Cannot parse: " + matcher.group(2), 0);
            }
            ForLoopNode node =
                new ForLoopNode(forMatcher.group(1).trim(), forMatcher.group(2).trim());
            append(stack, node);
            stack.add(node.subTree);
          } else if (tokens[0].equals("endblock")) {
            CompositeNode node = (CompositeNode) stack.remove(stack.size() - 1);
          } else if (tokens[0].equals("endfor")) {
            CompositeNode node = (CompositeNode) stack.remove(stack.size() - 1);
          } else if (tokens[0].equals("if")) {
            Matcher subMatcher = IF_PATTERN.matcher(unwrap(matcher.group(2)));
            if (!subMatcher.matches()) {
              throw new ParseException("Cannot parse: " + matcher.group(2), 0);
            }
            IfNode node = new IfNode(subMatcher.group(1));
            append(stack, node);
            stack.add(node.onTrue);
            ifStack.add(node);
          } else if (tokens[0].equals("endif")) {
            CompositeNode node = (CompositeNode) stack.remove(stack.size() - 1);
            IfNode node2 = (IfNode) ifStack.remove(ifStack.size() - 1);
          } else if (tokens[0].equals("ifequal")) {
            Matcher subMatcher = IFEQUAL_PATTERN.matcher(unwrap(matcher.group(2)));
            if (!subMatcher.matches()) {
              throw new ParseException("Cannot parse: " + matcher.group(2), 0);
            }
            IfEqualNode node = new IfEqualNode(subMatcher.group(1), subMatcher.group(2));
            append(stack, node);
            stack.add(node.onTrue);
            ifStack.add(node);
          } else if (tokens[0].equals("endifequal")) {
            CompositeNode node = (CompositeNode) stack.remove(stack.size() - 1);
            IfEqualNode node2 = (IfEqualNode) ifStack.remove(ifStack.size() - 1);
          } else {
            throw new ParseException("Unknown command: " + tokens[0], 0);
          }
        }
      } else if (matcher.group(3) != null) {
        CommentNode comment = new CommentNode();
        comment.subNode.add(new TextNode(unwrap(matcher.group(3))));
        append(stack, comment);
        continue;
      } else if (matcher.group(4) != null) {
        append(stack, new TextNode(matcher.group(4)));
      } else {
        throw new ParseException("Unknown token: " + matcher.group(), 0);
      }
    }
    if (stack.size() != 1) {
      throw new ParseException("Not all opened tags were closed", 0);
    }
    CompositeNode result =  (CompositeNode) stack.get(0);
    result.blocks = blocks;
    result.baseTemplate = (CompositeNode) baseTemplate;
    return result;
  }
}
