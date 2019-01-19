var express = require('express');
var router = express.Router();
const db = require('./db/db');
const rating = require('./rating');

router
  .get('/', (req, res) => res.send('Hello World!'))
  .get('/users', async (req, res) => res.send(await db.User.find().sort({rating: -1})))
  .post('/users/:name', async (req, res) => res.send(await new db.User({name: req.params.name}).save()))
  .delete('/users/:id', async (req, res) =>
    res.send(req.params['id'] === 'all' ? 
    await db.User.deleteMany() : 
    await db.User.deleteOne({_id: req.params['id']})))
  .get('/updateRating', async (req, res) => res.send(await rating.calculate()))
  .get('/reset', async (req, res) => 
    {
      await db.User.deleteMany();
      await db.Match.deleteMany();
      await convertOld();
      res.send(await rating.calculate());
    })
  .get('/matches', async (req, res) => res.send(await db.Match.find()))
  .delete('/matches/:id', async (req, res) => 
    res.send(req.params['id'] === 'all' ? 
    await db.Match.deleteMany() : 
    await db.Match.deleteOne({_id: req.params['id']})))
  .post('/matches', async (req, res) => {
    const match = req.body;
    if(!match.timestamp){
      match.timestamp = new Date();
    }
    const result = await new db.Match(match)
      .save()
      .catch(err => res.send(err));
    res.send(result);
  });


  const convertOld = async () => {
    const oldMatches = require('./old-matches');
    const users = {};
  
    oldMatches.msg.forEach(match => {
      const winner = match.winner;
      const loser = match.loser;
      if(!users[winner]) users[winner] = winner;
      if(!users[loser]) users[loser] = loser;
    });
  
    const convertOldMatchToNew = async (oldMatch) => {
      const home = await db.User.findOne({name: oldMatch.winner});
      const away = await db.User.findOne({name: oldMatch.loser});
      const homeScore = oldMatch.winnerscore;
      const awayScore = oldMatch.loserscore;
      const timestamp = new Date(Number(oldMatch.timestamp));
      return await new db.Match({timestamp, homeId: home.id, awayId: away.id, homeScore, awayScore}).save();
    };
  
    const userArr = Object.keys(users);
    let tasks = userArr.map(u => new db.User({name:u}).save());
    await Promise.all(tasks);
    console.log("added users!");
  
    tasks = oldMatches.msg.map(m => convertOldMatchToNew(m));
    await Promise.all(tasks);
    console.log("added matches!");
  };

  module.exports = router;
