// Copyright (c) 2011-2012 Google Inc.

package com.google.appengine.tools.admin;

import com.google.api.client.googleapis.auth.oauth2.GoogleOAuthConstants;

import java.util.Scanner;

/**
 * Verification code receiver that prompts user to paste the code copied from the browser.
 *
 */
public class PromptReceiver implements VerificationCodeReceiver {

  @Override
  public String waitForCode() {
    String code;
    Scanner scanner = new Scanner(System.in);
    do {
      System.out.print("Please enter code: ");
      code = scanner.nextLine();
    } while (code.isEmpty());
    return code;
  }

  @Override
  public String getRedirectUri() {
    return GoogleOAuthConstants.OOB_REDIRECT_URI;
  }

  @Override
  public void stop() {
  }
}
