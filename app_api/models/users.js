var mongoose = require( 'mongoose' );

var userSchema=new mongoose.Schema(
    {
        socialbladeID:{type:String,required:true},
        createdDate:{type:Date, default:Date.now},
        lastRequest:Date,
        timezone:Number,
        todaySubscribers:Number,
        lastUpdate:Date
    }
);

mongoose.model('users', userSchema);