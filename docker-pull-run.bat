@echo off
setlocal enabledelayedexpansion

rem Pull ^& chay cac container meeting tu Docker Hub.
rem Su dung: docker-pull-run.bat [tag]

cd /d "%~dp0"

set "BACKEND_IMAGE=CHANGE_ME/mae-meeting-backend"
set "FRONTEND_IMAGE=CHANGE_ME/mae-meeting-frontend"
set "QTHT_FRONTEND_IMAGE=CHANGE_ME/mae-meeting-frontend-qtht"
set "MOBILE_API_IMAGE=CHANGE_ME/mae-meeting-mobile-api"
set "QTHT_BACKEND_IMAGE=CHANGE_ME/mae-meeting-backend-qtht"
set "TAG=%~1"
if "%TAG%"=="" set "TAG=latest"

if "%BACKEND_PORT%"=="" set "BACKEND_PORT=9002"
if "%FRONTEND_PORT%"=="" set "FRONTEND_PORT=9001"
if "%MOBILE_API_PORT%"=="" set "MOBILE_API_PORT=9005"
if "%QTHT_BACKEND_PORT%"=="" set "QTHT_BACKEND_PORT=9004"
if "%QTHT_FRONTEND_PORT%"=="" set "QTHT_FRONTEND_PORT=9003"

set "NETWORK=meeting-network"

echo %BACKEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %FRONTEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %QTHT_FRONTEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %MOBILE_API_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured
echo %QTHT_BACKEND_IMAGE% | findstr /b "CHANGE_ME/" >nul && goto :notconfigured

echo ==^> Chuan bi network Docker: %NETWORK%
docker network inspect "%NETWORK%" >nul 2>&1 || docker network create "%NETWORK%"

echo ==^> Dung ^& xoa container cu (neu co)
docker rm -f meeting-backend meeting-frontend meeting-mobile-api meeting-qtht-backend meeting-qtht-frontend >nul 2>&1

echo ==^> Pull tat ca image
docker pull "%BACKEND_IMAGE%:%TAG%"
if errorlevel 1 goto :error
docker pull "%FRONTEND_IMAGE%:%TAG%"
if errorlevel 1 goto :error
docker pull "%MOBILE_API_IMAGE%:%TAG%"
if errorlevel 1 goto :error
docker pull "%QTHT_BACKEND_IMAGE%:%TAG%"
if errorlevel 1 goto :error
docker pull "%QTHT_FRONTEND_IMAGE%:%TAG%"
if errorlevel 1 goto :error

echo ==^> Chay backend (cong host %BACKEND_PORT% -^> container 9002)
docker run -d --name meeting-backend --network "%NETWORK%" --restart unless-stopped -p "%BACKEND_PORT%:9002" "%BACKEND_IMAGE%:%TAG%"

echo ==^> Chay frontend (cong host %FRONTEND_PORT% -^> container 9001)
docker run -d --name meeting-frontend --network "%NETWORK%" --restart unless-stopped -p "%FRONTEND_PORT%:9001" "%FRONTEND_IMAGE%:%TAG%"

echo ==^> Chay mobile-api (cong host %MOBILE_API_PORT% -^> container 9005)
docker run -d --name meeting-mobile-api --network "%NETWORK%" --restart unless-stopped -p "%MOBILE_API_PORT%:9005" "%MOBILE_API_IMAGE%:%TAG%"

echo ==^> Chay qtht-backend (cong host %QTHT_BACKEND_PORT% -^> container 9004)
docker run -d --name meeting-qtht-backend --network "%NETWORK%" --restart unless-stopped -p "%QTHT_BACKEND_PORT%:9004" "%QTHT_BACKEND_IMAGE%:%TAG%"

echo ==^> Chay qtht-frontend (cong host %QTHT_FRONTEND_PORT% -^> container 9003)
docker run -d --name meeting-qtht-frontend --network "%NETWORK%" --restart unless-stopped -p "%QTHT_FRONTEND_PORT%:9003" "%QTHT_FRONTEND_IMAGE%:%TAG%"

echo ==^> Hoan tat!
echo     Backend       : http://localhost:%BACKEND_PORT%
echo     Frontend      : http://localhost:%FRONTEND_PORT%
echo     Mobile API    : http://localhost:%MOBILE_API_PORT%
echo     QTHT Backend  : http://localhost:%QTHT_BACKEND_PORT%
echo     QTHT Frontend : http://localhost:%QTHT_FRONTEND_PORT%
goto :eof

:notconfigured
echo Loi: hay sua ten image Docker Hub (thay CHANGE_ME) trong dau file script nay truoc khi chay.
exit /b 1

:error
echo Pull/run that bai.
exit /b 1
