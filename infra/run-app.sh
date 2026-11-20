#!/bin/bash
set -euo pipefail

# Keep root variable names intact and pass only the owning app's namespace.
prefix=${1:?Supply API, BACKEND, CMS, or PUBLIC_WEB}
shift
case "$prefix" in API|BACKEND|CMS|PUBLIC_WEB) ;; *) echo 'Unknown app namespace' >&2; exit 1 ;; esac
app_env=("PATH=$PATH" "HOME=$HOME" "NODE_ENV=production" "COREPACK_ENABLE_PROJECT_SPEC=0" "COREPACK_HOME=/opt/corepack")
while IFS= read -r key; do
  if [[ $key == "${prefix}_"* ]]; then
    app_env+=("$key=${!key}")
  elif [[ $prefix == PUBLIC_WEB && $key == NEXT_PUBLIC_* ]]; then
    app_env+=("$key=${!key}")
  fi
done < <(compgen -e)
exec env -i "${app_env[@]}" "$@"
