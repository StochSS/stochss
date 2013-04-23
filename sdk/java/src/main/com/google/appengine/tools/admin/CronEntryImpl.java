// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.cron.GrocTimeSpecification;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.TimeZone;

/**
 * Implementation of the CronEntry interface used to describe a single cron
 * task.
 *
 */
public class CronEntryImpl implements CronEntry {

  private final DateFormat formatter;

  private final String url;
  private final String description;
  private final String schedule;
  private final String tz;

  public CronEntryImpl(String url, String description, String schedule, String tz) {
    this.url = url;
    this.description = description;
    this.schedule = schedule;
    this.tz = (tz == null) ? "UTC" : tz;
    formatter = new SimpleDateFormat("EEE MMM dd, yyyy HH:mm z (Z)");
    formatter.setTimeZone(TimeZone.getTimeZone(this.tz));
  }

  @Override
  public String getDescription() {
    return description;
  }

  @Override
  public Iterator<String> getNextTimesIterator() {
    return new TimeIterator(new Date(),
        GrocTimeSpecification.create(schedule, TimeZone.getTimeZone(tz)));
  }

  /**
   * Test variant of {@link #getNextTimesIterator()}, with a specified start.
   */
  Iterator<String> getNextTimesIterator(Date start) {
    return new TimeIterator(start,
        GrocTimeSpecification.create(schedule, TimeZone.getTimeZone(tz)));
  }

  @Override
  public String getSchedule() {
    return schedule;
  }

  @Override
  public String getTimezone() {
    return tz;
  }

  @Override
  public String getUrl() {
    return url;
  }

  @Override
  public String toXml() {
      String result =
        "<cron>\n" +
          "  <url>" + url + "</url>\n" +
          "  <schedule>" + schedule + "</schedule>\n" +
          "  <timezone>" + tz + "</timezone>\n";
      if (description != null) {
        result = result + "  <description>" + description + "</description>\n";
      }
      return result + "</cron>";
  }

  /**
   * An iterator tracking the last execution time, and the groc time
   * specification object to compute future execution times.
   */
  public class TimeIterator implements Iterator<String> {

    private Date lastRun;
    private GrocTimeSpecification groc;

    public TimeIterator(Date seedTime, GrocTimeSpecification groc) {
      lastRun = seedTime;
      this.groc = groc;
    }

    @Override
    public boolean hasNext() {
      return true;
    }

    @Override
    public String next() {
      lastRun = groc.getMatch(lastRun);
      String result = formatter.format(lastRun);
      return result;
    }

    @Override
    public void remove() {
      throw new UnsupportedOperationException("cron execution times cannot be removed");
    }
  }
}
