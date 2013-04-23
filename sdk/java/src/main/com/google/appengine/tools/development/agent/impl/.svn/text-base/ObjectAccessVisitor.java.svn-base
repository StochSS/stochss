// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.net.URL;
import java.util.HashSet;
import java.util.Set;

/**
 * Visits method and field instructions, checking for references to
 * blacklisted classes.
 *
 */
public class ObjectAccessVisitor extends ClassVisitor {

  private static final String REJECT = "reject";

  private static final String REJECT_DESCRIPTOR = "(Ljava/lang/String;)V";

  private static final String CHECK_RESTRICTED = "checkRestricted";

  private static final String CHECK_RESTRICTED_DESCRIPTOR =
      "(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";

  private final boolean isUserCode;
  private final boolean treatRestrictedListViolationsAsErrors;
  private final String callingClassName;
  private final String callingClassCodeSource;
  private final Set<String> referencedClasses = new HashSet<String>();

  public ObjectAccessVisitor(
      ClassVisitor classVisitor, boolean isUserCode,
      boolean treatRestrictedListViolationsAsErrors, String callingClassName, URL callingClassCodeSource) {
    super(Opcodes.ASM4, classVisitor);
    this.isUserCode = isUserCode;
    this.treatRestrictedListViolationsAsErrors = treatRestrictedListViolationsAsErrors;
    this.callingClassName = callingClassName;
    this.callingClassCodeSource =
        callingClassCodeSource == null ? "unknown location" : callingClassCodeSource.toString();
  }

  @Override
  public MethodVisitor visitMethod(int access, String name, String desc, String signature,
      String[] exceptions) {
    MethodVisitor mv = super.visitMethod(access, name, desc, signature, exceptions);
    return (mv == null) ? null : new MethodTranslator(mv, access, name, desc);
  }

  private class MethodTranslator extends NonRecordingGeneratorAdapter {
    MethodTranslator(MethodVisitor methodVisitor, int access, String name, String desc) {
      super(methodVisitor, access, name, desc);
    }

    @Override
    public void visitFieldInsn(int opcode, String owner, String name, String desc) {
      maybeReject(owner);
      super.visitFieldInsn(opcode, owner, name, desc);
    }

    @Override
    public void visitMethodInsn(int opcode, String owner, String name, String desc) {
      maybeReject(owner);
      super.visitMethodInsn(opcode, owner, name, desc);
    }

    private void maybeReject(String klass) {
      if (BlackList.getBlackList().contains(klass)) {
        super.push(klass.replace('/', '.'));
        super.visitMethodInsn(Opcodes.INVOKESTATIC, AgentImpl.AGENT_RUNTIME,
            REJECT, REJECT_DESCRIPTOR);
      } else if (isUserCode && !referencedClasses.contains(klass)) {
        referencedClasses.add(klass);
        super.push(treatRestrictedListViolationsAsErrors);
        super.push(klass.replace('/', '.'));
        super.push(callingClassName);
        super.push(callingClassCodeSource);
        super.visitMethodInsn(Opcodes.INVOKESTATIC, AgentImpl.AGENT_RUNTIME,
            CHECK_RESTRICTED, CHECK_RESTRICTED_DESCRIPTOR);
      }
    }
  }
}
