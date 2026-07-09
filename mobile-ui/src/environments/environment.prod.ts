// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  match_web_url: '^(http(s)?|capacitor):\/\/(localhost|meeting-mobileapp.monre.gov.vn)(:[0-9]+)?(\/)?$',

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
