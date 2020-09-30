var timer = 0;
var pauses = 0;

window.addEventListener('load', function() {
    var elem = document.getElementById("myBar");


    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);
            javascriptNode.onaudioprocess = function() {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var values = 0;

                var length = array.length;
                for (var i = 0; i < length; i++) {
                    values += (array[i]);
                }

                var average = Math.round(values / length * 2);
                if (average < 30) {
                    timer += 10;
                } else {
                    timer = 0;
                }
                if (timer == 100) {
                    pauses++;
                    document.getElementById("pauseCount").innerHTML = pauses;
                }

                elem.style.width = average + "%";
                // colorPids(average);
            }
        })
        .catch(function(err) {
            /* handle the error */
        });

});