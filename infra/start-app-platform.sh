#!/bin/bash
set -euo pipefail

export STOREFRONT_HOST=${STOREFRONT_HOST:-walrus-app-6o72x.ondigitalocean.app}
export API_URL=${API_URL:-http://127.0.0.1:3333/api/v1}
export MEDUSA_INTERNAL_URL=${MEDUSA_INTERNAL_URL:-http://127.0.0.1:9000}

declare -A seen_hosts=()
for key in STOREFRONT_HOST COLLECTOR_HOST API_HOST MEDUSA_HOST CMS_HOST; do
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
: "${REDIS_URL:?Set REDIS_URL to an external Redis connection URL}"
export EVENTS_REDIS_URL=${EVENTS_REDIS_URL:-$REDIS_URL}
export NODE_ENV=production
# Restrict substitution to public hostnames; preserve Nginx request variables.
envsubst '${STOREFRONT_HOST} ${COLLECTOR_HOST} ${API_HOST} ${MEDUSA_HOST} ${CMS_HOST}' \
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

(cd /app/.medusa/server; exec setsid env HOST=0.0.0.0 PORT=9000 /app/node_modules/.bin/medusa start --port 9000) &
pids+=("$!")
(cd /srv/public-web; exec setsid env HOSTNAME=0.0.0.0 PORT=3000 node apps/public-web/server.js) &
pids+=("$!")
(cd /srv/api; exec setsid env HOST=0.0.0.0 PORT=3333 node bin/server.js) &
pids+=("$!")
(cd /srv/cms; exec setsid env HOST=0.0.0.0 PORT=1337 ./node_modules/.bin/strapi start) &
pids+=("$!")
setsid nginx -c /tmp/nginx.app-platform.conf -g 'daemon off;' &
pids+=("$!")

# Any process exiting terminates the container so the platform restarts the group.
wait -n "${pids[@]}" || true
echo 'An application process exited; stopping the container' >&2
exit 1
