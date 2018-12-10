var mongoose = require( 'mongoose' );

var userSchema=new mongoose.Schema(
    {
        socialbladeID:{type:String,required:true},
        createdDate:{type:Date, default:Date.now},
        lastRequest:Date,
        timezone:{type:String,default:'+2'},
        mignightSubscribers:{type:Number,default:-1},
        patreonLogin:{type:String,required:true},
        patreonRank:{type:Number,default:-1},
        patreonCost:{type:Number,default:-1},
        lastUpdate:Date
    }
);

userSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this;
    self.findOne({'socialbladeID':condition.socialbladeID,'patreonLogin':condition.patreonLogin}, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => { result.created=true; return callback(err, result); });
    });
};

mongoose.model('users', userSchema);