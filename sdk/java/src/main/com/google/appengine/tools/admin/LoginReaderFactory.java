package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ConnectOptions;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class LoginReaderFactory {

  public static class SimpleLoginReader implements LoginReader {
    protected int count = 0;
    private String email;
    private String password;
    private final ConnectOptions options;

    public SimpleLoginReader(ConnectOptions options) {
      this.options = options;
    }

    @Override
    public void doPrompt() {
      email = options.getUserId();
      if (email == null || count > 0) {
        email = promptForEmail("Email: ");
      }
      password = promptForPassword("Password for " + email + ": ");
      count += 1;
    }

    protected String promptForEmail(String prompt) {
      return prompt(prompt);
    }

    protected String promptForPassword(String prompt) {
      return prompt(prompt);
    }

    protected String prompt(String prompt) {
      System.out.print(prompt);
      System.out.flush();
      BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
       try {
         return in.readLine();
       } catch (IOException ioe) {
         return null;
       }
    }

    @Override
    public String getUsername() {
      return email;
    }

    @Override
    public String getPassword() {
      return password;
    }

  }

  public static class ConsoleReader extends SimpleLoginReader {
    private final java.io.Console console = System.console();

    public ConsoleReader(ConnectOptions options) {
      super(options);
    }

    protected String promptForUsername(String prompt) {
      return console.readLine(prompt);
    }

    @Override
    public String promptForPassword(String prompt) {
      return new String(console.readPassword(prompt));
    }

    public boolean hasConsole() {
      return console != null;
    }
  }

  public static class PassinReader extends SimpleLoginReader {
    public PassinReader(ConnectOptions options) {
      super(options);
    }

    @Override
    public void doPrompt() {
      if (count == 0) {
        super.doPrompt();
      }
    }
  }

  public static LoginReader createLoginReader(ConnectOptions options, boolean passin) {
    if (passin) {
      return new PassinReader(options);
    } else {
      ConsoleReader reader = new ConsoleReader(options);
      if (reader.hasConsole()) {
        return reader;
      }
    }
    return new SimpleLoginReader(options);
  }

}