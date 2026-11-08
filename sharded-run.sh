#!/usr/bin/env bash

set -euo pipefail

export STANTERPRISE_RUN_ID="${STANTERPRISE_RUN_ID:-$(uuidgen)}"
export STANTERPRISE_INGESTION_AUTH_KEY="test-test-test-test-test-test-test"
playwright_args=(test "$@")

for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
    STANTERPRISE_GRPC_HOST=localhost \
    STANTERPRISE_GRPC_TLS=false \
    STANTERPRISE_TEST_RUN_NAME="${STANTERPRISE_TEST_RUN_NAME:-Sharded Test: $(date)}" \
    STANTERPRISE_META_MARKER="${STANTERPRISE_META_MARKER:-test}" \
    npx playwright "${playwright_args[@]}" --shard="$i/12" > "sharded_test_output_${i}.log" 2>&1 &
done

wait
