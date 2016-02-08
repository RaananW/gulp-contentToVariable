# gulp-contentToVariable
A gulp plugin to convert file contents to JS variables. 
The main usage is to create inline workers (as described here - https://blog.raananweber.com/2015/05/30/web-worker-without-a-separate-file/)

## What does it do exactly?!

Let's say we have a few js files that we want to use as a worker:

*worker.js* is an echo-worker:
```javascript
self.onmessage = function(event) { 
    postMessage(event.data); 
}
```
in *main.js* we can load it like this:
```javascript
var worker = new Worker('worker.js');

worker.addEventListener('message', function(msg) {
  console.log('Worker sent: ' + msg.data);
}, false);

worker.postMessage('Hello worker'); // Send data to our worker.
```
But if we want to deliver a single file, we will need to do the following in main.js:

```javascript
var workerScript = "self.onmessage = function(event) { postMessage(event.data); }";
var blob = new Blob([workerScript], {type: 'application/javascript'});  
var worker = new Worker(URL.createObjectURL(blob));  
worker.onmessage = function(event) {  
  console.log(event.data); //echo-worker
};
worker.postMessage("hello"); // send a message to the worker  
```

As you see, the blob contains te content of worker.js. 

This plugin creates the workerScript variable during a gulp build.

## How to use
Simple! Create a gulp task:

```javascript
var workerStream;
gulp.task("workers", function (cb) {
    workerStream =  gulp.src(pathToWorkerFiles).pipe(srcToVariable({
        variableName: workerDef.variable
    });
    cb();
});
```

Now the "workers" task can be added to your pipe line (with the help of merge2) and merged to a singled file using gulp-concat:

```javascript
gulp.task("build", ["workers"], function () {
    return merge2(
        gulp.src(pathToMainFiles),
        workerStream
        )
        .pipe(concat(newFilename));
});
```

It is also possible to uglify the worker's files using uglify:

```javascript
gulp.task("workers", function () {
    return gulp.src(pathToWorkerFiles).pipe(uglify()).pipe(srcToVariable({
        variableName: workerDef.variable
    }));
});
```

##Where is it being used actually?
https://github.com/BabylonJS/Babylon.js is using it to build a single file for the WebGL engine.
This plugin is used in two different places:

1. Compile the shaders to a single stirng and add it to the main js file
2. Compile webworkers and add them to the main js file.

This way, BabylonJS delivers a single file and no external dependencies.

##License
http://raananw.mit-license.org/
