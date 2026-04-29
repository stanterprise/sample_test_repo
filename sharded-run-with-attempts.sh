#!/usr/bin/env bash

set -euo pipefail

export STANTERPRISE_RUN_ID="${STANTERPRISE_RUN_ID:-$(uuidgen)}"
playwright_args=(test "$@")

for i in 1 2 3 4; do
    STANTERPRISE_TEST_RUN_NAME="${STANTERPRISE_TEST_RUN_NAME:-Sharded Test: $(date)}" \
    STANTERPRISE_META_MARKER="${STANTERPRISE_META_MARKER:-test}" \
    npx playwright "${playwright_args[@]}" --shard="$i/4" > "sharded_test_output_${i}.log" 2>&1 &
done

for i in 1 2 3 4; do
    STANTERPRISE_TEST_RUN_NAME="${STANTERPRISE_TEST_RUN_NAME:-Sharded Test: $(date)}" \
    STANTERPRISE_META_MARKER="${STANTERPRISE_META_MARKER:-test}" \
    npx playwright "${playwright_args[@]}" --shard="$i/4" > "sharded_test_output_${i}.log" 2>&1 &
done

wait
