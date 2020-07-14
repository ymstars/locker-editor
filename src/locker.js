const {nanoid} = require('nanoid');
const {SOCKET_EVENT} = require('./config/global');
let io = undefined;
const filesMap = new Map();

/**
 * Initialize Locker By Exists Files
 * @param http
 * @param files
 */
const initialize = (http, files) => {
    if (this.io === undefined) {
        this.io = require('socket.io')(http)
        this.io.on('connection', function (client) {
            console.log(client.id + ': Join!');
        })
    }
    files.forEach((file) => {
        appendFile(file);
    });
}

/**
 * Append File To Global Map
 * @param file
 * @param notify
 */
const appendFile = (file, notify = false) => {
    const data = {
        id: file.id,
        name: file.name,
        createTime: file.createTime,
        updateTime: file.updateTime,
        locked: false,
        leaseAt: null,
        sign: null
    }
    filesMap.set(file.id, data);
    if (notify) {
        this.io.emit(SOCKET_EVENT.APPEND_FILE, {...data, sign: undefined})
    }
}

/**
 * lock file
 * @param id
 * @return {*}
 */
const lockFile = (id) => {
    let file = filesMap.get(id);
    if (!filesMap.has(id)) {
        throw new Error('File Not Exists!');
    } else if (file.locked) {
        throw new Error('File Is Locked! Please Wait For Lease.');
    } else {
        file.sign = nanoid(64);
        file.leaseAt = Date.now() + 60000;
        file.locked = true;
        filesMap.set(id, file);
        this.io.emit(SOCKET_EVENT.LOCK_FILE, {...file, sign: undefined});
        setTimeout(leaseFileLockerForce, 60000, id);
        return file;
    }
};

/**
 * check lock sign code
 * @param id
 * @param sign
 * @returns {Promise<?>}
 */
const checkLockSign = (id, sign) => {
    if (filesMap.has(id) && filesMap.get(id).sign === sign) {
        return id;
    } else {
        throw new Error('Sign Code Invalid')
    }
};

const leaseFileLockerForce = (fileId) => {
    let file = filesMap.get(fileId);
    if (!filesMap.has(fileId)) {
        throw new Error('file not exists');
    } else {
        if (file.locked) {
            file.sign = undefined;
            file.leaseAt = undefined;
            file.locked = false;
            filesMap.set(file.id, file);
            this.io.emit(SOCKET_EVENT.LEASE_FILE, {...file, sign: undefined});
        }
        return file;
    }
};

/**
 * lease file locker
 * @param fileId
 * @param sign
 * @param updateTime
 * @param force
 * @returns {*}
 */
const leaseFileLocker = (fileId, sign, updateTime, force = false) => {
    let file = filesMap.get(fileId);
    if (!filesMap.has(fileId)) {
        throw new Error('file not exists');
    } else if (!force && file.sign !== sign) {
        throw new Error('Sign Invalid!')
    } else {
        file.updateTime = updateTime;
        file.sign = undefined;
        file.leaseAt = undefined;
        file.locked = false;
        filesMap.set(file.id, file);
        this.io.emit(SOCKET_EVENT.LEASE_FILE, {...file, sign: undefined});
        return file;
    }
};

const loadAllData = () => {
    let data = [];
    for (let [k, v] of filesMap) {
        data = [...data, {...v, sign: undefined}];
    }
    return data.sort(function (a, b) {
        return b.createTime - a.createTime;
    });
}

const loadRecord = (id) => {
    return filesMap.get(id);
}


module.exports = {
    io,
    initialize,
    appendFile,
    lockFile,
    leaseFileLocker,
    loadAllData,
    checkLockSign,
    loadRecord
};
