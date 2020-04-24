let url = 'https://abc.com/video28912030123/index.m3u8';//required
let outputDir = '/Users/xxxx/Downloads/tmp';//required

// let threadCount = 5; //optional

// let videoUrlDirPath = 'https://abc.com/video28912030123/'; //optional
// let headerReferrer = 'https://abc.com'; //optional
// let videoSuffix = '.ts'; //optional

// let retryOnError = true; //optional

let downloader = require('./downloader')

let listener = downloader.download({
    url,
    outputDir,
    // threadCount,
    // videoSuffix,
    // videoUrlDirPath,
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
    console.log('done', d);
});

listener.on('error', function (e) {
    console.error('error', e);
});
