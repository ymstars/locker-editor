const DATABASE_FILE = 'data/db/ring.db';
const TABLE_NAME = 'editor_files';
const FILE_BASE_PATH = 'data/files';
const FILE_TYPE = '.txt';

//SQL Templates
const SQL_TEMPLATES = {
    EDITOR_FILES: {
        CREATE_TABLE: `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (id INTEGER PRIMARY KEY,name VARCHAR(255),updateTime INTEGER,createTime INTEGER)`,
        DETAIL: `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
        CHECK_NAME: `SELECT * FROM ${TABLE_NAME} WHERE name = ?`,
        ALL: `SELECT * FROM ${TABLE_NAME} ORDER BY createTime DESC`,
        INSERT: `INSERT INTO ${TABLE_NAME} (name,createTime) VALUES (@name,@createTime)`,
        UPDATE: `UPDATE ${TABLE_NAME} SET updateTime = ? WHERE id = ?`
    }
}

const SOCKET_EVENT = {
    LOCK_FILE: 'lock_file',
    LEASE_FILE: 'lease_file',
    APPEND_FILE: 'append_file',
    ERROR: 'user_error'
};

module.exports = {
    FILE_TYPE,
    DATABASE_FILE,
    TABLE_NAME,
    FILE_BASE_PATH,
    SQL_TEMPLATES,
    SOCKET_EVENT
}