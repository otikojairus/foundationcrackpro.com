#!/usr/bin/env bash

set -euo pipefail

APP_NAME="${APP_NAME:-cleanliquidwaste}"
IMAGE_NAME="${IMAGE_NAME:-cleanliquidwaste}"
IMAGE_TAG="${IMAGE_TAG:-deploy}"
PLATFORM="${PLATFORM:-linux/amd64}"
REMOTE_PORT="${REMOTE_PORT:-3001}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"

if [[ -z "${DROPLET_HOST:-}" ]]; then
  echo "DROPLET_HOST is required"
  exit 1
fi

if [[ -z "${DROPLET_USER:-}" ]]; then
  echo "DROPLET_USER is required"
  exit 1
fi

if [[ -z "${NEXT_PUBLIC_SITE_URL:-}" ]]; then
  echo "NEXT_PUBLIC_SITE_URL is required"
  exit 1
fi

REMOTE_TARGET="${DROPLET_USER}@${DROPLET_HOST}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
SSH_OPTS=()

if [[ -n "${DROPLET_PORT:-}" ]]; then
  SSH_OPTS+=("-p" "${DROPLET_PORT}")
fi

if [[ -n "${DROPLET_SSH_KEY:-}" ]]; then
  SSH_OPTS+=("-i" "${DROPLET_SSH_KEY}")
fi

echo "Building ${FULL_IMAGE} for ${PLATFORM}..."
docker build --platform "${PLATFORM}" -t "${FULL_IMAGE}" .

echo "Streaming image to ${REMOTE_TARGET}..."
docker save "${FULL_IMAGE}" | ssh "${SSH_OPTS[@]}" "${REMOTE_TARGET}" docker load

REMOTE_SCRIPT=$(cat <<EOF
set -euo pipefail
docker stop "${APP_NAME}" >/dev/null 2>&1 || true
docker rm "${APP_NAME}" >/dev/null 2>&1 || true
docker run -d \
  --name "${APP_NAME}" \
  --restart unless-stopped \
  -p "${REMOTE_PORT}:${CONTAINER_PORT}" \
  -e NODE_ENV=production \
  -e PORT="${CONTAINER_PORT}" \
  -e HOSTNAME=0.0.0.0 \
  -e NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL}" \
  "${FULL_IMAGE}"
EOF
)

echo "Starting ${APP_NAME} on ${REMOTE_TARGET}..."
ssh "${SSH_OPTS[@]}" "${REMOTE_TARGET}" "${REMOTE_SCRIPT}"

echo "Deployment complete."
echo "Image: ${FULL_IMAGE}"
echo "Host: ${REMOTE_TARGET}"
echo "URL: ${NEXT_PUBLIC_SITE_URL}"
