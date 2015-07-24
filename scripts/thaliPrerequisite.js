#!/usr/bin/env node
/*
 This script will do the following tasks
 0. Clone the working jxcore-cordova plugin
 1. Fix issue on "can not replace existing file"
 2. Install the thali node module to global (until we get thali in npm repo)
 3. Move the build-extras.gradle to platform
 4: Create a dummy file to prevent future execution by other plugin add operation
 */


var fs = require('fs');
var exec = require('child_process').execSync;


var rootdir = process.argv[2];
//Dummy file to prevent the execution of this script when the developer add other Cordova plugins
var dummyFile = rootdir + '/../plugins/org.thaliproject.p2p/dummy.js';

//Replace JXcoreExtension.java
//Copy from \plugins\org.thaliproject.p2p\src\android\java\io\jxcore\node to \platforms\android\src\io\jxcore\node
function replaceJXCoreExtension(){
    var sourceFile =  rootdir + '/../plugins/org.thaliproject.p2p/src/android/java/io/jxcore/node/JXcoreExtension.java';
    var targetFile = rootdir + '/../platforms/android/src/io/jxcore/node/JXcoreExtension.java';
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
}

//Check whether this is the first time this script is getting executed or not
//When ever this script run, it creates the dummyfile at the end of execution
function isFirstTime(){
    if (fs.existsSync(dummyFile))
        return false;
    else
        return true;
}


//Install thali node modules to global
//once we have the thali module available in npm repo, this is step is not required
function installThaliModules(){
    var thaliPath = rootdir + '/../plugins/org.thaliproject.p2p/thali';
    var currentFolder = process.cwd();
    process.chdir(thaliPath);
    //exec('jx install -g --autoremove "*.gz"'); // https://github.com/jxcore/jxcore/issues/429
    exec('jx install -g');
    process.chdir(currentFolder);
}


//TODO: This is a temporary fix, and we don't require this method once we get the JXCore fix in master
//Uncomment the dependency section in plugin.xml while removing this method
function updateJXCore(){
    process.chdir(process.cwd());
    console.log('Cloning the jxcore-cordova repo (380MB size)..it might take a while. Please be patient..');
    exec('git clone -b 0.0.3-dev --single-branch https://github.com/jxcore/jxcore-cordova.git');
    // Another temporary fix to prevent this script is getting called during the following 'plugin add'
    fs.writeFileSync(dummyFile, '', 'utf8');
    exec('cordova plugin add jxcore-cordova');
}

//Copy the build-extras.gradle
//Copy from \plugins\org.thaliproject.p2p\build to \platforms\android
function copyBuildExtras(){
    var sourceFile =  rootdir + '/../plugins/org.thaliproject.p2p/build/build-extras.gradle';
    var targetFile = rootdir + '/../platforms/android/build-extras.gradle';
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
}


if(isFirstTime())
    console.log('Starting the Thali_Cordova plugin pre-requisites configuration..');
else
    return;

//0. Update the jxcore-cordova plugin from the working branch
console.log('Updating JXcore-Cordova..');
updateJXCore();

//1. Fix issue on "can not replace existing file"
console.log('Replacing JXcoreExtension.java..');
replaceJXCoreExtension();

//2. Install the thali node module to global (until we get thali in npm repo)
console.log('Installing thali node modules to global..');
installThaliModules();

//3. Move the build-extras.gradle to platform
console.log('Copying the build-extras.gradle to platform..');
copyBuildExtras();

//4. Creating a dummy file to prevent the future execution of the entire script
console.log('Completed the Thali_Cordova plugin Pre-requisites configuration..');
fs.writeFileSync(dummyFile, '', 'utf8');




