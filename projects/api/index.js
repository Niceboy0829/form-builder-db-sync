const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();


// Define routes and middleware here
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', require('./routes'));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});