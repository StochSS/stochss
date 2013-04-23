// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.appidentity;

import java.io.Serializable;

/**
 * {@code PublicCertificate} contains an x509 public certificate in
 * PEM format and a string which is used to identify this certificate.
 *
 * @see <a href="http://tools.ietf.org/html/rfc5280">RFC 5280</a> for
 * the specification of x509 certificates.
 */
public final class PublicCertificate implements Serializable {
  private final String certficateName;
  private final String x509CertificateInPemFormat;

  /**
   * @param certficiateName name of the certificate.
   * @param x509CertificateInPemFormat x509 certificate in pem format.
   */
  public PublicCertificate(String certficiateName, String x509CertificateInPemFormat) {
    this.certficateName = certficiateName;
    this.x509CertificateInPemFormat = x509CertificateInPemFormat;
  }

  public String getCertificateName() {
    return certficateName;
  }

  public String getX509CertificateInPemFormat() {
    return x509CertificateInPemFormat;
  }
}
