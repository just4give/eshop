var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('*', function(req, res) {
  console.log(req.user);
  res.render('admin', { title: 'Online Shop'});
});

module.exports = router;
