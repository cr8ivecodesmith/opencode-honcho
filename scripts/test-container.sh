#!/usr/bin/env bash
# Run the test suite in an isolated podman container.
#
# The container sees none of the host environment: no HONCHO_* vars, no
# ~/.honcho, no live network. This is the only sanctioned way to run tests.
#
# Usage:
#   scripts/test-container.sh                    # full suite (build + all tests)
#   scripts/test-container.sh <path> [path...]   # specific test files
set -euo pipefail

cd "$(dirname "$0")/.."

image="ochondev-test:local"

if [ "$#" -gt 0 ]; then
  test_paths=("$@")
else
  test_paths=(./tests)
fi

podman build -q -t "$image" .

exec podman run --rm \
  --network none \
  -e HOME=/tmp/honcho-test-home \
  -v "$PWD":/workspace \
  -w /workspace \
  "$image" \
  sh -c 'bun run build && bun test "$@"' sh "${test_paths[@]}"
