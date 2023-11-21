const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();
const Config = require('./config')

const app = express();

// Define routes and middleware here
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', require('./routes'));

app.get('*', (req, res) => {
  res.sendFile()
})

global.sourceDBConfig = Config.sourceDBConfig;
global.destDBConfig = Config.destDBConfig;

global.dbConnectionPools = new Map()

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});