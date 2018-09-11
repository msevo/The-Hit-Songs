var ml = require('machine_learning');
var ml_knn = require('ml-knn');
var csvParser = require('./csvToArray.js');
var fs = require('fs');
var csv = require("fast-csv");



var data = [];
var numHitSongs = 0;
var numNotHitSongs = 0;

csv
 .fromPath("hitSongsData.csv")
 .on("data", function(data2){
     data.push(data2);
     numHitSongs++;
 });

csv
.fromPath("notHitSongsData.csv")
.on("data", function(data2){
    data.push(data2);
    numNotHitSongs++;
})
.on("end", function(){
    console.log(data);

    var result =  [];
    for (var i = 0; i < numHitSongs; i++) {
      result.push(1);
    }

    for (var i = 0; i < numNotHitSongs; i++) {
      result.push(0);
    }
    //console.log(y);

    var knn = new ml_knn(data, result);
    //var ans = knn.predict([[247.56565,120,8021.40091116714,258.3984375]]);
    //console.log(ans);
    //console.log(knn.predict([[224,  160, 6474, 258]])[0]);
    module.exports.predictHit = function (value1,  value2, value3, value4) {
      console.log(value1);
      console.log(value2);
      console.log(value3);
      console.log(value4);
      var temp = [Number(value1), Number(value2), Number(value3), Number(value4)];
      console.log(temp);
      console.log(knn.predict([temp]));
      return knn.predict([temp]);
    }

/*
    var svm = new ml.SVM({
        x : x,
        y : y
    });

    svm.train({
        C : 1.1, // default : 1.0. C in SVM.
        tol : 1e-5, // default : 1e-4. Higher tolerance --> Higher precision
        max_passes : 20, // default : 20. Higher max_passes --> Higher precision
        alpha_tol : 1e-5, // default : 1e-5. Higher alpha_tolerance --> Higher precision

        kernel : { type: "polynomial", c: 1, d: 5}
        // default : {type : "gaussian", sigma : 1.0}
        // {type : "gaussian", sigma : 0.5}
        // {type : "linear"} // x*y
        // {type : "polynomial", c : 1, d : 8} // (x*y + c)^d
        // Or you can use your own kernel.
        // kernel : function(vecx,vecy) { return dot(vecx,vecy);}
    });

    /*module.exports.predictHit = function (value1,  value2, value3, value4) {
      return svm.predict([value1,  value2, value3, value4]);
    }*/

    //console.log("Predict : ",svm.predict([304.639878, 177, 6771.367108195432, 258.3984375]));
    /*var data = [[1,0,1,0,1,1,1,0,0,0,0,0,1,0],
            [1,1,1,1,1,1,1,0,0,0,0,0,1,0],
            [1,1,1,0,1,1,1,0,1,0,0,0,1,0],
            [1,0,1,1,1,1,1,1,0,0,0,0,1,0],
            [1,1,1,1,1,1,1,0,0,0,0,0,1,1],
            [0,0,1,0,0,1,0,0,1,0,1,1,1,0],
            [0,0,0,0,0,0,1,1,1,0,1,1,1,0],
            [0,0,0,0,0,1,1,1,0,1,0,1,1,0],
            [0,0,1,0,1,0,1,1,1,1,0,1,1,1],
            [0,0,0,0,0,0,1,1,1,1,1,1,1,1],
            [1,0,1,0,0,1,1,1,1,1,0,0,1,0]
           ];
           */
    //var result = [23,12,23,23,45,70,123,73,146,158,64];

});
