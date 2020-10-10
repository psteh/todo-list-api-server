const conf = require('config-yml');
const MongoClient = require('mongodb').MongoClient;

const log = require('./log');

let client = null;

class Database {
    static async connect() {
        const uri = `mongodb+srv://${conf.db.username}:${conf.db.password}@cluster0.bqt5b.mongodb.net/${conf.db.name}?retryWrites=true&w=majority`;
        this.client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            this.client = await this.client.connect();
            log.info('connected to database');

            return this.client;
        } catch (error) {
            console.log(error);
            log.error(error);
        }
    }
}

module.exports = Database;
