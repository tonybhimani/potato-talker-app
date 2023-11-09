document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // libgif.js to handle the Potato Talker gif
    var sup1 = new SuperGif({ gif: document.getElementById("potato"), auto_play: false, frame_delay: 10 } );
    sup1.load(() => {
        // do something after load
    });

    // collection of timeouts for cleanup
    var timeouts = [];

    // handle to the "Say It" button
    var sayit = document.getElementById("sayit");

    // click event for the "Say It" button
    sayit.addEventListener("click", (e) => {
        var saywhat = document.getElementById("saywhat");
        var whatissaid = document.getElementById("whatissaid");
        // make sure you saniatize your input, unlike me
        var saywhat_str = saywhat.value.trim();
        // process the input if there is some
        if (saywhat_str.length > 0) {
            // start the Potato Talker
            sup1.play();
            whatissaid.innerHTML = "";
            sayit.disabled = true;
            var idx = 0;
            // clear any existing timeouts for removing potato jabber
            if (timeouts.length > 0) {
                for (var i = 0; i < timeouts.length; i++) {
                    clearTimeout(timeouts[i]);
                }
                timeouts.length = 0;
            }
            // use TTS plugin for voice
            TTS.speak({
                text: saywhat_str,
                identifier: "", // TODO: deal with this later
                rate: 2.0,
                pitch: 0.2,
                cancel: true
            },
            function() {
                // success
            },
            function(err) {
                // error
            });
            // Potato Talker speaks character by character
            var t1 = setInterval(() => {
                whatissaid.innerHTML += saywhat_str.charAt(idx);
                if (++idx == saywhat_str.length) { 
                    clearInterval(t1);
                    sup1.pause();
                    sup1.move_to(0);
                    sayit.disabled = false;
                    // remove the potato jabber after 3 seconds
                    timeouts.push(
                        setTimeout(() => { 
                            whatissaid.innerHTML = "";
                        }, 3000)
                    );
                }
            }, 50);
        } else {
            // it'd be better if the potato said this
            alert("Type something to say!");
        }
    });
}