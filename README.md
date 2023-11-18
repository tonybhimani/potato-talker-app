# Potato Talker App

## speech-input branch

![Poatato Talker Preview](https://github.com/tonybhimani/potato-talker-app/blob/7e1e2911f5b1813e5043b5df02dc7d3d40d9864a/preview.gif?raw=true)

How to describe this app... It was a "hey, I want you to add a talking avatar to your sound recorder" but then I decided to take that idea and make it an app. Basically, it's an app that has an animated GIF, text field for input, and tele-types / prints the same message like a parrot, meanwhile the GIF plays with the Potato's mouth flapping as if he's saying it.

The package uses libgif-js (SuperGif) for playing/pausing the animated GIF, and basic Javascript for the rest, bootstrap to doll it up, all baked in Cordova that I built for Android. You could build it for iOS too if you want.

**Resources**

libgif-js
https://github.com/buzzfeed/libgif-js

Potato GIF
https://tenor.com/view/potato-talk-blob-face-speak-gif-22490759

So how to get it all running? First you need Node, Cordova, etc then follow this

```
git clone https://github.com/tonybhimani/potato-talker-app.git
cd potato-talker-app
npm install
cordova plugin add cordova-plugin-speech
cordova platform add android
```

then you can build and run it on Android

```
cordova run android
```

## Updates

- 11/17/2023 - First release of this branch.

## Branches

I've decided to have different branches of this project for each version instead of overwriting previous changes. Also, if I put out releases they can be for each branch intead of a jumbled mess of choices. That being said, the branches are:

- **main**: User text input, `cordova-plugin-tts-advanced` for speech processing, the potato will be a parrot to what is typed.
- **speech-input**: User verbal input, `cordova-plugin-speech` for speech and voice input processing, the potato will be a parrot to what is spoken.
- **chatbot-gpt**: User verbal input, `cordova-plugin-speech` for speech and voice input processing, the potato will attempt to generate responses from ChatGPT.
- **chatbot-tf**: User verbal input, `cordova-plugin-speech` for speech and voice input processing, the potato will attempt to generate responses from TensorFlow.

That's a glimpse at my roadmap although nothing is set in stone.

## Conclusion

Note: I modded the libgif-js script to include an optional config parameter called `frame_delay` so that the default GIF animation speed can be overridden.

TODOs: Fix the text wrap ~~then add in some text-to-speech capability~~. If I wanted to go hardcore then I'd give the Potato Talker some intelligence with ChatGPT.

Happy coding!
