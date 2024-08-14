export const environment = {
  production: true,
  appVersion: '1.0',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,

  // //api --prod
  // apiUrl: 'https://apitrungap.evnhanoi.vn/api',

  //api --staging
  apiUrl: 'https://123.30.37.246/api',
  
  // //sso product mới
  // ssoURL:'https://sso.evnhanoi.vn/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=https://trungap.evnhanoi.vn/auth/login',
  // ssoLogout: 'https://sso.evnhanoi.vn/sso/logout?appCode=DAUNOI_TRUNGAP&redirectUrl=https://trungap.evnhanoi.vn/auth/login'

  // sso staging mới
  ssoURL:'https://sso.evnhanoi.vn/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=http://10.9.169.6:1357/auth/login',
  ssoLogout: 'https://sso.evnhanoi.vn/sso/logout?appCode=DAUNOI_TRUNGAP&redirectUrl=http://10.9.169.6:1357/auth/logout'


};