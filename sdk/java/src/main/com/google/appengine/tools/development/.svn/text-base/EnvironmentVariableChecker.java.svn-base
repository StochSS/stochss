package com.google.appengine.tools.development;

import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.common.annotations.VisibleForTesting;
import com.google.common.collect.ImmutableList;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Checker for reporting differences between environment variables specified
 * in an application's appengine-web.xml files and values from
 * {@link System#getenv()}.
 * <p>
 * Users can specify values for environment variables in an application's
 * WEB-INF/appengine-web.xml file. It is not possible to set environment
 * variables after JVM startup so we report mismatches based on the current
 * reporting policy.
 *
 */
class EnvironmentVariableChecker {
  @VisibleForTesting
  static final Logger LOGGER = Logger.getLogger(EnvironmentVariableChecker.class.getName());

  /**
   * Enum for reporting policy.
   */
  static enum MismatchReportingPolicy {
    /** Report mismatches by logging. */
    LOG,
    /** Report mismatches by throwing an {@link AppEngineConfigException} */
    EXCEPTION,
    /** Don't report mismatches. */
    NONE
  }

  private final MismatchReportingPolicy mismatchReportingPolicy;
  private final ImmutableList.Builder<Mismatch> mismatchListBuilder = ImmutableList.builder();

  EnvironmentVariableChecker(MismatchReportingPolicy mismatchReportingPolicy) {
    this.mismatchReportingPolicy = mismatchReportingPolicy;
  }

  void add(AppEngineWebXml appEngineWebXml, File appEngineWebXmlFile) {
    for (Map.Entry<String, String> entry : appEngineWebXml.getEnvironmentVariables().entrySet()) {
      if (!entry.getValue().equals(System.getenv(entry.getKey()))) {
        mismatchListBuilder.add(new Mismatch(entry.getKey(), System.getenv(entry.getKey()),
            entry.getValue(), appEngineWebXmlFile));
      }
    }
  }

  void check() throws AppEngineConfigException {
    List<Mismatch> mismatches = mismatchListBuilder.build();
    if (!mismatches.isEmpty()) {
      String msg =
          "One or more environment variables have been configured in appengine-web.xml that have "
          + "missing or different values in your local environment. We recommend you use system "
          + "properties instead, but if you are interacting with legacy code that requires "
          + "specific environment variables to have specific values, please set these environment "
          + "variables in your environment before running.\n"
          + mismatches;

      if (mismatchReportingPolicy == MismatchReportingPolicy.LOG) {
        LOGGER.warning(msg);
      } else if (mismatchReportingPolicy == MismatchReportingPolicy.EXCEPTION) {
        throw new IncorrectEnvironmentVariableException(msg, mismatches);
      }
    }

  }

  @VisibleForTesting
  static class Mismatch {
    private final String environmentVariableName;
    private final String environmentVariableValue;
    private final String appEngineWebXmlValue;
    private final File appEngineWebXmlFile;

    Mismatch(String environmentVariableName, String environmentVariableValue,
        String appEngineWebXmlValue, File appEngineWebXmlFile) {
      this.environmentVariableName = environmentVariableName;
      this.environmentVariableValue = environmentVariableValue;
      this.appEngineWebXmlValue = appEngineWebXmlValue;
      this.appEngineWebXmlFile = appEngineWebXmlFile;
    }

    /**
     * @return the environmentVariableName
     */
    public String getEnvironmentVariableName() {
      return environmentVariableName;
    }

    /**
     * @return the environmentVariableValue
     */
    public String getEnvironmentVariableValue() {
      return environmentVariableValue;
    }

    /**
     * @return the appEngineWebXmlValue
     */
    public String getAppEngineWebXmlValue() {
      return appEngineWebXmlValue;
    }

    /**
     * @return the appEngineWebXmlFile
     */
    public File getAppEngineWebXmlFile() {
      return appEngineWebXmlFile;
    }

    @Override
    public int hashCode() {
      final int prime = 31;
      int result = 1;
      result =
          prime * result + ((appEngineWebXmlFile == null) ? 0 : appEngineWebXmlFile.hashCode());
      result =
          prime * result + ((appEngineWebXmlValue == null) ? 0 : appEngineWebXmlValue.hashCode());
      result = prime * result
          + ((environmentVariableName == null) ? 0 : environmentVariableName.hashCode());
      result = prime * result
          + ((environmentVariableValue == null) ? 0 : environmentVariableValue.hashCode());
      return result;
    }

    @Override
    public boolean equals(Object obj) {
      if (this == obj) {
        return true;
      }
      if (obj == null) {
        return false;
      }
      if (getClass() != obj.getClass()) {
        return false;
      }
      Mismatch other = (Mismatch) obj;
      if (appEngineWebXmlFile == null) {
        if (other.appEngineWebXmlFile != null) {
          return false;
        }
      } else if (!appEngineWebXmlFile.equals(other.appEngineWebXmlFile)) {
        return false;
      }
      if (appEngineWebXmlValue == null) {
        if (other.appEngineWebXmlValue != null) {
          return false;
        }
      } else if (!appEngineWebXmlValue.equals(other.appEngineWebXmlValue)) {
        return false;
      }
      if (environmentVariableName == null) {
        if (other.environmentVariableName != null) {
          return false;
        }
      } else if (!environmentVariableName.equals(other.environmentVariableName)) {
        return false;
      }
      if (environmentVariableValue == null) {
        if (other.environmentVariableValue != null) {
          return false;
        }
      } else if (!environmentVariableValue.equals(other.environmentVariableValue)) {
        return false;
      }
      return true;
    }

    @Override
    public String toString() {
      return "Mismatch environmentVariableName=" + environmentVariableName
          + " environmentVariableValue=" + environmentVariableValue
          + " appEngineWebXmlValue=" + appEngineWebXmlValue
          + " appEngineWebXmlFile=" + appEngineWebXmlFile;
    }
  }

  @VisibleForTesting
  static class IncorrectEnvironmentVariableException extends
      AppEngineConfigException {

    private final List<Mismatch> mismatches;
    private IncorrectEnvironmentVariableException(String msg, List<Mismatch> mismatches) {
      super(msg);
      this.mismatches = mismatches;
    }

    public List<Mismatch> getMismatches() {
      return mismatches;
    }
  }
}
