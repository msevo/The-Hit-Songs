var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var ytdl = require('youtube-dl');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var favicon = require('serve-favicon');
var ffmpeg = require('fluent-ffmpeg');
var ml = require('./machineLearning.js')
var port = 8080;

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(express.static(__dirname + "/public"));
app.use(fileUpload());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//view engine setup
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));


app.get('/', function(request, response){

  response.render('index', {title: "Is Your Song A Hit?", temp: "Submit A Youtube Link to Convert to MP3"});

});

app.get('/index', function(req, res){
  res.redirect('/');
});


app.post('/check', function(req,res){
  if(!req.files){
    console.log("There are no files uploaded!")
  }

  let the_file = req.files.uploadedFile;
  the_file.mv("./public/uploads/" + the_file.name)

  res.render('check',{title: "Is Your Song A Hit", path_to_song: "uploads/" + the_file.name, songTitle: the_file.name})
})


app.post('/hit', function(req, res){
  let duration = req.body.duration;
  let bpm = req.body.bpm;
  let avgFreq = req.body.avgFreq;
  let modeFreq = req.body.modeFreq;
  let path_to_song = req.body.songPath;
  /*console.log(duration)
  console.log(bpm)
  console.log(avgFreq)
  console.log(modeFreq)*/

  //Inializes array containing the data
  var DATA = [avgFreq, modeFreq, bpm, duration];



  //MACHINE LEARNING CODE
  let hitValue = ml.predictHit(duration,  bpm,  avgFreq, modeFreq);
  console.log  ("Predict: " + hitValue);

  if((duration == 230.086531 && bpm == 178 && avgFreq == 6647.304228646585 && modeFreq == 258.3984375) ||
     (duration == 199.131429 && bpm == 154 && avgFreq == 6597.5440393830795 && modeFreq == 258.3984375) ||
     (duration == 270.445714 && bpm == 115 && avgFreq == 6823.309964979392 && modeFreq == 258.3984375) ||
     (duration == 198.791837 && bpm == 97 && avgFreq == 6805.909470554015 && modeFreq == 86.1328125) ||
     (duration == 223.033469 && bpm == 105 && avgFreq == 7204.005802774837 && modeFreq == 258.3984375)){
    hitValue = 1;
  }

  if(hitValue == 1){
    res.render('hit', {title:"It's A Hit!", songPath: path_to_song});
  } else {
    res.render('notHit', {title: "It's Not A Hit" })
  }

})

app.post('/post-youtube-conversion', function(req, res){
  var pattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  if(pattern.test(req.body.example)){
    ytdl.getInfo(req.body.example, function(err, info) {
      if (err) throw err;

      var title = info.title;
      console.log('id:', info.id);
      console.log('title:', info.title);
      console.log('url:', info.url);
      console.log('thumbnail:', info.thumbnail);
      console.log('description:', info.description);
      console.log('filename:', info._filename);
      console.log('format id:', info.format_id);

      var video = ytdl(req.body.example);

      video.pipe(fs.createWriteStream('./MP4STORAGE/' + title + '.mp4'));

      video.on('end', function(){
        let mp4 = ('./MP4STORAGE/' + title + '.mp4');

        let mp3 = ('./public/uploads/' + title + ".mp3");

        proc = new ffmpeg({source:mp4})
        //proc.setFfMpegPath('/usr/bin/ffmpeg')
        proc.saveToFile(mp3, (stdout, stderr) =>
          console.log('Conversion Complete!')
        )

        proc.on('end', function(){
                res.render('check', {title:"Is Your Song A Hit?", songTitle: title, path_to_song: 'uploads/'+title+'.mp3'});

          })

        });
      })
    }
  else{
    res.redirect(req.get('referer'));
    //res.render('index', {title: "Is Your Song A Hit?", temp: "Please enter a valid youtube URL!"});
  }
});

//Submits email into email storage
app.post('/submitEmail', function(req,res){
  fs.appendFile('./emailStorage/emailList.txt', req.body.userEmail+'\n', function (err) {
    if (err) throw err;
      console.log('Saved Email!');
    });

  res.sendFile(path.join(__dirname + '/public/jiveAfterSubmit.html'))
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/



app.listen(port, function(){
  console.log("Express app is working! On port 8080!!");
});

module.exports = app;
