// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.taskqueue;

import java.io.Serializable;

/**
 * Interface for deferred tasks. Classes implementing this interface may use
 * {@link TaskOptions#payload(DeferredTask)} to serialize the {@link DeferredTask}
 * into the payload of the task definition. The {@link DeferredTask#run()}
 * method will be called when the task is received by the built in DeferredTask
 * servlet.
 *
 * <p>Normal return from this method is considered success. Exceptions thrown
 * from this method will indicate failure and will be processed as
 * a retry attempt unless {@link DeferredTaskContext#setDoNotRetry(boolean)}
 * is called to avoid the retry processing.
 *
 */
public interface DeferredTask extends Runnable, Serializable {
}
