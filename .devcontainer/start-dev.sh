#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

echo "Starting RabbitMQ..."
docker start rabbitmq-fast 2>/dev/null || \
  docker run -d --name rabbitmq-fast -p 5672:5672 -p 15672:15672 --env-file=.env rabbitmq:3-management-alpine

sleep 5

start_service () {
  local dir="$1"
  local name="$2"
  echo "Starting $name..."
  (cd "services/$dir" && npm run build && npm start > "/tmp/$name.log" 2>&1 &)
  echo "  $name -> /tmp/$name.log"
}

start_service author author
start_service blog blog
start_service user user

echo "Starting frontend..."
(cd frontend && (npm run dev > /tmp/frontend.log 2>&1 &))
echo "  frontend -> /tmp/frontend.log"

echo "All services started. Logs in /tmp/*.log"