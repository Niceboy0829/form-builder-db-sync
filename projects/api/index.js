const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

require('dotenv').config();
const Config = require('./config/config.json')

const app = express();

// Define routes and middleware here
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

global.sourceDBConfig = Config.sourceDBConfig;
global.destDBConfig = Config.destDBConfig;

global.dbConnectionPools = new Map()

const port = process.env.API_PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});