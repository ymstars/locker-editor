const fs = require('fs');
const path = require('path');
const config = require('../config/global');

function generateFileName(name) {
    return `${name}${config.FILE_TYPE}`;
}

function generateFilePath(name) {
    return path.resolve(__dirname, `../../${config.FILE_BASE_PATH}/${generateFileName(name)}`);
}

/**
 * save file to disk
 * @param name
 * @param content
 */
const saveFile = (name, content) => {
    fs.writeFileSync(generateFilePath(name), content, {flag: 'w'});
}

/**
 * load file from disk by file name
 * @param fileName
 * @returns {string}
 */
const loadFile = (fileName) => {
    return fs.readFileSync(generateFilePath(fileName), 'utf-8');
}

module.exports = {
    generateFileName,
    generateFilePath,
    saveFile,
    loadFile
}