@echo off
setlocal

cd /d "%~dp0"

echo ==^> [1/6] Restore .NET: backend
dotnet restore "backend\MONRE_HTT.sln"
if errorlevel 1 goto :error

echo ==^> [2/6] Restore .NET: mobile-api
dotnet restore "mobile-api\MONRE_HTT_MobileAPI.sln"
if errorlevel 1 goto :error

echo ==^> [3/6] Restore .NET: qtht-backend
dotnet restore "qtht-backend\HTT_QTHT\HTT_QTHT.sln"
if errorlevel 1 goto :error

echo ==^> [4/6] Cai npm: frontend
cd frontend
call npm install
if errorlevel 1 goto :error
cd ..

echo ==^> [5/6] Cai npm: mobile-ui
cd mobile-ui
call npm install
if errorlevel 1 goto :error
cd ..

echo ==^> [6/6] Cai npm: qtht-frontend
cd qtht-frontend
call npm install
if errorlevel 1 goto :error
cd ..

echo ==^> Xong. Xem README.md de biet cach khoi chay.
goto :eof

:error
echo Cai dat that bai.
exit /b 1
