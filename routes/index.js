var express = require('express');
var Client = require('node-rest-client').Client;

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Express' });

});

router.post('/', function(req, res, next){
  var options_auth = {user: req.body.username, password: req.body.password}
  var client = new Client(options_auth);
  client.get("https://service.datadirectcloud.com/api/mgmt/datasources", function (data, response)
  {
    if(response.statusCode == 200) {
        var sess = req.session;
        sess.user = req.body.username;
        sess.acces = req.body.password;
        res.redirect('/home');
    }
    else
    {
        var sess = req.session;
        sess.error_msg = "Invalid Credentials"
        res.render('index',{title: 'Express', error_msg: sess.error_msg} )
    }
  });
});

module.exports = router;
