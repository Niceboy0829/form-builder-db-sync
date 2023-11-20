const express = require('express');
const dbCompareController = require('../controllers/db-compare.contollers')
const Router = express.Router()

Router.get('/', (req, res) => {
    res.send("hello, express app");
})

Router.get('/test', dbCompareController.testExample)
Router.get('/source-data', dbCompareController.getSourceDBData)
Router.get('/dest-data', dbCompareController.getDestDBData)
Router.post('/update-dest-data', dbCompareController.updateDestData)

module.exports = Router;