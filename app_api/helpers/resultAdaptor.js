const { DateTime } = require("luxon");

let adaptJson=function(data){
    let month_names_short=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    try{
    data.subscribleRank=data.subscribleRank.substring(0,data.subscribleRank.length -2);
	data.subscribleRank=data.subscribleRank.replace(/,/g,'');
    data.videoViewRank=data.videoViewRank.substring(0,data.videoViewRank.length -2);
	data.videoViewRank=data.videoViewRank.replace(/,/g,'');
    data.views30Days=data.views30Days.replace(/\n/g,'');
    data.views30Days=data.views30Days.replace(/,/g,'');
    data.subscribers30Days=data.subscribers30Days.replace(/\n/g,'');
    data.subscribers30Days=data.subscribers30Days.replace(/,/g,'');
    data.todayVideoViews=data.todayVideoViews.replace(/,/g,'');
    let mounth=month_names_short.indexOf(data.userCreatedDate.substring(0,3))+1;
    let day=data.userCreatedDate.match(/\d{1,2}\D/)[0];
    day=day.substring(0,day.length-1);
    let year=data.userCreatedDate.match(/\d{4}/)[0];
    
    if (mounth<10){
        mounth='0'+mounth;
    }

    
    if (day.length==1){
        day='0'+day;
    }
    
    data.userCreatedDate=day+'.'+mounth+'.'+year;
    }
    catch (e){
      console.log(e)
    }
    
    return data;
}

let calcTime=function(offset) {
    
    var now = DateTime.utc();
    res=now.plus({hours:parseInt(offset)});
    let stringHour=(String(res.hour).length==1) ? '0'+String(res.hour) : String(res.hour);
    let stringMinute=(String(res.minute).length==1) ? '0'+String(res.minute) : String(res.minute);
    
    return stringHour+':'+stringMinute;

}


module.exports.adaptJson=adaptJson;
module.exports.calcTime=calcTime;
