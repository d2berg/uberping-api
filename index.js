const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db/db');
const rating = require('./rating');

const port =  process.env.PORT || 3000;

app.use(bodyParser.json());

app
  .get('/', (req, res) => res.send('Hello World!'))
  .get('/users', async (req, res) => res.send(await db.User.find()))
  .post('/users/:name', async (req, res) => res.send(await new db.User({name: req.params.name}).save()))
  .delete('/users/:id', async (req, res) => res.send(await db.User.deleteOne({_id: req.params['id']})))
  .get('/matches', async (req, res) => res.send(await db.Match.find()))
  .delete('/matches/:id', async (req, res) => res.send(await db.Match.deleteOne({_id: req.params['id']})))
  .post('/matches', async (req, res) => {
    const match = req.body;
    if(!match.timestamp){
      match.timestamp = new Date();
    }
    await new db.Match(match)
      .save()
      .catch(err => res.send(err));
      
    const result = await rating.update(match);

    res.send(result);
  });

app.listen(port, () => console.log(`api listening on port ${port}!`));
