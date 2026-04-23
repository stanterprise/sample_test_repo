#!/bin/sh
export STANTERPRISE_RUN_ID=$(uuidgen);
for i in {1..4}; do
    export STANTERPRISE_TEST_RUN_NAME="Sharded Test: $(date)"; export STANTERPRISE_META_MARKER=test; npx playwright test --shard=$i/4 > sharded_test_output_$i.log &
done
wait
