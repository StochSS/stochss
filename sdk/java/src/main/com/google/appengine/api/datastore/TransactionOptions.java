// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.ArrayList;
import java.util.List;

/**
 * Describes options for transactions, passed at transaction creation time.
 *
 * <p>{@code XG} is a boolean that enables or disables the use of cross-group
 * transactions.
 *
 * <p>Notes on usage:<br>
 * The recommended way to instantiate a {@code TransactionsOptions} object is to
 * statically import {@link Builder}.* and invoke a static
 * creation method followed by an instance mutator (if needed):
 *
 * <pre>
 * import static com.google.appengine.api.datastore.TransactionOptions.Builder.*;
 *
 * ...
 *
 * datastoreService.beginTransaction(withXG(true));
 * </pre>
 *
 */
public final class TransactionOptions {

  private boolean xg = false;

  private TransactionOptions() {
  }

  TransactionOptions(TransactionOptions original) {
    this.xg = original.xg;
  }

  /**
   * Enable or disable the use of cross-group transactions.
   *
   * @param enable true to cross-group transactions, false to
   *   restrict transactions to a single entity group.
   * @return {@code this} (for chaining)
   */
  public TransactionOptions setXG(boolean enable) {
    this.xg = enable;
    return this;
  }

  /**
   * Return the cross-group transaction setting to default (disabled).
   */
  public TransactionOptions clearXG() {
    this.xg = false;
    return this;
  }

  /**
   * @return {@code true} if cross-group transactions are allowed,
   *   {@code false} if they are not allowed.
   */
  public boolean isXG() {
    return xg;
  }

  /**
   * @deprecated
   * @see #setXG
   */
  @Deprecated public TransactionOptions multipleEntityGroups(boolean enable) {
    return setXG(enable);
  }

  /**
   * @deprecated
   * @see #clearXG
   */
  @Deprecated public TransactionOptions clearMultipleEntityGroups() {
    return clearXG();
  }

  /**
   * @deprecated
   * @see #isXG
   */
  @Deprecated public Boolean allowsMultipleEntityGroups() {
    return isXG();
  }

  @Override
  public int hashCode() {
    int result = 0;

    result = result * 31 + (xg ? 1 : 0);

    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (obj == null) {
      return false;
    }

    if (obj.getClass() != this.getClass()) {
      return false;
    }

    TransactionOptions that = (TransactionOptions) obj;

    return xg == that.xg;
  }

  @Override
  public String toString() {
    List<String> result = new ArrayList<String>();

    result.add("XG=" + xg);

    return "TransactionOptions" + result;
  }

  /**
   * Contains static creation methods for {@link TransactionOptions}.
   */
  public static final class Builder {
    /**
     * Create a {@link TransactionOptions} that enables or disables the use of
     * cross-group transactions. Shorthand for
     * <code>TransactionOptions.withDefaults().setXG(...);</code>
     *
     * @param enable true to allow cross-group transactions, false to
     *   restrict transactions to a single entity group.
     * @return {@code this} (for chaining)
     */
    public static TransactionOptions withXG(boolean enable) {
      return withDefaults().setXG(enable);
    }

    /**
     * @deprecated
     * @see #withXG
     */
    @Deprecated public static TransactionOptions allowMultipleEntityGroups(boolean enable) {
      return withDefaults().setXG(enable);
    }

    /**
     * Helper method for creating a {@link TransactionOptions} instance with
     * default values.  The defaults is false (disabled) for XG.
     */
    public static TransactionOptions withDefaults() {
      return new TransactionOptions();
    }

    private Builder() {}
  }
}
