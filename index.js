#!/usr/bin/env node
const args = require('minimist')(process.argv.slice(2))


args['url'] = args['url'] || args._[0];
args['out'] = args['out'] || args._[1];
args['proxy'] = args['proxy'] || args._[2];
args['suffix'] = args['suffix'] || args._[3];
args['root'] = args['root'] || args._[4];


let url = args['url'] 
  ? decodeURIComponent( args['url'] )
  : "https://.../xx.m3u8?v=123"; //required
let outputDir = args['out']  || "./" + new Date().getTime();
let proxy = args['proxy'];
let videoSuffix = args['suffix'] || '.ts';
let videoUrlDirPath = args['root'];


console.log(url, outputDir, proxy);

// let outputFileName = 'output.ts'; //optional
// let threadCount = 5; //optional

// let videoUrlDirPath = 'https://abc.com/video28912030123/'; //optional
// let headerReferrer = 'https://abc.com'; //optional
// let videoSuffix = '.ts'; //optional

// let retryOnError = true; //optional

let downloader = require('./downloader.js')

let listener = downloader.download({
    url,
    outputDir,
    proxy,
    // outputFileName,
    // threadCount,
    videoSuffix,
    videoUrlDirPath,
    // headerReferrer,
    // retryOnError
})

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
