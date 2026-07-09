#!/usr/bin/env bash
# Pull & chay cac container meeting tu Docker Hub.
#
# Su dung:
#   ./docker-pull-run.sh [tag]
#
# Tuy chinh cong qua bien moi truong (mac dinh khop EXPOSE trong tung Dockerfile):
#   BACKEND_PORT=9002 FRONTEND_PORT=9001 MOBILE_API_PORT=9005 \
#   QTHT_BACKEND_PORT=9004 QTHT_FRONTEND_PORT=9003 ./docker-pull-run.sh

set -euo pipefail
cd "$(dirname "$0")"

BACKEND_IMAGE="CHANGE_ME/mae-meeting-backend"
FRONTEND_IMAGE="CHANGE_ME/mae-meeting-frontend"
QTHT_FRONTEND_IMAGE="CHANGE_ME/mae-meeting-frontend-qtht"
MOBILE_API_IMAGE="CHANGE_ME/mae-meeting-mobile-api"
QTHT_BACKEND_IMAGE="CHANGE_ME/mae-meeting-backend-qtht"

TAG="${1:-latest}"

BACKEND_PORT="${BACKEND_PORT:-9002}"
FRONTEND_PORT="${FRONTEND_PORT:-9001}"
MOBILE_API_PORT="${MOBILE_API_PORT:-9005}"
QTHT_BACKEND_PORT="${QTHT_BACKEND_PORT:-9004}"
QTHT_FRONTEND_PORT="${QTHT_FRONTEND_PORT:-9003}"

NETWORK="meeting-network"

for img in "$BACKEND_IMAGE" "$FRONTEND_IMAGE" "$QTHT_FRONTEND_IMAGE" "$MOBILE_API_IMAGE" "$QTHT_BACKEND_IMAGE"; do
  if [[ "$img" == CHANGE_ME/* ]]; then
    echo "Loi: hay sua ten image Docker Hub (thay CHANGE_ME) trong dau file script nay truoc khi chay." >&2
    exit 1
  fi
done

echo "==> Chuan bi network Docker: ${NETWORK}"
docker network inspect "${NETWORK}" >/dev/null 2>&1 || docker network create "${NETWORK}"

echo "==> Dung & xoa container cu (neu co)"
docker rm -f meeting-backend meeting-frontend meeting-mobile-api meeting-qtht-backend meeting-qtht-frontend >/dev/null 2>&1 || true

for pair in "$BACKEND_IMAGE" "$FRONTEND_IMAGE" "$MOBILE_API_IMAGE" "$QTHT_BACKEND_IMAGE" "$QTHT_FRONTEND_IMAGE"; do
  echo "==> Pull ${pair}:${TAG}"
  docker pull "${pair}:${TAG}"
done

echo "==> Chay backend (cong host ${BACKEND_PORT} -> container 9002)"
docker run -d --name meeting-backend --network "${NETWORK}" --restart unless-stopped -p "${BACKEND_PORT}:9002" "${BACKEND_IMAGE}:${TAG}"

echo "==> Chay frontend (cong host ${FRONTEND_PORT} -> container 9001)"
docker run -d --name meeting-frontend --network "${NETWORK}" --restart unless-stopped -p "${FRONTEND_PORT}:9001" "${FRONTEND_IMAGE}:${TAG}"

echo "==> Chay mobile-api (cong host ${MOBILE_API_PORT} -> container 9005)"
docker run -d --name meeting-mobile-api --network "${NETWORK}" --restart unless-stopped -p "${MOBILE_API_PORT}:9005" "${MOBILE_API_IMAGE}:${TAG}"

echo "==> Chay qtht-backend (cong host ${QTHT_BACKEND_PORT} -> container 9004)"
docker run -d --name meeting-qtht-backend --network "${NETWORK}" --restart unless-stopped -p "${QTHT_BACKEND_PORT}:9004" "${QTHT_BACKEND_IMAGE}:${TAG}"

echo "==> Chay qtht-frontend (cong host ${QTHT_FRONTEND_PORT} -> container 9003)"
docker run -d --name meeting-qtht-frontend --network "${NETWORK}" --restart unless-stopped -p "${QTHT_FRONTEND_PORT}:9003" "${QTHT_FRONTEND_IMAGE}:${TAG}"

echo "==> Hoan tat!"
echo "    Backend       : http://localhost:${BACKEND_PORT}"
echo "    Frontend      : http://localhost:${FRONTEND_PORT}"
echo "    Mobile API    : http://localhost:${MOBILE_API_PORT}"
echo "    QTHT Backend  : http://localhost:${QTHT_BACKEND_PORT}"
echo "    QTHT Frontend : http://localhost:${QTHT_FRONTEND_PORT}"
