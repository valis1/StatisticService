var mongoose = require('mongoose');
var sociabladeParser=require('../helpers/socialblade_parser');
var resultAdaptor=require('../helpers/resultAdaptor');
var request=require('request')
var User = mongoose.model('users');


//Отправка ответа в JSON
var sendJSONresponse = function(res, status, content) {
    let resContent=resultAdaptor.adaptJson(content);
    res.status(status);
    res.json(resContent);
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
    let sociableData;

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
        'timezone':userTime,
        'patreonLogin':patreon},
        function (err,user){
            if (err){
                sendResponse(res,523,{'error':'db request error'});
            }
            else {
                
                //Пообновляем данные по юзеру
                user.timezone=userTime;
                user.lastRequest=Date.now();
                user.save((err)=>console.log(err));

                //Пошел запрос Sociablade
                let requestOptions={
                    url:'https://socialblade.com/youtube'+socialbladeID,
                    headers:{
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
                    }
                }
                request(requestOptions, function (error, response, body) {
                    if (err){
                        sendResponse(res,534,{'error':'Sociable request error'});
                    }
                    else {
                        let result=sociabladeParser.getData(body);
                        if (result){
                        //Дополняем Result
                        result.patreonRank=user.patreonRank;
                        result.patreonCost=user.patreonCost;
                        //Запрос Live статистики по подписчикам
                        requestOptions.url=requestOptions.url+'/realtime';
                        request(requestOptions,function(error,response,body){
                            if (err){
                                sendResponse(res,534,{'error':'Sociable realtime stat request error'});
                            }
                            else {
                                let lsTempResult=sociabladeParser.getCount(body);
                                if (lsTempResult){
                                    result.liveSubscribers=lsTempResult;
                                    result.todaySubscribers=lsTempResult-user.mignightSubscribers;
                                    result.time=resultAdaptor.calcTime(user.timezone);
                                    sendResponse(res,200,result);
                                }
                                else {
                                    sendResponse(res,501,{'error':'Sociable live page parse error'});
                                }

                            }

                        });
                        }
                        else{
                            sendResponse(res,501,{'error':'Sociable parse error on main page'});
                        }
                     
                    }
                });


            
            }
        }
        );
}

module.exports.getData=getData;
