const router = require('express').Router();

router.get('/login', (req, res ) => {
  res.render('admin/login', {user: req.user});
})

module.exports = router;
