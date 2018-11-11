#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT clashbet : public eosio::contract {
  public:
      using contract::contract;

      TABLE challange{

        uint64_t key;
        name challangerName;
        std::string hash;
        uint64_t amount;
        name opponentName;
        uint64_t state;
        uint64_t gameId;
        name challangeWinner;

        uint64_t primary_key() const { return key; }

      };

      typedef eosio::multi_index<name("challange"), challange> challangeIndex;
      challangeIndex _challangeIndex;

      clashbet( name self, name code, datastream<const char*> ds ):
                 contract( self, code, ds ),
                 _challangeIndex( self, self.value ) {}

      ACTION createchall(name player, uint64_t amount, std::string challangeHash);

      ACTION claimprize(name player, std::string challangeHash);

      ACTION acceptloss(name player, std::string challangeHash);

      ACTION acceptchal(name player, std::string challangeHash);

      ACTION stake(name from, name to, eosio::asset quantity, std::string memo);

};
