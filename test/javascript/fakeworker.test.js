$(document).ready(function(){
    runTest();
});
function runTest(){

    module("fakeworker");
    
    
    test("install", function(){
        ok(!!window["fakeworker"], "fakeworker object is defined");
        fakeworker.uninstall();
        var nativeWorker = window["Worker"];
        var nativeWorkerExists = (!!nativeWorker);
        fakeworker.install();
        
        var wk = new Worker("testworker.js");
        ok(wk.isFake, "fakeworker.isFake must be true");
        
        if (nativeWorkerExists) {
            ok(fakeworker.nativeWorker === nativeWorker, "when native worker exists, fakeworker.nativeWorker must refer it");
        }
        else {
            ok(fakeworker.nativeWorker === undefined, "when native worker don't exists, fakeworker.nativeWorker must be undefined");
        }
        
        fakeworker.uninstall();
        if (nativeWorkerExists) {
            ok(window["Worker"] === nativeWorker, "when native worker exists, Worker must refer it after uninstalled");
        }
        else {
            ok(Worker === undefined, "when native worker don't exists, Worker must be undefined after fakeworker is uninstalled");
        }
    });
    test("messaging", function(){
        fakeworker.install();
        var worker = new Worker("testworker.js");
        stop();
        worker.onmessage = function(msg){
            start();
            var result = msg.data;
            equals(result, "Hello, Shiraishi");
        };
        worker.postMessage("Shiraishi");
        fakeworker.uninstall();
    });
    test("workerContext", function(){
        fakeworker.install();
        var workerUrl = "../javascript/testworker2.js";
        var worker = new Worker(workerUrl);
        var absoluteUrl = location.href.replace("fakeworker.test.html", "testworker2.js");
        var pathname = location.pathname.replace("fakeworker.test.html", "testworker2.js");
        stop();
        worker.onmessage = function(msg){
            start();
            var ctx = msg.data;
            ok(ctx.self === ctx, "WorkerContext's self must be same as context itself");
            var workerLocation = ctx.location;
            equals(workerLocation.toString(), absoluteUrl, "string representation of WorkerLocation must be equals to absolute URL");
            equals(workerLocation.href, absoluteUrl, "WorkerLocation.href must be equals to absolute URL");
            equals(workerLocation.protocol, location.protocol, "WorkerLocation.protocol");
            equals(workerLocation.host, location.host, "WorkerLocation's host");
            equals(workerLocation.hostname, location.hostname, "WorkerLocation's hostname");
            equals(workerLocation.port, location.port, "WorkerLocation's port");
            equals(workerLocation.pathname, pathname, "WorkerLocation's pathname");
            equals(workerLocation.search, "", "WorkerLocation's search");
            equals(workerLocation.hash, "", "WorkerLocation's hash");
            
            ok(typeof ctx.importScripts == "function", "WorkerContext's importScripts must be function");
            ok(ctx.navigator, "WorkerContext's navigator must be defined");
            ok(typeof ctx.setTimeout == "function", "WorkerContext's setTimeout must be function");
            ok(typeof ctx.clearTimeout == "function", "WorkerContext's clearTimeout must be function");
            ok(typeof ctx.setInterval == "function", "WorkerContext's setInterval must be function");
            ok(typeof ctx.clearInterval == "function", "WorkerContext's clearInterval must be function");
            ok(typeof ctx.Worker == "function", "WorkerContext's Worker must be function");
            //ok(typeof ctx.SharedWorker == "function", "WorkerContext's SharedWorker must be function");
            ok(true, "WorkerContext's SharedWorker is not yet implemented");
            
            // following tests follow the pattern:
            // 1. if the target API's implementation of browser exists, worker context should have the API.
            // 2. if the target API's implementation of browser doesn't exist, worker context shouldn't have the API.
            
            if (window["openDatabase"]) {
                ok(typeof ctx.openDatabase == "function", "WorkerContext's openDatabase must be function");
            }
            else {
                ok(ctx.openDatabase === undefined, "openDatabase's implementation is not found, so WorkerContext shouldn't have the API");
            }
            if (window["openDatabaseSync"]) {
                ok(typeof ctx.openDatabaseSync == "function", "WorkerContext's openDatabaseSync must be function");
            }
            else {
                ok(ctx.openDatabaseSync === undefined, "openDatabaseSync's implementation is not found, so WorkerContext shouldn't have the API");
            }
            if (window["XMLHttpRequest"]) {
                ok(!!ctx.XMLHttpRequest, "WorkerContext's XMLHttpRequest must be defined");
            }
            else {
                ok(ctx.XMLHttpRequest === undefined, "XMLHttpRequest implementation is not found, so WorkerContext shouldn't have the API");
            }
            if (window["WebSocket"]) {
                ok(typeof ctx.WebSocket == "function", "WorkerContext's WebSocket must be function");
            }
            else {
                ok(ctx.WebSocket === undefined, "WebSocket's implementation is not found, so WorkerContext shouldn't have the API");
            }
            if (window["EventSource"]) {
                ok(typeof ctx.EventSource == "function", "WorkerContext's EventSource must be function");
            }
            else {
                ok(ctx.EventSource === undefined, "EventSource's implementation is not found, so WorkerContext shouldn't have the API");
            }
            if (window["MessageChannel"]) {
                ok(typeof ctx.MessageChannel == "function", "WorkerContext's MessageChannel must be function");
            }
            else {
                ok(ctx.MessageChannel === undefined, "MessageChannel's implementation is not found, so WorkerContext shouldn't have the API");
            }
        };
        worker.postMessage();
        fakeworker.uninstall();
    });
    test("import scripts", function(){
        fakeworker.install();
        stop(300);
        var worker = new Worker("testworker4.js");
        /*
         worker.onmessage = function(event) {
         start();
         equals(event.data, "var1=1 var2=2", "imported scripts must be evaluated in worker's context");
         };
         */
        worker.onerror = function(event) {
            start();
            ok(true, "importScripts() is not supported");
        };
        worker.postMessage("");
        fakeworker.uninstall();
    });
    
    test("error event", function(){
        fakeworker.install();
        stop(100);
        var worker = new Worker("testworker3.js");
        worker.addEventListener("error", function(event){
            start();
            equals(event.type, "error", "ErrorEvent's type must be 'error'");
            // Firefox cannot report location correctly when error is occured in evaled code,
            // so following tests is disabled
            //equals(event.filename, "testworker3.js", "ErrorEvent's filename must be worker's script file name");
            //equals(event.lineno, 2, "ErrorEvent's lineno must be worker's script file name");
            
            ok(!!event.filename, "ErrorEvent's filename must be worker's script file name");
            ok(!!event.lineno, "ErrorEvent's lineno must be worker's script file name");
        }, false);
        worker.postMessage("");
        fakeworker.uninstall();
    });
    test("message event", function(){
        fakeworker.install();
        stop(100);
        var worker = new Worker("testworker.js");
        var f = function(event){
            start();
            equals(event.type, "message", "MessageEvent's type must be 'message'");
            equals(event.data, "Hello, Shiraishi", "MessageEvent's data must be valid");
        };
        worker.addEventListener("message", f, false);
        worker.addEventListener("message", f, true);
        worker.postMessage("Shiraishi");
        fakeworker.uninstall();
    });
    /*
     test("misc", function() {
     eval("var a = 1");
     alert(a);
     with(window) {
     eval("var b = 2");
     }
     alert(window.b);
     var scope = new function(){};
     with(scope) {
     eval("var c = 3");
     }
     alert(scope.c);
     });
     */
}
