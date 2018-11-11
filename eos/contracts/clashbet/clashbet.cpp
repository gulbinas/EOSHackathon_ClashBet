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

  for ( auto itr = _challangeIndex.begin(); itr != _challangeIndex.end(); itr++ ) {
     if(challangeHash == itr->hash) {

          _challangeIndex.modify(itr, _self, [&](auto& change){
            change.state = 20;
            change.opponentName = player;
          });

         break;
      }
  }

};

ACTION clashbet::claimprize(name player, std::string challangeHash){

  uint64_t amountWon;
  uint64_t state;

  for ( auto itr = _challangeIndex.begin(); itr != _challangeIndex.end(); itr++ ) {
     if(challangeHash == itr->hash) {

          _challangeIndex.modify(itr, _self, [&](auto& change){
            change.state += 5;
            change.challangeWinner = player;
            amountWon = change.amount;
            state = change.state;
          });

         break;
      }
  }

  if(state == 30){

    action(permission_level{ _self , "active"_n },
            "eosio.token"_n, "transfer"_n,
            std::make_tuple(_self, player, asset(amountWon,symbol("EOS",4)), std::string(""))
     ).send();
  }

};

ACTION clashbet::acceptloss(name player, std::string challangeHash){

  uint64_t state;
  uint64_t amountWon;

  for ( auto itr = _challangeIndex.begin(); itr != _challangeIndex.end(); itr++ ) {
     if(challangeHash == itr->hash) {

          _challangeIndex.modify(itr, _self, [&](auto& change){
            change.state += 5;
            state = change.state;
            amountWon = change.amount;
          });

         break;
      }
  }

if(state == 30){
  action(permission_level{ _self , "active"_n },
          "eosio.token"_n, "transfer"_n,
          std::make_tuple(_self, player, asset(amountWon,symbol("EOS",4)), std::string(""))
   ).send();
};

};

ACTION clashbet::stake(name from, name to, eosio::asset quantity, std::string memo){ //Endpoint for staking

  if(to != _self || from == _self) return;

};

ACTION clashbet::cancelchall(name player, std::string challangeHash){

  for ( auto itr = _challangeIndex.begin(); itr != _challangeIndex.end(); itr++ ) {
     if(challangeHash == itr->hash) {

          _challangeIndex.erase(itr);

         break;
      }
  }

}

extern "C" {
  void apply(uint64_t receiver, uint64_t code, uint64_t action) {
    // clashbet _clashbet(receiver);
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
