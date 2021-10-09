const express = require('express');
const { createUser } = require('../controllers');

const router = express.Router();

router.use('/users', createUser);

module.exports = router;
