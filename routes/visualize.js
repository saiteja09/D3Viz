var express = require('express');
var Client = require('node-rest-client').Client;

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session
    if(!('user' in sess && 'acces' in sess)  || (sess.user == undefined || sess.acces == undefined))
    {
        res.redirect('/');
        sess.error_msg = "Please login";
    }
    else if(!('datasource' in sess && 'table' in sess) || (sess.datasource == undefined || sess.table == undefined))
    {
        res.redirect('/home');
        sess.error_msg = 'Select Datasource and Table';
    }

    else {
        res.render('visualize', {title: 'Visualize your Data', user: sess.user, pass: sess.acces, datasource: sess.datasource, table: sess.table});
    }

});

module.exports = router;