const conf = require('config-yml');
const moment = require('moment');
const _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;

const log = require('../utils/log');
const db = require('../utils/db');

const collection = () => {
    return db.client.db(conf.db.name).collection('todo');
};

const get = async (req, res) => {
    try {
        const documents = await collection()
            .find({ deleted_at: null })
            .toArray();
        return res.send({
            data: documents,
            message: 'Successfully get todo list',
        });
    } catch (error) {
        console.log(error);
        log.errorTrans(req.transactionId, error);
        return res.status(500).send({
            message: 'Error occur when trying to get todo list',
        });
    }
};

const create = async (req, res) => {
    try {
        let documents = await collection()
            .find({ task: req.body.task })
            .toArray();
        if (documents.length > 0) {
            return res.send({
                message: 'Todo already exist',
            });
        } else {
            await collection().insert({
                task: req.body.task,
                created_at: moment().valueOf(),
                updated_at: moment().valueOf(),
                deleted_at: null,
            });
            return res.send({
                message: 'Successfully create new todo',
            });
        }
    } catch (error) {
        console.log(error);
        log.errorTrans(req.transactionId, error);
        return res.status(500).send({
            message: 'Error occur when trying to create new todo',
        });
    }
};

const update = async (req, res) => {
    try {
        await collection().updateOne(
            { _id: ObjectID(req.query._id) },
            {
                $set: {
                    task: req.body.task,
                    done: req.body.done || false,
                    updated_at: moment().valueOf(),
                },
            }
        );
        const documents = await collection().find({}).toArray();
        return res.send({
            data: documents,
            message: 'Successfully update todo',
        });
    } catch (error) {
        console.log(error);
        log.errorTrans(req.transactionId, error);
        return res.status(500).send({
            message: 'Error occur when trying to create new todo',
        });
    }
};

const remove = async (req, res) => {
    try {
        await collection().updateOne(
            { _id: ObjectID(req.query._id) },
            { $set: { deleted_at: moment().valueOf() } }
        );
        return res.send({
            message: 'Successfully remove todo',
        });
    } catch (error) {
        console.log(error);
        log.errorTrans(req.transactionId, error);
        return res.status(500).send({
            message: 'Error occur when trying to create new todo',
        });
    }
};

module.exports = {
    get,
    create,
    update,
    remove,
};
