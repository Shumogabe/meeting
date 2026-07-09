# meeting

## Cấu trúc dự án

| Thư mục | Stack | Vai trò |
|---|---|---|
| `backend/Api` | .NET 8 (`MONRE_HTT.sln`) | API chính |
| `mobile-api/Api` | .NET 8 (`MONRE_HTT_MobileAPI.sln`) | API cho mobile |
| `qtht-backend/HTT_QTHT` | .NET 8 (`HTT_QTHT.sln`) | API quản trị hệ thống (QTHT) |
| `frontend` | React (CRA) | Giao diện web |
| `mobile-ui` | Angular + Ionic/Capacitor | App mobile (Android/iOS) |
| `qtht-frontend` | React (CRA) | Giao diện quản trị (QTHT) |

## Yêu cầu môi trường

- .NET SDK 8.0
- Node.js + npm
- (Chỉ khi build app mobile native) Android Studio / Xcode

## Cài đặt

Chạy **một lần** sau khi clone repo về máy mới:

```bash
# Windows
run_install.bat

# Linux / macOS
./run_install.sh
```

Script sẽ tự `dotnet restore` cho `backend`, `mobile-api`, `qtht-backend`, và `npm install` cho `frontend`, `mobile-ui`, `qtht-frontend`.

`mobile-ui` cài đặt xong sẽ tự cài `@ionic/cli` global và build package nội bộ `capacitor-hybrid-vnptid` (qua hook `preinstall` có sẵn trong `package.json`) — bước này có thể mất vài phút.

## Khởi chạy

### Backend

```bash
cd backend/Api
dotnet run
```

### Mobile API

```bash
cd mobile-api/Api
dotnet run
```

### QTHT Backend

```bash
cd qtht-backend/HTT_QTHT
dotnet run
```

### Frontend

```bash
cd frontend
npm start
```

### QTHT Frontend

```bash
cd qtht-frontend
npm start
```

### Mobile UI (chạy trên trình duyệt để dev)

```bash
cd mobile-ui
npm start
# hoặc: npm run serve  (Ionic dev server, port 8200)
```

Build/mở native Android/iOS: `npm run open-android` / `npm run open-ios` (yêu cầu Android Studio/Xcode đã cài).

Cấu hình kết nối (connection string, port...) nằm trong các file `appsettings.json`/`appsettings.Development.json` của từng backend và `.env` của từng frontend — đã được commit sẵn trong repo (private), chỉnh sửa lại cho phù hợp với máy đang chạy nếu cần.

## Docker

5/6 module có `Dockerfile`: `backend` (9002), `frontend` (9001), `mobile-api` (9005), `qtht-backend` (9004), `qtht-frontend` (9003). `mobile-ui` **chưa có** `Dockerfile` — build native qua `npm run open-android`/`open-ios`, hoặc build web tĩnh qua `npm run build-web`.

```bash
# Windows
docker-build-push.bat [tag]
docker-pull-run.bat [tag]

# Linux / macOS
./docker-build-push.sh [tag]
./docker-pull-run.sh [tag]
```

Script **không** đặt sẵn tên image nào (kể cả namespace `ciissoftdev` dùng trong các `build.bat` cũ ở từng thư mục con) — mở file script, sửa cả 5 biến `BACKEND_IMAGE`/`FRONTEND_IMAGE`/`MOBILE_API_IMAGE`/`QTHT_BACKEND_IMAGE`/`QTHT_FRONTEND_IMAGE` (thay `CHANGE_ME`) thành namespace Docker Hub thật của bạn trước khi chạy — script sẽ báo lỗi và dừng lại nếu còn sót `CHANGE_ME`. Cổng có thể tuỳ chỉnh qua biến môi trường (`BACKEND_PORT`, `FRONTEND_PORT`, `MOBILE_API_PORT`, `QTHT_BACKEND_PORT`, `QTHT_FRONTEND_PORT`).
