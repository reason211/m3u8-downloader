var fs = require('fs')
var request = require('request');

var EventEmitter = require('events').EventEmitter;
eventEmitter = new EventEmitter()

function loadM3u8(onLoad) {
    var options = {
        'method': 'GET',
        'url': m3u8Url,
        'headers': {
            'Referer': headerReferrer
        },
        proxy
    };
    request(options, function (error, response) {


        if (error){
            eventEmitter.emit('error', error);
            return
        }
        // console.log(response.body);
        lines = response.body.split('\n')
        files = []
        lines.forEach(line => {
             if (
               line.endsWith(videoSuffix) ||
               line.includes(videoSuffix + "?")
             ) {
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
        var options = {
            'method': 'GET',
            'url': url,
            'encoding': null,
            'headers': {
                'Referer': headerReferrer
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

    let outFile = outputDir + '/' + outputFileName;

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
        ({
            url:m3u8Url = '',
            outputDir = '',
            outputFileName =  new Date().getTime() + '.ts',
            threadCount = 5,
            videoSuffix = '.ts',
            videoUrlDirPath = '',
            headerReferrer = '',
            retryOnError=true,
            proxy=null
        } = options )

        if( !videoUrlDirPath ){
            videoUrlDirPath = m3u8Url.substr(0, m3u8Url.lastIndexOf('/')) + '/';
        }

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }


        loadM3u8((list) => {
            eventEmitter.emit('progress', 0);
            // mergeFiles(list)
            startTasks(list, downloadVideoFile, threadCount).then(()=>{
                eventEmitter.emit('downloaded', list);

                mergeFiles(list)
            })
        })

        eventEmitter.emit('start', options);
    })
    return eventEmitter;
}

module.exports = {download};