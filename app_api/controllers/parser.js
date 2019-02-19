var mongoose = require('mongoose');
var sociabladeParser=require('../helpers/socialblade_parser');
var resultAdaptor=require('../helpers/resultAdaptor');
var request=require('request');
var User = mongoose.model('users');

//  Ограничения длины, минимума и максимума для целочисленных значений CSV
const csvLen = 8;
const csvMin = -99999999;
const csvMax = +99999999;

//  Расширение прототипа для форматирования полей CSV
Number.prototype.pad = function( len, min, max ) {
    var sign = this > 0 ? '+' : '-';
    var string = String( Math.abs( Math.max( Math.min( this, max ), min ) ) );
    while( string.length < ( len || 2 ) )
        string = '0' + string;
    return sign + string;
}

//Отправка ответа в JSON
var sendJSONresponse = function(res, status, content) {
    let resContent=resultAdaptor.adaptJson(content);
    if (resContent){
        res.status(status);
        res.json(resContent);
    }
    else {
      res.status(501);
      res.json({'error':'An Error occured in Result parsing stage'});
    }
  };

//Отправка ответа в тексте
var sendCsvResponse=function(res,status,content){
    let resContent=resultAdaptor.adaptJson(content);
    if (resContent){
      if (status==200){
      resString =
                Number( resContent.liveSubscribers ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.todaySubscribers ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.subscribers30Days ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.viewsCount ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.todayVideoViews ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.views30Days ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.subscribleRank ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.videoViewRank ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.patreonRank ).pad( csvLen, csvMin, csvMax ) + ';' +
                Number( resContent.patreonCost ).pad( csvLen, csvMin, csvMax ) + ';' +
                resContent.userCreatedDate + ';' +
                resContent.time;

      res.status(status);
      res.send(resString);
      }
      else {
        res.status(status);
        res.json(content);
      }
    }
   else {
     res.status(501);
     res.json({'error':'An Error occured in Result parsing stage'});
   }
    
    
};



var getData=function(req,res){
    let socialbladeID=req.query.socialblade;
    let patreon=req.query.patreon;
    let userTime=req.query.gmt ? req.query.gmt:0;
    let format=req.query.format ? req.query.format:'text';
    let sendResponse=format=='text' ? sendCsvResponse : sendJSONresponse;
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
                };
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
                                    result.time=resultAdaptor.calcTime(user.timezone);
                                
                                    //Пообновляем данные по юзеру
                                    user.timezone=userTime;
                                    user.lastRequest=Date.now();
                                    //Для новых пользователей в качестве полуночных данных по подписчикам выставляем текущие данные
                                    if (user.created){
                                        user.mignightSubscribers=lsTempResult;
                                	}
                                    
                                    result.todaySubscribers=lsTempResult-user.mignightSubscribers;//Расчет подписчиков в текущие сутки. Для новых пользователей будет 0
                                    user.save((err)=>console.log(err));
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
};

module.exports.getData=getData;
