var express = require('express');
var bodyParser = require('body-parser');


var passport = require('passport');
var extractJwt = require('passport-jwt').ExtractJwt;
var jwtStrategy = require('passport-jwt').Strategy;
var jwt = require('jsonwebtoken');





var server = express();
server.use(bodyParser.json());
server.use(passport.initialize());



var options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'longobnoxiouspassphrase'
 };
passport.use(new jwtStrategy(options,function(jwt_payload, done) {

    var username = jwt_payload.username;
    var password = jwt_payload.password;

    done(null, {name:jwt_payload.username});
    //do login and pass done callBack
 }));

server.post('/login', function(req,res){

    var username = req.body.username;
    var password = req.body.password;

    if (username!='maryam' || password != "1234"){
    	return res.send(401,{ success: false, message: 'Authentication failed. User not found.' });
    }
    else{
    	var token = jwt.sign({username:username,password:password}, 'longobnoxiouspassphrase', {
                    //expiresIn: 10080 // in seconds
                    expiresIn: 900 // 15 min
        });
        //var access_token = 'JWT ' + token;
        return res.send(401,{ access_token: token });

    }
});

server.get('/get-data',passport.authenticate('jwt', { session: false }),function(req,res){
    res.send({secure_data:'Hello World'});
})







server.listen('3000',function(){
	console.log('Api running at port:3000');
});