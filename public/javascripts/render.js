window.onload = function(){

  var reload = document.querySelector("#reload-container");
  reload.style.display = "inline-block";
  if(document.querySelector("#audio")){
    var contextMain = new AudioContext();
    //contextMain.sampleRate = 44100;
    var srcMain = contextMain.createMediaElementSource(audio);
    var analyserMain = contextMain.createAnalyser();

    srcMain.connect(analyserMain);
    analyserMain.connect(contextMain.destination);

    var FFT_SIZE = 256;
    analyserMain.fftSize = FFT_SIZE;

    var bufferLength = analyserMain.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);
    console.log(dataArray);

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = WIDTH / bufferLength;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      analyserMain.getByteFrequencyData(dataArray);
      x = 0;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;

        ctx.fillStyle = "#EE3479";
        ctx.fillRect(x, HEIGHT-barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    document.querySelector('#reload-container').style.display = "inline-block";
    document.querySelector(".hit").style.display = "inline-block";
    document.querySelector('#canvas').style.border = "2px solid #303B8F"
    document.querySelector("#audio").style.display = "inline-block";
    audio.play();
    renderFrame();
  }

  reload.addEventListener("click", function reloadPage(){
    location.assign('/');
  }, false);



}
