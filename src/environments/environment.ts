// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v1.0',
  USERDATA_KEY: 'hrmauthf649fc9a5f55',
  isMockEnabled: false,
  apiUrl: 'http://localhost:25586/api',
  // apiUrl: 'http://10.9.8.51:2468/api',
  // ssoURL:'http://14.238.40.33:6801/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=http://localhost:4200/auth/login',
  // ssoLogout: 'http://14.238.40.33:6801/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=http://localhost:4200/auth/login'

  ssoURL:'https://sso.evnhanoi.vn/sso/login?appCode=DAUNOI_TRUNGAP&redirectUrl=http://localhost:4200/auth/login',
  ssoLogout: 'https://sso.evnhanoi.vn/sso/logout?appCode=DAUNOI_TRUNGAP&redirectUrl=http://localhost:4200/auth/login'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
