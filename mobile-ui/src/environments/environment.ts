// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  match_web_url: '^(http(s)?|capacitor):\/\/(localhost|meeting-mobileapp.monre.gov.vn)(:[0-9]+)?(\/)?$',

  /*! https://meeting-mobileapi.monre.gov.vn/swagger/index.html */
  api_url: 'https://meeting-mobileapi.monre.gov.vn/',
  api_id: null,
  api_secret: null,
  api_disabled: false,

  "madonvi": "[replace_value]",
  "tendv": "[replace_value]",

  "default_donvi": "monre",
  "donvis": [
    {
      "madonvi": "monre",
      "tendv": "MonreMeeting",
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
