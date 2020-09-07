var plugin = require("../");
var should = require('should');
var fs = require('fs');
var path = require('path');
var File = require('gulp-util').File;
var assert = require('stream-assert');
var gulp = require('gulp');
var mocha = require('mocha');

describe("gulp-contentToVariable", function () {
    
    var testFiles = function (glob) { return path.join(__dirname, "testFiles", glob); }

    var testSingleString = "This is file 1!This is file 2!";
    var testMap = {
        "file1.txt": "This is file 1!",
        "file2.txt": "This is file 2!"
    }

    describe("contentToVariable", function () {

        it('should work even with no files', function (done) {
            var stream = plugin({ variableName: "test" });
            stream
                .pipe(assert.length(0))
                .pipe(assert.end(done));
            stream.write(new File());
            stream.end();
        });

        it('should connect two files to one variable as stirng', function (done) {
            console.log(testFiles("*.txt"))
            gulp.src(testFiles("*.txt"))
                .pipe(assert.length(2))
                .pipe(plugin({ variableName: "test", asMap: false }))
                .pipe(assert.length(1))
                .pipe(assert.first(function (d) {
                    // var testVar = localeval(d.contents.toString());
                    // testVar.should.eql(testSingleString)
                }))
                .pipe(assert.end(done));
        });
        
        it('should connect two files to one variable as map', function (done) {
            console.log(testFiles("*.txt"))
            gulp.src(testFiles("*.txt"))
                .pipe(assert.length(2))
                .pipe(plugin({ variableName: "test", asMap: true }))
                .pipe(assert.length(1))
                .pipe(assert.first(function (d) {
                    // var testVar = localeval(d.contents.toString());
                    //console.log(testVar.should);
                    //testVar.should.eql(testMap)
                }))
                .pipe(assert.end(done));
        });

    })

})
