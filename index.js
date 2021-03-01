let url = process.argv[2]
  ? process.argv[2].replace("\\", "")
  : "https://.../xx.m3u8?v=123"; //required


let outputDir = process.argv[3]
  ? process.argv[3]
  : "./" + new Date().getTime(); //required

console.log(url, outputDir);

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
    // outputFileName,
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
