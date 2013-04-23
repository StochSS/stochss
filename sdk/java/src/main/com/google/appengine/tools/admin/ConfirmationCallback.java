// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

/**
 * Implement this interface to provide a mechanism by which a user can be asked
 * to confirm whether or not a non-reversible action (such as a delete) should
 * be performed.
 *
 *
 * @param <E> The subclass of {@link Action} representing the type of action to
 *        be confirmed.
 */
public interface ConfirmationCallback<E extends ConfirmationCallback.Action> {

  /**
   * Represents the user's response to the confirmation request.
   */
  public static enum Response {
    YES, NO, YES_ALL, NO_ALL
  }

  /**
   * Represents the action to be confirmed. This class is abstract. There should
   * be a concrete subclass for each type of action that needs to be confirmed.
   *
   */
  public abstract static class Action {
    private String defaultPrompt;

    public Action(String prompt) {
      this.defaultPrompt = prompt;
    }

    /**
     * Returns the default prompt to present to the user.
     */
    public String getPrompt() {
      return defaultPrompt;
    }
  }

  /**
   * This is the call-back method. The framework invokes this method when it
   * needs to confirm that an action should be performed.
   *
   * @param action The action to be performed.
   * @return The user's respone.
   */
  public Response confirmAction(E action);

}
