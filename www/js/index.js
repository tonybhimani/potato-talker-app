// default app settings
var settings = {
  identifier: "",
  rate: 2.0,
  pitch: 0.02,
};

// get app settings from storage
function getSettings() {
  // these settings should tamper-tested before usage
  settings.identifier =
    window.localStorage.getItem("identifier") || settings.identifier;
  settings.rate = window.localStorage.getItem("rate") || settings.rate;
  settings.pitch = window.localStorage.getItem("pitch") || settings.pitch;
}

// save app settings to storage
function setSettings() {
  // these settings should be tamper-tested before saving
  window.localStorage.setItem("identifier", settings.identifier);
  window.localStorage.setItem("rate", settings.rate);
  window.localStorage.setItem("pitch", settings.pitch);
}

// add event listeners
//  the resume and pause events technically aren't necessary since the
//  settings are saved upon change, BUT they're here anyway
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("resume", getSettings, false);
document.addEventListener("pause", setSettings, false);

// where the magic happens...
function onDeviceReady() {
  // libgif.js to handle the Potato Talker gif
  //   TODO: dynamically update the frame_delay per the speech rate so the lip-syncing is more approximate
  var sup1 = new SuperGif({
    gif: document.getElementById("potato"),
    auto_play: false,
    frame_delay: 10,
  });
  sup1.load(() => {
    // do something after load
  });

  // collection of timeouts for cleanup
  var timeouts = [];

  // handle to the "Repeat This" button
  const repeatthis = document.getElementById("repeatthis");

  // handle to the spoken text div
  const whatissaid = document.getElementById("whatissaid");

  // handles to the voice identifiers, rate, and pitch
  const tts_identifiers = document.getElementById("tts_identifiers");
  const tts_rate = document.getElementById("tts_rate");
  const tts_pitch = document.getElementById("tts_pitch");
  const tts_rate_text = document.getElementById("tts_rate_text");
  const tts_pitch_text = document.getElementById("tts_pitch_text");

  // load saved settings
  getSettings();

  // get tts identifiers
  Speech.getSupportedVoices(
    function (voices) {
      for (i = 0; i < voices.length; i++) {
        var opt = document.createElement("option");
        opt.value = voices[i].name;
        opt.innerHTML = voices[i].name + " (" + voices[i].language + ")";
        tts_identifiers.appendChild(opt);
      }
      // set the identifier from settings
      tts_identifiers.value = settings.identifier;
    },
    function (err) {
      alert("Speech.getSupportedVoices Failed: " + err);
    }
  );

  // set the rate and pitch control values
  tts_rate_text.innerText = tts_rate.value = settings.rate;
  tts_pitch_text.innerText = tts_pitch.value = settings.pitch;

  // change event for Identifiers list
  tts_identifiers.addEventListener("change", (e) => {
    settings.identifier = tts_identifiers.value;
    console.log("TTS Identifier: " + tts_identifiers.value);
    setSettings();
  });

  // input event for Rate slider (real-time change)
  tts_rate.addEventListener("input", (e) => {
    settings.rate = tts_rate.value;
    tts_rate_text.innerText = tts_rate.value;
    console.log("TTS Rate: " + tts_rate.value);
  });

  // change event for Rate slide (Regis final answer)
  tts_rate.addEventListener("change", (e) => {
    // it's better to save here once the user has finished dragging
    setSettings();
  });

  // input event for Pitch slider (real-time change)
  tts_pitch.addEventListener("input", (e) => {
    settings.pitch = tts_pitch.value;
    tts_pitch_text.innerText = tts_pitch.value;
    console.log("TTS Pitch: " + tts_pitch.value);
  });

  // change event for Pitch slide (Regis final answer)
  tts_pitch.addEventListener("change", (e) => {
    // it's better to save here once the user has finished dragging
    setSettings();
  });

  // animate the potato gif and button changes
  function talk(isTalking = true) {
    if (isTalking) {
      sup1.play();
    } else {
      sup1.pause();
      sup1.move_to(0);
      repeatthis.disabled = false;
    }
    // reset button regardless
    repeatthis.innerHTML = "Repeat This";
    repeatthis.className = "btn btn-primary";
  }

  // click event for the "Repeat This" button
  repeatthis.addEventListener("click", (e) => {
    // use the settings from the tts controls
    const speechOptions = {
      speechRate: tts_rate.value,
      pitchRate: tts_pitch.value,
      language: tts_identifiers.value,
    };

    // change the button once it's clicked
    repeatthis.disabled = true;
    repeatthis.innerHTML = "I'm Listening...";
    repeatthis.className = "btn btn-success";

    // start the speech recognition
    Speech.startRecognition(
      function (success) {
        console.log("Speech.startRecognition Success", JSON.stringify(success));
        // take the speech input's text and print it
        var idx = 0;
        whatissaid.innerHTML = "";
        // clear any existing timeouts for removing potato jabber
        if (timeouts.length > 0) {
          for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
          }
          timeouts.length = 0;
        }
        // Potato Talker speaks character by character
        var t1 = setInterval(() => {
          whatissaid.innerHTML += success.text.charAt(idx);
          if (++idx == success.text.length) {
            clearInterval(t1);
            talk(false);
            // remove the potato jabber after 3 seconds
            timeouts.push(
              setTimeout(() => {
                whatissaid.innerHTML = "";
              }, 3000)
            );
          }
        }, 50);
        // take the speech input and the Potato says it
        Speech.speakOut(
          success.text,
          function (success) {
            console.log("Speech.speakOut Success", success);
            talk(success == "tts-start");
          },
          function (err) {
            console.error("Speech.speakOut Error", err);
            talk(false);
          },
          speechOptions
        );
      },
      function (err) {
        console.error("Speech.startRecognition Error", err);
        // permission denied if the microphone permission isn't granted
        //   otherwise, the Potato doesn't understand the speech input
        const message =
          err.toLowerCase() != "permission denied"
            ? "I don't understand gibberish"
            : "Check your microphone permission";
        // say the message
        Speech.speakOut(
          message,
          function (success) {
            console.log("Speech.speakOut Success", success);
            talk(success == "tts-start");
          },
          function (err) {
            console.error("Speech.speakOut Error", err);
            talk(false);
          },
          speechOptions
        );
      }
    );
  });
}
