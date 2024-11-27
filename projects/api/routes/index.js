const express = require('express');
const dbCompareController = require('../controllers/db-compare.contollers')
const settingsController = require('../controllers/setting.controller')

const Router = express.Router()

Router.get('/', (req, res) => {
    res.send("hello, express app");
})

Router.get('/test', dbCompareController.testExample)
Router.get('/source-data', dbCompareController.getSourceDBData)
Router.get('/dest-data', dbCompareController.getDestDBData)
Router.post('/update-dest-data', dbCompareController.updateDestData)
Router.post('/update-source-data', dbCompareController.updateSrcData)

Router.get('/db-settings/test/:type', settingsController.testConnection)
Router.get('/db-settings/:type', settingsController.getDBSettings)
Router.post('/db-settings/:type', settingsController.setDBSettings)

module.exports = Router;