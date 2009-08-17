onmessage = function(event) {
    importScripts("imported1.js", "imported2.js");
    postMessage("var1=" + var1 + " var2=" + var2);
};
