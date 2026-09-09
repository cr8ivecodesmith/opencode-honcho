#!/usr/bin/env bash
# Run the build and test suite in an isolated podman container.
#
# The container sees none of the host environment: no HONCHO_* vars, no
# ~/.honcho, no live network. This is the only sanctioned way to build or
# test. Environment simulations (e.g. ambient HONCHO_* vars) are done by
# passing vars explicitly with -e, never by running on the host.
#
# Usage:
#   scripts/test-container.sh                    # full suite (build + all tests)
#   scripts/test-container.sh <path> [path...]   # specific test files
#   scripts/test-container.sh -e KEY=VALUE ...   # extra env vars (simulations)
set -euo pipefail

cd "$(dirname "$0")/.."

image="ochondev-test:local"

envs=()
test_paths=()
while [ $# -gt 0 ]; do
  case "$1" in
    -e|--env)
      envs+=(-e "$2"); shift 2 ;;
    *)
      test_paths+=("$1"); shift ;;
  esac
done
[ ${#test_paths[@]} -eq 0 ] && test_paths=(./tests)

podman build -q -t "$image" .

exec podman run --rm \
  --network none \
  -e HOME=/tmp/honcho-test-home \
  ${envs[@]+"${envs[@]}"} \
  -v "$PWD":/workspace \
  -w /workspace \
  "$image" \
  sh -c 'bun run build && bun test "$@"' sh "${test_paths[@]}"
