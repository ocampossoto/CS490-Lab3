module.exports = require('./node_modules/twitter-node-client/lib/Twitter');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
};
var success = function (data) {
    console.log('Data [%s]', data);
};
//added my own keys here
var config = {
    "consumerKey": "Y5vCHFsYk7qg8XlRYYeqAHj39",
    "consumerSecret": "nstq9qGmCeJoWaLqSDwwaPM0vO8kr6QcWhAosWcHZlPTE3d8fN",
    "accessToken": "198330234-SapFvuLI9iKEv9ZuAibI0QUsMqKUb29E5ctEs1AA",
    "accessTokenSecret": "rKYT68yxZOnBlFcMPSJyEUvV17eP52F4HHesqz5CiVRYk"
};

var twitter = new module.exports.Twitter(config);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

/*
 * To connect to a front end app (i.e. AngularJS) store all your files you will *
 * statically store in declared below (i.e. ./public) *
*/

app.use(express.static('public'));

//post to retrieve user data
app.post('/twitter/user', function (req, res) {
    var username = req.body.username;
    var items = getamount(req); //max amount of friends to return
    //use twitter api to request the information
    var data = twitter.doRequest("https://api.twitter.com/1.1/friends/list.json?cursor=-1&screen_name="+username+"&skip_status=true&include_user_entities=false&count=" + items+"", function(error, response, body){
        res.status(404).send({
            "error" : "User Not Found"
        });
        console.log(error);
    }, function(data){
        res.send({
            result : {
                "userData" : data
            }
        });
    });
});

//start server
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
});

//make sure the amount user entered is allowed by the api
function getamount(req)
{
    if(req.body.amount != null && req.body.amount <= 200)
    {
        return req.body.amount;
    }
    else if(req.body.amount > 200){
        return 200;
    }
    else{
        return 20;
    }
}