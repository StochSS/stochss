// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Visits ClassLoader constructions so that we can record them in the agent
 * and fixup their parents.
 *
 */
public class ClassLoaderVisitor extends ClassVisitor {

  private static final String RECORD_CLASSLOADER = "recordClassLoader";

  private static final String RECORD_CLASSLOADER_DESCRIPTOR = "(Ljava/lang/ClassLoader;)V";

  private static final String CHECK_PARENT_CLASSLOADER = "checkParentClassLoader";

  private static final String CHECK_PARENT_CLASSLOADER_DESCRIPTOR =
      "(Ljava/lang/ClassLoader;)Ljava/lang/ClassLoader;";

  private static final String URL_CLASSLOADER_CLASS = "java/net/URLClassLoader";
  private static final String SECURE_CLASSLOADER_CLASS = "java/security/SecureClassLoader";
  private static final String CLASSLOADER_CLASS = "java/lang/ClassLoader";

  private static final String CONSTRUCTOR_METHOD = "<init>";

  private static final String NEW_INSTANCE_METHOD = "newInstance";

  private Set<String> classLoaderTypes = new HashSet<String>(Arrays.asList(URL_CLASSLOADER_CLASS,
      SECURE_CLASSLOADER_CLASS, CLASSLOADER_CLASS));

  public ClassLoaderVisitor(final ClassVisitor classVisitor) {
    super(Opcodes.ASM4, classVisitor);
  }

  private static final Type CLASSLOADER_TYPE = Type.getType(ClassLoader.class);

  @Override
  public MethodVisitor visitMethod(int access, String name, String desc, String signature,
      String[] exceptions) {
    MethodVisitor mv = super.visitMethod(access, name, desc, signature, exceptions);
    return (mv == null) ? null : new MethodTranslator(mv, access, name, desc);
  }

  enum InitType {
    None,
    Init,
    NewInstance,
  }

  private class MethodTranslator extends NonRecordingGeneratorAdapter {
    MethodTranslator(MethodVisitor methodVisitor, int access, String name, String desc) {
      super(methodVisitor, access, name, desc);
    }

    @Override
    public void visitMethodInsn(int opcode, String owner, String name, String desc) {
      InitType initType = initsNewClassLoader(owner, name);
      if (initType == InitType.None) {
        super.visitMethodInsn(opcode, owner, name, desc);
        return;
      }

      Type[] argTypes = Type.getArgumentTypes(desc);

      boolean acceptsParentClassLoader = argTypes.length > 0 &&
          argTypes[argTypes.length - 1].equals(CLASSLOADER_TYPE);

      if (!acceptsParentClassLoader) {
        super.visitInsn(Opcodes.ACONST_NULL);
      }

      super.visitMethodInsn(Opcodes.INVOKESTATIC, AgentImpl.AGENT_RUNTIME,
        CHECK_PARENT_CLASSLOADER, CHECK_PARENT_CLASSLOADER_DESCRIPTOR);

      if (!acceptsParentClassLoader) {
        Type[] newArgTypes = new Type[argTypes.length + 1];
        System.arraycopy(argTypes, 0, newArgTypes, 0, argTypes.length);
        newArgTypes[argTypes.length] = CLASSLOADER_TYPE;
        argTypes = newArgTypes;
      }

      if (initType == InitType.Init) {
        int[] locals = new int[argTypes.length];

        for (int i = argTypes.length - 1; i >= 0; --i) {
          locals[i] = super.newLocal(argTypes[i]);
          super.storeLocal(locals[i]);
        }

        super.dup();

        for (int i = 0; i < locals.length; ++i) {
          super.loadLocal(locals[i]);
        }
      }

      super.visitMethodInsn(opcode, owner, name,
          Type.getMethodDescriptor(Type.getReturnType(desc), argTypes));

      if (initType == InitType.NewInstance) {
        super.dup();
      }

      super.visitMethodInsn(Opcodes.INVOKESTATIC, AgentImpl.AGENT_RUNTIME, RECORD_CLASSLOADER,
          RECORD_CLASSLOADER_DESCRIPTOR);
    }

    private InitType initsNewClassLoader(String owner, String name) {
      if (classLoaderTypes.contains(owner) && name.equals(CONSTRUCTOR_METHOD)) {
        return InitType.Init;
      }

      if (owner.equals(URL_CLASSLOADER_CLASS) && name.equals(NEW_INSTANCE_METHOD)) {
        return InitType.NewInstance;
      }

      return InitType.None;
    }
  }
}
