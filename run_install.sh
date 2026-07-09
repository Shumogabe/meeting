#!/usr/bin/env bash
# Cai dat toan bo dependency cho meeting sau khi clone repo.
set -e
cd "$(dirname "$0")"

echo "==> [1/6] Restore .NET: backend"
dotnet restore "backend/MONRE_HTT.sln"

echo "==> [2/6] Restore .NET: mobile-api"
dotnet restore "mobile-api/MONRE_HTT_MobileAPI.sln"

echo "==> [3/6] Restore .NET: qtht-backend"
dotnet restore "qtht-backend/HTT_QTHT/HTT_QTHT.sln"

echo "==> [4/6] Cai npm: frontend"
(cd frontend && npm install)

echo "==> [5/6] Cai npm: mobile-ui"
(cd mobile-ui && npm install)

echo "==> [6/6] Cai npm: qtht-frontend"
(cd qtht-frontend && npm install)

echo "==> Xong. Xem README.md de biet cach khoi chay."
