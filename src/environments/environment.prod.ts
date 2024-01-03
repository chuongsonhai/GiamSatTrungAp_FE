export const environment = {
  production: true,
  appVersion: '1.0',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'https://apitrungap.evnhanoi.vn/api',
  // apiUrl: 'http://10.9.171.17:2468/api',
  // ssoURL:'http://14.238.40.33:6801/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=https://trungap.evnhanoi.vn/auth/login',
  // ssoLogout: 'http://14.238.40.33:6801/sso/logout?appCode=DAUNOI_TRUNGAP&redirectUrl=https://trungap.evnhanoi.vn/auth/login'

  ssoURL:'https://sso.evnhanoi.vn/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=https://trungap.evnhanoi.vn/auth/login',
  ssoLogout: 'https://sso.evnhanoi.vn/sso/logout?appCode=DAUNOI_TRUNGAP&redirectUrl=https://trungap.evnhanoi.vn/auth/login'

  // ssoURL:'https://sso.evnhanoi.vn/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=http://10.9.171.16:1357/auth/login',
  // ssoLogout: 'https://sso.evnhanoi.vn/sso/logout?appCode=DAUNOI_TRUNGAP&redirectUrl=http://http://10.9.171.16:1357/auth/logout'
};