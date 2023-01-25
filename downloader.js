let fs = require('fs')
let request = require('request');

let EventEmitter = require('events').EventEmitter;
let eventEmitter = new EventEmitter()

let downloadOptions = {
    url : '',
    outputDir : '',
    outputFileName :  new Date().getTime() + '.ts',
    threadCount : 5,
    videoSuffix : '',
    videoUrlDirPath : '',
    headerReferrer : '',
    retryOnError:true,
    proxy:null,
    debug:false
}

function loadM3u8(onLoad) {
    let options = {
        method: 'GET',
        url: downloadOptions.url,
        headers: {
            Referer: downloadOptions.headerReferrer
        },
        proxy: downloadOptions.proxy
    };
    request(options, function (error, response) {


        if (error){
            eventEmitter.emit('error', error);
            return
        }

        if( downloadOptions.debug ){
            console.log('M3u8 url res:', response.body);
        }
        

        let lines = response.body.split('\n')
        let files = []
        lines.forEach(line => {
            let videoSuffix = downloadOptions.videoSuffix;
            let videoUrlDirPath = downloadOptions.videoUrlDirPath;

             if ( !videoSuffix || (
                    line.endsWith(videoSuffix) || line.includes(videoSuffix + "?")
               )
             ) {
                if( line.startsWith('#') ){
                    return;
                }

                if( line.startsWith('http://') || line.startsWith('https://') ){
                    files.push(line);
                }else{
                    let file =
                    (videoUrlDirPath.endsWith("/")
                      ?videoUrlDirPath
                      :  videoUrlDirPath + "/" ) + line.replace(/^\//,'');
   
                    files.push(file);
                }
            
             }
        });

        onLoad(files)
    });
}



function downloadVideoFile(url) {
    return new Promise( (resolve,reject) => {
        let proxy = downloadOptions.proxy;
        let headerReferrer = downloadOptions.headerReferrer;
        let outputDir = downloadOptions.outputDir;

        let options = {
            method: 'GET',
            url: url,
            encoding: null,
            headers: {
                Referer: headerReferrer
            },
            proxy
        };
        request(options, function (error, response) {
            if (error){
                eventEmitter.emit('error', error);
                return reject(url)
            }
            // console.log(response.body);
            let fileName = url.split('/').pop();
            fs.writeFileSync(outputDir + '/' + fileName, response.body);

            resolve();
        });
    })
}

let startTasks = (taskList, taskHandlePromise, limit = 3) => {
    let retryOnError = downloadOptions.retryOnError;

    let _runTask = (arr) => {
        // console.debug('Progress: ' + ((taskList.length - arr.length) / taskList.length * 100).toFixed(2) + '%')
        eventEmitter.emit('progress', parseInt((taskList.length - arr.length) / taskList.length * 100));

        return taskHandlePromise(arr.shift())
            .then(() => {

                if (arr.length !== 0) return _runTask(arr)
            }).catch( ( item )=>{
                if (retryOnError ){
                    arr.push(item)

                    return _runTask(arr)
                }

            })
    };

    let listCopy = [].concat(taskList);
    let asyncTaskList = []
    while (limit > 0 && listCopy.length > 0) {
        asyncTaskList.push(_runTask(listCopy));
        limit--
    }

    return Promise.all(asyncTaskList);
}

function mergeFiles(list) {
    let outputDir = downloadOptions.outputDir;
    let outFile = outputDir + '/' + downloadOptions.outputFileName;

    if( fs.existsSync(outFile) ){
        fs.unlinkSync(outFile);
    }


    list.forEach(url => {
        let fileName = url.split('/').pop();
        let result = fs.readFileSync(outputDir + '/' + fileName);
        fs.unlinkSync(outputDir + "/" + fileName);

        fs.appendFileSync(outFile, result)
    });

    eventEmitter.emit('complete', outFile)
}

function download(options) {
    setImmediate(()=>{
        downloadOptions = Object.assign( downloadOptions, options);
        
 
        console.log('DEBUG', downloadOptions.debug);

        
        if(downloadOptions.debug){
            console.log('Download options:' , downloadOptions);
        }
        

        if( !downloadOptions.videoUrlDirPath ){
            downloadOptions.videoUrlDirPath = downloadOptions.url.substring(0, downloadOptions.url.lastIndexOf('/')) + '/';
        }

        if (!fs.existsSync(downloadOptions.outputDir)) {
            fs.mkdirSync(downloadOptions.outputDir);
        }


        loadM3u8((list) => {
            eventEmitter.emit('progress', 0);
            // mergeFiles(list)
            startTasks(list, downloadVideoFile, downloadOptions.threadCount).then(()=>{
                eventEmitter.emit('downloaded', list);

                mergeFiles(list)
            })
        })

        eventEmitter.emit('start', downloadOptions);
    })
    return eventEmitter;
}

module.exports = {download};