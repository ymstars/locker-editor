const Database = require('better-sqlite3');
const {leaseFileLocker, appendFile} = require("../locker");
const {saveFile} = require("../utils/io");
const {DATABASE_FILE, SQL_TEMPLATES} = require('../config/global');
const {EDITOR_FILES} = SQL_TEMPLATES;
//get Or Create An Database
const db = new Database(DATABASE_FILE, {verbose: console.log});

const createTable = () => {
    db.prepare(EDITOR_FILES.CREATE_TABLE).run();
}

const listAll = () => {
    return db.prepare(EDITOR_FILES.ALL).all();
};

const detail = (id) => {
    return db.prepare(EDITOR_FILES.DETAIL).get(id);
}

/**
 * check file name exists
 * @param name
 * @returns {*}
 */
const checkName = (name) => {
    return db.prepare(EDITOR_FILES.CHECK_NAME).get(name);
}

const insert = db.transaction((body) => {
    const {name, content} = body;
    const checkResult = checkName(name);
    if (checkResult !== undefined) {
        throw new Error('file name is exists!');
    } else {
        const data = {name: name, createTime: Date.now()};
        const {lastInsertRowid} = db.prepare(EDITOR_FILES.INSERT).run(data);
        saveFile(name, content);
        data.id = lastInsertRowid;
        appendFile(data, true)
        return body;
    }
});

const update = db.transaction(({id, content, sign}) => {
    const checkResult = detail(id);
    if (!checkResult) {
        throw new Error('file not exists!');
    } else {
        var nowTime = Date.now();
        db.prepare(EDITOR_FILES.UPDATE).run(nowTime, id);
        leaseFileLocker(id, sign, nowTime);
        saveFile(checkResult.name, content);
        return id;
    }
});

module.exports = {
    createTable,
    detail,
    listAll,
    insert,
    update
}