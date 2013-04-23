// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.commons.GeneratorAdapter;

/**
 * A subclass of {@link GeneratorAdapter} that does not record the types of newly added local
 * variables, thereby avoiding a bug in {@link org.objectweb.asm.commons.LocalVariablesSorter}.
 * <p>
 * Use this class instead of {@link GeneratorAdapter} to avoid <a
 * href="http://forge.ow2.org/tracker/index.php?func=detail&aid=316352&group_id=23&atid=100023">ASM
 * bug #316352 </a>
 * <p>
 *
 *
 */
public class NonRecordingGeneratorAdapter extends GeneratorAdapter {

  public NonRecordingGeneratorAdapter(
      MethodVisitor methodVisitor, int access, String name, String desc) {
    super(methodVisitor, access, name, desc);
  }

  /**
   * Creates a new local variable of the given type.
   *
   * @param type the type of the local variable to be created.
   * @return the identifier of the newly created local variable.
   */
  @Override
  public int newLocal(final Type type) {
    int local = nextLocal;
    nextLocal += type.getSize();
    setLocalType(local, type);
    return local;
  }

}
