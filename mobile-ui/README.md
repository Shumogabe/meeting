## Quick start dev

```Terminal
git clone https://gitlab.com/meetingapps/monre-meeting.git
cd monre-meeting
npm install
ionic serve
```

## Build android

```Terminal
ionic build --prod
npx cap sync android
npx cap open android
```

## Build ios

```Terminal
ionic build --prod
npx cap sync ios
npx cap open ios
```

##### Example

- ionic generate page pages/...
- ionic generate component components/...
- ionic generate component modals/modal-...
- ionic generate component popovers/popover-...

##### Angular Lifecircle hook

```Text
    constructor
    ngOnChanges
    ngOnInit
    ngDoCheck
        ngAfterContentInit
        ngAfterContentChecked
        ngAfterViewInit
        ngAfterViewChecked
    ngOnDestroy
```

##### setup tsconfig.json

```Json
{
    //...
    "compilerOptions": {
        "resolveJsonModule": true,
        "allowSyntheticDefaultImports": true,
    }
}
```

##### template resource

```Text
resources/
├── icon-only.png           (1024px x 1024px)
├── icon-foreground.png
├── icon-background.png
├── splash.png              (2732px x 2732px)
└── splash-dark.png
```

#### NOTE DEPLOY ANDROID

```Text
Cập nhật file SSL trên ứng dụng để có thể truy cập API, thay thế file mới tại đường dẫn bên dưới, sau đó build lại ứng dụng
android/app/src/main/res/raw/monre_gov_vn.pem
```

# INSTALL .AAB

```terminal
brew install bundletool
bundletool build-apks --bundle=app-release.aab --output=app-release.apks
bundletool install-apks --apks=app-release.apks --adb=~/Library/Android/sdk/platform-tools/adb
```

### Jitsi Meet Capacitor

https://github.com/calvinckho/capacitor-jitsi-meet

#Các phiên bản Build gradle
https://developer.android.com/build/releases/gradle-plugin?hl=vi&authuser=1#updating-gradle

### Read src

- app\app-routing.module.ts
  Đường dẫn
- api_connector
  Cấu hình config api
- api_repository
  Cấu hình call api
- app_models
  Khai báo biến
- app_func
  Khai báo các function dùng chung
- environments\environment.ts
  Khai báo thông tin api
- app\pages
  Giao diện
- app\modals
  Modals
