var mongoose = require('mongoose');
var User = mongoose.model('users');

//Хелпер для отправки ответа в JSON
var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };


var getData=function(req,res){
    let youtubeId=req.query.socialblade;
    let patreon=req.query.patreon;
    let userTime=req.query.gmt;

    if (!youtubeId){
        sendJSONresponse(res,400,{'error':'youtube ID is not passed'});
        return;
    }
    if (!patreon){
        sendJSONresponse(res,400,{'error':'patreon ID is not passed'});
        return;
    }

    sendJSONresponse(res,200,{'ok':'Sucscess!!!!'});
}

module.exports.getData=getData;
