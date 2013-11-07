# Google APIs
GOOGLE_APP_ID = '764135443793.apps.googleusercontent.com'
GOOGLE_APP_SECRET = '_3zYxCHIyhHMmMrrFO1wlyIn'

# Facebook auth apis
FACEBOOK_APP_ID = '474817299283833'
FACEBOOK_APP_SECRET = '83f5e272ef3db68f9d800042923e402e'

# Key/secret for both LinkedIn OAuth 1.0a and OAuth 2.0
# https://www.linkedin.com/secure/developer
LINKEDIN_KEY = 'm1ztdjt5a0ms'
LINKEDIN_SECRET = 'qW4gTOUm1ovARWys'

#NOTE: Windows, Twitter and FourSquare were not configured although they could be added easily
# https://manage.dev.live.com/AddApplication.aspx
# https://manage.dev.live.com/Applications/Index
# WL_CLIENT_ID = 'client id'
# WL_CLIENT_SECRET = 'client secret'

# https://dev.twitter.com/apps
# TWITTER_CONSUMER_KEY = 'oauth1.0a consumer key'
# TWITTER_CONSUMER_SECRET = 'oauth1.0a consumer secret'

# https://foursquare.com/developers/apps
# FOURSQUARE_CLIENT_ID = 'client id'
# FOURSQUARE_CLIENT_SECRET = 'client secret'

# config that summarizes the above
AUTH_CONFIG = {
  # OAuth 2.0 providers
  'google'      : (GOOGLE_APP_ID, GOOGLE_APP_SECRET,
                  'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'),
  'linkedin2'   : (LINKEDIN_KEY, LINKEDIN_SECRET,
                  'r_basicprofile r_emailaddress'),
  'facebook'    : (FACEBOOK_APP_ID, FACEBOOK_APP_SECRET,
                  'user_about_me,email'),
  # 'windows_live': (WL_CLIENT_ID, WL_CLIENT_SECRET,
  #                   'wl.signin'),
  #   'foursquare'  : (FOURSQUARE_CLIENT_ID,FOURSQUARE_CLIENT_SECRET,
  #                   'authorization_code'),
  # 
  #   # OAuth 1.0 providers don't have scopes
  #   'twitter'     : (TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET),
  #   'linkedin'    : (LINKEDIN_KEY, LINKEDIN_SECRET),

  # OpenID doesn't need any key/secret
}
