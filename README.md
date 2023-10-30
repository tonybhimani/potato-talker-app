# Potato Talker App
How to describe this app... It was a "hey, I want you to add a talking avatar to your sound recorder" but then I decided to take that idea and make it an app. Basically, it's a an app that has an animated GIF, text field for input, and tele-types / prints the same message like a parrot, meanwhile the GIF plays with the Potato's mouth flapping as if he's saying it.

The package uses libgif-js (SuperGif) for playing/pausing the animated GIF, and basic Javascript for the rest, bootstrap to doll it up, all baked in Cordova that I built for Android. You could build it for IOS too if you want.

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
cordova platform add browser
cordova platform add android

```

then you can run it in the browser or build it for Android

```
cordova run browser
cordova run android
```

Note: I modded the libgif-js script to include an optional config parameter called `frame_delay` so that the default GIF animation speed can be overridden.

TODOs: Fix the text wrap then add in some text-to-speech capability. If I wanted to go hardcore then I'd give the Potato Talker some inteeligence with ChatGPT.

Happy coding!