const sourceDBConfig = {  // local db
    user: 'sa',
    password: '123456',
    server: '192.168.148.42',
    database: 'case-clinical-underwriting',
    port: 1433,
    trustServerCertificate: true,
    dialect: "mssql",
    dialectOptions: {
        "instanceName": "SQLEXPRESS"
    }
}

const destDBConfig = {    // real db
    user: 'sa',
    password: '123456',
    server: 'localhost', // SELECT @@SERVERNAME;
    database: 'case-clinical-underwriting',
    port: 1433,
    trustServerCertificate: true,
    dialect: "mssql",
    dialectOptions: {
        "instanceName": "MSSQLSERVER"
    }
}

module.exports = {
    sourceDBConfig,
    destDBConfig
}