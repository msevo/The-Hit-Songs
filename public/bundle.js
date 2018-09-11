/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bpmDetective = __webpack_require__(1);

var _bpmDetective2 = _interopRequireDefault(_bpmDetective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Importing convertVideo to convert youtube links to mp3
//import Downloader from './downloader.js'

window.onload = function () {
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var contextMain = new AudioContext();
  var submitSong = document.querySelector("#submitYoutubeForm");

  if (document.location.pathname === '/') {
    file.onclick = function () {
      document.querySelector("#findOut").style.visibility = "visible";
    };

    document.querySelector("#linkInput").oninput = function () {
      document.querySelector("#findOut").style.visibility = "visible";
    };

    document.querySelector("#findOut").onclick = function () {
      if (submitSong.click()) {
        document.querySelector('.header').style.visibility = "hidden";
        document.querySelector('.upload-wrapper').style.visibility = "hidden";
        document.querySelector('.youtube').style.visibility = "hidden";
        document.querySelector("#findOut").style.visibility = "hidden";
        document.querySelector('.loading-container').style.visibility = "visible";
        submitSong.click();
      } else if (document.querySelector('#submitSong').click()) {
        document.querySelector('.header').style.visibility = "hidden";
        console.log("hey");
        document.querySelector('.upload-wrapper').style.visibility = "hidden";
        document.querySelector('.youtube').style.visibility = "hidden";
        document.querySelector("#findOut").style.visibility = "hidden";
        document.querySelector('.loading-container').style.visibility = "visible";
        document.querySelector('#submitSong').click();
      } else {
        return false;
      }
    };

    var youtubeForm = document.querySelector("#youtube-form");
    youtubeForm.onsubmit = function () {
      document.querySelector('.header').style.visibility = "hidden";
      document.querySelector('.upload-wrapper').style.visibility = "hidden";
      document.querySelector('.youtube').style.visibility = "hidden";
      document.querySelector("#findOut").style.visibility = "hidden";
      document.querySelector('.loading-container').style.visibility = "visible";
    };
  }

  if (document.location.pathname === '/check' || document.location.pathname === "/post-youtube-conversion") {
    document.querySelector("#path").value = document.querySelector("#pathToMP3").value;
    var whichValuesCalculated = 0;

    setTimeout(function (event) {
      var fileReq = new XMLHttpRequest();
      fileReq.open("GET", document.querySelector("#pathToMP3").value, true);
      fileReq.responseType = "blob";
      var the_blob;
      fileReq.onload = function () {
        the_blob = fileReq.response;

        if (!the_blob) {
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

        function valueCalculated() {
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

          reader.onload = function () {
            contents = this.result;
            contextMain.decodeAudioData(contents, function (buffer) {
              srcOffline.buffer = buffer;
              srcOffline.connect(offlineCtx.destination);

              try {
                var bpm = (0, _bpmDetective2.default)(buffer);
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
                  freqSum += (freqRangeAvg + 2 * freqRangeAvg * i) * totalDataArray[i];
                  totalElements += totalDataArray[i];
                  if (totalDataArray[i] > totalDataArray[indexOfMode]) {
                    indexOfMode = i;
                  }
                }
                var avgFreq = freqSum / totalElements;
                console.log("Average Frequency: " + avgFreq);
                document.querySelector("#avg").value = avgFreq;
                valueCalculated();
                var modeFreq = freqRangeAvg + 2 * freqRangeAvg * indexOfMode;
                console.log("Mode Frequency: " + modeFreq);
                document.querySelector('#mode').value = modeFreq;
                valueCalculated();

                song.connect(contextOffline.destination);
              }).catch(function (err) {
                console.log('Rendering failed: ' + err);
                // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
              });
            });
          };

          reader.readAsArrayBuffer(the_blob);
        };
      };

      fileReq.send(null);
    }, 10);
  };
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).default;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = detect;
var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;

/**
 * Detect BPM of a sound source
 * @param  {AudioBuffer} buffer Sound to process
 * @return {Promise}            Resolved to detected BPM
 */

function detect(buffer) {
  var source = getLowPassSource(buffer);

  /**
   * Schedule the sound to start playing at time:0
   */

  source.start(0);

  /**
   * Pipe the source through the program
   */

  return [findPeaks, identifyIntervals, groupByTempo(buffer.sampleRate), getTopCandidate].reduce(function (state, fn) {
    return fn(state);
  }, source.buffer.getChannelData(0));
}

/**
 * Sort results by count and return top candidate
 * @param  {Object} Candidate
 * @return {Number}
 */

function getTopCandidate(candidates) {
  return candidates.sort(function (a, b) {
    return b.count - a.count;
  }).splice(0, 5)[0].tempo;
}

/**
 * Apply a low pass filter to an AudioBuffer
 * @param  {AudioBuffer}            buffer Source AudioBuffer
 * @return {AudioBufferSourceNode}
 */

function getLowPassSource(buffer) {
  var length = buffer.length,
      numberOfChannels = buffer.numberOfChannels,
      sampleRate = buffer.sampleRate;

  var context = new OfflineContext(numberOfChannels, length, sampleRate);

  /**
   * Create buffer source
   */

  var source = context.createBufferSource();
  source.buffer = buffer;

  /**
   * Create filter
   */

  var filter = context.createBiquadFilter();
  filter.type = 'lowpass';

  /**
   * Pipe the song into the filter, and the filter into the offline context
   */

  source.connect(filter);
  filter.connect(context.destination);

  return source;
}

/**
 * Find peaks in sampleRate
 * @param  {Array} data Bugger channel data
 * @return {Array}      Peaks found that are greater than the threshold
 */

function findPeaks(data) {
  var peaks = [];
  var threshold = 0.9;
  var minThresold = 0.3;
  var minPeaks = 15;

  /**
   * Keep looking for peaks lowering the threshold until
   * we have at least 15 peaks (10 seconds @ 90bpm)
   */

  while (peaks.length < minPeaks && threshold >= minThresold) {
    peaks = findPeaksAtThreshold(data, threshold);
    threshold -= 0.05;
  }

  /**
   * Too fiew samples are unreliable
   */

  if (peaks.length < minPeaks) {
    throw new Error('Could not find enough samples for a reliable detection.');
  }

  return peaks;
}

/**
 * Function to identify peaks
 * @param  {Array}  data      Buffer channel data
 * @param  {Number} threshold Threshold for qualifying as a peak
 * @return {Array}            Peaks found that are grater than the threshold
 */

function findPeaksAtThreshold(data, threshold) {
  var peaks = [];

  /**
   * Identify peaks that pass the threshold, adding them to the collection
   */

  for (var i = 0, l = data.length; i < l; i += 1) {
    if (data[i] > threshold) {
      peaks.push(i);

      /**
       * Skip forward ~ 1/4s to get past this peak
       */

      i += 10000;
    }
  }

  return peaks;
}

/**
 * Identify intervals between peaks
 * @param  {Array} peaks Array of qualified peaks
 * @return {Array}       Identifies intervals between peaks
 */

function identifyIntervals(peaks) {
  var intervals = [];

  peaks.forEach(function (peak, index) {
    var _loop = function _loop(i) {
      var interval = peaks[index + i] - peak;

      /**
       * Try and find a matching interval and increase it's count
       */

      var foundInterval = intervals.some(function (intervalCount) {
        if (intervalCount.interval === interval) {
          return intervalCount.count += 1;
        }
      });

      /**
       * Add the interval to the collection if it's unique
       */

      if (!foundInterval) {
        intervals.push({
          interval: interval,
          count: 1
        });
      }
    };

    for (var i = 0; i < 10; i += 1) {
      _loop(i);
    }
  });

  return intervals;
}

/**
 * Factory for group reducer
 * @param  {Number} sampleRate Audio sample rate
 * @return {Function}
 */

function groupByTempo(sampleRate) {

  /**
   * Figure out best possible tempo candidates
   * @param  {Array} intervalCounts List of identified intervals
   * @return {Array}                Intervals grouped with similar values
   */

  return function (intervalCounts) {
    var tempoCounts = [];

    intervalCounts.forEach(function (intervalCount) {
      if (intervalCount.interval !== 0) {
        /**
         * Convert an interval to tempo
         */

        var theoreticalTempo = 60 / (intervalCount.interval / sampleRate);

        /**
         * Adjust the tempo to fit within the 90-180 BPM range
         */

        while (theoreticalTempo < 90) {
          theoreticalTempo *= 2;
        }while (theoreticalTempo > 180) {
          theoreticalTempo /= 2;
        } /**
           * Round to legible integer
           */

        theoreticalTempo = Math.round(theoreticalTempo);

        /**
         * See if another interval resolved to the same tempo
         */

        var foundTempo = tempoCounts.some(function (tempoCount) {
          if (tempoCount.tempo === theoreticalTempo) {
            return tempoCount.count += intervalCount.count;
          }
        });

        /**
         * Add a unique tempo to the collection
         */

        if (!foundTempo) {
          tempoCounts.push({
            tempo: theoreticalTempo,
            count: intervalCount.count
          });
        }
      }
    });

    return tempoCounts;
  };
}

/***/ })
/******/ ]);