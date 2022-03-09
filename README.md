# m3u8-downloader
M3u8 downloader - Multi Thread/Auto Merge/Event Monitor/Custom HTTP Referrer/Support HTTP Proxy

****Pure Javascript

# How to use

Download m3u8 video files directly 
```shell
npm install -g m3u8-downloader-concurrency 

m3u8-downloader --url="https://xxx/xxx.m3u8"
# or with proxy
m3u8-downloader --url="https://xxx/xxx.m3u8" --proxy="http://127.0.0.1:1080" 
```


# options
## --out=outputDir 

Specify the download output directory

## --proxy="http://127.0.0.1:1080" 

Specify the proxy to use

## --suffix=".ts" 

Specify the suffix name of the video fragment to download

## --root="https://abc.com/video28912030123/" 

Specify the URL Root address of the video fragment to download


# Advanced usage
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

// let proxy = '127.0.0.1:1080'; //optional

let downloader = require('m3u8-downloader-concurrency')

let listener = downloader.download({
    url,
    outputDir,
    // proxy,
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
