#include "./clashbet.hpp"

using namespace eosio;

void clashbet::createchall(account_name player, uint64_t amount, std::string challangeHash){ //FFR discuss hashing

    challangeIndex challangeInit(_self,_self);

    const char * c = challangeHash.c_str();

    auto hashInNumber = eosio::string_to_name(c);

    challangeInit.emplace(_self,[&](auto &adder){ //TODO add primary key and etc
      adder.challangerId = hashInNumber;
      adder.challangerName = player;
      adder.hash = challangeHash;
      adder.amount = amount;
      adder.state = 10;
      adder.gameId = 1;
    });

};


void clashbet::claimprize(account_name player, std::string challangeHash){

};

void clashbet::acceptloss(account_name player, std::string challangeHash){

};


EOSIO_ABI( clashbet, (createchall)(claimprize)(acceptloss))
