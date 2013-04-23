// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Describes the limit, offset, and chunk size to be applied when
 * executing a {@link PreparedQuery}.
 * <p>
 * {@code limit} is the maximum number of results the query will return.
 * <p>
 * {@code offset} is the number of results to skip before returning any
 * results.  Results that are skipped due to offset do not count against
 * {@code limit}.
 * <p>
 * {@code startCursor} and {@code endCursor} are previously generated cursors
 * that point to locations in a result set. If specified queries will start
 * and end at these locations.
 * <p>
 * {@code prefetchSize} is the number of results retrieved on the first call
 * to the datastore.
 * <p>
 * {@code chunkSize} determines the internal chunking strategy of the
 * {@link Iterator} returned by {@link PreparedQuery#asIterator(FetchOptions)}
 * and the {@link Iterable} returned by
 * {@link PreparedQuery#asIterable(FetchOptions)}.
 * <p>
 * Note that unlike {@code limit}, {@code offset} and {@code cursor},
 * {@code prefetchSize} and {@code chunkSize} have no impact on the result of
 * the {@link PreparedQuery}, but rather only the performance of the
 * {@link PreparedQuery}.
 * <p>
 * Notes on usage:<br>
 * The recommended way to instantiate a {@code FetchOptions} object is to
 * statically import {@link Builder}.* and invoke a static
 * creation method followed by an instance mutator (if needed):
 *
 * <pre>
 * import static com.google.appengine.api.datastore.FetchOptions.Builder.*;
 *
 * ...
 *
 * // limit 10
 * datastoreService.prepare(query).asList(withLimit(10));
 *
 * // limit 10, offset 5
 * datastoreService.prepare(query).asList(withLimit(10).offset(5));
 * </pre>
 *
 */
public final class FetchOptions {

  /** @deprecated Instead of using DEFAULT_CHUNK_SIZE, do not specify a chunk size. */
  @Deprecated
  public static final int DEFAULT_CHUNK_SIZE = 20;

  private Integer limit;
  private Integer offset;
  private Integer prefetchSize;
  private Integer chunkSize;
  private Cursor startCursor;
  private Cursor endCursor;
  private Boolean compile;

  private FetchOptions() {
  }

  FetchOptions(FetchOptions original) {
    this.limit = original.limit;
    this.offset = original.offset;
    this.prefetchSize = original.prefetchSize;
    this.chunkSize = original.chunkSize;
    this.startCursor = original.startCursor;
    this.endCursor = original.endCursor;
    this.compile = original.compile;
  }

  /**
   * Sets the limit.  Please read the class javadoc for an explanation of how
   * limit is used.
   * @param limit The limit to set.  Must be non-negative.
   * @return {@code this} (for chaining)
   */
  public FetchOptions limit(int limit) {
    if (limit < 0) {
      throw new IllegalArgumentException("Limit must be non-negative.");
    }
    this.limit = limit;
    return this;
  }

  FetchOptions clearLimit() {
    limit = null;
    return this;
  }

  /**
   * Sets the offset.  Please read the class javadoc for an explanation of how
   * offset is used.
   * @param offset The offset to set.  Must be 0 or greater.
   * @return {@code this} (for chaining)
   */
  public FetchOptions offset(int offset) {
    if (offset < 0) {
      throw new IllegalArgumentException("Offset must be 0 or greater.");
    }
    this.offset = offset;
    return this;
  }

  FetchOptions clearOffset() {
    offset = null;
    return this;
  }

  /**
   * Sets the chunk size.  Please read the class javadoc for an explanation of
   * how chunk size is used.
   * @param chunkSize The chunk size to set.  Must be greater than 0.
   * @return {@code this} (for chaining)
   */
  public FetchOptions chunkSize(int chunkSize) {
    if (chunkSize < 1) {
      throw new IllegalArgumentException("Chunk size must be greater than 0.");
    }
    this.chunkSize = chunkSize;
    return this;
  }

  FetchOptions clearChunkSize() {
    chunkSize = null;
    return this;
  }

  /**
   * Sets the number of entities to prefetch.
   * @param prefetchSize The prefetch size to set.  Must be >= 0.
   * @return {@code this} (for chaining)
   */
  public FetchOptions prefetchSize(int prefetchSize) {
    if (prefetchSize < 0) {
      throw new IllegalArgumentException("Prefetch size must be 0 or greater.");
    }
    this.prefetchSize = prefetchSize;
    return this;
  }

  FetchOptions clearPrefetchSize() {
    prefetchSize = null;
    return this;
  }

  /**
   * Sets the cursor to start the query from.
   * @param cursor the cursor to set
   * @return {@code this} (for chaining)
   * @deprecated use {@link #startCursor} instead.
   */
  @Deprecated
  public FetchOptions cursor(Cursor cursor) {
    return startCursor(cursor);
  }

  /**
   * Sets the cursor at which to start the query.
   *
   * @param startCursor the cursor to set
   * @return {@code this} (for chaining)
   */
  public FetchOptions startCursor(Cursor startCursor) {
    if (startCursor == null) {
      throw new NullPointerException("start cursor cannot be null.");
    }
    this.startCursor = startCursor;
    return this;
  }

  /**
   * Sets the cursor at which to end the query.
   *
   * @param endCursor the cursor to set
   * @return {@code this} (for chaining)
   */
  public FetchOptions endCursor(Cursor endCursor) {
    if (endCursor == null) {
      throw new NullPointerException("end cursor cannot be null.");
    }
    this.endCursor = endCursor;
    return this;
  }

  FetchOptions clearStartCursor() {
    startCursor = null;
    return this;
  }

  FetchOptions clearEndCursor() {
    endCursor = null;
    return this;
  }

  FetchOptions compile(boolean compile) {
    this.compile = compile;
    return this;
  }

  FetchOptions clearCompile() {
    compile = null;
    return this;
  }

  /**
   * @return The limit, or {@code null} if no limit was provided.
   */
  public Integer getLimit() {
    return limit;
  }

  /**
   * @return The offset, or {@code null} if no offset was provided.
   */
  public Integer getOffset() {
    return offset;
  }

  /**
   * @return The chunk size, or {@code null} if no chunk size was provided.
   */
  public Integer getChunkSize() {
    return chunkSize;
  }

  /**
   * @return The prefetch size, or {@code null} if no prefetch size was
   * provided.
   */
  public Integer getPrefetchSize() {
    return prefetchSize;
  }

  /**
   * @return The start cursor, or {@code null} if no cursor was provided.
   * @deprecated use {@link #getStartCursor()} instead
   */
  @Deprecated
  public Cursor getCursor() {
    return getStartCursor();
  }

  /**
   * @return The start cursor, or {@code null} if no start cursor was provided.
   */
  public Cursor getStartCursor() {
    return startCursor;
  }

  /**
   * @return The end cursor, or {@code null} if no end cursor was provided.
   */
  public Cursor getEndCursor() {
    return endCursor;
  }

  Boolean getCompile() {
    return compile;
  }

  @Override
  public int hashCode() {
    int result = 0;

    if (prefetchSize != null) {
      result = result * 31 + prefetchSize.hashCode();
    }

    if (chunkSize != null) {
      result = result * 31 + chunkSize.hashCode();
    }

    if (limit != null) {
      result = result * 31 + limit.hashCode();
    }

    if (offset != null) {
      result = result * 31 + offset.hashCode();
    }

    if (startCursor != null) {
      result = result * 31 + startCursor.hashCode();
    }

    if (endCursor != null) {
      result = result * 31 + endCursor.hashCode();
    }

    if (compile != null) {
      result = result * 31 + compile.hashCode();
    }

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

    FetchOptions that = (FetchOptions) obj;

    if (prefetchSize != null) {
      if (!prefetchSize.equals(that.prefetchSize)) {
        return false;
      }
    } else if (that.prefetchSize != null) {
      return false;
    }

    if (chunkSize != null) {
      if (!chunkSize.equals(that.chunkSize)) {
        return false;
      }
    } else if (that.chunkSize != null) {
      return false;
    }

    if (limit != null) {
      if (!limit.equals(that.limit)) {
        return false;
      }
    } else if (that.limit != null) {
      return false;
    }

    if (offset != null) {
      if (!offset.equals(that.offset)) {
        return false;
      }
    } else if (that.offset != null) {
      return false;
    }

    if (startCursor != null) {
      if (!startCursor.equals(that.startCursor)) {
        return false;
      }
    } else if (that.startCursor != null) {
      return false;
    }

    if (endCursor != null) {
      if (!endCursor.equals(that.endCursor)) {
        return false;
      }
    } else if (that.endCursor != null) {
      return false;
    }

    if (compile != null) {
      if (!compile.equals(that.compile)) {
        return false;
      }
    } else if (that.compile != null) {
      return false;
    }

    return true;
  }

  @Override
  public String toString() {
    List<String> result = new ArrayList<String>();

    if (prefetchSize != null) {
      result.add("prefetchSize=" + prefetchSize);
    }

    if (chunkSize != null) {
      result.add("chunkSize=" + chunkSize);
    }

    if (limit != null) {
      result.add("limit=" + limit);
    }

    if (offset != null) {
      result.add("offset=" + offset);
    }

    if (startCursor != null) {
      result.add("startCursor=" + startCursor);
    }

    if (endCursor != null) {
      result.add("endCursor=" + endCursor);
    }

    if (compile != null) {
      result.add("compile=" + compile);
    }
    return "FetchOptions" + result;
  }

  /**
   * Contains static creation methods for {@link FetchOptions}.
   */
  public static final class Builder {

    /**
     * Create a {@link FetchOptions} with the given limit.  Shorthand for
     * <code>FetchOptions.withDefaults().limit(...);</code>  Please read the
     * {@link FetchOptions} class javadoc for an explanation of how limit
     * is used.
     * @param limit the limit to set.
     * @return The newly created FetchOptions instance.
     */
    public static FetchOptions withLimit(int limit) {
      return withDefaults().limit(limit);
    }

    /**
     * Create a {@link FetchOptions} with the given offset.  Shorthand for
     * <code>FetchOptions.withDefaults().offset(...);</code>  Please read the
     * {@link FetchOptions} class javadoc for an explanation of how offset
     * is used.
     * @param offset the offset to set.
     * @return The newly created FetchOptions instance.
     */
    public static FetchOptions withOffset(int offset) {
      return withDefaults().offset(offset);
    }

    /**
     * Create a {@link FetchOptions} with the given chunk size.  Shorthand for
     * <code>FetchOptions.withDefaults().chunkSize(...);</code>  Please read the
     * {@link FetchOptions} class javadoc for an explanation of how chunk size
     * is used.
     * @param chunkSize the chunkSize to set.
     * @return The newly created FetchOptions instance.
     */
    public static FetchOptions withChunkSize(int chunkSize) {
      return withDefaults().chunkSize(chunkSize);
    }

    /**
     * Create a {@link FetchOptions} with the given prefetch size.
     * Shorthand for <code>FetchOptions.withDefaults().prefetchSize(...);</code>.
     * Please read the {@link FetchOptions} class javadoc for an explanation of
     * how prefetch size is used.
     * @param prefetchSize the prefetchSize to set.
     * @return The newly created FetchOptions instance.
     */
    public static FetchOptions withPrefetchSize(int prefetchSize) {
      return withDefaults().prefetchSize(prefetchSize);
    }

    /**
     * Create a {@link FetchOptions} with the given cursor.
     * Shorthand for <code>FetchOptions.withDefaults().cursor(cursor);</code>.
     * Please read the {@link FetchOptions} class javadoc for an explanation of
     * how cursors are used.
     * @param cursor the cursor to set.
     * @return The newly created FetchOptions instance.
     * @deprecated use {@link #withStartCursor} instead.
     */
    @Deprecated
    public static FetchOptions withCursor(Cursor cursor) {
      return withStartCursor(cursor);
    }

    /**
     * Create a {@link FetchOptions} with the given start cursor.
     * Shorthand for <code>FetchOptions.withDefaults().startCursor(cursor);</code>.
     * Please read the {@link FetchOptions} class javadoc for an explanation of
     * how cursors are used.
     * @param startCursor the cursor to set.
     * @return The newly created FetchOptions instance.
     */
    public static FetchOptions withStartCursor(Cursor startCursor) {
      return withDefaults().startCursor(startCursor);
    }

    /**
     * Create a {@link FetchOptions} with the given end cursor.
     * Shorthand for <code>FetchOptions.withDefaults().endCursor(cursor);</code>.
     * Please read the {@link FetchOptions} class javadoc for an explanation of
     * how cursors are used.
     * @param endCursor the cursor to set.
     * @return The newly created FetchOptions instance.
     */
    public static FetchOptions withEndCursor(Cursor endCursor) {
      return withDefaults().endCursor(endCursor);
    }

    /**
     * Helper method for creating a {@link FetchOptions} instance with
     * default values.  The defaults are {@code null} for all values.
     */
    public static FetchOptions withDefaults() {
      return new FetchOptions();
    }

    private Builder() {}
  }
}
