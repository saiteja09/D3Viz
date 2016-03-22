/**
 * Created by SaikrishnaTeja on 3/3/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    if(!('user' in sess && 'acces' in sess) || (sess.user == undefined || sess.acces == undefined))
    {
        res.redirect('/');
        sess.error_msg = "Please login"
    }
    else {
        res.render('home', {title: 'Express', user: sess.user, pass: sess.acces});
    }
});



module.exports = router;
