//sc-bZQynM gDRMvY
var cheerio = require("cheerio");


let getData=function(data){
    let $ = cheerio.load(data);
    let rank,money;
    //Набор селекторов
    try {
        rank=$('.fJdsaR').html();
        console.log(rank);
        }
        catch (e){
            console.log(e);
            return false;
        }
    
        return rank;
}

module.exports.getData=getData;