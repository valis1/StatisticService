var express = require('express');
var router = express.Router()

var ctrlParser=require('../controllers/parser');

router.get('/',ctrlParser.getData);

module.exports = router;