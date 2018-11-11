const _ = require('lodash');
const sha256 = require('js-sha256').sha256;
const { getBattles } = require('./api.js');

const player1HasWon = async (player1Tag, player2Tag) => {
  const battles = await getBattles(player1Tag);
  const challangeBattle = _(battles)
    .map(battle => {
      const formattedBattle = battle;
      formattedBattle.hash = sha256(JSON.stringify(battle));
      formattedBattle.opponent = _.first(battle.opponent);
      return formattedBattle
    })
    .find(battle => {
      return _.get(battle, 'opponent.tag') === player2Tag;
    });

  if (!challangeBattle) {
    return;
  }

  if (challangeBattle.winner === 0) {
    return 0;
  }

  return challangeBattle.winner > 0 ? 1 : -1;
};

module.exports = {
  player1HasWon,
};
