# m3u8-downloader
M3u8 downloader - Multi Thread/Auto Merge/Event Monitor/Custom HTTP Referrer

****Pure Javascript

# How to use

Download m3u8 video files directly 
```shell
npm install -g m3u8-downloader-concurrency 

m3u8-downloader "https://xxx/xxx.m3u8"
# or with output directory
m3u8-downloader "https://xxx/xxx.m3u8" outputDir
# or with proxy
m3u8-downloader "https://xxx/xxx.m3u8" outputDir "http://127.0.0.1:1080"
```

Advanced usage
```shell
npm install --save m3u8-downloader-concurrency 
```

```javascript
let url = 'https://abc.com/video28912030123/index.m3u8'; //required
let outputDir = '/Users/xxxx/Downloads/tmp'; //required

// let outputFileName = 'output.ts'; //optional
// let threadCount = 5; //optional

// let videoUrlDirPath = 'https://abc.com/video28912030123/'; //optional
// let headerReferrer = 'https://abc.com'; //optional
// let videoSuffix = '.ts'; //optional

// let retryOnError = true; //optional

let downloader = require('m3u8-downloader-concurrency')

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

```
