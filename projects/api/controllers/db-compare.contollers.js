const { get } = require('../db-pool');
const cuid = require('cuid')
const testExample = async (req, res) => {
    try {
        const source = await get('source', sourceDBConfig)
        const dest = await get('dest', destDBConfig)
    
        const tablesSource = await source.request().query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES');
        const tablesDest = await dest.request().query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES');
        res.send({tablesSource: tablesSource.recordsets, tablesDest: tablesDest.recordsets});
    } catch (err){
        console.log(err)
        res.status(500).send(err)
    }
}

const getSourceDBData = async (req, res) => {
    console.log("get source data")
    try {
        const source = await get('source', sourceDBConfig)
    
        const sourceData = await source.request().query('SELECT * FROM FormLayout WHERE active IS NULL or active = 1');
        res.send(sourceData);
    } catch (err){
        console.log(err)
        res.status(500).send(err)
    }
}

const getDestDBData = async (req, res) => {
    console.log("get dest data")
    try {
        const dest = await get('dest', destDBConfig)
    
        const destData = await dest.request().query('SELECT * FROM FormLayout WHERE active IS NULL or active = 1');
        res.send(destData);
    } catch (err){
        console.log(err)
        res.status(500).send(err)
    }
}

const updateDestData = async (req, res) => {
    const { recordId } = req.body;
    try {
        const source = await get('source', sourceDBConfig)
        const dest = await get('dest', destDBConfig)
        
        const sourceResult = await source.request().query(`SELECT * FROM FormLayout WHERE id='${recordId}';`);
        const sourceData = sourceResult.recordset[0]
        if(!sourceData) {
            return res.status(400).send("Invalid Record Id")
        }

        const {name, config, type, previewImage, testData, order, parentId, title, modelData, isModal, active} = sourceData;

        let updatedData;
        if( active !== 0 ) {
            updatedData = dest.request().query(`UPDATE FormLayout SET active=0 WHERE name='${name}';`);
        }

        const sql = `INSERT INTO FormLayout (id, createdAt, updatedAt, name, config, type, previewImage, testData, parentId, title, modelData, isModal, active) 
            VALUES(@id, @createdAt, @updatedAt, @name, @config, @type, @previewImage, @testData, @parentId, @title, @modelData, @isModal, @active);`;
        
        const newId = cuid();

        const insertRequest = dest.request();
        insertRequest.input('id', newId);
        insertRequest.input('createdAt', new Date());
        insertRequest.input('updatedAt', new Date());
        insertRequest.input('name', name);
        insertRequest.input('config', config);
        insertRequest.input('type', type);
        insertRequest.input('previewImage', previewImage);
        insertRequest.input('testData', testData);
        // insertRequest.input('order', order);
        insertRequest.input('parentId', parentId);
        insertRequest.input('title', title);
        insertRequest.input('modelData', modelData);
        insertRequest.input('isModal', isModal);
        insertRequest.input('active', active !== 0);

        const insertedData = insertRequest.query(sql)

        res.send( {
            sourceResult, updatedData, insertedData
        } )
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
}

const updateSrcData = async (req, res) => {
    const { recordId } = req.body;
    try {
        const dest = await get('dest', destDBConfig)
        const source = await get('source', sourceDBConfig)
        
        const destResult = await dest.request().query(`SELECT * FROM FormLayout WHERE id='${recordId}';`);
        const destData = destResult.recordset[0]
        if(!destData) {
            return res.status(400).send("Invalid Record Id")
        }

        const {name, config, type, previewImage, testData, order, parentId, title, modelData, isModal, active} = destData;

        let updatedData;
        if( active !== 0 ) {
            updatedData = source.request().query(`UPDATE FormLayout SET active=0 WHERE name='${name}';`);
        }

        const sql = `INSERT INTO FormLayout (id, createdAt, updatedAt, name, config, type, previewImage, testData, parentId, title, modelData, isModal, active) 
            VALUES(@id, @createdAt, @updatedAt, @name, @config, @type, @previewImage, @testData, @parentId, @title, @modelData, @isModal, @active);`;
        
        const newId = cuid();

        const insertRequest = source.request();
        insertRequest.input('id', newId);
        insertRequest.input('createdAt', new Date());
        insertRequest.input('updatedAt', new Date());
        insertRequest.input('name', name);
        insertRequest.input('config', config);
        insertRequest.input('type', type);
        insertRequest.input('previewImage', previewImage);
        insertRequest.input('testData', testData);
        // insertRequest.input('order', order);
        insertRequest.input('parentId', parentId);
        insertRequest.input('title', title);
        insertRequest.input('modelData', modelData);
        insertRequest.input('isModal', isModal);
        insertRequest.input('active', active !== 0);

        const insertedData = insertRequest.query(sql)

        res.send( {
            destResult, updatedData, insertedData
        } )
    } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
}

module.exports = {
    testExample,
    getSourceDBData,
    getDestDBData,
    updateDestData,
    updateSrcData,
}