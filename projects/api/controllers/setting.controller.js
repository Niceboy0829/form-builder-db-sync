const { closeAll, get } = require("../db-pool")

const getDBSettings = (req, res) => {
    const { type } = req.params;

    if(type === 'source') {
        res.send(sourceDBConfig)
    } else if(type === 'dest') {
        res.send(destDBConfig)
    } else {
        res.status(400).send({
            message: 'invalid type'
        })
    }
}

const setDBSettings = async (req, res) => {
    const { type } = req.params;

    if(type === 'source') {
        global.sourceDBConfig = req.body
        await closeAll();
        res.send({
            success: true
        })
    } else if(type === 'dest') {
        global.destDBConfig = req.body
        await closeAll('dest')
        res.send({
            success: true
        })
    } else {
        res.status(400).send({
            message: 'invalid type'
        })
    }
}

const testConnection = async (req, res) => {
    const { type } = req.params;
    try {
        if(type === 'source') {
            // const pool = await get(type, sourceDBConfig)
            res.send({
                success: true
            })
        } else if(type === 'dest') {
            // const pool = await get(type, destDBConfig)
            // pool.request().query("SELECT ")
            res.send({
                success: true
            })
        } else {
            res.status(400).send({
                message: 'invalid type'
            })
        }
    } catch (err) {
        res.send(err)
    }

}

module.exports = {
    getDBSettings,
    setDBSettings,
    testConnection,
}