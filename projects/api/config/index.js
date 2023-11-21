const sourceDBConfig = {  // local db
    user: '',
    password: '',
    server: '192.168.148.42',
    database: 'case-clinical-underwriting',
    port: 1433,
    encrypt: false,
    trustServerCertificate: true,
    dialect: "mssql",
    dialectOptions: {
        "instanceName": "SQLEXPRESS"
    }
}

const destDBConfig = {    // real db
    user: '',
    password: '',
    server: 'localhost', // SELECT @@SERVERNAME;
    database: 'case-clinical-underwriting',
    port: 1433,
    encrypt: false,
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