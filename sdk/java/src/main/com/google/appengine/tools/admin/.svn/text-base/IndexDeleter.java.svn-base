// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import static com.google.appengine.tools.admin.ConfirmationCallback.Response.YES_ALL;

import com.google.appengine.tools.admin.ConfirmationCallback.Action;
import com.google.apphosting.utils.config.IndexYamlReader;
import com.google.apphosting.utils.config.IndexesXml;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * Class to delete unused indexes from the server.
 *
 */
public class IndexDeleter {

  private final ServerConnection connection;
  private final GenericApplication application;
  private final PrintWriter errorWriter;
  private final ConfirmationCallback<DeleteIndexAction> confirmationCallback;
  private final UpdateListener updateListener;

  /**
   * @param conn a {@code ServerConnection} used for contacting the server
   * @param app the {@code Application} whose unused indexes will being deleted
   * @param callback a {@code ConfirmationCallback} used to ask the user to
   *        confirm the deletion of each index
   * @param errorWriter a {@code PrintWriter} used to log error messages
   * @param listener an {@code UpdateListener} used to provide progress reports
   *        during the delete operation
   */
  IndexDeleter(ServerConnection conn, GenericApplication app,
      ConfirmationCallback<DeleteIndexAction> callback, PrintWriter errorWriter,
      UpdateListener listener) {
    this.connection = conn;
    this.application = app;
    this.confirmationCallback = callback;
    this.errorWriter = errorWriter;
    this.updateListener = listener;
  }

  /**
   * This class represents a response from the server to a request to diff the
   * local set of indexes with the set on the server.
   */
  private static class DiffResponse {
    @SuppressWarnings("unused")
    IndexesXml missingFromServer;
    IndexesXml missingFromClient;
  }

  /**
   * Performs a diff of the given indexes against the indexes on the server.
   *
   * @param indexes an {@code IndexesXml} containing a set of indexes that may
   *        or may not exist on the server
   * @return a {@code DiffResponse} in which
   *         {@link DiffResponse#missingFromServer missingFromServer} is the set
   *         of indexes that are present in {@code indexes} but missing from the
   *         server and {@link DiffResponse#missingFromClient missingFromClient}
   *         is the set of indexes that are present on the server but missing
   *         from {@code indexes}
   * @throws IOException if there is a problem contacting the server
   */
  private DiffResponse diffIndexesOnServer(IndexesXml indexes) throws IOException {
    String response = post("/api/datastore/index/diff", indexes.toYaml());
    List<IndexesXml> parsedResponse = IndexYamlReader.parseMultiple(response);
    if (parsedResponse.size() != 2) {
      throw new RuntimeException("Response from diff could not be parsed as two index definitions");
    }
    DiffResponse pair = new DiffResponse();
    pair.missingFromServer = parsedResponse.get(0);
    pair.missingFromClient = parsedResponse.get(1);
    return pair;
  }

  /**
   * Deletes specified indexes on the server.
   *
   * @param indexes an {@code IndexesXml} containing a set of indexes that
   *        should be deleted
   * @return an {@code IndexesXml} containing any indexes that were requested to
   *         be deleted but were not deleted, probably because they were already
   *         deleted by some other request
   * @throws IOException if there is a problem contacting the server
   */
  private IndexesXml deleteIndexesOnServer(IndexesXml indexes) throws IOException {
    String response = post("/api/datastore/index/delete", indexes.toYaml());
    return IndexYamlReader.parse(response);
  }

  /**
   * Sends an Http post request to the server.
   *
   * @param path the path portion of the url of the resource on the admin server
   *        to which the post request will be sent
   * @param payload the post body
   * @return the body of the HTTP response
   * @throws IOException if there is a problem contacting the server
   */
  private String post(String path, String payload) throws IOException {
    return connection.post(path, payload, "app_id", application.getAppId());
  }

  /**
   * Uses our instance of {@link ConfirmationCallback} to prompt the user to
   * confirm which of the provided indexes he really wants to delete.
   *
   * @param toDelete the indexes potentially to be deleted
   * @return the indexes the user has confired for deletion
   */
  private IndexesXml confirmDeletes(IndexesXml toDelete) {
    IndexesXml confirmedToDelete = new IndexesXml();
    boolean yesToTheRest = false;
    forloop: for (IndexesXml.Index index : toDelete) {
      if (yesToTheRest) {
        confirmedToDelete.addNewIndex(index);
      } else {
        ConfirmationCallback.Response response = YES_ALL;
        if (null != confirmationCallback) {
          response = confirmationCallback.confirmAction(new DeleteIndexAction(index));
        }
        switch (response) {
          case YES:
            confirmedToDelete.addNewIndex(index);
            break;
          case NO:
            break;
          case YES_ALL:
            confirmedToDelete.addNewIndex(index);
            yesToTheRest = true;
            break;
          case NO_ALL:
            break forloop;
          default:
            throw new RuntimeException("Unrecognized response: " + response);
        }
      }
    }
    return confirmedToDelete;
  }

  /**
   * Logs a message complaining that some of the indexes were not deleted.
   *
   * @param notDeleted an {@code IndexesXml} representing the set of indexes
   *        that were not deleted
   */
  private void logFailedDeletes(IndexesXml notDeleted) {
    int numNotDeleted = notDeleted.size();
    if (numNotDeleted > 0) {
      if (1 == numNotDeleted) {
        errorWriter.println(
            "An index was not deleted.  Most likely this is  because it no longer exists.");
      } else {
        errorWriter.println(numNotDeleted
            + " indexes were not deleted.  Most likely this is because they no longer exist.");
      }
      for (IndexesXml.Index index : notDeleted) {
        errorWriter.println(index.toXmlString());
      }
      errorWriter.flush();
    }
  }

  /**
   * Queries the server to determine which indexes are not being used according
   * to the user's local indexes.xml file. Confirms with the user which unused
   * indexes should be deleted, and deletes those from the server.
   *
   * @throws IOException if there is a problem communicating with the server
   */
  public void deleteUnusedIndexes() throws IOException {
    IndexesXml allLocalIndexDefs = application.getIndexesXml();
    int numLocalIndexDefs = allLocalIndexDefs.size();
    String message = "Found " + numLocalIndexDefs + " local index definition"
        + ((1 == numLocalIndexDefs) ? "." : "s.");
    updateListener.onProgress(new UpdateProgressEvent(Thread.currentThread(), message, 10));
    DiffResponse pair = diffIndexesOnServer(allLocalIndexDefs);
    IndexesXml unusedDefs = pair.missingFromClient;
    int numUnused = unusedDefs.size();
    message = "Found " + numUnused + " unused " + ((1 == numUnused) ? "index" : "indexes")
        + " on the server.";
    updateListener.onProgress(new UpdateProgressEvent(Thread.currentThread(), message, 50));
    IndexesXml toDelete = confirmDeletes(unusedDefs);
    int numToDelete = toDelete.size();
    if (0 == numToDelete) {
      updateListener.onSuccess(new UpdateSuccessEvent("No indexes were deleted."));
    } else {
      message = "Deleting " + numToDelete + ((1 == numUnused) ? " index." : " indexes.");
      updateListener.onProgress(new UpdateProgressEvent(Thread.currentThread(), message, 60));
      IndexesXml notDeleted = deleteIndexesOnServer(toDelete);
      logFailedDeletes(notDeleted);
      int numNotDeleted = notDeleted.size();
      int numDeleted = numToDelete - numNotDeleted;
      message = "Deleted " + numDeleted + ((1 == numDeleted) ? " index." : " indexes.");
      updateListener.onSuccess(new UpdateSuccessEvent(message));
    }
  }

  /**
   * This class represents the action of deleting an index for purposes of
   * asking the user for confirmation. An instance of this class will be passed
   * to {@link ConfirmationCallback#confirmAction(Action)} during the method
   * {@link IndexDeleter#deleteUnusedIndexes()}.
   */
  public static class DeleteIndexAction extends Action {
    private IndexesXml.Index index;

    public DeleteIndexAction(IndexesXml.Index index) {
      super(buildPrompt(index));
      this.index = index;
    }

    /**
     * Returns the index being deleted. More sophisticated UI clients may wish
     * to use this data in order to build their own prompts rather than using
     * {@link #getPrompt()}.
     *
     * @return an instance of {@code IndexesXml.Index} representing the index
     *         being deleted
     */
    public IndexesXml.Index getIndex() {
      return index;
    }

    private static final String PROMPT1 =
        "This index is no longer in your datastore-indexes.xml file:";
    private static final String PROMPT2 = "Are you sure you want to delete this index?";

    private static String buildPrompt(IndexesXml.Index index) {
      StringBuilder builder = new StringBuilder(1024);
      builder
          .append(PROMPT1)
          .append("\n\n")
          .append(index.toXmlString())
          .append("\n")
          .append(PROMPT2);
      return builder.toString();
    }
  }
}
