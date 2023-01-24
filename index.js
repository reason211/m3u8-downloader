#!/usr/bin/env node
const args = require('minimist')(process.argv.slice(2))


let url = args['url'] 
  ? decodeURIComponent( args['url'] )
  : "https://.../xx.m3u8?v=123"; //required
let outputDir = args['out']  || "./" + new Date().getTime();
let proxy = args['proxy'];
let videoSuffix = args['suffix']; // eg '.ts'
let videoUrlDirPath = args['root']; // eg 'https://abc.com/video28912030123/'
let headerReferrer = args['referrer']; // eg 'https://abc.com'
let threadCount = args['threadCount'] || 3;
let debug = args['debug'] == 'false' ? false : true;

// let outputFileName = new Date().getTime() + '.ts'; // eg 'output.ts'

let retryOnError = true; 

let downloader = require('./downloader.js')

let options = {
    url,
    outputDir, //optional
    proxy, //optional
    // outputFileName, //optional
    threadCount, //optional
    videoSuffix, //optional
    videoUrlDirPath, //optional
    headerReferrer, //optional
    retryOnError, //optional
    debug //optional
};


let listener = downloader.download(options)

listener.on('start', function (d) {
    console.log("started downloading");
});

listener.on('progress', function (d) {
    console.log(d);
});


listener.on('downloaded', function (d) {
    console.log('downloaded', d);
});


listener.on('complete', function (d) {
  console.log("done", d);

    //todo
    // ffmpeg - i output.ts - codec copy output.mp4
});

listener.on('error', function (e) {
    console.error('error', e);
});
