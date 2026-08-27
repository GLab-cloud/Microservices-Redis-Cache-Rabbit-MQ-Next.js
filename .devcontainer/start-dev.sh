#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
export LOG_DIR=/tmp

log() { echo "[start-dev] $*"; }

ensure_container() {
  local name="$1"; shift
  if docker ps -a --filter "name=^/$name$" --format '{{.Names}}' | grep -qx "$name"; then
    log "container '$name' already exists, starting it"
    docker start "$name" >/dev/null 2>&1 || true
  else
    log "creating container '$name'"
    docker run -d --name "$name" --restart unless-stopped "$@" >/dev/null 2>&1 || {
      log "WARN: failed to start container '$name'" >&2
    }
  fi
}

# Two infra containers
ensure_container rabbitmq-fast \
  -p 5672:5672 -p 15672:15672 --env-file=.env rabbitmq:3-management-alpine

ensure_container blog-redis \
  -p 6379:6379 redis:7-alpine

sleep 6

# Detach a long-running app so the parent shell (postStartCommand) can exit.
detach() {
  local logfile="$1"; shift
  setsid bash -c "$*" >"$logfile" 2>&1 </dev/null &
  disown
}

start_service() {
  local dir="$1"; local name="$2"; local runner="${3:-npm start}"
  log "building $name..."
  if ! (cd "services/$dir" && npm run build >"$LOG_DIR/$name-build.log" 2>&1); then
    log "WARNING: build failed for $name, see $LOG_DIR/$name-build.log" >&2
  fi
  log "starting $name (log: $LOG_DIR/$name.log)"
  detach "$LOG_DIR/$name.log" "cd services/$dir && exec $runner"
}

start_service author author
start_service blog blog
start_service user user

log "starting frontend (log: $LOG_DIR/frontend.log)"
detach "$LOG_DIR/frontend.log" "cd frontend && exec npm run dev"

sleep 3
if command -v ss >/dev/null 2>&1; then
  echo "--- listener check (ports 3000,5000-5002,5672,6379,15672) ---"
  ss -ltn 2>/dev/null | grep -E ':(3000|5000|5001|5002|5672|6379|15672)\b' || echo "(none found yet - services may still be booting)"
fi

log "all services launched. Logs in $LOG_DIR/*.log"
exit 0