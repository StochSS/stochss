// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.agent.impl;

import com.google.appengine.tools.info.SdkImplInfo;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.instrument.ClassFileTransformer;
import java.net.URL;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.security.ProtectionDomain;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.jar.Attributes;
import java.util.jar.JarInputStream;
import java.util.jar.Manifest;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Transforms user bytecode to implement various security restrictions.
 *
 */
public class Transformer implements ClassFileTransformer {

  private static final Logger logger = Logger.getLogger(Transformer.class.getName());

  private static final String APP_CLASS_LOADER
      = "com.google.appengine.tools.development.IsolatedAppClassLoader";

  private static final String APP_ENGINE_PACKAGE_PREFIX = "com/google/appengine/";

  private static final String IMPLEMENTATION_VENDOR_ID_ATTR = "Implementation-Vendor-Id";
  private static final String API_JAR_IMPLEMENTATION_VENDOR_ID = "com.google";

  private final boolean treatRestrictedClassListViolationsAsErrors;

  private AgentImpl agent = AgentImpl.getInstance();

  private Set<URL> agentRuntimeLibs;

  private final Map<URL, Boolean> userCodeSources = new HashMap<URL, Boolean>();

  private static final String DUMP_CLASSES_PROPERTY = "com.google.appengine.dumpclasses";

  /**
   * Set to true to dump transformed classes. Useful for debugging.
   */
  private static final boolean dumpClasses = Boolean.getBoolean(DUMP_CLASSES_PROPERTY);

  private static File dumpDir;

  public Transformer(boolean treatRestrictedClassListViolationsAsErrors) {
    this.treatRestrictedClassListViolationsAsErrors = treatRestrictedClassListViolationsAsErrors;
  }

  static {
    if (dumpClasses) {
      try {
        dumpDir = File.createTempFile("transformed-classes", "");
        dumpDir.delete();
        logger.log(Level.INFO, "Dumping transformed classes to, " + dumpDir);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  private static String getClassPackage(String className) {
    int lastPackageIndex = className.lastIndexOf('.');
    if (lastPackageIndex == -1) {
      return "";
    } else {
      return className.substring(0, lastPackageIndex).replace('.', '/');
    }
  }

  private static String getSimpleName(String className) {
    return className.substring(className.lastIndexOf('.') + 1);
  }

  @Override
  public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined,
      ProtectionDomain domain, byte[] classBuffer) {
    className = className.replace('/', '.');

    if (!isAppLoader(loader) || isRuntimeCode(domain)) {
      return null;
    }

    boolean isUserCode = !(isAppEngineCode(domain) ||
        className.startsWith("java.") || className.startsWith("javax."));
    try {
      return rewrite(className, classBuffer, false, isUserCode, domain);
    } catch (Throwable t) {
      try {
        return rewrite(className, classBuffer, true, isUserCode, domain);
      } catch (Throwable t2) {
        logger.log(Level.SEVERE, "Unable to instrument " + className + ". Security restrictions " +
            "may not be entirely emulated.", t);
        return null;
      }
    }
  }

  private byte[] rewrite(String className, byte[] classBuffer,
      boolean stripLocalVars, boolean isUserCode, ProtectionDomain domain) throws IOException {
    ClassReader cr = new ClassReader(new ByteArrayInputStream(classBuffer));
    ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
    ClassVisitor visitor = cw;
    visitor = new ObjectAccessVisitor(visitor, isUserCode,
        treatRestrictedClassListViolationsAsErrors,
        className, domain.getCodeSource().getLocation());
    visitor = new ReflectionVisitor(visitor);
    visitor = new ClassLoaderVisitor(visitor);

    if (stripLocalVars) {
      visitor = new StripLocalVariablesVisitor(visitor);
    }

    cr.accept(visitor, ClassReader.EXPAND_FRAMES);
    byte[] bytes = cw.toByteArray();

    if (dumpClasses) {
      dumpClass(className, bytes);
    }

    return bytes;
  }

  private void dumpClass(final String className, final byte[] bytes) {
    AccessController.doPrivileged(new PrivilegedAction<Object>() {
      @Override
      public Object run() {
        String dir = dumpDir + File.separator + getClassPackage(className);
        new File(dir).mkdirs();
        try {
          FileOutputStream fileOutput = new FileOutputStream(
              dir + File.separator + getSimpleName(className) + ".class");
          fileOutput.write(bytes);
          fileOutput.close();
        } catch (IOException e) {
          logger.log(Level.WARNING, "Unable to dump class bytes for " + className, e);
        }
        return null;
      }
    });
  }

  /**
   * Returns true for runtime code (and its dependencies) which should not
   * be instrumented.
   */
  private boolean isRuntimeCode(ProtectionDomain domain) {
    return getAgentRuntimeLibs().contains(domain.getCodeSource().getLocation());
  }

  private Set<URL> getAgentRuntimeLibs() {
    synchronized (this) {
      if (agentRuntimeLibs == null) {
        agentRuntimeLibs = new HashSet<URL>(SdkImplInfo.getAgentRuntimeLibs());
      }
    }

    return agentRuntimeLibs;
  }

  private boolean isAppLoader(ClassLoader loader) {

    if (loader == null) {
      return false;
    }

    if (loader.getClass().getName().equals(APP_CLASS_LOADER)) {
      return true;
    }

    if (agent.isAppConstructedURLClassLoader(loader)) {
      return true;
    }

    return isAppLoader(loader.getClass().getClassLoader());
  }

  /**
   * Returns {@code true} if the CodeSource of the given domain is a jar
   * provided by app engine. Such jars can be identified by the implementation
   * vendor id attribute in the jar manifest.
   */
  private boolean isAppEngineCode(ProtectionDomain domain) {
    URL url = domain.getCodeSource().getLocation();
    if (url == null) {
      return false;
    }
    synchronized (this) {
      if (!userCodeSources.containsKey(url)) {
        boolean isAppEngineLib = false;
        if (url.getProtocol().equals("file") && url.getPath().endsWith(".jar")) {
          JarInputStream jis = null;
          try {
            InputStream is = url.openStream();
            jis = new JarInputStream(is);
            Manifest manifest = jis.getManifest();
            if (manifest != null) {
              for (String attrName : manifest.getEntries().keySet()) {
                if (attrName.startsWith(APP_ENGINE_PACKAGE_PREFIX)) {
                  Attributes attrs = manifest.getAttributes(attrName);
                  if (attrs != null) {
                    if (API_JAR_IMPLEMENTATION_VENDOR_ID.equals(
                        attrs.getValue(IMPLEMENTATION_VENDOR_ID_ATTR))) {
                      isAppEngineLib = true;
                      break;
                    }
                  }
                }
              }
            }
          } catch (IOException e) {
            logger.log(Level.SEVERE, "Unable to process " + url, e);
          } finally {
            try {
              if (jis != null) {
                jis.close();
              }
            } catch (IOException e) {
              logger.log(Level.SEVERE, "Unable to close JarInputStream", e);
            }
          }
        }
        userCodeSources.put(url, isAppEngineLib);
      }
    }
    return userCodeSources.get(url);
  }
}
