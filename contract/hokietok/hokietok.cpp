#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

// Smart Contract Name: hokietok
// Table struct:
//   tickets: multi index table to store the tickets
//     id(uint64): primary key
//     owner(name): owner of the ticket
//     seat(string): the seat name
//     date(string): the date of the event
// Public actions:
//   mktik => create new ticket and place into the multi-index table
//   mvtik => transfer ticker to another user

CONTRACT hokietok : public eosio::contract {
  private:
    TABLE ticket {
        uint64_t        id;                 //unique primary key
        name            owner;              //owner of ticket
        std::string     season;             //
        std::string     game;               //game name
        std::string     location;           //location
        std::string     date;               //date of event
        std::string     stadium_section;    //stadium section
        uint16_t        section;            //section num
        uint16_t        row;                //row num
        uint16_t        seat;               //seat num

        uint64_t primary_key() const { return id; }
        uint64_t by_owner() const { return owner.value; }
    };

    typedef eosio::multi_index< name("tickets"), ticket,
            eosio::indexed_by<
                "owner"_n, eosio::const_mem_fun<ticket, uint64_t, &ticket::by_owner>
            >
        > ticket_table;

    ticket_table tickets;

    TABLE listing {
        uint64_t    id;         //unique primary key
        uint64_t    ticket_id;  //ticket id
        uint64_t    price;      //price in HOK tokens

        uint64_t primary_key() const { return id; }
        uint64_t by_ticket() const { return ticket_id; }
    };

        typedef eosio::multi_index< name("listings"), listing,
            eosio::indexed_by<
                "ticket"_n, eosio::const_mem_fun<listing, uint64_t, &listing::by_ticket>
            >
        > listing_table;

    listing_table listings;


        TABLE auction {
        uint64_t    id;         //unique primary key
        uint64_t    ticket_id;  //ticket id
        uint64_t    price;      //price in HOK tokens
        name        highest_bidder;

        uint64_t primary_key() const { return id; }
        uint64_t by_ticket() const { return ticket_id; }
    };

        typedef eosio::multi_index< name("auction"), auction,
            eosio::indexed_by<
                "ticket"_n, eosio::const_mem_fun<auction, uint64_t, &auction::by_ticket>
            >
        > auction_table;

    auction_table auction_listings;


  public:
    using contract::contract;

    // constructor
    hokietok( name receiver, name code, datastream<const char*> ds ):
                contract( receiver, code, ds ),
                tickets( receiver, receiver.value ),
                listings( receiver, receiver.value ),
                auction_listings(receiver, receiver.value)
    {
        //TODO reconsider scope
    }

    ACTION mktik(const std::string& season, const std::string& game,
            const std::string& location, const std::string& date,
            const std::string& stadium_section, const uint16_t section,
            const uint16_t row, const uint16_t seat) {
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
                ticket.season = season;
                ticket.game = game;
                ticket.location = location;
                ticket.date = date;
                ticket.stadium_section = stadium_section;
                ticket.section = section;
                ticket.row = row;
                ticket.seat = seat;
            });
        }
    }

    ACTION mvtik(const uint64_t id, name to) {
        auto ticket_itr = tickets.find(id);
        check(ticket_itr != tickets.end(), "Ticket not found");
        const auto& ticket = *ticket_itr;
        require_auth(ticket.owner);

        tickets.modify(ticket, get_self(), [&] (auto& t) {
            t.owner = to;
        });
    }

    ACTION postlst(const uint64_t ticket_id, const uint64_t price) {
        auto ticket_itr = tickets.find(ticket_id);
        check(ticket_itr != tickets.end(), "Ticket not found");
        const auto& ticket = *ticket_itr;

        require_auth(ticket.owner);

        // alternatively, store "for sale" status in ticket
        auto ticket_index = listings.get_index<"ticket"_n>();
        check(ticket_index.find(ticket_id) == ticket_index.end(), "Ticket already for sale");

        listings.emplace(get_self(), [&](auto& listing) {
            listing.id = listings.available_primary_key();
            listing.ticket_id = ticket.id;
            listing.price = price;
        });
    }

    ACTION rmlst(const uint64_t listing_id) {
        auto lst_itr = listings.find(listing_id);
        check(lst_itr != listings.end(), "Listing not found");
        const auto& lst = *lst_itr;

        // alternatively, store owner in listing
        auto ticket_id = lst.ticket_id;
        const auto& ticket = tickets.get(ticket_id);
        require_auth(ticket.owner);

        listings.erase(lst);
    }

    ACTION buylst(name buyer, const uint64_t listing_id) {
        require_auth(buyer);
        auto lst_itr = listings.find(listing_id);
        check(lst_itr != listings.end(), "Listing not found");
        const auto& lst = *lst_itr;
        uint64_t ticket_id = lst.ticket_id;
        const auto& ticket = tickets.get(ticket_id);

        //TODO this cast is dangerous
        auto money = asset{(int64_t)lst.price, {"HOK", 0}};

        action(
            permission_level{buyer, "active"_n},
            "tokenacc"_n,
            "transfer"_n,
            std::make_tuple(buyer, ticket.owner, money, std::string("test"))

        ).send();
        tickets.modify(ticket, get_self(), [&] (auto& t) {
            t.owner = buyer;
        });
        
        listings.erase(lst);
    }


    ACTION postauctlst(const uint64_t ticket_id, const uint64_t price) {
        auto ticket_itr = tickets.find(ticket_id);
        check(ticket_itr != tickets.end(), "Ticket not found");
        const auto& ticket = *ticket_itr;

        require_auth(get_self());

        // alternatively, store "for sale" status in ticket
        auto ticket_index = auction_listings.get_index<"ticket"_n>();
        check(ticket_index.find(ticket_id) == ticket_index.end(), "Ticket already for sale");

        auction_listings.emplace(get_self(), [&](auto& auction) {
            auction.id = auction_listings.available_primary_key();
            auction.ticket_id = ticket.id;
            auction.price = price;
            auction.highest_bidder = get_self();
        });
    }

    ACTION bidlst(name bidder, const uint64_t bid, const uint64_t auction_id) {
       require_auth(bidder);
        auto lst_itr = auction_listings.find(auction_id);
        check(lst_itr != auction_listings.end(), "Listing not found");
        const auto& lst = *lst_itr;
        uint64_t ticket_id = lst.ticket_id;
        const auto& ticket = tickets.get(ticket_id);

        check(lst.price < bid, "Insuficient Bid");

        //TODO this cast is dangerous
        auto curr_bid = asset{(int64_t)lst.price, {"HOK", 0}};
        if (lst.highest_bidder != get_self()) {
        action(
            permission_level{bidder, "active"_n},
            "tokenacc"_n,
            "transfer"_n,
            std::make_tuple(get_self(), lst.highest_bidder, curr_bid, std::string("returning money from displaced bid"))
        ).send();
        }
        //TODO this cast is dangerous
        auto new_bid = asset{(int64_t)bid, {"HOK", 0}};
        action(
            permission_level{bidder, "active"_n},
            "tokenacc"_n,
            "transfer"_n,
            std::make_tuple(bidder, get_self(), new_bid, std::string("place new bid"))

        ).send();
        
        auction_listings.modify(lst, get_self(), [&](auto& t) {
            t.price = bid;
            t.highest_bidder = bidder;
        });
    }


     ACTION closeauclst(const uint64_t listing_id) {
        require_auth(get_self());
        auto lst_itr = auction_listings.find(listing_id);
        check(lst_itr != auction_listings.end(), "Listing not found");
        const auto& lst = *lst_itr;
        uint64_t ticket_id = lst.ticket_id;
        const auto& ticket = tickets.get(ticket_id);

        tickets.modify(ticket, get_self(), [&] (auto& t) {
            t.owner = lst.highest_bidder;
        });
        
        
        auction_listings.erase(lst);
    }

};
