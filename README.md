## RUN THROUGH EXPO GO
Should work on node version = `18.20.5`, `20.18.0`, ` 22.9.0`
Try run `npm run start` - depending on machine it might work without `cross-env` setup
`If error log has java.net.ConnectException: failed to connect to...` then try `cross-env`
Cross env: Run `npm install cross-env --save-dev` and then `npm run start-with-cross-env`
Video tutorial: `https://www.youtube.com/watch?v=p75oQTJaLGo`

## BUILD ANDROID OVER EXPO GO
`eas build --platform android --profile preview` - builds `.apk`
`eas build --platform android --production preview` - builds `.apk`