import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as localForage from 'localforage';

localForage.config({
  driver: [
    localForage.INDEXEDDB,
    localForage.LOCALSTORAGE,
    localForage.WEBSQL,
  ],
  name: '_config',     // These fields
  version: 1.0,      // are totally optional
});

const store = {
  create: async () => { return localForage; },
  get: async (key: string) => { return localForage.getItem(key) },
  set: async (key: string, data: any) => { return localForage.setItem(key, data) }
};

const defaultLang = 'vi';

export const translateLoaderFactory = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const currentLang = async () => {
  var lang = (await store.get('lang')) as string;
  return lang?.match(/en|vi/) ? lang : defaultLang;
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [TranslateModule]
})
export class I18nModule {
  constructor(translate: TranslateService) {

    translate.addLangs(['vi', 'en']);

    //const browserLang = translate.getBrowserLang();
    //translate.use(browserLang?.match(/en|vi/) ? browserLang : defaultLang);

    (async () => {
      var lang = (await store.get('lang')) as string;
      if (lang) {
        translate.use(lang?.match(/en|vi/) ? lang : defaultLang);
      }
      else {
        translate.use(defaultLang);
      }
    })();
  }
}