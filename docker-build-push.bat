@echo off
setlocal enabledelayedexpansion

rem Build ^& push cac image Docker cua meeting len Docker Hub.
rem Su dung: docker-build-push.bat [tag]
rem CHUA co ten image nao duoc dien san - sua CHANGE_ME o ca 5 dong ben duoi
rem truoc khi chay. mobile-ui khong co Dockerfile - xem README.md.

cd /d "%~dp0"

set "BACKEND_IMAGE=CHANGE_ME/mae-meeting-backend"
set "FRONTEND_IMAGE=CHANGE_ME/mae-meeting-frontend"
set "QTHT_FRONTEND_IMAGE=CHANGE_ME/mae-meeting-frontend-qtht"
set "MOBILE_API_IMAGE=CHANGE_ME/mae-meeting-mobile-api"
set "QTHT_BACKEND_IMAGE=CHANGE_ME/mae-meeting-backend-qtht"
set "TAG=%~1"
if "%TAG%"=="" set "TAG=latest"

echo %BACKEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %FRONTEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %QTHT_FRONTEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %MOBILE_API_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %QTHT_BACKEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured

echo ==^> Dang nhap Docker Hub (bo qua neu da dang nhap san)
docker login
if errorlevel 1 goto :error

echo ==^> Build backend: %BACKEND_IMAGE%:%TAG%
docker build -t "%BACKEND_IMAGE%:%TAG%" -f "backend\Api\Dockerfile" "backend"
if errorlevel 1 goto :error

echo ==^> Build frontend: %FRONTEND_IMAGE%:%TAG%
docker build -t "%FRONTEND_IMAGE%:%TAG%" -f "frontend\Dockerfile" "frontend"
if errorlevel 1 goto :error

echo ==^> Build mobile-api: %MOBILE_API_IMAGE%:%TAG%
docker build -t "%MOBILE_API_IMAGE%:%TAG%" -f "mobile-api\Api\Dockerfile" "mobile-api"
if errorlevel 1 goto :error

echo ==^> Build qtht-backend: %QTHT_BACKEND_IMAGE%:%TAG%
docker build -t "%QTHT_BACKEND_IMAGE%:%TAG%" -f "qtht-backend\HTT_QTHT\Dockerfile" "qtht-backend\HTT_QTHT"
if errorlevel 1 goto :error

echo ==^> Build qtht-frontend: %QTHT_FRONTEND_IMAGE%:%TAG%
docker build -t "%QTHT_FRONTEND_IMAGE%:%TAG%" -f "qtht-frontend\Dockerfile" "qtht-frontend"
if errorlevel 1 goto :error

echo ==^> Push tat ca
docker push "%BACKEND_IMAGE%:%TAG%"
docker push "%FRONTEND_IMAGE%:%TAG%"
docker push "%MOBILE_API_IMAGE%:%TAG%"
docker push "%QTHT_BACKEND_IMAGE%:%TAG%"
docker push "%QTHT_FRONTEND_IMAGE%:%TAG%"

echo ==^> Hoan tat!
goto :eof

:notconfigured
echo Loi: hay sua ten image Docker Hub (thay CHANGE_ME) trong dau file script nay truoc khi chay.
exit /b 1

:error
echo Build/push that bai.
exit /b 1
