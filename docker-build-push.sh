#!/usr/bin/env bash
# Build & push cac image Docker cua meeting len Docker Hub.
#
# Su dung:
#   ./docker-build-push.sh [tag]
#
# CHUA co ten image nao duoc dien san - sua CHANGE_ME o ca 5 dong ben duoi
# thanh ten that (namespace Docker Hub cua ban) truoc khi chay.
#
# Luu y: mobile-ui khong co Dockerfile trong repo nen khong nam trong script
# nay - xem README.md.

set -euo pipefail
cd "$(dirname "$0")"

BACKEND_IMAGE="CHANGE_ME/mae-meeting-backend"
FRONTEND_IMAGE="CHANGE_ME/mae-meeting-frontend"
QTHT_FRONTEND_IMAGE="CHANGE_ME/mae-meeting-frontend-qtht"
MOBILE_API_IMAGE="CHANGE_ME/mae-meeting-mobile-api"
QTHT_BACKEND_IMAGE="CHANGE_ME/mae-meeting-backend-qtht"

TAG="${1:-latest}"

for img in "$BACKEND_IMAGE" "$FRONTEND_IMAGE" "$QTHT_FRONTEND_IMAGE" "$MOBILE_API_IMAGE" "$QTHT_BACKEND_IMAGE"; do
  if [[ "$img" == CHANGE_ME/* ]]; then
    echo "Loi: hay sua ten image Docker Hub (thay CHANGE_ME) trong dau file script nay truoc khi chay." >&2
    exit 1
  fi
done

echo "==> Dang nhap Docker Hub (bo qua neu da dang nhap san)"
docker login

echo "==> Build backend: ${BACKEND_IMAGE}:${TAG}"
docker build -t "${BACKEND_IMAGE}:${TAG}" -f "backend/Api/Dockerfile" "backend"

echo "==> Build frontend: ${FRONTEND_IMAGE}:${TAG}"
docker build -t "${FRONTEND_IMAGE}:${TAG}" -f "frontend/Dockerfile" "frontend"

echo "==> Build mobile-api: ${MOBILE_API_IMAGE}:${TAG}"
docker build -t "${MOBILE_API_IMAGE}:${TAG}" -f "mobile-api/Api/Dockerfile" "mobile-api"

echo "==> Build qtht-backend: ${QTHT_BACKEND_IMAGE}:${TAG}"
docker build -t "${QTHT_BACKEND_IMAGE}:${TAG}" -f "qtht-backend/HTT_QTHT/Dockerfile" "qtht-backend/HTT_QTHT"

echo "==> Build qtht-frontend: ${QTHT_FRONTEND_IMAGE}:${TAG}"
docker build -t "${QTHT_FRONTEND_IMAGE}:${TAG}" -f "qtht-frontend/Dockerfile" "qtht-frontend"

echo "==> Push tat ca"
docker push "${BACKEND_IMAGE}:${TAG}"
docker push "${FRONTEND_IMAGE}:${TAG}"
docker push "${MOBILE_API_IMAGE}:${TAG}"
docker push "${QTHT_BACKEND_IMAGE}:${TAG}"
docker push "${QTHT_FRONTEND_IMAGE}:${TAG}"

echo "==> Hoan tat!"
echo "    ${BACKEND_IMAGE}:${TAG}"
echo "    ${FRONTEND_IMAGE}:${TAG}"
echo "    ${MOBILE_API_IMAGE}:${TAG}"
echo "    ${QTHT_BACKEND_IMAGE}:${TAG}"
echo "    ${QTHT_FRONTEND_IMAGE}:${TAG}"
