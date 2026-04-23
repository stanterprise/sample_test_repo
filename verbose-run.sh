#!/bin/bash

export STANTERPRISE_RUN_ID=$(uuidgen)
for i in 1 2 3 4; do
  STANTERPRISE_VERBOSE=true \
  STANTERPRISE_TEST_RUN_NAME="Sharded Test: $(date)" \
  STANTERPRISE_META_MARKER=test \
  npx playwright test --shard=$i/4 > sharded_test_output_$i.log 2>&1 &
done
wait