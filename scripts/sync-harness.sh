#!/usr/bin/env bash
# Sync .claude/ with the private harness repo (cloudcost-team/CLOUD-HARNESS).
#   ./scripts/sync-harness.sh status            # what differs
#   ./scripts/sync-harness.sh pull [--force]    # harness → .claude
#   ./scripts/sync-harness.sh push [-m "msg"] [--shared]
#                                               # .claude → harness (new files go to fe/, or shared/ with --shared)
# Harness clone location: $CLOUD_HARNESS_DIR, default ../CLOUD-HARNESS
set -euo pipefail
TARGET=fe
REPO_URL="${CLOUD_HARNESS_REPO:-https://github.com/cloudcost-team/CLOUD-HARNESS.git}"
ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
HARNESS_DIR="${CLOUD_HARNESS_DIR:-$ROOT/../CLOUD-HARNESS}"

if [ ! -d "$HARNESS_DIR/.git" ]; then
  git clone -q "$REPO_URL" "$HARNESS_DIR"
else
  git -C "$HARNESS_DIR" pull -q --ff-only
fi
exec "$HARNESS_DIR/sync.sh" "$TARGET" "${1:-status}" "$ROOT" "${@:2}"
