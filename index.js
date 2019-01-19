const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api = require('./api');


const port =  process.env.PORT || 3000;
app.use(express.static('static'))
app.use(bodyParser.json());
app.use('/api', api)

app.listen(port, () => console.log(`api listening on port ${port}!`));
