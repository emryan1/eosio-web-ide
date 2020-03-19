#!/usr/bin/env bash

echo "=== start of first time setup ==="

# change to script's directory
cd "$(dirname "$0")"
SCRIPTPATH="$( pwd -P )"

echo "=== clone system contracts ==="
git clone https://github.com/EOSIO/eosio.contracts --branch v1.7.0 --single-branch

echo "=== setup hokietok ==="
scripts/init_blockchain.sh