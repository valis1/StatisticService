let adaptJson=function(data){
    //.replace( /-/g, ":" )
    data.subscribleRank=data.subscribleRank.substring(0,data.subscribleRank.length -2);
    data.videoViewRank=data.videoViewRank.substring(0,data.videoViewRank.length -2);
    data.views30Days=data.views30Days.replace(/\n/g,'');
    data.views30Days=data.views30Days.replace(/,/g,'');
    data.subscribers30Days=data.subscribers30Days.replace(/\n/g,'');
    data.subscribers30Days=data.subscribers30Days.replace(/,/g,'');
    data.todayVideoViews=data.todayVideoViews.replace('+','');
    data.todayVideoViews=data.todayVideoViews.replace(/,/g,'');


    return data;
}

let calcTime=function(offset) {

    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000*offset));
    return nd

}

module.exports.adaptJson=adaptJson;
module.exports.calcTime=calcTime;