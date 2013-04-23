// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.ConcurrentModificationException;

/**
 * Describes the various policies the datastore can follow for implicit
 * transaction management.  When deciding which policy to use, keep the
 * following in mind: The datastore will automatically retry operations
 * that fail due to concurrent updates to the same entity group if the
 * operation is not part of a transaction.  The datastore will not retry
 * operations that fail due to concurrent updates to the same entity group
 * if the operation is part of a transaction, and will instead immediately
 * throw a {@link ConcurrentModificationException}.  If your application
 * needs to perform any sort of intelligent merging when concurrent attempts
 * are made to update the same entity group you probably want {@link #AUTO},
 * otherwise {@link #NONE} is probably acceptable.
 *
 * See {@link DatastoreService} for a list of operations that perform implicit
 * transaction management.
 *
 */
public enum ImplicitTransactionManagementPolicy {

  /**
   * If a current transaction exists, use it, otherwise execute without a
   * transaction.
   */
  NONE,

  /**
   * If a current transaction exists, use it, otherwise create one.
   * The transaction will be committed before the method returns if the
   * datastore operation completes successfully and rolled back if the
   * datastore operation does not complete successfully.  No matter the type
   * or quantity of entities provided, only one transaction will be created.
   * This means that if you pass entities that belong to multiple entity groups
   * into one of these methods and you have this policy enabled, you will
   * receive an exception because transactions do not function across entity
   * groups.
   */
  AUTO,
}
