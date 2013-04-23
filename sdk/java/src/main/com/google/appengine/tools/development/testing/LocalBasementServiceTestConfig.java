// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.testing;

import com.google.appengine.api.basement.dev.LocalBasementService;
import com.google.appengine.tools.development.ApiProxyLocal;
import com.google.common.base.Joiner;
import com.google.common.time.Clock;
import com.google.gaia.mint.GaiaMintScopeCode;
import com.google.universalnav.OneGoogleServerProto;

import java.io.OutputStream;
import java.util.LinkedList;

/**
 * Config for accessing the LocalBasementService in tests. In order to verify that the expected
 * data is being written, you will first need to provide an {@code OutputStream} for the
 * data to be written to:
 * <pre>{@code
 *   private ByteArrayOutputStream out = new ByteArrayOutputStream();
 *   LocalServiceTestHelper helper;
 *   @Before
 *   public void createService() {
 *     helper = new LocalServiceTestHelper(
 *         new LocalBasementServiceTestConfig().setProtoStream(out));
 *     helper.setUp();
 *   }
 * }</pre>
 *
 * Before reading the data from the {@code OutputStream} the test code must end the request
 * by calling {@code LocalServiceTestHelper#endRequest()}. After doing that, the following
 * code will read the data back out:
 * <pre>{@code
 *   @Test
 *   public void verifyBehavior() {
 *     // Run a test.
 *     LocalServiceTestHelper.endRequest();
 *     AppExtensions appExtensions = parseProtoRecord();
 *     // Verify the expected AppExtension messages was written.
 *   }
 *
 *   private AppExtensions parseProtoRecord() throws IOException {
 *     InputRecordStream in = InputRecordStream.newInstance(new ByteArrayInputStream(
 *         protoStream.toByteArray()));
 *     Iterator<ByteBuffer> iterator = in.iterator();
 *     assertTrue("Expecting at least one record.", iterator.hasNext());
 *     AppExtensions appExtensions = new AppExtensions();
 *     assertTrue(appExtensions.mergeFrom(iterator.next()));
 *     assertFalse("Expecting no more than one record.", iterator.hasNext());
 *     return appExtensions;
 *   }
 * }</pre>
 *
 * If you need to simulate multiple requests from a single test, you will need to parse the full
 * stream:
 * <pre>{@code
 *   private List<AppExtensions> parseProtoStream() throws IOException {
 *     List<AppExtensions> appExtensionsList = new ArrayList<AppExtensions>();
 *     InputRecordStream in = InputRecordStream.newInstance(new ByteArrayInputStream(
 *         protoStream.toByteArray()));
 *     for (ByteBuffer buffer : in) {
 *       AppExtensions appExtensions = new AppExtensions();
 *       assertTrue(appExtensions.mergeFrom(buffer));
 *       appExtensionsList.add(appExtensions);
 *     }
 *     return appExtensionsList;
 *   }
 * }</pre>
 *
 */
public class LocalBasementServiceTestConfig implements LocalServiceTestConfig {
  private boolean logToSawmillEnable = true;
  private boolean logToSawmillIgnore = false;
  private boolean logToSawmillLogEveryCall = false;
  private OutputStream logToSawmillFinalProtoStream = null;
  private String gaiaMintEmail = null;
  private String gaiaMintUserId = null;
  private String gaiaMintAuthDomain = null;
  private Boolean gaiaMintIsAdmin = null;
  private Long gaiaMintGaiaId = null;
  private LinkedList<GaiaMintScopeCode.ScopeCode> gaiaMintAllowedScopes =
      new LinkedList<GaiaMintScopeCode.ScopeCode>();
  private String oneGoogleServerSpec = null;
  private OneGoogleServerProto.OneGoogleService.Stub oneGoogleStub = null;
  private Clock clock = null;

  @Override
  public void setUp() {
    ApiProxyLocal proxy = LocalServiceTestHelper.getApiProxyLocal();
    proxy.setProperty(LocalBasementService.LOG_TO_SAWMILL_ENABLE_PROPERTY,
        Boolean.toString(logToSawmillEnable));
    proxy.setProperty(LocalBasementService.LOG_TO_SAWMILL_IGNORE_PROPERTY,
        Boolean.toString(logToSawmillIgnore));
    proxy.setProperty(LocalBasementService.LOG_TO_SAWMILL_LOG_EVERY_CALL_PROPERTY,
        Boolean.toString(logToSawmillLogEveryCall));
    proxy.setProperty(LocalBasementService.LOG_TO_SAWMILL_WRITE_FINAL_PROTO_PROPERTY,
        (logToSawmillFinalProtoStream != null ? Boolean.TRUE : Boolean.FALSE).toString());

    if (gaiaMintEmail != null) {
      proxy.setProperty(LocalBasementService.GAIA_MINT_EMAIL_PROPERTY, gaiaMintEmail);
    }
    if (gaiaMintUserId != null) {
      proxy.setProperty(LocalBasementService.GAIA_MINT_USER_ID_PROPERTY, gaiaMintUserId);
    }
    if (gaiaMintAuthDomain != null) {
      proxy.setProperty(LocalBasementService.GAIA_MINT_AUTH_DOMAIN_PROPERTY, gaiaMintAuthDomain);
    }
    if (gaiaMintIsAdmin != null) {
      proxy.setProperty(
          LocalBasementService.GAIA_MINT_IS_ADMIN_PROPERTY, gaiaMintIsAdmin.toString());
    }
    if (gaiaMintGaiaId != null) {
      proxy.setProperty(LocalBasementService.GAIA_MINT_GAIA_ID_PROPERTY, gaiaMintGaiaId.toString());
    }
    if (!gaiaMintAllowedScopes.isEmpty()) {
      proxy.setProperty(LocalBasementService.GAIA_MINT_ALLOWED_SCOPES_PROPERTY,
          Joiner.on(',').join(gaiaMintAllowedScopes));
    }
    if (oneGoogleServerSpec != null) {
      proxy.setProperty(LocalBasementService.ONE_GOOGLE_SERVER_SPEC, oneGoogleServerSpec);
    }

    LocalBasementService localBasementService = getLocalBasementService();
    if (logToSawmillFinalProtoStream != null) {
      localBasementService.injectLogToSawmillOutputStream(logToSawmillFinalProtoStream);
    }
    if (oneGoogleStub != null) {
      localBasementService.injectOneGoogleStub(oneGoogleStub);
    }
    if (clock != null) {
      localBasementService.injectClock(clock);
    }
  }

  @Override
  public void tearDown() {}

  public static LocalBasementService getLocalBasementService() {
    return (LocalBasementService)
        LocalServiceTestHelper.getLocalService(LocalBasementService.PACKAGE);
  }

  /**
   * Configure the {@code LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that it will write a request's final merged proto to the specified {@code OutputStream}. If
   * this method is not called or is called with {@code null}, the final merged proto will not
   * be written. Defaults to {@code null} and must be called (note: only applies to unit tests, in
   * the Dev App Server defaults to writing to the filesystem).
   *
   * The final merged proto is only written once the request is over. You can indicate this
   * to the unit test by either calling {@code LocalServiceTestHelper#endRequest()} or {@code
   * LocalServiceTestHelper#tearDown()}.
   *
   * This method must be called prior to calling {@code LocalServiceTestHelper#setUp()}.
   *
   * @param out A non-closed OutputStream.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setLogToSawmillProtoStream(OutputStream out) {
    logToSawmillFinalProtoStream = out;
    return this;
  }

  /**
   * Configure the {@code LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * with the specified enable state. When disabled, the {@LogToSawmillService} entry points will
   * throw just like the production environment when the app is missing the
   * SAWMILL_APP_EXTENSIONS_ENABLE permission. Defaults to {@code true}.
   *
   * This method must be called prior to calling {@code LocalServiceTestHelper#setUp()}.
   *
   * @param b True to allow the service to log.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setLogToSawmillEnable(boolean b) {
    logToSawmillEnable = b;
    return this;
  }

  /**
   * Configure the {@code LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * with the specified ignore state. When ignored, {@code LogToSawmillService#log(byte[])} will
   * drop all date and the the {@LogToSawmillService} entry points will indicate this in their
   * return value. Defaults to {@code false}.
   *
   * This method must be called prior to calling {@code LocalServiceTestHelper#setUp()}.
   *
   * @param b False to allow the service to log.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setLogToSawmillIgnore(boolean b) {
    logToSawmillIgnore = b;
    return this;
  }

  /**
   * Configure the {@code LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that it will log every call to {@code LogToSawmillService#log(byte[])} with {@code Logger}.
   * Defaults to {@code false} (note: only applies to unit tests; in the Dev App Server defaults
   * to {@code true}).
   *
   * This method must be called prior to calling {@code LocalServiceTestHelper#setUp()}.
   *
   * @param b True to have the local service log each call.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setLogToSawmillLogEveryCall(boolean b) {
    logToSawmillLogEveryCall = b;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that it will return the specified email address from calls to {@code
   * GaiaMintService#getUserinfoFromGaiaMint}. Defaults to "example@example.com".
   *
   * This method must be called prior to calling {@link LocalServiceTestHelper#setUp()}.
   *
   * @param email The email address to return from {@code GaiaMintService#getUserinfoFromGaiaMint}.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setGaiaMintEmail(String email) {
    gaiaMintEmail = email;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that it will return the specified user id from calls to {@code
   * GaiaMintService#getUserinfoFromGaiaMint}. Defaults to "135705915318242114242".
   *
   * This method must be called prior to calling {@link LocalServiceTestHelper#setUp()}.
   *
   * @param userId The user id to return from {@code GaiaMintService#getUserinfoFromGaiaMint}.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setGaiaMintUserId(String userId) {
    gaiaMintUserId = userId;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that it will return the specified auth domain from calls to
   * {@code GaiaMintService#getUserinfoFromGaiaMint}. Defaults to "gmail.com".
   *
   * This method must be called prior to calling {@link LocalServiceTestHelper#setUp()}.
   *
   * @param authDomain The auth domain to return from {@code
   * GaiaMintService#getUserinfoFromGaiaMint}.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setGaiaMintAuthDomain(String authDomain) {
    gaiaMintAuthDomain = authDomain;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that it will return whether the user is an admin from calls to {@code
   * GaiaMintService#getUserinfoFromGaiaMint}. Defaults to false.
   *
   * This method must be called prior to calling {@link LocalServiceTestHelper#setUp()}.
   *
   * @param isAdmin Whether to make the user an admin in calls to {@code
   * GaiaMintService#getUserinfoFromGaiaMint}.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setGaiaMintIsAdmin(boolean isAdmin) {
    gaiaMintIsAdmin = isAdmin;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that it will return the specified gaid ID from calls to
   * {@code GaiaMintService#getUserinfoFromGaiaMint}. Defaults to 8242114242L.
   *
   * This method must be called prior to calling {@link LocalServiceTestHelper#setUp()}.
   *
   * @param authDomain The gaia ID to return from {@code GaiaMintService#getUserinfoFromGaiaMint}.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setGaiaMintGaiaId(long gaiaId) {
    gaiaMintGaiaId = gaiaId;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * so that the specific {@link GaiaMintScopeCode.ScopeCode} is allowed. Calls to {@code
   * GaiaMintService#getUserinfoFromGaiaMint} with non allowed scopes will fail. If the allowed list
   * of scopes code is empty or it includes {@link GaiaMintScopeCode.ScopeCode#API_ALL_SCOPES} all
   * scopes will be allowed.
   *
   * This method must be called prior to calling {@link LocalServiceTestHelper#setUp()}.
   *
   * @param allowedScope A {@link GaiaMintScopeCode.ScopeCode} to allow for calls to {@code
   * GaiaMintService#getUserinfoFromGaiaMint}.
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig addGaiaMintAllowedScope(
      GaiaMintScopeCode.ScopeCode allowedScope) {
    gaiaMintAllowedScopes.add(allowedScope);
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * to use the specified server spec for the OneGoogle backend instead of the default (see
   * {@link LocalBasementService.ONE_GOOGLE_SERVER_SPEC_DEFAULT}).
   *
   * NOTE: most unit tests should not bother with this method and should
   * use {@link LocalBasementServiceTestConfig#setOneGoogleStub(
   * OneGoogleServerProto.OneGoogleService.Stub)} to install a mock stub.
   *
   * @param serverSpec the OneGoogle backend server spec to connect to
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setOneGoogleServerSpec(String serverSpec) {
    oneGoogleServerSpec = serverSpec;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * to use the the specified {@link OneGoogleServerProto.OneGoogleService.Stub}
   * to send RPCs to the OneGoogleService server.
   *
   * @param stub a {@link OneGoogleServerProto.OneGoogleService.Stub}
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setOneGoogleStub(
      OneGoogleServerProto.OneGoogleService.Stub stub) {
    oneGoogleStub = stub;
    return this;
  }

  /**
   * Configure the {@link LocalBasementServiceTestConfig} to create the {@code LocalBasementService}
   * to use the specified (@link com.google.common.time.Clock) when determing
   * the current time.
   *
   * @param clock a {@link com.google.common.time.Clock}
   * @return itself for call chaining
   */
  public LocalBasementServiceTestConfig setClock(Clock clock) {
    this.clock = clock;
    return this;
  }
}
