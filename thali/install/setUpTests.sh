#!/usr/bin/env bash
cd ../../test/TestServer
jx npm install
jx generateServerAddress.js
cd ../../..
cordova create ThaliTest com.test.thalitest ThaliTest
mkdir -p ThaliTest/thaliDontCheckIn/localdev
cp -r Thali_CordovaPlugin/test/www/ ThaliTest/www
cd ThaliTest/www/jxcore
cordova platform add ios
cordova platform add android
jx npm install ../../../Thali_CordovaPlugin/thali --save --autoremove "*.gz"
# SuperTest which is used by some of the BVTs include a PEM file (for private keys) that makes Android unhappy
# so we remove it below in addition to the gz files.
jx npm install --autoremove "*.gz,*.pem"
# In theory we don't need the line below because we use autoremove but for some reason autoremove doesn't
# seem to work in this case.
find . -name "*.gz" -delete
cp $1 app.js
cordova build android --release --device
# cordova build ios --device
echo "Remember to start the test coordination server by running jx index.js"
