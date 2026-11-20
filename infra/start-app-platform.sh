#!/bin/bash
set -euo pipefail

declare -A seen_hosts=()
for key in STOREFRONT_DOMAIN COLLECTOR_DOMAIN API_DOMAIN MEDUSA_DOMAIN CMS_DOMAIN; do
  value=${!key:-}
  if [[ ! $value =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]; then
    echo "$key must be a hostname without a scheme, path, or port" >&2
    exit 1
  fi
  if [[ -n ${seen_hosts[${value,,}]:-} ]]; then
    echo "$key duplicates another service hostname" >&2
    exit 1
  fi
  seen_hosts[${value,,}]=1
  export "$key"
done
: "${BACKEND_REDIS_URL:?Set BACKEND_REDIS_URL to an external Redis connection URL}"
export BACKEND_EVENTS_REDIS_URL=${BACKEND_EVENTS_REDIS_URL:-$BACKEND_REDIS_URL}
export NODE_ENV=production
# Restrict substitution to public hostnames; preserve Nginx request variables.
envsubst '${STOREFRONT_DOMAIN} ${COLLECTOR_DOMAIN} ${API_DOMAIN} ${MEDUSA_DOMAIN} ${CMS_DOMAIN}' \
  < /etc/nginx/app-platform.conf.template > /tmp/nginx.app-platform.conf
nginx -t -c /tmp/nginx.app-platform.conf

pids=()
stop() {
  trap - EXIT TERM INT
  for pid in "${pids[@]}"; do kill -TERM -- "-$pid" 2>/dev/null || true; done
  wait || true
}
trap stop EXIT
trap 'exit 0' TERM INT

echo "Starting bundle: nginx=8080 storefront=3000 medusa=9000 api=3333 cms=1337"

(cd /app/.medusa/server; exec setsid /usr/local/bin/run-app BACKEND env NODE_ENV=production HOST=127.0.0.1 PORT=9000 /app/node_modules/.bin/medusa start --port 9000) &
pids+=("$!")
(cd /srv/public-web; exec setsid /usr/local/bin/run-app PUBLIC_WEB env NODE_ENV=production HOSTNAME=127.0.0.1 PORT=3000 node apps/public-web/server.js) &
pids+=("$!")
(cd /srv/api; exec setsid /usr/local/bin/run-app API env NODE_ENV=production HOST=127.0.0.1 PORT=3333 node bin/server.js) &
pids+=("$!")
(cd /srv/cms; exec setsid /usr/local/bin/run-app CMS env NODE_ENV=production HOST=127.0.0.1 PORT=1337 ./node_modules/.bin/strapi start) &
pids+=("$!")
setsid node /usr/local/bin/bundle-readiness.mjs &
pids+=("$!")
setsid nginx -c /tmp/nginx.app-platform.conf -g 'daemon off;' &
pids+=("$!")

# Any process exiting terminates the container so the platform restarts the group.
wait -n "${pids[@]}" || true
echo 'An application process exited; stopping the container' >&2
exit 1
