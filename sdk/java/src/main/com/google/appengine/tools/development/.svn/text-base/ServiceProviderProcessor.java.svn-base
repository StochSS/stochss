// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.annotation.Annotation;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.Filer;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedOptions;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.AnnotationMirror;
import javax.lang.model.element.AnnotationValue;
import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.PackageElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.util.Types;
import javax.tools.Diagnostic.Kind;
import javax.tools.FileObject;
import javax.tools.StandardLocation;

/**
 * Processes {@link ServiceProvider} annotations and generates the service provider
 * configuration files described in {@link java.util.ServiceLoader}.
 * <p>
 * Processor Options:<ul>
 *   <li>debug - turns on debug statements</li>
 * </ul>
 *
 */
@SupportedAnnotationTypes("com.google.appengine.tools.development.ServiceProvider")
@SupportedSourceVersion(SourceVersion.RELEASE_6)
@SupportedOptions({"debug", "verify"})
public class ServiceProviderProcessor extends AbstractProcessor {

  private static final String SERVICE_DIR = "META-INF" + File.separator + "services" +
      File.separator;

  private static class VerifyException extends Exception {
    VerifyException(String message) {
      super(message);
    }
  }

  /**
   * Maps the class names of service provider interfaces to the
   * class names of the concrete classes which implement them.
   * <p>
   * For example,
   *   {@code "com.google.apphosting.LocalRpcService" ->
   *   "com.google.apphosting.datastore.LocalDatastoreService"}
   */
  private Multimap<String, String> providers = HashMultimap.create();

  /**
   * <ol>
   *  <li> For each class annotated with @ServiceProvider<ul>
   *      <li> Verify the @ServiceProvider interface value is correct
   *      <li> Categorize the class by its ServiceProvider interface
   *      </ul>
   *
   *  <li> For each @ServiceProvider interface <ul>
   *       <li> Create a file named {@code META-INF/services/<interface>}
   *       <li> For each @ServiceProvider annotated class for this interface <ul>
   *           <li> Create an entry in the file
   *           </ul>
   *       </ul>
   * </ol>
   */
  @Override
  public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
    try {
      return processImpl(annotations, roundEnv);
    } catch (Exception e) {
      StringWriter writer = new StringWriter();
      e.printStackTrace(new PrintWriter(writer));
      fatalError(writer.toString());
      return true;
    }
  }

  private boolean processImpl(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
    if (roundEnv.processingOver()) {
      generateConfigFiles();
    } else {
      processAnnotations(annotations, roundEnv);
    }

    return true;
  }

  private void processAnnotations(Set<? extends TypeElement> annotations,
      RoundEnvironment roundEnv) {

    Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(ServiceProvider.class);

    log(annotations.toString());
    log(elements.toString());

    for (Element e : elements) {
      TypeElement providerImplementer = (TypeElement) e;
      AnnotationMirror providerAnnotation = getAnnotationMirror(e, ServiceProvider.class);
      DeclaredType providerInterface = getProviderInterface(providerAnnotation);
      TypeElement providerType = (TypeElement) providerInterface.asElement();

      log("provider interface: " + providerType.getQualifiedName());
      log("provider implementer: " + providerImplementer.getQualifiedName());

      try {
        verifyImplementer(providerImplementer, providerType);
      } catch (VerifyException ex) {
        error(ex.getMessage(), e, providerAnnotation);
      }

      String providerTypeName = getBinaryName(providerType);
      String providerImplementerName = getBinaryName(providerImplementer);
      log("provider interface binary name: " + providerTypeName);
      log("provider implementer binary name: " + providerImplementerName);

      providers.put(providerTypeName, providerImplementerName);
    }
  }

  private void generateConfigFiles() {
    Filer filer = processingEnv.getFiler();

    for (String providerInterface : providers.keySet()) {
      String resourceFile = SERVICE_DIR + providerInterface;
      log("Working on resource file: " + resourceFile);
      try {
        Set<String> allServices = new HashSet<String>();
        try {
          FileObject existingFile = filer.getResource(StandardLocation.CLASS_OUTPUT, "",
              resourceFile);
          log("Looking for existing resource file at " + existingFile.toUri());
          Set<String> oldServices = ServicesFile.readServiceFile(existingFile.openInputStream());
          log("Existing service entries: " + oldServices);
          allServices.addAll(oldServices);
        } catch (IOException e) {
          log("Resource file did not already exist.");
        }

        Set<String> newServices = new HashSet<String>(providers.get(providerInterface));
        if (allServices.containsAll(newServices)) {
          log("No new service entries being added.");
          return;
        }

        allServices.addAll(newServices);
        log("New service file contents: " + allServices);
        FileObject fileObject = filer.createResource(StandardLocation.CLASS_OUTPUT, "",
            resourceFile);
        OutputStream out = fileObject.openOutputStream();
        ServicesFile.writeServiceFile(allServices, out);
        out.close();
        log("Wrote to: " + fileObject.toUri());
      } catch (IOException e) {
        fatalError("Unable to create " + resourceFile + ", " + e);
        return;
      }
    }
  }

  /**
   * Verifies {@link ServiceProvider} constraints on the concrete provider class.
   * Note that these constraints are enforced at runtime via the ServiceLoader,
   * we're just checking them at compile time to be extra nice to our users.
   *
   */
  private void verifyImplementer(TypeElement providerImplementer, TypeElement providerType)
      throws VerifyException {

    String verify = processingEnv.getOptions().get("verify");
    if (verify == null || !Boolean.valueOf(verify)) {
      return;
    }

    Types types = processingEnv.getTypeUtils();

    if (!types.isSubtype(providerImplementer.asType(), providerType.asType())) {
      throw new VerifyException("ServiceProviders must implement their service provider interface. "
          + providerImplementer.getQualifiedName() + " does not implement "
          + providerType.getQualifiedName());
    }
  }

  /**
   * Returns the binary name of a reference type. For example,
   * {@code com.google.Foo$Bar}, instead of {@code com.google.Foo.Bar}.
   *
   */
  private String getBinaryName(TypeElement element) {
    return getBinaryNameImpl(element, element.getSimpleName().toString());
  }

  private String getBinaryNameImpl(TypeElement element, String className) {
    Element enclosingElement = element.getEnclosingElement();

    if (enclosingElement instanceof PackageElement) {
      PackageElement pkg = (PackageElement) enclosingElement;
      if (pkg.isUnnamed()) {
        return className;
      }
      return pkg.getQualifiedName() + "." + className;
    }

    TypeElement typeElement = (TypeElement) enclosingElement;
    return getBinaryNameImpl(typeElement, typeElement.getSimpleName() + "$" + className);
  }

  private DeclaredType getProviderInterface(AnnotationMirror providerAnnotation) {

    Map<? extends ExecutableElement, ? extends AnnotationValue> values =
        providerAnnotation.getElementValues();
    log("annotation values: " + values);

    AnnotationValue value = values.values().iterator().next();
    return (DeclaredType) value.getValue();
  }

  private AnnotationMirror getAnnotationMirror(Element e, Class<? extends Annotation> klass) {
    List<? extends AnnotationMirror> annotationMirrors = e.getAnnotationMirrors();
    for (AnnotationMirror mirror : annotationMirrors) {
      log("mirror: " + mirror);
      DeclaredType type = mirror.getAnnotationType();
      TypeElement typeElement = (TypeElement) type.asElement();
      if (typeElement.getQualifiedName().contentEquals(klass.getName())) {
        return mirror;
      } else {
        log("klass name: [" + klass.getName() + "]");
        log("type name: [" + typeElement.getQualifiedName() + "]");
      }
    }
    return null;
  }

  private void log(String msg) {
    if (processingEnv.getOptions().containsKey("debug")) {
      processingEnv.getMessager().printMessage(Kind.NOTE, msg);
    }
  }

  private void error(String msg, Element element, AnnotationMirror annotation) {
    processingEnv.getMessager().printMessage(Kind.ERROR, msg, element, annotation);
  }

  private void fatalError(String msg) {
    processingEnv.getMessager().printMessage(Kind.ERROR, "FATAL ERROR: " + msg);
  }
}
