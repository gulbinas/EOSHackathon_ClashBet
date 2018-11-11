#include <eosiolib/eosio.hpp>
#include "challanger_table.h"
#include "typedefs.h"


using namespace eosio;

class clashbet : public eosio::contract {
  public:
      using contract::contract;

      //@abi action
      void createchall(account_name player, uint64_t amount);
};