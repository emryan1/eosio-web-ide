#!/usr/bin/env bash
set -o errexit

CONTRACTSPATH="$( pwd -P )/eosio.contracts"

# make new directory for compiled contract files
mkdir -p ./compiled_contracts/$1

COMPILEDCONTRACTSPATH="$( pwd -P )/compiled_contracts"

# unlock the wallet, ignore error if already unlocked
if [ ! -z $3 ]; then cleos wallet unlock -n $3 --password $4 || true; fi

# compile smart contract to wasm and abi files using EOSIO.CDT (Contract Development Toolkit)
# https://github.com/EOSIO/eosio.cdt
pushd $CONTRACTSPATH/contracts/eosio.token
eosio-cpp -I include -o "$COMPILEDCONTRACTSPATH/$1/$1.wasm" src/eosio.token.cpp --abigen --contract "$1"
popd

# set (deploy) compiled contract to blockchain
cleos set contract $2 "$COMPILEDCONTRACTSPATH/$1/" --permission $2

cleos push action tokenacc create '[ "hokietokacc", "1000000000 HOK"]' -p tokenacc@active
cleos push action tokenacc issue '["hokietokacc", "10000000 HOK", "initial tokens"]' -p hokietokacc
