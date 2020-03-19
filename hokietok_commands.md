## Example commands for interacting with hokietok

Test user accounts are listed in scripts/accounts.json

Creates a new ticket for seat A5 on 2019-05-27
```console
gitpod /workspace/eosio-web-ide $ cleos push action hokietokacc mktik "[\"A5\", \"2019-05-27\"]" -p hokietokacc
```

See all tickets
```console
gitpod /workspace/eosio-web-ide $ cleos get table hokietokacc hokietokacc tickets
```

Move ticket with ID to recipient, with permission from ticketholder
```console
gitpod /workspace/eosio-web-ide $ cleos push action hokietokacc mvtik "[0, \"recipient\"]" -p ticketholder
```