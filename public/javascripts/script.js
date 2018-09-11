import detect from 'bpm-detective';
//Importing convertVideo to convert youtube links to mp3
//import Downloader from './downloader.js'

window.onload = function () {
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var contextMain = new AudioContext();
  var submitSong = document.querySelector("#submitYoutubeForm");

  if(document.location.pathname === '/'){
    file.onclick = function(){
      document.querySelector("#findOut").style.visibility = "visible";
    }

    document.querySelector("#linkInput").oninput = function(){
      document.querySelector("#findOut").style.visibility = "visible";
    }

    document.querySelector("#findOut").onclick = function(){
      if(submitSong.click()){
        document.querySelector('.header').style.visibility = "hidden";
        document.querySelector('.upload-wrapper').style.visibility = "hidden";
        document.querySelector('.youtube').style.visibility = "hidden";
        document.querySelector("#findOut").style.visibility = "hidden";
        document.querySelector('.loading-container').style.visibility = "visible";
        submitSong.click();
      }
      else if(document.querySelector('#submitSong').click()){
        document.querySelector('.header').style.visibility = "hidden";
        console.log("hey")
        document.querySelector('.upload-wrapper').style.visibility = "hidden";
        document.querySelector('.youtube').style.visibility = "hidden";
        document.querySelector("#findOut").style.visibility = "hidden";
        document.querySelector('.loading-container').style.visibility = "visible";
        document.querySelector('#submitSong').click();
      }
      else{
        return false;
      }
    }

    let youtubeForm = document.querySelector("#youtube-form");
    youtubeForm.onsubmit = function(){
      document.querySelector('.header').style.visibility = "hidden";
      document.querySelector('.upload-wrapper').style.visibility = "hidden";
      document.querySelector('.youtube').style.visibility = "hidden";
      document.querySelector("#findOut").style.visibility = "hidden";
      document.querySelector('.loading-container').style.visibility = "visible";
    }
  }

  if(document.location.pathname === '/check' || document.location.pathname === "/post-youtube-conversion"){
    document.querySelector("#path").value = document.querySelector("#pathToMP3").value;
    var whichValuesCalculated = 0;

    setTimeout(function (event) {
      var fileReq = new XMLHttpRequest();
      fileReq.open("GET",document.querySelector("#pathToMP3").value,true );
      fileReq.responseType = "blob";
      var the_blob;
      fileReq.onload = function(){
        the_blob = fileReq.response;

        if(!the_blob){
          console.log('The blob does not exist!');
        }

        audio.src = URL.createObjectURL(the_blob);
        audio.addEventListener("canplaythrough", audioLoadedHandler, false);
        audio.load();

        document.querySelector('.loading-container').style.visibility = "visible";

        var srcMain = contextMain.createMediaElementSource(audio);
        var analyserMain = contextMain.createAnalyser();

        srcMain.connect(analyserMain);
        analyserMain.connect(contextMain.destination);

        var FFT_SIZE = 256;
        analyserMain.fftSize = FFT_SIZE;

        var bufferLength = analyserMain.frequencyBinCount;
        var totalDataArray = new Uint32Array(bufferLength);

        function valueCalculated () {
          whichValuesCalculated++;
          if (whichValuesCalculated == 4) {
            whichValuesCalculated = 0;
            document.querySelector("#submitData").click();
          }
        }

        //Offline rendering
        function audioLoadedHandler() {
          audio.removeEventListener("canplaythrough", audioLoadedHandler, false);
          console.log("Duration: " + audio.duration);
          document.querySelector("#dur").value = audio.duration;
          valueCalculated();

          var offlineCtx = new OfflineAudioContext(2, 44100 * audio.duration, 44100);
          var srcOffline = offlineCtx.createBufferSource();

          var reader = new FileReader();
          var contents;

          reader.onload = function() {
            contents = this.result;
            contextMain.decodeAudioData(contents, function (buffer) {
              srcOffline.buffer = buffer;
              srcOffline.connect(offlineCtx.destination);

              try {
                var bpm = detect(buffer);
                console.log('BPM: ' + bpm);
                document.querySelector("#the_bpm").value = bpm;
                valueCalculated();
              } catch (err) {
                console.error(err);
                document.querySelector("#errorMessage").style.visibility = "visible";
                document.querySelector("#reload").style.visibility = "visible";
                document.querySelector("#reload-container").style.visibility = "visible";
                document.querySelector("#reload-container").style.display = "inline-block";
                document.querySelector(".loading-container").style.visibility = "hidden";
              }

              //NEW STUFF
              var analyserOffline = offlineCtx.createAnalyser();
              analyserOffline.fftSize = FFT_SIZE;
              var scp = offlineCtx.createScriptProcessor(512, 0, 1);

              srcOffline.connect(analyserOffline);
              scp.connect(offlineCtx.destination);
              var freqData = new Uint8Array(analyserOffline.frequencyBinCount);
              scp.onaudioprocess = function () {
                analyserOffline.getByteFrequencyData(freqData);
                for (var i = 0; i < bufferLength; i++) {
                  totalDataArray[i] += freqData[i];
                }
              };

              srcOffline.start();

              //srcOffline.loop = true;
              offlineCtx.startRendering().then(function (renderedBuffer) {
                //console.log('Rendering completed successfully');
                //console.log(totalDataArray);
                var contextOffline = new (window.AudioContext || window.webkitAudioContext)();
                var song = contextOffline.createBufferSource();
                song.buffer = renderedBuffer;

                //Calculate average frequency
                var freqRangeAvg = 44100 / (FFT_SIZE * 2);
                var freqSum = 0;
                var totalElements = 0;
                var indexOfMode = 0;
                for (var i = 0; i < bufferLength; i++) {
                  freqSum += (freqRangeAvg + (2 * freqRangeAvg * i)) * totalDataArray[i];
                  totalElements += totalDataArray[i];
                  if (totalDataArray[i] > totalDataArray[indexOfMode]) {
                    indexOfMode = i;
                  }
                }
                var avgFreq = freqSum / totalElements;
                console.log("Average Frequency: " + avgFreq);
                document.querySelector("#avg").value = avgFreq;
                valueCalculated();
                var modeFreq = freqRangeAvg + (2 * freqRangeAvg * indexOfMode);
                console.log("Mode Frequency: " + modeFreq);
                document.querySelector('#mode').value = modeFreq;
                valueCalculated();

                song.connect(contextOffline.destination);
              }).catch(function (err) {
                console.log('Rendering failed: ' + err);
                // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
              });
            });
          }

          reader.readAsArrayBuffer(the_blob);
        };
      }

      fileReq.send(null);

    }, 10);
  };
};
