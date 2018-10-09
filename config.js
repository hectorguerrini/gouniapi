const configDev = {
    user: 'node',
    password: 'nodeadmin',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'DBGouni',
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
}
const configProd = {
    user: 'gouniadmin',
    password: 'Luka1523',
    server: 'gounidb.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'DBGouni',
    options: {
      encrypt: true // Use this if you're on Windows Azure
    },
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
  }
module.exports = function(){
    if( process.env.NODE_ENV === 'production' ){
        return configProd;
    } else {
        return configDev;
    }
};
