## Example commands for interacting with hokietok

Test user accounts are listed in scripts/accounts.json

Creates a new ticket
```console
gitpod:/workspace/eosio-web-ide$ cleos push action hokietokacc mktik "[\"season\", \"game\", \"location\", \"date\", \"stadium_section\", section_num, row_num, seat]" -p hokietokacc
...
```

See all tickets
```console
gitpod:/workspace/eosio-web-ide$ cleos get table hokietokacc hokietokacc tickets
{
  "rows": [{
      "id": 0,
      "owner": "hokietokacc",
      "season": "season",
      "game": "game",
      "location": "location",
      "date": "date",
      "stadium_section": "stadium_section",
      "section": 2,
      "row": 3,
      "seat": 5
    }
  ],
  "more": false,
  "next_key": ""
}
```

Move ticket with ID to recipient, with permission from ticketholder
```console
gitpod:/workspace/eosio-web-ide$ cleos push action hokietokacc mvtik "[ticket_id, \"recipient\"]" -p ticketholder
...
```

Post a listing
```
gitpod:/workspace/eosio-web-ide$ cleos push action hokietokacc postlst '[ticket_id, price]' -p hokietokacc
executed transaction: ... 
#   hokietokacc <= hokietokacc::postlst         {"ticket_id":ticket_id,"price":price}
```

Buy a listing
```console
gitpod:/workspace/eosio-web-ide$ cleos push action hokietokacc buylst '["buyer_name", listing_id]' -p buyer_name
executed transaction: ... 
#   hokietokacc <= hokietokacc::buylst          {"buyer":"buyer_name","listing_id":listing_id}
#      tokenacc <= tokenacc::transfer           {"from":"buyer_name","to":"hokietokacc","quantity":"10 HOK","memo":"test"}
#  buyer_name <= tokenacc::transfer           {"from":"buyer_name","to":"hokietokacc","quantity":"10 HOK","memo":"test"}
#   hokietokacc <= tokenacc::transfer           {"from":"buyer_name","to":"hokietokacc","quantity":"10 HOK","memo":"test"}
```
