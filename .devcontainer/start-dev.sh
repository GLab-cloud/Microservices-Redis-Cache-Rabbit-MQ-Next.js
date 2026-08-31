#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
LOG_DIR=/tmp
export LOG_DIR

log() { echo "[start-dev] $*"; }

# port_listening <port> -> true if a TCP listener is already bound to it.
port_listening() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -ltn 2>/dev/null | grep -qE "[:.]${port}\b"
  else
    (exec 3<>"/dev/tcp/127.0.0.1/$port") 2>/dev/null && { exec 3>&-; return 0; } || return 1
  fi
}

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

# Wait for infra ports to come up before starting apps that depend on them.
for port in 5672 6379; do
  for _ in $(seq 1 30); do
    port_listening "$port" && break
    sleep 1
  done
done

# Detach a long-running app so the parent shell (postStartCommand) can exit
# WITHOUT killing the child on HUP.  nohup + setsid + disown make the process
# survive events, SIGHUP, and Codespaces lifecycle teardown.
detach() {
  local logfile="$1"; shift
  nohup setsid bash -c "$*" >"$logfile" 2>&1 </dev/null &
  disown
}

# start_app <port> <- if already listening, skip to keep startup idempotent
#                    on reopen so we never double-start a service.
# start_app <name> <logfile> <cmdline...>
start_app() {
  local port="$1"; local name="$2"; local logfile="$3"; shift 3
  if port_listening "$port"; then
    log "port $port already in use - '$name' already running, skipping"
    return 0
  fi
  log "starting $name (log: $logfile)"
  detach "$logfile" "$*"
}

# TypeScript services: build once, then run production server.
start_service() {
  local dir="$1"; local name="$2"; local port="$3"; shift 3
  local logfile="$LOG_DIR/$name.log"
  if port_listening "$port"; then
    log "port $port already in use - '$name' already running, skipping"
    return 0
  fi
  log "building $name..."
  if ! (cd "services/$dir" && npm run build >"$LOG_DIR/$name-build.log" 2>&1); then
    log "WARNING: build failed for $name, see $LOG_DIR/$name-build.log" >&2
  fi
  start_app "$port" "$name" "$logfile" "cd services/$dir && exec npm start"
}

start_service author author 5001
start_service blog blog 5002
start_service user user 5000

start_app 3000 frontend "$LOG_DIR/frontend.log" "cd frontend && exec npm run dev"

# Give services a moment, then report which ports are actually up.
sleep 5
if command -v ss >/dev/null 2>&1; then
  echo "--- listener check (ports 3000,5000-5002,5672,6379,15672) ---"
  ss -ltn 2>/dev/null | grep -E ':(3000|5000|5001|5002|5672|6379|15672)\b' || echo "(none found yet - services may still be booting)"
fi

log "all services launched. Logs in $LOG_DIR/*.log"
exit 0
