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

void clashbet::acceptchal(account_name player, std::string challangeHash){

  challangeIndex challangeAccept(_self,_self);

  const char * c = challangeHash.c_str();

  auto hashInNumber = eosio::string_to_name(c);

  auto itr = challangeAccept.find(hashInNumber);

  challangeAccept.modify(itr,_self,[&](auto change){

    change.state = 20;
    change.opponentName = player;

  });

};

void clashbet::claimprize(account_name player, std::string challangeHash){

  challangeIndex challangeAccept(_self,_self);

  const char * c = challangeHash.c_str();

  auto hashInNumber = eosio::string_to_name(c);

  auto itr = challangeAccept.find(hashInNumber);

  challangeAccept.modify(itr,_self,[&](auto change){

    change.state += 5;
    change.challangeWinner = player;

  });

};

void clashbet::acceptloss(account_name player, std::string challangeHash){

  challangeIndex challangeAccept(_self,_self);

  const char * c = challangeHash.c_str();

  auto hashInNumber = eosio::string_to_name(c);

  auto itr = challangeAccept.find(hashInNumber);

  challangeAccept.modify(itr,_self,[&](auto change){

      change.state += 5;
    
  });

};


EOSIO_ABI( clashbet, (createchall)(acceptchal)(claimprize)(acceptloss))
