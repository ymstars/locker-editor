const express = require('express');
const router = express.Router();
const fileUtils = require('../src/utils/io');
const dao = require('../src/entity/editor_file');
const locker = require('../src/locker');

/**
 * Load All Files
 */
router.get('/', async function (req, res, next) {
    const data = locker.loadAllData();
    res.json(data);
});

/**
 * Load File Info
 */
router.get('/:id', async function (req, res, next) {
    const id = parseInt(req.params.id);
    const {sign} = req.query;
    await locker.checkLockSign(id, sign);
    const record = locker.loadRecord(id);
    record.content = fileUtils.loadFile(record.name);
    res.json(record);
});

/**
 * download file
 */
router.get('/:id/download', async function (req, res, next) {
    const id = parseInt(req.params.id);
    const record = dao.detail(id);
    const path = fileUtils.generateFilePath(record.name);
    res.download(path, fileUtils.generateFileName(record.name));
});

/**
 * Try Lock File
 */
router.post('/:id/lock', async function (req, res, next) {
    const id = parseInt(req.params.id);
    const record = locker.lockFile(id);
    res.json(record);
});

/**
 * Create New File
 */
router.post('/', async function (req, res, next) {
    const body = req.body;
    const record = dao.insert(body);
    res.json(record);
});

/**
 * Save The File Change
 */
router.put('/:id', async function (req, res, next) {
    const id = parseInt(req.params.id);
    const body = {...req.body, id};
    dao.update(body);
    res.json('success');
});

module.exports = router;
