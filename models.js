var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SequencesSchema = Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

var sequences = mongoose.model('sequences', SequencesSchema);

var UrlsSchema = new Schema({
  _id: {type: Number},
  url: String,
  cnt: {type: Number, default:0},
  created_at: Date
});

UrlsSchema.pre('save', function(next){
  var self = this;
  sequences.findOneAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, {upsert: true}, function(error, result) {
    if (error) return next(error);
    self.created_at = new Date();
    if(result.seq)
      self._id = result.seq;
    next();
  });
});

var urls = mongoose.model('urls', UrlsSchema);

module.exports = urls;
