#include "./clashbet.hpp"

using namespace eosio;

void clashbet::createchall(account_name player, uint64_t amount, checksum256 challangeHash){ //FFR discuss hashing

    challangeIndex challangeInit(_self,_self);

    challangeInit.emplace(_self,[&](auto &adder){
      adder.challangerId = player;
      adder.hash = challangeHash;
      adder.amount = amount;
      adder.state = 10;
      adder.gameId = 1;
    });

};

EOSIO_ABI( clashbet, (createchall))
