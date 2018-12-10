var HTMLParser = require('fast-html-parser');
var cheerio = require("cheerio");


let getData=function(data){
    let $ = cheerio.load(data);
    let res={};

    //Набор селекторов
    try {
    res.viewsCount=$('#youtube-stats-header-views').html()
    res.subscribleRank=$('#afd-header-subscriber-rank').html()
    res.videoViewRank=$('#afd-header-videoview-rank').html()
    res.views30Days=$('#afd-header-views-30d').html()
    res.subscribers30Days=$('#afd-header-subs-30d').html()
    res.todayVideoViews=$('div[style*="width: 860px; height: 32px;"]').last().find('span').last().html();
    res.userCreatedDate=$('.YouTubeUserTopInfo').last().find('span').last().html();
    }
    catch (e){
        console.log(e);
        return false;
    }

    return res;
}

let getLiveCount=function(data){
    let root = HTMLParser.parse(data);
    let res;
    try {
         res=root.querySelector('#rawCount').rawText;     
    }
    catch (e){
        return false;
    }
    return res;
}

module.exports.getData=getData;
module.exports.getCount=getLiveCount;