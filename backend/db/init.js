const mongoose = require('mongoose');
const {logger} = require('#src/middlewares/logger');
require('dotenv').config();

const initMongoDatabase = () => {
    const DATABASE_URL = process.env.DATABASE_URL_MONGO
    mongoose.connection.on('open', () => {
        logger.info('successfully connected to database:', DATABASE_URL)
    })
    return mongoose.connect(DATABASE_URL)
};

const initSqliteDatabase = () => {
    const DATABASE_URL = __dirname + '/database.sqlite'
    const sqlite3 = require('sqlite3').verbose()
    return new sqlite3.Database(DATABASE_URL, (err) => {
        if (err) {
            logger.error('Error connecting to database:', err)
        } else {
            logger.info('successfully connected to database:', DATABASE_URL)
        }
    })
};


function main() {
    const db = initSqliteDatabase();
    logger.debug(db);
}

if (require.main === module) {
    main()
}

module.exports = {initMongoDatabase, initSqliteDatabase};