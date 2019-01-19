
const glicko2 = require('glicko2');
const settings = {
  // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
  //       be tested to decide which value results in greatest predictive accuracy."
  tau : 0.5,
  // rating : default rating
  rating : 1500,
  //rd : Default rating deviation
  //     small number = good confidence on the rating accuracy
  rd : 200,
  //vol : Default volatility (expected fluctation on the player rating)
  vol : 0.06
};
const ranking = new glicko2.Glicko2(settings);
const db = require('./db/db');
const initialUncertainty = 350
const uncertaintyIncreaseByTime = 0.03

const g = (RD) => {
  q = Math.log(10)/400
  return 1/Math.sqrt(1 + (3* Math.pow(q, 2) * Math.pow(RD, 2)) / Math.pow(Math.PI,2))
}

const calculateOld = (w, l,  match) => {
  // constants:
  q = Math.log(10)/400
  q_squared = Math.pow(q, 2)

  // initial calculations for the winner
  const winDt = match.timestamp - w.lastGame;
  const newWinUncertainty = 
    Math.min(Math.sqrt(Math.pow(w.uncertainty, 2) + 
    Math.pow(uncertaintyIncreaseByTime, 2) * winDt ), initialUncertainty);

  // initial calculations for the loser
  const loseDt = match.timestamp - l.lastGame;
  const newLoseUncertainty =  
    Math.min(Math.sqrt(Math.pow(l.uncertainty, 2) + 
    Math.pow(uncertaintyIncreaseByTime, 2) * loseDt ), initialUncertainty);

  // determining new rating for the w
  const winExpected = 1/(1 + Math.pow(10, - g(newLoseUncertainty) * (w.rating - l.rating)/ 400))
  const winDSquared = 1/(q_squared * Math.pow(g(newLoseUncertainty), 2) * winExpected * (1 - winExpected))
  const winDiff = q/(1/Math.pow(newWinUncertainty, 2) + 1/winDSquared) * g(newLoseUncertainty) * (1 - winExpected)

  // determining new rating for the l
  const loseExpected  = 1/(1 + Math.pow(10, - g(newWinUncertainty) * (l.rating - w.rating)/ 400))
  const loseDSquared = 1/(q_squared * Math.pow(g(newWinUncertainty), 2) * loseExpected * (1 - loseExpected))
  const loseDiff = q/(1/Math.pow(newLoseUncertainty, 2) + 1/loseDSquared) * g(newWinUncertainty) * (0 - loseExpected)

  w.rating += winDiff
  l.rating += loseDiff

  // determining new uncertainties
  w.uncertainty = Math.sqrt(1/( 1/Math.pow(newWinUncertainty, 2) + 1/winDSquared))
  l.uncertainty = Math.sqrt(1/( 1/Math.pow(newLoseUncertainty, 2) + 1/loseDSquared))
  w.lastGame = match.timestamp;
  l.lastGame = match.timestamp;
};

const update = (match) => {
  return new Promise(async (resolve, reject) => {
    const homeUser = await db.User.findById(match.homeId);
    const awayUser = await db.User.findById(match.awayId);
    if(match.homeScore > match.awayScore){
      calculateOld(homeUser, awayUser, match);
    }else {
      calculateOld(awayUser, homeUser, match);
    }
    await homeUser.save();
    await awayUser.save();
    resolve({homeUser, awayUser});
  });

}

const calculate = async () => {
  const matches = await db.Match.find({rated: {$in: [null, false]}}).sort({timestamp: 1});
  const users = await db.User.find();
  const extendedUsers = users.map(user => {
    const player = ranking.makePlayer(user.rating, user.rd, user.vol);
    return {
      dbUser: user,
      player
    };
  });
  const rankMatches = [];
  matches.forEach(match => {
    const home = extendedUsers.find(user => user.dbUser.id === match.homeId.toString());
    const away = extendedUsers.find(user => user.dbUser.id === match.awayId.toString());
    if(match.homeScore > match.awayScore){
      rankMatches.push([home.player, away.player, 1]);
      home.dbUser.streak >= 0 ? home.dbUser.streak++ : home.dbUser.streak = 1;
      home.dbUser.wins++;
      away.dbUser.streak >= 0 ? away.dbUser.streak = -1 : away.dbUser.streak--;
      away.dbUser.losses++;
    }else if (match.homeScore < match.awayScore){
      rankMatches.push([home.player, away.player, 0]);
      away.dbUser.streak >= 0 ? away.dbUser.streak++ : away.dbUser.streak = 1;
      away.dbUser.wins++;
      home.dbUser.streak >= 0 ? home.dbUser.streak = -1 : home.dbUser.streak--;
      home.dbUser.losses++;
    }else {
      rankMatches.push([home.player, away.player, 0.5]);
    }
    match.rated = true;
  });
  ranking.updateRatings(rankMatches);
  const tasks = []
  extendedUsers.forEach(user => {
    user.dbUser.rating = user.player.getRating();
    user.dbUser.rd = user.player.getRd();
    user.dbUser.vol = user.player.getVol();
    user.dbUser.ratingTimestamp = new Date();
    user.dbUser.ratingHistory.push({
      rating: user.dbUser.rating,
      rd: user.dbUser.rd,
      vol: user.dbUser.vol,
      timestamp: user.dbUser.ratingTimestamp
    });
    tasks.push(user.dbUser.save());
  });
  matches.forEach(match => tasks.push(match.save()));
  return Promise.all(tasks);
}

module.exports = {
  update,
  calculate,
};
