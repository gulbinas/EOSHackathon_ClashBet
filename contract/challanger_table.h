/// @abi table challange i64
struct challange{

  uint64_t challangerId;
  account_name challangerName;
  std::string hash;
  uint64_t amount;
  account_name opponentName;
  uint64_t state;
  uint64_t gameId;
  account_name challangeWinner;

  uint64_t primary_key() const { return challangerId; }

  EOSLIB_SERIALIZE(challange, (challangerId)(challangerName)(hash)(amount)(opponentName)(state)(gameId)(challangeWinner))
};
