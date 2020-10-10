const fs = require('fs')
const moment = require('moment')
const crypto = require('crypto')

const LOG_LEVEL = {
    OFF: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
}

let PATH = './'
let FILENAME = 'log.log'
let LEVEL = 'DEBUG'
let SIZE = 50
let FILE = `${PATH}/${FILENAME}`
let LOG_TO_CONSOLE = true
let WRITE_TO_FILE = true

let AWS_KEY = null
let AWS_SECRET = null
let AWS_UPDATE_QUEUE_URL = null
let sqs = null

function init({ path = PATH, filename = FILENAME, level = LEVEL, size = SIZE, logToConsole = LOG_TO_CONSOLE, writeToFile = WRITE_TO_FILE, audit = null }) {
    PATH = path || PATH
    FILENAME = filename || FILENAME
    LEVEL = level || LEVEL
    SIZE = size || SIZE
    LOG_TO_CONSOLE = logToConsole || LOG_TO_CONSOLE
    WRITE_TO_FILE = writeToFile || WRITE_TO_FILE
    FILE = `${PATH}/${FILENAME}`

    if (!fs.existsSync(PATH)) {
        fs.mkdirSync(PATH, { recursive: true })
    }
    if (!fs.existsSync(FILE)) {
        fs.appendFileSync(FILE, '')
    } else {
        doRollover()
    }
}

/**
 *  Do not log if config is set over log level or log level is OFF
 * */
function checkLevel(lvl) {
    if (LOG_LEVEL[LEVEL] == 0) { return false }
    return LOG_LEVEL[lvl.toUpperCase()] >= LOG_LEVEL[LEVEL.toUpperCase()]
}

/**
 *  Check file size in terms of MB
 * */
function checkSize() {
    if (fs.statSync(FILE).size >= SIZE * 1024 * 1024) {
        doRollover()
    }
}

/**
 *  Rollover on:-
 *  - over file size
 *  - new day
 * */
function doRollover() {
    let exist = false
    let counter = 1
    while (!exist) {
        let filename = FILENAME.split('.')
        filename.splice(1, 0, moment().format('YYYYMMDD'))
        filename.splice(2, 0, counter)
        let newFile = `${PATH}/${filename.join('.')}`
        if (!fs.existsSync(newFile)) {
            fs.renameSync(FILE, newFile) // rename the current log file with rollover 
            fs.appendFileSync(FILE, '') // create new file with empty content
            exist = true
        }
        counter++
    }
}

function debug(log = '') {
    if (!checkLevel('DEBUG')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'DEBUG'.padStart(5, ' '),
        transactionId: ''.padStart(10, ' '),
        log,
    }
    write(obj)
}

function info(log = '') {
    if (!checkLevel('INFO')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'INFO'.padStart(5, ' '),
        transactionId: ''.padStart(10, ' '),
        log,
    }
    write(obj)
}

function warn(log = '') {
    if (!checkLevel('WARN')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'WARN'.padStart(5, ' '),
        transactionId: ''.padStart(10, ' '),
        log,
    }
    write(obj)
}

function error(log = '') {
    if (!checkLevel('ERROR')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'ERROR'.padStart(5, ' '),
        transactionId: ''.padStart(10, ' '),
        log,
    }
    write(obj)
}

function fatal(log = '') {
    if (!checkLevel('FATAL')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'FATAL'.padStart(5, ' '),
        transactionId: ''.padStart(10, ' '),
        log,
    }
    write(obj)
}

function debugTrans(transactionId = '', log = '') {
    if (!checkLevel('DEBUG')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'DEBUG'.padStart(5, ' '),
        transactionId: (transactionId.length < 10) ? transactionId.padStart(10, ' ') : transactionId.substr(0, 10),
        log,
    }
    write(obj)
}

function infoTrans(transactionId = '', log = '') {
    if (!checkLevel('INFO')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'INFO'.padStart(5, ' '),
        transactionId: (transactionId.length < 10) ? transactionId.padStart(10, ' ') : transactionId.substr(0, 10),
        log,
    }
    write(obj)
}

function warnTrans(transactionId = '', log = '') {
    if (!checkLevel('WARN')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'WARN'.padStart(5, ' '),
        transactionId: (transactionId.length < 10) ? transactionId.padStart(10, ' ') : transactionId.substr(0, 10),
        log,
    }
    write(obj)
}

function errorTrans(transactionId = '', log = '') {
    if (!checkLevel('ERROR')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'ERROR'.padStart(5, ' '),
        transactionId: (transactionId.length < 10) ? transactionId.padStart(10, ' ') : transactionId.substr(0, 10),
        log,
    }
    write(obj)
}

function fatalTrans(transactionId = '', log = '') {
    if (!checkLevel('FATAL')) { return }
    checkSize()

    let obj = {
        timestamp: moment().format('YYYYMMDD HHmmss.SSS'),
        level: 'FATAL'.padStart(5, ' '),
        transactionId: (transactionId.length < 10) ? transactionId.padStart(10, ' ') : transactionId.substr(0, 10),
        log,
    }
    write(obj)
}

function write(obj) {
    let log = ''
    for (let key in obj) {
        if (key == 'log' && (typeof obj[key] == 'object' || Array.isArray(obj[key]))) {
            obj[key] = JSON.stringify(obj[key])
        }
        log += `${obj[key]} `
    }
    if (LOG_TO_CONSOLE) {
        console.log(log)
    }
    if (WRITE_TO_FILE) {
        log += '\n'
        fs.appendFileSync(FILE, log)
    }
}

module.exports = {
    init,
    debug,
    info,
    warn,
    error,
    fatal,
    debugTrans,
    infoTrans,
    warnTrans,
    errorTrans,
    fatalTrans,
}