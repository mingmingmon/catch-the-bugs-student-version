#!/bin/sh
set -eu

if [ -n "${APP_DATA_DIR:-}" ]; then
  mkdir -p "$APP_DATA_DIR"
  chown app:app "$APP_DATA_DIR"
fi

exec gosu app "$@"
