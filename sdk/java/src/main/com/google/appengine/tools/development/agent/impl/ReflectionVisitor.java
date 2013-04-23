// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.GeneratorAdapter;

import java.util.Map;
import java.util.Set;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Arrays;

/**
 * Intercepts reflective operations and adds checks against the WhiteList.
 *
 */
public class ReflectionVisitor extends ClassVisitor {

  public ReflectionVisitor(final ClassVisitor classVisitor) {
    super(Opcodes.ASM4, classVisitor);
  }

  private static final Map<String, Set<String>> interceptedMethods =
      new HashMap<String,Set<String>>();

  static {
    interceptedMethods.put("java/lang/reflect/Method",
        new HashSet<String>(Arrays.asList("invoke")));

    interceptedMethods.put("java/lang/reflect/Field",
        new HashSet<String>(Arrays.asList(
          "get",
          "getBoolean",
          "getByte",
          "getChar",
          "getDouble",
          "getFloat",
          "getInt",
          "getLong",
          "getShort",
          "set",
          "setBoolean",
          "setByte",
          "setChar",
          "setDouble",
          "setFloat",
          "setInt",
          "setLong",
          "setShort"
        )));

    interceptedMethods.put("java/lang/reflect/Constructor",
        new HashSet<String>(Arrays.asList(
            "newInstance"
        )));

    interceptedMethods.put("java/lang/Class",
        new HashSet<String>(Arrays.asList(
            "newInstance"
        )));
  }

  @Override
  public MethodVisitor visitMethod(int access, String name, String desc, String signature,
      String[] exceptions) {
    MethodVisitor mv = super.visitMethod(access, name, desc, signature, exceptions);
    return (mv == null) ? null : new MethodTranslator(mv, access, name, desc);
  }

  private class MethodTranslator extends GeneratorAdapter {
    MethodTranslator(MethodVisitor methodVisitor, int access, String name, String desc) {
      super(methodVisitor, access, name, desc);
    }

    @Override
    public void visitMethodInsn(int opcode, String owner, String name, String desc) {
      Set<String> methods = interceptedMethods.get(owner);
      if (methods == null || !methods.contains(name)) {
        super.visitMethodInsn(opcode, owner, name, desc);
        return;
      }

      String newDesc = desc;

      if (opcode == Opcodes.INVOKEVIRTUAL) {
        final Type[] argTypes = Type.getArgumentTypes(desc);
        final Type[] newArgTypes = new Type[argTypes.length + 1];
        newArgTypes[0] = Type.getType("L" + owner + ";");
        System.arraycopy(argTypes, 0, newArgTypes, 1, argTypes.length);
        newDesc = Type.getMethodDescriptor(Type.getReturnType(desc), newArgTypes);
      }

      super.visitMethodInsn(Opcodes.INVOKESTATIC, AgentImpl.AGENT_RUNTIME, name, newDesc);
    }
  }
}
