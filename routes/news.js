var express = require('express');
var router = express.Router();

/* GET news page. */
router.get('/news', function(req, res, next) {
  res.render('news', { title: '资讯' });
});

module.exports = router;
