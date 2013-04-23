// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.appengine.api.conversion.ConversionServicePb.ConversionOutput;
import com.google.appengine.api.conversion.ConversionServicePb.ConversionRequest;
import com.google.appengine.api.conversion.ConversionServicePb.ConversionResponse;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy;
import com.google.common.base.Throwables;
import com.google.common.collect.Lists;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.logging.Logger;

/**
 * A {@code ConversionService} which performs conversions by making RPCs to
 * the backend service.
 *
 */
class ConversionServiceImpl implements ConversionService {
  static final String CONVERSION_SERVICE = "conversion";

  static final String CONVERT_METHOD = "Convert";

  Logger logger = Logger.getLogger(getClass().getName());

  private final ConversionRequestProtoConverter conversionRequestProtoConverter =
      new ConversionRequestProtoConverter();
  private final ConversionResultProtoConverter conversionResultProtoConverter =
      new ConversionResultProtoConverter();

  /**
   * The number of seconds allowing conversion request to run,
   * or null for the default deadline.
   */ private final Double deadline;

  /**
   * Constructs a {@link ConversionServiceImpl} with default deadline.
   */
  ConversionServiceImpl() {
    this.deadline = null;
  }

  /**
   * Constructs a {@link ConversionServiceImpl} with specified deadline.
   */
  ConversionServiceImpl(double deadline) {
    this.deadline = deadline;
  }

  @Override
  public ConversionResult convert(Conversion conversion) {
    List<ConversionResult> results = convert(Arrays.asList(conversion));
    return results.get(0);
  }

  @Override
  public List<ConversionResult> convert(List<Conversion> conversions) {
    try {
      return convertAsync(conversions).get();
    } catch (ExecutionException e) {
      Throwables.propagateIfInstanceOf(e.getCause(), ConversionServiceException.class);
      throw new ConversionServiceException(ConversionErrorCode.INTERNAL_ERROR, e);
    } catch (InterruptedException e) {
      throw new ConversionServiceException(ConversionErrorCode.INTERNAL_ERROR, e);
    }
  }

  @Override
  public Future<ConversionResult> convertAsync(Conversion conversion) {
    logger.warning("The Conversion API will be decommissioned in November 2012 "
                   + "and all calls to it will return an error.");
    final ConversionRequest request =
        conversionRequestProtoConverter.convert(Arrays.asList(conversion));

    Future<byte[]> responseBytes = ApiProxy.makeAsyncCall(
        CONVERSION_SERVICE, CONVERT_METHOD, request.toByteArray(), createApiConfig(deadline));
    return new ConversionFutureWrapper<byte[], ConversionResult>(responseBytes) {
      @Override
      protected ConversionResult wrap(byte[] responseBytes) throws IOException {
        ConversionResponse.Builder response = ConversionResponse.newBuilder()
            .mergeFrom(responseBytes);
        return conversionResultProtoConverter.reverse(response.getResultList().get(0));
      }
    };
  }

  @Override
  public Future<List<ConversionResult>> convertAsync(List<Conversion> conversions) {
    logger.warning("The Conversion API will be decommissioned in November 2012 "
                   + "and all calls to it will return an error.");
    final ConversionRequest request =
        conversionRequestProtoConverter.convert(conversions);

    Future<byte[]> responseBytes = ApiProxy.makeAsyncCall(
        CONVERSION_SERVICE, CONVERT_METHOD, request.toByteArray(), createApiConfig(deadline));
    return new ConversionFutureWrapper<byte[], List<ConversionResult>>(responseBytes) {
      @Override
      protected List<ConversionResult> wrap(byte[] responseBytes) throws IOException {
        ConversionResponse.Builder response = ConversionResponse.newBuilder()
            .mergeFrom(responseBytes);
        List<ConversionResult> results = Lists.newArrayList();
        for (ConversionOutput result : response.getResultList()) {
          results.add(conversionResultProtoConverter.reverse(result));
        }
        return results;
      }
    };
  }

  /**
   * Inner FutureWrapper subclass providing our own convertException
   * implementation.
   */
  private abstract static class ConversionFutureWrapper<K, V> extends FutureWrapper<K, V> {
    ConversionFutureWrapper(Future<K> parent) {
      super(parent);
    }

    @Override
    protected Throwable convertException(Throwable cause) {
      if (cause instanceof ApiProxy.ApplicationException) {
        ApiProxy.ApplicationException e = (ApiProxy.ApplicationException) cause;
        return new ConversionServiceException(
            ConversionErrorCode.intToEnum(e.getApplicationError()), e.getErrorDetail());
      } else if (cause instanceof ApiProxy.ApiDeadlineExceededException) {
        return new ConversionServiceException(ConversionErrorCode.TIMEOUT, cause.getMessage());
      }
      return cause;
    }
  }

  /**
   * Creates and returns an ApiConfig instance with deadline setting.
   */
  private ApiProxy.ApiConfig createApiConfig( Double deadline) {
    ApiProxy.ApiConfig apiConfig = new ApiProxy.ApiConfig();
    apiConfig.setDeadlineInSeconds(deadline);
    return apiConfig;
  }
}
