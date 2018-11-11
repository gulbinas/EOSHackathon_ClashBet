#include "./clashbet.hpp"

using namespace eosio;

ACTION clashbet::createchall(name player, uint64_t amount, std::string challangeHash){ //FFR discuss hashing

    _challangeIndex.emplace(_self,[&](auto &adder){ //TODO add primary key and etc
      adder.key = _challangeIndex.available_primary_key();
      adder.hash = challangeHash; // name(challangeHash);
      adder.challangerName = player;
      adder.amount = amount;
      adder.state = 10;
      adder.gameId = 1;
    });
};

ACTION clashbet::acceptchal(name player, std::string challangeHash){

  // challangeIndex challangeAccept(_self,_self.value);
  //
  // const cha * c = challangeHash.c_str();
  //
  // auto hashInNumber = eosio::string_to_name(c);

  // auto itr = _challangeIndex.find(challangeHash);
  auto itr = _challangeIndex.find(1);

  _challangeIndex.modify(itr,_self,[&](auto change){

    change.state = 20;
    change.opponentName = player;

  });

};

ACTION clashbet::claimprize(name player, std::string challangeHash){

  // challangeIndex challangeAccept(_self,_self.value);

  // const char * c = challangeHash.c_str();

  // auto hashInNumber = eosio::string_to_name(c);

  auto itr = _challangeIndex.find(1);

  _challangeIndex.modify(itr,_self,[&](auto change){

    change.state += 5;
    change.challangeWinner = player;

  });

};

ACTION clashbet::acceptloss(name player, std::string challangeHash){

  // challangeIndex challangeAccept(_self,_self.value);
  //
  // const char * c = challangeHash.c_str();
  //
  // auto hashInNumber = eosio::string_to_name(c);

  auto itr = _challangeIndex.find(1);

  _challangeIndex.modify(itr,_self,[&](auto change){

      change.state += 5;

  });

};

ACTION clashbet::stake(name from, name to, eosio::asset quantity, std::string memo){ //Endpoint for staking

  if(to != _self || from == _self) return;

};

extern "C" {
  void apply(uint64_t receiver, uint64_t code, uint64_t action) {
    clashbet _clashbet(receiver);
    if(code==receiver && action== name("createchall").value) {
      execute_action(name(receiver), name(code), &clashbet::createchall );
    }
    else if(code==name("eosio.token").value && action== name("transfer").value) {
      execute_action(name(receiver), name(code), &clashbet::stake );
    }
    else if(code==receiver && action== name("acceptchal").value) {
      execute_action(name(receiver), name(code), &clashbet::acceptchal );
    }
    else if(code==receiver && action== name("claimprize").value) {
      execute_action(name(receiver), name(code), &clashbet::claimprize );
    }
    else if(code==receiver && action== name("acceptloss").value) {
      execute_action(name(receiver), name(code), &clashbet::acceptloss );
    }
  }
};
