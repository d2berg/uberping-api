const db = require('./db/db');

const initialUncertainty = 350
const uncertaintyIncreaseByTime = 0.03

const g = (RD) => {
  q = Math.log(10)/400
  return 1/Math.sqrt(1 + (3* Math.pow(q, 2) * Math.pow(RD, 2)) / Math.pow(Math.PI,2))
}

const calculate = (w, l,  match) => {
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
      calculate(homeUser, awayUser, match);
    }else {
      calculate(awayUser, homeUser, match);
    }
    await homeUser.save();
    await awayUser.save();
    resolve({homeUser, awayUser});
  });

}

module.exports = {
  update
};
