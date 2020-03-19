#!/usr/bin/env bash
set -o errexit

echo "=== setup wallet: eosiomain ==="
# First key import is for eosio system account
cleos wallet create -n eosiomain --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > eosiomain_wallet_password.txt
cleos wallet import -n eosiomain --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

echo "=== setup wallet: hokietokwal ==="
# key for eosio account and export the generated password to a file for unlocking wallet later
cleos wallet create -n hokietokwal --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > hokietok_wallet_password.txt
# Owner key for hokietokwal wallet
cleos wallet import -n hokietokwal --private-key 5JpWT4ehouB2FF9aCfdfnZ5AwbQbTtHBAwebRXt94FmjyhXwL4K
# Active key for hokietokwal wallet
cleos wallet import -n hokietokwal --private-key 5JD9AGTuTeD5BXZwGQ5AtwBqHK21aHmYnTetHgk1B3pjj7krT8N

# create account for hokietokacc with above wallet's public keys
cleos create account eosio hokietokacc EOS6PUh9rs7eddJNzqgqDx1QrspSHLRxLMcRdwHZZRL4tpbtvia5B EOS8BCgapgYA2L4LJfCzekzeSr3rzgSTUXRXwNi8bNRoz31D14en9
# use the same keys for tokenacc
cleos create account eosio tokenacc EOS6PUh9rs7eddJNzqgqDx1QrspSHLRxLMcRdwHZZRL4tpbtvia5B EOS8BCgapgYA2L4LJfCzekzeSr3rzgSTUXRXwNi8bNRoz31D14en9
