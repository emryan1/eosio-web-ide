#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

using namespace eosio;

// Smart Contract Name: notechain
// Table struct:
//   hokietok: multi index table to store the notes
//     id(uint64): primary key
//     owner(name): account name for the user
//     seat(string): the note message
//     date(string): the store the last update block time
// Public actions:
//   mktik => create new ticket and place into the multi-index table
//   mvtik => transfer ticker to another user

// Replace the contract class name when you start your own project
CONTRACT hokietok : public eosio::contract {
  private:
    // bool isnewuser( name user ) {
    //   // get notes by using secordary key
    //   auto note_index = _notes.get_index<name("getbyuser")>();
    //   auto note_iterator = note_index.find(user.value);

    //   return note_iterator == note_index.end();
    // }

    TABLE ticket {
        uint64_t        id;       //unique primary key
        name            owner;          //owner of ticket
        std::string     seat;           //seat id
        std::string     date;

        auto primary_key() const { return id; }
    };

    // TABLE notestruct {
    //   uint64_t         prim_key;  // primary key
    //   name             user;      // account name for the user
    //   std::string      note;      // the note message
    //   block_timestamp  timestamp; // the store the last update block time

    //   // primary key
    //   auto primary_key() const { return prim_key; }
    //   // secondary key
    //   // only supports uint64_t, uint128_t, uint256_t, double or long double
    //   uint64_t get_by_user() const { return user.value; }
    // };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< name("tickets"), ticket> ticket_table;

    ticket_table tickets;

  public:
    using contract::contract;

    // constructor
    hokietok( name receiver, name code, datastream<const char*> ds ):
                contract( receiver, code, ds ),
                tickets( receiver, receiver.value ) {
        //TODO reconsider scope            
    }

    ACTION mktik(const std::string& seat, const std::string& date) {
        require_auth(get_self());
        if( /* ticket for that seat/date already exists */ false)
        {
            //throw error
        }
        else
        {
            tickets.emplace(get_self(), [&](auto& ticket) {
                ticket.id = tickets.available_primary_key();
                ticket.owner = get_self();
                ticket.seat = seat;
                ticket.date = date;
            });
        }
    }

    ACTION mvtik(uint64_t id, name to) {
        auto ticket_itr = tickets.find(id);
        check(ticket_itr != tickets.end(), "Ticket not found");
        const auto& ticket = *ticket_itr;
        require_auth(ticket.owner);

        tickets.modify(ticket, get_self(), [&] (auto& t) {
            t.owner = to;
        });
    }
};

// specify the contract name, and export a public action: update
EOSIO_DISPATCH( hokietok, (mktik)(mvtik) )
