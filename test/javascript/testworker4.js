importScripts("imported1.js", "imported2.js");

onmessage = function(event) {
    postMessage("var1=" + var1 + " var2=" + var2);
};
