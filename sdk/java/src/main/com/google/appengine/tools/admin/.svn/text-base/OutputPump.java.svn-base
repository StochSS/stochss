package com.google.appengine.tools.admin;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Pumps lines from one stream onto another, used specifically for getting
 * the stdout/stderr of a child process onto the parent's.
 *
 *
 */
public class OutputPump implements Runnable {

  private BufferedReader stream;
  private PrintWriter output;
  private Logger logger = Logger.getLogger(OutputPump.class.getName());
      
  public OutputPump(InputStream instream, PrintWriter outstream) {
    stream = new BufferedReader(new InputStreamReader(instream));
    output = outstream;
  }

  @Override
  public void run() {
    String line = null;
    try {
      while ((line = stream.readLine()) != null) {
        output.println(line);
      }
    } catch (IOException ix) {
      logger.log(Level.SEVERE, "Unexpected failure while trying to record errors.", ix);
    }
  }
}