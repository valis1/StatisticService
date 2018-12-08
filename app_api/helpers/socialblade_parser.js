var HTMLParser = require('fast-html-parser');


let getData=function(data){
    let root = HTMLParser.parse(data);
    let res={};
    //Простые селекторы
    try {
    res.viewsCount=root.querySelectorAll('#youtube-stats-header-views')[0].text;
    res.subscribleRank=root.querySelectorAll('#afd-header-subscriber-rank')[0].text;
    res.videoViewRanc=root.querySelectorAll('#afd-header-videoview-rank')[0].text;
    res.views30Days=root.querySelectorAll('#afd-header-views-30d')[0].text;
    res.subscribers30Days=root.querySelectorAll('#afd-header-subs-30d')[0].text;
    }
    catch (e){
        console.log(e);
        return false;
    }

    //Хардкор - селектор просмотров за сегодня
    todayString=root.querySelector('div[style*="width: 860px;"]')[0]
    console.log(todayString)
    


    return res;
}

module.exports.getData=getData;