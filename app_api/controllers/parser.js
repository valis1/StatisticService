var mongoose = require('mongoose');
var User = mongoose.model('users');

//Отправка ответа в JSON
var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

//Отправка ответа в тексте
var sendCsvResponse=function(res,status,content){
    console.log('stub');
}

var getData=function(req,res){
    let socialbladeID=req.query.socialblade;
    let patreon=req.query.patreon;
    let userTime=req.query.gmt ? req.query.gmt:0;
    let sendResponse=sendJSONresponse;

    if (!socialbladeID){
        sendResponse(res,400,{'error':'socialbladeID ID is not passed'});
        return;
    }
    if (!patreon){
        sendResponse(res,400,{'error':'patreon ID is not passed'});
        return;
    }

    User.findOneOrCreate({
        'socialbladeID':socialbladeID,
        'timezone':userTime},
        function (err,user){
            if (err){
                sendResponse(res,523,'db Error');
            }
            else {
                //Пообновляем данные по юзеру
                user.timezone=userTime;
                user.lastRequest=Date.now();
                user.save((err)=>console.log(err));

                //Здесь пошел парсинг

            
            }
        }
        );


        sendResponse(res,200,{'ok':'Sucscess!!!!'});
}

module.exports.getData=getData;
