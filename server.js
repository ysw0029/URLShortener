var express = require('express');
var mongoose = require('mongoose');
var bijective = require('./bijective.js');
var Urls = require('./models.js');

mongoose.connect('mongodb://localhost/url-shortener');

var app = express();
app.use(express.static('public'));

app.get('/url/:longUrl', function(req, res){
  console.log(req.params.longUrl);
  var shortUrl = '';

  Urls.findOne({url: req.params.longUrl}, function (err, doc){
    if(doc){
      res.send({'key': bijective.encode(doc._id)});
    }else{

    var newUrl = Urls({
      url: req.params.longUrl
    });

    newUrl.save(function(err, result){
      if(err) console.log(err);
      console.log("!!!!!!!!!!!!!!!");
      console.log(result);
      res.send({'key': bijective.encode(newUrl._id)});    });
  }
  });
});

app.get('/:key', function(req, res){

  var id = bijective.decode(req.params.key);

  Urls.findOneAndUpdate({_id: id}, {$inc: {cnt: 1}}, function(err,doc){
    if(doc){
      res.redirect(doc.url);
    }else{
      res.redirect("/");
    }
  });

});

app.post('/api/history', function(req, res){

  Urls.find({},'url cnt',function(err, result){
    if(err) console.log(err);
    console.log(result);
    res.json(result);
  });
});

app.listen(3000, function(){
  console.log('Example url shorter app listening!');
});
