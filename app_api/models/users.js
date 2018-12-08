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

userSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this
    self.findOne({'socialbladeID':condition.socialbladeID}, (err, result) => {
        return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
    })
}

mongoose.model('users', userSchema);