#!/usr/bin/env bash

echo "=== setup blockchain accounts and smart contract ==="
scripts/create_system_accounts.sh

echo "=== deploy eosio.token ==="
scripts/deploy_token.sh eosio.token tokenacc hokietokwal $(cat hokietok_wallet_password.txt)

echo "=== deploy smart contract ==="
# $1 smart contract name
# $2 account holder name of the smart contract
# $3 wallet for unlock the account
# $4 password for unlocking the wallet
scripts/deploy_contract.sh hokietok hokietokacc hokietokwal $(cat hokietok_wallet_password.txt)

echo "=== create user accounts ==="
# script for create data into blockchain
scripts/create_user_accounts.sh
