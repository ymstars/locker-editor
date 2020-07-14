const express = require('express');
const router = express.Router();
const locker = require('../src/locker');

/* GET home page. */
/**
 * Create new file
 */
router.get('/', async function (req, res, next) {
    res.render('create', {title: 'Create New File'});
});

/**
 * Edit file
 */
router.get('/edit/:id', async function (req, res, next) {
    const id = parseInt(req.params.id);
    const {sign} = req.query;
    await locker.checkLockSign(id, sign);
    res.render('edit', {title: 'Edit File', id, sign});
});

/**
 * View File list
 */
router.get('/view', async function (req, res, next) {
    res.render('index', {title: 'View File List'});
});

module.exports = router;
