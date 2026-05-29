#!/usr/bin/env bash

set -euo pipefail
export STANTERPRISE_GRPC_HOST=localhost
export STANTERPRISE_GRPC_TLS=false
export STANTERPRISE_TEST_RUN_NAME="${STANTERPRISE_TEST_RUN_NAME:-Unsharded Test: $(date)}"
export STANTERPRISE_META_MARKER="${STANTERPRISE_META_MARKER:-test}"

npx playwright test "$@" > unsharded_test_output.log