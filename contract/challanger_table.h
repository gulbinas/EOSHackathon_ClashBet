/// @abi table challange i64
struct challange{

  uint64_t challangerId;
  checksum256 hash;
  uint64_t amount;
  account_name opponentName;
  uint64_t state;
  uint64_t gameId;
  account_name challangeWinner;

  uint64_t primary_key() const { return challangerId; }

  EOSLIB_SERIALIZE(challange, (challangerId)(hash)(amount)(opponentName)(state)(gameId)(challangeWinner))
};
