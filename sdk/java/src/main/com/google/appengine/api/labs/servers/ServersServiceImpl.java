package com.google.appengine.api.labs.servers;

import com.google.appengine.api.labs.servers.ServersServicePb.GetDefaultVersionRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.GetDefaultVersionResponse;
import com.google.appengine.api.labs.servers.ServersServicePb.GetHostnameRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.GetHostnameResponse;
import com.google.appengine.api.labs.servers.ServersServicePb.GetNumInstancesRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.GetNumInstancesResponse;
import com.google.appengine.api.labs.servers.ServersServicePb.GetServersRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.GetServersResponse;
import com.google.appengine.api.labs.servers.ServersServicePb.GetVersionsRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.GetVersionsResponse;
import com.google.appengine.api.labs.servers.ServersServicePb.ServersServiceError.ErrorCode;
import com.google.appengine.api.labs.servers.ServersServicePb.SetNumInstancesRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.StartServerRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.StartServerResponse;
import com.google.appengine.api.labs.servers.ServersServicePb.StopServerRequest;
import com.google.appengine.api.labs.servers.ServersServicePb.StopServerResponse;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.common.base.Pair;
import com.google.common.base.Splitter;
import com.google.common.collect.Sets;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.Message;

import java.util.List;
import java.util.Map;
import java.util.Set;

class ServersServiceImpl implements ServersService {
  protected static final String PACKAGE = "servers";

  /**
   * Environment attribute key where the instance id is stored.
   *
   * @see ServersService#getCurrentInstanceId()
   */
  private static final String INSTANCE_ID_ENV_ATTRIBUTE = "com.google.appengine.instance.id";

  private Pair<String, String> getCurrentServerAndVersion() {
    Environment env = ApiProxy.getCurrentEnvironment();
    String majorVersion = Splitter.on('.').split(env.getVersionId()).iterator().next();
    if (majorVersion.contains(":")) {
      List<String> result = Splitter.on(':').splitToList(majorVersion);
      return Pair.of(result.get(0), result.get(1));
    } else {
      return Pair.of("default", majorVersion);
    }
  }

  @Override
  public String getCurrentServer() {
    return getCurrentServerAndVersion().first;
  }

  @Override
  public String getCurrentVersion() {
    return getCurrentServerAndVersion().second;
  }

  private static Map<String, Object> getThreadLocalAttributes() {
    return ApiProxy.getCurrentEnvironment().getAttributes();
  }

  @Override
  public String getCurrentInstanceId() {
    Map<String, Object> env = getThreadLocalAttributes();
    if (!env.containsKey(INSTANCE_ID_ENV_ATTRIBUTE)) {
      throw new ServersException("No valid instance id for this instance.");
    }
    String instanceId = (String) getThreadLocalAttributes().get(INSTANCE_ID_ENV_ATTRIBUTE);
    if (instanceId == null) {
      throw new ServersException("No valid instance id for this instance.");
    }
    return instanceId;
  }

  private static void makeSyncCall(String method, Message.Builder request, Message.Builder response)
      throws ServersException {
    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, method, request.build().toByteArray());
      response.mergeFrom(responseBytes);
    } catch (ApiProxy.ApplicationException e) {
      switch(ErrorCode.valueOf(e.getApplicationError())) {
        case INVALID_SERVER:
          throw new InvalidServerException("Given server is not known.");
        case INVALID_VERSION:
          throw new InvalidVersionException("Given server version is not known.");
        case INVALID_INSTANCES:
          throw new InvalidInstanceException("Given instances value is invalid.");
        case UNEXPECTED_STATE:
          if (method.equals("StartServer")) {
            throw new ServerAlreadyStartedException("Given server version is already started.");
          } else if (method.equals("StopServer")) {
            throw new ServerAlreadyStoppedException("Given server version is already stopped.");
          }
        default:
          throw new ServersException("Unknown error occurred.");
      }
    } catch (InvalidProtocolBufferException e) {
      throw new RuntimeException("Internal logic error: Response PB could not be parsed.", e);
    }
  }

  @Override
  public Set<String> getServers() {
    GetServersResponse.Builder response = GetServersResponse.newBuilder();
    makeSyncCall("GetServers", GetServersRequest.newBuilder(), response);
    return Sets.newHashSet(response.getServerList());
  }

  @Override
  public Set<String> getVersions(String server) {
    GetVersionsRequest.Builder request = GetVersionsRequest.newBuilder();
    request.setServer(server);
    GetVersionsResponse.Builder response = GetVersionsResponse.newBuilder();
    makeSyncCall("GetVersions", request, response);
    return Sets.newHashSet(response.getVersionList());
  }

  @Override
  public String getDefaultVersion(String server) {
    GetDefaultVersionRequest.Builder request = GetDefaultVersionRequest.newBuilder();
    request.setServer(server);
    GetDefaultVersionResponse.Builder response = GetDefaultVersionResponse.newBuilder();
    makeSyncCall("GetDefaultVersion", request, response);
    return response.getVersion();
  }

  @Override
  public long getNumInstances(String server, String version) {
    GetNumInstancesRequest.Builder request = GetNumInstancesRequest.newBuilder();
    request.setServer(server);
    request.setVersion(version);
    GetNumInstancesResponse.Builder response = GetNumInstancesResponse.newBuilder();
    makeSyncCall("GetNumInstances", request, response);
    return response.getInstances();
  }

  @Override
  public void setNumInstances(String server, String version, long instances) {
    SetNumInstancesRequest.Builder request = SetNumInstancesRequest.newBuilder();
    request.setServer(server);
    request.setVersion(version);
    request.setInstances(instances);
    makeSyncCall("SetNumInstances", request, SetNumInstancesRequest.newBuilder());
  }

  @Override
  public void startServer(String server, String version) {
    StartServerRequest.Builder request = StartServerRequest.newBuilder();
    request.setServer(server);
    request.setVersion(version);
    makeSyncCall("StartServer", request, StartServerResponse.newBuilder());
  }

  @Override
  public void stopServer(String server, String version) {
    StopServerRequest.Builder request = StopServerRequest.newBuilder();
    request.setServer(server);
    request.setVersion(version);
    makeSyncCall("StopServer", request, StopServerResponse.newBuilder());
  }

  private String getHostname(GetHostnameRequest.Builder request) {
    GetHostnameResponse.Builder response = GetHostnameResponse.newBuilder();
    makeSyncCall("GetHostname", request, response);
    return response.getHostname();
  }

  @Override
  public String getServerHostname(String server, String version) {
    GetHostnameRequest.Builder request = GetHostnameRequest.newBuilder();
    request.setServer(server);
    request.setVersion(version);
    return getHostname(request);
  }

  @Override
  public String getServerHostname(String server, String version, int instance) {
    GetHostnameRequest.Builder request = GetHostnameRequest.newBuilder();
    request.setServer(server);
    request.setVersion(version);
    request.setInstance(Integer.toString(instance));
    return getHostname(request);
  }

  ServersServiceImpl() { }
}
